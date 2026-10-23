import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const ui = read("src/components/MobileLaunchNavigation.tsx");
const start = read("src/components/StartScreen.tsx");
const css = read("src/styles/index.css");
const manifest = JSON.parse(read("public/manifest.webmanifest"));
const icon = read("public/ux09/orbi-launcher.svg");
const android = read("android/app/src/main/res/drawable/orbi_foton_launcher.xml");
test("UX09 retains the entire welcome > hub > detail route and both genuine launch actions", () => {
  for (const layer of ['"WELCOME"', '"HUB"', '"DETAIL"']) assert.match(ui, new RegExp(layer));
  assert.match(start, /setMobileLayer\("HUB"\)/);
  assert.match(ui, /onPlay: \(\) => void/);
  assert.match(ui, /onScoreAttack: \(\) => void/);
  assert.match(ui, /"orbi-mobile-campaign"/);
  assert.match(ui, /orbi-mobile-score-attack/);
  assert.match(start, /onStartGame\(\)/);
  assert.match(start, /onStartScoreAttack\(\)/);
  assert.match(ui, /data-testid="orbi-mobile-infinite-locked"/);
  assert.doesNotMatch(ui, /mode\.locked\s*\?[^:]*onPlay\(/);
});
test("UX09 has seven illustrated navigation modules with accessible back and language controls", () => {
  for (const name of ["modes","hangar","tactics","codex","controls","settings","about"]) {
    assert.match(ui, new RegExp('art: "' + name + '"'));
  }
  assert.match(ui, /aria-pressed=\{es\}/);
  assert.match(ui, /aria-label="English"/);
  assert.match(ui, /data-testid="orbi-mobile-menu-back"/);
  assert.match(start, /nanoCredits=\{stats\.totalNanoCredits\}/);
});
test("UX09 replaces the dark mobile background with a bundled scene on mobile and desktop", () => {
  assert.match(css, /orbi-ux09-scene/);
  assert.match(ui, /orbi-command-world\.svg/);
  assert.match(css, /--orbi-ux09-world/);
  assert.match(css, /orbi-ux09-mode-card--violet/);
  assert.match(css, /orientation:portrait/);
  assert.match(css, /max-height:600px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
test("UX09 official FOTON mark has ten satellites and is wired to PWA and Android", () => {
  assert.equal((icon.match(/<circle cx=/g) || []).length >= 10, true);
  assert.ok(manifest.icons.some(x => x.src === "ux09/orbi-launcher.svg" && x.sizes === "any"));
  assert.match(read("index.html"), /ux09\/orbi-launcher\.svg/);
  assert.match(android, /Adaptive icon safe area/);
  for (const p of ["ic_launcher.xml","ic_launcher_round.xml"]) {
    assert.match(read("android/app/src/main/res/mipmap-anydpi-v26/" + p), /@drawable\/orbi_foton_launcher/);
  }
});
