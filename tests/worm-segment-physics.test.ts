import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_WORM_SEGMENT_PHYSICS,
  WORM_SEGMENT_CAP,
  createWormSegmentChain,
  removeWormSegment,
  stepWormSegmentChain,
  stepWormSegmentChainInPlace,
} from "../src/game/wormSegmentPhysics.ts";

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

test("Worm chain creation is fixed-count and starts at deterministic spacing", () => {
  const chain = createWormSegmentChain(99, { x: 400, y: 240 });
  assert.equal(chain.length, WORM_SEGMENT_CAP);
  assert.equal(chain.length, 6);
  assert.deepEqual(chain.map((segment) => segment.id), [
    "worm-segment-1",
    "worm-segment-2",
    "worm-segment-3",
    "worm-segment-4",
    "worm-segment-5",
    "worm-segment-6",
  ]);
  assert.equal(distance({ x: 400, y: 240 }, chain[0]), DEFAULT_WORM_SEGMENT_PHYSICS.spacing);
  for (let index = 1; index < chain.length; index += 1) {
    assert.equal(distance(chain[index - 1], chain[index]), DEFAULT_WORM_SEGMENT_PHYSICS.spacing);
  }
});

test("Worm physics is deterministic and velocity remains bounded", () => {
  const initial = createWormSegmentChain(6, { x: 0, y: 0 });
  const leader = { x: 180, y: 70 };
  const a = stepWormSegmentChain(initial, leader, 16.6667);
  const b = stepWormSegmentChain(initial, leader, 16.6667);
  assert.deepEqual(a, b);
  for (const segment of a) {
    assert.ok(Math.hypot(segment.vx, segment.vy) <= DEFAULT_WORM_SEGMENT_PHYSICS.maxSpeedPerFrame + 1e-9);
  }
});

test("allocation-free step preserves array and segment object identity", () => {
  const chain = createWormSegmentChain(6, { x: 0, y: 0 });
  const sameArray = chain;
  const sameSegments = [...chain];

  stepWormSegmentChainInPlace(chain, { x: 180, y: 70 }, 1000 / 60);

  assert.equal(chain, sameArray);
  assert.equal(chain.length, 6);
  for (let index = 0; index < chain.length; index += 1) {
    assert.equal(chain[index], sameSegments[index]);
    assert.ok(Number.isFinite(chain[index].x));
    assert.ok(Number.isFinite(chain[index].y));
    assert.ok(Math.hypot(chain[index].vx, chain[index].vy) <= DEFAULT_WORM_SEGMENT_PHYSICS.maxSpeedPerFrame + 1e-9);
  }
});

test("Worm chain converges toward bounded spacing behind a moving head", () => {
  let chain = createWormSegmentChain(6, { x: 0, y: 0 });
  const leader = { x: 220, y: 80 };

  for (let frame = 0; frame < 240; frame += 1) {
    chain = stepWormSegmentChain(chain, leader, 1000 / 60);
  }

  assert.ok(distance(leader, chain[0]) < DEFAULT_WORM_SEGMENT_PHYSICS.spacing * 1.35);
  for (let index = 1; index < chain.length; index += 1) {
    assert.ok(distance(chain[index - 1], chain[index]) < DEFAULT_WORM_SEGMENT_PHYSICS.spacing * 1.4);
  }
});

test("substepping keeps 60Hz and 120Hz integration close", () => {
  const initial = createWormSegmentChain(6, { x: 0, y: 0 });
  const leader = { x: 180, y: -60 };
  let sixty = initial;
  let oneTwenty = initial;

  for (let frame = 0; frame < 120; frame += 1) {
    sixty = stepWormSegmentChain(sixty, leader, 1000 / 60);
  }
  for (let frame = 0; frame < 240; frame += 1) {
    oneTwenty = stepWormSegmentChain(oneTwenty, leader, 1000 / 120);
  }

  for (let index = 0; index < sixty.length; index += 1) {
    assert.ok(distance(sixty[index], oneTwenty[index]) < 8);
  }
});

test("destroyed segments are removed once and survivors reconnect deterministically", () => {
  const initial = createWormSegmentChain(6, { x: 0, y: 0 });
  let chain = removeWormSegment(initial, "worm-segment-3");
  assert.equal(chain.length, 5);
  assert.equal(chain.some((segment) => segment.id === "worm-segment-3"), false);
  assert.deepEqual(removeWormSegment(chain, "worm-segment-3"), chain);

  const leader = { x: 160, y: 30 };
  for (let frame = 0; frame < 240; frame += 1) {
    chain = stepWormSegmentChain(chain, leader, 1000 / 60);
  }

  const index2 = chain.findIndex((segment) => segment.id === "worm-segment-2");
  const index4 = chain.findIndex((segment) => segment.id === "worm-segment-4");
  assert.equal(index4, index2 + 1);
  assert.ok(distance(chain[index2], chain[index4]) < DEFAULT_WORM_SEGMENT_PHYSICS.spacing * 1.4);
});
