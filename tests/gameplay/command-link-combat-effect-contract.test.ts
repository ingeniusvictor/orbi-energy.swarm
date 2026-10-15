import assert from "node:assert/strict";
import test from "node:test";

import {
  COMMAND_LINK_COMBAT_EFFECT_AUTHORITY_CONTRACT,
  projectCommandLinkCombatEffect,
  type CommandLinkCombatEffectSourceFreshness,
} from "../../src/game/commandLinkCombatEffectContract.ts";
import {
  resolveCommandLinkBreakResolution,
  type CommandLinkBreakResolution,
} from "../../src/game/commandLinkBreakResolution.ts";

const resolveCoreBreak = (memberCount: 2 | 3) => {
  const resolution = resolveCommandLinkBreakResolution({
    groupId: `command-link:${memberCount}`,
    memberIndex: 0,
    memberCount,
  });
  assert.ok(resolution);
  return resolution;
};

const asBreakResolution = (
  input: Record<string, unknown>,
): Readonly<CommandLinkBreakResolution> =>
  input as unknown as Readonly<CommandLinkBreakResolution>;

test("CURRENT size-two J5D break projects one bounded disruption-pulse target", () => {
  const resolution = resolveCoreBreak(2);
  const projection = projectCommandLinkCombatEffect(resolution, "CURRENT");

  assert.ok(projection);
  assert.deepEqual(projection, {
    groupId: "command-link:2",
    profileId: "COMMAND_CORE",
    signal: "COMMAND_LINK_BROKEN",
    sourceIntent: "DETACH_LINKED_MEMBERS",
    effectId: "COMMAND_LINK_DISRUPTION_PULSE",
    intent: "PULSE_LINKED_MEMBERS",
    effectMode: "PROPOSAL_ONLY",
    targetRole: "LINKED_MEMBER",
    targetMemberIndices: [1],
    requiresCurrentFormationMatch: true,
    requiresLivingTarget: true,
    appliesDamage: false,
    killsTargets: false,
    awardsScore: false,
    awardsRewards: false,
    spawnsProjectiles: false,
    mutatesFormation: false,
  });
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Object.isFrozen(projection.targetMemberIndices), true);
});

test("CURRENT size-three J5D break projects exactly linked indices one and two", () => {
  const resolution = resolveCoreBreak(3);
  const projection = projectCommandLinkCombatEffect(resolution, "CURRENT");

  assert.ok(projection);
  assert.deepEqual(projection.targetMemberIndices, [1, 2]);
  assert.equal(projection.effectId, "COMMAND_LINK_DISRUPTION_PULSE");
  assert.equal(projection.effectMode, "PROPOSAL_ONLY");
  assert.equal(projection.appliesDamage, false);
  assert.equal(projection.killsTargets, false);
  assert.equal(projection.awardsScore, false);
  assert.equal(projection.awardsRewards, false);
});

test("STALE or absent source fails closed", () => {
  const resolution = resolveCoreBreak(3);

  assert.equal(projectCommandLinkCombatEffect(resolution, "STALE"), null);
  assert.equal(projectCommandLinkCombatEffect(null, "CURRENT"), null);
  assert.equal(projectCommandLinkCombatEffect(undefined, "CURRENT"), null);
  assert.equal(
    projectCommandLinkCombatEffect(
      resolution,
      "UNKNOWN" as CommandLinkCombatEffectSourceFreshness,
    ),
    null,
  );
});

test("malformed or unsupported J5D prerequisite semantics fail closed", () => {
  const base = resolveCoreBreak(3);
  const invalidResolutions = [
    { ...base, groupId: "" },
    { ...base, groupId: " padded " },
    { ...base, profileId: "OTHER" },
    { ...base, signal: "OTHER" },
    { ...base, intent: "OTHER" },
    { ...base, effectMode: "OTHER" },
    { ...base, coreMemberIndex: 1 },
    { ...base, linkedMemberIndices: Object.freeze([]) },
    { ...base, linkedMemberIndices: Object.freeze([2]) },
    { ...base, linkedMemberIndices: Object.freeze([1, 1]) },
    { ...base, linkedMemberIndices: Object.freeze([2, 1]) },
    { ...base, linkedMemberIndices: Object.freeze([1, 2, 3]) },
  ];

  for (const invalid of invalidResolutions) {
    assert.equal(
      projectCommandLinkCombatEffect(asBreakResolution(invalid), "CURRENT"),
      null,
    );
  }
});

test("projection does not mutate frozen J5D source resolution", () => {
  const resolution = resolveCoreBreak(3);
  const before = {
    groupId: resolution.groupId,
    profileId: resolution.profileId,
    signal: resolution.signal,
    intent: resolution.intent,
    effectMode: resolution.effectMode,
    coreMemberIndex: resolution.coreMemberIndex,
    linkedMemberIndices: [...resolution.linkedMemberIndices],
  };

  const projection = projectCommandLinkCombatEffect(resolution, "CURRENT");

  assert.ok(projection);
  assert.equal(Object.isFrozen(resolution), true);
  assert.equal(Object.isFrozen(resolution.linkedMemberIndices), true);
  assert.deepEqual(
    {
      groupId: resolution.groupId,
      profileId: resolution.profileId,
      signal: resolution.signal,
      intent: resolution.intent,
      effectMode: resolution.effectMode,
      coreMemberIndex: resolution.coreMemberIndex,
      linkedMemberIndices: [...resolution.linkedMemberIndices],
    },
    before,
  );
});

test("J5F-A authority contract owns no runtime combat economy timing scan or mutation authority", () => {
  assert.deepEqual(COMMAND_LINK_COMBAT_EFFECT_AUTHORITY_CONTRACT, {
    ownsPriorityTargetProfileAuthority: false,
    ownsCommandLinkBreakAuthority: false,
    ownsFreshnessAuthority: false,
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
  assert.equal(Object.isFrozen(COMMAND_LINK_COMBAT_EFFECT_AUTHORITY_CONTRACT), true);
});
