import assert from "node:assert/strict";
import test from "node:test";

import { BOSS_PURSUIT_PROFILES, projectBossPursuit } from "../src/game/bossPursuit.ts";

const bounds = { minX: 8, minY: 8, maxX: 1592, maxY: 952 };

test("Devourer pursuit pressure increases by phase while radial standoff shrinks", () => {
  assert.ok(BOSS_PURSUIT_PROFILES[1].speedPerFrame < BOSS_PURSUIT_PROFILES[2].speedPerFrame);
  assert.ok(BOSS_PURSUIT_PROFILES[2].speedPerFrame < BOSS_PURSUIT_PROFILES[3].speedPerFrame);
  assert.ok(BOSS_PURSUIT_PROFILES[1].standoffDistance > BOSS_PURSUIT_PROFILES[2].standoffDistance);
  assert.ok(BOSS_PURSUIT_PROFILES[2].standoffDistance > BOSS_PURSUIT_PROFILES[3].standoffDistance);
  assert.ok(BOSS_PURSUIT_PROFILES[1].speedPerFrame >= 1.8);
  assert.ok(BOSS_PURSUIT_PROFILES[3].standoffDistance <= 75);
});

test("all phases pursue the player in both axes from long range", () => {
  for (const phase of [1, 2, 3]) {
    const projected = projectBossPursuit({ bossX: 300, bossY: 220, playerX: 900, playerY: 700, phase, deltaMs: 16.6, bounds });
    assert.ok(projected.x > 300, "phase " + phase + " should move toward player x");
    assert.ok(projected.y > 220, "phase " + phase + " should move toward player y");
  }
});

test("long-range catch-up visibly exceeds the base phase step", () => {
  const phase = 3;
  const projected = projectBossPursuit({ bossX: 200, bossY: 200, playerX: 1400, playerY: 800, phase, deltaMs: 16.6, bounds });
  const travel = Math.hypot(projected.x - 200, projected.y - 200);
  assert.ok(travel > BOSS_PURSUIT_PROFILES[phase].speedPerFrame);
});

test("pursuit is frame-delta bounded and cannot teleport", () => {
  const phase = 3;
  const projected = projectBossPursuit({ bossX: 200, bossY: 200, playerX: 1400, playerY: 800, phase, deltaMs: 500, bounds });
  const travel = Math.hypot(projected.x - 200, projected.y - 200);
  const profile = BOSS_PURSUIT_PROFILES[phase];
  const maxTravel = profile.speedPerFrame * profile.catchupMultiplier * (50 / 16.6);
  assert.ok(travel <= maxTravel + 1e-9);
});

test("pursuit respects world margin at every phase", () => {
  for (const phase of [1, 2, 3]) {
    const projected = projectBossPursuit({ bossX: 1590, bossY: 950, playerX: 5000, playerY: 5000, phase, deltaMs: 16.6, bounds, margin: 40 });
    assert.ok(projected.x >= 48 && projected.x <= 1552);
    assert.ok(projected.y >= 48 && projected.y <= 912);
    assert.ok(projected.targetX >= 48 && projected.targetX <= 1552);
    assert.ok(projected.targetY >= 48 && projected.targetY <= 912);
  }
});

test("pursuit holds position once the phase radial standoff is reached", () => {
  const projected = projectBossPursuit({ bossX: 740, bossY: 600, playerX: 800, playerY: 600, phase: 2, deltaMs: 16.6, bounds });
  assert.equal(projected.x, 740);
  assert.equal(projected.y, 600);
});
