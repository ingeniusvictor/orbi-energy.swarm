import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("EnergySwarmGame resolves runtime descriptors through the unified router", () => {
  assert.match(game, /createCampaignRuntimeState/);
  assert.match(game, /resolveRuntimeWaveDescriptor/);
  assert.match(game, /runtimeProgressionRef/);
  assert.match(game, /getCurrentRuntimeDescriptor/);
  assert.doesNotMatch(game, /createCampaignRuntimeWaveDescriptor/);
});

test("new runs reset runtime progression to campaign Sector 1", () => {
  assert.match(
    game,
    /runtimeProgressionRef\.current = createCampaignRuntimeState\(1\)/,
  );
});

test("campaign wave advancement keeps the runtime router synchronized", () => {
  assert.match(
    game,
    /currentWaveRef\.current \+= 1;[\s\S]*runtimeProgressionRef\.current = createCampaignRuntimeState\([\s\S]*currentWaveRef\.current/,
  );
});

test("Devourer victory switches the live router into infinite runtime", () => {
  const start = game.indexOf("const enterInfiniteAfterCampaignVictory");
  const end = game.indexOf("// --- PROCEDURAL REWARDS", start);
  assert.ok(start >= 0 && end > start);

  const block = game.slice(start, end);
  assert.match(block, /createInfiniteRuntimeState/);
  assert.match(block, /runtimeProgressionRef\.current = infiniteRuntime/);
  assert.match(block, /getRuntimeSector\(infiniteRuntime\)/);
  assert.match(block, /getRuntimeWaveNumber\(infiniteRuntime\)/);
});

test("campaign-only WaveConfig presentation lookup remains inside the campaign loop", () => {
  assert.match(game, /getWaveConfig\(currentWaveRef\.current\)/);
});
