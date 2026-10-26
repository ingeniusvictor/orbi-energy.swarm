import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {ASTERIA_WORLD_CHOICE,FERRUM_WORLD_ID,PYRA_WORLD_ID,
  isAsteria,isFerrum,isPyra} from "../../src/game/ferrumWorld";
import {pyraSceneAt,drawPyraWorld,PYRA_SECTIONS} from "../../src/game/pyraWorld";
test("PYRA-01: third exclusive world identity cannot leak into ASTERIA/FERRUM",()=>{
  assert.equal(isPyra(true,PYRA_WORLD_ID),true);
  assert.equal(isAsteria(true,PYRA_WORLD_ID),false);
  assert.equal(isFerrum(true,PYRA_WORLD_ID),false);
  assert.equal(isPyra(true,FERRUM_WORLD_ID),false);
  assert.equal(isPyra(true,ASTERIA_WORLD_CHOICE),false);
  assert.equal(isPyra(false,PYRA_WORLD_ID),false);
  assert.equal(PYRA_SECTIONS.length,6);
  assert.equal(pyraSceneAt(6),pyraSceneAt(0));
  assert.throws(()=>pyraSceneAt(-1),RangeError);
  assert.throws(()=>pyraSceneAt(2.2),RangeError);
  assert.throws(()=>drawPyraWorld({} as CanvasRenderingContext2D,-1,1400,0),RangeError);
});
test("PYRA-01: real route launcher in desktop, portrait and landscape + canonical canvas",()=>{
  const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const start=readFileSync(new URL("../../src/components/StartScreen.tsx",import.meta.url),"utf8");
  const mobile=readFileSync(new URL("../../src/components/MobileLaunchNavigation.tsx",import.meta.url),"utf8");
  const native=readFileSync(new URL("../../src/components/PremiumNativeNavigation.tsx",import.meta.url),"utf8");
  assert.match(start,/data-pyra-world-start-cta/);
  assert.match(mobile,/orbi-mobile-pyra-world/);
  assert.match(native,/orbi-mobile-pyra-world/);
  assert.match(game,/const startPyraWorldRouteGame = \(\) =>/);
  assert.match(game,/drawPyraWorld\(ctx,projectRouteDistance/);
  assert.match(game,/canvas.dataset.ux15World=PYRA_WORLD_ID/);
  assert.match(game,/onStartPyraRoute=\{startPyraWorldRouteGame\}/);
  assert.match(game,/const asteriaCombatVisualActive = worldRouteRunActiveRef.current/);
  assert.match(game,/updateBossAI\(enemy, delta\)/);
});
