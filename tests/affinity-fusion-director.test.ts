import assert from "node:assert/strict";
import test from "node:test";

import {
  AFFINITY_FUSION_ENERGY_COST,
  AFFINITY_FUSION_SOURCE_COUNT,
  applyAffinityFusion,
  consumeAffinityFusionEnergy,
  isAffinityFusionSource,
  resolveAffinityFusion,
} from "../src/game/affinityFusionDirector";
import {
  OrbiType,
  type OrbiCombatRole,
  type OrbiEnergyId,
  type OrbiMember,
} from "../src/game/types";

const member = ({
  id,
  energyId,
  combatRole,
  level = 1,
  xp = 0,
  type = OrbiType.BEAM,
}: {
  id: string;
  energyId?: OrbiEnergyId;
  combatRole: OrbiCombatRole;
  level?: number;
  xp?: number;
  type?: OrbiType;
}): OrbiMember => ({
  id,
  type,
  name: id,
  x: 10,
  y: 20,
  targetX: 10,
  targetY: 20,
  color: "#ffffff",
  size: 5,
  shootCooldown: 60,
  affinity:
    energyId === "HYDRO" ? "hydro" :
    energyId === "TERMO" ? "thermal" :
    energyId === "ATON" ? "nuclear" :
    energyId === "FOTON" ? "solar" :
    energyId === "GAIA" ? "gaia" : "quantum",
  combatRole,
  energyId,
  personality: "TEST",
  evolutionStage: 1,
  level,
  xp,
});

const foton = (id: string, level = 1) =>
  member({ id, energyId: "FOTON", combatRole: "beam", level });
const hydro = (id: string, level = 1, xp = 0) =>
  member({ id, energyId: "HYDRO", combatRole: "pulse", level, xp });

test("H12 bounded activation cost requires the full meter", () => {
  const sources = [foton("solar-a"), foton("solar-b"), foton("solar-c")];
  assert.equal(resolveAffinityFusion(sources, AFFINITY_FUSION_ENERGY_COST - 1), null);
  assert.equal(AFFINITY_FUSION_SOURCE_COUNT, 3);
});

test("three same-energy FOTON create Solar Guardian, never three ATON beams", () => {
  const aton = member({ id: "aton", energyId: "ATON", combatRole: "beam" });
  const resolution = resolveAffinityFusion(
    [foton("solar-c"), aton, foton("solar-a"), foton("solar-b")], 100,
  );
  assert.ok(resolution);
  assert.equal(resolution.recipe.id, "BEAM_SOLAR_GUARDIAN");
  assert.equal(resolution.recipe.sourceEnergyId, "FOTON");
  assert.equal(resolution.recipe.output.energyId, "FOTON");
  assert.equal(resolution.recipe.output.attackSignature, "FOTON_LANCE");
  assert.deepEqual(resolution.sourceIds, ["solar-a", "solar-b", "solar-c"]);
  assert.equal(resolveAffinityFusion([aton, aton], 100), null);
});

test("only three HYDRO create Hydro Leviathan, never mixtures with TERMO", () => {
  const thermo = member({ id: "termo", energyId: "TERMO", combatRole: "pulse" });
  assert.equal(resolveAffinityFusion([hydro("hydro-a"), hydro("hydro-b"), thermo], 100), null);
  const resolution = resolveAffinityFusion(
    [hydro("hydro-c"), thermo, hydro("hydro-a"), hydro("hydro-b")], 100,
  );
  assert.ok(resolution);
  assert.equal(resolution.recipe.id, "PULSE_HYDRO_LEVIATHAN");
  assert.equal(resolution.recipe.sourceEnergyId, "HYDRO");
  assert.equal(resolution.recipe.output.attackSignature, "HYDRO_PULSE");
  assert.deepEqual(resolution.sourceIds, ["hydro-a", "hydro-b", "hydro-c"]);
});

test("source choice preserves stronger veterans and stays stable across input order", () => {
  const roster = [
    hydro("veteran", 8, 40),
    hydro("weak-z", 1),
    hydro("weak-a", 1),
    hydro("mid", 2, 4),
    member({ id: "termo-ignored", energyId: "TERMO", combatRole: "pulse" }),
  ];
  const forward = resolveAffinityFusion(roster, 100);
  const reversed = resolveAffinityFusion([...roster].reverse(), 100);
  assert.ok(forward);
  assert.ok(reversed);
  assert.deepEqual(forward.sourceIds, ["weak-a", "weak-z", "mid"]);
  assert.deepEqual(reversed.sourceIds, forward.sourceIds);
});

test("protected EVO8 founders are skipped rather than blocking valid reserves", () => {
  const roster = [
    foton("founder"),
    foton("extra-c"),
    foton("extra-a"),
    foton("extra-b"),
  ];
  const protectedIds = new Set(["founder"]);
  const resolution = resolveAffinityFusion(roster, 100, protectedIds);
  assert.ok(resolution);
  assert.deepEqual(resolution.sourceIds, ["extra-a", "extra-b", "extra-c"]);
  assert.deepEqual(
    resolveAffinityFusion([...roster].reverse(), 100, protectedIds)?.sourceIds,
    resolution.sourceIds,
  );
  assert.equal(resolveAffinityFusion(roster.slice(0, 3), 100, protectedIds), null);
});

test("FOTON is a legitimate photovoltaic source; GAIA, ATON, fusion classes and untagged bodies are not", () => {
  const gaia = member({ id: "gaia", energyId: "GAIA", combatRole: "support", type: OrbiType.SHIELD });
  const priorFusion = member({ id: "fusion", energyId: "FOTON", combatRole: "beam", type: OrbiType.SOLAR_GUARDIAN });
  const aton = member({ id: "aton", energyId: "ATON", combatRole: "beam" });
  const unknown = member({ id: "unknown", combatRole: "beam" });
  assert.equal(isAffinityFusionSource(foton("photovoltaic")), true);
  assert.equal(isAffinityFusionSource(hydro("water")), true);
  for (const invalid of [gaia, priorFusion, aton, unknown]) {
    assert.equal(isAffinityFusionSource(invalid), false);
  }
  assert.equal(resolveAffinityFusion([gaia, priorFusion, aton, unknown], 100), null);
});

test("when both canonical recipes are eligible Solar Guardian retains deterministic priority", () => {
  const roster = [
    ...[foton("solar-a"), foton("solar-b"), foton("solar-c")],
    ...[hydro("hydro-a"), hydro("hydro-b"), hydro("hydro-c")],
  ];
  assert.equal(resolveAffinityFusion(roster, 100)?.recipe.id, "BEAM_SOLAR_GUARDIAN");
});

test("3-to-1 fusion is immutable, retains canonical energyId and separate fusionRank", () => {
  const sources = [hydro("hydro-a"), hydro("hydro-b"), hydro("hydro-c")];
  const survivor = member({ id: "termo-survivor", energyId: "TERMO", combatRole: "pulse" });
  const veteran = hydro("hydro-veteran", 8, 52);
  const roster = [...sources, survivor, veteran];
  const snapshot = roster.map((entry) => ({ ...entry }));
  const resolution = resolveAffinityFusion(roster, 100);
  assert.ok(resolution);
  const applied = applyAffinityFusion(roster, resolution, "fusion-hydro-1", { x: 80, y: 90 });
  assert.ok(applied);
  assert.deepEqual(roster, snapshot);
  assert.equal(applied.members.length, 3);
  assert.deepEqual(applied.consumedMembers.map((entry) => entry.id), [
    "hydro-a", "hydro-b", "hydro-c",
  ]);
  assert.ok(applied.members.some((entry) => entry.id === "termo-survivor"));
  assert.ok(applied.members.some((entry) => entry.id === "hydro-veteran"));
  assert.equal(applied.fusedMember.type, OrbiType.HYDRO_LEVIATHAN);
  assert.equal(applied.fusedMember.energyId, "HYDRO");
  assert.equal(applied.fusedMember.fusionRank, 1);
  // Legacy fusion combat tier and physical hitbox stay unchanged; this is NOT an EVO8 promotion.
  assert.equal(applied.fusedMember.level, 5);
  assert.equal(applied.fusedMember.size, 16);
  assert.equal(applied.fusedMember.x, 80);
  assert.equal(applied.fusedMember.y, 90);
});

test("an applied Solar Guardian has solar signature without inventing a tenth energy", () => {
  const roster = [foton("solar-a"), foton("solar-b"), foton("solar-c")];
  const resolution = resolveAffinityFusion(roster, 100);
  assert.ok(resolution);
  const applied = applyAffinityFusion(roster, resolution, "solar-fusion", { x: 0, y: 0 });
  assert.ok(applied);
  assert.equal(applied.fusedMember.type, OrbiType.SOLAR_GUARDIAN);
  assert.equal(applied.fusedMember.energyId, "FOTON");
  assert.equal(applied.fusedMember.fusionRank, 1);
  assert.equal(applied.fusedMember.attackSignature, "FOTON_LANCE");
});

test("application rejects stale or cross-energy sources even for a previously valid resolution", () => {
  const roster = [foton("solar-a"), foton("solar-b"), foton("solar-c")];
  const resolution = resolveAffinityFusion(roster, 100);
  assert.ok(resolution);
  assert.equal(applyAffinityFusion(roster.slice(0, 2), resolution, "stale", { x: 0, y: 0 }), null);
  const tampered = roster.map((source) =>
    source.id === "solar-c" ? { ...source, energyId: "ATON" as const } : source,
  );
  assert.equal(applyAffinityFusion(tampered, resolution, "cross-energy", { x: 0, y: 0 }), null);
});

test("fusion-energy consumption remains bounded to one activation", () => {
  assert.equal(consumeAffinityFusionEnergy(100), 0);
  assert.equal(consumeAffinityFusionEnergy(140), 40);
  assert.equal(consumeAffinityFusionEnergy(80), 0);
  assert.equal(consumeAffinityFusionEnergy(Number.NaN), 0);
});
