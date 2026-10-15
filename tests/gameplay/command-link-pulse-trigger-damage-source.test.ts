import assert from "node:assert/strict";
import test from "node:test";

import {
  COMMAND_LINK_PULSE_TRIGGER_DAMAGE_SOURCE_AUTHORITY_CONTRACT,
  projectCommandLinkPulseTriggerDamageSource,
  type CommandLinkPulseTriggerDamageSourceKind,
} from "../../src/game/commandLinkPulseTriggerDamageSource.ts";

const projectRuntimeKind = (
  sourceKind: string,
  resolvedSourceDamage: number,
  sourceHealthBeforeHit: number,
) =>
  projectCommandLinkPulseTriggerDamageSource(
    sourceKind as CommandLinkPulseTriggerDamageSourceKind,
    resolvedSourceDamage,
    sourceHealthBeforeHit,
  );

test("direct hit projects exact resolved source damage when it does not overkill", () => {
  const projection = projectCommandLinkPulseTriggerDamageSource(
    "DIRECT_HIT",
    3,
    8,
  );

  assert.ok(projection);
  assert.deepEqual(projection, {
    sourceKind: "DIRECT_HIT",
    sourceMode: "EFFECTIVE_TRIGGER_DAMAGE_ONLY",
    resolvedSourceDamage: 3,
    sourceHealthBeforeHit: 8,
    effectiveTriggerDamage: 3,
    proposedPulseDamage: 3,
    transfersOverkill: false,
    appliesDamage: false,
    mutatesHealth: false,
    registersDefeat: false,
    awardsScore: false,
    awardsRewards: false,
    awardsDrops: false,
    spawnsProjectiles: false,
    mutatesFormation: false,
  });
  assert.equal(Object.isFrozen(projection), true);
});

test("direct-hit overkill is capped at source health before the defeating hit", () => {
  const projection = projectCommandLinkPulseTriggerDamageSource(
    "DIRECT_HIT",
    10,
    4,
  );

  assert.ok(projection);
  assert.equal(projection.effectiveTriggerDamage, 4);
  assert.equal(projection.proposedPulseDamage, 4);
  assert.equal(projection.transfersOverkill, false);
});

test("splash hit uses its already-resolved scalar without adding tuning", () => {
  const projection = projectCommandLinkPulseTriggerDamageSource(
    "SPLASH_HIT",
    1.5,
    2,
  );

  assert.ok(projection);
  assert.equal(projection.sourceKind, "SPLASH_HIT");
  assert.equal(projection.effectiveTriggerDamage, 1.5);
  assert.equal(projection.proposedPulseDamage, 1.5);
});

test("fractional positive source health is valid and bounds overkill", () => {
  const projection = projectCommandLinkPulseTriggerDamageSource(
    "SPLASH_HIT",
    5,
    0.5,
  );

  assert.ok(projection);
  assert.equal(projection.effectiveTriggerDamage, 0.5);
  assert.equal(projection.proposedPulseDamage, 0.5);
});

test("unsupported source kinds fail closed", () => {
  for (const sourceKind of ["", "direct_hit", "CHAIN_REACTION", "OTHER"]) {
    assert.equal(projectRuntimeKind(sourceKind, 2, 2), null);
  }
});

test("non-finite zero and negative source scalars fail closed", () => {
  const invalidInputs: readonly [number, number][] = [
    [Number.NaN, 2],
    [Number.POSITIVE_INFINITY, 2],
    [Number.NEGATIVE_INFINITY, 2],
    [0, 2],
    [-1, 2],
    [2, Number.NaN],
    [2, Number.POSITIVE_INFINITY],
    [2, Number.NEGATIVE_INFINITY],
    [2, 0],
    [2, -1],
  ];

  for (const [resolvedSourceDamage, sourceHealthBeforeHit] of invalidInputs) {
    assert.equal(
      projectCommandLinkPulseTriggerDamageSource(
        "DIRECT_HIT",
        resolvedSourceDamage,
        sourceHealthBeforeHit,
      ),
      null,
    );
  }
});

test("J5F-D authority contract owns no tuning live combat economy timing scan or mutation authority", () => {
  assert.deepEqual(COMMAND_LINK_PULSE_TRIGGER_DAMAGE_SOURCE_AUTHORITY_CONTRACT, {
    ownsSourceCaptureAuthority: false,
    ownsDamageMagnitudeTuning: false,
    ownsTargetEligibilityAuthority: false,
    ownsHealthMutationAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsDropAuthority: false,
    ownsFormationAuthority: false,
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
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
    Object.isFrozen(COMMAND_LINK_PULSE_TRIGGER_DAMAGE_SOURCE_AUTHORITY_CONTRACT),
    true,
  );
});
