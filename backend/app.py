from __future__ import annotations

# import time
from pathlib import Path

import flask
from dotenv import load_dotenv

load_dotenv()

from . import database as db  # noqa: E402

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app = flask.Flask(
    __name__,
    template_folder=FRONTEND_DIR / "templates",
    static_folder=FRONTEND_DIR / "static",
)

db.init_db()


# 註冊路由
@app.route("/")
def index():
    return flask.render_template("index.html")


@app.route("/grid_size_select")
def grid_size_select_page():
    return flask.render_template("grid_size_select.html")


@app.route("/game")
def game_page():
    return flask.render_template("game.html")


@app.route("/settings")
def settings_page():
    return flask.render_template("settings.html")


@app.route("/api/highest-scores", methods=["GET"])
def get_highest_scores():
    return {"scores": db.get_all_highest_scores()}


@app.route("/api/highest-scores", methods=["POST"])
def update_highest_score():
    result = flask.request.get_json()
    if not isinstance(result, dict):
        flask.abort(400, "Expected a JSON object")

    grid_size = result.get("grid_size")
    score = result.get("score")
    if type(grid_size) is not int or grid_size <= 0:
        flask.abort(400, "grid_size must be a positive integer")
    if type(score) is not int or score < 0:
        flask.abort(400, "score must be a non-negative integer")

    db.update_highest_score(grid_size, score)
    return {"highest_score": db.get_highest_score(grid_size)}


app.run(host="0.0.0.0", port=5000, debug=True)
