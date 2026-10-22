import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const movement=read("src/game/blackoutArchitectDevQaFotonMovement.ts");

test("C4 steps real existing player position only in authenticated QA early-return branch",()=>{
  const loop=game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
  const qaStart=loop.indexOf("if (architectQaBossRef.current !== null) {");
  const normal=loop.indexOf("let delta = timestamp - lastTimeRef.current;",qaStart);
  assert.ok(qaStart>=0&&normal>qaStart);
  const qa=loop.slice(qaStart,normal);
  const guard=qa.indexOf("architectEngineIdentityOwnerRef.current?.isCurrent(");
  const step=qa.indexOf("const qaFotonStep = stepBlackoutArchitectDevQaFotonMovement(");
  const shot=qa.indexOf("const qaShot = architectQaShotRef.current;");
  assert.ok(guard>=0&&guard<step&&step<shot);
  assert.match(qa,/playerPosRef\.current\.x = qaFotonStep\.x;/);
  assert.match(qa,/playerPosRef\.current\.y = qaFotonStep\.y;/);
  assert.match(qa,/keysPressedRef\.current,/);
  assert.match(qa,/touchDirectionsRef\.current,/);
  assert.match(qa,/FORMATIONS\[activeFormationRef\.current\]\.speedMod/);
  assert.match(qa,/resolveBlackoutArchitectDevQaCardinalImpact\(/);
  assert.match(qa,/resolveBlackoutArchitectDevQaCoreImpact\(/);
  assert.match(qa,/renderCanvasScene\(\);\s*requestAnimationFrame\(gameLoop\);\s*return;/);
  assert.doesNotMatch(qa,/updateEnginePhysics\(|detectAndResolveCollisions\(|shootFromSwarm\(|bossAttackTimerRef\.current\s*=/);
});
test("C4 clamps only QA camera and restores original camera on teardown",()=>{
  const qa=game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"),
    game.indexOf("let delta = timestamp - lastTimeRef.current;"));
  for(const token of ["maxQaCamX","maxQaCamY","targetQaCamX","targetQaCamY",
    "qaCamera.cameraX = Math.max","qaCamera.cameraY = Math.max"]){
    assert.ok(qa.includes(token),token);
  }
  const clear=game.slice(game.indexOf("const clearArchitectQaDiagnostic = () => {"),
    game.indexOf("const toggleArchitectQaDiagnostic = () => {"));
  assert.match(clear,/architectQaCameraRestoreRef\.current = null/);
  assert.match(clear,/cameraStateRef\.current\.cameraX = cameraRestore\.cameraX/);
  assert.match(clear,/cameraStateRef\.current\.cameraY = cameraRestore\.cameraY/);
  const install=game.slice(game.indexOf("const toggleArchitectQaDiagnostic = () => {"),
    game.indexOf("// --- KEY LISTENER LISTENERS ---"));
  assert.match(install,/architectQaCameraRestoreRef\.current = \{/);
  assert.ok(install.indexOf("architectQaCardinalsRef.current = cardinalGeometry;") <
    install.indexOf("architectQaCameraRestoreRef.current = {"));
});
test("C4 movement module is pure and never assumes hidden normal-game authority",()=>{
  assert.match(movement,/PLAYER_BASE_SPEED, WORLD_BOUNDS/);
  assert.match(movement,/stepBlackoutArchitectDevQaFotonMovement/);
  assert.match(movement,/length > 0 \? dx \/ length/);
  assert.match(movement,/Math\.max\(WORLD_BOUNDS\.minX/);
  assert.match(movement,/source = "KEYBOARD"/);
  assert.match(movement,/source = "TOUCH_PAD"/);
  for(const banned of ["Math.random(","Date.now(","setTimeout(","requestAnimationFrame(",
    "projectilesRef","enemiesRef","swarmRef","bossRef","shieldNodesRef",
    "scoreRef","nanoCreditsRef","updateEnginePhysics","localStorage",
    "WORLD_WIDTH =","MAX_PROJECTILES ="]){
      assert.ok(!movement.includes(banned),banned);
  }
});
test("C4 preserves all original guard, controlled shot and historic J2 restrictions",()=>{
  assert.equal((game.match(/architectEncounterSlotRef\.current = revokeBlackoutArchitectDormantEncounter\(\);/g)??[]).length,7);
  assert.equal((game.match(/\.admitInstalledBoss\(/g)??[]).length,1);
  assert.match(game,/runtimeProgressionRef\.current\.mode !== "CAMPAIGN"/);
  assert.match(game,/DEV QA — ARCHITECT ANCHOR HITS · WAVES\/AI FROZEN · CLICK TO FIRE/);
  assert.match(game,/WASD \/ ARROWS \/ TOUCH — MOVE FOTON/);
  const j2=game.slice(game.indexOf("const handleOverdriveActivation ="),
    game.indexOf("// --- KEY LISTENER LISTENERS ---"));
  assert.doesNotMatch(j2,/projectilesRef|damageMultiplier|fireRate|scoreRef\.current\s*[+*]=/i);
});
