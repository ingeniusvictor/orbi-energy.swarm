import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ASTERIA_PREMIUM_BLEND_SLICES,
  ASTERIA_PREMIUM_PARALLAX,
  projectAsteriaPanoramaStrip,
  paintAsteriaPanorama,
} from "../../src/game/asteriaPremiumRenderer";

const near=(a:number,b:number,epsilon=1e-6)=>
  assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
const sprite={naturalWidth:1440,naturalHeight:480} as HTMLImageElement;

test("UX15-FIX: pan goes left only across many repeated panorama boundaries",()=>{
  const w=800;
  const origin=projectAsteriaPanoramaStrip(1440,480,w,0);
  assert.equal(origin.initialX,0);
  assert.equal(origin.stride,1344);
  assert.equal(origin.overlap,96);
  assert.equal(ASTERIA_PREMIUM_PARALLAX,.12);
  const stride=origin.stride;
  // Preserve identity of one texture instance crossing a repeat boundary.
  for(const i of [1,2,3,37,100_000]){
    const before=(i*stride-1)/ASTERIA_PREMIUM_PARALLAX;
    const after=(i*stride+1)/ASTERIA_PREMIUM_PARALLAX;
    const a=projectAsteriaPanoramaStrip(1440,480,w,before);
    const b=projectAsteriaPanoramaStrip(1440,480,w,after);
    assert.equal(b.tileOrdinal,a.tileOrdinal+1);
    const sameTileLeftA=a.initialX+(i-a.tileOrdinal)*a.stride;
    const sameTileLeftB=b.initialX+(i-b.tileOrdinal)*b.stride;
    near(sameTileLeftB-sameTileLeftA,-2);
    assert.ok(a.tileCount<=5&&b.tileCount<=5);
  }
});

test("UX15-FIX: large and ultrawide viewport never invert parallax or require crop travel",()=>{
  for(const logicalWidth of [800,1024,1440,1920,2400]){
    const initial=projectAsteriaPanoramaStrip(1440,480,logicalWidth,0);
    assert.ok(initial.stride>0);
    assert.ok(initial.overlap>=48&&initial.overlap<=96);
    assert.ok(initial.tileCount<=6);
    for(const t of [0,1000,16000,250000,1e9]){
      const p=projectAsteriaPanoramaStrip(1440,480,logicalWidth,t);
      const distance=t*ASTERIA_PREMIUM_PARALLAX;
      near(p.tileOrdinal*p.stride+p.phase,distance,.0001);
      assert.ok(p.initialX<=0&&p.initialX>-p.stride);
      assert.ok(p.tileCount<=6);
    }
  }
  for(const input of [
    [0,480,800,0],[1440,0,800,0],[1440,480,799,0],
    [1440,480,2401,0],[1440,480,800,-1],
    [1440,480,800,Number.NaN],
  ])assert.throws(()=>projectAsteriaPanoramaStrip(...input as [number,number,number,number]),RangeError);
});

test("UX15-FIX: Canvas2D renderer repeats originals from right with restored alpha and no blank seam",()=>{
  const calls:{args:number[];alpha:number}[]=[];
  let alpha=.57;
  let saved=1;
  const ctx={
    get globalAlpha(){return alpha;},
    set globalAlpha(value:number){alpha=value;},
    save(){saved=alpha;},
    restore(){alpha=saved;},
    drawImage(_image:unknown,...args:number[]){calls.push({args,alpha});},
  } as unknown as CanvasRenderingContext2D;
  const old=readFileSync(new URL("../../src/game/asteriaPremiumRenderer.ts",import.meta.url),"utf8");
  assert.doesNotMatch(old,/path <= maxPan/);
  assert.doesNotMatch(old,/2 \* maxPan - path/);
  for(const phase of [0,1,70,95,96,750,1343,1344,1345]){
    calls.length=0;
    paintAsteriaPanorama(ctx,sprite,800,phase/ASTERIA_PREMIUM_PARALLAX);
    assert.equal(ctx.globalAlpha,.57);
    assert.ok(calls.length>2);
    assert.ok(calls.every(c=>c.alpha>=0&&c.alpha<=.57));
    // At a repeated edge the prior panorama supplies the pixels behind the
    // faded left edge of the newly entering tile.
    if(phase===0||phase===1344)
      assert.ok(calls.some(c=>c.args.length===4&&c.args[0]<0),
        "the previous tile must remain visible behind the seam");
    // At least one opacity-preserving opaque section must cover the center.
    assert.ok(calls.some(c=>c.alpha===.57&&c.args.length===8));
  }
  assert.equal(ASTERIA_PREMIUM_BLEND_SLICES,16);
});

test("UX15-FIX: isolated physical route speed and player movement remain untouched",()=>{
  const physical=readFileSync(new URL("../../src/game/physicalRouteQaSimulation.ts",import.meta.url),"utf8");
  const clock=readFileSync(new URL("../../src/game/worldRouteClock.ts",import.meta.url),"utf8");
  assert.match(physical,/x:state\.player\.x\+advancement\.movedX\+/);
  assert.match(clock,/offset = cursor\.offset \+ dt \* speedUnitsPerSecond \/ 1000/);
});
