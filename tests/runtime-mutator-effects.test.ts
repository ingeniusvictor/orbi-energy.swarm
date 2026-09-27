import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceInfiniteSession,
  createInfiniteSession,
} from "../src/game/infiniteSession.ts";
import type { InfiniteMutator } from "../src/game/infiniteSectorDirector.ts";
import {
  getRuntimeMutatedEnemyBudget,
  projectRuntimeMutatorEffects,
} from "../src/game/runtimeMutatorEffects.ts";
import {
  createCampaignRuntimeWaveDescriptor,
  createInfiniteRuntimeWaveDescriptor,
} from "../src/game/runtimeWaveDescriptor.ts";

const ALL_MUTATORS: InfiniteMutator[] = [
  "ELECTRICAL_STORM",
  "REDUCED_VISIBILITY",
  "MAGNETIC_DRIFT",
  "ACCELERATED_ENEMIES",
  "REGENERATIVE_ENEMIES",
  "FRAGILE_SWARM",
  "UNSTABLE_RESOURCE_FIELDS",
  "FORMATION_DISRUPTION",
  "ELITE_BURST",
  "DOUBLE_THREAT",
];

const profileFor = (mutator: InfiniteMutator) => {
  const descriptor =
    createInfiniteRuntimeWaveDescriptor(
      createInfiniteSession("mutator-profile"),
    );

  return projectRuntimeMutatorEffects({
    ...descriptor,
    modifiers: [mutator],
  });
};

test("campaign descriptors always project a neutral mutator profile", () => {
  for (let sector = 1; sector <= 10; sector += 1) {
    const profile = projectRuntimeMutatorEffects(
      createCampaignRuntimeWaveDescriptor(sector),
    );

    assert.equal(profile.sourceMode, "CAMPAIGN");
    assert.deepEqual(profile.activeMutators, []);
    assert.equal(profile.enemySpeedMultiplier, 1);
    assert.equal(profile.enemyRegenFractionPerSecond, 0);
    assert.equal(profile.incomingDamageMultiplier, 1);
    assert.equal(profile.formationCohesionMultiplier, 1);
    assert.equal(profile.eliteChanceBonus, 0);
    assert.equal(profile.enemyBudgetMultiplier, 1);
    assert.equal(profile.electricalStormIntensity, 0);
    assert.equal(profile.visibilityScale, 1);
    assert.equal(profile.magneticDriftStrength, 0);
    assert.equal(profile.resourceFieldInstability, 0);
  }
});

test("each combat mutator maps to one explicit bounded effect", () => {
  assert.equal(
    profileFor("ACCELERATED_ENEMIES")
      .enemySpeedMultiplier,
    1.18,
  );
  assert.equal(
    profileFor("REGENERATIVE_ENEMIES")
      .enemyRegenFractionPerSecond,
    0.006,
  );
  assert.equal(
    profileFor("FRAGILE_SWARM")
      .incomingDamageMultiplier,
    1.2,
  );
  assert.equal(
    profileFor("FORMATION_DISRUPTION")
      .formationCohesionMultiplier,
    0.72,
  );
  assert.equal(
    profileFor("ELITE_BURST").eliteChanceBonus,
    0.12,
  );
  assert.equal(
    profileFor("DOUBLE_THREAT").enemyBudgetMultiplier,
    1.35,
  );
});

test("environmental mutators have explicit deferred effect parameters", () => {
  assert.equal(
    profileFor("ELECTRICAL_STORM")
      .electricalStormIntensity,
    1,
  );
  assert.equal(
    profileFor("REDUCED_VISIBILITY").visibilityScale,
    0.7,
  );
  assert.equal(
    profileFor("MAGNETIC_DRIFT").magneticDriftStrength,
    0.18,
  );
  assert.equal(
    profileFor("UNSTABLE_RESOURCE_FIELDS")
      .resourceFieldInstability,
    0.3,
  );
});

test("combined mutators remain finite and within certified caps", () => {
  const descriptor =
    createInfiniteRuntimeWaveDescriptor(
      createInfiniteSession("all-mutators"),
    );
  const profile = projectRuntimeMutatorEffects({
    ...descriptor,
    modifiers: [...ALL_MUTATORS],
  });

  assert.deepEqual(
    new Set(profile.activeMutators),
    new Set(ALL_MUTATORS),
  );

  const finiteValues = [
    profile.enemySpeedMultiplier,
    profile.enemyRegenFractionPerSecond,
    profile.incomingDamageMultiplier,
    profile.formationCohesionMultiplier,
    profile.eliteChanceBonus,
    profile.enemyBudgetMultiplier,
    profile.electricalStormIntensity,
    profile.visibilityScale,
    profile.magneticDriftStrength,
    profile.resourceFieldInstability,
  ];

  for (const value of finiteValues) {
    assert.equal(Number.isFinite(value), true);
  }

  assert.ok(profile.enemySpeedMultiplier <= 1.25);
  assert.ok(
    profile.enemyRegenFractionPerSecond <= 0.01,
  );
  assert.ok(profile.incomingDamageMultiplier <= 1.25);
  assert.ok(
    profile.formationCohesionMultiplier >= 0.65,
  );
  assert.ok(profile.eliteChanceBonus <= 0.15);
  assert.ok(profile.enemyBudgetMultiplier <= 1.4);
  assert.ok(profile.electricalStormIntensity <= 1);
  assert.ok(profile.visibilityScale >= 0.6);
  assert.ok(profile.magneticDriftStrength <= 0.25);
  assert.ok(profile.resourceFieldInstability <= 0.4);
});

test("unknown modifier strings fail neutral instead of becoming implicit mutators", () => {
  const descriptor =
    createInfiniteRuntimeWaveDescriptor(
      createInfiniteSession("unknown-mutator"),
    );
  const profile = projectRuntimeMutatorEffects({
    ...descriptor,
    modifiers: ["FUTURE_UNKNOWN_MUTATOR"],
  });

  assert.deepEqual(profile.activeMutators, []);
  assert.equal(profile.enemySpeedMultiplier, 1);
  assert.equal(profile.incomingDamageMultiplier, 1);
  assert.equal(profile.enemyBudgetMultiplier, 1);
});

test("generated Infinite Swarm profiles remain bounded through Sector 1000", () => {
  let session = createInfiniteSession(
    "mutator-projection-long-run",
  );

  while (session.currentSector <= 1000) {
    const descriptor =
      createInfiniteRuntimeWaveDescriptor(session);
    const profile =
      projectRuntimeMutatorEffects(descriptor);

    assert.ok(profile.enemySpeedMultiplier >= 1);
    assert.ok(profile.enemySpeedMultiplier <= 1.25);
    assert.ok(
      profile.enemyRegenFractionPerSecond >= 0 &&
        profile.enemyRegenFractionPerSecond <= 0.01,
    );
    assert.ok(
      profile.incomingDamageMultiplier >= 1 &&
        profile.incomingDamageMultiplier <= 1.25,
    );
    assert.ok(
      profile.formationCohesionMultiplier >= 0.65 &&
        profile.formationCohesionMultiplier <= 1,
    );
    assert.ok(
      profile.eliteChanceBonus >= 0 &&
        profile.eliteChanceBonus <= 0.15,
    );
    assert.ok(
      profile.enemyBudgetMultiplier >= 1 &&
        profile.enemyBudgetMultiplier <= 1.4,
    );

    session = advanceInfiniteSession(session);
  }
});


test("mutator-adjusted enemy budget preserves campaign and scales DOUBLE_THREAT consistently", () => {
  const campaign =
    createCampaignRuntimeWaveDescriptor(5);
  assert.equal(
    getRuntimeMutatedEnemyBudget(campaign),
    campaign.spawn.enemyBudget,
  );

  const baseInfinite =
    createInfiniteRuntimeWaveDescriptor(
      createInfiniteSession("double-threat-budget"),
    );

  const neutral = {
    ...baseInfinite,
    modifiers: baseInfinite.modifiers.filter(
      (modifier) => modifier !== "DOUBLE_THREAT",
    ),
    spawn: {
      ...baseInfinite.spawn,
      enemyBudget: 100,
    },
  };

  assert.equal(
    getRuntimeMutatedEnemyBudget(neutral),
    100,
  );

  const doubleThreat = {
    ...neutral,
    modifiers: ["DOUBLE_THREAT"],
  };

  assert.equal(
    getRuntimeMutatedEnemyBudget(doubleThreat),
    135,
  );
});

test("DOUBLE_THREAT effective enemy budget is hard-capped for runtime safety", () => {
  const descriptor =
    createInfiniteRuntimeWaveDescriptor(
      createInfiniteSession("double-threat-cap"),
    );

  const capped = {
    ...descriptor,
    modifiers: ["DOUBLE_THREAT"],
    spawn: {
      ...descriptor.spawn,
      enemyBudget: 180,
    },
  };

  assert.equal(
    getRuntimeMutatedEnemyBudget(capped),
    240,
  );
});
