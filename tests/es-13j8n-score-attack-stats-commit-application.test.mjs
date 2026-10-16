import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackStatsCommitApplication.ts",
  "utf8",
);
const storageSource = readFileSync("src/game/storage.ts", "utf8");
const persistenceSource = readFileSync("src/game/runPersistence.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");

test("J8N consumes J8M and reuses J8D normalization without owning persistence I/O", () => {
  assert.match(source, /ScoreAttackAttemptFinalizationPlan/);
  assert.match(source, /resolveScoreAttackRecordProjection\(/);
  assert.match(source, /stats\.scoreAttackBestScore/);
  assert.match(source, /normalizedCurrentBest !== finalizationPlan\.normalizedExistingBestScore/);
  assert.doesNotMatch(source, /Math\.floor|Number\.MAX_SAFE_INTEGER/);

  for (const forbidden of [
    'from "./storage"',
    'from "./runPersistence"',
    'from "./EnergySwarmGame"',
  ]) {
    assert.equal(source.includes(forbidden), false, `forbidden dependency: ${forbidden}`);
  }

  assert.doesNotMatch(
    source,
    /localStorage|sessionStorage|saveGameStats|loadGameStats|resetGameStats|applyFinalRunCommit|Date\.now|performance\.now|Math\.random/,
  );
});

test("J8N can change only the dedicated Score Attack record field", () => {
  assert.match(source, /scoreAttackBestScore:\s*nextBestScore/);
  assert.match(source, /preservesGlobalHighScore:\s*true/);
  assert.match(source, /preservesGenericRunPersistence:\s*true/);
  assert.match(source, /preservesRunArchive:\s*true/);
  assert.match(source, /writesStorage:\s*false/);
  assert.match(source, /callsSaveGameStats:\s*false/);
  assert.match(source, /callsApplyFinalRunCommit:\s*false/);

  assert.match(storageSource, /scoreAttackBestScore:/);
  assert.match(persistenceSource, /applyFinalRunCommit/);
  assert.equal(
    gameSource.includes("scoreAttackStatsCommitApplication"),
    false,
    "EnergySwarmGame must not import J8N yet",
  );
});

test("J8N authority contract has dedicated stats application as its only positive authority", () => {
  const positives = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positives)], [
    "ownsDedicatedStatsCommitApplicationAuthority",
  ]);
});
