import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VALID_STATUSES = new Set(["PENDING", "PASS", "FAIL", "INVESTIGATE"]);
const CANONICAL_SHA = /^[0-9a-f]{40}$/;

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const hasValidTimestamp = (value) =>
  nonEmptyString(value) && Number.isFinite(Date.parse(value));

const expectedRollup = (criteria) => {
  const statuses = criteria.map((criterion) => criterion.status);
  if (statuses.includes("FAIL")) return "FAIL";
  if (statuses.includes("INVESTIGATE")) return "INVESTIGATE";
  if (statuses.length > 0 && statuses.every((status) => status === "PASS")) {
    return "PASS";
  }
  return "PENDING";
};

export function evaluateManualCertificationDossier({ release, dossier }) {
  const errors = [];

  if (!isRecord(release)) errors.push("release metadata object is required");
  if (!isRecord(dossier)) errors.push("manual certification dossier object is required");
  if (errors.length > 0) return { valid: false, decision: "INVALID", errors, blockers: [] };

  if (dossier.schemaVersion !== 1) errors.push("dossier schemaVersion must be 1");
  if (dossier.product !== release.product) errors.push("dossier product must match release product");
  if (dossier.version !== release.version) errors.push("dossier version must match release version");
  if (!Array.isArray(release.manualBlockers)) errors.push("release.manualBlockers must be an array");
  if (!Array.isArray(dossier.blockers)) errors.push("dossier.blockers must be an array");

  if (errors.length > 0) return { valid: false, decision: "INVALID", errors, blockers: [] };

  const expected = new Map(release.manualBlockers.map((blocker) => [blocker.id, blocker]));
  const seen = new Set();
  const reports = [];

  for (const blocker of dossier.blockers) {
    if (!isRecord(blocker) || !nonEmptyString(blocker.id)) {
      errors.push("every dossier blocker must have a non-empty id");
      continue;
    }
    if (seen.has(blocker.id)) {
      errors.push(`duplicate dossier blocker: ${blocker.id}`);
      continue;
    }
    seen.add(blocker.id);

    const releaseBlocker = expected.get(blocker.id);
    if (!releaseBlocker) {
      errors.push(`unknown dossier blocker: ${blocker.id}`);
      continue;
    }
    if (blocker.category !== releaseBlocker.category) {
      errors.push(`${blocker.id}: category must match release metadata`);
    }
    if (!VALID_STATUSES.has(blocker.status)) {
      errors.push(`${blocker.id}: unsupported status ${blocker.status}`);
    }
    if (!Array.isArray(blocker.criteria) || blocker.criteria.length === 0) {
      errors.push(`${blocker.id}: criteria must be a non-empty array`);
      continue;
    }
    if (!Array.isArray(blocker.evidence)) {
      errors.push(`${blocker.id}: evidence must be an array`);
      continue;
    }

    const criterionIds = new Set();
    for (const criterion of blocker.criteria) {
      if (!isRecord(criterion) || !nonEmptyString(criterion.id)) {
        errors.push(`${blocker.id}: every criterion must have a non-empty id`);
        continue;
      }
      if (criterionIds.has(criterion.id)) {
        errors.push(`${blocker.id}: duplicate criterion ${criterion.id}`);
      }
      criterionIds.add(criterion.id);
      if (!VALID_STATUSES.has(criterion.status)) {
        errors.push(`${blocker.id}/${criterion.id}: unsupported status ${criterion.status}`);
      }
    }

    const rollup = expectedRollup(blocker.criteria);
    if (blocker.status !== rollup) {
      errors.push(`${blocker.id}: status ${blocker.status} contradicts criteria rollup ${rollup}`);
    }

    const hasObservedResult = blocker.criteria.some(
      (criterion) => criterion.status !== "PENDING",
    );
    if (hasObservedResult) {
      if (!CANONICAL_SHA.test(blocker.testedSha ?? "")) {
        errors.push(`${blocker.id}: observed evidence requires a canonical 40-character testedSha`);
      }
      if (!hasValidTimestamp(blocker.testedAt)) {
        errors.push(`${blocker.id}: observed evidence requires a valid testedAt timestamp`);
      }
      if (!nonEmptyString(blocker.reviewer)) {
        errors.push(`${blocker.id}: observed evidence requires a reviewer`);
      }
      if (blocker.evidence.length === 0 || blocker.evidence.some((item) => !nonEmptyString(item))) {
        errors.push(`${blocker.id}: observed evidence requires non-empty evidence references`);
      }
    } else {
      if (blocker.testedSha !== null || blocker.testedAt !== null || blocker.reviewer !== null) {
        errors.push(`${blocker.id}: untouched PENDING evidence must not fabricate SHA, timestamp or reviewer`);
      }
      if (blocker.evidence.length !== 0) {
        errors.push(`${blocker.id}: untouched PENDING evidence must not include evidence references`);
      }
    }

    reports.push({
      id: blocker.id,
      category: blocker.category,
      status: blocker.status,
      criteriaCount: blocker.criteria.length,
      completedCriteria: blocker.criteria.filter((criterion) => criterion.status === "PASS").length,
      testedSha: blocker.testedSha ?? null,
    });
  }

  for (const id of expected.keys()) {
    if (!seen.has(id)) errors.push(`missing dossier blocker: ${id}`);
  }

  const valid = errors.length === 0;
  const allPass = valid && reports.length === expected.size && reports.every((blocker) => blocker.status === "PASS");

  return {
    schemaVersion: 1,
    valid,
    decision: valid
      ? allPass
        ? "DOSSIER_COMPLETE_FOR_RECONCILIATION"
        : "DOSSIER_PENDING"
      : "INVALID",
    releaseVersion: release.version ?? null,
    blockerCount: reports.length,
    passCount: reports.filter((blocker) => blocker.status === "PASS").length,
    blockers: reports,
    errors,
  };
}

export async function runManualCertificationCli() {
  const release = JSON.parse(await readFile("release/release.json", "utf8"));
  const dossier = JSON.parse(await readFile("release/manual-certification.json", "utf8"));
  const report = evaluateManualCertificationDossier({ release, dossier });

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.valid) {
    process.exitCode = 1;
  }
  return report;
}

const isMain =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  try {
    await runManualCertificationCli();
  } catch (error) {
    console.error(`MANUAL CERTIFICATION: FAIL — ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
