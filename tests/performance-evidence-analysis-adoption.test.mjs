import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const analyzer = readFileSync(
  new URL("../src/game/performanceEvidenceAnalysis.ts", import.meta.url),
  "utf8",
);
const recorder = readFileSync(
  new URL("../src/game/performanceEvidenceRecorder.ts", import.meta.url),
  "utf8",
);
const cli = readFileSync(
  new URL("../scripts/analyze-gaia-evidence.ts", import.meta.url),
  "utf8",
);
const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
const docs = readFileSync(
  new URL("../docs/GAIA_EVIDENCE_ANALYZER.md", import.meta.url),
  "utf8",
);

test("evidence analyzer imports canonical engine and recorder thresholds", () => {
  for (const token of [
    "FRAME_HEALTH_WINDOW_MS",
    "FRAME_HEALTH_SLOW_FRAME_MS",
    "FRAME_HEALTH_CRITICAL_FRAME_MS",
    "FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS",
    "PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS",
    "PERFORMANCE_EVIDENCE_TARGET_SAMPLES",
  ]) {
    assert.ok(analyzer.includes(token), `missing canonical token ${token}`);
  }
});

test("analyzer never fabricates an automatic runtime PASS", () => {
  assert.match(analyzer, /READY_FOR_MANUAL_REVIEW/);
  assert.match(analyzer, /manualWindowReviewRequired: true/);
  assert.doesNotMatch(analyzer, /AUTO_PASS|CERTIFIED_PASS/);
  assert.match(docs, /not an automatic PASS/i);
  assert.match(docs, /must not reconstruct or claim exact health windows/i);
});

test("offline CLI is local-file only and exposed through npm", () => {
  assert.equal(
    packageJson.scripts["evidence:analyze"],
    "tsx scripts/analyze-gaia-evidence.ts",
  );
  assert.match(cli, /readFileSync/);
  assert.match(cli, /analyzePerformanceEvidenceBundle/);
  assert.doesNotMatch(cli, /fetch\(|XMLHttpRequest|WebSocket|https?:\/\//);
  assert.doesNotMatch(analyzer, /fetch\(|XMLHttpRequest|WebSocket/);
});

test("F4 evidence alignment discards exactly the first post-start snapshot", () => {
  assert.match(recorder, /skipNextSnapshot: true/);
  assert.match(
    recorder,
    /if \(state\.skipNextSnapshot\)[\s\S]{0,180}?skipNextSnapshot: false/,
  );
  assert.match(docs, /discards the first diagnostics snapshot after F4/i);
});

test("analysis remains off the runtime sampling and render paths", () => {
  assert.doesNotMatch(
    analyzer,
    /setInterval\(|setTimeout\(|requestAnimationFrame\(/,
  );
  assert.doesNotMatch(
    cli,
    /setInterval\(|setTimeout\(|requestAnimationFrame\(/,
  );
});
