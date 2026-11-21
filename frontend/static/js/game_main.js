import { fetchHighestScores } from "./api.js";
import { state } from "./gameState.js";
import { draw } from "./renderer.js";
import * as input from "./input/game_input.js";
import { Game } from "./game/game.js";

const canvas = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");
const savedGridSize = Number(localStorage.getItem("grid_size"));
const gridSize =
  Number.isInteger(savedGridSize) && savedGridSize > 0 ? savedGridSize : 15;

function setupInputs() {
  //電腦
  canvas.addEventListener("pointerdown", input.handleMouseDown);
  canvas.addEventListener("pointermove", input.handleMouseMove);
  canvas.addEventListener("pointerup", input.handleMouseUp);
  canvas.addEventListener("pointercancel", input.handleMouseUp);
  //手機
  canvas.addEventListener("touchstart", input.handleMouseDown);
  canvas.addEventListener("touchmove", input.handleMouseMove);
  canvas.addEventListener("touchend", input.handleMouseUp);
  canvas.addEventListener("touchcancel", input.handleMouseUp);
  resetButton.addEventListener("click", input.handleResetGame);
}

function init() {
  state.game = new Game(gridSize, gridSize);
  setupInputs();
}

init();

draw();

try {
  const result = await fetchHighestScores();
  const record = result.scores.find((item) => item.grid_size === gridSize);
  state.highestScore = Math.max(state.highestScore, record?.score ?? 0);
} catch (error) {
  console.error("取得最高分失敗：", error);
  alert("取得最高分失敗，請稍後再試！");
}
