import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {drawPyraWorld,PYRA_SECTIONS,pyraSceneAt} from "../../src/game/pyraWorld";
import {drawPyraSceneLandmarks,PYRA_LANDMARK_IDENTITIES}
  from "../../src/game/pyraWorldLandmarks";

interface DrawRecord {ops:string[];saves:number;restores:number}
function spy():{ctx:CanvasRenderingContext2D;record:DrawRecord}{
  const record:DrawRecord={ops:[],saves:0,restores:0};
  const push=(name:string)=>(...p:number[])=>{
    record.ops.push(name+":"+p.map(x=>x.toFixed(2)).join(","));
  };
  const noop=()=>{};
  const ctx={
    save:()=>{record.saves++;},
    restore:()=>{record.restores++;},
    clearRect:noop,fillRect:push("rect"),
    moveTo:push("move"),lineTo:push("line"),arc:push("arc"),
    translate:push("translate"),scale:push("scale"),
    closePath:noop,beginPath:noop,fill:noop,stroke:noop,
    createLinearGradient:()=>({addColorStop:noop}),
  } as unknown as CanvasRenderingContext2D;
  return {ctx,record};
}
test("PYRA-07B: six unique original production landmarks, not six recolors",()=>{
  const ids=Object.values(PYRA_LANDMARK_IDENTITIES);
  assert.equal(ids.length,6);
  assert.equal(new Set(ids).size,6);
  const signatures=new Set<string>();
  PYRA_SECTIONS.forEach((scene,index)=>{
    const {ctx,record}=spy();
    drawPyraWorld(ctx,2400,1440,index);
    assert.equal(pyraSceneAt(index),scene);
    assert.equal(record.saves,record.restores,"every Canvas state must restore");
    assert.ok(record.saves>3,"each landmark must draw actual geometry");
    assert.ok(record.ops.length>25,"real shapes, not just color data");
    assert.ok(record.ops.length<2200,"bounded scenery draw cost");
    const signature=record.ops.filter(x=>x.startsWith("arc:")||
       x.startsWith("line:")||x.startsWith("rect:")).join("|");
    signatures.add(signature);
  });
  assert.equal(signatures.size,6,"six landmark shapes must be distinct");
});
test("PYRA-07B: terrain is deterministic and respects reduced-motion movement",()=>{
  for(const width of [800,844,1440,1920,2400]){
    const a=spy(),b=spy();
    drawPyraWorld(a.ctx,1345,width,5);
    drawPyraWorld(b.ctx,1345,width,5);
    assert.deepEqual(a.record,b.record,"same route yields exact same frames");
    assert.equal(a.record.saves,a.record.restores);
    assert.ok(a.record.ops.length<3500,"bounded on ultra-wide");
  }
  const stationary=spy(),travelled=spy();
  drawPyraWorld(stationary.ctx,1200,1440,2);
  drawPyraWorld(travelled.ctx,1290,1440,2);
  assert.notDeepEqual(stationary.record.ops,travelled.record.ops,
    "motion follows native route distance, not a separate interval");
  assert.throws(()=>drawPyraSceneLandmarks(spy().ctx,
    "CORE_CALDERA",Number.POSITIVE_INFINITY,1440),RangeError);
  assert.throws(()=>drawPyraSceneLandmarks(spy().ctx,
    "CORE_CALDERA",10,2500),RangeError);
});
test("PYRA-07B: scenery modules own no gameplay, timers or random state",()=>{
  const fs=requireGameSource();
  for(const forbidden of ["setInterval(","setTimeout(","Math.random(",
    "new Enemy(","projectilesRef","enemiesRef","damagePlayer("])
    assert.equal(fs.includes(forbidden),false,forbidden);
});
function requireGameSource():string{
  return readFileSync(new URL("../../src/game/pyraWorldLandmarks.ts",
    import.meta.url),"utf8");
}
