import assert from "node:assert/strict";
import test from "node:test";

import {
  projectCommandLinkCombatEffect,
  type CommandLinkCombatEffectProjection,
} from "../../src/game/commandLinkCombatEffectContract.ts";
import { resolveCommandLinkBreakResolution } from "../../src/game/commandLinkBreakResolution.ts";
import {
  COMMAND_LINK_PULSE_TARGET_ELIGIBILITY_AUTHORITY_CONTRACT,
  resolveCommandLinkPulseTargetEligibility,
} from "../../src/game/commandLinkPulseTargetEligibility.ts";
import type { CommandLinkFormationFacts } from "../../src/game/commandLinkBinding.ts";

const resolveProjection = (memberCount: 2 | 3) => {
  const breakResolution = resolveCommandLinkBreakResolution({
    groupId: `command-link:${memberCount}`,
    memberIndex: 0,
    memberCount,
  });
  assert.ok(breakResolution);

  const projection = projectCommandLinkCombatEffect(breakResolution, "CURRENT");
  assert.ok(projection);
  return projection;
};

const asProjection = (
  input: Record<string, unknown>,
): Readonly<CommandLinkCombatEffectProjection> =>
  input as unknown as Readonly<CommandLinkCombatEffectProjection>;

const asFormation = (
  input: Record<string, unknown>,
): Readonly<CommandLinkFormationFacts> =>
  input as unknown as Readonly<CommandLinkFormationFacts>;

test("size-two linked member one is eligible only as metadata", () => {
  const projection = resolveProjection(2);
  const eligibility = resolveCommandLinkPulseTargetEligibility(
    projection,
    { groupId: "command-link:2", memberIndex: 1, memberCount: 2 },
    true,
  );

  assert.ok(eligibility);
  assert.deepEqual(eligibility, {
    groupId: "command-link:2",
    effectId: "COMMAND_LINK_DISRUPTION_PULSE",
    intent: "PULSE_LINKED_MEMBERS",
    sourceEffectMode: "PROPOSAL_ONLY",
    targetRole: "LINKED_MEMBER",
    eligibilityMode: "ELIGIBLE_ONLY",
    memberIndex: 1,
    memberCount: 2,
    bindingMode: "BINDING_ONLY",
    appliesDamage: false,
    killsTarget: false,
    registersDefeat: false,
    awardsScore: false,
    awardsRewards: false,
    spawnsProjectiles: false,
    mutatesFormation: false,
  });
  assert.equal(Object.isFrozen(eligibility), true);
});

test("size-three linked members one and two are eligible while core is not", () => {
  const projection = resolveProjection(3);

  for (const memberIndex of [1, 2] as const) {
    const eligibility = resolveCommandLinkPulseTargetEligibility(
      projection,
      { groupId: "command-link:3", memberIndex, memberCount: 3 },
      true,
    );
    assert.ok(eligibility);
    assert.equal(eligibility.memberIndex, memberIndex);
    assert.equal(eligibility.memberCount, 3);
    assert.equal(eligibility.targetRole, "LINKED_MEMBER");
    assert.equal(eligibility.eligibilityMode, "ELIGIBLE_ONLY");
  }

  assert.equal(
    resolveCommandLinkPulseTargetEligibility(
      projection,
      { groupId: "command-link:3", memberIndex: 0, memberCount: 3 },
      true,
    ),
    null,
  );
});

test("wrong group dead target absent input and unsupported formation fail closed", () => {
  const projection = resolveProjection(3);
  const validFormation = {
    groupId: "command-link:3",
    memberIndex: 1,
    memberCount: 3,
  } as const;

  assert.equal(
    resolveCommandLinkPulseTargetEligibility(
      projection,
      { ...validFormation, groupId: "other-group" },
      true,
    ),
    null,
  );
  assert.equal(
    resolveCommandLinkPulseTargetEligibility(projection, validFormation, false),
    null,
  );
  assert.equal(
    resolveCommandLinkPulseTargetEligibility(null, validFormation, true),
    null,
  );
  assert.equal(
    resolveCommandLinkPulseTargetEligibility(undefined, validFormation, true),
    null,
  );
  assert.equal(
    resolveCommandLinkPulseTargetEligibility(projection, null, true),
    null,
  );
  assert.equal(
    resolveCommandLinkPulseTargetEligibility(projection, undefined, true),
    null,
  );

  for (const invalidFormation of [
    { groupId: "", memberIndex: 1, memberCount: 3 },
    { groupId: " padded ", memberIndex: 1, memberCount: 3 },
    { groupId: "command-link:3", memberIndex: -1, memberCount: 3 },
    { groupId: "command-link:3", memberIndex: 3, memberCount: 3 },
    { groupId: "command-link:3", memberIndex: 1.5, memberCount: 3 },
    { groupId: "command-link:3", memberIndex: 1, memberCount: 4 },
  ]) {
    assert.equal(
      resolveCommandLinkPulseTargetEligibility(
        projection,
        asFormation(invalidFormation),
        true,
      ),
      null,
    );
  }
});

test("malformed J5F-A proposal semantics or target shape fail closed", () => {
  const base = resolveProjection(3);
  const formation = {
    groupId: "command-link:3",
    memberIndex: 1,
    memberCount: 3,
  } as const;

  const invalidProjections = [
    { ...base, groupId: "" },
    { ...base, groupId: " padded " },
    { ...base, profileId: "OTHER" },
    { ...base, signal: "OTHER" },
    { ...base, sourceIntent: "OTHER" },
    { ...base, effectId: "OTHER" },
    { ...base, intent: "OTHER" },
    { ...base, effectMode: "OTHER" },
    { ...base, targetRole: "COMMAND_CORE" },
    { ...base, requiresCurrentFormationMatch: false },
    { ...base, requiresLivingTarget: false },
    { ...base, appliesDamage: true },
    { ...base, killsTargets: true },
    { ...base, awardsScore: true },
    { ...base, awardsRewards: true },
    { ...base, spawnsProjectiles: true },
    { ...base, mutatesFormation: true },
    { ...base, targetMemberIndices: Object.freeze([1]) },
    { ...base, targetMemberIndices: Object.freeze([1, 3]) },
    { ...base, targetMemberIndices: Object.freeze([2, 1]) },
  ];

  for (const invalidProjection of invalidProjections) {
    assert.equal(
      resolveCommandLinkPulseTargetEligibility(
        asProjection(invalidProjection),
        formation,
        true,
      ),
      null,
    );
  }
});

test("eligibility does not mutate frozen projection or candidate formation", () => {
  const projection = resolveProjection(3);
  const formation = Object.freeze({
    groupId: "command-link:3",
    memberIndex: 2,
    memberCount: 3,
  } as const);
  const projectionBefore = JSON.stringify(projection);
  const formationBefore = JSON.stringify(formation);

  const eligibility = resolveCommandLinkPulseTargetEligibility(
    projection,
    formation,
    true,
  );

  assert.ok(eligibility);
  assert.equal(JSON.stringify(projection), projectionBefore);
  assert.equal(JSON.stringify(formation), formationBefore);
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Object.isFrozen(projection.targetMemberIndices), true);
  assert.equal(Object.isFrozen(formation), true);
});

test("J5F-B authority contract owns no runtime combat economy timing scan or mutation authority", () => {
  assert.deepEqual(COMMAND_LINK_PULSE_TARGET_ELIGIBILITY_AUTHORITY_CONTRACT, {
    ownsCombatEffectProposalAuthority: false,
    ownsCommandLinkBindingAuthority: false,
    ownsLivingStateAuthority: false,
    ownsFormationAuthority: false,
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
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
    Object.isFrozen(COMMAND_LINK_PULSE_TARGET_ELIGIBILITY_AUTHORITY_CONTRACT),
    true,
  );
});
