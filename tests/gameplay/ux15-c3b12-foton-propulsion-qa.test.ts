import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  projectFotonPropulsionQa,drawFotonPropulsionQa,
  FOTON_PROPULSION_CRUISE_LENGTH,FOTON_PROPULSION_DASH_LENGTH,
  FOTON_PROPULSION_ENGINE_X,FOTON_PROPULSION_ENGINE_Y,
} from "../../src/game/fotonPropulsionQa";
import {createPhysicalRouteQaState,stepPhysicalRouteQa} from "../../src/game/physicalRouteQaSimulation";
import {projectPropulsionDash} from "../../src/game/propulsionDash";

const viewport={width:1100,height:480,zoom:1};
const gates={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};
const near=(x:number,y:number)=>assert.ok(Math.abs(x-y)<.000001,`${x} vs ${y}`);

test("C3B12: continuous cyan exhaust projects at every nonnegative simulated time",()=>{
  for(const ms of [0,16.6,100,250,1000,75000,1e9]){
    const a=projectFotonPropulsionQa(ms,false);
    assert.equal(a.mode,"CRUISE");
    assert.ok(a.length>=FOTON_PROPULSION_CRUISE_LENGTH*.88);
    assert.ok(a.length<=FOTON_PROPULSION_CRUISE_LENGTH*1.01);
    assert.equal(a.streaks,0);
    assert.ok(a.animated);
    near(a.length,projectFotonPropulsionQa(ms,false).length);
    const boost=projectFotonPropulsionQa(ms,true);
    assert.equal(boost.mode,"DASH");
    assert.equal(boost.streaks,3);
    assert.ok(boost.length>a.length*2);
    assert.ok(boost.alpha>a.alpha);
  }
  assert.equal(FOTON_PROPULSION_CRUISE_LENGTH,31);
  assert.equal(FOTON_PROPULSION_DASH_LENGTH,69);
  assert.equal(FOTON_PROPULSION_ENGINE_X,-14);
  assert.equal(FOTON_PROPULSION_ENGINE_Y,8);
});

test("C3B12: simulated pause freezes the visual projection; reduced-motion removes pulses and streaks",()=>{
  const t=1532;
  assert.deepEqual(projectFotonPropulsionQa(t,true),projectFotonPropulsionQa(t,true));
  const reducedA=projectFotonPropulsionQa(t,false,true);
  const reducedB=projectFotonPropulsionQa(t+4321,false,true);
  assert.deepEqual(reducedA,reducedB);
  assert.equal(reducedA.animated,false);
  assert.equal(reducedA.streaks,0);
  assert.equal(reducedA.alpha,.52);
  assert.equal(projectFotonPropulsionQa(t,true,true).streaks,0);
  for(const value of [-1,NaN,Infinity,-Infinity])
    assert.throws(()=>projectFotonPropulsionQa(value,false),RangeError);
});

test("C3B12: Canvas2D thruster draws 2 rear jets, immutable FOTON anchor, restores context",()=>{
  const calls:{kind:string;coords:number[];color?:string}[]=[];
  const gradient={addColorStop(_at:number,_color:string){}};
  const ctx={
    save(){calls.push({kind:"save",coords:[]});},
    restore(){calls.push({kind:"restore",coords:[]});},
    translate(x:number,y:number){calls.push({kind:"translate",coords:[x,y]});},
    createLinearGradient(...coords:number[]){calls.push({kind:"gradient",coords});return gradient;},
    beginPath(){},moveTo(x:number,y:number){calls.push({kind:"move",coords:[x,y]});},
    quadraticCurveTo(...coords:number[]){calls.push({kind:"curve",coords});},
    closePath(){},fill(){calls.push({kind:"fill",coords:[]});},
    stroke(){calls.push({kind:"stroke",coords:[]});},
    lineTo(x:number,y:number){calls.push({kind:"line",coords:[x,y]});},
    set fillStyle(v:unknown){calls.push({kind:"fillStyle",coords:[],color:String(v)});},
    set strokeStyle(v:unknown){calls.push({kind:"strokeStyle",coords:[],color:String(v)});},
    set globalAlpha(_v:number){},set shadowBlur(_v:number){},set shadowColor(_v:string){},set lineWidth(_v:number){},
  } as unknown as CanvasRenderingContext2D;
  const p={x:800,y:480},previous={...p};
  const cruise=projectFotonPropulsionQa(500,false);
  drawFotonPropulsionQa(ctx,p,cruise);
  assert.deepEqual(p,previous);
  assert.equal(calls.filter(x=>x.kind==="fill").length,4,"two outer + two core flames");
  assert.equal(calls.filter(x=>x.kind==="stroke").length,0);
  assert.deepEqual(calls.find(x=>x.kind==="translate")?.coords,[800,480]);
  assert.equal(calls.filter(x=>x.kind==="save").length,
    calls.filter(x=>x.kind==="restore").length);
  assert.ok(calls.some(x=>x.kind==="curve"&&x.coords[2]<-30));
  calls.length=0;
  drawFotonPropulsionQa(ctx,p,projectFotonPropulsionQa(500,true));
  assert.equal(calls.filter(x=>x.kind==="stroke").length,3);
  assert.equal(calls.filter(x=>x.kind==="save").length,
    calls.filter(x=>x.kind==="restore").length);
  assert.throws(()=>drawFotonPropulsionQa(ctx,{x:NaN,y:480},cruise),RangeError);
});

test("C3B12: actual physical Dash projection governs boost and obeys cooldown and pause",()=>{
  let state=createPhysicalRouteQaState(viewport,"propulsion-qa",true,true);
  for(let n=0;n<20;n++)state=stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,gates);
  const before=state.player.x+state.frame.originOffsetX;
  state=stepPhysicalRouteQa(state,50,{x:1,y:0},viewport,gates,true);
  assert.ok(projectPropulsionDash(state.bridge!.dash,state.frame.cursor.simulatedMs).active);
  assert.ok(projectFotonPropulsionQa(state.frame.cursor.simulatedMs,true).length>60);
  const frozen=stepPhysicalRouteQa(state,50,{x:1,y:0},viewport,{...gates,paused:true});
  assert.equal(frozen,state);
  assert.ok(state.player.x+state.frame.originOffsetX>before);
  for(let n=0;n<8;n++)state=stepPhysicalRouteQa(state,50,{x:0,y:0},viewport,gates);
  assert.equal(projectPropulsionDash(state.bridge!.dash,state.frame.cursor.simulatedMs).active,false);
  assert.equal(projectFotonPropulsionQa(state.frame.cursor.simulatedMs,false).mode,"CRUISE");
});

test("C3B12: opt-in renderer never touches production gameplay or physical position logic",()=>{
  const component=readFileSync(new URL("../../src/components/PhysicalRouteQa.tsx",import.meta.url),"utf8");
  const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const physics=readFileSync(new URL("../../src/game/physicalRouteQaSimulation.ts",import.meta.url),"utf8");
  assert.match(component,/c3b12Enabled=c3b11Enabled && routeParams\.get\("ux15-c3b12"\)==="1"/);
  assert.match(component,/drawFotonPropulsionQa\(ctx,s\.player,thrust\)/);
  assert.ok(component.indexOf("drawFotonPropulsionQa(ctx,s.player,thrust)")<
    component.indexOf("drawFoton(ctx,s.player,0,s.frame.cursor.simulatedMs"));
  assert.ok(!game.includes("fotonPropulsionQa"));
  assert.ok(!physics.includes("fotonPropulsionQa"));
});
