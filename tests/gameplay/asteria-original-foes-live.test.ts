import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  resolveAsteriaNewFoe,selectAsteriaNewFoeSpawn,
  createSkySpecterAttack,stepSkySpecter,SKY_SPECTER_WARNING_MS,
  SKY_SPECTER_DIVE_MS,createBeaconPrismAttack,stepBeaconPrism,
  BEACON_PRISM_WARNING_MS,BEACON_PRISM_FAN_RADIANS,
  createIonSailAttack,stepIonSail,ION_SAIL_WARNING_MS,
  ION_SAIL_TRAIL_LIFE_MS,ION_SAIL_TRAIL_DAMAGE,ION_SAIL_TRAIL_INTERVAL_MS,
} from "../../src/game/asteriaOriginalFoes";
const viewport={cameraX:140,cameraY:110,viewportWidth:840,viewportHeight:500,zoom:1};
const leader={x:500,y:410};
const near=(a:number,b:number,tolerance=1e-5)=>
  assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const allow=()=>false;

test("WBE-01B-D: one unique foe per matching budget slot, never classic or unintended mode",()=>{
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",2,1,false,false,allow),"SKY_SPECTER");
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",3,2,false,false,allow),"BEACON_PRISM");
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",4,4,false,false,allow),"ION_SAIL");
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",2,3,false,false,allow),null);
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",2,2,false,false,allow),null);
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",3,4,false,false,allow),null);
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",4,4,false,false,type=>type==="ION_SAIL"),null);
  for(const mode of ["INFINITE","SCORE_ATTACK","ENDLESS"]){
    assert.equal(resolveAsteriaNewFoe(true,mode,20,1,false,false,allow),null);
  }
  assert.equal(resolveAsteriaNewFoe(false,"CAMPAIGN",12,1,false,false,allow),null);
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",3,1,true,false,allow),null);
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",3,1,false,true,allow),null);
  assert.equal(resolveAsteriaNewFoe(true,"CAMPAIGN",3,-1,false,false,allow),null);
});

test("WBE-01B-D: all three actors spawn safely within the real visible world",()=>{
  for(const type of ["SKY_SPECTER","BEACON_PRISM","ION_SAIL"] as const){
    const position=selectAsteriaNewFoeSpawn(type,viewport,leader,1600,960,190);
    assert.ok(position,type+" failed safe spawn");
    assert.ok(position.x>=16 && position.x<=1584);
    assert.ok(position.y>=16 && position.y<=944);
    assert.ok(Math.hypot(position.x-leader.x,position.y-leader.y)>=190);
  }
  assert.equal(selectAsteriaNewFoeSpawn("SKY_SPECTER",
    {cameraX:0,cameraY:0,viewportWidth:800,viewportHeight:480,zoom:1},
    {x:50,y:50},100,100,1000),null);
  assert.throws(()=>selectAsteriaNewFoeSpawn("ION_SAIL",
    {...viewport,zoom:0},leader,1600,960,190),RangeError);
});

test("WBE-01B: Specter rises to a distinct aerial lane then LOCK telegraphs 780ms",()=>{
  let attack=createSkySpecterAttack(-1),pos={x:760,y:45};
  for(let i=0;i<800 && attack.phase==="CLIMB";i++){
    const step=stepSkySpecter(attack,pos,leader,1.1,50);
    pos={x:step.x,y:step.y};attack=step.attack;
  }
  assert.equal(attack.phase,"LOCK");
  assert.equal(attack.remainingMs,SKY_SPECTER_WARNING_MS);
  const locked={x:attack.dirX,y:attack.dirY},location={...pos};
  for(let i=0;i<16;i++){
    const step=stepSkySpecter(attack,pos,{x:200,y:850},1.1,50);
    pos={x:step.x,y:step.y};attack=step.attack;
    near(pos.x,location.x);near(pos.y,location.y);
  }
  assert.equal(attack.phase,"DIVE");
  near(attack.dirX,locked.x);near(attack.dirY,locked.y);
  assert.equal(attack.remainingMs,SKY_SPECTER_DIVE_MS);
});

test("WBE-01B: Specter commits nonhoming dive and cannot instantly retarget the player",()=>{
  const attack={...createSkySpecterAttack(-1),phase:"DIVE" as const,
    remainingMs:SKY_SPECTER_DIVE_MS,dirX:-.8,dirY:.6};
  const pos={x:850,y:130};
  const a=stepSkySpecter(attack,pos,{x:200,y:750},1.1,50);
  const b=stepSkySpecter(attack,pos,{x:1400,y:40},1.1,50);
  near(a.x,b.x);near(a.y,b.y);
  assert.ok(a.x<pos.x&&a.y>pos.y);
  assert.deepEqual(attack.phase,"DIVE");
  let state=a.attack,p={x:a.x,y:a.y};
  for(let i=0;i<10;i++){
    const next=stepSkySpecter(state,p,leader,1.1,50);
    p={x:next.x,y:next.y};state=next.attack;
  }
  assert.equal(state.phase,"BREAK");
  const before={...p};
  for(let i=0;i<30&&state.phase==="BREAK";i++){
    const next=stepSkySpecter(state,p,leader,1.1,50);
    p={x:next.x,y:next.y};state=next.attack;
    near(before.x,p.x);near(before.y,p.y);
  }
  assert.equal(state.phase,"CLIMB");
});

test("WBE-01C: Prism locks original triple-beam coordinates before firing once",()=>{
  let attack=createBeaconPrismAttack(),pos={x:730,y:410};
  const started=stepBeaconPrism(attack,pos,leader,.63,50);
  attack=started.attack;
  assert.equal(attack.phase,"MARK");
  assert.equal(attack.remainingMs,BEACON_PRISM_WARNING_MS);
  near(attack.targetX,leader.x);near(attack.targetY,leader.y);
  let fired=0;
  for(let i=0;i<18;i++){
    const step=stepBeaconPrism(attack,pos,{x:100,y:800},.63,50);
    attack=step.attack;pos={x:step.x,y:step.y};
    if(step.fire)fired++;
  }
  assert.equal(fired,1);
  assert.equal(attack.phase,"COOLDOWN");
  assert.equal(attack.targetX,leader.x);
  near(BEACON_PRISM_FAN_RADIANS,.24);
  for(let i=0;i<36;i++){
    const step=stepBeaconPrism(attack,pos,leader,.63,50);
    attack=step.attack;
  }
  assert.equal(attack.phase,"POSITION");
});

test("WBE-01D: Ion Sail warns before moving and places finite-life electric remnants",()=>{
  let attack=createIonSailAttack(),pos={x:730,y:410};
  const first=stepIonSail(attack,pos,leader,1.15,50);
  attack=first.attack;
  assert.equal(attack.phase,"WARN");
  assert.equal(attack.remainingMs,ION_SAIL_WARNING_MS);
  let count=0;
  for(let i=0;i<15;i++){
    const step=stepIonSail(attack,pos,{x:200,y:900},1.15,50);
    attack=step.attack;pos={x:step.x,y:step.y};
    assert.equal(step.placeTrail,undefined);
  }
  assert.equal(attack.phase,"SWEEP");
  for(let i=0;i<24;i++){
    const step=stepIonSail(attack,pos,{x:1000,y:0},1.15,50);
    attack=step.attack;pos={x:step.x,y:step.y};
    if(step.placeTrail)count++;
  }
  assert.equal(attack.phase,"RECOVER");
  assert.ok(count>=3&&count<=5,`Expected limited trail, got ${count}`);
  assert.equal(ION_SAIL_TRAIL_LIFE_MS,850);
  assert.equal(ION_SAIL_TRAIL_DAMAGE,5);
  assert.equal(ION_SAIL_TRAIL_INTERVAL_MS,320);
});

test("WBE-01B-D: invalid ticks fail closed, all original states are immutable",()=>{
  const pos={x:800,y:200};
  for(const [attack,step] of [
    [createSkySpecterAttack(-1),stepSkySpecter],
    [createBeaconPrismAttack(),stepBeaconPrism],
    [createIonSailAttack(),stepIonSail],
  ] as const){
    assert.throws(()=>step(attack as never,pos,leader,.8,101),RangeError);
    assert.throws(()=>step(attack as never,pos,leader,.8,-1),RangeError);
    assert.throws(()=>step(attack as never,pos,leader,NaN,16),RangeError);
    const same=step(attack as never,pos,leader,.8,16);
    assert.deepEqual(same,step(attack as never,pos,leader,.8,16));
  }
});

test("WBE-01B-D: real engine and renderer own exclusive types; no separate QA or artificial reward path",()=>{
  const types=readFileSync(new URL("../../src/game/types.ts",import.meta.url),"utf8");
  const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
  for(const type of ["SKY_SPECTER","BEACON_PRISM","ION_SAIL"]){
    assert.match(types,new RegExp(type+' = "'+type+'"'));
    assert.match(canvas,new RegExp("case EnemyType."+type));
    assert.match(game,new RegExp("EnemyType."+type));
  }
  assert.match(game,/worldRouteRunActiveRef.current,descriptor.sourceMode/);
  assert.match(game,/shootFromEnemy\(enemy,hostileProjectileBudgetState/);
  assert.match(game,/hostileProjectileBudgetState.count\+\+/);
  assert.match(game,/projectilesRef.current.length<MAX_PROJECTILES/);
  assert.match(game,/registerCombatDefeat\(/);
  assert.match(game,/findFirstCollidingSpatialItem\(/);
  assert.doesNotMatch(game,/import .*physicalRouteQaSimulation/);
});
