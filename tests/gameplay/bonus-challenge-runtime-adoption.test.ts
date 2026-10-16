import assert from "node:assert/strict";
import test from "node:test";

import {
  BONUS_CHALLENGE_RUNTIME_ADOPTION_AUTHORITY_CONTRACT,
  applyBonusChallengeRuntimeAdoption,
} from "../../src/game/bonusChallengeRuntimeAdoption.ts";
import { applyAdaptiveInvasionToDescriptor } from "../../src/game/adaptiveInvasionRuntime.ts";
import { applyDynamicMidSectorEventRuntimeAdoption } from "../../src/game/dynamicMidSectorEventRuntimeAdoption.ts";
import {
  createRuntimeProjectionBundleCache,
  getCachedRuntimeProjectionBundle,
} from "../../src/game/runtimeProjectionBundleCache.ts";
import {
  isRuntimeWaveComplete,
  shouldTickRuntimeTimer,
} from "../../src/game/runtimeCompletionPolicy.ts";
import {
  advanceInfiniteRuntimeState,
  createCampaignRuntimeState,
  createInfiniteRuntimeState,
  resolveRuntimeWaveDescriptor,
  type RuntimeProgressionState,
} from "../../src/game/runtimeProgressionRouter.ts";
import { createInfiniteSession } from "../../src/game/infiniteSession.ts";

const findSector33SelectedState = (
  seed = "j7d-live-adoption",
): RuntimeProgressionState => {
  let state: RuntimeProgressionState = createInfiniteRuntimeState(
    createInfiniteSession(seed),
  );

  for (let guard = 0; guard < 256; guard += 1) {
    if (state.mode !== "INFINITE") {
      throw new Error("Expected Infinite runtime while searching for J7D state.");
    }

    if (state.session.currentSector > 33) {
      break;
    }

    if (state.session.currentSector === 33) {
      const descriptor = resolveRuntimeWaveDescriptor(state);
      const result = applyBonusChallengeRuntimeAdoption(state, descriptor);
      if (result.adoption) return state;
    }

    state = advanceInfiniteRuntimeState(state);
  }

  throw new Error("Unable to resolve the frozen J7D sector-33 selected wave.");
};

const descriptorWithoutJ7Fields = (descriptor: ReturnType<typeof resolveRuntimeWaveDescriptor>) => ({
  sourceMode: descriptor.sourceMode,
  sector: descriptor.sector,
  waveNumber: descriptor.waveNumber,
  waveCount: descriptor.waveCount,
  biomeIntent: descriptor.biomeIntent,
  spawn: descriptor.spawn,
  modifiers: descriptor.modifiers,
  pressure: descriptor.pressure,
  rewards: descriptor.rewards,
  milestone: descriptor.milestone,
  fairness: descriptor.fairness,
  source: descriptor.source,
});

test("Campaign remains byte-for-byte outside J7D adoption", () => {
  const state = createCampaignRuntimeState(4);
  const descriptor = resolveRuntimeWaveDescriptor(state);
  const result = applyBonusChallengeRuntimeAdoption(state, descriptor);

  assert.equal(result.adoption, null);
  assert.equal(result.descriptor, descriptor);
});

test("J7D adopts exactly the frozen J7C TIMEBOX on the selected current Infinite wave", () => {
  const state = findSector33SelectedState();
  const descriptor = resolveRuntimeWaveDescriptor(state);
  const beforeState = JSON.stringify(state);
  const beforeDescriptor = JSON.stringify(descriptor);
  const result = applyBonusChallengeRuntimeAdoption(state, descriptor);
  const adoption = result.adoption;

  assert.ok(adoption);
  assert.equal(adoption.kind, "BONUS_CHALLENGE_RUNTIME_ADOPTION");
  assert.equal(adoption.adoptionMode, "CURRENT_WAVE_ONLY");
  assert.equal(adoption.sourceMode, "INFINITE");
  assert.equal(adoption.challengeId, "TIMED_SURVIVAL");
  assert.equal(adoption.sector, 33);
  assert.equal(adoption.waveIndex, descriptor.waveNumber);
  assert.equal(adoption.waveCount, descriptor.waveCount);
  assert.equal(adoption.exactDurationMs, 30000);
  assert.deepEqual(adoption.completionPolicy, {
    type: "TIMEBOX",
    durationMs: 30000,
  });
  assert.equal(Object.isFrozen(adoption), true);
  assert.equal(Object.isFrozen(adoption.completionPolicy), true);
  assert.equal(adoption.telegraphMode, "WAVE_ANNOUNCEMENT");
  assert.equal(adoption.ownsClock, false);
  assert.equal(adoption.ownsTimer, false);
  assert.equal(adoption.ownsCompletionCursor, false);
  assert.equal(adoption.ownsPauseLifecycle, false);
  assert.equal(adoption.mutatesRecipe, false);
  assert.equal(adoption.mutatesSession, false);
  assert.equal(adoption.mutatesEntities, false);
  assert.equal(adoption.changesSpawnAuthority, false);
  assert.equal(adoption.changesArenaAuthority, false);
  assert.equal(adoption.changesProgressionAuthority, false);
  assert.equal(adoption.changesCombatEconomyAuthority, false);
  assert.equal(adoption.changesBudgetAuthority, false);

  assert.equal(descriptor.completionPolicy.type, "BUDGET_AND_CLEAR");
  assert.deepEqual(result.descriptor.completionPolicy, {
    type: "TIMEBOX",
    durationMs: 30000,
  });
  assert.match(result.descriptor.descriptorId, /:j7d:timed-survival$/);
  assert.match(result.descriptor.display.displayName, /Timed Survival/);
  assert.match(result.descriptor.display.description, /survive for 30 seconds/i);
  assert.deepEqual(
    descriptorWithoutJ7Fields(result.descriptor),
    descriptorWithoutJ7Fields(descriptor),
  );
  assert.equal(JSON.stringify(descriptor), beforeDescriptor);
  assert.equal(JSON.stringify(state), beforeState);
});

test("existing TIMEBOX completion authority executes J7D without a new clock or timer", () => {
  const state = findSector33SelectedState("j7d-timebox-authority");
  const cache = createRuntimeProjectionBundleCache();
  const bundle = getCachedRuntimeProjectionBundle(cache, state);

  assert.ok(bundle.bonusChallengeAdoption);
  assert.equal(bundle.descriptor.completionPolicy.type, "TIMEBOX");
  assert.equal(shouldTickRuntimeTimer(bundle.descriptor), true);
  assert.equal(
    isRuntimeWaveComplete(bundle.descriptor, {
      remainingTimeMs: 1,
      spawnedEnemyCount: 999,
      livingEnemyCount: 999,
      bossDefeated: false,
    }),
    false,
  );
  assert.equal(
    isRuntimeWaveComplete(bundle.descriptor, {
      remainingTimeMs: 0,
      spawnedEnemyCount: 999,
      livingEnemyCount: 999,
      bossDefeated: false,
    }),
    true,
  );
});

test("J7D naturally expires after state advance with no stale TIMEBOX carry-over", () => {
  const selected = findSector33SelectedState("j7d-lifecycle");
  const selectedCache = createRuntimeProjectionBundleCache();
  const selectedBundle = getCachedRuntimeProjectionBundle(selectedCache, selected);
  assert.ok(selectedBundle.bonusChallengeAdoption);
  assert.equal(selectedBundle.descriptor.completionPolicy.type, "TIMEBOX");

  const next = advanceInfiniteRuntimeState(selected);
  const nextCache = createRuntimeProjectionBundleCache();
  const nextBundle = getCachedRuntimeProjectionBundle(nextCache, next);

  assert.equal(nextBundle.bonusChallengeAdoption, null);
  assert.equal(nextBundle.descriptor.completionPolicy.type, "BUDGET_AND_CLEAR");
  assert.equal(shouldTickRuntimeTimer(nextBundle.descriptor), false);
});

test("J7D projection-cache ordering preserves adaptive and J6-produced facts except approved completion/display attribution", () => {
  const state = findSector33SelectedState("j7d-overlay-order");
  const liveFollowerCount = 24;
  const base = resolveRuntimeWaveDescriptor(state);
  const adaptive = applyAdaptiveInvasionToDescriptor(base, liveFollowerCount);
  const dynamic = applyDynamicMidSectorEventRuntimeAdoption(state, adaptive);
  const direct = applyBonusChallengeRuntimeAdoption(state, dynamic.descriptor);
  const cache = createRuntimeProjectionBundleCache();
  const bundle = getCachedRuntimeProjectionBundle(cache, state, liveFollowerCount);

  assert.ok(direct.adoption);
  assert.ok(bundle.bonusChallengeAdoption);
  assert.deepEqual(bundle.descriptor, direct.descriptor);
  assert.deepEqual(bundle.dynamicEventAdoption, dynamic.adoption);
  assert.equal(bundle.dynamicEventAdoption, null);
  assert.deepEqual(
    descriptorWithoutJ7Fields(bundle.descriptor),
    descriptorWithoutJ7Fields(dynamic.descriptor),
  );
  assert.deepEqual(bundle.descriptor.spawn, dynamic.descriptor.spawn);
  assert.deepEqual(bundle.descriptor.modifiers, dynamic.descriptor.modifiers);
  assert.deepEqual(bundle.descriptor.pressure, dynamic.descriptor.pressure);
  assert.deepEqual(bundle.descriptor.rewards, dynamic.descriptor.rewards);
  assert.deepEqual(bundle.descriptor.milestone, dynamic.descriptor.milestone);
  assert.deepEqual(bundle.descriptor.fairness, dynamic.descriptor.fairness);
  assert.deepEqual(bundle.descriptor.source, dynamic.descriptor.source);
});

test("mismatched cursor missing identity or pre-existing completion authority fails closed", () => {
  const state = findSector33SelectedState("j7d-fail-closed");
  const descriptor = resolveRuntimeWaveDescriptor(state);

  for (const candidate of [
    { ...descriptor, waveNumber: descriptor.waveNumber + 1 },
    { ...descriptor, source: { ...descriptor.source, seed: null } },
    { ...descriptor, source: { ...descriptor.source, recipeId: null } },
    { ...descriptor, completionPolicy: { type: "TIMEBOX" as const, durationMs: 45000 } },
    { ...descriptor, completionPolicy: { type: "BOSS_DEFEAT" as const } },
  ]) {
    const result = applyBonusChallengeRuntimeAdoption(state, candidate);
    assert.equal(result.adoption, null);
    assert.equal(result.descriptor, candidate);
  }
});

test("J7D authority contract owns only live adoption and descriptor completion overlay authority", () => {
  assert.deepEqual(BONUS_CHALLENGE_RUNTIME_ADOPTION_AUTHORITY_CONTRACT, {
    ownsLiveAdoptionAuthority: true,
    ownsDescriptorCompletionOverlayAuthority: true,
    ownsChallengeProfileAuthority: false,
    ownsOpportunitySelectionAuthority: false,
    ownsDurationProjectionAuthority: false,
    ownsLiveCompletionPolicyAuthority: false,
    ownsTimerAuthority: false,
    ownsCompletionCursorAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsHudAuthority: false,
    ownsRandomness: false,
    ownsHashAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
  assert.equal(Object.isFrozen(BONUS_CHALLENGE_RUNTIME_ADOPTION_AUTHORITY_CONTRACT), true);
});
