import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceRouteConvergenceQa,
  beginRouteConvergenceQa,
  createRouteConvergenceQaState,
  projectRouteConvergenceQa,
  registerRouteConvergenceHits,
  routeConvergenceWaveKey,
} from "../../src/game/routeConvergenceQa";
import {
  CONVERGENCE_CHANNEL_MS,CONVERGENCE_COOLDOWN_MS,CONVERGENCE_FALLOFF,
  CONVERGENCE_MAX_HITS,convergenceHitDamage,
} from "../../src/game/orbiConvergence";
import {
  beginRouteOverdriveQa,createRouteOverdriveQaState,
} from "../../src/game/routeOverdriveQa";
import {
  createPhysicalRouteQaState,stepPhysicalRouteQa,
} from "../../src/game/physicalRouteQaSimulation";
import { createRouteDynamicQaState,stepRouteDynamicQaEncounter,
  ROUTE_QA_PROJECTILE_CAP } from "../../src/game/routeDynamicEncounter";
import { EnemyType, type Enemy, type Projectile } from "../../src/game/types";
import type { RouteRunGates } from "../../src/game/worldRouteClock";
const view={width:1100,height:480,zoom:1};
const gates:RouteRunGates={
  playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false,
};
const near=(x:number,y:number)=>assert.ok(Math.abs(x-y)<1e-6,`${x} != ${y}`);
const original=()=>createPhysicalRouteQaState(view,"c3b6",true,true,true,true,true,true);
const foe=(id:string,x:number,y:number,h=100):Enemy=>({
  id,type:EnemyType.CRAWLER,x,y,vx:0,vy:0,health:h,maxHealth:h,
  speed:0,size:12,color:"#f77",shootCooldown:0,pulseCooldown:0,
  contactDamageCooldown:0,isDead:false,isBoss:false,flashTicks:0,
});
const loaded=()=>{
  const state=original();
  const point=state.player;
  return {...state,encounter:{...state.encounter,
    enemies:[
      foe("first",point.x+110,point.y,1000),
      foe("second",point.x+210,point.y,1000),
    ],projectiles:[],resources:[]}};
};

test("C3B6: canonical admission consumes 100 resonance with 8 ORBI and actual target",()=>{
  const s=loaded();
  const resonance=beginRouteOverdriveQa(s.overdriveQa!,0,false,true);
  const wave=routeConvergenceWaveKey(s.frame.cursor.segmentOrdinal);
  const action=beginRouteConvergenceQa(s.convergenceQa!,resonance,
    s.encounter,s.player,1000,wave,true,100);
  assert.equal(action.convergenceQa.activations,1);
  assert.equal(action.convergenceQa.convergence.channelUntilMs,
    1000+CONVERGENCE_CHANNEL_MS);
  assert.equal(action.convergenceQa.convergence.cooldownUntilMs,
    1000+CONVERGENCE_COOLDOWN_MS);
  assert.equal(action.convergenceQa.convergence.usedWaveKey,wave);
  assert.equal(action.overdriveQa.resonance.resonance,0);
  assert.equal(s.overdriveQa!.resonance.resonance,0);
  assert.equal(resonance.resonance.resonance,100);
  assert.equal(projectRouteConvergenceQa(action.convergenceQa,
    action.overdriveQa,s.encounter,s.player,1300,wave,100).chargeProgress,.375);
  assert.equal(projectRouteConvergenceQa(action.convergenceQa,
    action.overdriveQa,s.encounter,s.player,1300,wave,100).canActivate,false);
  assert.equal(routeConvergenceWaveKey(55),"ASTERIA_QA_SEGMENT:55");
  assert.throws(()=>routeConvergenceWaveKey(-1),RangeError);
});

test("C3B6: rejects while OD active, target absent, shield 0, less than 8 ORBI or repeated segment",()=>{
  const s=loaded();
  const charged=beginRouteOverdriveQa(s.overdriveQa!,100,false,true);
  const wave=routeConvergenceWaveKey(0);
  const noTarget=beginRouteConvergenceQa(s.convergenceQa!,charged,{
    ...s.encounter,enemies:[],
  },s.player,100,wave,true,100);
  assert.equal(noTarget.convergenceQa.activations,0);
  const noShield=beginRouteConvergenceQa(s.convergenceQa!,charged,
    s.encounter,s.player,100,wave,true,0);
  assert.equal(noShield.convergenceQa.activations,0);
  const few=beginRouteConvergenceQa(s.convergenceQa!,charged,{
    ...s.encounter,swarm:s.encounter.swarm.slice(0,7),
  },s.player,100,wave,true,100);
  assert.equal(few.convergenceQa.activations,0);
  const active=beginRouteOverdriveQa(charged,100,true);
  const blocked=beginRouteConvergenceQa(s.convergenceQa!,active,
    s.encounter,s.player,150,wave,true,100);
  assert.equal(blocked.convergenceQa.activations,0);
  assert.equal(blocked.overdriveQa.overdrive.active,true);
  const first=beginRouteConvergenceQa(s.convergenceQa!,charged,
    s.encounter,s.player,100,wave,true,100);
  const repeated=beginRouteConvergenceQa(first.convergenceQa,charged,
    s.encounter,s.player,61_000,wave,true,100);
  assert.equal(repeated.convergenceQa.activations,1);
  assert.equal(first.convergenceQa.convergence.usedWaveKey,wave);
});

test("C3B6: exactly one finite-ray, six ordered hits, canonical falloff and no extra damage",()=>{
  const s=loaded();
  const e=Array.from({length:8},(_,i)=>
    foe(`beam-${i}`,s.player.x+60+i*55,s.player.y,100));
  const charged=beginRouteOverdriveQa(s.overdriveQa!,0,false,true);
  const wave=routeConvergenceWaveKey(0);
  const scene={...s.encounter,enemies:e};
  const activated=beginRouteConvergenceQa(s.convergenceQa!,charged,
    scene,s.player,0,wave,true,100);
  const during=advanceRouteConvergenceQa(activated.convergenceQa,
    scene,s.player,799,wave,100);
  assert.equal(during.encounter,scene);
  assert.equal(during.convergenceQa.beams,0);
  const fired=advanceRouteConvergenceQa(activated.convergenceQa,
    scene,s.player,800,wave,100);
  assert.equal(fired.convergenceQa.beams,1);
  assert.equal(fired.convergenceQa.pinnedShots,CONVERGENCE_MAX_HITS);
  assert.equal(fired.convergenceQa.convergence.channelUntilMs,null);
  assert.equal(fired.convergenceQa.convergence.trail?.firedAtMs,800);
  const shots=fired.encounter.projectiles;
  assert.equal(shots.length,CONVERGENCE_MAX_HITS);
  assert.equal(new Set(shots.map(x=>x.convergenceTargetId)).size,6);
  assert.deepEqual(shots.map(p=>p.convergenceTargetId),
    ["beam-0","beam-1","beam-2","beam-3","beam-4","beam-5"]);
  assert.deepEqual(CONVERGENCE_FALLOFF,[1,.85,.7,.6,.5,.4]);
  shots.forEach((p,i)=>near(p.damage,convergenceHitDamage(30,i)));
  const tick=stepRouteDynamicQaEncounter(
    fired.encounter,createRouteDynamicQaState(),
    s.player,s.camera,view,50,800,true,true,true,true,
  );
  assert.equal(tick.convergenceHits,6);
  assert.equal(tick.convergenceKills,0);
  assert.equal(tick.dynamic.hits,6);
  assert.equal(tick.dynamic.pushes,0);
  assert.equal(tick.dynamic.splashHits,0);
  assert.equal(tick.encounter.enemies.find(x=>x.id==="beam-6")?.health,100);
  const next=registerRouteConvergenceHits(fired.convergenceQa,
    tick.convergenceHits,tick.convergenceKills);
  assert.equal(next.registeredHits,6);
  assert.equal(next.registeredKills,0);
  assert.equal(advanceRouteConvergenceQa(next,tick.encounter,s.player,
    850,wave,100).convergenceQa.beams,1);
});

test("C3B6: explicit target-pinned hit kills exactly one and grants zero score",()=>{
  const s=loaded();
  const victim=foe("target",s.player.x+100,s.player.y,12);
  const shot:Projectile={id:"route-convergence-qa",
    x:victim.x,y:victim.y,vx:1,vy:0,damage:52,
    size:1,color:"#67e8f9",fromPlayer:true,
    life:1,maxLife:1,convergenceTargetId:victim.id};
  const result=stepRouteDynamicQaEncounter({
    ...s.encounter,enemies:[victim],projectiles:[shot],resources:[],
  },createRouteDynamicQaState(),s.player,s.camera,view,50,50,
  true,true,true,true);
  assert.equal(result.convergenceHits,1);
  assert.equal(result.convergenceKills,1);
  assert.equal(result.dynamic.destroyed,1);
  assert.equal(result.encounter.resources.length,1);
  assert.deepEqual(result.defeats,[{occurredAtMs:50,baseScore:0}]);
  assert.equal(result.dynamic.splashHits,0);
  assert.equal(result.dynamic.pushes,0);
  const old=createRouteDynamicQaState();
  assert.throws(()=>stepRouteDynamicQaEncounter({
    ...s.encounter,enemies:[victim],projectiles:[shot],resources:[],
  },old,s.player,s.camera,view,50,50,
  true,true,true,false),/Uncertified target-pinned/);
});

test("C3B6: bounded QA magazine prioritizes six pinned bolts without increasing cap",()=>{
  const s=loaded();
  const e=Array.from({length:6},(_,i)=>foe(`beam-${i}`,
    s.player.x+70+i*80,s.player.y,100));
  const dummy:Projectile={id:"dummy",x:s.player.x,y:s.player.y,
    vx:1,vy:0,damage:1,size:2,color:"#fff",
    fromPlayer:true,life:2500,maxLife:2500};
  const shots=Array.from({length:ROUTE_QA_PROJECTILE_CAP},(_,i)=>({
    ...dummy,id:`ordinary-${i}`,
  }));
  const scene={...s.encounter,enemies:e,projectiles:shots};
  const charged=beginRouteOverdriveQa(s.overdriveQa!,0,false,true);
  const begin=beginRouteConvergenceQa(s.convergenceQa!,charged,
    scene,s.player,0,routeConvergenceWaveKey(0),true,100);
  const fired=advanceRouteConvergenceQa(begin.convergenceQa,
    scene,s.player,800,routeConvergenceWaveKey(0),100);
  assert.equal(fired.encounter.projectiles.length,ROUTE_QA_PROJECTILE_CAP);
  assert.equal(fired.encounter.projectiles.filter(p=>p.convergenceTargetId).length,6);
  assert.equal(scene.projectiles.length,ROUTE_QA_PROJECTILE_CAP);
  assert.equal(shots[0].life,2500);
});

test("C3B6: channel blocks Dash and Overdrive; slows manual controls to canonical 70 percent",()=>{
  const s=loaded();
  const charged=beginRouteOverdriveQa(s.overdriveQa!,0,false,true);
  const prepared={...s,overdriveQa:charged};
  const begin=stepPhysicalRouteQa(prepared,50,{x:0,y:1},view,gates,
    true,true,false,true);
  assert.equal(begin.convergenceQa?.activations,1);
  assert.equal(begin.convergenceQa?.convergence.channelUntilMs,800);
  assert.equal(begin.bridge?.dash.activatedAtMs,null);
  assert.equal(begin.overdriveQa?.activations,0);
  assert.equal(begin.overdriveQa?.resonance.resonance,0);
  const normal=stepPhysicalRouteQa(prepared,50,{x:0,y:1},view,gates);
  near(begin.player.y-s.player.y,
    (normal.player.y-s.player.y)*.70);
  const second=stepPhysicalRouteQa(begin,50,{x:0,y:0},view,gates,true,true);
  assert.equal(second.overdriveQa?.activations,0);
  assert.equal(second.bridge?.dash.activatedAtMs,null);
  const frozen=stepPhysicalRouteQa(begin,50,{x:1,y:0},view,
    {...gates,paused:true},true,true,true,true);
  assert.equal(frozen,begin);
});

test("C3B6: rebase registers beam trail as owned physical X and preserves immutable prior snapshot",()=>{
  const s=loaded();
  const charged=beginRouteOverdriveQa(s.overdriveQa!,0,false,true);
  let state:typeof s={...s,overdriveQa:charged};
  const sourceX=state.player.x;
  for(let i=0;i<16;i++){
    state=stepPhysicalRouteQa(state,50,{x:0,y:0},view,gates,
      false,false,false,i===0);
  }
  assert.equal(state.convergenceQa?.beams,1);
  const trail=state.convergenceQa!.convergence.trail!;
  assert.ok(trail);
  // Advance with large physical X to force floating-origin shift while the
  // beam trail is still in its 280ms visibility window.
  const previous=state;
  const shifted=stepPhysicalRouteQa(previous,50,{x:1,y:0},view,gates,
    true,false,false,false);
  assert.ok(shifted.convergenceQa?.convergence.trail);
  assert.equal(previous.convergenceQa!.convergence.trail!.x,trail.x);
  assert.ok(shifted.encounter.swarm.length===30);
  assert.equal(sourceX,800);
});

test("C3B6: cancellation on segment transition, expired targets and boss/hazard fail closed",()=>{
  const s=loaded();
  const charged=beginRouteOverdriveQa(s.overdriveQa!,0,false,true);
  const key=routeConvergenceWaveKey(0);
  const start=beginRouteConvergenceQa(s.convergenceQa!,charged,
    s.encounter,s.player,0,key,true,100).convergenceQa;
  const changed=advanceRouteConvergenceQa(start,s.encounter,s.player,500,
    routeConvergenceWaveKey(1),100);
  assert.equal(changed.convergenceQa.cancellations,1);
  assert.equal(changed.convergenceQa.convergence.channelUntilMs,null);
  const empty=advanceRouteConvergenceQa(start,{
    ...s.encounter,enemies:[],
  },s.player,800,key,100);
  assert.equal(empty.convergenceQa.cancellations,1);
  assert.equal(empty.convergenceQa.beams,0);
  assert.throws(()=>beginRouteConvergenceQa(start,charged,{
    ...s.encounter,enemies:[{...s.encounter.enemies[0],isBoss:true}],
  },s.player,100,key,true,100),/Uncertified/);
  assert.throws(()=>advanceRouteConvergenceQa(start,{
    ...s.encounter,hazardZones:[{x:12,y:22}],
  },s.player,800,key,100),/Uncertified/);
  assert.throws(()=>registerRouteConvergenceHits(start,1,2),RangeError);
  assert.ok(CONVERGENCE_COOLDOWN_MS===60_000);
});

test("C3B6: resets/disabled flags and deterministic 20+ rebases without score/persistence",()=>{
  let a=original(),b=original(),rebases=0;
  for(let i=0;i<2800;i++){
    const input=i%13<10?{x:1,y:0}:{x:0,y:-.2};
    const charge=i===0;
    const request=i===20;
    const x=stepPhysicalRouteQa(a,50,input,view,gates,
      false,false,charge,request);
    const y=stepPhysicalRouteQa(b,50,input,view,gates,
      false,false,charge,request);
    assert.deepEqual(x.convergenceQa,y.convergenceQa);
    assert.deepEqual(x.overdriveQa,y.overdriveQa);
    assert.equal(x.encounter.swarm.length,30);
    if(x.frame.originEpoch>a.frame.originEpoch)rebases++;
    a=x;b=y;
  }
  assert.ok(rebases>=20);
  assert.equal(a.rebases,rebases);
  assert.equal(original().convergenceQa?.beams,0);
  assert.equal(createPhysicalRouteQaState(view,undefined,true,true,true,true,true).convergenceQa,null);
  assert.throws(()=>createPhysicalRouteQaState(view,undefined,true,true,true,true,false,true),
    /requires C3B-5/);
});
