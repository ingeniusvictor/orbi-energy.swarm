import assert from "node:assert/strict";
import test from "node:test";

import {
  applyBonusChallengeRuntimeAdoption,
} from "../../src/game/bonusChallengeRuntimeAdoption";
import {
  applyDynamicMidSectorEventRuntimeAdoption,
} from "../../src/game/dynamicMidSectorEventRuntimeAdoption";
import { projectRuntimeCombatPressure } from "../../src/game/runtimeCombatPressure";
import { projectInfiniteMilestoneEncounter } from "../../src/game/runtimeMilestoneEncounter";
import {
  getRuntimeMutatedEnemyBudget,
  projectRuntimeMutatorEffects,
} from "../../src/game/runtimeMutatorEffects";
import { resolveRuntimeWaveDescriptor } from "../../src/game/runtimeProgressionRouter";
import {
  resolveScoreAttackBootstrapEnvelope,
  type ScoreAttackBootstrapEnvelope,
} from "../../src/game/scoreAttackBootstrapEnvelope";
import { resolveScoreAttackRuntimeDescriptorCompletionOverlay } from "../../src/game/scoreAttackRuntimeDescriptorCompletionOverlay";
import {
  SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE_AUTHORITY_CONTRACT,
  resolveScoreAttackRuntimeProjectionBundle,
} from "../../src/game/scoreAttackRuntimeProjectionBundle";

const getCanonicalEnvelope = () => {
  const envelope = resolveScoreAttackBootstrapEnvelope("SCORE_ATTACK");
  assert.ok(envelope);
  return envelope;
};

test("J8K composes a canonical Score Attack bundle from the exact J8I descriptor", () => {
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
  assert.deepEqual(bundle.descriptor, overlay.descriptor);
  assert.deepEqual(bundle.completionOverlay, overlay);
  assert.equal(bundle.descriptor.completionPolicy.type, "TIMEBOX");
  assert.equal(bundle.descriptor.completionPolicy.durationMs, 60000);
  assert.equal(bundle.descriptor.sector, 11);
  assert.equal(bundle.descriptor.waveNumber, 1);
  assert.equal(bundle.adaptiveInvasionBypassed, true);
  assert.equal(bundle.usesLiveFollowerCount, false);
  assert.equal(bundle.preservesJ8IEffectiveDescriptor, true);
  assert.equal(bundle.preservesCanonicalRecipeComparability, true);
});

test("J8K requires J6/J7 to remain null and descriptor-preserving on canonical Wave 1", () => {
  const envelope = getCanonicalEnvelope();
  const bundle = resolveScoreAttackRuntimeProjectionBundle(envelope);
  assert.ok(bundle);

  const dynamicResult = applyDynamicMidSectorEventRuntimeAdoption(
    envelope.runtimeProgression,
    bundle.descriptor,
  );
  assert.equal(dynamicResult.adoption, null);
  assert.equal(dynamicResult.descriptor, bundle.descriptor);

  const bonusResult = applyBonusChallengeRuntimeAdoption(
    envelope.runtimeProgression,
    bundle.descriptor,
  );
  assert.equal(bonusResult.adoption, null);
  assert.equal(bonusResult.descriptor, bundle.descriptor);

  assert.equal(bundle.dynamicEventCompatibilityChecked, true);
  assert.equal(bundle.dynamicEventAdoption, null);
  assert.equal(bundle.bonusChallengeCompatibilityChecked, true);
  assert.equal(bundle.bonusChallengeAdoption, null);
});

test("J8K derives pressure, mutators, budget and milestone only from the effective J8I descriptor", () => {
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
  if (bundle.milestoneEncounter) {
    assert.equal(Object.isFrozen(bundle.milestoneEncounter), true);
  }
});

test("J8K is deterministic, pure and independent of any live follower-count input", () => {
  const envelope = getCanonicalEnvelope();
  const envelopeBefore = JSON.stringify(envelope);

  const first = resolveScoreAttackRuntimeProjectionBundle(envelope);
  const second = resolveScoreAttackRuntimeProjectionBundle(envelope);

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(envelope), envelopeBefore);
  assert.equal(first.usesLiveFollowerCount, false);
  assert.equal(second.usesLiveFollowerCount, false);
});

test("J8K fails closed for absent or non-canonical Score Attack envelope facts", () => {
  assert.equal(resolveScoreAttackRuntimeProjectionBundle(null), null);

  const envelope = getCanonicalEnvelope();
  const wrongModeEnvelope = {
    ...envelope,
    modeId: "BOSS_RUSH",
  } as unknown as Readonly<ScoreAttackBootstrapEnvelope>;
  assert.equal(
    resolveScoreAttackRuntimeProjectionBundle(wrongModeEnvelope),
    null,
  );

  const wrongFreshStartEnvelope = {
    ...envelope,
    canonicalFreshStart: {
      ...envelope.canonicalFreshStart,
      wave: 2,
    },
  } as unknown as Readonly<ScoreAttackBootstrapEnvelope>;
  assert.equal(
    resolveScoreAttackRuntimeProjectionBundle(wrongFreshStartEnvelope),
    null,
  );
});

test("J8K exposes bundle composition as its only positive authority", () => {
  const bundle = resolveScoreAttackRuntimeProjectionBundle(
    getCanonicalEnvelope(),
  );
  assert.ok(bundle);

  assert.equal(bundle.writesRuntimeProjectionCache, false);
  assert.equal(bundle.adoptsLiveRuntime, false);
  assert.equal(bundle.writesReactStateOrRefs, false);
  assert.equal(bundle.startsOrTicksTimer, false);
  assert.equal(bundle.ownsTerminalDisposition, false);
  assert.equal(bundle.writesPersistence, false);
  assert.equal(bundle.writesRunArchive, false);
  assert.equal(bundle.writesScoreAttackRecord, false);

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
    "ownsScoreAttackRuntimeProjectionBundleAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsScoreAttackRuntimeProjectionBundleAuthority") {
      continue;
    }
    assert.equal(value, false, `${key} must remain false`);
  }
});
