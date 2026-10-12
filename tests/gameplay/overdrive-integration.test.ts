import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_RESONANCE,
  applyCombatResonanceDamageBreak,
  createCombatResonanceState,
  projectCombatResonance,
  registerCombatResonanceDefeat,
} from "../../src/game/combatResonance.ts";
import {
  OVERDRIVE_DURATION_MS,
  OVERDRIVE_REENTRY_LOCK_MS,
  activateCombatOverdrive,
  advanceCombatOverdrive,
  createCombatOverdriveState,
  projectCombatOverdrive,
} from "../../src/game/combatOverdrive.ts";
import {
  MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
  OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
  projectCombatOverdriveEffects,
} from "../../src/game/combatOverdriveEffects.ts";
import {
  MAX_OVERDRIVE_PRESENTATION_RINGS,
  projectCombatOverdrivePresentation,
} from "../../src/game/combatOverdrivePresentation.ts";
import { QualityPreset } from "../../src/game/types.ts";

const affinityCycle = [
  "solar",
  "hydro",
  "wind",
  "thermal",
  "magnetic",
  "quantum",
] as const;

const earnOverdriveReady = () => {
  let resonance = createCombatResonanceState();
  let nowMs = 0;
  let lastAwardedScore = 0;

  for (let index = 0; index < 100; index += 1) {
    const result = registerCombatResonanceDefeat(resonance, {
      occurredAtMs: nowMs,
      baseScore: 100,
      affinity: affinityCycle[index % affinityCycle.length],
      isElite: index % 9 === 0,
      isBoss: false,
    });
    resonance = result.state;
    lastAwardedScore = result.awardedScore;
    if (result.projection.overdriveReady) {
      return { resonance, nowMs, lastAwardedScore };
    }
    nowMs += 150;
  }

  throw new Error("Deterministic fixture failed to earn Overdrive readiness.");
};

test("J1 readiness activates J2 once and projects bounded damage/presentation without extra score authority", () => {
  const earned = earnOverdriveReady();
  const readyProjection = projectCombatResonance(earned.resonance);
  assert.equal(earned.resonance.resonance, MAX_RESONANCE);
  assert.equal(readyProjection.overdriveReady, true);
  assert.ok(readyProjection.scoreMultiplier <= 2);
  assert.equal(
    earned.lastAwardedScore,
    Math.round(100 * readyProjection.scoreMultiplier),
  );

  const initialOverdrive = createCombatOverdriveState();
  const activation = activateCombatOverdrive(initialOverdrive, {
    occurredAtMs: earned.nowMs,
    overdriveReady: readyProjection.overdriveReady,
  });

  assert.equal(activation.activated, true);
  assert.equal(activation.consumeResonance, true);
  assert.equal(activation.projection.active, true);

  const consumedResonance = {
    ...earned.resonance,
    resonance: 0,
  };
  const postConsumeScoreProjection = projectCombatResonance(consumedResonance);
  assert.equal(postConsumeScoreProjection.overdriveReady, false);
  assert.ok(postConsumeScoreProjection.scoreMultiplier <= 2);

  const effects = projectCombatOverdriveEffects(activation.projection);
  assert.equal(
    effects.playerDamageMultiplier,
    OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
  );
  assert.ok(
    effects.playerDamageMultiplier <= MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
  );

  const presentation = projectCombatOverdrivePresentation({
    active: activation.projection.active,
    remainingRatio: activation.projection.remainingRatio,
    qualityPreset: QualityPreset.HIGH,
  });
  assert.equal(presentation.active, true);
  assert.ok(presentation.ringCount <= MAX_OVERDRIVE_PRESENTATION_RINGS);
  assert.ok(presentation.overlayAlpha >= 0 && presentation.overlayAlpha <= 1);
  assert.ok(
    presentation.swarmHaloAlpha >= 0 && presentation.swarmHaloAlpha <= 1,
  );

  // J2 combat/presentation projections never accept or return score state.
  assert.equal("scoreMultiplier" in effects, false);
  assert.equal("scoreMultiplier" in presentation, false);
});

test("Overdrive cannot stack or refresh and honors exact expiry/re-entry boundaries", () => {
  const activationAtMs = 2_000;
  const first = activateCombatOverdrive(createCombatOverdriveState(), {
    occurredAtMs: activationAtMs,
    overdriveReady: true,
  });
  assert.equal(first.activated, true);

  const repeated = activateCombatOverdrive(first.state, {
    occurredAtMs: activationAtMs + 1_000,
    overdriveReady: true,
  });
  assert.equal(repeated.activated, false);
  assert.equal(repeated.consumeResonance, false);
  assert.equal(repeated.state.endsAtMs, first.state.endsAtMs);
  assert.equal(repeated.state.reentryAllowedAtMs, first.state.reentryAllowedAtMs);

  const beforeExpiry = projectCombatOverdrive(
    first.state,
    activationAtMs + OVERDRIVE_DURATION_MS - 1,
    true,
  );
  assert.equal(beforeExpiry.active, true);
  assert.equal(beforeExpiry.remainingMs, 1);

  const atExpiry = projectCombatOverdrive(
    first.state,
    activationAtMs + OVERDRIVE_DURATION_MS,
    true,
  );
  assert.equal(atExpiry.active, false);
  assert.equal(atExpiry.reentryLocked, true);
  assert.equal(atExpiry.reentryRemainingMs, OVERDRIVE_REENTRY_LOCK_MS);

  const tooEarly = activateCombatOverdrive(first.state, {
    occurredAtMs:
      activationAtMs + OVERDRIVE_DURATION_MS + OVERDRIVE_REENTRY_LOCK_MS - 1,
    overdriveReady: true,
  });
  assert.equal(tooEarly.activated, false);

  const exactUnlock = activateCombatOverdrive(tooEarly.state, {
    occurredAtMs:
      activationAtMs + OVERDRIVE_DURATION_MS + OVERDRIVE_REENTRY_LOCK_MS,
    overdriveReady: true,
  });
  assert.equal(exactUnlock.activated, true);
  assert.equal(exactUnlock.consumeResonance, true);
});

test("accepted damage breaks J1 resonance while active J2 timing remains independent", () => {
  const earned = earnOverdriveReady();
  const activation = activateCombatOverdrive(createCombatOverdriveState(), {
    occurredAtMs: earned.nowMs,
    overdriveReady: true,
  });
  assert.equal(activation.activated, true);

  let resonance = { ...earned.resonance, resonance: 0 };
  resonance = registerCombatResonanceDefeat(resonance, {
    occurredAtMs: earned.nowMs + 100,
    baseScore: 100,
    affinity: "solar",
  }).state;
  resonance = registerCombatResonanceDefeat(resonance, {
    occurredAtMs: earned.nowMs + 200,
    baseScore: 100,
    affinity: "hydro",
  }).state;
  assert.ok(resonance.resonance > 0);

  const overdriveBeforeDamage = structuredClone(activation.state);
  const broken = applyCombatResonanceDamageBreak(resonance);
  assert.equal(broken.chain, 0);
  assert.ok(broken.resonance <= resonance.resonance);
  assert.deepEqual(activation.state, overdriveBeforeDamage);

  const liveProjection = projectCombatOverdrive(
    activation.state,
    earned.nowMs + 200,
    projectCombatResonance(broken).overdriveReady,
  );
  assert.equal(liveProjection.active, true);
});

test("fresh run resets both J1 Resonance and J2 Overdrive exactly", () => {
  assert.deepEqual(createCombatResonanceState(), {
    chain: 0,
    bestChain: 0,
    resonance: 0,
    lastDefeatAtMs: null,
    affinityTrail: [],
    diversityMilestone: 0,
  });
  assert.deepEqual(createCombatOverdriveState(), {
    active: false,
    activatedAtMs: null,
    endsAtMs: null,
    reentryAllowedAtMs: 0,
  });
});

test("long deterministic J1/J2 sequence remains finite and bounded across repeated Overdrives", () => {
  let resonance = createCombatResonanceState();
  let overdrive = createCombatOverdriveState();
  let activations = 0;

  for (let step = 0; step < 800; step += 1) {
    const nowMs = step * 100;
    overdrive = advanceCombatOverdrive(overdrive, nowMs);

    const defeat = registerCombatResonanceDefeat(resonance, {
      occurredAtMs: nowMs,
      baseScore: 75 + (step % 5) * 25,
      affinity: affinityCycle[step % affinityCycle.length],
      isElite: step % 23 === 0,
      isBoss: step > 0 && step % 101 === 0,
    });
    resonance = defeat.state;

    if (step > 0 && step % 41 === 0) {
      resonance = applyCombatResonanceDamageBreak(resonance);
    }

    let resonanceProjection = projectCombatResonance(resonance);
    let overdriveProjection = projectCombatOverdrive(
      overdrive,
      nowMs,
      resonanceProjection.overdriveReady,
    );

    if (overdriveProjection.canActivate) {
      const activation = activateCombatOverdrive(overdrive, {
        occurredAtMs: nowMs,
        overdriveReady: resonanceProjection.overdriveReady,
      });
      assert.equal(activation.activated, true);
      assert.equal(activation.consumeResonance, true);
      overdrive = activation.state;
      resonance = { ...resonance, resonance: 0 };
      resonanceProjection = projectCombatResonance(resonance);
      overdriveProjection = activation.projection;
      activations += 1;
    }

    const effects = projectCombatOverdriveEffects(overdriveProjection);
    const presentation = projectCombatOverdrivePresentation({
      active: overdriveProjection.active,
      remainingRatio: overdriveProjection.remainingRatio,
      qualityPreset: QualityPreset.MEDIUM,
    });

    for (const value of [
      resonance.chain,
      resonance.resonance,
      resonanceProjection.scoreMultiplier,
      overdriveProjection.remainingMs,
      overdriveProjection.remainingRatio,
      effects.playerDamageMultiplier,
      presentation.overlayAlpha,
      presentation.swarmHaloAlpha,
      presentation.ringCount,
      presentation.activationPulse,
    ]) {
      assert.equal(Number.isFinite(value), true);
    }

    assert.ok(resonance.resonance >= 0 && resonance.resonance <= MAX_RESONANCE);
    assert.ok(resonanceProjection.scoreMultiplier >= 1);
    assert.ok(resonanceProjection.scoreMultiplier <= 2);
    assert.ok(effects.playerDamageMultiplier >= 1);
    assert.ok(
      effects.playerDamageMultiplier <= MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
    );
    assert.ok(presentation.ringCount <= MAX_OVERDRIVE_PRESENTATION_RINGS);
    assert.ok(
      overdriveProjection.remainingRatio >= 0 &&
        overdriveProjection.remainingRatio <= 1,
    );
  }

  assert.ok(activations >= 3, "long run should exercise repeated Overdrive cycles");
});
