PIECE_STYLE = [
    "red",
    "orange",
    "yellow",
    "lightGreen",
    "default",
    "blue",
    "purple",
    "teal",
    "coral",
    "indigo",
    "pink",
    "cyan",
    "gold",
]


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
    def __init__(self, id: int, shape: list[tuple[int, int]], style: str):
        self.id = id
        self.shape = shape
        self.style = style

    def to_dict(self):
        return {
            "id": self.id,
            "shape": self.shape,
            "style": self.style,
        }
