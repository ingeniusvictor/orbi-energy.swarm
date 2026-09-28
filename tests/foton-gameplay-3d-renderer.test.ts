import assert from "node:assert/strict";
import test from "node:test";

import {
  FOTON_GAMEPLAY_DRAW_SIZE,
  getFotonGameplay3DRuntimeConfig,
} from "../src/game/fotonGameplay3DRenderer.ts";
import { QualityPreset } from "../src/game/types.ts";

test("gameplay GLB keeps bounded quality-tier cadence", () => {
  assert.deepEqual(
    getFotonGameplay3DRuntimeConfig(
      QualityPreset.LOW,
    ),
    {
      renderSize: 80,
      targetFps: 18,
      maxPixelRatio: 1,
      antialias: false,
    },
  );
  assert.deepEqual(
    getFotonGameplay3DRuntimeConfig(
      QualityPreset.MEDIUM,
    ),
    {
      renderSize: 96,
      targetFps: 24,
      maxPixelRatio: 1,
      antialias: false,
    },
  );
  assert.deepEqual(
    getFotonGameplay3DRuntimeConfig(
      QualityPreset.HIGH,
    ),
    {
      renderSize: 104,
      targetFps: 30,
      maxPixelRatio: 1,
      antialias: true,
    },
  );
  assert.deepEqual(
    getFotonGameplay3DRuntimeConfig(
      QualityPreset.ULTRA,
    ),
    {
      renderSize: 112,
      targetFps: 36,
      maxPixelRatio: 1.25,
      antialias: true,
    },
  );
});

test("gameplay GLB draw footprint is exactly 25 percent smaller than the former 50px footprint", () => {
  assert.equal(FOTON_GAMEPLAY_DRAW_SIZE, 37.5);
  assert.equal(FOTON_GAMEPLAY_DRAW_SIZE / 50, 0.75);
});

test("all quality tiers keep GLB enabled", () => {
  for (const preset of Object.values(
    QualityPreset,
  )) {
    const config =
      getFotonGameplay3DRuntimeConfig(
        preset,
      );
    assert.ok(config.targetFps >= 18);
    assert.ok(config.renderSize >= 80);
  }
});
