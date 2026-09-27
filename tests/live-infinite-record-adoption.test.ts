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
  const end = game.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start marker: ${startMarker}`);
  assert.ok(end > start, `Missing end marker: ${endMarker}`);
  return game.slice(start, end);
};

test("EnergySwarmGame imports both Infinite persistence transitions", () => {
  assert.match(game, /applyInfiniteProgressRecord/);
  assert.match(game, /applyInfiniteMilestoneRecord/);
});

test("live reach persistence reads the freshest save and updates React plus local storage", () => {
  const helper = section(
    "const persistInfiniteReach",
    "const persistInfiniteMilestoneDefeat",
  );

  assert.match(helper, /const fresh = loadGameStats\(\)/);
  assert.match(
    helper,
    /applyInfiniteProgressRecord\([\s\S]*sector,[\s\S]*waveNumber/,
  );
  assert.match(helper, /updateStatsAndSave\(nextStats\)/);
});

test("milestone persistence reuses RunCommitLedger for idempotent event counting", () => {
  const helper = section(
    "const persistInfiniteMilestoneDefeat",
    "// --- SAVE CURRENT PROGRESSION HELPER ---",
  );

  assert.match(
    helper,
    /!enemy\.milestoneKind[\s\S]*!enemy\.milestoneId/,
  );
  assert.match(
    helper,
    /applyInfiniteMilestoneRecord\([\s\S]*eventId: enemy\.milestoneId[\s\S]*kind: enemy\.milestoneKind/,
  );
  assert.match(
    helper,
    /runCommitLedgerRef\.current/,
  );
  assert.match(
    helper,
    /runCommitLedgerRef\.current = transition\.ledger/,
  );
  assert.match(
    helper,
    /updateStatsAndSave\(transition\.stats\)/,
  );
});

test("campaign-to-infinite handoff persists Sector 11 Wave 1 immediately", () => {
  const handoff = section(
    "const enterInfiniteAfterCampaignVictory",
    "// --- PROCEDURAL REWARDS",
  );

  assert.match(
    handoff,
    /const infiniteSector = getRuntimeSector\(infiniteRuntime\)/,
  );
  assert.match(
    handoff,
    /const infiniteWave = getRuntimeWaveNumber\(infiniteRuntime\)/,
  );
  assert.match(
    handoff,
    /persistInfiniteReach\([\s\S]*infiniteSector,[\s\S]*infiniteWave/,
  );
});

test("every Infinite runtime advancement persists the new sector and wave", () => {
  const transitions = section(
    "const handleWaveTransitions",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /const nextSector = getRuntimeSector\(nextRuntime\)/,
  );
  assert.match(
    transitions,
    /const nextWave = getRuntimeWaveNumber\(nextRuntime\)/,
  );
  assert.match(
    transitions,
    /persistInfiniteReach\([\s\S]*nextSector,[\s\S]*nextWave/,
  );
});

test("final run commit includes Infinite reach only when runtime mode is INFINITE", () => {
  const commit = section(
    "const commitStats",
    "// --- KEY LISTENER LISTENERS ---",
  );

  assert.match(
    commit,
    /infiniteSectorReached:[\s\S]*runtimeProgressionRef\.current\.mode === "INFINITE"[\s\S]*getRuntimeSector/,
  );
  assert.match(
    commit,
    /infiniteWaveReached:[\s\S]*runtimeProgressionRef\.current\.mode === "INFINITE"[\s\S]*getRuntimeWaveNumber/,
  );
});

test("Blackout Warden death records milestone in both direct and splash kill paths", () => {
  const collisions = section(
    "const detectAndResolveCollisions",
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
  );

  const matches =
    collisions.match(
      /milestoneKind === "MINIBOSS"[\s\S]{0,180}persistInfiniteMilestoneDefeat/g,
    ) ?? [];
  assert.equal(
    matches.length,
    2,
    "both direct and thermal-splash Warden kills must persist the milestone",
  );
});

test("Devourer rematch persists after the rematch gate reaches DEFEATED and before boss cleanup", () => {
  const defeat = section(
    "const updateBossDefeatSequence",
    "// --- ENGINE UPDATES",
  );

  const mark = defeat.indexOf(
    "markRuntimeBossRematchDefeated",
  );
  const persist = defeat.indexOf(
    "persistInfiniteMilestoneDefeat(boss)",
  );
  const clear = defeat.indexOf(
    "bossRef.current = null",
  );

  assert.ok(mark >= 0);
  assert.ok(persist > mark);
  assert.ok(clear > persist);
});

test("campaign boss defeat does not call milestone persistence", () => {
  const defeat = section(
    "const updateBossDefeatSequence",
    "// --- ENGINE UPDATES",
  );

  const rematchBranchStart = defeat.indexOf(
    'if (boss?.milestoneKind === "BOSS_REMATCH")',
  );
  const campaignHandoff = defeat.indexOf(
    "enterInfiniteAfterCampaignVictory();",
  );
  const campaignBranch = defeat.slice(
    rematchBranchStart,
    campaignHandoff,
  );

  assert.match(
    campaignBranch,
    /persistInfiniteMilestoneDefeat\(boss\)/,
  );
  assert.match(campaignBranch, /return;/);
  assert.ok(campaignHandoff > rematchBranchStart);
});
