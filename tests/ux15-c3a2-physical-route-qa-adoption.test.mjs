import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const app=read("src/App.tsx");
const lab=read("src/components/PhysicalRouteQa.tsx");
const sim=read("src/game/physicalRouteQaSimulation.ts");
const game=read("src/game/EnergySwarmGame.tsx");
const browser=read("scripts/web-ux01-browser-evidence.mjs");

test("UX15-C3A2: separate lazy QA route does not replace live gameplay or classic UX15-B preview",()=>{
  assert.match(app,/lazy\(\(\) => import\("\.\/components\/PhysicalRouteQa"\)\)/);
  assert.match(app,/get\("ux15-physical-qa"\) === "1"/);
  assert.match(app,/get\("ux15-route-qa"\) === "1"/);
  assert.match(app,/if \(isPhysicalRouteQa\)/);
  assert.match(app,/<EnergySwarmGame \/>/);
  assert.doesNotMatch(game,/physicalRouteQaSimulation|PhysicalRouteQa|physicalRouteSpace|routePhysicalCamera/);
  assert.match(game,/const asteriaCombatVisualActive = worldRouteRunActiveRef\.current/);
});

test("UX15-C3A2: isolated QA renders actual canonical gameplay protagonist GLB path, never fake golden marker",()=>{
  assert.match(lab,/import \{ drawFoton \} from "\.\.\/game\/EnergySwarmCanvas"/);
  assert.match(lab,/prewarmFotonGameplay3D\(QualityPreset\.MEDIUM\)/);
  assert.match(lab,/drawFoton\(ctx,s\.player/);
  assert.match(lab,/data-qa-mode=\{c3b12Enabled\?"PHYSICAL_ROUTE_C3B12_QA":c3b11Enabled\?"PHYSICAL_ROUTE_C3B11_QA":c3b10Enabled\?"PHYSICAL_ROUTE_C3B10_QA":c3b9Enabled\?"PHYSICAL_ROUTE_C3B9_QA":c3b8Enabled\?"PHYSICAL_ROUTE_C3B8_QA":c3b7Enabled\?"PHYSICAL_ROUTE_C3B7_QA":c3b6Enabled\?"PHYSICAL_ROUTE_C3B6_QA":c3b5Enabled\?"PHYSICAL_ROUTE_C3B5_QA":c3b4Enabled\?"PHYSICAL_ROUTE_C3B4_QA":c3b3Enabled\?"PHYSICAL_ROUTE_C3B3_QA":c3b2Enabled\?"PHYSICAL_ROUTE_C3B2_QA":c3bPreviewEnabled\?"PHYSICAL_ROUTE_C3B1_QA":"PHYSICAL_ROUTE_ISOLATED"\}/);
  assert.match(lab,/PHYSICAL QA · CONTROLLED ACTORS · NO DAMAGE/);
  assert.match(lab,/drawAsteriaPremiumWorld\(ctx,s\.frame\.cursor/);
  assert.doesNotMatch(lab,/drawWorldRouteQaScene\([^;]*true\)/);
  assert.doesNotMatch(lab,/spawnEnemy|registerCombatDefeat|setNanoCredits|scoreRef|bossRef|projectilesRef/);
});

test("UX15-C3A2: real player, camera and origin are owned by ONE simulated clock and can pause or reset",()=>{
  assert.match(sim,/stepRouteClock\(/);
  assert.match(sim,/advancePhysicalRouteFrame\(/);
  assert.match(sim,/stepRoutePhysicalCamera\(/);
  assert.match(sim,/planRouteOriginShift\(/);
  // C3A-3 supersedes the two-owner C3A-2 rebase with one transaction.
  assert.match(sim,/rebaseRouteCoordinateOwners\(/);
  assert.match(sim,/structuredClone\(encounter\)/);
  assert.match(sim,/if \(!canAdvanceRoute\(gates\) \|\| deltaMs === 0\) return state/);
  assert.doesNotMatch(sim,/requestAnimationFrame|Date\.now|Math\.random|React|enemiesRef/);
  assert.match(lab,/data-player-local-x=/);
  assert.match(lab,/data-camera-local-x=/);
  assert.match(lab,/data-origin-epoch=/);
  assert.match(lab,/data-rebase-count=/);
  assert.match(lab,/document\.addEventListener\("visibilitychange"/);
  assert.match(lab,/data-testid="ux15-physical-reset"/);
});

test("UX15-C3A2: real Chromium tests native touch and physical displacement, origin epoch and pause",()=>{
  assert.match(browser,/async function runPhysicalRouteQa/);
  assert.match(browser,/ux15-physical-qa=1/);
  assert.match(browser,/Input\.dispatchTouchEvent/);
  assert.match(browser,/data-player-local-x/);
  assert.match(browser,/data-camera-local-x/);
  assert.match(browser,/data-origin-epoch/);
  assert.match(browser,/physical floating origin did not rebase/);
  assert.match(browser,/physical ENERGY continues while paused/);
  assert.match(browser,/ux15c3a2-physical-mobile-844x390/);
});
