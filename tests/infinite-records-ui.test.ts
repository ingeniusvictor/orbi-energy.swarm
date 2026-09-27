import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const start = readFileSync(
  new URL("../src/components/StartScreen.tsx", import.meta.url),
  "utf8",
);
const result = readFileSync(
  new URL("../src/components/ResultScreen.tsx", import.meta.url),
  "utf8",
);
const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("start screen preserves legacy campaign bestWave while adding a distinct Infinite archive", () => {
  assert.match(start, /stats\.bestWave/);
  assert.match(start, /stats\.bestInfiniteSector/);
  assert.match(start, /stats\.bestInfiniteWave/);
  assert.match(start, /INFINITE SWARM/);
  assert.match(start, /ARCHIVO DE MAESTRÍA/);
  assert.match(start, /MASTERY ARCHIVE/);
});

test("Infinite archive stays visibly locked before Sector 11", () => {
  assert.match(
    start,
    /const hasInfiniteRecord = stats\.bestInfiniteSector >= 11/,
  );
  assert.match(start, /BLOQUEADO/);
  assert.match(start, /LOCKED/);
  assert.match(start, /Sector 11/);
});

test("start screen exposes persistent Warden and Devourer-rematch counters", () => {
  assert.match(
    start,
    /stats\.infiniteMinibossesDefeated/,
  );
  assert.match(
    start,
    /stats\.infiniteBossRematchesDefeated/,
  );
  assert.match(start, /WARDENS/);
  assert.match(start, /REMATCHES/);
});

test("ResultScreen accepts explicit Infinite persistent record props", () => {
  assert.match(
    result,
    /bestInfiniteSector\?: number/,
  );
  assert.match(
    result,
    /bestInfiniteWave\?: number/,
  );
  assert.match(
    result,
    /infiniteMinibossesDefeated\?: number/,
  );
  assert.match(
    result,
    /infiniteBossRematchesDefeated\?: number/,
  );
});

test("ResultScreen only renders Infinite archive after Infinite Swarm has been reached", () => {
  assert.match(
    result,
    /bestInfiniteSector >= 11/,
  );
  assert.match(result, /ARCHIVO INFINITE SWARM/);
  assert.match(result, /INFINITE SWARM ARCHIVE/);
  assert.match(result, /PERSISTENTE/);
  assert.match(result, /PERSISTENT/);
});

test("EnergySwarmGame passes current persistent record state into ResultScreen", () => {
  assert.match(
    game,
    /bestInfiniteSector=\{stats\.bestInfiniteSector\}/,
  );
  assert.match(
    game,
    /bestInfiniteWave=\{stats\.bestInfiniteWave\}/,
  );
  assert.match(
    game,
    /infiniteMinibossesDefeated=\{stats\.infiniteMinibossesDefeated\}/,
  );
  assert.match(
    game,
    /infiniteBossRematchesDefeated=\{stats\.infiniteBossRematchesDefeated\}/,
  );
});
