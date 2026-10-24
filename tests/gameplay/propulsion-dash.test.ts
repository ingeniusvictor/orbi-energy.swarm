import assert from "node:assert/strict";
import test from "node:test";
import {
  DASH_COOLDOWN_MS, DASH_DURATION_MS, DASH_PLAYER_RADIUS,
  DASH_SPEED_UNITS_PER_MS, activatePropulsionDash,
  createPropulsionDashState, projectPropulsionDash, stepPropulsionDash,
} from "../../src/game/propulsionDash.ts";

const bounds = { width: 1600, height: 960, radius: DASH_PLAYER_RADIUS };
const start = () => activatePropulsionDash(createPropulsionDashState(), 100, {x:3,y:4});

test("dash initializes ready and keeps simulation state independent of Overdrive", () => {
  assert.deepEqual(projectPropulsionDash(createPropulsionDashState(),0), {
    active:false, canActivate:true, remainingMs:0, cooldownRemainingMs:0, progress:0,
  });
  const a = start();
  assert.equal(a.activated,true);
  assert.ok(Math.abs(a.state.direction.x-0.6)<1e-9);
  assert.ok(Math.abs(a.state.direction.y-0.8)<1e-9);
  assert.equal(a.state.activeUntilMs,100+DASH_DURATION_MS);
  assert.equal(a.state.cooldownUntilMs,100+DASH_COOLDOWN_MS);
  assert.equal(projectPropulsionDash(a.state,101).active,true);
});

test("dash frame motion is deterministic, normalized and independent of FPS", () => {
  const a = start().state;
  const one = stepPropulsionDash(a,280,180,{x:600,y:400},bounds);
  let pos={x:600,y:400};
  for(let i=0;i<12;i++){
    pos=stepPropulsionDash(a,115+(15*i),15,pos,bounds).position;
  }
  assert.ok(Math.abs(pos.x-one.position.x)<1e-8);
  assert.ok(Math.abs(pos.y-one.position.y)<1e-8);
  assert.ok(Math.abs(one.moved-DASH_DURATION_MS*DASH_SPEED_UNITS_PER_MS)<1e-8);
  assert.equal(stepPropulsionDash(a,400,16,one.position,bounds).moved,0);
});

test("dash clips at world boundaries with no tunneling or out-of-bounds travel",()=>{
  const a=activatePropulsionDash(createPropulsionDashState(),0,{x:1,y:1}).state;
  const step=stepPropulsionDash(a,200,200,{x:1590,y:955},bounds);
  assert.deepEqual(step.position,{x:1584,y:944});
  const reverse=activatePropulsionDash(createPropulsionDashState(),0,{x:-1,y:-1}).state;
  assert.deepEqual(stepPropulsionDash(reverse,200,200,{x:20,y:20},bounds).position,{x:16,y:16});
});

test("anti-spam: no stacking, no refresh, no early retry, strict cooldown",()=>{
  const a=start().state;
  const spam=activatePropulsionDash(a,120,{x:0,y:-1});
  assert.equal(spam.activated,false);
  assert.deepEqual(spam.state,a);
  const cooldown=projectPropulsionDash(a,100+DASH_DURATION_MS);
  assert.equal(cooldown.active,false);
  assert.equal(cooldown.canActivate,false);
  assert.equal(cooldown.cooldownRemainingMs,DASH_COOLDOWN_MS-DASH_DURATION_MS);
  assert.equal(activatePropulsionDash(a,100+DASH_COOLDOWN_MS-1,{x:1,y:0}).activated,false);
  assert.equal(activatePropulsionDash(a,100+DASH_COOLDOWN_MS,{x:1,y:0}).activated,true);
});

test("no motion without direction; invalid/nonfinite inputs rejected safely",()=>{
  const initial=createPropulsionDashState();
  assert.equal(activatePropulsionDash(initial,0,{x:0,y:0}).activated,false);
  assert.equal(activatePropulsionDash(initial,0,{x:Infinity,y:0}).activated,false);
  assert.deepEqual(activatePropulsionDash(initial,0,{x:NaN,y:1}).state,initial);
  assert.throws(()=>projectPropulsionDash(initial,NaN));
  assert.throws(()=>stepPropulsionDash(initial,100,-1,{x:0,y:0},bounds));
  assert.throws(()=>stepPropulsionDash(initial,100,1,{x:0,y:0},{width:10,height:10,radius:16}));
});

test("pause, hit-stop and boss intro: time must not advance when physics is not ticking",()=>{
  const a=start().state;
  const before=projectPropulsionDash(a,130);
  const afterPause=projectPropulsionDash(a,130);
  assert.deepEqual(afterPause,before);
  const resumed=stepPropulsionDash(a,146,16,{x:800,y:480},bounds);
  assert.equal(resumed.activeDuringFrame,true);
  assert.ok(resumed.moved>0);
  // No invulnerability, enemy knockback, shield, damage or resonance in this contract.
  assert.equal("invulnerability" in a,false);
  assert.equal("shield" in a,false);
});

test("duration is clipped when frame straddles end of active window",()=>{
  const a=start().state;
  const last=stepPropulsionDash(a,300,40,{x:800,y:480},bounds);
  assert.ok(Math.abs(last.moved - 20*DASH_SPEED_UNITS_PER_MS)<1e-9);
  assert.equal(projectPropulsionDash(a,280).active,false);
});
