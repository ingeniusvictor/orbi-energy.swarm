import assert from "node:assert/strict";
import test from "node:test";

import { resolveCommandLinkBreakResolution } from "../../src/game/commandLinkBreakResolution.ts";
import { shouldDetachCommandLinkMember } from "../../src/game/liveCommandLinkBreakApplication.ts";

test("size-two break detaches only the linked member from the same group", () => {
  const resolution = resolveCommandLinkBreakResolution({
    groupId: "wave:formation:2",
    memberIndex: 0,
    memberCount: 2,
  });

  assert.ok(resolution);
  assert.equal(
    shouldDetachCommandLinkMember(resolution, {
      groupId: "wave:formation:2",
      memberIndex: 1,
      memberCount: 2,
    }),
    true,
  );
  assert.equal(
    shouldDetachCommandLinkMember(resolution, {
      groupId: "other:formation:2",
      memberIndex: 1,
      memberCount: 2,
    }),
    false,
  );
});

test("size-three break matches exactly the two bounded linked members", () => {
  const resolution = resolveCommandLinkBreakResolution({
    groupId: "wave:formation:3",
    memberIndex: 0,
    memberCount: 3,
  });

  assert.ok(resolution);
  assert.equal(
    shouldDetachCommandLinkMember(resolution, {
      groupId: "wave:formation:3",
      memberIndex: 1,
      memberCount: 3,
    }),
    true,
  );
  assert.equal(
    shouldDetachCommandLinkMember(resolution, {
      groupId: "wave:formation:3",
      memberIndex: 2,
      memberCount: 3,
    }),
    true,
  );
  assert.equal(
    shouldDetachCommandLinkMember(resolution, {
      groupId: "wave:formation:3",
      memberIndex: 0,
      memberCount: 3,
    }),
    false,
  );
});

test("absent invalid and unsupported formation facts fail closed", () => {
  const resolution = resolveCommandLinkBreakResolution({
    groupId: "g",
    memberIndex: 0,
    memberCount: 2,
  });

  assert.ok(resolution);
  assert.equal(shouldDetachCommandLinkMember(null, null), false);
  assert.equal(shouldDetachCommandLinkMember(undefined, undefined), false);
  assert.equal(shouldDetachCommandLinkMember(resolution, null), false);
  assert.equal(
    shouldDetachCommandLinkMember(resolution, {
      groupId: "",
      memberIndex: 1,
      memberCount: 2,
    }),
    false,
  );
  assert.equal(
    shouldDetachCommandLinkMember(resolution, {
      groupId: "g",
      memberIndex: 3,
      memberCount: 3,
    }),
    false,
  );
  assert.equal(
    shouldDetachCommandLinkMember(resolution, {
      groupId: "g",
      memberIndex: 1,
      memberCount: 4,
    }),
    false,
  );
});

test("malformed break metadata fails closed even when formation facts look linked", () => {
  const valid = resolveCommandLinkBreakResolution({
    groupId: "g",
    memberIndex: 0,
    memberCount: 2,
  });
  assert.ok(valid);

  const malformed = {
    ...valid,
    effectMode: "LIVE_MUTATION",
  } as unknown as typeof valid;

  assert.equal(
    shouldDetachCommandLinkMember(malformed, {
      groupId: "g",
      memberIndex: 1,
      memberCount: 2,
    }),
    false,
  );
});
