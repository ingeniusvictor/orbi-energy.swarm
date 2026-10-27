import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {PYRA_WORLD_ID,isPyra,isAsteria,isFerrum} from "../../src/game/ferrumWorld";
import {
  DREDGER_WARNING_MS,DREDGER_CHARGE_MS,DREDGER_EXPOSED_MS,
  DREDGER_TRAIL_CAP,DREDGER_TRAIL_INTERVAL_MS,DREDGER_TRAIL_LIFE_MS,
  createLavaDredgerAttack,shouldSpawnLavaDredger,stepLavaDredger,
  dredgerDamageMultiplier,dredgerChargeContact,
} from "../../src/game/pyraLavaDredger";
const dredger={x:420,y:420},target={x:710,y:420};
test("PYRA-03: exclusive ordinary Campaign budget, no forced or miniboss spawn",()=>{
 assert.equal(isPyra(true,PYRA_WORLD_ID),true);
 assert.equal(isAsteria(true,PYRA_WORLD_ID),false);
 assert.equal(isFerrum(true,PYRA_WORLD_ID),false);
 assert.equal(shouldSpawnLavaDredger(true,"CAMPAIGN",3,0,false,false,false),true);
 assert.equal(shouldSpawnLavaDredger(true,"CAMPAIGN",6,5,false,false,false),true);
 assert.equal(shouldSpawnLavaDredger(true,"CAMPAIGN",2,0,false,false,false),false);
 assert.equal(shouldSpawnLavaDredger(true,"INFINITE",5,0,false,false,false),false);
 assert.equal(shouldSpawnLavaDredger(false,"CAMPAIGN",5,0,false,false,false),false);
 assert.equal(shouldSpawnLavaDredger(true,"CAMPAIGN",5,0,true,false,false),false);
 assert.equal(shouldSpawnLavaDredger(true,"CAMPAIGN",5,0,false,true,false),false);
 assert.equal(shouldSpawnLavaDredger(true,"CAMPAIGN",5,0,false,false,true),false);
 assert.equal(shouldSpawnLavaDredger(true,"CAMPAIGN",5,1,false,false,false),false);
});
test("PYRA-03: charge follows 1120ms warning, locked direction, no early hit",()=>{
 let a=createLavaDredgerAttack();
 let s=stepLavaDredger(a,dredger,target,.66,40);
 assert.equal(s.warned,true);assert.equal(s.attack.stage,"WARN");
 assert.equal(s.attack.remainingMs,DREDGER_WARNING_MS);
 a=s.attack;
 const angle=a.facingAngle;
 for(let i=0;i<27;i++){
   s=stepLavaDredger(a,dredger,{x:320,y:700},.66,40);a=s.attack;
   assert.equal(s.charged,false);
   assert.equal(a.facingAngle,angle);
   assert.equal(dredgerChargeContact(a,dredger,target),false);
 }
 s=stepLavaDredger(a,dredger,target,.66,40);
 assert.equal(s.charged,true);assert.equal(s.attack.stage,"CHARGE");
 assert.equal(s.attack.remainingMs,DREDGER_CHARGE_MS);
});
test("PYRA-03: at most three post-warning heat remnants per charge",()=>{
 let a={...createLavaDredgerAttack(),stage:"CHARGE" as const,
   remainingMs:DREDGER_CHARGE_MS};
 let count=0,exposures=0;
 for(let i=0;i<30;i++){
   const step=stepLavaDredger(a,dredger,target,.7,40);
   a=step.attack;
   count+=Number(step.trail);exposures+=Number(step.exposed);
   if(step.exposed)break;
 }
 assert.equal(count,DREDGER_TRAIL_CAP);
 assert.equal(exposures,1);
 assert.equal(a.stage,"EXPOSED");
 assert.equal(a.remainingMs,DREDGER_EXPOSED_MS);
 assert.ok(DREDGER_TRAIL_LIFE_MS>DREDGER_TRAIL_INTERVAL_MS);
});
test("PYRA-03: directional frontal armor and fair exposed lateral reactor",()=>{
 const warn={...createLavaDredgerAttack(),stage:"WARN" as const,facingAngle:0};
 assert.equal(dredgerDamageMultiplier(warn,dredger,{x:500,y:420}),.48);
 assert.equal(dredgerDamageMultiplier(warn,dredger,{x:420,y:510}),1.65);
 assert.equal(dredgerDamageMultiplier(warn,dredger,{x:300,y:420}),1.65);
 assert.equal(dredgerDamageMultiplier({...warn,stage:"EXPOSED"},dredger,
   {x:500,y:420}),2.15);
 assert.equal(dredgerChargeContact({...warn,stage:"CHARGE"},dredger,
   {x:443,y:421}),true);
 assert.equal(dredgerChargeContact(warn,dredger,{x:443,y:421}),false);
 assert.throws(()=>dredgerDamageMultiplier(warn,dredger,{x:NaN,y:0}),RangeError);
});
test("PYRA-03: deterministic pure director, native damage and zero alternate actors",()=>{
 const a=createLavaDredgerAttack();
 assert.deepEqual(stepLavaDredger(a,dredger,target,.7,40),
  stepLavaDredger(a,dredger,target,.7,40));
 assert.deepEqual(a,createLavaDredgerAttack());
 assert.throws(()=>stepLavaDredger(a,dredger,target,.7,-10),RangeError);
 const code=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 for(const x of ["shouldSpawnLavaDredger(","stepLavaDredger(",
   "dredgerChargeContact(","dredgerDamageMultiplier(","DREDGER_TRAIL_LIFE_MS",
   "damagePlayerFromBoss(","registerCombatDefeat(enemy, proj.affinity)"])
   assert.ok(code.includes(x),x);
 assert.match(canvas,/case EnemyType.LAVA_DREDGER/);
 assert.match(canvas,/enemy.lavaDredgerAttack/);
});
