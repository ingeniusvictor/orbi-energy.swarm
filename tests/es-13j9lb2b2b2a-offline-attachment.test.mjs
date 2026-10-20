import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectOfflineReferenceAttachment.ts");

test("B2B2B2A is isolated from all frozen engine and collision code", () => {
  for (const path of [
    "src/game/EnergySwarmGame.tsx",
    "src/game/types.ts",
    "src/game/bossChassis.ts",
    "src/game/blackoutArchitectDormantEncounterRevocation.ts",
    "src/game/blackoutArchitectOfflineEncounterFactory.ts",
  ]) assert.doesNotMatch(read(path), /blackoutArchitectOfflineReferenceAttachment/, path);
  assert.match(source, /import type \{/);
  assert.match(source, /BlackoutArchitectOfflineCandidateFactory/);
  assert.match(source, /"ATTACHMENT_REHEARSAL_ONLY"/);
  assert.match(source, /"FACTORY_ONLY"/);
  assert.match(source, /factory\.isCurrent\(candidate\)/);
  assert.match(source, /candidateRef === candidate && bossRef === reference/);
  assert.match(source, /Object\.freeze\(\{\s*bossId/);
  for (const x of [/Math\.random/, /Date\.now/, /setTimeout/, /setInterval/,
    /requestAnimationFrame/, /localStorage/, /fetch\(/, /proj\.life\s*=/,
    /projectilesRef/, /enemiesRef/, /shieldNodesRef/, /bossRef\.current/,
    /new (Map|Set|WeakMap|WeakSet)/]) assert.doesNotMatch(source, x);
});

test("All real engine and gameplay authorities are explicit false", () => {
  assert.match(source, /ownsIsolatedReferenceAttachmentRehearsalOnly: true/);
  for (const name of [
    "ownsEngineEncounterIssuanceAuthority", "ownsAuthenticatedLiveBossIdentityAuthority",
    "ownsEngineRunEpochAuthority", "ownsLifecycleFreshnessAuthority",
    "ownsPhysicalCardinalGeometryAuthority", "ownsAnchorDurabilityAuthority",
    "ownsCollisionProvenanceAuthority", "ownsProjectileConsumptionAuthority",
    "ownsGlobalReplayPreventionAuthority", "ownsBossHealthOrDamageAuthority",
    "ownsBossSpawnOrAttackAuthority", "ownsBossPhaseOrExposureAuthority",
    "ownsRuntimeOrModeRoutingAuthority", "ownsRewardsOrPersistenceAuthority",
    "ownsTimerOrRandomnessAuthority", "ownsProjectileOrEntityCollectionAuthority",
    "ownsFotonOrFormationAuthority", "ownsCapOrBudgetAuthority",
  ]) assert.match(source, new RegExp(name + ": false"), name);
  for (const name of [
    "engineEncounterIssued", "authenticatedLiveBossReference", "engineEpochAuthenticated",
    "lifecycleFreshnessCertified", "physicalCardinalGeometryVerified",
    "collisionProvenanceVerified", "projectileConsumptionAuthorized",
    "globalReplayPreventionAuthorized", "bossHealthOrDamageAuthorized",
    "bossSpawnOrAttackAuthorized", "bossPhaseOrExposureAuthorized",
    "runtimeOrModeRoutingAuthorized", "rewardsOrPersistenceAuthorized",
  ]) assert.match(source, new RegExp(name + ": false"), name);
});
