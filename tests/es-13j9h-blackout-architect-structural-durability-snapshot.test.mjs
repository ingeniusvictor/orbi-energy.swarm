import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectStructuralDurabilitySnapshot.ts");

test("J9H is pure bounded external snapshot-to-J9B-facts only", () => {
  assert.match(source, /BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS/);
  assert.match(source, /BlackoutArchitectStructuralAnchorFact/);
  assert.match(source, /SNAPSHOT_ONLY/);
  assert.match(source, /Number\.isFinite/);
  assert.match(source, /Reflect\.ownKeys/);
  for (const forbidden of [
    "bossChassis", "blackoutArchitectChassisSelection", "blackoutArchitectEnemyTypeMapping",
    "runtimeMilestoneEncounter", "runtimeBossRematchGate", "EnergySwarmGame",
    "infiniteRaidEscalation", "getBossChassisProfile", "MAX_ENEMIES", "MAX_PROJECTILES",
    "exposureDurationMs", "setTimeout", "setInterval", "requestAnimationFrame", "Math.random",
  ]) assert.doesNotMatch(source, new RegExp(forbidden.replaceAll(".", "\\.")), forbidden);
});

test("J9H has one positive fact projection authority and no live/health-balance authority", () => {
  assert.match(source, /ownsExternalDurabilitySnapshotFactProjectionAuthority: true/);
  for (const label of [
    "ownsHealthBalanceOrDefaultsAuthority", "ownsCoreOrBossHealthAuthority",
    "ownsLiveHealthMutationAuthority", "ownsDamageCalculationOrApplicationAuthority",
    "ownsHitDetectionOrCollisionAuthority", "ownsStructuralTopologyOrCoreExposureAuthority",
    "ownsTargetEligibilityAuthority", "ownsHitIntentAdmissionAuthority",
    "ownsCoordinateOrGeometryAuthority", "ownsPhaseOrVulnerabilityDurationAuthority",
    "ownsTimerOrClockAuthority", "ownsAttackOrProjectileAuthority",
    "ownsSpawnOrMilestoneAuthority", "ownsRaidOrRematchAuthority",
    "ownsRuntimeAdoptionAuthority", "ownsModeRoutingAuthority", "ownsHudAuthority",
    "ownsRewardOrEconomyAuthority", "ownsPersistenceAuthority",
    "ownsEntityOrProjectileCollectionAuthority", "ownsRandomnessAuthority",
    "ownsCapOrBudgetAuthority", "ownsFotonOrFormationAuthority",
  ]) assert.match(source, new RegExp(label + ": false"));
});

test("J9H has no live runtime, mode or upstream J9 adoption", () => {
  for (const path of [
    "src/game/EnergySwarmGame.tsx",
    "src/game/runtimeMilestoneEncounter.ts",
    "src/game/runtimeBossRematchGate.ts",
    "src/game/runtimeMinibossGate.ts",
    "src/game/infiniteRaidEscalation.ts",
    "src/game/bossChassis.ts",
    "src/game/blackoutArchitectStructuralTopology.ts",
    "src/game/blackoutArchitectStructuralTargetEligibility.ts",
    "src/game/blackoutArchitectStructuralHitIntentAdmission.ts",
  ]) assert.doesNotMatch(read(path), /blackoutArchitectStructuralDurabilitySnapshot/, path);
});
