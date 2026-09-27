import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_STATS,
  loadGameStats,
  resetGameStats,
  saveGameStats,
} from "../../src/game/storage.ts";
import { QualityPreset } from "../../src/game/types.ts";

const STORAGE_KEY = "orbi_energy_swarm_stats_v2";

class MemoryStorage implements Storage {
  #data = new Map<string, string>();

  get length() {
    return this.#data.size;
  }

  clear() {
    this.#data.clear();
  }

  getItem(key: string) {
    return this.#data.get(key) ?? null;
  }

  key(index: number) {
    return [...this.#data.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.#data.delete(key);
  }

  setItem(key: string, value: string) {
    this.#data.set(key, String(value));
  }
}

const installStorage = () => {
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });
  return storage;
};

test("empty storage loads the canonical defaults", () => {
  installStorage();
  const stats = loadGameStats();
  assert.equal(stats.highScore, 0);
  assert.equal(stats.bestWave, 1);
  assert.equal(stats.qualityPreset, QualityPreset.MEDIUM);
  assert.deepEqual(stats.bossCodexSeenPhases, [1]);
  assert.deepEqual(stats.recentRunArchive, []);
});

test("legacy/corrupt array shapes are repaired while scalar progress survives", () => {
  const storage = installStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({
    highScore: 4242,
    bestWave: 7,
    gameMemories: "bad-shape",
    discoveredThreats: "bad-shape",
    bossCodexSeenAttacks: "bad-shape",
    bossCodexSeenPhases: "bad-shape",
    recentRunArchive: "bad-shape",
  }));

  const stats = loadGameStats();
  assert.equal(stats.highScore, 4242);
  assert.equal(stats.bestWave, 7);
  assert.deepEqual(stats.gameMemories, []);
  assert.deepEqual(stats.discoveredThreats, []);
  assert.deepEqual(stats.bossCodexSeenAttacks, []);
  assert.deepEqual(stats.bossCodexSeenPhases, [1]);
  assert.deepEqual(stats.recentRunArchive, []);
});

test("flash intensity storage accepts canonical modes and fails malformed values to REDUCED", () => {
  const storage = installStorage();

  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({ flashIntensity: "FULL" }),
  );
  assert.equal(loadGameStats().flashIntensity, "FULL");

  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({ flashIntensity: "REDUCED" }),
  );
  assert.equal(
    loadGameStats().flashIntensity,
    "REDUCED",
  );

  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({ flashIntensity: "UNKNOWN" }),
  );
  assert.equal(
    loadGameStats().flashIntensity,
    "REDUCED",
  );
});

test("recent run archive migration keeps only sanitized bounded entries", () => {
  const storage = installStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({
    recentRunArchive: [
      {
        runId: "run-newest",
        completedAt: "2026-09-27T15:20:00.000Z",
        outcome: "DEFEAT",
        score: 42.9,
        campaignWaveReached: 9,
        durationMs: 90000,
        enemiesDestroyed: 75,
        maxSwarmSize: 14,
        strongestAffinity: "solar",
        mostUsedFormation: "DELTA",
        temporaryBuild: {
          solar_overcharge: 2,
          invalid_stack: -4,
        },
      },
      {
        runId: "run-newest",
        completedAt: "2026-09-27T15:21:00.000Z",
        outcome: "DEFEAT",
        score: 999,
      },
      {
        runId: "",
        completedAt: "not-a-date",
        outcome: "BROKEN",
      },
    ],
  }));

  const stats = loadGameStats();
  assert.equal(stats.recentRunArchive.length, 1);
  assert.equal(
    stats.recentRunArchive[0].runId,
    "run-newest",
  );
  assert.equal(stats.recentRunArchive[0].score, 42);
  assert.deepEqual(
    stats.recentRunArchive[0].temporaryBuild,
    { solar_overcharge: 2 },
  );
});

test("save and reset round-trip through the canonical storage key", () => {
  const storage = installStorage();
  const next = { ...DEFAULT_STATS, highScore: 9001, totalNanoCredits: 77 };
  saveGameStats(next);
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY) ?? "{}"), next);

  const reset = resetGameStats();
  assert.equal(reset.highScore, 0);
  assert.equal(reset.totalNanoCredits, 0);
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY) ?? "{}"), DEFAULT_STATS);
});

test("malformed JSON fails safely back to defaults", () => {
  const storage = installStorage();
  storage.setItem(STORAGE_KEY, "{not-json");

  const originalError = console.error;
  console.error = () => {};
  try {
    const stats = loadGameStats();
    assert.equal(stats.highScore, DEFAULT_STATS.highScore);
    assert.equal(stats.bestWave, DEFAULT_STATS.bestWave);
  } finally {
    console.error = originalError;
  }
});
