import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("repository exposes the certified build gates", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.name, "orbi-energy-swarm");
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, "module");
  assert.equal(pkg.scripts.typecheck, "tsc --noEmit");
  assert.equal(pkg.scripts.build, "vite build");
});

test("prototype viewport and world invariants remain intact", () => {
  const constants = read("src/game/constants.ts");
  assert.match(constants, /CANVAS_WIDTH\s*=\s*800/);
  assert.match(constants, /CANVAS_HEIGHT\s*=\s*480/);
  assert.match(constants, /WORLD_WIDTH\s*=\s*1600/);
  assert.match(constants, /WORLD_HEIGHT\s*=\s*960/);
});

test("handcrafted campaign still contains ten sectors and the Devourer climax", () => {
  const waves = read("src/game/waveDirector.ts");
  const declaredWaves = [...waves.matchAll(/waveNumber:\s*\d+/g)];
  assert.equal(declaredWaves.length, 10);
  assert.match(waves, /BOSS_WAVE_NUMBER\s*=\s*10/);
  assert.match(waves, /BLACKOUT_DEVOURER_CANON/);
  assert.match(waves, /displayName:\s*"Blackout Devourer"/);
});

test("all six original swarm formations remain represented", () => {
  const formations = read("src/game/formations.ts");
  for (const formation of ["LINE", "CIRCLE", "DELTA", "SHIELD", "V_SHAPE", "SCATTERED"]) {
    assert.match(formations, new RegExp(`FormationType\\.${formation}`));
  }
});

test("product evolution contracts are present", () => {
  for (const path of [
    "docs/PRODUCT_VISION.md",
    "docs/PREMIUM_WEB_ANDROID_SPEC.md",
    "docs/INFINITE_PROGRESSION_SPEC.md",
    "docs/RESPONSIVE_UI_AUDIT.md",
  ]) {
    assert.ok(read(path).length > 100, `${path} should contain the governing specification`);
  }
});
