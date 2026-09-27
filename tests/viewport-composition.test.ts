import assert from "node:assert/strict";
import test from "node:test";

import { classifyViewportComposition } from "../src/game/viewportComposition.ts";

test("1920x1080 resolves as expanded desktop rails", () => {
  const profile = classifyViewportComposition({
    width: 1920,
    height: 1080,
    coarsePointer: false,
    devicePixelRatio: 1,
  });

  assert.equal(profile.className, "DESKTOP");
  assert.equal(profile.orientation, "LANDSCAPE");
  assert.equal(profile.shellDensity, "EXPANDED");
  assert.equal(profile.auxiliaryDeckMode, "RAILS");
  assert.equal(profile.shortLandscape, false);
  assert.equal(profile.touchControlsRecommended, false);
});

test("1440x900 and 1366x768 resolve as laptop composition", () => {
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
  ]) {
    const profile = classifyViewportComposition({
      width,
      height,
      coarsePointer: false,
    });

    assert.equal(profile.className, "LAPTOP");
    assert.equal(profile.auxiliaryDeckMode, "RAILS");
    assert.equal(profile.shellDensity, "BALANCED");
  }
});

test("2560x1080 resolves as ultrawide and preserves expanded shell intent", () => {
  const profile = classifyViewportComposition({
    width: 2560,
    height: 1080,
    coarsePointer: false,
  });

  assert.equal(profile.className, "ULTRAWIDE");
  assert.ok(profile.aspectRatio >= 2);
  assert.equal(profile.shellDensity, "EXPANDED");
  assert.equal(profile.auxiliaryDeckMode, "RAILS");
});

test("tablet landscape and portrait use split auxiliary decks", () => {
  const landscape = classifyViewportComposition({
    width: 1024,
    height: 768,
    coarsePointer: true,
  });
  const portrait = classifyViewportComposition({
    width: 820,
    height: 1180,
    coarsePointer: true,
  });

  assert.equal(
    landscape.className,
    "TABLET_LANDSCAPE",
  );
  assert.equal(
    portrait.className,
    "TABLET_PORTRAIT",
  );
  assert.equal(
    landscape.auxiliaryDeckMode,
    "SPLIT",
  );
  assert.equal(
    portrait.auxiliaryDeckMode,
    "SPLIT",
  );
  assert.equal(
    landscape.touchControlsRecommended,
    true,
  );
  assert.equal(
    portrait.touchControlsRecommended,
    true,
  );
});

test("Android landscape uses phone composition and touch controls", () => {
  const profile = classifyViewportComposition({
    width: 915,
    height: 412,
    coarsePointer: true,
    devicePixelRatio: 3,
  });

  assert.equal(
    profile.className,
    "TABLET_LANDSCAPE",
  );
  assert.equal(
    profile.touchControlsRecommended,
    true,
  );
  assert.equal(profile.shortLandscape, true);
  assert.equal(
    profile.compactTouchLandscape,
    true,
  );
  assert.equal(
    profile.shellDensity,
    "COMPACT",
  );
  assert.equal(
    profile.effectiveDevicePixelRatio,
    2,
  );
});

test("narrow Android portrait recommends landscape advisory", () => {
  const profile = classifyViewportComposition({
    width: 412,
    height: 915,
    coarsePointer: true,
    devicePixelRatio: 2.75,
  });

  assert.equal(
    profile.className,
    "PHONE_PORTRAIT",
  );
  assert.equal(
    profile.auxiliaryDeckMode,
    "STACKED",
  );
  assert.equal(
    profile.landscapeAdvisoryRecommended,
    true,
  );
  assert.equal(
    profile.touchControlsRecommended,
    true,
  );
  assert.equal(profile.shellDensity, "COMPACT");
});

test("compact Android landscape below 720px remains PHONE_LANDSCAPE", () => {
  const profile = classifyViewportComposition({
    width: 667,
    height: 375,
    coarsePointer: true,
  });

  assert.equal(
    profile.className,
    "PHONE_LANDSCAPE",
  );
  assert.equal(
    profile.compactTouchLandscape,
    true,
  );
  assert.equal(
    profile.auxiliaryDeckMode,
    "STACKED",
  );
});

test("portrait advisory stays off for fine pointers and wider tablet portraits", () => {
  assert.equal(
    classifyViewportComposition({
      width: 412,
      height: 915,
      coarsePointer: false,
    }).landscapeAdvisoryRecommended,
    false,
  );

  assert.equal(
    classifyViewportComposition({
      width: 820,
      height: 1180,
      coarsePointer: true,
    }).landscapeAdvisoryRecommended,
    false,
  );
});

test("invalid dimensions fail safe to the logical game viewport", () => {
  const profile = classifyViewportComposition({
    width: Number.NaN,
    height: -1,
    coarsePointer: false,
    devicePixelRatio: Number.POSITIVE_INFINITY,
  });

  assert.equal(profile.width, 800);
  assert.equal(profile.height, 480);
  assert.equal(
    profile.className,
    "TABLET_LANDSCAPE",
  );
  assert.equal(
    profile.effectiveDevicePixelRatio,
    1,
  );
});

test("viewport thresholds align with certified CSS breakpoints", () => {
  assert.equal(
    classifyViewportComposition({
      width: 719,
      height: 800,
      coarsePointer: true,
    }).className,
    "PHONE_PORTRAIT",
  );
  assert.equal(
    classifyViewportComposition({
      width: 720,
      height: 800,
      coarsePointer: true,
    }).className,
    "TABLET_PORTRAIT",
  );
  assert.equal(
    classifyViewportComposition({
      width: 1279,
      height: 800,
      coarsePointer: false,
    }).className,
    "TABLET_LANDSCAPE",
  );
  assert.equal(
    classifyViewportComposition({
      width: 1280,
      height: 800,
      coarsePointer: false,
    }).className,
    "LAPTOP",
  );
  assert.equal(
    classifyViewportComposition({
      width: 1600,
      height: 900,
      coarsePointer: false,
    }).className,
    "DESKTOP",
  );
});
