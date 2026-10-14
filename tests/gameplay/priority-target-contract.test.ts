import assert from "node:assert/strict";
import test from "node:test";

import {
  PRIORITY_TARGET_AUTHORITY_CONTRACT,
  PRIORITY_TARGET_PROFILE_COUNT,
  PRIORITY_TARGET_PROFILES,
  getPriorityTargetProfile,
  resolvePriorityTargetDefeatSignal,
} from "../../src/game/priorityTargetContract.ts";

test("J5A exposes exactly one frozen Command Core profile", () => {
  assert.equal(PRIORITY_TARGET_PROFILE_COUNT, 1);
  assert.equal(PRIORITY_TARGET_PROFILES.length, 1);
  assert.equal(Object.isFrozen(PRIORITY_TARGET_PROFILES), true);

  const profile = getPriorityTargetProfile("COMMAND_CORE");
  assert.ok(profile);
  assert.equal(profile.profileId, "COMMAND_CORE");
  assert.equal(profile.displayName, "Command Core");
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile.decision), true);
  assert.equal(Object.isFrozen(profile.objective), true);
  assert.equal(Object.isFrozen(profile.authority), true);
});

test("Command Core creates a tactical priority decision rather than an HP-only reskin", () => {
  const profile = getPriorityTargetProfile("COMMAND_CORE");
  assert.ok(profile);

  assert.match(profile.decision.tacticalQuestion, /focus the command core/i);
  assert.match(profile.decision.tacticalQuestion, /linked formation/i);
  assert.equal(profile.decision.counterplayIntent, "FOCUS_CORE_TO_BREAK_LINK");
  assert.equal(profile.decision.priorityIntent, "HIGH");
  assert.equal(profile.objective.kind, "BREAK_COMMAND_LINK");
});

test("defeat resolution is deterministic signal-only output", () => {
  const first = resolvePriorityTargetDefeatSignal("COMMAND_CORE");
  const second = resolvePriorityTargetDefeatSignal("COMMAND_CORE");

  assert.deepEqual(first, {
    profileId: "COMMAND_CORE",
    signal: "COMMAND_LINK_BROKEN",
    effectMode: "SIGNAL_ONLY",
  });
  assert.deepEqual(second, first);
  assert.equal(Object.isFrozen(first), true);
});

test("unsupported profile identifiers fail closed", () => {
  assert.equal(getPriorityTargetProfile("UNKNOWN"), null);
  assert.equal(getPriorityTargetProfile(""), null);
  assert.equal(resolvePriorityTargetDefeatSignal("UNKNOWN"), null);
  assert.equal(resolvePriorityTargetDefeatSignal(""), null);
});

test("objective owns no live damage, kill, score, reward or formation effect", () => {
  const profile = getPriorityTargetProfile("COMMAND_CORE");
  assert.ok(profile);

  assert.equal(profile.objective.effectMode, "SIGNAL_ONLY");
  assert.equal(profile.objective.appliesDamage, false);
  assert.equal(profile.objective.killsLinkedTargets, false);
  assert.equal(profile.objective.awardsScore, false);
  assert.equal(profile.objective.awardsRewards, false);
  assert.equal(profile.objective.mutatesFormation, false);
});

test("authority contract is completely zero-live-authority", () => {
  assert.deepEqual(PRIORITY_TARGET_AUTHORITY_CONTRACT, {
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsFormationAuthority: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
  });
});
