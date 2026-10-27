import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 SERAPH_CIRCULATE_MS,SERAPH_WARNING_MS,SERAPH_DISCHARGE_MS,
 SERAPH_EXPOSED_MS,SERAPH_METEOR_COUNT,SERAPH_CURVE_MS,
 createCalderaSeraphAttack,stepCalderaSeraph,shouldSpawnCalderaSeraph,
 projectCalderaMeteorVolley,advanceCalderaMeteor,traceCalderaMeteor,
 calderaSeraphDamageMultiplier,
} from "../../src/game/pyraCalderaSeraph";
const origin={x:400,y:380},target={x:700,y:380};
test("PYRA-05: elite owns only one ordinary wave budget slot at wave 5+",()=>{
 assert.equal(shouldSpawnCalderaSeraph(true,"CAMPAIGN",5,4,false,false,false),true);
 assert.equal(shouldSpawnCalderaSeraph(true,"CAMPAIGN",6,14,false,false,false),true);
 assert.equal(shouldSpawnCalderaSeraph(true,"CAMPAIGN",4,4,false,false,false),false);
 assert.equal(shouldSpawnCalderaSeraph(true,"INFINITE",6,4,false,false,false),false);
 assert.equal(shouldSpawnCalderaSeraph(false,"CAMPAIGN",6,4,false,false,false),false);
 assert.equal(shouldSpawnCalderaSeraph(true,"CAMPAIGN",6,4,true,false,false),false);
 assert.equal(shouldSpawnCalderaSeraph(true,"CAMPAIGN",6,4,false,true,false),false);
 assert.equal(shouldSpawnCalderaSeraph(true,"CAMPAIGN",6,4,false,false,true),false);
 assert.equal(shouldSpawnCalderaSeraph(true,"CAMPAIGN",6,2,false,false,false),false);
});
test("PYRA-05: three meteor lanes locked for full 1240ms warning",()=>{
 let a=createCalderaSeraphAttack();
 let step=stepCalderaSeraph(a,origin,target,.6,40);
 assert.equal(step.attack.stage,"CIRCULATE");a=step.attack;
 assert.equal(a.remainingMs,SERAPH_CIRCULATE_MS);
 for(let n=0;n<17;n++){
  step=stepCalderaSeraph(a,origin,target,.6,40);
  assert.equal(step.fire,false);a=step.attack;
 }
 step=stepCalderaSeraph(a,origin,target,.6,40);
 assert.equal(step.warn,true);assert.equal(step.attack.stage,"WARNING");a=step.attack;
 assert.equal(a.remainingMs,SERAPH_WARNING_MS);
 const lockedAngle=a.lockedAngle;
 for(let n=0;n<30;n++){
  step=stepCalderaSeraph(a,origin,{x:250,y:900},.6,40);
  assert.equal(step.fire,false);
  a=step.attack;assert.equal(a.lockedAngle,lockedAngle);
 }
 step=stepCalderaSeraph(a,origin,{x:250,y:900},.6,40);
 assert.equal(step.fire,true);assert.equal(step.attack.stage,"DISCHARGE");
 assert.equal(step.attack.remainingMs,SERAPH_DISCHARGE_MS);
});
test("PYRA-05: three finite curved meteors, preview reproduces canonical trajectory",()=>{
 const volley=projectCalderaMeteorVolley(origin,0);
 assert.equal(volley.length,SERAPH_METEOR_COUNT);
 assert.deepEqual(volley.map(v=>v.curveDirection),[-1,1,-1]);
 assert.notEqual(volley[0].vy,volley[1].vy);
 for(const i of [0,1,2] as const){
  const m=volley[i],samples=traceCalderaMeteor(origin,0,i,20);
  assert.equal(samples.length,21);
  let p={...m,remainingMs:SERAPH_CURVE_MS};
  for(let n=1;n<=20;n++){
    const next=advanceCalderaMeteor(p.x,p.y,p.vx,p.vy,
      m.curveDirection,p.remainingMs,40);
    assert.deepEqual(samples[n],{x:next.x,y:next.y});
    p={...p,...next};
  }
  assert.notEqual(samples[20].x,samples[0].x);
  assert.ok(p.remainingMs>=0);
 }
 assert.throws(()=>projectCalderaMeteorVolley(origin,NaN),RangeError);
 assert.throws(()=>advanceCalderaMeteor(0,0,1,0,1,0,101),RangeError);
});
test("PYRA-05: exposed reactor finite; fire once; existing hit resolver",()=>{
 let a:ReturnType<typeof createCalderaSeraphAttack>={
   ...createCalderaSeraphAttack(),stage:"DISCHARGE",
   remainingMs:SERAPH_DISCHARGE_MS};
 let exposedCount=0;
 for(let i=0;i<10;i++){
   const s=stepCalderaSeraph(a,origin,target,.5,40);
   exposedCount+=Number(s.exposed);a=s.attack;
 }
 assert.equal(exposedCount,1);assert.equal(a.stage,"EXPOSED");
 assert.equal(a.remainingMs,SERAPH_EXPOSED_MS);
 assert.equal(calderaSeraphDamageMultiplier(a),2.05);
 assert.equal(calderaSeraphDamageMultiplier({...a,stage:"WARNING"}),.65);
 assert.equal(calderaSeraphDamageMultiplier({...a,stage:"CIRCULATE"}),.65);
 assert.equal(calderaSeraphDamageMultiplier({...a,stage:"APPROACH"}),1);
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 for(const name of ["shouldSpawnCalderaSeraph(","stepCalderaSeraph(",
   "projectCalderaMeteorVolley(","advanceCalderaMeteor(",
   "calderaSeraphDamageMultiplier(","registerCombatDefeat(enemy, proj.affinity)"])
  assert.ok(game.includes(name),name);
 assert.match(canvas,/case EnemyType.CALDERA_SERAPH/);
 assert.match(canvas,/traceCalderaMeteor\(/);
});
