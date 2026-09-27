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

test("pending ES-12 release engineering work is explicit", () => {
  assert.deepEqual(release.pendingReleaseEngineering, [
    "web-deployment-target",
    "pwa-or-native-wrapper-decision",
    "android-packaging-pipeline",
    "release-candidate-certification",
  ]);
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

test("release verifier enforces parity and RC blocker safety", () => {
  assert.match(verifier, /lock\.version !== pkg\.version/);
  assert.match(verifier, /rootLock\?\.version !== pkg\.version/);
  assert.match(verifier, /release\.version !== pkg\.version/);
  assert.match(verifier, /CHANGELOG entry missing/);
  assert.match(
    verifier,
    /release\.releaseCandidateEligible === true[\s\S]*release\.manualBlockers\.length > 0/,
  );
  assert.match(
    verifier,
    /release\.channel === "rc"[\s\S]*release\.releaseCandidateEligible !== true/,
  );
});

test("package exposes release verifier and CI executes it before production build", () => {
  assert.equal(
    pkg.scripts["release:verify"],
    "node scripts/verify-release.mjs",
  );

  const releaseGate = ci.indexOf("name: Release contract");
  const buildGate = ci.indexOf("name: Production build");
  assert.ok(releaseGate >= 0);
  assert.ok(buildGate > releaseGate);
  assert.match(ci, /run: npm run release:verify/);
});

test("beta metadata does not claim stable or RC release readiness", () => {
  assert.notEqual(release.channel, "rc");
  assert.notEqual(release.channel, "stable");
  assert.equal(release.releaseCandidateEligible, false);
});
