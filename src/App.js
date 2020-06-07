import React from 'react';
import AppWrapper from './Components/AppWrapper';

function App() {
  // top level component, should only render once
  return (
    // onclick has to be in lamda or creates infinte loop
    <React.Fragment>
      <AppWrapper />
    </React.Fragment>
  );
}

/* world where the edges consider the other side neighbours 
      (otherwise the edges never change) then you can do it really neatly using modulus like this:
      const countNeighbors = (grid: any, x: number, y: number) => {
        return operations.reduce((acc, [i, j]) => {
          const row = (x + i + numRows) % numRows;
          const col = (y + j + numCols) % numCols;
          acc += grid[row][col];
          return acc;
        }, 0);
      };
      */

export default App;
