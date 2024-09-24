import React from 'react';
import './Cell.css';

const Cell = ({ value, status }) => {
  return (
    <div className={`cell ${status}`}>
      {value}
    </div>
  );
};

export default Cell;