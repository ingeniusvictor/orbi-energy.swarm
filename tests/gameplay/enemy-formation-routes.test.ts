import assert from "node:assert/strict";
import test from "node:test";

import {
  ENEMY_FORMATION_ENTRY_END,
  ENEMY_FORMATION_PRESSURE_END,
  ENEMY_FORMATION_ROUTE_EXTENT,
  ENEMY_FORMATION_ROUTE_MAX_MEMBERS,
  projectEnemyFormationRoute,
  type EnemyFormationRouteId,
  type EnemyFormationRouteInput,
} from "../../src/game/enemyFormationRoutes.ts";

const ROUTES: readonly EnemyFormationRouteId[] = [
  "PINCER",
  "X_CROSS",
  "SERPENTINE",
];

const inputFor = (
  route: EnemyFormationRouteId,
  overrides: Partial<EnemyFormationRouteInput> = {},
): EnemyFormationRouteInput => ({
  route,
  memberIndex: 0,
  memberCount: route === "SERPENTINE" ? 1 : 2,
  progress: 0,
  mirror: 1,
  ...overrides,
});

test("J3A exposes a small bounded tactical route vocabulary", () => {
  assert.deepEqual(ROUTES, ["PINCER", "X_CROSS", "SERPENTINE"]);
  assert.equal(ENEMY_FORMATION_ROUTE_MAX_MEMBERS, 8);
  assert.equal(ENEMY_FORMATION_ROUTE_EXTENT, 1.25);
  assert.equal(ENEMY_FORMATION_ENTRY_END, 0.2);
  assert.equal(ENEMY_FORMATION_PRESSURE_END, 0.8);
});

test("route projection is deterministic and leaves caller-owned input untouched", () => {
  const input: EnemyFormationRouteInput = {
    route: "PINCER",
    memberIndex: 3,
    memberCount: 6,
    progress: 0.375,
    mirror: -1,
  };
  const before = structuredClone(input);

  const first = projectEnemyFormationRoute(input);
  const second = projectEnemyFormationRoute(input);

  assert.deepEqual(first, second);
  assert.deepEqual(input, before);
  assert.notEqual(first.position, input);
});

test("all certified route slots stay finite and inside the normalized extent", () => {
  for (const route of ROUTES) {
    const minimumMembers = route === "SERPENTINE" ? 1 : 2;
    for (
      let memberCount = minimumMembers;
      memberCount <= ENEMY_FORMATION_ROUTE_MAX_MEMBERS;
      memberCount += 1
    ) {
      for (let memberIndex = 0; memberIndex < memberCount; memberIndex += 1) {
        for (let step = 0; step <= 20; step += 1) {
          const progress = step / 20;
          for (const mirror of [-1, 1] as const) {
            const projection = projectEnemyFormationRoute({
              route,
              memberIndex,
              memberCount,
              progress,
              mirror,
            });

            assert.equal(Number.isFinite(projection.position.x), true);
            assert.equal(Number.isFinite(projection.position.y), true);
            assert.ok(
              Math.abs(projection.position.x) <= ENEMY_FORMATION_ROUTE_EXTENT,
            );
            assert.ok(
              Math.abs(projection.position.y) <= ENEMY_FORMATION_ROUTE_EXTENT,
            );
            assert.equal(projection.memberIndex, memberIndex);
            assert.equal(projection.memberCount, memberCount);
            assert.equal(projection.progress, progress);
          }
        }
      }
    }
  }
});

test("phase boundaries are exact and caller-progress driven", () => {
  assert.equal(
    projectEnemyFormationRoute(inputFor("SERPENTINE", { progress: 0 })).phase,
    "ENTRY",
  );
  assert.equal(
    projectEnemyFormationRoute(
      inputFor("SERPENTINE", { progress: ENEMY_FORMATION_ENTRY_END - 0.001 }),
    ).phase,
    "ENTRY",
  );
  assert.equal(
    projectEnemyFormationRoute(
      inputFor("SERPENTINE", { progress: ENEMY_FORMATION_ENTRY_END }),
    ).phase,
    "PRESSURE",
  );
  assert.equal(
    projectEnemyFormationRoute(
      inputFor("SERPENTINE", {
        progress: ENEMY_FORMATION_PRESSURE_END - 0.001,
      }),
    ).phase,
    "PRESSURE",
  );
  assert.equal(
    projectEnemyFormationRoute(
      inputFor("SERPENTINE", { progress: ENEMY_FORMATION_PRESSURE_END }),
    ).phase,
    "EXIT",
  );

  const complete = projectEnemyFormationRoute(
    inputFor("SERPENTINE", { progress: 1 }),
  );
  assert.equal(complete.phase, "COMPLETE");
  assert.equal(complete.complete, true);
});

test("PINCER converges opposing flanks near mid-route and mirrors cleanly", () => {
  const leftEntry = projectEnemyFormationRoute(
    inputFor("PINCER", { memberIndex: 0, progress: 0 }),
  );
  const leftMiddle = projectEnemyFormationRoute(
    inputFor("PINCER", { memberIndex: 0, progress: 0.5 }),
  );
  const rightMiddle = projectEnemyFormationRoute(
    inputFor("PINCER", { memberIndex: 1, progress: 0.5 }),
  );
  const mirroredLeftMiddle = projectEnemyFormationRoute(
    inputFor("PINCER", {
      memberIndex: 0,
      progress: 0.5,
      mirror: -1,
    }),
  );

  assert.ok(Math.abs(leftMiddle.position.x) < Math.abs(leftEntry.position.x));
  assert.ok(leftMiddle.position.x < 0);
  assert.ok(rightMiddle.position.x > 0);
  assert.equal(leftMiddle.position.x, -rightMiddle.position.x);
  assert.equal(mirroredLeftMiddle.position.x, rightMiddle.position.x);
  assert.equal(leftMiddle.role, "PINCER_LEFT");
  assert.equal(mirroredLeftMiddle.role, "PINCER_RIGHT");
  assert.deepEqual(leftMiddle.telegraph, {
    required: true,
    kind: "FLANK_CONVERGENCE",
    severity: "HIGH",
    laneCount: 2,
    safeIntent: "ESCAPE_FLANK_BEFORE_CLOSURE",
  });
});

test("X_CROSS swaps diagonal sides through the route without hidden state", () => {
  const startA = projectEnemyFormationRoute(
    inputFor("X_CROSS", { memberIndex: 0, progress: 0 }),
  );
  const middleA = projectEnemyFormationRoute(
    inputFor("X_CROSS", { memberIndex: 0, progress: 0.5 }),
  );
  const endA = projectEnemyFormationRoute(
    inputFor("X_CROSS", { memberIndex: 0, progress: 1 }),
  );
  const startB = projectEnemyFormationRoute(
    inputFor("X_CROSS", { memberIndex: 1, progress: 0 }),
  );

  assert.ok(startA.position.x < 0);
  assert.ok(startB.position.x > 0);
  assert.equal(middleA.position.x, 0);
  assert.ok(endA.position.x > 0);
  assert.equal(endA.phase, "COMPLETE");
  assert.equal(startA.telegraph.kind, "DIAGONAL_CROSS");
  assert.equal(startA.telegraph.safeIntent, "TIME_CENTER_GAP");
});

test("SERPENTINE creates a moving corridor with deterministic slot phase", () => {
  const leaderStart = projectEnemyFormationRoute(
    inputFor("SERPENTINE", {
      memberIndex: 0,
      memberCount: 4,
      progress: 0,
    }),
  );
  const leaderQuarter = projectEnemyFormationRoute(
    inputFor("SERPENTINE", {
      memberIndex: 0,
      memberCount: 4,
      progress: 0.25,
    }),
  );
  const followerQuarter = projectEnemyFormationRoute(
    inputFor("SERPENTINE", {
      memberIndex: 1,
      memberCount: 4,
      progress: 0.25,
    }),
  );
  const mirroredQuarter = projectEnemyFormationRoute(
    inputFor("SERPENTINE", {
      memberIndex: 0,
      memberCount: 4,
      progress: 0.25,
      mirror: -1,
    }),
  );

  assert.equal(leaderStart.role, "SERPENTINE_LEAD");
  assert.equal(followerQuarter.role, "SERPENTINE_TRAIL");
  assert.ok(leaderQuarter.position.y > leaderStart.position.y);
  assert.notEqual(leaderQuarter.position.x, followerQuarter.position.x);
  assert.equal(mirroredQuarter.position.x, -leaderQuarter.position.x);
  assert.equal(leaderQuarter.telegraph.kind, "WAVE_CORRIDOR");
  assert.equal(leaderQuarter.telegraph.safeIntent, "TRACK_MOVING_GAP");
});

test("invalid routes, counts, slots, progress and mirror inputs fail closed", () => {
  assert.throws(
    () =>
      projectEnemyFormationRoute({
        ...inputFor("SERPENTINE"),
        route: "UNKNOWN" as EnemyFormationRouteId,
      }),
    RangeError,
  );

  for (const memberCount of [0, 1.5, ENEMY_FORMATION_ROUTE_MAX_MEMBERS + 1]) {
    assert.throws(
      () =>
        projectEnemyFormationRoute(
          inputFor("SERPENTINE", { memberCount }),
        ),
      RangeError,
    );
  }

  assert.throws(
    () => projectEnemyFormationRoute(inputFor("PINCER", { memberCount: 1 })),
    RangeError,
  );
  assert.throws(
    () => projectEnemyFormationRoute(inputFor("X_CROSS", { memberCount: 1 })),
    RangeError,
  );

  for (const memberIndex of [-1, 0.5, 2]) {
    assert.throws(
      () =>
        projectEnemyFormationRoute(
          inputFor("PINCER", { memberIndex, memberCount: 2 }),
        ),
      RangeError,
    );
  }

  for (const progress of [-0.001, 1.001, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(
      () =>
        projectEnemyFormationRoute(
          inputFor("SERPENTINE", { progress }),
        ),
      RangeError,
    );
  }

  assert.throws(
    () =>
      projectEnemyFormationRoute({
        ...inputFor("SERPENTINE"),
        mirror: 0 as -1 | 1,
      }),
    RangeError,
  );
});
