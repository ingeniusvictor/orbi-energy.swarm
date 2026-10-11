import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { QualityPreset } from "../src/game/types.ts";
import { getQualityConfig } from "../src/game/quality.ts";

const eventModule = readFileSync(
  new URL("../src/game/cosmicWhaleEvent.ts", import.meta.url),
  "utf8",
);
const background = readFileSync(
  new URL("../src/game/backgroundRenderer.ts", import.meta.url),
  "utf8",
);
const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const types = readFileSync(
  new URL("../src/game/types.ts", import.meta.url),
  "utf8",
);

test("Cosmic Whale quality gate is disabled only on LOW", () => {
  assert.equal(getQualityConfig(QualityPreset.LOW).drawCosmicWhale, false);
  assert.equal(getQualityConfig(QualityPreset.MEDIUM).drawCosmicWhale, true);
  assert.equal(getQualityConfig(QualityPreset.HIGH).drawCosmicWhale, true);
  assert.equal(getQualityConfig(QualityPreset.ULTRA).drawCosmicWhale, true);
});

test("runtime enables Whale only for Infinite quality-eligible presentation", () => {
  assert.match(
    game,
    /quality\.drawCosmicWhale\s*&&\s*runtimeProgressionRef\.current\.mode === "INFINITE"/s,
  );
  assert.match(background, /drawCosmicWhale\s*&&\s*!bossActive/);
  assert.match(background, /projectCosmicWhaleEvent/);
  assert.match(background, /drawCosmicWhaleLayer/);
});

test("Whale stays a passive background projection with no gameplay entity or scheduler", () => {
  assert.doesNotMatch(types, /EnemyType\.WHALE|WHALE\s*=/);
  assert.doesNotMatch(game, /whaleRef|cosmicWhaleRef/i);
  assert.doesNotMatch(eventModule, /Math\.random|setInterval|setTimeout/);
  assert.doesNotMatch(background, /Math\.random\([^)]*whale/i);
  assert.doesNotMatch(background, /WebGLRenderer|THREE\./);
});

test("Whale renderer is bounded Canvas2D presentation", () => {
  assert.match(background, /createRadialGradient/);
  assert.match(background, /bezierCurveTo/);
  assert.match(background, /ellipse/);
  assert.doesNotMatch(background, /enemiesRef|projectilesRef|resourcesRef/);
});
