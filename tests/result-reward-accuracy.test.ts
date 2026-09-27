import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("run Nano Credits use a dedicated earned counter", () => {
  assert.match(game, /runNanoCreditsEarnedRef = useRef<number>\(0\)/);
  assert.match(game, /runNanoCreditsEarnedRef\.current = 0/);
});

test("actual NANO awards increment both balance and earned telemetry", () => {
  assert.match(
    game,
    /nanoCreditsRef\.current \+= val;[\s\S]*runNanoCreditsEarnedRef\.current \+= val;/,
  );
});

test("result screen receives the real earned amount instead of score-derived fiction", () => {
  assert.match(
    game,
    /nanoCreditsGained=\{runNanoCreditsEarnedRef\.current\}/,
  );
  assert.doesNotMatch(game, /nanoCreditsGained=\{score \* 2\}/);
});
