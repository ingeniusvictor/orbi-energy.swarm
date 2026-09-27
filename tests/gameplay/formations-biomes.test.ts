import assert from "node:assert/strict";
import test from "node:test";

import { BIOMES, BIOME_ROTATION, getBiomeConfig } from "../../src/game/biomes.ts";
import { calculateSwarmOffset, FORMATIONS } from "../../src/game/formations.ts";
import { BiomeType, FormationType } from "../../src/game/types.ts";

const formationTypes = [
  FormationType.LINE,
  FormationType.CIRCLE,
  FormationType.DELTA,
  FormationType.SHIELD,
  FormationType.V_SHAPE,
  FormationType.SCATTERED,
];

test("all six original formations remain configured", () => {
  assert.equal(Object.keys(FORMATIONS).length, 6);
  for (const type of formationTypes) {
    const config = FORMATIONS[type];
    assert.ok(config);
    assert.equal(config.type, type);
    assert.ok(config.name.length > 0);
    assert.ok(Number.isFinite(config.spacing));
  }
});

test("formation geometry returns finite offsets", () => {
  for (const type of formationTypes) {
    for (let index = 0; index < 8; index += 1) {
      const offset = calculateSwarmOffset(type, index, 12, 1000, 0.75);
      assert.ok(Number.isFinite(offset.x), `${type} x offset should be finite`);
      assert.ok(Number.isFinite(offset.y), `${type} y offset should be finite`);
    }
  }
});

test("six-biome rotation remains stable and resolvable", () => {
  assert.equal(BIOME_ROTATION.length, 6);
  assert.equal(new Set(BIOME_ROTATION).size, 6);
  for (const biome of BIOME_ROTATION) {
    assert.equal(getBiomeConfig(biome).type, biome);
    assert.ok(BIOMES[biome].enemySpawnRate > 0);
  }
  assert.equal(getBiomeConfig("UNKNOWN" as BiomeType).type, BiomeType.SOLAR_PLAINS);
});
