import React, { useContext } from 'react';
import { GridContext } from '../Grid.Context';
import produce from 'immer';
import './app-grid.scss';
import CONSTANTS from '../constants';
//
function AppGrid() {
  const { grid, setGrid } = useContext(GridContext);
  return (
    <div className="grid-container">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${CONSTANTS.numCols}, 50px)`,
          justifyContent: 'center',
          alignItems: 'center'
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
                // margin: '5px'
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AppGrid;
