/* eslint-disable @typescript-eslint/no-unused-vars */
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;
const rows = Math.floor(canvas.height / cellSize); //500 pixels / 20 pixels = 25 rows
const cols = Math.floor(canvas.width / cellSize); //500 pixels / 20 pixels = 25 cols

let maze = [];

// create a grid where every cell keeps track of its surrounding walls
function createGrid() {
  maze = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      visited: false,
      N: true,
      E: true,
      S: true,
      W: true,
    }))
  );
}

const directions = {
  N: [-1, 0], // North: move up one row aka 0
  E: [0, 1], // East: move right one column aka 1
  S: [1, 0], // South: move down one row aka 2
  W: [0, -1], // West: move left one column aka 3
};

// shuffle helper that returns the direction keys in random order
function shuffleDirectionKeys() {
  const keys = Object.keys(directions);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys;
}

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
  const stack = [];
  const start = [0, 0];
  maze[start[0]][start[1]].visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const [y, x] = stack[stack.length - 1];
    const order = shuffleDirectionKeys();
    let moved = false;

    for (const key of order) {
      const dir = directions[key];
      const ny = y + dir[0];
      const nx = x + dir[1];

      if (
        ny >= 0 &&
        ny < rows &&
        nx >= 0 &&
        nx < cols &&
        !maze[ny][nx].visited
      ) {
        removeWall([y, x], [ny, nx], key);
        maze[ny][nx].visited = true;
        stack.push([ny, nx]);
        moved = true;
        break;
      }
    }

    if (!moved) {
      stack.pop();
    }

    drawMaze([y, x]);
    await sleep(20);
  }

  drawMaze(start);
}

function removeWall(current, next, dirKey) {
  const opposites = { N: "S", S: "N", E: "W", W: "E" };
  const [y, x] = current;
  const [ny, nx] = next;
  maze[y][x][dirKey] = false;
  maze[ny][nx][opposites[dirKey]] = false;
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

  if (checkForUsedPathsAndWalls(newPoint)) {
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
  const [ny, nx] = newPoint;
  const [cy, cx] = currentPosition;

  if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) {
    return false;
  }

  if (ny === cy - 1 && nx === cx) return !maze[cy][cx].N;
  if (ny === cy + 1 && nx === cx) return !maze[cy][cx].S;
  if (ny === cy && nx === cx + 1) return !maze[cy][cx].E;
  if (ny === cy && nx === cx - 1) return !maze[cy][cx].W;

  return false;
}

function drawMaze(currentPoint) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = maze[y][x];

      if (y === currentPoint[0] && x === currentPoint[1]) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      if (cell.N) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, y * cellSize);
        ctx.lineTo((x + 1) * cellSize, y * cellSize);
        ctx.stroke();
      }
      if (cell.W) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, y * cellSize);
        ctx.lineTo(x * cellSize, (y + 1) * cellSize);
        ctx.stroke();
      }
      if (cell.S) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, (y + 1) * cellSize);
        ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
        ctx.stroke();
      }
      if (cell.E) {
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

function drawMazeVisual(point) {
  drawMaze(point);
}

function solveMaze() {
  // Placeholder for solving the maze (you could use BFS/DFS)
  // For now, just color a simple straight path for demo purposes
  ctx.fillStyle = "blue";
  for (let i = 0; i < rows; i++) {
    if (!maze[i][0].visited) {
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
