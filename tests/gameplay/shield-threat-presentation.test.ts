import assert from "node:assert/strict";
import test from "node:test";
import { projectShieldThreat } from "../../src/game/shieldThreatPresentation";

test("UX14 four exclusive shield bands at exact boundaries",()=>{
 const cases=[
  [100,"STABLE","#20d981"],[70,"STABLE","#20d981"],[69.9,"CAUTION","#22d3ee"],
  [50,"CAUTION","#22d3ee"],[49.9,"DANGER","#fb923c"],
  [25,"DANGER","#fb923c"],[24.9,"CRITICAL","#ef4444"],
  [0,"CRITICAL","#ef4444"],[-50,"CRITICAL","#ef4444"],
  [180,"STABLE","#20d981"],
 ] as const;
 for(const [val,band,fill] of cases){
   const x=projectShieldThreat(val,100);
   assert.equal(x.band,band,"shield="+val);
   assert.equal(x.fill,fill);
   assert.ok(x.percent>=0&&x.percent<=100);
 }
});

test("UX14 shield projection depends on upgraded max, never fixed 100HP",()=>{
 assert.equal(projectShieldThreat(100,200).band,"CAUTION");
 assert.equal(projectShieldThreat(50,200).band,"DANGER");
 assert.equal(projectShieldThreat(140,200).band,"STABLE");
 assert.equal(projectShieldThreat(Number.NaN,0).percent,0);
 assert.equal(projectShieldThreat(99,Number.NaN).band,"STABLE");
});
