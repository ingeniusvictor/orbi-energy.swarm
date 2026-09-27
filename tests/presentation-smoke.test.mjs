import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("premium entry shell is wired without replacing the start-screen flow", () => {
  const screen = read("src/components/StartScreen.tsx");
  assert.match(screen, /PremiumBackdrop/);
  assert.match(screen, /orbi-premium-entry/);
  assert.match(screen, /orbi-premium-panel/);
  assert.match(screen, /orbi-premium-title/);
  assert.match(screen, /orbi-premium-cta/);
  assert.match(screen, /activeTab/);
  assert.match(screen, /onStartGame/);
});

test("premium presentation honors reduced-motion preferences", () => {
  const css = read("src/styles/index.css");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /orbi-premium-backdrop/);
  assert.match(css, /orbi-premium-grid/);
  assert.match(css, /orbi-premium-starfield/);
});
