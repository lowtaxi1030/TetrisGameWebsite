import sqlite3

from . import config


def init_db():
    connection = sqlite3.connect("game.db")
    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS highest_scores (
                grid_size INTEGER PRIMARY KEY,
                score INTEGER NOT NULL
            );
        """)

        connection.execute(
            """
            INSERT OR IGNORE INTO highest_scores (grid_size, score)
            VALUES (?, ?);
            """,
            (config.GRID_SIZE, 0),
        )
        connection.commit()
    finally:
        connection.close()


def get_highest_score(grid_size: int):
    connection = sqlite3.connect("game.db")
    try:
        cursor = connection.execute(
            """
                SELECT score FROM highest_scores
                WHERE grid_size = ?
            """,
            (grid_size,),
        )
        if (result := cursor.fetchone()) is None:
            return 0
        return result[0]
    finally:
        connection.close()


def update_highest_score(grid_size, score: int):
    connection = sqlite3.connect("game.db")
    try:
        connection.execute(
            """
                UPDATE highest_scores
                SET score = MAX(score, ?)
                WHERE grid_size = ?
            """,
            (score, grid_size),
        )
        connection.commit()
    finally:
        connection.close()
