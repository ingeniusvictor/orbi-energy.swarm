import assert from "node:assert/strict";
import test from "node:test";
import {
  activateConvergence, cancelConvergence, capConvergenceBossDamage, canActivateConvergence,
  CONVERGENCE_CHANNEL_MS, CONVERGENCE_COOLDOWN_MS, CONVERGENCE_FALLOFF,
  CONVERGENCE_MAX_HITS, convergenceBaseDamage, convergenceHitDamage,
  createConvergenceState, finishConvergence, isConvergenceChanneling,
  projectConvergence, selectConvergenceTargets,
} from "../../src/game/orbiConvergence";

const admission = { nowMs: 1000, waveKey: "CAMPAIGN:4", orbiCount: 8,
  resonance: 100, gameplayActive: true, overdriveActive: false, targetAvailable: true };

test("admission rejects missing ORBI, incomplete resonance, OD, no target, pause and repeat wave", () => {
  const idle = createConvergenceState();
  assert.equal(canActivateConvergence(idle, admission), true);
  for (const event of [
    { orbiCount: 7 }, { resonance: 99 }, { overdriveActive: true },
    { gameplayActive: false }, { targetAvailable: false },
  ]) assert.equal(canActivateConvergence(idle, { ...admission, ...event }), false);
  const begun = activateConvergence(idle, admission)!;
  assert.ok(begun);
  assert.equal(begun.channelUntilMs, admission.nowMs + CONVERGENCE_CHANNEL_MS);
  assert.equal(begun.cooldownUntilMs, admission.nowMs + CONVERGENCE_COOLDOWN_MS);
  assert.equal(canActivateConvergence(begun, admission), false);
  assert.equal(canActivateConvergence(cancelConvergence(begun), { ...admission, nowMs: 62000 }), false);
  assert.equal(canActivateConvergence(cancelConvergence(begun), { ...admission, waveKey: "CAMPAIGN:5", nowMs: 62000 }), true);
});
test("simulation clock, once per wave, cooldown, channel and cancellation", () => {
  const ready = activateConvergence(createConvergenceState(), admission)!;
  assert.equal(projectConvergence(ready, 1400, "CAMPAIGN:4", 8, 0, false, true, true).chargeProgress, .5);
  assert.equal(isConvergenceChanneling(ready), true);
  const done = finishConvergence(ready, 1800, {x:10,y:20}, {dx:1,dy:0});
  assert.equal(done.channelUntilMs, null);
  assert.equal(done.trail?.firedAtMs, 1800);
  assert.equal(finishConvergence(cancelConvergence(ready), 1800, {x:0,y:0}, null).trail, null);
  assert.equal(projectConvergence(done, 61000, "CAMPAIGN:5", 8, 100, false, true, true).canActivate, true);
});
test("beam finite geometry: nearest aim, width tangency, range, ordering, unique ids and cap", () => {
  const origin = {x:0,y:0};
  const enemies = [
    {id:"far",x:601,y:0,size:0}, {id:"nearest",x:100,y:0,size:5},
    {id:"side",x:200,y:22,size:11}, {id:"tangent",x:300,y:21,size:10},
    {id:"beyond",x:680,y:0,size:10}, {id:"repeat",x:400,y:0,size:6},
    {id:"repeat",x:400,y:0,size:6}, {id:"dead",x:80,y:0,size:2,isDead:true},
    {id:"zero",x:50,y:0,size:1,health:0},
    ...Array.from({length:8},(_,i)=>({id:`extra-${i}`,x:450+i*12,y:0,size:2})),
  ];
  const shot = selectConvergenceTargets(origin,enemies)!;
  assert.equal(shot.dx,1);assert.equal(shot.dy,0);
  assert.equal(shot.targets[0].id,"nearest");
  assert.ok(shot.targets.some(t=>t.id==="tangent"));
  assert.equal(shot.targets.length,CONVERGENCE_MAX_HITS);
  assert.equal(new Set(shot.targets.map(t=>t.id)).size,shot.targets.length);
  assert.ok(!shot.targets.some(t=>t.id==="beyond"||t.id==="dead"||t.id==="zero"));
  assert.equal(selectConvergenceTargets(origin,[{id:"out",x:700,y:0,size:1}]),null);
});
test("falloff 100/85/70/60/50/40, no seventh hit", () => {
  assert.equal(convergenceBaseDamage(8),32);
  assert.equal(convergenceBaseDamage(100),52);
  assert.deepEqual(CONVERGENCE_FALLOFF,[1,.85,.70,.60,.50,.40]);
  assert.equal(convergenceHitDamage(24,5),20.8);
  assert.equal(convergenceHitDamage(24,6),0);
});
test("boss cap and phase barriers cannot skip phase triggers or exceed 1.5 percent", () => {
  assert.equal(capConvergenceBossDamage(999,1000,1000,1),15);
  assert.equal(capConvergenceBossDamage(999,702,1000,1),2);
  assert.equal(capConvergenceBossDamage(999,350,1000,2),0);
  assert.equal(capConvergenceBossDamage(999,351,1000,2),1);
  assert.equal(capConvergenceBossDamage(999,1000,1000,3),15);
});
