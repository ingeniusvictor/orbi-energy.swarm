import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  createSpanWardenState,shouldSpawnSpanWarden,stepSpanWarden,
  projectSpanWardenImpact,
  SPAN_WARDEN_GUARD_MS,SPAN_WARDEN_WINDUP_MS,SPAN_WARDEN_SWEEP_MS,
  SPAN_WARDEN_EXPOSE_MS,SPAN_WARDEN_FRONT_DAMAGE_MULTIPLIER,
  SPAN_WARDEN_EXPOSED_DAMAGE_MULTIPLIER,
} from "../../src/game/asteriaSpanWarden";
const target={x:500,y:400};
const near=(x:number,y:number)=>assert.ok(Math.abs(x-y)<.00001,`${x} vs ${y}`);

test("WBE-01E: bridge elite is gated to real Mundo Nuevo Wave 5+ with no overrides",()=>{
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,5,false,false,false),true);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,10,false,false,false),true);
  for(const mode of ["SCORE_ATTACK","INFINITE","SURVIVAL","CAMPAIGN"]){
    assert.equal(shouldSpawnSpanWarden(false,mode,8,5,false,false,false),false);
  }
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",4,5,false,false,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,0,false,false,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",5,6,false,false,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",6,5,true,false,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",6,5,false,true,false),false);
  assert.equal(shouldSpawnSpanWarden(true,"CAMPAIGN",6,5,false,false,true),false);
});

test("WBE-01E: Guard, windup, locked straight sweep, exposed core, recovery",()=>{
  let s=createSpanWardenState(),p={x:700,y:400};
  const entry=stepSpanWarden(s,p,target,.62,50);
  assert.equal(entry.state.phase,"GUARD");
  assert.equal(entry.state.remainingMs,SPAN_WARDEN_GUARD_MS);
  s=entry.state;
  for(let i=0;i<13;i++){
    const result=stepSpanWarden(s,p,target,.62,50);
    near(result.x,p.x);near(result.y,p.y);
    s=result.state;
  }
  assert.equal(s.phase,"WINDUP");
  assert.equal(s.remainingMs,SPAN_WARDEN_WINDUP_MS);
  const locked={x:s.facingX,y:s.facingY};
  for(let i=0;i<17;i++){
    const result=stepSpanWarden(s,p,{x:1100,y:800},.62,50);
    near(result.x,p.x);near(result.y,p.y);
    s=result.state;
  }
  assert.equal(s.phase,"SWEEP");
  assert.equal(s.remainingMs,SPAN_WARDEN_SWEEP_MS);
  near(s.facingX,locked.x);near(s.facingY,locked.y);
  const move=stepSpanWarden(s,p,{x:1100,y:900},.62,50);
  assert.ok(move.x<p.x);
  near(move.y,p.y);
  p={x:move.x,y:move.y};s=move.state;
  // Stop exactly on the transition frame. An extra tick legitimately
  // starts consuming the EXPOSE timer, which is not a physics defect.
  for(let i=0;i<10;i++){
    const result=stepSpanWarden(s,p,target,.62,50);
    p={x:result.x,y:result.y};s=result.state;
  }
  assert.equal(s.phase,"EXPOSE");
  assert.equal(s.remainingMs,SPAN_WARDEN_EXPOSE_MS);
  const frozen={...p};
  for(let i=0;i<26;i++){
    const result=stepSpanWarden(s,p,target,.62,50);
    near(result.x,frozen.x);near(result.y,frozen.y);
    p={x:result.x,y:result.y};s=result.state;
  }
  assert.equal(s.phase,"ADVANCE");
});

test("WBE-01E: physical front shield only blocks targeted direct front impacts",()=>{
  const guard={...createSpanWardenState(),phase:"GUARD" as const,
    remainingMs:300,facingX:-1,facingY:0};
  const enemy={x:500,y:400};
  const front=projectSpanWardenImpact(guard,enemy,{x:470,y:400});
  const rear=projectSpanWardenImpact(guard,enemy,{x:530,y:400});
  assert.equal(front.shieldBlock,true);
  near(front.damageMultiplier,SPAN_WARDEN_FRONT_DAMAGE_MULTIPLIER);
  assert.equal(rear.shieldBlock,false);
  near(rear.damageMultiplier,1);
  const top=projectSpanWardenImpact(guard,enemy,{x:500,y:360});
  assert.equal(top.shieldBlock,false);
  assert.equal(projectSpanWardenImpact(
    {...guard,phase:"SWEEP"},enemy,{x:470,y:400}).shieldBlock,false);
  const exposed=projectSpanWardenImpact(
    {...guard,phase:"EXPOSE"},enemy,{x:470,y:400});
  assert.equal(exposed.shieldBlock,false);
  assert.equal(exposed.exposed,true);
  near(exposed.damageMultiplier,SPAN_WARDEN_EXPOSED_DAMAGE_MULTIPLIER);
});

test("WBE-01E: all transitions and damage are deterministic and input-safe",()=>{
  const original=createSpanWardenState(),p={x:900,y:350};
  assert.deepEqual(stepSpanWarden(original,p,target,1.2,16),
    stepSpanWarden(original,p,target,1.2,16));
  assert.equal(original.phase,"ADVANCE");
  assert.deepEqual(p,{x:900,y:350});
  for(const invalid of [-1,101,NaN]){
    assert.throws(()=>stepSpanWarden(original,p,target,1,invalid),RangeError);
  }
  assert.throws(()=>stepSpanWarden(original,p,target,NaN,50),RangeError);
  assert.throws(()=>projectSpanWardenImpact(original,p,{x:NaN,y:300}),RangeError);
});

test("WBE-01E: only native combat and original Canvas renderer own elite",()=>{
  const types=readFileSync(new URL("../../src/game/types.ts",import.meta.url),"utf8");
  const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
  assert.match(types,/SPAN_WARDEN = "SPAN_WARDEN"/);
  assert.match(types,/spanWardenState\?: SpanWardenState/);
  assert.match(game,/shouldSpawnSpanWarden\(/);
  assert.match(game,/selectAsteriaRailcutterSpawn\(/);
  assert.match(game,/type === EnemyType.SPAN_WARDEN/);
  assert.match(game,/stepSpanWarden\(/);
  assert.match(game,/projectSpanWardenImpact\(/);
  assert.match(game,/damageToApply \*= impact\.damageMultiplier/);
  assert.match(game,/registerCombatDefeat\(/);
  assert.match(game,/findFirstCollidingSpatialItem\(/);
  assert.match(canvas,/case EnemyType\.SPAN_WARDEN/);
  assert.match(canvas,/enemy\.type===EnemyType\.SPAN_WARDEN/);
  assert.equal(game.includes('import {createPhysicalRouteQaState'),false);
});
