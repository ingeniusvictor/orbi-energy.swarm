import assert from "node:assert/strict";
import test from "node:test";
import {
  H4_HOSTILE_ARCHETYPES,
  H4_SURVIVAL_EVENTS,
  getUnlockedH4Archetypes,
  projectAdaptiveInvasion,
  selectH4SurvivalEvent,
} from "../src/game/adaptiveInvasion.ts";

test("new hostile roles unlock progressively rather than all at once", () => {
  assert.deepEqual(getUnlockedH4Archetypes(11), ["RIFT_HUNTER"]);
  assert.ok(getUnlockedH4Archetypes(21).includes("SIEGE_PRISM"));
  assert.ok(getUnlockedH4Archetypes(21).includes("SWARM_REAVER"));
  assert.equal(getUnlockedH4Archetypes(50).includes("MIRROR_WARDEN"), false);
  assert.equal(getUnlockedH4Archetypes(51).includes("MIRROR_WARDEN"), true);
});

test("every severe hostile mechanic has a readable telegraph and bounded active cap", () => {
  for (const profile of Object.values(H4_HOSTILE_ARCHETYPES)) {
    assert.ok(profile.minimumTelegraphMs >= 850);
    assert.ok(profile.activeCap >= 1 && profile.activeCap <= 6);
    assert.ok(profile.projectileCost >= 0 && profile.projectileCost <= 4);
  }
});

test("survival events never exceed two hard-control sources", () => {
  for (const profile of Object.values(H4_SURVIVAL_EVENTS)) {
    assert.ok(profile.telegraphMs >= 900);
    assert.ok(profile.hardControlSources <= 2);
    assert.ok(profile.spawnIntervalMultiplier >= 0.68);
  }
});

test("event selection is deterministic for a sector/wave seed", () => {
  const a = selectH4SurvivalEvent(37, 3, "alpha");
  const b = selectH4SurvivalEvent(37, 3, "alpha");
  assert.deepEqual(a, b);
});

test("adaptive pressure reacts to both sector and swarm power", () => {
  const small = projectAdaptiveInvasion(20, 2, 10, "pressure");
  const large = projectAdaptiveInvasion(20, 2, 30, "pressure");
  assert.ok(large.concurrentEnemyBonus >= small.concurrentEnemyBonus);
  assert.ok(large.spawnIntervalMultiplier <= small.spawnIntervalMultiplier);
  assert.ok(large.attackRateMultiplier >= small.attackRateMultiplier);
});

test("deep Infinite pressure stays bounded and cannot create runaway multipliers", () => {
  for (const sector of [11, 25, 50, 100, 250, 1000, 5000]) {
    for (const swarm of [10, 20, 30]) {
      const projection = projectAdaptiveInvasion(sector, 7, swarm, "deep");
      assert.ok(projection.concurrentEnemyBonus <= 28);
      assert.ok(projection.spawnIntervalMultiplier >= 0.5);
      assert.ok(projection.attackRateMultiplier <= 1.85);
      assert.ok(projection.projectileDensityMultiplier <= 1.65);
      assert.ok(projection.unlockedArchetypes.length <= 6);
    }
  }
});
