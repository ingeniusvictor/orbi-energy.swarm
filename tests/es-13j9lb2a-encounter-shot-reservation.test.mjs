import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const source=read("src/game/blackoutArchitectEncounterShotReservation.ts");

test("J9L-B2A has only in-memory same-reference reservation authority",()=>{
  assert.match(source,/ownsIsolatedReferenceReservationAuthority: true/);
  for (const key of [
    "ownsEngineEncounterIssuanceAuthority","ownsTrustedProjectileIdentityAuthority",
    "ownsPhysicalAnchorGeometryAuthority","ownsCollisionDetectionOrProvenanceAuthority",
    "ownsProjectileConsumptionAuthority","ownsGlobalReplayPreventionAuthority",
    "ownsBossHealthOrDamageAuthority","ownsHitIntentAdmissionAuthority",
    "ownsDirectHitProposalAdoptionAuthority","ownsBossSpawnOrAttackAuthority",
    "ownsRuntimeOrModeRoutingAuthority","ownsProjectileCollectionAuthority",
    "ownsRandomnessAuthority","ownsCapOrBudgetAuthority","ownsFotonOrFormationAuthority",
  ])assert.match(source,new RegExp(key+": false"));
  assert.match(source,/new WeakSet<object>\(\)/);
  assert.match(source,/reservedProjectiles\.has\(projectile\)/);
  assert.match(source,/reservedProjectiles\.add\(projectile\)/);
  assert.match(source,/preventsGlobalReplay: false/);
  assert.match(source,/collisionProvenanceVerified: false/);
  assert.match(source,/consumesProjectile: false/);
  assert.doesNotMatch(source,/Math\.random|requestAnimationFrame|setInterval|setTimeout|\bnew Map\b|\bnew Set\b/);
});

test("J9L-B2A is not wired to live game, prior damage modules or lifecycle",()=>{
  for(const path of [
    "src/game/EnergySwarmGame.tsx","src/game/types.ts",
    "src/game/blackoutArchitectLegacyHitObservation.ts",
    "src/game/blackoutArchitectStructuralDirectHitProposal.ts",
    "src/game/blackoutArchitectFrameClaimConsistency.ts",
    "src/game/bossChassis.ts",
  ]) assert.doesNotMatch(read(path),/blackoutArchitectEncounterShotReservation/,path);
  assert.doesNotMatch(source,/from "\.\/EnergySwarmGame"|from "\.\/bossChassis"|registerCombatDefeat|setBossHp|coreExposedTimerRef|projectilesRef|shieldNodesRef|MAX_PROJECTILES|MAX_ENEMIES/);
});
