import assert from "node:assert/strict";
import test from "node:test";
import { FormationType } from "../../src/game/types";
import { FORMATIONS } from "../../src/game/formations";
import { PLAYER_BASE_SPEED, WORLD_BOUNDS } from "../../src/game/constants";
import { createTouchDirectionState } from "../../src/game/touchControls";
import {
  BLACKOUT_ARCHITECT_DEV_QA_FOTON_MOVEMENT_AUTHORITY,
  stepBlackoutArchitectDevQaFotonMovement as step,
} from "../../src/game/blackoutArchitectDevQaFotonMovement";

const none=()=>createTouchDirectionState();
const near=(actual:number,want:number)=>assert.ok(Math.abs(actual-want)<1e-9,`expected ${want}, got ${actual}`);

test("C4 real key movement uses game's own PLAYER_BASE_SPEED and formation speed modifier",()=>{
  const current={x:600,y:360};
  const mod=FORMATIONS[FormationType.CIRCLE].speedMod;
  const result=step(current,{W:true,D:true},none(),16.6,mod);
  assert.ok(result);
  assert.equal(result.source,"KEYBOARD");
  const expected=PLAYER_BASE_SPEED*mod/Math.sqrt(2);
  near(result.x,600+expected);
  near(result.y,360-expected);
  near(Math.hypot(result.dx,result.dy),PLAYER_BASE_SPEED*mod);
  assert.deepEqual(current,{x:600,y:360},"pure helper does not mutate real position");
  assert.ok(Object.isFrozen(result));
});
test("C4 opposite input cancels, true keyboard motion wins over active touch",()=>{
  const n=none();
  const stopped=step({x:400,y:400},{W:true,S:true},n,16.6,1);
  assert.ok(stopped);
  assert.deepEqual({x:stopped.x,y:stopped.y,source:stopped.source},{x:400,y:400,source:"NONE"});
  const touch={...none(),RIGHT:true};
  const keyboard=step({x:400,y:400},{W:true},touch,16.6,1);
  assert.ok(keyboard);
  assert.equal(keyboard.source,"KEYBOARD");
  near(keyboard.x,400);
  near(keyboard.y,400-PLAYER_BASE_SPEED);
  const fallback=step({x:400,y:400},{A:true,D:true},touch,16.6,1);
  assert.ok(fallback);
  assert.equal(fallback.source,"TOUCH_PAD");
  near(fallback.x,400+PLAYER_BASE_SPEED);
  near(fallback.y,400);
});
test("C4 touch diagonal normalizes and W/ArrowUp do not stack",()=>{
  const touch={...none(),UP:true,LEFT:true};
  const result=step({x:150,y:150},{},touch,33.2,1);
  assert.ok(result);
  assert.equal(result.source,"TOUCH_PAD");
  near(Math.hypot(result.dx,result.dy),2*PLAYER_BASE_SPEED);
  const both=step({x:150,y:150},{W:true,ARROWUP:true},none(),16.6,1);
  assert.ok(both);
  near(both.y,150-PLAYER_BASE_SPEED);
  const quiet=step({x:150,y:150},{},none(),16.6,1);
  assert.ok(quiet);
  assert.equal(quiet.source,"NONE");
  near(quiet.x,150); near(quiet.y,150);
});
test("C4 remains strictly inside WORLD_BOUNDS and frame delta is bounded",()=>{
  const corner=step({x:WORLD_BOUNDS.minX,y:WORLD_BOUNDS.minY},
    {W:true,A:true},none(),33.2,2);
  assert.ok(corner);
  assert.equal(corner.x,WORLD_BOUNDS.minX);
  assert.equal(corner.y,WORLD_BOUNDS.minY);
  const max=step({x:WORLD_BOUNDS.maxX,y:WORLD_BOUNDS.maxY},
    {D:true,S:true},none(),33.2,2);
  assert.ok(max);
  assert.equal(max.x,WORLD_BOUNDS.maxX);
  assert.equal(max.y,WORLD_BOUNDS.maxY);
  assert.equal(step({x:400,y:400},{W:true},none(),33.201,1),null);
  assert.equal(step({x:400,y:400},{W:true},none(),-0.01,1),null);
  const zero=step({x:400,y:400},{W:true},none(),0,1);
  assert.ok(zero);near(zero.y,400);
});
test("C4 rejects NaN/infinite position, velocity modifiers, invalid held key/touch and out-of-world inputs",()=>{
  for(const value of [NaN,Infinity,-Infinity]){
    assert.equal(step({x:value,y:200},{W:true},none(),16.6,1),null);
    assert.equal(step({x:200,y:value},{W:true},none(),16.6,1),null);
    assert.equal(step({x:200,y:200},{W:true},none(),value,1),null);
    assert.equal(step({x:200,y:200},{W:true},none(),16.6,value),null);
  }
  for(const mod of [0,-1,2.001]){
    assert.equal(step({x:200,y:200},{W:true},none(),16.6,mod),null);
  }
  assert.equal(step({x:WORLD_BOUNDS.minX-1,y:200},{},none(),16.6,1),null);
  assert.equal(step({x:200,y:WORLD_BOUNDS.maxY+1},{},none(),16.6,1),null);
  assert.equal(step({x:200,y:200},{W:1 as unknown as boolean},none(),16.6,1),null);
  assert.equal(step({x:200,y:200},{W:true},{...none(),RIGHT:1 as unknown as boolean},16.6,1),null);
  assert.equal(step(null,{},none(),16.6,1),null);
  assert.equal(step({x:200,y:200},null,none(),16.6,1),null);
  assert.equal(step({x:200,y:200},{},null,16.6,1),null);
});
test("C4 source deliberately owns only QA navigation, no world/AI/FOTON abilities or progression",()=>{
  const auth=BLACKOUT_ARCHITECT_DEV_QA_FOTON_MOVEMENT_AUTHORITY;
  assert.ok(Object.isFrozen(auth));
  assert.deepEqual(Object.keys(auth).filter(k=>auth[k as keyof typeof auth]===true),[
    "ownsBoundedDevQaFotonNavigation","ownsKeyboardAndTouchDirectionProjection",
  ]);
  assert.ok(Object.entries(auth).filter(([,v])=>v!==true).every(([,v])=>v===false));
});
