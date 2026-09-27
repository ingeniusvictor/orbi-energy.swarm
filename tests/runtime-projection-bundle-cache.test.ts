import assert from "node:assert/strict";
import test from "node:test";

import {
  createRuntimeProjectionBundleCache,
  getCachedRuntimeProjectionBundle,
} from "../src/game/runtimeProjectionBundleCache.ts";
import {
  createCampaignRuntimeState,
  resolveRuntimeWaveDescriptor,
} from "../src/game/runtimeProgressionRouter.ts";
import { projectRuntimeCombatPressure } from "../src/game/runtimeCombatPressure.ts";
import {
  getRuntimeMutatedEnemyBudget,
  projectRuntimeMutatorEffects,
} from "../src/game/runtimeMutatorEffects.ts";
import { projectInfiniteMilestoneEncounter } from "../src/game/runtimeMilestoneEncounter.ts";

test("first cache access exactly matches all canonical projection authorities", () => {
  const cache = createRuntimeProjectionBundleCache();
  const state = createCampaignRuntimeState(4);
  const bundle = getCachedRuntimeProjectionBundle(
    cache,
    state,
  );
  const descriptor = resolveRuntimeWaveDescriptor(state);

  assert.deepEqual(bundle.descriptor, descriptor);
  assert.deepEqual(
    bundle.combatPressure,
    projectRuntimeCombatPressure(descriptor),
  );
  assert.deepEqual(
    bundle.mutatorEffects,
    projectRuntimeMutatorEffects(descriptor),
  );
  assert.equal(
    bundle.enemyBudget,
    getRuntimeMutatedEnemyBudget(descriptor),
  );
  assert.deepEqual(
    bundle.milestoneEncounter,
    projectInfiniteMilestoneEncounter(descriptor),
  );
});

test("repeated access for one runtime state returns the same bundle identity", () => {
  const cache = createRuntimeProjectionBundleCache();
  const state = createCampaignRuntimeState(3);

  const first = getCachedRuntimeProjectionBundle(
    cache,
    state,
  );
  const second = getCachedRuntimeProjectionBundle(
    cache,
    state,
  );

  assert.equal(second, first);
  assert.equal(second.descriptor, first.descriptor);
  assert.equal(
    second.combatPressure,
    first.combatPressure,
  );
  assert.equal(
    second.mutatorEffects,
    first.mutatorEffects,
  );
});

test("new runtime state identity creates a fresh bundle even for equivalent sector data", () => {
  const cache = createRuntimeProjectionBundleCache();
  const firstState = createCampaignRuntimeState(3);
  const secondState = createCampaignRuntimeState(3);

  const first = getCachedRuntimeProjectionBundle(
    cache,
    firstState,
  );
  const second = getCachedRuntimeProjectionBundle(
    cache,
    secondState,
  );

  assert.notEqual(second, first);
  assert.notEqual(second.descriptor, first.descriptor);
  assert.deepEqual(second, first);
});

test("different campaign sectors never alias cached projections", () => {
  const cache = createRuntimeProjectionBundleCache();
  const first = getCachedRuntimeProjectionBundle(
    cache,
    createCampaignRuntimeState(1),
  );
  const second = getCachedRuntimeProjectionBundle(
    cache,
    createCampaignRuntimeState(2),
  );

  assert.notEqual(first, second);
  assert.notEqual(
    first.descriptor.descriptorId,
    second.descriptor.descriptorId,
  );
  assert.notEqual(
    first.descriptor.sector,
    second.descriptor.sector,
  );
});

test("fresh cache recomputes equivalent bundle from the same immutable runtime state", () => {
  const state = createCampaignRuntimeState(6);
  const first = getCachedRuntimeProjectionBundle(
    createRuntimeProjectionBundleCache(),
    state,
  );
  const second = getCachedRuntimeProjectionBundle(
    createRuntimeProjectionBundleCache(),
    state,
  );

  assert.notEqual(first, second);
  assert.deepEqual(first, second);
});

test("campaign bundle preserves null Infinite milestone semantics", () => {
  const cache = createRuntimeProjectionBundleCache();
  const bundle = getCachedRuntimeProjectionBundle(
    cache,
    createCampaignRuntimeState(7),
  );

  assert.equal(
    bundle.descriptor.sourceMode,
    "CAMPAIGN",
  );
  assert.equal(bundle.milestoneEncounter, null);
  assert.equal(
    bundle.enemyBudget,
    bundle.descriptor.spawn.enemyBudget,
  );
});
