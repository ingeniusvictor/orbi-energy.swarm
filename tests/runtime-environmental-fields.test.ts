import assert from "node:assert/strict";
import test from "node:test";

import {
  getReducedVisibilityOverlayProfile,
  getResourceFieldProfile,
} from "../src/game/runtimeEnvironmentalFields.ts";
import type { RuntimeMutatorEffectProfile } from "../src/game/runtimeMutatorEffects.ts";

const neutral: RuntimeMutatorEffectProfile = {
  sourceMode: "INFINITE",
  activeMutators: [],
  enemySpeedMultiplier: 1,
  enemyRegenFractionPerSecond: 0,
  incomingDamageMultiplier: 1,
  formationCohesionMultiplier: 1,
  eliteChanceBonus: 0,
  enemyBudgetMultiplier: 1,
  electricalStormIntensity: 0,
  visibilityScale: 1,
  magneticDriftStrength: 0,
  resourceFieldInstability: 0,
};

test("neutral visibility emits no battlefield overlay", () => {
  assert.equal(
    getReducedVisibilityOverlayProfile(
      neutral,
      800,
      480,
    ),
    null,
  );
});

test("reduced visibility preserves a bounded safe center", () => {
  const profile =
    getReducedVisibilityOverlayProfile(
      {
        ...neutral,
        visibilityScale: 0.7,
      },
      800,
      480,
    );

  assert.ok(profile);
  assert.ok(profile.innerRadius >= 110);
  assert.ok(
    profile.outerRadius >= profile.innerRadius + 110,
  );
  assert.ok(profile.outerAlpha > 0);
  assert.ok(profile.outerAlpha <= 0.58);
});

test("neutral resource field preserves legacy attraction and zero drift", () => {
  const profile = getResourceFieldProfile(
    neutral,
    12345,
    "resource-a",
  );

  assert.equal(
    profile.attractionRadiusMultiplier,
    1,
  );
  assert.equal(
    profile.attractionSpeedMultiplier,
    1,
  );
  assert.equal(profile.driftXPerFrame, 0);
  assert.equal(profile.driftYPerFrame, 0);
});

test("resource field behavior is deterministic for the same time and resource", () => {
  const effects = {
    ...neutral,
    magneticDriftStrength: 0.18,
    resourceFieldInstability: 0.3,
  };

  assert.deepEqual(
    getResourceFieldProfile(
      effects,
      54321,
      "resource-stable-seed",
    ),
    getResourceFieldProfile(
      effects,
      54321,
      "resource-stable-seed",
    ),
  );
});

test("unstable attraction remains collectible and magnetic drift remains bounded", () => {
  const effects = {
    ...neutral,
    magneticDriftStrength: 0.25,
    resourceFieldInstability: 0.4,
  };

  for (let timeMs = 0; timeMs <= 60000; timeMs += 250) {
    const profile = getResourceFieldProfile(
      effects,
      timeMs,
      "resource-bounded",
    );

    assert.ok(
      profile.attractionRadiusMultiplier >= 0.82,
    );
    assert.ok(
      profile.attractionRadiusMultiplier <= 1.08,
    );
    assert.ok(
      profile.attractionSpeedMultiplier >= 0.82,
    );
    assert.ok(
      profile.attractionSpeedMultiplier <= 1.18,
    );
    assert.ok(
      Math.abs(profile.driftXPerFrame) <= 0.5,
    );
    assert.ok(
      Math.abs(profile.driftYPerFrame) <= 0.375,
    );
  }
});

test("different resource ids dephase field motion without randomness", () => {
  const effects = {
    ...neutral,
    magneticDriftStrength: 0.18,
    resourceFieldInstability: 0.3,
  };

  const a = getResourceFieldProfile(
    effects,
    20000,
    "resource-a",
  );
  const b = getResourceFieldProfile(
    effects,
    20000,
    "resource-b",
  );

  assert.notDeepEqual(a, b);
});
