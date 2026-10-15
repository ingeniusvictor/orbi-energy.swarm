from pathlib import Path
import subprocess

BASE = "1ad68edc1fd15ffa15e1cf6aa139d3d97a547623"
PATH = "docs/ES13_GAMEPLAY_ROADMAP.md"
MARKER = "## J7 — Bonus Challenge Rounds"

current = Path(PATH).read_text()
if MARKER in current:
    raise SystemExit("roadmap already contains J7 suffix; refusing duplicate repair")
base = subprocess.check_output(["git", "show", f"{BASE}:{PATH}"], text=True)
idx = base.find(MARKER)
if idx < 0 or base.find(MARKER, idx + 1) >= 0:
    raise SystemExit("base roadmap J7 marker missing or duplicated")
suffix = base[idx:]
required = [
    "## J8 — Additional Game Modes",
    "## J15 — Gameplay Integration & Long-Range Balance",
    "## ES-14 — Living Warfront",
    "## Manual RC strategy",
    "## Recovery discipline",
]
for marker in required:
    if marker not in suffix:
        raise SystemExit(f"base suffix missing required marker: {marker}")
Path(PATH).write_text(current.rstrip() + "\n\n" + suffix)
