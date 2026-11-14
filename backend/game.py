from __future__ import annotations

import random

from backend import piece, tool

from .board import Board


class Game:
    def __init__(self, rows: int, cols: int):
        self.board = Board(rows, cols)
        self.score = 0
        self.pieces: list[piece.Piece] = []
        self.is_game_over = False
        self.pieces_per_turn = 3

        self.max_attempts = 10
        self.generate_pieces()

    def place_piece(self, piece_id: int, start_pos: tuple[int, int]) -> bool:
        # 1. 確認遊戲是否結束
        if self.is_game_over:
            return False

        # 2. 找到對應的 Piece
        current_piece: piece.Piece | None
        if (current_piece := next((p for p in self.pieces if p.id == piece_id), None)) is None:
            raise ValueError(f"can't find a piece that id is {piece_id}")

        # 3. 呼叫 board.can_place()
        if not self.board.can_place(start_pos, current_piece.shape):
            self.is_game_over = self.check_game_over()
            return False

        # 4. 呼叫 board.place() 放置方塊
        self.board.place(start_pos, current_piece.shape, current_piece.color)

        # 5. 呼叫 board.clear_full_lines() 清除完整行列
        cleared_rows, cleared_cols = self.board.clear_full_lines()
        # 之後實作
        # cleared_lines = cleared_rows + cleared_cols
        # combo：連續消除次數
        # last_clear_count：上一次消除的行列數

        # 6. 更新分數
        self.score += len(current_piece.shape) + (self.board.rows * cleared_rows + self.board.cols * cleared_cols)

        # 7. 從 self.pieces 移除已使用的 Piece
        self.pieces.remove(current_piece)

        # 8. 如果三個方塊都用完，產生下一組
        if not self.pieces:
            self.generate_pieces()

        else:
            # 9. 檢查是否 Game Over
            self.is_game_over = self.check_game_over()
        return True

    def generate_pieces(self):
        if self.is_game_over:
            return

        attempts = 0
        self._generate_pieces()
        while self.check_game_over() and attempts < (self.max_attempts - 1):
            attempts += 1
            self._generate_pieces()
        self.is_game_over = self.check_game_over()

    def _generate_pieces(self):
        weights = [piece.PIECE_WEIGHT_BY_SIZE[len(p)] for p in piece.PIECE_PATTERN]

        patterns = random.choices(
            piece.PIECE_PATTERN,
            weights=weights,
            k=self.pieces_per_turn,
        )

        self.pieces = [
            piece.Piece(
                id,
                piece.rotate_pattern(p, random.randrange(4)),
                tool.Colors.WHITE,
            )
            for id, p in enumerate(patterns)
        ]

    def check_game_over(self) -> bool:
        return all(
            not any(self.board.can_place((r, c), p.shape) for r in range(self.board.rows) for c in range(self.board.cols))
            for p in self.pieces
        )

    def reset(self):
        self.board.reset()
        self.score = 0
        self.is_game_over = False
        self.generate_pieces()
