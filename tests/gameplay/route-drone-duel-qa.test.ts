import test from "node:test";
import assert from "node:assert/strict";
import { EnemyType } from "../../src/game/types";
import {
  createRouteDroneDuelQaState,armRouteDroneDuelQa,stepRouteDroneDuelQa,
  ROUTE_DRONE_DUEL_PROJECTILE_CAP,
} from "../../src/game/routeDroneDuelQa";
import {
  createPhysicalRouteQaState,stepPhysicalRouteQa,armPhysicalRouteDroneDuelQa,
} from "../../src/game/physicalRouteQaSimulation";
import { rebaseRouteCoordinateOwners } from "../../src/game/routeCoordinateOwners";
import { projectDroneLockPreflightShot } from "../../src/game/routeWave3DronePreflightQa";

const viewport={width:1100,height:480,zoom:1};
const player={x:500,y:300};
const camera={localX:150,localY:60};
const near=(a:number,b:number,tolerance=1e-5)=>
  assert.ok(Math.abs(a-b)<tolerance,`${a} !== ${b}`);
const active={playing:true,paused:false,hidden:false,
  modalOpen:false,upgradeOpen:false,hitstop:false};

test("C3B11: explicit arming requires Wave3 gate and clean previous laboratory flags",()=>{
  const initial=createRouteDroneDuelQaState();
  assert.throws(()=>armRouteDroneDuelQa(initial,player,false),/denied/);
  assert.equal(initial.actor,null);
  const duel=armRouteDroneDuelQa(initial,player,true);
  assert.equal(duel.status,"ACTIVE");
  assert.equal(duel.actor?.type,EnemyType.DRONE);
  assert.equal(duel.actor?.x,player.x+260);
  assert.equal(duel.shield,100);
  assert.throws(()=>armRouteDroneDuelQa(duel,player,true),/clean/);
  const basic=createPhysicalRouteQaState(viewport);
  assert.throws(()=>armPhysicalRouteDroneDuelQa(basic),/flag/);
  assert.throws(()=>createPhysicalRouteQaState(viewport,undefined,
    true,true,true,true,true,true,true,true,false,true),/requires/);
});

test("C3B11: moving enemy shoots real time-evolving plasma with canonical 12-point QA shield contact",()=>{
  let duel=armRouteDroneDuelQa(createRouteDroneDuelQaState(),player,true);
  let observedShot=false;
  for(let tick=1;tick<=160;tick++){
    const next=stepRouteDroneDuelQa(duel,player,camera,viewport,50,tick*50);
    assert.ok(next.projectiles.length<=ROUTE_DRONE_DUEL_PROJECTILE_CAP);
    if(next.projectiles.length)observedShot=true;
    assert.ok(next.shield>=0&&next.shield<=100);
    assert.equal(next.actor?.isBoss,false);
    duel=next;
  }
  assert.ok(observedShot,"hostile plasma must physically exist");
  assert.ok(duel.fired>=1,"at least one canonical volley");
  assert.ok(duel.hits>=1,"plasma must actually strike the separate QA shield");
  assert.equal(duel.shield,Math.max(0,100-duel.hits*12));
  assert.equal(duel.actor?.type,EnemyType.DRONE);
});

test("C3B11: culling and expiration dispose projectile owners without rewards or extra damage",()=>{
  const initial=armRouteDroneDuelQa(createRouteDroneDuelQaState(),player,true);
  const plasma=projectDroneLockPreflightShot(initial.actor!,player,5,1)!;
  assert.ok(plasma);
  const outside={...plasma,x:10000,life:2500};
  const expiring={...plasma,id:"route-wave3-preflight-shot-7",life:1};
  const stepped=stepRouteDroneDuelQa({...initial,
    actor:{...initial.actor!,shootCooldown:200},
    projectiles:[outside,expiring]},player,camera,viewport,50,50);
  assert.equal(stepped.projectiles.length,0);
  assert.equal(stepped.culled,1);
  assert.equal(stepped.expired,1);
  assert.equal(stepped.hits,0);
  assert.equal(stepped.shield,100);
});

test("C3B11: zero/invalid ticks and disarmed state fail closed without mutating previous snapshot",()=>{
  const initial=createRouteDroneDuelQaState();
  assert.equal(stepRouteDroneDuelQa(initial,player,camera,viewport,50,50),initial);
  const activeDuel=armRouteDroneDuelQa(initial,player,true);
  assert.equal(stepRouteDroneDuelQa(activeDuel,player,camera,viewport,0,50),activeDuel);
  assert.throws(()=>stepRouteDroneDuelQa(activeDuel,player,camera,viewport,51,50),RangeError);
  assert.throws(()=>stepRouteDroneDuelQa(activeDuel,player,camera,viewport,20,NaN),RangeError);
  assert.equal(activeDuel.projectiles.length,0);
  assert.equal(activeDuel.actor?.shootCooldown,72);
});

test("C3B11: DRONE, plasma and 30 ORBI share one atomic origin shift",()=>{
  const route=createPhysicalRouteQaState(viewport,undefined,
    true,true,true,true,true,true,true,true,true,true);
  const armed=armRouteDroneDuelQa(createRouteDroneDuelQaState(),
    {x:65000,y:300},true);
  const plasma=projectDroneLockPreflightShot(armed.actor!,{x:65000,y:300},4,1)!;
  const duel={...armed,actor:{...armed.actor!},
    projectiles:[{...plasma}]};
  const encounter=structuredClone(route.encounter);
  const core={x:65000,y:300};
  const cam={localX:64700,localY:60};
  const beforeDX=duel.actor.x-core.x;
  const beforeShot=duel.projectiles[0].x-core.x;
  const frame=rebaseRouteCoordinateOwners({
    ...encounter,frame:route.frame,player:core,camera:cam,
    extraWorldAnchors:[...encounter.extraWorldAnchors,duel.actor,...duel.projectiles],
  },512,{phase:"TICK_BOUNDARY",unresolvedBossPhase:false,
    unregisteredWorldOwners:false});
  assert.equal(frame.frame.originOffsetX,512);
  near(duel.actor.x-core.x,beforeDX);
  near(duel.projectiles[0].x-core.x,beforeShot);
  assert.equal(encounter.swarm.length,30);
  near(duel.actor.x+512,65260);
});

test("C3B11: physical route can close both waves, arm one DRONE and retain Wave3 lock",()=>{
  let state=createPhysicalRouteQaState(viewport,undefined,
    true,true,true,true,true,true,true,true,true,true);
  assert.equal(state.droneDuelQa?.status,"DISARMED");
  assert.throws(()=>armPhysicalRouteDroneDuelQa(state),/denied/);
  let shifted=0;
  for(let i=0;i<1530&&state.wave2Qa?.status!=="GATED_WAVE3";i++){
    const prior=state.frame.originEpoch;
    state=stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,active);
    if(state.frame.originEpoch>prior)shifted++;
  }
  assert.equal(state.wave2Qa?.status,"GATED_WAVE3");
  assert.ok(shifted>0,"floating origin must have rebased before arming");
  state=armPhysicalRouteDroneDuelQa(state);
  assert.equal(state.droneDuelQa?.status,"ACTIVE");
  assert.equal(state.encounter.enemies.some(e=>e.type===EnemyType.DRONE),false);
  const first=state.droneDuelQa!.actor!.x+state.frame.originOffsetX;
  let fired=false;
  for(let i=0;i<110;i++){
    state=stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,active);
    if((state.droneDuelQa?.fired??0)>0)fired=true;
    assert.equal(state.wave2Qa?.status,"GATED_WAVE3");
    assert.equal(state.encounter.enemies.some(e=>e.type===EnemyType.DRONE),false);
  }
  assert.ok(fired);
  assert.ok(Number.isFinite(state.droneDuelQa!.actor!.x+state.frame.originOffsetX));
  assert.ok(first>0);
  const paused=stepPhysicalRouteQa(state,50,{x:1,y:0},viewport,{...active,paused:true});
  assert.equal(paused,state);
  assert.ok((state.droneDuelQa?.projectiles.length??0)<=ROUTE_DRONE_DUEL_PROJECTILE_CAP);
});
