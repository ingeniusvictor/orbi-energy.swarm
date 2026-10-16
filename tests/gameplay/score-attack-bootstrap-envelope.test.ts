import assert from "node:assert/strict";
import test from "node:test";

import {
  getRuntimeSector,
  getRuntimeWaveNumber,
  resolveRuntimeWaveDescriptor,
} from "../../src/game/runtimeProgressionRouter";
import {
  SCORE_ATTACK_BOOTSTRAP_ENVELOPE_AUTHORITY_CONTRACT,
  resolveScoreAttackBootstrapEnvelope,
} from "../../src/game/scoreAttackBootstrapEnvelope";

test("J8H returns an immutable outer SCORE_ATTACK envelope around fresh INFINITE runtime progression", () => {
  const envelope = resolveScoreAttackBootstrapEnvelope("SCORE_ATTACK");

  assert.ok(envelope);
  assert.equal(Object.isFrozen(envelope), true);
  assert.equal(envelope.kind, "SCORE_ATTACK_BOOTSTRAP_ENVELOPE");
  assert.equal(envelope.bootstrapMode, "BOOTSTRAP_ONLY");
  assert.equal(envelope.modeId, "SCORE_ATTACK");
  assert.equal(envelope.recipeVersion, 1);
  assert.equal(envelope.seed, "orbi-score-attack-v1");
  assert.equal(envelope.runtimeProgressionMode, "INFINITE");
  assert.equal(envelope.runtimeProgression.mode, "INFINITE");
  assert.equal(envelope.runtimeProgression.session.kind, "INFINITE_SESSION");
  assert.equal(envelope.runtimeProgression.session.seed, "orbi-score-attack-v1");
  assert.equal(envelope.runtimeProgression.session.status, "ACTIVE");
  assert.equal(getRuntimeSector(envelope.runtimeProgression), 11);
  assert.equal(getRuntimeWaveNumber(envelope.runtimeProgression), 1);
  assert.deepEqual(envelope.canonicalFreshStart, {
    sector: 11,
    wave: 1,
    sectorsCompleted: 0,
    wavesCompleted: 0,
    status: "ACTIVE",
  });
  assert.equal(envelope.completionType, "TIMEBOX");
  assert.equal(envelope.exactDurationMs, 60000);
  assert.equal(
    envelope.preservesCanonicalModeIdentityOutsideRuntimeDiscriminator,
    true,
  );
  assert.equal(envelope.addsRuntimeProgressionDiscriminator, false);
  assert.equal(envelope.adoptsLiveRuntime, false);
  assert.equal(envelope.writesReactStateOrRefs, false);
  assert.equal(envelope.startsOrTicksTimer, false);
  assert.equal(envelope.advancesSession, false);
  assert.equal(envelope.writesPersistence, false);
  assert.equal(envelope.writesRunArchive, false);
});

test("J8H runtime remains compatible with the existing descriptor pipeline without a third runtime mode", () => {
  const envelope = resolveScoreAttackBootstrapEnvelope("SCORE_ATTACK");
  assert.ok(envelope);

  const descriptor = resolveRuntimeWaveDescriptor(envelope.runtimeProgression);
  assert.ok(descriptor);
  assert.equal(envelope.runtimeProgression.mode, "INFINITE");
  assert.equal(envelope.modeId, "SCORE_ATTACK");
});

test("J8H creates equivalent canonical facts with fresh independent runtime/session objects", () => {
  const first = resolveScoreAttackBootstrapEnvelope("SCORE_ATTACK");
  const second = resolveScoreAttackBootstrapEnvelope("SCORE_ATTACK");

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
  assert.notEqual(first.runtimeProgression, second.runtimeProgression);
  assert.notEqual(
    first.runtimeProgression.session,
    second.runtimeProgression.session,
  );

  assert.equal(first.modeId, second.modeId);
  assert.equal(first.recipeVersion, second.recipeVersion);
  assert.equal(first.seed, second.seed);
  assert.equal(first.runtimeProgressionMode, second.runtimeProgressionMode);
  assert.equal(first.exactDurationMs, second.exactDurationMs);
  assert.equal(first.completionType, second.completionType);
  assert.deepEqual(first.canonicalFreshStart, second.canonicalFreshStart);
  assert.deepEqual(
    first.runtimeProgression.session,
    second.runtimeProgression.session,
  );
});

test("J8H fails closed for unsupported or malformed mode identity", () => {
  assert.equal(resolveScoreAttackBootstrapEnvelope("BOSS_RUSH"), null);
  assert.equal(resolveScoreAttackBootstrapEnvelope("score_attack"), null);
  assert.equal(resolveScoreAttackBootstrapEnvelope(" SCORE_ATTACK "), null);
});

test("J8H authority contract owns only bootstrap-envelope construction", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_BOOTSTRAP_ENVELOPE_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_BOOTSTRAP_ENVELOPE_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsBootstrapEnvelopeConstructionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_BOOTSTRAP_ENVELOPE_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsBootstrapEnvelopeConstructionAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});
