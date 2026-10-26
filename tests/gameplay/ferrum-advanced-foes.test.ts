import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolveFerrumFoe,selectFerrumFoeSpawn} from "../../src/game/ferrumOriginalFoes";
import {
 createFoundryClawAttack,createOxideModulatorAttack,stepFoundryClaw,
 stepOxideModulator,projectFoundryTetherPull,oxideArmorDamageMultiplier,
 shouldArmorOxideAlly,FOUNDRY_CLAW_WARNING_MS,FOUNDRY_CLAW_TETHER_MS,
 FOUNDRY_CLAW_PULL_MAX_PER_FRAME,OXIDE_ARMOR_RADIUS,
 OXIDE_ARMOR_DURATION_MS,OXIDE_ARMOR_MULTIPLIER,OXIDE_PULSE_INTERVAL_MS,
} from "../../src/game/ferrumAdvancedFoes";

const near=(x:number,y:number,tol=.00001)=>
 assert.ok(Math.abs(x-y)<=tol,`${x} != ${y}`);
const center={x:600,y:480};
const claw={x:800,y:480};
test("FERRUM-02: new original enemies replace normal budget slots only in chosen world",()=>{
 const none=()=>false;
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",3,4,false,false,none),"FOUNDRY_CLAW");
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",4,0,false,false,none),"OXIDE_MODULATOR");
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",2,4,false,false,none),null);
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",3,0,false,false,none),null);
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",2,2,false,false,none),"M9_WELDER");
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",1,1,false,false,none),"SHADE_GEAR");
 for(const name of ["FOUNDRY_CLAW","OXIDE_MODULATOR"] as const)
  assert.equal(resolveFerrumFoe(true,"CAMPAIGN",5,name==="FOUNDRY_CLAW"?4:0,
    false,false,c=>c===name),null);
 assert.equal(resolveFerrumFoe(false,"CAMPAIGN",5,4,false,false,none),null);
 for(const mode of ["INFINITE","SCORE_ATTACK"]){
   assert.equal(resolveFerrumFoe(true,mode,9,4,false,false,none),null);
   assert.equal(resolveFerrumFoe(true,mode,9,0,false,false,none),null);
 }
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",5,4,true,false,none),null);
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",5,0,false,true,none),null);
 const spot=selectFerrumFoeSpawn({cameraX:0,cameraY:0,
  viewportWidth:900,viewportHeight:480,zoom:1},center,1600,960,220);
 assert.ok(spot && Math.hypot(spot.x-center.x,spot.y-center.y)>=220);
});
test("FERRUM-02: Claw shows >=1050ms lock then bounded, escapable tether",()=>{
 let state=createFoundryClawAttack();
 let step=stepFoundryClaw(state,claw,center,.8,50);
 assert.equal(step.attack.phase,"ANCHOR");
 assert.equal(step.attack.remainingMs,FOUNDRY_CLAW_WARNING_MS);
 const aim={x:step.attack.targetX,y:step.attack.targetY};
 state=step.attack;
 for(let i=0;i<21;i++){
   step=stepFoundryClaw(state,claw,{x:30,y:30},.8,50);
   state=step.attack;
   near(state.targetX,aim.x);near(state.targetY,aim.y);
   assert.equal(step.tetherActive,false);
 }
 assert.equal(state.phase,"TETHER");
 assert.equal(state.remainingMs,FOUNDRY_CLAW_TETHER_MS);
 const original=claw;
 step=stepFoundryClaw(state,claw,center,.8,50);
 assert.equal(step.tetherActive,true);
 assert.equal(step.x,original.x);
 const tug=projectFoundryTetherPull(claw,center,16.6);
 assert.ok(tug.x>0 && Math.abs(tug.y)<1e-6);
 assert.ok(Math.hypot(tug.x,tug.y)<=FOUNDRY_CLAW_PULL_MAX_PER_FRAME);
 assert.deepEqual(projectFoundryTetherPull({x:980,y:480},center,16.6),{x:0,y:0});
 assert.deepEqual(projectFoundryTetherPull({x:610,y:480},center,16.6),{x:0,y:0});
 assert.equal(FOUNDRY_CLAW_TETHER_MS,850);
});
test("FERRUM-02: Modulator armors nearby allies but never itself or bosses",()=>{
 const mod={x:600,y:350},player={x:600,y:590};
 let state=createOxideModulatorAttack();
 let step=stepOxideModulator(state,mod,player,.55,50);
 assert.equal(step.attack.phase,"ARMOR");
 state=step.attack;
 step=stepOxideModulator(state,mod,player,.55,50);
 assert.equal(step.armorPulse,true);
 state=step.attack;
 assert.equal(state.pulseMs,OXIDE_PULSE_INTERVAL_MS);
 step=stepOxideModulator(state,mod,player,.55,50);
 assert.equal(step.armorPulse,false);
 assert.equal(shouldArmorOxideAlly(mod,{x:600,y:350},false,true),false);
 assert.equal(shouldArmorOxideAlly(mod,{x:601,y:350},true,false),false);
 assert.equal(shouldArmorOxideAlly(mod,{x:600,y:350+OXIDE_ARMOR_RADIUS},false,false),true);
 assert.equal(shouldArmorOxideAlly(mod,{x:600,y:350+OXIDE_ARMOR_RADIUS+1},false,false),false);
 const until=1200+OXIDE_ARMOR_DURATION_MS;
 near(oxideArmorDamageMultiplier(until,1201),OXIDE_ARMOR_MULTIPLIER);
 near(oxideArmorDamageMultiplier(until,until),1);
 near(oxideArmorDamageMultiplier(0,1201),1);
 near(oxideArmorDamageMultiplier(undefined,1201),1);
});
test("FERRUM-02: deterministic finite choreography and invalid impulse rejection",()=>{
 const a=createFoundryClawAttack(),b=createOxideModulatorAttack();
 assert.deepEqual(stepFoundryClaw(a,claw,center,1,16),
   stepFoundryClaw(a,claw,center,1,16));
 assert.deepEqual(stepOxideModulator(b,claw,center,1,16),
   stepOxideModulator(b,claw,center,1,16));
 assert.deepEqual(a,createFoundryClawAttack());
 assert.deepEqual(b,createOxideModulatorAttack());
 assert.throws(()=>stepFoundryClaw(a,claw,center,1,101),RangeError);
 assert.throws(()=>stepOxideModulator(b,claw,center,NaN,16),RangeError);
 assert.throws(()=>projectFoundryTetherPull(claw,center,-1),RangeError);
 assert.throws(()=>oxideArmorDamageMultiplier(0,NaN),RangeError);
 assert.throws(()=>shouldArmorOxideAlly(claw,{x:NaN,y:2},false,false),RangeError);
});
test("FERRUM-02: core movement, damage and ORBI rewards remain original",()=>{
 const root="../../src/game/";
 const game=readFileSync(new URL(root+"EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL(root+"EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 const types=readFileSync(new URL(root+"types.ts",import.meta.url),"utf8");
 const original=readFileSync(new URL(root+"ferrumOriginalFoes.ts",import.meta.url),"utf8");
 for(const name of ["FOUNDRY_CLAW","OXIDE_MODULATOR"]){
   assert.match(types,new RegExp(name+' = "'+name+'"'));
   assert.match(canvas,new RegExp("case EnemyType."+name));
   assert.match(game,new RegExp("EnemyType."+name));
   assert.match(original,new RegExp('"'+name+'"'));
 }
 assert.match(game,/isFerrum\(worldRouteRunActiveRef.current,worldRouteThemeRef.current\)/);
 assert.match(game,/stepFoundryClaw\(/);
 assert.match(game,/stepOxideModulator\(/);
 assert.match(game,/projectFoundryTetherPull\(/);
 assert.match(game,/playerPosRef\.current\.x=Math\.max\(16,Math\.min\(WORLD_WIDTH-16/);
 assert.match(game,/shouldArmorOxideAlly\(/);
 assert.match(game,/oxideArmorDamageMultiplier\(/);
 assert.match(game,/if\(enemy.type===EnemyType.OXIDE_MODULATOR\)/);
 assert.match(game,/ally\.oxideArmoredUntilMs=0/);
 assert.match(game,/registerCombatDefeat\(enemy, proj.affinity\)/);
 assert.match(game,/findFirstCollidingSpatialItem\(/);
 assert.match(game,/drawFerrumWorld\(/);
 assert.doesNotMatch(game,/enemiesRef\.current\.filter\([\s\S]{0,240}?\)\.length/);
});
