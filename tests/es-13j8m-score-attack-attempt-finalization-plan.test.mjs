import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackAttemptFinalizationPlan.ts",
  "utf8",
);
const j8jSource = readFileSync(
  "src/game/scoreAttackTerminalCompletionDisposition.ts",
  "utf8",
);
const j8fSource = readFileSync(
  "src/game/scoreAttackRecordCommitEligibility.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");

test("J8M composes frozen J8J terminal resolution and J8F record eligibility directly", () => {
  assert.match(source, /resolveScoreAttackTerminalCompletionDisposition\(/);
  assert.match(
    source,
    /activationEnvelope\.bootstrapEnvelope/,
  );
  assert.match(
    source,
    /activationEnvelope\.runtimeProjectionBundle\.completionOverlay/,
  );
  assert.match(source, /resolveScoreAttackRecordCommitEligibility\(/);
  assert.match(source, /existingBestScore/);
  assert.match(source, /candidateScore/);

  assert.match(j8jSource, /END_SCORE_ATTACK_ATTEMPT/);
  assert.match(j8fSource, /eligibleToAdvanceRecord/);
});

test("J8M derives only the frozen completed TIMEBOX fact and does not reimplement score normalization", () => {
  assert.match(source, /type:\s*"TIMEBOX" as const/);
  assert.match(source, /durationMs:\s*SCORE_ATTACK_DURATION_MS/);
  assert.match(source, /completed:\s*true as const/);
  assert.match(source, /delegatesTerminalResolutionToJ8J:\s*true/);
  assert.match(source, /delegatesRecordEligibilityToJ8F:\s*true/);

  assert.doesNotMatch(source, /Math\.floor|Number\.MAX_SAFE_INTEGER/);
});

test("J8M remains pure and disconnected from storage, generic persistence and live UI", () => {
  const forbiddenImports = [
    "./storage",
    "./runPersistence",
    "./EnergySwarmGame",
    "../components/StartScreen",
    "../components/ResultScreen",
    "../components/GameHud",
  ];

  for (const modulePath of forbiddenImports) {
    assert.equal(
      source.includes(`from \"${modulePath}\"`),
      false,
      `J8M must not import ${modulePath}`,
    );
  }

  assert.doesNotMatch(
    source,
    /localStorage|sessionStorage|saveGameStats|applyFinalRunCommit|Date\.now|performance\.now|Math\.random/,
  );
  assert.match(source, /writesStorage:\s*false/);
  assert.match(source, /mutatesGameStats:\s*false/);
  assert.match(source, /mutatesGlobalHighScore:\s*false/);
  assert.match(source, /writesGenericRunPersistence:\s*false/);
  assert.match(source, /writesRunArchive:\s*false/);
  assert.match(source, /writesReactStateOrRefs:\s*false/);
  assert.match(source, /transitionsResultUi:\s*false/);
  assert.match(source, /startsOrTicksTimer:\s*false/);
  assert.match(source, /advancesOrEndsSession:\s*false/);

  assert.equal(
    gameSource.includes("scoreAttackAttemptFinalizationPlan"),
    false,
    "EnergySwarmGame must not import J8M yet",
  );
});

test("J8M authority contract has finalization-plan composition as its only positive authority", () => {
  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positiveMatches)], [
    "ownsAttemptFinalizationPlanCompositionAuthority",
  ]);
});
