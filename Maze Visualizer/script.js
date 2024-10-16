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

function generateMaze() {
  /*
    1. Choose Random Starting Position
    2. Generate Random Direction (RD)
	3. Check if RD is a Wall -> if yes remove RD from pool of directions and repeat step 2
	4. Check if RD is in the Visited Cells List -> if yes remove RD from pool of directions and repeat step 2
	5. If There is no Valid Cell to move to, go to the previously visited cell and start from step 2 again
	6. Move to new Cell
	7. Repeat

	Things I need for this:
	-Array of visited Cells
	-Last Visited Cell
  */
}
