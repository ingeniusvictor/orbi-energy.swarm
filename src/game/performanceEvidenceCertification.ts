import {
  isCanonicalBuildSha,
  isReleaseProductVersion,
} from "./buildProvenance";
import {
  analyzePerformanceEvidenceBundle,
  type PerformanceEvidenceBundleReport,
  type PerformanceEvidenceTriage,
} from "./performanceEvidenceAnalysis";

export type PerformanceEvidenceCertificationScenario =
  | "BASELINE"
  | "GAIA_L1"
  | "GAIA_L2_PLUS";

export interface PerformanceEvidenceScenarioProvenance {
  scenario: PerformanceEvidenceCertificationScenario;
  buildSha: string | null;
  productVersion: string | null;
  valid: boolean;
  errors: string[];
}

export interface PerformanceEvidenceProvenanceReport {
  valid: boolean;
  comparable: boolean;
  baseline: PerformanceEvidenceScenarioProvenance;
  gaiaL1: PerformanceEvidenceScenarioProvenance;
  gaiaL2Plus: PerformanceEvidenceScenarioProvenance;
  errors: string[];
  mismatches: string[];
}

export interface CertifiedPerformanceEvidenceReport
  extends PerformanceEvidenceBundleReport {
  provenance: PerformanceEvidenceProvenanceReport;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readScenarioProvenance = (
  value: unknown,
  scenario: PerformanceEvidenceCertificationScenario,
): PerformanceEvidenceScenarioProvenance => {
  const errors: string[] = [];
  let buildSha: string | null = null;
  let productVersion: string | null = null;

  if (!isRecord(value) || !isRecord(value.runtime)) {
    errors.push("runtime metadata is missing; build provenance cannot be verified");
  } else {
    buildSha =
      typeof value.runtime.buildSha === "string"
        ? value.runtime.buildSha.trim()
        : null;
    productVersion =
      typeof value.runtime.productVersion === "string"
        ? value.runtime.productVersion.trim()
        : null;

    if (!isCanonicalBuildSha(buildSha)) {
      errors.push("runtime.buildSha must be a canonical 40-character Git SHA");
    }
    if (!isReleaseProductVersion(productVersion)) {
      errors.push("runtime.productVersion must identify a non-local product build");
    }
  }

  return {
    scenario,
    buildSha,
    productVersion,
    valid: errors.length === 0,
    errors,
  };
};

const prefix = (label: string, values: readonly string[]) =>
  values.map((value) => `${label}: ${value}`);

export const analyzePerformanceEvidenceProvenance = (input: {
  baseline: unknown;
  gaiaL1: unknown;
  gaiaL2Plus: unknown;
}): PerformanceEvidenceProvenanceReport => {
  const baseline = readScenarioProvenance(input.baseline, "BASELINE");
  const gaiaL1 = readScenarioProvenance(input.gaiaL1, "GAIA_L1");
  const gaiaL2Plus = readScenarioProvenance(input.gaiaL2Plus, "GAIA_L2_PLUS");

  const errors = [
    ...prefix("BASELINE", baseline.errors),
    ...prefix("GAIA_L1", gaiaL1.errors),
    ...prefix("GAIA_L2_PLUS", gaiaL2Plus.errors),
  ];
  const mismatches: string[] = [];

  if (errors.length === 0) {
    for (const scenario of [gaiaL1, gaiaL2Plus]) {
      if (scenario.buildSha !== baseline.buildSha) {
        mismatches.push(
          `${scenario.scenario}: build SHA differs from baseline`,
        );
      }
      if (scenario.productVersion !== baseline.productVersion) {
        mismatches.push(
          `${scenario.scenario}: product version differs from baseline`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0 && mismatches.length === 0,
    comparable: errors.length === 0 && mismatches.length === 0,
    baseline,
    gaiaL1,
    gaiaL2Plus,
    errors,
    mismatches,
  };
};

export const analyzeCertifiedPerformanceEvidenceBundle = (input: {
  baseline: unknown;
  gaiaL1: unknown;
  gaiaL2Plus: unknown;
}): CertifiedPerformanceEvidenceReport => {
  const performance = analyzePerformanceEvidenceBundle(input);
  const provenance = analyzePerformanceEvidenceProvenance(input);

  let triage: PerformanceEvidenceTriage = performance.triage;
  if (provenance.errors.length > 0) {
    triage = "INVALID";
  } else if (provenance.mismatches.length > 0) {
    triage = "ENVIRONMENT_MISMATCH";
  }

  return {
    ...performance,
    triage,
    provenance,
    errors: [...performance.errors, ...provenance.errors],
    warnings: [
      ...performance.warnings,
      ...provenance.mismatches.map((value) => `PROVENANCE: ${value}`),
    ],
  };
};
