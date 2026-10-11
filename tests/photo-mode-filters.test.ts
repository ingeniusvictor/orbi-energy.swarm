import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_PHOTO_FILTER_ID,
  PHOTO_FILTER_ORDER,
  PHOTO_FILTER_PROFILES,
  cyclePhotoFilter,
  getPhotoFilterProfile,
} from "../src/game/photoMode";

test("photo filter canon is stable, unique and bounded", () => {
  assert.deepEqual(PHOTO_FILTER_ORDER, [
    "ORIGINAL",
    "NEON_NOIR",
    "SOLAR_FILM",
    "CYANOTYPE",
    "MONOCHROME",
  ]);
  assert.equal(DEFAULT_PHOTO_FILTER_ID, "ORIGINAL");
  assert.equal(new Set(PHOTO_FILTER_ORDER).size, PHOTO_FILTER_ORDER.length);
  assert.equal(PHOTO_FILTER_PROFILES.length, PHOTO_FILTER_ORDER.length);
});

test("every photo filter profile resolves by its canonical id", () => {
  for (const id of PHOTO_FILTER_ORDER) {
    const profile = getPhotoFilterProfile(id);
    assert.equal(profile.id, id);
    assert.ok(profile.label.length > 0);
    assert.ok(profile.description.length > 0);
  }
});

test("photo filter cycling is deterministic and wraps both directions", () => {
  assert.equal(cyclePhotoFilter("ORIGINAL", 1), "NEON_NOIR");
  assert.equal(cyclePhotoFilter("NEON_NOIR", 1), "SOLAR_FILM");
  assert.equal(cyclePhotoFilter("MONOCHROME", 1), "ORIGINAL");
  assert.equal(cyclePhotoFilter("ORIGINAL", -1), "MONOCHROME");
  assert.equal(cyclePhotoFilter("CYANOTYPE", -1), "SOLAR_FILM");
});
