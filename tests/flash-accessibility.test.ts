import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeFlashIntensityMode,
  projectFlashAccessibility,
} from "../src/game/flashAccessibility.ts";

test("FULL preserves the historical flash profile", () => {
  const profile = projectFlashAccessibility("FULL");

  assert.deepEqual(profile, {
    mode: "FULL",
    screenOverlayOpacity: 1,
    screenOverlayFlickers: true,
    fotonFullFlicker: true,
    friendlyWhiteFlashStrength: 1,
    enemyWhiteFlashStrength: 1,
  });
});

test("REDUCED bounds all high-intensity flash axes", () => {
  const profile = projectFlashAccessibility("REDUCED");

  assert.equal(profile.mode, "REDUCED");
  assert.equal(profile.screenOverlayFlickers, false);
  assert.equal(profile.fotonFullFlicker, false);
  assert.ok(profile.screenOverlayOpacity > 0);
  assert.ok(profile.screenOverlayOpacity <= 0.2);
  assert.ok(profile.friendlyWhiteFlashStrength > 0);
  assert.ok(profile.friendlyWhiteFlashStrength <= 0.2);
  assert.ok(profile.enemyWhiteFlashStrength > 0);
  assert.ok(profile.enemyWhiteFlashStrength <= 0.2);
});

test("malformed flash settings fail safe to REDUCED", () => {
  for (const value of [
    undefined,
    null,
    "",
    "OFF",
    "MAX",
    1,
    {},
    [],
  ]) {
    assert.equal(
      normalizeFlashIntensityMode(value),
      "REDUCED",
    );
    assert.equal(
      projectFlashAccessibility(value).mode,
      "REDUCED",
    );
  }
});
