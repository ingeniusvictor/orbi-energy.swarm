import assert from "node:assert/strict";
import test from "node:test";
import {
  nextBlackoutArchitectCollisionTraceOrdinal,
  BLACKOUT_ARCHITECT_COLLISION_TRACE_ORDINAL_AUTHORITY_CONTRACT,
} from "../../src/game/blackoutArchitectCollisionTraceOrdinal";

test("J9L-A monotonic run, physics and shot sequence transitions", () => {
  let epoch: number | null = 0;
  for (let run=1;run<=4;run++){
    epoch=nextBlackoutArchitectCollisionTraceOrdinal(epoch);
    assert.equal(epoch,run);
    let frame: number | null=0,shot: number | null=0;
    for(let n=1;n<=4;n++){
      frame=nextBlackoutArchitectCollisionTraceOrdinal(frame);
      shot=nextBlackoutArchitectCollisionTraceOrdinal(shot);
      assert.equal(frame,n);
      assert.equal(shot,n);
    }
  }
});
test("J9L-A invalid/exhausted ordinals fail closed without wrap", () => {
  for (const invalid of [null,undefined,"1",{},[],true,NaN,Infinity,-Infinity,-1,-0,0.2,Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER+1])
    assert.equal(nextBlackoutArchitectCollisionTraceOrdinal(invalid),null);
  assert.equal(nextBlackoutArchitectCollisionTraceOrdinal(0),1);
  assert.equal(nextBlackoutArchitectCollisionTraceOrdinal(Number.MAX_SAFE_INTEGER-1),Number.MAX_SAFE_INTEGER);
  assert.equal(nextBlackoutArchitectCollisionTraceOrdinal(null),null);
});
test("J9L-A freezes sole ordinal authority", () => {
  const c=BLACKOUT_ARCHITECT_COLLISION_TRACE_ORDINAL_AUTHORITY_CONTRACT;
  assert.equal(Object.isFrozen(c),true);
  assert.deepEqual(Object.entries(c).filter(([,active])=>active).map(([name])=>name),["ownsPureBoundedOrdinalSuccessorAuthority"]);
});
