import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const game=readFileSync(new URL("../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
const browser=readFileSync(new URL("../scripts/architect-c13-projectile-browser.mjs",import.meta.url),"utf8");

test("C13 actual QA native Canvas shot remains authentic and guarded",()=>{
  assert.match(game,/projectilesRef\.current\.push\(shot\)/);
  assert.match(game,/architectQaShotRef\.current = shot/);
  assert.match(game,/const speed = 6/);
  assert.match(game,/damage: 20/);
  assert.match(game,/resolveBlackoutArchitectDevQaCardinalImpact\(/);
  assert.match(game,/resolveBlackoutArchitectDevQaCoreImpact\(/);
  assert.match(game,/isCurrent\(\s*qaGuard, qaBoss, bossRef\.current, enemiesRef\.current/);
});

test("C13 QA pointer release cannot become unrelated click-to-move input",()=>{
  const i=game.indexOf("const handlePointerUp");
  const a=game.slice(i,i+650);
  assert.match(a,/import\.meta\.env\.DEV && architectQaBossRef\.current !== null/);
  assert.match(a,/isMouseDownRef\.current = false;\s*return/);
  assert.match(game,/const handlePointerDown/);
});

test("C13 real authenticated read-only telemetry only while guard is current",()=>{
  assert.match(game,/qaOwner\.isCurrent\(qaGuard, qaBoss, bossRef\.current, enemiesRef\.current\)/);
  assert.match(game,/canvas\.dataset\.architectQaReadout = JSON\.stringify\(/);
  assert.match(game,/anchors:qaGeom\.anchors\.map\(/);
  assert.match(game,/shotActive: architectQaShotRef\.current !== null/);
  assert.match(game,/delete canvas\.dataset\.architectQaReadout/);
  assert.doesNotMatch(browser,/__reactFiber|window\.__ORBI|bossRef\.current\.health\s*=|projectilesRef\.current\.push/);
});

test("C13 Chromium uses original Campaign, keyboard travel and pointer shots, no state injection",()=>{
  assert.match(browser,/await page\.locator\('\[data-primary-start-cta="true"\]'\)\.click\(\)/);
  assert.match(browser,/await enter\.click\(\)/);
  assert.match(browser,/await page\.keyboard\.down\("ArrowLeft"\)/);
  assert.match(browser,/await page\.mouse\.click\(x,y\)/);
  assert.match(browser,/await page\.clock\.runFor\(/);
  assert.match(browser,/const order=\["SOUTH","EAST","NORTH","WEST"\]/);
  assert.match(browser,/for\(let n=0;n<96;n\+\+\)/);
  assert.match(browser,/CORE 0 HP/);
  assert.match(browser,/await capture\(page/);
  assert.doesNotMatch(browser,/page\.evaluate\(|dispatchEvent\(|mockShot\(|forceHit\(/);
});
