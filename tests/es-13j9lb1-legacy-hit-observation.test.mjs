import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const game = read("src/game/EnergySwarmGame.tsx");
const types = read("src/game/types.ts");
const source = read("src/game/blackoutArchitectLegacyHitObservation.ts");

test("J9L-B1 grants only passive legacy observation, never new collision or health authority", () => {
  assert.match(source,/ownsPassiveLegacyPlayerHitObservationAuthority: true/);
  for (const name of [
    "ownsNewCollisionDetectionAuthority","ownsTrustedHitProvenanceAuthority",
    "ownsCardinalAnchorBindingAuthority","ownsExactOnceEncounterLedgerAuthority",
    "ownsDamageOrHealthMutationAuthority","ownsProjectileLifecycleOrConsumptionAuthority",
    "ownsBossSpawnAttackOrPhaseAuthority","ownsModeEconomyOrRewardsAuthority",
    "ownsRandomnessOrEntityCollectionAuthority","ownsFotonCapOrBudgetAuthority",
  ]) assert.match(source,new RegExp(name+": false"));
  for(const token of ["Math.random","new Map","new Set","proj.life = 0","enemy.health","node.health","setBossHp","coreExposedTimerRef"])
    assert.ok(!source.includes(token),token);
  for(const field of ["collisionTraceObservedLegacyHitFrame","collisionTraceObservedLegacyHitKind"])
    assert.ok(types.includes(field+"?:"),field);
});

test("J9L-B1 observes strictly AFTER legacy consumption in two player-only branches", () => {
  const loop=game.slice(game.indexOf("const detectAndResolveCollisions = "),game.indexOf("// 2. ENEMIES CONTACT DAMAGE vs PLAYER CORE"));
  const shield=loop.indexOf('observeBlackoutArchitectLegacyPlayerHit(\n              proj, collisionTraceRunEpochRef.current,\n              collisionTracePhysicsFrameRef.current, "LEGACY_SHIELD_NODE",');
  const enemy=loop.indexOf('observeBlackoutArchitectLegacyPlayerHit(\n              proj, collisionTraceRunEpochRef.current,\n              collisionTracePhysicsFrameRef.current, "LEGACY_ENEMY",');
  assert.ok(shield>0 && enemy>shield);
  const shieldConsume=loop.lastIndexOf("proj.life = 0;",shield);
  const enemyConsume=loop.lastIndexOf("proj.life = 0;",enemy);
  assert.ok(shieldConsume<shield&&enemyConsume>shield&&enemyConsume<enemy);
  assert.ok(loop.indexOf("hitShieldNode = true;",shield)>shield);
  assert.ok(loop.indexOf("node.health -= proj.damage;",shield)>shield);
  assert.ok(loop.indexOf("enemy.health -= damageToApply;",enemy)>enemy);
  assert.equal((loop.match(/observeBlackoutArchitectLegacyPlayerHit\(/g)||[]).length,2);
  // Third consumption belongs to incoming enemy projectiles; it is never observed.
  assert.equal((loop.match(/proj.life = 0;/g)||[]).length,3);
  const incomingConsume = loop.indexOf("proj.life = 0; // Destroy projectile");
  assert.ok(incomingConsume > enemy);
  assert.doesNotMatch(loop.slice(incomingConsume), /observeBlackoutArchitectLegacyPlayerHit\(/);
  const create=game.slice(game.indexOf("const makeProjectile = ("),game.indexOf("projectilesRef.current.push(makeProjectile(baseAngle))"));
  assert.match(create,/id: Math\.random\(\)\.toString\(\)/);
  assert.doesNotMatch(create,/collisionTraceObservedLegacyHit/);
  assert.doesNotMatch(game.slice(game.indexOf("const shootFromEnemy ="),game.indexOf("const getEnemyScoreReward =")) ,/observeBlackoutArchitectLegacyPlayerHit/);
});

test("J9L-B1 cannot pull untrusted J9 claims into live combat", () => {
  for(const term of [
    "blackoutArchitectStructuralGeometricCandidate",
    "blackoutArchitectFrameClaimConsistency",
    "blackoutArchitectStructuralDirectHitProposal",
    "BLACKOUT_ARCHITECT_STRUCTURAL",
  ]) assert.doesNotMatch(source,new RegExp(term));
  for(const path of [
    "src/game/blackoutArchitectCollisionTraceOrdinal.ts",
    "src/game/blackoutArchitectStructuralGeometricCandidate.ts",
    "src/game/blackoutArchitectFrameClaimConsistency.ts",
    "src/game/bossChassis.ts",
  ]) assert.doesNotMatch(read(path),/observeBlackoutArchitectLegacyPlayerHit/);
});
