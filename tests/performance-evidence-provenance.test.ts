import assert from "node:assert/strict";
import test from "node:test";

import {
  LOCAL_BUILD_SHA,
  LOCAL_PRODUCT_VERSION,
  getEmbeddedBuildProvenance,
  isCanonicalBuildSha,
  isReleaseProductVersion,
} from "../src/game/buildProvenance.ts";
import { analyzePerformanceEvidenceProvenance } from "../src/game/performanceEvidenceCertification.ts";

const SHA_A = "716b663005d1a6b46927812b9741e8bae4643a9f";
const SHA_B = "1eba5e459860c6562446da8cc449157aaddbaec7";

const evidence = (buildSha = SHA_A, productVersion = "0.2.0-beta.1") => ({
  runtime: {
    buildSha,
    productVersion,
  },
});

test("canonical build provenance accepts Git SHA and non-local product version", () => {
  assert.equal(isCanonicalBuildSha(SHA_A), true);
  assert.equal(isCanonicalBuildSha("short-sha"), false);
  assert.equal(isReleaseProductVersion("0.2.0-beta.1"), true);
  assert.equal(isReleaseProductVersion(LOCAL_PRODUCT_VERSION), false);
});

test("Node/test fallback is explicitly local and cannot masquerade as canonical", () => {
  const provenance = getEmbeddedBuildProvenance();
  assert.equal(provenance.buildSha, LOCAL_BUILD_SHA);
  assert.equal(provenance.productVersion, LOCAL_PRODUCT_VERSION);
  assert.equal(isCanonicalBuildSha(provenance.buildSha), false);
  assert.equal(isReleaseProductVersion(provenance.productVersion), false);
});

test("three captures from the same deployed build are provenance-comparable", () => {
  const report = analyzePerformanceEvidenceProvenance({
    baseline: evidence(),
    gaiaL1: evidence(),
    gaiaL2Plus: evidence(),
  });

  assert.equal(report.valid, true);
  assert.equal(report.comparable, true);
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.mismatches, []);
  assert.equal(report.baseline.buildSha, SHA_A);
});

test("build SHA mismatch prevents certification comparability", () => {
  const report = analyzePerformanceEvidenceProvenance({
    baseline: evidence(SHA_A),
    gaiaL1: evidence(SHA_B),
    gaiaL2Plus: evidence(SHA_A),
  });

  assert.equal(report.valid, false);
  assert.equal(report.comparable, false);
  assert.match(report.mismatches.join("\n"), /build SHA differs/);
});

test("product version mismatch prevents certification comparability", () => {
  const report = analyzePerformanceEvidenceProvenance({
    baseline: evidence(SHA_A, "0.2.0-beta.1"),
    gaiaL1: evidence(SHA_A, "0.2.0-beta.2"),
    gaiaL2Plus: evidence(SHA_A, "0.2.0-beta.1"),
  });

  assert.equal(report.valid, false);
  assert.match(report.mismatches.join("\n"), /product version differs/);
});

test("missing or local provenance is invalid certification evidence", () => {
  const missing = analyzePerformanceEvidenceProvenance({
    baseline: { runtime: {} },
    gaiaL1: evidence(),
    gaiaL2Plus: evidence(),
  });
  assert.equal(missing.valid, false);
  assert.match(missing.errors.join("\n"), /canonical 40-character Git SHA/);

  const local = analyzePerformanceEvidenceProvenance({
    baseline: evidence(LOCAL_BUILD_SHA, LOCAL_PRODUCT_VERSION),
    gaiaL1: evidence(),
    gaiaL2Plus: evidence(),
  });
  assert.equal(local.valid, false);
  assert.match(local.errors.join("\n"), /non-local product build/);
});
