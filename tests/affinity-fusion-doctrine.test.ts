import assert from "node:assert/strict";
import test from "node:test";

import {
  applyAffinityFusion,
  resolveAffinityFusion,
} from "../src/game/affinityFusionDirector";
import {
  createSwarmDoctrineState,
  getSwarmDoctrineCapacity,
  registerSwarmDoctrineMember,
} from "../src/game/swarmDoctrine";
import { OrbiType, type OrbiMember } from "../src/game/types";

const pulseMember = (id: string, level: number, xp: number): OrbiMember => ({
  id,
  type: OrbiType.PULSE,
  name: id,
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  color: "#38bdf8",
  size: 5,
  shootCooldown: 60,
  affinity: "hydro",
  combatRole: "pulse",
  energyId: "HYDRO",
  attackSignature: "HYDRO_PULSE",
  personality: "TEST",
  evolutionStage: 2,
  level,
  xp,
});

test("H12 source consumption never revokes already-earned Swarm Doctrine capacity", () => {
  const roster = [
    pulseMember("founder-a", 5, 16),
    pulseMember("founder-b", 5, 16),
    pulseMember("founder-c", 5, 16),
  ];

  let doctrine = createSwarmDoctrineState();
  for (const source of roster) {
    doctrine = registerSwarmDoctrineMember(doctrine, source.id, source.level);
  }

  const capacityBefore = getSwarmDoctrineCapacity(doctrine);
  const doctrineSnapshot = {
    founderIds: [...doctrine.founderIds],
    founderLevel5Ids: [...doctrine.founderLevel5Ids],
    level10Ids: [...doctrine.level10Ids],
  };
  const resolution = resolveAffinityFusion(roster, 100);
  assert.ok(resolution);

  const applied = applyAffinityFusion(
    roster,
    resolution,
    "fusion-hydro",
    { x: 0, y: 0 },
  );
  assert.ok(applied);
  assert.equal(applied.members.length, 1);

  assert.deepEqual(doctrine, doctrineSnapshot);
  assert.equal(getSwarmDoctrineCapacity(doctrine), capacityBefore);
  assert.deepEqual(doctrine.founderLevel5Ids, [
    "founder-a",
    "founder-b",
    "founder-c",
  ]);
});

test("the level-5 fusion body is deliberately absent from doctrine until later legitimate progression", () => {
  const roster = [
    pulseMember("source-a", 1, 0),
    pulseMember("source-b", 1, 0),
    pulseMember("source-c", 1, 0),
  ];
  let doctrine = createSwarmDoctrineState();
  for (const source of roster) {
    doctrine = registerSwarmDoctrineMember(doctrine, source.id, source.level);
  }

  const resolution = resolveAffinityFusion(roster, 100);
  assert.ok(resolution);
  const applied = applyAffinityFusion(
    roster,
    resolution,
    "fusion-not-founder",
    { x: 0, y: 0 },
  );
  assert.ok(applied);
  assert.equal(applied.fusedMember.level, 5);
  assert.ok(!doctrine.founderIds.includes(applied.fusedMember.id));
  assert.ok(!doctrine.founderLevel5Ids.includes(applied.fusedMember.id));
});
