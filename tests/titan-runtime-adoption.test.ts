import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const canvas = readFileSync(
  new URL("../src/game/EnergySwarmCanvas.tsx", import.meta.url),
  "utf8",
);
const hud = readFileSync(
  new URL("../src/components/BossHudOverlay.tsx", import.meta.url),
  "utf8",
);

test("Titan shares the certified boss engine instead of creating a second loop", () => {
  assert.match(
    game,
    /EnemyType\.BOSS_DEVOURER \|\| enemy\.type === EnemyType\.BOSS_TITAN/,
  );
  assert.match(game, /spawnBoss\(rematchProfile, "RAID_ESCALATION"\)/);
  assert.match(game, /activeBossRematchProfileRef/);
  assert.doesNotMatch(game, /updateTitanAI/);
});

test("Titan uses fixed weakpoints and existing projectile collision budget", () => {
  assert.match(game, /node\.collisionRadius \+ proj\.size/);
  assert.match(game, /chassis\.weakpoints\.protectedDamageMultiplier/);
  assert.match(game, /chassis\.weakpoints\.exposedDamageMultiplier/);
  assert.match(game, /motion: weakpoints\.motion/);
});

test("Titan presentation is chassis-aware without a second WebGL scene", () => {
  assert.match(canvas, /case EnemyType\.BOSS_TITAN/);
  assert.match(canvas, /titanPulse/);
  assert.match(hud, /data-boss-chassis/);
  assert.match(hud, /chassis\.weakpoints\.hudLabel/);
  assert.doesNotMatch(canvas, /THREE|WebGLRenderer/);
});
