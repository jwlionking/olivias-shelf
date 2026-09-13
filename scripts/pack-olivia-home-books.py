#!/usr/bin/env python3
"""Knock out cream paper, letter covers, and copy Olivia home-book art."""
from __future__ import annotations

import json
import math
import shutil
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
IMG = Path(
    "/root/.grok/sessions/%2Froot%2Fapps%2Folivias-shelf/"
    "01a09afc-52aa-7643-8226-9028837f7ffa/images"
)
ART = ROOT / "public/books"
WALL = ROOT / "public/textures/walls"
FONT_DIR = Path("/tmp/cover-fonts")

RUST = (148, 50, 34)
TEAL = (58, 74, 70)
CREAM = (244, 228, 196)
INK = (72, 38, 28)

BOOKS = [
    {
        "id": "olivia-two-sisters",
        "name": "Olivia",
        "rest": "Two Sisters",
        "subtitle": "Zero is calm. Belle is bounce.",
        "cover": "18.jpg",
        "crop_bottom": 0.09,
        "backs": {"couch": "5.jpg", "patio": "15.jpg"},
        "props": ["olivia-stand", "zero", "belle", "rock"],
        "wall": "5.jpg",
        "spine": "#6b5340",
    },
    {
        "id": "olivia-lost-rock",
        "name": "Olivia",
        "rest": "Lost Rock",
        "subtitle": "Sisters help find treasure.",
        "cover": "16.jpg",
        "backs": {"patio": "15.jpg", "garden": "13.jpg"},
        "props": ["olivia-stand", "zero", "belle", "rock"],
        "wall": "15.jpg",
        "spine": "#4a6a3a",
    },
    {
        "id": "olivia-yard-romp",
        "name": "Olivia",
        "rest": "Yard Romp",
        "subtitle": "Red clay, two tails, one laugh.",
        "cover": "23.jpg",
        "backs": {"patio": "15.jpg", "house": "14.jpg"},
        "props": ["olivia-stand", "zero", "belle"],
        "wall": "15.jpg",
        "spine": "#8a4a28",
    },
    {
        "id": "olivia-garden-beds",
        "name": "Olivia",
        "rest": "Garden Beds",
        "subtitle": "Dirt under the fingernails.",
        "cover": "10.jpg",
        "backs": {"garden": "13.jpg", "house": "14.jpg"},
        "props": ["olivia-stand", "can"],
        "wall": "13.jpg",
        "spine": "#3a6a3a",
    },
    {
        "id": "olivia-quiet-sun",
        "name": "Olivia",
        "rest": "Quiet Sun",
        "subtitle": "The hill drinks light.",
        "cover": "11.jpg",
        "backs": {"solar": "20.jpg", "house": "14.jpg"},
        "props": ["olivia-stand"],
        "wall": "20.jpg",
        "spine": "#c9a24a",
    },
    {
        "id": "olivia-house-hill",
        "name": "Olivia",
        "rest": "House on the Hill",
        "subtitle": "Home is the white house.",
        "cover": "24.jpg",
        "backs": {"house": "14.jpg", "garden": "13.jpg"},
        "props": ["olivia-stand", "zero", "belle"],
        "wall": "14.jpg",
        "spine": "#5a6a78",
    },
]

CUTOUTS = {
    "olivia-stand": "9.jpg",
    "zero": "3.jpg",
    "belle": "2.jpg",
    "rock": "21.jpg",
    "can": "22.jpg",
}


def knockout(src: Path) -> Image.Image:
    im = Image.open(src).convert("RGBA")
    pix = im.load()
    w, h = im.size
    cream = (245, 237, 214)
    visited = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def idx(x: int, y: int) -> int:
        return y * w + x

    for x, y in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (0, h // 2)):
        q.append((x, y))
        visited[idx(x, y)] = 1
    while q:
        x, y = q.popleft()
        r, g, b, a = pix[x, y]
        dist = math.sqrt((r - cream[0]) ** 2 + (g - cream[1]) ** 2 + (b - cream[2]) ** 2)
        bright = (r + g + b) / 3
        if dist > 42 and bright < 228:
            visited[idx(x, y)] = 0
            continue
        pix[x, y] = (r, g, b, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[idx(nx, ny)]:
                visited[idx(nx, ny)] = 1
                q.append((nx, ny))
    bbox = im.getbbox()
    if not bbox:
        return im
    pad = 12
    x0, y0, x1, y1 = bbox
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)))


def save_webp(im: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=88, method=6)


def save_jpg(im: Image.Image, dest: Path, size: tuple[int, int] | None = None) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB")
    if size:
        rgb = rgb.resize(size, Image.Resampling.LANCZOS)
    rgb.save(dest, "JPEG", quality=90, optimize=True, subsampling=0)


def ensure_fonts() -> None:
    import urllib.request

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


def fit_font(draw, text, max_width, start, maker):
    size = start
    while size > 36:
        font = maker(size)
        w, _ = measure(draw, text, font)
        if w <= max_width:
            return font
        size -= 2
    return maker(36)


def wrap_subtitle(draw, text, font, max_width):
    w, _ = measure(draw, text, font)
    if w <= max_width:
        return [text]
    words = text.split()
    lines, cur = [], words[0]
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


def cream_washes(size):
    w, h = size
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    pix = overlay.load()
    top = int(h * 0.24)
    bot = int(h * 0.12)
    for y in range(top):
        t = y / max(1, top - 1)
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


def draw_text(canvas, text, xy, font, fill, anchor="lt"):
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.text(xy, text, font=font, fill=(*INK, 90), anchor=anchor, stroke_width=10, stroke_fill=(*CREAM, 220))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(radius=1.2)))
    draw = ImageDraw.Draw(canvas)
    draw.text(xy, text, font=font, fill=fill + (255,), anchor=anchor, stroke_width=4, stroke_fill=CREAM + (255,))


def letter_cover(src: Image.Image, dest_jpg: Path, dest_webp: Path, book: dict) -> None:
    base = src.convert("RGBA").resize((1200, 1800), Image.Resampling.LANCZOS)
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
    x0 = cx - (name_w + gap + conn_w) / 2
    y1 = int(h * 0.048)
    draw_text(painted, book["name"], (x0, y1), name_font, RUST, anchor="lt")
    draw_text(painted, "and the", (x0 + name_w + gap, y1 + name_font.size * 0.40), conn_font, TEAL, anchor="lt")
    rest_font = fit_font(draw, book["rest"], max_w, 104, font_baloo)
    y2 = y1 + int(name_font.size * 0.88)
    draw_text(painted, book["rest"], (cx, y2), rest_font, RUST, anchor="mt")
    sub_font = fit_font(draw, book["subtitle"], max_w, 48, font_andika)
    lines = wrap_subtitle(draw, book["subtitle"], sub_font, max_w)
    line_h = int(sub_font.size * 1.12)
    y_sub = h - int(h * 0.055) - line_h * len(lines)
    for i, line in enumerate(lines):
        draw_text(painted, line, (cx, y_sub + i * line_h), sub_font, RUST, anchor="mt")
    rgb = painted.convert("RGB")
    dest_jpg.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(dest_jpg, "JPEG", quality=92, optimize=True, subsampling=0)
    rgb.resize((360, 540), Image.Resampling.LANCZOS).save(dest_webp, "WEBP", quality=84, method=6)


def write_manifest(book: dict, dest: Path, files: list[dict]) -> None:
    dest.write_text(
        json.dumps(
            {
                "cards": files,
                "provenance": "Gouache picture-book paintings from family photos in grok-imagine-references (Olivia, Zero, Belle, Home).",
            },
            indent=2,
        )
        + "\n"
    )


def card(id_, file, w, h, cutout):
    return {
        "id": id_,
        "file": file,
        "width": w,
        "height": h,
        "cutout": cutout,
        "copy": f"{'Waking' if cutout else 'Painting'} {id_.replace('-', ' ')}…",
    }


def main() -> None:
    ensure_fonts()
    cut = {name: knockout(IMG / src) for name, src in CUTOUTS.items()}
    WALL.mkdir(parents=True, exist_ok=True)
    catalog = {}

    for book in BOOKS:
        out = ART / book["id"] / "art"
        out.mkdir(parents=True, exist_ok=True)
        (ART / book["id"] / "words").mkdir(parents=True, exist_ok=True)
        (ART / book["id"] / "voice").mkdir(parents=True, exist_ok=True)
        (ART / book["id"] / "words" / "manifest.json").write_text(
            '{"cards":[],"folder":"words/cards","format":"jpg"}\n'
        )
        files = []

        cover = Image.open(IMG / book["cover"]).convert("RGB")
        if book.get("crop_bottom"):
            w, h = cover.size
            cover = cover.crop((0, 0, w, int(h * (1 - book["crop_bottom"]))))
        letter_cover(cover, out / "cover.jpg", out / "cover-shelf.webp", book)
        files.append(card("cover", "cover.jpg", 1200, 1800, False))

        for pid in book["props"]:
            im = cut[pid]
            dest = out / f"{pid}.webp"
            save_webp(im, dest)
            files.append(card(pid, f"{pid}.webp", im.size[0], im.size[1], True))

        for bid, src in book["backs"].items():
            dest = out / f"{bid}.jpg"
            save_jpg(Image.open(IMG / src), dest, (1600, 1067))
            files.append(card(bid, f"{bid}.jpg", 1600, 1067, False))

        write_manifest(book, out / "manifest.json", files)

        wall = Image.open(IMG / book["wall"]).convert("RGB").resize((1600, 1067), Image.Resampling.LANCZOS)
        wall.save(WALL / f"{book['id']}.jpg", "JPEG", quality=88)
        shutil.copyfile(WALL / f"{book['id']}.jpg", WALL / f"{book['id']}-normal.jpg")

        bid = book["id"]
        catalog[f"books/{bid}/art/cover.jpg"] = f"/books/{bid}/art/cover.jpg"
        catalog[f"books/{bid}/art/cover-shelf.webp"] = f"/books/{bid}/art/cover-shelf.webp"
        catalog[f"books/{bid}/art/manifest.json"] = f"/books/{bid}/art/manifest.json"
        for pid in book["props"]:
            catalog[f"books/{bid}/art/{pid}.webp"] = f"/books/{bid}/art/{pid}.webp"
            catalog[f"books/{bid}/art/{pid}.png"] = f"/books/{bid}/art/{pid}.webp"
        for bid_name in book["backs"]:
            catalog[f"books/{bid}/art/{bid_name}.jpg"] = f"/books/{bid}/art/{bid_name}.jpg"
        catalog[f"public/textures/walls/{bid}.jpg"] = f"/textures/walls/{bid}.jpg"
        catalog[f"public/textures/walls/{bid}-normal.jpg"] = f"/textures/walls/{bid}-normal.jpg"
        print("packed", bid)

    cat_path = ROOT / "src/lib/sc-catalog.json"
    data = json.loads(cat_path.read_text())
    data.update(catalog)
    cat_path.write_text(json.dumps(data, indent=2) + "\n")
    print("catalog +", len(catalog), "keys")


if __name__ == "__main__":
    main()
