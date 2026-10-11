import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const overlay = readFileSync(
  new URL("../src/components/PerformanceDiagnosticsOverlay.tsx", import.meta.url),
  "utf8",
);
const recorder = readFileSync(
  new URL("../src/game/performanceEvidenceRecorder.ts", import.meta.url),
  "utf8",
);

test("F4 owns evidence control while F3 remains diagnostics control", () => {
  assert.match(game, /if \(key === "F3"\)[\s\S]{0,140}?togglePerformanceDiagnostics\(\)/);
  assert.match(game, /if \(key === "F4"\)[\s\S]{0,140}?handlePerformanceEvidenceHotkey\(\)/);
});

test("recorder consumes existing diagnostics snapshots instead of adding a sampling loop", () => {
  const snapshotStart = game.indexOf("if (diagnostics.snapshot) {");
  assert.ok(snapshotStart >= 0);
  const snapshotSection = game.slice(snapshotStart, snapshotStart + 1800);
  assert.match(snapshotSection, /appendPerformanceEvidenceSample\(/);

  assert.doesNotMatch(recorder, /setInterval\(|setTimeout\(|requestAnimationFrame\(/);
  assert.match(recorder, /PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS = 500/);
  assert.match(recorder, /PERFORMANCE_EVIDENCE_TARGET_SAMPLES = 30/);
});

test("evidence integration adds no entity collection scan", () => {
  const forbidden = /(?:enemiesRef|swarmRef|projectilesRef|particlesRef)\.current\.(?:find|filter|reduce|some|map|forEach)\(/;
  assert.doesNotMatch(recorder, forbidden);

  const snapshotStart = game.indexOf("if (diagnostics.snapshot) {");
  const snapshotSection = game.slice(snapshotStart, snapshotStart + 1800);
  assert.doesNotMatch(snapshotSection, forbidden);
});

test("F3 overlay exposes bounded evidence progress and export readiness", () => {
  for (const token of ["EVIDENCE", "REC", "READY", "F4 START", "F4 EXPORT"]) {
    assert.ok(overlay.includes(token), `missing evidence overlay token ${token}`);
  }
  assert.match(overlay, /data-performance-evidence="true"/);
});

test("export stays local and contains browser/runtime metadata", () => {
  assert.match(recorder, /pageUrl/);
  assert.match(recorder, /userAgent/);
  assert.match(recorder, /viewportWidth/);
  assert.match(recorder, /viewportHeight/);
  assert.match(recorder, /devicePixelRatio/);
  assert.match(recorder, /Blob\(/);
  assert.doesNotMatch(recorder, /fetch\(|XMLHttpRequest|WebSocket/);
});
