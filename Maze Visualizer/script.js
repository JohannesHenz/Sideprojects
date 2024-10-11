const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;
const rows = Math.floor(canvas.height / cellSize); //500 pixels / 20 pixels = 25 rows
const cols = Math.floor(canvas.width / cellSize); //500 pixels / 20 pixels = 25 cols
let maze = [];

function createGrid() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(1));
}

const directions = {
  N: [-1, 0], // North: move up one row aka 0
  E: [0, 1], // East: move right one column aka 1
  S: [1, 0], // South: move down one row aka 2
  W: [0, -1], // West: move left one column aka 3
};

function generateMaze() {
  createGrid();
  let startingPoint = [0, 0];
  let path = [];
  while (path.length < 25) {
    path.push(startingPoint);

    let direction = chooseDirection(); //choose inital direction

    let newPoint = [
      startingPoint[0] + direction[0],
      startingPoint[1] + direction[1],
    ]; //check the new cell

    checkForUsedPathsAndWalls(newPoint, path);

    let goBack = [
      startingPoint[0] + direction[0],
      startingPoint[1] + direction[1],
    ];
  }

  drawMazeVisual();
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
  console.log("directionKeys: ", directionKeys);
  let direction = directions[directionKeys[whichDirection]];
  console.log("direction: ", direction);
  let tempDirections = { ...directions }; // Create a copy of the directions
  return tempDirections;
}

function checkForUsedPathsAndWalls(newPoint, path) {
  if (
    newPoint[0] < 0 ||
    newPoint[0] >= rows ||
    newPoint[1] < 0 ||
    newPoint[1] >= cols
  ) {
    //check for walls
    return false;
  }
  const latestElement = path[path.length - 1];
  // Check if the newPoint has already been visited
  if (newPoint[0] === latestElement[0] && newPoint[1] === latestElement[1]) {
    return false;
  }

  return true;
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "black";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
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
