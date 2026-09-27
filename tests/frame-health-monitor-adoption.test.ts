import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL(
    "../src/game/EnergySwarmGame.tsx",
    import.meta.url,
  ),
  "utf8",
);

const section = (
  startMarker: string,
  endMarker: string,
) => {
  const start = game.indexOf(startMarker);
  const end = game.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start: ${startMarker}`);
  assert.ok(end > start, `Missing end: ${endMarker}`);
  return game.slice(start, end);
};

test("live game imports frame health monitor primitives", () => {
  for (const symbol of [
    "createFrameHealthState",
    "resetFrameHealthState",
    "stepFrameHealthMonitor",
  ]) {
    assert.match(game, new RegExp(symbol));
  }
});

test("every new run starts with fresh frame health state", () => {
  const start = section(
    "const startGame =",
    "// --- REBOOT GAME ON LOSS ---",
  );

  assert.match(
    start,
    /frameHealthRef\.current = createFrameHealthState\(\)/,
  );
  assert.match(
    start,
    /frameHealthRecommendationShownRef\.current = null/,
  );
});

test("pause and upgrade modal gaps do not contaminate sustained samples", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  assert.match(
    loop,
    /isPausedRef\.current \|\| isUpgradeSelectionOpenRef\.current/,
  );
  assert.match(
    loop,
    /frameHealthRef\.current = resetFrameHealthState\([\s\S]*frameHealthRef\.current/,
  );
});

test("monitor observes the same post-clamp active delta used by the frame", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  const clampIndex = loop.indexOf(
    "if (delta > 100) delta = 16.6;",
  );
  const monitorIndex = loop.indexOf(
    "stepFrameHealthMonitor(",
  );
  const physicsIndex = loop.indexOf(
    "updateEnginePhysics(delta)",
  );

  assert.ok(clampIndex >= 0);
  assert.ok(monitorIndex > clampIndex);
  assert.ok(physicsIndex > monitorIndex);
});

test("monitor uses the authoritative current quality preset", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  assert.match(
    loop,
    /statsRef\.current\?\.qualityPreset \?\? stats\.qualityPreset/,
  );
});

test("sustained recommendation is advisory and deduplicated", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  assert.match(
    loop,
    /completedWindow\?\.recommendedPreset/,
  );
  assert.match(
    loop,
    /frameHealthRecommendationShownRef\.current !==/,
  );
  assert.match(
    loop,
    /postDialogue\([\s\S]*"SYSTEM"[\s\S]*PERFORMANCE PRESSURE/,
  );
});

test("live monitor never changes or persists the user's quality preset", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  assert.doesNotMatch(
    loop,
    /changeQualityPreset|setStats\(|saveGameStats\(|qualityPreset\s*=/,
  );
  assert.match(
    loop,
    /qualityPreset:[\s\S]*statsRef\.current\?\.qualityPreset/,
    "reading the authoritative quality preset for diagnostics is allowed",
  );
});

test("lifecycle clock discontinuities clear in-progress samples", () => {
  const lifecycle = section(
    "// --- ANDROID / WEB APP LIFECYCLE SAFETY ---",
    "const changeMinimapMode",
  );

  assert.match(
    lifecycle,
    /shouldResetFrameClock\(signal\)/,
  );
  assert.match(
    lifecycle,
    /frameHealthRef\.current = resetFrameHealthState\(/,
  );
});

test("monitor does not claim device temperature or thermal state", () => {
  assert.doesNotMatch(
    game,
    /thermal(?:State|Temperature|Sensor)|deviceTemperature|batteryTemperature/,
  );
});
