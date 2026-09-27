import assert from "node:assert/strict";
import test from "node:test";

import { en } from "../../src/i18n/en.ts";
import { es } from "../../src/i18n/es.ts";

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") return [prefix];

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return [prefix];

  return entries.flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" ? flattenKeys(child, next) : [next];
  });
}

test("Spanish and English dictionaries expose the same translation keys", () => {
  const enKeys = flattenKeys(en).sort();
  const esKeys = flattenKeys(es).sort();
  assert.deepEqual(esKeys, enKeys);
});
