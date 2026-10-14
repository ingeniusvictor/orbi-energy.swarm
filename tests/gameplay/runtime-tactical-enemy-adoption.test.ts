import assert from "node:assert/strict";
import test from "node:test";

import {
  J4B_LIVE_FAMILY_ID,
  J4B_TACTICAL_MIN_INFINITE_SECTOR,
  J4C_C_LIVE_FAMILY_ID,
  J4C_C_SIEGE_MIN_INFINITE_SECTOR,
  getRuntimeTacticalEnemyAdoptionPolicy,
  isRuntimeSiegeCadenceSector,
  isRuntimeTacticalCadenceSector,
  isRuntimeTacticalRecoverySector,
  resolveRuntimeTacticalEnemySpawn,
} from "../../src/game/runtimeTacticalEnemyAdoption.ts";
import { generateInfiniteSectorRecipe } from "../../src/game/infiniteSectorDirector.ts";
import { getTacticalEnemyFamilyProfileById } from "../../src/game/tacticalEnemyFamilies.ts";
import { EnemyType, FormationType } from "../../src/game/types.ts";
import type { RuntimeWaveDescriptor } from "../../src/game/runtimeWaveDescriptor.ts";

const makeDescriptor = ({
  sourceMode = "INFINITE",
  sector = 34,
  waveNumber = 4,
  waveCount = 4,
  enemyBudget = 20,
  milestone = null,
}: Partial<Pick<
  RuntimeWaveDescriptor,
  "sourceMode" | "sector" | "waveNumber" | "waveCount" | "milestone"
>> & { enemyBudget?: number } = {}): RuntimeWaveDescriptor => ({
  sourceMode,
  descriptorId: `${sourceMode.toLowerCase()}:${sector}:wave-${waveNumber}`,
  sector,
  waveNumber,
  waveCount,
  display: {
    name: "J4 tactical test wave",
    displayName: "J4 tactical test wave",
    subtitle: "test",
    description: "test",
    tacticalAdvice: "test",
    warningLevel: "HIGH",
    accentColor: "#fff",
    recommendedFormation: FormationType.LINE,
  },
  completionPolicy:
    sourceMode === "INFINITE"
      ? { type: "BUDGET_AND_CLEAR" }
      : { type: "TIMEBOX", durationMs: 60_000 },
  biomeIntent: null,
  spawn: {
    enemyBudget,
    maxConcurrentEnemies: 20,
    spawnIntervalFrames: 72,
    enemyComposition: [EnemyType.CRAWLER, EnemyType.DRONE],
    eliteChance: 0.1,
  },
  modifiers: [],
  pressure: {
    legacyDifficultyMultiplier: sourceMode === "CAMPAIGN" ? 1 : null,
    aggressionMultiplier: 1,
    projectileDensityMultiplier: 1,
    hazardIntensity: 0,
    statMultiplier: 1,
  },
  rewards: {
    resourceMultiplier: 1,
    rewardTier: null,
  },
  milestone,
  fairness:
    sourceMode === "INFINITE"
      ? {
          minTelegraphMs: 900,
          maxSimultaneousHardControlSources: 2,
          spawnSafetyRadius: 120,
          projectileBudget: 120,
        }
      : null,
  source: {
    campaignWaveId: sourceMode === "CAMPAIGN" ? `wave-${sector}` : null,
    recipeId: sourceMode === "INFINITE" ? `sector-${sector}` : null,
    waveId: sourceMode === "INFINITE" ? `wave-${waveNumber}` : null,
    seed: sourceMode === "INFINITE" ? "j4-tactical-test" : null,
  },
});

test("J4B retains the certified Warp Ambusher family", () => {
  const family = getTacticalEnemyFamilyProfileById(J4B_LIVE_FAMILY_ID);
  assert.ok(family);
  assert.equal(J4B_LIVE_FAMILY_ID, "WARP_AMBUSHER");
  assert.equal(family.enemyType, EnemyType.RIFT_HUNTER);

  const policy = getRuntimeTacticalEnemyAdoptionPolicy(makeDescriptor());
  assert.equal(policy.enabled, true);
  assert.equal(policy.familyId, "WARP_AMBUSHER");
  assert.equal(policy.enemyType, EnemyType.RIFT_HUNTER);
  assert.equal(policy.disabledReason, null);
});

test("J4C-C adopts the certified Artillery Carrier family", () => {
  const family = getTacticalEnemyFamilyProfileById(J4C_C_LIVE_FAMILY_ID);
  assert.ok(family);
  assert.equal(J4C_C_LIVE_FAMILY_ID, "ARTILLERY_CARRIER");
  assert.equal(family.enemyType, EnemyType.SIEGE_PRISM);

  const policy = getRuntimeTacticalEnemyAdoptionPolicy(
    makeDescriptor({ sector: 52 }),
  );
  assert.equal(policy.enabled, true);
  assert.equal(policy.familyId, "ARTILLERY_CARRIER");
  assert.equal(policy.enemyType, EnemyType.SIEGE_PRISM);
  assert.equal(policy.disabledReason, null);
});

test("Campaign and early Infinite sectors remain disabled", () => {
  const campaign = getRuntimeTacticalEnemyAdoptionPolicy(
    makeDescriptor({ sourceMode: "CAMPAIGN", sector: 8, waveNumber: 8, waveCount: 10 }),
  );
  assert.equal(campaign.enabled, false);
  assert.equal(campaign.disabledReason, "CAMPAIGN_DISABLED");

  for (let sector = 11; sector < J4B_TACTICAL_MIN_INFINITE_SECTOR; sector += 1) {
    const policy = getRuntimeTacticalEnemyAdoptionPolicy(makeDescriptor({ sector }));
    assert.equal(policy.enabled, false, `sector ${sector}`);
    assert.equal(policy.disabledReason, "BELOW_MIN_SECTOR", `sector ${sector}`);
  }

  for (let sector = 26; sector < J4C_C_SIEGE_MIN_INFINITE_SECTOR; sector += 1) {
    assert.equal(isRuntimeSiegeCadenceSector(sector), false, `siege sector ${sector}`);
  }
});

test("J4B sparse cadence remains exact while J4C-C adds a disjoint sparse counterphase", () => {
  const riftSectors: number[] = [];
  const siegeSectors: number[] = [];

  for (let sector = 26; sector <= 140; sector += 1) {
    const policy = getRuntimeTacticalEnemyAdoptionPolicy(makeDescriptor({ sector }));
    if (policy.familyId === J4B_LIVE_FAMILY_ID) riftSectors.push(sector);
    if (policy.familyId === J4C_C_LIVE_FAMILY_ID) siegeSectors.push(sector);
  }

  assert.deepEqual(
    riftSectors.filter((sector) => sector <= 60),
    [34, 38, 42, 46, 54, 58],
  );
  assert.deepEqual(
    siegeSectors,
    [52, 68, 84, 92, 108, 116, 124, 132],
  );
  assert.equal(riftSectors[0], 34);
  assert.equal(siegeSectors[0], 52);
  assert.equal(isRuntimeTacticalCadenceSector(34), true);
  assert.equal(isRuntimeTacticalCadenceSector(35), false);
  assert.equal(isRuntimeSiegeCadenceSector(52), true);
  assert.equal(isRuntimeSiegeCadenceSector(53), false);

  for (let sector = 26; sector <= 500; sector += 1) {
    assert.equal(
      isRuntimeTacticalCadenceSector(sector) && isRuntimeSiegeCadenceSector(sector),
      false,
      `tactical cadence overlap at sector ${sector}`,
    );
  }
});

test("milestone and recovery sectors remain excluded before either family adoption", () => {
  for (let sector = 11; sector <= 200; sector += 1) {
    const recipe = generateInfiniteSectorRecipe(sector, "j4c-c-recovery-proof");
    const descriptor = makeDescriptor({ sector });
    const policy = getRuntimeTacticalEnemyAdoptionPolicy(descriptor);

    assert.equal(
      isRuntimeTacticalRecoverySector(sector),
      recipe.recoverySector,
      `recovery sector ${sector}`,
    );

    if (sector >= J4B_TACTICAL_MIN_INFINITE_SECTOR && sector % 5 === 0) {
      assert.equal(policy.enabled, false, `milestone sector ${sector}`);
      assert.equal(policy.disabledReason, "MILESTONE_SECTOR", `milestone sector ${sector}`);
    } else if (recipe.recoverySector) {
      assert.equal(policy.enabled, false, `recovery sector ${sector}`);
      assert.equal(policy.disabledReason, "RECOVERY_SECTOR", `recovery sector ${sector}`);
    }
  }
});

test("both tactical families require the final non-milestone wave", () => {
  for (const sector of [34, 52]) {
    const earlyWave = getRuntimeTacticalEnemyAdoptionPolicy(
      makeDescriptor({ sector, waveNumber: 3, waveCount: 4 }),
    );
    assert.equal(earlyWave.enabled, false, `early wave sector ${sector}`);
    assert.equal(earlyWave.disabledReason, "NON_FINAL_WAVE", `early wave sector ${sector}`);

    const defensiveMilestone = getRuntimeTacticalEnemyAdoptionPolicy(
      makeDescriptor({
        sector,
        milestone: { kind: "MINIBOSS", id: "unexpected-miniboss" },
      }),
    );
    assert.equal(defensiveMilestone.enabled, false, `milestone wave sector ${sector}`);
    assert.equal(defensiveMilestone.disabledReason, "MILESTONE_WAVE", `milestone wave sector ${sector}`);
  }
});

test("exactly one existing budget ordinal resolves to RIFT_HUNTER", () => {
  const descriptor = makeDescriptor({ sector: 34, enemyBudget: 21 });
  const policy = getRuntimeTacticalEnemyAdoptionPolicy(descriptor);
  assert.equal(policy.enabled, true);
  assert.equal(policy.triggerSpawnOrdinal, 10);

  const resolved: Array<{ ordinal: number; enemyType: EnemyType }> = [];
  for (let ordinal = 0; ordinal < descriptor.spawn.enemyBudget; ordinal += 1) {
    const enemyType = resolveRuntimeTacticalEnemySpawn({ descriptor, spawnOrdinal: ordinal });
    if (enemyType) resolved.push({ ordinal, enemyType });
  }

  assert.deepEqual(resolved, [
    { ordinal: 10, enemyType: EnemyType.RIFT_HUNTER },
  ]);
});

test("exactly one existing budget ordinal resolves to SIEGE_PRISM", () => {
  const descriptor = makeDescriptor({ sector: 52, enemyBudget: 22 });
  const policy = getRuntimeTacticalEnemyAdoptionPolicy(descriptor);
  assert.equal(policy.enabled, true);
  assert.equal(policy.triggerSpawnOrdinal, 11);

  const resolved: Array<{ ordinal: number; enemyType: EnemyType }> = [];
  for (let ordinal = 0; ordinal < descriptor.spawn.enemyBudget; ordinal += 1) {
    const enemyType = resolveRuntimeTacticalEnemySpawn({ descriptor, spawnOrdinal: ordinal });
    if (enemyType) resolved.push({ ordinal, enemyType });
  }

  assert.deepEqual(resolved, [
    { ordinal: 11, enemyType: EnemyType.SIEGE_PRISM },
  ]);
});

test("invalid ordinals and insufficient budgets fail closed for both live families", () => {
  for (const sector of [34, 52]) {
    const descriptor = makeDescriptor({ sector });
    for (const spawnOrdinal of [-1, 1.25, Number.NaN, Number.POSITIVE_INFINITY]) {
      assert.equal(resolveRuntimeTacticalEnemySpawn({ descriptor, spawnOrdinal }), null);
    }

    const tiny = getRuntimeTacticalEnemyAdoptionPolicy(
      makeDescriptor({ sector, enemyBudget: 2 }),
    );
    assert.equal(tiny.enabled, false);
    assert.equal(tiny.disabledReason, "INSUFFICIENT_BUDGET");
  }
});

test("policy resolution does not mutate the caller-owned descriptor", () => {
  for (const sector of [34, 52]) {
    const descriptor = makeDescriptor({ sector, enemyBudget: 19 });
    const before = JSON.stringify(descriptor);

    const policy = getRuntimeTacticalEnemyAdoptionPolicy(descriptor);
    const resolved = resolveRuntimeTacticalEnemySpawn({
      descriptor,
      spawnOrdinal: policy.triggerSpawnOrdinal ?? -1,
    });

    assert.ok(
      resolved === EnemyType.RIFT_HUNTER || resolved === EnemyType.SIEGE_PRISM,
    );
    assert.equal(JSON.stringify(descriptor), before);
  }
});
