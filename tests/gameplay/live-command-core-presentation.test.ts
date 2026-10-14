import assert from "node:assert/strict";
import test from "node:test";

import { projectLiveCommandCorePresentation } from "../../src/game/liveCommandCorePresentation.ts";

test("valid formation core projects one immutable bounded priority marker", () => {
  const projection = projectLiveCommandCorePresentation(
    { groupId: "wave:formation:2", memberIndex: 0, memberCount: 3 },
    16,
  );

  assert.ok(projection);
  assert.equal(projection.markerKind, "COMMAND_CORE_PRIORITY");
  assert.equal(projection.profileId, "COMMAND_CORE");
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Number.isFinite(projection.ringRadius), true);
  assert.ok(projection.ringRadius >= 18 && projection.ringRadius <= 42);
  assert.equal(projection.lineWidth, 2);
  assert.equal(projection.alpha, 0.82);
  assert.equal(projection.strokeColor, "#fde047");
  assert.equal(projection.glowColor, "#f59e0b");
  assert.equal(projection.glowBlur, 8);
  assert.equal(projection.chevronHalfWidth, 5);
  assert.equal(projection.chevronHeight, 6);
  assert.ok(projection.chevronOffsetY < -projection.ringRadius);
});

test("presentation geometry clamps safely across enemy sizes", () => {
  const tiny = projectLiveCommandCorePresentation(
    { groupId: "g:small", memberIndex: 0, memberCount: 2 },
    1,
  );
  const medium = projectLiveCommandCorePresentation(
    { groupId: "g:medium", memberIndex: 0, memberCount: 2 },
    20,
  );
  const huge = projectLiveCommandCorePresentation(
    { groupId: "g:large", memberIndex: 0, memberCount: 3 },
    1000,
  );

  assert.equal(tiny?.ringRadius, 18);
  assert.equal(medium?.ringRadius, 31);
  assert.equal(huge?.ringRadius, 42);
});

test("linked members never receive the priority marker", () => {
  assert.equal(
    projectLiveCommandCorePresentation(
      { groupId: "g:2", memberIndex: 1, memberCount: 2 },
      16,
    ),
    null,
  );
  assert.equal(
    projectLiveCommandCorePresentation(
      { groupId: "g:3", memberIndex: 2, memberCount: 3 },
      16,
    ),
    null,
  );
});

test("absent invalid or unsupported formation facts fail closed", () => {
  assert.equal(projectLiveCommandCorePresentation(undefined, 16), null);
  assert.equal(projectLiveCommandCorePresentation(null, 16), null);
  assert.equal(
    projectLiveCommandCorePresentation(
      { groupId: "", memberIndex: 0, memberCount: 2 },
      16,
    ),
    null,
  );
  assert.equal(
    projectLiveCommandCorePresentation(
      { groupId: "g", memberIndex: 0, memberCount: 4 },
      16,
    ),
    null,
  );
  assert.equal(
    projectLiveCommandCorePresentation(
      { groupId: "g", memberIndex: 3, memberCount: 3 },
      16,
    ),
    null,
  );
});

test("invalid enemy sizes fail closed without introducing presentation state", () => {
  for (const enemySize of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(
      projectLiveCommandCorePresentation(
        { groupId: "g", memberIndex: 0, memberCount: 2 },
        enemySize,
      ),
      null,
    );
  }
});
