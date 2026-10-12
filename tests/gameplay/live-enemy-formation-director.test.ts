import assert from "node:assert/strict";
import test from "node:test";

import {
  LIVE_ENEMY_FORMATION_GROUP_SIZE,
  LIVE_ENEMY_FORMATION_POLICY,
  LIVE_ENEMY_FORMATION_ROUTE_DURATION_MS,
  LIVE_ENEMY_FORMATION_SPAWN_CADENCE,
  createLiveEnemyFormationDirectorState,
  projectLiveEnemyFormationMotion,
  requestLiveEnemyFormationSpawn,
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

test("J3B live director remains bounded to a two-member group", () => {
  assert.equal(LIVE_ENEMY_FORMATION_GROUP_SIZE, 2);
  const initial = createLiveEnemyFormationDirectorState();
  const first = requestLiveEnemyFormationSpawn(initial, makeRequest());

  assert.ok(first.assignment);
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

test("only ordinary crawler/splitter movement candidates can receive J3B assignment", () => {
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

test("formation materialization stays finite and inside world margins", () => {
  let state = createLiveEnemyFormationDirectorState();
  for (let group = 0; group < 6; group += 1) {
    const start = requestLiveEnemyFormationSpawn(
      state,
      makeRequest({
        spawnOrdinal: LIVE_ENEMY_FORMATION_SPAWN_CADENCE * (group + 1),
        nowMs: Math.max(10000 + group * 10000, state.activeUntilMs),
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

test("invalid caller-owned timing/capacity inputs fail closed", () => {
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
});
