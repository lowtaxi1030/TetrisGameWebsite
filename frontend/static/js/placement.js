import { state } from "./gameState.js";
import * as config from "./config.js";

export function isValidPlacement(grid, piece, startPos) {
  for (let i = 0; i < piece.shape.length; i++) {
    let cell = piece.shape[i];
    const row = startPos[0] + cell[0];
    const column = startPos[1] + cell[1];
    if (row < 0 || row >= grid.length) {
      return false;
    } else if (column < 0 || column >= grid[0].length) {
      return false;
    } else if (grid[row][column] !== null) {
      return false;
    }
  }
  return true;
}

export function getPlacementPosition() {
  const pieceData = state.pieces.find((p) => p.id === state.selectedPieceId);
  const [pieceWidth, pieceHeight] = config.getPieceSize(
    pieceData,
    config.getGridSize(state.grid),
  );
  const gridSize = config.getGridSize(state.grid);
  const row = Math.round(
    (state.mousePos[1] - pieceHeight / 2) / gridSize,
  );
  const column = Math.round(
    (state.mousePos[0] - pieceWidth / 2) / gridSize,
  );

  return [row, column];
}
