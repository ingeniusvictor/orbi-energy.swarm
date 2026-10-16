import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveRuntimeWaveDescriptor,
} from "../../src/game/runtimeProgressionRouter";
import {
  resolveScoreAttackBootstrapEnvelope,
  type ScoreAttackBootstrapEnvelope,
} from "../../src/game/scoreAttackBootstrapEnvelope";
import {
  SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY_AUTHORITY_CONTRACT,
  resolveScoreAttackRuntimeDescriptorCompletionOverlay,
} from "../../src/game/scoreAttackRuntimeDescriptorCompletionOverlay";
import type { RuntimeWaveDescriptor } from "../../src/game/runtimeWaveDescriptor";

const getCanonicalFacts = () => {
  const envelope = resolveScoreAttackBootstrapEnvelope("SCORE_ATTACK");
  assert.ok(envelope);
  const descriptor = resolveRuntimeWaveDescriptor(envelope.runtimeProgression);
  return { envelope, descriptor };
};

test("J8I projects only canonical fresh Score Attack completion from BUDGET_AND_CLEAR to TIMEBOX 60000", () => {
  const { envelope, descriptor } = getCanonicalFacts();
  assert.equal(descriptor.completionPolicy.type, "BUDGET_AND_CLEAR");

  const projection = resolveScoreAttackRuntimeDescriptorCompletionOverlay(
    envelope,
    descriptor,
  );

  assert.ok(projection);
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Object.isFrozen(projection.descriptor), true);
  assert.equal(Object.isFrozen(projection.completionPolicy), true);
  assert.equal(
    projection.kind,
    "SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY",
  );
  assert.equal(projection.projectionMode, "PROJECTION_ONLY");
  assert.equal(projection.modeId, "SCORE_ATTACK");
  assert.equal(projection.sourceRuntimeMode, "INFINITE");
  assert.equal(projection.sourceCompletionType, "BUDGET_AND_CLEAR");
  assert.equal(projection.exactDurationMs, 60000);
  assert.deepEqual(projection.completionPolicy, {
    type: "TIMEBOX",
    durationMs: 60000,
  });
  assert.deepEqual(projection.descriptor.completionPolicy, {
    type: "TIMEBOX",
    durationMs: 60000,
  });

  assert.equal(descriptor.completionPolicy.type, "BUDGET_AND_CLEAR");
  assert.notEqual(projection.descriptor, descriptor);
});

test("J8I preserves every non-completion descriptor fact and nested semantic reference", () => {
  const { envelope, descriptor } = getCanonicalFacts();
  const projection = resolveScoreAttackRuntimeDescriptorCompletionOverlay(
    envelope,
    descriptor,
  );
  assert.ok(projection);

  const projected = projection.descriptor;
  assert.equal(projected.descriptorId, descriptor.descriptorId);
  assert.equal(projected.sourceMode, descriptor.sourceMode);
  assert.equal(projected.sector, descriptor.sector);
  assert.equal(projected.waveNumber, descriptor.waveNumber);
  assert.equal(projected.waveCount, descriptor.waveCount);
  assert.equal(projected.biomeIntent, descriptor.biomeIntent);

  assert.equal(projected.display, descriptor.display);
  assert.equal(projected.spawn, descriptor.spawn);
  assert.equal(projected.modifiers, descriptor.modifiers);
  assert.equal(projected.pressure, descriptor.pressure);
  assert.equal(projected.rewards, descriptor.rewards);
  assert.equal(projected.milestone, descriptor.milestone);
  assert.equal(projected.fairness, descriptor.fairness);
  assert.equal(projected.source, descriptor.source);

  assert.equal(projection.preservesDescriptorIdentity, true);
  assert.equal(projection.preservesDescriptorDisplay, true);
  assert.equal(projection.preservesBiomeIntent, true);
  assert.equal(projection.preservesSpawnSemantics, true);
  assert.equal(projection.preservesModifiers, true);
  assert.equal(projection.preservesPressureSemantics, true);
  assert.equal(projection.preservesRewardSemantics, true);
  assert.equal(projection.preservesMilestoneSemantics, true);
  assert.equal(projection.preservesFairnessSemantics, true);
  assert.equal(projection.preservesSourceFacts, true);
  assert.equal(projection.changesOnlyCompletionPolicy, true);
  assert.equal(
    projection.preservesCanonicalModeIdentityOutsideRuntimeDiscriminator,
    true,
  );
});

test("J8I is deterministic without mutating envelope, runtime, session or source descriptor", () => {
  const { envelope, descriptor } = getCanonicalFacts();
  const envelopeBefore = JSON.stringify(envelope);
  const descriptorBefore = JSON.stringify(descriptor);

  const first = resolveScoreAttackRuntimeDescriptorCompletionOverlay(
    envelope,
    descriptor,
  );
  const second = resolveScoreAttackRuntimeDescriptorCompletionOverlay(
    envelope,
    descriptor,
  );

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
  assert.notEqual(first.descriptor, second.descriptor);
  assert.notEqual(first.completionPolicy, second.completionPolicy);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(envelope), envelopeBefore);
  assert.equal(JSON.stringify(descriptor), descriptorBefore);
});

test("J8I fails closed for absent, mismatched, mutated or already-overlaid facts", () => {
  const { envelope, descriptor } = getCanonicalFacts();

  assert.equal(
    resolveScoreAttackRuntimeDescriptorCompletionOverlay(null, descriptor),
    null,
  );
  assert.equal(
    resolveScoreAttackRuntimeDescriptorCompletionOverlay(envelope, null),
    null,
  );

  const wrongSector: RuntimeWaveDescriptor = {
    ...descriptor,
    sector: descriptor.sector + 1,
  };
  assert.equal(
    resolveScoreAttackRuntimeDescriptorCompletionOverlay(envelope, wrongSector),
    null,
  );

  const changedDisplay: RuntimeWaveDescriptor = {
    ...descriptor,
    display: {
      ...descriptor.display,
      displayName: `${descriptor.display.displayName} altered`,
    },
  };
  assert.equal(
    resolveScoreAttackRuntimeDescriptorCompletionOverlay(envelope, changedDisplay),
    null,
  );

  const alreadyTimeboxed: RuntimeWaveDescriptor = {
    ...descriptor,
    completionPolicy: { type: "TIMEBOX", durationMs: 60000 },
  };
  assert.equal(
    resolveScoreAttackRuntimeDescriptorCompletionOverlay(
      envelope,
      alreadyTimeboxed,
    ),
    null,
  );

  const wrongModeEnvelope = {
    ...envelope,
    modeId: "BOSS_RUSH",
  } as unknown as Readonly<ScoreAttackBootstrapEnvelope>;
  assert.equal(
    resolveScoreAttackRuntimeDescriptorCompletionOverlay(
      wrongModeEnvelope,
      descriptor,
    ),
    null,
  );
});

test("J8I authority contract owns only pure descriptor-completion overlay projection", () => {
  assert.equal(
    Object.isFrozen(
      SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY_AUTHORITY_CONTRACT,
    ),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsDescriptorCompletionOverlayProjectionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsDescriptorCompletionOverlayProjectionAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});
