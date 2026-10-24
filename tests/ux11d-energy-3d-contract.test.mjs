import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const hero=read("src/components/EnergyStatus3D.tsx");
const hud=read("src/components/GameHud.tsx");
const game=read("src/game/EnergySwarmGame.tsx");
const css=read("src/styles/ux11Status3D.css");
const chrome=read("scripts/web-ux01-browser-evidence.mjs");
test("UX11-D isolated 3D component mounts only in Estado with lazy import",()=>{
  assert.match(hud,/import \{ EnergyStatus3D \} from "\.\/EnergyStatus3D"/);
  assert.doesNotMatch(hud,/React\.Suspense/);
  assert.match(hud,/<EnergyStatus3D qualityPreset=\{qualityPreset\} language=\{language\}/);
  assert.match(hud,/immersive && mobilePanel === "estado"/);
  assert.match(game,/qualityPreset=\{stats\.qualityPreset\}/);
});
test("UX11-D avoids unverified FOTON GLB and implements real WebGL fallback",()=>{
  assert.match(hero,/new THREE\.WebGLRenderer/);
  assert.match(hero,/new THREE\.SphereGeometry/);
  assert.match(hero,/webglcontextlost/);
  assert.match(hero,/ResizeObserver/);
  assert.match(hero,/disposeEnergyGroup/);
  assert.match(hero,/quality\.LOW|QualityPreset\.LOW/);
  assert.doesNotMatch(hero,/loader\.load|GLTFLoader/);
  assert.match(css,/data-energy-3d-status="FALLBACK"/);
  assert.doesNotMatch(css,/data-mobile-layer="WELCOME"/);
});
test("UX11-D Chromium verifies actual ENERGY model or fallback",()=>{
  assert.match(chrome,/orbi-ux11d-energy-3d/);
  assert.match(chrome,/3D ENERGY status identity/);
  assert.match(chrome,/data-energy-3d-status/);
});
