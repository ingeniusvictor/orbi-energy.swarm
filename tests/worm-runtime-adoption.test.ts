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

test("Worm shares the certified boss loop and keeps segments outside Enemy[]", () => {
  assert.match(game, /EnemyType\.BOSS_WORM/);
  assert.match(game, /stepWormSegmentChainInPlace/);
  assert.match(game, /motion === "SERPENTINE"/);
  assert.doesNotMatch(game, /updateWormAI/);
  assert.doesNotMatch(game, /enemiesRef\.current\.push\([^\n]*worm-segment/i);
});

test("Worm segment destruction is bounded, rewarded once, and never regenerated", () => {
  assert.match(game, /weakpoints\.destructionReward/);
  assert.match(game, /runNanoCreditsEarnedRef\.current \+= reward\.nanoCredits/);
  assert.match(game, /chassisProfile\.id !== "WORM_SEGMENTS"/);
  assert.match(game, /shieldNodesRef\.current\.splice\(s, 1\)/);
});

test("Worm presentation stays inside existing Canvas2D and chassis-aware HUD", () => {
  assert.match(canvas, /case EnemyType\.BOSS_WORM/);
  assert.match(canvas, /drawWormSegmentChain/);
  assert.match(game, /drawWormSegmentChain/);
  assert.match(hud, /bossChassis === "DEVOURER" \? "⚠ MAJOR COLLAPSE DETECTED" : "⚠ RAID ESCALATION DETECTED"/);
  assert.match(hud, /chassis\.weakpoints\.hudLabel/);
  assert.doesNotMatch(canvas, /THREE|WebGLRenderer/);
});
