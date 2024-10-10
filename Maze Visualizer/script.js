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
    N: [-1, 0], // North: move up one row
    E: [0, 1],  // East: move right one column
    S: [1, 0],  // South: move down one row
    W: [0, -1]  // West: move left one column
  };

function generateMaze() {
  createGrid();
  let startingPoint = [0, 0];

  let path = [];
  path.push(startingPoint);

  let whichDirection = Math.floor(Math.random() * 4);
  let directionKeys = Object.keys(directions);
  let direction = directions[directionKeys[whichDirection]];
  let tempDirections = { ...directions }; // Create a copy of the directions


  let newPoint = [startingPoint[0] + direction[0], startingPoint[1] + direction[1]];


  if (newPoint[0] < 0 || newPoint[0] >= rows || newPoint[1] < 0 || newPoint[1] >= cols) {
    //check for walls
  {
    delete tempDirections[directionKeys[whichDirection]];

  }

  let newPoint = [startingPoint[0] + direction[0], startingPoint[1] + direction[1]];

  drawMaze();
}
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
