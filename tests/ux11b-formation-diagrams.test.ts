import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FormationType } from "../src/game/types";
import { calculateSwarmOffset } from "../src/game/formations";
import {
  FormationDiagram, getFormationBrief, TACTICAL_FORMATION_IDS,
} from "../src/components/FormationDiagram";

test("UX11-B retains all six serialized formation IDs in canonical order", () => {
  assert.deepEqual(TACTICAL_FORMATION_IDS, [
    FormationType.LINE, FormationType.CIRCLE, FormationType.DELTA,
    FormationType.SHIELD, FormationType.V_SHAPE, FormationType.SCATTERED,
  ]);
});

test("UX11-B formation illustrations use finite real engine offsets", () => {
  for (const type of TACTICAL_FORMATION_IDS) {
    const count = type === FormationType.SCATTERED ? 30 : 16;
    const points = Array.from({ length: count }, (_, i) =>
      calculateSwarmOffset(type, i, count, 0, 0));
    assert.ok(points.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y)), type);
    assert.ok(new Set(points.map(p => [p.x.toFixed(2), p.y.toFixed(2)].join(","))).size > 8, type);
    for (const language of ["es", "en"] as const) {
      const brief = getFormationBrief(type, language);
      assert.ok(brief.name && brief.shape && brief.effect && brief.tradeoff);
      const html = renderToStaticMarkup(createElement(FormationDiagram, {type,language}));
      assert.match(html, /<svg/);
      assert.match(html, /role="img"/);
      assert.match(html, /<circle/);
      assert.doesNotMatch(html, /<image\b|<foreignObject\b/);
      assert.ok(html.includes(brief.name));
    }
  }
});

test("UX11-B precise tactical copy does not invent unconnected damage or repulsion buffs", () => {
  assert.match(getFormationBrief(FormationType.LINE, "es").effect, /25%/);
  assert.match(getFormationBrief(FormationType.CIRCLE, "en").effect, /15%/);
  assert.match(getFormationBrief(FormationType.SCATTERED, "es").shape, /3 \/ 9 \/ 18/);
  assert.doesNotMatch(getFormationBrief(FormationType.DELTA, "es").effect, /repuls|daño aumentado/i);
});
