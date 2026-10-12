import assert from "node:assert/strict";
import test from "node:test";

import {
  OVERDRIVE_DURATION_MS,
  OVERDRIVE_REENTRY_LOCK_MS,
  activateCombatOverdrive,
  advanceCombatOverdrive,
  createCombatOverdriveState,
  projectCombatOverdrive,
  resetCombatOverdriveState,
} from "../../src/game/combatOverdrive.ts";

test("Overdrive starts idle, unlocked and deterministic", () => {
  const state = createCombatOverdriveState();
  assert.deepEqual(state, {
    active: false,
    activatedAtMs: null,
    endsAtMs: null,
    reentryAllowedAtMs: 0,
  });
  assert.deepEqual(projectCombatOverdrive(state, 0, false), {
    active: false,
    canActivate: false,
    remainingMs: 0,
    remainingRatio: 0,
    reentryLocked: false,
    reentryRemainingMs: 0,
  });
  assert.equal(projectCombatOverdrive(state, 0, true).canActivate, true);
});

test("activation requires Resonance readiness and consumes readiness exactly once", () => {
  const initial = createCombatOverdriveState();
  const rejected = activateCombatOverdrive(initial, {
    occurredAtMs: 1_000,
    overdriveReady: false,
  });
  assert.equal(rejected.activated, false);
  assert.equal(rejected.consumeResonance, false);
  assert.deepEqual(rejected.state, initial);

  const accepted = activateCombatOverdrive(initial, {
    occurredAtMs: 1_000,
    overdriveReady: true,
  });
  assert.equal(accepted.activated, true);
  assert.equal(accepted.consumeResonance, true);
  assert.equal(accepted.state.active, true);
  assert.equal(accepted.state.activatedAtMs, 1_000);
  assert.equal(accepted.state.endsAtMs, 1_000 + OVERDRIVE_DURATION_MS);
  assert.equal(
    accepted.state.reentryAllowedAtMs,
    1_000 + OVERDRIVE_DURATION_MS + OVERDRIVE_REENTRY_LOCK_MS,
  );
  assert.equal(accepted.projection.remainingMs, OVERDRIVE_DURATION_MS);
  assert.equal(accepted.projection.remainingRatio, 1);
});

test("repeated activation while active never stacks, refreshes or extends the window", () => {
  const first = activateCombatOverdrive(createCombatOverdriveState(), {
    occurredAtMs: 500,
    overdriveReady: true,
  });
  const second = activateCombatOverdrive(first.state, {
    occurredAtMs: 2_000,
    overdriveReady: true,
  });

  assert.equal(second.activated, false);
  assert.equal(second.consumeResonance, false);
  assert.deepEqual(second.state, first.state);
  assert.equal(second.state.endsAtMs, 500 + OVERDRIVE_DURATION_MS);
  assert.equal(
    second.state.reentryAllowedAtMs,
    500 + OVERDRIVE_DURATION_MS + OVERDRIVE_REENTRY_LOCK_MS,
  );
});

test("projection exposes bounded simulation-time progress without mutating state", () => {
  const activation = activateCombatOverdrive(createCombatOverdriveState(), {
    occurredAtMs: 0,
    overdriveReady: true,
  });
  const snapshot = { ...activation.state };
  const halfway = projectCombatOverdrive(
    activation.state,
    OVERDRIVE_DURATION_MS / 2,
    false,
  );

  assert.equal(halfway.active, true);
  assert.equal(halfway.remainingMs, OVERDRIVE_DURATION_MS / 2);
  assert.equal(halfway.remainingRatio, 0.5);
  assert.equal(halfway.reentryLocked, false);
  assert.equal(halfway.reentryRemainingMs, 0);
  assert.deepEqual(activation.state, snapshot);
});

test("Overdrive expires exactly at the duration boundary", () => {
  const activation = activateCombatOverdrive(createCombatOverdriveState(), {
    occurredAtMs: 3_000,
    overdriveReady: true,
  });
  const lastActive = advanceCombatOverdrive(
    activation.state,
    3_000 + OVERDRIVE_DURATION_MS - 1,
  );
  assert.equal(lastActive.active, true);

  const expired = advanceCombatOverdrive(
    activation.state,
    3_000 + OVERDRIVE_DURATION_MS,
  );
  assert.deepEqual(expired, {
    active: false,
    activatedAtMs: null,
    endsAtMs: null,
    reentryAllowedAtMs:
      3_000 + OVERDRIVE_DURATION_MS + OVERDRIVE_REENTRY_LOCK_MS,
  });

  const projection = projectCombatOverdrive(
    activation.state,
    3_000 + OVERDRIVE_DURATION_MS,
    true,
  );
  assert.equal(projection.active, false);
  assert.equal(projection.canActivate, false);
  assert.equal(projection.reentryLocked, true);
  assert.equal(projection.reentryRemainingMs, OVERDRIVE_REENTRY_LOCK_MS);
});

test("post-Overdrive lock rejects early re-entry without consuming Resonance", () => {
  const activation = activateCombatOverdrive(createCombatOverdriveState(), {
    occurredAtMs: 0,
    overdriveReady: true,
  });
  const attemptedAt =
    OVERDRIVE_DURATION_MS + OVERDRIVE_REENTRY_LOCK_MS - 1;
  const result = activateCombatOverdrive(activation.state, {
    occurredAtMs: attemptedAt,
    overdriveReady: true,
  });

  assert.equal(result.state.active, false);
  assert.equal(result.activated, false);
  assert.equal(result.consumeResonance, false);
  assert.equal(result.projection.reentryLocked, true);
  assert.equal(result.projection.reentryRemainingMs, 1);
});

test("exact re-entry boundary allows a newly-earned activation", () => {
  const first = activateCombatOverdrive(createCombatOverdriveState(), {
    occurredAtMs: 0,
    overdriveReady: true,
  });
  const boundary = OVERDRIVE_DURATION_MS + OVERDRIVE_REENTRY_LOCK_MS;
  const projection = projectCombatOverdrive(first.state, boundary, true);
  assert.equal(projection.reentryLocked, false);
  assert.equal(projection.reentryRemainingMs, 0);
  assert.equal(projection.canActivate, true);

  const second = activateCombatOverdrive(first.state, {
    occurredAtMs: boundary,
    overdriveReady: true,
  });
  assert.equal(second.activated, true);
  assert.equal(second.consumeResonance, true);
  assert.equal(second.state.activatedAtMs, boundary);
  assert.equal(second.state.endsAtMs, boundary + OVERDRIVE_DURATION_MS);
});

test("reset returns the exact fresh-run Overdrive state", () => {
  const active = activateCombatOverdrive(createCombatOverdriveState(), {
    occurredAtMs: 10,
    overdriveReady: true,
  }).state;
  assert.equal(active.active, true);
  assert.deepEqual(resetCombatOverdriveState(), createCombatOverdriveState());
});

test("invalid simulation times fail closed", () => {
  const state = createCombatOverdriveState();
  for (const invalid of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => advanceCombatOverdrive(state, invalid));
    assert.throws(() => projectCombatOverdrive(state, invalid, true));
    assert.throws(() =>
      activateCombatOverdrive(state, {
        occurredAtMs: invalid,
        overdriveReady: true,
      }),
    );
  }
});

test("all public transitions preserve caller-owned state", () => {
  const initial = Object.freeze(createCombatOverdriveState());
  const activation = activateCombatOverdrive(initial, {
    occurredAtMs: 100,
    overdriveReady: true,
  });
  assert.deepEqual(initial, createCombatOverdriveState());

  const activeSnapshot = { ...activation.state };
  advanceCombatOverdrive(activation.state, 101);
  projectCombatOverdrive(activation.state, 101, false);
  assert.deepEqual(activation.state, activeSnapshot);
});
