import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const component = read("src/components/presentation/EnergyStatus3D.tsx");
const gameplay = read("src/game/fotonGameplay3DRenderer.ts");
const canvas = read("src/game/EnergySwarmCanvas.tsx");
const browser = read("scripts/web-ux01-browser-evidence.mjs");

test("UX14-C uses the same existing valid binary hero from ES-12F4, not a new model or green follower", () => {
  const binary = readFileSync(new URL("../public/assets/orbi-foton.glb", import.meta.url));
  assert.equal(binary.toString("ascii", 0, 4), "glTF");
  assert.equal(binary.readUInt32LE(4), 2);
  assert.equal(binary.readUInt32LE(8), binary.length);
  assert.ok(binary.length > 2_000_000 && binary.length < 3_000_000);
  assert.match(gameplay, /assets\/orbi-foton\.glb/);
  assert.match(component, /assets\/orbi-foton\.glb/);
  assert.match(component, /import\.meta\.env\.BASE_URL/);
  assert.match(component, /new GLTFLoader\(\)/);
  assert.match(component, /loader\.load\(/);
  assert.match(canvas, /member\.energyId === "FOTON"/);
  assert.doesNotMatch(component, /new THREE\.(IcosahedronGeometry|SphereGeometry|TorusGeometry)/);
});

test("UX14-C model normalization preserves import transforms and mobile fitting", () => {
  assert.match(component, /new THREE\.Box3\(\)\.setFromObject\(imported\)/);
  assert.match(component, /const center = bounds\.getCenter/);
  assert.match(component, /const centered = new THREE\.Group\(\)/);
  assert.match(component, /imported\.position\.sub\(center\)/);
  assert.match(component, /centered\.scale\.setScalar\(1\.72 \/ maxDimension\)/);
  assert.match(component, /camera\.position\.z = Math\.max\(3\.2,/);
  assert.match(component, /Math\.min\(MAX_STATUS_PIXEL_RATIO/);
  assert.match(component, /STATUS_PREVIEW_FPS = 24/);
  assert.match(component, /powerPreference: "low-power"/);
  assert.match(component, /preserveDrawingBuffer: false/);
  assert.match(component, /renderer\.setClearColor\(0x000000, 0\)/);
});

test("UX14-C preserves WebGL+GLB degradation and complete async ownership cleanup", () => {
  assert.match(component, /setStatus\("LOADING"\)/);
  assert.match(component, /if \(disposed \|\| contextLost\)/);
  assert.match(component, /disposeImportedModel\(gltf\.scene\)/);
  assert.match(component, /setStatus\("FALLBACK"\)/);
  assert.match(component, /setStatus\("READY"\)/);
  assert.match(component, /if \(model\) disposeImportedModel\(model\)/);
  assert.match(component, /renderer\?\.dispose\(\)/);
  assert.match(component, /renderer\?\.forceContextLoss\(\)/);
  assert.match(component, /document\.removeEventListener\("visibilitychange", onVisibility\)/);
  assert.match(component, /resizeObserver\?\.disconnect\(\)/);
  assert.match(component, /cancelAnimationFrame\(frame\)/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /webglcontextlost/);
  assert.match(component, /data-model-source=\{status === "READY" \? "canonical-glb" : "fallback"\}/);
});

test("UX14-C browser certification distinguishes loaded GLB from fallback visuals", () => {
  assert.match(browser, /status==="READY"/);
  assert.match(browser, /authentic gameplay GLB not mounted in Estado/);
  assert.match(browser, /webglcontextlost/);
  assert.match(browser, /WebGL context loss did not expose CSS hero/);
  assert.match(component, /ENERGY · GLB/);
  assert.doesNotMatch(component, /GLTFLoader.*from "\.\/orbi-foton"/);
});
