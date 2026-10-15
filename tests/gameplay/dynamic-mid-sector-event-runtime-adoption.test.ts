import assert from "node:assert/strict";
import test from "node:test";

import {
  DYNAMIC_MID_SECTOR_EVENT_RUNTIME_ADOPTION_AUTHORITY_CONTRACT,
  applyDynamicMidSectorEventRuntimeAdoption,
} from "../../src/game/dynamicMidSectorEventRuntimeAdoption.ts";
import {
  createRuntimeProjectionBundleCache,
  getCachedRuntimeProjectionBundle,
} from "../../src/game/runtimeProjectionBundleCache.ts";
import {
  createCampaignRuntimeState,
  createInfiniteRuntimeState,
  advanceInfiniteRuntimeState,
  resolveRuntimeWaveDescriptor,
  type RuntimeProgressionState,
} from "../../src/game/runtimeProgressionRouter.ts";
import { createInfiniteSession } from "../../src/game/infiniteSession.ts";
import { projectRuntimeCombatPressure } from "../../src/game/runtimeCombatPressure.ts";
import { getRuntimeMutatedEnemyBudget } from "../../src/game/runtimeMutatorEffects.ts";
import type { DynamicMidSectorEventId } from "../../src/game/dynamicMidSectorEventIdentity.ts";
import type { InfiniteMutator } from "../../src/game/infiniteSectorDirector.ts";

const EXPECTED_MAPPINGS: Readonly<
  Record<Exclude<DynamicMidSectorEventId, "DYSON_ECLIPSE">, InfiniteMutator>
> = {
  SOLAR_STORM: "ELECTRICAL_STORM",
  QUANTUM_RIFT: "MAGNETIC_DRIFT",
  BLACKOUT_SURGE: "REDUCED_VISIBILITY",
  CRYSTAL_RUSH: "UNSTABLE_RESOURCE_FIELDS",
};

const createSector11Wave2State = (seed: string): RuntimeProgressionState => {
  const wave1 = createInfiniteRuntimeState(createInfiniteSession(seed));
  const wave2 = advanceInfiniteRuntimeState(wave1);
  assert.equal(wave2.mode, "INFINITE");
  assert.equal(wave2.session.currentSector, 11);
  assert.equal(wave2.session.currentWaveNumber, 2);
  assert.equal(wave2.session.currentPlan.executionPlans.length, 3);
  return wave2;
};

const findEventState = (
  eventId: DynamicMidSectorEventId,
  requireMappedMutatorAbsent = false,
) => {
  for (let index = 0; index < 500; index += 1) {
    const seed = `j6bd-${eventId.toLowerCase()}-${index}`;
    const state = createSector11Wave2State(seed);
    const descriptor = resolveRuntimeWaveDescriptor(state);
    const result = applyDynamicMidSectorEventRuntimeAdoption(state, descriptor);
    const adoption = result.adoption;
    if (!adoption || adoption.eventId !== eventId) continue;

    if (
      requireMappedMutatorAbsent &&
      adoption.status === "MAPPED" &&
      descriptor.modifiers.includes(adoption.mappedMutator)
    ) {
      continue;
    }

    return {
      seed,
      state,
      descriptor,
      result,
    };
  }

  throw new Error(`Unable to find deterministic J6B-D sample for ${eventId}`);
};

test("Campaign remains byte-for-byte outside J6B-D adoption", () => {
  const state = createCampaignRuntimeState(4);
  const descriptor = resolveRuntimeWaveDescriptor(state);
  const result = applyDynamicMidSectorEventRuntimeAdoption(state, descriptor);

  assert.equal(result.adoption, null);
  assert.equal(result.descriptor, descriptor);
});

test("J6B-D adopts each mapped identity by appending only its already-existing mutator", () => {
  for (const [eventId, expectedMutator] of Object.entries(EXPECTED_MAPPINGS) as Array<
    [Exclude<DynamicMidSectorEventId, "DYSON_ECLIPSE">, InfiniteMutator]
  >) {
    const sample = findEventState(eventId, true);
    const before = JSON.stringify(sample.descriptor);
    const adoption = sample.result.adoption;

    assert.ok(adoption);
    assert.equal(adoption.status, "MAPPED");
    if (adoption.status !== "MAPPED") throw new Error("expected mapped adoption");
    assert.equal(adoption.mappedMutator, expectedMutator);
    assert.equal(adoption.addsMappedMutator, true);
    assert.equal(adoption.appliesExistingMutatorSemantics, true);
    assert.equal(adoption.adoptionMode, "CURRENT_WAVE_ONLY");
    assert.equal(adoption.ownsClock, false);
    assert.equal(adoption.ownsRandomness, false);
    assert.equal(adoption.ownsLifecycleTimer, false);
    assert.equal(adoption.mutatesRecipe, false);
    assert.equal(adoption.mutatesSession, false);
    assert.equal(adoption.mutatesEntities, false);
    assert.equal(adoption.mutatesEnvironmentDirectly, false);
    assert.equal(adoption.changesSpawnAuthority, false);
    assert.equal(adoption.changesBudgetAuthority, false);
    assert.equal(adoption.changesCombatEconomyAuthority, false);

    assert.equal(JSON.stringify(sample.descriptor), before);
    assert.notEqual(sample.result.descriptor, sample.descriptor);
    assert.equal(
      sample.result.descriptor.modifiers.filter((value) => value === expectedMutator).length,
      1,
    );
    assert.deepEqual(sample.result.descriptor.spawn, sample.descriptor.spawn);
    assert.deepEqual(sample.result.descriptor.pressure, sample.descriptor.pressure);
    assert.deepEqual(sample.result.descriptor.rewards, sample.descriptor.rewards);
    assert.deepEqual(sample.result.descriptor.milestone, sample.descriptor.milestone);
    assert.deepEqual(sample.result.descriptor.fairness, sample.descriptor.fairness);
    assert.deepEqual(sample.result.descriptor.source, sample.descriptor.source);
    assert.equal(sample.result.descriptor.biomeIntent, sample.descriptor.biomeIntent);
    assert.deepEqual(
      sample.result.descriptor.completionPolicy,
      sample.descriptor.completionPolicy,
    );
    assert.match(sample.result.descriptor.descriptorId, /:j6bd:/);
    assert.match(sample.result.descriptor.display.description, /Dynamic event:/);

    assert.equal(
      adoption.telegraphMode,
      expectedMutator === "ELECTRICAL_STORM"
        ? "EXISTING_EFFECT_TELEGRAPH"
        : "WAVE_ANNOUNCEMENT",
    );
  }
});

test("an already-active mapped mutator is never duplicated", () => {
  const sample = findEventState("SOLAR_STORM", true);
  const descriptor = {
    ...sample.descriptor,
    modifiers: [...sample.descriptor.modifiers, "ELECTRICAL_STORM"],
  };
  const result = applyDynamicMidSectorEventRuntimeAdoption(sample.state, descriptor);
  const adoption = result.adoption;

  assert.ok(adoption);
  assert.equal(adoption.status, "MAPPED");
  if (adoption.status !== "MAPPED") throw new Error("expected mapped adoption");
  assert.equal(adoption.addsMappedMutator, false);
  assert.equal(
    result.descriptor.modifiers.filter((value) => value === "ELECTRICAL_STORM").length,
    1,
  );
});

test("DYSON_ECLIPSE stays explicitly UNMAPPED and never changes the runtime descriptor", () => {
  const sample = findEventState("DYSON_ECLIPSE");
  const adoption = sample.result.adoption;

  assert.ok(adoption);
  assert.equal(adoption.status, "UNMAPPED");
  if (adoption.status !== "UNMAPPED") throw new Error("expected unmapped adoption");
  assert.equal(adoption.mappedMutator, null);
  assert.equal(adoption.addsMappedMutator, false);
  assert.equal(adoption.appliesExistingMutatorSemantics, false);
  assert.equal(adoption.telegraphMode, "WAVE_ANNOUNCEMENT");
  assert.equal(sample.result.descriptor, sample.descriptor);
});

test("J6B-D lifecycle exists only on the selected interior wave and expires by state advance", () => {
  const sample = findEventState("BLACKOUT_SURGE", true);
  const wave1 = createInfiniteRuntimeState(createInfiniteSession(sample.seed));
  const wave2 = advanceInfiniteRuntimeState(wave1);
  const wave3 = advanceInfiniteRuntimeState(wave2);

  const wave1Result = applyDynamicMidSectorEventRuntimeAdoption(
    wave1,
    resolveRuntimeWaveDescriptor(wave1),
  );
  const wave2Result = applyDynamicMidSectorEventRuntimeAdoption(
    wave2,
    resolveRuntimeWaveDescriptor(wave2),
  );
  const wave3Result = applyDynamicMidSectorEventRuntimeAdoption(
    wave3,
    resolveRuntimeWaveDescriptor(wave3),
  );

  assert.equal(wave1Result.adoption, null);
  assert.ok(wave2Result.adoption);
  assert.equal(wave2Result.adoption?.eventId, "BLACKOUT_SURGE");
  assert.equal(wave3Result.adoption, null);
});

test("missing source identity or mismatched runtime cursor fails closed", () => {
  const sample = findEventState("CRYSTAL_RUSH", true);

  for (const descriptor of [
    {
      ...sample.descriptor,
      source: { ...sample.descriptor.source, seed: null },
    },
    {
      ...sample.descriptor,
      source: { ...sample.descriptor.source, recipeId: null },
    },
    {
      ...sample.descriptor,
      waveNumber: sample.descriptor.waveNumber + 1,
    },
  ]) {
    const result = applyDynamicMidSectorEventRuntimeAdoption(sample.state, descriptor);
    assert.equal(result.adoption, null);
    assert.equal(result.descriptor, descriptor);
  }
});

test("projection-cache integration delegates live semantics to existing mutator authority without changing pressure or budget", () => {
  const effectExpectations = [
    ["SOLAR_STORM", "ELECTRICAL_STORM", "electricalStormIntensity", 1],
    ["QUANTUM_RIFT", "MAGNETIC_DRIFT", "magneticDriftStrength", 0.18],
    ["BLACKOUT_SURGE", "REDUCED_VISIBILITY", "visibilityScale", 0.7],
    ["CRYSTAL_RUSH", "UNSTABLE_RESOURCE_FIELDS", "resourceFieldInstability", 0.3],
  ] as const;

  for (const [eventId, mappedMutator, effectKey, expectedValue] of effectExpectations) {
    const sample = findEventState(eventId, true);
    const cache = createRuntimeProjectionBundleCache();
    const bundle = getCachedRuntimeProjectionBundle(cache, sample.state);
    const basePressure = projectRuntimeCombatPressure(sample.descriptor);
    const baseBudget = getRuntimeMutatedEnemyBudget(sample.descriptor);

    assert.equal(bundle.dynamicEventAdoption?.status, "MAPPED");
    assert.equal(bundle.dynamicEventAdoption?.eventId, eventId);
    assert.equal(
      bundle.dynamicEventAdoption?.status === "MAPPED"
        ? bundle.dynamicEventAdoption.mappedMutator
        : null,
      mappedMutator,
    );
    assert.equal(bundle.descriptor.modifiers.includes(mappedMutator), true);
    assert.equal(bundle.mutatorEffects[effectKey], expectedValue);
    assert.deepEqual(bundle.combatPressure, basePressure);
    assert.equal(bundle.enemyBudget, baseBudget);
  }
});

test("projection cache preserves explicit unmapped attribution without activating an effect", () => {
  const sample = findEventState("DYSON_ECLIPSE");
  const cache = createRuntimeProjectionBundleCache();
  const bundle = getCachedRuntimeProjectionBundle(cache, sample.state);

  assert.equal(bundle.dynamicEventAdoption?.status, "UNMAPPED");
  assert.equal(bundle.dynamicEventAdoption?.eventId, "DYSON_ECLIPSE");
  assert.deepEqual(bundle.descriptor, sample.descriptor);
});

test("J6B-D authority contract owns only live adoption and descriptor modifier overlay authority", () => {
  assert.deepEqual(DYNAMIC_MID_SECTOR_EVENT_RUNTIME_ADOPTION_AUTHORITY_CONTRACT, {
    ownsLiveAdoptionAuthority: true,
    ownsDescriptorModifierOverlayAuthority: true,
    ownsOpportunitySelectionAuthority: false,
    ownsEventSelectionAuthority: false,
    ownsCompatibilityMappingAuthority: false,
    ownsMutatorMagnitudeAuthority: false,
    ownsEnvironmentAuthority: false,
    ownsRecipeAuthority: false,
    ownsSpawnAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
  assert.equal(
    Object.isFrozen(DYNAMIC_MID_SECTOR_EVENT_RUNTIME_ADOPTION_AUTHORITY_CONTRACT),
    true,
  );
});
