from pathlib import Path
import re

path = Path("src/game/EnergySwarmGame.tsx")
text = path.read_text(encoding="utf-8")

# Imports: keep frozen contracts unchanged and consume them from the live adapter only.
import_anchor = '''import {
  createLiveEnemyFormationDirectorState,
  projectLiveEnemyFormationMotion,
  requestLiveEnemyFormationSpawn,
} from "./liveEnemyFormationDirector";
'''
import_insert = import_anchor + '''import {
  resolveCommandLinkBreakResolution,
  type CommandLinkBreakResolution,
} from "./commandLinkBreakResolution";
import { shouldDetachCommandLinkMember } from "./liveCommandLinkBreakApplication";
'''
if text.count(import_anchor) != 1:
    raise RuntimeError(f"import anchor count != 1: {text.count(import_anchor)}")
if "liveCommandLinkBreakApplication" in text or "resolveCommandLinkBreakResolution" in text:
    raise RuntimeError("J5E live imports already present")
text = text.replace(import_anchor, import_insert, 1)

# One scalar pending intent slot adjacent to the existing J3 director ref.
ref_anchor = '''  const enemyFormationDirectorRef = useRef(
    createLiveEnemyFormationDirectorState(),
  );
'''
ref_insert = ref_anchor + '''  const pendingCommandLinkBreakRef =
    useRef<Readonly<CommandLinkBreakResolution> | null>(null);
'''
if text.count(ref_anchor) != 1:
    raise RuntimeError(f"director ref anchor count != 1: {text.count(ref_anchor)}")
text = text.replace(ref_anchor, ref_insert, 1)

# Centralized defeat authority raises at most one immutable pending J5D resolution.
defeat_anchor = '''  const registerCombatDefeat = (enemy: Enemy, affinity?: OrbiAffinity) => {
    const resolution = registerCombatResonanceDefeat(
'''
defeat_insert = '''  const registerCombatDefeat = (enemy: Enemy, affinity?: OrbiAffinity) => {
    const commandLinkBreakResolution = enemy.enemyFormation
      ? resolveCommandLinkBreakResolution(enemy.enemyFormation)
      : null;
    if (commandLinkBreakResolution) {
      pendingCommandLinkBreakRef.current = commandLinkBreakResolution;
    }

    const resolution = registerCombatResonanceDefeat(
'''
if text.count(defeat_anchor) != 1:
    raise RuntimeError(f"registerCombatDefeat anchor count != 1: {text.count(defeat_anchor)}")
text = text.replace(defeat_anchor, defeat_insert, 1)

# Capture exactly one pending intent before the already-existing enemy iteration.
loop_anchor = '''    enemiesRef.current.forEach((enemy) => {
      if (enemy.isDead) return;

      const signatureBehavior =
'''
loop_insert = '''    const pendingCommandLinkBreak = pendingCommandLinkBreakRef.current;

    enemiesRef.current.forEach((enemy) => {
      if (enemy.isDead) return;

      if (
        shouldDetachCommandLinkMember(
          pendingCommandLinkBreak,
          enemy.enemyFormation,
        )
      ) {
        enemy.enemyFormation = undefined;
      }

      const signatureBehavior =
'''
if text.count(loop_anchor) != 1:
    raise RuntimeError(f"enemy loop anchor count != 1: {text.count(loop_anchor)}")
text = text.replace(loop_anchor, loop_insert, 1)

# Consume only the captured object. A newer intent, if one somehow appears, survives.
post_loop_anchor = '''    // 7. Projectiles coordinates
'''
post_loop_insert = '''    if (
      pendingCommandLinkBreak &&
      pendingCommandLinkBreakRef.current === pendingCommandLinkBreak
    ) {
      pendingCommandLinkBreakRef.current = null;
    }

    // 7. Projectiles coordinates
'''
if text.count(post_loop_anchor) != 1:
    raise RuntimeError(f"post-loop anchor count != 1: {text.count(post_loop_anchor)}")
text = text.replace(post_loop_anchor, post_loop_insert, 1)

# Mirror every existing director reset exactly; do not create any new lifecycle authority.
reset_pattern = re.compile(
    r'(?m)^(?P<indent>[ ]*)enemyFormationDirectorRef\.current =\n'
    r'(?P=indent)  createLiveEnemyFormationDirectorState\(\);$'
)
reset_matches = list(reset_pattern.finditer(text))
if len(reset_matches) != 3:
    raise RuntimeError(f"expected exactly 3 director resets, found {len(reset_matches)}")

def add_pending_reset(match: re.Match[str]) -> str:
    indent = match.group("indent")
    return match.group(0) + f"\n{indent}pendingCommandLinkBreakRef.current = null;"

text = reset_pattern.sub(add_pending_reset, text)

# Fail closed on accidental duplicate scans/refs.
if text.count("enemiesRef.current.forEach((enemy) => {") != 1:
    raise RuntimeError("J5E must preserve exactly one enemy forEach loop")
if text.count("pendingCommandLinkBreakRef =") != 1:
    raise RuntimeError("J5E must own exactly one pending scalar ref")
if text.count("pendingCommandLinkBreakRef.current = null;") != 4:
    raise RuntimeError("expected 3 lifecycle resets plus 1 guarded consume")

path.write_text(text, encoding="utf-8")
print("ES-13J5E live adapter patch applied with exact anchors.")
