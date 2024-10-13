/* eslint-disable @typescript-eslint/no-unused-vars */
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;
const rows = Math.floor(canvas.height / cellSize); //500 pixels / 20 pixels = 25 rows
const cols = Math.floor(canvas.width / cellSize); //500 pixels / 20 pixels = 25 cols
let maze = [];

function createGrid() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(0));
}

const directions = {
  N: [-1, 0], // North: move up one row aka 0
  E: [0, 1], // East: move right one column aka 1
  S: [1, 0], // South: move down one row aka 2
  W: [0, -1], // West: move left one column aka 3
};

/*
async function generateMaze() {
  createGrid();
  let startingPoint = [0, 0];
  let path = [];
  while (path.length < 625) {
    path.push(startingPoint);
    console.log("current path length: ", path.length);
    let direction = chooseDirection(); //choose inital direction

    console.log("line 29, direction: ", direction);

    maze[startingPoint[0]][startingPoint[1]] = 1;

    let newPoint = [
      startingPoint[0] + direction[0],
      startingPoint[1] + direction[1],
    ]; //check the new cell

    if (
      newPoint[0] >= 0 &&
      newPoint[0] < rows &&
      newPoint[1] >= 0 &&
      newPoint[1] < cols &&
      maze[newPoint[0]][newPoint[1]] === 0
    ) {
      maze[newPoint[0]][newPoint[1]] = 1;
      path.push(newPoint);
      startingPoint = newPoint; // Update the starting point
    }

    drawMaze(startingPoint);

    // Introduce a delay to visualize the updates
    await sleep(100); // Adjust the delay time (in milliseconds) as needed
  }

  //drawMazeVisual();
}
  */

//DFS with Backtracking
async function generateMaze() {
  createGrid();
  let stack = [];
  let startingPoint = [0, 0];
  maze[startingPoint[0]][startingPoint[1]] = 1; // Mark the starting point as visited
  stack.push(startingPoint);

  while (stack.length > 0) {
    let currentPoint = stack[stack.length - 1];
    let directions = shuffleDirections(); // Shuffle directions to ensure randomness
    let moved = false;

    for (let direction of directions) {
      let newPoint = [
        currentPoint[0] + direction[0],
        currentPoint[1] + direction[1],
      ];

      if (
        newPoint[0] >= 0 &&
        newPoint[0] < rows &&
        newPoint[1] >= 0 &&
        newPoint[1] < cols &&
        maze[newPoint[0]][newPoint[1]] === 0
      ) {
        // Move to the new point
        maze[newPoint[0]][newPoint[1]] = 1;
        stack.push(newPoint);
        moved = true;
        break;
      }
    }

    if (!moved) {
      // If no valid moves, backtrack
      stack.pop();
    }

    drawMaze(currentPoint); // Pass the current point to drawMaze
    await sleep(100); // Adjust the delay time as needed
  }
}

function shuffleDirections() {
  const directionsArray = Object.values(directions);
  for (let i = directionsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [directionsArray[i], directionsArray[j]] = [
      directionsArray[j],
      directionsArray[i],
    ];
  }
  return directionsArray;
}

function movePlayer(direction) {
  let newPoint = [
    currentPosition[0] + direction[0],
    currentPosition[1] + direction[1],
  ];

  if (checkForUsedPathsAndWalls(newPoint, path)) {
    currentPosition = newPoint;
    path.push(currentPosition);
    drawMazeVisual(currentPosition);
  }
}

function chooseDirection() {
  let whichDirection = Math.floor(Math.random() * 4); //0 = N, 1 = E, 2 = S, 3 = W
  console.log("whichDirection: ", whichDirection);
  let directionKeys = Object.keys(directions);
  let direction = directions[directionKeys[whichDirection]];
  console.log("direction: ", direction);
  return direction;
}

function checkForUsedPathsAndWalls(newPoint) {
  if (
    newPoint[0] < 0 ||
    newPoint[0] >= rows ||
    newPoint[1] < 0 ||
    newPoint[1] >= cols
  ) {
    //check for walls
    return false;
  }

  return true;
}

function checkForUsedPaths(newPoint, path) {
  const latestElement = path[path.length - 1];
  // Check if the newPoint has already been visited
  if (newPoint[0] === latestElement[0] && newPoint[1] === latestElement[1]) {
    return false;
  }
  return true;
}

function drawMaze(currentPoint) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Draw the current cell in red
      if (y === currentPoint[0] && x === currentPoint[1]) {
        ctx.fillStyle = "red";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else {
        ctx.fillStyle = "white"; // Default path color
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      // Draw walls as black lines
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2; // Adjust line width for visibility

      // Top wall
      if (y === 0 || maze[y - 1][x] === 0) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, y * cellSize);
        ctx.lineTo((x + 1) * cellSize, y * cellSize);
        ctx.stroke();
      }
      // Left wall
      if (x === 0 || maze[y][x - 1] === 0) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, y * cellSize);
        ctx.lineTo(x * cellSize, (y + 1) * cellSize);
        ctx.stroke();
      }
      // Bottom wall
      if (y === rows - 1 || maze[y + 1][x] === 0) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, (y + 1) * cellSize);
        ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
        ctx.stroke();
      }
      // Right wall
      if (x === cols - 1 || maze[y][x + 1] === 0) {
        ctx.beginPath();
        ctx.moveTo((x + 1) * cellSize, y * cellSize);
        ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
        ctx.stroke();
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function drawMazeVisual() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (y === currentPosition[0] && x === currentPosition[1]) {
        ctx.fillStyle = "yellow"; // Highlight the current cell
      } else {
        ctx.fillStyle = "white"; // Default cell color
      }
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.strokeStyle = "black"; // Border color
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function solveMaze() {
  // Placeholder for solving the maze (you could use BFS/DFS)
  // For now, just color a simple straight path for demo purposes
  ctx.fillStyle = "blue";
  for (let i = 0; i < rows; i++) {
    if (maze[i][0] === 0) {
      ctx.fillRect(0, i * cellSize, cellSize, cellSize);
    }
  }
}

let currentPosition = [0, 0];
let path = [currentPosition];

// Function to set up event listeners
function setupEventListeners() {
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        movePlayer(directions.N);
        break;
      case "ArrowRight":
        movePlayer(directions.E);
        break;
      case "ArrowDown":
        movePlayer(directions.S);
        break;
      case "ArrowLeft":
        movePlayer(directions.W);
        break;
    }
  });
}

// Call the setup function after the DOM is fully loaded
window.onload = function () {
  setupEventListeners();
  drawMaze(currentPosition); // Initial draw of the maze
};
