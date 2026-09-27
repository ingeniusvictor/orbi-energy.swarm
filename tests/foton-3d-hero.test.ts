import assert from "node:assert/strict";
import {
  readFileSync,
  statSync,
} from "node:fs";
import test from "node:test";

import {
  getFotonHeroRuntimeConfig,
} from "../src/components/presentation/Foton3DHero.tsx";
import { QualityPreset } from "../src/game/types.ts";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const start = read("src/components/StartScreen.tsx");
const hero = read(
  "src/components/presentation/Foton3DHero.tsx",
);
const game = read("src/game/EnergySwarmGame.tsx");
const css = read("src/styles/index.css");
const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));

test("LOW keeps the CSS-only command core and avoids a WebGL runtime", () => {
  assert.equal(
    getFotonHeroRuntimeConfig(QualityPreset.LOW),
    null,
  );

  assert.match(
    start,
    /stats\.qualityPreset !== QualityPreset\.LOW/,
  );
});

test("menu 3D cadence and DPR remain bounded by quality tier", () => {
  assert.deepEqual(
    getFotonHeroRuntimeConfig(QualityPreset.MEDIUM),
    {
      maxPixelRatio: 1,
      targetFps: 24,
      antialias: false,
    },
  );
  assert.deepEqual(
    getFotonHeroRuntimeConfig(QualityPreset.HIGH),
    {
      maxPixelRatio: 1.25,
      targetFps: 30,
      antialias: true,
    },
  );
  assert.deepEqual(
    getFotonHeroRuntimeConfig(QualityPreset.ULTRA),
    {
      maxPixelRatio: 1.5,
      targetFps: 36,
      antialias: true,
    },
  );
});

test("Foton renderer is lazy-mounted only through the MAIN start tab", () => {
  assert.match(
    start,
    /const LazyFoton3DHero = React\.lazy/,
  );
  assert.match(
    start,
    /activeTab === "MAIN"[\s\S]*LazyFoton3DHero/,
  );
  assert.match(
    start,
    /<React\.Suspense fallback=\{null\}>/,
  );
});

test("Foton GLB is a real binary glTF asset with expected audit scale", () => {
  const assetUrl = new URL(
    "../public/assets/orbi-foton.glb",
    import.meta.url,
  );
  const stats = statSync(assetUrl);
  const header = readFileSync(assetUrl).subarray(0, 4);

  assert.equal(header.toString("ascii"), "glTF");
  assert.ok(stats.size > 2_000_000);
  assert.ok(stats.size < 3_000_000);
});

test("Three.js dependency is reproducibly locked", () => {
  assert.equal(
    pkg.dependencies.three,
    "0.180.0",
  );
  assert.equal(
    lock.packages[""].dependencies.three,
    "0.180.0",
  );
  assert.equal(
    lock.packages["node_modules/three"].version,
    "0.180.0",
  );
  assert.match(
    lock.packages["node_modules/three"].integrity,
    /^sha512-/,
  );
});

test("GLB URL respects the active Vite hosting base path", () => {
  assert.match(
    hero,
    /import\.meta\.env\.BASE_URL\}assets\/orbi-foton\.glb/,
  );
});

test("menu renderer pauses useful work while hidden and honors reduced motion", () => {
  assert.match(hero, /document\.hidden/);
  assert.match(
    hero,
    /prefers-reduced-motion: reduce/,
  );
  assert.match(
    hero,
    /if \([\s\S]*!visible \|\|[\s\S]*!model \|\|[\s\S]*reducedMotion/,
  );
});

test("renderer resources are disposed when the MAIN hero unmounts", () => {
  assert.match(hero, /cancelAnimationFrame/);
  assert.match(hero, /resizeObserver\.disconnect/);
  assert.match(hero, /disposeObject3D\(model\)/);
  assert.match(hero, /renderer\.dispose\(\)/);
  assert.match(hero, /forceContextLoss/);
});

test("pointer parallax remains bounded and cosmetic", () => {
  assert.match(
    hero,
    /pointer\.targetX[\s\S]*\*\s*2/,
  );
  assert.match(
    hero,
    /sceneRoot\.position\.x =\s*pointer\.x \* 0\.035/,
  );
  assert.match(
    hero,
    /camera\.position\.x =\s*pointer\.x \* 0\.09/,
  );
});

test("EnergySwarmGame stays decoupled from Three.js and the menu hero", () => {
  assert.doesNotMatch(
    game,
    /from ["']three["']|GLTFLoader|Foton3DHero/,
  );
});

test("CSS command core remains a complete fallback beneath READY WebGL", () => {
  assert.match(
    start,
    /data-foton-css-fallback="true"/,
  );
  assert.match(
    css,
    /data-foton-3d-status="READY"/,
  );
  assert.match(
    css,
    /\[data-foton-css-fallback="true"\]/,
  );
});
