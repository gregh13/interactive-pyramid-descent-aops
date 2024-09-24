import React from 'react';
import Cell from '../Cell/Cell.js';

const Pyramid = ({ pyramid, currentCell, pathCoordinateSet }) => {
  return (
    <div className="pyramid">
        
      {pyramid.map((row, rowIndex) => (
        <div key={rowIndex} className="pyramid-row">
          {row.map((value, colIndex) => {
            const status =
              currentCell.row === rowIndex && currentCell.col === colIndex
                ? 'active'
                : pathCoordinateSet.has(`${rowIndex},${colIndex}`)
                ? 'solution'
                : 'default';

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={value}
                status={status}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Pyramid;