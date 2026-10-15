from pathlib import Path
import subprocess

OUT = Path(".tmp/es13doc33-smoke-diagnostic.txt")
OUT.parent.mkdir(parents=True, exist_ok=True)

suites = [
    ("repo-mjs", sorted(Path("tests").glob("*.test.mjs")), ["node", "--test"]),
    ("gameplay-ts", sorted(Path("tests/gameplay").glob("*.test.ts")), ["npx", "tsx", "--test"]),
    ("platform-ts", sorted(Path("tests").glob("*.test.ts")), ["npx", "tsx", "--test"]),
]

lines = []
for suite_name, files, prefix in suites:
    lines.append(f"SUITE {suite_name}: {len(files)} files")
    for file in files:
        command = [*prefix, str(file)]
        proc = subprocess.run(command, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        if proc.returncode != 0:
            lines.append(f"FIRST_FAILURE_SUITE={suite_name}")
            lines.append(f"FIRST_FAILURE_FILE={file}")
            lines.append(f"RETURN_CODE={proc.returncode}")
            lines.append("--- OUTPUT START ---")
            lines.append(proc.stdout)
            lines.append("--- OUTPUT END ---")
            OUT.write_text("\n".join(lines))
            raise SystemExit(0)
        lines.append(f"PASS {file}")

lines.append("NO_PER_FILE_FAILURE_FOUND")
lines.append("If aggregate npm test still fails, investigate cross-file or npm-script behavior.")
OUT.write_text("\n".join(lines))
