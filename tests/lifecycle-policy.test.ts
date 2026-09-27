import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  shouldPauseForLifecycle,
  shouldResetFrameClock,
  type LifecyclePauseContext,
  type LifecycleSignal,
} from "../src/game/lifecyclePolicy.ts";

const activeRun: LifecyclePauseContext = {
  isPlaying: true,
  isPaused: false,
  isGameOver: false,
  isModalSuspended: false,
};

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("active runs auto-pause only on focus-loss/background signals", () => {
  assert.equal(shouldPauseForLifecycle(activeRun, "WINDOW_BLUR"), true);
  assert.equal(shouldPauseForLifecycle(activeRun, "DOCUMENT_HIDDEN"), true);

  for (const signal of [
    "WINDOW_FOCUS",
    "DOCUMENT_VISIBLE",
    "ORIENTATION_CHANGE",
  ] satisfies LifecycleSignal[]) {
    assert.equal(shouldPauseForLifecycle(activeRun, signal), false);
  }
});

test("lifecycle never stacks pause over already suspended states", () => {
  assert.equal(
    shouldPauseForLifecycle({ ...activeRun, isPaused: true }, "WINDOW_BLUR"),
    false,
  );
  assert.equal(
    shouldPauseForLifecycle(
      { ...activeRun, isModalSuspended: true },
      "DOCUMENT_HIDDEN",
    ),
    false,
  );
  assert.equal(
    shouldPauseForLifecycle({ ...activeRun, isGameOver: true }, "WINDOW_BLUR"),
    false,
  );
  assert.equal(
    shouldPauseForLifecycle({ ...activeRun, isPlaying: false }, "WINDOW_BLUR"),
    false,
  );
});

test("every lifecycle boundary resets the frame clock", () => {
  for (const signal of [
    "WINDOW_BLUR",
    "DOCUMENT_HIDDEN",
    "WINDOW_FOCUS",
    "DOCUMENT_VISIBLE",
    "ORIENTATION_CHANGE",
  ] satisfies LifecycleSignal[]) {
    assert.equal(shouldResetFrameClock(signal), true);
  }
});

test("runtime uses synchronous pause state inside requestAnimationFrame", () => {
  const game = read("src/game/EnergySwarmGame.tsx");

  assert.match(game, /const isPausedRef = useRef\(false\)/);
  assert.match(game, /if \(isPausedRef\.current \|\| isUpgradeSelectionOpenRef\.current\)/);
  assert.match(game, /if \(isPausedRef\.current\) \{\s*playUnpauseSound\(\)/);
  assert.match(game, /setPausedState\(true\);\s*stopBgm\(\)/);
});

test("focus, visibility and orientation lifecycle listeners are explicit", () => {
  const game = read("src/game/EnergySwarmGame.tsx");

  assert.match(game, /window\.addEventListener\("blur", handleWindowBlur\)/);
  assert.match(game, /window\.addEventListener\("focus", handleWindowFocus\)/);
  assert.match(game, /document\.addEventListener\("visibilitychange", handleVisibilityChange\)/);
  assert.match(game, /screen\.orientation\?\.addEventListener\("change", handleOrientationChange\)/);
  assert.match(game, /keysPressedRef\.current = \{\}/);
  assert.match(game, /clickToMoveTargetRef\.current = null/);
});
