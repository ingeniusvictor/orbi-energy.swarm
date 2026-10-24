import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const art=read("src/components/presentation/PremiumMissionArtwork.tsx");
const nav=read("src/components/PremiumNativeNavigation.tsx");
const codex=read("src/components/EnergyCodex.tsx");
const css=read("src/styles/ux11PremiumFinish.css");
const main=read("src/main.tsx");
const browser=read("scripts/android-ux09-premium-browser.mjs");

test("UX11-F ten unique premium scenes are native, text-free source art",()=>{
  const scenes=["modes","hangar","tactics","codex","controls","settings","about","campaign","score","infinite"];
  for(const scene of scenes){
    assert.ok(art.includes('"'+scene+'"'),"missing scene "+scene);
    assert.match(art,new RegExp('scene==="'+scene+'"|scene--'+scene+'|"'+scene+'":'));
  }
  assert.match(art,/React\.memo/);
  assert.match(art,/viewBox="0 0 520 240"/);
  assert.match(art,/aria-hidden="true"/);
  assert.match(art,/useId\(\)/);
  assert.doesNotMatch(art,/<text\b|<foreignObject\b|<image\b|dangerouslySetInnerHTML/);
});

test("UX11-F artwork gives ENERGY gold and FOTON a separate green solar panel",()=>{
  assert.match(art,/fill="#f4bf59"/);
  assert.match(art,/fill="#4fe798"/);
  assert.match(art,/stroke="#a3ffab"/);
  assert.match(art,/scene==="codex"/);
  assert.match(codex,/id==="FOTON"/);
  assert.match(codex,/ORBI_PROTAGONIST_ID\} ≠ FOTON/);
});

test("UX11-F native Command Center and modes preserve all real callbacks, localization and gated modes",()=>{
  assert.match(nav,/<PremiumMissionArtwork scene=\{item\.key\}/);
  assert.match(nav,/<PremiumMissionArtwork scene=\{mode\.key\}/);
  assert.match(nav,/onClick=\{\(\) => onOpen\(item\.tab, item\.section\)\}/);
  assert.match(nav,/onClick=\{mode\.key === "campaign" \? onPlay : onScoreAttack\}/);
  assert.match(nav,/data-testid=\{mode\.testId\}/);
  assert.match(nav,/mode\.lock \? \(/);
  assert.match(nav,/hasInfiniteRecord/);
  assert.match(nav,/SCORE_ATTACK_DURATION_MS \/ 1000/);
  assert.match(nav,/orbi-mobile-menu-back/);
  assert.match(nav,/aria-pressed=\{es\}/);
  assert.match(nav,/aria-pressed=\{!es\}/);
  for(const id of ["orbi-mobile-menu-main-play","orbi-mobile-menu-main-hangar",
    "orbi-mobile-menu-how_to-info","orbi-mobile-menu-codex-info","orbi-mobile-menu-controls-info",
    "orbi-mobile-menu-settings-info","orbi-mobile-menu-about-info"])assert.ok(nav.includes(id),id);
});

test("UX11-F eight distinct Codex signatures remain decorative, not gameplay mutations",()=>{
  for(const type of ["HYDRO","AERO","TERMO","MAGNE","ATON","KINETRIX","H2NOVA","QUANTUM","GAIA"]) {
    assert.ok(codex.includes('id==="'+type+'"'),type);
  }
  assert.match(codex,/<EnergyCodexSignature id=\{id\} color=\{color\}/);
  assert.match(codex,/getOrbiAttackProfile\(energy\.attackSignature\)/);
  assert.match(codex,/getEvo8VisualStage\(level\)/);
  assert.match(codex,/ORBI_GAIA_REQUIRED_FOLLOWER_IDS\.map/);
  assert.match(codex,/no es un seguidor coleccionable ordinario/);
});

test("UX11-F premium finish scopes out WELCOME, preserves short landscape and reduced motion",()=>{
  assert.match(main,/ux11PremiumFinish\.css/);
  assert.doesNotMatch(css,/data-layer="WELCOME"/);
  assert.match(css,/data-layer="HUB"/);
  assert.match(css,/data-layer="DETAIL"/);
  assert.match(css,/\.orbi-ux11f-scene/);
  assert.match(css,/\.orbi-ux11b-card-art/);
  assert.match(css,/\.orbi-ux11c-art/);
  assert.match(css,/\.orbi-ux11d-energy-preview/);
  assert.match(css,/@media \(orientation:landscape\) and \(max-height:520px\)/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(css,/object-fit:fill|background-image:url\([^)]*premium\/command/);
});

test("UX11-F Chromium checks each actual scene, distinct modes and ES/EN native geometry",()=>{
  for(const marker of ["seven distinct module art scenes","mode artwork missing",
    "each game mode must have unique art","Codex signature HYDRO missing",
    "GAIA identity art missing","native premium illustration has baked text",
    "caseReport.premiumFinish=true"])assert.ok(browser.includes(marker),marker);
  assert.match(browser,/same\(hubEN,hubES/);
  assert.match(browser,/same\(codexBoundsES,codexBoundsEN/);
});
