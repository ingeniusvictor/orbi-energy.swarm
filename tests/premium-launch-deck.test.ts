import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const start = read("src/components/StartScreen.tsx");
const css = read("src/styles/index.css");
const game = read("src/game/EnergySwarmGame.tsx");

test("start shell uses wide premium launch composition", () => {
  assert.match(
    start,
    /max-w-\[1500px\]/,
  );
  assert.match(
    start,
    /xl:grid-cols-\[0\.9fr_1\.25fr_0\.95fr\]/,
  );
  assert.match(start, /orbi-start-record/);
  assert.match(start, /orbi-start-hero/);
  assert.match(start, /orbi-start-launch/);
});

test("launch control renders before dense record/hero content on narrow viewports", () => {
  const launchIndex = start.indexOf(
    'className="orbi-start-launch order-1',
  );
  const recordIndex = start.indexOf(
    'className="orbi-start-record order-2',
  );
  const heroIndex = start.indexOf(
    'className="orbi-start-hero order-3',
  );

  assert.ok(launchIndex >= 0);
  assert.ok(recordIndex >= 0);
  assert.ok(heroIndex >= 0);
});

test("primary start CTA is explicit and placed inside launch control", () => {
  const launchStart = start.indexOf(
    'className="orbi-start-launch',
  );
  const cta = start.indexOf(
    'data-primary-start-cta="true"',
  );
  const launchEnd = start.indexOf(
    "</aside>",
    launchStart,
  );

  assert.ok(launchStart >= 0);
  assert.ok(cta > launchStart);
  assert.ok(launchEnd > cta);
  assert.match(
    start.slice(cta, launchEnd),
    /onStartGame\(\)/,
  );
});

test("Enter remains a documented keyboard fallback rather than primary-only launch path", () => {
  assert.match(start, />ENTER</);
  assert.match(
    start,
    /KEYBOARD SHORTCUT|ATAJO DE TECLADO/,
  );
  assert.match(game, /if \(e\.key === "Enter"\)[\s\S]*startGame\(\)/);
});

test("launch deck has a visible scroll affordance for genuinely short viewports", () => {
  assert.match(
    start,
    /orbi-start-deck[\s\S]*overflow-y-auto/,
  );
  assert.doesNotMatch(
    start,
    /orbi-start-deck[^"]*max-h-\[74vh\]/,
  );
  assert.match(
    css,
    /\.orbi-start-deck \{[\s\S]*max-height:\s*min\(78dvh, calc\(100dvh - 11\.5rem\)\)/,
  );
  assert.match(
    css,
    /scrollbar-width: thin/,
  );
  assert.match(
    css,
    /\.orbi-start-deck::-webkit-scrollbar-thumb/,
  );
});

test("new launch hero reserves a stable stage for future 3D Foton integration", () => {
  assert.match(start, /orbi-start-hero-stage/);
  assert.match(start, /orbi-start-core/);
  assert.match(start, /FOTON \/\/ COMMAND CORE/);
});

test("persistent progression surfaces remain available", () => {
  assert.match(start, /INFINITE SWARM/);
  assert.match(start, /RecentRunArchivePanel/);
  assert.match(start, /CampaignArc/);
});

test("visible product version matches canonical beta metadata", () => {
  assert.match(start, /PUBLIC BETA v0\.2\.0-beta\.1/);
  assert.match(
    game,
    /ORBI ENERGY SWARM &bull; v0\.2\.0-beta\.1/,
  );
  assert.doesNotMatch(
    start + game,
    /v0\.2\.6b-bilingual-localization/,
  );
});
