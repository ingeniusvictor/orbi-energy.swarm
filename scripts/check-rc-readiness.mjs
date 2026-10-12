import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VALID_CHANNELS = new Set(["alpha", "beta", "rc", "stable"]);

const normalizeManualBlocker = (blocker, index) => ({
  type: "manual",
  id: blocker?.id ?? `manual-${index + 1}`,
  category: blocker?.category ?? "manual",
  issue: blocker?.issue ?? null,
  requirement: blocker?.requirement ?? null,
});

const normalizeEngineeringBlocker = (blocker) => ({
  type: "release-engineering",
  id: String(blocker),
  category: "release-engineering",
  issue: null,
  requirement: String(blocker),
});

export function evaluateRcReadiness({ release, sourceSha = "local" }) {
  if (!release || typeof release !== "object" || Array.isArray(release)) {
    throw new Error("release metadata object is required");
  }

  if (!VALID_CHANNELS.has(release.channel)) {
    throw new Error(`unsupported release channel: ${release.channel}`);
  }

  if (typeof release.releaseCandidateEligible !== "boolean") {
    throw new Error("releaseCandidateEligible must be a boolean");
  }

  if (!Array.isArray(release.manualBlockers)) {
    throw new Error("manualBlockers must be an array");
  }

  if (!Array.isArray(release.pendingReleaseEngineering)) {
    throw new Error("pendingReleaseEngineering must be an array");
  }

  const manualBlockers = release.manualBlockers.map(normalizeManualBlocker);
  const engineeringBlockers = release.pendingReleaseEngineering.map(
    normalizeEngineeringBlocker,
  );
  const blockers = [...manualBlockers, ...engineeringBlockers];

  if (release.releaseCandidateEligible && blockers.length > 0) {
    throw new Error(
      "releaseCandidateEligible cannot be true while blockers remain",
    );
  }

  if (
    (release.channel === "rc" || release.channel === "stable") &&
    release.releaseCandidateEligible !== true
  ) {
    throw new Error(
      `${release.channel} channel requires releaseCandidateEligible=true`,
    );
  }

  if (
    (release.channel === "alpha" || release.channel === "beta") &&
    release.releaseCandidateEligible === true
  ) {
    throw new Error(
      `${release.channel} channel cannot claim RC eligibility; promote explicitly`,
    );
  }

  let decision;
  if (blockers.length > 0) {
    decision = "BLOCKED";
  } else if (release.channel === "rc") {
    decision = "RC";
  } else if (release.channel === "stable") {
    decision = "STABLE";
  } else {
    decision = "ELIGIBLE_FOR_PROMOTION";
  }

  return {
    schemaVersion: 1,
    policy: "orbi-es12-rc-readiness-v1",
    product: release.product ?? null,
    version: release.version ?? null,
    channel: release.channel,
    sourceSha,
    decision,
    releaseCandidateEligible: release.releaseCandidateEligible,
    manualBlockerCount: manualBlockers.length,
    pendingEngineeringCount: engineeringBlockers.length,
    blockers,
  };
}

function parseOutputPath(args) {
  const inline = args.find((arg) => arg.startsWith("--output="));
  if (inline) {
    const value = inline.slice("--output=".length);
    if (!value) throw new Error("--output requires a path");
    return value;
  }

  const index = args.indexOf("--output");
  if (index < 0) return null;
  if (!args[index + 1]) throw new Error("--output requires a path");
  return args[index + 1];
}

export async function runReadinessCli({ args = process.argv.slice(2) } = {}) {
  const release = JSON.parse(await readFile("release/release.json", "utf8"));
  const pkg = JSON.parse(await readFile("package.json", "utf8"));

  if (release.version !== pkg.version) {
    throw new Error(
      `release metadata version ${release.version} != package version ${pkg.version}`,
    );
  }

  const sourceSha =
    process.env.ORBI_RELEASE_SHA ?? process.env.GITHUB_SHA ?? "local";
  const report = evaluateRcReadiness({ release, sourceSha });
  const outputPath = parseOutputPath(args);
  const serialized = `${JSON.stringify(report, null, 2)}\n`;

  if (outputPath) {
    await writeFile(outputPath, serialized, "utf8");
    console.error(
      `RC READINESS: ${report.decision} — evidence=${outputPath}, blockers=${report.blockers.length}`,
    );
  } else {
    process.stdout.write(serialized);
    console.error(
      `RC READINESS: ${report.decision} — blockers=${report.blockers.length}`,
    );
  }

  return report;
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  try {
    await runReadinessCli();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`RC READINESS: FAIL — ${message}`);
    process.exitCode = 1;
  }
}
