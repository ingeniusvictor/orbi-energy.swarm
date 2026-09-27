import assert from "node:assert/strict";
import test from "node:test";

import {
  BLACKOUT_DEVOURER_CANON,
  BOSS_WAVE_NUMBER,
  MAX_TOTAL_WAVES,
  WAVES,
  getWaveConfig,
} from "../../src/game/waveDirector.ts";

test("prototype campaign remains ten handcrafted sectors", () => {
  assert.equal(WAVES.length, 10);
  assert.equal(MAX_TOTAL_WAVES, 10);
  assert.deepEqual(WAVES.map((wave) => wave.waveNumber), [1,2,3,4,5,6,7,8,9,10]);
});

test("current wave lookup clamps outside the handcrafted campaign", () => {
  assert.equal(getWaveConfig(0).waveNumber, 1);
  assert.equal(getWaveConfig(1).waveNumber, 1);
  assert.equal(getWaveConfig(10).waveNumber, 10);
  assert.equal(getWaveConfig(11).waveNumber, 10);
  assert.equal(getWaveConfig(999).waveNumber, 10);
});

test("Blackout Devourer remains the Sector 10 campaign climax", () => {
  assert.equal(BOSS_WAVE_NUMBER, 10);
  assert.equal(WAVES[9].id, "blackout_devourer");
  assert.equal(BLACKOUT_DEVOURER_CANON.id, "blackout_devourer_boss");
  assert.equal(BLACKOUT_DEVOURER_CANON.maxHealth, 1500);
  assert.deepEqual(BLACKOUT_DEVOURER_CANON.phaseThresholds, [0.70, 0.35]);
  assert.ok(BLACKOUT_DEVOURER_CANON.attacks.length >= 3);
  assert.ok(BLACKOUT_DEVOURER_CANON.summonRules.length >= 1);
});
