export const state = {
  // 後端遊戲資料
  gameId: "",
  grid: [],
  score: 0,
  pieces: [],
  isGameOver: false,
  highestScore: 0,

  // 前端操作資料
  pendingPlacement: null,
  selectedPieceId: null,
  isDragging: false,
  mousePos: [0, 0],
};

export function updateBackendState(
  grid,
  score,
  pieces,
  isGameOver,
  highestScore,
) {
  state.grid = grid;
  state.score = score;
  state.pieces = pieces;
  state.isGameOver = isGameOver;
  state.highestScore = highestScore;
}
