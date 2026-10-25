import test from "node:test";
import assert from "node:assert/strict";
import {
  createRouteOrbiWeaponsQaState,
  stepRouteOrbiWeaponsQa,
  ROUTE_ORBI_BASE_SPEED_PER_FRAME,
  ROUTE_ORBI_FRAME_MS,
} from "../../src/game/routeOrbiWeaponsQa";
import { createPhysicalRouteQaState,stepPhysicalRouteQa } from "../../src/game/physicalRouteQaSimulation";
import { ORBI_ENERGY_CANON } from "../../src/game/orbiEnergyCanon";
import { getOrbiAttackProfile } from "../../src/game/orbiAttackProfiles";
import { FormationType, type Enemy } from "../../src/game/types";
import { ROUTE_QA_PROJECTILE_CAP } from "../../src/game/routeDynamicEncounter";
import type { RouteRunGates } from "../../src/game/worldRouteClock";

const view={width:1100,height:480,zoom:1};
const gates:RouteRunGates={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const base=()=>createPhysicalRouteQaState(view,"c3b3-test",true,true,true);
const target=(x:number,y:number):Enemy=>({
  id:"c3b3-target",type:"CRAWLER" as Enemy["type"],x,y,vx:0,vy:0,
  health:200,maxHealth:200,speed:0,size:18,color:"#fa7185",
  shootCooldown:0,pulseCooldown:0,contactDamageCooldown:0,
  isDead:false,isBoss:false,flashTicks:0,
});
const clean=(s:ReturnType<typeof base>)=>({...s.encounter,
  enemies:[],projectiles:[],resources:[],hazardZones:[]});

test("C3B3: 30 members include exactly three cycles of ten canonical energies",()=>{
  const s=base();
  assert.equal(s.encounter.swarm.length,30);
  for(let i=0;i<30;i++){
    const member=s.encounter.swarm[i];
    const definition=ORBI_ENERGY_CANON[i%10];
    assert.equal(member.energyId,definition.id);
    assert.equal(member.attackSignature,definition.attackSignature);
    assert.equal(member.affinity,definition.affinity);
    assert.equal(member.color,definition.color);
  }
  const old=createPhysicalRouteQaState(view,undefined,true,true);
  assert.equal(old.weapons,null);
  assert.ok(old.encounter.swarm.every(m=>m.energyId==="FOTON"));
  assert.throws(()=>createPhysicalRouteQaState(view,undefined,true,false,true),
    /requires C3B-2/);
});

test("C3B3: shared spatial index chooses nearest live target; no phantom shots",()=>{
  const s=base();
  const swarm=s.encounter.swarm.slice(0,1);
  const far=target(swarm[0].x+230,swarm[0].y);
  const nearEnemy={...target(swarm[0].x+90,swarm[0].y),id:"near"};
  const empty=stepRouteOrbiWeaponsQa({...clean(s),swarm},createRouteOrbiWeaponsQaState(),16.6);
  assert.equal(empty.encounter.projectiles.length,0);
  const result=stepRouteOrbiWeaponsQa({...clean(s),swarm,
    enemies:[far,nearEnemy]},createRouteOrbiWeaponsQaState(),16.6);
  assert.equal(result.weapons.targetsAcquired,1);
  assert.equal(result.weapons.volleys,1);
  const first=result.encounter.projectiles[0];
  assert.ok(first.vx>0);
  near(first.vy,0);
  assert.equal(first.attackSignature,"FOTON_LANCE");
  assert.equal(first.energyId,"FOTON");
  near(first.damage,4*getOrbiAttackProfile("FOTON_LANCE").damageMultiplier);
  near(Math.hypot(first.vx,first.vy),ROUTE_ORBI_BASE_SPEED_PER_FRAME/
    (ROUTE_ORBI_FRAME_MS/1000)*getOrbiAttackProfile("FOTON_LANCE").speedMultiplier);
  assert.equal(result.encounter.enemies[0].health,far.health);
  assert.equal(s.encounter.projectiles.length,0);
});

test("C3B3: profile identity, shape, speed, lifetime and cooldown for ten ORBI energies",()=>{
  const s=base();
  for(let i=0;i<10;i++){
    const shooter={...s.encounter.swarm[i],shootCooldown:0};
    const enemy=target(shooter.x+80,shooter.y);
    const result=stepRouteOrbiWeaponsQa({...clean(s),swarm:[shooter],enemies:[enemy]},
      createRouteOrbiWeaponsQaState(),16.6);
    const profile=getOrbiAttackProfile(shooter.attackSignature!);
    const shot=result.encounter.projectiles[0];
    assert.ok(shot,shooter.energyId+" did not fire");
    assert.equal(shot.attackSignature,profile.signature);
    assert.equal(shot.attackShape,profile.shape);
    assert.equal(shot.energyId,profile.energyId);
    near(shot.life,profile.lifetimeMs);
    near(shot.splashRadius!,profile.splashRadius);
    near(shot.magneticPullRadius!,profile.magneticPullRadius);
    near(shot.slowDurationMs!,profile.slowDurationMs);
    near(result.encounter.swarm[0].shootCooldown,
      profile.cooldownFrames);
  }
});

test("C3B3: QUANTUM echo uses actual canonical three-shot angles and no extra random",()=>{
  const s=base();
  const quantum={...s.encounter.swarm[8],shootCooldown:0};
  const result=stepRouteOrbiWeaponsQa({...clean(s),swarm:[quantum],
    enemies:[target(quantum.x+70,quantum.y)]},
    createRouteOrbiWeaponsQaState(),16.6);
  assert.equal(result.weapons.echoShots,2);
  assert.equal(result.encounter.projectiles.length,3);
  const profile=getOrbiAttackProfile("QUANTUM_PHASE");
  const angles=result.encounter.projectiles.map(p=>Math.atan2(p.vy,p.vx));
  near(angles[0],0);
  near(angles[1],-profile.echoAngleRadians);
  near(angles[2],profile.echoAngleRadians);
  near(result.encounter.projectiles[1].damage/
    (4*profile.damageMultiplier),profile.echoDamageMultiplier);
  assert.equal(result.encounter.projectiles[1].isCriticalShot,false);
  assert.equal(result.encounter.projectiles[2].isCriticalShot,false);
});

test("C3B3: formation perks match CIRCLE speed/damage and SHIELD target radius",()=>{
  const s=base();
  const member={...s.encounter.swarm[0],shootCooldown:0};
  const enemy=target(member.x+350,member.y);
  const scene={...clean(s),swarm:[member],enemies:[enemy]};
  const line=stepRouteOrbiWeaponsQa(scene,createRouteOrbiWeaponsQaState(),16.6,
    FormationType.LINE);
  const shield=stepRouteOrbiWeaponsQa(scene,createRouteOrbiWeaponsQaState(),16.6,
    FormationType.SHIELD);
  assert.equal(line.encounter.projectiles.length,0);
  assert.equal(shield.encounter.projectiles.length,1);
  const close={...clean(s),swarm:[member],enemies:[target(member.x+100,member.y)]};
  const ring=stepRouteOrbiWeaponsQa(close,createRouteOrbiWeaponsQaState(),16.6,
    FormationType.LINE);
  const star=stepRouteOrbiWeaponsQa(close,createRouteOrbiWeaponsQaState(),16.6,
    FormationType.CIRCLE);
  assert.ok(star.encounter.projectiles[0].damage>ring.encounter.projectiles[0].damage);
  assert.ok(Math.hypot(star.encounter.projectiles[0].vx,star.encounter.projectiles[0].vy)>
    Math.hypot(ring.encounter.projectiles[0].vx,ring.encounter.projectiles[0].vy));
  assert.ok(star.encounter.swarm[0].shootCooldown<ring.encounter.swarm[0].shootCooldown);
});

test("C3B3: H2NOVA/GAIA support shield is QA-only; no game stats mutation",()=>{
  const s=base();
  const support=s.encounter.swarm.filter(m=>m.energyId==="H2NOVA"||m.energyId==="GAIA");
  const enemy=target(support[0].x+80,support[0].y);
  const result=stepRouteOrbiWeaponsQa({...clean(s),swarm:support,enemies:[enemy]},
    createRouteOrbiWeaponsQaState(),16.6);
  assert.ok(result.restoredShield>0);
  assert.ok(result.weapons.supportRestored>0);
  assert.ok(result.encounter.projectiles.every(p=>p.supportShieldRestore!>=0));
  assert.equal(s.bridge?.shield,100);
});

test("C3B3: capped bursts, no target, frozen gates and strict boss/hazard safety",()=>{
  const s=base();
  assert.equal(s.encounter.swarm.length,30);
  const shared=target(s.player.x+95,s.player.y);
  const scene={...clean(s),enemies:[shared]};
  const r=stepRouteOrbiWeaponsQa(scene,createRouteOrbiWeaponsQaState(),50);
  assert.ok(r.encounter.projectiles.length<=ROUTE_QA_PROJECTILE_CAP);
  assert.equal(r.weapons.projectilesFired,r.encounter.projectiles.length);
  assert.throws(()=>stepRouteOrbiWeaponsQa({
    ...scene,hazardZones:[{x:1,y:1}],
  },createRouteOrbiWeaponsQaState(),50),/uncertified/);
  assert.throws(()=>stepRouteOrbiWeaponsQa({
    ...scene,enemies:[{...shared,isBoss:true}],
  },createRouteOrbiWeaponsQaState(),50),/uncertified/);
  assert.throws(()=>stepRouteOrbiWeaponsQa(scene,
    createRouteOrbiWeaponsQaState(),Number.NaN),RangeError);
  for(const gate of ["paused","hidden","modalOpen","upgradeOpen","hitstop"] as const){
    assert.equal(stepPhysicalRouteQa(s,50,{x:1,y:0},view,
      {...gates,[gate]:true}),s);
  }
});

test("C3B3: deterministic replay crosses origin rebases without shot ID or stats drift",()=>{
  let a=base(),b=base();let shifts=0;
  for(let i=0;i<800;i++){
    const input=i%15<10?{x:1,y:0}:{x:0,y:-.2};
    const na=stepPhysicalRouteQa(a,50,input,view,gates,i%300===0);
    const nb=stepPhysicalRouteQa(b,50,input,view,gates,i%300===0);
    if(na.frame.originEpoch>a.frame.originEpoch)shifts++;
    assert.deepEqual(na.weapons,nb.weapons);
    assert.deepEqual(na.encounter.projectiles.map(p=>[p.id,p.x,p.y,p.attackSignature]),
      nb.encounter.projectiles.map(p=>[p.id,p.x,p.y,p.attackSignature]));
    assert.ok(na.encounter.projectiles.length<=ROUTE_QA_PROJECTILE_CAP);
    assert.equal(na.encounter.swarm.length,30);
    a=na;b=nb;
  }
  assert.ok(shifts>=3);
  assert.ok(a.weapons!.projectilesFired>0);
  assert.equal(a.frame.originEpoch,a.rebases);
  const fresh=base();
  assert.equal(fresh.weapons!.projectilesFired,0);
  assert.equal(fresh.bridge!.shield,100);
});
