import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { calculateSwarmOffset, FORMATIONS } from "../src/game/formations.ts";
import { FormationType } from "../src/game/types.ts";

const positions = (type: FormationType, n: number, time=0, aim=0) =>
  Array.from({length:n}, (_,index)=>calculateSwarmOffset(type,index,n,time,aim));
const pairDistance = (a:{x:number;y:number},b:{x:number;y:number})=>
  Math.hypot(a.x-b.x,a.y-b.y);
const minSeparation = (pts:{x:number;y:number}[])=>
  pts.reduce((min,a,i)=>Math.min(min,...pts.slice(i+1).map(b=>pairDistance(a,b))),Infinity);

test("EV-F01 star stays open across 10, 20, 30 followers",()=>{
 for(const n of [10,20,30]){
   const pts=positions(FormationType.CIRCLE,n);
   assert.ok(minSeparation(pts)>=34.9,`star n=${n} spacing`);
   assert.ok(pts.some(p=>Math.hypot(p.x,p.y)>=94));
 }
 // Inner and outer points are both extended, and adjacent shells no longer
 // share their previous compact ten-unit radial separation.
 assert.ok(Math.hypot(...Object.values(positions(FormationType.CIRCLE,1)[0]))>=94);
 assert.ok(Math.hypot(...Object.values(positions(FormationType.CIRCLE,2)[1]))>=54);
});

test("EV-F01 four guard arms have staggered lanes and do not overlap",()=>{
 for(const n of [8,10,20,30]){
   const pts=positions(FormationType.V_SHAPE,n);
   assert.ok(minSeparation(pts)>=33.9,`cross n=${n} spacing`);
   assert.ok(pts.every(p=>Math.hypot(p.x,p.y)<160));
 }
});
test("EV-F01 delta concentric is deterministic and has multiple growing triangular shells",()=>{
 for(const n of [1,8,10,20,30]){
   const pts=positions(FormationType.SCATTERED,n);
   assert.equal(pts.length,n);
   assert.ok(pts.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
   if(n>=20){
      const shells=[pts.slice(0,10),pts.slice(10,20),pts.slice(20,30)];
      const avgRadius=(a:{x:number;y:number}[])=>a.reduce((sum,p)=>sum+Math.hypot(p.x,p.y),0)/a.length;
      assert.ok(avgRadius(shells[1])>avgRadius(shells[0])+20);
      if(n>=30)assert.ok(avgRadius(shells[2])>avgRadius(shells[1])+20);
   }
   assert.deepEqual(positions(FormationType.SCATTERED,n,1234,0),positions(FormationType.SCATTERED,n,8999,0));
   if(n>=10) assert.ok(minSeparation(pts)>19,`delta n=${n} avoids duplicate slots`);
 }
});
test("EV-F01 compatibility keeps IDs, balances and cycle unchanged",()=>{
 const src=readFileSync(new URL("../src/game/formations.ts",import.meta.url),"utf8");
 const en=readFileSync(new URL("../src/i18n/en.ts",import.meta.url),"utf8");
 const es=readFileSync(new URL("../src/i18n/es.ts",import.meta.url),"utf8");
 assert.equal(FORMATIONS[FormationType.CIRCLE].damageMod,.30);
 assert.equal(FORMATIONS[FormationType.V_SHAPE].shieldMod,.30);
 assert.equal(FORMATIONS[FormationType.SCATTERED].speedMod,1.15);
 assert.match(src,/Concentric Delta/);
 assert.match(es,/Delta Concéntrica/);
 assert.match(es,/Guardia Cruzada/);
 assert.match(en,/Concentric Delta/);
 assert.match(en,/Cross Guard/);
});
