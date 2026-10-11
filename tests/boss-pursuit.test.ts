import assert from "node:assert/strict";
import test from "node:test";

import {
  BOSS_PURSUIT_PROFILES,
  projectBossPursuit,
} from "../src/game/bossPursuit.ts";

const bounds = { minX: 8, minY: 8, maxX: 1592, maxY: 952 };

test("Devourer pursuit pressure increases by phase while standoff shrinks", () => {
  assert.ok(
    BOSS_PURSUIT_PROFILES[1].speedPerFrame <
      BOSS_PURSUIT_PROFILES[2].speedPerFrame,
  );
  assert.ok(
    BOSS_PURSUIT_PROFILES[2].speedPerFrame <
      BOSS_PURSUIT_PROFILES[3].speedPerFrame,
  );
  assert.ok(
    BOSS_PURSUIT_PROFILES[1].standoffY >
      BOSS_PURSUIT_PROFILES[2].standoffY,
  );
  assert.ok(
    BOSS_PURSUIT_PROFILES[2].standoffY >
      BOSS_PURSUIT_PROFILES[3].standoffY,
  );
});

test("all phases pursue the player's live horizontal position", () => {
  for (const phase of [1, 2, 3]) {
    const projected = projectBossPursuit({
      bossX: 300,
      bossY: 220,
      playerX: 900,
      playerY: 700,
      phase,
      deltaMs: 16.6,
      bounds,
    });
    assert.ok(projected.x > 300, `phase ${phase} should move toward player x`);
    assert.equal(projected.targetX, 900);
  }
});

test("pursuit is frame-delta bounded and cannot teleport", () => {
  const projected = projectBossPursuit({
    bossX: 200,
    bossY: 200,
    playerX: 1400,
    playerY: 800,
    phase: 3,
    deltaMs: 500,
    bounds,
  });
  const travel = Math.hypot(projected.x - 200, projected.y - 200);
  const maxTravel = BOSS_PURSUIT_PROFILES[3].speedPerFrame * (50 / 16.6);
  assert.ok(travel <= maxTravel + 1e-9);
});

test("pursuit respects world margin at every phase", () => {
  for (const phase of [1, 2, 3]) {
    const projected = projectBossPursuit({
      bossX: 1590,
      bossY: 950,
      playerX: 5000,
      playerY: 5000,
      phase,
      deltaMs: 16.6,
      bounds,
      margin: 40,
    });
    assert.ok(projected.x >= 48 && projected.x <= 1552);
    assert.ok(projected.y >= 48 && projected.y <= 912);
    assert.ok(projected.targetX >= 48 && projected.targetX <= 1552);
    assert.ok(projected.targetY >= 48 && projected.targetY <= 912);
  }
});

test("pursuit settles inside the phase dead zone without jitter", () => {
  const phase = 2;
  const playerX = 800;
  const playerY = 600;
  const targetY = playerY - BOSS_PURSUIT_PROFILES[phase].standoffY;
  const projected = projectBossPursuit({
    bossX: playerX + 5,
    bossY: targetY + 5,
    playerX,
    playerY,
    phase,
    deltaMs: 16.6,
    bounds,
  });
  assert.equal(projected.x, playerX + 5);
  assert.equal(projected.y, targetY + 5);
});
