import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 createFerriteForemanAttack,shouldSpawnFerriteForeman,stepFerriteForeman,
 ferriteForemanDamageMultiplier,ferriteForemanSupports,ferriteSupportSpeed,
 FERRITE_FOREMAN_WARNING_MS,FERRITE_FOREMAN_COMMAND_MS,
 FERRITE_FOREMAN_STRIKE_MS,FERRITE_FOREMAN_EXPOSED_MS,
 FERRITE_FOREMAN_COMMAND_BOOST,FERRITE_FOREMAN_COMMAND_RADIUS,
 FERRITE_FOREMAN_PROJECTILE_SPREAD,
} from "../../src/game/ferrumFerriteForeman";

const center={x:600,y:470},enemy={x:830,y:470};
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<.000001,`${a} != ${b}`);

test("FERRUM-03: one original Foreman elite in normal FERRUM wave slots only",()=>{
 assert.equal(shouldSpawnFerriteForeman(true,"CAMPAIGN",5,0,false,false,false),true);
 assert.equal(shouldSpawnFerriteForeman(true,"CAMPAIGN",8,12,false,false,false),true);
 for(const wave of [1,2,3,4,10,11]){
  assert.equal(shouldSpawnFerriteForeman(true,"CAMPAIGN",wave,0,false,false,false),false);
 }
 for(const mode of ["INFINITE","SCORE_ATTACK","ENDLESS"]){
  assert.equal(shouldSpawnFerriteForeman(true,mode,8,12,false,false,false),false);
 }
 assert.equal(shouldSpawnFerriteForeman(false,"CAMPAIGN",6,0,false,false,false),false);
 assert.equal(shouldSpawnFerriteForeman(true,"CAMPAIGN",6,0,true,false,false),false);
 assert.equal(shouldSpawnFerriteForeman(true,"CAMPAIGN",6,0,false,true,false),false);
 assert.equal(shouldSpawnFerriteForeman(true,"CAMPAIGN",6,0,false,false,true),false);
 assert.equal(shouldSpawnFerriteForeman(true,"CAMPAIGN",6,5,false,false,false),false);
 assert.equal(shouldSpawnFerriteForeman(true,"CAMPAIGN",6,-1,false,false,false),false);
});

test("FERRUM-03: command, long telegraphed shock, core exposure and repeated coordination",()=>{
 let a=createFerriteForemanAttack(),pos={...enemy};
 let step=stepFerriteForeman(a,pos,center,.6,50);
 assert.equal(step.attack.phase,"COMMAND");
 assert.equal(step.command,true);
 assert.equal(step.attack.remainingMs,FERRITE_FOREMAN_COMMAND_MS);
 a=step.attack;
 for(let i=0;i<19;i++){
  step=stepFerriteForeman(a,pos,center,.6,50);
  a=step.attack;assert.equal(step.fire,undefined);
 }
 assert.equal(a.phase,"WARNING");
 assert.equal(a.remainingMs,FERRITE_FOREMAN_WARNING_MS);
 const lock={x:a.facingX,y:a.facingY};
 let fired=0;
 for(let i=0;i<23;i++){
  step=stepFerriteForeman(a,pos,{x:1360,y:780},.6,50);
  a=step.attack;if(step.fire)fired++;
  near(a.facingX,lock.x);near(a.facingY,lock.y);
 }
 assert.equal(a.phase,"STRIKE");
 assert.equal(a.remainingMs,FERRITE_FOREMAN_STRIKE_MS);
 assert.equal(fired,1);
 for(let i=0;i<10;i++){
  step=stepFerriteForeman(a,pos,{x:50,y:50},.6,50);a=step.attack;
 }
 assert.equal(a.phase,"EXPOSED");
 assert.equal(step.expose,true);
 assert.equal(a.remainingMs,FERRITE_FOREMAN_EXPOSED_MS);
 for(let i=0;i<36;i++){
  step=stepFerriteForeman(a,pos,center,.6,50);a=step.attack;
 }
 assert.equal(a.phase,"RECOVER");
 for(let i=0;i<20;i++){
  step=stepFerriteForeman(a,pos,center,.6,50);a=step.attack;
 }
 assert.equal(a.phase,"COMMAND");
 assert.equal(a.cycle,1);
 assert.equal(step.command,true);
 assert.equal(fired,1);
});

test("FERRUM-03: command only accelerates existing Shade Gear and M9 Welder",()=>{
 const origin={x:0,y:0};
 assert.equal(ferriteForemanSupports(origin,{x:205,y:0},"SHADE_GEAR"),true);
 assert.equal(ferriteForemanSupports(origin,{x:0,y:205},"M9_WELDER"),true);
 assert.equal(ferriteForemanSupports(origin,{x:206,y:0},"SHADE_GEAR"),false);
 assert.equal(ferriteForemanSupports(origin,{x:45,y:0},"BOSS_ARCHON"),false);
 assert.equal(ferriteForemanSupports(origin,origin,"OXIDE_MODULATOR"),false);
 assert.equal(FERRITE_FOREMAN_COMMAND_RADIUS,205);
 near(ferriteSupportSpeed(2000,1700,1.1),1.1*FERRITE_FOREMAN_COMMAND_BOOST);
 near(ferriteSupportSpeed(2000,2000,1.1),1.1);
 near(ferriteSupportSpeed(undefined,1500,1.1),1.1);
 assert.throws(()=>ferriteSupportSpeed(2000,1500,-1),RangeError);
});

test("FERRUM-03: counterplay never grants immunity; exposed core is vulnerable",()=>{
 near(ferriteForemanDamageMultiplier("APPROACH"),1);
 near(ferriteForemanDamageMultiplier("COMMAND"),.6);
 near(ferriteForemanDamageMultiplier("WARNING"),.6);
 near(ferriteForemanDamageMultiplier("STRIKE"),1);
 near(ferriteForemanDamageMultiplier("EXPOSED"),1.85);
 assert.ok(FERRITE_FOREMAN_PROJECTILE_SPREAD>=1);
 assert.ok(FERRITE_FOREMAN_WARNING_MS>=1000);
 assert.throws(()=>stepFerriteForeman(createFerriteForemanAttack(),enemy,center,.6,-1),RangeError);
 assert.throws(()=>stepFerriteForeman(createFerriteForemanAttack(),enemy,center,.6,101),RangeError);
 assert.throws(()=>stepFerriteForeman(createFerriteForemanAttack(),enemy,center,NaN,16),RangeError);
 assert.deepEqual(createFerriteForemanAttack(),createFerriteForemanAttack());
});

test("FERRUM-03: one canonical arena, ORBI hits, rewards and zero extra enemies",()=>{
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 const types=readFileSync(new URL("../../src/game/types.ts",import.meta.url),"utf8");
 const desc=readFileSync(new URL("../../src/game/runtimeWaveDescriptor.ts",import.meta.url),"utf8");
 assert.match(types,/FERRITE_FOREMAN = "FERRITE_FOREMAN"/);
 assert.match(types,/ferriteForemanAttack\?: FerriteForemanAttack/);
 assert.match(game,/const ferriteForemanSpawn=shouldSpawnFerriteForeman/);
 assert.match(game,/isFerrum\(worldRouteRunActiveRef.current,worldRouteThemeRef.current\)/);
 assert.match(game,/ferriteForemanSpawn\?EnemyType.FERRITE_FOREMAN/);
 assert.match(game,/stepFerriteForeman\(/);
 assert.match(game,/ferriteForemanSupports\(/);
 assert.match(game,/ferriteSupportSpeed\(/);
 assert.match(game,/ferriteForemanDamageMultiplier\(/);
 assert.match(game,/shootFromEnemy\(enemy,hostileProjectileBudgetState/);
 assert.match(game,/hostileBudgetState.count \+= projectileCount/);
 assert.match(game,/registerCombatDefeat\(enemy, proj.affinity\)/);
 assert.match(game,/ferriteCommandUntilMs=0/);
 assert.match(game,/enemy.type === EnemyType.FERRITE_FOREMAN/);
 assert.match(canvas,/case EnemyType.FERRITE_FOREMAN/);
 assert.match(canvas,/FERRITE_FOREMAN/);
 assert.doesNotMatch(desc,/FERRITE_FOREMAN|ferriteForemanAttack/);
});
