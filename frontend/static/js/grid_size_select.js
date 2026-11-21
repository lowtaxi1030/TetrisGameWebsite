import * as config from "./config.js";
import * as colors from "./colors.js";
import * as input from "./input/grid_size_select_input.js";
import * as api from "./api.js";

const gridSizeList = document.getElementById("grid-size-list");

const sizes = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

function makeCard(size, score) {
  const card = document.createElement("div");
  card.className = "grid-size-card";
  card.innerHTML = `
	<h3>${size} × ${size} </h3>
	<canvas></canvas>
	<p>最高分數：${score}</p>
	<button data-grid-size="${size}" class="select-button button2">選擇</button>
	`;
  const canvas = card.querySelector("canvas");
  drawGridPreview(canvas, size);

  const selectButton = card.querySelector("button");
  selectButton.addEventListener("click", input.handleSelectCard);

  return card;
}

function drawGridPreview(canvas, size) {
  // 繪製棋盤
  const ctx = canvas.getContext("2d");
  const canvasHeight = 120;
  const canvasWidth = 120;
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  const rowCellSize = canvasHeight / size;
  const columnCellSize = canvasWidth / size;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      ctx.save();
      ctx.strokeStyle = config.arrayToRGB(colors.white);
      const y = r * rowCellSize;
      const x = c * columnCellSize;
      ctx.strokeRect(x, y, columnCellSize, rowCellSize);
      ctx.restore();
    }
  }
}

async function makeCardList() {
  gridSizeList.innerHTML = "";
  const scores = await api.fetchHighestScores();
  for (const size of sizes) {
    const record = scores.scores.find((item) => item.grid_size === size);
    gridSizeList.appendChild(makeCard(size, record?.score ?? 0));
  }
}

makeCardList();
