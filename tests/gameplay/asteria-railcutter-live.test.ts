import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  RAILCUTTER_AIM_MS,RAILCUTTER_CHARGE_MS,RAILCUTTER_RECOVER_MS,
  RAILCUTTER_TELEGRAPH_LENGTH,createRailcutterAttack,
  selectAsteriaRailcutterSpawn,shouldSpawnAsteriaRailcutter,
  stepAsteriaRailcutter,
} from "../../src/game/asteriaRailcutter";

const camera={cameraX:160,cameraY:130,viewportWidth:800,viewportHeight:480,zoom:1};
const target={x:600,y:380};
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<.0001,`${a} != ${b}`);

test("WBE-01A: only actual Mundo Nuevo campaign admits a single original Railcutter for a budget slot",()=>{
  assert.equal(shouldSpawnAsteriaRailcutter(true,"CAMPAIGN",2,3,false,false,false),true);
  assert.equal(shouldSpawnAsteriaRailcutter(true,"CAMPAIGN",3,8,false,false,false),true);
  for(const mode of ["INFINITE","SCORE_ATTACK","ENDLESS","CAMPAIGN"]){
    assert.equal(shouldSpawnAsteriaRailcutter(false,mode,2,3,false,false,false),false);
  }
  assert.equal(shouldSpawnAsteriaRailcutter(true,"SCORE_ATTACK",2,3,false,false,false),false);
  assert.equal(shouldSpawnAsteriaRailcutter(true,"INFINITE",11,3,false,false,false),false);
  assert.equal(shouldSpawnAsteriaRailcutter(true,"CAMPAIGN",1,3,false,false,false),false);
  assert.equal(shouldSpawnAsteriaRailcutter(true,"CAMPAIGN",2,4,false,false,false),false);
  assert.equal(shouldSpawnAsteriaRailcutter(true,"CAMPAIGN",2,3,true,false,false),false);
  assert.equal(shouldSpawnAsteriaRailcutter(true,"CAMPAIGN",2,3,false,true,false),false);
  assert.equal(shouldSpawnAsteriaRailcutter(true,"CAMPAIGN",2,3,false,false,true),false);
});

test("WBE-01A: cannot spawn over player or outside legacy 1600x960 authoritative world",()=>{
  const pos=selectAsteriaRailcutterSpawn(camera,target,1600,960,220);
  assert.ok(pos);
  assert.ok(pos.x>=16&&pos.x<=1584);
  assert.ok(pos.y>=16&&pos.y<=944);
  assert.ok(Math.hypot(pos.x-target.x,pos.y-target.y)>=220);
  const corner=selectAsteriaRailcutterSpawn(
    {...camera,cameraX:1050,cameraY:440},{x:1540,y:910},1600,960,200);
  assert.ok(corner);
  assert.ok(Math.hypot(corner.x-1540,corner.y-910)>=200);
  assert.equal(selectAsteriaRailcutterSpawn(
    {cameraX:0,cameraY:0,viewportWidth:800,viewportHeight:480,zoom:1},
    {x:45,y:45},100,100,1000),null);
  assert.throws(()=>selectAsteriaRailcutterSpawn(
    {...camera,zoom:0},target,1600,960),RangeError);
  assert.throws(()=>selectAsteriaRailcutterSpawn(
    camera,{x:NaN,y:0},1600,960),RangeError);
});

test("WBE-01A: physically approaches target, signals 850ms, commits 420ms fixed-vector charge, recovers 900ms",()=>{
  let p={x:970,y:380},attack=createRailcutterAttack();
  for(let i=0;i<340 && attack.phase==="APPROACH";i++){
    const tick=stepAsteriaRailcutter(attack,p,target,.95,50);
    p={x:tick.x,y:tick.y};attack=tick.attack;
  }
  assert.equal(attack.phase,"AIM");
  assert.equal(attack.remainingMs,RAILCUTTER_AIM_MS);
  assert.equal(RAILCUTTER_TELEGRAPH_LENGTH,230);
  const aimPosition={...p},lockedDirectionX=attack.directionX;
  for(let i=0;i<17;i++){
    const tick=stepAsteriaRailcutter(attack,p,
      {x:target.x,y:target.y-240},.95,50);
    p={x:tick.x,y:tick.y};attack=tick.attack;
    near(p.x,aimPosition.x);near(p.y,aimPosition.y);
  }
  assert.equal(attack.phase,"CHARGE");
  assert.equal(attack.remainingMs,RAILCUTTER_CHARGE_MS);
  const charge=stepAsteriaRailcutter(attack,p,
    {x:target.x+600,y:target.y+400},.95,50);
  assert.ok(charge.x<p.x);
  near(charge.y,p.y);
  near(charge.attack.directionX,lockedDirectionX);
  p={x:charge.x,y:charge.y};attack=charge.attack;
  for(let i=0;i<8;i++){
    const tick=stepAsteriaRailcutter(attack,p,target,.95,50);
    p={x:tick.x,y:tick.y};attack=tick.attack;
  }
  assert.equal(attack.phase,"RECOVER");
  assert.equal(attack.remainingMs,RAILCUTTER_RECOVER_MS);
  const rest={...p};
  for(let i=0;i<18;i++){
    const tick=stepAsteriaRailcutter(attack,p,target,.95,50);
    p={x:tick.x,y:tick.y};attack=tick.attack;
    near(rest.x,p.x);near(rest.y,p.y);
  }
  assert.equal(attack.phase,"APPROACH");
});

test("WBE-01A: deterministic ticks preserve input snapshots and clamp invalid dt",()=>{
  const state=createRailcutterAttack(),p={x:400,y:300};
  const a=stepAsteriaRailcutter(state,p,target,1,16.6);
  const b=stepAsteriaRailcutter(state,p,target,1,16.6);
  assert.deepEqual(a,b);
  assert.equal(state.phase,"APPROACH");
  assert.deepEqual(p,{x:400,y:300});
  const still=stepAsteriaRailcutter(state,p,target,1,0);
  assert.equal(still.x,p.x);
  assert.throws(()=>stepAsteriaRailcutter(state,p,target,1,-1),RangeError);
  assert.throws(()=>stepAsteriaRailcutter(state,p,target,1,101),RangeError);
  assert.throws(()=>stepAsteriaRailcutter(state,p,target,NaN,10),RangeError);
});

test("WBE-01A: authentic production campaign owns Railcutter spawn, attacks, damage and ORBI integration",()=>{
  const source=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const renderer=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
  const types=readFileSync(new URL("../../src/game/types.ts",import.meta.url),"utf8");
  assert.match(types,/RAILCUTTER = "RAILCUTTER"/);
  assert.match(source,/isAsteria\(worldRouteRunActiveRef\.current,worldRouteThemeRef\.current\),descriptor\.sourceMode/);
  assert.match(source,/shouldSpawnAsteriaRailcutter\(/);
  assert.match(source,/selectAsteriaRailcutterSpawn\(/);
  assert.match(source,/type===EnemyType\.RAILCUTTER\s*\?createRailcutterAttack\(\):undefined/);
  assert.match(source,/stepAsteriaRailcutter\(/);
  assert.match(source,/registerCombatDefeat\(/);
  assert.match(source,/spawnResource\(enemy\.x, enemy\.y\)/);
  assert.match(source,/findFirstCollidingSpatialItem\(/);
  assert.match(renderer,/case EnemyType\.RAILCUTTER/);
  assert.match(renderer,/RAILCUTTER && enemy\.railcutterAttack/);
  assert.doesNotMatch(source,/import .*routeDroneDuelQa/);
});
