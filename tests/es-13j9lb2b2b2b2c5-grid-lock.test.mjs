import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const grid=read("src/game/blackoutArchitectDevQaGridLockAttack.ts");
const c3=read("src/game/blackoutArchitectDevQaCoreImpact.ts");

test("C5 installs attack only after genuine Architect QA and physical four-cardinal admission",()=>{
  const a=game.indexOf("const toggleArchitectQaDiagnostic = () => {");
  const b=game.indexOf("// --- KEY LISTENER LISTENERS ---",a);
  const install=game.slice(a,b);
  const geom=install.indexOf("architectQaCardinalsRef.current = cardinalGeometry;");
  const attack=install.indexOf("const initialGridLock = createBlackoutArchitectDevQaGridLockState(",geom);
  const state=install.indexOf("architectQaGridLockRef.current = initialGridLock;",attack);
  assert.ok(a>=0&&b>a&&geom>=0&&attack>geom&&state>attack);
  assert.match(install,/if \(initialGridLock === null\) \{\s*clearArchitectQaDiagnostic\(\);\s*return;/);
  assert.match(install,/architectQaCameraRestoreRef\.current = \{/);
});
test("C5 steps physical GRID_LOCK after real QA FOTON movement, before current one-shot colliders",()=>{
  const loop=game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
  const qa=loop.slice(loop.indexOf("if (architectQaBossRef.current !== null) {"),
     loop.indexOf("let delta = timestamp - lastTimeRef.current;"));
  const move=qa.indexOf("const qaFotonStep = stepBlackoutArchitectDevQaFotonMovement(");
  const hit=qa.indexOf("const qaGridEvent = stepBlackoutArchitectDevQaGridLock(");
  const shot=qa.indexOf("const qaShot = architectQaShotRef.current;");
  assert.ok(move>=0&&hit>move&&shot>hit);
  assert.match(qa,/qaGridEvent === null \|\| qaGridEvent\.qaHullDepleted/);
  assert.match(qa,/clearArchitectQaDiagnostic\(\);\s*if \(qaGridEvent\?\.qaHullDepleted\) setArchitectQaLossVisible\(true\)/);
  assert.match(qa,/resolveBlackoutArchitectDevQaCardinalImpact\(/);
  assert.match(qa,/resolveBlackoutArchitectDevQaCoreImpact\(/);
  assert.doesNotMatch(qa,/updateEnginePhysics\(|detectAndResolveCollisions\(|registerCombatDefeat\(/);
});
test("C5 physically renders telegraphed and active intersecting lanes in camera space",()=>{
  const render=game.slice(game.indexOf("const renderCanvasScene = () => {"));
  assert.match(render,/const liveQaGrid = architectQaGridLockRef\.current/);
  assert.match(render,/liveQaGrid\.boss === bossRef\.current/);
  assert.match(render,/liveQaGrid\.phase === "TELEGRAPH" \|\| liveQaGrid\.phase === "ACTIVE"/);
  assert.match(render,/ctx\.fillRect\(gridBoss\.x - gridCfg\.halfWidth/);
  assert.match(render,/ctx\.fillRect\(gridBoss\.x - gridCfg\.extent/);
  assert.match(render,/GRID_LOCK /);
  assert.match(render,/QA FOTON HULL:/);
  assert.ok(render.indexOf("const liveQaGrid =") > render.indexOf("ctx.scale(cameraStateRef.current.zoom"));
  assert.match(game,/DEV QA FAILED — ARCHITECT ATTACK HULL 0 HP · NO GLOBAL GAME OVER/);
});
test("C5 private reference and bounded single-strike module has no global state mutation",()=>{
  assert.match(grid,/owner\.isCurrent\(guard,boss,installedBoss,enemies\)/);
  assert.match(grid,/state !== activeQaState/);
  assert.match(grid,/state\.hitRegistered = true/);
  assert.match(grid,/state\.qaHullHealth = Math\.max\(0,state\.qaHullHealth - damageApplied\)/);
  assert.match(grid,/const hitVertical =/);
  assert.match(grid,/const hitHorizontal =/);
  assert.match(grid,/if \(hitVertical \|\| hitHorizontal\)/);
  for(const forbidden of ["Math.random(","Date.now(","performance.now(",
    "requestAnimationFrame(","setTimeout(","shieldRef","scoreRef","bossActiveRef",
    "projectilesRef","enemiesRef","localStorage","updateEnginePhysics",
    "registerCombatDefeat","getBossChassisProfile"]){
    assert.ok(!grid.includes(forbidden),forbidden);
  }
});
test("C5 keeps historical null slot, J2, Architect core and other bosses isolated",()=>{
  assert.equal((game.match(/architectEncounterSlotRef\.current = revokeBlackoutArchitectDormantEncounter\(\);/g)??[]).length,7);
  assert.equal((game.match(/\.admitInstalledBoss\(/g)??[]).length,1);
  assert.match(game,/runtimeProgressionRef\.current\.mode !== "CAMPAIGN"/);
  assert.match(game,/DEV QA — ARCHITECT ANCHOR HITS · WAVES\/AI FROZEN · CLICK TO FIRE/);
  const handler=game.slice(game.indexOf("const handleOverdriveActivation ="),
    game.indexOf("// --- KEY LISTENER LISTENERS ---"));
  assert.doesNotMatch(handler,/projectilesRef|damageMultiplier|fireRate|scoreRef\.current\s*[+*]=/i);
  assert.match(c3,/boss\.health = Math\.max\(0,boss\.health-damage\)/);
  assert.match(game,/architectQaGridLockRef\.current = null/);
});
