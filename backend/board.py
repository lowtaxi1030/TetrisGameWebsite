class Board:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.grid = [[None for _ in range(self.cols)] for _ in range(self.rows)]

    def _check_bounds(self, row, col, return_type="Error"):
        """return_type: 'Error' or 'Boolean'"""
        if not (0 <= row < self.rows and 0 <= col < self.cols):
            if return_type == "Error":
                raise IndexError("Cell position out of range")
            elif return_type == "Boolean":
                return False
        return True

    def _get_true_poses(self, start_pos, shape):
        """
        shape: 相對於 start_pos 的形狀，包含所有的相對座標
        """
        return [(start_pos[0] + r, start_pos[1] + c) for r, c in shape]

    def get_cell(self, row, col):
        self._check_bounds(row, col)
        return self.grid[row][col]

    def set_cell(self, row, col, value):
        self._check_bounds(row, col)
        self.grid[row][col] = value

    def can_place(self, start_pos: tuple[int, int], shape: list[tuple[int, int]]) -> bool:
        """
        shpae: 相對於 start_pos 的形狀，包含所有的相對座標
        """
        true_poses = self._get_true_poses(start_pos, shape)
        for r, c in true_poses:
            if not self._check_bounds(r, c, return_type="Boolean"):
                return False
            if self.grid[r][c] is not None:
                return False
        return True

    def place(self, start_pos: tuple[int, int], shape: list[tuple[int, int]], color: tuple[int, int, int]):
        if not self.can_place(start_pos, shape):
            raise ValueError("Cannot place shape at the specified position")
        true_poses = self._get_true_poses(start_pos, shape)
        for r, c in true_poses:
            self.set_cell(r, c, color)

    def _get_full_rows(self):
        # 檢查橫排
        for r, row in enumerate(self.grid):
            if all(cell is not None for cell in row):
                yield r  # 清理橫排

    def _get_full_cols(self):
        # 檢查直排
        for c in range(self.cols):
            if all(self.grid[r][c] is not None for r in range(self.rows)):
                yield c  # 清理直排

    def clear_full_lines(self):
        full_rows = list(self._get_full_rows())
        full_cols = list(self._get_full_cols())

        for r, row in enumerate(self.grid):
            for c, _ in enumerate(row):
                if r in full_rows or c in full_cols:
                    self.set_cell(r, c, None)

        return len(full_rows), len(full_cols)

    def is_full(self) -> bool:
        return all(cell is not None for row in self.grid for cell in row)

    def reset(self):
        self.grid = [[None for _ in range(self.cols)] for _ in range(self.rows)]
