import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const css = read("src/styles/ux11Tactics.css");
const native = read("src/components/PremiumNativeNavigation.tsx");
const game = read("src/game/EnergySwarmGame.tsx");
const main = read("src/main.tsx");
const chrome = read("scripts/android-ux09-premium-browser.mjs");

test("UX11-B replaces generic 16dvh detail restriction specifically for Tactics", () => {
  assert.match(css, /data-mobile-tab="HOW_TO".*data-mobile-section="PLAY"/);
  assert.match(css, /\.orbi-mobile-launch\.orbi-ux09\.orbi-ux10c/);
  assert.match(css, /height:100%!important/);
  assert.match(css, /max-height:100dvh!important/);
  assert.match(native, /orbi-ux10c-detail--tactics/);
  assert.match(main, /ux11Tactics\.css/);
  assert.doesNotMatch(css, /data-layer="WELCOME"/);
});

test("UX11-B controls stay native, bilingual, with artwork separated from text", () => {
  assert.match(native, /<FormationDiagram type=\{type\} language=\{language\}/);
  assert.match(native, /onClick=\{\(\) => setSelectedFormation\(type\)\}/);
  assert.match(native, /aria-pressed=\{selectedFormation === type\}/);
  assert.match(native, /getFormationBrief\(selectedFormation, language\)/);
  assert.match(native, /onOpen\("HOW_TO", "HANGAR"\)/);
  assert.match(game, /onClick=\{\(\) => triggerFormationChange\(f\.type\)\}/);
  assert.match(game, /onClick=\{\(\) => changeMinimapMode\(m\)\}/);
  assert.match(game, /onClick=\{\(\) => changeQualityPreset\(q\)\}/);
  assert.match(game, /mobilePanel === "tactica"/);
});

test("UX11-B real Chromium asserts card sizes, interaction and ES/EN geometry", () => {
  for (const phrase of ["tactics still collapsed vertically", "tactical cards compressed",
    "formation grid has no usable viewport", "English tactical details absent", "tacticsResponsive=true"]) {
    assert.ok(chrome.includes(phrase), phrase);
  }
  assert.match(chrome, /same\(tacticsES,tacticsEN/);
  assert.match(chrome, /same\(formationGridES,formationGridEN/);
});
