import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getCanvasBackingStoreSize, normalizeCanvasDpr } from "../src/game/canvasResolution.ts";
import { getQualityConfig } from "../src/game/quality.ts";
import { QualityPreset } from "../src/game/types.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("quality presets enforce declared DPR ceilings", () => {
  assert.equal(normalizeCanvasDpr(3, getQualityConfig(QualityPreset.LOW).maxDPR), 1);
  assert.equal(normalizeCanvasDpr(3, getQualityConfig(QualityPreset.MEDIUM).maxDPR), 1.5);
  assert.equal(normalizeCanvasDpr(3, getQualityConfig(QualityPreset.HIGH).maxDPR), 2);
  assert.equal(normalizeCanvasDpr(3, getQualityConfig(QualityPreset.ULTRA).maxDPR), 2);
});

test("backing store obeys both preset and global DPR caps", () => {
  assert.deepEqual(getCanvasBackingStoreSize(800, 480, 3, 1), {
    dpr: 1,
    width: 800,
    height: 480,
  });
  assert.deepEqual(getCanvasBackingStoreSize(800, 480, 3, 1.5), {
    dpr: 1.5,
    width: 1200,
    height: 720,
  });
  assert.deepEqual(getCanvasBackingStoreSize(800, 480, 4, 10), {
    dpr: 2,
    width: 1600,
    height: 960,
  });
});

test("all four renderer budgets remain explicit and ordered", () => {
  const low = getQualityConfig(QualityPreset.LOW);
  const medium = getQualityConfig(QualityPreset.MEDIUM);
  const high = getQualityConfig(QualityPreset.HIGH);
  const ultra = getQualityConfig(QualityPreset.ULTRA);

  assert.deepEqual(
    [low.maxStars, medium.maxStars, high.maxStars, ultra.maxStars],
    [50, 150, 300, 600],
  );
  assert.deepEqual(
    [low.maxParticles, medium.maxParticles, high.maxParticles, ultra.maxParticles],
    [80, 250, 600, 1200],
  );
});

test("runtime wires preset budgets to canvas and starfield", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  const canvas = read("src/game/EnergySwarmCanvas.tsx");
  const start = read("src/components/StartScreen.tsx");

  assert.match(game, /backgroundRenderer\.resizeStars\(quality\.maxStars\)/);
  assert.match(game, /maxDpr=\{getQualityConfig\(stats\.qualityPreset\)\.maxDPR\}/);
  assert.match(canvas, /maxDpr/);
  assert.match(canvas, /getCanvasBackingStoreSize[\s\S]*maxDpr/);
  assert.match(start, /QualityPreset\.ULTRA/);
});
