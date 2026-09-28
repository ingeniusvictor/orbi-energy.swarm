import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const runtime = read("src/game/fotonGameplay3DRenderer.ts");
const canvas = read("src/game/EnergySwarmCanvas.tsx");
const game = read("src/game/EnergySwarmGame.tsx");

const fotonStart = canvas.indexOf("export function drawFoton(");
const fotonEnd = canvas.indexOf(
  "/**\n * Draws active swarm members.",
  fotonStart,
);
assert.ok(fotonStart >= 0);
assert.ok(fotonEnd > fotonStart);
const foton = canvas.slice(fotonStart, fotonEnd);

test("dedicated gameplay renderer owns Three.js and the real Foton GLB", () => {
  assert.match(
    runtime,
    /import \* as THREE from "three"/,
  );
  assert.match(
    runtime,
    /GLTFLoader/,
  );
  assert.match(
    runtime,
    /assets\/orbi-foton\.glb/,
  );
});

test("complete GLB keeps its face forward and smoothly biases toward combat threat direction", () => {
  assert.match(
    runtime,
    /const neutralYaw = 0\.42/,
  );
  assert.match(
    runtime,
    /const targetYaw = neutralYaw \+ dx \* 0\.72/,
  );
  assert.match(
    runtime,
    /const targetPitch = neutralPitch - dy \* 0\.34/,
  );
  assert.match(
    runtime,
    /1 - Math\.exp\(-elapsedSeconds \* 6\.5\)/,
  );
  assert.doesNotMatch(
    runtime,
    /rotation\.y \+=[\s\S]*elapsedSeconds \* 0\.58/,
  );
});

test("gameplay renderer is transparent, small and free of shadows/postprocessing", () => {
  assert.match(
    runtime,
    /alpha:\s*true/,
  );
  assert.match(
    runtime,
    /renderer\.setClearColor\(0x000000, 0\)/,
  );
  assert.match(
    runtime,
    /castShadow = false/,
  );
  assert.match(
    runtime,
    /receiveShadow = false/,
  );
  assert.doesNotMatch(
    runtime,
    /EffectComposer|UnrealBloomPass|SSAOPass/,
  );
});

test("bounded 3D frame is preserved and reused by the 60Hz battlefield", () => {
  assert.match(
    runtime,
    /preserveDrawingBuffer:\s*true/,
  );
  assert.match(
    runtime,
    /1000 \/ active\.config\.targetFps/,
  );
  assert.match(
    runtime,
    /request\.nowMs -[\s\S]*active\.lastFrameAt >=[\s\S]*frameInterval/,
  );
  assert.match(
    foton,
    /ctx\.drawImage\([\s\S]*glbFrame/,
  );
});

test("GLB is the normal visible body and tactical 2D is fallback only", () => {
  const frameIndex = foton.indexOf("if (glbFrame)");
  const drawImageIndex = foton.indexOf(
    "ctx.drawImage(",
    frameIndex,
  );
  const returnIndex = foton.indexOf(
    "return;",
    drawImageIndex,
  );
  const fallbackIndex = foton.indexOf(
    "drawFotonTacticalAvatar",
    returnIndex,
  );

  assert.ok(frameIndex >= 0);
  assert.ok(drawImageIndex > frameIndex);
  assert.ok(returnIndex > drawImageIndex);
  assert.ok(fallbackIndex > returnIndex);
});

test("GLB keeps the requested 37.5px body target while the detached halo gets a larger transparent composite", () => {
  assert.match(
    runtime,
    /FOTON_GAMEPLAY_DRAW_SIZE = 37\.5/,
  );
  assert.match(
    runtime,
    /FOTON_GAMEPLAY_COMPOSITE_SIZE = 49\.2/,
  );
  assert.match(
    foton,
    /FOTON_GAMEPLAY_COMPOSITE_SIZE/,
  );
  assert.doesNotMatch(
    canvas,
    /position:\s*fixed|position:\s*absolute[\s\S]*glbFrame/,
  );
});

test("game passes live quality and pause state without importing Three directly", () => {
  assert.match(
    game,
    /drawFoton\([\s\S]*stats\.qualityPreset,[\s\S]*isPausedRef\.current/,
  );
  assert.match(
    game,
    /qualityPreset=\{stats\.qualityPreset\}/,
  );
  assert.doesNotMatch(
    game,
    /from ["']three["']|GLTFLoader|WebGLRenderer/,
  );
});

test("Canvas prewarms and disposes the dedicated gameplay GLB renderer", () => {
  assert.match(
    canvas,
    /prewarmFotonGameplay3D\(qualityPreset\)/,
  );
  assert.match(
    canvas,
    /disposeFotonGameplay3D\(\)/,
  );
});

test("pause and hidden-tab gates stop new 3D frames", () => {
  assert.match(
    runtime,
    /!request\.paused &&[\s\S]*!document\.hidden/,
  );
});

test("same GLB base path works under GitHub Pages", () => {
  assert.match(
    runtime,
    /import\.meta\.env\.BASE_URL\}assets\/orbi-foton\.glb/,
  );
});
