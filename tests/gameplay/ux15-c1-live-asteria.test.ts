import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  ASTERIA_SECTION_DEFS, createRouteCursor, createAsteriaSegment, projectRouteDistance,
} from "../../src/game/worldRouteCore";
import { stepRouteClock } from "../../src/game/worldRouteClock";

const code=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
const renderer=readFileSync(new URL("../../src/game/worldRoutePreviewRenderer.ts",import.meta.url),"utf8");

test("UX15-C1: campaign real gameplay explicitly opts into visual route; legacy remains default",()=>{
  assert.match(code,/get\("ux15-world"\) === "asteria"/);
  assert.match(code,/const asteriaCombatVisualActive = asteriaLiveQaRequested/);
  assert.match(code,/presentationMode === "CAMPAIGN"/);
  assert.match(code,/runtimeProgressionRef\.current\.mode === "CAMPAIGN"/);
  assert.match(code,/currentWaveRef\.current <= 2/);
  assert.match(code,/drawWorldRouteQaScene\(ctx, asteriaLiveCursorRef\.current,/);
  assert.match(code,/panoramicViewport\.width, false\)/);
  assert.match(code,/backgroundRenderer\.render\(/);
  assert.match(code,/canvas\.dataset\.ux15LiveCombat = "true"/);
  assert.match(code,/delete canvas\.dataset\.ux15LiveCombat/);
  assert.match(code,/data-immersive-landscape=/);
});

test("UX15-C1: no second false player or duplicated UI from the QA preview",()=>{
  assert.match(renderer,/if \(showQaMarker\) \{/);
  assert.match(renderer,/if \(showLabels &&/);
  assert.match(renderer,/if \(showQaMarker\) \{/g);
  assert.match(code,/drawEnemiesList\(/);
  assert.match(code,/drawProjectilesList\(/);
  assert.match(code,/drawResources\(/);
  assert.match(code,/drawFoton\(/);
  assert.doesNotMatch(code,/drawWorldRouteQaScene\([^;]*true\)/);
});

test("UX15-C1: route progression follows frozen physics clock, not render RAF or wall time",()=>{
  assert.match(code,/timeElapsedRef\.current \+= delta;\n    \/\/ UX15-C1/);
  assert.match(code,/stepRouteClock\(/);
  assert.match(code,/waveActiveRef\.current && !isPhotoMode/);
  assert.match(code,/hidden: document\.hidden/);
  assert.match(code,/modalOpen: mobilePanel !== "closed"/);
  assert.match(code,/upgradeOpen: isUpgradeSelectionOpen/);
  assert.match(code,/hitstop: hitStopTimerRef\.current > 0/);
  assert.match(code,/asteriaLiveCursorRef\.current = createRouteCursor\("asteria-campaign-qa"\)/);
  const gate={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};
  let cursor=createRouteCursor();
  for(let i=0;i<600;i++)cursor=stepRouteClock(cursor,50,52,gate);
  const before=projectRouteDistance(cursor);
  assert.ok(before>=1000);
  for(const key of ["playing","paused","hidden","modalOpen","upgradeOpen","hitstop"] as const){
    const blocked={...gate,[key]:key==="playing"?false:true};
    const frozen=stepRouteClock(cursor,50,52,blocked);
    assert.equal(projectRouteDistance(frozen),before);
  }
  assert.deepEqual(ASTЕRIA_IDS(),["ARRIVAL_GATE","ORBITAL_RAILS","CANYON_SKY","RELAY_SPAN","SIGNAL_BREACH","TRANSIT_VISTA"]);
  assert.equal(createAsteriaSegment(0,"asteria-campaign-qa").length,400);
});
function ASTЕRIA_IDS(){return ASTERIA_SECTION_DEFS.map(x=>x.id);}
