export const state = {
  // 後端遊戲資料
  grid: [],
  score: 0,
  pieces: [],
  isGameOver: false,

  // 前端操作資料
  selectedPieceId: null,
  isDragging: false,
  mousePos: [0, 0],
};

export function updateBackendState(grid, score, pieces, isGameOver) {
  state.grid = grid;
  state.score = score;
  state.pieces = pieces;
  state.isGameOver = isGameOver;
}
