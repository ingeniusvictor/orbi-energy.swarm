import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { evaluateRcReadiness } from "../scripts/check-rc-readiness.mjs";

const release = JSON.parse(
  readFileSync(new URL("../release/release.json", import.meta.url), "utf8"),
);

const clone = (value) => JSON.parse(JSON.stringify(value));

test("current beta release remains truthfully BLOCKED by manual certification", () => {
  const report = evaluateRcReadiness({
    release,
    sourceSha: "57a9d0100a218295032d4898529600df2cd10905",
  });

  assert.equal(report.decision, "BLOCKED");
  assert.equal(report.version, "0.2.0-beta.1");
  assert.equal(report.channel, "beta");
  assert.equal(report.releaseCandidateEligible, false);
  assert.equal(
    report.sourceSha,
    "57a9d0100a218295032d4898529600df2cd10905",
  );

  const issues = report.blockers.map((blocker) => blocker.issue).filter(Boolean);
  assert.ok(issues.includes(4));
  assert.ok(issues.includes(5));
  assert.ok(
    report.blockers.some((blocker) => blocker.category === "android-hardware"),
  );
});

test("completed I3 release engineering is separate from unresolved manual blockers", () => {
  assert.deepEqual(release.pendingReleaseEngineering, []);
  assert.equal(release.manualBlockers.length, 3);
  assert.equal(release.rcReadiness.policyVersion, 1);
  assert.equal(release.rcReadiness.expectedDecision, "BLOCKED");
  assert.equal(release.rcReadiness.promotionIsExplicit, true);
});

test("clear beta metadata becomes ELIGIBLE_FOR_PROMOTION without mutation", () => {
  const candidate = clone(release);
  candidate.manualBlockers = [];
  candidate.pendingReleaseEngineering = [];
  candidate.channel = "beta";
  candidate.releaseCandidateEligible = false;

  const report = evaluateRcReadiness({ release: candidate });

  assert.equal(report.decision, "ELIGIBLE_FOR_PROMOTION");
  assert.equal(candidate.channel, "beta");
  assert.equal(candidate.releaseCandidateEligible, false);
});

test("explicit RC metadata is accepted only with eligibility and zero blockers", () => {
  const candidate = clone(release);
  candidate.version = "0.2.0-rc.1";
  candidate.channel = "rc";
  candidate.releaseCandidateEligible = true;
  candidate.manualBlockers = [];
  candidate.pendingReleaseEngineering = [];

  const report = evaluateRcReadiness({ release: candidate });
  assert.equal(report.decision, "RC");
  assert.equal(report.blockers.length, 0);
});

test("RC metadata without explicit eligibility fails closed", () => {
  const candidate = clone(release);
  candidate.version = "0.2.0-rc.1";
  candidate.channel = "rc";
  candidate.releaseCandidateEligible = false;
  candidate.manualBlockers = [];
  candidate.pendingReleaseEngineering = [];

  assert.throws(
    () => evaluateRcReadiness({ release: candidate }),
    /rc channel requires releaseCandidateEligible=true/,
  );
});

test("eligibility with unresolved blockers fails closed", () => {
  const candidate = clone(release);
  candidate.channel = "rc";
  candidate.releaseCandidateEligible = true;

  assert.throws(
    () => evaluateRcReadiness({ release: candidate }),
    /cannot be true while blockers remain/,
  );
});

test("beta metadata cannot claim eligibility without an explicit promotion", () => {
  const candidate = clone(release);
  candidate.manualBlockers = [];
  candidate.pendingReleaseEngineering = [];
  candidate.channel = "beta";
  candidate.releaseCandidateEligible = true;

  assert.throws(
    () => evaluateRcReadiness({ release: candidate }),
    /beta channel cannot claim RC eligibility/,
  );
});
