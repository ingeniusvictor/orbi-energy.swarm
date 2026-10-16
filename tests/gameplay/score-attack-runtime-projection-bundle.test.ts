import assert from "node:assert/strict";
import test from "node:test";

import {
  applyBonusChallengeRuntimeAdoption,
} from "../../src/game/bonusChallengeRuntimeAdoption";
import {
  applyDynamicMidSectorEventRuntimeAdoption,
} from "../../src/game/dynamicMidSectorEventRuntimeAdoption";
import {
  projectRuntimeCombatPressure,
} from "../../src/game/runtimeCombatPressure";
import {
  projectInfiniteMilestoneEncounter,
} from "../../src/game/runtimeMilestoneEncounter";
import {
  getRuntimeMutatedEnemyBudget,
  projectRuntimeMutatorEffects,
} from "../../src/game/runtimeMutatorEffects";
import {
  resolveRuntimeWaveDescriptor,
} from "../../src/game/runtimeProgressionRouter";
import {
  resolveScoreAttackBootstrapEnvelope,
  type ScoreAttackBootstrapEnvelope,
} from "../../src/game/scoreAttackBootstrapEnvelope";
import {
  resolveScoreAttackRuntimeDescriptorCompletionOverlay,
} from "../../src/game/scoreAttackRuntimeDescriptorCompletionOverlay";
import {
  SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE_AUTHORITY_CONTRACT,
  resolveScoreAttackRuntimeProjectionBundle,
} from "../../src/game/scoreAttackRuntimeProjectionBundle";

const getCanonicalEnvelope = () => {
  const envelope = resolveScoreAttackBootstrapEnvelope("SCORE_ATTACK");
  assert.ok(envelope);
  return envelope;
};

test("J8K composes the canonical J8H runtime through the exact J8I TIMEBOX descriptor", () => {
  const envelope = getCanonicalEnvelope();
  const baseDescriptor = resolveRuntimeWaveDescriptor(
    envelope.runtimeProgression,
  );
  const overlay = resolveScoreAttackRuntimeDescriptorCompletionOverlay(
    envelope,
    baseDescriptor,
  );
  assert.ok(overlay);

  const bundle = resolveScoreAttackRuntimeProjectionBundle(envelope);
  assert.ok(bundle);

  assert.equal(Object.isFrozen(bundle), true);
  assert.equal(bundle.kind, "SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE");
  assert.equal(bundle.projectionMode, "PROJECTION_ONLY");
  assert.equal(bundle.modeId, "SCORE_ATTACK");
  assert.equal(bundle.sourceRuntimeMode, "INFINITE");
  assert.equal(bundle.exactDurationMs, 60000);
  assert.deepEqual(bundle.baseDescriptor, baseDescriptor);
  assert.deepEqual(bundle.completionOverlay, overlay);
  assert.deepEqual(bundle.descriptor, overlay.descriptor);
  assert.deepEqual(bundle.descriptor.completionPolicy, {
    type: "TIMEBOX",
    durationMs: 60000,
  });
  assert.equal(bundle.preservesScoreAttackCompletionOverlay, true);
  assert.equal(bundle.preservesCanonicalDescriptorFacts, true);
});

test("J8K keeps Adaptive Invasion absent and requires J6/J7 to remain no-op compatibility checks", () => {
  const envelope = getCanonicalEnvelope();
  const bundle = resolveScoreAttackRuntimeProjectionBundle(envelope);
  assert.ok(bundle);

  const dynamicCompatibility = applyDynamicMidSectorEventRuntimeAdoption(
    envelope.runtimeProgression,
    bundle.descriptor,
  );
  assert.equal(dynamicCompatibility.adoption, null);
  assert.equal(dynamicCompatibility.descriptor, bundle.descriptor);

  const bonusCompatibility = applyBonusChallengeRuntimeAdoption(
    envelope.runtimeProgression,
    bundle.descriptor,
  );
  assert.equal(bonusCompatibility.adoption, null);
  assert.equal(bonusCompatibility.descriptor, bundle.descriptor);

  assert.equal(bundle.adaptiveInvasionApplied, false);
  assert.equal(bundle.dynamicMidSectorEventAdoption, null);
  assert.equal(bundle.bonusChallengeAdoption, null);
  assert.equal(bundle.verifiesDynamicEventIsolation, true);
  assert.equal(bundle.verifiesBonusChallengeIsolation, true);
  assert.equal(bundle.acceptsLiveFollowerCount, false);
  assert.equal(bundle.writesGenericRuntimeProjectionCache, false);
});

test("J8K derives runtime projections only from the J8I effective descriptor", () => {
  const envelope = getCanonicalEnvelope();
  const bundle = resolveScoreAttackRuntimeProjectionBundle(envelope);
  assert.ok(bundle);

  assert.deepEqual(
    bundle.combatPressure,
    projectRuntimeCombatPressure(bundle.descriptor),
  );
  assert.deepEqual(
    bundle.mutatorEffects,
    projectRuntimeMutatorEffects(bundle.descriptor),
  );
  assert.equal(
    bundle.enemyBudget,
    getRuntimeMutatedEnemyBudget(bundle.descriptor),
  );
  assert.deepEqual(
    bundle.milestoneEncounter,
    projectInfiniteMilestoneEncounter(bundle.descriptor),
  );

  assert.equal(Object.isFrozen(bundle.combatPressure), true);
  assert.equal(Object.isFrozen(bundle.mutatorEffects), true);
  assert.equal(Object.isFrozen(bundle.mutatorEffects.activeMutators), true);
  assert.equal(bundle.milestoneEncounter, null);
});

test("J8K preserves all non-completion descriptor facts from the canonical Infinite base", () => {
  const envelope = getCanonicalEnvelope();
  const bundle = resolveScoreAttackRuntimeProjectionBundle(envelope);
  assert.ok(bundle);

  const base = bundle.baseDescriptor;
  const effective = bundle.descriptor;
  assert.equal(base.completionPolicy.type, "BUDGET_AND_CLEAR");
  assert.equal(effective.completionPolicy.type, "TIMEBOX");

  assert.equal(effective.descriptorId, base.descriptorId);
  assert.equal(effective.sourceMode, base.sourceMode);
  assert.equal(effective.sector, base.sector);
  assert.equal(effective.waveNumber, base.waveNumber);
  assert.equal(effective.waveCount, base.waveCount);
  assert.equal(effective.biomeIntent, base.biomeIntent);
  assert.equal(effective.display, base.display);
  assert.equal(effective.spawn, base.spawn);
  assert.equal(effective.modifiers, base.modifiers);
  assert.equal(effective.pressure, base.pressure);
  assert.equal(effective.rewards, base.rewards);
  assert.equal(effective.milestone, base.milestone);
  assert.equal(effective.fairness, base.fairness);
  assert.equal(effective.source, base.source);
  assert.equal(effective.source.seed, envelope.seed);
});

test("J8K is deterministic, pure and fails closed for invalid envelope facts", () => {
  const envelope = getCanonicalEnvelope();
  const envelopeBefore = JSON.stringify(envelope);

  const first = resolveScoreAttackRuntimeProjectionBundle(envelope);
  const second = resolveScoreAttackRuntimeProjectionBundle(envelope);
  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(envelope), envelopeBefore);

  assert.equal(resolveScoreAttackRuntimeProjectionBundle(null), null);

  const wrongModeEnvelope = {
    ...envelope,
    modeId: "BOSS_RUSH",
  } as unknown as Readonly<ScoreAttackBootstrapEnvelope>;
  assert.equal(
    resolveScoreAttackRuntimeProjectionBundle(wrongModeEnvelope),
    null,
  );

  const wrongDurationEnvelope = {
    ...envelope,
    exactDurationMs: 30000,
  } as unknown as Readonly<ScoreAttackBootstrapEnvelope>;
  assert.equal(
    resolveScoreAttackRuntimeProjectionBundle(wrongDurationEnvelope),
    null,
  );

  const wrongSessionEnvelope = {
    ...envelope,
    runtimeProgression: {
      ...envelope.runtimeProgression,
      session: {
        ...envelope.runtimeProgression.session,
        currentSector: envelope.runtimeProgression.session.currentSector + 1,
      },
    },
  } as unknown as Readonly<ScoreAttackBootstrapEnvelope>;
  assert.equal(
    resolveScoreAttackRuntimeProjectionBundle(wrongSessionEnvelope),
    null,
  );
});

test("J8K authority contract owns only Score Attack runtime projection-bundle composition", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsScoreAttackRuntimeProjectionBundleCompositionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsScoreAttackRuntimeProjectionBundleCompositionAuthority") {
      continue;
    }
    assert.equal(value, false, `${key} must remain false`);
  }
});
