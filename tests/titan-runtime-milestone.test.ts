import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceInfiniteSession,
  createInfiniteSession,
} from "../src/game/infiniteSession.ts";
import { projectInfiniteMilestoneEncounter } from "../src/game/runtimeMilestoneEncounter.ts";
import { createInfiniteRuntimeWaveDescriptor } from "../src/game/runtimeWaveDescriptor.ts";
import { EnemyType } from "../src/game/types.ts";

const moveToFinalWave = (targetSector: number) => {
  let session = createInfiniteSession(`titan-milestone-${targetSector}`);

  while (session.currentSector < targetSector) {
    session = advanceInfiniteSession(session);
  }
  while (session.currentWaveNumber < session.currentPlan.executionPlans.length) {
    session = advanceInfiniteSession(session);
  }

  return createInfiniteRuntimeWaveDescriptor(session);
};

test("ordinary H5 boss milestones remain Devourer-only", () => {
  for (const sector of [25, 50, 75, 100, 125, 150]) {
    const profile = projectInfiniteMilestoneEncounter(moveToFinalWave(sector));
    assert.ok(profile);
    assert.equal(profile.kind, "BOSS_REMATCH");
    if (profile.kind !== "BOSS_REMATCH") assert.fail("Expected BOSS_REMATCH");
    assert.equal(profile.enemyType, EnemyType.BOSS_DEVOURER);
    assert.equal(profile.bossChassis, "DEVOURER");
    assert.equal(profile.bossEncounterStage, "PRIMARY");
    assert.equal(profile.raidEscalation, null);
  }
});

test("Sector 200 preserves the H5 primary and appends a Titan raid escalation", () => {
  const profile = projectInfiniteMilestoneEncounter(moveToFinalWave(200));
  assert.ok(profile);
  assert.equal(profile.kind, "BOSS_REMATCH");
  if (profile.kind !== "BOSS_REMATCH") assert.fail("Expected BOSS_REMATCH");

  assert.equal(profile.enemyType, EnemyType.BOSS_DEVOURER);
  assert.equal(profile.bossIdentity, "SIEGE_CATHEDRAL");
  assert.equal(profile.bossChassis, "DEVOURER");
  assert.equal(profile.bossEncounterStage, "PRIMARY");
  assert.ok(profile.raidEscalation);
  assert.equal(profile.raidEscalation.enemyType, EnemyType.BOSS_TITAN);
  assert.equal(profile.raidEscalation.chassis, "TITAN_CORE");
  assert.equal(profile.raidEscalation.stage, "RAID_ESCALATION");
});

test("Titan escalation cadence stays deterministic through Sector 1000", () => {
  for (let sector = 25; sector <= 1000; sector += 25) {
    const profile = projectInfiniteMilestoneEncounter(moveToFinalWave(sector));
    assert.ok(profile);
    assert.equal(profile.kind, "BOSS_REMATCH");
    if (profile.kind !== "BOSS_REMATCH") assert.fail("Expected BOSS_REMATCH");
    assert.equal(Boolean(profile.raidEscalation), sector % 200 === 0);
  }
});
