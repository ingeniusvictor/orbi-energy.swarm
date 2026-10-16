import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceInfiniteSession,
  createInfiniteSession,
  endInfiniteSession,
} from "../../src/game/infiniteSession";
import {
  createInfiniteRuntimeState,
  resolveRuntimeWaveDescriptor,
} from "../../src/game/runtimeProgressionRouter";
import {
  SCORE_ATTACK_EXECUTION_SUBSTRATE_AUTHORITY_CONTRACT,
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY,
  resolveScoreAttackExecutionSubstrateCompatibility,
} from "../../src/game/scoreAttackExecutionSubstrateContract";

test("J8B freezes one immutable compatibility projection for a fresh existing Infinite session", () => {
  const session = createInfiniteSession("j8b-fixture-seed");
  const before = JSON.stringify(session);

  const projection = resolveScoreAttackExecutionSubstrateCompatibility(
    "SCORE_ATTACK",
    session,
  );

  assert.ok(projection);
  assert.equal(projection, SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY);
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Object.isFrozen(projection.canonicalFreshStart), true);
  assert.deepEqual(projection, {
    modeId: "SCORE_ATTACK",
    contractMode: "COMPATIBILITY_ONLY",
    executionSubstrate: "INFINITE_SESSION",
    runtimeProgressionCompatibility: "INFINITE",
    canonicalFreshStart: {
      sector: 11,
      wave: 1,
      sectorsCompleted: 0,
      wavesCompleted: 0,
      status: "ACTIVE",
    },
    requiresCampaignVictoryCheckpoint: false,
    reusesExistingInfiniteAdvancement: true,
    reusesExistingRuntimeDescriptorPipeline: true,
    keepsScoreAttackOutsideRuntimeProgressionDiscriminator: true,
    selectsExecutionSubstrateCompatibility: true,
    selectsExactDuration: false,
    selectsSeedPolicy: false,
    constructsLiveSession: false,
    executesLiveMode: false,
  });

  assert.equal(JSON.stringify(session), before);
});

test("J8B fails closed for unsupported mode ids and non-fresh or inactive sessions", () => {
  const fresh = createInfiniteSession("j8b-fail-closed-seed");

  for (const unsupported of [
    "",
    " SCORE_ATTACK",
    "SCORE_ATTACK ",
    "score_attack",
    "BOSS_RUSH",
    "DAILY_SEED",
  ]) {
    assert.equal(
      resolveScoreAttackExecutionSubstrateCompatibility(
        unsupported,
        fresh,
      ),
      null,
    );
  }

  const advanced = advanceInfiniteSession(fresh);
  assert.equal(
    resolveScoreAttackExecutionSubstrateCompatibility(
      "SCORE_ATTACK",
      advanced,
    ),
    null,
  );

  const exited = endInfiniteSession(fresh, "EXITED");
  assert.equal(
    resolveScoreAttackExecutionSubstrateCompatibility(
      "SCORE_ATTACK",
      exited,
    ),
    null,
  );
});

test("J8B proves the existing runtime router accepts the same session without a third discriminator", () => {
  const session = createInfiniteSession("j8b-router-seed");
  const runtimeState = createInfiniteRuntimeState(session);

  assert.equal(runtimeState.mode, "INFINITE");
  if (runtimeState.mode !== "INFINITE") {
    assert.fail("fresh Infinite session must remain in INFINITE runtime mode");
  }

  assert.equal(runtimeState.session, session);
  const descriptor = resolveRuntimeWaveDescriptor(runtimeState);
  assert.equal(descriptor.sector, 11);
  assert.equal(descriptor.waveNumber, 1);
});

test("J8B authority contract owns only substrate compatibility", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_EXECUTION_SUBSTRATE_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_EXECUTION_SUBSTRATE_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsExecutionSubstrateCompatibilityAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_EXECUTION_SUBSTRATE_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsExecutionSubstrateCompatibilityAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});
