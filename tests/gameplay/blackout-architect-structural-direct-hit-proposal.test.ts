import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType } from "../../src/game/types";
import {
  resolveBlackoutArchitectStructuralDurabilitySnapshot,
} from "../../src/game/blackoutArchitectStructuralDurabilitySnapshot";
import {
  resolveBlackoutArchitectStructuralTargetEligibility,
} from "../../src/game/blackoutArchitectStructuralTargetEligibility";
import {
  resolveBlackoutArchitectStructuralHitIntentAdmission,
} from "../../src/game/blackoutArchitectStructuralHitIntentAdmission";
import {
  BLACKOUT_ARCHITECT_STRUCTURAL_DIRECT_HIT_PROPOSAL_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectStructuralDirectHitProposal,
} from "../../src/game/blackoutArchitectStructuralDirectHitProposal";

const IDS = ["NORTH", "EAST", "SOUTH", "WEST"] as const;
const mapping = {
  bossId: "BLACKOUT_ARCHITECT",
  compatibilityMode: "COMPATIBILITY_ONLY",
  mappingMode: "MAPPING_ONLY",
  chassisId: "TITAN_CORE",
  enemyType: EnemyType.BOSS_TITAN,
};

const health = () => IDS.map((anchorId, i) => ({
  anchorId, currentHealth: i + 1, maxHealth: 12 + i,
}));
const claim = (damage: unknown = 0.5) => ({
  sourceClaim: "DIRECT_PLAYER_PROJECTILE_CLAIM", resolvedDamage: damage,
});
const admission = (data: ReturnType<typeof health>, anchorId: typeof IDS[number] = "NORTH") => {
  const snapshot = resolveBlackoutArchitectStructuralDurabilitySnapshot(data);
  assert.ok(snapshot);
  const eligibility = resolveBlackoutArchitectStructuralTargetEligibility(mapping, snapshot.anchorFacts);
  assert.ok(eligibility);
  const admitted = resolveBlackoutArchitectStructuralHitIntentAdmission(eligibility, {
    targetKind: "ANCHOR", anchorId,
  });
  assert.ok(admitted);
  return admitted;
};

test("J9I projects each anchor's bounded arithmetic without modifying caller snapshots", () => {
  for (let i = 0; i < IDS.length; i++) {
    const data = health().reverse();
    const before = structuredClone(data);
    const admitted = admission(data, IDS[i]);
    assert.equal(admitted.disposition, "ADMIT");
    const result = resolveBlackoutArchitectStructuralDirectHitProposal(admitted, data, claim(0.5));
    assert.ok(result);
    assert.deepEqual(result, {
      bossId: "BLACKOUT_ARCHITECT",
      transitionMode: "PROPOSAL_ONLY",
      chassisId: "TITAN_CORE",
      enemyType: EnemyType.BOSS_TITAN,
      anchorId: IDS[i],
      sourceClaim: "DIRECT_PLAYER_PROJECTILE_CLAIM",
      currentHealth: i + 1,
      maxHealth: 12 + i,
      resolvedDamage: 0.5,
      appliedDamage: 0.5,
      remainingHealth: i + 0.5,
      wouldDestroy: false,
      mutatesHealth: false,
      establishesCollisionProvenance: false,
      registersDefeat: false,
      awardsRewards: false,
    });
    assert.equal(Object.isFrozen(result), true);
    assert.deepEqual(data, before);
  }
});

test("J9I caps overkill, proposes destruction at exact zero and leaves runtime out", () => {
  const data = health();
  const admitted = admission(data);
  for (const damage of [1, 3, Number.MAX_VALUE]) {
    const result = resolveBlackoutArchitectStructuralDirectHitProposal(admitted, data, claim(damage));
    assert.ok(result);
    assert.equal(result.appliedDamage, 1);
    assert.equal(result.remainingHealth, 0);
    assert.equal(result.wouldDestroy, true);
    assert.equal(result.mutatesHealth, false);
    assert.equal(result.establishesCollisionProvenance, false);
    assert.equal(data[0].currentHealth, 1);
  }
});

test("J9I rejects CORE and DENY intents, even though J9G permits core after four destruction facts", () => {
  const allDead = health().map((fact) => ({ ...fact, currentHealth: 0 }));
  const snapshot = resolveBlackoutArchitectStructuralDurabilitySnapshot(allDead);
  assert.ok(snapshot);
  const eligibility = resolveBlackoutArchitectStructuralTargetEligibility(mapping, snapshot.anchorFacts);
  assert.ok(eligibility);
  const coreAdmit = resolveBlackoutArchitectStructuralHitIntentAdmission(eligibility, { targetKind: "CORE" });
  assert.ok(coreAdmit);
  assert.equal(coreAdmit.disposition, "ADMIT");
  assert.equal(resolveBlackoutArchitectStructuralDirectHitProposal(coreAdmit, allDead, claim(1)), null);
  const anchorDeny = resolveBlackoutArchitectStructuralHitIntentAdmission(eligibility, { targetKind: "ANCHOR", anchorId: "NORTH" });
  assert.ok(anchorDeny);
  assert.equal(anchorDeny.disposition, "DENY");
  assert.equal(resolveBlackoutArchitectStructuralDirectHitProposal(anchorDeny, allDead, claim(1)), null);
  // A forged deeply-frozen ADMIT against already-zero target does not bypass health integrity.
  const forged = Object.freeze({ ...anchorDeny, disposition: "ADMIT" });
  assert.equal(resolveBlackoutArchitectStructuralDirectHitProposal(forged, allDead, claim(1)), null);
});

test("J9I requires a deeply frozen exact admitted ANCHOR projection", () => {
  const data = health();
  const allowed = admission(data);
  const intent = allowed.intent;
  for (const bad of [
    null, undefined, {}, [], "", Object.assign({}, allowed),
    Object.freeze({ ...allowed, disposition: "DENY" }),
    Object.freeze({ ...allowed, bossId: "BLACKOUT_DEVOURER" }),
    Object.freeze({ ...allowed, admissionMode: "LIVE" }),
    Object.freeze({ ...allowed, chassisId: "DEVOURER" }),
    Object.freeze({ ...allowed, enemyType: EnemyType.BOSS_DEVOURER }),
    Object.freeze({ ...allowed, extra: true }),
    Object.freeze({ ...allowed, intent: { ...intent } }),
    Object.freeze({ ...allowed, intent: Object.freeze({ targetKind: "CORE" }) }),
    Object.freeze({ ...allowed, intent: Object.freeze({ targetKind: "ANCHOR", anchorId: "UNKNOWN" }) }),
    Object.freeze({ ...allowed, intent: Object.freeze({ targetKind: "ANCHOR", anchorId: "NORTH", extra: true }) }),
    Object.freeze({ ...allowed, [Symbol("extra")]: true }),
  ]) assert.equal(resolveBlackoutArchitectStructuralDirectHitProposal(bad, data, claim(1)), null);
  const accessor: Record<string, unknown> = { ...allowed };
  Object.defineProperty(accessor, "intent", { get: () => intent, enumerable: true });
  assert.equal(resolveBlackoutArchitectStructuralDirectHitProposal(Object.freeze(accessor), data, claim(1)), null);
  assert.ok(resolveBlackoutArchitectStructuralDirectHitProposal(allowed, data, claim(1)));
});

test("J9I rejects bad health snapshots and already destroyed selected anchor", () => {
  const data = health();
  const allowed = admission(data);
  const bad = [
    null, undefined, [], {}, data.slice(1), [...data, data[0]],
    [data[0], data[0], data[2], data[3]],
    [{ ...data[0], currentHealth: 0 }, ...data.slice(1)],
    [{ ...data[0], currentHealth: Number.NaN }, ...data.slice(1)],
    [{ ...data[0], currentHealth: Number.POSITIVE_INFINITY }, ...data.slice(1)],
    [{ ...data[0], currentHealth: -1 }, ...data.slice(1)],
    [{ ...data[0], currentHealth: 14 }, ...data.slice(1)],
    [{ ...data[0], currentHealth: -0 }, ...data.slice(1)],
    [{ ...data[0], extra: 5 }, ...data.slice(1)],
  ];
  for (const candidate of bad) assert.equal(resolveBlackoutArchitectStructuralDirectHitProposal(allowed, candidate, claim(1)), null);
});

test("J9I validates exact caller-asserted direct source and finite damage; no hidden defaults", () => {
  const data = health();
  const allowed = admission(data);
  const getClaim = (payload: unknown) =>
    resolveBlackoutArchitectStructuralDirectHitProposal(allowed, data, payload);
  const getter: Record<string, unknown> = { sourceClaim: "DIRECT_PLAYER_PROJECTILE_CLAIM" };
  Object.defineProperty(getter, "resolvedDamage", { get: () => 1, enumerable: true });
  for (const bad of [
    null, [], {}, { sourceClaim: "DIRECT_PLAYER_PROJECTILE_CLAIM" },
    { resolvedDamage: 1 }, { sourceClaim: "DIRECT_PLAYER_PROJECTILE", resolvedDamage: 1 },
    { sourceClaim: "SPLASH_HIT", resolvedDamage: 1 }, claim(0), claim(-1), claim(-0),
    claim(NaN), claim(Infinity), claim(-Infinity), claim("1"), claim(true),
    { ...claim(1), extra: true }, { ...claim(1), [Symbol("padded")]: true }, getter,
  ]) assert.equal(getClaim(bad), null);
});

test("J9I fails closed if floating-point precision would report a hit with unchanged health", () => {
  const data = health().map((fact, index) => index === 0
    ? { ...fact, currentHealth: Number.MAX_VALUE, maxHealth: Number.MAX_VALUE }
    : fact);
  const allowed = admission(data);
  assert.equal(resolveBlackoutArchitectStructuralDirectHitProposal(allowed, data, claim(Number.MIN_VALUE)), null);
  const result = resolveBlackoutArchitectStructuralDirectHitProposal(allowed, data, claim(Number.MAX_VALUE));
  assert.ok(result);
  assert.equal(result.remainingHealth, 0);
});

test("J9I sole positive authority is arithmetic proposal; no collision guarantee or mutation", () => {
  const contract = BLACKOUT_ARCHITECT_STRUCTURAL_DIRECT_HIT_PROPOSAL_AUTHORITY_CONTRACT;
  assert.equal(Object.isFrozen(contract), true);
  assert.deepEqual(Object.entries(contract).filter(([, active]) => active).map(([name]) => name), [
    "ownsPureDirectHitArithmeticProposalAuthority",
  ]);
});
