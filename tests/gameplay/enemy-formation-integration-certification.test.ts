import assert from "node:assert/strict";
import test from "node:test";

import {
  projectEnemyFormationRoute,
  type EnemyFormationRouteId,
} from "../../src/game/enemyFormationRoutes.ts";
import {
  LIVE_ENEMY_FORMATION_ASSEMBLY_GRACE_MS,
  LIVE_ENEMY_FORMATION_LEAD_IN_MS,
  LIVE_ENEMY_FORMATION_POLICY,
  LIVE_ENEMY_FORMATION_RECOVERY_MS,
  LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS,
  LIVE_ENEMY_FORMATION_SPAWN_CADENCE,
  LIVE_ENEMY_FORMATION_WORLD_MARGIN,
  createLiveEnemyFormationDirectorState,
  getLiveEnemyFormationRouteMemberCount,
  projectLiveEnemyFormationMotion,
  requestLiveEnemyFormationSpawn,
  resolveLiveEnemyFormationRoutePlan,
  type LiveEnemyFormationAssignment,
  type LiveEnemyFormationDirectorState,
  type LiveEnemyFormationSpawnRequest,
} from "../../src/game/liveEnemyFormationDirector.ts";
import { EnemyType } from "../../src/game/types.ts";

const ROUTES: readonly EnemyFormationRouteId[] = [
  "PINCER",
  "X_CROSS",
  "SERPENTINE",
  "WEDGE",
  "ORBIT",
  "SPIRAL",
];

const EXPECTED_TELEGRAPH = {
  PINCER: ["FLANK_CONVERGENCE", "HIGH", 2, "ESCAPE_FLANK_BEFORE_CLOSURE"],
  X_CROSS: ["DIAGONAL_CROSS", "HIGH", 2, "TIME_CENTER_GAP"],
  SERPENTINE: ["WAVE_CORRIDOR", "MEDIUM", 1, "TRACK_MOVING_GAP"],
  WEDGE: ["WEDGE_ADVANCE", "HIGH", 2, "CHOOSE_WEDGE_FLANK"],
  ORBIT: ["ROTATING_RING", "HIGH", 2, "CHOOSE_RING_SIDE"],
  SPIRAL: ["SPIRAL_COMPRESSION", "HIGH", 1, "TIME_SPIRAL_GAP"],
} as const;

const makeRequest = (
  overrides: Partial<LiveEnemyFormationSpawnRequest> = {},
): LiveEnemyFormationSpawnRequest => ({
  sourceMode: "CAMPAIGN",
  waveNumber: 4,
  descriptorId: "campaign:j3d",
  milestoneActive: false,
  spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE,
  enemyType: EnemyType.CRAWLER,
  eligibleEnemy: true,
  remainingCapacity: 4,
  nowMs: 10_000,
  anchorX: 800,
  anchorY: 480,
  worldWidth: 1600,
  worldHeight: 960,
  ...overrides,
});

const stateAtOrdinal = (nextGroupOrdinal: number): LiveEnemyFormationDirectorState => ({
  nextGroupOrdinal,
  activeUntilMs: 0,
  pending: null,
});

const assignmentFor = (
  route: EnemyFormationRouteId,
  memberIndex: number,
): LiveEnemyFormationAssignment => ({
  groupId: `j3d:${route}`,
  route,
  memberIndex,
  memberCount: getLiveEnemyFormationRouteMemberCount(route),
  mirror: 1,
  startsAtMs: 1_000,
  durationMs: LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS,
  anchorX: 800,
  anchorY: 480,
});

test("J3D certifies explicit stable telegraphs for all six tactical routes", () => {
  for (const route of ROUTES) {
    const memberCount = getLiveEnemyFormationRouteMemberCount(route);
    const expected = EXPECTED_TELEGRAPH[route];
    let firstTelegraph: ReturnType<typeof projectEnemyFormationRoute>["telegraph"] | null = null;

    for (const progress of [0, 0.1, 0.2, 0.5, 0.8, 0.99, 1]) {
      const projection = projectEnemyFormationRoute({
        route,
        memberIndex: 0,
        memberCount,
        progress,
        mirror: 1,
      });
      assert.equal(projection.telegraph.required, true);
      assert.deepEqual(
        [
          projection.telegraph.kind,
          projection.telegraph.severity,
          projection.telegraph.laneCount,
          projection.telegraph.safeIntent,
        ],
        expected,
      );
      firstTelegraph ??= projection.telegraph;
      assert.deepEqual(projection.telegraph, firstTelegraph);
    }
  }
});

test("J3D certifies lead-in, exact completion and bounded recovery timing", () => {
  const start = requestLiveEnemyFormationSpawn(
    createLiveEnemyFormationDirectorState(),
    makeRequest(),
  );
  assert.ok(start.assignment);
  assert.equal(
    start.assignment.startsAtMs,
    10_000 + LIVE_ENEMY_FORMATION_LEAD_IN_MS,
  );

  const beforeStart = projectLiveEnemyFormationMotion({
    assignment: start.assignment,
    nowMs: start.assignment.startsAtMs - 1,
    worldWidth: 1600,
    worldHeight: 960,
  });
  assert.equal(beforeStart.started, false);
  assert.equal(beforeStart.progress, 0);
  assert.equal(beforeStart.complete, false);

  const exactEnd = projectLiveEnemyFormationMotion({
    assignment: start.assignment,
    nowMs: start.assignment.startsAtMs + LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS,
    worldWidth: 1600,
    worldHeight: 960,
  });
  assert.equal(exactEnd.progress, 1);
  assert.equal(exactEnd.complete, true);
  assert.equal(exactEnd.phase, "COMPLETE");

  assert.equal(
    start.state.activeUntilMs,
    start.assignment.startsAtMs +
      LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS +
      LIVE_ENEMY_FORMATION_RECOVERY_MS,
  );

  const blocked = requestLiveEnemyFormationSpawn(
    { ...start.state, pending: null },
    makeRequest({
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE * 2,
      nowMs: start.state.activeUntilMs - 1,
    }),
  );
  assert.equal(blocked.assignment, null);

  const allowed = requestLiveEnemyFormationSpawn(
    { ...start.state, pending: null },
    makeRequest({
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE * 2,
      nowMs: start.state.activeUntilMs,
    }),
  );
  assert.ok(allowed.assignment);
});

test("J3D certifies every live member stays finite and inside world margins", () => {
  const margin = LIVE_ENEMY_FORMATION_WORLD_MARGIN;
  for (const route of ROUTES) {
    const memberCount = getLiveEnemyFormationRouteMemberCount(route);
    for (let memberIndex = 0; memberIndex < memberCount; memberIndex += 1) {
      const assignment = assignmentFor(route, memberIndex);
      for (let step = 0; step <= 40; step += 1) {
        const nowMs =
          assignment.startsAtMs +
          (LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS * step) / 40;
        const projection = projectLiveEnemyFormationMotion({
          assignment,
          nowMs,
          worldWidth: 1600,
          worldHeight: 960,
        });
        assert.equal(Number.isFinite(projection.x), true);
        assert.equal(Number.isFinite(projection.y), true);
        assert.ok(projection.x >= margin && projection.x <= 1600 - margin);
        assert.ok(projection.y >= margin && projection.y <= 960 - margin);
      }
    }
  }
});

test("J3D certifies WEDGE and ORBIT cannot start or finish assembly by overcommitting capacity", () => {
  for (const ordinal of [3, 4]) {
    const blocked = requestLiveEnemyFormationSpawn(
      stateAtOrdinal(ordinal),
      makeRequest({ remainingCapacity: 2 }),
    );
    assert.equal(blocked.assignment, null);
    assert.equal(blocked.state.pending, null);
    assert.equal(blocked.state.nextGroupOrdinal, ordinal);

    const first = requestLiveEnemyFormationSpawn(
      stateAtOrdinal(ordinal),
      makeRequest({ remainingCapacity: 3 }),
    );
    assert.ok(first.assignment);
    assert.equal(first.assignment.memberCount, 3);
    assert.ok(first.state.pending);

    const overcommit = requestLiveEnemyFormationSpawn(
      first.state,
      makeRequest({
        spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE + 1,
        remainingCapacity: 1,
        nowMs: 10_200,
      }),
    );
    assert.equal(overcommit.assignment, null);
    assert.equal(overcommit.state.pending?.nextMemberIndex, 1);

    const expired = requestLiveEnemyFormationSpawn(
      overcommit.state,
      makeRequest({
        enemyType: EnemyType.DRONE,
        eligibleEnemy: false,
        spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE + 2,
        remainingCapacity: 1,
        nowMs:
          (overcommit.state.pending?.assemblyDeadlineMs ?? 0) +
          LIVE_ENEMY_FORMATION_ASSEMBLY_GRACE_MS,
      }),
    );
    assert.equal(expired.assignment, null);
    assert.equal(expired.state.pending, null);
  }
});

test("J3D certifies one active or assembling formation group at a time", () => {
  const first = requestLiveEnemyFormationSpawn(
    stateAtOrdinal(3),
    makeRequest({ remainingCapacity: 3 }),
  );
  assert.ok(first.assignment);
  assert.ok(first.state.pending);

  const second = requestLiveEnemyFormationSpawn(
    first.state,
    makeRequest({
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE * 2,
      remainingCapacity: 3,
      nowMs: 10_200,
    }),
  );
  assert.ok(second.assignment);
  assert.equal(second.assignment.groupId, first.assignment.groupId);
  assert.equal(second.assignment.memberIndex, 1);
  assert.equal(second.state.nextGroupOrdinal, first.state.nextGroupOrdinal);
});

test("J3D certifies base and advanced route eligibility remain independently configurable by mode", () => {
  const campaignAdvancedOff = {
    ...LIVE_ENEMY_FORMATION_POLICY,
    campaignEnabled: true,
    infiniteEnabled: true,
    campaignAdvancedRoutesEnabled: false,
    infiniteAdvancedRoutesEnabled: true,
  };

  const campaignPlan = resolveLiveEnemyFormationRoutePlan(
    3,
    "CAMPAIGN",
    campaignAdvancedOff,
  );
  assert.equal(campaignPlan.route, "PINCER");
  assert.equal(campaignPlan.memberCount, 2);

  const infinitePlan = resolveLiveEnemyFormationRoutePlan(
    3,
    "INFINITE",
    campaignAdvancedOff,
  );
  assert.equal(infinitePlan.route, "WEDGE");
  assert.equal(infinitePlan.memberCount, 3);

  const campaignDisabled = requestLiveEnemyFormationSpawn(
    createLiveEnemyFormationDirectorState(),
    makeRequest({ policy: { ...campaignAdvancedOff, campaignEnabled: false } }),
  );
  assert.equal(campaignDisabled.assignment, null);

  const infiniteEnabled = requestLiveEnemyFormationSpawn(
    createLiveEnemyFormationDirectorState(),
    makeRequest({
      sourceMode: "INFINITE",
      waveNumber: 1,
      policy: campaignAdvancedOff,
    }),
  );
  assert.ok(infiniteEnabled.assignment);
});

test("J3D certifies milestone and ineligible enemy exclusions remain fail-closed", () => {
  const initial = createLiveEnemyFormationDirectorState();
  assert.equal(
    requestLiveEnemyFormationSpawn(initial, makeRequest({ milestoneActive: true })).assignment,
    null,
  );
  assert.equal(
    requestLiveEnemyFormationSpawn(initial, makeRequest({ eligibleEnemy: false })).assignment,
    null,
  );
  for (const enemyType of [
    EnemyType.PARASITE,
    EnemyType.DRONE,
    EnemyType.DISRUPTOR,
    EnemyType.BLACKOUT_ELITE,
    EnemyType.RIFT_HUNTER,
  ]) {
    assert.equal(
      requestLiveEnemyFormationSpawn(initial, makeRequest({ enemyType })).assignment,
      null,
    );
  }
});

test("J3D certifies long route-plan sequences are deterministic and bounded", () => {
  const first: string[] = [];
  const second: string[] = [];

  for (let ordinal = 0; ordinal < 120; ordinal += 1) {
    const a = resolveLiveEnemyFormationRoutePlan(ordinal, "INFINITE");
    const b = resolveLiveEnemyFormationRoutePlan(ordinal, "INFINITE");
    first.push(`${a.route}:${a.memberCount}`);
    second.push(`${b.route}:${b.memberCount}`);
    assert.ok(a.memberCount >= 2 && a.memberCount <= 3);
  }

  assert.deepEqual(first, second);
  assert.deepEqual(first.slice(0, 6), [
    "PINCER:2",
    "X_CROSS:2",
    "SERPENTINE:2",
    "WEDGE:3",
    "ORBIT:3",
    "SPIRAL:2",
  ]);
});
