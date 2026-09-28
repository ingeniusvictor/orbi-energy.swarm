import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const game = read("src/game/EnergySwarmGame.tsx");
const canvas = read("src/game/EnergySwarmCanvas.tsx");
const runtime = read("src/game/fotonGameplay3DRenderer.ts");

test("game maintains low-cadence threat gaze refs", () => {
  assert.match(
    game,
    /fotonThreatAccumulatorMsRef = useRef\(0\)/,
  );
  assert.match(
    game,
    /fotonThreatTargetIdRef = useRef<string \| null>\(null\)/,
  );
  assert.match(
    game,
    /fotonThreatDirectionRef = useRef\(\{ x: 0, y: 0 \}\)/,
  );
});

test("threat selection runs only after the 160ms cadence threshold", () => {
  assert.match(
    game,
    /fotonThreatAccumulatorMsRef\.current \+= delta/,
  );
  assert.match(
    game,
    /fotonThreatAccumulatorMsRef\.current >=[\s\S]*FOTON_THREAT_REFRESH_MS/,
  );
  assert.match(
    game,
    /selectFotonThreat\([\s\S]*enemiesRef\.current[\s\S]*fotonThreatTargetIdRef\.current/,
  );
});

test("Foton gaze state resets on every new run", () => {
  assert.match(
    game,
    /fotonThreatAccumulatorMsRef\.current = 0/,
  );
  assert.match(
    game,
    /fotonThreatTargetIdRef\.current = null/,
  );
  assert.match(
    game,
    /fotonThreatDirectionRef\.current = \{ x: 0, y: 0 \}/,
  );
});

test("normalized threat direction reaches the GLB frame request", () => {
  assert.match(
    game,
    /drawFoton\([\s\S]*fotonThreatDirectionRef\.current/,
  );
  assert.match(
    canvas,
    /threatDirectionX: threatDirection\.x/,
  );
  assert.match(
    canvas,
    /threatDirectionY: threatDirection\.y/,
  );
  assert.match(
    runtime,
    /request\.threatDirectionX \?\? 0/,
  );
  assert.match(
    runtime,
    /request\.threatDirectionY \?\? 0/,
  );
});

test("threat gaze preserves a forward-facing bounded pose instead of autonomous spin", () => {
  assert.match(runtime, /const neutralYaw = 0\.42/);
  assert.match(runtime, /dx \* 0\.72/);
  assert.match(runtime, /dy \* 0\.34/);
  assert.doesNotMatch(
    runtime,
    /active\.root\.rotation\.y \+=\s*elapsedSeconds \* 0\.58/,
  );
});

test("GLB visual body and surrounding halos are reduced together", () => {
  assert.match(
    runtime,
    /FOTON_GAMEPLAY_DRAW_SIZE = 37\.5/,
  );
  assert.match(
    canvas,
    /23 \+ Math\.sin\(time \* 0\.005\) \* 1\.2/,
  );
  assert.match(
    canvas,
    /ctx\.arc\(x, y, 21\.5, 0, Math\.PI \* 2\)/,
  );
});

test("threat tracking does not mutate combat or enemy state", () => {
  const marker = game.indexOf(
    "// Threat-aware Foton gaze updates at low cadence",
  );
  assert.ok(marker >= 0);
  const section = game.slice(marker, marker + 1500);
  assert.doesNotMatch(
    section,
    /enemy\.x\s*=|enemy\.y\s*=|enemy\.health\s*=|damagePlayer|spawnEnemy/,
  );
});
