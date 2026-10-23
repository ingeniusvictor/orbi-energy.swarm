import assert from "node:assert/strict";
import test from "node:test";
import {nonNegativeAnimationFrameDelta} from "../../src/game/animationFrameDelta";
import {projectCombatOverdrive,createCombatOverdriveState} from "../../src/game/combatOverdrive";

test("WEB UX01B first browser rAF timestamp older than performance.now never reaches negative Overdrive clock",()=>{
 const start=213.8,frame=208.5;
 const delta=nonNegativeAnimationFrameDelta(frame,start);
 assert.equal(delta,0);
 assert.doesNotThrow(()=>projectCombatOverdrive(createCombatOverdriveState(),delta,false));
});
test("WEB UX01B preserves normal animation cadence while rejecting invalid timestamps",()=>{
 assert.equal(nonNegativeAnimationFrameDelta(100,100),0);
 assert.equal(nonNegativeAnimationFrameDelta(116.6,100),16.599999999999994); // IEEE754
 assert.equal(nonNegativeAnimationFrameDelta(100,101),0);
 assert.equal(nonNegativeAnimationFrameDelta(Number.NaN,10),0);
 assert.equal(nonNegativeAnimationFrameDelta(100,Infinity),0);
 assert.equal(nonNegativeAnimationFrameDelta(1000,100),900); // original >100ms clamp still in game loop
});
