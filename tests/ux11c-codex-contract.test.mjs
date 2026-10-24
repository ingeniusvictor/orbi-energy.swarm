import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const codex=read("src/components/EnergyCodex.tsx");
const navigation=read("src/components/PremiumNativeNavigation.tsx");
const css=read("src/styles/ux11Codex.css");
const boot=read("src/main.tsx");
const browser=read("scripts/android-ux09-premium-browser.mjs");
test("UX11-C mounts native bilingual Codex while preserving the boss archive",()=>{
  assert.match(navigation,/const isCodex = layer === "DETAIL" && tab === "CODEX" && section === "PLAY"/);
  assert.match(navigation,/<EnergyCodex language=\{language\}/);
  assert.match(navigation,/onOpen\("CODEX", "HANGAR"\)/);
  assert.match(codex,/onOpenLegacy/);
  assert.match(codex,/ORBI_ENERGY_CANON\.map/);
  assert.match(codex,/getOrbiAttackProfile/);
  assert.match(codex,/getEvo8VisualStage/);
  assert.match(codex,/getEvo8WingCount/);
  assert.match(codex,/getGaiaLevelForCompletedCycles/);
  assert.match(boot,/ux11Codex\.css/);
});
test("UX11-C keeps full Codex height and independent scrolling, never alters welcome",()=>{
  assert.match(css,/data-mobile-tab="CODEX".*data-mobile-section="PLAY"/);
  assert.match(css,/max-height:100dvh!important/);
  assert.match(css,/\.orbi-ux11c-roster-list[\s\S]*overflow:auto/);
  assert.match(css,/\.orbi-ux11c-details/);
  assert.doesNotMatch(css,/data-layer="WELCOME"/);
});
test("UX11-C Chromium checks ten real interactive cards, level switching, GAIA and ES/EN",()=>{
  for(const phrase of ["ten-energy native Codex absent","missing canonical energies",
    "Codex collapsed into top strip","FOTON green solar-panel identity absent",
    "EVO8 acquisition cap wrong","GAIA incorrectly presented as collectible",
    "missing English GAIA synthesis","caseReport.energyCodex=true"]) assert.ok(browser.includes(phrase),phrase);
  assert.match(browser,/same\(codexBoundsES,codexBoundsEN/);
});
