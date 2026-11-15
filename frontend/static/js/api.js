import { updateBackendState } from "./gameState.js";

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
}

export async function fetchGameData() {
  return fetchJSON("/api/game");
}

export async function placePiece(pieceId, startPos) {
  let t1 = performance.now();
  const responseDict = await fetchJSON("/api/place", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      piece_id: pieceId,
      start_pos: startPos,
    }),
  });
  // const responseDict = await response.json();
  if (responseDict.success_to_place) {
    updateBackendState(
      responseDict.grid,
      responseDict.score,
      responseDict.pieces,
      responseDict.is_game_over,
      responseDict.highest_score,
    );
  }
  let end_t1 = performance.now();
  console.log(end_t1 - t1);
  return responseDict.success_to_place;
}

export async function reset() {
  return fetchJSON("/api/reset", { method: "POST" });
}
