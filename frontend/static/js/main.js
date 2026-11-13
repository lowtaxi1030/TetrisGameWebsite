import { fetchGameData as fetchGameData } from "./api.js";
import { draw } from "./renderer.js";
import { state, updateBackendState } from "./gameState.js";
import { handleMouseDown, handleMouseMove, handleMouseUp } from "./input.js";

const canvas = document.getElementById("game-board");

function setupInput() {
  canvas.addEventListener("mousedown", handleMouseDown);

  canvas.addEventListener("mousemove", handleMouseMove);

  canvas.addEventListener("mouseup", handleMouseUp);
}

setupInput();

async function main() {
  const serverData = await fetchGameData();

  updateBackendState(
    serverData.grid,
    serverData.score,
    serverData.pieces,
    serverData.is_game_over,
  );

  draw(state);
}

main();
