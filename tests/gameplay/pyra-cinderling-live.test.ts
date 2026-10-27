import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {PYRA_WORLD_ID,isPyra,isAsteria,isFerrum} from "../../src/game/ferrumWorld";
import {
 CINDERLING_WARN_MS,CINDERLING_LEAP_MS,CINDERLING_BURST_MS,
 CINDERLING_COOL_MS,CINDERLING_BURST_LIMIT,CINDERLING_CINDER_SPEED,
 createCinderlingAttack,stepCinderling,projectCinderlingBurst,
 cinderlingDamageMultiplier,shouldSpawnCinderling,
} from "../../src/game/pyraCinderling";
const pos={x:300,y:350},target={x:440,y:350};
test("PYRA-04: Cinerita consumes only a world-03 ordinary Campaign slot",()=>{
 assert.equal(isPyra(true,PYRA_WORLD_ID),true);
 assert.equal(isAsteria(true,PYRA_WORLD_ID),false);
 assert.equal(isFerrum(true,PYRA_WORLD_ID),false);
 assert.equal(shouldSpawnCinderling(true,"CAMPAIGN",4,2,false,false,false),true);
 assert.equal(shouldSpawnCinderling(true,"CAMPAIGN",8,7,false,false,false),true);
 assert.equal(shouldSpawnCinderling(true,"CAMPAIGN",3,2,false,false,false),false);
 assert.equal(shouldSpawnCinderling(true,"SCORE_ATTACK",4,2,false,false,false),false);
 assert.equal(shouldSpawnCinderling(true,"INFINITE",4,2,false,false,false),false);
 assert.equal(shouldSpawnCinderling(false,"CAMPAIGN",4,2,false,false,false),false);
 assert.equal(shouldSpawnCinderling(true,"CAMPAIGN",4,3,false,false,false),false);
 assert.equal(shouldSpawnCinderling(true,"CAMPAIGN",4,2,true,false,false),false);
 assert.equal(shouldSpawnCinderling(true,"CAMPAIGN",4,2,false,true,false),false);
 assert.equal(shouldSpawnCinderling(true,"CAMPAIGN",4,2,false,false,true),false);
});
test("PYRA-04: a full warning, locked landing and ONE burst, no surprise targeting",()=>{
 let state=createCinderlingAttack();
 let p=pos;
 let step=stepCinderling(state,p,target,1.1,40);
 assert.equal(step.warned,true);assert.equal(step.attack.stage,"MARK");
 assert.equal(step.attack.remainingMs,CINDERLING_WARN_MS);
 state=step.attack;
 const lock=[state.targetX,state.targetY,state.lockedAngle];
 for(let i=0;i<25;i++){
   step=stepCinderling(state,p,{x:0,y:850},1.1,40);
   state=step.attack;
   assert.equal(step.fired,false);assert.deepEqual(
     [state.targetX,state.targetY,state.lockedAngle],lock);
 }
 step=stepCinderling(state,p,{x:0,y:850},1.1,40);
 state=step.attack;
 assert.equal(state.stage,"LEAP");
 assert.equal(state.remainingMs,CINDERLING_LEAP_MS);
 assert.equal(step.fired,false);
 let burstCount=0;
 for(let i=0;i<14;i++){
   step=stepCinderling(state,p,{x:0,y:850},1.1,40);
   burstCount+=Number(step.fired);state=step.attack;
   assert.deepEqual([state.targetX,state.targetY,state.lockedAngle],lock);
   p={x:step.x,y:step.y};
 }
 assert.equal(burstCount,1);
 assert.equal(state.stage,"BURST");
 assert.ok(Math.hypot(p.x-lock[0],p.y-lock[1])<.01);
 assert.equal(stepCinderling(state,p,target,1,40).fired,false);
});
test("PYRA-04: finite four-ray cinders, diagonals remain safe, cooling vulnerability",()=>{
 const rays=projectCinderlingBurst(300,400,0);
 assert.equal(rays.length,CINDERLING_BURST_LIMIT);
 assert.ok(rays.every(v=>Math.abs(Math.hypot(v.vx,v.vy)-CINDERLING_CINDER_SPEED)<.001));
 assert.ok(rays.some(v=>v.vx>0&&Math.abs(v.vy)<.001));
 assert.ok(rays.some(v=>v.vy>0&&Math.abs(v.vx)<.001));
 assert.ok(rays.some(v=>v.vx<0&&Math.abs(v.vy)<.001));
 assert.ok(rays.some(v=>v.vy<0&&Math.abs(v.vx)<.001));
 assert.throws(()=>projectCinderlingBurst(NaN,0,0),RangeError);
 const state=createCinderlingAttack();
 assert.equal(cinderlingDamageMultiplier(state),1);
 assert.equal(cinderlingDamageMultiplier({...state,stage:"COOL"}),1.6);
 assert.ok(CINDERLING_COOL_MS>CINDERLING_BURST_MS);
});
test("PYRA-04: deterministic, bounded steps and real-native combat hookups",()=>{
 const state=createCinderlingAttack();
 assert.deepEqual(stepCinderling(state,pos,target,1.1,20),
   stepCinderling(state,pos,target,1.1,20));
 assert.deepEqual(state,createCinderlingAttack());
 assert.throws(()=>stepCinderling(state,pos,target,1.1,101),RangeError);
 assert.throws(()=>stepCinderling(state,pos,{x:NaN,y:0},1,20),RangeError);
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 for(const part of ["shouldSpawnCinderling(","stepCinderling(",
   "projectCinderlingBurst(","cinderlingDamageMultiplier(",
   "CINDERLING_BURST_LIMIT","registerCombatDefeat(enemy, proj.affinity)"]){
   assert.ok(game.includes(part),part);
 }
 assert.match(canvas,/case EnemyType.CINDERLING/);
 assert.match(canvas,/enemy.cinderlingAttack/);
});
