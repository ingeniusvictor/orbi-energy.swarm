import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

test("viewport hook resolves exclusively through the certified composition classifier", () => {
  const hook = read(
    "src/components/useViewportComposition.ts",
  );

  assert.match(
    hook,
    /classifyViewportComposition/,
  );
  assert.match(hook, /window\.visualViewport/);
  assert.match(hook, /window\.innerWidth/);
  assert.match(hook, /window\.innerHeight/);
  assert.match(hook, /window\.devicePixelRatio/);
  assert.match(
    hook,
    /matchMedia\("\(pointer: coarse\)"\)/,
  );
});

test("viewport hook reacts to browser, visual viewport, orientation and pointer changes", () => {
  const hook = read(
    "src/components/useViewportComposition.ts",
  );

  assert.match(
    hook,
    /window\.addEventListener\("resize", refresh\)/,
  );
  assert.match(
    hook,
    /visualViewport\?\.addEventListener\([\s\S]*"resize"/,
  );
  assert.match(
    hook,
    /screen\.orientation\?\.addEventListener\([\s\S]*"change"/,
  );
  assert.match(
    hook,
    /coarsePointerQuery\?\.addEventListener\?\.\([\s\S]*"change"/,
  );
});

test("game root exposes the runtime composition as semantic data attributes", () => {
  const game = read(
    "src/game/EnergySwarmGame.tsx",
  );

  assert.match(
    game,
    /const viewportProfile = useViewportComposition\(\)/,
  );
  assert.match(
    game,
    /data-viewport-class=\{viewportProfile\.className\}/,
  );
  assert.match(
    game,
    /data-viewport-orientation=\{viewportProfile\.orientation\}/,
  );
  assert.match(
    game,
    /data-shell-density=\{viewportProfile\.shellDensity\}/,
  );
  assert.match(
    game,
    /data-auxiliary-decks=\{viewportProfile\.auxiliaryDeckMode\}/,
  );
  assert.match(
    game,
    /viewportProfile\.touchControlsRecommended/,
  );
  assert.match(
    game,
    /viewportProfile\.shortLandscape/,
  );
});

test("portrait advisory is explicitly gated by the runtime profile", () => {
  const game = read(
    "src/game/EnergySwarmGame.tsx",
  );
  const hint = read(
    "src/components/OrientationHint.tsx",
  );

  assert.match(
    game,
    /enabled=\{[\s\S]*viewportProfile\.landscapeAdvisoryRecommended/,
  );
  assert.match(
    hint,
    /enabled\?: boolean/,
  );
  assert.match(
    hint,
    /if \(!enabled \|\| dismissed\) return null/,
  );
});

test("runtime touch intent augments rather than replaces CSS fallbacks", () => {
  const css = read("src/styles/index.css");

  assert.match(
    css,
    /data-touch-controls="recommended"[\s\S]*\.orbi-touch-overlay[\s\S]*display:\s*block/,
  );
  assert.match(
    css,
    /data-touch-controls="recommended"[\s\S]*\.orbi-touch-formation-carousel[\s\S]*display:\s*grid/,
  );

  // Existing no-JS / coarse-pointer fallback remains certified.
  assert.match(
    css,
    /@media \(max-width:\s*719px\)[\s\S]*\.orbi-touch-overlay/,
  );
  assert.match(
    css,
    /@media \(pointer:\s*coarse\) and \(max-width:\s*1279px\)[\s\S]*\.orbi-touch-overlay/,
  );
});

test("runtime profile adoption does not alter logical canvas or movement physics", () => {
  const game = read(
    "src/game/EnergySwarmGame.tsx",
  );
  const canvas = read(
    "src/game/EnergySwarmCanvas.tsx",
  );

  assert.match(
    canvas,
    /CANVAS_WIDTH/,
  );
  assert.match(
    canvas,
    /CANVAS_HEIGHT/,
  );
  assert.match(
    game,
    /PLAYER_BASE_SPEED/,
  );
  assert.doesNotMatch(
    game,
    /viewportProfile\.[\s\S]{0,120}PLAYER_BASE_SPEED/,
  );
});
