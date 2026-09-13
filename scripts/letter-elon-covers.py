#!/usr/bin/env python3
"""Composite exact picture-book titles onto the Elon & Olivia physics covers."""

from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = Path("/tmp/cover-fonts")
ART = ROOT / "public/books"

RUST = (148, 50, 34)
TEAL = (58, 74, 70)
CREAM = (244, 228, 196)
INK = (72, 38, 28)

BOOKS = [
    {
        "id": "elon-heat-jiggle",
        "name": "Olivia",
        "rest": "Quiet Fire",
        "subtitle": "Heat is a tiny dance",
    },
    {
        "id": "elon-force-roll",
        "name": "Olivia",
        "rest": "Stubborn Cart",
        "subtitle": "Things keep doing what they were doing",
    },
    {
        "id": "elon-float-boat",
        "name": "Olivia",
        "rest": "Floating Rock",
        "subtitle": "Water can hold you up",
    },
    {
        "id": "elon-air-hug",
        "name": "Olivia",
        "rest": "Invisible Ocean",
        "subtitle": "We live at the bottom of a sea of air",
    },
    {
        "id": "elon-ice-steam",
        "name": "Olivia",
        "rest": "Three Faces of Water",
        "subtitle": "Ice, puddle, cloud — same stuff",
    },
    {
        "id": "elon-friction-grip",
        "name": "Olivia",
        "rest": "Sticky Floor",
        "subtitle": "Rough things hold on",
    },
    {
        "id": "elon-lever-lift",
        "name": "Olivia",
        "rest": "Long Stick",
        "subtitle": "A stick can borrow strength",
    },
    {
        "id": "elon-energy-spring",
        "name": "Olivia",
        "rest": "Hidden Jump",
        "subtitle": "Energy can hide, then run",
    },
    {
        "id": "elon-balance-tip",
        "name": "Olivia",
        "rest": "Wobbly Ruler",
        "subtitle": "Heavy middles stand tall",
    },
    {
        "id": "elon-sky-blue",
        "name": "Olivia",
        "rest": "Painted Sky",
        "subtitle": "Air is a quiet prism",
    },
]


def ensure_fonts() -> None:
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    files = {
        "Baloo2.ttf": "https://github.com/google/fonts/raw/main/ofl/baloo2/Baloo2%5Bwght%5D.ttf",
        "Fredoka.ttf": "https://github.com/google/fonts/raw/main/ofl/fredoka/Fredoka%5Bwdth%2Cwght%5D.ttf",
        "Andika-Bold.ttf": "https://github.com/google/fonts/raw/main/ofl/andika/Andika-Bold.ttf",
    }
    for name, url in files.items():
        dest = FONT_DIR / name
        if dest.exists() and dest.stat().st_size > 10000:
            continue
        urllib.request.urlretrieve(url, dest)


def font_baloo(size: int) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONT_DIR / "Baloo2.ttf"), size)
    f.set_variation_by_axes([800])
    return f


def font_fredoka(size: int) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONT_DIR / "Fredoka.ttf"), size)
    f.set_variation_by_axes([100, 700])
    return f


def font_andika(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_DIR / "Andika-Bold.ttf"), size)


def measure(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> tuple[int, int]:
    x0, y0, x1, y1 = draw.textbbox((0, 0), text, font=font)
    return x1 - x0, y1 - y0


def fit_font(draw: ImageDraw.ImageDraw, text: str, max_width: int, start: int, maker) -> ImageFont.FreeTypeFont:
    size = start
    while size > 36:
        font = maker(size)
        w, _ = measure(draw, text, font)
        if w <= max_width:
            return font
        size -= 2
    return maker(36)


def wrap_subtitle(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    w, _ = measure(draw, text, font)
    if w <= max_width:
        return [text]
    words = text.split()
    lines: list[str] = []
    cur = words[0]
    for word in words[1:]:
        trial = f"{cur} {word}"
        tw, _ = measure(draw, trial, font)
        if tw <= max_width:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    lines.append(cur)
    return lines


def cream_washes(size: tuple[int, int]) -> Image.Image:
    w, h = size
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    pix = overlay.load()
    top = int(h * 0.24)
    bot = int(h * 0.12)
    for y in range(top):
        t = y / max(1, top - 1)
        # painted parchment that fades into the scene
        alpha = int(185 * (1 - t) ** 1.55)
        for x in range(w):
            pix[x, y] = (*CREAM, alpha)
    for i in range(bot):
        y = h - bot + i
        t = i / max(1, bot - 1)
        alpha = int(175 * t ** 1.25)
        for x in range(w):
            pix[x, y] = (*CREAM, alpha)
    return overlay.filter(ImageFilter.GaussianBlur(radius=12))


def draw_text(
    canvas: Image.Image,
    text: str,
    xy: tuple[float, float],
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    anchor: str = "lt",
) -> None:
    # cream halo, then a soft ink shadow, then the letter
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.text(xy, text, font=font, fill=(*INK, 90), anchor=anchor, stroke_width=10, stroke_fill=(*CREAM, 220))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(radius=1.2)))
    draw = ImageDraw.Draw(canvas)
    draw.text(
        xy,
        text,
        font=font,
        fill=fill + (255,),
        anchor=anchor,
        stroke_width=4,
        stroke_fill=CREAM + (255,),
    )


def letter_cover(src: Path, dest_jpg: Path, dest_webp: Path, book: dict) -> None:
    base = Image.open(src).convert("RGBA")
    w, h = base.size
    painted = Image.alpha_composite(base, cream_washes((w, h)))
    draw = ImageDraw.Draw(painted)
    cx = w / 2
    max_w = int(w * 0.88)

    name_font = fit_font(draw, book["name"], int(w * 0.44), 124, font_baloo)
    conn_font = font_fredoka(max(42, name_font.size // 2 - 6))
    gap = 16
    name_w, _ = measure(draw, book["name"], name_font)
    conn_w, _ = measure(draw, "and the", conn_font)
    line1_w = name_w + gap + conn_w
    x0 = cx - line1_w / 2
    y1 = int(h * 0.048)
    draw_text(painted, book["name"], (x0, y1), name_font, RUST, anchor="lt")
    draw_text(
        painted,
        "and the",
        (x0 + name_w + gap, y1 + name_font.size * 0.40),
        conn_font,
        TEAL,
        anchor="lt",
    )

    rest_font = fit_font(draw, book["rest"], max_w, 104, font_baloo)
    y2 = y1 + int(name_font.size * 0.88)
    draw_text(painted, book["rest"], (cx, y2), rest_font, RUST, anchor="mt")

    sub_font = fit_font(draw, book["subtitle"], max_w, 48, font_andika)
    lines = wrap_subtitle(draw, book["subtitle"], sub_font, max_w)
    line_h = int(sub_font.size * 1.12)
    block_h = line_h * len(lines)
    y_sub = h - int(h * 0.055) - block_h
    for i, line in enumerate(lines):
        draw_text(painted, line, (cx, y_sub + i * line_h), sub_font, RUST, anchor="mt")

    rgb = painted.convert("RGB")
    dest_jpg.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(dest_jpg, "JPEG", quality=92, optimize=True, subsampling=0)
    shelf = rgb.resize((360, 540), Image.Resampling.LANCZOS)
    shelf.save(dest_webp, "WEBP", quality=84, method=6)
    print(f"wrote {dest_jpg} and {dest_webp.name}")


def main() -> None:
    ensure_fonts()
    untitled = Path("/tmp/untitled-elon-covers")
    for book in BOOKS:
        src = untitled / f"{book['id']}.jpg"
        if not src.exists():
            src = ART / book["id"] / "art" / "cover.jpg"
        if not src.exists():
            raise SystemExit(f"missing {src}")
        letter_cover(
            src,
            ART / book["id"] / "art" / "cover.jpg",
            ART / book["id"] / "art" / "cover-shelf.webp",
            book,
        )


if __name__ == "__main__":
    main()
