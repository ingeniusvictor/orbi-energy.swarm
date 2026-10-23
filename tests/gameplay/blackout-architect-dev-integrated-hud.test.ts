import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType, type Projectile } from "../../src/game/types";
import { createBlackoutArchitectDevQaBoss } from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";
import { createBlackoutArchitectDevQaCardinalGeometry } from "../../src/game/blackoutArchitectDevQaCardinalGeometry";
import { resolveBlackoutArchitectDevQaCardinalImpact } from "../../src/game/blackoutArchitectDevQaCardinalImpact";
import { resolveBlackoutArchitectDevQaCoreImpact } from "../../src/game/blackoutArchitectDevQaCoreImpact";
import {
  createBlackoutArchitectDevQaGridLockState as createGrid,
  stepBlackoutArchitectDevQaGridLock as tickGrid,
  type BlackoutArchitectDevQaGridLockState,
} from "../../src/game/blackoutArchitectDevQaGridLockAttack";
import {
  createBlackoutArchitectDevQaVectorTideState as createTide,
  stepBlackoutArchitectDevQaVectorTide as tickTide,
  type BlackoutArchitectDevQaVectorTideState,
} from "../../src/game/blackoutArchitectDevQaVectorTideAttack";
import {
  createBlackoutArchitectDevQaSectorWallState as createWall,
  stepBlackoutArchitectDevQaSectorWall as tickWall,
  type BlackoutArchitectDevQaSectorWallState,
} from "../../src/game/blackoutArchitectDevQaSectorWallAttack";
import {
  createBlackoutArchitectDevQaPatternDirector as createDirector,
  stepBlackoutArchitectDevQaPatternDirector as tickDirector,
  type BlackoutArchitectDevQaPatternDirectorState,
} from "../../src/game/blackoutArchitectDevQaPatternDirector";
import {
  projectBlackoutArchitectDevQaBattleHud as project,
  BLACKOUT_ARCHITECT_DEV_QA_BATTLE_HUD_AUTHORITY as AUTH,
  type ArchitectQaHudAttack,
} from "../../src/game/blackoutArchitectDevQaBattleHud";

const session=()=>{
  const owner=createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(owner.beginRun(),1);
  const boss=createBlackoutArchitectDevQaBoss(true);assert.ok(boss);
  const enemies=[boss];
  const guard=owner.admitInstalledBoss(boss,boss,enemies);assert.ok(guard);
  const geometry=createBlackoutArchitectDevQaCardinalGeometry(owner,guard,boss,boss,enemies,true);
  assert.ok(geometry);
  return {owner,boss,enemies,guard,geometry};
};
const read=(s:ReturnType<typeof session>,
  grid:BlackoutArchitectDevQaGridLockState|null,
  tide:BlackoutArchitectDevQaVectorTideState|null,
  wall:BlackoutArchitectDevQaSectorWallState|null,
  active:ArchitectQaHudAttack|null,
  director:BlackoutArchitectDevQaPatternDirectorState|null=null,
  enabled=true)=>
    project(s.owner,s.guard,s.geometry,s.boss,s.boss,s.enemies,
      grid,tide,wall,active,director,enabled);
const shot=(x:number,y:number,damage:number):Projectile=>({
  id:"qa-c9",x,y,vx:0,vy:0,size:4,damage,fromPlayer:true,
  color:"#67e8f9",life:1600,maxLife:1600,
});
const destroyRealAnchors=(s:ReturnType<typeof session>)=>{
  for(const a of s.geometry.anchors){
    for(const damage of [100,35]){
      const p=shot(a.x,a.y,damage);
      const e=resolveBlackoutArchitectDevQaCardinalImpact(
        s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p);
      assert.ok(e);assert.equal(e.anchorId,a.id);assert.equal(p.life,0);
    }
    assert.equal(a.health,0);
  }
};
const damageRealCore=(s:ReturnType<typeof session>,shots:number)=>{
  for(let i=0;i<shots;i++){
    const p=shot(s.boss.x,s.boss.y,100);
    const e=resolveBlackoutArchitectDevQaCoreImpact(
      s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p);
    assert.ok(e);assert.equal(e.shotConsumed,true);assert.equal(p.life,0);
  }
};
const safe={x:1240,y:640};

test("C9 HUD reads four real anchored HP records and core, then real C2/C3 impacts",()=>{
  const s=session(),grid=createGrid(s.owner,s.guard,s.boss,s.boss,s.enemies,true);
  assert.ok(grid);
  const initial=read(s,grid,null,null,grid);
  assert.ok(initial);
  assert.equal(initial.mode,"DEV_QA_AUTHENTIC_BATTLE_HUD");
  assert.deepEqual(initial.anchors.map(a=>a.id),["NORTH","EAST","SOUTH","WEST"]);
  assert.deepEqual(initial.anchors.map(a=>a.health),[135,135,135,135]);
  assert.equal(initial.coreHealth,1920);
  assert.equal(initial.coreExposed,false);
  assert.equal(initial.anchorsRemaining,4);
  assert.equal(initial.directorPhase,1);
  assert.equal(initial.attack,"GRID_LOCK");
  assert.equal(initial.attackPhase,"TELEGRAPH");
  assert.equal(initial.qaHullHealth,100);
  assert.equal(Object.isFrozen(initial),true);
  assert.equal(Object.isFrozen(initial.anchors),true);
  assert.equal(Object.isFrozen(initial.anchors[0]),true);
  const premature=shot(s.boss.x,s.boss.y,100);
  assert.equal(resolveBlackoutArchitectDevQaCoreImpact(
    s.owner,s.guard,s.geometry,s.boss,s.enemies,premature,premature),null);
  const north=s.geometry.anchors[0];
  const single=shot(north.x,north.y,20);
  assert.ok(resolveBlackoutArchitectDevQaCardinalImpact(
    s.owner,s.guard,s.geometry,s.boss,s.enemies,single,single));
  assert.equal(read(s,grid,null,null,grid)?.anchors[0].health,115);
  for(const damage of [100,15]){
    const p=shot(north.x,north.y,damage);
    assert.ok(resolveBlackoutArchitectDevQaCardinalImpact(
      s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p));
  }
  for(const a of s.geometry.anchors.slice(1)){
    for(const damage of [100,35]){
      const p=shot(a.x,a.y,damage);
      assert.ok(resolveBlackoutArchitectDevQaCardinalImpact(
        s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p));
    }
  }
  const exposed=read(s,grid,null,null,grid);
  assert.ok(exposed);assert.equal(exposed.coreExposed,true);
  assert.equal(exposed.anchorsRemaining,0);
  assert.ok(exposed.anchors.every(a=>a.down));
  damageRealCore(s,7);
  const progressed=read(s,grid,null,null,grid);
  assert.ok(progressed);
  assert.equal(progressed.coreHealth,1220);
  assert.equal(progressed.directorPhase,2);
});
test("C9 real grid hit -> director VECTOR -> Phase3 SECTOR keeps shared QA hull",()=>{
  const s=session();
  const grid=createGrid(s.owner,s.guard,s.boss,s.boss,s.enemies,true);
  assert.ok(grid);
  destroyRealAnchors(s);
  damageRealCore(s,7); // 1220 of 1920 triggers phase2.
  const director=createDirector(s.owner,s.guard,s.geometry,s.boss,s.boss,s.enemies,
    "GRID_LOCK",grid.cycle,grid.qaHullHealth,true);
  assert.ok(director);assert.equal(director.phase,2);
  let reachedActive=false;
  for(let i=0;i<80;i++){
    const ev=tickGrid(s.owner,s.guard,grid,grid,s.boss,s.boss,s.enemies,safe,20);
    assert.ok(ev);
    assert.ok(tickDirector(s.owner,s.guard,s.geometry,director,director,
      s.boss,s.boss,s.enemies,"GRID_LOCK",ev));
    if(ev.phase==="ACTIVE"){reachedActive=true;break;}
  }
  assert.equal(reachedActive,true);
  const damage=tickGrid(s.owner,s.guard,grid,grid,s.boss,s.boss,s.enemies,
    {x:s.boss.x,y:s.boss.y},20);
  assert.ok(damage);assert.equal(damage.damageApplied,20);
  assert.equal(damage.qaHullHealth,80);
  assert.ok(tickDirector(s.owner,s.guard,s.geometry,director,director,
    s.boss,s.boss,s.enemies,"GRID_LOCK",damage));
  assert.equal(read(s,grid,null,null,grid,director)?.qaHullHealth,80);
  const replay=tickGrid(s.owner,s.guard,grid,grid,s.boss,s.boss,s.enemies,
    {x:s.boss.x,y:s.boss.y},20);
  assert.ok(replay);assert.equal(replay.damageApplied,0);
  assert.ok(tickDirector(s.owner,s.guard,s.geometry,director,director,
    s.boss,s.boss,s.enemies,"GRID_LOCK",replay));
  let toTide=false;
  for(let i=0;i<520;i++){
    const ev=tickGrid(s.owner,s.guard,grid,grid,s.boss,s.boss,s.enemies,safe,20);
    assert.ok(ev);
    const d=tickDirector(s.owner,s.guard,s.geometry,director,director,
      s.boss,s.boss,s.enemies,"GRID_LOCK",ev);
    assert.ok(d);
    if(d.nextPattern==="VECTOR_TIDE"){toTide=true;break;}
  }
  assert.equal(toTide,true);
  const tide=createTide(s.owner,s.guard,s.boss,s.boss,s.enemies,true);
  assert.ok(tide);tide.qaHullHealth=director.qaHullHealth;
  const after=read(s,null,tide,null,tide,director);
  assert.ok(after);assert.equal(after.attack,"VECTOR_TIDE");
  assert.equal(after.qaHullHealth,80);
  assert.equal(after.directorPhase,2);

  damageRealCore(s,7); // 520 of 1920 triggers phase3 by genuine C3.
  let toWall=false;
  for(let i=0;i<625;i++){
    const ev=tickTide(s.owner,s.guard,tide,tide,s.boss,s.boss,s.enemies,safe,20);
    assert.ok(ev);
    const d=tickDirector(s.owner,s.guard,s.geometry,director,director,
      s.boss,s.boss,s.enemies,"VECTOR_TIDE",ev);
    assert.ok(d);
    if(d.nextPattern==="SECTOR_WALL"){toWall=true;break;}
  }
  assert.equal(toWall,true);
  const wall=createWall(s.owner,s.guard,s.boss,s.boss,s.enemies,true);
  assert.ok(wall);wall.qaHullHealth=director.qaHullHealth;
  const rotated=read(s,null,null,wall,wall,director);
  assert.ok(rotated);assert.equal(rotated.attack,"SECTOR_WALL");
  assert.equal(rotated.directorPhase,3);
  assert.equal(rotated.coreHealth,520);
  assert.equal(rotated.qaHullHealth,80);
  let active=false;
  for(let i=0;i<110;i++){
    const e=tickWall(s.owner,s.guard,wall,wall,s.boss,s.boss,s.enemies,safe,20);
    assert.ok(e);
    assert.ok(tickDirector(s.owner,s.guard,s.geometry,director,director,
      s.boss,s.boss,s.enemies,"SECTOR_WALL",e));
    if(e.phase==="ACTIVE"){active=true;break;}
  }
  assert.equal(active,true);
  const hit=tickWall(s.owner,s.guard,wall,wall,s.boss,s.boss,s.enemies,
    {x:s.boss.x+74,y:s.boss.y},20);
  assert.ok(hit);assert.equal(hit.damageApplied,12);
  assert.equal(hit.qaHullHealth,68);
  assert.ok(tickDirector(s.owner,s.guard,s.geometry,director,director,
    s.boss,s.boss,s.enemies,"SECTOR_WALL",hit));
  assert.equal(read(s,null,null,wall,wall,director)?.qaHullHealth,68);
});
test("C9 refuses multi-active attacks, clones, forged modes/timers or director HP mismatch",()=>{
  const s=session();
  const grid=createGrid(s.owner,s.guard,s.boss,s.boss,s.enemies,true);
  const tide=createTide(s.owner,s.guard,s.boss,s.boss,s.enemies,true);
  const wall=createWall(s.owner,s.guard,s.boss,s.boss,s.enemies,true);
  assert.ok(grid);assert.ok(tide);assert.ok(wall);
  assert.equal(read(s,grid,tide,null,grid),null);
  assert.equal(read(s,grid,null,wall,wall),null);
  assert.equal(read(s,grid,null,null,{...grid}),null);
  assert.equal(read(s,grid,null,null,grid,null,false),null);
  const start=grid.remainingMs;grid.remainingMs=1000000;
  assert.equal(read(s,grid,null,null,grid),null);
  grid.remainingMs=start;
  grid.qaHullHealth=-1;
  assert.equal(read(s,grid,null,null,grid),null);
  grid.qaHullHealth=100;
  const d=createDirector(s.owner,s.guard,s.geometry,s.boss,s.boss,s.enemies,
    "GRID_LOCK",1,100,true);
  assert.ok(d);
  grid.qaHullHealth=80;
  assert.equal(read(s,grid,null,null,grid,d),null);
  grid.qaHullHealth=100;
  assert.ok(read(s,grid,null,null,grid,d));
  assert.ok(read(s,null,tide,null,tide));
  assert.ok(read(s,null,null,wall,wall));
  (tide as {mode:string}).mode="INVALID";
  assert.equal(read(s,null,tide,null,tide),null);
});
test("C9 stale guard, poison anchor, foreign boss or terminal core never render",()=>{
  const s=session();
  const grid=createGrid(s.owner,s.guard,s.boss,s.boss,s.enemies,true);
  assert.ok(grid);
  s.geometry.anchors[0].health=NaN;
  assert.equal(read(s,grid,null,null,grid),null);
  s.geometry.anchors[0].health=135;
  const foreign={...s.boss,type:EnemyType.BOSS_TITAN};
  assert.equal(project(s.owner,s.guard,s.geometry,foreign,foreign,[foreign],
    grid,null,null,grid,null,true),null);
  s.boss.health=0;
  assert.equal(read(s,grid,null,null,grid),null);
  s.boss.health=1920;
  assert.equal(s.owner.invalidateRun(),null);
  assert.equal(read(s,grid,null,null,grid),null);
});
test("C9 authority is strictly read-only DEV QA presentation",()=>{
  assert.ok(Object.isFrozen(AUTH));
  assert.deepEqual(Object.entries(AUTH).filter(([,v])=>v===true).map(([k])=>k),[
    "ownsVerifiedRealQaReadOnlyBattleSnapshot",
    "ownsVisibleCardinalCoreAndAttackStatus",
    "ownsDevOnlyInstructionsAndPresentationProjection",
  ]);
  assert.ok(Object.entries(AUTH).filter(([,v])=>v===false).length>=5);
});