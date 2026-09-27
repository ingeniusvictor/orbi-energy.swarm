import assert from "node:assert/strict";
import test from "node:test";

import {
  MID_RUN_UPGRADES,
  generateUpgradeChoices,
  getUpgradeValueTransition,
} from "../../src/game/upgrades.ts";

test("mid-run upgrade catalog keeps unique stable IDs", () => {
  assert.equal(MID_RUN_UPGRADES.length, 14);
  const ids = MID_RUN_UPGRADES.map((upgrade) => upgrade.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const upgrade of MID_RUN_UPGRADES) {
    assert.ok(upgrade.maxStacks > 0);
    assert.ok(upgrade.category.length > 0);
  }
});

test("choice generation returns three distinct choices in a normal run", () => {
  const choices = generateUpgradeChoices({}, true, true, true, true);
  assert.equal(choices.length, 3);
  assert.equal(new Set(choices.map((choice) => choice.id)).size, 3);
});

test("affinity upgrades are excluded when that affinity is absent", () => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const choices = generateUpgradeChoices({}, false, false, false, false);
    for (const choice of choices) {
      assert.ok(
        !["solar", "hydro", "wind", "thermal"].includes(choice.affectedAffinity ?? "none"),
        `${choice.id} should not be offered without its affinity`,
      );
    }
  }
});

test("maxed upgrades are excluded from the normal eligible pool", () => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const choices = generateUpgradeChoices({ solar_overcharge: 3 }, true, true, true, true);
    assert.ok(!choices.some((choice) => choice.id === "solar_overcharge"));
  }
});

test("upgrade display transitions expose before/after values", () => {
  const transition = getUpgradeValueTransition("command_velocity", 1);
  assert.equal(transition.before, "+15% Speed");
  assert.equal(transition.after, "+30% Speed");
});
