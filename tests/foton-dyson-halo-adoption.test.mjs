import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const runtime = read("src/game/fotonGameplay3DRenderer.ts");
const halo = read("src/game/fotonDysonHalo.ts");
const canvas = read("src/game/EnergySwarmCanvas.tsx");
const game = read("src/game/EnergySwarmGame.tsx");

test("Dyson halo is a detached Three.js scene layer rather than part of the GLB root", () => {
  assert.match(
    runtime,
    /const \{ haloRoot, haloRings \} =[\s\S]*createDysonHaloRuntime\(preset\)/,
  );
  assert.match(runtime, /scene\.add\(haloRoot\)/);
  assert.match(runtime, /next\.root\.add\(model\)/);
  assert.doesNotMatch(runtime, /root\.add\(haloRoot\)/);
});

test("three independently tilted orbital rings use bounded geometry without postprocessing", () => {
  assert.match(runtime, /new THREE\.TorusGeometry\(/);
  assert.match(runtime, /new THREE\.SphereGeometry\(/);
  assert.match(runtime, /THREE\.AdditiveBlending/);
  assert.match(runtime, /descriptor\.angularVelocity/);
  assert.match(runtime, /descriptor\.tilt\[0\]/);
  assert.doesNotMatch(
    runtime,
    /EffectComposer|UnrealBloomPass|SSAOPass/,
  );
});

test("ring construction uses draw range and smooth build progress instead of a hard pop", () => {
  assert.match(runtime, /geometry\.setDrawRange\(0, 0\)/);
  assert.match(
    runtime,
    /ring\.buildProgress = Math\.min\([\s\S]*ring\.buildProgress \+ step/,
  );
  assert.match(
    runtime,
    /ring\.core\.geometry\.setDrawRange\([\s\S]*revealCount/,
  );
});

test("live Orbi count and shield ratio are cosmetic inputs to the renderer", () => {
  assert.match(
    game,
    /drawFoton\([\s\S]*fotonThreatDirectionRef\.current,[\s\S]*swarmRef\.current\.length/,
  );
  assert.match(canvas, /orbiCount,/);
  assert.match(canvas, /shieldRatio,/);
  assert.match(runtime, /request\.orbiCount \?\? 0/);
  assert.match(runtime, /request\.shieldRatio \?\? 1/);
});

test("simple 2D integrity ring is replaced by the larger transparent Dyson composite", () => {
  assert.match(
    runtime,
    /FOTON_GAMEPLAY_DRAW_SIZE = 37\.5/,
  );
  assert.match(
    runtime,
    /FOTON_GAMEPLAY_COMPOSITE_SIZE = 49\.2/,
  );
  assert.match(
    canvas,
    /FOTON_GAMEPLAY_COMPOSITE_SIZE/,
  );
  assert.doesNotMatch(
    canvas,
    /projectFotonIntegrityVisual/,
  );
});

test("canonical palette stays cyan emerald gold with subtle red accents", () => {
  assert.match(halo, /color: 0x22d3ee/);
  assert.match(halo, /color: 0x10b981/);
  assert.match(halo, /color: 0xfbbf24/);
  assert.match(
    halo,
    /FOTON_DYSON_HALO_RED_ACCENT = 0xef4444/,
  );
});

test("halo adoption does not introduce combat mutations or enemy scans", () => {
  assert.doesNotMatch(
    runtime,
    /enemiesRef|buildSpatialIndex|spawnEnemy|damagePlayer/,
  );
  assert.doesNotMatch(
    halo,
    /Enemy|Projectile|damage|spawn/,
  );
});
