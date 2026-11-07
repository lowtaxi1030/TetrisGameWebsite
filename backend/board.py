class Board:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.grid = [[0 for _ in range(self.cols)] for _ in range(self.rows)]

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

    def can_place(self, start_pos: tuple[int, int], shape: list[tuple[int, int]]) -> bool:
        """
        shpae: 相對於 start_pos 的形狀，包含所有的相對座標
        """
        true_poses = self._get_true_poses(start_pos, shape)
        for r, c in true_poses:
            if not self._check_bounds(r, c, return_type="Boolean"):
                return False
            if self.grid[r][c] != 0:
                return False
        return True

    def get_cell(self, row, col):
        self._check_bounds(row, col)
        return self.grid[row][col]

    def set_cell(self, row, col, value):
        self._check_bounds(row, col)
        self.grid[row][col] = value

    def place(self, start_pos: tuple[int, int], shape: list[tuple[int, int]], fill_value: int):
        if not self.can_place(start_pos, shape):
            raise ValueError("Cannot place shape at the specified position")
        true_poses = self._get_true_poses(start_pos, shape)
        for r, c in true_poses:
            self.set_cell(r, c, fill_value)
