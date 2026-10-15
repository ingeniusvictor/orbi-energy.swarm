from pathlib import Path
import re

path = Path("src/game/EnergySwarmGame.tsx")
source = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global source
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly 1 match, got {count}")
    source = source.replace(old, new, 1)


old_import = '''import {
  resolveCommandLinkBreakResolution,
  type CommandLinkBreakResolution,
} from "./commandLinkBreakResolution";
import { shouldDetachCommandLinkMember } from "./liveCommandLinkBreakApplication";'''
new_import = '''import {
  resolveLiveCommandLinkBreakIntent,
  shouldDetachCommandLinkMember,
  type LiveCommandLinkBreakIntent,
} from "./liveCommandLinkBreakApplication";'''
replace_once(old_import, new_import, "J5D direct import boundary")

replace_once(
    "useRef<Readonly<CommandLinkBreakResolution> | null>(null)",
    "useRef<LiveCommandLinkBreakIntent | null>(null)",
    "pending intent type",
)
replace_once(
    "resolveCommandLinkBreakResolution(enemy.enemyFormation)",
    "resolveLiveCommandLinkBreakIntent(enemy.enemyFormation)",
    "defeat-seam resolver",
)

variable_count = source.count("commandLinkBreakResolution")
if variable_count != 3:
    raise RuntimeError(
        "commandLinkBreakResolution local: expected exactly 3 matches after "
        f"import removal, got {variable_count}"
    )
source = source.replace("commandLinkBreakResolution", "commandLinkBreakIntent")

replace_once(
    "const pendingCommandLinkBreak = pendingCommandLinkBreakRef.current;",
    "const pendingCommandLinkBreak = pendingCommandLinkBreakRef.current;\n"
    "      let detachedPendingCommandLink = false;",
    "existing traversal pending snapshot",
)

detach_pattern = re.compile(
    r"(if\s*\(\s*pendingCommandLinkBreak\s*&&\s*shouldDetachCommandLinkMember\(\s*"
    r"pendingCommandLinkBreak,\s*enemy\.enemyFormation,\s*\)\s*\)\s*\{\s*"
    r"enemy\.enemyFormation = undefined;)(\s*\})"
)
source, detach_count = detach_pattern.subn(
    r"\1\n          detachedPendingCommandLink = true;\2",
    source,
    count=1,
)
if detach_count != 1:
    raise RuntimeError(
        f"detach success marker: expected exactly 1 match, got {detach_count}"
    )

clear_pattern = re.compile(
    r"if \(\s*pendingCommandLinkBreak &&\s*"
    r"pendingCommandLinkBreakRef\.current === pendingCommandLinkBreak\s*\) \{\s*"
    r"pendingCommandLinkBreakRef\.current = null;\s*\}"
)
clear_replacement = '''if (
        detachedPendingCommandLink &&
        pendingCommandLinkBreak &&
        pendingCommandLinkBreakRef.current === pendingCommandLinkBreak
      ) {
        pendingCommandLinkBreakRef.current = null;
      }'''
source, clear_count = clear_pattern.subn(clear_replacement, source, count=1)
if clear_count != 1:
    raise RuntimeError(
        f"post-traversal clear guard: expected exactly 1 match, got {clear_count}"
    )

if "commandLinkBreakResolution" in source:
    raise RuntimeError(
        "frozen J5D direct-adoption token remains in EnergySwarmGame.tsx"
    )
if source.count("resolveLiveCommandLinkBreakIntent(enemy.enemyFormation)") != 1:
    raise RuntimeError("live adapter defeat seam is not unique")
if source.count("let detachedPendingCommandLink = false;") != 1:
    raise RuntimeError("detach marker declaration is not unique")
if source.count("detachedPendingCommandLink = true;") != 1:
    raise RuntimeError("detach marker assignment is not unique")

path.write_text(source, encoding="utf-8")
