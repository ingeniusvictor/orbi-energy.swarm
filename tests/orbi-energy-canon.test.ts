import assert from "node:assert/strict";
import test from "node:test";

import {
  ORBI_BASE_ENERGY_IDS,
  ORBI_COLLECTIBLE_ENERGY_IDS,
  ORBI_ENERGY_CANON,
  ORBI_GAIA_REQUIRED_FOLLOWER_IDS,
  createShuffledCollectibleEnergyCycle,
  getOrbiEnergyDefinition,
} from "../src/game/orbiEnergyCanon.ts";

test("ORBI canon contains nine base energies plus fusion-only GAIA", () => {
  assert.deepEqual(
    ORBI_ENERGY_CANON.map((energy) => energy.id),
    [
      "FOTON",
      "HYDRO",
      "AERO",
      "TERMO",
      "MAGNE",
      "ATON",
      "KINETRIX",
      "H2NOVA",
      "QUANTUM",
      "GAIA",
    ],
  );
  assert.equal(ORBI_BASE_ENERGY_IDS.length, 9);
  assert.equal(getOrbiEnergyDefinition("GAIA").collectibleFollower, false);
  assert.equal(getOrbiEnergyDefinition("GAIA").gaiaPrerequisite, false);
});

test("FOTON is a collectible photovoltaic ORBI; ENERGY commands as neutral protagonist", () => {
  assert.equal(getOrbiEnergyDefinition("FOTON").collectibleFollower, true);
  assert.deepEqual(ORBI_COLLECTIBLE_ENERGY_IDS, [
    "FOTON",
    "HYDRO",
    "AERO",
    "TERMO",
    "MAGNE",
    "ATON",
    "KINETRIX",
    "H2NOVA",
    "QUANTUM",
  ]);
  assert.deepEqual(
    ORBI_GAIA_REQUIRED_FOLLOWER_IDS,
    ORBI_COLLECTIBLE_ENERGY_IDS,
  );
});

test("every canonical energy owns unique identity metadata and attack signature", () => {
  assert.equal(
    new Set(ORBI_ENERGY_CANON.map((energy) => energy.affinity)).size,
    10,
  );
  assert.equal(
    new Set(ORBI_ENERGY_CANON.map((energy) => energy.attackSignature)).size,
    10,
  );
  assert.equal(
    new Set(ORBI_ENERGY_CANON.map((energy) => energy.color)).size,
    10,
  );
  for (const energy of ORBI_ENERGY_CANON) {
    assert.ok(energy.displayName.length > 0);
    assert.ok(energy.energyLabel.length > 0);
    assert.ok(energy.loreRole.length > 0);
  }
});

test("one shuffled recruitment cycle contains every collectible energy exactly once", () => {
  const deterministic = [0.91, 0.12, 0.74, 0.31, 0.58, 0.43, 0.22];
  let index = 0;
  const cycle = createShuffledCollectibleEnergyCycle(
    () => deterministic[index++ % deterministic.length],
  );
  assert.equal(cycle.length, 9);
  assert.deepEqual(
    [...cycle].sort(),
    [...ORBI_COLLECTIBLE_ENERGY_IDS].sort(),
  );
  assert.equal(new Set(cycle).size, 9);
  assert.equal(cycle.includes("FOTON"), true);
  assert.equal(cycle.includes("GAIA"), false);
});
