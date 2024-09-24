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

const findPath = (pyramid, depth, index, remainingProduct, path, targetProduct, setCurrentNode, setPathCoordinatesSet, setSolutionPath) => {
  // If we've reached the final row and the remaining product is 1, we've found a valid path
  if (depth === pyramid.length) {
    if (remainingProduct === 1) {
      return path;  // Return the valid path
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
      const newPath = path + direction;
      const newIndex = direction === 'L' ? index : index + 1;

      // Recursively search for a valid path
      const result = findPath(pyramid, depth + 1, newIndex, updatedRemainingProduct, newPath, targetProduct, setCurrentNode, setPathCoordinatesSet, setSolutionPath);
      if (result) {
        return result;  // Return the solution path if found
      }
    }
  }

  return null;  // No valid solutions down this path
};


const App = () => {

  const [currentNode, setCurrentNode] = useState({ row: -1, col: -1 });
  const [pathCoordinatesSet, setPathCoordinatesSet] = useState(new Set());
  const [solutionPath, setSolutionPath] = useState('???');
  

  const handleFindPath = () => {
    // Initialize states to starting cell coordinates (i.e., top of the pyramid, depth = 0)
    setCurrentNode({ row: 0, col: 0 });
    setPathCoordinatesSet( new Set([`0,0`]));
    setSolutionPath('???'); // Reset solution path

    // Initialize parameters to start search in the level directly under the starting cell (i.e., depth = 1)
    const depth = 1;
    const index = 0;
    const remainingProduct = targetProduct / initialPyramid[0][0];
    const path = '';

    // Begin DFS search to find solution path
    findPath(initialPyramid, depth, index, remainingProduct, path, targetProduct, setCurrentNode, setPathCoordinatesSet, setSolutionPath);
  };

  return (
    <div className="app">
      <h1>Pyramid Path Finder</h1>
      <Pyramid pyramid={initialPyramid} currentNode={currentNode} pathCoordinatesSet={pathCoordinatesSet} />
      <button onClick={handleFindPath}>Find Path</button>
      <h3>Target Product: {targetProduct} </h3>
      <h2>Descent Path: {solutionPath ? solutionPath : 'No Solution'}</h2>
    </div>
  );
};

export default App;