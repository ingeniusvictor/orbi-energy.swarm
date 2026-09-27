import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const canvas = read("src/game/EnergySwarmCanvas.tsx");
const tactical = read("src/game/fotonTacticalRenderer.ts");
const game = read("src/game/EnergySwarmGame.tsx");

const fotonStart = canvas.indexOf("export function drawFoton(");
const fotonEnd = canvas.indexOf(
  "/**\n * Draws active swarm members.",
  fotonStart,
);
assert.ok(fotonStart >= 0);
assert.ok(fotonEnd > fotonStart);
const foton = canvas.slice(fotonStart, fotonEnd);

test("drawFoton accepts a presentation-only shield ratio", () => {
  assert.match(
    foton,
    /shieldRatio:\s*number = 1/,
  );
  assert.match(
    foton,
    /shieldRatio,[\s\S]*damageHighlightStrength/,
  );
});

test("damage highlight is bounded by existing flash accessibility strength", () => {
  assert.match(
    foton,
    /flashProfile\.friendlyWhiteFlashStrength/,
  );
  assert.match(
    foton,
    /Math\.min\(1, playerFlash \/ 60\)/,
  );
  assert.match(
    tactical,
    /damageHighlightStrength \* 0\.42/,
  );
});

test("game computes visual integrity from the same live shield upgrades", () => {
  assert.match(
    game,
    /const fotonShieldMax =[\s\S]*SHIELD_MAX[\s\S]*upgradesLevel\.hydrogen_deflector[\s\S]*activeRunUpgradesRef\.current\.foton_integrity/,
  );
  assert.match(
    game,
    /const fotonShieldRatio =[\s\S]*shieldRef\.current \/[\s\S]*Math\.max\(1, fotonShieldMax\)/,
  );
});

test("live shield ratio is passed only into Foton rendering", () => {
  const call = game.slice(
    game.indexOf("// 7. Draw reactive tactical Foton leader."),
    game.indexOf("// 8. Draw active floating text feedback"),
  );
  assert.match(call, /drawFoton\(/);
  assert.match(call, /fotonShieldRatio/);
  assert.doesNotMatch(
    call,
    /shieldRef\.current\s*=|setShield\(|damagePlayer\(/,
  );
});

test("renderer draws an integrity track and proportional colored arc", () => {
  assert.match(
    tactical,
    /ctx\.arc\(0, 0, 19\.1, 0, Math\.PI \* 2\)/,
  );
  assert.match(
    tactical,
    /Math\.PI \* 2 \* integrity\.ratio/,
  );
  assert.match(
    tactical,
    /ctx\.strokeStyle = integrity\.color/,
  );
});

test("critical pulse remains cosmetic and bounded", () => {
  assert.match(
    tactical,
    /integrity\.status === "CRITICAL"/,
  );
  assert.match(
    tactical,
    /0\.04 \+[\s\S]*\* 0\.025/,
  );
});

test("reactive overlay stays presentation-only while Three.js is isolated behind the dedicated GLB renderer", () => {
  const combined = canvas + tactical;
  assert.doesNotMatch(
    combined,
    /from ["']three["']|GLTFLoader|WebGLRenderer|localStorage|saveGameStats/,
  );
  assert.match(
    canvas,
    /getFotonGameplay3DFrame/,
  );
});
