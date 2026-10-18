import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectFrameClaimConsistency.ts");

test("J9K has sole positive caller-consistency authority with no trusted provenance", () => {
  assert.match(source, /ownsPureCallerClaimConsistencyAuthority: true/);
  for (const label of [
    "ownsEngineEncounterIdentityAuthority", "ownsMonotonicPhysicsFrameAuthority",
    "ownsProjectileIdentityOrLifecycleAuthority", "ownsProjectileConsumptionAuthority",
    "ownsCollisionDetectionOrProvenanceAuthority", "ownsGeometryOrAnchorBindingAuthority",
    "ownsReplayPreventionAuthority", "ownsStructuralTopologyAuthority",
    "ownsTargetEligibilityAuthority", "ownsHitIntentAdmissionAuthority",
    "ownsDurabilitySnapshotAuthority", "ownsDirectHitProposalAuthority",
    "ownsGeometricCandidateAuthority", "ownsCoreOrBossHealthAuthority",
    "ownsDamageCalculationOrApplicationAuthority", "ownsHealthMutationAuthority",
    "ownsDefeatOrRewardAuthority", "ownsPhaseOrTimerAuthority",
    "ownsAttackOrProjectileCreationAuthority", "ownsSpawnOrRematchAuthority",
    "ownsRuntimeOrModeRoutingAuthority", "ownsHudOrPresentationAuthority",
    "ownsPersistenceOrEconomyAuthority", "ownsEntityOrProjectileCollectionAuthority",
    "ownsRandomnessAuthority", "ownsCapOrBudgetAuthority", "ownsFotonOrFormationAuthority",
  ]) assert.match(source, new RegExp(label + ": false"));
  for (const term of ["FRAME_CLAIM_CONSISTENCY_ONLY", "Number.isSafeInteger", "Object.isFrozen",
    "Reflect.ownKeys", "collisionProvenanceVerified: false", "preventsReplay: false",
    "authorizesDamage: false", "mutatesHealth: false"]) assert.ok(source.includes(term), term);
});

test("J9K never integrates live game modes, mutators or past contracts", () => {
  for (const term of [
    "EnergySwarmGame", "bossChassis", "projectilesRef", "shieldNodesRef",
    "setBossHp", "coreExposedTimerRef", "MAX_ENEMIES", "MAX_PROJECTILES",
    "Math.random", "setInterval", "requestAnimationFrame", "registerCombatDefeat",
  ]) assert.doesNotMatch(source, new RegExp(term.replaceAll(".", "\\.")), term);
  for (const path of [
    "src/game/EnergySwarmGame.tsx", "src/game/types.ts", "src/game/bossChassis.ts",
    "src/game/blackoutArchitectStructuralGeometricCandidate.ts",
    "src/game/blackoutArchitectStructuralDirectHitProposal.ts",
    "src/game/blackoutArchitectStructuralDurabilitySnapshot.ts",
  ]) assert.doesNotMatch(read(path), /blackoutArchitectFrameClaimConsistency/, path);
});
