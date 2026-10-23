import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const policy=read("src/game/blackoutArchitectDevQaTouchAccess.ts");

test("C10 touch dock is Vite DEV-only and OUTSIDE the actual pointer firing Canvas",()=>{
  assert.match(game,/const qaTouchAccess = import\.meta\.env\.DEV\s*\?\s*projectBlackoutArchitectDevQaTouchAccess\(/);
  const canvas=game.indexOf("<EnergySwarmCanvas");
  const dock=game.indexOf('data-testid="architect-qa-touch-dock"');
  const formation=game.indexOf("<MobileTouchOverlay");
  assert.ok(dock>0&&dock<canvas&&canvas<formation);
  assert.match(game,/role="group"\s+aria-label="Blackout Architect developer QA touch controls"/);
  assert.match(game,/min-h-\[40px\]/);
  assert.match(game,/touch-manipulation/);
});

test("C10 touch buttons invoke ONLY existing authenticated actions on click, never pointerdown",()=>{
  const dock=game.slice(game.indexOf("{/* C10: deliberate touch/keyboard"),
    game.indexOf("{/* CANVAS INTERACTIVE PORT */}"));
  assert.equal((dock.match(/onPointerDown=\{e => e\.stopPropagation\(\)\}/g)??[]).length,3);
  assert.equal((dock.match(/onPointerUp=\{e => e\.stopPropagation\(\)\}/g)??[]).length,3);
  assert.equal((dock.match(/onClick=\{e =>/g)??[]).length,3);
  assert.equal((dock.match(/e\.preventDefault\(\); e\.stopPropagation\(\)/g)??[]).length,3);
  for(const action of ["toggleArchitectQaDiagnostic();",
    "toggleArchitectQaPatternDirector();","toggleArchitectQaAttackSelection();"]){
    assert.equal(dock.split(action).length,2,action);
  }
  assert.match(dock,/disabled=\{!qaTouchAccess\.qaToggleEnabled\}/);
  assert.match(dock,/disabled=\{!qaTouchAccess\.directorToggleEnabled\}/);
  assert.match(dock,/disabled=\{!qaTouchAccess\.patternNextEnabled\}/);
  assert.match(dock,/aria-pressed=\{architectQaVisible\}/);
  assert.match(dock,/aria-label="Select next QA attack pattern"/);
  assert.doesNotMatch(dock,/updateEnginePhysics|projectilesRef\.current|shieldRef\.current|scoreRef\.current/);
});

test("C10 original DEV-only hotkey route remains and F8 director lock survives",()=>{
  assert.match(game,/e\.ctrlKey && e\.altKey && e\.shiftKey && e\.code === "F9"/);
  assert.match(game,/e\.code === "F7"/);
  assert.match(game,/e\.code === "F8"/);
  assert.match(game,/if \(architectQaDirectorRef\.current !== null\) return; \/\/ C8 forbids F8 hull reset/);
  assert.match(game,/refreshArchitectQaTouchControls\(v => v \+ 1\)/);
});

test("C10 touch policy is strictly presentation and cannot silently admit production boss",()=>{
  assert.match(policy,/explicitDev/);
  assert.match(policy,/inCampaign/);
  assert.match(policy,/guardCurrent/);
  assert.match(policy,/!input\.directorActive/);
  for(const forbidden of ["Math.random(", "Date.now(", "projectilesRef",
    "bossRef", "shieldRef", "scoreRef", "localStorage", "setTimeout("]){
    assert.ok(!policy.includes(forbidden),forbidden);
  }
});
