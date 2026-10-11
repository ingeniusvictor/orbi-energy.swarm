import assert from "node:assert/strict";
import test from "node:test";

import {
  hasTitanRaidEscalation,
  hasWormRaidEscalation,
  projectInfiniteRaidEscalation,
  projectTitanRaidEscalation,
  projectWormRaidEscalation,
  resolveBossRematchDefeatAction,
} from "../src/game/infiniteRaidEscalation.ts";
import { EnemyType } from "../src/game/types.ts";

test("Titan raid escalation preserves the H7 200-sector cadence", () => {
  assert.equal(hasTitanRaidEscalation(199), false);
  assert.equal(hasTitanRaidEscalation(200), true);
  assert.equal(hasTitanRaidEscalation(201), false);
  assert.equal(hasTitanRaidEscalation(400), true);
  assert.equal(hasTitanRaidEscalation(600), true);
  assert.equal(hasTitanRaidEscalation(1000), true);
});

test("Worm raids begin at 300 and alternate between Titan milestones", () => {
  assert.equal(hasWormRaidEscalation(299), false);
  assert.equal(hasWormRaidEscalation(300), true);
  assert.equal(hasWormRaidEscalation(400), false);
  assert.equal(hasWormRaidEscalation(500), true);
  assert.equal(hasWormRaidEscalation(700), true);
  assert.equal(hasWormRaidEscalation(900), true);
});

test("Titan and Worm raid schedules remain mutually exclusive through Sector 5000", () => {
  for (let sector = 1; sector <= 5000; sector += 1) {
    assert.equal(
      hasTitanRaidEscalation(sector) && hasWormRaidEscalation(sector),
      false,
      `raid overlap at Sector ${sector}`,
    );
  }
});

test("general raid authority returns exactly the expected deep-endgame chassis", () => {
  assert.equal(projectInfiniteRaidEscalation(299), null);
  assert.equal(projectInfiniteRaidEscalation(300)?.chassis, "WORM_SEGMENTS");
  assert.equal(projectInfiniteRaidEscalation(400)?.chassis, "TITAN_CORE");
  assert.equal(projectInfiniteRaidEscalation(500)?.chassis, "WORM_SEGMENTS");
  assert.equal(projectInfiniteRaidEscalation(600)?.chassis, "TITAN_CORE");
});

test("Titan raid profile remains bounded and honors fairness telegraph", () => {
  const sector200 = projectTitanRaidEscalation(200, 3000);
  const sector1000 = projectTitanRaidEscalation(1000, 900);

  assert.ok(sector200);
  assert.ok(sector1000);
  assert.equal(sector200.enemyType, EnemyType.BOSS_TITAN);
  assert.equal(sector200.chassis, "TITAN_CORE");
  assert.equal(sector200.stage, "RAID_ESCALATION");
  assert.equal(sector200.telegraphMs, 3000);
  assert.ok(sector1000.healthMultiplier <= 1.6);
  assert.ok(sector1000.damageMultiplier <= 1.55);
  assert.ok(sector1000.attackRateMultiplier <= 1.35);
  assert.ok(sector1000.rewardMultiplier <= 3);
});

test("Worm raid profile remains bounded and honors fairness telegraph", () => {
  const sector300 = projectWormRaidEscalation(300, 3100);
  const sector900 = projectWormRaidEscalation(900, 800);

  assert.ok(sector300);
  assert.ok(sector900);
  assert.equal(sector300.enemyType, EnemyType.BOSS_WORM);
  assert.equal(sector300.chassis, "WORM_SEGMENTS");
  assert.equal(sector300.stage, "RAID_ESCALATION");
  assert.equal(sector300.telegraphMs, 3100);
  assert.ok(sector900.healthMultiplier <= 1.5);
  assert.ok(sector900.damageMultiplier <= 1.48);
  assert.ok(sector900.attackRateMultiplier <= 1.34);
  assert.ok(sector900.rewardMultiplier <= 2.8);
});

test("raid defeat sequencing resolves only after the escalation stage", () => {
  const titan = projectTitanRaidEscalation(200);
  const worm = projectWormRaidEscalation(300);
  assert.ok(titan);
  assert.ok(worm);

  assert.equal(
    resolveBossRematchDefeatAction("PRIMARY", titan),
    "SPAWN_RAID_ESCALATION",
  );
  assert.equal(
    resolveBossRematchDefeatAction("PRIMARY", worm),
    "SPAWN_RAID_ESCALATION",
  );
  assert.equal(
    resolveBossRematchDefeatAction("RAID_ESCALATION", worm),
    "RESOLVE_GATE",
  );
  assert.equal(
    resolveBossRematchDefeatAction("PRIMARY", null),
    "RESOLVE_GATE",
  );
});
