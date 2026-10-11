import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const vite = readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");
const pages = readFileSync(
  new URL("../.github/workflows/pages.yml", import.meta.url),
  "utf8",
);
const provenance = readFileSync(
  new URL("../src/game/buildProvenance.ts", import.meta.url),
  "utf8",
);
const recorder = readFileSync(
  new URL("../src/game/performanceEvidenceRecorder.ts", import.meta.url),
  "utf8",
);
const certification = readFileSync(
  new URL("../src/game/performanceEvidenceCertification.ts", import.meta.url),
  "utf8",
);

test("Vite exposes compile-time build SHA and package version constants", () => {
  assert.match(vite, /__ORBI_BUILD_SHA__/);
  assert.match(vite, /__ORBI_PRODUCT_VERSION__/);
  assert.match(vite, /process\.env\.ORBI_BUILD_SHA/);
  assert.match(vite, /process\.env\.npm_package_version/);
  assert.match(vite, /local-development/);
  assert.match(vite, /0\.0\.0-local/);
});

test("Pages binds evidence build SHA to the exact canonical revision it checks out", () => {
  const canonicalRevision = /github\.event\.workflow_run\.head_sha \|\| github\.sha/g;
  const matches = pages.match(canonicalRevision) ?? [];
  assert.ok(matches.length >= 2, "checkout and ORBI_BUILD_SHA must share the same canonical expression");
  assert.match(
    pages,
    /ORBI_BUILD_SHA: \$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/,
  );
});

test("F4 metadata embeds compile-time provenance without runtime network work", () => {
  assert.match(recorder, /\.\.\.getEmbeddedBuildProvenance\(\)/);
  assert.match(provenance, /buildSha/);
  assert.match(provenance, /productVersion/);
  for (const source of [provenance, recorder, certification]) {
    assert.doesNotMatch(
      source,
      /fetch\(|XMLHttpRequest|WebSocket|setInterval\(|setTimeout\(|requestAnimationFrame\(/,
    );
  }
});

test("certification blocks missing or mismatched build provenance", () => {
  assert.match(certification, /40-character Git SHA/);
  assert.match(certification, /product version differs from baseline/);
  assert.match(certification, /build SHA differs from baseline/);
  assert.match(certification, /triage = "INVALID"/);
  assert.match(certification, /triage = "ENVIRONMENT_MISMATCH"/);
});
