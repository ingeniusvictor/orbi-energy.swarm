import { readFileSync } from "node:fs";

import { analyzePerformanceEvidenceBundle } from "../src/game/performanceEvidenceAnalysis.ts";

const [baselinePath, gaiaL1Path, gaiaL2PlusPath] = process.argv.slice(2);

if (!baselinePath || !gaiaL1Path || !gaiaL2PlusPath) {
  console.error(
    "Usage: npm run evidence:analyze -- <baseline.json> <gaia-l1.json> <gaia-l2plus.json>",
  );
  process.exitCode = 2;
} else {
  try {
    const readJson = (path: string): unknown =>
      JSON.parse(readFileSync(path, "utf8"));

    const report = analyzePerformanceEvidenceBundle({
      baseline: readJson(baselinePath),
      gaiaL1: readJson(gaiaL1Path),
      gaiaL2Plus: readJson(gaiaL2PlusPath),
    });

    console.log(JSON.stringify(report, null, 2));

    if (report.triage === "INVALID") {
      process.exitCode = 3;
    } else if (report.triage === "ENVIRONMENT_MISMATCH") {
      process.exitCode = 4;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Evidence analysis failed: ${message}`);
    process.exitCode = 2;
  }
}
