import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const game=readFileSync(new URL("../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
const browser=readFileSync(new URL("../scripts/architect-c11-browser-evidence.mjs",import.meta.url),"utf8");

test("C12 original DEV-only status is rendered exactly once in normal flow BEFORE real Canvas",()=>{
  const dock=game.indexOf('data-testid="architect-qa-touch-dock"');
  const info=game.indexOf('data-testid="architect-qa-status"');
  const canvas=game.indexOf("<EnergySwarmCanvas");
  assert.ok(dock>=0 && info>dock && canvas>info);
  assert.equal(game.split("DEV QA — ARCHITECT ANCHOR HITS").length,2);
  assert.equal(game.split("DEV QA FAILED").length,2);
  assert.equal(game.split("DEV QA COMPLETE").length,2);
  const region=game.slice(dock,canvas);
  assert.match(region,/import\.meta\.env\.DEV && architectQaVisible/);
  assert.match(region,/aria-live="polite"/);
  assert.match(region,/break-words/);
  assert.doesNotMatch(region,/absolute top-2 left-2 z-30 pointer-events-none/);
});

test("C12 does not touch actual Canvas pointer handling or C10 authenticated actions",()=>{
  assert.match(game,/onPointerMove=\{handlePointerMove\}/);
  assert.match(game,/onPointerDown=\{handlePointerDown\}/);
  assert.match(game,/onPointerUp=\{handlePointerUp\}/);
  assert.match(game,/<MobileTouchOverlay onVectorChange=\{setMobileAnalogVector\}/);
  assert.match(game,/toggleArchitectQaDiagnostic\(\)/);
  assert.match(game,/toggleArchitectQaPatternDirector\(\)/);
  assert.match(game,/toggleArchitectQaAttackSelection\(\)/);
  assert.match(game,/if \(architectQaDirectorRef\.current !== null\) return; \/\/ C8 forbids F8 hull reset/);
});

test("C12 headless browser asserts true element rectangles at 320/390/428 plus desktop",()=>{
  assert.match(browser,/name:"mobile-compact",width:320,height:700/);
  assert.match(browser,/name:"mobile-touch",width:390,height:844/);
  assert.match(browser,/name:"mobile-wide",width:428,height:926/);
  assert.match(browser,/name:"desktop",width:1440,height:900/);
  assert.match(browser,/layout\.statusBottom<=layout\.canvasTop\+1/);
  assert.match(browser,/layout\.dockBottom<=layout\.statusTop\+1/);
  assert.match(browser,/layout\.statusRight<=layout\.viewportWidth\+1/);
  assert.match(browser,/await runProduction\(browser\)/);
  assert.match(browser,/const clicks=await page\.evaluate/);
  assert.match(browser,/assert\(clicks===0/);
});
