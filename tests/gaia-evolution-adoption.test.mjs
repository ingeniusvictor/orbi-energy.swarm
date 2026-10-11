import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const game = read("src/game/EnergySwarmGame.tsx");
const canvas = read("src/game/EnergySwarmCanvas.tsx");
const profiles = read("src/game/orbiAttackProfiles.ts");

test("live run owns acquisition-driven GAIA progression refs", () => {
  assert.match(
    game,
    /const gaiaEvolutionRef = useRef\(createGaiaEvolutionState\(\)\)/,
  );
  assert.match(
    game,
    /const gaiaMemberRef = useRef<OrbiMember \| null>\(null\)/,
  );
  assert.match(
    game,
    /trackGaiaEnergyAcquisition\(energyDefinition\.id\)/,
  );
  assert.match(
    game,
    /gaiaEvolutionRef\.current = createGaiaEvolutionState\(\)/,
  );
});

test("one unique GAIA entity is created and later cycles mutate that same companion", () => {
  const gaiaPushes =
    game.match(/swarmRef\.current\.push\(gaiaMember\)/g) ?? [];
  assert.equal(gaiaPushes.length, 1);
  assert.match(game, /const existingGaia = gaiaMemberRef\.current/);
  assert.match(game, /gaiaMember = existingGaia/);
  assert.match(game, /gaiaMember\.level = update\.state\.gaiaLevel/);
  assert.match(
    game,
    /gaiaMember\.evolutionStage = gaiaScale\.evolutionStage/,
  );
});

test("GAIA remains outside normal follower capacity and consolidation", () => {
  assert.match(game, /const regularSwarmCount = swarmRef\.current\.reduce/);
  assert.match(
    game,
    /member\.energyId === "GAIA" \? 0 : 1/,
  );
  const exclusions = game.match(/m\.energyId !== "GAIA"/g) ?? [];
  assert.ok(exclusions.length >= 2);
});

test("GAIA attacker-defender scaling reuses the bounded ES-12F8 combat pipeline", () => {
  assert.match(
    game,
    /member\.energyId === "GAIA"[\s\S]{0,140}getGaiaCombatScale\(member\.level\)/,
  );
  assert.match(game, /gaiaScale\?\.damageMultiplier/);
  assert.match(game, /gaiaScale\?\.cooldownMultiplier/);
  assert.match(game, /gaiaScale\?\.shieldSupportMultiplier/);
  assert.match(game, /const gaiaDefenseMultiplier = gaiaMemberRef\.current/);
  assert.match(
    profiles,
    /GAIA_SYNTHESIS:[\s\S]*shape: "SYNTHESIS"/,
  );
});

test("GAIA has a lightweight synthesis identity inside the existing Canvas2D swarm pass", () => {
  assert.match(canvas, /const isGaia = member\.energyId === "GAIA"/);
  assert.match(canvas, /const gaiaRotation = time \* 0\.0018/);
  assert.match(canvas, /for \(let plane = 0; plane < 3; plane \+= 1\)/);
  assert.match(canvas, /ctx\.ellipse\(/);
  assert.match(canvas, /member\.energyId === "GAIA"/);
});

test("GAIA implementation does not introduce an alternate projectile or enemy cap", () => {
  assert.doesNotMatch(game, /GAIA_MAX_PROJECTILES|GAIA_MAX_ENEMIES/);
  assert.match(game, /projectilesRef\.current\.length >= MAX_PROJECTILES/);
  assert.match(game, /enemiesRef\.current\.length >= MAX_ENEMIES/);
});
