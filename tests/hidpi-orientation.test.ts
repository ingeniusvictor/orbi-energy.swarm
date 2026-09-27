import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  MAX_CANVAS_DPR,
  getCanvasBackingStoreSize,
  normalizeCanvasDpr,
} from "../src/game/canvasResolution.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("canvas DPR normalization preserves quality without unbounded pixel cost", () => {
  assert.equal(MAX_CANVAS_DPR, 2);
  assert.equal(normalizeCanvasDpr(undefined), 1);
  assert.equal(normalizeCanvasDpr(0), 1);
  assert.equal(normalizeCanvasDpr(1), 1);
  assert.equal(normalizeCanvasDpr(1.5), 1.5);
  assert.equal(normalizeCanvasDpr(3), 2);
});

test("backing store scales independently from the logical 800x480 game space", () => {
  assert.deepEqual(getCanvasBackingStoreSize(800, 480, 1), {
    dpr: 1,
    width: 800,
    height: 480,
  });
  assert.deepEqual(getCanvasBackingStoreSize(800, 480, 2), {
    dpr: 2,
    width: 1600,
    height: 960,
  });
});

test("render loop resets context transform from physical pixels to logical coordinates", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  assert.match(game, /canvas\.width \/ CANVAS_WIDTH/);
  assert.match(game, /canvas\.height \/ CANVAS_HEIGHT/);
  assert.match(game, /ctx\.setTransform\(backingScaleX, 0, 0, backingScaleY, 0, 0\)/);
});

test("canvas component synchronizes backing store on viewport changes", () => {
  const canvas = read("src/game/EnergySwarmCanvas.tsx");
  assert.match(canvas, /window\.devicePixelRatio/);
  assert.match(canvas, /visualViewport/);
  assert.match(canvas, /dataset\.pixelRatio/);
  assert.match(canvas, /getCanvasBackingStoreSize/);
});

test("portrait guidance is advisory, dismissible and coarse-pointer scoped", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  const component = read("src/components/OrientationHint.tsx");
  const css = read("src/styles/index.css");

  assert.match(game, /<OrientationHint \/>/);
  assert.match(component, /setDismissed\(true\)/);
  assert.match(component, /Best in landscape/);
  assert.match(component, /Mejor en horizontal/);
  assert.match(css, /orientation:\s*portrait/);
  assert.match(css, /pointer:\s*coarse/);
  assert.match(css, /env\(safe-area-inset-right\)/);
});
