import os

import psycopg

from . import config


def get_connection() -> psycopg.Connection:
    return psycopg.connect(os.environ["DATABASE_URL"])


def init_db():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS highest_scores (
                grid_size INTEGER PRIMARY KEY,
                score INTEGER NOT NULL
            );
        """)

        connection.execute(
            """
            INSERT INTO highest_scores (grid_size, score)
            VALUES (%s, %s)
            ON CONFLICT (grid_size) DO NOTHING;
            """,
            (config.GRID_SIZE, 0),
        )


def get_highest_score(grid_size: int) -> int:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            SELECT score FROM highest_scores
            WHERE grid_size = %s;
            """,
            (grid_size,),
        )

        result = cursor.fetchone()
        return result[0] if result is not None else 0


def update_highest_score(grid_size: int, score: int):
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO highest_scores (grid_size, score)
            VALUES (%s, %s)
            ON CONFLICT (grid_size)
            DO UPDATE SET
                score = GREATEST(highest_scores.score, EXCLUDED.score);
            """,
            (grid_size, score),
        )
