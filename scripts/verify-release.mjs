import { readFile } from "node:fs/promises";

const readJson = async (path) =>
  JSON.parse(await readFile(path, "utf8"));

const fail = (message) => {
  console.error(`RELEASE VERIFY: FAIL — ${message}`);
  process.exitCode = 1;
};

const pkg = await readJson("package.json");
const lock = await readJson("package-lock.json");
const release = await readJson("release/release.json");
const changelog = await readFile("CHANGELOG.md", "utf8");

const rootLock = lock.packages?.[""];

if (!pkg.version) fail("package.json version missing");
if (lock.version !== pkg.version) {
  fail(`package-lock version ${lock.version} != package version ${pkg.version}`);
}
if (rootLock?.version !== pkg.version) {
  fail(`root lock package version ${rootLock?.version} != package version ${pkg.version}`);
}
if (release.version !== pkg.version) {
  fail(`release metadata version ${release.version} != package version ${pkg.version}`);
}
if (!changelog.includes(`## [${pkg.version}]`)) {
  fail(`CHANGELOG entry missing for ${pkg.version}`);
}

if (!["alpha", "beta", "rc", "stable"].includes(release.channel)) {
  fail(`unsupported release channel: ${release.channel}`);
}

if (!Array.isArray(release.manualBlockers)) {
  fail("manualBlockers must be an array");
}

if (
  release.releaseCandidateEligible === true &&
  release.manualBlockers.length > 0
) {
  fail("RC eligibility cannot be true while manual blockers remain");
}

if (
  release.channel === "rc" &&
  release.releaseCandidateEligible !== true
) {
  fail("RC channel requires releaseCandidateEligible=true");
}

if (
  release.channel === "stable" &&
  (release.releaseCandidateEligible !== true ||
    release.manualBlockers.length > 0)
) {
  fail("stable channel requires RC eligibility and zero blockers");
}

if (!pkg.version.includes("-beta.") || release.channel !== "beta") {
  fail("0.2 beta contract requires matching beta SemVer and channel");
}

if (process.exitCode) process.exit();

console.log(
  `RELEASE VERIFY: PASS — ${release.product} ${release.version} [${release.channel.toUpperCase()}], blockers=${release.manualBlockers.length}`,
);
