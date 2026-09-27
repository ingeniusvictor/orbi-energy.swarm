import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceInfiniteSession,
  createInfiniteSession,
  endInfiniteSession,
  getCurrentInfiniteExecutionPlan,
  validateInfiniteSession,
} from "../src/game/infiniteSession.ts";

const NEUTRAL = {
  swarmStrength: 0.5,
  shieldIntegrity: 0.5,
  buildPower: 0.5,
  recentDamagePressure: 0.5,
  recentClearEfficiency: 0.5,
};

const STRONG = {
  swarmStrength: 1,
  shieldIntegrity: 1,
  buildPower: 1,
  recentDamagePressure: 0,
  recentClearEfficiency: 1,
};

test("infinite session starts at Sector 11 wave 1 with a certified plan", () => {
  const session = createInfiniteSession("session-cert", NEUTRAL);

  assert.equal(session.currentSector, 11);
  assert.equal(session.currentWaveNumber, 1);
  assert.equal(session.sectorsCompleted, 0);
  assert.equal(session.wavesCompleted, 0);
  assert.equal(session.status, "ACTIVE");
  assert.deepEqual(validateInfiniteSession(session), {
    valid: true,
    errors: [],
  });

  const execution = getCurrentInfiniteExecutionPlan(session);
  assert.equal(execution.sector, 11);
  assert.equal(execution.waveIndex, 1);
});

test("advancing within a sector preserves the current certified plan", () => {
  const session = createInfiniteSession("intra-sector", NEUTRAL);
  const initialPlan = session.currentPlan;
  const next = advanceInfiniteSession(session, STRONG);

  assert.equal(next.currentSector, 11);
  assert.equal(next.currentWaveNumber, 2);
  assert.equal(next.currentPlan, initialPlan);
  assert.deepEqual(next.context, session.context);
  assert.equal(next.wavesCompleted, 1);
});

test("clearing the final wave advances exactly one sector and rebuilds from new context", () => {
  let session = createInfiniteSession("sector-rollover", NEUTRAL);
  const initialWaveCount = session.currentPlan.executionPlans.length;

  while (session.currentWaveNumber < initialWaveCount) {
    session = advanceInfiniteSession(session, STRONG);
  }

  const next = advanceInfiniteSession(session, STRONG);

  assert.equal(next.currentSector, 12);
  assert.equal(next.currentWaveNumber, 1);
  assert.equal(next.sectorsCompleted, 1);
  assert.equal(next.wavesCompleted, initialWaveCount);
  assert.equal(
    next.currentPlan.certification.pressureDelta,
    0.08,
  );
  assert.notDeepEqual(next.context, session.context);
  assert.deepEqual(validateInfiniteSession(next), {
    valid: true,
    errors: [],
  });
});

test("same seed and context produce the same session sequence", () => {
  let a = createInfiniteSession("deterministic-session", NEUTRAL);
  let b = createInfiniteSession("deterministic-session", NEUTRAL);

  for (let step = 0; step < 50; step += 1) {
    assert.deepEqual(a, b);
    a = advanceInfiniteSession(a, NEUTRAL);
    b = advanceInfiniteSession(b, NEUTRAL);
  }

  assert.deepEqual(a, b);
});

test("ended sessions cannot advance", () => {
  const active = createInfiniteSession("end-state", NEUTRAL);
  const defeated = endInfiniteSession(active, "DEFEATED");
  const exited = endInfiniteSession(active, "EXITED");

  assert.equal(defeated.status, "DEFEATED");
  assert.equal(exited.status, "EXITED");
  assert.throws(
    () => advanceInfiniteSession(defeated),
    RangeError,
  );
  assert.throws(
    () => advanceInfiniteSession(exited),
    RangeError,
  );
});

test("session progression remains valid from Sector 11 through Sector 1000", () => {
  let session = createInfiniteSession(
    "session-range-cert",
    NEUTRAL,
  );

  while (session.currentSector < 1000) {
    assert.deepEqual(validateInfiniteSession(session), {
      valid: true,
      errors: [],
    });

    const current = getCurrentInfiniteExecutionPlan(session);
    assert.equal(current.sector, session.currentSector);
    assert.equal(current.waveIndex, session.currentWaveNumber);

    session = advanceInfiniteSession(session, NEUTRAL);
  }

  assert.equal(session.currentSector, 1000);
  assert.equal(session.sectorsCompleted, 989);
  assert.deepEqual(validateInfiniteSession(session), {
    valid: true,
    errors: [],
  });
});

test("validation rejects a corrupted wave cursor", () => {
  const session = createInfiniteSession("invalid-session", NEUTRAL);
  const invalid = {
    ...session,
    currentWaveNumber: 999,
  };

  const validation = validateInfiniteSession(invalid);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes("currentWaveNumber"));
});
