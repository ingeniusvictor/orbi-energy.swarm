import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const hud=read("src/game/blackoutArchitectDevQaBattleHud.ts");

test("C9 real battle HUD is Vite DEV-only, authenticated and after camera restore",()=>{
  assert.match(game,/import \{ projectBlackoutArchitectDevQaBattleHud \} from "\.\/blackoutArchitectDevQaBattleHud"/);
  assert.match(game,/const qaBattleHud=import\.meta\.env\.DEV\s*\?\s*projectBlackoutArchitectDevQaBattleHud\(/);
  const canvas=game.slice(game.indexOf("ctx.restore(); // Restore camera transformation matrix context"));
  const snapshot=canvas.indexOf("const qaBattleHud=import.meta.env.DEV");
  const minimap=canvas.indexOf("// 12. Draw a tactical minimap");
  assert.ok(snapshot>0&&minimap>snapshot);
  assert.match(canvas,/qaBattleHud\.anchors\[0\]/);
  assert.match(canvas,/qaBattleHud\.coreExposed/);
  assert.match(canvas,/qaBattleHud\.directorEnabled/);
  assert.match(canvas,/qaBattleHud\.attackPhase/);
  assert.match(canvas,/qaBattleHud\.remainingMs/);
  assert.match(canvas,/F7 MANUAL  F8 LOCKED  F9 EXIT/);
  assert.match(canvas,/F7 AUTO  F8 PATTERN  F9 EXIT/);
  assert.match(canvas,/MOVE: WASD \/ ARROWS \/ TOUCH/);
});
test("C9 state projection demands exact original installed QA boss, guard and one attack",()=>{
  assert.match(hud,/boss!==installedBoss/);
  assert.match(hud,/owner\.isCurrent\(guard,boss,installedBoss,enemies\)/);
  assert.match(hud,/attack!==activeAttack/);
  assert.match(hud,/Number\(grid!==null\)\+Number\(tide!==null\)\+Number\(wall!==null\)!==1/);
  assert.match(hud,/director\.qaHullHealth!==attack\.qaHullHealth/);
  assert.match(hud,/geometry\.anchors\.length!==4/);
  assert.match(hud,/attack\.remainingMs>bound/);
  assert.match(hud,/Object\.freeze\(orderedIds\.map\(/);
  assert.match(hud,/explicitDevQa!==true/);
  for(const banned of ["Math.random(","Date.now(","setTimeout(","setInterval(",
    "projectilesRef","shieldRef","scoreRef","localStorage","updateEnginePhysics(",
    "runtimeProgressionRef","registerCombatDefeat"])
    assert.ok(!hud.includes(banned),banned);
});
test("C9 Canvas QA HUD does not modify historical C1-C8 physics and normal mode routing",()=>{
  const qa=game.slice(game.indexOf("// C9: real authenticated source-of-truth QA battle status only"),
    game.indexOf("// 12. Draw a tactical minimap"));
  assert.doesNotMatch(qa,/shieldRef\.current|scoreRef\.current|playerPosRef\.current\s*=/);
  assert.doesNotMatch(qa,/updateEnginePhysics\(|detectAndResolveCollisions\(|projectilesRef\.current/);
  assert.match(game,/e\.code === "F7"/);
  assert.match(game,/e\.code === "F8"/);
  assert.match(game,/e\.code === "F9"/);
});