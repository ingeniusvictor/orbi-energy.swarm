import assert from "node:assert/strict";
import test from "node:test";
import {
  ASTERIA_SECTION_DEFS, ASTERIA_WORLD_ID, createAsteriaSegment,
  createRouteCursor, getRouteWindow, projectRouteDistance,
  stableRouteHash, validateRouteSegment,
} from "../../src/game/worldRouteCore";
import {
  canAdvanceRoute, ROUTE_MAX_STEP_MS, stepRouteClock,
  type RouteRunGates,
} from "../../src/game/worldRouteClock";
import { projectRoutePreviewCamera, stepRoutePreviewPlayer } from "../../src/game/worldRouteCamera";

const gates: RouteRunGates = { playing:true, paused:false, hidden:false,
  modalOpen:false, upgradeOpen:false, hitstop:false };

test("UX15-B: ASTERIA six-section visual layout has stable canonical 100% weights and no active combat", () => {
  assert.equal(ASTERIA_WORLD_ID,"ASTERIA_ORBITAL");
  assert.equal(ASTERIA_SECTION_DEFS.length,6);
  assert.equal(ASTERIA_SECTION_DEFS.reduce((s,x)=>s+x.weight,0),100);
  const segments=ASTERIA_SECTION_DEFS.map((_,i)=>createAsteriaSegment(i,"mission-1"));
  assert.deepEqual(segments.map(s=>s.kind),ASTERIA_SECTION_DEFS.map(s=>s.id));
  assert.ok(segments.every(validateRouteSegment));
  assert.ok(segments.every(s=>!s.combatEncounterEnabled&&!s.collisionEnabled));
  assert.ok(segments.every(s=>s.safeEnvelope.maxY-s.safeEnvelope.minY>=390));
  assert.equal(segments.reduce((s,x)=>s+x.length,0),5000);
});

test("UX15-B: seed/ordinal determinism never consumes global Math.random", () => {
  const before=Math.random;
  const first=Array.from({length:24},(_,i)=>createAsteriaSegment(i,"seed-A"));
  const second=Array.from({length:24},(_,i)=>createAsteriaSegment(i,"seed-A"));
  assert.deepEqual(first,second);
  assert.equal(Math.random,before);
  assert.equal(stableRouteHash("same"),stableRouteHash("same"));
  assert.ok(first.every((segment,i)=>segment.ordinal===i));
  assert.notDeepEqual(
    Array.from({length:24},(_,i)=>createAsteriaSegment(i,"seed-B")).map(x=>x.decorationVariant),
    first.map(x=>x.decorationVariant));
});

test("UX15-B: segment window geometry connects exactly and unloads previous segments", () => {
  for (const ordinal of [0,1,5,6,99,10000]) {
    const length=createAsteriaSegment(ordinal,"atlas").length;
    const cur={...createRouteCursor("atlas"),segmentOrdinal:ordinal,offset:length*.55};
    const visible=getRouteWindow(cur);
    assert.ok(visible.length>=3&&visible.length<=4);
    for(let i=0;i<visible.length-1;i++)
      assert.ok(Math.abs(visible[i].endRelative-visible[i+1].startRelative)<1e-8);
    assert.ok(Math.abs((visible.find(s=>s.segment.ordinal===ordinal)?.startRelative??NaN)+cur.offset)<1e-8);
    assert.ok(visible.every(x=>x.segment.ordinal>=ordinal-1&&x.segment.ordinal<=ordinal+2));
  }
});

test("UX15-B: route clock crosses boundaries without gaps and no physical absolute position storage", () => {
  let cur=createRouteCursor("sim");
  for(let i=0;i<2000;i++){
    const next=stepRouteClock(cur,16.666,160,gates);
    assert.ok(next.simulatedMs>cur.simulatedMs);
    assert.ok(projectRouteDistance(next)>=projectRouteDistance(cur));
    assert.ok(next.offset>=0&&next.offset<createAsteriaSegment(next.segmentOrdinal,cur.seed).length);
    cur=next;
  }
  assert.ok(cur.segmentOrdinal>0);
  assert.ok(!("worldX" in cur)||!("absoluteX" in cur));
});

test("UX15-B: pause/modal/hidden/upgrade/hitstop gates independently freeze route distance and time", () => {
  const cur={...createRouteCursor(),offset:250,simulatedMs:100};
  for(const blocked of [
    {...gates,playing:false},{...gates,paused:true},{...gates,hidden:true},
    {...gates,modalOpen:true},{...gates,upgradeOpen:true},{...gates,hitstop:true},
  ]){
    assert.equal(canAdvanceRoute(blocked),false);
    assert.equal(stepRouteClock(cur,50,100,blocked),cur);
  }
  assert.equal(canAdvanceRoute(gates),true);
  const next=stepRouteClock(cur,10000,100,gates);
  assert.equal(next.simulatedMs,cur.simulatedMs+ROUTE_MAX_STEP_MS);
  assert.equal(projectRouteDistance(next)-projectRouteDistance(cur),5);
});

test("UX15-B: invalid inputs and segment index overflow fail safe", () => {
  assert.throws(()=>createAsteriaSegment(-1,"s"),RangeError);
  assert.throws(()=>createAsteriaSegment(1,""),RangeError);
  assert.throws(()=>createAsteriaSegment(NaN,"s"),RangeError);
  assert.throws(()=>getRouteWindow({...createRouteCursor(),offset:999999}),RangeError);
  assert.throws(()=>getRouteWindow(createRouteCursor(),5,2),RangeError);
  assert.throws(()=>stepRouteClock(createRouteCursor(),NaN,50,gates),RangeError);
  assert.throws(()=>stepRouteClock(createRouteCursor(),10,-1,gates),RangeError);
  assert.throws(()=>stepRouteClock(createRouteCursor(),10,300,gates),RangeError);
});

test("UX15-B: local segment+offset remains stable at huge ordinals; camera never uses huge worldX", () => {
  const ordinal=1_000_000_000;
  const cur={...createRouteCursor("infinite"),segmentOrdinal:ordinal,offset:1};
  const visible=getRouteWindow(cur);
  assert.equal(visible.length,4);
  assert.ok(visible.every(x=>Number.isFinite(x.startRelative)&&Math.abs(x.startRelative)<3000));
  const advanced=stepRouteClock(cur,50,240,gates);
  assert.equal(advanced.segmentOrdinal,ordinal);
  assert.equal(advanced.offset,13);
});

test("UX15-B: preview camera preserves XY freedom with same units in both axes, all zooms and wide layouts", () => {
  for(const width of [800,1100,1600]){
    for(const zoom of [.7,1,1.08]){
      const cam=projectRoutePreviewCamera({manualX:40,y:275},{width,height:480,zoom});
      assert.ok(Math.abs(cam.playerScreenX-cam.anchorScreenX-40*zoom)<1e-8);
      assert.ok(Math.abs(cam.playerScreenY-240-35*zoom)<1e-8);
      assert.ok(cam.visibleWorldRight>0&&cam.visibleWorldLeft<0);
    }
  }
  assert.throws(()=>projectRoutePreviewCamera({manualX:0,y:240},{width:800,height:480,zoom:2}),RangeError);
});

test("UX15-B: QA marker movement is optional, 2D, clamped, diagonally normalized and frozen on pause", () => {
  const p={manualX:0,y:240};
  const wide={width:800,height:480};
  assert.deepEqual(stepRoutePreviewPlayer(p,{x:0,y:0},16,wide,true),p);
  assert.equal(stepRoutePreviewPlayer(p,{x:1,y:0},50,wide,false),p);
  const right=stepRoutePreviewPlayer(p,{x:1,y:0},50,wide,true);
  assert.ok(right.manualX>0&&right.y===240);
  const diagonal=stepRoutePreviewPlayer(p,{x:1,y:1},50,wide,true);
  assert.ok(Math.hypot(diagonal.manualX,diagonal.y-240)<=8.51);
  let edge=p;
  for(let i=0;i<1000;i++)edge=stepRoutePreviewPlayer(edge,{x:1,y:-1},50,wide,true);
  assert.ok(edge.manualX<=wide.width*.28&&edge.y>=35);
  assert.equal(stepRoutePreviewPlayer(edge,{x:1,y:1},100,wide,false),edge);
});

test("UX15-B: round-trip start/stop/reset and independent sector contract", () => {
  let cursor=createRouteCursor("fixed");
  const original=cursor;
  for(let i=0;i<100;i++) cursor=stepRouteClock(cursor,50,52,gates);
  const paused=stepRouteClock(cursor,500,52,{...gates,paused:true});
  assert.equal(cursor,paused);
  assert.ok(projectRouteDistance(cursor)>0);
  assert.deepEqual(createRouteCursor("fixed"),original);
  assert.equal(cursor.worldId,ASTERIA_WORLD_ID);
  // Segment ordinal tracks scenery, never declares campaign sector or rewards.
  assert.ok(!("sector" in cursor));
  assert.ok(!("wave" in cursor));
});
