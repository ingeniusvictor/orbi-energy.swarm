import assert from "node:assert/strict";
import test from "node:test";
import {createEnergyThrusterPose,projectEnergyThrusterPose,drawEnergyThrusterJets} from "../../src/game/energyThrusters";

test("UX12 thrust follows actual displacement but never invents motion when idle",()=>{
 const empty=createEnergyThrusterPose();
 assert.equal(empty.throttle,0);
 const moving=projectEnergyThrusterPose(empty,12,0,16,false);
 assert.ok(moving.throttle>0);
 assert.ok(moving.directionX>0 && moving.directionY===0);
 assert.ok(moving.bankRadians>0 && moving.bankRadians<=.16);
 const idle=projectEnergyThrusterPose(moving,0,0,160,false);
 assert.ok(idle.throttle<moving.throttle);
 assert.ok(idle.bankRadians<moving.bankRadians);
 assert.deepEqual(projectEnergyThrusterPose(moving,3,4,0,false),moving);
});
test("UX12 thruster damping and bank remain bounded across fast/slow frame rates",()=>{
 const a=projectEnergyThrusterPose(createEnergyThrusterPose(),-200,0,16,true);
 const b=projectEnergyThrusterPose(createEnergyThrusterPose(),-200,0,34,true);
 assert.ok(a.bankRadians>=-.16 && a.bankRadians<0);
 assert.ok(b.bankRadians>=-.16 && b.bankRadians<0);
 assert.ok(a.throttle<=1 && b.throttle<=1);
 const invalid=projectEnergyThrusterPose(a,NaN,Infinity,16,false);
 assert.ok(Number.isFinite(invalid.throttle) && Number.isFinite(invalid.bankRadians));
});
test("UX12 only two RCS jets and no extra particles are emitted",()=>{
 const moves:string[]=[];
 const ctx={save:()=>moves.push("save"),restore:()=>moves.push("restore"),
   beginPath:()=>moves.push("begin"),moveTo:()=>{},lineTo:()=>{},stroke:()=>moves.push("stroke"),
   set lineCap(_:string){},set strokeStyle(_:string){},set lineWidth(_:number){},
   set shadowBlur(_:number){},set shadowColor(_:string){},set globalAlpha(_:number){}
 } as unknown as CanvasRenderingContext2D;
 drawEnergyThrusterJets(ctx,{x:100,y:100},createEnergyThrusterPose(),0,false);
 assert.equal(moves.length,0);
 const pose=projectEnergyThrusterPose(createEnergyThrusterPose(),0,12,16,false);
 drawEnergyThrusterJets(ctx,{x:100,y:100},pose,150,false);
 assert.equal(moves.filter(x=>x==="stroke").length,6); // 3 line segments per nozzle, 2 nozzles
 assert.equal(moves.filter(x=>x==="save").length,1);
 assert.equal(moves.filter(x=>x==="restore").length,1);
});