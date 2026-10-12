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
    energyId === "HYDRO"
      ? "hydro"
      : energyId === "TERMO"
        ? "thermal"
        : energyId === "ATON"
          ? "nuclear"
          : energyId === "FOTON"
            ? "solar"
            : energyId === "GAIA"
              ? "gaia"
              : "quantum",
  combatRole,
  energyId,
  personality: "TEST",
  evolutionStage: 1,
  level,
  xp,
});

test("H12 requires the full bounded fusion-energy activation cost", () => {
  const sources = [
    member({ id: "aton-a", energyId: "ATON", combatRole: "beam" }),
    member({ id: "aton-b", energyId: "ATON", combatRole: "beam" }),
    member({ id: "aton-c", energyId: "ATON", combatRole: "beam" }),
  ];

  assert.equal(
    resolveAffinityFusion(sources, AFFINITY_FUSION_ENERGY_COST - 1),
    null,
  );
  assert.equal(AFFINITY_FUSION_SOURCE_COUNT, 3);
});

test("H12 never fabricates a fusion at 100 energy without a valid recipe", () => {
  const incomplete = [
    member({ id: "hydro-a", energyId: "HYDRO", combatRole: "pulse" }),
    member({ id: "termo-b", energyId: "TERMO", combatRole: "pulse" }),
  ];

  assert.equal(
    resolveAffinityFusion(incomplete, AFFINITY_FUSION_ENERGY_COST),
    null,
  );
});

test("three collectible beam-role followers resolve to the existing Solar Guardian body", () => {
  const resolution = resolveAffinityFusion(
    [
      member({ id: "aton-c", energyId: "ATON", combatRole: "beam" }),
      member({ id: "aton-a", energyId: "ATON", combatRole: "beam" }),
      member({ id: "aton-b", energyId: "ATON", combatRole: "beam" }),
    ],
    100,
  );

  assert.ok(resolution);
  assert.equal(resolution.recipe.id, "BEAM_SOLAR_GUARDIAN");
  assert.equal(resolution.recipe.output.type, OrbiType.SOLAR_GUARDIAN);
  assert.equal(resolution.recipe.output.attackSignature, "FOTON_LANCE");
  assert.deepEqual(resolution.sourceIds, ["aton-a", "aton-b", "aton-c"]);
});

test("three pulse-role followers resolve to the existing Hydro Leviathan body", () => {
  const resolution = resolveAffinityFusion(
    [
      member({ id: "hydro-a", energyId: "HYDRO", combatRole: "pulse" }),
      member({ id: "termo-b", energyId: "TERMO", combatRole: "pulse" }),
      member({ id: "hydro-c", energyId: "HYDRO", combatRole: "pulse" }),
    ],
    100,
  );

  assert.ok(resolution);
  assert.equal(resolution.recipe.id, "PULSE_HYDRO_LEVIATHAN");
  assert.equal(resolution.recipe.output.type, OrbiType.HYDRO_LEVIATHAN);
  assert.equal(resolution.recipe.output.attackSignature, "HYDRO_PULSE");
});

test("source selection preserves stronger veterans and is stable across input order", () => {
  const roster = [
    member({ id: "veteran", energyId: "HYDRO", combatRole: "pulse", level: 8, xp: 40 }),
    member({ id: "weak-z", energyId: "TERMO", combatRole: "pulse", level: 1, xp: 0 }),
    member({ id: "weak-a", energyId: "HYDRO", combatRole: "pulse", level: 1, xp: 0 }),
    member({ id: "mid", energyId: "TERMO", combatRole: "pulse", level: 2, xp: 4 }),
  ];

  const forward = resolveAffinityFusion(roster, 100);
  const reversed = resolveAffinityFusion([...roster].reverse(), 100);

  assert.ok(forward);
  assert.ok(reversed);
  assert.deepEqual(forward.sourceIds, ["weak-a", "weak-z", "mid"]);
  assert.deepEqual(reversed.sourceIds, forward.sourceIds);
  assert.ok(!forward.sourceIds.includes("veteran"));
});

test("FOTON, GAIA, fusion-class bodies and identity-less followers can never be fusion sources", () => {
  const foton = member({ id: "foton", energyId: "FOTON", combatRole: "beam", type: OrbiType.FOTON });
  const gaia = member({ id: "gaia", energyId: "GAIA", combatRole: "support", type: OrbiType.SHIELD });
  const priorFusion = member({
    id: "legacy-fusion",
    energyId: "ATON",
    combatRole: "beam",
    type: OrbiType.SOLAR_GUARDIAN,
  });
  const unknown = member({ id: "unknown", combatRole: "beam" });

  assert.equal(isAffinityFusionSource(foton), false);
  assert.equal(isAffinityFusionSource(gaia), false);
  assert.equal(isAffinityFusionSource(priorFusion), false);
  assert.equal(isAffinityFusionSource(unknown), false);

  assert.equal(
    resolveAffinityFusion([foton, priorFusion, unknown], 100),
    null,
  );
});

test("when beam and pulse recipes are both eligible the certified recipe order is deterministic", () => {
  const both = [
    member({ id: "aton-a", energyId: "ATON", combatRole: "beam" }),
    member({ id: "aton-b", energyId: "ATON", combatRole: "beam" }),
    member({ id: "aton-c", energyId: "ATON", combatRole: "beam" }),
    member({ id: "hydro-a", energyId: "HYDRO", combatRole: "pulse" }),
    member({ id: "hydro-b", energyId: "HYDRO", combatRole: "pulse" }),
    member({ id: "termo-c", energyId: "TERMO", combatRole: "pulse" }),
  ];

  assert.equal(
    resolveAffinityFusion(both, 100)?.recipe.id,
    "BEAM_SOLAR_GUARDIAN",
  );
});

test("applyAffinityFusion performs an exact non-mutating 3-to-1 transformation", () => {
  const sources = [
    member({ id: "hydro-a", energyId: "HYDRO", combatRole: "pulse" }),
    member({ id: "termo-b", energyId: "TERMO", combatRole: "pulse" }),
    member({ id: "hydro-c", energyId: "HYDRO", combatRole: "pulse" }),
  ];
  const survivor = member({ id: "aero-survivor", energyId: "AERO", combatRole: "rapid", level: 7 });
  const veteran = member({ id: "hydro-veteran", energyId: "HYDRO", combatRole: "pulse", level: 9, xp: 52 });
  const roster = [...sources, survivor, veteran];
  const snapshot = roster.map((entry) => ({ ...entry }));
  const resolution = resolveAffinityFusion(roster, 100);

  assert.ok(resolution);
  const applied = applyAffinityFusion(
    roster,
    resolution,
    "fusion-hydro-1",
    { x: 80, y: 90 },
  );

  assert.ok(applied);
  assert.equal(roster.length, 5);
  assert.deepEqual(roster, snapshot);
  assert.equal(applied.members.length, 3);
  assert.deepEqual(
    applied.consumedMembers.map((entry) => entry.id),
    ["hydro-a", "hydro-c", "termo-b"],
  );
  assert.ok(applied.members.some((entry) => entry.id === "aero-survivor"));
  assert.ok(applied.members.some((entry) => entry.id === "hydro-veteran"));
  assert.equal(applied.fusedMember.id, "fusion-hydro-1");
  assert.equal(applied.fusedMember.type, OrbiType.HYDRO_LEVIATHAN);
  assert.equal(applied.fusedMember.level, 5);
  assert.equal(applied.fusedMember.energyId, undefined);
  assert.equal(applied.fusedMember.x, 80);
  assert.equal(applied.fusedMember.y, 90);
});

test("applyAffinityFusion fails closed when a previously resolved source is stale", () => {
  const roster = [
    member({ id: "aton-a", energyId: "ATON", combatRole: "beam" }),
    member({ id: "aton-b", energyId: "ATON", combatRole: "beam" }),
    member({ id: "aton-c", energyId: "ATON", combatRole: "beam" }),
  ];
  const resolution = resolveAffinityFusion(roster, 100);
  assert.ok(resolution);

  assert.equal(
    applyAffinityFusion(
      roster.slice(0, 2),
      resolution,
      "fusion-stale",
      { x: 0, y: 0 },
    ),
    null,
  );
});

test("fusion-energy consumption is bounded and only removes one certified activation cost", () => {
  assert.equal(consumeAffinityFusionEnergy(100), 0);
  assert.equal(consumeAffinityFusionEnergy(140), 40);
  assert.equal(consumeAffinityFusionEnergy(80), 0);
  assert.equal(consumeAffinityFusionEnergy(Number.NaN), 0);
});
