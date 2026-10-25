import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType } from "../../src/game/types";
import {
  createCampaignRuntimeWaveDescriptor,
} from "../../src/game/runtimeWaveDescriptor";
import { projectRuntimeCombatPressure } from "../../src/game/runtimeCombatPressure";
import {
  countRouteWave1Active,createRouteWave1QaState,projectRouteWave1RemainingMs,
  ROUTE_WAVE1_QA_ENEMY_PREFIX,ROUTE_WAVE1_QA_KEY,
  ROUTE_WAVE1_SCOUT_TIMES_MS,ROUTE_WAVE1_LEGACY_FRAME_MS,
  stepRouteWave1Qa,
} from "../../src/game/routeWave1Qa";
import { getRouteWorldRect } from "../../src/game/routeDynamicEncounter";
import { createPhysicalRouteQaState,stepPhysicalRouteQa } from "../../src/game/physicalRouteQaSimulation";
import type { RouteRunGates } from "../../src/game/worldRouteClock";
const viewport={width:1100,height:480,zoom:1};
const gates:RouteRunGates={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};
const scene=()=>createPhysicalRouteQaState(viewport,"wave1-replay",true,true,true,true,true,true,true);
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);

test("C3B7: uses exact campaign wave-1 RuntimeWaveDescriptor and official combat pressure",()=>{
  const state=createRouteWave1QaState();
  const d=createCampaignRuntimeWaveDescriptor(1);
  assert.deepEqual(state.descriptor,d);
  assert.equal(d.source.campaignWaveId,"scout_signal");
  assert.deepEqual(d.spawn.enemyComposition,[EnemyType.CRAWLER]);
  assert.equal(d.spawn.enemyBudget,12);
  assert.equal(d.spawn.maxConcurrentEnemies,8);
  assert.equal(d.spawn.spawnIntervalFrames,140);
  assert.equal(d.completionPolicy.type,"TIMEBOX");
  if(d.completionPolicy.type==="TIMEBOX")assert.equal(d.completionPolicy.durationMs,35_000);
  assert.equal(d.milestone,null);
  assert.equal(d.spawn.eliteChance,0);
  assert.equal(projectRuntimeCombatPressure(d).spawnSafetyRadius,150);
  assert.equal(state.waveKey,ROUTE_WAVE1_QA_KEY);
  assert.deepEqual(ROUTE_WAVE1_SCOUT_TIMES_MS,[500,2000,3500,5000]);
  assert.equal(ROUTE_WAVE1_LEGACY_FRAME_MS,16.6);
});

test("C3B7: exact 500/2000/3500/5000ms Scout staging then 140x16.6ms periodic rhythm",()=>{
  const src=scene();
  let wave=src.wave1Qa!;
  let encounter={...src.encounter,enemies:src.encounter.enemies.slice(0,1)};
  const sequence=[500,2000,3500,5000];
  for(let i=0;i<4;i++){
    const before=stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,sequence[i]-1);
    assert.equal(before.wave.spawned,i);
    const result=stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,sequence[i]);
    assert.equal(result.wave.spawned,i+1);
    assert.equal(result.encounter.enemies.length,encounter.enemies.length+1);
    wave=result.wave;encounter=result.encounter;
    assert.ok(encounter.enemies.at(-1)?.id.endsWith(String(i)));
  }
  near(wave.nextSpawnAtMs,5500+140*16.6);
  const prior=stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,7823);
  assert.equal(prior.wave.spawned,4);
  const periodic=stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,7824);
  assert.equal(periodic.wave.spawned,5);
  near(periodic.wave.nextSpawnAtMs,7824+140*16.6);
});

test("C3B7: canonical health and frame-to-physical speed range, no legacy X clamp",()=>{
  const src=scene();
  const result=stepRouteWave1Qa(src.wave1Qa!,src.encounter,
    {x:120000,y:480},{...src.camera,localX:119700},viewport,500);
  assert.equal(result.wave.spawned,1);
  const actor=result.encounter.enemies.at(-1)!;
  const rect=getRouteWorldRect({...src.camera,localX:119700},viewport);
  assert.equal(actor.type,EnemyType.CRAWLER);
  assert.equal(actor.maxHealth,15);
  assert.equal(actor.health,15);
  assert.equal(actor.size,10);
  assert.ok(actor.y<rect.top);
  assert.ok(actor.x>100000);
  const expected=(.8+.6*.1)/16.6*1000;
  near(actor.speed,expected);
  assert.equal(result.encounter.enemies.length,src.encounter.enemies.length+1);
  assert.equal(src.wave1Qa!.spawned,0);
});

test("C3B7: concurrent max 8 and global cap never issue duplicate spawns; retry under pressure",()=>{
  const src=scene();
  let wave=src.wave1Qa!;
  let encounter={...src.encounter,enemies:src.encounter.enemies.slice(0,1)};
  for(let i=0;i<8;i++){
    const now=i<4?[500,2000,3500,5000][i]:7824+(i-4)*2324;
    const v=stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,now);
    assert.equal(v.wave.spawned,i+1);
    wave=v.wave;encounter=v.encounter;
  }
  const congested=stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,
    wave.nextSpawnAtMs+2);
  assert.equal(congested.wave.spawned,8);
  assert.equal(congested.wave.heldForConcurrentCap,1);
  assert.equal(congested.encounter,encounter);
  const remaining=encounter.enemies.filter(e=>e.id!==`${ROUTE_WAVE1_QA_ENEMY_PREFIX}0`);
  const freed=stepRouteWave1Qa(congested.wave,
    {...encounter,enemies:remaining},src.player,src.camera,viewport,
    wave.nextSpawnAtMs+50);
  assert.equal(freed.wave.spawned,9);
  assert.ok(countRouteWave1Active(freed.encounter)<=8);
  assert.equal(new Set(freed.encounter.enemies.map(e=>e.id)).size,
    freed.encounter.enemies.length);
});

test("C3B7: single descriptor budget 12 and no wave-2 despite continued physical route",()=>{
  const src=scene();
  let wave=src.wave1Qa!;
  let encounter={...src.encounter,enemies:src.encounter.enemies.slice(0,1)};
  for(let i=0;i<12;i++){
    const due=wave.nextSpawnAtMs;
    // QA operator clears previously verified CRAWLER actors to test budget.
    encounter={...encounter,enemies:encounter.enemies.filter(e=>
      !e.id.startsWith(ROUTE_WAVE1_QA_ENEMY_PREFIX))};
    const next=stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,due);
    assert.equal(next.wave.spawned,i+1);
    wave=next.wave;encounter=next.encounter;
  }
  assert.equal(wave.spawned,12);
  assert.equal(stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,
    30_000).wave.spawned,12);
  const final=stepRouteWave1Qa(wave,encounter,src.player,src.camera,viewport,35_000);
  assert.equal(final.wave.status,"GATED_NEXT_WAVE");
  assert.equal(projectRouteWave1RemainingMs(final.wave,35_000),0);
  assert.equal(stepRouteWave1Qa(final.wave,final.encounter,src.player,src.camera,
    viewport,80_000).wave,final.wave);
  assert.ok(final.encounter.enemies.every(e=>e.type===EnemyType.CRAWLER));
});

test("C3B7: fail closed on boss, unknown enemy, hazards, and wave-2 descriptors",()=>{
  const src=scene();
  const wave=src.wave1Qa!;
  const actors=src.encounter;
  assert.throws(()=>stepRouteWave1Qa(
    {...wave,descriptor:createCampaignRuntimeWaveDescriptor(2)},
    actors,src.player,src.camera,viewport,500),/Uncertified/);
  assert.throws(()=>stepRouteWave1Qa(wave,{
    ...actors,enemies:[{...actors.enemies[0],type:EnemyType.DRONE}],
  },src.player,src.camera,viewport,500),/Uncertified/);
  assert.throws(()=>stepRouteWave1Qa(wave,{
    ...actors,enemies:[{...actors.enemies[0],isBoss:true}],
  },src.player,src.camera,viewport,500),/Uncertified/);
  assert.throws(()=>stepRouteWave1Qa(wave,{
    ...actors,hazardZones:[{x:100,y:200}],
  },src.player,src.camera,viewport,500),/Uncertified/);
  assert.throws(()=>stepRouteWave1Qa(wave,actors,src.player,src.camera,
    viewport,-1),RangeError);
});

test("C3B7: preserve C3B1-C3B6 legacy flags and reject non-certified activation",()=>{
  for(let flags=0;flags<7;flags++){
    const args=[true,true,true,true,true,true,false].map((v,i)=>i<flags?true:false);
    const src=createPhysicalRouteQaState(viewport,undefined,
      ...args as [boolean,boolean,boolean,boolean,boolean,boolean,boolean]);
    assert.equal(src.wave1Qa,null);
  }
  assert.throws(()=>createPhysicalRouteQaState(viewport,undefined,
    true,true,true,true,true,false,true),/requires C3B-6/);
  assert.equal(scene().wave1Qa?.spawned,0);
});

test("C3B7: timeboxed wave at 35s, pause/hidden, no generic 700ms spawns, 20+ rebases and deterministic replay",()=>{
  let a=scene(),b=scene();let rebaseCount=0;
  for(let i=0;i<3000;i++){
    const manual=i%14<10?{x:1,y:0}:{x:0,y:-.25};
    const va=stepPhysicalRouteQa(a,50,manual,viewport,gates);
    const vb=stepPhysicalRouteQa(b,50,manual,viewport,gates);
    assert.deepEqual(va.wave1Qa,vb.wave1Qa);
    assert.deepEqual(va.dynamic,vb.dynamic);
    assert.deepEqual(va.encounter.enemies.map(e=>[e.id,e.x,e.y,e.health]),
      vb.encounter.enemies.map(e=>[e.id,e.x,e.y,e.health]));
    assert.ok(va.encounter.enemies.every(e=>e.type===EnemyType.CRAWLER));
    assert.ok(countRouteWave1Active(va.encounter)<=8);
    assert.ok(va.wave1Qa!.spawned<=12);
    assert.equal(va.dynamic!.spawned,0);
    if(va.frame.originEpoch>a.frame.originEpoch)rebaseCount++;
    a=va;b=vb;
  }
  assert.ok(rebaseCount>=20);
  assert.equal(a.rebases,rebaseCount);
  assert.equal(a.wave1Qa?.status,"GATED_NEXT_WAVE");
  assert.equal(a.wave1Qa?.descriptor.source.campaignWaveId,"scout_signal");
  assert.equal(scene().wave1Qa?.spawned,0);
  for(const gate of ["paused","hidden","upgradeOpen","hitstop","modalOpen"] as const){
    const frozen=stepPhysicalRouteQa(a,50,{x:1,y:0},viewport,
      {...gates,[gate]:true});
    assert.equal(frozen,a);
  }
});
