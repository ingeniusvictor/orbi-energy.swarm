import assert from "node:assert/strict";
import test from "node:test";
import {
  ROUTE_PHYSICAL_CAMERA_ANCHOR_X,
  ROUTE_PHYSICAL_MAX_ZOOM,
  ROUTE_PHYSICAL_MIN_ZOOM,
  screenToRouteLocal,
  routeLocalToScreen,
  stepRoutePhysicalCamera,
  shiftRoutePhysicalCamera,
} from "../../src/game/routePhysicalCamera";
import { shiftRouteLocalPoint } from "../../src/game/physicalRouteSpace";
import { projectPanoramicCanvasViewport } from "../../src/game/panoramicCanvasViewport";

const approx=(actual:number,expected:number,tolerance=1e-6):void=>{
  assert.ok(Math.abs(actual-expected)<tolerance,
    `expected ${actual} to be near ${expected}`);
};

test("UX15-C3A1: camera permits unbounded horizontal travel; screen anchor remains coherent",()=>{
  const width=1400,zoom=0.92,height=480;
  const player={x:1_000_000_123,y:480};
  const exact={
    localX:player.x-width*ROUTE_PHYSICAL_CAMERA_ANCHOR_X/zoom,
    localY:player.y-height/(2*zoom),
  };
  const projected=stepRoutePhysicalCamera(exact,player,{width,height,zoom},50);
  approx(projected.camera.localX,exact.localX,1e-7);
  approx(projected.playerScreenX,width*ROUTE_PHYSICAL_CAMERA_ANCHOR_X,1e-6);
  approx(projected.playerScreenY,height/2,1e-6);
  assert.ok(projected.visibleLocalRight>1_000_000_000);
  assert.ok(projected.camera.localX>1600); // no legacy 1600x960 X clamp
});

test("UX15-C3A1: screen-space round trips preserve equal X/Y units in widescreen and portrait",()=>{
  for(const screenSize of [
    {width:800,height:480},{width:1440,height:480},
    {width:1920,height:480},{width:390,height:844},
  ]){
    for(const zoom of [ROUTE_PHYSICAL_MIN_ZOOM,0.92,1,ROUTE_PHYSICAL_MAX_ZOOM]){
      const view={...screenSize,zoom};
      const camera={localX:-347,localY:218};
      const player={x:camera.localX+243,y:camera.localY+179};
      const screen=routeLocalToScreen(player,camera,view);
      const local=screenToRouteLocal(screen,camera,view);
      approx(local.x,player.x);
      approx(local.y,player.y);
      const moved={x:player.x+20,y:player.y+20};
      const mapped=routeLocalToScreen(moved,camera,view);
      approx(mapped.x-screen.x,20*zoom);
      approx(mapped.y-screen.y,20*zoom);
    }
  }
});

test("UX15-C3A1: projected panoramic canvas sizes do not stretch route physics",()=>{
  for(const viewport of [
    {width:1920,height:1080},{width:844,height:390},
    {width:1440,height:900},{width:390,height:844},
  ]){
    const projected=projectPanoramicCanvasViewport({...viewport,immersive:true});
    const ratio=projected.width/projected.height;
    assert.ok(Number.isFinite(ratio)&&ratio>0);
    const cam={localX:725,localY:150};
    const view={...projected,zoom:1};
    const center=routeLocalToScreen({x:985,y:390},cam,view);
    const east=routeLocalToScreen({x:1085,y:390},cam,view);
    const south=routeLocalToScreen({x:985,y:490},cam,view);
    assert.equal(east.x-center.x,100);
    assert.equal(south.y-center.y,100);
  }
});

test("UX15-C3A1: camera smoothing uses simulated delta and FREEZES at zero milliseconds",()=>{
  const view={width:1200,height:480,zoom:1};
  const oldCamera={localX:0,localY:0};
  const player={x:2300,y:480};
  const frozen=stepRoutePhysicalCamera(oldCamera,player,view,0);
  assert.deepEqual(frozen.camera,oldCamera);
  let moving=oldCamera;
  for(let i=0;i<40;i++)moving=stepRoutePhysicalCamera(moving,player,view,50).camera;
  const targetX=player.x-view.width*ROUTE_PHYSICAL_CAMERA_ANCHOR_X;
  approx(moving.localX,targetX,0.001);
  approx(moving.localY,240,0.001);
});

test("UX15-C3A1: camera vertical bounds remain safe while X stays free",()=>{
  const view={width:800,height:480,zoom:1};
  const cases=[
    {player:{x:-10000,y:-50},limitY:0},
    {player:{x:200000,y:10000},limitY:480},
  ];
  for(const t of cases){
    const initial={localX:0,localY:t.limitY};
    let camera=initial;
    for(let i=0;i<100;i++)
      camera=stepRoutePhysicalCamera(camera,t.player,view,50).camera;
    approx(camera.localY,t.limitY);
    assert.ok(Math.abs(camera.localX)>0);
  }
});

test("UX15-C3A1: rebase player + camera produces exactly same screen point and pointer hit",()=>{
  const camera={localX:999_700,localY:80};
  const view={width:1600,height:480,zoom:.85};
  const player={x:1_000_300,y:420};
  const pointer={x:1_000_240,y:390};
  const before=routeLocalToScreen(player,camera,view);
  const pointerScreen=routeLocalToScreen(pointer,camera,view);
  for(const delta of [512,1024,-512,131072]){
    const shiftedCamera=shiftRoutePhysicalCamera(camera,delta);
    const shiftedPlayer=shiftRouteLocalPoint(player,delta);
    const shiftedPointer=shiftRouteLocalPoint(pointer,delta);
    const after=routeLocalToScreen(shiftedPlayer,shiftedCamera,view);
    const afterPointer=screenToRouteLocal(pointerScreen,shiftedCamera,view);
    approx(after.x,before.x);
    approx(after.y,before.y);
    approx(afterPointer.x,shiftedPointer.x);
    approx(afterPointer.y,shiftedPointer.y);
  }
});

test("UX15-C3A1: invalid viewport, zoom, dt or camera cannot drive unsafe physics",()=>{
  const point={x:800,y:480};
  const cam={localX:200,localY:240};
  const view={width:800,height:480,zoom:1};
  for(const zoom of [0,.69,1.09,NaN,Infinity]){
    assert.throws(()=>routeLocalToScreen(point,cam,{...view,zoom}),RangeError);
  }
  assert.throws(()=>routeLocalToScreen(point,cam,{...view,width:0}),RangeError);
  assert.throws(()=>screenToRouteLocal({x:NaN,y:20},cam,view),RangeError);
  assert.throws(()=>stepRoutePhysicalCamera(cam,point,view,-1),RangeError);
  assert.throws(()=>stepRoutePhysicalCamera(cam,point,view,80),RangeError);
  assert.throws(()=>stepRoutePhysicalCamera(cam,point,view,50,{anchorX:1}),RangeError);
  assert.throws(()=>shiftRoutePhysicalCamera(cam,Infinity),RangeError);
});
