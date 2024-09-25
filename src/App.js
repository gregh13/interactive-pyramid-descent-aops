import React, { useRef, useState } from 'react';
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

const findPath = async (pyramid, depth, index, remainingProduct, path, targetProduct, waitTimeRef, setCurrentCell, addPathCoordinateSet, removePathCoordinateSet) => {
  // Create current cell object
  const currentCell = { row: depth, col: index };
  
  // Update current cell and add to coordinate set
  setCurrentCell(currentCell);
  addPathCoordinateSet(currentCell);

  // Intentionally slow down search so that new state can reflect and be seen
  await new Promise((resolve) => setTimeout(resolve, waitTimeRef.current));  

  // If we've reached the final row and the remaining product is 1, we've found a valid path
  if (depth >= pyramid.length - 1) {
    if (remainingProduct === 1) {
      setCurrentCell({ row: -1, col: -1 }) // Reset current cell value
      return path;  // Return valid path
    }
    // Remove invalid cell from coordinate set
    removePathCoordinateSet(currentCell);
    return null;  // No valid path
  }

  // Get the current cell's available options for movement (one row down, left and right)
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
      const result = await findPath(pyramid, depth + 1, newIndex, updatedRemainingProduct, newPath, targetProduct, waitTimeRef, setCurrentCell, addPathCoordinateSet, removePathCoordinateSet);
      if (result) {
        return result;  // Return the solution path if found
      }
    } else {
      // Set current cell to indicate it has been checked
      setCurrentCell( {row: depth + 1, col: direction === 'L' ? index : index + 1})
      await new Promise((resolve) => setTimeout(resolve, waitTimeRef.current));  // Slow down for visualization 
    }
    // Set current cell back to this parent cell before moving on
    setCurrentCell( {row: depth, col: index})
    await new Promise((resolve) => setTimeout(resolve, waitTimeRef.current));  // Slow down for visualization
  }

  // Remove invalid cell from coordinate set
  removePathCoordinateSet(currentCell);

  return null;  // No valid solutions down this path
};


const App = () => {

  const [currentCell, setCurrentCell] = useState({ row: -1, col: -1 });
  const [pathCoordinateSet, setPathCoordinateSet] = useState(new Set());
  const [solutionPath, setSolutionPath] = useState('???');
  const [isSearching, setIsSearching] = useState(false); 
  const [waitTime, setWaitTime] = useState(500);
  const waitTimeRef = useRef(waitTime);

  // Keep the speedRef current as the slider is adjusted
  const handleSpeedChange = (e) => {
    // Reverse slider values: Makes higher values on the slider correspond to faster speeds (lower wait times)
    const newWaitTime = 1000 - Number(e.target.value);
    setWaitTime(newWaitTime);
    waitTimeRef.current = newWaitTime;  // Update the ref with the latest value
  };
  
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
    setCurrentCell({ row: -1, col: -1 });
    setPathCoordinateSet( new Set());
    setSolutionPath('???');
    setIsSearching(true); // Disables search button while searching

    // Initialize parameters to start search at the top of the pyramid
    const depth = 0;
    const index = 0;
    const remainingProduct = targetProduct / initialPyramid[0][0];
    const path = '';

    // Begin DFS search to find solution path
    const solution = await findPath(initialPyramid, depth, index, remainingProduct, path, targetProduct, waitTimeRef, setCurrentCell, addPathCoordinateSet, removePathCoordinateSet);

    // Update solution state
    setSolutionPath(solution);

    // Re-enable search button
    setIsSearching(false);
  };

  return (
    <div className="app">
      <h1>Pyramid Descent</h1>
      <h3>Target Product: {targetProduct} </h3>
      <Pyramid pyramid={initialPyramid} currentCell={currentCell} pathCoordinateSet={pathCoordinateSet} solutionPath={solutionPath} />
      <button onClick={handleFindPath} disabled={isSearching}>
        {isSearching ? 'Searching...' : 'Find Path'}
      </button>

      <div className="slider-container">
        <span>Turtle</span>
        <label htmlFor="speedRange"></label>
        <input
          id="speedRange"
          type="range"
          min="100"
          max="900"
          step="100"
          value={1000 - waitTime} // Reverse slider values: Higher values on the slider correspond to faster speeds (lower resulting wait times)
          onChange={handleSpeedChange}  // Update speed
        />
        <span>Rabbit</span>
      </div>

      <h2>Descent Path: {solutionPath ? solutionPath : 'No Solution'}</h2>
    </div>
  );
};

export default App;