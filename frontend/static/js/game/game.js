import { Board } from "./board.js";
import { PIECES } from "./piecePattern.js";
import { PIECE_STYLE, Piece, rotatePattern } from "./piece.js";

export class Game {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.board = new Board(rows, cols);
    this.score = 0;
    this.pieces = [];
    this.isGameOver = false;
    this.piecesPerTurn = 3;
    this.maxAttempts = 10;
    this.generatePieces();
  }

  placePiece(pieceId, startPos) {
    if (this.isGameOver) return false;

    const currentPiece = this.pieces.find((piece) => piece.id === pieceId);
    if (!currentPiece) {
      throw new Error(`can't find a piece that id is ${pieceId}`);
    }

    if (!this.board.canPlace(startPos, currentPiece.shape)) {
      this.isGameOver = this.checkGameOver();
      return false;
    }

    this.board.place(startPos, currentPiece.shape, currentPiece.style);
    const [clearedRows, clearedCols] = this.board.clearFullLines();
    this.score +=
      currentPiece.shape.length +
      this.board.rows * clearedRows +
      this.board.cols * clearedCols;
    this.pieces = this.pieces.filter((piece) => piece !== currentPiece);

    if (this.pieces.length === 0) {
      this.generatePieces();
    } else {
      this.isGameOver = this.checkGameOver();
    }
    return true;
  }

  generatePieces() {
    if (this.isGameOver) return;

    let attempts = 0;
    this.generatePieceSet();
    while (this.checkGameOver() && attempts < this.maxAttempts - 1) {
      attempts++;
      this.generatePieceSet();
    }
    this.isGameOver = this.checkGameOver();
  }

  generatePieceSet() {
    const availablePieces = PIECES.filter(
      (piece) => this.board.rows >= piece.min_grid_size,
    );
    const totalWeight = availablePieces.reduce(
      (sum, piece) => sum + piece.weight,
      0,
    );

    this.pieces = Array.from({ length: this.piecesPerTurn }, (_, id) => {
      let choice = Math.random() * totalWeight;
      let selected = availablePieces[availablePieces.length - 1];
      for (const piece of availablePieces) {
        choice -= piece.weight;
        if (choice < 0) {
          selected = piece;
          break;
        }
      }

      return new Piece(
        id,
        rotatePattern(selected.shape, Math.floor(Math.random() * 4)),
        PIECE_STYLE[Math.floor(Math.random() * PIECE_STYLE.length)],
      );
    });
  }

  checkGameOver() {
    return this.pieces.every(
      (piece) =>
        !this.board.grid.some((row, rowIndex) =>
          row.some((_, colIndex) =>
            this.board.canPlace([rowIndex, colIndex], piece.shape),
          ),
        ),
    );
  }

  reset() {
    this.board.reset();
    this.score = 0;
    this.isGameOver = false;
    this.generatePieces();
  }
}
