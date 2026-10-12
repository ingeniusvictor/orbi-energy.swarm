import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
  OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
  projectCombatOverdriveEffects,
} from "../../src/game/combatOverdriveEffects.ts";

test("inactive Overdrive combat expression is exactly neutral", () => {
  assert.deepEqual(projectCombatOverdriveEffects({ active: false }), {
    active: false,
    playerDamageMultiplier: 1,
  });
});

test("active Overdrive combat expression applies the exact bounded damage multiplier", () => {
  const projection = projectCombatOverdriveEffects({ active: true });

  assert.deepEqual(projection, {
    active: true,
    playerDamageMultiplier: 1.2,
  });
  assert.equal(OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER, 1.2);
  assert.equal(MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER, 1.25);
  assert.ok(Number.isFinite(projection.playerDamageMultiplier));
  assert.ok(projection.playerDamageMultiplier >= 1);
  assert.ok(
    projection.playerDamageMultiplier <=
      MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
  );
});

test("combat expression is deterministic, non-stacking and does not mutate caller input", () => {
  const input = Object.freeze({ active: true } as const);
  const first = projectCombatOverdriveEffects(input);
  const second = projectCombatOverdriveEffects(input);

  assert.deepEqual(first, second);
  assert.deepEqual(input, { active: true });

  for (let index = 0; index < 100; index += 1) {
    const repeated = projectCombatOverdriveEffects(input);
    assert.equal(
      repeated.playerDamageMultiplier,
      OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER,
    );
  }
});

test("switching back to inactive immediately returns to neutral combat projection", () => {
  const active = projectCombatOverdriveEffects({ active: true });
  const inactive = projectCombatOverdriveEffects({ active: false });

  assert.equal(active.playerDamageMultiplier, 1.2);
  assert.equal(inactive.playerDamageMultiplier, 1);
});
