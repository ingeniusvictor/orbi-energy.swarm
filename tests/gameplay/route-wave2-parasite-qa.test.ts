import test from "node:test";
import assert from "node:assert/strict";
import { createCampaignRuntimeWaveDescriptor } from "../../src/game/runtimeWaveDescriptor";
import {
  createRouteWave2QaState,stepRouteWave2Qa,makeRouteWave2Enemy,
  projectRouteParasiteMotion,routeWave2RemainingMs,countWave2Live,
  ROUTE_WAVE2_START_MS,ROUTE_WAVE2_QA_KEY,ROUTE_WAVE2_QA_ENEMY_PREFIX,
} from "../../src/game/routeWave2Qa";
import { EnemyType,type Enemy,type Projectile } from "../../src/game/types";
import { createPhysicalRouteQaState,stepPhysicalRouteQa } from "../../src/game/physicalRouteQaSimulation";
import { applyRouteCanonicalImpactEffects } from "../../src/game/routeOrbiImpactFxQa";
import { beginRouteOverdriveQa } from "../../src/game/routeOverdriveQa";
import { beginRouteConvergenceQa } from "../../src/game/routeConvergenceQa";
import { stepRouteDynamicQaEncounter,createRouteDynamicQaState } from "../../src/game/routeDynamicEncounter";
import type { RouteRunGates } from "../../src/game/worldRouteClock";
const viewport={width:1100,height:480,zoom:1};
const gates:RouteRunGates={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};
const base=()=>createPhysicalRouteQaState(viewport,"wave2-certification",true,true,true,true,true,true,true,true);
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<.00001,`${a} != ${b}`);
const paras=(id:string,x:number,y:number,h=100):Enemy=>({
 id,type:EnemyType.PARASITE,x,y,vx:0,vy:0,
 health:h,maxHealth:h,speed:150,size:8,color:"#f43f5e",
 shootCooldown:0,pulseCooldown:0,contactDamageCooldown:0,
 isDead:false,isBoss:false,flashTicks:0,
});
test("C3B8: exact Wave2 descriptor; explicit elite probability and hazard exclusion",()=>{
 const d=createRouteWave2QaState().descriptor;
 assert.deepEqual(d,createCampaignRuntimeWaveDescriptor(2));
 assert.equal(d.source.campaignWaveId,"parasite_drift");
 assert.deepEqual(d.spawn.enemyComposition,[EnemyType.PARASITE,EnemyType.CRAWLER]);
 assert.equal(d.spawn.enemyBudget,18);
 assert.equal(d.spawn.maxConcurrentEnemies,12);
 assert.equal(d.spawn.spawnIntervalFrames,110);
 assert.equal(d.spawn.eliteChance,.05);
 assert.deepEqual(d.modifiers,["PARASITE_SPEED_SURGE"]);
 assert.equal(d.completionPolicy.type,"TIMEBOX");
 if(d.completionPolicy.type==="TIMEBOX")assert.equal(d.completionPolicy.durationMs,40000);
 assert.equal(ROUTE_WAVE2_QA_KEY,"CAMPAIGN_QA:parasite_drift");
 assert.equal(routeWave2RemainingMs(createRouteWave2QaState(),35000),40000);
 assert.equal(routeWave2RemainingMs(createRouteWave2QaState(),75000),0);
 assert.throws(()=>routeWave2RemainingMs(createRouteWave2QaState(),-1),RangeError);
});
test("C3B8: Wave2 starts strictly at 35s, then first 110-frame shot at 36.826s",()=>{
 const s=base();
 const w=s.wave2Qa!;
 const before=stepRouteWave2Qa(w,s.encounter,s.player,s.camera,viewport,34999);
 assert.equal(before.wave.status,"PENDING");
 const start=stepRouteWave2Qa(w,s.encounter,s.player,s.camera,viewport,35000);
 assert.equal(start.wave.status,"ACTIVE");
 assert.equal(start.wave.spawned,0);
 const pre=stepRouteWave2Qa(start.wave,start.encounter,s.player,s.camera,viewport,36825);
 assert.equal(pre.wave.spawned,0);
 const first=stepRouteWave2Qa(start.wave,start.encounter,s.player,s.camera,viewport,36826);
 assert.equal(first.wave.spawned,1);
 assert.equal(first.wave.spawnedParasites,1);
 assert.equal(first.wave.uncertifiedEliteRollsSuppressed,1);
 assert.equal(first.encounter.enemies[0].type,EnemyType.PARASITE);
 assert.equal(first.encounter.enemies[0].maxHealth,8*1.15);
 close(first.encounter.enemies[0].speed,1.8*1.4/16.6*1000);
 const second=stepRouteWave2Qa(first.wave,first.encounter,s.player,s.camera,viewport,38652);
 assert.equal(second.wave.spawned,2);
 assert.equal(second.encounter.enemies.at(-1)?.type,EnemyType.CRAWLER);
 assert.equal(second.encounter.enemies.at(-1)?.maxHealth,15*1.15);
 assert.equal(second.wave.uncertifiedEliteRollsSuppressed,2);
});
test("C3B8: alternating ordinary PARASITE/CRAWLER budget 18 with cap 12 and Wave3 gate",()=>{
 const s=base();
 let w=s.wave2Qa!,actors={...s.encounter,enemies:[]};
 for(let i=0;i<18;i++){
   actors={...actors,enemies:[]};
   const next=stepRouteWave2Qa(w,actors,s.player,s.camera,viewport,w.nextSpawnAtMs);
   assert.equal(next.wave.spawned,i+1);
   assert.equal(next.encounter.enemies[0].id,
     `${ROUTE_WAVE2_QA_ENEMY_PREFIX}${i}`);
   w=next.wave;actors=next.encounter;
 }
 assert.equal(w.spawnedParasites,9);
 assert.equal(w.uncertifiedEliteRollsSuppressed,18);
 assert.equal(stepRouteWave2Qa(w,actors,s.player,s.camera,viewport,70000).wave.spawned,18);
 const gated=stepRouteWave2Qa(w,actors,s.player,s.camera,viewport,75000);
 assert.equal(gated.wave.status,"GATED_WAVE3");
 assert.equal(stepRouteWave2Qa(gated.wave,gated.encounter,s.player,s.camera,viewport,100000).wave,
   gated.wave);
 assert.equal(countWave2Live(gated.encounter),1);
});
test("C3B8: 12 physical concurrent actors block spawn, then retry without spending budget",()=>{
 const s=base(),w=s.wave2Qa!;
 const actors={...s.encounter,enemies:Array.from({length:12},(_,i)=>
   paras(`parasite-${i}`,s.player.x+250+i*10,s.player.y))};
 const held=stepRouteWave2Qa(w,actors,s.player,s.camera,viewport,36826);
 assert.equal(held.wave.spawned,0);
 assert.equal(held.wave.heldForCap,1);
 const next=stepRouteWave2Qa(held.wave,{...actors,enemies:actors.enemies.slice(0,11)},
   s.player,s.camera,viewport,36876);
 assert.equal(next.wave.spawned,1);
 assert.equal(next.encounter.enemies.length,12);
});
test("C3B8: physical viewport X beyond 100000 and speed-surge phase stays stable across rebase",()=>{
 const d=createRouteWave2QaState().descriptor;
 const p={x:100200,y:480};
 const e=makeRouteWave2Enemy(EnemyType.PARASITE,0,p,d);
 close(e.health,9.2);
 const origin=1024;
 const out=projectRouteParasiteMotion(e,{x:100800,y:480},50,40200,origin,1);
 const shifted=projectRouteParasiteMotion({...e,x:e.x-512},
   {x:100800-512,y:480},50,40200,origin+512,1);
 close(out.x-512,shifted.x);close(out.y,shifted.y);
 const slow=projectRouteParasiteMotion(e,{x:100800,y:480},50,40200,origin,.45);
 assert.ok(slow.x<out.x);
 assert.throws(()=>projectRouteParasiteMotion({...e,type:EnemyType.DRONE},
   {x:100800,y:480},50,40200,origin,1),RangeError);
});
test("C3B8: ordinary PARASITE direct push 1.8, critical 4.0, CRAWLER 5.5 and spatial splash",()=>{
 const victim=paras("v",800,480);
 const splash=paras("s",830,480);
 const bullet:Projectile={id:"p",x:800,y:480,vx:10,vy:0,damage:10,size:5,
   life:100,maxLife:100,fromPlayer:true,color:"#fff",
   pushMultiplier:1,splashRadius:50,splashDamageMultiplier:.5};
 assert.throws(()=>applyRouteCanonicalImpactEffects(bullet,victim,[victim,splash]),
   /Uncertified/);
 const res=applyRouteCanonicalImpactEffects(bullet,victim,[victim,splash],true);
 close(victim.x,801.8);close(splash.health,95);
 assert.equal(res.splashHits,1);
 const crit=paras("crit",800,480);
 const critFx=applyRouteCanonicalImpactEffects({...bullet,isCriticalShot:true,
   splashRadius:0},crit,[crit],true);
 close(crit.x,804);assert.equal(critFx.pushes,1);
 const crawler={...paras("crawler",800,480),type:EnemyType.CRAWLER};
 applyRouteCanonicalImpactEffects({...bullet,splashRadius:0},crawler,[crawler],true);
 close(crawler.x,805.5);
});
test("C3B8: Convergence admits ordinary PARASITE only with the wave2 authority",()=>{
 const s=base();
 const e=paras("live",s.player.x+150,s.player.y);
 const encounter={...s.encounter,enemies:[e]};
 const charged=beginRouteOverdriveQa(s.overdriveQa!,0,false,true);
 assert.throws(()=>beginRouteConvergenceQa(s.convergenceQa!,charged,
   encounter,s.player,0,s.wave2Qa!.waveKey,true,100),/Uncertified/);
 const yes=beginRouteConvergenceQa(s.convergenceQa!,charged,
   encounter,s.player,0,s.wave2Qa!.waveKey,true,100,true);
 assert.equal(yes.convergenceQa.activations,1);
 assert.equal(yes.overdriveQa.resonance.resonance,0);
});
test("C3B8: dynamic physical PARASITE survives swept ORBI hit and contact after transition",()=>{
 const s=base();
 const e=paras("moving",s.player.x+120,s.player.y,100);
 const bullet:Projectile={id:"hit",x:e.x,y:e.y,vx:0,vy:0,
  damage:5,size:8,color:"#fff",life:100,maxLife:100,fromPlayer:true,
  attackShape:"LANCE",pushMultiplier:1};
 const eScene={...s.encounter,enemies:[e],projectiles:[bullet],resources:[]};
 const result=stepRouteDynamicQaEncounter(eScene,createRouteDynamicQaState(),
  s.player,s.camera,viewport,50,38000,true,true,true,true,true,true,512);
 assert.equal(result.dynamic.hits,1);
 assert.equal(result.dynamic.pushes,1);
 assert.equal(result.encounter.enemies[0].health,95);
 assert.equal(result.encounter.enemies[0].type,EnemyType.PARASITE);
});
test("C3B8: wave1 and wave2 deterministic replay, pause and rebases with no generic spawner",()=>{
 let a=base(),b=base(),rebases=0;
 assert.equal(a.wave2Qa!.status,"PENDING");
 assert.equal(a.encounter.enemies.length,0);
 for(let i=0;i<1800;i++){
  const v=i%18<12?{x:1,y:0}:{x:0,y:-.2};
  const x=stepPhysicalRouteQa(a,50,v,viewport,gates);
  const y=stepPhysicalRouteQa(b,50,v,viewport,gates);
  assert.deepEqual(x.wave1Qa,y.wave1Qa);
  assert.deepEqual(x.wave2Qa,y.wave2Qa);
  assert.deepEqual(x.dynamic,y.dynamic);
  assert.deepEqual(x.encounter.enemies.map(e=>[e.id,e.type,e.x,e.y,e.health]),
    y.encounter.enemies.map(e=>[e.id,e.type,e.x,e.y,e.health]));
  assert.equal(x.dynamic!.spawned,0);
  assert.ok(x.encounter.enemies.length<=12);
  if(x.frame.originEpoch>a.frame.originEpoch)rebases++;
  a=x;b=y;
 }
 assert.ok(rebases>=15);
 assert.equal(a.wave1Qa!.status,"GATED_NEXT_WAVE");
 assert.equal(a.wave2Qa!.status,"GATED_WAVE3");
 assert.ok(a.wave2Qa!.spawned<=18);
 assert.ok(a.wave2Qa!.spawnedParasites>0);
 for(const k of ["paused","hidden","upgradeOpen","modalOpen","hitstop"] as const){
  assert.equal(stepPhysicalRouteQa(a,50,{x:1,y:0},viewport,{...gates,[k]:true}),a);
 }
 assert.equal(base().wave2Qa!.spawned,0);
 assert.equal(createPhysicalRouteQaState(viewport,undefined,
   true,true,true,true,true,true,true).wave2Qa,null);
 assert.throws(()=>createPhysicalRouteQaState(viewport,undefined,
   true,true,true,true,true,true,false,true),/requires C3B-7/);
});
test("C3B8: unsupported enemy types, elites, hazards and descriptor mutation fail closed",()=>{
 const s=base(),w=s.wave2Qa!;
 const e=paras("bad",800,480);
 const actor={...s.encounter,enemies:[{...e,type:EnemyType.DRONE}]};
 assert.throws(()=>stepRouteWave2Qa(w,actor,s.player,s.camera,viewport,38000),
   /Uncertified/);
 const boss={...s.encounter,enemies:[{...e,isBoss:true}]};
 assert.throws(()=>stepRouteWave2Qa(w,boss,s.player,s.camera,viewport,38000),
   /Uncertified/);
 const elite={...s.encounter,enemies:[{...e,evolvedVariantId:"PHASE_PARASITE" as const}]};
 assert.throws(()=>stepRouteWave2Qa(w,elite,s.player,s.camera,viewport,38000),
   /Uncertified/);
 const hazard={...s.encounter,hazardZones:[{x:800,y:300}]};
 assert.throws(()=>stepRouteWave2Qa(w,hazard,s.player,s.camera,viewport,38000),
   /Uncertified/);
 assert.throws(()=>stepRouteWave2Qa({...w,descriptor:{
   ...w.descriptor,spawn:{...w.descriptor.spawn,enemyBudget:19},
 }},s.encounter,s.player,s.camera,viewport,38000),/Uncertified/);
});
