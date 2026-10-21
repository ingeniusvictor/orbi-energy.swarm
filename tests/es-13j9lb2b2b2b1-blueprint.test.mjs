import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectStandaloneCombatBlueprint.ts");
test("B2B2B2B1 pure blueprint never gets imported into the real engine or previous J9 contracts", () => {
  for (const file of [
    "src/game/EnergySwarmGame.tsx", "src/game/types.ts", "src/game/bossChassis.ts",
    "src/game/blackoutArchitectProfileContract.ts",
    "src/game/blackoutArchitectDormantEncounterRevocation.ts",
    "src/game/blackoutArchitectOfflineEncounterFactory.ts",
    "src/game/blackoutArchitectOfflineReferenceAttachment.ts",
  ]) assert.ok(!read(file).includes("blackoutArchitectStandaloneCombatBlueprint"),file);
  assert.ok(source.includes('"BLUEPRINT_ONLY"'));
  assert.ok(source.includes('"PROVISIONAL_UNTUNED"'));
  assert.ok(source.includes('"HYPOTHETICAL_COORDINATES_ONLY"'));
  for (const token of ["Math.random", "Date.now", "setTimeout", "setInterval",
    "requestAnimationFrame", "localStorage", "projectilesRef", "enemiesRef",
    "bossRef.current", "proj.life =", "spawnBoss(", "new WeakSet("]) {
    assert.ok(!source.includes(token), "Forbidden side effect: " + token);
  }
});
test("Authority is strictly for design, not real engine geometry or gameplay", () => {
  assert.ok(source.includes("ownsProvisionalDesignBlueprintOnly: true"));
  for (const key of [
    "ownsEngineEncounterIssuanceAuthority","ownsAuthenticatedLiveBossIdentityAuthority",
    "ownsEngineRunEpochAuthority","ownsPhysicalCardinalGeometryAuthority",
    "ownsAnchorDurabilityMutationAuthority","ownsCollisionOrHitProvenanceAuthority",
    "ownsProjectileConsumptionAuthority","ownsGlobalReplayPreventionAuthority",
    "ownsBossHealthOrDamageMutationAuthority","ownsBossSpawnAuthority",
    "ownsBossAIOrAttackExecutionAuthority","ownsBossPhaseOrExposureTimerAuthority",
    "ownsRuntimeOrModeRoutingAuthority","ownsRenderingOrHudAuthority",
    "ownsRewardsOrPersistenceAuthority","ownsEntityOrProjectileCollectionAuthority",
    "ownsRandomnessOrTimersAuthority","ownsFotonOrFormationAuthority",
    "ownsGlobalCapOrBudgetAuthority",
  ]) assert.ok(source.includes(key + ": false"),key);
  for (const f of ["authenticPhysicalGeometry", "collisionAuthorized",
    "damageAuthorized", "projectileConsumptionAuthorized", "liveBossIssued"]) {
    assert.ok(source.includes(f + ": false"),f);
  }
});
