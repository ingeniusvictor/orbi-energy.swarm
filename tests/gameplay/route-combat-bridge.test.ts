import assert from "node:assert/strict";
import test from "node:test";
import {
  activatePropulsionDash,
  createPropulsionDashState,
  DASH_COOLDOWN_MS,DASH_DURATION_MS,DASH_SPEED_UNITS_PER_MS,
  projectPropulsionDash,
  stepPropulsionDash,
  stepRoutePropulsionDash,
} from "../../src/game/propulsionDash";
import {
  createRouteCombatBridgeState,
  resolveRouteDashDirection,
  stepRouteCombatBridge,
  ROUTE_BRIDGE_CONTACT_COOLDOWN_MS,
} from "../../src/game/routeCombatBridge";
import {
  createPhysicalRouteQaState,stepPhysicalRouteQa,
} from "../../src/game/physicalRouteQaSimulation";
import { localRouteDistanceSquared } from "../../src/game/physicalRouteSpace";
import {
  createRouteDynamicQaState,
  stepRouteDynamicQaEncounter,
} from "../../src/game/routeDynamicEncounter";
import { EnemyType } from "../../src/game/types";
import type { RouteRunGates } from "../../src/game/worldRouteClock";

const viewport={width:1100,height:480,zoom:1};
const gates:RouteRunGates={
  playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false,
};
const near=(x:number,y:number)=>assert.ok(Math.abs(x-y)<1e-6,`${x} != ${y}`);
const start=()=>createPhysicalRouteQaState(viewport,"c3b2-seeded",true,true);

test("UX15-C3B2: original Dash and route Dash use EXACT same swept timing in ordinary bounds",()=>{
  const activation=activatePropulsionDash(createPropulsionDashState(),100,{x:1,y:-1});
  assert.equal(activation.activated,true);
  const position={x:800,y:480};
  for(const end of [116,150,200,280,300]){
    const legacy=stepPropulsionDash(activation.state,end,16,position,
      {width:1600,height:960,radius:42});
    const route=stepRoutePropulsionDash(activation.state,end,16,position,
      {height:960,radius:42});
    near(legacy.position.x,route.position.x);
    near(legacy.position.y,route.position.y);
    near(legacy.moved,route.moved);
    assert.equal(legacy.activeDuringFrame,route.activeDuringFrame);
  }
  assert.equal(DASH_DURATION_MS,180);
  assert.equal(DASH_COOLDOWN_MS,18_000);
  assert.equal(DASH_SPEED_UNITS_PER_MS,.72);
});

test("UX15-C3B2: no WORLD_WIDTH X clamp at either physical edge; Y radius remains bounded",()=>{
  const state=activatePropulsionDash(createPropulsionDashState(),0,{x:1,y:1}).state;
  const from={x:1599,y:914};
  const next=stepRoutePropulsionDash(state,50,50,from,{height:960,radius:42});
  assert.ok(next.position.x>1600);
  assert.ok(next.position.y<=918);
  const legacy=stepPropulsionDash(state,50,50,from,
    {width:1600,height:960,radius:42});
  assert.ok(legacy.position.x<=1558);
  const back=activatePropulsionDash(createPropulsionDashState(),0,{x:-1,y:0}).state;
  const negative=stepRoutePropulsionDash(back,50,50,{x:-400,y:400},
    {height:960,radius:42});
  assert.ok(negative.position.x < -400);
  assert.throws(()=>stepRoutePropulsionDash(back,50,50,{x:Infinity,y:0},
    {height:960,radius:42}),/Invalid/);
});

test("UX15-C3B2: direction arbitration reuses prior heading if input neutral",()=>{
  assert.deepEqual(resolveRouteDashDirection({x:0,y:0},{x:-1,y:0}),{x:-1,y:0});
  const p=resolveRouteDashDirection({x:1,y:1},{x:-1,y:0});
  near(Math.hypot(p.x,p.y),1);
  assert.throws(()=>resolveRouteDashDirection({x:NaN,y:0},{x:1,y:0}),RangeError);
});

test("UX15-C3B2: real spatial index detects overlap with QA shield and no invulnerability",()=>{
  const state=start();
  assert.ok(state.bridge);
  const actor=state.encounter.enemies;
  const intruder={
    id:"qa-contact",type:EnemyType.CRAWLER,
    x:state.player.x+10,y:state.player.y,
    vx:0,vy:0,health:50,maxHealth:50,speed:0,size:18,
    color:"#fb7185",shootCooldown:0,pulseCooldown:0,
    contactDamageCooldown:0,isDead:false,isBoss:false,flashTicks:0,
  };
  const scene={...state.encounter,enemies:[...actor,intruder]};
  const first=stepRouteCombatBridge(scene,state.bridge!,state.player,1000);
  assert.equal(first.spatialEnemyCount,1);
  assert.equal(first.shield,92);
  assert.equal(first.contactHits,1);
  const second=stepRouteCombatBridge(scene,first,state.player,1500);
  assert.equal(second.shield,92);
  const third=stepRouteCombatBridge(scene,second,state.player,
    1000+ROUTE_BRIDGE_CONTACT_COOLDOWN_MS);
  assert.equal(third.shield,84);
  assert.equal(third.contactHits,2);
  assert.ok(third.spatialCandidateChecks>=1);
  assert.ok(third.nearestDistance!==null);
  assert.equal(state.bridge!.shield,100);
  assert.equal(intruder.health,50);
});

test("UX15-C3B2: deny boss, architect and hazards until their owners are certified",()=>{
  const state=start();
  const first=createPhysicalRouteQaState(viewport).encounter.enemies[0];
  const enemy={...first,isBoss:true};
  const collision={...state.encounter,enemies:[enemy]};
  assert.throws(()=>stepRouteCombatBridge(collision,state.bridge!,state.player,0),
    /Uncertified/);
  assert.throws(()=>stepRouteCombatBridge(
    {...state.encounter,hazardZones:[{x:1,y:2}]},state.bridge!,state.player,0),
    /Uncertified/);
  assert.throws(()=>stepRouteCombatBridge(
    {...state.encounter,boss:enemy},state.bridge!,state.player,0),
    /Uncertified/);
});

test("UX15-C3B2: Dash on physical ENERGY preserves 30 ORBI, old snapshot and no artificial route distance",()=>{
  const a=start();
  const direction={x:1,y:0};
  const dash=stepPhysicalRouteQa(a,50,direction,viewport,gates,true);
  const normal=stepPhysicalRouteQa(a,50,direction,viewport,gates,false);
  assert.ok(dash.bridge?.dash.activatedAtMs===0);
  assert.equal(normal.bridge?.dash.activatedAtMs,null);
  assert.ok(dash.player.x>normal.player.x);
  near(dash.player.x-normal.player.x,
    50*DASH_SPEED_UNITS_PER_MS-165*0.05);
  assert.equal(dash.frame.cursor.simulatedMs,normal.frame.cursor.simulatedMs);
  assert.equal(a.frame.cursor.simulatedMs,0);
  assert.equal(a.bridge!.dash.activatedAtMs,null);
  assert.equal(dash.encounter.swarm.length,30);
  assert.ok(localRouteDistanceSquared(dash.player,dash.encounter.swarm[0])>0);
  const blocked=stepPhysicalRouteQa(dash,50,direction,viewport,
    {...gates,paused:true},true);
  assert.equal(blocked,dash);
  assert.equal(blocked.bridge!.shield,dash.bridge!.shield);
});

test("UX15-C3B2: enemies can physically contact ENERGY only in bridge QA, not in C3B1 preview",()=>{
  const origin=createPhysicalRouteQaState(viewport);
  const enemy={
    ...origin.encounter.enemies[0],
    x:origin.player.x+40,y:origin.player.y,
    speed:65,health:100,maxHealth:100,
  };
  const scene={...origin.encounter,enemies:[enemy],projectiles:[],resources:[],
    hazardZones:[]};
  const clock=createRouteDynamicQaState();
  const legacy=stepRouteDynamicQaEncounter(
    scene,clock,origin.player,origin.camera,viewport,50,50,false,
  );
  assert.equal(legacy.encounter.enemies[0].x,enemy.x);
  const bridge=stepRouteDynamicQaEncounter(
    scene,clock,origin.player,origin.camera,viewport,50,50,true,
  );
  assert.ok(bridge.encounter.enemies[0].x<enemy.x);
  const twice=stepRouteDynamicQaEncounter(
    bridge.encounter,bridge.dynamic,origin.player,origin.camera,viewport,50,100,true,
  );
  const contact=stepRouteCombatBridge({
    ...twice.encounter,hazardZones:[],
  },createRouteCombatBridgeState(),origin.player,100);
  assert.equal(contact.contactHits,1);
  assert.equal(contact.shield,92);
});

test("UX15-C3B2: 18s cooldown, no repeated activation, and actual 180ms displacement",()=>{
  let s=start();
  s=stepPhysicalRouteQa(s,50,{x:-1,y:0},viewport,gates,true);
  const stamp=s.bridge!.dash.activatedAtMs;
  assert.equal(stamp,0);
  for(let i=0;i<7;i++)
    s=stepPhysicalRouteQa(s,50,{x:1,y:0},viewport,gates,true);
  assert.equal(s.bridge!.dash.activatedAtMs,stamp);
  assert.equal(s.bridge!.dash.cooldownUntilMs,DASH_COOLDOWN_MS);
  assert.ok(!projectPropulsionDash(s.bridge!.dash,s.frame.cursor.simulatedMs).active);
  assert.ok(projectPropulsionDash(s.bridge!.dash,s.frame.cursor.simulatedMs).cooldownRemainingMs>0);
  for(let i=0;i<355;i++)
    s=stepPhysicalRouteQa(s,50,{x:0,y:0},viewport,gates,false);
  assert.ok(s.frame.cursor.simulatedMs>17_999);
  const next=stepPhysicalRouteQa(s,50,{x:1,y:0},viewport,gates,true);
  assert.ok(next.bridge!.dash.activatedAtMs!>=18_000);
  assert.ok(next.bridge!.dash.activeUntilMs>next.frame.cursor.simulatedMs);
});

test("UX15-C3B2: 20+ rebases preserve shield, Dash cooldown, indexed contact and world entity positions",()=>{
  let s=start();
  let rebases=0;
  for(let i=0;i<2800;i++){
    const before=s;
    s=stepPhysicalRouteQa(s,50,{x:1,y:0},viewport,gates,i===0);
    if(s.frame.originEpoch>before.frame.originEpoch)rebases++;
    assert.equal(s.bridge!.shield,100);
    assert.equal(s.bridge!.contactHits,0);
    assert.ok(s.bridge!.spatialEnemyCount<=12);
    assert.equal(s.bridge!.dash.cooldownUntilMs,18_000);
    if(s.encounter.enemies.length && before.encounter.enemies.length){
      assert.ok(s.encounter.enemies.every(e=>Number.isFinite(e.x)));
    }
  }
  assert.ok(rebases>=20,`Expected 20+ rebases; got ${rebases}`);
  assert.equal(s.rebases,rebases);
});

test("UX15-C3B2: pause/hidden/upgrade/hitstop preserve bridge reference and Dash start",()=>{
  const state=start();
  for(const gate of ["paused","hidden","upgradeOpen","hitstop","modalOpen"] as const){
    const result=stepPhysicalRouteQa(state,50,{x:1,y:0},viewport,
      {...gates,[gate]:true},true);
    assert.equal(result,state);
    assert.equal(result.bridge!.dash.activatedAtMs,null);
  }
  assert.equal(createPhysicalRouteQaState(viewport).bridge,null);
  assert.equal(createPhysicalRouteQaState(viewport,undefined,true).bridge,null);
  assert.throws(()=>createPhysicalRouteQaState(viewport,undefined,false,true),
    /requires C3B-1/);
  assert.equal(createRouteCombatBridgeState().shield,100);
});
