import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("EnergySwarmGame adopts the certified run persistence transitions", () => {
  assert.match(game, /applyCampaignVictoryCheckpoint/);
  assert.match(game, /applyFinalRunCommit/);
  assert.match(game, /createRunCommitLedger/);
  assert.match(game, /runCommitLedgerRef/);
});

test("new runs reset the in-memory persistence ledger", () => {
  assert.match(
    game,
    /runCommitLedgerRef\.current = createRunCommitLedger\(\)/,
  );
});

test("legacy commitStats no longer directly increments persistent counters", () => {
  const start = game.indexOf("const commitStats");
  const end = game.indexOf("// --- KEY LISTENER LISTENERS ---", start);
  assert.ok(start >= 0 && end > start);

  const commitBlock = game.slice(start, end);

  assert.doesNotMatch(commitBlock, /totalRuns:\s*fresh\.totalRuns \+ 1/);
  assert.doesNotMatch(commitBlock, /totalVictories:\s*isVictory/);
  assert.doesNotMatch(commitBlock, /bossVictories:\s*isVictory/);
  assert.doesNotMatch(
    commitBlock,
    /totalEnemiesDestroyed:\s*fresh\.totalEnemiesDestroyed/,
  );
  assert.doesNotMatch(
    commitBlock,
    /totalResourcesCollected:\s*fresh\.totalResourcesCollected/,
  );
});

test("campaign victory preserves current end-state parity", () => {
  const start = game.indexOf("const commitStats");
  const end = game.indexOf("// --- KEY LISTENER LISTENERS ---", start);
  const commitBlock = game.slice(start, end);

  assert.match(commitBlock, /if \(isVictory\)/);
  assert.match(commitBlock, /applyCampaignVictoryCheckpoint/);
  assert.match(commitBlock, /applyFinalRunCommit/);
  assert.match(commitBlock, /updateStatsAndSave\(finalCommit\.stats\)/);
});

test("triggerGameOver still ends both victory and defeat through commitStats", () => {
  const start = game.indexOf("const triggerGameOver");
  const end = game.indexOf("// --- PROCEDURAL REWARDS", start);
  assert.ok(start >= 0 && end > start);

  const triggerBlock = game.slice(start, end);
  assert.match(triggerBlock, /setIsGameOver\(true\)/);
  assert.match(triggerBlock, /commitStats\(won, scoreRef\.current\)/);
});
