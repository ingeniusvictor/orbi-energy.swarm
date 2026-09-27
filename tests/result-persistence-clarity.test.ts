import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const resultScreen = readFileSync(
  new URL("../src/components/ResultScreen.tsx", import.meta.url),
  "utf8",
);

test("result screen distinguishes persistent progression from run-only build state", () => {
  assert.match(resultScreen, /ARCHIVO DE PROGRESO/);
  assert.match(resultScreen, /PROGRESSION ARCHIVE/);
  assert.match(resultScreen, /SE CONSERVA/);
  assert.match(resultScreen, /PERSISTENT/);
  assert.match(resultScreen, /SE REINICIA/);
  assert.match(resultScreen, /RUN-ONLY/);
});

test("persistence summary names saved credits, records and boss data", () => {
  assert.match(resultScreen, /Nano Credits/);
  assert.match(resultScreen, /récords/);
  assert.match(resultScreen, /boss data/);
});

test("run-only summary makes tactical upgrade reset explicit", () => {
  assert.match(resultScreen, /mejoras tácticas de intermisión/);
  assert.match(resultScreen, /Intermission tactical upgrades/);
});
