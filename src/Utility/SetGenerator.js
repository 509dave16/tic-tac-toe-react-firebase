import Set from './Set';

function generateSets(grid, size) {
  generateVerticalSets(grid, size);
  generateHorizontalSets(grid, size);
  generateDiagonalSets(grid, size);
}

function generateVerticalSets(grid, size) {
  for (let columnIndex = 0; columnIndex < size; columnIndex++) {
    const set = new Set(size);
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const cell = grid[rowIndex][columnIndex];
      cell.addSet(set);
    }
  }
}

function generateHorizontalSets(grid, size) {
  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    const set = new Set(size);
    for (let columnIndex = 0; columnIndex < size; columnIndex++) {
      const cell = grid[rowIndex][columnIndex];
      cell.addSet(set);
    }
  }
}

function generateDiagonalSets(grid, size) {
  generateLeftToRightDiagonalSet(grid, size);
  generateRightToLeftDiagonalSet(grid, size);
}

//Top Left to Bottom Right of grid
function generateLeftToRightDiagonalSet(grid, size) {
  const set = new Set(size);
  for (let rowColIndex = 0; rowColIndex < size; rowColIndex++) {
    const cell = grid[rowColIndex][rowColIndex];
    cell.addSet(set);
  }
}

//Top Right to Bottom Left of grid
function generateRightToLeftDiagonalSet(grid, size) {
  const set = new Set(size);
  for (let rowIndex = 0, columnIndex = size - 1; rowIndex < size; rowIndex++, columnIndex--) {
    const cell = grid[rowIndex][columnIndex];
    cell.addSet(set);
  }
}

export default generateSets