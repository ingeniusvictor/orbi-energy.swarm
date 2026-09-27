import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createTouchDirectionState,
  getTouchMovementVector,
  hasActiveTouchDirection,
} from "../src/game/touchControls.ts";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("touch direction state starts neutral", () => {
  const state = createTouchDirectionState();
  assert.deepEqual(state, {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  });
  assert.deepEqual(getTouchMovementVector(state), { x: 0, y: 0 });
  assert.equal(hasActiveTouchDirection(state), false);
});

test("multi-touch directions compose into cardinal and diagonal vectors", () => {
  const state = createTouchDirectionState();
  state.UP = true;
  assert.deepEqual(getTouchMovementVector(state), { x: 0, y: -1 });

  state.RIGHT = true;
  assert.deepEqual(getTouchMovementVector(state), { x: 1, y: -1 });
  assert.equal(hasActiveTouchDirection(state), true);

  state.UP = false;
  state.RIGHT = false;
  assert.deepEqual(getTouchMovementVector(state), { x: 0, y: 0 });
});

test("opposite held directions cancel deterministically", () => {
  const state = createTouchDirectionState();
  state.LEFT = true;
  state.RIGHT = true;
  state.UP = true;
  state.DOWN = true;

  assert.deepEqual(getTouchMovementVector(state), { x: 0, y: 0 });
  assert.equal(hasActiveTouchDirection(state), false);
});

test("touch overlay uses pointer capture and explicit press/release signals", () => {
  const overlay = read("src/components/MobileTouchOverlay.tsx");

  assert.match(overlay, /setPointerCapture\(event\.pointerId\)/);
  assert.match(overlay, /onDirectionChange\(direction, true\)/);
  assert.match(overlay, /onDirectionChange\(direction, false\)/);
  assert.match(overlay, /onPointerUp/);
  assert.match(overlay, /onPointerCancel/);
  assert.match(overlay, /onLostPointerCapture/);
  assert.match(overlay, /onKeyUp/);
});

test("touch movement is delta-driven inside the canonical movement pipeline", () => {
  const game = read("src/game/EnergySwarmGame.tsx");

  assert.match(game, /getTouchMovementVector\(touchDirectionsRef\.current\)/);
  assert.match(game, /lastInputTypeRef\.current = "TOUCH_PAD"/);
  assert.match(game, /lastInputTypeRef\.current === "KEYBOARD" \|\| lastInputTypeRef\.current === "TOUCH_PAD"/);
  assert.match(game, /\(moveX \/ len\) \* pSpeed \* \(delta \/ 16\.6\)/);
  assert.doesNotMatch(game, /PLAYER_BASE_SPEED \* 8/);
});

test("lifecycle cleanup releases all held touch directions", () => {
  const game = read("src/game/EnergySwarmGame.tsx");

  assert.match(game, /touchDirectionsRef\.current = createTouchDirectionState\(\)/);
  assert.match(game, /if \(nextPaused\) \{\s*touchDirectionsRef\.current = createTouchDirectionState\(\)/);
  assert.match(game, /onDirectionChange=\{setMobileTouchDirection\}/);
});
