import { updateBackendState } from "./gameState.js";

export async function fetchGameData() {
  const response = await fetch("/api/game");
  return await response.json();
}

export async function placePiece(pieceId, startPos) {
  const response = await fetch("/api/place", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      piece_id: pieceId,
      start_pos: startPos,
    }),
  });
  const responseDict = await response.json();
  if (responseDict.success_to_place) {
    updateBackendState(
      responseDict.grid,
      responseDict.score,
      responseDict.pieces,
      responseDict.is_game_over,
    );
  }
}
