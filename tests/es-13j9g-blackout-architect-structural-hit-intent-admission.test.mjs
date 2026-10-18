import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectStructuralHitIntentAdmission.ts");

test("J9G consumes only frozen J9F eligibility and canonical J9B anchor identifiers", () => {
  assert.match(source, /BlackoutArchitectStructuralTargetEligibilityProjection/);
  assert.match(source, /BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS/);
  assert.match(source, /EnemyType\.BOSS_TITAN/);
  for (const forbidden of [
    "bossChassis", "blackoutArchitectChassisSelection", "blackoutArchitectChassisCompatibility",
    "runtimeMilestoneEncounter", "runtimeBossRematchGate", "infiniteRaidEscalation",
    "EnergySwarmGame", "getBossChassisProfile", "resolveBlackoutArchitectStructuralTopology",
  ]) assert.doesNotMatch(source, new RegExp(forbidden), forbidden);
});

test("J9G owns abstract intent admission only, not combat execution", () => {
  assert.match(source, /ownsAbstractStructuralHitIntentAdmissionAuthority: true/);
  const authorityNames = [
    "ownsStructuralTargetEligibilityProjectionAuthority", "ownsStructuralTopologyAuthority",
    "ownsEnemyTypeMappingAuthority", "ownsChassisSelectionBindingAuthority",
    "ownsHitDetectionOrCollisionAuthority", "ownsDamageApplicationOrFormulaAuthority",
    "ownsBossOrWeakpointHealthAuthority", "ownsCoordinateOrGeometryAuthority",
    "ownsPhaseOrThresholdAuthority", "ownsVulnerabilityDurationAuthority",
    "ownsAttackOrProjectileAuthority", "ownsSpawnOrMilestoneAuthority",
    "ownsRaidOrRematchAuthority", "ownsRuntimeAdoptionAuthority",
    "ownsModeRoutingAuthority", "ownsTimerOrClockAuthority", "ownsArenaMutationAuthority",
    "ownsHudAuthority", "ownsRewardOrEconomyAuthority", "ownsPersistenceAuthority",
    "ownsEntityOrProjectileCollectionAuthority", "ownsRandomnessAuthority",
    "ownsCapOrBudgetAuthority", "ownsFotonOrFormationAuthority",
  ];
  for (const name of authorityNames) assert.match(source, new RegExp(name + ": false"));
  for (const forbidden of [
    "setTimeout", "setInterval", "requestAnimationFrame", "Math.random",
    "MAX_ENEMIES", "MAX_PROJECTILES", "exposureDurationMs",
    "6000", "damageMultiplier", "healthMultiplier",
  ]) assert.doesNotMatch(source, new RegExp(forbidden.replace(".", "\\.")), forbidden);
});

test("J9G has no live runtime or mode adoption", () => {
  for (const path of [
    "src/game/EnergySwarmGame.tsx",
    "src/game/runtimeMilestoneEncounter.ts",
    "src/game/runtimeBossRematchGate.ts",
    "src/game/runtimeMinibossGate.ts",
    "src/game/infiniteRaidEscalation.ts",
    "src/game/bossChassis.ts",
    "src/game/blackoutArchitectStructuralTargetEligibility.ts",
  ]) assert.doesNotMatch(
    read(path), /blackoutArchitectStructuralHitIntentAdmission/, path,
  );
});
