import assert from "node:assert/strict";
import test from "node:test";

import {
  hasTitanRaidEscalation,
  projectTitanRaidEscalation,
  resolveBossRematchDefeatAction,
} from "../src/game/infiniteRaidEscalation.ts";
import { EnemyType } from "../src/game/types.ts";

test("Titan raid escalation begins at 200 and repeats every 200 sectors", () => {
  assert.equal(hasTitanRaidEscalation(199), false);
  assert.equal(hasTitanRaidEscalation(200), true);
  assert.equal(hasTitanRaidEscalation(201), false);
  assert.equal(hasTitanRaidEscalation(400), true);
  assert.equal(hasTitanRaidEscalation(600), true);
  assert.equal(hasTitanRaidEscalation(1000), true);
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

test("raid defeat sequencing resolves only after the Titan stage", () => {
  const raid = projectTitanRaidEscalation(200);
  assert.ok(raid);

  assert.equal(
    resolveBossRematchDefeatAction("PRIMARY", raid),
    "SPAWN_RAID_ESCALATION",
  );
  assert.equal(
    resolveBossRematchDefeatAction("RAID_ESCALATION", raid),
    "RESOLVE_GATE",
  );
  assert.equal(
    resolveBossRematchDefeatAction("PRIMARY", null),
    "RESOLVE_GATE",
  );
});
