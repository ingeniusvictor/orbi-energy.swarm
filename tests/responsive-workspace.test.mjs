import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("workspace gives the battlefield first-class responsive placement", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  assert.match(game, /orbi-game-workspace/);
  assert.match(game, /orbi-tactical-rail/);
  assert.match(game, /orbi-battlefield/);
  assert.match(game, /orbi-logistics-deck/);
});

test("responsive CSS defines mobile, tablet and desktop workspace compositions", () => {
  const css = read("src/styles/index.css");
  assert.match(css, /grid-template-areas:\s*"battlefield"\s*"tactical"\s*"logistics"/);
  assert.match(css, /min-width:\s*720px/);
  assert.match(css, /min-width:\s*1280px/);
  assert.match(css, /"tactical battlefield logistics"/);
  assert.match(css, /env\(safe-area-inset-top\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
});

test("HUD is allowed to reflow instead of remaining a fixed 42px row", () => {
  const hud = read("src/components/GameHud.tsx");
  const css = read("src/styles/index.css");
  assert.match(hud, /orbi-game-hud/);
  assert.doesNotMatch(hud, /h-\[42px\]/);
  assert.match(css, /grid-template-areas:[\s\S]*"shield wave"/);
  assert.match(css, /orbi-hud-actions/);
});

test("game stage no longer subtracts fixed pixels from 100vh", () => {
  const canvas = read("src/game/EnergySwarmCanvas.tsx");
  assert.match(canvas, /orbi-game-stage/);
  assert.doesNotMatch(canvas, /max-h-\[calc\(100vh-/);
});
