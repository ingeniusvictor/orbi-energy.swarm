import assert from "node:assert/strict";
import test from "node:test";

import {
  projectFotonIntegrityVisual,
} from "../src/game/fotonTacticalRenderer.ts";

test("integrity state maps high shield to HEALTHY cyan", () => {
  for (const ratio of [0.66, 0.8, 1, 1.5]) {
    const visual = projectFotonIntegrityVisual(ratio);
    assert.equal(visual.status, "HEALTHY");
    assert.equal(visual.color, "#67e8f9");
    assert.equal(visual.coreColor, "#22d3ee");
    assert.ok(visual.ratio >= 0.66);
    assert.ok(visual.ratio <= 1);
  }
});

test("integrity state maps medium shield to PRESSURED amber", () => {
  for (const ratio of [0.33, 0.5, 0.659]) {
    const visual = projectFotonIntegrityVisual(ratio);
    assert.equal(visual.status, "PRESSURED");
    assert.equal(visual.color, "#fbbf24");
    assert.equal(visual.coreColor, "#f59e0b");
  }
});

test("integrity state maps low shield to CRITICAL rose", () => {
  for (const ratio of [0, 0.1, 0.329, -1]) {
    const visual = projectFotonIntegrityVisual(ratio);
    assert.equal(visual.status, "CRITICAL");
    assert.equal(visual.color, "#fb7185");
    assert.equal(visual.coreColor, "#f43f5e");
    assert.ok(visual.ratio >= 0);
  }
});

test("non-finite shield input fails closed as critical zero integrity", () => {
  for (const ratio of [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ]) {
    const visual = projectFotonIntegrityVisual(ratio);
    assert.equal(visual.ratio, 0);
    assert.equal(visual.status, "CRITICAL");
  }
});
