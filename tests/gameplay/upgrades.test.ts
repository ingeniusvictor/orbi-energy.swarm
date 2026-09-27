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


test("depleted pool returns only the remaining eligible upgrades", () => {
  const activeUpgrades = Object.fromEntries(
    MID_RUN_UPGRADES.map((upgrade) => [upgrade.id, upgrade.maxStacks]),
  );

  activeUpgrades.command_velocity = 2;
  activeUpgrades.swarm_cohesion = 1;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const choices = generateUpgradeChoices(
      activeUpgrades,
      true,
      true,
      true,
      true,
    );

    assert.equal(choices.length, 2);
    assert.deepEqual(
      new Set(choices.map((choice) => choice.id)),
      new Set(["command_velocity", "swarm_cohesion"]),
    );

    for (const choice of choices) {
      assert.ok(
        (activeUpgrades[choice.id] ?? 0) < choice.maxStacks,
        `${choice.id} must remain below max stacks`,
      );
    }
  }
});

test("fully exhausted upgrade pool returns no invalid fallback choices", () => {
  const activeUpgrades = Object.fromEntries(
    MID_RUN_UPGRADES.map((upgrade) => [upgrade.id, upgrade.maxStacks]),
  );

  const choices = generateUpgradeChoices(
    activeUpgrades,
    true,
    true,
    true,
    true,
  );

  assert.deepEqual(choices, []);
});

test("game skips the intermission selector when no upgrade choices remain", () => {
  const game = readGameSource();
  assert.match(game, /if \(choices\.length === 0\)/);
  assert.match(game, /setUpgradeChoices\(\[\]\)/);
  assert.match(game, /setUpgradeSelectionOpen\(false\)/);
});

function readGameSource() {
  return requireSource("../../src/game/EnergySwarmGame.tsx");
}

function requireSource(relativePath: string) {
  const { readFileSync } = require("node:fs") as typeof import("node:fs");
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}
