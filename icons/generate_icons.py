# -*- coding: utf-8 -*-
"""توليد أيقونات «اجتماع النقط» بتدرج زمردي ونقطة ذهبية."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "icons")
os.makedirs(OUT, exist_ok=True)

TEAL_TOP = (14, 92, 84)      # #0e5c54
TEAL_BOTTOM = (8, 58, 53)    # #083a35
GOLD = (228, 194, 116)       # #e4c274
GOLD_DIM = (185, 138, 47)    # #b98a2f
FONT = "C:\\Windows\\Fonts\\tradbdo.ttf"


def make_icon(size, letter_ratio, filename):
    img = Image.new("RGB", (size, size), TEAL_BOTTOM)
    draw = ImageDraw.Draw(img)

    # تدرج قطري زمردي.
    for y in range(size):
        t = y / size
        r = int(TEAL_TOP[0] * (1 - t) + TEAL_BOTTOM[0] * t)
        g = int(TEAL_TOP[1] * (1 - t) + TEAL_BOTTOM[1] * t)
        b = int(TEAL_TOP[2] * (1 - t) + TEAL_BOTTOM[2] * t)
        draw.line([(0, y), (size, y)], fill=(r, g, b))

    # حلقة ذهبية رفيعة حول المنتصف (زي الأيقونات الاحترافية).
    ring_w = max(2, size // 64)
    pad_ring = int(size * 0.16)
    draw.ellipse([pad_ring, pad_ring, size - pad_ring, size - pad_ring],
                 outline=GOLD_DIM, width=ring_w)

    # الحرف «ن» بالذهب.
    font_size = int(size * letter_ratio)
    font = ImageFont.truetype(FONT, font_size)
    text = "ن"
    bbox = draw.textbbox((0, 0), text, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - w) / 2 - bbox[0]
    y = (size - h) / 2 - bbox[1] - size * 0.02
    draw.text((x, y), text, font=font, fill=GOLD)

    path = os.path.join(OUT, filename)
    img.save(path, "PNG")
    print("saved", path)


make_icon(192, 0.50, "icon-192.png")
make_icon(512, 0.38, "icon-512.png")      # maskable: مساحة أمان أوسع
make_icon(180, 0.50, "apple-touch-icon.png")
