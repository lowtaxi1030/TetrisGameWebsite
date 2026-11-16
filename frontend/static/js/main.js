import { fetchGameData as fetchGameData } from "./api.js";
import { draw } from "./renderer.js";
import { state, updateBackendState } from "./gameState.js";
import { handleMouseDown, handleMouseMove, handleMouseUp, handleResetGame } from "./input.js";

const canvas = document.getElementById("game-board");

const resetButton = document.getElementById("reset-button");

function setupInput() {
  canvas.addEventListener("pointerdown", handleMouseDown);

  canvas.addEventListener("pointermove", handleMouseMove);

  canvas.addEventListener("pointerup", handleMouseUp);

  resetButton.addEventListener("click", handleResetGame)
}

setupInput();

async function main() {
  const serverData = await fetchGameData();

  updateBackendState(
    serverData.grid,
    serverData.score,
    serverData.pieces,
    serverData.is_game_over,
    serverData.highest_score,
  );

  draw(state);
}

main();
