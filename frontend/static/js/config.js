import * as colors from "./colors.js"

export const CANVAS_WIDTH = 350;
export const CANVAS_HEIGHT = 500;

export const EMPTY_COLOR = [20, 0, 50];
export const BORDER_COLOR = colors.white;
export const PIECE_BORDER_COLOR = colors.gold;

export function getGridSize(grid) {
  return Math.floor(CANVAS_WIDTH / grid[0].length);
}

export function getPiecesCenterY(grid) {
  const gridSize = getGridSize(grid);
  const boardHeight = grid.length * gridSize;

  // 計算棋盤下方可用空間的中心
  const leftSpace = CANVAS_HEIGHT - boardHeight;
  return boardHeight + leftSpace / 2;
}

export function getPieceSize(piece, gridSize) {
  const pieceWidth =
    (Math.max(...piece.shape.map((pos) => pos[1])) + 1) * gridSize;
  const pieceHeight =
    Math.max(...piece.shape.map((pos) => pos[0] + 1)) * gridSize;
  return [pieceWidth, pieceHeight];
}

export function arrayToRGB(color) {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}
