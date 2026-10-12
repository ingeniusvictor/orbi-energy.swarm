import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_OVERDRIVE_PRESENTATION_RINGS,
  OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW,
  projectCombatOverdrivePresentation,
} from "../../src/game/combatOverdrivePresentation.ts";
import { QualityPreset } from "../../src/game/types.ts";

const presets = [
  QualityPreset.LOW,
  QualityPreset.MEDIUM,
  QualityPreset.HIGH,
  QualityPreset.ULTRA,
];

test("inactive Overdrive presentation is exactly neutral across every quality preset", () => {
  for (const qualityPreset of presets) {
    assert.deepEqual(
      projectCombatOverdrivePresentation({
        active: false,
        remainingRatio: 1,
        qualityPreset,
      }),
      {
        active: false,
        overlayAlpha: 0,
        swarmHaloAlpha: 0,
        ringCount: 0,
        activationPulse: 0,
      },
    );
  }
});

test("active presentation scales monotonically by quality and stays bounded", () => {
  const projections = presets.map((qualityPreset) =>
    projectCombatOverdrivePresentation({
      active: true,
      remainingRatio: 0.5,
      qualityPreset,
    }),
  );

  for (const projection of projections) {
    assert.equal(projection.active, true);
    assert.ok(projection.overlayAlpha >= 0 && projection.overlayAlpha <= 1);
    assert.ok(projection.swarmHaloAlpha >= 0 && projection.swarmHaloAlpha <= 1);
    assert.ok(projection.activationPulse >= 0 && projection.activationPulse <= 1);
    assert.ok(projection.ringCount >= 0);
    assert.ok(projection.ringCount <= MAX_OVERDRIVE_PRESENTATION_RINGS);
  }

  for (let index = 1; index < projections.length; index += 1) {
    assert.ok(
      projections[index].overlayAlpha >= projections[index - 1].overlayAlpha,
    );
    assert.ok(
      projections[index].swarmHaloAlpha >=
        projections[index - 1].swarmHaloAlpha,
    );
    assert.ok(
      projections[index].ringCount >= projections[index - 1].ringCount,
    );
  }

  assert.equal(
    projections.at(-1)?.ringCount,
    MAX_OVERDRIVE_PRESENTATION_RINGS,
  );
  assert.equal(MAX_OVERDRIVE_PRESENTATION_RINGS, 3);
});

test("activation pulse derives only from the certified remaining ratio", () => {
  const qualityPreset = QualityPreset.HIGH;
  const atActivation = projectCombatOverdrivePresentation({
    active: true,
    remainingRatio: 1,
    qualityPreset,
  });
  const atWindowBoundary = projectCombatOverdrivePresentation({
    active: true,
    remainingRatio: 1 - OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW,
    qualityPreset,
  });
  const midPulse = projectCombatOverdrivePresentation({
    active: true,
    remainingRatio: 1 - OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW / 2,
    qualityPreset,
  });
  const wellAfterActivation = projectCombatOverdrivePresentation({
    active: true,
    remainingRatio: 0.5,
    qualityPreset,
  });

  assert.equal(atActivation.activationPulse, 1);
  assert.equal(atWindowBoundary.activationPulse, 0);
  assert.ok(midPulse.activationPulse > 0 && midPulse.activationPulse < 1);
  assert.equal(wellAfterActivation.activationPulse, 0);
});

test("finite out-of-range ratios are clamped and non-finite ratios fail closed", () => {
  const qualityPreset = QualityPreset.MEDIUM;
  const aboveOne = projectCombatOverdrivePresentation({
    active: true,
    remainingRatio: 99,
    qualityPreset,
  });
  const atOne = projectCombatOverdrivePresentation({
    active: true,
    remainingRatio: 1,
    qualityPreset,
  });
  const belowZero = projectCombatOverdrivePresentation({
    active: true,
    remainingRatio: -99,
    qualityPreset,
  });
  const atZero = projectCombatOverdrivePresentation({
    active: true,
    remainingRatio: 0,
    qualityPreset,
  });

  assert.deepEqual(aboveOne, atOne);
  assert.deepEqual(belowZero, atZero);
  assert.throws(() =>
    projectCombatOverdrivePresentation({
      active: true,
      remainingRatio: Number.NaN,
      qualityPreset,
    }),
  );
  assert.throws(() =>
    projectCombatOverdrivePresentation({
      active: true,
      remainingRatio: Number.POSITIVE_INFINITY,
      qualityPreset,
    }),
  );
});

test("presentation projection never mutates the caller-owned input", () => {
  const input = {
    active: true,
    remainingRatio: 0.98,
    qualityPreset: QualityPreset.ULTRA,
  } as const;
  const snapshot = { ...input };

  projectCombatOverdrivePresentation(input);

  assert.deepEqual(input, snapshot);
});
