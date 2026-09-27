import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceInfiniteSession,
  createInfiniteSession,
} from "../src/game/infiniteSession.ts";
import { projectInfiniteMilestoneEncounter } from "../src/game/runtimeMilestoneEncounter.ts";
import {
  createCampaignRuntimeWaveDescriptor,
  createInfiniteRuntimeWaveDescriptor,
} from "../src/game/runtimeWaveDescriptor.ts";
import { EnemyType } from "../src/game/types.ts";

const moveToFinalWave = (
  targetSector: number,
) => {
  let session = createInfiniteSession(
    `milestone-sector-${targetSector}`,
  );

  while (session.currentSector < targetSector) {
    session = advanceInfiniteSession(session);
  }

  while (
    session.currentWaveNumber <
    session.currentPlan.executionPlans.length
  ) {
    session = advanceInfiniteSession(session);
  }

  return session;
};

test("campaign and ordinary infinite waves project no milestone encounter", () => {
  assert.equal(
    projectInfiniteMilestoneEncounter(
      createCampaignRuntimeWaveDescriptor(10),
    ),
    null,
  );

  const ordinary =
    createInfiniteRuntimeWaveDescriptor(
      createInfiniteSession("ordinary-wave"),
    );
  assert.equal(
    projectInfiniteMilestoneEncounter(ordinary),
    null,
  );
});

test("milestone metadata fails closed when attached to a non-final wave", () => {
  const descriptor =
    createInfiniteRuntimeWaveDescriptor(
      createInfiniteSession("malformed-milestone"),
    );

  assert.equal(
    projectInfiniteMilestoneEncounter({
      ...descriptor,
      milestone: {
        kind: "MINIBOSS",
        id: "synthetic-miniboss",
      },
    }),
    null,
  );
});

test("Sector 15 final wave projects a budget-compatible Blackout Elite miniboss", () => {
  const descriptor =
    createInfiniteRuntimeWaveDescriptor(
      moveToFinalWave(15),
    );
  const profile =
    projectInfiniteMilestoneEncounter(descriptor);

  assert.ok(profile);
  assert.equal(profile.kind, "MINIBOSS");

  if (profile.kind !== "MINIBOSS") {
    assert.fail("Expected MINIBOSS profile");
  }

  assert.equal(
    profile.enemyType,
    EnemyType.BLACKOUT_ELITE,
  );
  assert.equal(
    profile.spawnTrigger,
    "REPLACE_FINAL_BUDGET_SLOT",
  );
  assert.equal(
    profile.completionMode,
    "BUDGET_AND_CLEAR",
  );
  assert.equal(
    profile.campaignTelemetryMode,
    "ISOLATED",
  );
  assert.ok(profile.healthMultiplier >= 2.4);
  assert.ok(profile.healthMultiplier <= 4);
  assert.ok(profile.sizeMultiplier >= 1.5);
  assert.ok(profile.sizeMultiplier <= 1.75);
  assert.ok(
    profile.telegraphMs >=
      (descriptor.fairness?.minTelegraphMs ?? 0),
  );
});

test("Sector 25 final wave projects an isolated Devourer rematch phase", () => {
  const descriptor =
    createInfiniteRuntimeWaveDescriptor(
      moveToFinalWave(25),
    );
  const profile =
    projectInfiniteMilestoneEncounter(descriptor);

  assert.ok(profile);
  assert.equal(profile.kind, "BOSS_REMATCH");

  if (profile.kind !== "BOSS_REMATCH") {
    assert.fail("Expected BOSS_REMATCH profile");
  }

  assert.equal(
    profile.enemyType,
    EnemyType.BOSS_DEVOURER,
  );
  assert.equal(
    profile.spawnTrigger,
    "AFTER_REGULAR_BUDGET_CLEAR",
  );
  assert.equal(
    profile.completionMode,
    "BOSS_DEFEAT_AFTER_BUDGET",
  );
  assert.equal(
    profile.campaignTelemetryMode,
    "ISOLATED",
  );
  assert.equal(
    profile.campaignVictoryCheckpoint,
    false,
  );
  assert.ok(profile.telegraphMs >= 2200);
  assert.ok(
    profile.telegraphMs >=
      (descriptor.fairness?.minTelegraphMs ?? 0),
  );
});

test("milestone encounter scaling remains finite and bounded through Sector 1000", () => {
  let session = createInfiniteSession(
    "milestone-long-run",
  );

  while (session.currentSector <= 1000) {
    const descriptor =
      createInfiniteRuntimeWaveDescriptor(session);
    const profile =
      projectInfiniteMilestoneEncounter(descriptor);

    if (profile) {
      assert.equal(
        Number.isFinite(profile.healthMultiplier),
        true,
      );
      assert.ok(profile.healthMultiplier > 0);
      assert.equal(
        profile.campaignTelemetryMode,
        "ISOLATED",
      );

      if (profile.kind === "MINIBOSS") {
        assert.ok(profile.healthMultiplier <= 4);
        assert.ok(
          profile.movementSpeedMultiplier <= 1.2,
        );
        assert.ok(
          profile.contactDamageMultiplier <= 1.55,
        );
        assert.ok(profile.sizeMultiplier <= 1.75);
        assert.ok(profile.rewardMultiplier <= 2.25);
      } else {
        assert.ok(profile.healthMultiplier <= 2.25);
        assert.ok(profile.damageMultiplier <= 1.7);
        assert.ok(profile.attackRateMultiplier <= 1.5);
        assert.ok(profile.rewardMultiplier <= 4);
        assert.equal(
          profile.campaignVictoryCheckpoint,
          false,
        );
      }
    }

    session = advanceInfiniteSession(session);
  }
});
