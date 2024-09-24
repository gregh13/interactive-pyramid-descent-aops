import React from 'react';
import Cell from '../Cell/Cell.js';

const Pyramid = ({ pyramid }) => {
  return (
    <div className="pyramid">
      {pyramid.map((row, rowIndex) => (
        <div key={rowIndex} className="pyramid-row">
          {row.map((value, colIndex) => {
            const status = "TODO"

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