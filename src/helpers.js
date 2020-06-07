import CONSTANTS from './constants';
import produce from 'immer';

//
// for find neighbout vals
export const operations = [ [ 0, 1 ], [ 0, -1 ], [ 1, -1 ], [ -1, 1 ], [ 1, 1 ], [ -1, -1 ], [ 1, 0 ], [ -1, 0 ] ];
// loop though operations, compare against all neighbours
// operations.forEach(([ x, y ]) => {
//   const newI = i + x;
//   const newK = k + y;
//   // check grid boundries
//   if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
//     neighbours += gCurrent[newI][newK];
//   }
// });
//
export const generateEmptyGrid = (numRows = CONSTANTS.numRows, numCols = CONSTANTS.numCols) => {
  //
  const rows = [];
  //
  for (let i = 0; i < numRows; i++) {
    //
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
  //
  // React.useState(Array.from({length: ROWS}).map(() => Array.from({length: COLUMNS}).fill(0)))
  // Array(numCols).fill(0) would also work
};
//
export const generateRandomGrid = (numRows = CONSTANTS.numRows, numCols = CONSTANTS.numCols) => {
  const rows = [];
  const prob = 0.5;
  for (let i = 0; i < numRows; i++) {
    //
    rows.push(Array.from(Array(numCols), () => (Math.random() > prob ? 1 : 0)));
  }
  return rows;
};
//
export const generateChequer = () => {
  const grid = generateEmptyGrid();
  // mat[(i, j)] = (j  % 2 + i) % 2;
  for (let i = 0; i < grid.length; i++) {
    for (let k = 0; k < grid[0].length; k++) {
      grid[i][k] = (k % 2 + i) % 2;
    }
  }
  return grid;
};
//
export const invertCurrentGrid = gCurrent => {
  return produce(gCurrent, gCopy => {
    //
    for (let i = 0; i < gCurrent.length; i++) {
      for (let k = 0; k < gCurrent[0].length; k++) {
        gCopy[i][k] = !gCurrent[i][k];
      }
    }
  });
};

export const gameOfLifeRules = gCurrent => {
  return produce(gCurrent, gCopy => {
    //
    const numRows = gCopy.length;
    const numCols = gCopy[0].length;
    //
    for (let i = 0; i < numRows; i++) {
      for (let k = 0; k < numCols; k++) {
        let neighbours = 0;
        //
        operations.forEach(([ x, y ]) => {
          const newI = i + x;
          const newK = k + y;
          // check grid boundries
          if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
            neighbours += gCurrent[newI][newK];
          }
        });
        // life logic
        if (neighbours < 2 || neighbours > 3) {
          // kill. rules 1 & 3
          gCopy[i][k] = 0;
        } else if (gCurrent[i][k] === 0 && neighbours === 3) {
          // rule 4
          gCopy[i][k] = 1;
          // notice- rule2 does nothing
        }
      }
    }
  });
};

export const gameOfLifeWrapAroundRules = gCurrent => {
  return produce(gCurrent, gCopy => {
    //
    // world where the edges consider the other side neighbours
    // (otherwise the edges never change) then you can do it really neatly using modulus like this:
    // return produce(gCurrent, gCopy => {
    //   //
    const numRows = gCopy.length;
    const numCols = gCopy[0].length;

    for (let i = 0; i < numRows; i++) {
      for (let k = 0; k < numCols; k++) {
        //
        //
        const countNeighbors = (gCopy, x, y) => {
          return operations.reduce((acc, [ i, j ]) => {
            const row = (x + i + numRows) % numRows;
            const col = (y + j + numCols) % numCols;
            acc += gCopy[row][col];
            return acc;
          }, 0);
        };
        //
        let neighbours = countNeighbors(gCopy, i, k);
        //
        // life logic
        if (neighbours < 2 || neighbours > 3) {
          // kill. rules 1 & 3
          gCopy[i][k] = 0;
        } else if (gCopy[i][k] === 0 && neighbours === 3) {
          // rule 4
          gCopy[i][k] = 1;
          // notice- rule2 does nothing
        }
      }
    }
    return gCopy;
  });
};
