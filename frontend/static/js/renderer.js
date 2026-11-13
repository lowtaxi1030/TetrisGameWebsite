import * as config from "./config.js";
import { state } from "./gameState.js";
import { isValidPlacement } from "./placement.js";
import { getPlacementPosition } from "./placement.js";

const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// px
canvas.width = config.CANVAS_WIDTH;
canvas.height = config.CANVAS_HEIGHT;

function convertPos(pos, origin) {
  return [pos[0] - origin[0], pos[1] - origin[1]];
}

function convertPoses(poses, origin) {
  let newPoses = [];
  for (let i = 0; i < poses.length; i++) {
    newPoses.push(convertPos(poses[i], origin));
  }
  return newPoses;
}

function rotateRect(x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}

function rotateShape(startPos, poses, angle) {
  ctx.save();
  ctx.translate(startPos[0], startPos[1]);
  ctx.rotate(angle);
  drawShape([0, 0], convertPoses(poses, startPos));
  // ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawShape(startPos, poses) {
  ctx.beginPath();
  ctx.moveTo(startPos[0], startPos[1]);
  for (let i = 0; i < poses.length; i++) {
    let thisPos = poses[i];
    ctx.lineTo(thisPos[0], thisPos[1]);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

export function draw(gameState) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBoard(gameState.grid, config.getGridSize(state.grid));
  drawPlacementHint();
  drawPieces(gameState.pieces);
  drawPreview(gameState.pieces);

  requestAnimationFrame(() => draw(gameState));
}

requestAnimationFrame(draw);

/**
 * 繪製整個遊戲棋盤。
 *
 * @param {(Array<number[] | null>)[]} grid - 棋盤的二維陣列
 * @param {number} gridSize - 單一格子的大小，單位 px
 */
function drawBoard(grid, gridSize) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      let y = r * gridSize;
      let x = c * gridSize;
      let color = grid[r][c] ?? config.EMPTY_COLOR;
      let borderColor =
        grid[r][c] === null ? config.BORDER_COLOR : config.PIECE_BORDER_COLOR;
      drawCell([y, x], gridSize, color, borderColor);
    }
  }
}

/**
 * 繪製單一格子。
 *
 * @param {number[]} startPos - [y, x]，網頁座標，單位 px
 * @param {number} gridSize - 格子的寬度與高度，單位 px
 * @param {number[]} gridColor - [R, G, B]，每個值為 0～255
 */
function drawCell(
  startPos,
  gridSize,
  gridColor,
  borderColor = null,
  alpha = 1.0,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = config.arrayToRGB(gridColor);
  ctx.fillRect(startPos[1], startPos[0], gridSize, gridSize);
  ctx.restore();

  if (borderColor !== null) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = config.arrayToRGB(borderColor);
    ctx.strokeRect(startPos[1], startPos[0], gridSize, gridSize);
    ctx.restore();
  }
}

function drawPlacementHint() {
  let placementHint = null;
  if (!state.isDragging) {
    return;
  }

  const pieceData = state.pieces.find((p) => p.id === state.selectedPieceId);
  const [y, x] = getPlacementPosition();
  placementHint = {
    position: [y, x],
    isValid: isValidPlacement(state.grid, pieceData, [y, x]),
  };

  const hintColor = placementHint.isValid ? [0, 255, 0] : [255, 0, 0];
  const gridSize = config.getGridSize(state.grid);
  drawPiece(pieceData, [y * gridSize, x * gridSize], gridSize, 0.4, hintColor);
}

export let piecePositions = [];

function drawPieces(pieces) {
  piecePositions = [];
  let pieceSize = config.getGridSize(state.grid) * 0.8;
  const areaWidth = canvas.width / pieces.length;
  for (let i = 0; i < pieces.length; i++) {
    let isBeingDrag =
      state.isDragging && pieces[i].id === state.selectedPieceId;
    const [pieceWidth, pieceHeight] = config.getPieceSize(pieces[i], pieceSize);
    let y = config.getPiecesCenterY(state.grid) - pieceHeight / 2;
    let x = i * areaWidth + (areaWidth - pieceWidth) / 2;
    let startPos = [y, x];
    piecePositions.push({
      id: pieces[i].id,
      position: startPos,
      width: pieceWidth,
      height: pieceHeight,
    });
    drawPiece(pieces[i], startPos, pieceSize, isBeingDrag ? 0.4 : 1.0);
  }
}

function drawPiece(
  piece,
  startPos,
  gridSize,
  alpha = 1.0,
  gridColor = null,
  borderColor = null,
) {
  for (let i = 0; i < piece.shape.length; i++) {
    let pos = piece.shape[i];
    const y = startPos[0] + pos[0] * gridSize;
    const x = startPos[1] + pos[1] * gridSize;
    drawCell(
      [y, x],
      gridSize,
      gridColor ?? piece.color,
      borderColor ?? config.PIECE_BORDER_COLOR,
      alpha,
    );
  }
}

function drawPreview(pieces) {
  if (state.isDragging) {
    const pieceData = pieces.find((p) => p.id === state.selectedPieceId);

    const piecePosition = piecePositions.find(
      (p) => p.id === state.selectedPieceId,
    );
    const [pieceWidth, pieceHeight] = [
      piecePosition.width,
      piecePosition.height,
    ];
    drawPiece(
      pieceData,
      [state.mousePos[1] - pieceHeight / 2, state.mousePos[0] - pieceWidth / 2],
      config.getGridSize(state.grid),
    );
  }
}
