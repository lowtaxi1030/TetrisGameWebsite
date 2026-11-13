import { piecePositions } from "./renderer.js";
import { state } from "./gameState.js";
import { placePiece } from "./api.js";
import { getPlacementPosition } from "./placement.js";

export function handleMouseDown(event) {
  console.log(event.offsetX, event.offsetY);
  for (let i = 0; i < piecePositions.length; i++) {
    const piece = piecePositions[i];
    if (
      piece.position[1] < event.offsetX &&
      event.offsetX < piece.position[1] + piece.width &&
      piece.position[0] < event.offsetY &&
      event.offsetY < piece.position[0] + piece.height
    ) {
      state.selectedPieceId = piece.id;
      state.mousePos = [event.offsetX, event.offsetY];
      state.isDragging = true;
      console.log("選取的方塊：", piece.id);
    }
  }
}

export function handleMouseMove(event) {
  if (!state.isDragging) return;

  state.mousePos = [event.offsetX, event.offsetY];
}

export async function handleMouseUp(event) {
  if (!state.isDragging) return;

  await handlePlacePiece();

  state.isDragging = false;
  console.log("結束拖曳");
}

async function handlePlacePiece() {
  const [y, x] = getPlacementPosition();
  await placePiece(state.selectedPieceId, [y, x]);
}
