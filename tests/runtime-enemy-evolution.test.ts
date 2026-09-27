import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCertifiedInfiniteSectorPlan,
  NEUTRAL_INFINITE_RUN_CONTEXT,
} from "../src/game/infinitePlanBuilder.ts";
import type { InfiniteSessionState } from "../src/game/infiniteSession.ts";
import {
  EVOLVED_ENEMY_VARIANTS,
  getRuntimeEnemyEvolutionPolicy,
  resolveEvolvedEnemySpawn,
  selectEvolvedEnemyVariant,
} from "../src/game/runtimeEnemyEvolution.ts";
import {
  createCampaignRuntimeWaveDescriptor,
  createInfiniteRuntimeWaveDescriptor,
} from "../src/game/runtimeWaveDescriptor.ts";
import { EnemyType } from "../src/game/types.ts";

const descriptorForSector = (
  sector: number,
  seed = "enemy-evolution-contract",
) => {
  const plan = buildCertifiedInfiniteSectorPlan(
    sector,
    seed,
    NEUTRAL_INFINITE_RUN_CONTEXT,
  );

  const session: InfiniteSessionState = {
    kind: "INFINITE_SESSION",
    sessionId: `test-session:${seed}:${sector}`,
    seed,
    status: "ACTIVE",
    currentSector: sector,
    currentWaveNumber: 1,
    sectorsCompleted: sector - 11,
    wavesCompleted: 0,
    context: { ...plan.effectiveRecipe.context },
    currentPlan: plan,
  };

  return createInfiniteRuntimeWaveDescriptor(session);
};

const regularEnemyTypes = [
  EnemyType.CRAWLER,
  EnemyType.PARASITE,
  EnemyType.DRONE,
  EnemyType.SPLITTER,
  EnemyType.DISRUPTOR,
] as const;

const firstSelectedOrdinal = (
  descriptor: ReturnType<typeof descriptorForSector>,
  enemyType: EnemyType,
) => {
  for (let ordinal = 0; ordinal < 2000; ordinal += 1) {
    if (
      selectEvolvedEnemyVariant(
        descriptor,
        enemyType,
        ordinal,
      )
    ) {
      return ordinal;
    }
  }

  return null;
};

test("campaign descriptors never enable evolved enemies", () => {
  for (let sector = 1; sector <= 10; sector += 1) {
    const descriptor =
      createCampaignRuntimeWaveDescriptor(sector);
    const policy =
      getRuntimeEnemyEvolutionPolicy(descriptor);

    assert.equal(policy.sourceMode, "CAMPAIGN");
    assert.equal(policy.tier, null);
    assert.equal(policy.enabled, false);
    assert.equal(policy.evolutionChance, 0);
    assert.equal(policy.maxConcurrentEvolvedEnemies, 0);
    assert.deepEqual(policy.eligibleEnemyTypes, []);

    for (const enemyType of regularEnemyTypes) {
      assert.equal(
        selectEvolvedEnemyVariant(
          descriptor,
          enemyType,
          0,
        ),
        null,
      );
    }
  }
});

test("Infinite Mastery Sectors 11-25 remain evolution-free", () => {
  for (const sector of [11, 15, 20, 25]) {
    const descriptor = descriptorForSector(sector);
    const policy =
      getRuntimeEnemyEvolutionPolicy(descriptor);

    assert.equal(policy.tier, "MASTERY");
    assert.equal(policy.enabled, false);
    assert.equal(policy.evolutionChance, 0);
    assert.equal(policy.maxConcurrentEvolvedEnemies, 0);
    assert.deepEqual(policy.eligibleEnemyTypes, []);
  }
});

test("tier policy introduces bounded evolution only from Sector 26 onward", () => {
  const cases = [
    {
      sector: 26,
      tier: "ADVANCED_COMBINATION",
      chance: 0.12,
      cap: 1,
    },
    {
      sector: 51,
      tier: "HIGH_PRESSURE",
      chance: 0.2,
      cap: 2,
    },
    {
      sector: 101,
      tier: "ENDLESS_ENDGAME",
      chance: 0.28,
      cap: 3,
    },
  ] as const;

  for (const expected of cases) {
    const policy = getRuntimeEnemyEvolutionPolicy(
      descriptorForSector(expected.sector),
    );

    assert.equal(policy.tier, expected.tier);
    assert.equal(policy.enabled, true);
    assert.equal(
      policy.evolutionChance,
      expected.chance,
    );
    assert.equal(
      policy.maxConcurrentEvolvedEnemies,
      expected.cap,
    );
    assert.deepEqual(
      policy.eligibleEnemyTypes,
      regularEnemyTypes,
    );
  }
});

test("variant identities are explicit and exclude milestone/boss enemy classes", () => {
  assert.equal(
    EVOLVED_ENEMY_VARIANTS[EnemyType.CRAWLER]?.id,
    "BULWARK_CRAWLER",
  );
  assert.equal(
    EVOLVED_ENEMY_VARIANTS[EnemyType.PARASITE]?.id,
    "PHASE_PARASITE",
  );
  assert.equal(
    EVOLVED_ENEMY_VARIANTS[EnemyType.DRONE]?.id,
    "LANCE_DRONE",
  );
  assert.equal(
    EVOLVED_ENEMY_VARIANTS[EnemyType.SPLITTER]?.id,
    "BROOD_SPLITTER",
  );
  assert.equal(
    EVOLVED_ENEMY_VARIANTS[EnemyType.DISRUPTOR]?.id,
    "NULL_DISRUPTOR",
  );
  assert.equal(
    EVOLVED_ENEMY_VARIANTS[EnemyType.BLACKOUT_ELITE],
    undefined,
  );
  assert.equal(
    EVOLVED_ENEMY_VARIANTS[EnemyType.BOSS_DEVOURER],
    undefined,
  );

  const descriptor = descriptorForSector(101);
  for (let ordinal = 0; ordinal < 500; ordinal += 1) {
    assert.equal(
      selectEvolvedEnemyVariant(
        descriptor,
        EnemyType.BLACKOUT_ELITE,
        ordinal,
      ),
      null,
    );
    assert.equal(
      selectEvolvedEnemyVariant(
        descriptor,
        EnemyType.BOSS_DEVOURER,
        ordinal,
      ),
      null,
    );
  }
});

test("selection is deterministic from descriptor seed identity enemy type and spawn ordinal", () => {
  const first = descriptorForSector(
    51,
    "deterministic-evolution",
  );
  const second = descriptorForSector(
    51,
    "deterministic-evolution",
  );

  const firstResults = Array.from(
    { length: 400 },
    (_, ordinal) =>
      selectEvolvedEnemyVariant(
        first,
        EnemyType.DRONE,
        ordinal,
      )?.id ?? null,
  );
  const secondResults = Array.from(
    { length: 400 },
    (_, ordinal) =>
      selectEvolvedEnemyVariant(
        second,
        EnemyType.DRONE,
        ordinal,
      )?.id ?? null,
  );

  assert.deepEqual(firstResults, secondResults);
  assert.ok(firstResults.some(Boolean));
  assert.ok(firstResults.some((value) => value === null));
});

test("malformed spawn ordinals and active-evolved counts fail closed", () => {
  const descriptor = descriptorForSector(101);

  for (const ordinal of [
    -1,
    -100,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ]) {
    assert.equal(
      selectEvolvedEnemyVariant(
        descriptor,
        EnemyType.CRAWLER,
        ordinal,
      ),
      null,
    );
  }

  for (const activeEvolvedEnemies of [
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ]) {
    assert.equal(
      resolveEvolvedEnemySpawn({
        descriptor,
        enemyType: EnemyType.CRAWLER,
        spawnOrdinal: 0,
        activeEvolvedEnemies,
      }),
      null,
    );
  }
});

test("concurrency budget blocks otherwise eligible evolved spawns", () => {
  const descriptor = descriptorForSector(26);
  const ordinal = firstSelectedOrdinal(
    descriptor,
    EnemyType.CRAWLER,
  );
  assert.notEqual(ordinal, null);

  const selected = resolveEvolvedEnemySpawn({
    descriptor,
    enemyType: EnemyType.CRAWLER,
    spawnOrdinal: ordinal ?? 0,
    activeEvolvedEnemies: 0,
  });
  assert.equal(selected?.id, "BULWARK_CRAWLER");

  const blocked = resolveEvolvedEnemySpawn({
    descriptor,
    enemyType: EnemyType.CRAWLER,
    spawnOrdinal: ordinal ?? 0,
    activeEvolvedEnemies: 1,
  });
  assert.equal(blocked, null);
});

test("evolved profiles remain finite and conservatively bounded", () => {
  for (const enemyType of regularEnemyTypes) {
    const profile = EVOLVED_ENEMY_VARIANTS[enemyType];
    assert.ok(profile);

    for (const value of [
      profile.healthMultiplier,
      profile.movementSpeedMultiplier,
      profile.contactDamageMultiplier,
      profile.attackRateMultiplier,
      profile.projectileSpeedMultiplier,
      profile.specialIntensity,
      profile.rewardMultiplier,
    ]) {
      assert.equal(Number.isFinite(value), true);
      assert.ok(value >= 0);
    }

    assert.ok(profile.healthMultiplier >= 1);
    assert.ok(profile.healthMultiplier <= 1.5);
    assert.ok(profile.movementSpeedMultiplier >= 0.8);
    assert.ok(profile.movementSpeedMultiplier <= 1.25);
    assert.ok(profile.contactDamageMultiplier <= 1.25);
    assert.ok(profile.attackRateMultiplier <= 1.2);
    assert.ok(profile.projectileSpeedMultiplier <= 1.3);
    assert.ok(profile.specialIntensity <= 0.6);
    assert.ok(profile.rewardMultiplier >= 1);
    assert.ok(profile.rewardMultiplier <= 1.5);
  }
});

test("evolution policy stays finite bounded and tier-correct through Sector 1000", () => {
  for (let sector = 11; sector <= 1000; sector += 1) {
    const policy = getRuntimeEnemyEvolutionPolicy(
      descriptorForSector(
        sector,
        "evolution-long-range",
      ),
    );

    assert.equal(
      Number.isFinite(policy.evolutionChance),
      true,
    );
    assert.ok(policy.evolutionChance >= 0);
    assert.ok(policy.evolutionChance <= 0.28);
    assert.ok(
      policy.maxConcurrentEvolvedEnemies >= 0 &&
        policy.maxConcurrentEvolvedEnemies <= 3,
    );

    if (sector <= 25) {
      assert.equal(policy.enabled, false);
      assert.equal(policy.evolutionChance, 0);
      assert.equal(
        policy.maxConcurrentEvolvedEnemies,
        0,
      );
    } else {
      assert.equal(policy.enabled, true);
      assert.deepEqual(
        policy.eligibleEnemyTypes,
        regularEnemyTypes,
      );
    }
  }
});
