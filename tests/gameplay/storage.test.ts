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
  }));

  const stats = loadGameStats();
  assert.equal(stats.highScore, 4242);
  assert.equal(stats.bestWave, 7);
  assert.deepEqual(stats.gameMemories, []);
  assert.deepEqual(stats.discoveredThreats, []);
  assert.deepEqual(stats.bossCodexSeenAttacks, []);
  assert.deepEqual(stats.bossCodexSeenPhases, [1]);
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
