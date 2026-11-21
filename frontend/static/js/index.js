import * as input from "./input/main_input.js";
import * as api from "./api.js";

const startButton = document.getElementById("start-button");
const settingsButton = document.getElementById("settings-button");
const highestScoreList = document.getElementById("score-list");

function setupInput() {
  if (!startButton || !settingsButton) return;

  startButton.addEventListener("click", input.handleStart);
  settingsButton.addEventListener("click", input.handleSettings);
}

setupInput();

async function updateHighestScore() {
  highestScoreList.innerHTML = "";
  const scores = await api.fetchHighestScores();
  for (const item of scores.scores) {
    const scoreElement = document.createElement("p");
    scoreElement.className = "highest-score";
    scoreElement.textContent = `${item.grid_size} × ${item.grid_size}：${item.score} 分`;
    highestScoreList.appendChild(scoreElement);
  }
}

async function main() {
  await updateHighestScore();
}

main();
