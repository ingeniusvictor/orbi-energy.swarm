import assert from "node:assert/strict";
import test from "node:test";

import {
  countSevereEnvironmentalMutators,
  directInfiniteMutatorSelection,
  getEnvironmentalMutatorIdentity,
  hasEnvironmentalMutator,
} from "../src/game/infiniteMutatorDirector.ts";
import type { InfiniteMutator } from "../src/game/infiniteSectorDirector.ts";
import { BiomeType } from "../src/game/types.ts";

const ALL_MUTATORS: InfiniteMutator[] = [
  "ELECTRICAL_STORM",
  "REDUCED_VISIBILITY",
  "MAGNETIC_DRIFT",
  "ACCELERATED_ENEMIES",
  "REGENERATIVE_ENEMIES",
  "FRAGILE_SWARM",
  "UNSTABLE_RESOURCE_FIELDS",
  "FORMATION_DISRUPTION",
  "ELITE_BURST",
  "DOUBLE_THREAT",
];

test("recovery sectors resolve to RECOVERY_CLEAR with zero active mutators", () => {
  const selected = directInfiniteMutatorSelection({
    tier: "HIGH_PRESSURE",
    biome: BiomeType.CYBER_VOID,
    recoverySector: true,
    targetCount: 4,
    orderedCandidates: ALL_MUTATORS,
  });

  assert.deepEqual(selected, []);
  assert.equal(getEnvironmentalMutatorIdentity(selected, true), "RECOVERY_CLEAR");
});

test("Advanced+ sectors always contain environmental pressure", () => {
  for (const tier of [
    "ADVANCED_COMBINATION",
    "HIGH_PRESSURE",
    "ENDLESS_ENDGAME",
  ] as const) {
    for (const biome of Object.values(BiomeType)) {
      const selected = directInfiniteMutatorSelection({
        tier,
        biome,
        recoverySector: false,
        targetCount: 4,
        orderedCandidates: [...ALL_MUTATORS].reverse(),
      });

      assert.equal(hasEnvironmentalMutator(selected), true);
    }
  }
});

test("selection never stacks more than one severe environmental hazard", () => {
  const selected = directInfiniteMutatorSelection({
    tier: "ENDLESS_ENDGAME",
    biome: BiomeType.CYBER_VOID,
    recoverySector: false,
    targetCount: 4,
    orderedCandidates: [
      "ELECTRICAL_STORM",
      "REDUCED_VISIBILITY",
      "FRAGILE_SWARM",
      "FORMATION_DISRUPTION",
      "DOUBLE_THREAT",
      "ELITE_BURST",
    ],
  });

  assert.ok(countSevereEnvironmentalMutators(selected) <= 1);
  assert.equal(
    selected.includes("ELECTRICAL_STORM") && selected.includes("REDUCED_VISIBILITY"),
    false,
  );
});

test("severe compound-punishment conflicts are rejected symmetrically", () => {
  const stormFirst = directInfiniteMutatorSelection({
    tier: "ENDLESS_ENDGAME",
    biome: BiomeType.CYBER_VOID,
    recoverySector: false,
    targetCount: 4,
    orderedCandidates: [
      "ELECTRICAL_STORM",
      "FRAGILE_SWARM",
      "DOUBLE_THREAT",
      "ELITE_BURST",
      "MAGNETIC_DRIFT",
    ],
  });
  assert.equal(stormFirst.includes("FRAGILE_SWARM"), false);

  const eclipseFirst = directInfiniteMutatorSelection({
    tier: "ENDLESS_ENDGAME",
    biome: BiomeType.SOLAR_PLAINS,
    recoverySector: false,
    targetCount: 4,
    orderedCandidates: [
      "REDUCED_VISIBILITY",
      "FORMATION_DISRUPTION",
      "DOUBLE_THREAT",
      "ELITE_BURST",
      "MAGNETIC_DRIFT",
    ],
  });
  assert.equal(eclipseFirst.includes("FORMATION_DISRUPTION"), false);
});

test("environmental identities map Reduced Visibility to ECLIPSE without duplicating runtime effects", () => {
  assert.equal(
    getEnvironmentalMutatorIdentity(["REDUCED_VISIBILITY"]),
    "ECLIPSE",
  );
  assert.equal(
    getEnvironmentalMutatorIdentity(["ELECTRICAL_STORM"]),
    "ELECTRICAL_STORM",
  );
  assert.equal(
    getEnvironmentalMutatorIdentity(["MAGNETIC_DRIFT"]),
    "MAGNETIC_DRIFT",
  );
  assert.equal(
    getEnvironmentalMutatorIdentity(["UNSTABLE_RESOURCE_FIELDS"]),
    "UNSTABLE_RESOURCE_FIELDS",
  );
});

test("same directed inputs produce identical output", () => {
  const input = {
    tier: "ENDLESS_ENDGAME" as const,
    biome: BiomeType.QUANTUM_NEXUS,
    recoverySector: false,
    targetCount: 4,
    orderedCandidates: ALL_MUTATORS,
  };

  assert.deepEqual(
    directInfiniteMutatorSelection(input),
    directInfiniteMutatorSelection(input),
  );
});

test("Advanced+ environmental fallback is selected before conflict filtering", () => {
  const selected = directInfiniteMutatorSelection({
    tier: "ENDLESS_ENDGAME",
    biome: BiomeType.DEEP_WATER,
    recoverySector: false,
    targetCount: 3,
    orderedCandidates: [
      "FRAGILE_SWARM",
      "ELECTRICAL_STORM",
      "DOUBLE_THREAT",
      "ELITE_BURST",
    ],
  });

  assert.equal(selected[0], "ELECTRICAL_STORM");
  assert.equal(hasEnvironmentalMutator(selected), true);
  assert.equal(selected.includes("FRAGILE_SWARM"), false);
  assert.ok(countSevereEnvironmentalMutators(selected) <= 1);
});
