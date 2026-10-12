from pathlib import Path

GAME_PATH = Path("src/game/EnergySwarmGame.tsx")
text = GAME_PATH.read_text(encoding="utf-8")


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"H12 patch aborted: {label} expected exactly once, found {count}")
    return source.replace(old, new, 1)


def replace_between(source: str, start: str, end: str, replacement: str, label: str) -> str:
    start_count = source.count(start)
    end_count = source.count(end)
    if start_count != 1 or end_count != 1:
        raise SystemExit(
            f"H12 patch aborted: {label} markers expected once "
            f"(start={start_count}, end={end_count})"
        )
    start_index = source.index(start)
    end_index = source.index(end, start_index)
    if end_index <= start_index:
        raise SystemExit(f"H12 patch aborted: {label} marker order invalid")
    return source[:start_index] + replacement + source[end_index:]


import_anchor = '''import {
  getFallbackAttackSignatureForAffinity,
  getOrbiAttackProfile,
} from "./orbiAttackProfiles";
'''
import_replacement = import_anchor + '''import {
  applyAffinityFusion,
  consumeAffinityFusionEnergy,
  resolveAffinityFusion,
} from "./affinityFusionDirector";
'''
text = replace_once(text, import_anchor, import_replacement, "fusion director import")

recruit_anchor = '''    const displayRole = combatRole.toUpperCase();
    postDialogue(
      "SYSTEM",
      "+1 ORBI " + energyDefinition.displayName + " // " + energyDefinition.energyLabel.toUpperCase() + " [" + displayRole + "]",
    );
  };

  // --- SYSTEM SHOP UPGRADES ---
'''
recruit_replacement = '''    const displayRole = combatRole.toUpperCase();
    postDialogue(
      "SYSTEM",
      "+1 ORBI " + energyDefinition.displayName + " // " + energyDefinition.energyLabel.toUpperCase() + " [" + displayRole + "]",
    );

    // A full meter may have been waiting for this exact third compatible source.
    tryTriggerAffinityFusion();
  };

  // --- SYSTEM SHOP UPGRADES ---
'''
text = replace_once(text, recruit_anchor, recruit_replacement, "recruitment re-evaluation")

fusion_start = '  // --- TRIGGER FUSION SUMMONS ---\n'
fusion_end = '  // --- WAVE TRANSITIONS DIRECTOR ---\n'
fusion_replacement = '''  // --- AFFINITY FUSION DIRECTOR ---
  const tryTriggerAffinityFusion = () => {
    const resolution = resolveAffinityFusion(
      swarmRef.current,
      fusionEnergyRef.current,
    );
    if (!resolution) return false;

    const fusedMemberId =
      `affinity_fusion_${resolution.recipe.id.toLowerCase()}_${runOrbiAcquiredRef.current + 1}`;
    const applied = applyAffinityFusion(
      swarmRef.current,
      resolution,
      fusedMemberId,
      playerPosRef.current,
    );
    if (!applied) return false;

    // Fusion is contraction-only (3 -> 1), but keep the doctrine boundary
    // fail-closed in case a stale/corrupt runtime roster reaches this helper.
    if (
      applied.members.length >
      getSwarmDoctrineCapacity(swarmDoctrineRef.current)
    ) {
      return false;
    }

    swarmRef.current = applied.members;
    fusionEnergyRef.current = consumeAffinityFusionEnergy(
      fusionEnergyRef.current,
    );

    // Intentionally do NOT register the level-5 fusion body with Swarm Doctrine.
    // Historical source credits stay monotonic; later real level progression can
    // still use the normal registerSwarmDoctrineLevel path.
    runOrbiAcquiredRef.current += 1;
    updateRunMaxSwarmSize();
    playRecruitSound();
    screenShakeRef.current = 15;

    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.FUSION,
      applied.fusedMember.x,
      applied.fusedMember.y,
      applied.fusedMember.color,
      32,
      4.2,
    );
    addFloatingText(
      `FUSION: ${applied.fusedMember.name}`,
      playerPosRef.current.x,
      playerPosRef.current.y - 42,
      applied.fusedMember.color,
    );
    postDialogue(
      "COMPANION",
      `${applied.fusedMember.name} ONLINE // 3→1 AFFINITY FUSION`,
    );
    return true;
  };

'''
text = replace_between(
    text,
    fusion_start,
    fusion_end,
    fusion_replacement,
    "legacy fusion helper",
)

energy_start = '      // Check Fusion triggers\n'
energy_end = '    } else if (res.type === "ORBI") {'
energy_replacement = '''      // H12: a full meter is only consumed when a canonical 3→1 recipe resolves.
      tryTriggerAffinityFusion();
'''
text = replace_between(
    text,
    energy_start,
    energy_end,
    energy_replacement,
    "energy pickup fusion trigger",
)

for forbidden in (
    'const triggerFusion =',
    'triggerFusion("SOLAR")',
    'triggerFusion("HYDRO")',
    'const solarCount =',
    'const hydroCount =',
    'default backup fusion burst',
):
    if forbidden in text:
        raise SystemExit(f"H12 patch aborted: legacy authority remains: {forbidden}")

required = (
    'const tryTriggerAffinityFusion = () =>',
    'resolveAffinityFusion(',
    'applyAffinityFusion(',
    'consumeAffinityFusionEnergy(',
    'tryTriggerAffinityFusion();',
    'getSwarmDoctrineCapacity(swarmDoctrineRef.current)',
)
for marker in required:
    if marker not in text:
        raise SystemExit(f"H12 patch aborted: required runtime marker missing: {marker}")

GAME_PATH.write_text(text, encoding="utf-8")
print("ES-12H12 runtime patch applied successfully")
