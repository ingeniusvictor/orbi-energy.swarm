import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = path => readFileSync(new URL("../" + path,import.meta.url),"utf8");
const app=read("src/App.tsx");
const lab=read("src/components/WorldRouteQaPreview.tsx");
const renderer=read("src/game/worldRoutePreviewRenderer.ts");
const core=read("src/game/worldRouteCore.ts");
const clock=read("src/game/worldRouteClock.ts");
const engine=read("src/game/EnergySwarmGame.tsx");
const browser=read("scripts/web-ux01-browser-evidence.mjs");

test("UX15-B QA is explicit lazy route, normal game preserves its existing root",()=>{
  assert.match(app,/lazy\(\(\) => import\("\.\/components\/WorldRouteQaPreview"\)\)/);
  assert.match(app,/get\("ux15-route-qa"\) === "1"/);
  assert.match(app,/if \(isWorldRouteQa\)/);
  assert.match(app,/<EnergySwarmGame \/>/);
  // UX15-C1 intentionally imports the route renderer into live gameplay, but
  // only for explicit ASTERIA Campaign 1–2 opt-in: preview never mounts here.
  assert.doesNotMatch(engine,/WorldRouteQaPreview/);
  assert.match(engine,/get\("ux15-world"\) === "asteria"/);
  assert.match(engine,/const asteriaCombatVisualActive = worldRouteRunActiveRef\.current/);
  assert.match(engine,/worldRouteRunActiveRef\.current/);
  assert.doesNotMatch(engine,/currentWaveRef\.current <= 2/);
  assert.match(engine,/backgroundRenderer\.render\(/);
});

test("UX15-B viewport is a QA-only canvas: no gameplay claims, combat overlays or fake enemies",()=>{
  assert.match(lab,/QA ONLY · NO GAMEPLAY/);
  assert.match(lab,/data-route-mode="ROUTE_QA_PREVIEW"/);
  assert.match(lab,/data-testid="ux15-route-canvas"/);
  assert.match(lab,/data-route-distance=/);
  assert.match(lab,/data-player-manual-x=/);
  assert.doesNotMatch(lab,/spawnEnemy|scoreRef|projectilesRef|bossRef|setNanoCredits|damageEnemy/);
  assert.match(renderer,/drawWorldRouteQaScene/);
  assert.doesNotMatch(renderer,/THREE|GLTFLoader|new Image\(|fetch\(/);
});

test("UX15-B uses bounded route geometry/clock, not legacy 1600x960 physics or wall clock",()=>{
  assert.match(core,/ROUTE_SCHEMA_VERSION = 1/);
  assert.match(core,/safeEnvelope/);
  assert.match(core,/collisionEnabled: false/);
  assert.match(core,/combatEncounterEnabled: false/);
  assert.match(core,/getRouteWindow/);
  assert.match(clock,/ROUTE_MAX_STEP_MS = 50/);
  assert.match(clock,/gate\.paused|!gate\.paused/);
  assert.match(clock,/gate\.hidden|!gate\.hidden/);
  assert.match(clock,/gate\.modalOpen|!gate\.modalOpen/);
  assert.match(clock,/gate\.hitstop|!gate\.hitstop/);
  assert.doesNotMatch(clock,/Date\.now|Math\.random|requestAnimationFrame/);
  assert.doesNotMatch(core,/WORLD_WIDTH|WORLD_HEIGHT|MAX_ENEMIES|Date\.now|Math\.random/);
});

test("UX15-B Chromium evidence exercises the opt-in preview without substituting gameplay",()=>{
  assert.match(browser,/ux15-route-qa=1/);
  assert.match(browser,/ux15-route-canvas/);
  assert.match(browser,/data-route-distance/);
  assert.match(browser,/ux15-route-pause/);
  assert.match(browser,/ux15-route-reset/);
});
