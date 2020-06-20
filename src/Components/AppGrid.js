import React, { useContext } from 'react';
import { GridContext } from '../Grid.Context';
import produce from 'immer';
import './app-grid.scss';
//
function AppGrid() {
  const { grid, setGrid, gridSize, circleSize } = useContext(GridContext);
  return (
    <div className="grid-container">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, min-content)`,
          gridTemplateRows: `repeat(${gridSize}, min-content)`,
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
                width: `${circleSize}px`,
                height: `${circleSize}px`,
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
