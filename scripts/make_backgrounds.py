import os
from PIL import Image

ROOT = r"D:\octopdamao3.0\OctopPet-master"
SRC = os.path.join(ROOT, "tu")
OUT = os.path.join(ROOT, "public", "backgrounds")
TMP = os.path.join(os.environ["TEMP"])
os.makedirs(OUT, exist_ok=True)

files = sorted(f for f in os.listdir(SRC) if f.lower().endswith((".jpg", ".jpeg", ".png")))
TARGET_W = 1080

for i, name in enumerate(files, start=1):
    im = Image.open(os.path.join(SRC, name)).convert("RGB")
    w, h = im.size
    scale = TARGET_W / w
    new = im.resize((TARGET_W, round(h * scale)), Image.LANCZOS)

    out_path = os.path.join(OUT, f"bg{i}.webp")
    new.save(out_path, "WEBP", quality=78, method=6)

    thumb = new.resize((360, round(new.height * 360 / new.width)), Image.LANCZOS)
    thumb_path = os.path.join(TMP, f"thumb{i}.jpg")
    thumb.save(thumb_path, "JPEG", quality=80)

    print(f"bg{i}: {w}x{h} -> {new.width}x{new.height}, "
          f"{os.path.getsize(out_path)//1024} KB, src={name[:12]}")
