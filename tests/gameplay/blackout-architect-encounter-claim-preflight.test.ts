import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_ENCOUNTER_CLAIM_PREFLIGHT_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectEncounterClaimPreflight,
} from "../../src/game/blackoutArchitectEncounterClaimPreflight";
import { BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS } from "../../src/game/blackoutArchitectStructuralTopology";

const valid = () => ({
  bossId: "BLACKOUT_ARCHITECT",
  runEpoch: 7,
  encounterOrdinal: 3,
  physicsFrame: 11,
  chassisId: "TITAN_CORE",
  anchorIds: ["NORTH", "EAST", "SOUTH", "WEST"],
});

test("J9L-B2B1 accepts an exact claim, normalizes roster, never grants authority", () => {
  const claim = valid();
  const result = resolveBlackoutArchitectEncounterClaimPreflight(claim);
  assert.ok(result);
  assert.equal(result.bossId, "BLACKOUT_ARCHITECT");
  assert.equal(result.preflightMode, "PREFLIGHT_ONLY");
  assert.equal(result.chassisId, "TITAN_CORE");
  assert.equal(result.runEpoch, 7);
  assert.equal(result.encounterOrdinal, 3);
  assert.equal(result.physicsFrame, 11);
  assert.deepEqual(result.anchorIds, ["NORTH", "EAST", "SOUTH", "WEST"]);
  assert.equal(result.anchorIds, BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS);
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.anchorIds));
  for (const flag of [
    "engineEncounterIssued", "trustedEncounterIdentity", "lifecycleFreshnessVerified",
    "physicalAnchorGeometryVerified", "collisionProvenanceVerified",
    "projectileIdentityAuthenticated", "consumesProjectile", "preventsReplay",
    "authorizesDamage", "mutatesHealth", "spawnsBoss", "routesGameMode",
  ] as const) assert.equal(result[flag], false, flag);
  assert.deepEqual(claim, valid(), "caller input remains unchanged");
  assert.equal(BLACKOUT_ARCHITECT_ENCOUNTER_CLAIM_PREFLIGHT_AUTHORITY_CONTRACT.ownsEngineEncounterIssuanceAuthority, false);
});

test("J9L-B2B1 tolerates canonical cardinal permutations and minimum legal ordinals", () => {
  const claim = { ...valid(), runEpoch: 1, encounterOrdinal: 1, physicsFrame: 0,
    anchorIds: ["WEST", "SOUTH", "EAST", "NORTH"] };
  const first = resolveBlackoutArchitectEncounterClaimPreflight(Object.freeze(claim));
  const second = resolveBlackoutArchitectEncounterClaimPreflight(claim);
  assert.ok(first && second);
  assert.notEqual(first, second);
  assert.deepEqual(first, second);
  assert.deepEqual(first.anchorIds, ["NORTH", "EAST", "SOUTH", "WEST"]);
});

test("J9L-B2B1 rejects malformed ordinals, boss/chassis and roster", () => {
  const cases: unknown[] = [
    null, undefined, {}, [], 4, "foo",
    { ...valid(), bossId: "BOSS_TITAN" },
    { ...valid(), chassisId: "DEVOURER" },
    { ...valid(), runEpoch: 0 },
    { ...valid(), runEpoch: -0 },
    { ...valid(), runEpoch: -1 },
    { ...valid(), runEpoch: 1.1 },
    { ...valid(), runEpoch: Number.MAX_SAFE_INTEGER + 1 },
    { ...valid(), runEpoch: Infinity },
    { ...valid(), encounterOrdinal: 0 },
    { ...valid(), encounterOrdinal: -0 },
    { ...valid(), encounterOrdinal: NaN },
    { ...valid(), encounterOrdinal: "3" },
    { ...valid(), physicsFrame: -0 },
    { ...valid(), physicsFrame: -1 },
    { ...valid(), physicsFrame: 0.5 },
    { ...valid(), physicsFrame: Infinity },
    { ...valid(), anchorIds: ["NORTH", "EAST", "SOUTH", "SOUTH"] },
    { ...valid(), anchorIds: ["NORTH", "EAST", "SOUTH"] },
    { ...valid(), anchorIds: ["NORTH", "EAST", "SOUTH", "WEST", "NORTH"] },
    { ...valid(), anchorIds: ["NORTH", "EAST", "SOUTH", "UP"] },
    { ...valid(), anchorIds: "NORTH EAST SOUTH WEST" },
    { ...valid(), anchorIds: null },
    { ...valid(), extra: true },
    { runEpoch: 7, encounterOrdinal: 3, physicsFrame: 11, chassisId: "TITAN_CORE",
      anchorIds: ["NORTH", "EAST", "SOUTH", "WEST"] },
  ];
  for (const item of cases) assert.equal(resolveBlackoutArchitectEncounterClaimPreflight(item), null, JSON.stringify(item));
});

test("J9L-B2B1 refuses inherited/accessor/symbol/proxy/sparse claims", () => {
  const inherited = Object.create(valid());
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight(inherited), null);
  const nullPrototype = Object.assign(Object.create(null), valid());
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight(nullPrototype), null);
  const withSymbol = Object.assign(valid(), { [Symbol("spoof")]: 4 });
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight(withSymbol), null);
  const withGetter = valid();
  Object.defineProperty(withGetter, "runEpoch", { get() { throw new Error("must not run"); } });
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight(withGetter), null);
  const roster = ["NORTH", "EAST", "SOUTH", "WEST"];
  Object.defineProperty(roster, "1", { get() { throw new Error("must not run"); } });
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight({ ...valid(), anchorIds: roster }), null);
  const sparse = ["NORTH", "EAST", "SOUTH", "WEST"];
  delete sparse[2];
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight({ ...valid(), anchorIds: sparse }), null);
  const withArraySymbol = ["NORTH", "EAST", "SOUTH", "WEST"];
  Object.defineProperty(withArraySymbol, Symbol("extra"), { value: true });
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight({ ...valid(), anchorIds: withArraySymbol }), null);
  const throwingProxy = new Proxy(valid(), { ownKeys() { throw new Error("trap"); } });
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight(throwingProxy), null);
  const throwingRoster = new Proxy(["NORTH", "EAST", "SOUTH", "WEST"], { getPrototypeOf() { throw new Error("trap"); } });
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight({ ...valid(), anchorIds: throwingRoster }), null);
  const arraySubclass = class extends Array {};
  assert.equal(resolveBlackoutArchitectEncounterClaimPreflight({ ...valid(), anchorIds: new arraySubclass("NORTH", "EAST", "SOUTH", "WEST") }), null);
});

test("J9L-B2B1 never consumes or reserves a projectile or creates trusted freshness", () => {
  const input = valid();
  const a = resolveBlackoutArchitectEncounterClaimPreflight(input);
  const b = resolveBlackoutArchitectEncounterClaimPreflight(input);
  assert.ok(a && b);
  assert.equal(a.engineEncounterIssued, false);
  assert.equal(a.lifecycleFreshnessVerified, false);
  assert.equal(a.collisionProvenanceVerified, false);
  assert.equal(a.consumesProjectile, false);
  assert.equal(a.preventsReplay, false);
  assert.deepEqual(a, b);
  input.anchorIds[0] = "WEST";
  assert.deepEqual(a.anchorIds, ["NORTH", "EAST", "SOUTH", "WEST"]);
});
