import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectStructuralDirectHitProposal.ts");

test("J9I has one positive non-executable arithmetic proposal authority", () => {
  assert.match(source, /ownsPureDirectHitArithmeticProposalAuthority: true/);
  const negatives = [
    "ownsSourceCaptureOrHitProvenanceAuthority", "ownsCollisionOrGeometryAuthority",
    "ownsHealthDefaultsOrTuningAuthority", "ownsHealthMutationAuthority",
    "ownsDamageSourceResolutionAuthority", "ownsActualHitAuthorizationAuthority",
    "ownsStructuralTopologyOrExposureAuthority", "ownsTargetEligibilityAuthority",
    "ownsHitIntentAdmissionAuthority", "ownsDurabilitySnapshotAuthority",
    "ownsCoreOrBossHealthAuthority", "ownsDefeatOrRewardAuthority",
    "ownsPhaseOrTimerAuthority", "ownsAttackOrProjectileAuthority",
    "ownsSpawnOrRematchAuthority", "ownsRuntimeOrModeRoutingAuthority",
    "ownsHudOrPresentationAuthority", "ownsPersistenceOrEconomyAuthority",
    "ownsEntityOrProjectileCollectionAuthority", "ownsRandomnessAuthority",
    "ownsCapOrBudgetAuthority", "ownsFotonOrFormationAuthority",
  ];
  for (const negative of negatives) assert.match(source, new RegExp(negative + ": false"));
  assert.match(source, /PROPOSAL_ONLY/);
  assert.match(source, /DIRECT_PLAYER_PROJECTILE_CLAIM/);
  assert.match(source, /resolveBlackoutArchitectStructuralDurabilitySnapshot/);
  assert.match(source, /!Object\.isFrozen\(input\)/);
  assert.match(source, /Math\.min\(resolvedDamage, currentHealth\)/);
  assert.match(source, /remainingHealth >= currentHealth/);
});

test("J9I owns no existing combat engine, boss config, global or mode surface", () => {
  for (const term of [
    "EnergySwarmGame", "bossChassis", "getBossChassisProfile", "getBossChassisAttackWeight",
    "setBossHp", "coreExposedTimerRef", "shieldNodesRef", "registerCombatDefeat",
    "spawnBoss", "runtimeBossRematchGate", "MAX_ENEMIES", "MAX_PROJECTILES",
    "setTimeout", "setInterval", "requestAnimationFrame", "Math.random",
  ]) assert.doesNotMatch(source, new RegExp(term.replaceAll(".", "\\.")), term);
  for (const file of [
    "src/game/EnergySwarmGame.tsx",
    "src/game/bossChassis.ts",
    "src/game/blackoutArchitectStructuralHitIntentAdmission.ts",
    "src/game/blackoutArchitectStructuralDurabilitySnapshot.ts",
  ]) assert.doesNotMatch(read(file), /blackoutArchitectStructuralDirectHitProposal/, file);
});
