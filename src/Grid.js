import React from 'react';
import produce from 'immer';
import { constants } from './helpers';
function Grid({ grid }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${constants.numCols}, 50px)`
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
              // setGrid(newGrid);
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
  );
}

export default Grid;
