import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, statSync } from "node:fs";
import {
  ASTERIA_PREMIUM_ASSET_COUNT,
  ASTERIA_PREMIUM_ASSET_MAP,
  ASTERIA_PREMIUM_FADE_UNITS,
  getAsteriaPremiumScene,
  getAsteriaPremiumAssetStatus,
  drawAsteriaPremiumWorld,
} from "../../src/game/asteriaPremiumRenderer";
import { ASTERIA_SECTION_DEFS, createRouteCursor } from "../../src/game/worldRouteCore";

test("UX15-C2B: four ORIGINAL approved ASTERIA WebPs are real bounded binary files", () => {
  const files = new Set(Object.values(ASTERIA_PREMIUM_ASSET_MAP));
  assert.equal(files.size, ASTERIA_PREMIUM_ASSET_COUNT);
  let total = 0;
  for (const file of files) {
    const path = new URL("../../public/assets/worlds/asteria/" + file, import.meta.url);
    const blob = readFileSync(path);
    assert.equal(blob.toString("ascii", 0, 4), "RIFF", file + " missing RIFF");
    assert.equal(blob.toString("ascii", 8, 12), "WEBP", file + " missing WEBP");
    assert.ok(blob.length > 40_000 && blob.length < 200_000, file + " unoptimized");
    assert.equal(statSync(path).size, blob.length);
    total += blob.length;
  }
  assert.ok(total > 400_000 && total < 650_000,
    "ASTЕRIA premium four-image download must remain under 650 KB");
});

test("UX15-C2B: every one of six canonical route segments maps to approved environment art", () => {
  assert.equal(ASTERIA_SECTION_DEFS.length, 6);
  for (let ordinal = 0; ordinal < 360; ordinal++) {
    const scene = getAsteriaPremiumScene(ordinal);
    const expected = ASTERIA_SECTION_DEFS[ordinal % 6];
    assert.equal(scene.kind, expected.id);
    assert.ok(scene.file.endsWith(".webp"));
    assert.equal(scene.file, ASTERIA_PREMIUM_ASSET_MAP[expected.id]);
  }
  assert.equal(getAsteriaPremiumScene(0).file, "asteria-arrival.webp");
  assert.equal(getAsteriaPremiumScene(1).file, "asteria-orbital.webp");
  assert.equal(getAsteriaPremiumScene(3).file, "asteria-relay.webp");
  assert.equal(getAsteriaPremiumScene(4).file, "asteria-breach.webp");
  assert.ok(ASTERIA_PREMIUM_FADE_UNITS > 0 && ASTERIA_PREMIUM_FADE_UNITS < 200);
  assert.throws(() => getAsteriaPremiumScene(-1), RangeError);
  assert.throws(() => getAsteriaPremiumScene(Number.NaN), RangeError);
});

test("UX15-C2B: Node/SSR without Image fails safely to existing legacy fallback", () => {
  if (typeof Image !== "undefined") return;
  assert.equal(getAsteriaPremiumAssetStatus("asteria-arrival.webp"), "unrequested");
  assert.equal(drawAsteriaPremiumWorld({} as CanvasRenderingContext2D,
    createRouteCursor("unit"), 800), false);
});

test("UX15-C2B: runtime keeps default arena path and does not introduce second WebGL", () => {
  const engine = readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
  const renderer = readFileSync(new URL("../../src/game/asteriaPremiumRenderer.ts",import.meta.url),"utf8");
  const browser = readFileSync(new URL("../../scripts/web-ux01-browser-evidence.mjs",import.meta.url),"utf8");
  assert.match(engine,/if \(worldRouteRunActiveRef\.current\) preloadAsteriaPremiumWorld\(\)/);
  assert.match(engine,/const asteriaCombatVisualActive = worldRouteRunActiveRef\.current/);
  assert.match(engine,/drawAsteriaPremiumWorld\(/);
  assert.match(engine,/if \(!asteriaPremiumReady\) \{[\s\S]*drawWorldRouteQaScene\(/);
  assert.match(engine,/canvas\.dataset\.ux15Visual = asteriaPremiumReady \? "premium-webp" : "fallback-canvas"/);
  assert.match(engine,/delete canvas\.dataset\.ux15Visual/);
  assert.match(engine,/backgroundRenderer\.render\(/);
  assert.equal(renderer.includes("new THREE"), false);
  assert.equal(renderer.includes("new WebGLRenderer("), false);
  assert.equal(renderer.includes("Date.now("), false);
  assert.equal(renderer.includes("Math.random("), false);
  assert.equal(renderer.includes("requestAnimationFrame("), false);
  assert.match(renderer,/ctx\.globalAlpha = fade/);
  assert.match(renderer,/ctx\.save\(\)/);
  assert.match(renderer,/ctx\.restore\(\)/);
  assert.match(browser,/data-ux15-visual/);
  assert.match(browser,/premium-webp/);
});
