from __future__ import annotations

from pathlib import Path

import flask

from .game import Game

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = flask.Flask(__name__, template_folder=FRONTEND_DIR / "templates", static_folder=FRONTEND_DIR / "static")
game = Game(8, 8)

# 註冊路由
@app.route("/")
def index():
    game.reset()
    return flask.render_template("index.html")


def get_game():
    return {
        "grid": game.board.grid,
        "score": game.score,
        "pieces": [p.to_dict() for p in game.pieces],
        "is_game_over": game.is_game_over,
    }


@app.route("/api/game", methods=["GET"])
def get_game_state():
    """取得目前遊戲狀態"""

    return get_game()


@app.route("/api/place", methods=["POST"])
def place_piece():
    """放置方塊"""
    result = flask.request.get_json()
    return {"success_to_place": game.place_piece(result["piece_id"], tuple(result["start_pos"])), **get_game()}


@app.route("/api/reset", methods=["POST"])
def reset_game():
    """重開遊戲"""
    game.reset()
    return get_game()


app.run(host="0.0.0.0", port=5000, debug=True)
