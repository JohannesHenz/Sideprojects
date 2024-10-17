/* eslint-disable @typescript-eslint/no-unused-vars */
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 10;
const rows = Math.floor(canvas.height / cellSize); //1010 pixels / 10 pixels = 101 rows
const cols = Math.floor(canvas.width / cellSize); //1010 pixels / 10 pixels = 101 cols
let maze = [];
let visited = [];
let counter = 0;

function createGrid() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(0));
}

const directions = {
  N: [-2, 0], // North: move up one row aka 0
  E: [0, 2], // East: move right one column aka 1
  S: [2, 0], // South: move down one row aka 2
  W: [0, -2], // West: move left one column aka 3
};

function generateMaze() {
  /*
    1. Choose Random Starting Position ✅
    2. Generate Random Direction (RD) ✅
	3. Check if RD is a Wall -> if yes remove RD from pool of directions and repeat step 2
	4. Check if RD is in the Visited Cells List -> if yes remove RD from pool of directions and repeat step 2
	5. If There is no Valid Cell to move to, go to the previously visited cell and start from step 2 again
	6. Move to new Cell
	7. Repeat

	Things I need for this:
	-Array of visited Cells
	-Last Visited Cell
  */
  createGrid();
  initMaze();
  chooseStartingPosition();
  //console.log("Starting Point on the Edge: ", startingPoint);

  walkThroughMaze();
  drawMaze();
}

function initMaze() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      //top rim
      if (i === 0 || i === rows || i === cols) {
        maze[i][j] = 0;
      }
      if (i % 2 === 0 || j % 2 === 0) {
        maze[i][j] = 1;
      }
    }
  }
}

function chooseStartingPosition() {
  let whichEdge = Math.floor(Math.random() * 4 + 1);
  console.log("Which Edge for Starting: ", whichEdge);
  let randStart = Math.floor(Math.random() * 50 + 1);
  if (randStart === 50) {
    randStart--;
  } else if (randStart % 2 === 0) {
    randStart++;
  }

  console.log("Where on the Edge: ", randStart);

  switch (whichEdge) {
    case 1:
      maze[1][randStart] = 2; //north wall
      visited.push([1, randStart]);
      break;
    case 2:
      maze[randStart][rows - 2] = 2; // east wall
      visited.push([randStart, rows - 2]);
      break;
    case 3:
      maze[cols - 2][randStart] = 2; //south wall
      visited.push([cols - 2, randStart]);
      break;
    case 4:
      maze[randStart][1] = 2; //west wall
      visited.push([randStart, 1]);
      break;

    default:
      maze[0][0] = 2;
      break;
  }
}

function walkThroughMaze() {
  //while (visited.length !== 625) {
  const whichWay = shuffleDirection();
  let currentPos = visited[counter];
  maze[currentPos[0]][currentPos[1]] = 3;
  let newPos = currentPos.map((num, index) => num + whichWay[index]);
  visited.push(newPos);
  maze[newPos[0]][newPos[1]] = 2;

  console.log("Current Position: ", newPos);

  console.log("Visited: ", visited[counter]);
  counter++;
  drawMaze();
  return newPos;
}

function shuffleDirection() {
  let randDirection = Math.floor(Math.random() * 4);
  const directionsArray = Object.values(directions);
  const cardinalDirection = directionsArray[randDirection];
  console.log("Choosen Direction: ", cardinalDirection);
  return cardinalDirection;
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      var cellValue = maze[i][j];
      if (cellValue === 1) {
        ctx.fillStyle = "black";
      } else if (cellValue === 0) {
        ctx.fillStyle = "white";
      } else if (cellValue === 2) {
        ctx.fillStyle = "red";
      } else if (cellValue === 3) {
        ctx.fillStyle = "grey";
      }

      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}
