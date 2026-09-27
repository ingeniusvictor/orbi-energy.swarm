import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const css = read("src/styles/index.css");
const game = read("src/game/EnergySwarmGame.tsx");
const hud = read("src/components/GameHud.tsx");

test("runtime viewport class remains exposed as the HUD composition authority", () => {
  assert.match(
    game,
    /data-viewport-class=\{viewportProfile\.className\}/,
  );
});

test("campaign objective has an explicit named HUD region", () => {
  assert.match(
    hud,
    /className="orbi-hud-objective[^"]*"/,
  );
  assert.match(
    css,
    /\.orbi-hud-objective\s*\{[\s\S]*grid-area:\s*objective/,
  );
});

test("phone runtime profiles use a compact four-row HUD with explicit objective placement", () => {
  assert.match(
    css,
    /data-viewport-class="PHONE_PORTRAIT"[\s\S]*data-viewport-class="PHONE_LANDSCAPE"[\s\S]*grid-template-areas:[\s\S]*"shield wave"[\s\S]*"objective objective"[\s\S]*"swarm score"[\s\S]*"actions actions"/,
  );
});

test("tablet runtime profiles reserve an objective row without displacing action controls", () => {
  assert.match(
    css,
    /data-viewport-class="TABLET_PORTRAIT"[\s\S]*data-viewport-class="TABLET_LANDSCAPE"[\s\S]*grid-template-areas:[\s\S]*"shield wave actions"[\s\S]*"objective objective objective"[\s\S]*"score score swarm"/,
  );
});

test("laptop desktop and ultrawide runtime profiles preserve the five-column primary HUD row", () => {
  assert.match(
    css,
    /data-viewport-class="LAPTOP"[\s\S]*data-viewport-class="DESKTOP"[\s\S]*data-viewport-class="ULTRAWIDE"[\s\S]*"shield wave swarm score actions"[\s\S]*"objective objective objective objective objective"/,
  );
});

test("HUD layouts collapse the objective track when no campaign objective is rendered", () => {
  const matches =
    css.match(/\.orbi-game-hud:not\(:has\(\.orbi-hud-objective\)\)/g) ??
    [];
  assert.ok(matches.length >= 3);
  assert.match(
    css,
    /not\(:has\(\.orbi-hud-objective\)\)[\s\S]*"shield wave"[\s\S]*"swarm score"[\s\S]*"actions actions"/,
  );
  assert.match(
    css,
    /not\(:has\(\.orbi-hud-objective\)\)[\s\S]*"shield wave swarm score actions"/,
  );
});

test("media-query HUD fallbacks remain available for progressive enhancement", () => {
  assert.match(
    css,
    /@media \(min-width:\s*720px\) and \(max-width:\s*1279px\)[\s\S]*\.orbi-game-hud/,
  );
  assert.match(
    css,
    /@media \(min-width:\s*1280px\)[\s\S]*\.orbi-game-hud/,
  );
  assert.match(
    css,
    /@media \(max-width:\s*719px\)[\s\S]*\.orbi-game-hud/,
  );
});
