import test from "node:test";
import assert from "node:assert/strict";
import {
  beginRouteOverdriveQa,
  createRouteOverdriveQaState,
  endRouteOverdriveQa,
  projectRouteOverdriveQa,
} from "../../src/game/routeOverdriveQa";
import {
  OVERDRIVE_DURATION_MS,OVERDRIVE_REENTRY_LOCK_MS,
} from "../../src/game/combatOverdrive";
import { OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER } from "../../src/game/combatOverdriveEffects";
import { MAX_RESONANCE,COMBAT_CHAIN_WINDOW_MS } from "../../src/game/combatResonance";
import {
  createPhysicalRouteQaState,stepPhysicalRouteQa,
} from "../../src/game/physicalRouteQaSimulation";
import {
  createRouteDynamicQaState,stepRouteDynamicQaEncounter,
} from "../../src/game/routeDynamicEncounter";
import {
  createRouteOrbiWeaponsQaState,stepRouteOrbiWeaponsQa,
} from "../../src/game/routeOrbiWeaponsQa";
import { EnemyType, type Enemy, type Projectile } from "../../src/game/types";
import type { RouteRunGates } from "../../src/game/worldRouteClock";
const view={width:1100,height:480,zoom:1};
const gates:RouteRunGates={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};
const base=()=>createPhysicalRouteQaState(view,"c3b5",true,true,true,true,true);
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const crawler=(x:number,y:number,h=12):Enemy=>({
  id:"resonance-victim",type:EnemyType.CRAWLER,x,y,vx:0,vy:0,
  health:h,maxHealth:h,speed:0,size:20,color:"#fb7185",
  shootCooldown:0,pulseCooldown:0,contactDamageCooldown:0,
  isDead:false,isBoss:false,flashTicks:0,
});
test("C3B5: canonical 8s Overdrive and 4s reentry lock consume exactly 100 QA resonance",()=>{
  let state=createRouteOverdriveQaState();
  assert.equal(projectRouteOverdriveQa(state,0).resonance,0);
  state=beginRouteOverdriveQa(state,0,true);
  assert.equal(state.activations,0);
  state=beginRouteOverdriveQa(state,50,false,true);
  assert.equal(projectRouteOverdriveQa(state,50).resonance,MAX_RESONANCE);
  assert.equal(state.debugCharges,1);
  state=beginRouteOverdriveQa(state,100,true);
  assert.equal(state.activations,1);
  assert.equal(state.resonance.resonance,0);
  assert.equal(state.overdrive.endsAtMs,100+OVERDRIVE_DURATION_MS);
  assert.equal(state.overdrive.reentryAllowedAtMs,100+OVERDRIVE_DURATION_MS+OVERDRIVE_REENTRY_LOCK_MS);
  const active=projectRouteOverdriveQa(state,100);
  assert.equal(active.active,true);
  assert.equal(active.remainingMs,OVERDRIVE_DURATION_MS);
  assert.equal(active.damageMultiplier,OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER);
  state=beginRouteOverdriveQa(state,8000,true,true);
  assert.equal(state.activations,1);
  assert.equal(state.resonance.resonance,MAX_RESONANCE);
  assert.equal(projectRouteOverdriveQa(state,8100).active,false);
  assert.equal(projectRouteOverdriveQa(state,8100).reentryLocked,true);
  state=beginRouteOverdriveQa(state,12100,true);
  assert.equal(state.activations,2);
  assert.equal(state.resonance.resonance,0);
});

test("C3B5: real affinity chain diversity and damage-break semantics without awarding score",()=>{
  let state=createRouteOverdriveQaState();
  const affinities=["solar","hydro","wind","thermal"] as const;
  for(let i=0;i<4;i++){
    const at=100*(i+1);
    state=endRouteOverdriveQa(state,at,[{
      occurredAtMs:at,baseScore:0,affinity:affinities[i],
      isBoss:false,isElite:false,
    }],0);
  }
  assert.equal(state.creditedDefeats,4);
  assert.equal(state.resonance.chain,4);
  assert.equal(state.resonance.diversityMilestone,4);
  assert.ok(state.resonance.resonance>=30);
  const before=state.resonance.resonance;
  state=endRouteOverdriveQa(state,500,[],1);
  assert.equal(state.damageBreaks,1);
  assert.equal(state.resonance.chain,0);
  assert.equal(state.resonance.resonance,Math.max(0,before-35));
  assert.deepEqual(state.resonance.affinityTrail,[]);
  state=beginRouteOverdriveQa(state,500+COMBAT_CHAIN_WINDOW_MS+1);
  assert.equal(state.resonance.chain,0);
  assert.throws(()=>endRouteOverdriveQa(state,500,[{
    occurredAtMs:499,baseScore:0,affinity:"solar",
  }],0),/Uncertified/);
  assert.throws(()=>endRouteOverdriveQa(state,500,[{
    occurredAtMs:500,baseScore:30,affinity:"solar",
  }],0),/Uncertified/);
});

test("C3B5: actual physical projectile kill emits zero-score canonical resonance event with ORBI affinity",()=>{
  const state=base();
  const victim=crawler(state.player.x+80,state.player.y);
  const shot:Projectile={
    id:"resonance-test-shot",x:victim.x,y:victim.y,vx:0,vy:0,
    size:5,damage:50,color:"#38bdf8",
    life:900,maxLife:900,fromPlayer:true,affinity:"hydro",
    attackShape:"RIPPLE",
  };
  const scene={...state.encounter,
    enemies:[victim],projectiles:[shot],resources:[]};
  const tick=stepRouteDynamicQaEncounter(
    scene,createRouteDynamicQaState(),
    state.player,state.camera,view,50,50,true,true,true,
  );
  assert.equal(tick.dynamic.destroyed,1);
  assert.equal(tick.defeats.length,1);
  assert.deepEqual(tick.defeats[0],{
    occurredAtMs:50,baseScore:0,affinity:"hydro",isBoss:false,isElite:false,
  });
  const next=endRouteOverdriveQa(state.overdriveQa!,50,tick.defeats,0);
  assert.equal(next.resonance.resonance,4);
  assert.equal(next.creditedDefeats,1);
});

test("C3B5: canonical damage multiplier changes ORBI shots, never legacy shots",()=>{
  const state=base();
  const member=state.encounter.swarm[0];
  const enemy=crawler(member.x+90,member.y,100);
  const scene={...state.encounter,swarm:[member],enemies:[enemy],
    projectiles:[],resources:[]};
  const off=stepRouteOrbiWeaponsQa(scene,createRouteOrbiWeaponsQaState(),16.6);
  const on=stepRouteOrbiWeaponsQa(scene,createRouteOrbiWeaponsQaState(),16.6,undefined,true);
  assert.equal(off.encounter.projectiles.length,1);
  assert.equal(on.encounter.projectiles.length,1);
  near(on.encounter.projectiles[0].damage,
    off.encounter.projectiles[0].damage*OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER);
  assert.equal(off.encounter.projectiles[0].attackSignature,
    on.encounter.projectiles[0].attackSignature);
  assert.equal(member.shootCooldown,0);
});

test("C3B5: full route tick handles QA charge, explicit activation, expiry, locked reentry and reset",()=>{
  let s=base();
  assert.equal(s.overdriveQa?.activations,0);
  assert.equal(s.overdriveQa?.resonance.resonance,0);
  let charged=stepPhysicalRouteQa(s,50,{x:0,y:0},view,gates,false,false,true);
  assert.equal(charged.overdriveQa?.resonance.resonance,100);
  assert.equal(charged.overdriveQa?.debugCharges,1);
  const active=stepPhysicalRouteQa(charged,50,{x:0,y:0},view,gates,false,true);
  assert.equal(active.overdriveQa?.overdrive.active,true);
  assert.equal(active.overdriveQa?.activations,1);
  assert.equal(active.overdriveQa?.resonance.resonance,0);
  assert.equal(s.overdriveQa?.debugCharges,0);
  for(let i=0;i<170;i++){
    s=stepPhysicalRouteQa(i===0?active:s,50,{x:0,y:0},view,gates);
  }
  assert.equal(s.overdriveQa?.overdrive.active,false);
  assert.equal(s.overdriveQa?.activations,1);
  assert.ok(projectRouteOverdriveQa(s.overdriveQa!,s.frame.cursor.simulatedMs).reentryRemainingMs>0);
  const locked=stepPhysicalRouteQa(s,50,{x:0,y:0},view,gates,false,true,true);
  assert.equal(locked.overdriveQa?.activations,1);
  assert.equal(locked.overdriveQa?.resonance.resonance,100);
  assert.equal(base().overdriveQa?.activations,0);
});

test("C3B5: 20+ rebases and deterministic replay preserve Overdrive timings and the 30-ORBI roster",()=>{
  let a=base(),b=base();let rebases=0;
  for(let i=0;i<3000;i++){
    const v=i%17<10?{x:1,y:0}:{x:0,y:-.2};
    const charge=i===0;
    const activate=i===1||i===310;
    const nextA=stepPhysicalRouteQa(a,50,v,view,gates,false,activate,charge);
    const nextB=stepPhysicalRouteQa(b,50,v,view,gates,false,activate,charge);
    assert.deepEqual(nextA.overdriveQa,nextB.overdriveQa);
    assert.deepEqual(nextA.weapons,nextB.weapons);
    if(nextA.frame.originEpoch>a.frame.originEpoch)rebases++;
    assert.equal(nextA.encounter.swarm.length,30);
    assert.ok(Number.isFinite(nextA.player.x));
    a=nextA;b=nextB;
  }
  assert.ok(rebases>=20);
  assert.equal(a.rebases,rebases);
  assert.equal(a.overdriveQa?.debugCharges,1);
  // A second activation is legitimately earned from subsequent physical
  // ORBI defeats once the canonical 12-second window has passed; it is NOT
  // a spurious repeated keypress or a second injected QA charge.
  assert.equal(a.overdriveQa?.activations,2);
  assert.ok(a.overdriveQa!.creditedDefeats>0);
});

test("C3B5: pause, hidden, upgrade, modal and hitstop prevent charge/Overdrive progression",()=>{
  const original=base();
  for(const k of ["paused","hidden","upgradeOpen","modalOpen","hitstop"] as const){
    const frozen=stepPhysicalRouteQa(original,50,{x:1,y:0},view,
      {...gates,[k]:true},false,true,true);
    assert.equal(frozen,original);
    assert.equal(frozen.overdriveQa?.activations,0);
    assert.equal(frozen.overdriveQa?.debugCharges,0);
  }
  assert.equal(createPhysicalRouteQaState(view,undefined,true,true,true,true).overdriveQa,null);
  assert.throws(()=>createPhysicalRouteQaState(view,undefined,true,true,true,false,true),
    /requires C3B-4/);
  assert.throws(()=>beginRouteOverdriveQa(createRouteOverdriveQaState(),NaN,true),
    RangeError);
});
