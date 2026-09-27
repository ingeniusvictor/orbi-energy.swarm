import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildSpatialIndex,
  findAllCollidingSpatialItems,
  findFirstCollidingSpatialItem,
  findNearestSpatialItem,
  querySpatialIndex,
} from "../src/game/spatialIndex.ts";

interface Point {
  id: string;
  x: number;
  y: number;
  radius: number;
  enabled?: boolean;
}

const build = (items: Point[]) =>
  buildSpatialIndex(items, {
    cellSize: 64,
    getX: (item) => item.x,
    getY: (item) => item.y,
    getRadius: (item) => item.radius,
  });

test("public querySpatialIndex remains compatible and ordered by bucket traversal", () => {
  const items: Point[] = [
    { id: "a", x: 10, y: 10, radius: 4 },
    { id: "b", x: 70, y: 10, radius: 4 },
    { id: "c", x: 10, y: 70, radius: 4 },
  ];
  const result = querySpatialIndex(
    build(items),
    32,
    32,
    100,
  );

  assert.deepEqual(
    result.entries.map((entry) => entry.item.id),
    ["a", "b", "c"],
  );
  assert.equal(result.candidateChecks, 3);
});

test("nearest direct traversal preserves distance and original-order tie-break", () => {
  const items: Point[] = [
    { id: "first", x: 90, y: 100, radius: 4 },
    { id: "second", x: 110, y: 100, radius: 4 },
  ];

  const result = findNearestSpatialItem(
    build(items),
    100,
    100,
    100,
  );

  assert.equal(result.item?.id, "first");
  assert.equal(result.distanceSquared, 100);
  assert.equal(result.candidateChecks, 2);
});

test("first collision direct traversal preserves lowest original order", () => {
  const items: Point[] = [
    { id: "first", x: 108, y: 100, radius: 8 },
    { id: "closer", x: 102, y: 100, radius: 8 },
  ];

  const result = findFirstCollidingSpatialItem(
    build(items),
    100,
    100,
    4,
  );

  assert.equal(result.item?.id, "first");
  assert.equal(result.entry?.order, 0);
  assert.equal(result.distanceSquared, 64);
});

test("multi collision direct traversal sorts final matches by original order", () => {
  const items: Point[] = [
    { id: "first", x: 130, y: 130, radius: 20 },
    { id: "second", x: 118, y: 118, radius: 20 },
    { id: "third", x: 125, y: 125, radius: 20 },
  ];

  const result = findAllCollidingSpatialItems(
    build(items),
    120,
    120,
    16,
  );

  assert.deepEqual(
    result.entries.map((entry) => entry.item.id),
    ["first", "second", "third"],
  );
});

test("include predicates do not change candidateChecks semantics", () => {
  const items: Point[] = [
    {
      id: "disabled-near",
      x: 101,
      y: 100,
      radius: 8,
      enabled: false,
    },
    {
      id: "enabled",
      x: 110,
      y: 100,
      radius: 8,
      enabled: true,
    },
  ];
  const index = build(items);

  const nearest = findNearestSpatialItem(
    index,
    100,
    100,
    100,
    (item) => item.enabled === true,
  );
  const first = findFirstCollidingSpatialItem(
    index,
    100,
    100,
    4,
    (item) => item.enabled === true,
  );

  assert.equal(nearest.item?.id, "enabled");
  assert.equal(nearest.candidateChecks, 2);
  assert.equal(first.item?.id, "enabled");
  assert.equal(first.candidateChecks, 2);
});

test("hot nearest and collision helpers no longer allocate through querySpatialIndex", () => {
  const source = readFileSync(
    new URL("../src/game/spatialIndex.ts", import.meta.url),
    "utf8",
  );

  const nearestStart = source.indexOf(
    "export const findNearestSpatialItem",
  );
  const relocateStart = source.indexOf(
    "export const relocateSpatialIndexEntry",
    nearestStart,
  );
  const nearest = source.slice(
    nearestStart,
    relocateStart,
  );

  const allStart = source.indexOf(
    "export const findAllCollidingSpatialItems",
  );
  const firstStart = source.indexOf(
    "export const findFirstCollidingSpatialItem",
    allStart,
  );
  const all = source.slice(allStart, firstStart);
  const first = source.slice(firstStart);

  for (const hotHelper of [nearest, all, first]) {
    assert.doesNotMatch(
      hotHelper,
      /querySpatialIndex\(/,
    );
    assert.match(
      hotHelper,
      /index\.buckets\.get\(/,
    );
  }
});

test("public querySpatialIndex implementation remains present", () => {
  const source = readFileSync(
    new URL("../src/game/spatialIndex.ts", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /export const querySpatialIndex =/,
  );
  assert.match(
    source,
    /entries\.push\(\.\.\.bucket\)/,
  );
});
