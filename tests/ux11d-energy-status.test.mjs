import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const renderer=read("src/components/presentation/EnergyStatus3D.tsx");
const hud=read("src/components/GameHud.tsx");
const css=read("src/styles/ux11EnergyStatus.css");
const bootstrap=read("src/main.tsx");
const chrome=read("scripts/web-ux01-browser-evidence.mjs");

test("UX11-D status renders true WebGL ENERGY instead of unverified historical FOTON GLB",()=>{
  assert.match(hud,/<EnergyStatus3D language=\{language\}\/>/);
  assert.match(renderer,/new THREE\.WebGLRenderer/);
  assert.match(renderer,/IcosahedronGeometry/);
  assert.match(renderer,/ENERGY, protagonista dorado neutral en 3D/);
  assert.doesNotMatch(renderer,/GLTFLoader|orbi-foton\.glb|new THREE\.TorusGeometry/);
  assert.match(renderer,/Dyson halos are intentionally hidden/);
  assert.match(css,/\.orbi-ux11d-energy-preview/);
  assert.match(bootstrap,/ux11EnergyStatus\.css/);
});

test("UX11-D renderer pauses work, respects motion preferences and survives WebGL errors",()=>{
  for(const phrase of [
    "setStatus(\"FALLBACK\")", "webglcontextlost", "visibilitychange",
    "prefers-reduced-motion: reduce", "cancelAnimationFrame(frame)",
    "renderer.dispose()", "ResizeObserver", "low-power",
    'data-3d-status={status}', "orbi-ux11d-fallback"
  ])assert.ok(renderer.includes(phrase),phrase);
  assert.match(css,/data-3d-status="READY"/);
  assert.match(css,/not\(\[data-3d-status="READY"\]\)/);
  assert.match(renderer,/renderer\.setPixelRatio\(Math\.min\(1\.35/);
});

test("UX11-D live Estado capabilities remain truthful and separate Overdrive from Dash",()=>{
  assert.match(hud,/20% de daño durante 8 s/);
  assert.match(hud,/bloqueo de 4 s/);
  assert.match(hud,/Los círculos de Overdrive no añaden escudos/);
  assert.match(hud,/shieldPercent/);
  assert.match(hud,/combatResonance/);
  assert.match(hud,/formatNumber\(score\)/);
  assert.match(hud,/onMobilePanelChange\?\.\("closed"\)/);
  assert.doesNotMatch(hud,/Dash disponible|Dash ready/);
});

test("UX11-D Chromium protects genuine 3D viewport and tests CSS fallback",()=>{
  for(const phrase of ["ENERGY 3D status module absent","WebGL hero canvas missing",
    "3D viewport collapsed","WebGL context loss did not expose CSS hero",
    "status interaction lost after WebGL check"])assert.ok(chrome.includes(phrase),phrase);
  assert.match(chrome,/webglcontextlost/);
});
