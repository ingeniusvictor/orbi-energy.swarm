import assert from "node:assert/strict";
import test from "node:test";

import {
  LIVE_ENEMY_FORMATION_ADVANCED_GROUP_SIZE,
  LIVE_ENEMY_FORMATION_GROUP_SIZE,
  LIVE_ENEMY_FORMATION_POLICY,
  LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS,
  LIVE_ENEMY_FORMATION_SPAWN_CADENCE,
  createLiveEnemyFormationDirectorState,
  getLiveEnemyFormationRouteMemberCount,
  projectLiveEnemyFormationMotion,
  requestLiveEnemyFormationSpawn,
  resolveLiveEnemyFormationRoutePlan,
  type LiveEnemyFormationDirectorState,
  type LiveEnemyFormationSpawnRequest,
} from "../../src/game/liveEnemyFormationDirector.ts";
import { EnemyType } from "../../src/game/types.ts";

const makeRequest = (
  overrides: Partial<LiveEnemyFormationSpawnRequest> = {},
): LiveEnemyFormationSpawnRequest => ({
  sourceMode: "CAMPAIGN",
  waveNumber: 4,
  descriptorId: "campaign:test",
  milestoneActive: false,
  spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE,
  enemyType: EnemyType.CRAWLER,
  eligibleEnemy: true,
  remainingCapacity: 4,
  nowMs: 10000,
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

test("J3B legacy live routes remain bounded to a two-member group", () => {
  assert.equal(LIVE_ENEMY_FORMATION_GROUP_SIZE, 2);
  const initial = createLiveEnemyFormationDirectorState();
  const first = requestLiveEnemyFormationSpawn(initial, makeRequest());

  assert.ok(first.assignment);
  assert.equal(first.assignment.route, "PINCER");
  assert.equal(first.assignment.memberIndex, 0);
  assert.equal(first.assignment.memberCount, 2);
  assert.ok(first.state.pending);
  assert.equal(first.state.pending?.nextMemberIndex, 1);

  const second = requestLiveEnemyFormationSpawn(
    first.state,
    makeRequest({ spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE + 1, nowMs: 10500 }),
  );
  assert.ok(second.assignment);
  assert.equal(second.assignment.memberIndex, 1);
  assert.equal(second.assignment.groupId, first.assignment.groupId);
  assert.equal(second.assignment.route, first.assignment.route);
  assert.equal(second.assignment.startsAtMs, first.assignment.startsAtMs);
  assert.equal(second.state.pending, null);
});

test("J3C-B route plans size only WEDGE and ORBIT up to three members", () => {
  assert.equal(LIVE_ENEMY_FORMATION_ADVANCED_GROUP_SIZE, 3);
  const expected = [
    ["PINCER", 2],
    ["X_CROSS", 2],
    ["SERPENTINE", 2],
    ["WEDGE", 3],
    ["ORBIT", 3],
    ["SPIRAL", 2],
  ] as const;

  for (let ordinal = 0; ordinal < expected.length; ordinal += 1) {
    const plan = resolveLiveEnemyFormationRoutePlan(ordinal, "CAMPAIGN");
    assert.equal(plan.route, expected[ordinal][0]);
    assert.equal(plan.memberCount, expected[ordinal][1]);
    assert.equal(
      getLiveEnemyFormationRouteMemberCount(plan.route),
      expected[ordinal][1],
    );
  }
});

test("WEDGE assembles three members from three ordinary spawn opportunities", () => {
  const first = requestLiveEnemyFormationSpawn(
    stateAtOrdinal(3),
    makeRequest({ remainingCapacity: 3 }),
  );
  assert.ok(first.assignment);
  assert.equal(first.assignment.route, "WEDGE");
  assert.equal(first.assignment.memberCount, 3);
  assert.equal(first.assignment.memberIndex, 0);
  assert.equal(first.state.pending?.nextMemberIndex, 1);

  const second = requestLiveEnemyFormationSpawn(
    first.state,
    makeRequest({
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE + 1,
      remainingCapacity: 2,
      nowMs: 10300,
    }),
  );
  assert.ok(second.assignment);
  assert.equal(second.assignment.route, "WEDGE");
  assert.equal(second.assignment.memberIndex, 1);
  assert.equal(second.assignment.groupId, first.assignment.groupId);
  assert.equal(second.state.pending?.nextMemberIndex, 2);

  const third = requestLiveEnemyFormationSpawn(
    second.state,
    makeRequest({
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE + 2,
      remainingCapacity: 1,
      nowMs: 10600,
    }),
  );
  assert.ok(third.assignment);
  assert.equal(third.assignment.route, "WEDGE");
  assert.equal(third.assignment.memberIndex, 2);
  assert.equal(third.assignment.groupId, first.assignment.groupId);
  assert.equal(third.state.pending, null);
});

test("ORBIT requires three live slots while SPIRAL remains a bounded pair", () => {
  const orbitBlocked = requestLiveEnemyFormationSpawn(
    stateAtOrdinal(4),
    makeRequest({ remainingCapacity: 2 }),
  );
  assert.equal(orbitBlocked.assignment, null);
  assert.deepEqual(orbitBlocked.state, stateAtOrdinal(4));

  const orbit = requestLiveEnemyFormationSpawn(
    stateAtOrdinal(4),
    makeRequest({ remainingCapacity: 3 }),
  );
  assert.ok(orbit.assignment);
  assert.equal(orbit.assignment.route, "ORBIT");
  assert.equal(orbit.assignment.memberCount, 3);

  const spiral = requestLiveEnemyFormationSpawn(
    stateAtOrdinal(5),
    makeRequest({ remainingCapacity: 2 }),
  );
  assert.ok(spiral.assignment);
  assert.equal(spiral.assignment.route, "SPIRAL");
  assert.equal(spiral.assignment.memberCount, 2);
});

test("pending advanced assembly refuses capacity overcommit and expires safely", () => {
  const first = requestLiveEnemyFormationSpawn(
    stateAtOrdinal(3),
    makeRequest({ remainingCapacity: 3 }),
  );
  assert.ok(first.assignment);
  assert.ok(first.state.pending);

  const refused = requestLiveEnemyFormationSpawn(
    first.state,
    makeRequest({
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE + 1,
      remainingCapacity: 1,
      nowMs: 10300,
    }),
  );
  assert.equal(refused.assignment, null);
  assert.equal(refused.state.pending?.nextMemberIndex, 1);

  const expired = requestLiveEnemyFormationSpawn(
    refused.state,
    makeRequest({
      enemyType: EnemyType.DRONE,
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE + 2,
      remainingCapacity: 1,
      nowMs: (refused.state.pending?.assemblyDeadlineMs ?? 0) + 1,
    }),
  );
  assert.equal(expired.assignment, null);
  assert.equal(expired.state.pending, null);
});

test("advanced route adoption is independently configurable across Campaign and Infinite", () => {
  const campaignLegacyOnly = {
    ...LIVE_ENEMY_FORMATION_POLICY,
    campaignAdvancedRoutesEnabled: false,
    infiniteAdvancedRoutesEnabled: true,
  };
  const campaign = requestLiveEnemyFormationSpawn(
    stateAtOrdinal(3),
    makeRequest({ policy: campaignLegacyOnly }),
  );
  assert.ok(campaign.assignment);
  assert.equal(campaign.assignment.route, "PINCER");
  assert.equal(campaign.assignment.memberCount, 2);

  const infinite = requestLiveEnemyFormationSpawn(
    stateAtOrdinal(3),
    makeRequest({
      sourceMode: "INFINITE",
      waveNumber: 1,
      policy: campaignLegacyOnly,
    }),
  );
  assert.ok(infinite.assignment);
  assert.equal(infinite.assignment.route, "WEDGE");
  assert.equal(infinite.assignment.memberCount, 3);
});

test("formation consumes an existing spawn decision and never starts without capacity", () => {
  const initial = createLiveEnemyFormationDirectorState();
  const blocked = requestLiveEnemyFormationSpawn(
    initial,
    makeRequest({ remainingCapacity: 1 }),
  );
  assert.equal(blocked.assignment, null);
  assert.deepEqual(blocked.state, initial);

  const offCadence = requestLiveEnemyFormationSpawn(
    initial,
    makeRequest({ spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE - 1 }),
  );
  assert.equal(offCadence.assignment, null);
  assert.deepEqual(offCadence.state, initial);
});

test("Campaign and Infinite eligibility are independently controllable", () => {
  const initial = createLiveEnemyFormationDirectorState();
  const campaignOff = requestLiveEnemyFormationSpawn(
    initial,
    makeRequest({
      policy: { ...LIVE_ENEMY_FORMATION_POLICY, campaignEnabled: false },
    }),
  );
  assert.equal(campaignOff.assignment, null);

  const infiniteOn = requestLiveEnemyFormationSpawn(
    initial,
    makeRequest({
      sourceMode: "INFINITE",
      waveNumber: 1,
      policy: {
        ...LIVE_ENEMY_FORMATION_POLICY,
        campaignEnabled: false,
        infiniteEnabled: true,
      },
    }),
  );
  assert.ok(infiniteOn.assignment);

  const infiniteOff = requestLiveEnemyFormationSpawn(
    initial,
    makeRequest({
      sourceMode: "INFINITE",
      waveNumber: 1,
      policy: { ...LIVE_ENEMY_FORMATION_POLICY, infiniteEnabled: false },
    }),
  );
  assert.equal(infiniteOff.assignment, null);
});

test("Campaign onboarding, boss wave and milestone waves remain excluded", () => {
  const initial = createLiveEnemyFormationDirectorState();
  for (const waveNumber of [1, 2, 3, 10]) {
    const result = requestLiveEnemyFormationSpawn(
      initial,
      makeRequest({ waveNumber }),
    );
    assert.equal(result.assignment, null);
  }

  const milestone = requestLiveEnemyFormationSpawn(
    initial,
    makeRequest({ milestoneActive: true }),
  );
  assert.equal(milestone.assignment, null);
});

test("only ordinary crawler/splitter movement candidates can receive live assignment", () => {
  const initial = createLiveEnemyFormationDirectorState();
  for (const enemyType of [
    EnemyType.PARASITE,
    EnemyType.DRONE,
    EnemyType.DISRUPTOR,
    EnemyType.BLACKOUT_ELITE,
    EnemyType.RIFT_HUNTER,
  ]) {
    const result = requestLiveEnemyFormationSpawn(
      initial,
      makeRequest({ enemyType }),
    );
    assert.equal(result.assignment, null);
  }

  assert.ok(
    requestLiveEnemyFormationSpawn(
      initial,
      makeRequest({ enemyType: EnemyType.CRAWLER }),
    ).assignment,
  );
  assert.ok(
    requestLiveEnemyFormationSpawn(
      initial,
      makeRequest({ enemyType: EnemyType.SPLITTER }),
    ).assignment,
  );
});

test("evolved/elite/miniboss caller guard can opt an otherwise eligible type out", () => {
  const initial = createLiveEnemyFormationDirectorState();
  const result = requestLiveEnemyFormationSpawn(
    initial,
    makeRequest({ eligibleEnemy: false }),
  );
  assert.equal(result.assignment, null);
});

test("active group blocks a second formation until exact recovery boundary", () => {
  const initial = createLiveEnemyFormationDirectorState();
  const first = requestLiveEnemyFormationSpawn(initial, makeRequest());
  assert.ok(first.assignment);

  const blocked = requestLiveEnemyFormationSpawn(
    { ...first.state, pending: null },
    makeRequest({
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE * 2,
      nowMs: first.state.activeUntilMs - 1,
    }),
  );
  assert.equal(blocked.assignment, null);

  const allowed = requestLiveEnemyFormationSpawn(
    { ...first.state, pending: null },
    makeRequest({
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE * 2,
      nowMs: first.state.activeUntilMs,
    }),
  );
  assert.ok(allowed.assignment);
  assert.notEqual(allowed.assignment.groupId, first.assignment.groupId);
});

test("pending second slot expires without creating any replacement spawn", () => {
  const initial = createLiveEnemyFormationDirectorState();
  const first = requestLiveEnemyFormationSpawn(initial, makeRequest());
  assert.ok(first.state.pending);

  const expired = requestLiveEnemyFormationSpawn(
    first.state,
    makeRequest({
      enemyType: EnemyType.DRONE,
      spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE + 1,
      nowMs: (first.state.pending?.assemblyDeadlineMs ?? 0) + 1,
    }),
  );
  assert.equal(expired.assignment, null);
  assert.equal(expired.state.pending, null);
});

test("motion is deterministic from assignment plus caller simulation time", () => {
  const first = requestLiveEnemyFormationSpawn(
    createLiveEnemyFormationDirectorState(),
    makeRequest(),
  );
  assert.ok(first.assignment);

  const nowMs = first.assignment.startsAtMs + 1300;
  const input = {
    assignment: first.assignment,
    nowMs,
    worldWidth: 1600,
    worldHeight: 960,
  };
  assert.deepEqual(
    projectLiveEnemyFormationMotion(input),
    projectLiveEnemyFormationMotion(input),
  );
});

test("lead-in holds progress at zero and exact duration boundary completes", () => {
  const first = requestLiveEnemyFormationSpawn(
    createLiveEnemyFormationDirectorState(),
    makeRequest(),
  );
  assert.ok(first.assignment);

  const before = projectLiveEnemyFormationMotion({
    assignment: first.assignment,
    nowMs: first.assignment.startsAtMs - 1,
    worldWidth: 1600,
    worldHeight: 960,
  });
  assert.equal(before.started, false);
  assert.equal(before.progress, 0);
  assert.equal(before.complete, false);

  const end = projectLiveEnemyFormationMotion({
    assignment: first.assignment,
    nowMs: first.assignment.startsAtMs + LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS,
    worldWidth: 1600,
    worldHeight: 960,
  });
  assert.equal(end.started, true);
  assert.equal(end.progress, 1);
  assert.equal(end.complete, true);
  assert.equal(end.phase, "COMPLETE");
});

test("formation materialization stays finite and inside world margins for all live routes", () => {
  let state = createLiveEnemyFormationDirectorState();
  for (let group = 0; group < 6; group += 1) {
    const start = requestLiveEnemyFormationSpawn(
      state,
      makeRequest({
        spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE * (group + 1),
        nowMs: Math.max(10000 + group * 10000, state.activeUntilMs),
        remainingCapacity: 4,
        anchorX: group % 2 === 0 ? 0 : 1600,
        anchorY: group % 2 === 0 ? 0 : 960,
      }),
    );
    assert.ok(start.assignment);
    state = { ...start.state, pending: null };

    for (let step = 0; step <= 20; step += 1) {
      const motion = projectLiveEnemyFormationMotion({
        assignment: start.assignment,
        nowMs:
          start.assignment.startsAtMs +
          (LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS * step) / 20,
        worldWidth: 1600,
        worldHeight: 960,
      });
      assert.equal(Number.isFinite(motion.x), true);
      assert.equal(Number.isFinite(motion.y), true);
      assert.ok(motion.x >= 20 && motion.x <= 1580);
      assert.ok(motion.y >= 20 && motion.y <= 940);
    }
  }
});

test("invalid caller-owned timing/capacity and route-plan inputs fail closed", () => {
  const initial = createLiveEnemyFormationDirectorState();
  for (const nowMs of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(
      () => requestLiveEnemyFormationSpawn(initial, makeRequest({ nowMs })),
      RangeError,
    );
  }
  assert.throws(
    () => requestLiveEnemyFormationSpawn(initial, makeRequest({ remainingCapacity: 0 })),
    RangeError,
  );
  assert.throws(
    () => requestLiveEnemyFormationSpawn(initial, makeRequest({ spawnOrdinal: -1 })),
    RangeError,
  );
  assert.throws(
    () => resolveLiveEnemyFormationRoutePlan(-1, "CAMPAIGN"),
    RangeError,
  );
});
