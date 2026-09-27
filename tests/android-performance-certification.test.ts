import assert from "node:assert/strict";
import test from "node:test";

import {
  PERFORMANCE_CERTIFICATION_DEVICES,
  PERFORMANCE_CERTIFICATION_MAX_CANVAS_DPR,
  PERFORMANCE_CERTIFICATION_PRESETS,
  buildPerformanceCertificationMatrix,
  projectPerformanceCertificationCase,
} from "../src/game/performanceCertification.ts";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../src/game/constants.ts";
import { getQualityConfig } from "../src/game/quality.ts";
import { QualityPreset } from "../src/game/types.ts";

test("certification matrix covers eight representative device/orientation classes", () => {
  assert.equal(PERFORMANCE_CERTIFICATION_DEVICES.length, 8);
  assert.deepEqual(
    PERFORMANCE_CERTIFICATION_DEVICES.map((entry) => entry.id),
    [
      "android-compact-landscape",
      "android-modern-landscape",
      "android-narrow-portrait",
      "tablet-landscape",
      "tablet-portrait",
      "laptop-16-10",
      "desktop-16-9",
      "ultrawide",
    ],
  );
});

test("certification matrix crosses every device with every quality preset", () => {
  const matrix = buildPerformanceCertificationMatrix();
  assert.equal(
    matrix.length,
    PERFORMANCE_CERTIFICATION_DEVICES.length *
      PERFORMANCE_CERTIFICATION_PRESETS.length,
  );

  for (const device of PERFORMANCE_CERTIFICATION_DEVICES) {
    const rows = matrix.filter(
      (row) => row.device.id === device.id,
    );
    assert.deepEqual(
      rows.map((row) => row.preset),
      [
        QualityPreset.LOW,
        QualityPreset.MEDIUM,
        QualityPreset.HIGH,
        QualityPreset.ULTRA,
      ],
    );
  }
});

test("every representative viewport resolves to its expected composition contract", () => {
  for (const device of PERFORMANCE_CERTIFICATION_DEVICES) {
    const row = projectPerformanceCertificationCase(
      device,
      QualityPreset.MEDIUM,
    );

    assert.equal(row.viewportClass, device.expectedClass);
    assert.equal(row.orientation, device.expectedOrientation);
    assert.equal(
      row.auxiliaryDeckMode,
      device.expectedDeckMode,
    );
    assert.equal(
      row.touchControlsRecommended,
      device.expectedTouchControls,
    );
    assert.equal(
      row.landscapeAdvisoryRecommended,
      device.expectedLandscapeAdvisory,
    );
  }
});

test("UI DPR never exceeds the global 2x composition ceiling", () => {
  for (const device of PERFORMANCE_CERTIFICATION_DEVICES) {
    const row = projectPerformanceCertificationCase(
      device,
      QualityPreset.ULTRA,
    );

    assert.ok(row.effectiveUiDpr >= 1);
    assert.ok(
      row.effectiveUiDpr <=
        PERFORMANCE_CERTIFICATION_MAX_CANVAS_DPR,
    );
  }
});

test("canvas DPR never exceeds either the selected preset cap or global 2x cap", () => {
  const matrix = buildPerformanceCertificationMatrix();

  for (const row of matrix) {
    assert.ok(row.canvasDpr >= 1);
    assert.ok(row.canvasDpr <= row.presetMaxDpr);
    assert.ok(
      row.canvasDpr <=
        PERFORMANCE_CERTIFICATION_MAX_CANVAS_DPR,
    );
  }
});

test("backing store always derives from canonical 800x480 logical space", () => {
  const matrix = buildPerformanceCertificationMatrix();

  for (const row of matrix) {
    assert.equal(
      row.backingWidth,
      Math.round(CANVAS_WIDTH * row.canvasDpr),
    );
    assert.equal(
      row.backingHeight,
      Math.round(CANVAS_HEIGHT * row.canvasDpr),
    );
    assert.equal(
      row.backingPixelCount,
      row.backingWidth * row.backingHeight,
    );
  }
});

test("LOW remains one-DPR even on high-density Android displays", () => {
  for (const device of PERFORMANCE_CERTIFICATION_DEVICES.filter(
    (entry) => entry.coarsePointer,
  )) {
    const row = projectPerformanceCertificationCase(
      device,
      QualityPreset.LOW,
    );
    assert.equal(row.canvasDpr, 1);
    assert.equal(row.backingWidth, 800);
    assert.equal(row.backingHeight, 480);
  }
});

test("MEDIUM caps high-DPR Android backing store at 1.5x", () => {
  for (const device of PERFORMANCE_CERTIFICATION_DEVICES.filter(
    (entry) =>
      entry.coarsePointer &&
      entry.devicePixelRatio >= 1.5,
  )) {
    const row = projectPerformanceCertificationCase(
      device,
      QualityPreset.MEDIUM,
    );
    assert.equal(row.canvasDpr, 1.5);
    assert.equal(row.backingWidth, 1200);
    assert.equal(row.backingHeight, 720);
  }
});

test("HIGH and ULTRA share the 2x DPR ceiling but retain distinct VFX budgets", () => {
  const android =
    PERFORMANCE_CERTIFICATION_DEVICES.find(
      (entry) => entry.id === "android-modern-landscape",
    );
  assert.ok(android);

  const high = projectPerformanceCertificationCase(
    android,
    QualityPreset.HIGH,
  );
  const ultra = projectPerformanceCertificationCase(
    android,
    QualityPreset.ULTRA,
  );

  assert.equal(high.canvasDpr, 2);
  assert.equal(ultra.canvasDpr, 2);
  assert.equal(high.backingWidth, 1600);
  assert.equal(ultra.backingWidth, 1600);
  assert.ok(ultra.maxParticles > high.maxParticles);
  assert.ok(ultra.maxStars > high.maxStars);
});

test("projected quality flags exactly mirror canonical quality config", () => {
  const matrix = buildPerformanceCertificationMatrix();

  for (const row of matrix) {
    const quality = getQualityConfig(row.preset);
    assert.equal(row.maxParticles, quality.maxParticles);
    assert.equal(row.maxStars, quality.maxStars);
    assert.equal(row.drawNebula, quality.drawNebula);
    assert.equal(row.drawPlanets, quality.drawPlanets);
    assert.equal(row.presetMaxDpr, quality.maxDPR);
  }
});

test("only narrow coarse-pointer phone portrait requests landscape advisory", () => {
  const advisoryRows = PERFORMANCE_CERTIFICATION_DEVICES.filter(
    (device) =>
      projectPerformanceCertificationCase(
        device,
        QualityPreset.LOW,
      ).landscapeAdvisoryRecommended,
  );

  assert.deepEqual(
    advisoryRows.map((entry) => entry.id),
    ["android-narrow-portrait"],
  );
});
