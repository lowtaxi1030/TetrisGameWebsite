PIECE_PATTERN = [
    [(0, 0)],
    [(0, 0), (0, 1)],
    [(1, 0), (0, 0)],
    [(0, 0), (1, 0), (1, 1)],
    [(0, 0), (1, 0), (1, 1), (2, 1)],
    [(0, 0), (0, 1), (1, 1), (1, 2)],
    [(-1, 1), (0, 1), (1, 1),
     (-1, 0), (0, 0), (1, 0),
     (-1, -1), (0, -1), (1, -1),],
]


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
