import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const canvas = read("src/game/EnergySwarmCanvas.tsx");
const game = read("src/game/EnergySwarmGame.tsx");
const storage = read("src/game/storage.ts");

const section = (
  source: string,
  startMarker: string,
  endMarker: string,
) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start: ${startMarker}`);
  assert.ok(end > start, `Missing end: ${endMarker}`);
  return source.slice(start, end);
};

test("storage normalizes persisted flashIntensity through the accessibility contract", () => {
  assert.ok(
    storage.includes(
      'import { normalizeFlashIntensityMode } from "./flashAccessibility";',
    ),
  );
  assert.ok(
    storage.includes(
      "flashIntensity: normalizeFlashIntensityMode(parsed.flashIntensity)",
    ),
  );
});

test("Canvas wrapper projects flash mode and removes repeated overlay flicker in REDUCED", () => {
  assert.ok(
    canvas.includes(
      "flashIntensity: FlashIntensityMode;",
    ),
  );
  assert.ok(
    canvas.includes(
      "projectFlashAccessibility(flashIntensity)",
    ),
  );

  const overlay = section(
    canvas,
    "{/* Screen flash on hit overlay */}",
    "{/* PAUSED GAME OVERLAY PORTAL */}",
  );

  assert.ok(
    overlay.includes(
      "!flashProfile.screenOverlayFlickers",
    ),
  );
  assert.ok(
    overlay.includes(
      "flashProfile.screenOverlayOpacity",
    ),
  );
  assert.ok(
    overlay.includes(
      "data-flash-intensity={flashProfile.mode}",
    ),
  );
});

test("FOTON disappearance flicker remains exclusive to the projected FULL behavior", () => {
  const foton = section(
    canvas,
    "export function drawFoton(",
    "/**\n * Draws active swarm members.",
  );

  assert.ok(
    foton.includes(
      "flashProfile.fotonFullFlicker",
    ),
  );
  assert.ok(
    foton.includes(
      "Math.floor(playerFlash / 3) % 2 === 0",
    ),
  );
  assert.ok(foton.includes("return;"));
});

test("friendly shoot flash preserves FULL white fill and REDUCED member color", () => {
  const swarm = section(
    canvas,
    "export function drawSwarmRoster(",
    "/**\n * Draws harvestable resources",
  );

  assert.ok(
    swarm.includes(
      "flashProfile.friendlyWhiteFlashStrength >= 1",
    ),
  );
  assert.ok(
    swarm.includes('ctx.fillStyle = "#ffffff";'),
  );
  assert.ok(
    swarm.includes(
      "const reducedFlashStrength = isFlashing",
    ),
  );
  assert.ok(
    swarm.includes("ctx.fillStyle = member.color;"),
  );
});

test("enemy FULL flash retains historical white replacement and early return", () => {
  const enemies = section(
    canvas,
    "export function drawEnemiesList(",
    "/**\n * Draws all projectiles.",
  );

  const fullFlash = section(
    enemies,
    "if (\n      enemy.flashTicks > 0 &&\n      flashProfile.enemyWhiteFlashStrength >= 1",
    "if (\n      enemy.flashTicks > 0 &&\n      flashProfile.enemyWhiteFlashStrength > 0",
  );

  assert.ok(
    fullFlash.includes('ctx.fillStyle = "#ffffff";'),
  );
  assert.ok(fullFlash.includes("ctx.fill();"));
  assert.ok(fullFlash.includes("ctx.restore();"));
  assert.ok(fullFlash.includes("return;"));
});

test("enemy REDUCED flash is a bounded highlight and does not early-return", () => {
  const enemies = section(
    canvas,
    "export function drawEnemiesList(",
    "/**\n * Draws all projectiles.",
  );

  const reducedStart = enemies.indexOf(
    "flashProfile.enemyWhiteFlashStrength > 0",
  );
  const telegraphStart = enemies.indexOf(
    "// DRAW WEAPONS CHARGING TELEGRAPHS",
  );
  assert.ok(reducedStart >= 0);
  assert.ok(telegraphStart > reducedStart);

  const reduced = enemies.slice(
    reducedStart,
    telegraphStart,
  );
  assert.ok(
    reduced.includes(
      "ctx.globalAlpha =\n        flashProfile.enemyWhiteFlashStrength",
    ),
  );
  assert.ok(reduced.includes("ctx.stroke();"));
  assert.ok(!reduced.includes("return;"));
});

test("game render loop projects one flash profile and passes it to enemies, swarm and FOTON", () => {
  const render = section(
    game,
    "// 4. Draw enemies",
    "// 8. Draw active floating text feedback",
  );

  assert.ok(
    game.includes(
      'import { projectFlashAccessibility } from "./flashAccessibility";',
    ),
  );
  assert.ok(
    render.includes(
      "const flashProfile =\n      projectFlashAccessibility(",
    ),
  );
  assert.ok(
    render.includes(
      "statsRef.current?.flashIntensity",
    ),
  );

  const useCount =
    render.split("flashProfile").length - 1;
  assert.ok(
    useCount >= 4,
    "profile should be defined once and supplied to all three draw paths",
  );
});

test("React Canvas receives the persisted flash setting", () => {
  assert.ok(
    game.includes(
      'flashIntensity={stats.flashIntensity || "FULL"}',
    ),
  );
});

test("flash accessibility adoption never conditions gameplay telegraphs", () => {
  const enemies = section(
    canvas,
    "export function drawEnemiesList(",
    "/**\n * Draws all projectiles.",
  );

  const telegraphs = enemies.slice(
    enemies.indexOf(
      "// DRAW WEAPONS CHARGING TELEGRAPHS",
    ),
    enemies.indexOf(
      "// Set normal enemy shadows & glow",
    ),
  );

  assert.ok(telegraphs.includes("EnemyType.DRONE"));
  assert.ok(
    telegraphs.includes("EnemyType.DISRUPTOR"),
  );
  assert.ok(
    telegraphs.includes("EnemyType.BLACKOUT_ELITE"),
  );
  assert.ok(!telegraphs.includes("flashProfile"));
  assert.ok(!telegraphs.includes("flashIntensity"));
});
