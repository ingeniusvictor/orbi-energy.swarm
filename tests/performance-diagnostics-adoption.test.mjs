import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const overlay = readFileSync(
  new URL(
    "../src/components/PerformanceDiagnosticsOverlay.tsx",
    import.meta.url,
  ),
  "utf8",
);

const section = (startMarker, endMarker) => {
  const start = game.indexOf(startMarker);
  const end = game.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start: ${startMarker}`);
  assert.ok(end > start, `Missing end: ${endMarker}`);
  return game.slice(start, end);
};

test("diagnostics is disabled by default and carries a ref for the hot loop", () => {
  assert.match(
    game,
    /performanceDiagnosticsEnabled[\s\S]*useState\(false\)/,
  );
  assert.match(
    game,
    /performanceDiagnosticsEnabledRef = useRef\(false\)/,
  );
});

test("F3 toggles diagnostics before Photo Mode input blocking", () => {
  const keys = section(
    "// --- KEY LISTENER LISTENERS ---",
    "// --- ANDROID / WEB APP LIFECYCLE SAFETY ---",
  );

  const f3 = keys.indexOf('key === "F3"');
  const photo = keys.indexOf("if (isPhotoMode)");

  assert.ok(f3 >= 0);
  assert.ok(photo > f3);
  assert.match(
    keys,
    /togglePerformanceDiagnostics\(\)/,
  );
});

test("profiler clocks only activate when diagnostics are enabled", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  assert.match(
    loop,
    /const diagnosticsActive =[\s\S]*performanceDiagnosticsEnabledRef\.current/,
  );
  assert.match(
    loop,
    /diagnosticsActive[\s\S]*\? performance\.now\(\)[\s\S]*: 0/,
  );
});

test("game loop measures physics and render independently", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  const physicsStart = loop.indexOf(
    "const physicsStartedAt",
  );
  const physics = loop.indexOf(
    "updateEnginePhysics(delta)",
  );
  const renderStart = loop.indexOf(
    "const renderStartedAt",
  );
  const render = loop.indexOf(
    "renderCanvasScene()",
    renderStart,
  );

  assert.ok(physicsStart >= 0);
  assert.ok(physics > physicsStart);
  assert.ok(renderStart > physics);
  assert.ok(render > renderStart);
});

test("diagnostic sample includes live entity pressure and quality", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  for (const token of [
    "enemiesRef.current.length",
    "projectilesRef.current.length",
    "particlesRef.current.length",
    "swarmRef.current.length + 1",
    "qualityPreset",
    "frameHealthRef.current.lastWindow?.status",
  ]) {
    assert.ok(
      loop.includes(token),
      `Missing diagnostics token: ${token}`,
    );
  }
});

test("diagnostics does not auto-change quality or gameplay state", () => {
  const loop = section(
    "const gameLoop =",
    "// --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE",
  );

  assert.doesNotMatch(
    loop,
    /changeQualityPreset|saveGameStats\(|setStats\(/,
  );
});

test("overlay exposes phase timing and entity counts", () => {
  for (const label of [
    "CPU WORK",
    "PHYSICS",
    "RENDER",
    "OVERHEAD",
    "PEAK CPU",
    "ENEMIES",
    "PROJECTILES",
    "PARTICLES",
    "SWARM",
  ]) {
    assert.ok(
      overlay.includes(label),
      `Missing overlay label: ${label}`,
    );
  }
});

test("overlay is non-interactive and screenshot friendly", () => {
  assert.match(
    overlay,
    /pointer-events-none/,
  );
  assert.match(
    overlay,
    /data-performance-diagnostics="true"/,
  );
});

test("game renders diagnostics overlay only while enabled", () => {
  assert.match(
    game,
    /performanceDiagnosticsEnabled && \([\s\S]*<PerformanceDiagnosticsOverlay[\s\S]*snapshot=\{performanceDiagnosticsSnapshot\}/,
  );
});
