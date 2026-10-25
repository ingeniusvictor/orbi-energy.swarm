import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = path => readFileSync(new URL("../" + path,import.meta.url),"utf8");
const engine=source("src/game/EnergySwarmGame.tsx");
const physics=source("src/game/physicalRouteSpace.ts");
const camera=source("src/game/routePhysicalCamera.ts");
const constants=source("src/game/constants.ts");
const clock=source("src/game/worldRouteClock.ts");
const premium=source("src/game/asteriaPremiumRenderer.ts");

test("UX15-C3A1: new physical foundation stays inert: no real combat/camera adoption in normal route yet",()=>{
  assert.doesNotMatch(engine,/from ["']\.\/physicalRouteSpace["']/);
  assert.doesNotMatch(engine,/from ["']\.\/routePhysicalCamera["']/);
  assert.doesNotMatch(engine,/originEpoch|routePhysicsEnabled/);
  assert.match(engine,/const asteriaCombatVisualActive = worldRouteRunActiveRef\.current/);
  assert.match(engine,/drawAsteriaPremiumWorld\(/);
  assert.match(engine,/backgroundRenderer\.render\(/);
  assert.match(engine,/const startWorldRouteGame/);
  assert.match(engine,/data-selected-game-mode=/);
  assert.match(constants,/export const WORLD_WIDTH = 1600/);
  assert.match(constants,/export const WORLD_HEIGHT = 960/);
});

test("UX15-C3A1: local physics modules are pure and never import UI, mutate live engine or spawn",()=>{
  for(const mod of [physics,camera]){
    assert.doesNotMatch(mod,/from ["\x27]react["\x27]|useRef\(|document\.|window\.|performance\.now\(|Date\.now\(|Math\.random\(|requestAnimationFrame\(|new WebGLRenderer/);
    assert.doesNotMatch(mod,/enemiesRef|projectilesRef|bossRef|scoreRef|shieldRef/);
    assert.doesNotMatch(mod,/\.push\(|\.splice\(/);
  }
  assert.match(physics,/function advancePhysicalRouteFrame/);
  assert.match(physics,/function planRouteOriginShift/);
  assert.match(physics,/function rebasePhysicalRouteFrame/);
  assert.match(camera,/function stepRoutePhysicalCamera/);
  assert.match(camera,/function screenToRouteLocal/);
  assert.match(camera,/function routeLocalToScreen/);
  assert.match(physics,/return \{ \.\.\.point, x: nextX \}/);
  assert.match(clock,/export const ROUTE_MAX_STEP_MS = 50/);
});

test("UX15-C3A1: original ASTERIA WebP rendering is unchanged by mathematics-only phase",()=>{
  assert.match(premium,/asteria-arrival\.webp/);
  assert.match(premium,/asteria-orbital\.webp/);
  assert.match(premium,/asteria-relay\.webp/);
  assert.match(premium,/asteria-breach\.webp/);
  assert.match(premium,/function drawAsteriaPremiumWorld/);
});
