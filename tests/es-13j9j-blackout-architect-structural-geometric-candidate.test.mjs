import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectStructuralGeometricCandidate.ts");

test("J9J owns exactly pure untrusted geometry candidate resolution, not physical hit authority", () => {
  assert.match(source, /ownsPureCallerGeometryCandidateAuthority: true/);
  for (const label of [
    "ownsPhysicalGeometrySourceAuthority", "ownsProjectileLifecycleAuthority",
    "ownsHitOrCollisionProvenanceAuthority", "ownsTimeFreshnessOrReplayAuthority",
    "ownsDamageCalculationOrApplicationAuthority", "ownsHealthMutationAuthority",
    "ownsStructuralTopologyAuthority", "ownsTargetEligibilityAuthority",
    "ownsHitIntentAdmissionAuthority", "ownsDurabilitySnapshotAuthority",
    "ownsDirectHitProposalAuthority", "ownsCoreOrBossHealthAuthority",
    "ownsCoordinateDefaultsOrPlacementAuthority", "ownsDefeatOrRewardAuthority",
    "ownsPhaseOrTimerAuthority", "ownsAttackOrProjectileCreationAuthority",
    "ownsSpawnOrRematchAuthority", "ownsRuntimeOrModeRoutingAuthority",
    "ownsHudOrPresentationAuthority", "ownsPersistenceOrEconomyAuthority",
    "ownsEntityOrProjectileCollectionAuthority", "ownsRandomnessAuthority",
    "ownsCapOrBudgetAuthority", "ownsFotonOrFormationAuthority",
  ]) assert.match(source, new RegExp(label + ": false"));
  assert.match(source, /GEOMETRIC_CANDIDATE_ONLY/);
  assert.match(source, /Math\.hypot\(dx, dy\)/);
  assert.match(source, /distance < combinedRadius/);
  assert.match(source, /Reflect\.ownKeys/);
  assert.match(source, /geometryProvenanceVerified: false/);
  assert.match(source, /projectileProvenanceVerified: false/);
  assert.match(source, /authorizesDamage: false/);
});

test("J9J cannot import live engine/chassis, copy Titan geometry or change previous contracts", () => {
  for (const term of [
    "EnergySwarmGame", "bossChassis", "getBossChassisProfile",
    "weakpoint", "coreExposedTimerRef", "shieldNodesRef",
    "registerCombatDefeat", "spawnBoss", "setBossHp",
    "MAX_ENEMIES", "MAX_PROJECTILES", "Math.random",
  ]) assert.doesNotMatch(source, new RegExp(term.replaceAll(".", "\\.")), term);
  for (const path of [
    "src/game/EnergySwarmGame.tsx",
    "src/game/bossChassis.ts",
    "src/game/blackoutArchitectStructuralTopology.ts",
    "src/game/blackoutArchitectStructuralDurabilitySnapshot.ts",
    "src/game/blackoutArchitectStructuralDirectHitProposal.ts",
  ]) assert.doesNotMatch(read(path), /blackoutArchitectStructuralGeometricCandidate/, path);
});
