import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  FORMATION_CYCLE_ORDER,
  cycleFormation,
} from "../src/game/formationCycle.ts";
import { FormationType } from "../src/game/types.ts";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("touch carousel preserves all six canonical formation identities", () => {
  assert.deepEqual(FORMATION_CYCLE_ORDER, [
    FormationType.LINE,
    FormationType.CIRCLE,
    FormationType.DELTA,
    FormationType.SHIELD,
    FormationType.V_SHAPE,
    FormationType.SCATTERED,
  ]);
  assert.equal(new Set(FORMATION_CYCLE_ORDER).size, 6);
});

test("formation cycling wraps in both directions", () => {
  assert.equal(
    cycleFormation(FormationType.LINE, -1),
    FormationType.SCATTERED,
  );
  assert.equal(
    cycleFormation(FormationType.SCATTERED, 1),
    FormationType.LINE,
  );
  assert.equal(
    cycleFormation(FormationType.CIRCLE, 1),
    FormationType.DELTA,
  );
});

test("mobile formation controls reuse the canonical formation-change path", () => {
  const game = read("src/game/EnergySwarmGame.tsx");
  const component = read("src/components/MobileFormationCarousel.tsx");

  assert.match(game, /<MobileFormationCarousel/);
  assert.match(game, /onChangeFormation=\{triggerFormationChange\}/);
  assert.match(
    game,
    /disabled=\{isPaused \|\| isGameOver \|\| isUpgradeSelectionOpen\}/,
  );
  assert.match(component, /cycleFormation\(activeFormation, direction\)/);
});

test("right-thumb carousel is safe-area aware and coarse-pointer scoped", () => {
  const css = read("src/styles/index.css");

  assert.match(css, /orbi-touch-formation-carousel/);
  assert.match(css, /env\(safe-area-inset-right\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /pointer:\s*coarse/);
  assert.match(css, /width:\s*48px/);
});

test("portrait orientation guidance clears the formation control footprint", () => {
  const css = read("src/styles/index.css");
  assert.match(
    css,
    /\.orbi-orientation-hint\s*\{\s*bottom:\s*max\(6\.7rem,/,
  );
});
