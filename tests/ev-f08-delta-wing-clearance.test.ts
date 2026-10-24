import assert from "node:assert/strict";
import test from "node:test";
import { calculateSwarmOffset, FORMATIONS } from "../src/game/formations.ts";
import { FormationType } from "../src/game/types.ts";

const offsets=(n:number,angle=0,time=0)=>
  Array.from({length:n},(_,i)=>calculateSwarmOffset(FormationType.SCATTERED,i,n,time,angle));
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>
  Math.hypot(a.x-b.x,a.y-b.y);
const separation=(positions:ReturnType<typeof offsets>)=>{
 let min=Infinity;
 for(let i=0;i<positions.length;i++)for(let j=i+1;j<positions.length;j++)
   min=Math.min(min,distance(positions[i],positions[j]));
 return min;
};

test("EV-F08 30 E8 wing tip footprints have >=2px nominal clearance",()=>{
 // E8 Canvas2D maximum solid radius=14 (body + six wing tips).
 const SOLID_E8_RADIUS=14;
 for(const n of [3,8,10,12,20,29,30]){
   const ps=offsets(n);
   assert.ok(separation(ps)>=2*SOLID_E8_RADIUS+2,
     `${n} companions require 2px wing-tip clearance; got ${separation(ps)}`);
 }
 for(let n=2;n<=30;n++){
   const ps=offsets(n);
   assert.ok(separation(ps)>=30,`n=${n} shrunk into overlapping wings`);
   assert.ok(ps.every(p=>Math.hypot(p.x,p.y)<=155.001),`n=${n} exceeded soft leader leash`);
 }
});
test("triangular layers remain static when additional companions join",()=>{
 for(let n=1;n<30;n++){
   const a=offsets(n),b=offsets(n+1);
   assert.deepEqual(b.slice(0,n),a,`n=${n} existing followers shifted`);
 }
});
test("Delta concentric is deterministic across time and rotates rigidly with aim",()=>{
 const before=offsets(30,0,0);
 const later=offsets(30,0,28000);
 assert.deepEqual(before,later);
 for(const aim of [-Math.PI,0,Math.PI/4,Math.PI,2*Math.PI]){
   const ps=offsets(30,aim,777);
   assert.ok(separation(ps)>=30,`aim ${aim} overlap`);
 }
 assert.equal(FORMATIONS[FormationType.SCATTERED].speedMod,1.15);
 assert.equal(FORMATIONS[FormationType.SCATTERED].shieldMod,.10);
});
test("30 positions fit landscape / DPR2 CSS viewport at nominal 1:1 reference scale",()=>{
 for(const [w,h,dpr] of [[740,360,1],[768,346,2],[844,390,1],[390,844,1]]){
   const radius=Math.max(...offsets(30).map(p=>Math.hypot(p.x,p.y)));
   assert.ok(2*(radius+14)<=Math.min(w,h),`w=${w} h=${h} DPR=${dpr}`);
 }
});