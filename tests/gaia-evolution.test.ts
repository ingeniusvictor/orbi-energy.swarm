import assert from "node:assert/strict";
import test from "node:test";

import {
  GAIA_REQUIRED_ENERGY_COUNT,
  createGaiaEvolutionState,
  getGaiaCombatScale,
  registerGaiaEnergy,
} from "../src/game/gaiaEvolution.ts";
import {
  ORBI_GAIA_REQUIRED_FOLLOWER_IDS,
} from "../src/game/orbiEnergyCanon.ts";

test("GAIA synthesis requires the eight followers around permanent FOTON", () => {
  assert.equal(GAIA_REQUIRED_ENERGY_COUNT, 8);
  assert.deepEqual(
    [...ORBI_GAIA_REQUIRED_FOLLOWER_IDS].sort(),
    [
      "AERO",
      "ATON",
      "H2NOVA",
      "HYDRO",
      "KINETRIX",
      "MAGNE",
      "QUANTUM",
      "TERMO",
    ].sort(),
  );
});

test("duplicate energy does not advance distinct GAIA progress", () => {
  const initial = createGaiaEvolutionState();
  const first = registerGaiaEnergy(initial, "HYDRO");
  const duplicate = registerGaiaEnergy(first.state, "HYDRO");

  assert.equal(first.progressCount, 1);
  assert.equal(duplicate.progressCount, 1);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.cycleCompleted, false);
  assert.equal(duplicate.state.gaiaLevel, 0);
});

test("one complete prerequisite set creates one GAIA level and resets cycle mask", () => {
  let state = createGaiaEvolutionState();
  let completed = false;

  for (const energyId of ORBI_GAIA_REQUIRED_FOLLOWER_IDS) {
    const update = registerGaiaEnergy(state, energyId);
    state = update.state;
    completed = update.cycleCompleted;
  }

  assert.equal(completed, true);
  assert.equal(state.cycleMask, 0);
  assert.equal(state.gaiaLevel, 1);
  assert.equal(state.completedCycles, 1);
});

test("each later full set levels the same GAIA progression again", () => {
  let state = createGaiaEvolutionState();

  for (let cycle = 0; cycle < 3; cycle += 1) {
    for (const energyId of ORBI_GAIA_REQUIRED_FOLLOWER_IDS) {
      state = registerGaiaEnergy(state, energyId).state;
    }
  }

  assert.equal(state.gaiaLevel, 3);
  assert.equal(state.completedCycles, 3);
  assert.equal(state.cycleMask, 0);
});

test("FOTON and GAIA themselves are not follower prerequisites", () => {
  const initial = createGaiaEvolutionState();
  const foton = registerGaiaEnergy(initial, "FOTON");
  const gaia = registerGaiaEnergy(initial, "GAIA");

  assert.equal(foton.accepted, false);
  assert.equal(gaia.accepted, false);
  assert.deepEqual(foton.state, initial);
  assert.deepEqual(gaia.state, initial);
});

test("GAIA combat evolution is meaningful but hard bounded", () => {
  const level1 = getGaiaCombatScale(1);
  const level10 = getGaiaCombatScale(10);
  const level1000 = getGaiaCombatScale(1000);

  assert.equal(level1.damageMultiplier, 1);
  assert.equal(level1.cooldownMultiplier, 1);
  assert.equal(level1.shieldSupportMultiplier, 1);
  assert.ok(level10.damageMultiplier > level1.damageMultiplier);
  assert.ok(level10.cooldownMultiplier < level1.cooldownMultiplier);
  assert.ok(level10.incomingDamageMultiplier < level1.incomingDamageMultiplier);

  assert.equal(level1000.damageMultiplier, 2.2);
  assert.equal(level1000.cooldownMultiplier, 0.62);
  assert.equal(level1000.shieldSupportMultiplier, 2.5);
  assert.equal(level1000.incomingDamageMultiplier, 0.75);
  assert.equal(level1000.size, 10.5);
  assert.equal(level1000.evolutionStage, 4);
});
