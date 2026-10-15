import assert from "node:assert/strict";
import test from "node:test";

import type { CommandLinkFormationFacts } from "../../src/game/commandLinkBinding.ts";
import type { CommandLinkPulseTriggerDamageSourceKind } from "../../src/game/commandLinkPulseTriggerDamageSource.ts";
import {
  LIVE_COMMAND_LINK_PULSE_AUTHORITY_CONTRACT,
  projectLiveCommandLinkPulseTarget,
  resolveLiveCommandLinkPulseIntent,
} from "../../src/game/liveCommandLinkPulseApplication.ts";

const core = (memberCount: 2 | 3): CommandLinkFormationFacts => ({
  groupId: `live-pulse:${memberCount}`,
  memberIndex: 0,
  memberCount,
});

const linked = (
  memberCount: 2 | 3,
  memberIndex: 1 | 2,
): CommandLinkFormationFacts => ({
  groupId: `live-pulse:${memberCount}`,
  memberIndex,
  memberCount,
});

const runtimeSourceKind = (value: string) =>
  value as CommandLinkPulseTriggerDamageSourceKind;

test("valid direct-hit core defeat resolves one immutable non-lethal pending pulse intent", () => {
  const intent = resolveLiveCommandLinkPulseIntent(core(3), "DIRECT_HIT", 8, 5);

  assert.ok(intent);
  assert.equal(intent.mode, "LIVE_NON_LETHAL_PENDING");
  assert.equal(intent.resolution.groupId, "live-pulse:3");
  assert.equal(intent.proposal.effectId, "COMMAND_LINK_DISRUPTION_PULSE");
  assert.equal(intent.proposal.effectMode, "PROPOSAL_ONLY");
  assert.equal(intent.source.sourceKind, "DIRECT_HIT");
  assert.equal(intent.source.effectiveTriggerDamage, 5);
  assert.equal(intent.source.proposedPulseDamage, 5);
  assert.equal(Object.isFrozen(intent), true);
});

test("valid splash core defeat keeps already-resolved splash magnitude and bounds overkill", () => {
  const intent = resolveLiveCommandLinkPulseIntent(core(2), "SPLASH_HIT", 1.5, 1);

  assert.ok(intent);
  assert.equal(intent.source.sourceKind, "SPLASH_HIT");
  assert.equal(intent.source.resolvedSourceDamage, 1.5);
  assert.equal(intent.source.sourceHealthBeforeHit, 1);
  assert.equal(intent.source.proposedPulseDamage, 1);
  assert.equal(intent.source.transfersOverkill, false);
});

test("linked core facts invalid source kinds and invalid source scalars fail closed", () => {
  assert.equal(
    resolveLiveCommandLinkPulseIntent(linked(2, 1), "DIRECT_HIT", 2, 2),
    null,
  );
  assert.equal(
    resolveLiveCommandLinkPulseIntent(
      core(2),
      runtimeSourceKind("CHAIN_REACTION"),
      2,
      2,
    ),
    null,
  );

  for (const [damage, health] of [
    [0, 2],
    [-1, 2],
    [Number.NaN, 2],
    [2, 0],
    [2, -1],
    [2, Number.POSITIVE_INFINITY],
  ] as const) {
    assert.equal(
      resolveLiveCommandLinkPulseIntent(core(2), "DIRECT_HIT", damage, health),
      null,
    );
  }
});

test("size-two linked target projects exact J5F-C non-lethal resulting health", () => {
  const intent = resolveLiveCommandLinkPulseIntent(core(2), "DIRECT_HIT", 5, 5);
  assert.ok(intent);

  const target = projectLiveCommandLinkPulseTarget(
    intent,
    linked(2, 1),
    4,
    4,
    true,
  );

  assert.ok(target);
  assert.equal(target.mode, "LIVE_NON_LETHAL_HEALTH_APPLICATION");
  assert.equal(target.eligibility.memberIndex, 1);
  assert.equal(target.safeDamage, 3);
  assert.equal(target.resultingHealth, 1);
  assert.equal(target.healthFloor, 1);
  assert.equal(target.canKill, false);
  assert.equal(target.setIsDead, false);
  assert.equal(target.registersDefeat, false);
  assert.equal(Object.isFrozen(target), true);
});

test("size-three pulse independently projects both bounded linked members in one caller traversal", () => {
  const intent = resolveLiveCommandLinkPulseIntent(core(3), "DIRECT_HIT", 2, 3);
  assert.ok(intent);

  for (const memberIndex of [1, 2] as const) {
    const target = projectLiveCommandLinkPulseTarget(
      intent,
      linked(3, memberIndex),
      6,
      6,
      true,
    );
    assert.ok(target);
    assert.equal(target.eligibility.memberIndex, memberIndex);
    assert.equal(target.safeDamage, 2);
    assert.equal(target.resultingHealth, 4);
  }
});

test("wrong group core member dead target missing formation and unsafe health fail closed", () => {
  const intent = resolveLiveCommandLinkPulseIntent(core(3), "DIRECT_HIT", 2, 2);
  assert.ok(intent);

  assert.equal(
    projectLiveCommandLinkPulseTarget(
      intent,
      { groupId: "other", memberIndex: 1, memberCount: 3 },
      5,
      5,
      true,
    ),
    null,
  );
  assert.equal(projectLiveCommandLinkPulseTarget(intent, core(3), 5, 5, true), null);
  assert.equal(
    projectLiveCommandLinkPulseTarget(intent, linked(3, 1), 5, 5, false),
    null,
  );
  assert.equal(projectLiveCommandLinkPulseTarget(intent, null, 5, 5, true), null);
  assert.equal(
    projectLiveCommandLinkPulseTarget(intent, linked(3, 1), 0.5, 5, true),
    null,
  );
});

test("J5F-E authority contract owns no defeat economy formation collection timing or cap authority", () => {
  assert.deepEqual(LIVE_COMMAND_LINK_PULSE_AUTHORITY_CONTRACT, {
    ownsCommandLinkBreakAuthority: false,
    ownsEffectProposalAuthority: false,
    ownsTargetEligibilityAuthority: false,
    ownsDamageSafetyAuthority: false,
    ownsTriggerDamageSourceAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsDropAuthority: false,
    ownsFormationAuthority: false,
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    maySetLinkedTargetDead: false,
    mayRegisterPulseDefeat: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
  assert.equal(Object.isFrozen(LIVE_COMMAND_LINK_PULSE_AUTHORITY_CONTRACT), true);
});
