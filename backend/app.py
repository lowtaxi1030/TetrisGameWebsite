from __future__ import annotations

from pathlib import Path

import flask

from . import config
from . import database as db
from .game import Game

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = flask.Flask(__name__, template_folder=FRONTEND_DIR / "templates", static_folder=FRONTEND_DIR / "static")

games: dict[str, Game] = {}  # "": Game(config.GRID_SIZE, config.GRID_SIZE)

db.init_db()


# 註冊路由
@app.route("/")
def index():
    return flask.render_template("index.html")


def get_game(game_id) -> Game:
    if (game := games.get(game_id)) is None:
        game = Game(config.GRID_SIZE, config.GRID_SIZE)
        games[game_id] = game

    return game


def get_game_data(game_id):
    game = get_game(game_id)

    return {
        "grid": game.board.grid,
        "score": game.score,
        "pieces": [p.to_dict() for p in game.pieces],
        "is_game_over": game.is_game_over,
        "highest_score": db.get_highest_score(config.GRID_SIZE),
    }


def get_game_id():
    game_id = flask.request.headers.get("X-Game-ID")

    if not game_id:
        flask.abort(400, "Missing X-Game-ID")

    return game_id


@app.route("/api/game", methods=["GET"])
def get_game_state():
    """取得目前遊戲狀態"""
    return get_game_data(get_game_id())


@app.route("/api/place", methods=["POST"])
def place_piece():
    """放置方塊"""
    result = flask.request.get_json()

    game = get_game(game_id := get_game_id())

    if success := game.place_piece(result["piece_id"], tuple(result["start_pos"])):
        db.update_highest_score(config.GRID_SIZE, game.score)

    return {"success_to_place": success, **get_game_data(game_id)}


@app.route("/api/reset", methods=["POST"])
def reset_game():
    """重開遊戲"""
    game = get_game(game_id := get_game_id())
    game.reset()
    return get_game_data(game_id)


app.run(host="0.0.0.0", port=5000, debug=True)
