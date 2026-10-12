import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readJson = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const pkg = readJson("package.json");
const lock = readJson("package-lock.json");
const release = readJson("release/release.json");
const changelog = read("CHANGELOG.md");
const readme = read("README.md");
const verifier = read("scripts/verify-release.mjs");
const readiness = read("scripts/check-rc-readiness.mjs");
const ci = read(".github/workflows/ci.yml");

test("beta release version is synchronized across package metadata", () => {
  assert.equal(pkg.version, "0.2.0-beta.1");
  assert.equal(lock.version, pkg.version);
  assert.equal(lock.packages[""].version, pkg.version);
  assert.equal(release.version, pkg.version);
});

test("release channel is truthfully beta and not RC eligible", () => {
  assert.equal(release.channel, "beta");
  assert.equal(release.releaseCandidateEligible, false);
  assert.ok(pkg.version.includes("-beta."));
});

test("manual release blockers remain explicit and machine-readable", () => {
  assert.ok(Array.isArray(release.manualBlockers));
  assert.ok(release.manualBlockers.length >= 3);

  const issueBlockers = release.manualBlockers
    .map((blocker) => blocker.issue)
    .filter(Boolean);

  assert.ok(issueBlockers.includes(4));
  assert.ok(issueBlockers.includes(5));
  assert.ok(
    release.manualBlockers.some(
      (blocker) => blocker.category === "android-hardware",
    ),
  );
});

test("I3 completes release engineering without pretending manual certification is done", () => {
  assert.deepEqual(release.pendingReleaseEngineering, []);
  assert.equal(release.automatedCertification.rcReadinessGate, true);
  assert.equal(release.rcReadiness.policyVersion, 1);
  assert.equal(release.rcReadiness.command, "npm run release:readiness");
  assert.equal(release.rcReadiness.expectedDecision, "BLOCKED");
  assert.equal(release.rcReadiness.promotionIsExplicit, true);
  assert.match(
    release.rcReadiness.evidenceArtifactPattern,
    /orbi-energy-swarm-rc-readiness-\{sha\}/,
  );

  assert.equal(release.webDistribution.deploymentTarget, "github-pages");
  assert.equal(release.webDistribution.installability, "pwa");
  assert.equal(release.androidDistribution.strategy, "capacitor-8");
  assert.equal(
    release.androidDistribution.nativePackaging,
    "capacitor-local-bundle",
  );
  assert.equal(release.androidDistribution.targetSdk, 36);
  assert.equal(
    release.androidDistribution.signing,
    "external-secrets-required-for-release",
  );
});

test("changelog contains current beta and preserves recovery baseline history", () => {
  assert.match(changelog, /## \[0\.2\.0-beta\.1\] — 2026-09-27/);
  assert.match(changelog, /This beta marks the transition/);
  assert.match(changelog, /## \[0\.1\.0\] — Recovery baseline/);
  assert.match(changelog, /Issue #4/);
  assert.match(changelog, /Issue #5/);
});

test("README no longer presents the current product as the 0.1.0 baseline", () => {
  assert.match(readme, /ORBI ENERGY SWARM \(v0\.2\.0-beta\.1\)/);
  assert.match(readme, /Release status:\*\* BETA/);
  assert.doesNotMatch(
    readme.split("\n").slice(0, 6).join("\n"),
    /v0\.1\.0-prototype-recovery-baseline/,
  );
});

test("release verifier enforces parity, blocker safety and explicit promotion", () => {
  assert.match(verifier, /lock\.version !== pkg\.version/);
  assert.match(verifier, /rootLock\?\.version !== pkg\.version/);
  assert.match(verifier, /release\.version !== pkg\.version/);
  assert.match(verifier, /CHANGELOG entry missing/);
  assert.match(verifier, /pendingReleaseEngineering must be an array/);
  assert.match(
    verifier,
    /release\.releaseCandidateEligible === true && blockerCount > 0/,
  );
  assert.match(
    verifier,
    /release\.channel === "rc" \|\| release\.channel === "stable"/,
  );
  assert.match(verifier, /SemVer channel/);
});

test("readiness evaluator is machine-readable and fail-closed", () => {
  assert.match(readiness, /BLOCKED/);
  assert.match(readiness, /ELIGIBLE_FOR_PROMOTION/);
  assert.match(readiness, /decision = "RC"/);
  assert.match(readiness, /sourceSha/);
  assert.match(readiness, /releaseCandidateEligible cannot be true/);
});

test("package exposes release gates and CI emits readiness evidence after build", () => {
  assert.equal(
    pkg.scripts["release:verify"],
    "node scripts/verify-release.mjs",
  );
  assert.equal(
    pkg.scripts["release:readiness"],
    "node scripts/check-rc-readiness.mjs",
  );

  const releaseGate = ci.indexOf("name: Release contract");
  const buildGate = ci.indexOf("name: Production build");
  const readinessGate = ci.indexOf("name: RC readiness evidence");
  const uploadGate = ci.indexOf("name: Upload RC readiness evidence");

  assert.ok(releaseGate >= 0);
  assert.ok(buildGate > releaseGate);
  assert.ok(readinessGate > buildGate);
  assert.ok(uploadGate > readinessGate);
  assert.match(ci, /run: npm run release:verify/);
  assert.match(ci, /npm run release:readiness -- --output release-readiness\.json/);
  assert.ok(ci.includes("ORBI_RELEASE_SHA: ${{ github.sha }}"));
  assert.ok(ci.includes("orbi-energy-swarm-rc-readiness-${{ github.sha }}"));
  assert.ok(ci.includes("path: release-readiness.json"));
});

test("beta metadata does not claim stable or RC release readiness", () => {
  assert.notEqual(release.channel, "rc");
  assert.notEqual(release.channel, "stable");
  assert.equal(release.releaseCandidateEligible, false);
  assert.equal(release.rcReadiness.expectedDecision, "BLOCKED");
});
