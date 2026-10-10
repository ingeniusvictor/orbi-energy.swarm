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

test("rings use atomic-sphere planes rather than widely concentric radii", () => {
  assert.match(halo, /radius: 1\.04/);
  assert.match(halo, /radius: 1\.055/);
  assert.match(halo, /radius: 1\.068/);
  assert.match(halo, /tilt: \[0\.08, 0\.03, 0\.12\]/);
  assert.match(halo, /tilt: \[0\.96, 0\.34, -0\.48\]/);
  assert.match(halo, /tilt: \[-0\.88, -0\.44, 0\.68\]/);
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

test("first cyan structural rail is tuned to visually absorb the legacy Golden Core circle", () => {
  assert.match(halo, /id: "CYAN"[\s\S]*radius: 1\.04/);
  assert.match(halo, /id: "CYAN"[\s\S]*railTubeRadius: 0\.046/);
  assert.match(runtime, /ring\.coreMaterial\.opacity =[\s\S]*progress \* 0\.95/);
  assert.match(runtime, /color: 0x111827/);
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
