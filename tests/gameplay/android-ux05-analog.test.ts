import assert from "node:assert/strict";
import test from "node:test";
import { projectAnalogJoystick as joystick, projectAnalogMotion } from "../../src/game/analogJoystick";
import { readFileSync } from "node:fs";
test("UX05 joystick supports genuine 360-degree vector and analog speed", () => {
  assert.deepEqual(joystick(0,0,50),{x:0,y:0});
  assert.deepEqual(joystick(4,0,50),{x:0,y:0});
  const right=joystick(50,0,50); assert.ok(right.x>.999&&right.y===0);
  const upperLeft=joystick(-50,-50,50);
  assert.ok(upperLeft.x<-.7&&upperLeft.y<-.7);
  assert.ok(Math.abs(Math.hypot(upperLeft.x,upperLeft.y)-1)<1e-8);
  const partial=joystick(25,0,50); assert.ok(partial.x>0&&partial.x<1);
  assert.ok(Math.abs(joystick(18,24,50).x/joystick(18,24,50).y-.75)<1e-8);
  assert.ok(Math.hypot(...Object.values(joystick(300,100,50)))<=1.00001);
});
test("UX05 rejects NaN/invalid geometry; keyboard normalization remains separate",()=>{
 assert.deepEqual(joystick(Number.NaN,0,50),{x:0,y:0});
 assert.deepEqual(joystick(10,10,0),{x:0,y:0});
 assert.deepEqual(projectAnalogMotion({x:2,y:0}),{x:1,y:0});
 assert.deepEqual(projectAnalogMotion({x:0,y:0}),{x:0,y:0});
 assert.ok(projectAnalogMotion({x:.1,y:.2}).x<.2);
});
test("UX05 gameplay forwards analog magnitude through original speed and movement pipeline",()=>{
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const control=readFileSync(new URL("../../src/components/MobileTouchOverlay.tsx",import.meta.url),"utf8");
 assert.match(game,/const intensity = !hasKeyboardMovement && isAnalogEngaged/);
 assert.match(game,/\* pSpeed \* intensity/);
 assert.match(game,/onVectorChange=\{setMobileAnalogVector\}/);
 assert.match(game,/setPausedState[\s\S]*analogJoystickRef\.current = \{ x: 0, y: 0 \}/);
 for(const part of ["onPointerCancel={finish}","onLostPointerCapture={finish}","setPointerCapture(event.pointerId)","touch-action:none","data-testid"]) {
  assert.ok((control+readFileSync(new URL("../../src/styles/analogJoystick.css",import.meta.url),"utf8")).includes(part),part);
 }
});
