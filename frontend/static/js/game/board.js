export class Board {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.reset();
  }

  checkBounds(row, col, throwOnError = true) {
    const inBounds = row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    if (!inBounds && throwOnError) {
      throw new RangeError("Cell position out of range");
    }
    return inBounds;
  }

  getCell(row, col) {
    this.checkBounds(row, col);
    return this.grid[row][col];
  }

  setCell(row, col, value) {
    this.checkBounds(row, col);
    this.grid[row][col] = value;
  }

  canPlace([startRow, startCol], shape) {
    return shape.every(([row, col]) => {
      const targetRow = startRow + row;
      const targetCol = startCol + col;
      return (
        this.checkBounds(targetRow, targetCol, false) &&
        this.grid[targetRow][targetCol] === null
      );
    });
  }

  place(startPos, shape, style) {
    if (!this.canPlace(startPos, shape)) {
      throw new Error("Cannot place shape at the specified position");
    }

    for (const [row, col] of shape) {
      this.setCell(startPos[0] + row, startPos[1] + col, style);
    }
  }

  clearFullLines() {
    const fullRows = new Set(
      this.grid.flatMap((row, index) =>
        row.every((cell) => cell !== null) ? [index] : [],
      ),
    );
    const fullCols = new Set(
      Array.from({ length: this.cols }, (_, col) => col).filter((col) =>
        this.grid.every((row) => row[col] !== null),
      ),
    );

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (fullRows.has(row) || fullCols.has(col)) {
          this.setCell(row, col, null);
        }
      }
    }

    return [fullRows.size, fullCols.size];
  }

  isFull() {
    return this.grid.every((row) => row.every((cell) => cell !== null));
  }

  reset() {
    this.grid = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null),
    );
  }
}