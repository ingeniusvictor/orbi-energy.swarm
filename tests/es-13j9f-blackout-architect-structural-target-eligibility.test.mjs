import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectStructuralTargetEligibility.ts");

test("J9F composes only frozen J9B target facts and J9E identity mapping", () => {
  assert.match(source, /resolveBlackoutArchitectStructuralTopology/);
  assert.match(source, /BlackoutArchitectEnemyTypeMappingProjection/);
  assert.match(source, /BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS/);
  assert.match(source, /EnemyType\.BOSS_TITAN/);
  assert.doesNotMatch(source, /from "\.\/bossChassis"|from "\.\/infiniteRaidEscalation"|from "\.\/runtimeMilestoneEncounter"/);
  assert.doesNotMatch(source, /from "\.\/blackoutArchitectChassisSelection"|from "\.\/blackoutArchitectChassisCompatibility"/);
});

test("J9F owns eligibility projection only, no live damage/timing/spawn authority", () => {
  assert.match(source, /ownsStructuralTargetEligibilityProjectionAuthority: true/);
  for (const authority of [
    "ownsEnemyTypeMappingAuthority",
    "ownsStructuralTopologyAuthority",
    "ownsChassisSelectionBindingAuthority",
    "ownsDamageOrCollisionAuthority",
    "ownsBossOrWeakpointHealthAuthority",
    "ownsCoordinateOrGeometryAuthority",
    "ownsPhaseOrThresholdAuthority",
    "ownsVulnerabilityDurationAuthority",
    "ownsAttackOrProjectileAuthority",
    "ownsSpawnOrMilestoneAuthority",
    "ownsRuntimeAdoptionAuthority",
    "ownsTimerOrClockAuthority",
    "ownsArenaMutationAuthority",
    "ownsHudAuthority",
    "ownsRewardOrEconomyAuthority",
    "ownsPersistenceAuthority",
    "ownsEntityOrProjectileCollectionAuthority",
    "ownsRandomnessAuthority",
    "ownsCapOrBudgetAuthority",
    "ownsFotonOrFormationAuthority",
  ]) assert.match(source, new RegExp(`${authority}: false`));
  assert.doesNotMatch(source, /setTimeout|setInterval|requestAnimationFrame|Math\.random/);
  assert.doesNotMatch(source, /MAX_ENEMIES|MAX_PROJECTILES|exposureDurationMs/);
});

test("J9F is not live-adopted by boss runtime and mode authority", () => {
  for (const path of [
    "src/game/EnergySwarmGame.tsx",
    "src/game/runtimeMilestoneEncounter.ts",
    "src/game/runtimeBossRematchGate.ts",
    "src/game/infiniteRaidEscalation.ts",
    "src/game/bossChassis.ts",
    "src/game/blackoutArchitectEnemyTypeMapping.ts",
  ]) assert.doesNotMatch(read(path), /blackoutArchitectStructuralTargetEligibility/, path);
});
