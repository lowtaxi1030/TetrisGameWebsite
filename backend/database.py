import os

from psycopg_pool import ConnectionPool

from . import config

pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],
    min_size=1,
    max_size=5,
)


def init_db():
    with pool.connection() as connection:
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
    with pool.connection() as connection:
        cursor = connection.execute(
            """
            SELECT score FROM highest_scores
            WHERE grid_size = %s;
            """,
            (grid_size,),
        )

        result = cursor.fetchone()
        return result[0] if result is not None else 0


def get_all_highest_scores():
    with pool.connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT grid_size, score
                FROM highest_scores
                ORDER BY grid_size;
                """,
            )
            result = cursor.fetchall()
        return [{"grid_size": g, "score": s} for g, s in result]


def update_highest_score(grid_size: int, score: int):
    with pool.connection() as connection:
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
