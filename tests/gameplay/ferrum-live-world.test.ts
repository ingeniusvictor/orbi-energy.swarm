import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {ASTERIA_WORLD_CHOICE,FERRUM_WORLD_ID,
 ferrumSceneAt,isAsteria,isFerrum,drawFerrumWorld} from "../../src/game/ferrumWorld";
import {resolveFerrumFoe,selectFerrumFoeSpawn,createShadeGearAttack,
 createM9WelderAttack,stepShadeGear,stepM9Welder,
 SHADE_GEAR_SPARK_MS,SHADE_GEAR_BRAKE_MS,M9_WELDER_WARN_MS,
 M9_WELDER_PROJECTILE_SPEED} from "../../src/game/ferrumOriginalFoes";

const player={x:650,y:470},gear={x:920,y:470};
test("FERRUM-01: two mutually exclusive original World Route identities",()=>{
 assert.equal(isFerrum(true,FERRUM_WORLD_ID),true);
 assert.equal(isAsteria(true,ASTERIA_WORLD_CHOICE),true);
 assert.equal(isAsteria(true,FERRUM_WORLD_ID),false);
 assert.equal(isFerrum(true,ASTERIA_WORLD_CHOICE),false);
 assert.equal(isFerrum(false,FERRUM_WORLD_ID),false);
 assert.deepEqual(Array.from({length:6},(_,i)=>ferrumSceneAt(i)),[
  "GEAR_GATE","COPPER_AVENUE","FORGE_DISTRICT","SKY_CRANES",
  "ASSEMBLY_SPAN","REACTOR_VISTA"]);
 assert.equal(ferrumSceneAt(6),"GEAR_GATE");
 assert.throws(()=>ferrumSceneAt(-1),RangeError);
 assert.throws(()=>ferrumSceneAt(2.7),RangeError);
});
test("FERRUM-01: genuine campaign spawn budget, no forced spawns or cross-world enemies",()=>{
 const active=()=>false;
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",1,1,false,false,active),"SHADE_GEAR");
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",1,2,false,false,active),null);
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",2,2,false,false,active),"M9_WELDER");
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",3,3,false,false,active),"SHADE_GEAR");
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",2,1,false,false,x=>x==="SHADE_GEAR"),null);
 for(const mode of ["INFINITE","SCORE_ATTACK","ENDLESS"]){
   assert.equal(resolveFerrumFoe(true,mode,5,1,false,false,active),null);
 }
 assert.equal(resolveFerrumFoe(false,"CAMPAIGN",2,1,false,false,active),null);
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",2,1,true,false,active),null);
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",2,1,false,true,active),null);
 assert.equal(resolveFerrumFoe(true,"CAMPAIGN",2,-1,false,false,active),null);
 const cam={cameraX:150,cameraY:120,viewportWidth:800,viewportHeight:480,zoom:1};
 const spawn=selectFerrumFoeSpawn(cam,player,1600,960,170);
 assert.ok(spawn!==null);
 assert.ok(Math.hypot(spawn.x-player.x,spawn.y-player.y)>=170);
});
test("FERRUM-01: Shade Gear telegraphs then makes two direction-locked rolling charges",()=>{
 let a=createShadeGearAttack(),pos=gear;
 let next=stepShadeGear(a,pos,player,1,16.6);
 assert.equal(next.attack.phase,"SEEK");
 pos={x:next.x,y:next.y};
 for(let i=0;i<150&&next.attack.phase==="SEEK";i++){
   next=stepShadeGear(next.attack,pos,player,1,50);pos={x:next.x,y:next.y};
 }
 assert.equal(next.attack.phase,"SPARK");
 a=next.attack;
 assert.equal(a.remainingMs,SHADE_GEAR_SPARK_MS);
 const firstLock={dx:a.dx,dy:a.dy};
 for(let i=0;i<17;i++){
   next=stepShadeGear(a,pos,{x:60,y:650},1,50);a=next.attack;
   assert.equal(a.dx,firstLock.dx);assert.equal(a.dy,firstLock.dy);
 }
 assert.equal(a.phase,"ROLL");
 let rolls=0;
 for(let i=0;i<10;i++){
   next=stepShadeGear(a,pos,{x:60,y:650},1,50);a=next.attack;
   pos={x:next.x,y:next.y}; if(next.vx!==0)rolls++;
 }
 assert.equal(rolls,10);
 assert.equal(a.phase,"BRAKE");
 assert.equal(a.remainingMs,SHADE_GEAR_BRAKE_MS);
 for(let i=0;i<13;i++){next=stepShadeGear(a,pos,player,1,50);a=next.attack;}
 assert.equal(a.phase,"SECOND_ROLL");
});
test("FERRUM-01: M-9 Welder marks a fixed target 1100ms before shooting",()=>{
 const pos={x:850,y:470};
 let a=createM9WelderAttack();
 let next=stepM9Welder(a,pos,player,1,50);
 assert.equal(next.attack.phase,"WARN");
 assert.equal(next.attack.remainingMs,M9_WELDER_WARN_MS);
 const locked=next.attack;
 a=next.attack;
 for(let i=0;i<21;i++){
   next=stepM9Welder(a,pos,{x:150,y:700},1,50);a=next.attack;
   assert.equal(next.fire,false);
   assert.equal(a.lockedX,locked.lockedX);
   assert.equal(a.lockedY,locked.lockedY);
 }
 next=stepM9Welder(a,pos,{x:150,y:700},1,50);
 assert.equal(next.fire,true);
 assert.equal(next.attack.phase,"ARC");
 assert.equal(M9_WELDER_PROJECTILE_SPEED,3.2);
 next=stepM9Welder(next.attack,pos,player,1,50);
 assert.equal(next.fire,false);
});
test("FERRUM-01: invalid ticks cannot damage the main engine",()=>{
 assert.throws(()=>stepShadeGear(createShadeGearAttack(),gear,player,1,-1),RangeError);
 assert.throws(()=>stepM9Welder(createM9WelderAttack(),gear,player,1,110),RangeError);
 assert.throws(()=>stepShadeGear(createShadeGearAttack(),gear,{x:NaN,y:4},1,16),RangeError);
 assert.throws(()=>stepM9Welder(createM9WelderAttack(),gear,player,NaN,16),RangeError);
 assert.throws(()=>drawFerrumWorld({} as CanvasRenderingContext2D,-1,1000,0),RangeError);
});
test("FERRUM-01: World Route executes native ORBI, projectiles and two distinct launch buttons",()=>{
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 const start=readFileSync(new URL("../../src/components/StartScreen.tsx",import.meta.url),"utf8");
 const mobile=readFileSync(new URL("../../src/components/MobileLaunchNavigation.tsx",import.meta.url),"utf8");
 const landscape=readFileSync(new URL("../../src/components/PremiumNativeNavigation.tsx",import.meta.url),"utf8");
 assert.match(start,/data-ferrum-world-start-cta/);
 assert.match(start,/onStartWorldRoute\(FERRUM_WORLD_ID\)/);
 assert.match(mobile,/data-testid="orbi-mobile-ferrum-world"/);
 assert.match(landscape,/data-testid="orbi-mobile-ferrum-world"/);
 assert.match(game,/const ferrumFoe=resolveFerrumFoe/);
 assert.match(game,/const ferrumSpawn=ferrumFoe/);
 assert.match(game,/const ferrumActive=isFerrum/);
 assert.match(game,/drawFerrumWorld\(ctx,projectRouteDistance/);
 assert.match(game,/canvas.dataset.ux15World=FERRUM_WORLD_ID/);
 assert.match(game,/stepShadeGear\(/);
 assert.match(game,/stepM9Welder\(/);
 assert.match(game,/shootFromEnemy\(enemy,hostileProjectileBudgetState/);
 assert.match(game,/registerCombatDefeat\(enemy, proj.affinity\)/);
 assert.match(game,/const startWorldRouteGame = \(world:PlayableWorld=ASTERIA_WORLD_CHOICE\)/);
 assert.match(game,/resolveAsteriaArchonEncounter\(isAsteria\(/);
 assert.match(canvas,/case EnemyType.SHADE_GEAR/);
 assert.match(canvas,/case EnemyType.M9_WELDER/);
});
