PIECE_PATTERN = [
    # 1 格
    [(0, 0)],
    # 2 格
    [(0, 0), (0, 1)],
    [(1, 0), (0, 0)],
    [(0, 0), (1, 1)],
    # 3 格
    [(0, 0), (0, 1), (0, 2)],
    [(0, 0), (1, 0), (1, 1)],
    # 4 格
    [(0, 0), (1, 0), (1, 1), (2, 1)],
    [(0, 0), (0, 1), (1, 1), (1, 2)],
    [(1, 0), (1, 1), (0, 1), (0, 2)],
    [(0, 0), (0, 1), (0, 2), (0, 3)],
    [(0, 0), (1, 0), (2, 0), (3, 0)],
    [(0, 0), (0, 1), (1, 0), (1, 1)],
    [(0, 0), (0, 1), (0, 2), (1, 1)],
    [(0, 1), (1, 0), (1, 1), (1, 2)],
    [(0, 0), (1, 0), (2, 0), (2, 1)],
    [(0, 1), (1, 1), (2, 0), (2, 1)],
    [(0, 0), (0, 1), (1, 1), (1, 2)],
    # 5 格
    [(0, 1), (1, 0), (1, 1), (1, 2), (2, 1)],
    [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4)],
    [(0, 0), (1, 0), (2, 0), (3, 0), (4, 0)],
    [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1)],
    [(0, 0), (0, 1), (1, 1), (2, 1), (2, 2)],
    # 9 格
    [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)],
]

PIECE_WEIGHT_BY_SIZE = {
    1: 10,
    2: 10,
    3: 8,
    4: 6,
    5: 3,
    9: 1,
}


def rotate_pattern(pattern, turns=1):
    """turns: 可以是 0、1、2、3，分別代表旋轉 0、90、180、270 度。"""
    rotated = list(pattern)

    for _ in range(turns):
        rotated = [(c, -r) for r, c in rotated]

        min_row = min(r for r, c in rotated)
        min_col = min(c for r, c in rotated)

        rotated = [(r - min_row, c - min_col) for r, c in rotated]

    return rotated


class Piece:
    def __init__(self, id: int, shape: list[tuple[int, int]], color: tuple[int, int, int]):
        self.id = id
        self.shape = shape
        self.color = color

    def to_dict(self):
        return {
            "id": self.id,
            "shape": self.shape,
            "color": list(self.color),
        }
