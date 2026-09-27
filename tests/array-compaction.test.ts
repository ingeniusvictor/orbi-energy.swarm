import assert from "node:assert/strict";
import test from "node:test";

import { compactArrayInPlace } from "../src/game/arrayCompaction.ts";

test("compaction preserves array identity and stable order", () => {
  const items = [
    { id: "a", keep: true },
    { id: "b", keep: false },
    { id: "c", keep: true },
    { id: "d", keep: false },
    { id: "e", keep: true },
  ];
  const original = items;

  const result = compactArrayInPlace(
    items,
    (item) => item.keep,
  );

  assert.equal(result, original);
  assert.equal(items, original);
  assert.deepEqual(
    items.map((item) => item.id),
    ["a", "c", "e"],
  );
});

test("compaction preserves surviving object identities", () => {
  const a = { id: "a" };
  const b = { id: "b" };
  const c = { id: "c" };
  const items = [a, b, c];

  compactArrayInPlace(
    items,
    (item) => item !== b,
  );

  assert.equal(items.length, 2);
  assert.equal(items[0], a);
  assert.equal(items[1], c);
});

test("compaction can retain all entries without reallocating", () => {
  const items = [1, 2, 3, 4];
  const original = items;

  compactArrayInPlace(items, () => true);

  assert.equal(items, original);
  assert.deepEqual(items, [1, 2, 3, 4]);
});

test("compaction can clear an array in place", () => {
  const items = [1, 2, 3];
  const original = items;

  compactArrayInPlace(items, () => false);

  assert.equal(items, original);
  assert.equal(items.length, 0);
});

test("predicate receives original stable read indexes", () => {
  const indexes: number[] = [];
  const items = ["a", "b", "c", "d"];

  compactArrayInPlace(items, (_item, index) => {
    indexes.push(index);
    return index % 2 === 0;
  });

  assert.deepEqual(indexes, [0, 1, 2, 3]);
  assert.deepEqual(items, ["a", "c"]);
});
