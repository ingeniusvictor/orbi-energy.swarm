import assert from "node:assert/strict";
import test from "node:test";

import {
  getInfiniteBossAttackWeight,
  getInfiniteBossFamilyProfile,
  selectInfiniteBossIdentity,
} from "../src/game/infiniteBossFamily.ts";
import { EnemyType } from "../src/game/types.ts";

test("Infinite boss family rotates deterministically every 25 sectors", () => {
  assert.equal(selectInfiniteBossIdentity(25), "DEVOURER_ASCENDANT");
  assert.equal(selectInfiniteBossIdentity(50), "NULL_ARCHITECT");
  assert.equal(selectInfiniteBossIdentity(75), "RIFT_MATRIARCH");
  assert.equal(selectInfiniteBossIdentity(100), "SIEGE_CATHEDRAL");
  assert.equal(selectInfiniteBossIdentity(125), "DEVOURER_ASCENDANT");
  assert.equal(selectInfiniteBossIdentity(150), "NULL_ARCHITECT");
});

test("boss profiles use bounded H4 specialist support", () => {
  const nullArchitect = getInfiniteBossFamilyProfile("NULL_ARCHITECT");
  const matriarch = getInfiniteBossFamilyProfile("RIFT_MATRIARCH");
  const cathedral = getInfiniteBossFamilyProfile("SIEGE_CATHEDRAL");

  assert.equal(nullArchitect.supportEnemyType, EnemyType.VOID_ANCHOR);
  assert.ok(nullArchitect.supportMaxCount <= 3);
  assert.ok(nullArchitect.supportCooldownMs >= 6000);

  assert.equal(matriarch.supportEnemyType, EnemyType.RIFT_HUNTER);
  assert.ok(matriarch.supportMaxCount <= 3);

  assert.equal(cathedral.supportEnemyType, EnemyType.SIEGE_PRISM);
  assert.ok(cathedral.supportMaxCount <= 3);
});

test("boss attack identity changes weighting without producing zero-weight attacks", () => {
  assert.ok(
    getInfiniteBossAttackWeight("NULL_ARCHITECT", "gravity_well", 1) > 1,
  );
  assert.ok(
    getInfiniteBossAttackWeight("RIFT_MATRIARCH", "devourer_charge", 1) > 1,
  );
  assert.ok(
    getInfiniteBossAttackWeight("SIEGE_CATHEDRAL", "devourer_beam", 1) > 1,
  );
  assert.ok(
    getInfiniteBossAttackWeight("NULL_ARCHITECT", "devourer_charge", 1) > 0,
  );
  assert.equal(
    getInfiniteBossAttackWeight(undefined, "gravity_well", 1.25),
    1.25,
  );
});
