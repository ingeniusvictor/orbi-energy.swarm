import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const director=read("src/game/blackoutArchitectDevQaPatternDirector.ts");

test("C8 new real phase director remains explicit DEV QA and not normal routing",()=>{
  const qa=game.slice(game.indexOf("const clearArchitectQaDiagnostic = () => {"),
    game.indexOf("// --- KEY LISTENER LISTENERS ---"));
  assert.match(qa,/architectQaDirectorRef\.current = null/);
  assert.match(qa,/if \(!import\.meta\.env\.DEV/);
  assert.match(qa,/owner\?\.isCurrent\(guard,boss,bossRef\.current,enemiesRef\.current\)/);
  assert.match(qa,/createBlackoutArchitectDevQaPatternDirector\(/);
  assert.match(qa,/architectQaDirectorRef\.current !== null\) return/);
  assert.match(game,/e\.ctrlKey && e\.altKey && e\.shiftKey &&\s*e\.code === "F7"/);
  assert.match(game,/e\.ctrlKey && e\.altKey && e\.shiftKey &&\s*e\.code === "F8"/);
  assert.match(game,/e\.ctrlKey && e\.altKey && e\.shiftKey &&\s*e\.code === "F9"/);
});
test("C8 game loop consumes actual three physical attack events, then safe single handoff",()=>{
  const loop=game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
  const frozen=loop.slice(loop.indexOf("if (architectQaBossRef.current !== null) {"),
    loop.indexOf("let delta = timestamp - lastTimeRef.current;"));
  const grid=frozen.indexOf("stepBlackoutArchitectDevQaGridLock(");
  const tide=frozen.indexOf("stepBlackoutArchitectDevQaVectorTide(");
  const wall=frozen.indexOf("stepBlackoutArchitectDevQaSectorWall(");
  const plan=frozen.indexOf("stepBlackoutArchitectDevQaPatternDirector(");
  const shot=frozen.indexOf("const qaShot = architectQaShotRef.current;");
  assert.ok(grid>=0&&tide>grid&&wall>tide&&plan>wall&&shot>plan);
  assert.match(frozen,/plan\.nextPattern!==null/);
  assert.match(frozen,/next\.qaHullHealth=plan\.qaHullHealth/);
  assert.match(frozen,/architectQaGridLockRef\.current=null;\s*architectQaVectorTideRef\.current=null;\s*architectQaSectorWallRef\.current=null/);
  assert.doesNotMatch(frozen,/updateEnginePhysics\(|detectAndResolveCollisions\(/);
});
test("C8 phase eligibility derives from live cardinal HP and core fraction, no timers/RNG",()=>{
  assert.match(director,/geometry\.anchors\.some\(a=>a\.health>0\)/);
  assert.match(director,/const fraction=boss\.health\/boss\.maxHealth/);
  assert.match(director,/thresholdPhase2: 0\.68/);
  assert.match(director,/thresholdPhase3: 0\.32/);
  assert.match(director,/observed\.cycle===state\.sourceCycle\+1&&observed\.phase==="TELEGRAPH"/);
  assert.match(director,/observed\.qaHullHealth>state\.qaHullHealth/);
  for(const forbidden of ["Math.random(", "Date.now(", "setTimeout(", "setInterval(",
    "projectilesRef","shieldRef","scoreRef","localStorage",
    "runtimeProgressionRef","updateEnginePhysics"])assert.ok(!director.includes(forbidden),forbidden);
});
test("C8 QA presentation belongs only to real boss and retained current guard",()=>{
  assert.match(game,/const qaDirectorDraw=architectQaDirectorRef\.current/);
  assert.match(game,/qaDirectorDraw\.boss===architectQaBossRef\.current/);
  assert.match(game,/qaDirectorDraw\.guard===architectQaGuardRef\.current/);
  assert.match(game,/SHARED QA HULL:/);
});