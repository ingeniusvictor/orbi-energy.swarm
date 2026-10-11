import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const game = read("src/game/EnergySwarmGame.tsx");
const canon = read("src/game/orbiEnergyCanon.ts");
const types = read("src/game/types.ts");

test("game imports the canonical energy registry rather than maintaining a local six-affinity bag", () => {
  assert.match(game, /createShuffledCollectibleEnergyCycle/);
  assert.match(game, /getCollectibleEnergyDefinition/);
  assert.match(game, /getOrbiEnergyByAffinity/);
  assert.doesNotMatch(game, /for \(let i = 0; i < 17; i\+\+\) temp\.push/);
  assert.doesNotMatch(game, /getNextAffinityFromBag/);
});

test("normal recruitment uses canonical names colors roles energy ids and signatures", () => {
  assert.match(
    game,
    /const baseName = energyDefinition\.displayName \+ "-" \+ \(swarmRef\.current\.length \+ 1\)/,
  );
  assert.match(game, /const color = energyDefinition\.color/);
  assert.match(game, /energyId: energyDefinition\.id/);
  assert.match(game, /attackSignature: energyDefinition\.attackSignature/);
  assert.match(game, /const combatRole = predefinedCombatRole \|\| energyDefinition\.combatRole/);
});

test("wild Orbi drops preserve their exact canonical identity through collection", () => {
  assert.match(game, /orbiEnergyId = getNextEnergyIdFromBag\(\)/);
  assert.match(game, /orbiAttackSignature = energyDefinition\.attackSignature/);
  assert.match(game, /orbiEnergyId,/);
  assert.match(game, /orbiAttackSignature,/);
  assert.match(
    game,
    /addSwarmMember\([\s\S]*res\.orbiAffinity,[\s\S]*res\.orbiCombatRole,[\s\S]*res\.orbiEnergyId/,
  );
});

test("GAIA and FOTON cannot enter the normal follower recruitment cycle", () => {
  assert.match(canon, /id: "FOTON"[\s\S]*collectibleFollower: false/);
  assert.match(canon, /id: "GAIA"[\s\S]*collectibleFollower: false/);
  assert.match(
    canon,
    /filter\(\(definition\) => definition\.collectibleFollower\)/,
  );
});

test("types expose the expanded energy identities without removing legacy fusion enum values", () => {
  for (const identity of [
    "FOTON",
    "HYDRO",
    "AERO",
    "TERMO",
    "MAGNE",
    "ATON",
    "KINETRIX",
    "H2NOVA",
    "QUANTUM",
    "GAIA",
  ]) {
    assert.match(types, new RegExp(`\\| "${identity}"|"${identity}"`));
  }
  assert.match(types, /SOLAR_GUARDIAN = "SOLAR_GUARDIAN"/);
  assert.match(types, /HYDRO_LEVIATHAN = "HYDRO_LEVIATHAN"/);
});
