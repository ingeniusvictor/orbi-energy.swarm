import assert from "node:assert/strict";
import test from "node:test";

import {
  TACTICAL_ENEMY_AUTHORITY_CONTRACT,
  TACTICAL_ENEMY_FAMILY_COUNT,
  TACTICAL_ENEMY_FAMILY_PROFILES,
  getTacticalEnemyFamilyProfile,
  getTacticalEnemyFamilyProfileById,
  isCertifiedTacticalEnemyType,
  type TacticalEnemyFamilyId,
} from "../../src/game/tacticalEnemyFamilies.ts";
import { EnemyType } from "../../src/game/types.ts";

const EXPECTED_FAMILIES = [
  ["WARP_AMBUSHER", EnemyType.RIFT_HUNTER],
  ["ARTILLERY_CARRIER", EnemyType.SIEGE_PRISM],
  ["FORMATION_BREAKER", EnemyType.SWARM_REAVER],
  ["JAMMER", EnemyType.VOID_ANCHOR],
] as const;

test("J4A certifies exactly four existing enemy types with one family each", () => {
  assert.equal(TACTICAL_ENEMY_FAMILY_COUNT, 4);
  assert.equal(TACTICAL_ENEMY_FAMILY_PROFILES.length, 4);
  assert.deepEqual(
    TACTICAL_ENEMY_FAMILY_PROFILES.map((profile) => [
      profile.familyId,
      profile.enemyType,
    ]),
    EXPECTED_FAMILIES,
  );

  assert.equal(
    new Set(TACTICAL_ENEMY_FAMILY_PROFILES.map((profile) => profile.familyId)).size,
    TACTICAL_ENEMY_FAMILY_COUNT,
  );
  assert.equal(
    new Set(TACTICAL_ENEMY_FAMILY_PROFILES.map((profile) => profile.enemyType)).size,
    TACTICAL_ENEMY_FAMILY_COUNT,
  );
});

test("family lookup is deterministic, immutable and symmetric by enemy type and family id", () => {
  assert.equal(Object.isFrozen(TACTICAL_ENEMY_FAMILY_PROFILES), true);
  assert.equal(Object.isFrozen(TACTICAL_ENEMY_AUTHORITY_CONTRACT), true);

  for (const [familyId, enemyType] of EXPECTED_FAMILIES) {
    const first = getTacticalEnemyFamilyProfile(enemyType);
    const second = getTacticalEnemyFamilyProfile(enemyType);
    const byId = getTacticalEnemyFamilyProfileById(familyId);

    assert.ok(first);
    assert.equal(first, second);
    assert.equal(first, byId);
    assert.equal(first.familyId, familyId);
    assert.equal(first.enemyType, enemyType);
    assert.equal(Object.isFrozen(first), true);
    assert.equal(Object.isFrozen(first.decision), true);
    assert.equal(Object.isFrozen(first.telegraph), true);
    assert.equal(Object.isFrozen(first.authority), true);
    assert.equal(first.authority, TACTICAL_ENEMY_AUTHORITY_CONTRACT);
    assert.equal(first.decision.counterplayIntent, first.telegraph.safeIntent);
    assert.equal(first.telegraph.required, true);

    const originalQuestion = first.decision.tacticalQuestion;
    assert.throws(() => {
      const mutableDecision = first.decision as unknown as {
        tacticalQuestion: string;
      };
      mutableDecision.tacticalQuestion = "mutated";
    }, TypeError);
    assert.equal(first.decision.tacticalQuestion, originalQuestion);
  }
});

test("each J4A family forces a distinct tactical decision and readable telegraph", () => {
  const questions = TACTICAL_ENEMY_FAMILY_PROFILES.map(
    (profile) => profile.decision.tacticalQuestion,
  );
  const pressures = TACTICAL_ENEMY_FAMILY_PROFILES.map(
    (profile) => profile.decision.pressureClass,
  );
  const telegraphs = TACTICAL_ENEMY_FAMILY_PROFILES.map(
    (profile) => profile.telegraph.kind,
  );
  const safeIntents = TACTICAL_ENEMY_FAMILY_PROFILES.map(
    (profile) => profile.telegraph.safeIntent,
  );

  assert.equal(new Set(questions).size, TACTICAL_ENEMY_FAMILY_COUNT);
  assert.equal(new Set(pressures).size, TACTICAL_ENEMY_FAMILY_COUNT);
  assert.equal(new Set(telegraphs).size, TACTICAL_ENEMY_FAMILY_COUNT);
  assert.equal(new Set(safeIntents).size, TACTICAL_ENEMY_FAMILY_COUNT);

  for (const profile of TACTICAL_ENEMY_FAMILY_PROFILES) {
    assert.ok(profile.decision.tacticalQuestion.length >= 24);
    assert.equal(profile.telegraph.required, true);
    assert.equal(profile.telegraph.severity, "HIGH");
  }
});

test("J4A explicitly classifies hard-control pressure without owning fairness or runtime policy", () => {
  assert.equal(
    getTacticalEnemyFamilyProfile(EnemyType.RIFT_HUNTER)?.decision.controlPressure,
    "NONE",
  );
  assert.equal(
    getTacticalEnemyFamilyProfile(EnemyType.SIEGE_PRISM)?.decision.controlPressure,
    "NONE",
  );
  assert.equal(
    getTacticalEnemyFamilyProfile(EnemyType.SWARM_REAVER)?.decision.controlPressure,
    "HARD",
  );
  assert.equal(
    getTacticalEnemyFamilyProfile(EnemyType.VOID_ANCHOR)?.decision.controlPressure,
    "HARD",
  );
});

test("pure family authority cannot own spawn, collections, scans, support entities or cap mutation", () => {
  assert.deepEqual(TACTICAL_ENEMY_AUTHORITY_CONTRACT, {
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsFullArrayScan: false,
    mayMutateGlobalCaps: false,
    mayCreateSupportEntities: false,
  });

  for (const profile of TACTICAL_ENEMY_FAMILY_PROFILES) {
    assert.deepEqual(profile.authority, TACTICAL_ENEMY_AUTHORITY_CONTRACT);
  }
});

test("base, boss and deferred advanced types fail closed in the J4A slice", () => {
  const unsupported = [
    EnemyType.CRAWLER,
    EnemyType.PARASITE,
    EnemyType.DRONE,
    EnemyType.SPLITTER,
    EnemyType.DISRUPTOR,
    EnemyType.BLACKOUT_ELITE,
    EnemyType.MINE_WEAVER,
    EnemyType.MIRROR_WARDEN,
    EnemyType.BOSS_DEVOURER,
    EnemyType.BOSS_TITAN,
    EnemyType.BOSS_WORM,
  ];

  for (const enemyType of unsupported) {
    assert.equal(getTacticalEnemyFamilyProfile(enemyType), null);
    assert.equal(isCertifiedTacticalEnemyType(enemyType), false);
  }

  assert.equal(
    getTacticalEnemyFamilyProfile("UNKNOWN" as EnemyType),
    null,
  );
  assert.equal(
    getTacticalEnemyFamilyProfileById("UNKNOWN" as TacticalEnemyFamilyId),
    null,
  );
});
