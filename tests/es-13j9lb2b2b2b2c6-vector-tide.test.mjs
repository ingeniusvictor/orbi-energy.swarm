import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const tide=read("src/game/blackoutArchitectDevQaVectorTideAttack.ts");
const grid=read("src/game/blackoutArchitectDevQaGridLockAttack.ts");
test("C6 exclusive F8 QA attack selection cannot activate normal modes or run both attacks",()=>{
 assert.match(game,/e\.ctrlKey && e\.altKey && e\.shiftKey &&\s*e\.code === "F8"/);
 const selection=game.slice(game.indexOf("const toggleArchitectQaAttackSelection = () => {"),game.indexOf("// --- KEY LISTENER LISTENERS ---"));
 assert.match(selection,/if \(!import\.meta\.env\.DEV/);
 assert.match(selection,/owner\?\.isCurrent\(guard,boss,bossRef\.current,enemiesRef\.current\)/);
 assert.match(selection,/if \(architectQaGridLockRef\.current !== null\)/);
 assert.match(selection,/architectQaGridLockRef\.current = null;\s*architectQaVectorTideRef\.current = tide/);
 assert.match(selection,/architectQaVectorTideRef\.current = null;\s*architectQaSectorWallRef\.current = wall/);
});
test("C6 actual QA FOTON motion and exclusive six-hazard step preserve one player-shot path",()=>{
 const loop=game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
 const qa=loop.slice(loop.indexOf("if (architectQaBossRef.current !== null) {"),
   loop.indexOf("let delta = timestamp - lastTimeRef.current;"));
 const move=qa.indexOf("stepBlackoutArchitectDevQaFotonMovement(");
 const grid=qa.indexOf("stepBlackoutArchitectDevQaGridLock(");
 const tide=qa.indexOf("stepBlackoutArchitectDevQaVectorTide(");
 const shot=qa.indexOf("const qaShot = architectQaShotRef.current;");
 assert.ok(move>=0&&grid>move&&tide>grid&&shot>tide);
 assert.match(qa,/if \(qaGrid !== null\)/);
 assert.match(qa,/qaTideEvent\?\.qaHullDepleted/);
 assert.doesNotMatch(qa,/updateEnginePhysics\(|detectAndResolveCollisions\(/);
});
test("C6 world camera rendering, independent HUD and teardown do not change historical contracts",()=>{
 assert.match(game,/const qaTideDraw = architectQaVectorTideRef\.current/);
 assert.match(game,/ctx\.arc\(bolt\.x,bolt\.y,c\.projectileRadius/);
 assert.match(game,/VECTOR_TIDE /);
 assert.match(game,/architectQaVectorTideRef\.current = null/);
 assert.match(game,/QA FOTON HULL:/);
 assert.equal((game.match(/architectEncounterSlotRef\.current = revokeBlackoutArchitectDormantEncounter\(\);/g)??[]).length,7);
 assert.equal((game.match(/\.admitInstalledBoss\(/g)??[]).length,1);
 assert.match(grid,/ownsSingleCycleQaHullCollisionAndDamage: true/);
});
test("C6 dedicated state has exactly six own hazards and no shared collection or global authority",()=>{
 for(const fragment of ["projectileBudget: 6","telegraphMs: 1700","recoveryMs: 7500",
   "state.bolts.length !== BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.projectileBudget",
   "bolt.spent=true;","state.qaHullHealth=Math.max(0,state.qaHullHealth-damage)",
   "owner.isCurrent(guard,candidate,boss,enemies)"])assert.ok(tide.includes(fragment),fragment);
 for(const banned of ["Math.random(","Date.now(","setTimeout(","setInterval(",
   "projectilesRef","shieldRef","shieldNodesRef","scoreRef","localStorage",
   "runtimeProgressionRef","registerCombatDefeat"]){
   assert.ok(!tide.includes(banned),banned);
 }
});
