import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const canvas = readFileSync(
  new URL("../src/game/EnergySwarmCanvas.tsx", import.meta.url),
  "utf8",
);
const evolution = readFileSync(
  new URL("../src/game/gaiaEvolution.ts", import.meta.url),
  "utf8",
);

const countOccurrences = (source, token) =>
  source.split(token).length - 1;

test("GAIA progression and physical member reset together on a fresh run", () => {
  assert.match(
    game,
    /gaiaEvolutionRef\.current\s*=\s*createGaiaEvolutionState\(\);[\s\S]{0,120}?gaiaMemberRef\.current\s*=\s*null;/,
  );
});

test("GAIA acquisition is tracked before normal swarm capacity consolidation", () => {
  const addMemberStart = game.indexOf("const addSwarmMember =");
  assert.ok(addMemberStart >= 0);
  const section = game.slice(addMemberStart, addMemberStart + 6200);
  const trackIndex = section.indexOf("trackGaiaEnergyAcquisition(energyDefinition.id)");
  const capacityIndex = section.indexOf("regularSwarmCount");
  assert.ok(trackIndex >= 0, "GAIA acquisition hook missing");
  assert.ok(capacityIndex > trackIndex, "capacity handling must happen after GAIA acquisition tracking");
});

test("GAIA has one explicit physical creation path and subsequent cycles evolve it", () => {
  assert.equal(
    countOccurrences(game, 'id: "gaia_synthesis_" + Math.random().toString()'),
    1,
  );
  assert.equal(countOccurrences(game, "gaiaMemberRef.current = gaiaMember"), 1);
  assert.match(
    game,
    /const existingGaia\s*=\s*gaiaMemberRef\.current;[\s\S]{0,220}?if\s*\([\s\S]*?!existingGaia[\s\S]*?!swarmRef\.current\.includes\(existingGaia\)/,
  );
  assert.match(
    game,
    /else\s*\{[\s\S]{0,180}?gaiaMember\s*=\s*existingGaia;[\s\S]{0,260}?gaiaMember\.level\s*=\s*update\.state\.gaiaLevel/,
  );
});

test("GAIA consumes H4 follower capacity while remaining outside consolidation candidates", () => {
  assert.match(
    game,
    /regularSwarmCount\s*=\s*swarmRef\.current\.length/,
  );
  assert.match(
    game,
    /getSwarmDoctrineCapacity\(swarmDoctrineRef\.current\)/,
  );
  assert.doesNotMatch(
    game,
    /regularSwarmCount\s*=\s*swarmRef\.current\.reduce\([\s\S]{0,220}?member\.energyId\s*===\s*"GAIA"\s*\?\s*0\s*:\s*1/,
  );
  // EVO8 replaces cross-affinity XP fallback with same-energy-only ranking.
  assert.match(game, /member\.energyId === energyDefinition\.id/);
  assert.doesNotMatch(game, /Fallback if no member has this affinity/);
});

test("GAIA offense and support use bounded combat scale inside the existing swarm firing path", () => {
  const shootStart = game.indexOf("const shootFromSwarm =");
  assert.ok(shootStart >= 0);
  const shoot = game.slice(shootStart, shootStart + 7200);
  assert.match(shoot, /projectilesRef\.current\.length\s*>=\s*MAX_PROJECTILES/);
  assert.match(
    shoot,
    /member\.energyId\s*===\s*"GAIA"[\s\S]{0,100}?getGaiaCombatScale\(member\.level\)/,
  );
  assert.match(shoot, /gaiaScale\?\.damageMultiplier\s*\?\?\s*1/);
  assert.match(shoot, /gaiaScale\?\.shieldSupportMultiplier\s*\?\?\s*1/);
});

test("GAIA defense scales the existing player damage path rather than adding another collision sweep", () => {
  const damageStart = game.indexOf("const damagePlayer =");
  assert.ok(damageStart >= 0);
  const damage = game.slice(damageStart, damageStart + 1400);
  assert.match(
    damage,
    /gaiaMemberRef\.current[\s\S]{0,180}?getGaiaCombatScale\([\s\S]{0,120}?incomingDamageMultiplier/,
  );
  assert.match(damage, /dmg\s*\*\s*multiplier\s*\*\s*gaiaDefenseMultiplier/);
  assert.doesNotMatch(damage, /enemiesRef\.current\.(?:forEach|filter|map)\(/);
});

test("GAIA combat scaling stays constant-time and explicitly bounded", () => {
  assert.match(evolution, /damageMultiplier:\s*Math\.min\(2\.2,/);
  assert.match(evolution, /cooldownMultiplier:\s*Math\.max\(0\.62,/);
  assert.match(evolution, /shieldSupportMultiplier:\s*Math\.min\(2\.5,/);
  assert.match(evolution, /incomingDamageMultiplier:\s*Math\.max\(0\.75,/);
  assert.doesNotMatch(evolution, /enemiesRef|projectilesRef|swarmRef/);
});

test("GAIA renderer keeps three Canvas2D orbital planes with a simplified far LOD", () => {
  assert.match(canvas, /const isGaia\s*=\s*member\.energyId\s*===\s*"GAIA"/);
  assert.match(
    canvas,
    /if\s*\(isFar\)[\s\S]{0,650}?if\s*\(isGaia\)[\s\S]{0,450}?ctx\.arc\(/,
  );
  assert.match(canvas, /for\s*\(let plane\s*=\s*0;\s*plane\s*<\s*3;\s*plane\s*\+=\s*1\)/);
  assert.match(canvas, /ctx\.ellipse\(/);
});
