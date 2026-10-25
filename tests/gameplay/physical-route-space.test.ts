import assert from "node:assert/strict";
import test from "node:test";
import {
  createRouteCursor,
  createAsteriaSegment,
  type RouteCursor,
} from "../../src/game/worldRouteCore";
import {
  stepRouteClock,
  type RouteRunGates,
} from "../../src/game/worldRouteClock";
import {
  ROUTE_PHYSICAL_SCHEMA_VERSION,
  ROUTE_REBASE_CENTER_LOCAL_X,
  ROUTE_REBASE_QUANTUM,
  ROUTE_REBASE_THRESHOLD,
  ROUTE_PHYSICAL_MAX_FRAME_ADVANCE,
  advancePhysicalRouteFrame,
  createPhysicalRouteFrame,
  isSameRoutePhysicalIdentity,
  localRouteDistanceSquared,
  planRouteOriginShift,
  rebasePhysicalRouteFrame,
  shiftRouteLocalPoint,
  shiftRouteLocalPoints,
} from "../../src/game/physicalRouteSpace";

const active: RouteRunGates = {
  playing:true, paused:false, hidden:false,
  modalOpen:false, upgradeOpen:false, hitstop:false,
};
const close = (a:number,b:number,tolerance=1e-7) =>
  assert.ok(Math.abs(a-b)<tolerance, `${a} should equal ${b}`);

test("UX15-C3A1: typed physical frame copies route identity; never stores global world-X",()=>{
  const cursor=createRouteCursor("asteria-c3a1");
  const frame=createPhysicalRouteFrame(cursor);
  assert.equal(frame.schemaVersion,ROUTE_PHYSICAL_SCHEMA_VERSION);
  assert.equal(frame.originEpoch,0);
  assert.equal(frame.originOffsetX,0);
  assert.equal(frame.travelAnchorLocalX,ROUTE_REBASE_CENTER_LOCAL_X);
  assert.notEqual(frame.cursor,cursor);
  assert.deepEqual(frame.cursor,cursor);
  assert.equal("worldX" in frame,false);
  assert.equal("absoluteX" in frame,false);
  assert.equal("worldX" in frame.cursor,false);
  assert.equal(ROUTE_REBASE_QUANTUM,512);
  assert.equal(ROUTE_REBASE_THRESHOLD,768);
});

test("UX15-C3A1: physical motion is a real local delta from SIMULATED route clock, not wallpaper distance",()=>{
  let frame=createPhysicalRouteFrame(createRouteCursor("simulated"));
  for(let i=0;i<500;i++){
    const nextCursor=stepRouteClock(frame.cursor,50,52,active);
    const next=advancePhysicalRouteFrame(frame,nextCursor);
    close(next.movedX,2.6);
    close(next.frame.travelAnchorLocalX-frame.travelAnchorLocalX,2.6);
    assert.equal(next.frame.cursor.simulatedMs,frame.cursor.simulatedMs+50);
    frame=next.frame;
  }
  assert.ok(frame.cursor.segmentOrdinal>=1);
  assert.ok(frame.travelAnchorLocalX>1800);
  assert.equal(frame.originOffsetX,0);
  assert.ok(ROUTE_PHYSICAL_MAX_FRAME_ADVANCE>=12);
});

test("UX15-C3A1: motion across a segment boundary has no gap or double movement",()=>{
  const cursor:RouteCursor={
    ...createRouteCursor("boundary"),offset:399.25,simulatedMs:1000,
  };
  assert.equal(createAsteriaSegment(0,"boundary").length,400);
  const frame=createPhysicalRouteFrame(cursor,800);
  const next=stepRouteClock(cursor,50,52,active);
  assert.equal(next.segmentOrdinal,1);
  close(next.offset,1.85);
  const advanced=advancePhysicalRouteFrame(frame,next);
  close(advanced.movedX,2.6);
  close(advanced.frame.travelAnchorLocalX,802.6);
});

test("UX15-C3A1: frame delta precision stable after 1,000,000,000 segments",()=>{
  for(const ordinal of [1000,100000,1_000_000_000,Number.MAX_SAFE_INTEGER-2]){
    const cursor:RouteCursor={
      ...createRouteCursor("distant-world"),segmentOrdinal:ordinal,
      offset:15,simulatedMs:1500,
    };
    const frame=createPhysicalRouteFrame(cursor);
    const nextCursor=stepRouteClock(cursor,50,240,active);
    const next=advancePhysicalRouteFrame(frame,nextCursor);
    assert.equal(nextCursor.segmentOrdinal,ordinal);
    assert.equal(nextCursor.offset,27);
    assert.equal(next.movedX,12);
    assert.equal(next.frame.travelAnchorLocalX,812);
    assert.equal(next.frame.originOffsetX,0);
  }
});

test("UX15-C3A1: paused/menu/upgrade/hitstop/hidden gates keep physics cursor and anchor frozen",()=>{
  const original=createPhysicalRouteFrame({
    ...createRouteCursor("freeze"),offset:300,
  });
  for(const gate of [
    {...active,playing:false},{...active,paused:true},
    {...active,hidden:true},{...active,modalOpen:true},
    {...active,upgradeOpen:true},{...active,hitstop:true},
  ]){
    const frozenCursor=stepRouteClock(original.cursor,50,52,gate);
    assert.equal(frozenCursor,original.cursor);
    const result=advancePhysicalRouteFrame(original,frozenCursor);
    assert.equal(result.frame,original);
    assert.equal(result.movedX,0);
  }
});

test("UX15-C3A1: rebasing keeps relative hit range, projectile collision and target vectors unchanged",()=>{
  const frame=createPhysicalRouteFrame(createRouteCursor("combat"));
  const player={x:1875,y:400,hp:88};
  const enemy={x:1905,y:411,hp:15};
  const shot={x:1903,y:412,damage:12};
  const reward={x:1882,y:403,amount:10};
  const camera={x:1510,y:220};
  const beforeHit=localRouteDistanceSquared(enemy,shot);
  const beforePickup=localRouteDistanceSquared(player,reward);
  const beforeScreen={x:player.x-camera.x,y:player.y-camera.y};
  const delta=planRouteOriginShift(frame,player.x);
  assert.equal(delta,1024);
  const shiftedPlayer=shiftRouteLocalPoint(player,delta!);
  const shiftedEnemy=shiftRouteLocalPoint(enemy,delta!);
  const shiftedShot=shiftRouteLocalPoint(shot,delta!);
  const shiftedReward=shiftRouteLocalPoint(reward,delta!);
  const shiftedCamera=shiftRouteLocalPoint(camera,delta!);
  close(localRouteDistanceSquared(shiftedEnemy,shiftedShot),beforeHit);
  close(localRouteDistanceSquared(shiftedPlayer,shiftedReward),beforePickup);
  close(shiftedPlayer.x-shiftedCamera.x,beforeScreen.x);
  close(shiftedPlayer.y-shiftedCamera.y,beforeScreen.y);
  assert.equal(shiftedPlayer.hp,88);
  assert.equal(shiftedEnemy.hp,15);
  assert.equal(shiftedShot.damage,12);
  assert.equal(shiftedReward.amount,10);
  assert.equal(player.x,1875); // helpers never mutate the original registry
  const shift=rebasePhysicalRouteFrame(frame,delta!);
  assert.equal(shift.nextFrame.originEpoch,1);
  assert.equal(shift.nextFrame.originOffsetX,delta);
  assert.equal(shift.nextFrame.cursor,frame.cursor);
  assert.ok(isSameRoutePhysicalIdentity(frame,shift.nextFrame));
});

test("UX15-C3A1: 30 ORBI + enemies + bullets + loot pass 20 deterministic rebases without relative drift",()=>{
  let frame=createPhysicalRouteFrame(createRouteCursor("swarm"));
  let leader={x:1600,y:450,id:"ENERGY"};
  let camera={x:1150,y:250};
  let actors=Array.from({length:30},(_,i)=>({
    x:leader.x+Math.cos(i*Math.PI/15)*148,
    y:leader.y+Math.sin(i*Math.PI/15)*148,
    targetX:leader.x+(i-15)*4,
    id:`ORBI-${i}`,
  }));
  const enemy={x:leader.x+215,y:leader.y+37,id:"enemy"};
  const bullet={x:enemy.x-7,y:enemy.y+2,id:"shot"};
  const loot={x:leader.x+18,y:leader.y-13,id:"loot"};
  let enemyPoint=enemy;
  let bulletPoint=bullet;
  let lootPoint=loot;
  const relative=actors.map(a=>a.x-leader.x);
  for(let n=0;n<20;n++){
    const shift=planRouteOriginShift(frame,leader.x);
    assert.notEqual(shift,null);
    frame=rebasePhysicalRouteFrame(frame,shift!).nextFrame;
    leader=shiftRouteLocalPoint(leader,shift!);
    camera=shiftRouteLocalPoint(camera,shift!);
    actors=shiftRouteLocalPoints(actors,shift!).map(a=>({
      ...a,targetX:a.targetX-shift!,
    }));
    enemyPoint=shiftRouteLocalPoint(enemyPoint,shift!);
    bulletPoint=shiftRouteLocalPoint(bulletPoint,shift!);
    lootPoint=shiftRouteLocalPoint(lootPoint,shift!);
    for(let i=0;i<30;i++){
      close(actors[i].x-leader.x,relative[i]);
      assert.equal(actors[i].id,`ORBI-${i}`);
    }
    close(camera.x-leader.x,-450);
    close(enemyPoint.x-bulletPoint.x,7);
    close(lootPoint.x-leader.x,18);
    close(localRouteDistanceSquared(enemyPoint,bulletPoint),53);
    // Simulated physical advance between epochs: all actors and their camera
    // translate coherently before the next rebase. This is a math fixture
    // only, NOT the live owner adapter scheduled for C3A-3.
    const physicalMove=1024;
    leader={...leader,x:leader.x+physicalMove};
    camera={...camera,x:camera.x+physicalMove};
    actors=actors.map(a=>({...a,x:a.x+physicalMove,targetX:a.targetX+physicalMove}));
    enemyPoint={...enemyPoint,x:enemyPoint.x+physicalMove};
    bulletPoint={...bulletPoint,x:bulletPoint.x+physicalMove};
    lootPoint={...lootPoint,x:lootPoint.x+physicalMove};
  }
  assert.equal(frame.originEpoch,20);
  assert.ok(Number.isFinite(frame.originOffsetX));
  assert.ok(frame.originOffsetX>0);
});

test("UX15-C3A1: fail closed on invalid ordinals, seed drift, skipped ticks, reverse time and bad shifts",()=>{
  assert.throws(()=>createPhysicalRouteFrame({
    ...createRouteCursor("bad"),segmentOrdinal:-1,
  }),RangeError);
  assert.throws(()=>createPhysicalRouteFrame({
    ...createRouteCursor("bad"),offset:5000,
  }),RangeError);
  const frame=createPhysicalRouteFrame(createRouteCursor("fixed"));
  const next=stepRouteClock(frame.cursor,50,52,active);
  assert.throws(()=>advancePhysicalRouteFrame(frame,{...next,seed:"other"}),RangeError);
  assert.throws(()=>advancePhysicalRouteFrame(frame,{...next,segmentOrdinal:5}),RangeError);
  assert.throws(()=>advancePhysicalRouteFrame(frame,{...next,offset:200}),RangeError);
  assert.throws(()=>advancePhysicalRouteFrame(frame,{...next,simulatedMs:-1}),RangeError);
  assert.throws(()=>advancePhysicalRouteFrame(frame,{...next,simulatedMs:100}),RangeError);
  assert.throws(()=>planRouteOriginShift(frame,NaN),RangeError);
  assert.throws(()=>planRouteOriginShift(frame,2000,500,501),RangeError);
  assert.throws(()=>rebasePhysicalRouteFrame(frame,0),RangeError);
  assert.throws(()=>shiftRouteLocalPoint({x:1,y:2},Infinity),RangeError);
  assert.throws(()=>localRouteDistanceSquared({x:NaN,y:0},{x:0,y:0}),RangeError);
  assert.equal(planRouteOriginShift(frame,800),null);
});
