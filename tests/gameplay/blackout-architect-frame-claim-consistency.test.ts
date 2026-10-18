import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_FRAME_CLAIM_CONSISTENCY_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectFrameClaimConsistency,
} from "../../src/game/blackoutArchitectFrameClaimConsistency";
import {
  resolveBlackoutArchitectStructuralGeometricCandidate,
} from "../../src/game/blackoutArchitectStructuralGeometricCandidate";

const ids = ["NORTH", "EAST", "SOUTH", "WEST"] as const;
const geometry = () => [
  { anchorId: "NORTH", x: 0, y: -20, radius: 2 },
  { anchorId: "EAST", x: 20, y: 0, radius: 2 },
  { anchorId: "SOUTH", x: 0, y: 20, radius: 2 },
  { anchorId: "WEST", x: -20, y: 0, radius: 2 },
];
const probes = [
  { x: 0, y: -20, radius: 0 },
  { x: 20, y: 0, radius: 0 },
  { x: 0, y: 20, radius: 0 },
  { x: -20, y: 0, radius: 0 },
] as const;
const frame = () => ({
  encounterId: "architect-encounter-1", frameSequence: 42,
  projectileId: "player-projectile-1",
  projectileAlive: true, projectileFromPlayer: true, projectileConsumed: false,
});
const claim = (anchorId: string = "NORTH") => ({
  encounterId: "architect-encounter-1", frameSequence: 42,
  projectileId: "player-projectile-1", anchorId,
});
const candidate = (index = 0) =>
  resolveBlackoutArchitectStructuralGeometricCandidate(geometry(), probes[index]);

test("J9K agrees with all four frozen J9J geometric candidates without claiming real hit", () => {
  for (let i = 0; i < ids.length; i++) {
    const input = frame(), contact = claim(ids[i]), geometryCandidate = candidate(i);
    assert.ok(geometryCandidate);
    const prev = structuredClone(input);
    const result = resolveBlackoutArchitectFrameClaimConsistency(input, contact, geometryCandidate);
    assert.deepEqual(result, {
      bossId: "BLACKOUT_ARCHITECT",
      frameClaimMode: "FRAME_CLAIM_CONSISTENCY_ONLY",
      encounterId: input.encounterId,
      frameSequence: 42,
      projectileId: input.projectileId,
      anchorId: ids[i],
      collisionProvenanceVerified: false,
      projectileLifecycleVerified: false,
      preventsReplay: false,
      authorizesDamage: false,
      mutatesHealth: false,
    });
    assert.ok(Object.isFrozen(result));
    assert.deepEqual(input, prev);
  }
});

test("J9K rejects dead, enemy, consumed and mismatched per-frame claims", () => {
  const valid = frame(), c = claim(), g = candidate();
  assert.ok(g);
  const mutate = (fields: Record<string, unknown>) => ({ ...valid, ...fields });
  for (const incorrect of [
    mutate({ projectileAlive: false }),
    mutate({ projectileFromPlayer: false }),
    mutate({ projectileConsumed: true }),
    mutate({ projectileAlive: 1 }),
    mutate({ projectileFromPlayer: "true" }),
    mutate({ projectileConsumed: 0 }),
    mutate({ frameSequence: -1 }),
    mutate({ frameSequence: -0 }),
    mutate({ frameSequence: 0.1 }),
    mutate({ frameSequence: NaN }),
    mutate({ frameSequence: Infinity }),
    mutate({ frameSequence: Number.MAX_SAFE_INTEGER + 1 }),
    mutate({ encounterId: " " }),
    mutate({ encounterId: "x".repeat(129) }),
    mutate({ projectileId: "" }),
    mutate({ projectileId: " player " }),
  ]) assert.equal(resolveBlackoutArchitectFrameClaimConsistency(incorrect, c, g), null);
  for (const wrong of [
    { ...c, encounterId: "another-encounter" },
    { ...c, projectileId: "another-projectile" },
    { ...c, frameSequence: 41 },
    { ...c, frameSequence: 43 },
    { ...c, anchorId: "EAST" },
    { ...c, anchorId: "CORE" },
    { ...c, anchorId: null },
  ]) assert.equal(resolveBlackoutArchitectFrameClaimConsistency(valid, wrong, g), null);
});

test("J9K requires exact, frozen, non-authoritative J9J candidate, rejects miss and forgery", () => {
  const valid = frame(), c = claim(), g = candidate();
  assert.ok(g);
  const miss = resolveBlackoutArchitectStructuralGeometricCandidate(geometry(), { x: 100, y: 100, radius: 0 });
  assert.ok(miss);
  for (const bad of [
    null, undefined, {}, [], "",
    miss,
    { ...g },
    Object.freeze({ ...g, bossId: "BLACKOUT_DEVOURER" }),
    Object.freeze({ ...g, candidateMode: "LIVE_COLLISION" }),
    Object.freeze({ ...g, candidateAnchorId: "CORE" }),
    Object.freeze({ ...g, candidateAnchorId: "EAST" }),
    Object.freeze({ ...g, geometryProvenanceVerified: true }),
    Object.freeze({ ...g, projectileProvenanceVerified: true }),
    Object.freeze({ ...g, authorizesDamage: true }),
    Object.freeze({ ...g, mutatesHealth: true }),
    Object.freeze({ ...g, extra: true }),
    Object.freeze({ ...g, [Symbol("tag")]: true }),
  ]) assert.equal(resolveBlackoutArchitectFrameClaimConsistency(valid, c, bad), null);
  const getter: Record<string, unknown> = { ...g };
  Object.defineProperty(getter, "candidateAnchorId", { get: () => "NORTH", enumerable: true });
  assert.equal(resolveBlackoutArchitectFrameClaimConsistency(valid, c, Object.freeze(getter)), null);
  const inherited = Object.create(g);
  assert.equal(resolveBlackoutArchitectFrameClaimConsistency(valid, c, Object.freeze(inherited)), null);
});

test("J9K fails closed on malformed, inherited, accessor and padded frame/contact", () => {
  const f = frame(), c = claim(), g = candidate();
  assert.ok(g);
  const frameGetter: Record<string, unknown> = { ...f };
  Object.defineProperty(frameGetter, "projectileId", { get: () => f.projectileId, enumerable: true });
  const contactGetter: Record<string, unknown> = { ...c };
  Object.defineProperty(contactGetter, "anchorId", { get: () => c.anchorId, enumerable: true });
  for (const bad of [
    null, {}, [], "frame",
    { ...f, extra: 1 }, { ...f, [Symbol("x")]: 1 },
    Object.create(f), frameGetter,
    { ...f, projectileId: undefined },
    { ...f, projectileId: null },
    { ...f, encounterId: "  " },
  ]) assert.equal(resolveBlackoutArchitectFrameClaimConsistency(bad, c, g), null);
  for (const bad of [
    null, {}, [], "claim",
    { ...c, extra: 1 }, { ...c, [Symbol("x")]: 1 },
    Object.create(c), contactGetter,
    { ...c, anchorId: undefined },
  ]) assert.equal(resolveBlackoutArchitectFrameClaimConsistency(f, bad, g), null);
});

test("J9K caller agreement does not imply replay resistance or engine-bound identity", () => {
  const f = frame(), c = claim(), g = candidate();
  assert.ok(g);
  const first = resolveBlackoutArchitectFrameClaimConsistency(f, c, g);
  const repeated = resolveBlackoutArchitectFrameClaimConsistency(f, c, g);
  assert.ok(first);
  assert.deepEqual(repeated, first); // No fake replay protection.
  assert.equal(first.preventsReplay, false);
  assert.equal(first.collisionProvenanceVerified, false);
  assert.equal(first.projectileLifecycleVerified, false);
  assert.equal(first.authorizesDamage, false);
  assert.equal(first.mutatesHealth, false);
});

test("J9K exposes one positive authority, never validates projectile authenticity", () => {
  const contract = BLACKOUT_ARCHITECT_FRAME_CLAIM_CONSISTENCY_AUTHORITY_CONTRACT;
  assert.ok(Object.isFrozen(contract));
  assert.deepEqual(Object.entries(contract).filter(([, v]) => v).map(([k]) => k), [
    "ownsPureCallerClaimConsistencyAuthority",
  ]);
});
