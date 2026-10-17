import assert from "node:assert/strict";
import test from "node:test";

import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  BLACKOUT_ARCHITECT_STRUCTURAL_TOPOLOGY_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectStructuralTopology,
} from "../../src/game/blackoutArchitectStructuralTopology";

const canonicalFacts = (destroyed: boolean) =>
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.map((anchorId) => ({
    anchorId,
    destroyed,
  }));

test("J9B freezes exactly four canonical cardinal structural anchors", () => {
  assert.equal(Object.isFrozen(BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS), true);
  assert.deepEqual(BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS, [
    "NORTH",
    "EAST",
    "SOUTH",
    "WEST",
  ]);
});

test("J9B keeps core exposure locked until every canonical anchor is destroyed", () => {
  const noneDestroyed = resolveBlackoutArchitectStructuralTopology(
    canonicalFacts(false),
  );
  assert.ok(noneDestroyed);
  assert.equal(noneDestroyed.bossId, "BLACKOUT_ARCHITECT");
  assert.equal(noneDestroyed.topologyMode, "TOPOLOGY_ONLY");
  assert.equal(noneDestroyed.destroyedAnchorCount, 0);
  assert.equal(noneDestroyed.coreExposureEligibility, "LOCKED");

  for (let remainingIndex = 0; remainingIndex < 4; remainingIndex += 1) {
    const partialFacts = canonicalFacts(true).map((fact, index) =>
      index === remainingIndex ? { ...fact, destroyed: false } : fact,
    );
    const projection = resolveBlackoutArchitectStructuralTopology(partialFacts);
    assert.ok(projection);
    assert.equal(projection.destroyedAnchorCount, 3);
    assert.equal(projection.coreExposureEligibility, "LOCKED");
  }
});

test("J9B makes core exposure eligible only when all four canonical anchors are destroyed", () => {
  const projection = resolveBlackoutArchitectStructuralTopology(canonicalFacts(true));
  assert.ok(projection);
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(projection.destroyedAnchorCount, 4);
  assert.equal(projection.coreExposureEligibility, "ELIGIBLE");
  assert.equal(projection.anchorIds, BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS);

  const reordered = resolveBlackoutArchitectStructuralTopology([
    { anchorId: "WEST", destroyed: true },
    { anchorId: "NORTH", destroyed: true },
    { anchorId: "SOUTH", destroyed: true },
    { anchorId: "EAST", destroyed: true },
  ]);
  assert.deepEqual(reordered, projection);
});

test("J9B fails closed on missing duplicate unknown padded and non-boolean facts", () => {
  const valid = canonicalFacts(true);

  for (const malformed of [
    valid.slice(0, 3),
    [...valid, { anchorId: "NORTH", destroyed: true }],
    [
      { anchorId: "NORTH", destroyed: true },
      { anchorId: "NORTH", destroyed: true },
      { anchorId: "SOUTH", destroyed: true },
      { anchorId: "WEST", destroyed: true },
    ],
    [
      { anchorId: "NORTH", destroyed: true },
      { anchorId: "EAST", destroyed: true },
      { anchorId: "SOUTH", destroyed: true },
      { anchorId: "UP", destroyed: true },
    ],
    [
      { anchorId: "NORTH", destroyed: true, x: 1 },
      { anchorId: "EAST", destroyed: true },
      { anchorId: "SOUTH", destroyed: true },
      { anchorId: "WEST", destroyed: true },
    ],
    [
      { anchorId: "NORTH", destroyed: 1 },
      { anchorId: "EAST", destroyed: true },
      { anchorId: "SOUTH", destroyed: true },
      { anchorId: "WEST", destroyed: true },
    ],
    null,
    "BLACKOUT_ARCHITECT",
  ]) {
    assert.equal(resolveBlackoutArchitectStructuralTopology(malformed), null);
  }
});

test("J9B authority contract exposes exactly two positive pure authorities", () => {
  assert.equal(
    Object.isFrozen(BLACKOUT_ARCHITECT_STRUCTURAL_TOPOLOGY_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    BLACKOUT_ARCHITECT_STRUCTURAL_TOPOLOGY_AUTHORITY_CONTRACT,
  )
    .filter(([, enabled]) => enabled)
    .map(([authority]) => authority);

  assert.deepEqual(positiveAuthorities, [
    "ownsStructuralTopologyAuthority",
    "ownsCoreExposureEligibilityProjectionAuthority",
  ]);
});
