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
  "WEDGE",
  "ORBIT",
  "SPIRAL",
];

const minimumMembers = (route: EnemyFormationRouteId) => {
  if (route === "SERPENTINE") return 1;
  if (route === "WEDGE" || route === "ORBIT") return 3;
  return 2;
};

const inputFor = (
  route: EnemyFormationRouteId,
  overrides: Partial<EnemyFormationRouteInput> = {},
): EnemyFormationRouteInput => ({
  route,
  memberIndex: 0,
  memberCount: minimumMembers(route),
  progress: 0,
  mirror: 1,
  ...overrides,
});

test("enemy route authority exposes the certified six-route bounded vocabulary", () => {
  assert.deepEqual(ROUTES, [
    "PINCER",
    "X_CROSS",
    "SERPENTINE",
    "WEDGE",
    "ORBIT",
    "SPIRAL",
  ]);
  assert.equal(ENEMY_FORMATION_ROUTE_MAX_MEMBERS, 8);
  assert.equal(ENEMY_FORMATION_ROUTE_EXTENT, 1.25);
  assert.equal(ENEMY_FORMATION_ENTRY_END, 0.2);
  assert.equal(ENEMY_FORMATION_PRESSURE_END, 0.8);
});

test("route projection is deterministic and leaves caller-owned input untouched", () => {
  for (const route of ROUTES) {
    const input: EnemyFormationRouteInput = {
      route,
      memberIndex: Math.min(1, minimumMembers(route) - 1),
      memberCount: Math.max(minimumMembers(route), 4),
      progress: 0.375,
      mirror: -1,
    };
    const before = structuredClone(input);
    const first = projectEnemyFormationRoute(input);
    const second = projectEnemyFormationRoute(input);

    assert.deepEqual(first, second);
    assert.deepEqual(input, before);
    assert.notEqual(first.position, input);
  }
});

test("all certified route slots stay finite and inside the normalized extent", () => {
  for (const route of ROUTES) {
    for (
      let memberCount = minimumMembers(route);
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

test("phase boundaries remain exact and caller-progress driven for every route", () => {
  for (const route of ROUTES) {
    assert.equal(projectEnemyFormationRoute(inputFor(route, { progress: 0 })).phase, "ENTRY");
    assert.equal(
      projectEnemyFormationRoute(
        inputFor(route, { progress: ENEMY_FORMATION_ENTRY_END - 0.001 }),
      ).phase,
      "ENTRY",
    );
    assert.equal(
      projectEnemyFormationRoute(
        inputFor(route, { progress: ENEMY_FORMATION_ENTRY_END }),
      ).phase,
      "PRESSURE",
    );
    assert.equal(
      projectEnemyFormationRoute(
        inputFor(route, { progress: ENEMY_FORMATION_PRESSURE_END - 0.001 }),
      ).phase,
      "PRESSURE",
    );
    assert.equal(
      projectEnemyFormationRoute(
        inputFor(route, { progress: ENEMY_FORMATION_PRESSURE_END }),
      ).phase,
      "EXIT",
    );
    const complete = projectEnemyFormationRoute(inputFor(route, { progress: 1 }));
    assert.equal(complete.phase, "COMPLETE");
    assert.equal(complete.complete, true);
  }
});

test("PINCER preserves converging flank geometry and mirror behavior", () => {
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
    inputFor("PINCER", { memberIndex: 0, progress: 0.5, mirror: -1 }),
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

test("X_CROSS preserves diagonal crossing behavior without hidden state", () => {
  const startA = projectEnemyFormationRoute(inputFor("X_CROSS", { memberIndex: 0 }));
  const middleA = projectEnemyFormationRoute(
    inputFor("X_CROSS", { memberIndex: 0, progress: 0.5 }),
  );
  const endA = projectEnemyFormationRoute(
    inputFor("X_CROSS", { memberIndex: 0, progress: 1 }),
  );
  const startB = projectEnemyFormationRoute(inputFor("X_CROSS", { memberIndex: 1 }));

  assert.ok(startA.position.x < 0);
  assert.ok(startB.position.x > 0);
  assert.equal(middleA.position.x, 0);
  assert.ok(endA.position.x > 0);
  assert.equal(startA.telegraph.kind, "DIAGONAL_CROSS");
  assert.equal(startA.telegraph.safeIntent, "TIME_CENTER_GAP");
});

test("SERPENTINE preserves a moving corridor with deterministic slot phase", () => {
  const leaderStart = projectEnemyFormationRoute(
    inputFor("SERPENTINE", { memberIndex: 0, memberCount: 4 }),
  );
  const leaderQuarter = projectEnemyFormationRoute(
    inputFor("SERPENTINE", { memberIndex: 0, memberCount: 4, progress: 0.25 }),
  );
  const followerQuarter = projectEnemyFormationRoute(
    inputFor("SERPENTINE", { memberIndex: 1, memberCount: 4, progress: 0.25 }),
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

test("WEDGE denies center space with a point and mirrored flank wings", () => {
  const point = projectEnemyFormationRoute(
    inputFor("WEDGE", { memberIndex: 0, memberCount: 5, progress: 0.5 }),
  );
  const left = projectEnemyFormationRoute(
    inputFor("WEDGE", { memberIndex: 1, memberCount: 5, progress: 0.5 }),
  );
  const right = projectEnemyFormationRoute(
    inputFor("WEDGE", { memberIndex: 2, memberCount: 5, progress: 0.5 }),
  );
  const mirroredLeft = projectEnemyFormationRoute(
    inputFor("WEDGE", {
      memberIndex: 1,
      memberCount: 5,
      progress: 0.5,
      mirror: -1,
    }),
  );

  assert.equal(point.position.x, 0);
  assert.ok(point.position.y > left.position.y);
  assert.ok(left.position.x < 0);
  assert.ok(right.position.x > 0);
  assert.equal(mirroredLeft.position.x, -left.position.x);
  assert.equal(left.position.y, mirroredLeft.position.y);
  assert.equal(point.role, "WEDGE_POINT");
  assert.equal(left.role, "WEDGE_LEFT");
  assert.equal(right.role, "WEDGE_RIGHT");
  assert.deepEqual(point.telegraph, {
    required: true,
    kind: "WEDGE_ADVANCE",
    severity: "HIGH",
    laneCount: 2,
    safeIntent: "CHOOSE_WEDGE_FLANK",
  });
});

test("ORBIT maintains a rotating ring and mirrors the ring across the vertical axis", () => {
  const start = projectEnemyFormationRoute(
    inputFor("ORBIT", { memberIndex: 0, memberCount: 4, progress: 0 }),
  );
  const quarter = projectEnemyFormationRoute(
    inputFor("ORBIT", { memberIndex: 0, memberCount: 4, progress: 0.25 }),
  );
  const oppositeStart = projectEnemyFormationRoute(
    inputFor("ORBIT", { memberIndex: 2, memberCount: 4, progress: 0 }),
  );
  const mirroredQuarter = projectEnemyFormationRoute(
    inputFor("ORBIT", {
      memberIndex: 0,
      memberCount: 4,
      progress: 0.25,
      mirror: -1,
    }),
  );

  assert.ok(start.position.x > 0);
  assert.ok(oppositeStart.position.x < 0);
  assert.notDeepEqual(quarter.position, start.position);
  assert.equal(mirroredQuarter.position.x, -quarter.position.x);
  assert.equal(mirroredQuarter.position.y, quarter.position.y);
  assert.equal(start.role, "ORBIT_LEAD");
  assert.equal(oppositeStart.role, "ORBIT_RING");
  assert.equal(start.telegraph.kind, "ROTATING_RING");
  assert.equal(start.telegraph.safeIntent, "CHOOSE_RING_SIDE");
});

test("SPIRAL compresses toward mid-route then expands while preserving clean mirror", () => {
  const start = projectEnemyFormationRoute(
    inputFor("SPIRAL", { memberIndex: 0, memberCount: 4, progress: 0 }),
  );
  const middle = projectEnemyFormationRoute(
    inputFor("SPIRAL", { memberIndex: 0, memberCount: 4, progress: 0.5 }),
  );
  const follower = projectEnemyFormationRoute(
    inputFor("SPIRAL", { memberIndex: 1, memberCount: 4, progress: 0.5 }),
  );
  const mirroredMiddle = projectEnemyFormationRoute(
    inputFor("SPIRAL", {
      memberIndex: 0,
      memberCount: 4,
      progress: 0.5,
      mirror: -1,
    }),
  );

  assert.ok(Math.abs(middle.position.x) < Math.abs(start.position.x));
  assert.equal(mirroredMiddle.position.x, -middle.position.x);
  assert.equal(mirroredMiddle.position.y, middle.position.y);
  assert.notDeepEqual(follower.position, middle.position);
  assert.equal(start.role, "SPIRAL_LEAD");
  assert.equal(follower.role, "SPIRAL_TRAIL");
  assert.equal(start.telegraph.kind, "SPIRAL_COMPRESSION");
  assert.equal(start.telegraph.safeIntent, "TIME_SPIRAL_GAP");
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
      () => projectEnemyFormationRoute(inputFor("SERPENTINE", { memberCount })),
      RangeError,
    );
  }

  for (const [route, memberCount] of [
    ["PINCER", 1],
    ["X_CROSS", 1],
    ["SPIRAL", 1],
    ["WEDGE", 2],
    ["ORBIT", 2],
  ] as const) {
    assert.throws(
      () => projectEnemyFormationRoute(inputFor(route, { memberCount })),
      RangeError,
    );
  }

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
      () => projectEnemyFormationRoute(inputFor("SERPENTINE", { progress })),
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
