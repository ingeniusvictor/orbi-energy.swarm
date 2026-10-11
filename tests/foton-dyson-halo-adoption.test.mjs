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

test("premium orbital language uses structural rails, instanced light segments and sparse red nodes", () => {
  assert.match(runtime, /new THREE\.TorusGeometry\(/);
  assert.match(runtime, /new THREE\.BoxGeometry\(/);
  assert.match(runtime, /new THREE\.SphereGeometry\(/);
  assert.match(runtime, /new THREE\.InstancedMesh\(/);
  assert.match(runtime, /new THREE\.MeshStandardMaterial\(/);
  assert.match(runtime, /THREE\.AdditiveBlending/);
  assert.match(runtime, /segmentMesh\.setMatrixAt/);
  assert.match(runtime, /accentMesh\.setMatrixAt/);
  assert.doesNotMatch(
    runtime,
    /EffectComposer|UnrealBloomPass|SSAOPass/,
  );
});

test("rings use a neon symmetric atomic-sphere triad", () => {
  const radiusMatches = halo.match(/radius: 1\.055/g) ?? [];
  assert.equal(radiusMatches.length, 3);
  assert.match(halo, /tilt: \[1\.08, 0, 0\]/);
  assert.match(halo, /tilt: \[0\.62, 0\.86, 0\.78\]/);
  assert.match(halo, /tilt: \[-0\.62, -0\.86, -0\.78\]/);
  assert.match(halo, /phase: 2\.094/);
  assert.match(halo, /phase: 4\.189/);
});

test("ring construction remains progressive instead of hard-popping", () => {
  assert.match(runtime, /geometry\.setDrawRange\(0, 0\)/);
  assert.match(
    runtime,
    /ring\.buildProgress = Math\.min\([\s\S]*ring\.buildProgress \+ step/,
  );
  assert.match(
    runtime,
    /ring\.core\.geometry\.setDrawRange\([\s\S]*revealCount/,
  );
  assert.match(
    runtime,
    /ring\.segmentMesh\.count =[\s\S]*ring\.segmentCount \* progress/,
  );
});

test("live swarm size is corrected to true collected Orbi before unlocking extra rings", () => {
  assert.match(
    game,
    /drawFoton\([\s\S]*fotonThreatDirectionRef\.current,[\s\S]*swarmRef\.current\.length/,
  );
  assert.match(canvas, /orbiCount,/);
  assert.match(runtime, /request\.orbiCount \?\? 0/);
  assert.match(
    runtime,
    /getUnlockedDysonHaloRingCountFromSwarmSize\([\s\S]*active\.orbiCount/,
  );
  assert.match(
    halo,
    /Math\.max\(0, normalizeCount\(swarmMemberCount\) - 1\)/,
  );
});

test("simple 2D integrity ring stays replaced by the transparent Dyson composite", () => {
  assert.match(runtime, /FOTON_GAMEPLAY_DRAW_SIZE = 37\.5/);
  assert.match(runtime, /FOTON_GAMEPLAY_COMPOSITE_SIZE = 49\.2/);
  assert.match(canvas, /FOTON_GAMEPLAY_COMPOSITE_SIZE/);
  assert.doesNotMatch(canvas, /projectFotonIntegrityVisual/);
});

test("Golden Core is folded into the first cyan structural rail without adding another orbit", () => {
  assert.match(canvas, /goldenCoreActive: hasGoldenCore/);
  assert.match(runtime, /goldenCoreActive\?: boolean \| null/);
  assert.match(runtime, /request\.goldenCoreActive \?\? false/);
  assert.match(
    runtime,
    /if \(index === 0\)[\s\S]*active\.goldenCoreActive[\s\S]*0x3d2b0a[\s\S]*0x5b3a05/,
  );
  assert.match(
    runtime,
    /emissiveIntensity =[\s\S]*active\.goldenCoreActive \? goldenPulse : 0/,
  );

  const goldenBlockStart = runtime.indexOf("if (index === 0) {");
  const goldenBlockEnd = runtime.indexOf(
    "ring.segmentMaterial.opacity =",
    goldenBlockStart,
  );
  assert.ok(goldenBlockStart >= 0);
  assert.ok(goldenBlockEnd > goldenBlockStart);
  const goldenBlock = runtime.slice(goldenBlockStart, goldenBlockEnd);
  assert.doesNotMatch(
    goldenBlock,
    /new THREE\.(?:TorusGeometry|Group|Mesh|InstancedMesh)/,
  );
});

test("standalone Golden Core circle occurs only after normal GLB gameplay returns", () => {
  const fotonStart = canvas.indexOf("export function drawFoton(");
  const fotonEnd = canvas.indexOf(
    "/**\n * Draws active swarm members.",
    fotonStart,
  );
  const foton = canvas.slice(fotonStart, fotonEnd);
  const glbIndex = foton.indexOf(
    "const glbFrame = getFotonGameplay3DFrame",
  );
  const glbReturnIndex = foton.indexOf("return;", glbIndex);
  const goldenIndex = foton.indexOf("if (hasGoldenCore)");
  assert.ok(goldenIndex > glbReturnIndex);
});

test("canonical palette is high-luminance neon cyan emerald gold with subtle red accents", () => {
  assert.match(halo, /color: 0x00f5ff/);
  assert.match(halo, /color: 0x00ff88/);
  assert.match(halo, /color: 0xffd740/);
  assert.match(halo, /FOTON_DYSON_HALO_RED_ACCENT = 0xff1744/);
});

test("halo adoption does not introduce combat mutations or enemy scans", () => {
  assert.doesNotMatch(runtime, /enemiesRef|buildSpatialIndex|spawnEnemy|damagePlayer/);
  assert.doesNotMatch(halo, /Enemy|Projectile|damage|spawn/);
});
