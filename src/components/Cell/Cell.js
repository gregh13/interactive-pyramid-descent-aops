import React from 'react';
import './Cell.css';

const Cell = ({ value, status, finished }) => {
  return (
    <div className={`cell ${status}${finished}`}>
      {value}
    </div>
  );
};

export default Cell;