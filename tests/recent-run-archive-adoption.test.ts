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
  assert.ok(
    start >= 0,
    `Missing start marker: ${startMarker}`,
  );
  assert.ok(
    end > start,
    `Missing end marker: ${endMarker}`,
  );
  return game.slice(start, end);
};

test("live game imports the persisted run archive entry contract", () => {
  assert.match(
    game,
    /type RunArchiveEntry/,
  );
});

test("run peak swarm telemetry is explicit and reset for every new run", () => {
  assert.match(
    game,
    /const runMaxSwarmSizeRef = useRef<number>\(1\)/,
  );

  const startGame = section(
    "const startGame =",
    "// --- REBOOT GAME ON LOSS ---",
  );
  assert.match(
    startGame,
    /runMaxSwarmSizeRef\.current = 1/,
  );
});

test("peak swarm helper is non-recursive and samples Foton plus followers", () => {
  const helper = section(
    "const updateRunMaxSwarmSize =",
    "// Cosmetic / screen effects",
  );

  assert.match(
    helper,
    /runMaxSwarmSizeRef\.current = Math\.max\(/,
  );
  assert.match(
    helper,
    /swarmRef\.current\.length \+ 1/,
  );
  assert.doesNotMatch(
    helper,
    /updateRunMaxSwarmSize\(\)/,
  );
});

test("ordinary recruits and both fusion paths update the peak immediately", () => {
  const recruit = section(
    "const addSwarmMember =",
    "// --- SYSTEM SHOP UPGRADES ---",
  );
  const fusion = section(
    "const triggerFusion =",
    "// --- WAVE TRANSITIONS DIRECTOR ---",
  );

  assert.match(
    recruit,
    /swarmRef\.current\.push\(member\);[\s\S]*updateRunMaxSwarmSize\(\)/,
  );

  const fusionPeakUpdates =
    fusion.match(
      /updateRunMaxSwarmSize\(\)/g,
    ) ?? [];
  assert.equal(
    fusionPeakUpdates.length,
    2,
    "Solar and Hydro fusion pushes must both update run peak telemetry",
  );
});

test("normal simulation accumulates actual dwell time for the active formation", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  const cinematicReturn = physics.indexOf(
    "// Return early to freeze rest of physical ticks!",
  );
  const formationUsage = physics.indexOf(
    "formationUseCountsRef.current[activeFormation]",
  );
  const runtimeProjection = physics.indexOf(
    "const frameRuntimeProjection =",
  );

  assert.ok(cinematicReturn >= 0);
  assert.ok(formationUsage > cinematicReturn);
  assert.ok(runtimeProjection > formationUsage);
  assert.match(
    physics,
    /formationUseCountsRef\.current\[activeFormation\] =[\s\S]*formationUseCountsRef\.current\[activeFormation\] \?\? 0\)[\s\S]*\+\s*delta/,
  );
  assert.match(
    physics,
    /updateRunMaxSwarmSize\(\)/,
  );
});

test("most-used formation reads the accumulated duration ledger", () => {
  const helper = section(
    "const getFormationMostUsed =",
    "const getBestOrbiType =",
  );

  assert.match(
    helper,
    /RunArchiveEntry\["mostUsedFormation"\]/,
  );
  assert.match(
    helper,
    /Object\.entries\(formationUseCountsRef\.current\)/,
  );
  assert.match(
    helper,
    /if \(count > max\)/,
  );
});

test("dominant affinity telemetry covers all six playable affinities", () => {
  const helper = section(
    "const getStrongestAffinity =",
    "// --- COMPANION LUX-8 DIALOGUES WRITING ---",
  );

  for (const affinity of [
    "solar",
    "hydro",
    "wind",
    "thermal",
    "nuclear",
    "quantum",
  ]) {
    assert.match(
      helper,
      new RegExp(`${affinity}: 0`),
    );
  }

  assert.match(
    helper,
    /counts\[member\.affinity\] \+= 1/,
  );
  assert.doesNotMatch(
    helper,
    /upgrades\.nuclear_density|upgrades\.quantum_fracture/,
    "general-purpose upgrades must not impersonate affinity-specific build weight",
  );
});

test("campaign checkpoint and final persistence both use the true run peak", () => {
  const checkpoint = section(
    "const getCampaignVictoryCheckpointInput =",
    "const commitStats =",
  );
  const commit = section(
    "const commitStats =",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(
    checkpoint,
    /updateRunMaxSwarmSize\(\);[\s\S]*const bestSwarmSize = runMaxSwarmSizeRef\.current/,
  );
  assert.match(
    commit,
    /updateRunMaxSwarmSize\(\);[\s\S]*const bestSwarmSize = runMaxSwarmSizeRef\.current/,
  );
});

test("final archive uses the same stable run identity as campaign-to-Infinite handoff", () => {
  const commit = section(
    "const commitStats =",
    "// --- KEY LISTENER LISTENERS ---",
  );
  const handoff = section(
    "const enterInfiniteAfterCampaignVictory =",
    "// --- PROCEDURAL REWARDS",
  );

  assert.match(
    commit,
    /runId: `orbi-run-\$\{runStartTimeRef\.current\}`/,
  );
  assert.match(
    handoff,
    /`orbi-run-\$\{runStartTimeRef\.current\}`/,
  );
});

test("final archive completion timestamp and duration come from the run end boundary", () => {
  const commit = section(
    "const commitStats =",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(
    commit,
    /const completedAtMs =[\s\S]*runEndTimeRef\.current > 0[\s\S]*runEndTimeRef\.current[\s\S]*Date\.now\(\)/,
  );
  assert.match(
    commit,
    /completedAt: new Date\(completedAtMs\)\.toISOString\(\)/,
  );
  assert.match(
    commit,
    /durationMs: Math\.max\([\s\S]*completedAtMs - runStartTimeRef\.current/,
  );
});

test("a run that cleared campaign remains CAMPAIGN_CLEARED even if it later ends in Infinite", () => {
  const commit = section(
    "const commitStats =",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(
    commit,
    /outcome: workingLedger\.campaignVictoryCommitted[\s\S]*\? "CAMPAIGN_CLEARED"[\s\S]*: "DEFEAT"/,
  );
});

test("archive campaign reach stays bounded to the handcrafted campaign", () => {
  const commit = section(
    "const commitStats =",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(
    commit,
    /campaignWaveReached: Math\.min\([\s\S]*bestWaveReached,[\s\S]*BOSS_WAVE_NUMBER/,
  );
});

test("Infinite coordinates are attached only from an active Infinite runtime", () => {
  const commit = section(
    "const commitStats =",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(
    commit,
    /const infiniteSectorReached =[\s\S]*runtimeProgressionRef\.current\.mode === "INFINITE"[\s\S]*getRuntimeSector/,
  );
  assert.match(
    commit,
    /const infiniteWaveReached =[\s\S]*runtimeProgressionRef\.current\.mode === "INFINITE"[\s\S]*getRuntimeWaveNumber/,
  );
  assert.match(
    commit,
    /infiniteSectorReached !== undefined &&[\s\S]*infiniteWaveReached !== undefined/,
  );
});

test("final archive captures build, affinity, formation and corrected peak telemetry", () => {
  const commit = section(
    "const commitStats =",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(
    commit,
    /enemiesDestroyed: runEnemiesDestroyedRef\.current/,
  );
  assert.match(
    commit,
    /maxSwarmSize: bestSwarmSize/,
  );
  assert.match(
    commit,
    /strongestAffinity: getStrongestAffinity\(\)/,
  );
  assert.match(
    commit,
    /mostUsedFormation: getFormationMostUsed\(\)/,
  );
  assert.match(
    commit,
    /temporaryBuild:[\s\S]*\.\.\.activeRunUpgradesRef\.current/,
  );
  assert.match(
    commit,
    /runArchiveEntry,[\s\S]*\},[\s\S]*workingLedger/,
  );
});

test("campaign-to-Infinite handoff remains checkpoint-only and archive-neutral", () => {
  const handoff = section(
    "const enterInfiniteAfterCampaignVictory =",
    "// --- PROCEDURAL REWARDS",
  );

  assert.match(
    handoff,
    /beginInfiniteAfterCampaignVictory/,
  );
  assert.doesNotMatch(
    handoff,
    /applyFinalRunCommit|runArchiveEntry|recentRunArchive/,
  );
});

test("ResultScreen now reports the true run peak instead of the last sampled swarm state", () => {
  assert.match(
    game,
    /maxSwarmSize=\{runMaxSwarmSizeRef\.current\}/,
  );
  assert.doesNotMatch(
    game,
    /maxSwarmSize=\{swarmSize\}/,
  );
});
