import React, { useState } from 'react';
import Pyramid from './components/Pyramid/Pyramid';
import './App.css';

const targetProduct = 720;  // Target to reach

const initialPyramid = [
  [2],
  [4, 3],
  [3, 2, 6],
  [2, 9, 5, 2],
  [10, 5, 2, 15, 5]
];

const findPath = (pyramid, depth, index, remainingProduct, pathSoFar, targetProduct) => {
  // If we've reached the final row and the remaining product is 1, we've found a valid path
  if (depth === pyramid.length) {
    if (remainingProduct === 1) {
      return pathSoFar;  // Return the valid path
    }
    return null;  // No valid path
  }

  // Get the current row's available options for movement (left and right)
  const currentRow = pyramid[depth];
  const movementOptions = [
    { value: currentRow[index], direction: 'L' },     // Move left (same index)
    { value: currentRow[index + 1], direction: 'R' }  // Move right (index + 1)
  ];

  // Explore both options (left and right)
  for (const { value, direction } of movementOptions) {
    if (remainingProduct % value === 0) {  // Only continue if the path value divides cleanly
      const updatedRemainingProduct = remainingProduct / value;
      const newPath = pathSoFar + direction;
      const newIndex = direction === 'L' ? index : index + 1;

      // Recursively search for a valid path
      const result = findPath(pyramid, depth + 1, newIndex, updatedRemainingProduct, newPath, targetProduct);
      if (result) {
        return result;  // Return the solution path if found
      }
    }
  }

  return null;  // No valid solutions down this path
};


const App = () => {

  const [directionPath, setDirectionPath] = useState('???');

  const handleFindPath = () => {
    // Initialize parameters to start search
    const depth = 1;
    const index = 0;
    const remainingProduct = targetProduct / initialPyramid[0][0];
    const pathSoFar = '';

    // Find result and update direction path
    const result = findPath(initialPyramid, depth, index, remainingProduct, pathSoFar, targetProduct);
    setDirectionPath(result)
  };

  return (
    <div className="app">
      <h1>Pyramid Path Finder</h1>
      <Pyramid pyramid={initialPyramid} />
      <button onClick={handleFindPath}>Find Path</button>
      <h3>Target Product: {targetProduct} </h3>
      <h2>Descent Path: {directionPath ? directionPath : 'No Solution'}</h2>
    </div>
  );
};

export default App;