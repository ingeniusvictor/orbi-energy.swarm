import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const wall=read("src/game/blackoutArchitectDevQaSectorWallAttack.ts");
test("C7 tri-state attack selection allows exactly one real pattern ref in DEV QA",()=>{
 const selection=game.slice(game.indexOf("const toggleArchitectQaAttackSelection = () => {"),game.indexOf("// --- KEY LISTENER LISTENERS ---"));
 assert.match(selection,/if \(!import\.meta\.env\.DEV/);
 assert.match(selection,/owner\?\.isCurrent\(guard,boss,bossRef\.current,enemiesRef\.current\)/);
 assert.match(selection,/architectQaGridLockRef\.current = null;\s*architectQaVectorTideRef\.current = tide/);
 assert.match(selection,/architectQaVectorTideRef\.current = null;\s*architectQaSectorWallRef\.current = wall/);
 assert.match(selection,/architectQaSectorWallRef\.current = null;\s*architectQaGridLockRef\.current = grid/);
 assert.match(game,/e\.ctrlKey && e\.altKey && e\.shiftKey &&\s*e\.code === "F8"/);
});
test("C7 physical wall runs after QA movement but before player projectile without global physics",()=>{
 const loop=game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
 const qa=loop.slice(loop.indexOf("if (architectQaBossRef.current !== null) {"),
   loop.indexOf("let delta = timestamp - lastTimeRef.current;"));
 const movement=qa.indexOf("stepBlackoutArchitectDevQaFotonMovement(");
 const grid=qa.indexOf("stepBlackoutArchitectDevQaGridLock(");
 const tide=qa.indexOf("stepBlackoutArchitectDevQaVectorTide(");
 const sector=qa.indexOf("stepBlackoutArchitectDevQaSectorWall(");
 const shot=qa.indexOf("const qaShot = architectQaShotRef.current;");
 assert.ok(movement>=0&&grid>movement&&tide>grid&&sector>tide&&shot>sector);
 assert.match(qa,/if \(qaGrid !== null\)/);
 assert.match(qa,/else if \(architectQaVectorTideRef\.current !== null\)/);
 assert.match(qa,/qaWallEvent\?\.qaHullDepleted/);
 assert.doesNotMatch(qa,/updateEnginePhysics\(|detectAndResolveCollisions\(/);
});
test("C7 draw uses same world-space camera as C1 circles; teardown restores original rules",()=>{
 assert.match(game,/const qaWallDraw = architectQaSectorWallRef\.current/);
 assert.match(game,/ctx\.moveTo\(wall\.x - tangentX,wall\.y - tangentY\)/);
 assert.match(game,/ctx\.lineTo\(wall\.x \+ tangentX,wall\.y \+ tangentY\)/);
 assert.match(game,/SECTOR_WALL /);
 assert.match(game,/architectQaSectorWallRef\.current = null/);
 assert.match(game,/QA FOTON HULL:/);
 const clear=game.slice(game.indexOf("const clearArchitectQaDiagnostic = () => {"),game.indexOf("const toggleArchitectQaDiagnostic = () => {"));
 assert.match(clear,/architectQaSectorWallRef\.current = null/);
 assert.match(clear,/architectEngineIdentityOwnerRef\.current\?\.revoke\(\)/);
 assert.equal((game.match(/architectEncounterSlotRef\.current = revokeBlackoutArchitectDormantEncounter\(\);/g)??[]).length,7);
 assert.equal((game.match(/\.admitInstalledBoss\(/g)??[]).length,1);
});
test("C7 dedicated physical eight-wall collisions are authenticated, bounded and do not mutate normal modes",()=>{
 for(const snippet of ["segmentBudget: 8","telegraphMs: 1900","recoveryMs: 9000",
   "state.segments.length!==BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG.segmentBudget",
   "owner.isCurrent(guard,boss,installedBoss,enemies)",
   "state.qaHullHealth=Math.max(0,state.qaHullHealth-damage)",
   "wall.hitRegistered=true"]) assert.ok(wall.includes(snippet),snippet);
 for(const forbidden of ["Math.random(","Date.now(","setTimeout(","setInterval(",
   "projectilesRef","shieldRef","shieldNodesRef","scoreRef",
   "localStorage","runtimeProgressionRef","registerCombatDefeat"]){
   assert.ok(!wall.includes(forbidden),forbidden);
 }
});
