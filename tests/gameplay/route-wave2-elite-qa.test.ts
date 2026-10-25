import test from "node:test";
import assert from "node:assert/strict";
import { EnemyType,type Projectile } from "../../src/game/types";
import { createCampaignRuntimeWaveDescriptor } from "../../src/game/runtimeWaveDescriptor";
import { createPhysicalRouteQaState,stepPhysicalRouteQa } from "../../src/game/physicalRouteQaSimulation";
import {
  adoptWave2EliteQa,isRouteWave2EliteQaEnemy,inspectRouteWave3PreflightQa,
  routeWave2EliteQaRoll,ROUTE_ELITE_HP_MULTIPLIER,
  ROUTE_ELITE_SIZE_MULTIPLIER,ROUTE_WAVE2_ELITE_QA_PREFIX,
} from "../../src/game/routeWave2EliteQa";
import {
  createRouteWave2QaState,makeRouteWave2Enemy,stepRouteWave2Qa,
  countWave2Live,projectRouteParasiteMotion,
} from "../../src/game/routeWave2Qa";
import { applyRouteCanonicalImpactEffects } from "../../src/game/routeOrbiImpactFxQa";
import { beginRouteOverdriveQa } from "../../src/game/routeOverdriveQa";
import { beginRouteConvergenceQa,advanceRouteConvergenceQa } from "../../src/game/routeConvergenceQa";
import type { RouteRunGates } from "../../src/game/worldRouteClock";
import type { RouteQaEncounter } from "../../src/game/routePhysicalQaEncounter";
const viewport={width:1100,height:480,zoom:1};
const gates:RouteRunGates={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};
const state=()=>createPhysicalRouteQaState(viewport,"c3b9-elite",true,true,true,true,true,true,true,true,true);
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-5,`${a}!=${b}`);
const descriptor=createCampaignRuntimeWaveDescriptor(2);
test("C3B9: 5% threshold deterministic QA samples, not canonical RNG; one PARASITE roll at ordinal 6",()=>{
 assert.equal(descriptor.spawn.eliteChance,.05);
 const successful=Array.from({length:18},(_,i)=>i).filter(
   i=>routeWave2EliteQaRoll(i)<descriptor.spawn.eliteChance);
 assert.deepEqual(successful,[6]);
 assert.equal(routeWave2EliteQaRoll(6),0);
 assert.equal(routeWave2EliteQaRoll(7),.35);
 assert.throws(()=>routeWave2EliteQaRoll(-1),RangeError);
});
test("C3B9: exact live elite multipliers 1.8x hp and 1.4x radius/tint, no attack-rate or speed change",()=>{
 const p={x:120000,y:360};
 const base=makeRouteWave2Enemy(EnemyType.PARASITE,6,p,descriptor);
 const projected=adoptWave2EliteQa(base,6,.05);
 assert.equal(projected.elite,true);
 assert.equal(projected.enemy.id,`${ROUTE_WAVE2_ELITE_QA_PREFIX}6`);
 assert.equal(projected.enemy.type,EnemyType.PARASITE);
 assert.equal(projected.enemy.evolvedVariantId,undefined);
 close(projected.enemy.health,base.health*ROUTE_ELITE_HP_MULTIPLIER);
 close(projected.enemy.maxHealth,base.maxHealth*ROUTE_ELITE_HP_MULTIPLIER);
 close(projected.enemy.size,base.size*ROUTE_ELITE_SIZE_MULTIPLIER);
 assert.equal(projected.enemy.color,"#f43f5e");
 assert.equal(projected.enemy.speed,base.speed);
 assert.equal(isRouteWave2EliteQaEnemy(projected.enemy),true);
 assert.equal(isRouteWave2EliteQaEnemy(base),false);
 const ordinary7=makeRouteWave2Enemy(EnemyType.CRAWLER,7,p,descriptor);
 assert.equal(adoptWave2EliteQa(ordinary7,7,.05).elite,false);
 assert.throws(()=>adoptWave2EliteQa({...base,isBoss:true},6,.05),/Uncertified/);
 assert.throws(()=>adoptWave2EliteQa(base,6,2),RangeError);
});
test("C3B9: Wave2 only permits specially marked QA random elites behind ninth gate",()=>{
 const s=state();
 const clean={...s.encounter,enemies:[]};
 let w=createRouteWave2QaState(),encounter:RouteQaEncounter=clean;
 for(let i=0;i<7;i++){
   const r=stepRouteWave2Qa(w,encounter,s.player,s.camera,viewport,
     w.nextSpawnAtMs,true);
   w=r.wave;
   encounter={...r.encounter,enemies:r.encounter.enemies.slice(-1)};
   assert.equal(w.spawned,i+1);
 }
 assert.equal(w.qaEliteRolls,7);
 assert.equal(w.qaEliteSpawned,1);
 assert.equal(w.uncertifiedEliteRollsSuppressed,0);
 assert.equal(encounter.enemies[0].id,`${ROUTE_WAVE2_ELITE_QA_PREFIX}6`);
 assert.equal(countWave2Live(encounter),1);
 assert.throws(()=>stepRouteWave2Qa(w,encounter,s.player,s.camera,viewport,
   w.nextSpawnAtMs),/Uncertified/);
 const permitted=stepRouteWave2Qa(w,encounter,s.player,s.camera,viewport,
   w.nextSpawnAtMs,true);
 assert.equal(permitted.wave.spawned,8);
 assert.equal(permitted.wave.qaEliteSpawned,1);
});
test("C3B9: physical elite lunge remains rebase-invariant and HYDRO slow effective",()=>{
 const e=adoptWave2EliteQa(
   makeRouteWave2Enemy(EnemyType.PARASITE,6,{x:105000,y:450},descriptor),6,.05).enemy;
 const p={x:105400,y:450};
 assert.throws(()=>projectRouteParasiteMotion(e,p,50,51000,2048,1),RangeError);
 const normal=projectRouteParasiteMotion(e,p,50,51000,2048,1,true);
 const rebased=projectRouteParasiteMotion({...e,x:e.x-512},
   {...p,x:p.x-512},50,51000,2560,1,true);
 close(normal.x-512,rebased.x);close(normal.y,rebased.y);
 const slow=projectRouteParasiteMotion(e,p,50,51000,2048,.45,true);
 assert.ok(normal.x>slow.x);
});
test("C3B9: elite impact applies original type base push, splash, contact; older gate refuses",()=>{
 const s=state();
 const e=adoptWave2EliteQa(
   makeRouteWave2Enemy(EnemyType.PARASITE,6,
     {x:s.player.x+90,y:s.player.y},descriptor),6,.05).enemy;
 const shot:Projectile={id:"qa",x:e.x,y:e.y,vx:4,vy:0,
   damage:5,size:6,color:"#fff",fromPlayer:true,
   life:100,maxLife:100,attackShape:"LANCE"};
 assert.throws(()=>applyRouteCanonicalImpactEffects(shot,e,[e],true),/Uncertified/);
 const victim={...e};
 const fx=applyRouteCanonicalImpactEffects(shot,victim,[victim],true,true);
 assert.equal(fx.pushes,1);
 close(victim.x,e.x+1.8);
 const critical={...e};
 applyRouteCanonicalImpactEffects({...shot,isCriticalShot:true},critical,[critical],true,true);
 close(critical.x,e.x+4);
});
test("C3B9: pinned Convergence accepts certified elite only behind C3B9 gate",()=>{
 const s=state();
 const e=adoptWave2EliteQa(
   makeRouteWave2Enemy(EnemyType.PARASITE,6,
     {x:s.player.x+110,y:s.player.y},descriptor),6,.05).enemy;
 const encounter={...s.encounter,enemies:[e],projectiles:[]};
 const ready=beginRouteOverdriveQa(s.overdriveQa!,0,false,true);
 const key=s.wave2Qa!.waveKey;
 assert.throws(()=>beginRouteConvergenceQa(s.convergenceQa!,ready,
   encounter,s.player,0,key,true,100,true),/Uncertified/);
 const a=beginRouteConvergenceQa(s.convergenceQa!,ready,encounter,
   s.player,0,key,true,100,true,true);
 assert.equal(a.convergenceQa.activations,1);
 assert.equal(a.overdriveQa.resonance.resonance,0);
 assert.throws(()=>advanceRouteConvergenceQa(a.convergenceQa,
   encounter,s.player,800,key,100,true),/Uncertified/);
 const fired=advanceRouteConvergenceQa(a.convergenceQa,
   encounter,s.player,800,key,100,true,true);
 assert.equal(fired.convergenceQa.beams,1);
 assert.ok(fired.encounter.projectiles.some(p=>p.convergenceTargetId===e.id));
});
test("C3B9: Wave3 Drone Lock read-only preflight with no authorized spawn",()=>{
 const p=inspectRouteWave3PreflightQa();
 const d=createCampaignRuntimeWaveDescriptor(3);
 assert.equal(p.name,d.display.displayName);
 assert.deepEqual(p.composition,[EnemyType.DRONE,EnemyType.CRAWLER]);
 assert.equal(p.budget,d.spawn.enemyBudget);
 assert.equal(p.concurrentCap,d.spawn.maxConcurrentEnemies);
 assert.equal(p.eliteChance,d.spawn.eliteChance);
 assert.equal(p.certifiedForSpawn,false);
});
test("C3B9: replay and pause 1,600 frames through elite Wave2, no wave3, no generic 700ms spawns",()=>{
 let a=state(),b=state(),rebases=0;
 for(let i=0;i<1600;i++){
   const input=i%13<10?{x:1,y:0}:{x:0,y:-.2};
   const x=stepPhysicalRouteQa(a,50,input,viewport,gates);
   const y=stepPhysicalRouteQa(b,50,input,viewport,gates);
   assert.deepEqual(x.wave2Qa,y.wave2Qa);
   assert.deepEqual(x.dynamic,y.dynamic);
   assert.deepEqual(x.encounter.enemies.map(e=>[e.id,e.type,e.x,e.y,e.health,e.size]),
     y.encounter.enemies.map(e=>[e.id,e.type,e.x,e.y,e.health,e.size]));
   assert.equal(x.dynamic!.spawned,0);
   assert.ok(x.encounter.enemies.length<=12);
   if(x.frame.originEpoch>a.frame.originEpoch)rebases++;
   a=x;b=y;
 }
 assert.ok(rebases>=15);
 assert.equal(a.wave2Qa!.status,"GATED_WAVE3");
 assert.ok(a.wave2Qa!.qaEliteRolls<=18);
 assert.ok(a.wave2Qa!.qaEliteSpawned<=a.wave2Qa!.qaEliteRolls);
 assert.equal(a.encounter.enemies.some(e=>e.type===EnemyType.DRONE),false);
 for(const k of ["paused","hidden","upgradeOpen","hitstop","modalOpen"] as const)
   assert.equal(stepPhysicalRouteQa(a,50,{x:1,y:0},viewport,{...gates,[k]:true}),a);
 assert.equal(state().wave2Qa!.qaEliteRolls,0);
 assert.throws(()=>createPhysicalRouteQaState(viewport,undefined,
   true,true,true,true,true,true,true,false,true),/requires C3B-8/);
});
