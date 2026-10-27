import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {PYRA_WORLD_ID,isPyra,isFerrum} from "../../src/game/ferrumWorld";
import {
  EMBER_WARN_MS,EMBER_HEAT_MS,EMBER_PATCH_LIFE_MS,EMBER_PATCH_RADIUS,
  createEmberSkaterAttack,stepEmberSkater,shouldSpawnEmberSkater,
} from "../../src/game/pyraEmberSkater";
const origin={x:450,y:450},player={x:600,y:450};
test("PYRA-01B: original Ember Skater consumes a normal Pyra Campaign slot",()=>{
  assert.equal(isPyra(true,PYRA_WORLD_ID),true);
  assert.equal(isFerrum(true,PYRA_WORLD_ID),false);
  assert.equal(shouldSpawnEmberSkater(true,"CAMPAIGN",1,1,false,false,false),true);
  for(const bad of [-1,0,2,3,4])
    assert.equal(shouldSpawnEmberSkater(true,"CAMPAIGN",1,bad,false,false,false),false);
  for(const mode of ["SCORE_ATTACK","INFINITE"])
    assert.equal(shouldSpawnEmberSkater(true,mode,2,1,false,false,false),false);
  assert.equal(shouldSpawnEmberSkater(false,"CAMPAIGN",1,1,false,false,false),false);
  assert.equal(shouldSpawnEmberSkater(true,"CAMPAIGN",1,1,true,false,false),false);
  assert.equal(shouldSpawnEmberSkater(true,"CAMPAIGN",1,1,false,true,false),false);
  assert.equal(shouldSpawnEmberSkater(true,"CAMPAIGN",1,1,false,false,true),false);
});
test("PYRA-01B: heat is NEVER live until announced warning completes",()=>{
  let a=createEmberSkaterAttack();
  let z=stepEmberSkater(a,origin,player,1.12,50);a=z.attack;
  assert.equal(z.warned,true);assert.equal(a.stage,"WARNING");
  assert.equal(a.remainingMs,EMBER_WARN_MS);
  assert.equal(z.releaseHeat,false);
  const lock=[a.lockedX,a.lockedY];
  for(let n=0;n<21;n++){
    z=stepEmberSkater(a,origin,{x:950,y:950},1.12,50);a=z.attack;
    assert.deepEqual([a.lockedX,a.lockedY],lock);
    assert.equal(z.releaseHeat,false);
  }
  z=stepEmberSkater(a,origin,{x:950,y:950},1.12,50);
  assert.equal(z.releaseHeat,true);
  assert.equal(z.attack.stage,"HOT");
  assert.ok(EMBER_PATCH_LIFE_MS>EMBER_HEAT_MS);
  assert.ok(EMBER_PATCH_RADIUS>10);
  z=stepEmberSkater(z.attack,origin,player,1.12,50);
  assert.equal(z.releaseHeat,false);
});
test("PYRA-01B: deterministic input and native projectile collision/budget",()=>{
  const a=createEmberSkaterAttack();
  assert.deepEqual(stepEmberSkater(a,origin,player,1,16),
    stepEmberSkater(a,origin,player,1,16));
  assert.deepEqual(a,createEmberSkaterAttack());
  assert.throws(()=>stepEmberSkater(a,origin,player,1,101),RangeError);
  assert.throws(()=>stepEmberSkater(a,origin,{x:NaN,y:0},1,16),RangeError);
  const engine=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
  assert.match(engine,/shouldSpawnEmberSkater\(/);
  assert.match(engine,/isPyra\(worldRouteRunActiveRef.current,worldRouteThemeRef.current\)/);
  assert.match(engine,/stepEmberSkater\(/);
  assert.match(engine,/if\(step.releaseHeat &&/);
  assert.match(engine,/hostileProjectileBudgetState.count\+\+/);
  assert.match(engine,/registerCombatDefeat\(enemy, proj.affinity\)/);
  assert.match(canvas,/case EnemyType.EMBER_SKATER/);
  assert.match(canvas,/a.stage==="WARNING"/);
});
