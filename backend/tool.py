from __future__ import annotations

import math
from math import sin

Color = tuple[int, int, int]
AlphaColor = tuple[int, int, int, int]


class Colors:
    """提供各種顏色 (依色相與色調排序)"""

    # 1. 基礎與深色系 (最適合當遊戲背景)
    # 這組顏色飽和度較低或亮度較暗，不會干擾玩家看清子彈或敵人。

    BLACK = (0, 0, 0)
    BLACK2 = (30, 30, 30)  # 推薦：World 1 背景
    BLACK_3 = (60, 60, 60)
    DARK_GRAY = (100, 100, 100)
    BLUE3 = (50, 0, 100)  # 推薦：神祕關卡背景
    TYRIAN_PURPLE = (102, 2, 60)  # 推薦：Boss 關背景

    # 2. 暖色調 (紅、橙、黃、金)
    # 這組適合當「警示」、「熔岩世界」或「解鎖按鈕」。

    RED = (255, 0, 0)
    RED_2 = (200, 0, 0)
    DARK_RED = (160, 0, 0)
    LIGHT_RED = (255, 80, 80)
    VERMILION = (255, 50, 0)
    ORANGE = (255, 100, 0)
    ORANGE2 = (200, 50, 0)
    BROWN = (200, 100, 50)  # 推薦：荒漠世界
    GOLD = (255, 215, 0)
    YELLOW = (255, 255, 0)
    MC_YELLOW = (255, 255, 160)

    # 3. 綠色調 (森林、草地、毒液)
    DARK_GREEN = (0, 100, 0)  # 推薦：叢林背景
    OLIVE = (127, 127, 0)
    EMERALD = (80, 180, 130)
    PARIS_GREEN = (80, 200, 120)
    CHARTREUSE = (127, 255, 0)
    GREEN = (0, 255, 0)

    # 4. 冷色調 (青、藍、紫、粉)
    # 這組適合「水下世界」、「科技感」或「稀有皮膚」。
    BLUE2 = (0, 0, 170)
    BLUE = (0, 0, 255)
    CYAN = (135, 206, 235)  # 推薦：冰雪/水下世界背景
    VIOLET = (143, 0, 255)
    PURPLE = (128, 0, 128)
    FUCHSIA = (255, 50, 180)
    PINK = (255, 0, 255)
    CLARET = (191, 0, 64)

    # 5. 高亮度與特殊色
    # 適合文字、UI 邊框或發光特效。
    COSMIC_LATTE = (255, 248, 231)
    WHITE = (255, 255, 255)
    GRAY = (160, 160, 160)

    # 萬聖節顏色
    PUMPKIN_ORANGE = (255, 117, 24)
    MIDNIGHT_PURPLE = (75, 0, 130)  # 這跟你現在的 BLUE3 背景很搭！
    SLIME_GREEN = (50, 205, 50)
    BLOOD_RED = (138, 7, 7)

    # 實驗中顏色
    TEST_COLOR = (127, 255, 0)

    @staticmethod
    def get_color(color_name: str, default=WHITE):
        # 將輸入轉為大寫，並嘗試從類別屬性中抓取
        if color_name.upper() == "DARK ORANGE":
            color_name = "ORANGE 2"
        if color_name.upper() == "LIGHT BLUE":
            color_name = "CYAN"
        return getattr(Colors, color_name.upper().replace(" ", "_"), default)

    @staticmethod
    def two_color_gradient(color1: Color, color2: Color, ratio: float):
        """ratio 是 color1 的比例，回傳兩個顏色的漸層色"""
        ratio = clamp(0, 1, ratio)
        r = int(color1[0] * ratio + color2[0] * (1 - ratio))
        g = int(color1[1] * ratio + color2[1] * (1 - ratio))
        b = int(color1[2] * ratio + color2[2] * (1 - ratio))
        return (r, g, b)

    @staticmethod
    def two_color_wave(color1: Color, color2: Color, speed: int | float, time_func):
        """根據時間在兩個顏色之間波動，\n time_func 是要用的時間函式，預設是 p 的 get_ticks()"""

        ratio = (sin(time_func() / 1000.0 * speed) + 1) / 2  # 產生 0 到 1 的波動
        return Colors.two_color_gradient(color1, color2, ratio)

    @staticmethod
    def two_color_change(color1: Color, color2: Color, condition: bool):
        """condition 為 True 時回傳 color1, 為 False 時回傳 color2"""
        return color1 if condition else color2


def clamp(start, end, value):
    if start is None:
        start = -math.inf
    if end is None:
        end = math.inf
    return min(max(start, value), end)


def in_range(start: int | float, end: int | float, num):
    return start <= num <= end


def show_time_hrs(seconds):
    """
    輸入：秒數 \n
    輸出："小時：分鐘：秒數"
    """
    hrs = seconds // 3600
    mins = seconds // 60
    sec = seconds % 60
    return f"{hrs}:" + ("0" if mins % 60 < 10 else "") + f"{mins % 60}:" + ("0" if sec < 10 else "") + f"{sec}"


def show_time_min(seconds: str | float):
    """
    輸入：秒數 \n
    輸出："分鐘：秒數"
    """
    mins = seconds // 60  # type: ignore
    sec = seconds % 60
    return f"{int(mins)}:" + ("0" if sec < 10 else "") + f"{int(sec)}"  # type: ignore


def num_to_KMBT(num):
    if num >= 1000000000000:
        text = f"{math.floor(num / 10000000000) / 100}T"
    elif num >= 1000000000:
        text = f"{math.floor(num / 10000000) / 100}B"
    elif num >= 1000000:
        text = f"{math.floor(num / 10000) / 100}M"
    elif num >= 1000:
        text = f"{math.floor(num / 10) / 100}K"
    else:
        text = f"{int(num)}"
    return text


def update_scrolling(current_y, target_y, smoth=0.1, min_val=0, max_val=None):
    # 1. 先確保目標值在合法範圍內
    if max_val is not None:
        target_y = clamp(min_val, target_y, max_val)

    # 2. 計算緩動 (Lerp 邏輯)
    if current_y != target_y and abs(target_y - current_y) > 0.1:
        current_y += (target_y - current_y) * smoth
    else:
        current_y = target_y

    # 3. 再次強制修正 current_y 確保不溢出 (這對邊界回彈很有用)
    if max_val is not None:
        current_y = clamp(min_val, current_y, max_val)

    return current_y


def float_offset(time, speed=1, height=10, offset=-10):
    return sin(time / 100 * speed) * height + offset


def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    """將 16 進位顏色碼 (如 "#59C93C" 或 "59C93C") 轉為 (R, G, B) 10 進位 Tuple"""
    hex_str = hex_str.lstrip("#")
    return tuple(int(hex_str[i : i + 2], 16) for i in (0, 2, 4))


# 測試你的顏色碼：
# color = hex_to_rgb("#86B87F")
# print(color)
