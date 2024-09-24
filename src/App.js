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

const findPath = async (pyramid, depth, index, remainingProduct, path, targetProduct, setCurrentNode, addPathCoordinateSet, removePathCoordinateSet) => {
  // Create currentNode
  const currentNode = { row: depth, col: index };
  
  // Update current node and add to coordinate set
  setCurrentNode(currentNode);
  addPathCoordinateSet(currentNode);

  // Intentionally slow down search so that new state can reflect and be seen
  await new Promise((resolve) => setTimeout(resolve, 500));  

  // If we've reached the final row and the remaining product is 1, we've found a valid path
  if (depth >= pyramid.length - 1) {
    if (remainingProduct === 1) {
      setCurrentNode({ row: -1, col: -1 }) // Reset currentNode value
      return path;  // Return valid path
    }
    // Remove invalid node from coordinate set
    removePathCoordinateSet(currentNode);
    return null;  // No valid path
  }

  // Get the current node's available options for movement (one row down, left and right)
  const nextRow = pyramid[depth + 1];
  const movementOptions = [
    { value: nextRow[index], direction: 'L' },     // Move left (same index)
    { value: nextRow[index + 1], direction: 'R' }  // Move right (index + 1)
  ];

  // Explore both options (left and right)
  for (const { value, direction } of movementOptions) {
    if (remainingProduct % value === 0) {  // Only continue if the path value divides cleanly
      const updatedRemainingProduct = remainingProduct / value;
      const newPath = path + direction;
      const newIndex = direction === 'L' ? index : index + 1;

      // Recursively search for a valid path
      const result = await findPath(pyramid, depth + 1, newIndex, updatedRemainingProduct, newPath, targetProduct, setCurrentNode, addPathCoordinateSet, removePathCoordinateSet);
      if (result) {
        return result;  // Return the solution path if found
      }
    } else {
      // Set current node to invalid next node to show it has been looked at
      setCurrentNode( {row: depth + 1, col: direction === 'L' ? index : index + 1})
      await new Promise((resolve) => setTimeout(resolve, 500));  // Slow down for visualization 
    }
    // Set current node back to this parent node before moving on
    setCurrentNode( {row: depth, col: index})
    await new Promise((resolve) => setTimeout(resolve, 500));  // Slow down for visualization
  }

  // Remove invalid node from coordinate set
  removePathCoordinateSet(currentNode);

  return null;  // No valid solutions down this path
};


const App = () => {

  const [currentNode, setCurrentNode] = useState({ row: -1, col: -1 });
  const [pathCoordinateSet, setPathCoordinateSet] = useState(new Set());
  const [solutionPath, setSolutionPath] = useState('???');
  
  // Helper function to add a cell to coordinate set
  const addPathCoordinateSet = ({ row, col }) => {
    setPathCoordinateSet(prevSet => new Set(prevSet).add(`${row},${col}`));
  };

  // Helper function to remove a cell from coordinate set
  const removePathCoordinateSet = ({ row, col }) => {
    setPathCoordinateSet(prevSet => {
      const newSet = new Set(prevSet);
      newSet.delete(`${row},${col}`);
      return newSet;
    });
  };

  const handleFindPath = async () => {
    // Reset state values
    setCurrentNode({ row: -1, col: -1 });
    setPathCoordinateSet( new Set());
    setSolutionPath('???');

    // Initialize parameters to start search at the top of the pyramid
    const depth = 0;
    const index = 0;
    const remainingProduct = targetProduct / initialPyramid[0][0];
    const path = '';

    // Begin DFS search to find solution path
    const solution = await findPath(initialPyramid, depth, index, remainingProduct, path, targetProduct, setCurrentNode, addPathCoordinateSet, removePathCoordinateSet);

    // Update solution state
    setSolutionPath(solution);
  };

  return (
    <div className="app">
      <h1>Pyramid Path Finder</h1>
      <Pyramid pyramid={initialPyramid} currentNode={currentNode} pathCoordinateSet={pathCoordinateSet} />
      <button onClick={handleFindPath}>Find Path</button>
      <h3>Target Product: {targetProduct} </h3>
      <h2>Descent Path: {solutionPath ? solutionPath : 'No Solution'}</h2>
    </div>
  );
};

export default App;