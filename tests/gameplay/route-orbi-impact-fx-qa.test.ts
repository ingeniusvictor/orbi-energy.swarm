import test from "node:test";
import assert from "node:assert/strict";
import {
  applyRouteCanonicalImpactEffects,
} from "../../src/game/routeOrbiImpactFxQa";
import {
  createRouteDynamicQaState,stepRouteDynamicQaEncounter,
} from "../../src/game/routeDynamicEncounter";
import {
  createPhysicalRouteQaState,stepPhysicalRouteQa,
} from "../../src/game/physicalRouteQaSimulation";
import { getOrbiAttackProfile } from "../../src/game/orbiAttackProfiles";
import { EnemyType,type Enemy,type OrbiAttackSignature,type Projectile } from "../../src/game/types";
import type { RouteRunGates } from "../../src/game/worldRouteClock";

const view={width:1100,height:480,zoom:1};
const gates:RouteRunGates={
  playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false,
};
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const base=()=>createPhysicalRouteQaState(view,"c3b4-fx",true,true,true,true);
const enemy=(id:string,x:number,y:number,health=100):Enemy=>({
  id,type:EnemyType.CRAWLER,x,y,vx:0,vy:0,health,maxHealth:health,speed:65,
  size:12,color:"#fb7185",shootCooldown:0,pulseCooldown:0,
  contactDamageCooldown:0,isDead:false,isBoss:false,flashTicks:0,
});
const shot=(id:OrbiAttackSignature,x:number,y:number,damage=10):Projectile=>{
  const p=getOrbiAttackProfile(id);
  return {
    id:`qa-${id}`,x,y,vx:600,vy:0,damage,color:"#facc15",size:p.projectileSize,
    fromPlayer:true,life:p.lifetimeMs,maxLife:p.lifetimeMs,
    attackSignature:id,attackShape:p.shape,affinity:"solar",energyId:p.energyId,
    pushMultiplier:p.pushMultiplier,slowDurationMs:p.slowDurationMs,
    splashRadius:p.splashRadius,splashDamageMultiplier:p.splashDamageMultiplier,
    magneticPullRadius:p.magneticPullRadius,magneticPullStrength:p.magneticPullStrength,
  };
};

test("C3B4: TERMO and ATON apply their canonical splash radius and damage without duplicating the direct victim",()=>{
  for(const id of ["TERMO_BURST","ATON_PARTICLE","GAIA_SYNTHESIS"] as const){
    const p=getOrbiAttackProfile(id);
    const first=enemy("direct",800,480);
    const second=enemy("splash",800+p.splashRadius*.6,480);
    const outside=enemy("outside",800+p.splashRadius+100,480);
    const actors=[first,second,outside];
    const fx=applyRouteCanonicalImpactEffects(shot(id,800,480,10),first,actors);
    assert.equal(fx.splashHits,1,id);
    near(second.health,100-10*p.splashDamageMultiplier);
    near(first.health,100);
    near(outside.health,100);
    assert.equal(fx.splashKills.length,0);
  }
});

test("C3B4: MAGNE magnetic radius + strength relocate only neighbors, preserving unrelated world actors",()=>{
  const p=getOrbiAttackProfile("MAGNE_ARC");
  const direct=enemy("direct",800,480);
  const close=enemy("neighbor",800+p.magneticPullRadius*.5,480);
  const far=enemy("far",1100,480);
  const fx=applyRouteCanonicalImpactEffects(shot("MAGNE_ARC",800,480),direct,
    [direct,close,far]);
  assert.equal(fx.pulls,1);
  near(close.x,800+p.magneticPullRadius*.5-p.magneticPullStrength);
  near(far.x,1100);
  near(direct.x,800+5.5*p.pushMultiplier);
  assert.equal(fx.splashHits,0);
});

test("C3B4: AERO and KINETRIX pushback uses legacy CRAWLER factor 5.5 and profile multiplier",()=>{
  for(const id of ["AERO_CRESCENT","KINETRIX_LANCE","FOTON_LANCE"] as const){
    const p=getOrbiAttackProfile(id);
    const victim=enemy("direct",800,480);
    const result=applyRouteCanonicalImpactEffects(shot(id,800,480),victim,[victim]);
    near(victim.x,800+5.5*p.pushMultiplier);
    near(victim.y,480);
    assert.equal(result.pushes,1);
    assert.equal(result.slows,0);
    assert.equal(result.pulls,0);
  }
});

test("C3B4: HYDRO preserves maximum slow duration, and enemy chase uses legacy 45% speed",()=>{
  const p=getOrbiAttackProfile("HYDRO_PULSE");
  const victim=enemy("hydro",800,480);
  victim.slowTimer=1200;
  const fx=applyRouteCanonicalImpactEffects(shot("HYDRO_PULSE",800,480),victim,[victim]);
  assert.equal(fx.slows,1);
  assert.equal(victim.slowTimer,p.slowDurationMs);
  const s=base();
  const e=enemy("chaser",s.player.x+200,s.player.y);
  e.slowTimer=1000;
  const scene={...s.encounter,enemies:[e],projectiles:[],resources:[]};
  const slow=stepRouteDynamicQaEncounter(scene,createRouteDynamicQaState(),
    s.player,s.camera,view,50,50,true,true,true);
  const normal=stepRouteDynamicQaEncounter(scene,createRouteDynamicQaState(),
    s.player,s.camera,view,50,50,true,true,false);
  near(e.x-slow.encounter.enemies[0].x,65*.45*.05);
  near(e.x-normal.encounter.enemies[0].x,65*.05);
  near(slow.encounter.enemies[0].slowTimer!,950);
  near(e.slowTimer!,1000);
});

test("C3B4: secondary AoE kill drops exactly once, increments distinct area and total counters",()=>{
  const s=base();
  const hit=enemy("target",s.player.x+80,s.player.y,100);
  const collateral=enemy("nearby",hit.x+30,hit.y,3);
  const projectile=shot("TERMO_BURST",hit.x,hit.y,10);
  projectile.vx=0;
  const scene={...s.encounter,enemies:[hit,collateral],
    projectiles:[projectile],resources:[]};
  const result=stepRouteDynamicQaEncounter(
    scene,createRouteDynamicQaState(),s.player,s.camera,view,50,50,true,true,true,
  );
  assert.equal(result.dynamic.hits,1);
  assert.equal(result.dynamic.splashHits,1);
  assert.equal(result.dynamic.destroyed,1);
  assert.equal(result.dynamic.areaKills,1);
  assert.equal(result.encounter.resources.length,1);
  assert.equal(result.encounter.resources[0].type,"ENERGY");
  assert.ok(result.encounter.enemies.every(e=>e.id!=="nearby"));
});

test("C3B4: legacy C3B3 flag does NOT apply splash or knockback despite projectile metadata",()=>{
  const s=createPhysicalRouteQaState(view,undefined,true,true,true);
  const hit=enemy("target",s.player.x+70,s.player.y);
  const collateral=enemy("nearby",hit.x+25,hit.y);
  const projectile=shot("TERMO_BURST",hit.x,hit.y,10);
  projectile.vx=0;
  const scene={...s.encounter,enemies:[hit,collateral],
    projectiles:[projectile],resources:[]};
  const result=stepRouteDynamicQaEncounter(
    scene,createRouteDynamicQaState(),s.player,s.camera,view,50,50,true,true,false,
  );
  assert.equal(result.dynamic.hits,1);
  assert.equal(result.dynamic.splashHits,0);
  assert.equal(result.dynamic.pushes,0);
  assert.equal(result.dynamic.areaKills,0);
  assert.equal(result.encounter.enemies.find(e=>e.id==="nearby")?.health,100);
});

test("C3B4: boss, enemy type, hazards, invalid metadata and missing prerequisite reject effects",()=>{
  const a=enemy("crawler",800,480);
  const baseShot=shot("MAGNE_ARC",800,480);
  assert.throws(()=>applyRouteCanonicalImpactEffects(
    baseShot,a,[a,{...enemy("boss",850,480),isBoss:true}]),/Uncertified/);
  assert.throws(()=>applyRouteCanonicalImpactEffects(
    baseShot,a,[a,{...enemy("drone",850,480),type:EnemyType.DRONE}]),/Uncertified/);
  assert.throws(()=>applyRouteCanonicalImpactEffects(
    {...baseShot,magneticPullStrength:Number.NaN},a,[a]),RangeError);
  assert.throws(()=>applyRouteCanonicalImpactEffects(
    {...baseShot,convergenceTargetId:"test"},a,[a]),/Uncertified/);
  near(a.x,800);
  assert.throws(()=>createPhysicalRouteQaState(view,undefined,true,true,false,true),
    /requires C3B-3/);
  const s=base();
  assert.throws(()=>stepRouteDynamicQaEncounter({...s.encounter,
    hazardZones:[{x:10,y:10}]},s.dynamic!,s.player,s.camera,view,50,50,
    true,true,true),/Uncertified/);
  assert.throws(()=>stepRouteDynamicQaEncounter(s.encounter,s.dynamic!,
    s.player,s.camera,view,50,50,true,false,true),/requires C3B-2 and C3B-3/);
});

test("C3B4: deterministic replay and floating origin preserve cumulative effect counters",()=>{
  let a=base(),b=base(),rebases=0;
  for(let i=0;i<1350;i++){
    const input=i%21<14?{x:1,y:0}:{x:0,y:-.3};
    const nextA=stepPhysicalRouteQa(a,50,input,view,gates,i===0);
    const nextB=stepPhysicalRouteQa(b,50,input,view,gates,i===0);
    assert.deepEqual(nextA.dynamic,nextB.dynamic);
    assert.deepEqual(nextA.weapons,nextB.weapons);
    assert.deepEqual(nextA.encounter.enemies.map(e=>
      [e.id,e.x,e.y,e.health,e.slowTimer]),nextB.encounter.enemies.map(e=>
      [e.id,e.x,e.y,e.health,e.slowTimer]));
    if(nextA.frame.originEpoch>a.frame.originEpoch)rebases++;
    a=nextA;b=nextB;
  }
  assert.ok(rebases>=8);
  assert.equal(a.rebases,rebases);
  assert.ok(a.dynamic!.pushes>0);
  assert.ok(a.dynamic!.hits>0);
  assert.ok(a.dynamic!.splashHits>=0);
  assert.ok(a.dynamic!.magneticPulls>=0);
  assert.equal(a.encounter.swarm.length,30);
});

test("C3B4: pauses, hidden state, upgrade, hitstop and reset never progress effect owners",()=>{
  let s=base();
  for(let i=0;i<30;i++)s=stepPhysicalRouteQa(s,50,{x:1,y:0},view,gates);
  for(const gate of ["paused","hidden","modalOpen","upgradeOpen","hitstop"] as const){
    assert.equal(stepPhysicalRouteQa(s,50,{x:1,y:0},view,{
      ...gates,[gate]:true,
    }),s);
  }
  assert.equal(s.impactFxEnabled,true);
  assert.equal(base().dynamic?.splashHits,0);
  assert.equal(base().dynamic?.magneticPulls,0);
  assert.equal(createPhysicalRouteQaState(view,undefined,true,true,true).impactFxEnabled,false);
});
