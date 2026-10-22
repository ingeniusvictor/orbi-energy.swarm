import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const impact=read("src/game/blackoutArchitectDevQaCardinalImpact.ts");
const geometry=read("src/game/blackoutArchitectDevQaCardinalGeometry.ts");

test("C2 routes a single authentic projectile in DEV QA while old physics stays frozen",()=>{
  assert.match(game,/architectQaShotRef = useRef<Projectile \| null>\(null\)/);
  assert.match(game,/if \(import\.meta\.env\.DEV && architectQaBossRef\.current !== null\)/);
  assert.match(game,/const shot: Projectile = \{/);
  assert.match(game,/projectilesRef\.current\.push\(shot\);\s*architectQaShotRef\.current = shot/);
  assert.match(game,/architectQaShotRef\.current !== null/);
  assert.match(game,/projectilesRef\.current\.length >= MAX_PROJECTILES/);
  const loop=game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
  const qa=loop.indexOf("if (architectQaBossRef.current !== null) {");
  const normal=loop.indexOf("timeElapsedRef.current += delta;");
  assert.ok(qa>=0&&qa<normal);
  const qaBody=loop.slice(qa,normal);
  assert.match(qaBody,/qaShot\.x \+= qaShot\.vx \* \(qaDelta \/ 16\.6\)/);
  assert.match(qaBody,/qaShot\.y \+= qaShot\.vy \* \(qaDelta \/ 16\.6\)/);
  assert.match(qaBody,/resolveBlackoutArchitectDevQaCardinalImpact\(/);
  assert.match(qaBody,/renderCanvasScene\(\);\s*requestAnimationFrame\(gameLoop\);\s*return;/);
  assert.doesNotMatch(qaBody,/updateEnginePhysics\(|detectAndResolveCollisions\(|spawnEnemy\(/);
  assert.match(game,/DEV QA — ARCHITECT ANCHOR HITS · WAVES\/AI FROZEN · CLICK TO FIRE/);
});
test("C2 finite single impact is strictly owner-guarded and only applies to cardinal circle",()=>{
  assert.match(impact,/projectile !== activeQaProjectile/);
  assert.match(impact,/owner\.isCurrent\(guard, installedBoss, installedBoss, enemies\)/);
  assert.match(impact,/geometry\.boss !== installedBoss \|\| geometry\.guard !== guard/);
  assert.match(impact,/projectile\.fromPlayer !== true/);
  assert.match(impact,/projectile\.life <= 0/);
  assert.match(impact,/if \(touched !== null\) return null/);
  assert.match(impact,/if \(anchor\.health === 0\) continue/);
  assert.match(impact,/projectile\.life = 0;\s*touched\.health = Math\.max\(0, touched\.health - damage\)/);
  for(const k of ["ownsCoreDamageOrPhaseAuthority","ownsBossAiOrAttackAuthority",
    "ownsLegacyShieldNodeAuthority","ownsProductionOrModeRoutingAuthority",
    "ownsRewardsOrPersistenceAuthority","ownsGlobalEntityOrProjectileCollectionAuthority",
    "ownsRngOrGlobalClockAuthority","ownsFotonOrFormationAuthority",
    "ownsGlobalCapOrBudgetAuthority"]){
    assert.ok(impact.includes(k+": false"),k);
  }
  for(const banned of ["shieldNodesRef","registerCombatDefeat","boss.health =",
    "Math.random(","Date.now(","localStorage","setTimeout(","getBossChassisProfile"]){
    assert.ok(!impact.includes(banned),banned);
  }
});
test("C2 tears down only the QA shot on all existing paths without touching historical bosses",()=>{
  const clear=game.slice(game.indexOf("const clearArchitectQaDiagnostic = () => {"),
    game.indexOf("const toggleArchitectQaDiagnostic",game.indexOf("const clearArchitectQaDiagnostic")));
  assert.match(clear,/architectQaShotRef\.current = null/);
  assert.match(clear,/const qaShotIndex = projectilesRef\.current\.indexOf\(qaShot\)/);
  assert.match(clear,/projectilesRef\.current\.splice\(qaShotIndex, 1\)/);
  assert.match(clear,/architectQaCardinalsRef\.current = null/);
  assert.match(clear,/architectEngineIdentityOwnerRef\.current\?\.revoke\(\)/);
  assert.equal((game.match(/architectEncounterSlotRef\.current = revokeBlackoutArchitectDormantEncounter\(\);/g)??[]).length,7);
  assert.equal((game.match(/\.admitInstalledBoss\(/g)??[]).length,1);
  assert.match(geometry,/ownsCollisionOrDamageAuthority: false/,"old C1 authority remains historical");
  assert.match(game,/runtimeProgressionRef\.current\.mode !== "CAMPAIGN"/);
});
