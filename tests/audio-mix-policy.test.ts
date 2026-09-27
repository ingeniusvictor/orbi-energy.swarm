import assert from "node:assert/strict";
import test from "node:test";

import {
  extendTacticalPriorityWindow,
  getAudioMixMultiplier,
  projectAudioMixProfile,
} from "../src/game/audioMixPolicy.ts";

test("idle audio mix preserves historical gain on every lane", () => {
  assert.deepEqual(
    projectAudioMixProfile(false),
    {
      bgmGainMultiplier: 1,
      standardSfxGainMultiplier: 1,
      tacticalGainMultiplier: 1,
    },
  );

  for (const lane of [
    "BGM",
    "STANDARD",
    "TACTICAL",
  ] as const) {
    assert.equal(
      getAudioMixMultiplier(lane, false),
      1,
    );
  }
});

test("tactical mix ducks only BGM and standard SFX", () => {
  const profile = projectAudioMixProfile(true);

  assert.equal(profile.bgmGainMultiplier, 0.35);
  assert.equal(
    profile.standardSfxGainMultiplier,
    0.55,
  );
  assert.equal(profile.tacticalGainMultiplier, 1);

  assert.equal(
    getAudioMixMultiplier("BGM", true),
    0.35,
  );
  assert.equal(
    getAudioMixMultiplier("STANDARD", true),
    0.55,
  );
  assert.equal(
    getAudioMixMultiplier("TACTICAL", true),
    1,
  );
});

test("audio mix contract never boosts a lane above historical gain", () => {
  for (const active of [false, true]) {
    for (const lane of [
      "BGM",
      "STANDARD",
      "TACTICAL",
    ] as const) {
      const multiplier =
        getAudioMixMultiplier(lane, active);
      assert.ok(multiplier > 0);
      assert.ok(multiplier <= 1);
    }
  }
});

test("overlapping tactical windows extend but never shorten priority", () => {
  const first =
    extendTacticalPriorityWindow(10, 0, 1.5);
  assert.equal(first, 11.5);

  const shorterOverlap =
    extendTacticalPriorityWindow(
      10.5,
      first,
      0.4,
    );
  assert.equal(shorterOverlap, 11.5);

  const longerOverlap =
    extendTacticalPriorityWindow(
      11,
      shorterOverlap,
      1.0,
    );
  assert.equal(longerOverlap, 12);
});

test("priority window projection sanitizes malformed timing inputs", () => {
  assert.equal(
    extendTacticalPriorityWindow(
      Number.NaN,
      Number.NaN,
      Number.NaN,
    ),
    0,
  );
  assert.equal(
    extendTacticalPriorityWindow(
      5,
      8,
      -20,
    ),
    8,
  );
});
