import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 SLAG_WARNING_MS,SLAG_LANCE_DISTANCE,SLAG_LANCE_SPEED,
 SLAG_FRAGMENT_SPEED,SLAG_FRAGMENT_ANGLE,SLAG_RECOVER_MS,
 createSlagSpearAttack,stepSlagSpear,shouldSpawnSlagSpear,
 interceptSlagLance,projectSlagFragments,
} from "../../src/game/pyraSlagSpear";
const pos={x:500,y:350},target={x:800,y:350};
test("PYRA-02: a real ordinary PYRA Campaign slot, not ASTERIA/FERRUM or a boss",()=>{
 assert.equal(shouldSpawnSlagSpear(true,"CAMPAIGN",2,3,false,false,false),true);
 assert.equal(shouldSpawnSlagSpear(true,"CAMPAIGN",4,8,false,false,false),true);
 assert.equal(shouldSpawnSlagSpear(true,"CAMPAIGN",1,3,false,false,false),false);
 for(const m of ["INFINITE","SCORE_ATTACK"])
  assert.equal(shouldSpawnSlagSpear(true,m,3,3,false,false,false),false);
 for(const index of [0,1,2,4,-1])
  assert.equal(shouldSpawnSlagSpear(true,"CAMPAIGN",2,index,false,false,false),false);
 for(const flags of [[false,false,true],[true,false,false],[false,true,false]] as const)
  assert.equal(shouldSpawnSlagSpear(true,"CAMPAIGN",2,3,...flags),false);
 assert.equal(shouldSpawnSlagSpear(false,"CAMPAIGN",2,3,false,false,false),false);
});
test("PYRA-02: fixed telegraph, no firing before 1150ms",()=>{
 let a=createSlagSpearAttack();
 let step=stepSlagSpear(a,pos,target,1,50);
 assert.equal(step.warned,true);assert.equal(step.fire,false);
 assert.equal(step.attack.stage,"WARN");
 assert.equal(step.attack.remainingMs,SLAG_WARNING_MS);
 a=step.attack;
 const locked=[a.lockedX,a.lockedY,a.lockedAngle];
 for(let t=0;t<22;t++){
  step=stepSlagSpear(a,pos,{x:250,y:900},1,50);
  assert.equal(step.fire,false);a=step.attack;
  assert.deepEqual([a.lockedX,a.lockedY,a.lockedAngle],locked);
 }
 step=stepSlagSpear(a,pos,{x:250,y:900},1,50);
 assert.equal(step.fire,true);
 assert.equal(step.attack.stage,"FIRE");
 step=stepSlagSpear(step.attack,pos,target,1,50);
 assert.equal(step.fire,false);assert.equal(step.attack.stage,"RECOVER");
 assert.equal(step.attack.remainingMs,SLAG_RECOVER_MS);
});
test("PYRA-02: one limited-distance fork and interceptible projectile",()=>{
 assert.ok(SLAG_LANCE_DISTANCE>200&&SLAG_LANCE_DISTANCE<300);
 assert.ok(SLAG_LANCE_SPEED<SLAG_FRAGMENT_SPEED);
 assert.ok(SLAG_FRAGMENT_ANGLE>.2);
 const children=projectSlagFragments(30,40,SLAG_LANCE_SPEED,0);
 assert.equal(children.length,2);
 assert.ok(children[0].vy<0&&children[1].vy>0);
 assert.ok(children.every(p=>Math.hypot(p.vx,p.vy)<=SLAG_FRAGMENT_SPEED+.001));
 assert.equal(interceptSlagLance({x:30,y:40},4,{x:37,y:40},4),true);
 assert.equal(interceptSlagLance({x:30,y:40},4,{x:40,y:40},4),false);
 assert.equal(interceptSlagLance({x:NaN,y:0},4,{x:0,y:0},4),false);
 assert.throws(()=>projectSlagFragments(0,0,NaN,0),RangeError);
});
test("PYRA-02: deterministic director and native projectile integration",()=>{
 const a=createSlagSpearAttack();
 assert.deepEqual(stepSlagSpear(a,pos,target,1,33),stepSlagSpear(a,pos,target,1,33));
 assert.deepEqual(a,createSlagSpearAttack());
 assert.throws(()=>stepSlagSpear(a,pos,target,1,101),RangeError);
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 assert.match(game,/shouldSpawnSlagSpear\(/);
 assert.match(game,/stepSlagSpear\(/);
 assert.match(game,/slagSpearDistanceRemaining/);
 assert.match(game,/projectSlagFragments\(/);
 assert.match(game,/interceptSlagLance\(/);
 assert.match(game,/registerCombatDefeat\(enemy, proj.affinity\)/);
 assert.match(canvas,/case EnemyType.SLAG_SPEAR/);
 assert.match(canvas,/enemy.slagSpearAttack/);
});
