import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const css = read("src/styles/index.css");
const start = read("src/components/StartScreen.tsx");
const result = read("src/components/ResultScreen.tsx");
const game = read("src/game/EnergySwarmGame.tsx");

const es10bStart = css.indexOf(
  "/* ES-10B — Keyboard focus visibility.",
);
const es03bStart = css.indexOf(
  "/* ES-03B — Responsive gameplay workspace */",
);
assert.ok(es10bStart >= 0);
assert.ok(es03bStart > es10bStart);
const es10b = css.slice(es10bStart, es03bStart);

test("generic keyboard focus contract covers premium entry and live game shell", () => {
  assert.match(
    es10b,
    /\.orbi-premium-entry[\s\S]*:is\(button, a\[href\], \[role="button"\], input, select, textarea\):focus-visible/,
  );
  assert.match(
    es10b,
    /\.orbi-game-root[\s\S]*:is\(button, a\[href\], \[role="button"\], input, select, textarea\):focus-visible/,
  );
});

test("focus ring uses visible outline plus dark separation ring", () => {
  assert.match(
    es10b,
    /outline: 2px solid rgba\(103, 232, 249, 0\.96\)/,
  );
  assert.match(
    es10b,
    /outline-offset: 3px/,
  );
  assert.match(
    es10b,
    /0 0 0 2px rgba\(2, 6, 23, 0\.96\)/,
  );
  assert.match(
    es10b,
    /0 0 0 5px rgba\(103, 232, 249, 0\.2\)/,
  );
});

test("higher contrast preference strengthens the focus indicator", () => {
  assert.match(
    es10b,
    /@media \(prefers-contrast: more\)/,
  );
  assert.match(es10b, /outline-width: 3px/);
  assert.match(es10b, /outline-color: #a5f3fc/);
  assert.match(
    es10b,
    /box-shadow: 0 0 0 3px #020617/,
  );
});

test("ES-10B never suppresses focus outlines", () => {
  assert.doesNotMatch(
    es10b,
    /outline:\s*(?:none|0)(?:;|\s*!important)/,
  );
});

test("generic focus contract precedes component-specific touch and orientation rules", () => {
  const touchButtonFocus = css.indexOf(
    ".orbi-touch-button:focus-visible",
  );
  const formationFocus = css.indexOf(
    ".orbi-touch-formation-button:focus-visible",
  );
  const orientationFocus = css.indexOf(
    ".orbi-orientation-hint button:focus-visible",
  );

  assert.ok(touchButtonFocus > es03bStart);
  assert.ok(formationFocus > es03bStart);
  assert.ok(orientationFocus > es03bStart);
  assert.ok(touchButtonFocus > es10bStart);
  assert.ok(formationFocus > es10bStart);
  assert.ok(orientationFocus > es10bStart);
});

test("primary shell surfaces contain native keyboard-focusable controls", () => {
  assert.match(start, /<button/);
  assert.match(result, /<button/);
  assert.match(game, /<button/);
});

test("focus styling is presentation-only", () => {
  assert.doesNotMatch(
    es10b,
    /(?:^|\n)\s*(?:display|position|width|height|transform|animation|pointer-events)\s*:/,
  );
});
