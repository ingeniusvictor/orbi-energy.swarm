import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  shouldSpawnSpanWarden,selectSpanWardenSpawn,
  createSpanWardenAttack,stepSpanWarden,resolveSpanWardenHit,
  SPAN_WARDEN_WARNING_MS,SPAN_WARDEN_EXPOSED_MS,
  SPAN_WARDEN_PROJECTILE_SPREAD,SPAN_WARDEN_SAFE_RADIUS,
} from "../../src/game/asteriaSpanWarden";

const leader={x:500,y:410};
const viewport={cameraX:140,cameraY:110,viewportWidth:840,viewportHeight:500,zoom:1};
const near=(actual:number,expected:number,tol=1e-5)=>
  assert.ok(Math.abs(actual-expected)<=tol,`${actual} != ${expected}`);

test("WBE-01E: one live elite in Mundo Nuevo replaces an ordinary wave 5+ slot",()=>{
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,0,false,false,false),true);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,10,false,false,false),true);
  for(const wave of [0,1,2,3,4]){
    assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",wave,0,false,false,false),false);
  }
  for(const mode of ["INFINITE","SCORE_ATTACK","ENDLESS"]){
    assert.equal(shouldSpawnSpanWarden(true,mode,15,0,false,false,false),false);
  }
  assert.equal(shouldSpawnSpanWarden(false,"CAMPAIGN",5,0,false,false,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,0,true,false,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,0,false,true,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,0,false,false,true),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,1,false,false,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,-10,false,false,false),false);
});

test("WBE-01E: elite spawn remains inside legacy combat bounds and outside ENERGY safety radius",()=>{
  const pos=selectSpanWardenSpawn(viewport,leader,1600,960,SPAN_WARDEN_SAFE_RADIUS);
  assert.ok(pos);
  assert.ok(pos.x>=16&&pos.x<=1584&&pos.y>=16&&pos.y<=944);
  assert.ok(Math.hypot(pos.x-leader.x,pos.y-leader.y)>=SPAN_WARDEN_SAFE_RADIUS);
  assert.equal(selectSpanWardenSpawn(viewport,leader,100,100,1100),null);
  assert.throws(()=>selectSpanWardenSpawn({...viewport,zoom:0},leader,1600,960),RangeError);
});

test("WBE-01E: guard -> 950ms announced lateral fire -> vulnerable core -> guarded return",()=>{
  let pos={x:690,y:410};
  let attack=createSpanWardenAttack();
  let step=stepSpanWarden(attack,pos,leader,.55,50);
  assert.equal(step.attack.phase,"GUARD");
  attack=step.attack;pos={x:step.x,y:step.y};
  for(let i=0;i<22&&attack.phase==="GUARD";i++){
    step=stepSpanWarden(attack,pos,leader,.55,50);
    attack=step.attack;pos={x:step.x,y:step.y};
  }
  assert.equal(attack.phase,"WINDUP");
  assert.equal(attack.remainingMs,SPAN_WARDEN_WARNING_MS);
  const lock={x:attack.facingX,y:attack.facingY};
  let fired=0;
  for(let i=0;i<19;i++){
    step=stepSpanWarden(attack,pos,{x:1460,y:890},.55,50);
    attack=step.attack;pos={x:step.x,y:step.y};
    if(step.fire)fired++;
    near(attack.facingX,lock.x);near(attack.facingY,lock.y);
  }
  assert.equal(fired,1);
  assert.equal(attack.phase,"STRIKE");
  for(let i=0;i<10;i++){
    step=stepSpanWarden(attack,pos,{x:100,y:150},.55,50);
    attack=step.attack;pos={x:step.x,y:step.y};
    if(step.fire)fired++;
  }
  assert.equal(fired,1);
  assert.equal(attack.phase,"EXPOSED");
  assert.equal(attack.remainingMs,SPAN_WARDEN_EXPOSED_MS);
  const exposedX=pos.x,exposedY=pos.y;
  for(let i=0;i<31;i++){
    step=stepSpanWarden(attack,pos,{x:1100,y:150},.55,50);
    attack=step.attack;pos={x:step.x,y:step.y};
  }
  assert.equal(attack.phase,"GUARD");
  assert.equal(attack.strikeSide,-1);
  near(pos.x,exposedX);near(pos.y,exposedY);
});

test("WBE-01E: frontal shield encourages flanking and exposure rewards ORBI hits",()=>{
  const guard={...createSpanWardenAttack(),phase:"GUARD" as const,
    facingX:1,facingY:0};
  const block=resolveSpanWardenHit(guard,-2.5,0,10,0);
  assert.equal(block.blocked,true);
  near(block.multiplier,.18);
  const side=resolveSpanWardenHit(guard,0,-2.5,0,10);
  assert.equal(side.blocked,false);
  near(side.multiplier,1.25);
  const back=resolveSpanWardenHit(guard,2.5,0,-10,0);
  assert.equal(back.blocked,false);
  const windup=resolveSpanWardenHit({...guard,phase:"WINDUP"},-2,0,10,0);
  assert.equal(windup.blocked,true);
  const exposed=resolveSpanWardenHit({...guard,phase:"EXPOSED"},-2,0,10,0);
  assert.equal(exposed.exposed,true);
  near(exposed.multiplier,1.85);
  assert.ok(exposed.multiplier>block.multiplier*9);
  assert.ok(SPAN_WARDEN_PROJECTILE_SPREAD>1);
});

test("WBE-01E: immutable deterministic tick and invalid input protection",()=>{
  const a=createSpanWardenAttack(),pos={x:1300,y:80};
  const v=stepSpanWarden(a,pos,leader,.55,16);
  assert.deepEqual(v,stepSpanWarden(a,pos,leader,.55,16));
  assert.deepEqual(a,createSpanWardenAttack());
  assert.throws(()=>stepSpanWarden(a,pos,leader,.55,101),RangeError);
  assert.throws(()=>stepSpanWarden(a,pos,leader,.55,-1),RangeError);
  assert.throws(()=>stepSpanWarden(a,pos,leader,NaN,16),RangeError);
  assert.throws(()=>resolveSpanWardenHit(a,NaN,0,0,0),RangeError);
});

test("WBE-01E: real engine only; native projectile budget, ORBI damage and rewards",()=>{
  const types=readFileSync(new URL("../../src/game/types.ts",import.meta.url),"utf8");
  const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
  assert.match(types,/SPAN_WARDEN = "SPAN_WARDEN"/);
  assert.match(types,/spanWardenAttack\?: SpanWardenAttack/);
  assert.match(game,/shouldSpawnSpanWarden\(/);
  assert.match(game,/isAsteria\(worldRouteRunActiveRef.current,worldRouteThemeRef.current\),descriptor.sourceMode/);
  assert.match(game,/EnemyType.SPAN_WARDEN/);
  assert.match(game,/stepSpanWarden\(/);
  assert.match(game,/resolveSpanWardenHit\(/);
  assert.match(game,/shootFromEnemy\(enemy,hostileProjectileBudgetState/);
  assert.match(game,/hostileBudgetState.count \+= projectileCount/);
  assert.match(game,/registerCombatDefeat\(enemy, proj.affinity\)/);
  assert.match(game,/findFirstCollidingSpatialItem\(/);
  assert.match(game,/spanWardenAttack: type===EnemyType.SPAN_WARDEN/);
  assert.match(canvas,/case EnemyType.SPAN_WARDEN:/);
  assert.match(canvas,/LATERAL STRIKE|SPAN_WARDEN_SHOT_ANGLE/);
  assert.doesNotMatch(game,/import .*physicalRouteQaSimulation/);
});
