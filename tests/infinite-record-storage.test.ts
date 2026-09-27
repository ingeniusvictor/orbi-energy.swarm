import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const storage = readFileSync(
  new URL("../src/game/storage.ts", import.meta.url),
  "utf8",
);

test("storage defaults include all explicit Infinite Swarm records", () => {
  assert.match(storage, /bestInfiniteSector: 0/);
  assert.match(storage, /bestInfiniteWave: 0/);
  assert.match(storage, /infiniteMinibossesDefeated: 0/);
  assert.match(storage, /infiniteBossRematchesDefeated: 0/);
});

test("loaded Infinite records are normalized through safeRecordInteger", () => {
  for (const field of [
    "bestInfiniteSector",
    "bestInfiniteWave",
    "infiniteMinibossesDefeated",
    "infiniteBossRematchesDefeated",
  ]) {
    assert.match(
      storage,
      new RegExp(
        `${field}: safeRecordInteger\\(parsed\\.${field}\\)`,
      ),
    );
  }
});
