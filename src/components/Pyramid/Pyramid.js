import React from 'react';
import Cell from '../Cell/Cell.js';

const Pyramid = ({ pyramid, currentNode, pathCoordinateSet }) => {
  return (
    <div className="pyramid">
        
      {pyramid.map((row, rowIndex) => (
        <div key={rowIndex} className="pyramid-row">
          {row.map((value, colIndex) => {
            const status =
              currentNode.row === rowIndex && currentNode.col === colIndex
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