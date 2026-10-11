import assert from "node:assert/strict";
import test from "node:test";

import { EnemyType, type OrbiAffinity } from "../src/game/types.ts";
import {
  ECLIPSE_PARASITE_SPEED_MULTIPLIER,
  ECLIPSE_SOLAR_RECHARGE_MULTIPLIER,
  getEclipseEnemyMovementMultiplier,
  getEclipseSolarCooldownRecoveryMultiplier,
  projectRuntimeEclipse,
} from "../src/game/runtimeEclipse.ts";
import { projectRuntimeMutatorEffects } from "../src/game/runtimeMutatorEffects.ts";
import {
  createCampaignRuntimeWaveDescriptor,
  createInfiniteRuntimeWaveDescriptor,
} from "../src/game/runtimeWaveDescriptor.ts";
import { createInfiniteSession } from "../src/game/infiniteSession.ts";

const eclipseEffects = () => {
  const descriptor = createInfiniteRuntimeWaveDescriptor(
    createInfiniteSession("eclipse-runtime"),
  );

  return projectRuntimeMutatorEffects({
    ...descriptor,
    modifiers: ["REDUCED_VISIBILITY"],
  });
};

const neutralInfiniteEffects = () => {
  const descriptor = createInfiniteRuntimeWaveDescriptor(
    createInfiniteSession("eclipse-neutral"),
  );

  return projectRuntimeMutatorEffects({
    ...descriptor,
    modifiers: [],
  });
};

test("Eclipse activates only for Infinite Reduced Visibility and reuses H6 visibility", () => {
  const eclipse = projectRuntimeEclipse(eclipseEffects());
  assert.equal(eclipse.active, true);
  assert.equal(eclipse.identity, "ECLIPSE");
  assert.equal(eclipse.visibilityScale, 0.7);
  assert.equal(
    eclipse.solarCooldownRecoveryMultiplier,
    ECLIPSE_SOLAR_RECHARGE_MULTIPLIER,
  );
  assert.equal(
    eclipse.parasiteSpeedMultiplier,
    ECLIPSE_PARASITE_SPEED_MULTIPLIER,
  );

  const neutral = projectRuntimeEclipse(neutralInfiniteEffects());
  assert.deepEqual(neutral, {
    active: false,
    identity: null,
    visibilityScale: 1,
    solarCooldownRecoveryMultiplier: 1,
    parasiteSpeedMultiplier: 1,
  });
});

test("Campaign remains neutral even when descriptor modifiers mimic Reduced Visibility", () => {
  const descriptor = createCampaignRuntimeWaveDescriptor(5);
  const effects = projectRuntimeMutatorEffects({
    ...descriptor,
    modifiers: ["REDUCED_VISIBILITY"],
  });
  const eclipse = projectRuntimeEclipse(effects);

  assert.equal(eclipse.active, false);
  assert.equal(eclipse.identity, null);
  assert.equal(eclipse.visibilityScale, 1);
  assert.equal(eclipse.solarCooldownRecoveryMultiplier, 1);
  assert.equal(eclipse.parasiteSpeedMultiplier, 1);
});

test("Eclipse dampens only solar-affinity cooldown recovery", () => {
  const effects = eclipseEffects();
  const affinities: OrbiAffinity[] = [
    "solar",
    "hydro",
    "wind",
    "thermal",
    "magnetic",
    "nuclear",
    "kinetic",
    "hydrogen",
    "quantum",
    "gaia",
  ];

  for (const affinity of affinities) {
    assert.equal(
      getEclipseSolarCooldownRecoveryMultiplier(effects, affinity),
      affinity === "solar" ? 0.82 : 1,
    );
  }

  assert.equal(
    getEclipseSolarCooldownRecoveryMultiplier(effects, undefined),
    1,
  );
});

test("Eclipse accelerates only PARASITE movement", () => {
  const effects = eclipseEffects();

  for (const enemyType of Object.values(EnemyType)) {
    assert.equal(
      getEclipseEnemyMovementMultiplier(effects, enemyType),
      enemyType === EnemyType.PARASITE ? 1.12 : 1,
    );
  }
});

test("Eclipse helpers fail neutral outside the event", () => {
  const effects = neutralInfiniteEffects();

  assert.equal(
    getEclipseSolarCooldownRecoveryMultiplier(effects, "solar"),
    1,
  );
  assert.equal(
    getEclipseEnemyMovementMultiplier(effects, EnemyType.PARASITE),
    1,
  );
});
