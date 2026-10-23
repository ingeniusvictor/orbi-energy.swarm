import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("mobile movement controls live in a dedicated overlay component", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  const overlay = read("src/components/MobileTouchOverlay.tsx");

  assert.match(game, /MobileTouchOverlay/);
  assert.match(game, /onVectorChange=\{setMobileAnalogVector\}/);
  assert.doesNotMatch(game, /moveMobileDPad/);
  assert.doesNotMatch(game, /MOBILE NAVIGATION BUTTONPAD ASSIST/);

  for (const exit of ["onPointerCancel={finish}", "onLostPointerCapture={finish}", "setPointerCapture(event.pointerId)"]) {
    assert.ok(overlay.includes(exit), exit);
  }
});

test("touch controls meet thumb-zone and safe-area layout requirements", () => {
  const css = read("src/styles/index.css") + read("src/styles/analogJoystick.css");
  assert.match(css, /orbi-touch-overlay/);
  assert.match(css, /orbi-analog-joystick/);
  assert.match(css, /env\(safe-area-inset-left\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /width:\s*48px/);
  assert.match(css, /height:\s*48px/);
  assert.match(css, /pointer:\s*coarse/);
  assert.match(css, /-webkit-tap-highlight-color:\s*transparent/);
});
