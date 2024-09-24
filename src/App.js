import React, { useState } from 'react';
import Pyramid from './components/Pyramid';
import './App.css';


const targetProduct = 720;  // Target to reach

const initialPyramid = [
  [2],
  [4, 3],
  [3, 2, 6],
  [2, 9, 5, 2],
  [10, 5, 2, 15, 5]
];

const dfs = () => {}

const App = () => {

  const handleFindPath = () => {
    dfs();
  };

  return (
    <div className="app">
      <h1>Pyramid Path Finder</h1>
      <Pyramid pyramid={initialPyramid} />
      <button onClick={handleFindPath}>Find Path</button>
      <h2>Target Product: {targetProduct} </h2>
    </div>
  );
};

export default App;