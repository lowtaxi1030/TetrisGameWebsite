import { draw, piecePositions } from "../renderer.js";
import { state } from "../gameState.js";
import * as api from "../api.js";
import { getPlacementPosition } from "../placement.js";

const canvas = document.getElementById("game-board");
export function handleMouseDown(event) {
  if (state.game.isGameOver) return;

  for (const piece of piecePositions) {
    if (
      piece.position[1] < event.offsetX &&
      event.offsetX < piece.position[1] + piece.width &&
      piece.position[0] < event.offsetY &&
      event.offsetY < piece.position[0] + piece.height
    ) {
      state.selectedPieceId = piece.id;
      state.mousePos = [event.offsetX, event.offsetY];
      state.isDragging = true;

      canvas.setPointerCapture(event.pointerId);
      break;
    }
  }
}

export function handleMouseMove(event) {
  if (state.game.isGameOver || !state.isDragging) return;
  state.mousePos = [event.offsetX, event.offsetY];
}

export async function handleMouseUp() {
  if (state.game.isGameOver || !state.isDragging) return;

  await handlePlacePiece();
  state.isDragging = false;
  state.selectedPieceId = null;

  draw();
}

async function handlePlacePiece() {
  const pieceId = state.selectedPieceId;
  const [row, col] = getPlacementPosition();
  state.pendingPlacement = { pieceId, startPos: [row, col] };

  try {
    const placed = state.game.placePiece(pieceId, [row, col]);

    if (placed && state.game.score > state.highestScore) {
      submitHighestScore();
    }
  } finally {
    state.pendingPlacement = null;
  }
}

async function submitHighestScore() {
  try {
    const result = await api.updateHighestScore(
      state.game.board.rows,
      state.game.score,
    );
    state.highestScore = Math.max(state.highestScore, result.highest_score);
  } catch (error) {
    console.error("更新最高分失敗：", error);
    alert("更新最高分失敗，請稍後再試！");
  }
}

export function handleResetGame() {
  state.game.reset();
  state.pendingPlacement = null;
  state.selectedPieceId = null;
  state.isDragging = false;

  draw();
}
