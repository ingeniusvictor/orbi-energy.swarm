import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_GEOMETRIC_CANDIDATE_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectStructuralGeometricCandidate,
} from "../../src/game/blackoutArchitectStructuralGeometricCandidate";

const circles = () => [
  { anchorId: "NORTH", x: 0, y: -20, radius: 2 },
  { anchorId: "EAST", x: 20, y: 0, radius: 2 },
  { anchorId: "SOUTH", x: 0, y: 20, radius: 2 },
  { anchorId: "WEST", x: -20, y: 0, radius: 2 },
];
const probe = (x = 0, y = -20, radius = 0) => ({ x, y, radius });

test("J9J identifies all four caller-geometry candidates regardless of input order, without mutation", () => {
  const positions = [
    ["NORTH", 0, -20], ["EAST", 20, 0], ["SOUTH", 0, 20], ["WEST", -20, 0],
  ] as const;
  for (const [expected, x, y] of positions) {
    const anchors = circles().reverse();
    const before = structuredClone(anchors);
    const result = resolveBlackoutArchitectStructuralGeometricCandidate(anchors, probe(x, y));
    assert.deepEqual(result, {
      bossId: "BLACKOUT_ARCHITECT",
      candidateMode: "GEOMETRIC_CANDIDATE_ONLY",
      candidateAnchorId: expected,
      geometryProvenanceVerified: false,
      projectileProvenanceVerified: false,
      authorizesDamage: false,
      mutatesHealth: false,
    });
    assert.equal(Object.isFrozen(result), true);
    assert.deepEqual(anchors, before);
  }
});

test("J9J distinguishes miss, strict tangent and positive-radius probe without asserting real hit", () => {
  const anchors = circles();
  const miss = resolveBlackoutArchitectStructuralGeometricCandidate(anchors, probe(100, 100));
  assert.ok(miss);
  assert.equal(miss.candidateAnchorId, null);
  const tangent = resolveBlackoutArchitectStructuralGeometricCandidate(anchors, probe(2, -20));
  assert.ok(tangent);
  assert.equal(tangent.candidateAnchorId, null);
  const overlap = resolveBlackoutArchitectStructuralGeometricCandidate(anchors, probe(2, -20, 0.1));
  assert.ok(overlap);
  assert.equal(overlap.candidateAnchorId, "NORTH");
  assert.equal(overlap.geometryProvenanceVerified, false);
  assert.equal(overlap.projectileProvenanceVerified, false);
});

test("J9J rejects ambiguous intersections rather than attributing a first matching anchor", () => {
  const ambiguous = circles();
  ambiguous[1] = { anchorId: "EAST", x: 1, y: -20, radius: 2 };
  assert.equal(resolveBlackoutArchitectStructuralGeometricCandidate(ambiguous, probe()), null);
  assert.equal(resolveBlackoutArchitectStructuralGeometricCandidate(ambiguous.reverse(), probe()), null);
  assert.ok(resolveBlackoutArchitectStructuralGeometricCandidate(ambiguous, probe(100, 100)));
});

test("J9J rejects array shape corruption, duplicate/missing/unknown IDs and invalid anchor geometry", () => {
  const valid = circles();
  const sparse = [...valid]; delete (sparse as unknown[])[2];
  const padded = [...valid] as unknown[] & { extra?: boolean }; padded.extra = true;
  const symbolized = [...valid] as unknown[] & { [key: symbol]: unknown };
  symbolized[Symbol("padding")] = true;
  const getter = [...valid];
  Object.defineProperty(getter, "1", { get: () => valid[1], enumerable: true });
  const inherited = Object.create({ anchorId: "NORTH" }) as Record<string, unknown>;
  inherited.x = 0; inherited.y = -20; inherited.radius = 2;
  for (const bad of [
    null, {}, "circles", 3, [], valid.slice(1), [...valid, valid[0]],
    [valid[0], valid[0], valid[2], valid[3]],
    [{ ...valid[0], anchorId: "CORE" }, ...valid.slice(1)],
    [{ ...valid[0], radius: 0 }, ...valid.slice(1)],
    [{ ...valid[0], radius: -1 }, ...valid.slice(1)],
    [{ ...valid[0], radius: Infinity }, ...valid.slice(1)],
    [{ ...valid[0], radius: "2" }, ...valid.slice(1)],
    [{ ...valid[0], x: NaN }, ...valid.slice(1)],
    [{ ...valid[0], y: Infinity }, ...valid.slice(1)],
    [{ ...valid[0], extra: true }, ...valid.slice(1)],
    [{ ...valid[0], [Symbol("tag")]: 1 }, ...valid.slice(1)],
    [inherited, ...valid.slice(1)], sparse, padded, symbolized, getter,
  ]) assert.equal(resolveBlackoutArchitectStructuralGeometricCandidate(bad, probe()), null);
  const accessor = { ...valid[0] };
  Object.defineProperty(accessor, "x", { get: () => 0, enumerable: true });
  assert.equal(resolveBlackoutArchitectStructuralGeometricCandidate([accessor, ...valid.slice(1)], probe()), null);
});

test("J9J rejects malformed projectile probes and any non-finite derived collision arithmetic", () => {
  const valid = circles();
  const accessor = { x: 0, y: -20 } as Record<string, unknown>;
  Object.defineProperty(accessor, "radius", { get: () => 0, enumerable: true });
  for (const bad of [
    null, [], {}, { x: 0, y: -20 },
    { x: 0, y: -20, radius: -0 },
    { x: 0, y: -20, radius: -1 },
    { x: 0, y: -20, radius: Infinity },
    { x: NaN, y: -20, radius: 1 },
    { x: Infinity, y: -20, radius: 1 },
    { x: 0, y: "20", radius: 1 },
    { x: 0, y: -20, radius: 0, extra: true },
    { x: 0, y: -20, radius: 0, [Symbol("extra")]: true }, accessor,
    Object.create({ x: 0, y: -20, radius: 0 }),
  ]) assert.equal(resolveBlackoutArchitectStructuralGeometricCandidate(valid, bad), null);
  const diffOverflow = valid.map((p, i) => i === 0 ? { ...p, x: Number.MAX_VALUE } : p);
  assert.equal(resolveBlackoutArchitectStructuralGeometricCandidate(diffOverflow, probe(-Number.MAX_VALUE, -20)), null);
  const radiusOverflow = valid.map((p, i) => i === 0 ? { ...p, radius: Number.MAX_VALUE } : p);
  assert.equal(resolveBlackoutArchitectStructuralGeometricCandidate(radiusOverflow, probe(0, -20, Number.MAX_VALUE)), null);
  const distanceOverflow = valid.map((p, i) => i === 0 ? { ...p, x: Number.MAX_VALUE, y: Number.MAX_VALUE } : p);
  assert.equal(resolveBlackoutArchitectStructuralGeometricCandidate(distanceOverflow, probe()), null);
});

test("J9J freezes a single positive authority and never grants damage or authenticity", () => {
  const contract = BLACKOUT_ARCHITECT_GEOMETRIC_CANDIDATE_AUTHORITY_CONTRACT;
  assert.equal(Object.isFrozen(contract), true);
  assert.deepEqual(Object.entries(contract).filter(([, on]) => on).map(([k]) => k), [
    "ownsPureCallerGeometryCandidateAuthority",
  ]);
});
