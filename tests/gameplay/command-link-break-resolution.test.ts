import assert from "node:assert/strict";
import test from "node:test";

import {
  COMMAND_LINK_BREAK_AUTHORITY_CONTRACT,
  resolveCommandLinkBreakResolution,
} from "../../src/game/commandLinkBreakResolution.ts";

test("size-two command core resolves one bounded linked member intent", () => {
  const resolution = resolveCommandLinkBreakResolution({
    groupId: "wave:formation:2",
    memberIndex: 0,
    memberCount: 2,
  });

  assert.ok(resolution);
  assert.equal(resolution.profileId, "COMMAND_CORE");
  assert.equal(resolution.signal, "COMMAND_LINK_BROKEN");
  assert.equal(resolution.intent, "DETACH_LINKED_MEMBERS");
  assert.equal(resolution.effectMode, "INTENT_ONLY");
  assert.equal(resolution.coreMemberIndex, 0);
  assert.deepEqual(resolution.linkedMemberIndices, [1]);
  assert.equal(Object.isFrozen(resolution), true);
  assert.equal(Object.isFrozen(resolution.linkedMemberIndices), true);
});

test("size-three command core resolves exactly two bounded linked member indices", () => {
  const resolution = resolveCommandLinkBreakResolution({
    groupId: "wave:formation:3",
    memberIndex: 0,
    memberCount: 3,
  });

  assert.ok(resolution);
  assert.deepEqual(resolution.linkedMemberIndices, [1, 2]);
  assert.equal(resolution.signal, "COMMAND_LINK_BROKEN");
  assert.equal(resolution.intent, "DETACH_LINKED_MEMBERS");
  assert.equal(resolution.effectMode, "INTENT_ONLY");
});

test("linked members never resolve a command-link break intent", () => {
  assert.equal(
    resolveCommandLinkBreakResolution({
      groupId: "g:2",
      memberIndex: 1,
      memberCount: 2,
    }),
    null,
  );
  assert.equal(
    resolveCommandLinkBreakResolution({
      groupId: "g:3",
      memberIndex: 2,
      memberCount: 3,
    }),
    null,
  );
});

test("invalid formation facts fail closed", () => {
  for (const input of [
    { groupId: "", memberIndex: 0, memberCount: 2 },
    { groupId: " padded ", memberIndex: 0, memberCount: 2 },
    { groupId: "g", memberIndex: -1, memberCount: 2 },
    { groupId: "g", memberIndex: 2, memberCount: 2 },
    { groupId: "g", memberIndex: 0, memberCount: 4 },
    { groupId: "g", memberIndex: 0.5, memberCount: 2 },
  ]) {
    assert.equal(resolveCommandLinkBreakResolution(input), null);
  }
});

test("resolver does not mutate caller formation facts", () => {
  const input = Object.freeze({
    groupId: "stable:group",
    memberIndex: 0,
    memberCount: 3,
  });

  const before = { ...input };
  const resolution = resolveCommandLinkBreakResolution(input);

  assert.ok(resolution);
  assert.deepEqual(input, before);
  assert.equal(input.groupId, "stable:group");
});

test("J5D authority contract owns no live mutation or lookup authority", () => {
  assert.deepEqual(COMMAND_LINK_BREAK_AUTHORITY_CONTRACT, {
    ownsFormationAuthority: false,
    ownsPriorityTargetProfileAuthority: false,
    ownsBindingAuthority: false,
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
  assert.equal(Object.isFrozen(COMMAND_LINK_BREAK_AUTHORITY_CONTRACT), true);
});
