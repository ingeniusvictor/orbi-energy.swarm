import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("boss HUD is extracted from the game monolith", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  const hud = read("src/components/BossHudOverlay.tsx");

  assert.match(game, /BossHudOverlay/);
  assert.match(game, /bossLabelsMode=\{stats\.bossLabelsMode \|\| "FULL"\}/);
  assert.doesNotMatch(game, /MAJOR COLLAPSE DETECTED/);

  assert.match(hud, /BLACKOUT_DEVOURER_CANON/);
  assert.match(hud, /PHASE \{bossPhase\}/);
  assert.match(hud, /bossShieldNodes/);
  assert.match(hud, /CORE EXPOSED/);
});

test("boss label accessibility modes remain supported", () => {
  const hud = read("src/components/BossHudOverlay.tsx");
  assert.match(hud, /bossLabelsMode !== "OFF"/);
  assert.match(hud, /bossLabelsMode === "FULL"/);
  assert.match(hud, /isImportantBossAttack/);
  assert.match(hud, /singularity_pulse/);
  assert.match(hud, /rotating_eclipse_lanes/);
});

test("small screens compact non-critical boss telemetry first", () => {
  const css = read("src/styles/index.css");
  assert.match(css, /\.orbi-boss-hud/);
  assert.match(css, /\.orbi-boss-kicker,\s*\.orbi-boss-subtitle\s*\{\s*display:\s*none/);
  assert.match(css, /\.orbi-boss-alert--critical/);
  assert.match(css, /orientation:\s*landscape/);
  assert.match(css, /max-height:\s*620px/);
});

test("side decks are bounded on phone and tablet viewports", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  const css = read("src/styles/index.css");

  assert.equal((game.match(/orbi-side-deck-content/g) ?? []).length, 2);
  assert.match(css, /max-height:\s*min\(34dvh, 21rem\)/);
  assert.match(css, /max-height:\s*min\(42dvh, 28rem\)/);
  assert.match(css, /overscroll-behavior:\s*contain/);
});
