import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  createEnergyThrusterPose,projectEnergyThrusterPose,
  projectEnergyThrusterJetReach,drawEnergyThrusterJets,
  drawEnergyDashStreaks,
} from "../../src/game/energyThrusters";
import {createPhysicalRouteQaState,stepPhysicalRouteQa} from "../../src/game/physicalRouteQaSimulation";
import {projectPropulsionDash} from "../../src/game/propulsionDash";

const viewport={width:1100,height:480,zoom:1};
const gates={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};
const createFullQa=()=>createPhysicalRouteQaState(viewport,undefined,
  true,true,true,true,true,true,true,true,true,true,true);

test("C3B12A: production and LAB both call exactly the same two real RCS and Dash renderers",()=>{
  const ui=readFileSync(new URL("../../src/components/PhysicalRouteQa.tsx",import.meta.url),"utf8");
  const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const physics=readFileSync(new URL("../../src/game/physicalRouteQaSimulation.ts",import.meta.url),"utf8");
  const original=readFileSync(new URL("../../src/game/energyThrusters.ts",import.meta.url),"utf8");
  assert.match(game,/drawEnergyThrusterJets\(ctx,playerPosRef\.current,energyThrusterPoseRef\.current,/);
  assert.match(game,/drawEnergyDashStreaks\(/);
  assert.match(ui,/drawEnergyThrusterJets\(/);
  assert.match(ui,/drawEnergyDashStreaks\(/);
  assert.match(ui,/drawFoton\(ctx,s\.player/);
  assert.ok(ui.indexOf("drawEnergyThrusterJets(")<ui.indexOf("drawFoton(ctx,s.player"));
  assert.ok(ui.indexOf("drawEnergyDashStreaks(")>ui.indexOf("drawFoton(ctx,s.player"));
  assert.match(physics,/projectEnergyThrusterPose\(/);
  assert.match(original,/const surge=dashActive\?1\.45:1/);
  assert.match(original,/return \(8\+15\*pose\.throttle\)\*surge\*flicker/);
  assert.equal(ui.includes("fotonPropulsionQa"),false);
  assert.equal(game.includes("fotonPropulsionQa"),false);
});

test("C3B12A: authoritative pose comes from physical player delta and advances +X even across atomic rebase",()=>{
  let state=createFullQa();
  assert.deepEqual(state.energyThrusterPose,createEnergyThrusterPose());
  for(let i=0;i<1500;i++){
    state=stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,gates);
    const pose=state.energyThrusterPose!;
    assert.ok(Number.isFinite(pose.bankRadians));
    if(i>10)assert.ok(pose.directionX>.95,"auto-traverse must point exhaust to -X");
  }
  assert.ok(state.rebases>0);
  assert.ok(state.energyThrusterPose!.throttle>.01);
  assert.ok(state.energyThrusterPose!.bankRadians>0);
  assert.ok(projectEnergyThrusterJetReach(state.energyThrusterPose!,
    state.frame.cursor.simulatedMs,false)>0);
  assert.equal(state.encounter.enemies.some(e=>e.type==="DRONE"),false);
  assert.equal(state.wave2Qa?.status,"GATED_WAVE3");
});

test("C3B12A: existing canonical RCS jets have exactly 6 strokes and normal Dash has 3 additional streaks",()=>{
  const calls:{cmd:string;coordinates:number[];color?:string}[]=[];
  const ctx={
    save(){calls.push({cmd:"save",coordinates:[]});},
    restore(){calls.push({cmd:"restore",coordinates:[]});},
    beginPath(){calls.push({cmd:"begin",coordinates:[]});},
    moveTo(x:number,y:number){calls.push({cmd:"move",coordinates:[x,y]});},
    lineTo(x:number,y:number){calls.push({cmd:"line",coordinates:[x,y]});},
    stroke(){calls.push({cmd:"stroke",coordinates:[]});},
    set lineCap(_v:string){},set lineWidth(_v:number){},set shadowBlur(_v:number){},
    set shadowColor(_v:string){},set globalAlpha(_v:number){},
    set strokeStyle(v:string){calls.push({cmd:"color",coordinates:[],color:v});},
  } as unknown as CanvasRenderingContext2D;
  const pose=projectEnergyThrusterPose(createEnergyThrusterPose(),28,0,50,false);
  const reach=projectEnergyThrusterJetReach(pose,500,false);
  assert.ok(reach>0 && reach<23);
  const p={x:120,y:240};
  drawEnergyThrusterJets(ctx,p,pose,500,false);
  assert.equal(calls.filter(x=>x.cmd==="stroke").length,6);
  assert.equal(calls.filter(x=>x.cmd==="save").length,1);
  assert.equal(calls.filter(x=>x.cmd==="restore").length,1);
  assert.ok(calls.some(x=>x.cmd==="line"&&x.coordinates[0]<p.x));
  calls.length=0;
  const boosted=projectEnergyThrusterPose(pose,36,0,50,true);
  assert.ok(projectEnergyThrusterJetReach(boosted,550,true)>reach*1.2);
  drawEnergyThrusterJets(ctx,p,boosted,550,true);
  drawEnergyDashStreaks(ctx,p,{x:1,y:0},true);
  assert.equal(calls.filter(x=>x.cmd==="stroke").length,9);
  assert.ok(calls.some(x=>x.cmd==="color"&&x.color==="#ffda82"));
  assert.ok(calls.some(x=>x.cmd==="color"&&x.color==="#fde68a"));
  assert.equal(calls.filter(x=>x.cmd==="save").length,
    calls.filter(x=>x.cmd==="restore").length);
  calls.length=0;
  drawEnergyDashStreaks(ctx,p,{x:1,y:0},false);
  assert.equal(calls.length,0);
});

test("C3B12A: real QA Dash increases the canonical pose, pauses without moving and returns to cruise",()=>{
  let state=createFullQa();
  for(let i=0;i<20;i++)state=stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,gates);
  const cruise=state.energyThrusterPose!;
  assert.ok(cruise.directionX>.9);
  state=stepPhysicalRouteQa(state,50,{x:1,y:0},viewport,gates,true);
  assert.equal(projectPropulsionDash(state.bridge!.dash,state.frame.cursor.simulatedMs).active,true);
  const boost=projectEnergyThrusterJetReach(state.energyThrusterPose!,state.frame.cursor.simulatedMs,true);
  assert.ok(boost>projectEnergyThrusterJetReach(cruise,state.frame.cursor.simulatedMs,false));
  assert.equal(stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,{...gates,paused:true}),state);
  assert.equal(stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,{...gates,hidden:true}),state);
  for(let i=0;i<6;i++)state=stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,gates);
  assert.equal(projectPropulsionDash(state.bridge!.dash,state.frame.cursor.simulatedMs).active,false);
  assert.ok(state.energyThrusterPose!.throttle>0);
});

test("C3B12A: reverse manual movement rotates original nozzles without faking rightward exhaust",()=>{
  let state=createFullQa();
  for(let i=0;i<30;i++)state=stepPhysicalRouteQa(state,50,{x:-1,y:0},viewport,gates);
  assert.ok(state.energyThrusterPose!.directionX<-.9);
  assert.ok(state.energyThrusterPose!.bankRadians<0);
  const pos=state.player;
  assert.ok(Number.isFinite(pos.x+state.frame.originOffsetX));
  const frozen=stepPhysicalRouteQa(state,50,{x:-1,y:0},viewport,{...gates,paused:true});
  assert.equal(frozen,state);
});

test("C3B12A: canonical thrusters are opt-in only, and a missing prior duel gate fails closed",()=>{
  assert.equal(createPhysicalRouteQaState(viewport).energyThrusterPose,null);
  assert.throws(()=>createPhysicalRouteQaState(viewport,undefined,
    true,true,true,true,true,true,true,true,true,false,true),/require prior C3B11 duel QA/);
  const active=createFullQa();
  assert.ok(active.energyThrusterPose);
  assert.equal(active.droneDuelQa?.status,"DISARMED");
  assert.equal(active.energyThrusterPose?.throttle,0);
});
