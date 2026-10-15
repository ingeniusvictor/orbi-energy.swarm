import assert from "node:assert/strict";
import test from "node:test";

import { projectCommandLinkCombatEffect } from "../../src/game/commandLinkCombatEffectContract.ts";
import { resolveCommandLinkBreakResolution } from "../../src/game/commandLinkBreakResolution.ts";
import {
  COMMAND_LINK_PULSE_DAMAGE_SAFETY_AUTHORITY_CONTRACT,
  projectCommandLinkPulseDamageSafety,
} from "../../src/game/commandLinkPulseDamageSafety.ts";
import {
  resolveCommandLinkPulseTargetEligibility,
  type CommandLinkPulseTargetEligibility,
} from "../../src/game/commandLinkPulseTargetEligibility.ts";

const resolveEligibility = (
  memberCount: 2 | 3,
  memberIndex: 1 | 2,
): Readonly<CommandLinkPulseTargetEligibility> => {
  const groupId = `damage-safety:${memberCount}`;
  const breakResolution = resolveCommandLinkBreakResolution({
    groupId,
    memberIndex: 0,
    memberCount,
  });
  assert.ok(breakResolution);

  const effectProjection = projectCommandLinkCombatEffect(
    breakResolution,
    "CURRENT",
  );
  assert.ok(effectProjection);

  const eligibility = resolveCommandLinkPulseTargetEligibility(
    effectProjection,
    { groupId, memberIndex, memberCount },
    true,
  );
  assert.ok(eligibility);
  return eligibility;
};

const asEligibility = (
  value: Record<string, unknown>,
): Readonly<CommandLinkPulseTargetEligibility> =>
  value as unknown as Readonly<CommandLinkPulseTargetEligibility>;

test("valid eligible target projects caller-proposed damage without mutation", () => {
  const eligibility = resolveEligibility(2, 1);
  const before = JSON.stringify(eligibility);

  const projection = projectCommandLinkPulseDamageSafety(
    eligibility,
    10,
    20,
    3,
  );

  assert.ok(projection);
  assert.deepEqual(projection, {
    groupId: "damage-safety:2",
    effectId: "COMMAND_LINK_DISRUPTION_PULSE",
    intent: "PULSE_LINKED_MEMBERS",
    targetRole: "LINKED_MEMBER",
    sourceEligibilityMode: "ELIGIBLE_ONLY",
    sourceBindingMode: "BINDING_ONLY",
    damageSafetyMode: "NON_LETHAL_PROJECTION_ONLY",
    memberIndex: 1,
    memberCount: 2,
    currentHealth: 10,
    maxHealth: 20,
    proposedDamage: 3,
    safeDamage: 3,
    resultingHealth: 7,
    healthFloor: 1,
    canKill: false,
    mutatesHealth: false,
    registersDefeat: false,
    awardsScore: false,
    awardsRewards: false,
    spawnsProjectiles: false,
    mutatesFormation: false,
  });
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(JSON.stringify(eligibility), before);
});

test("lethal and overkill proposals clamp to exactly one resulting HP", () => {
  const eligibility = resolveEligibility(3, 2);

  for (const proposedDamage of [9, 10, 1000]) {
    const projection = projectCommandLinkPulseDamageSafety(
      eligibility,
      10,
      10,
      proposedDamage,
    );
    assert.ok(projection);
    assert.equal(projection.safeDamage, 9);
    assert.equal(projection.resultingHealth, 1);
    assert.equal(projection.canKill, false);
    assert.equal(projection.registersDefeat, false);
  }
});

test("one HP floor returns zero safe damage and never a kill", () => {
  const eligibility = resolveEligibility(2, 1);
  const projection = projectCommandLinkPulseDamageSafety(
    eligibility,
    1,
    20,
    500,
  );

  assert.ok(projection);
  assert.equal(projection.safeDamage, 0);
  assert.equal(projection.resultingHealth, 1);
  assert.equal(projection.healthFloor, 1);
  assert.equal(projection.canKill, false);
});

test("fractional health at or above one is supported without crossing the floor", () => {
  const eligibility = resolveEligibility(3, 1);
  const projection = projectCommandLinkPulseDamageSafety(
    eligibility,
    1.25,
    8.5,
    0.5,
  );

  assert.ok(projection);
  assert.equal(projection.safeDamage, 0.25);
  assert.equal(projection.resultingHealth, 1);
});

test("fractional current health below one fails closed instead of healing", () => {
  const eligibility = resolveEligibility(2, 1);

  for (const currentHealth of [0.999, 0.5, Number.MIN_VALUE]) {
    assert.equal(
      projectCommandLinkPulseDamageSafety(
        eligibility,
        currentHealth,
        10,
        1,
      ),
      null,
    );
  }
});

test("invalid scalar inputs fail closed", () => {
  const eligibility = resolveEligibility(2, 1);
  const invalidInputs: readonly [number, number, number][] = [
    [Number.NaN, 10, 1],
    [Number.POSITIVE_INFINITY, 10, 1],
    [10, Number.NaN, 1],
    [10, Number.POSITIVE_INFINITY, 1],
    [10, 10, Number.NaN],
    [10, 10, Number.POSITIVE_INFINITY],
    [10, 10, 0],
    [10, 10, -1],
    [10, 0.5, 1],
    [11, 10, 1],
  ];

  for (const [currentHealth, maxHealth, proposedDamage] of invalidInputs) {
    assert.equal(
      projectCommandLinkPulseDamageSafety(
        eligibility,
        currentHealth,
        maxHealth,
        proposedDamage,
      ),
      null,
    );
  }

  assert.equal(
    projectCommandLinkPulseDamageSafety(null, 10, 10, 1),
    null,
  );
  assert.equal(
    projectCommandLinkPulseDamageSafety(undefined, 10, 10, 1),
    null,
  );
});

test("malformed J5F-B eligibility semantics fail closed", () => {
  const base = resolveEligibility(3, 1);
  const invalid = [
    { ...base, groupId: "" },
    { ...base, groupId: " padded " },
    { ...base, effectId: "OTHER" },
    { ...base, intent: "OTHER" },
    { ...base, sourceEffectMode: "OTHER" },
    { ...base, targetRole: "COMMAND_CORE" },
    { ...base, eligibilityMode: "OTHER" },
    { ...base, bindingMode: "OTHER" },
    { ...base, appliesDamage: true },
    { ...base, killsTarget: true },
    { ...base, registersDefeat: true },
    { ...base, awardsScore: true },
    { ...base, awardsRewards: true },
    { ...base, spawnsProjectiles: true },
    { ...base, mutatesFormation: true },
    { ...base, memberCount: 2, memberIndex: 2 },
    { ...base, memberCount: 3, memberIndex: 0 },
    { ...base, memberCount: 4, memberIndex: 1 },
    { ...base, memberIndex: 1.5 },
  ];

  for (const malformed of invalid) {
    assert.equal(
      projectCommandLinkPulseDamageSafety(
        asEligibility(malformed),
        10,
        10,
        2,
      ),
      null,
    );
  }
});

test("J5F-C authority contract owns no tuning live combat economy timing scan or mutation authority", () => {
  assert.deepEqual(COMMAND_LINK_PULSE_DAMAGE_SAFETY_AUTHORITY_CONTRACT, {
    ownsTargetEligibilityAuthority: false,
    ownsDamageMagnitudeTuning: false,
    ownsHealthMutationAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsDropAuthority: false,
    ownsMilestoneAuthority: false,
    ownsBossDefeatAuthority: false,
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
    Object.isFrozen(COMMAND_LINK_PULSE_DAMAGE_SAFETY_AUTHORITY_CONTRACT),
    true,
  );
});
