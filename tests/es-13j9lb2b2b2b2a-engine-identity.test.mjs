import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const game = read("src/game/EnergySwarmGame.tsx");
const types = read("src/game/types.ts");
const owner = read("src/game/blackoutArchitectEngineIdentityLifecycle.ts");

test("B2B2B2B2A introduces a unique Architect type, never a Titan or NULL_ARCHITECT alias", () => {
  assert.match(types, /BOSS_ARCHITECT = "BOSS_ARCHITECT"/);
  assert.match(types, /architectBossIdentity\?: "BLACKOUT_ARCHITECT"/);
  assert.match(types, /"NULL_ARCHITECT"/);
  assert.match(types, /BOSS_TITAN = "BOSS_TITAN"/);
  assert.match(owner, /candidate\.type === EnemyType\.BOSS_ARCHITECT/);
  assert.match(owner, /candidate\.architectBossIdentity === "BLACKOUT_ARCHITECT"/);
  assert.match(owner, /candidate\.bossChassis === undefined/);
  assert.match(owner, /candidate\.infiniteBossIdentity === undefined/);
});

test("Private owner is lifecycle-only in the game and no new boss is admitted or routed", () => {
  assert.match(game, /createBlackoutArchitectEngineIdentityLifecycleOwner/);
  assert.match(game, /architectEngineIdentityOwnerRef/);
  assert.equal((game.match(/architectEncounterSlotRef\.current = revokeBlackoutArchitectDormantEncounter\(\);/g) ?? []).length, 7);
  assert.equal((game.match(/architectEngineIdentityOwnerRef\.current\?\.beginRun\(\);/g) ?? []).length, 1);
  assert.equal((game.match(/architectEngineIdentityOwnerRef\.current\?\.invalidateRun\(\);/g) ?? []).length, 1);
  assert.equal((game.match(/architectEngineIdentityOwnerRef\.current\?\.revoke\(\);/g) ?? []).length, 5);
  assert.doesNotMatch(game, /architectEngineIdentityOwnerRef\.current\??\.admitInstalledBoss/);
  assert.doesNotMatch(game, /blackoutArchitectStandaloneCombatBlueprint/);
  assert.doesNotMatch(game, /blackoutArchitectOfflineReferenceAttachment/);
  assert.match(read("src/game/blackoutArchitectDormantEncounterRevocation.ts"), /BlackoutArchitectDormantEncounterSlot = null/);
  assert.match(owner, /"ENGINE_IDENTITY_GUARD_ONLY"/);
  assert.match(owner, /new WeakSet<Enemy>\(\)/);
  assert.match(owner, /enemies\[enemies\.length - 1\] !== candidate/);
  for (const token of [/Math\.random/, /Date\.now/, /setTimeout/, /setInterval/,
    /requestAnimationFrame/, /localStorage/, /projectilesRef/, /shieldNodesRef/,
    /proj\.life\s*=/, /getBossChassisProfile/, /BLACKOUT_DEVOURER_CANON/]) {
    assert.doesNotMatch(owner, token);
  }
});

test("Guard exposes only private epoch/ordinal and reference precondition authority", () => {
  for (const name of [
    "ownsMonotonicPrivateRunEpochAuthority",
    "ownsMonotonicPrivateEncounterOrdinalAuthority",
    "ownsInstalledReferencePreconditionGuardOnly",
  ]) assert.match(owner, new RegExp(name + ": true"), name);
  for (const name of [
    "ownsAutomaticBossSpawnAuthority", "ownsLiveEncounterCertificationAuthority",
    "ownsPhysicalCardinalGeometryAuthority", "ownsAnchorDurabilityAuthority",
    "ownsCollisionOrHitProvenanceAuthority", "ownsProjectileConsumptionAuthority",
    "ownsGlobalReplayProvenanceAuthority", "ownsBossHealthOrDamageAuthority",
    "ownsBossAIOrAttackExecutionAuthority", "ownsBossPhaseOrExposureTimerAuthority",
    "ownsRendererOrHudAuthority", "ownsRuntimeOrModeRoutingAuthority",
    "ownsRewardsOrPersistenceAuthority", "ownsEntityOrProjectileCollectionAuthority",
    "ownsRandomnessOrClockAuthority", "ownsFotonOrFormationAuthority",
    "ownsCapOrBudgetAuthority",
  ]) assert.match(owner, new RegExp(name + ": false"), name);
  assert.match(owner, /actualGameplayEncounterCertified: false/);
  assert.match(owner, /gameplayBossSpawnAuthorized: false/);
});
