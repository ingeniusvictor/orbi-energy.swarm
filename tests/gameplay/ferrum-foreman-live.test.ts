import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {shouldSpawnForeman,selectForemanSpawn,createForemanAttack,
 stepForeman,foremanSectorHit,foremanDamageMultiplier,FOREMAN_WARNING_MS,
 FOREMAN_EXPOSED_MS} from "../../src/game/ferrumForeman";

const origin={x:750,y:400},energy={x:550,y:400};
test("FERRUM-03: Foreman is unique to selected Ferrum regular wave 5+",()=>{
 assert.equal(shouldSpawnForeman(true,"CAMPAIGN",5,0,false,false,false),true);
 assert.equal(shouldSpawnForeman(true,"CAMPAIGN",5,12,false,false,false),true);
 for(const wave of [1,2,3,4])assert.equal(shouldSpawnForeman(true,"CAMPAIGN",wave,0,false,false,false),false);
 for(const mode of ["INFINITE","SCORE_ATTACK"])
  assert.equal(shouldSpawnForeman(true,mode,6,0,false,false,false),false);
 assert.equal(shouldSpawnForeman(false,"CAMPAIGN",5,0,false,false,false),false);
 assert.equal(shouldSpawnForeman(true,"CAMPAIGN",5,0,true,false,false),false);
 assert.equal(shouldSpawnForeman(true,"CAMPAIGN",5,0,false,true,false),false);
 assert.equal(shouldSpawnForeman(true,"CAMPAIGN",5,0,false,false,true),false);
 assert.equal(shouldSpawnForeman(true,"CAMPAIGN",5,1,false,false,false),false);
 const pos=selectForemanSpawn({cameraX:100,cameraY:100,
  viewportWidth:850,viewportHeight:480,zoom:1},energy,1600,960,230);
 assert.ok(pos);
 assert.ok(Math.hypot(pos.x-energy.x,pos.y-energy.y)>=230);
});
test("FERRUM-03: foreman warning cannot follow ENERGY; core exposure guaranteed",()=>{
 let a=createForemanAttack(),pos=origin;
 let step=stepForeman(a,pos,energy,.65,50);
 assert.equal(step.attack.stage,"COMMAND");a=step.attack;
 for(let i=0;i<18;i++){step=stepForeman(a,pos,energy,.65,50);a=step.attack;}
 assert.equal(a.stage,"WARNING");
 assert.equal(a.remainingMs,FOREMAN_WARNING_MS);
 const locked=[a.facingX,a.facingY];
 for(let i=0;i<23;i++){
  step=stepForeman(a,pos,{x:1300,y:850},.65,50);a=step.attack;
  assert.deepEqual([a.facingX,a.facingY],locked);
 }
 assert.equal(a.stage,"SHOCK");
 assert.equal(foremanSectorHit(a,origin,energy),true);
 assert.equal(foremanSectorHit(a,origin,{x:750,y:610}),false);
 for(let i=0;i<11;i++){step=stepForeman(a,pos,energy,.65,50);a=step.attack;}
 assert.equal(a.stage,"EXPOSED");
 assert.equal(a.remainingMs,FOREMAN_EXPOSED_MS);
 assert.ok(foremanDamageMultiplier(a)>1.9);
 assert.ok(foremanDamageMultiplier({...a,stage:"WARNING"})<1);
});
test("FERRUM-03: finite immutable and nonlethal warning contract",()=>{
 const a=createForemanAttack();
 assert.deepEqual(stepForeman(a,origin,energy,.8,16),
   stepForeman(a,origin,energy,.8,16));
 assert.deepEqual(a,createForemanAttack());
 assert.equal(foremanSectorHit({...a,stage:"WARNING"},origin,energy),false);
 assert.throws(()=>stepForeman(a,origin,energy,.8,101),RangeError);
 assert.throws(()=>stepForeman(a,origin,{x:NaN,y:1},.8,16),RangeError);
});
test("FERRUM-03: live native engine and visuals, no duplicate combat",()=>{
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 assert.match(game,/shouldSpawnForeman\(/);
 assert.match(game,/isFerrum\(worldRouteRunActiveRef.current,worldRouteThemeRef.current\)/);
 assert.match(game,/stepForeman\(/);
 assert.match(game,/foremanSectorHit\(/);
 assert.match(game,/foremanDamageMultiplier\(/);
 assert.match(game,/registerCombatDefeat\(enemy, proj.affinity\)/);
 assert.match(canvas,/case EnemyType.FERRITE_FOREMAN/);
 assert.match(canvas,/stage==="WARNING"\|\|a.stage==="SHOCK"/);
});
