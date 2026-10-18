import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_STRUCTURAL_DURABILITY_SNAPSHOT_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectStructuralDurabilitySnapshot,
} from "../../src/game/blackoutArchitectStructuralDurabilitySnapshot";
import {
  resolveBlackoutArchitectStructuralTopology,
} from "../../src/game/blackoutArchitectStructuralTopology";
import {
  resolveBlackoutArchitectStructuralTargetEligibility,
} from "../../src/game/blackoutArchitectStructuralTargetEligibility";
import {
  resolveBlackoutArchitectStructuralHitIntentAdmission,
} from "../../src/game/blackoutArchitectStructuralHitIntentAdmission";
import { EnemyType } from "../../src/game/types";

const IDS = ["NORTH", "EAST", "SOUTH", "WEST"] as const;
const mapping = {
  bossId: "BLACKOUT_ARCHITECT",
  compatibilityMode: "COMPATIBILITY_ONLY",
  mappingMode: "MAPPING_ONLY",
  chassisId: "TITAN_CORE",
  enemyType: EnemyType.BOSS_TITAN,
};
const snapshots = (mask = 0) => IDS.map((anchorId, index) => ({
  anchorId,
  currentHealth: mask & (1 << index) ? 0 : (index + 1) / 2,
  maxHealth: index + 1,
}));

test("J9H maps all 16 external-health permutations to four immutable canonical J9B facts", () => {
  for (let mask = 0; mask < 16; mask++) {
    const shuffled = [...snapshots(mask)].reverse();
    const projection = resolveBlackoutArchitectStructuralDurabilitySnapshot(shuffled);
    assert.ok(projection);
    assert.deepEqual(projection, {
      bossId: "BLACKOUT_ARCHITECT",
      durabilityMode: "SNAPSHOT_ONLY",
      anchorFacts: IDS.map((anchorId, i) => ({
        anchorId, destroyed: (mask & (1 << i)) !== 0,
      })),
    });
    assert.equal(Object.isFrozen(projection), true);
    assert.equal(Object.isFrozen(projection.anchorFacts), true);
    assert.equal(projection.anchorFacts.every(Object.isFrozen), true);
    const topology = resolveBlackoutArchitectStructuralTopology(projection.anchorFacts);
    assert.ok(topology);
    assert.equal(topology.destroyedAnchorCount, IDS.reduce((n, _, i) => n + Number(Boolean(mask & (1 << i))), 0));
    assert.equal(topology.coreExposureEligibility, mask === 15 ? "ELIGIBLE" : "LOCKED");
    const eligibility = resolveBlackoutArchitectStructuralTargetEligibility(mapping, projection.anchorFacts);
    assert.ok(eligibility);
    for (let i = 0; i < IDS.length; i++) {
      const decision = resolveBlackoutArchitectStructuralHitIntentAdmission(
        eligibility, { targetKind: "ANCHOR", anchorId: IDS[i] },
      );
      assert.ok(decision);
      assert.equal(decision.disposition, mask & (1 << i) ? "DENY" : "ADMIT");
    }
    const core = resolveBlackoutArchitectStructuralHitIntentAdmission(eligibility, { targetKind: "CORE" });
    assert.ok(core);
    assert.equal(core.disposition, mask === 15 ? "ADMIT" : "DENY");
    assert.equal("currentHealth" in projection, false);
    assert.equal("maxHealth" in projection, false);
    assert.ok(projection.anchorFacts.every((fact) => Object.keys(fact).length === 2));
  }
});

test("J9H rejects malformed, padded, duplicated and sparse arrays", () => {
  const valid = snapshots();
  const sparse = [...valid];
  delete (sparse as (unknown | undefined)[])[1];
  const extended = [...valid] as unknown[] & { [extra: string]: unknown };
  extended.extra = true;
  const symbolized = [...valid] as unknown[] & { [x: symbol]: unknown };
  symbolized[Symbol("extra")] = true;
  const indexedGetter = [...valid];
  Object.defineProperty(indexedGetter, "1", { get: () => valid[1], enumerable: true });
  for (const bad of [
    null, undefined, {}, "", 1, [], valid.slice(1),
    [...valid, valid[0]],
    [valid[0], valid[0], valid[2], valid[3]],
    [valid[0], valid[2], valid[3], { anchorId: "UNKNOWN", currentHealth: 1, maxHealth: 2 }],
    sparse, extended, symbolized, indexedGetter,
  ]) assert.equal(resolveBlackoutArchitectStructuralDurabilitySnapshot(bad), null);
});

test("J9H rejects malformed health facts and cannot silently select default balance numbers", () => {
  const valid = snapshots();
  const substitute = (replacement: unknown) => [replacement, ...valid.slice(1)];
  const getter = { anchorId: "NORTH", maxHealth: 10 };
  Object.defineProperty(getter, "currentHealth", { get: () => 10, enumerable: true });
  const inherited = Object.create({ anchorId: "NORTH" }) as Record<string, unknown>;
  inherited.currentHealth = 1;
  inherited.maxHealth = 2;
  for (const wrong of [
    null, [], "NORTH", {}, { anchorId: "NORTH", maxHealth: 5 },
    { anchorId: "NORTH", currentHealth: 1 },
    { anchorId: "NORTH", currentHealth: 1, maxHealth: 2, extra: 1 },
    { anchorId: "NORTH", currentHealth: 1, maxHealth: 2, [Symbol("extra")]: true },
    { anchorId: "NORTH ", currentHealth: 1, maxHealth: 2 },
    { anchorId: "CORE", currentHealth: 1, maxHealth: 2 },
    { anchorId: "NORTH", currentHealth: -1, maxHealth: 2 },
    { anchorId: "NORTH", currentHealth: -0, maxHealth: 2 },
    { anchorId: "NORTH", currentHealth: Number.NaN, maxHealth: 2 },
    { anchorId: "NORTH", currentHealth: Number.POSITIVE_INFINITY, maxHealth: 2 },
    { anchorId: "NORTH", currentHealth: 1, maxHealth: Number.NaN },
    { anchorId: "NORTH", currentHealth: 1, maxHealth: Number.NEGATIVE_INFINITY },
    { anchorId: "NORTH", currentHealth: 1, maxHealth: 0 },
    { anchorId: "NORTH", currentHealth: 2, maxHealth: 1 },
    { anchorId: "NORTH", currentHealth: "1", maxHealth: 2 },
    { anchorId: "NORTH", currentHealth: 1, maxHealth: "2" },
    { anchorId: "NORTH", currentHealth: true, maxHealth: 2 },
    getter, inherited,
  ]) assert.equal(resolveBlackoutArchitectStructuralDurabilitySnapshot(substitute(wrong)), null);
});

test("J9H tolerates arbitrary positive finite caller-health scales, without tuning any value", () => {
  for (const value of [Number.MIN_VALUE, 0.001, 1, 137.25, Number.MAX_VALUE]) {
    const data = snapshots().map((entry) => ({ ...entry, currentHealth: value, maxHealth: value }));
    const projection = resolveBlackoutArchitectStructuralDurabilitySnapshot(data);
    assert.ok(projection);
    assert.equal(projection.anchorFacts.every((fact) => fact.destroyed === false), true);
  }
});

test("J9H exposes only one positive authority and no live health or damage execution fields", () => {
  const contract = BLACKOUT_ARCHITECT_STRUCTURAL_DURABILITY_SNAPSHOT_AUTHORITY_CONTRACT;
  assert.equal(Object.isFrozen(contract), true);
  assert.deepEqual(Object.entries(contract).filter(([, active]) => active).map(([name]) => name), [
    "ownsExternalDurabilitySnapshotFactProjectionAuthority",
  ]);
  const output = resolveBlackoutArchitectStructuralDurabilitySnapshot(snapshots());
  assert.ok(output);
  for (const forbidden of [
    "health", "maxHealth", "currentHealth", "baseHealth", "weakpointHealth",
    "exposureDurationMs", "damage", "defeat", "position", "phase",
    "time", "attackWeights", "spawnTrigger", "raidEscalation", "rewardMultiplier",
    "maxEnemies", "projectiles",
  ]) assert.equal(forbidden in output, false);
});
