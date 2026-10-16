import assert from "node:assert/strict";
import test from "node:test";

import {
  SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE_AUTHORITY_CONTRACT,
  resolveScoreAttackRuntimeActivationEnvelope,
} from "../../src/game/scoreAttackRuntimeActivationEnvelope";
import {
  resolveScoreAttackRuntimeProjectionBundle,
} from "../../src/game/scoreAttackRuntimeProjectionBundle";


test("J8L composes one canonical Score Attack activation envelope from exact J8H and J8K facts", () => {
  const activation = resolveScoreAttackRuntimeActivationEnvelope("SCORE_ATTACK");
  assert.ok(activation);

  assert.equal(Object.isFrozen(activation), true);
  assert.equal(activation.kind, "SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE");
  assert.equal(activation.activationMode, "ACTIVATION_ONLY");
  assert.equal(activation.modeId, "SCORE_ATTACK");
  assert.equal(activation.sourceRuntimeMode, "INFINITE");
  assert.equal(activation.runtimeProgression.mode, "INFINITE");
  assert.equal(activation.exactDurationMs, 60000);
  assert.deepEqual(activation.completionPolicy, {
    type: "TIMEBOX",
    durationMs: 60000,
  });
  assert.equal(Object.isFrozen(activation.completionPolicy), true);
  assert.deepEqual(activation.canonicalFreshStart, {
    sector: 11,
    wave: 1,
    sectorsCompleted: 0,
    wavesCompleted: 0,
    status: "ACTIVE",
  });
});

test("J8L preserves exact runtime/session and effective-descriptor object identity across the composed authorities", () => {
  const activation = resolveScoreAttackRuntimeActivationEnvelope("SCORE_ATTACK");
  assert.ok(activation);

  assert.equal(
    activation.runtimeProgression,
    activation.bootstrapEnvelope.runtimeProgression,
  );
  assert.equal(
    activation.runtimeSession,
    activation.bootstrapEnvelope.runtimeProgression.session,
  );
  assert.equal(
    activation.runtimeSession,
    activation.runtimeProgression.session,
  );
  assert.equal(
    activation.effectiveDescriptor,
    activation.runtimeProjectionBundle.descriptor,
  );
  assert.equal(
    activation.seed,
    activation.bootstrapEnvelope.seed,
  );

  const independentlyResolvedBundle = resolveScoreAttackRuntimeProjectionBundle(
    activation.bootstrapEnvelope,
  );
  assert.ok(independentlyResolvedBundle);
  assert.deepEqual(
    independentlyResolvedBundle.descriptor,
    activation.runtimeProjectionBundle.descriptor,
  );
});

test("J8L carries frozen Score Attack isolation facts without acquiring live/cache/terminal authority", () => {
  const activation = resolveScoreAttackRuntimeActivationEnvelope("SCORE_ATTACK");
  assert.ok(activation);

  assert.equal(activation.runtimeSession.currentSector, 11);
  assert.equal(activation.runtimeSession.currentWaveNumber, 1);
  assert.equal(activation.effectiveDescriptor.sourceMode, "INFINITE");
  assert.equal(activation.effectiveDescriptor.sector, 11);
  assert.equal(activation.effectiveDescriptor.waveNumber, 1);
  assert.equal(
    activation.effectiveDescriptor.source.seed,
    activation.bootstrapEnvelope.seed,
  );
  assert.deepEqual(activation.effectiveDescriptor.completionPolicy, {
    type: "TIMEBOX",
    durationMs: 60000,
  });

  assert.equal(activation.runtimeProjectionBundle.adaptiveInvasionBypassed, true);
  assert.equal(activation.runtimeProjectionBundle.usesLiveFollowerCount, false);
  assert.equal(activation.runtimeProjectionBundle.dynamicEventAdoption, null);
  assert.equal(activation.runtimeProjectionBundle.bonusChallengeAdoption, null);
  assert.equal(activation.runtimeProjectionBundle.writesRuntimeProjectionCache, false);
  assert.equal(activation.runtimeProjectionBundle.ownsTerminalDisposition, false);

  assert.equal(activation.preservesCanonicalModeIdentityOutsideRuntimeDiscriminator, true);
  assert.equal(activation.preservesExactBootstrapRuntimeIdentity, true);
  assert.equal(activation.preservesExactBootstrapSessionIdentity, true);
  assert.equal(activation.preservesExactJ8KBundleIdentity, true);
  assert.equal(activation.preservesExactJ8KEffectiveDescriptorIdentity, true);
  assert.equal(activation.addsRuntimeProgressionDiscriminator, false);
  assert.equal(activation.writesRuntimeProjectionCache, false);
  assert.equal(activation.adoptsLiveRuntime, false);
  assert.equal(activation.writesReactStateOrRefs, false);
  assert.equal(activation.startsOrTicksTimer, false);
  assert.equal(activation.ownsCompletionCursor, false);
  assert.equal(activation.advancesOrEndsSession, false);
  assert.equal(activation.executesTerminalDisposition, false);
  assert.equal(activation.writesPersistence, false);
  assert.equal(activation.writesRunArchive, false);
  assert.equal(activation.writesScoreAttackRecord, false);
});

test("J8L fails closed for unsupported mode ids", () => {
  assert.equal(resolveScoreAttackRuntimeActivationEnvelope("CAMPAIGN"), null);
  assert.equal(resolveScoreAttackRuntimeActivationEnvelope("INFINITE"), null);
  assert.equal(resolveScoreAttackRuntimeActivationEnvelope("BOSS_RUSH"), null);
  assert.equal(resolveScoreAttackRuntimeActivationEnvelope(""), null);
  assert.equal(resolveScoreAttackRuntimeActivationEnvelope("score_attack"), null);
});

test("J8L repeated resolutions are canonically equivalent but use independent fresh runtime/session objects", () => {
  const first = resolveScoreAttackRuntimeActivationEnvelope("SCORE_ATTACK");
  const second = resolveScoreAttackRuntimeActivationEnvelope("SCORE_ATTACK");
  assert.ok(first);
  assert.ok(second);

  assert.notEqual(first, second);
  assert.notEqual(first.bootstrapEnvelope, second.bootstrapEnvelope);
  assert.notEqual(first.runtimeProgression, second.runtimeProgression);
  assert.notEqual(first.runtimeSession, second.runtimeSession);
  assert.notEqual(first.runtimeProjectionBundle, second.runtimeProjectionBundle);
  assert.notEqual(first.effectiveDescriptor, second.effectiveDescriptor);

  assert.equal(first.modeId, second.modeId);
  assert.equal(first.seed, second.seed);
  assert.equal(first.exactDurationMs, second.exactDurationMs);
  assert.deepEqual(first.canonicalFreshStart, second.canonicalFreshStart);
  assert.deepEqual(first.effectiveDescriptor, second.effectiveDescriptor);
});

test("J8L authority contract owns only runtime activation-envelope construction", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsRuntimeActivationEnvelopeConstructionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsRuntimeActivationEnvelopeConstructionAuthority") {
      continue;
    }
    assert.equal(value, false, `${key} must remain false`);
  }
});
