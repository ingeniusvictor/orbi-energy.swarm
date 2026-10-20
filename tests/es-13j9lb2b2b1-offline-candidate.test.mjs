import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectOfflineEncounterFactory.ts");

test("B2B2B1 factory is offline only and all live/physical authority false", () => {
  assert.match(source, /ownsIsolatedOfflineCandidateConstructionOnly: true/);
  for (const key of [
    "ownsEngineEncounterIssuanceAuthority", "ownsAuthenticatedLiveBossIdentityAuthority",
    "ownsPhysicalCardinalGeometryAuthority", "ownsAnchorDurabilityAuthority",
    "ownsCollisionProvenanceAuthority", "ownsProjectileConsumptionAuthority",
    "ownsGlobalReplayPreventionAuthority", "ownsBossHealthOrDamageAuthority",
    "ownsBossSpawnOrAttackAuthority", "ownsBossPhaseOrExposureAuthority",
    "ownsRuntimeOrModeRoutingAuthority", "ownsRewardsOrPersistenceAuthority",
    "ownsTimersOrRandomnessAuthority", "ownsProjectileOrEntityCollectionAuthority",
    "ownsFotonOrFormationAuthority", "ownsCapOrBudgetAuthority"
  ]) assert.match(source, new RegExp(key + ": false"), key);
  assert.match(source, /candidateMode: "FACTORY_ONLY"/);
  assert.match(source, /bossId: "BLACKOUT_ARCHITECT"/);
  assert.match(source, /current !== null && candidate === current/);
  assert.match(source, /current = null;\s*if \(!isPositiveSafeOrdinal\(runEpoch\)\)/);
  for (const forbidden of [
    /Math\.random\(/, /Date\.now\(/, /performance\.now\(/, /setTimeout\(/,
    /setInterval\(/, /requestAnimationFrame\(/, /new (WeakSet|Set|Map)\(/,
    /from ["']\.\/types["']/, /from ["']\.\/bossChassis["']/,
    /EnemyType\./, /NULL_ARCHITECT/, /proj\.life\s*=/,
    /shieldNodesRef|enemiesRef|projectilesRef|spawnBoss\(/
  ]) assert.doesNotMatch(source, forbidden);
});

test("No offline factory is imported or consumed by live engine or frozen contracts", () => {
  for (const path of [
    "src/game/EnergySwarmGame.tsx",
    "src/game/types.ts",
    "src/game/bossChassis.ts",
    "src/game/blackoutArchitectDormantEncounterRevocation.ts",
    "src/game/blackoutArchitectEncounterClaimPreflight.ts",
    "src/game/blackoutArchitectEncounterShotReservation.ts",
  ]) assert.doesNotMatch(read(path), /blackoutArchitectOfflineEncounterFactory/, path);
});
