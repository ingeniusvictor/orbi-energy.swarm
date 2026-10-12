import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { evaluateManualCertificationDossier } from "../scripts/verify-manual-certification.mjs";

const readJson = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const clone = (value) => JSON.parse(JSON.stringify(value));

const release = readJson("release/release.json");
const dossier = readJson("release/manual-certification.json");
const canonicalSha = "7d6f5b0a54b59d97a7b3883abf53f6035e82518a";

const attachObservedEvidence = (blocker) => {
  blocker.testedSha = canonicalSha;
  blocker.testedAt = "2026-10-12T05:30:00.000Z";
  blocker.reviewer = "human-reviewer";
  blocker.evidence = ["issue-comment-or-artifact-reference"];
};

test("I4 starts with an honest PENDING dossier for every release blocker", () => {
  const report = evaluateManualCertificationDossier({ release, dossier });

  assert.equal(report.valid, true);
  assert.equal(report.decision, "DOSSIER_PENDING");
  assert.equal(report.blockerCount, 3);
  assert.equal(report.passCount, 0);
  assert.deepEqual(
    new Set(report.blockers.map((blocker) => blocker.id)),
    new Set(release.manualBlockers.map((blocker) => blocker.id)),
  );

  for (const blocker of dossier.blockers) {
    assert.equal(blocker.status, "PENDING");
    assert.equal(blocker.testedSha, null);
    assert.equal(blocker.testedAt, null);
    assert.equal(blocker.reviewer, null);
    assert.deepEqual(blocker.evidence, []);
    assert.ok(blocker.criteria.every((criterion) => criterion.status === "PENDING"));
  }
});

test("a completed criterion requires real provenance and evidence references", () => {
  const candidate = clone(dossier);
  const blocker = candidate.blockers[0];
  blocker.criteria[0].status = "PASS";

  const report = evaluateManualCertificationDossier({ release, dossier: candidate });
  assert.equal(report.valid, false);
  assert.equal(report.decision, "INVALID");
  assert.ok(report.errors.some((error) => error.includes("testedSha")));
  assert.ok(report.errors.some((error) => error.includes("reviewer")));
  assert.ok(report.errors.some((error) => error.includes("evidence references")));
});

test("overall PASS is impossible while any declared criterion remains pending", () => {
  const candidate = clone(dossier);
  const blocker = candidate.blockers[0];
  blocker.status = "PASS";
  attachObservedEvidence(blocker);
  blocker.criteria[0].status = "PASS";

  const report = evaluateManualCertificationDossier({ release, dossier: candidate });
  assert.equal(report.valid, false);
  assert.ok(report.errors.some((error) => error.includes("criteria rollup PENDING")));
});

test("FAIL and INVESTIGATE roll up deterministically from observed criteria", () => {
  for (const status of ["FAIL", "INVESTIGATE"]) {
    const candidate = clone(dossier);
    const blocker = candidate.blockers[1];
    blocker.criteria[0].status = status;
    blocker.status = status;
    attachObservedEvidence(blocker);

    const report = evaluateManualCertificationDossier({ release, dossier: candidate });
    assert.equal(report.valid, true, report.errors.join("\n"));
    assert.equal(report.decision, "DOSSIER_PENDING");
  }
});

test("all blockers may become complete only with all criteria PASS and evidence", () => {
  const candidate = clone(dossier);
  for (const blocker of candidate.blockers) {
    blocker.status = "PASS";
    for (const criterion of blocker.criteria) criterion.status = "PASS";
    attachObservedEvidence(blocker);
  }

  const report = evaluateManualCertificationDossier({ release, dossier: candidate });
  assert.equal(report.valid, true, report.errors.join("\n"));
  assert.equal(report.decision, "DOSSIER_COMPLETE_FOR_RECONCILIATION");
  assert.equal(report.passCount, 3);
});

test("a complete dossier still does not mutate release blockers or RC metadata", () => {
  assert.equal(release.version, "0.2.0-beta.1");
  assert.equal(release.channel, "beta");
  assert.equal(release.releaseCandidateEligible, false);
  assert.equal(release.manualBlockers.length, 3);
});

test("missing, duplicate and unknown blocker ids fail closed", () => {
  const missing = clone(dossier);
  missing.blockers.pop();
  assert.equal(
    evaluateManualCertificationDossier({ release, dossier: missing }).valid,
    false,
  );

  const duplicate = clone(dossier);
  duplicate.blockers.push(clone(duplicate.blockers[0]));
  assert.equal(
    evaluateManualCertificationDossier({ release, dossier: duplicate }).valid,
    false,
  );

  const unknown = clone(dossier);
  unknown.blockers[0].id = "unknown-blocker";
  assert.equal(
    evaluateManualCertificationDossier({ release, dossier: unknown }).valid,
    false,
  );
});

test("I4 dossier explicitly covers visual, play-feel, Android hardware and GAIA physical review", () => {
  const visual = dossier.blockers.find((blocker) => blocker.id === "issue-4-visual-certification");
  const playfeel = dossier.blockers.find((blocker) => blocker.id === "issue-5-infinite-playfeel");
  const android = dossier.blockers.find((blocker) => blocker.id === "es-11-real-device");

  assert.ok(visual.criteria.some((criterion) => criterion.id === "ultrawide-2560x1080"));
  assert.ok(visual.criteria.some((criterion) => criterion.id === "compact-android-landscape"));
  assert.ok(playfeel.criteria.some((criterion) => criterion.id === "sectors-101-plus-seeded-endless"));
  assert.ok(playfeel.criteria.some((criterion) => criterion.id === "challenge-not-pure-stat-scaling"));
  assert.ok(android.criteria.some((criterion) => criterion.id === "thermal-sustained-session"));
  assert.ok(android.criteria.some((criterion) => criterion.id === "battery-sustained-session"));
  assert.ok(android.criteria.some((criterion) => criterion.id === "gaia-runtime-physical-review-issue-202"));
});
