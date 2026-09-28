import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const canvas = readFileSync(
  new URL("../src/game/EnergySwarmCanvas.tsx", import.meta.url),
  "utf8",
);
const tactical = readFileSync(
  new URL("../src/game/fotonTacticalRenderer.ts", import.meta.url),
  "utf8",
);
const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

const start = canvas.indexOf("export function drawFoton(");
const end = canvas.indexOf(
  "/**\n * Draws active swarm members.",
  start,
);
assert.ok(start >= 0);
assert.ok(end > start);
const foton = canvas.slice(start, end);

test("tactical avatar remains only the loading or failure fallback", () => {
  assert.match(
    canvas,
    /drawFotonTacticalAvatar/,
  );
  assert.match(
    foton,
    /const glbFrame = getFotonGameplay3DFrame/,
  );
  assert.match(
    foton,
    /if \(glbFrame\)[\s\S]*ctx\.drawImage\([\s\S]*return;[\s\S]*Loading\/failure fallback only[\s\S]*drawFotonTacticalAvatar/,
  );
});

test("historical FULL flash disappearance gate remains intact", () => {
  assert.match(
    foton,
    /flashProfile\.fotonFullFlicker/,
  );
  assert.match(
    foton,
    /Math\.floor\(playerFlash \/ 3\) % 2 === 0/,
  );
  assert.match(foton, /return;/);
});

test("Golden Core reward halo remains around the tactical avatar", () => {
  assert.match(foton, /if \(hasGoldenCore\)/);
  assert.match(
    foton,
    /rgba\(251, 191, 36, 0\.88\)/,
  );
  assert.match(
    foton,
    /23 \+ Math\.sin\(time \* 0\.005\) \* 1\.2/,
  );
});

test("legacy white eyeball body is removed from drawFoton", () => {
  assert.doesNotMatch(
    foton,
    /White eye backdrop|Cyan pupil|ctx\.arc\(5, 0, 4/,
  );
});

test("tactical renderer carries the premium Foton shell vocabulary", () => {
  for (const token of [
    "Metallic spherical shell",
    "Central aperture collar",
    "Directional optical core",
    "Mechanical top/bottom modules",
    "rotating command scan accent",
  ]) {
    assert.ok(
      tactical.includes(token),
      `Missing tactical visual token: ${token}`,
    );
  }
});

test("combat and tactical fallback remain free of direct Three.js dependencies", () => {
  const combined = canvas + tactical + game;
  assert.doesNotMatch(
    combined,
    /from ["']three["']|GLTFLoader|WebGLRenderer/,
  );
  assert.match(
    canvas,
    /from "\.\/fotonGameplay3DRenderer"/,
  );
});

test("tactical avatar uses primitive drawing rather than per-frame image decoding", () => {
  assert.doesNotMatch(
    tactical,
    /new Image\(|createImageBitmap|drawImage\(|fetch\(/,
  );
  assert.match(tactical, /ctx\.arc\(/);
  assert.match(tactical, /ctx\.fillRect\(/);
});

test("tactical renderer avoids per-frame gradient allocation", () => {
  assert.doesNotMatch(
    tactical,
    /createRadialGradient|createLinearGradient/,
  );
});
