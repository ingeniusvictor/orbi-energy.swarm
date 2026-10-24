import assert from "node:assert/strict";
import test from "node:test";

import {
  GAIA_REQUIRED_ENERGY_COUNT,
  createGaiaEvolutionState,
  getGaiaCombatScale,
  getGaiaLevelForCompletedCycles,
  getGaiaProgressCount,
  registerGaiaEnergy,
} from "../src/game/gaiaEvolution.ts";
import {
  ORBI_GAIA_REQUIRED_FOLLOWER_IDS,
} from "../src/game/orbiEnergyCanon.ts";

test("GAIA synthesis requires nine collectible energies around permanent neutral ENERGY", () => {
  assert.equal(GAIA_REQUIRED_ENERGY_COUNT, 9);
  assert.deepEqual(
    [...ORBI_GAIA_REQUIRED_FOLLOWER_IDS].sort(),
    [
      "FOTON",
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

test("later full sets yield matching GAIA essences with triangular level requirements", () => {
  let state = createGaiaEvolutionState();

  for (let cycle = 0; cycle < 3; cycle += 1) {
    for (const energyId of ORBI_GAIA_REQUIRED_FOLLOWER_IDS) {
      state = registerGaiaEnergy(state, energyId).state;
    }
  }

  assert.equal(state.gaiaLevel, 2);
  assert.equal(state.completedCycles, 3);
  assert.equal(state.cycleMask, 0);
});

test("FOTON is a GAIA prerequisite while GAIA itself is not", () => {
  const initial = createGaiaEvolutionState();
  const foton = registerGaiaEnergy(initial, "FOTON");
  const gaia = registerGaiaEnergy(initial, "GAIA");

  assert.equal(foton.accepted, true);
  assert.equal(gaia.accepted, false);
  assert.equal(foton.progressCount, 1);
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

  assert.deepEqual(level1000, getGaiaCombatScale(8));
  assert.equal(level1000.evolutionStage, 4);
  assert.ok(level1000.size <= 10.5);
});

test("out-of-order acquisition with duplicates completes once per nine unique energies", () => {
  const order = [
    "QUANTUM", "HYDRO", "HYDRO", "ATON", "AERO",
    "TERMO", "QUANTUM", "MAGNE", "H2NOVA", "KINETRIX", "FOTON",
  ] as const;
  let state = createGaiaEvolutionState();
  let completions = 0;
  for (const id of order) {
    const update = registerGaiaEnergy(state, id);
    if (update.cycleCompleted) completions += 1;
    state = update.state;
  }
  assert.equal(completions, 1);
  assert.equal(state.gaiaLevel, 1);
  assert.equal(state.completedCycles, 1);
  assert.equal(state.cycleMask, 0);
});

test("partial second cycle preserves GAIA level until all distinct energies return", () => {
  let state = createGaiaEvolutionState();
  for (const id of ORBI_GAIA_REQUIRED_FOLLOWER_IDS) {
    state = registerGaiaEnergy(state, id).state;
  }
  for (const id of ORBI_GAIA_REQUIRED_FOLLOWER_IDS.slice(0, 8)) {
    state = registerGaiaEnergy(state, id).state;
  }
  const duplicate = registerGaiaEnergy(
    state, ORBI_GAIA_REQUIRED_FOLLOWER_IDS[0],
  );
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.progressCount, 8);
  assert.equal(duplicate.state.gaiaLevel, 1);
  const completed = registerGaiaEnergy(
    duplicate.state, ORBI_GAIA_REQUIRED_FOLLOWER_IDS[8],
  );
  assert.equal(completed.cycleCompleted, true);
  assert.equal(completed.state.gaiaLevel, 2);
  assert.equal(completed.state.completedCycles, 2);
});

test("GAIA synthesis is independent of swarm occupancy and does not mutate previous state", () => {
  const initial = createGaiaEvolutionState();
  const snapshot = { ...initial };
  const first = registerGaiaEnergy(initial, "AERO");
  assert.deepEqual(initial, snapshot);
  assert.notEqual(first.state, initial);
  // Capacity and consolidation do not enter the pure progression API.
  const simulatedFullSwarm = Array.from({ length: 60 }, (_, i) => i);
  assert.equal(simulatedFullSwarm.length, 60);
  let state = first.state;
  for (const id of ORBI_GAIA_REQUIRED_FOLLOWER_IDS) {
    if (id === "AERO") continue;
    state = registerGaiaEnergy(state, id).state;
  }
  assert.equal(state.gaiaLevel, 1);
});

test("GAIA progression resets cleanly for a new run", () => {
  let previousRun = createGaiaEvolutionState();
  for (const id of ORBI_GAIA_REQUIRED_FOLLOWER_IDS) {
    previousRun = registerGaiaEnergy(previousRun, id).state;
  }
  const newRun = createGaiaEvolutionState();
  assert.equal(previousRun.gaiaLevel, 1);
  assert.deepEqual(newRun, {
    cycleMask: 0,
    gaiaLevel: 0,
    completedCycles: 0,
  });
});

test("GAIA combat caps hold across a long progression sequence", () => {
  for (let level = 1; level <= 1000; level += 1) {
    const scale = getGaiaCombatScale(level);
    assert.ok(scale.damageMultiplier >= 1 && scale.damageMultiplier <= 2.2);
    assert.ok(scale.cooldownMultiplier >= 0.62 && scale.cooldownMultiplier <= 1);
    assert.ok(scale.shieldSupportMultiplier >= 1 && scale.shieldSupportMultiplier <= 2.5);
    assert.ok(scale.incomingDamageMultiplier >= 0.75 && scale.incomingDamageMultiplier <= 0.92);
    assert.ok(scale.size >= 7.2 && scale.size <= 10.5);
  }
});

test("GAIA progress helper reports unique energy bits in bounded state", () => {
  let state = createGaiaEvolutionState();
  assert.equal(getGaiaProgressCount(state), 0);
  state = registerGaiaEnergy(state, "HYDRO").state;
  state = registerGaiaEnergy(state, "AERO").state;
  state = registerGaiaEnergy(state, "HYDRO").state;
  assert.equal(getGaiaProgressCount(state), 2);
});

test("GAIA v0.2 caps at E8 and changes full body at E1 E3 E5 E8", () => {
  assert.deepEqual(
    Array.from({length: 30}, (_, i) => getGaiaLevelForCompletedCycles(i)),
    [0,1,2,2,3,3,3,4,4,4,4,5,5,5,5,5,6,6,6,6,6,6,7,7,7,7,7,7,7,8],
  );
  assert.equal(getGaiaLevelForCompletedCycles(100000), 8);
  assert.equal(getGaiaLevelForCompletedCycles(Number.POSITIVE_INFINITY), 0);
  assert.equal(getGaiaCombatScale(6).evolutionStage, 3);
  assert.equal(getGaiaCombatScale(7).evolutionStage, 3);
  assert.equal(getGaiaCombatScale(8).evolutionStage, 4);
  assert.deepEqual(getGaiaCombatScale(8), getGaiaCombatScale(9999));
});

test("29 full nine-energy cycles reach GAIA E8 with no further levels", () => {
  let state = createGaiaEvolutionState();
  for (let cycle=1; cycle<=35; cycle+=1) {
    for(const energy of ORBI_GAIA_REQUIRED_FOLLOWER_IDS) {
      state = registerGaiaEnergy(state, energy).state;
    }
    assert.equal(state.gaiaLevel, getGaiaLevelForCompletedCycles(cycle));
    assert.ok(state.gaiaLevel<=8);
  }
  assert.equal(state.gaiaLevel, 8);
  assert.equal(state.completedCycles, 35);
});
