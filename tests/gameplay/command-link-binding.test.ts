import assert from "node:assert/strict";
import test from "node:test";

import {
  COMMAND_LINK_BINDING_AUTHORITY_CONTRACT,
  COMMAND_LINK_CORE_MEMBER_INDEX,
  COMMAND_LINK_SUPPORTED_MEMBER_COUNTS,
  resolveCommandLinkBinding,
} from "../../src/game/commandLinkBinding.ts";

const resolveGroup = (groupId: string, memberCount: number) =>
  Array.from({ length: memberCount }, (_, memberIndex) =>
    resolveCommandLinkBinding({ groupId, memberIndex, memberCount }),
  );

test("J5B supports exactly the certified bounded group sizes", () => {
  assert.deepEqual(COMMAND_LINK_SUPPORTED_MEMBER_COUNTS, [2, 3]);
  assert.equal(Object.isFrozen(COMMAND_LINK_SUPPORTED_MEMBER_COUNTS), true);
  assert.equal(COMMAND_LINK_CORE_MEMBER_INDEX, 0);
});

test("size-2 groups bind exactly member zero as Command Core", () => {
  const bindings = resolveGroup("sector:formation:4", 2);

  assert.deepEqual(
    bindings.map((binding) => binding?.memberRole),
    ["COMMAND_CORE", "LINKED_MEMBER"],
  );
  assert.equal(bindings.filter((binding) => binding?.memberRole === "COMMAND_CORE").length, 1);

  for (const binding of bindings) {
    assert.ok(binding);
    assert.equal(binding.profileId, "COMMAND_CORE");
    assert.equal(binding.bindingMode, "BINDING_ONLY");
    assert.equal(binding.coreMemberIndex, 0);
    assert.equal(binding.memberCount, 2);
    assert.deepEqual(binding.linkedMemberIndices, [1]);
    assert.equal(Object.isFrozen(binding), true);
    assert.equal(Object.isFrozen(binding.linkedMemberIndices), true);
  }
});

test("size-3 groups bind exactly member zero and expose bounded linked metadata", () => {
  const bindings = resolveGroup("sector:formation:5", 3);

  assert.deepEqual(
    bindings.map((binding) => binding?.memberRole),
    ["COMMAND_CORE", "LINKED_MEMBER", "LINKED_MEMBER"],
  );
  assert.equal(bindings.filter((binding) => binding?.memberRole === "COMMAND_CORE").length, 1);

  for (const binding of bindings) {
    assert.ok(binding);
    assert.equal(binding.profileId, "COMMAND_CORE");
    assert.equal(binding.coreMemberIndex, 0);
    assert.equal(binding.memberCount, 3);
    assert.deepEqual(binding.linkedMemberIndices, [1, 2]);
  }
});

test("binding is deterministic for the same opaque group/member facts", () => {
  const input = { groupId: "descriptor:formation:2", memberIndex: 2, memberCount: 3 };
  const first = resolveCommandLinkBinding(input);
  const second = resolveCommandLinkBinding(input);

  assert.deepEqual(first, second);
  assert.deepEqual(first, {
    groupId: "descriptor:formation:2",
    profileId: "COMMAND_CORE",
    bindingMode: "BINDING_ONLY",
    memberIndex: 2,
    memberCount: 3,
    coreMemberIndex: 0,
    memberRole: "LINKED_MEMBER",
    linkedMemberIndices: [1, 2],
  });
});

test("invalid group facts fail closed", () => {
  for (const groupId of ["", " ", " group", "group ", "\tgroup", "group\n"]) {
    assert.equal(resolveCommandLinkBinding({ groupId, memberIndex: 0, memberCount: 2 }), null);
  }

  for (const memberCount of [0, 1, 4, 8, -2, 2.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(
      resolveCommandLinkBinding({ groupId: "g", memberIndex: 0, memberCount }),
      null,
    );
  }

  for (const memberIndex of [-1, 2, 2.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(
      resolveCommandLinkBinding({ groupId: "g", memberIndex, memberCount: 2 }),
      null,
    );
  }

  assert.equal(
    resolveCommandLinkBinding({ groupId: "g", memberIndex: 3, memberCount: 3 }),
    null,
  );
});

test("J5B authority contract is completely zero-live-authority", () => {
  assert.deepEqual(COMMAND_LINK_BINDING_AUTHORITY_CONTRACT, {
    ownsFormationAuthority: false,
    ownsPriorityTargetProfileAuthority: false,
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
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
});
