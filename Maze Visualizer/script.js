/* eslint-disable @typescript-eslint/no-unused-vars */
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 10;
const rows = Math.floor(canvas.height / cellSize); //1010 pixels / 10 pixels = 101 rows
const cols = Math.floor(canvas.width / cellSize); //1010 pixels / 10 pixels = 101 cols
let maze = [];
let visited = [];
let counter = 0;
let failed = 0;

function createGrid() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(0));
}

const directions = [
  { name: "N", delta: [-1, 0] },
  { name: "E", delta: [0, 1] },
  { name: "S", delta: [1, 0] },
  { name: "W", delta: [0, -1] },
]; //Array of objects with each object having two properties

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

  //walkThroughMaze();
  drawMaze();
  console.table(maze);
}

function initMaze() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      //top rim
      if (i % 2 === 0 || j % 2 === 0) {
        maze[i][j] = 1;
      }
      if (
        j === 0 ||
        i === 0 ||
        i === rows - 1 ||
        i === cols - 1 ||
        j === rows - 1 ||
        j === cols - 1
      ) {
        maze[i][j] = 5;
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
  let escapeCounter = 0;

  while (counter < 100 || failed < 200) {
    let whichWay = shuffleDirection();
    let currentPos = visited[counter];

    console.log("Where am I now: ", currentPos);
    console.log("Which Way next: ", whichWay);

    if (IsThisValid(currentPos, whichWay)) {
      maze[currentPos[0]][currentPos[1]] = 3;
      let middlePos = currentPos.map(
        (num, index) => num + whichWay.delta[index]
      );
      maze[middlePos[0]][middlePos[1]] = 3;
      let newPos = currentPos.map(
        (num, index) => num + whichWay.delta[index] * 2
      );
      console.log(
        "New Position on the Y-Axis: ",
        currentPos[0] + whichWay.delta[0]
      );
      console.log(
        "New Position on the X-Axis: ",
        currentPos[1] + whichWay.delta[1]
      );

      visited.push(newPos);
      maze[newPos[0]][newPos[1]] = 2;
      console.log("Current Position: ", newPos);

      console.table("Visited: ", visited);
      counter++;
      drawMaze();
    } else {
      failed++;
      whichWay = shuffleDirection();
      drawMaze();
    }
  }
  console.table(maze);
}

function BackTrack(currentPos, whichWay) {
}

function checkForWall(currentPos, whichWay) {
  console.log("Where am I now: ", currentPos);
  console.log("Which Way Variable: ", whichWay);

  if (
    currentPos[0] + whichWay.delta[0] >= 50 ||
    currentPos[0] + whichWay.delta[0] <= 0 ||
    currentPos[1] + whichWay.delta[1] >= 50 ||
    currentPos[1] + whichWay.delta[1] <= 0
  ) {
    console.warn("This is a Wall!");
    return true; //When the next Step is a wall return true
  } else {
    return false; //When the next Step is not a wall return false
  }
}

function haveIBeenThere(currentPos, whichWay) {
  let firstElement = currentPos[0] + whichWay.delta[0] * 2;
  let secondElement = currentPos[1] + whichWay.delta[1] * 2;
  let nextStep = maze[firstElement][secondElement];
  console.log("Value of Cell in next Step is: ", nextStep);
  if (nextStep === 3 || nextStep === 2) {
    console.warn("This has cell has been visited before!");
    return true; //When the next Step has been visited return true
  } else {
    return false; //When the next Step has not been visited return false
  }
}

function IsThisValid(currentPos, whichWay) {
  let Walls = checkForWall(currentPos, whichWay);
  let BeenThere = haveIBeenThere(currentPos, whichWay);
  console.log("Is this a wall? T/F", Walls);
  console.log("Has this been visited? T/F", BeenThere);
  if (
    !checkForWall(currentPos, whichWay) &&
    !haveIBeenThere(currentPos, whichWay)
  ) {
    console.log("This Move is Valid!");
    return true;
  } else {
    console.log("This Move is Invalid!");
    return false;
  }
}

function shuffleDirection() {
  /*
  let directionCopy = directions.slice();
  while (directionCopy.length > 0) {
    let randomDirection = Math.floor(Math.random() * directionCopy.length);

    const cardinalDirection = directionCopy[randomDirection];
    if (IsThisValid(currentPos, whichWay)) {
      return cardinalDirection;
    } else {
      delete directionCopy[randomDirection];
      console.log(
        "Copy of Directions Array after one is deleted: ",
        directionCopy
      );
    }
  }
  */
  let randDirection = Math.floor(Math.random() * 4);
  const directionsArray = Object.values(directions);
  const cardinalDirection = directionsArray[randDirection];
  return cardinalDirection;

  //TO DO: Fix this method !!!!!!!!!!!!
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
      } else if (cellValue === 5) {
        ctx.fillStyle = "black";
      }

      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}
