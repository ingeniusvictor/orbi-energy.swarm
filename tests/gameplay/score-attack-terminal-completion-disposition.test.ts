import assert from "node:assert/strict";
import test from "node:test";

import type { RuntimeCompletionSnapshot } from "../../src/game/runtimeCompletionPolicy";
import { resolveRuntimeWaveDescriptor } from "../../src/game/runtimeProgressionRouter";
import {
  resolveScoreAttackBootstrapEnvelope,
  type ScoreAttackBootstrapEnvelope,
} from "../../src/game/scoreAttackBootstrapEnvelope";
import {
  resolveScoreAttackRuntimeDescriptorCompletionOverlay,
  type ScoreAttackRuntimeDescriptorCompletionOverlay,
} from "../../src/game/scoreAttackRuntimeDescriptorCompletionOverlay";
import {
  SCORE_ATTACK_TERMINAL_COMPLETION_DISPOSITION_AUTHORITY_CONTRACT,
  resolveScoreAttackTerminalCompletionDisposition,
} from "../../src/game/scoreAttackTerminalCompletionDisposition";

const getCanonicalFacts = () => {
  const envelope = resolveScoreAttackBootstrapEnvelope("SCORE_ATTACK");
  assert.ok(envelope);
  const baseDescriptor = resolveRuntimeWaveDescriptor(
    envelope.runtimeProgression,
  );
  const overlay = resolveScoreAttackRuntimeDescriptorCompletionOverlay(
    envelope,
    baseDescriptor,
  );
  assert.ok(overlay);
  return { envelope, baseDescriptor, overlay };
};

const snapshot = (
  remainingTimeMs: number,
): RuntimeCompletionSnapshot => ({
  remainingTimeMs,
  spawnedEnemyCount: 0,
  livingEnemyCount: 999,
  bossDefeated: false,
});

test("J8J projects terminal Score Attack disposition only after canonical TIMEBOX completion", () => {
  const { envelope, overlay } = getCanonicalFacts();

  assert.equal(
    resolveScoreAttackTerminalCompletionDisposition(
      envelope,
      overlay,
      snapshot(1),
    ),
    null,
  );

  const disposition = resolveScoreAttackTerminalCompletionDisposition(
    envelope,
    overlay,
    snapshot(0),
  );

  assert.ok(disposition);
  assert.equal(Object.isFrozen(disposition), true);
  assert.equal(
    disposition.kind,
    "SCORE_ATTACK_TERMINAL_COMPLETION_DISPOSITION",
  );
  assert.equal(disposition.projectionMode, "PROJECTION_ONLY");
  assert.equal(disposition.modeId, "SCORE_ATTACK");
  assert.equal(disposition.sourceRuntimeMode, "INFINITE");
  assert.equal(disposition.completionType, "TIMEBOX");
  assert.equal(disposition.exactDurationMs, 60000);
  assert.equal(disposition.disposition, "END_SCORE_ATTACK_ATTEMPT");
  assert.equal(disposition.completionEvaluatedByRuntimePolicy, true);
  assert.equal(disposition.advanceInfiniteRuntime, false);
  assert.equal(disposition.preservesNestedRuntimeDiscriminator, true);
});

test("J8J delegates TIMEBOX truth to runtime completion policy and ignores budget-clear fields", () => {
  const { envelope, overlay } = getCanonicalFacts();

  const completedWithLivingEnemies =
    resolveScoreAttackTerminalCompletionDisposition(
      envelope,
      overlay,
      {
        remainingTimeMs: -1,
        spawnedEnemyCount: 0,
        livingEnemyCount: 123,
        bossDefeated: false,
      },
    );
  assert.ok(completedWithLivingEnemies);
  assert.equal(
    completedWithLivingEnemies.disposition,
    "END_SCORE_ATTACK_ATTEMPT",
  );

  assert.equal(
    resolveScoreAttackTerminalCompletionDisposition(
      envelope,
      overlay,
      {
        remainingTimeMs: 1,
        spawnedEnemyCount: Number.MAX_SAFE_INTEGER,
        livingEnemyCount: 0,
        bossDefeated: true,
      },
    ),
    null,
  );
});

test("J8J fails closed for absent, mismatched or non-canonical envelope/overlay facts", () => {
  const { envelope, overlay } = getCanonicalFacts();
  const completeSnapshot = snapshot(0);

  assert.equal(
    resolveScoreAttackTerminalCompletionDisposition(
      null,
      overlay,
      completeSnapshot,
    ),
    null,
  );
  assert.equal(
    resolveScoreAttackTerminalCompletionDisposition(
      envelope,
      null,
      completeSnapshot,
    ),
    null,
  );

  const wrongModeEnvelope = {
    ...envelope,
    modeId: "BOSS_RUSH",
  } as unknown as Readonly<ScoreAttackBootstrapEnvelope>;
  assert.equal(
    resolveScoreAttackTerminalCompletionDisposition(
      wrongModeEnvelope,
      overlay,
      completeSnapshot,
    ),
    null,
  );

  const wrongDurationOverlay = {
    ...overlay,
    exactDurationMs: 30000,
  } as unknown as Readonly<ScoreAttackRuntimeDescriptorCompletionOverlay>;
  assert.equal(
    resolveScoreAttackTerminalCompletionDisposition(
      envelope,
      wrongDurationOverlay,
      completeSnapshot,
    ),
    null,
  );

  const changedDescriptorOverlay = {
    ...overlay,
    descriptor: {
      ...overlay.descriptor,
      display: {
        ...overlay.descriptor.display,
        displayName: `${overlay.descriptor.display.displayName} altered`,
      },
    },
  } as unknown as Readonly<ScoreAttackRuntimeDescriptorCompletionOverlay>;
  assert.equal(
    resolveScoreAttackTerminalCompletionDisposition(
      envelope,
      changedDescriptorOverlay,
      completeSnapshot,
    ),
    null,
  );
});

test("J8J is deterministic and does not mutate envelope, overlay, descriptor or snapshot", () => {
  const { envelope, overlay } = getCanonicalFacts();
  const completeSnapshot = snapshot(0);
  const envelopeBefore = JSON.stringify(envelope);
  const overlayBefore = JSON.stringify(overlay);
  const snapshotBefore = JSON.stringify(completeSnapshot);

  const first = resolveScoreAttackTerminalCompletionDisposition(
    envelope,
    overlay,
    completeSnapshot,
  );
  const second = resolveScoreAttackTerminalCompletionDisposition(
    envelope,
    overlay,
    completeSnapshot,
  );

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(envelope), envelopeBefore);
  assert.equal(JSON.stringify(overlay), overlayBefore);
  assert.equal(JSON.stringify(completeSnapshot), snapshotBefore);
});

test("J8J exposes no live mutation, session, cache, UI or persistence authority", () => {
  const { envelope, overlay } = getCanonicalFacts();
  const disposition = resolveScoreAttackTerminalCompletionDisposition(
    envelope,
    overlay,
    snapshot(0),
  );
  assert.ok(disposition);

  assert.equal(disposition.mutatesSessionStatus, false);
  assert.equal(disposition.callsSessionEnd, false);
  assert.equal(disposition.writesRuntimeProjectionCache, false);
  assert.equal(disposition.writesReactStateOrRefs, false);
  assert.equal(disposition.transitionsResultUi, false);
  assert.equal(disposition.writesPersistence, false);
  assert.equal(disposition.writesRunArchive, false);
  assert.equal(disposition.writesScoreAttackRecord, false);

  assert.equal(
    Object.isFrozen(
      SCORE_ATTACK_TERMINAL_COMPLETION_DISPOSITION_AUTHORITY_CONTRACT,
    ),
    true,
  );
  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_TERMINAL_COMPLETION_DISPOSITION_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsTerminalCompletionDispositionProjectionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_TERMINAL_COMPLETION_DISPOSITION_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsTerminalCompletionDispositionProjectionAuthority") {
      continue;
    }
    assert.equal(value, false, `${key} must remain false`);
  }
});
