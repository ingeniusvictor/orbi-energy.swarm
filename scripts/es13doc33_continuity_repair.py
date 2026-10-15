from pathlib import Path
import subprocess

BASE = "1ad68edc1fd15ffa15e1cf6aa139d3d97a547623"
PATH = "docs/PROJECT_CONTINUITY.md"
START = "## Resolved diagnostics"
END = "## Gameplay chronology"

current = Path(PATH).read_text()
if START in current or "## Frozen manual/physical blockers" in current:
    raise SystemExit("continuity preservation block already present; refusing duplicate repair")
if current.count(END) != 1:
    raise SystemExit("current continuity gameplay chronology anchor missing or duplicated")

base = subprocess.check_output(["git", "show", f"{BASE}:{PATH}"], text=True)
start = base.find(START)
end = base.find(END)
if start < 0 or end < 0 or end <= start:
    raise SystemExit("base continuity preservation anchors invalid")
block = base[start:end]
for required in ["#254", "#283", "#4", "#5", "#202", "#248", "CI is never a substitute"]:
    if required not in block:
        raise SystemExit(f"base preservation block missing {required}")

current = current.replace(END, block.rstrip() + "\n\n" + END, 1)
Path(PATH).write_text(current)
