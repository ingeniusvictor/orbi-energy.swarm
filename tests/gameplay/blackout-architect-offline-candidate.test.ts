import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_OFFLINE_CANDIDATE_AUTHORITY_CONTRACT,
  createBlackoutArchitectOfflineCandidateFactory,
  nextBlackoutArchitectOfflineCandidateOrdinal,
} from "../../src/game/blackoutArchitectOfflineEncounterFactory";

test("B2B2B1 creates frozen isolated candidates with no live trust", () => {
  const f = createBlackoutArchitectOfflineCandidateFactory();
  assert.ok(Object.isFrozen(f));
  assert.equal(f.getCurrent(), null);
  const a = f.begin(1);
  assert.ok(a);
  assert.ok(Object.isFrozen(a));
  assert.equal(a.bossId, "BLACKOUT_ARCHITECT");
  assert.equal(a.candidateMode, "FACTORY_ONLY");
  assert.equal(a.runEpoch, 1);
  assert.equal(a.encounterOrdinal, 1);
  assert.equal(f.getCurrent(), a);
  assert.equal(f.isCurrent(a), true);
  for (const [name, value] of Object.entries(a)) {
    if (name.endsWith("Authorized") || name.endsWith("Certified") || name.endsWith("Issued") || name.endsWith("Verified") ||
      name === "authenticatedLiveBossReference") assert.equal(value, false, name);
  }
  const auth = BLACKOUT_ARCHITECT_OFFLINE_CANDIDATE_AUTHORITY_CONTRACT;
  assert.ok(Object.isFrozen(auth));
  assert.deepEqual(Object.entries(auth).filter(([,v]) => v === true).map(([key]) => key),
    ["ownsIsolatedOfflineCandidateConstructionOnly"]);
});

test("B2B2B1 rejects clones, rogue objects, cross-factory and previous candidates", () => {
  const a = createBlackoutArchitectOfflineCandidateFactory();
  const b = createBlackoutArchitectOfflineCandidateFactory();
  const first = a.begin(5);
  const other = b.begin(5);
  assert.ok(first && other);
  assert.notEqual(first, other);
  assert.deepEqual(first, other, "a matching snapshot is not an identity ticket");
  assert.equal(a.isCurrent(other), false);
  assert.equal(b.isCurrent(first), false);
  assert.equal(a.isCurrent({ ...first }), false);
  assert.equal(a.isCurrent(Object.freeze({ ...first })), false);
  assert.equal(a.isCurrent("BLACKOUT_ARCHITECT"), false);
  const second = a.begin(5);
  assert.ok(second);
  assert.equal(second.encounterOrdinal, 2);
  assert.equal(a.isCurrent(first), false);
  assert.equal(a.isCurrent(second), true);
  assert.equal(b.isCurrent(other), true);
  assert.equal(a.revoke(), null);
  assert.equal(a.getCurrent(), null);
  assert.equal(a.isCurrent(second), false);
  const third = a.begin(6);
  assert.ok(third);
  assert.equal(third.encounterOrdinal, 3, "revocation never reuses ordinals");
  assert.equal(third.runEpoch, 6);
});

test("B2B2B1 invalid begin fails closed, revokes old reference, preserves ordinal", () => {
  const f = createBlackoutArchitectOfflineCandidateFactory();
  const first = f.begin(7);
  assert.ok(first);
  for (const input of [
    null, undefined, 0, -0, -1, 1.4, NaN, Infinity, -Infinity,
    Number.MAX_SAFE_INTEGER + 1, "7", {}, [], Symbol("epoch"),
  ]) {
    assert.equal(f.begin(input), null);
    assert.equal(f.getCurrent(), null);
    assert.equal(f.isCurrent(first), false);
  }
  const second = f.begin(Number.MAX_SAFE_INTEGER);
  assert.ok(second);
  assert.equal(second.encounterOrdinal, 2, "invalid input did not reuse a candidate or advance ordinal");
  assert.equal(f.isCurrent(second), true);
});

test("B2B2B1 monotonic arithmetic rejects invalid/overflow and cannot mint", () => {
  assert.equal(nextBlackoutArchitectOfflineCandidateOrdinal(0), 1);
  assert.equal(nextBlackoutArchitectOfflineCandidateOrdinal(1), 2);
  assert.equal(nextBlackoutArchitectOfflineCandidateOrdinal(Number.MAX_SAFE_INTEGER - 1), Number.MAX_SAFE_INTEGER);
  for (const value of [
    Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 1, -1, -0,
    NaN, Infinity, null, undefined, "5", {}, 0.5,
  ]) assert.equal(nextBlackoutArchitectOfflineCandidateOrdinal(value), null);
  const auth = BLACKOUT_ARCHITECT_OFFLINE_CANDIDATE_AUTHORITY_CONTRACT;
  assert.ok(Object.entries(auth).every(([key, value]) =>
    key === "ownsIsolatedOfflineCandidateConstructionOnly" ? value === true : value === false));
});
