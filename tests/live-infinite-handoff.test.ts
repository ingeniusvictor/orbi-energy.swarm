import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

const section = (
  startMarker: string,
  endMarker: string,
) => {
  const start = game.indexOf(startMarker);
  const end = game.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, `Missing start marker: ${startMarker}`);
  assert.ok(end > start, `Missing end marker: ${endMarker}`);
  return game.slice(start, end);
};

test("Devourer cinematic continues into Infinite Swarm instead of ResultScreen", () => {
  const cinematic = section(
    "const updateBossDefeatSequence",
    "// --- ENGINE UPDATES",
  );

  assert.match(
    cinematic,
    /enterInfiniteAfterCampaignVictory\(\)/,
  );
  assert.doesNotMatch(cinematic, /triggerGameOver\(true\)/);
});

test("live handoff checkpoints campaign victory without final telemetry commit", () => {
  const handoff = section(
    "const enterInfiniteAfterCampaignVictory",
    "// --- PROCEDURAL REWARDS",
  );

  assert.match(handoff, /beginInfiniteAfterCampaignVictory/);
  assert.match(
    handoff,
    /runCommitLedgerRef\.current = handoff\.checkpoint\.ledger/,
  );
  assert.match(
    handoff,
    /updateStatsAndSave\(handoff\.checkpoint\.stats\)/,
  );
  assert.doesNotMatch(handoff, /applyFinalRunCommit/);
  assert.doesNotMatch(handoff, /runEndTimeRef\.current/);
});

test("live handoff enters certified Sector 11 runtime while preserving the active run", () => {
  const handoff = section(
    "const enterInfiniteAfterCampaignVictory",
    "// --- PROCEDURAL REWARDS",
  );

  assert.match(handoff, /createInfiniteRuntimeState\(handoff\.session\)/);
  assert.match(
    handoff,
    /runtimeProgressionRef\.current = infiniteRuntime/,
  );
  assert.match(
    handoff,
    /currentWaveRef\.current = infiniteSector/,
  );
  assert.match(handoff, /setCurrentWave\(infiniteSector\)/);
  assert.match(handoff, /waveActiveRef\.current = false/);
  assert.match(handoff, /waveBreakTimerRef\.current = INTER_WAVE_DURATION/);
  assert.match(handoff, /startBgm\("HIGH_INTENSITY"\)/);
});

test("infinite wave completion advances the infinite session, not campaign sector math", () => {
  const transitions = section(
    "const handleWaveTransitions",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /completedRuntime\.mode === "INFINITE"/,
  );
  assert.match(
    transitions,
    /advanceInfiniteRuntimeState\(completedRuntime\)/,
  );
  assert.match(
    transitions,
    /getRuntimeSector\(nextRuntime\)/,
  );
  assert.match(
    transitions,
    /getRuntimeWaveNumber\(nextRuntime\)/,
  );
  assert.match(
    transitions,
    /runtimeProgressionRef\.current = nextRuntime/,
  );
});

test("handcrafted campaign advancement remains isolated in the campaign branch", () => {
  const transitions = section(
    "const handleWaveTransitions",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /else \{[\s\S]*currentWaveRef\.current \+= 1;[\s\S]*createCampaignRuntimeState/,
  );
  assert.match(
    transitions,
    /UPGRADE_REWARD_WAVES\.includes\(completedWave\)/,
  );
});

test("Threat Intel is descriptor-backed for Sector 11+ and campaign WaveConfig is not rendered directly", () => {
  assert.match(
    game,
    /const currentThreatDescriptor =\s*getCurrentRuntimeDescriptor\(\)/,
  );
  assert.match(
    game,
    /currentThreatDescriptor\.sourceMode === "INFINITE"/,
  );
  assert.match(
    game,
    /currentThreatDescriptor\.display\.displayName/,
  );
  assert.match(
    game,
    /currentThreatDescriptor\.display\.tacticalAdvice/,
  );
  assert.doesNotMatch(
    game,
    /getWaveConfig\(currentWave\)/,
  );

  const getWaveConfigCalls =
    game.match(/getWaveConfig\(/g) ?? [];
  assert.equal(
    getWaveConfigCalls.length,
    1,
    "Only the campaign-only WaveIntro lookup may use getWaveConfig",
  );
});

test("later infinite defeat still reports the Devourer as defeated", () => {
  const result = section(
    "const getBossResult",
    "const currentThreatDescriptor",
  );

  assert.match(
    result,
    /runCommitLedgerRef\.current\.campaignVictoryCommitted/,
  );
  assert.match(result, /return "DEFEATED"/);
});

test("new runs still reset both persistence and runtime back to campaign Sector 1", () => {
  const start = section(
    "const startGame",
    "// --- REBOOT GAME ON LOSS ---",
  );

  assert.match(
    start,
    /runCommitLedgerRef\.current = createRunCommitLedger\(\)/,
  );
  assert.match(
    start,
    /runtimeProgressionRef\.current = createCampaignRuntimeState\(1\)/,
  );
});
