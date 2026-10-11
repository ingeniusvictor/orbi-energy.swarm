import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const sourcePath = "scripts/es12g3-apply.mjs";
let source = readFileSync(sourcePath, "utf8");

const fixes = [
  [
    '        `EVIDENCE REC iniciada · ${PERFORMANCE_EVIDENCE_TARGET_SAMPLES} snapshots / 15 s.`,',
    '        \\`EVIDENCE REC iniciada · \\${PERFORMANCE_EVIDENCE_TARGET_SAMPLES} snapshots / 15 s.\\`,',
  ],
  [
    '                ? `READY ${evidenceSamples}/${evidenceTargetSamples} · F4 EXPORT`',
    '                ? \\`READY \\${evidenceSamples}/\\${evidenceTargetSamples} · F4 EXPORT\\`',
  ],
  [
    '                  ? `REC ${evidenceSamples}/${evidenceTargetSamples} · F4 STOP`',
    '                  ? \\`REC \\${evidenceSamples}/\\${evidenceTargetSamples} · F4 STOP\\`',
  ],
];

for (const [from, to] of fixes) {
  const count = source.split(from).length - 1;
  if (count !== 1) {
    throw new Error(`expected exactly one nested-template match, got ${count}: ${from}`);
  }
  source = source.replace(from, to);
}

// Persist the parser-safe helper in the checked-out workspace so TypeScript's
// allowJs/checkJs traversal cannot fail on the intentionally nested templates.
// The guarded workflow removes both helpers before the implementation commit.
writeFileSync(sourcePath, source);

const fixedPath = "/tmp/es12g3-apply-fixed.mjs";
writeFileSync(fixedPath, source);
await import(pathToFileURL(fixedPath).href);
