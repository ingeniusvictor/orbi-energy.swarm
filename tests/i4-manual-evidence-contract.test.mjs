import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const readJson = (path) => JSON.parse(read(path));

const pkg = readJson("package.json");
const release = readJson("release/release.json");
const dossier = readJson("release/manual-certification.json");
const ci = read(".github/workflows/ci.yml");
const runbook = read("docs/MANUAL_RC_CERTIFICATION.md");
const viewport = read("docs/VIEWPORT_CERTIFICATION.md");

test("I4 exposes a canonical manual evidence verifier without changing beta status", () => {
  assert.equal(
    pkg.scripts["release:evidence:verify"],
    "node scripts/verify-manual-certification.mjs",
  );
  assert.equal(release.version, "0.2.0-beta.1");
  assert.equal(release.channel, "beta");
  assert.equal(release.releaseCandidateEligible, false);
  assert.equal(release.rcReadiness.expectedDecision, "BLOCKED");
});

test("release metadata binds the dossier while all three manual blockers remain", () => {
  assert.equal(release.manualCertification.schemaVersion, 1);
  assert.equal(
    release.manualCertification.dossier,
    "release/manual-certification.json",
  );
  assert.equal(
    release.manualCertification.verificationCommand,
    "npm run release:evidence:verify",
  );
  assert.equal(
    release.manualCertification.expectedDecision,
    "DOSSIER_PENDING",
  );
  assert.equal(release.manualCertification.promotionRequiresDossierPass, true);

  assert.deepEqual(
    release.manualBlockers.map((blocker) => blocker.id),
    [
      "issue-4-visual-certification",
      "issue-5-infinite-playfeel",
      "es-11-real-device",
    ],
  );
});

test("committed I4 dossier begins pending without fabricated provenance", () => {
  assert.equal(dossier.schemaVersion, 1);
  assert.equal(dossier.version, release.version);
  assert.equal(dossier.blockers.length, 3);

  for (const blocker of dossier.blockers) {
    assert.equal(blocker.status, "PENDING");
    assert.equal(blocker.testedSha, null);
    assert.equal(blocker.testedAt, null);
    assert.equal(blocker.reviewer, null);
    assert.deepEqual(blocker.evidence, []);
  }
});

test("CI verifies the manual dossier before build and RC readiness", () => {
  const releaseGate = ci.indexOf("name: Release contract");
  const manualGate = ci.indexOf("name: Manual certification dossier");
  const buildGate = ci.indexOf("name: Production build");
  const readinessGate = ci.indexOf("name: RC readiness evidence");

  assert.ok(releaseGate >= 0);
  assert.ok(manualGate > releaseGate);
  assert.ok(buildGate > manualGate);
  assert.ok(readinessGate > buildGate);
  assert.match(ci, /run: npm run release:evidence:verify/);
});

test("manual runbook never treats automation as a human PASS", () => {
  assert.match(runbook, /Do not infer a human PASS from automated tests/);
  assert.match(runbook, /does not replace the human\/device decision/);
  assert.match(runbook, /DOSSIER_COMPLETE_FOR_RECONCILIATION/);
  assert.match(runbook, /does \*\*not\*\* make the product an RC/);
});

test("viewport certification now requires a SHA-matched Pages review", () => {
  assert.match(viewport, /Web Beta \/ Pages/);
  assert.match(viewport, /exact candidate SHA/);
  assert.match(viewport, /does not close Issue #4/);
  assert.doesNotMatch(
    viewport,
    /does not currently document a canonical deployed preview URL/,
  );
});
