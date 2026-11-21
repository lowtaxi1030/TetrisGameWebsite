export const PIECE_STYLE = [
  "red",
  "orange",
  "yellow",
  "lightGreen",
  "default",
  "blue",
  "purple",
  "teal",
  "coral",
  "indigo",
  "pink",
  "cyan",
  "gold",
];

export function rotatePattern(pattern, turns = 1) {
  let rotated = [...pattern];

  for (let turn = 0; turn < turns % 4; turn++) {
    rotated = rotated.map(([row, col]) => [col, -row]);

    const minRow = Math.min(...rotated.map(([row]) => row));
    const minCol = Math.min(...rotated.map(([, col]) => col));

    rotated = rotated.map(([row, col]) => [row - minRow, col - minCol]);
  }

  return rotated;
}

export class Piece {
  constructor(id, shape, style) {
    this.id = id;
    this.shape = shape;
    this.style = style;
  }

  toDict() {
    return {
      id: this.id,
      shape: this.shape,
      style: this.style,
    };
  }
}
