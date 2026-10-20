import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const source = read("src/game/blackoutArchitectEncounterClaimPreflight.ts");

test("J9L-B2B1 is exclusively an isolated, untrusted pure claim preflight", () => {
  assert.match(source, /ownsPureCallerClaimPreflightAuthority: true/);
  for (const field of [
    "ownsEngineEncounterIssuanceAuthority",
    "ownsTrustedEncounterIdentityAuthority",
    "ownsEngineLifecycleAuthority",
    "ownsPhysicalAnchorGeometryAuthority",
    "ownsAnchorDurabilityAuthority",
    "ownsCollisionDetectionOrProvenanceAuthority",
    "ownsProjectileIdentityAuthority",
    "ownsProjectileConsumptionAuthority",
    "ownsGlobalReplayPreventionAuthority",
    "ownsBossHealthOrDamageAuthority",
    "ownsBossSpawnAttackOrPhaseAuthority",
    "ownsRuntimeOrModeRoutingAuthority",
    "ownsEconomyOrRewardsAuthority",
    "ownsTimersOrRandomnessAuthority",
    "ownsProjectileOrEntityCollectionAuthority",
    "ownsFotonOrFormationAuthority",
    "ownsCapOrBudgetAuthority",
  ]) assert.match(source, new RegExp(field + ": false"));
  assert.match(source, /preflightMode: "PREFLIGHT_ONLY"/);
  for (const field of [
    "engineEncounterIssued", "trustedEncounterIdentity", "lifecycleFreshnessVerified",
    "physicalAnchorGeometryVerified", "collisionProvenanceVerified",
    "projectileIdentityAuthenticated", "consumesProjectile", "preventsReplay",
    "authorizesDamage", "mutatesHealth", "spawnsBoss", "routesGameMode",
  ]) assert.match(source, new RegExp(field + ": false"));
  for (const forbidden of [
    /Math\.random/, /Date\.now/, /setTimeout/, /setInterval/,
    /requestAnimationFrame/, /new WeakSet/, /new Map/, /new Set/,
    /proj\.life\s*=/, /enemy\.health\s*=/, /setBossHp/,
    /spawnBossShieldNodes/, /shieldNodesRef/, /projectilesRef/,
  ]) assert.doesNotMatch(source, forbidden);
});

test("J9L-B2B1 has no adoption in live or frozen gameplay contracts", () => {
  for (const path of [
    "src/game/EnergySwarmGame.tsx",
    "src/game/types.ts",
    "src/game/blackoutArchitectEncounterShotReservation.ts",
    "src/game/blackoutArchitectLegacyHitObservation.ts",
    "src/game/blackoutArchitectFrameClaimConsistency.ts",
    "src/game/blackoutArchitectStructuralDirectHitProposal.ts",
    "src/game/bossChassis.ts",
  ]) assert.doesNotMatch(read(path), /blackoutArchitectEncounterClaimPreflight/, path);
  assert.doesNotMatch(source, /from "\.\/EnergySwarmGame"|from "\.\/bossChassis"/);
});
