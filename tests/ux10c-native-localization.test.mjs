import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const router = read("src/components/MobileLaunchNavigation.tsx");
const native = read("src/components/PremiumNativeNavigation.tsx");
const css = read("src/styles/ux10CinematicLaunch.css");
const scenic = read("public/ux09/orbi-command-world.svg");
const main = read("src/main.tsx");

test("UX10-C desktop and Android landscape use ONE native scene regardless of locale", () => {
  assert.match(router,/const artLayer = landscape;/);
  assert.doesNotMatch(router,/landscape && language\s*===\s*"es"/);
  assert.match(router,/<PremiumNativeNavigation/);
  assert.match(native,/data-ui-composition="native"/);
  assert.match(native,/data-premium-art="world-clean"/);
  assert.match(native,/ux09\/orbi-command-world\.svg/);
  assert.match(native,/ux09\/premium\/welcome\.webp/); // scenic-only crop, never baked UI
  assert.match(css,/mask-image:linear-gradient\(to right/);
  assert.doesNotMatch(scenic,/<text\b/);
  assert.doesNotMatch(native,/orbi-ux09b-hotspot|orbi-ux09b-illustration|premium\/command\.webp/);
  assert.match(main,/ux10CinematicLaunch\.css/);
});

test("UX10-C navigates real HTML bilingual welcome/hub/7 modules, not baked labels",()=>{
  for (const s of ["SISTEMA TÁCTICO DE ENJAMBRE","TACTICAL SWARM COMMAND SYSTEM","CENTRO DE MANDO","COMMAND CENTER","ENTRAR","ENTER"]) assert.ok(native.includes(s),s);
  for(const s of ["orbi-mobile-enter","orbi-mobile-menu-main-play","orbi-mobile-menu-main-hangar","orbi-mobile-menu-how_to-info","orbi-mobile-menu-codex-info","orbi-mobile-menu-controls-info","orbi-mobile-menu-settings-info","orbi-mobile-menu-about-info"]) assert.ok(native.includes(s),s);
  assert.match(native,/aria-pressed=\{es\}/);
  assert.match(native,/aria-pressed=\{!es\}/);
  assert.match(native,/onClick=\{onEnter\}/);
  assert.match(native,/onClick=\{\(\) => onOpen\(item\.tab, item\.section\)\}/);
  assert.match(native,/nanoCredits\.toLocaleString\(language\)/);
  assert.match(native,/purifiedEnergy\.toLocaleString\(language\)/);
  assert.match(native,/aria-label=\{es \? "Volver a portada" : "Back to title"\}/);
});

test("UX10-C preserves Campaign, Score Attack, true locked Infinite, and tactics manual",()=>{
  assert.match(native,/orbi-mobile-campaign/);
  assert.match(native,/orbi-mobile-score-attack/);
  assert.match(native,/orbi-mobile-infinite-locked/);
  assert.match(native,/onClick=\{mode\.key === "campaign" \? onPlay : onScoreAttack\}/);
  assert.match(native,/mode\.lock \? \(/);
  assert.match(native,/hasInfiniteRecord/);
  assert.match(native,/orbi-ux09b-formation-manual/);
  assert.match(native,/onOpen\("HOW_TO", "HANGAR"\)/);
  for (const name of ["Guardia Cruzada","Delta Concéntrica","Concentric Delta","Cross Guard"]) assert.ok(native.includes(name));
});

test("UX10-C true full-bleed geometry is responsive and respects reduced motion",()=>{
  assert.match(css,/background-size:cover!important/);
  assert.match(css,/background-position:center center!important/);
  assert.match(css,/grid-template-columns:repeat\(12,minmax\(0,1fr\)\)!important/);
  assert.match(css,/\.orbi-ux10c-command-grid>.*orbi-ux10c-tile/);
  assert.match(css,/@media \(orientation:landscape\) and \(max-height:520px\)/);
  assert.match(css,/@media \(orientation:landscape\) and \(max-width:760px\)/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
  assert.ok(!css.includes("object-fit:fill"),"no stretched screenshot");
});
