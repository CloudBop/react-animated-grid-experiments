import React, { useState, useRef, useCallback } from 'react';
import { generateEmptyGrid, constants, generateChequer, generateRandomGrid } from './helpers';
import produce from 'immer';
// import './App.css';
//
function App() {
  const { numRows, numCols } = constants;
  // using function init state, only runs once on init.
  const [ grid, setGrid ] = useState(() => generateEmptyGrid(numRows, numCols));
  const [ running, setRunning ] = useState(false);
  // store as ref so callback always refers to current value whilst also not needing to pass deps
  const runningRef = useRef(running);
  runningRef.current = running;
  //
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    // simulate https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
    setGrid(gCurrent => {
      return produce(gCurrent, gCopy => {
        //
        for (let i = 0; i < gCurrent.length; i++) {
          for (let k = 0; k < gCurrent[0].length; k++) {
            gCopy[i][k] = !gCurrent[i][k];
          }
        }
      });
    });
    //  typical situation for the effect hook with cleanup logic.
    // recursive
    setTimeout(runSimulation, 1000);
  }, []);
  //
  return (
    // onclick has to be in lamda or creates infinte loop
    <React.Fragment>
      <div className="App-header">
        <button
          onClick={() => {
            setRunning(!running);
            // race condition
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'stop' : 'start'}
        </button>

        <button
          onClick={() =>
            setGrid(gCurrent => {
              return produce(gCurrent, gCopy => {
                //
                gCopy = generateEmptyGrid(numCols, numRows);
                setGrid(gCopy);
              });
            })}
        >
          Clear
        </button>
        <button
          onClick={() =>
            setGrid(gCurrent => {
              return produce(gCurrent, gCopy => {
                //
                gCopy = generateRandomGrid(numCols, numRows);
                setGrid(gCopy);
              });
            })}
        >
          random
        </button>
        <button
          onClick={() =>
            setGrid(gCurrent => {
              return produce(gCurrent, gCopy => {
                //
                for (let i = 0; i < gCurrent.length; i++) {
                  for (let k = 0; k < gCurrent[0].length; k++) {
                    gCopy[i][k] = !gCurrent[i][k];
                  }
                }
              });
            })}
        >
          increase tick
        </button>
        <button
          onClick={() => {
            const newGrid = produce(grid, gCopy => {
              generateChequer(gCopy);
            });
            setGrid(newGrid);
          }}
        >
          chequer board
        </button>
        <select>
          <option value="random">random</option>
          <option value="chequer">chequer</option>
          <option value="" />
        </select>
        <button onClick={() => console.log(grid)}>log state</button>
      </div>
      <div className="grid-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numCols}, 50px)`
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                onClick={() => {
                  // use immmer to not mutate state
                  const newGrid = produce(grid, gridCopy => {
                    // toggle
                    gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                  });
                  //
                  setGrid(newGrid);
                }}
                key={`${i}-${k}`}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: grid[i][k] ? '#2d2c90' : '#929bd8',
                  border: 'solid 0px #2d2c90',
                  borderRadius: '50%'
                }}
              />
            ))
          )}
        </div>
      </div>
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
