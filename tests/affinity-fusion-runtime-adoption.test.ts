import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const game = read("src/game/EnergySwarmGame.tsx");
const director = read("src/game/affinityFusionDirector.ts");
const doctrine = read("src/game/swarmDoctrine.ts");

test("H12 runtime adopts the pure Affinity Fusion Director", () => {
  assert.match(
    game,
    /applyAffinityFusion[\s\S]*consumeAffinityFusionEnergy[\s\S]*resolveAffinityFusion[\s\S]*from "\.\/affinityFusionDirector"/,
  );
  assert.match(game, /const tryTriggerAffinityFusion = \(\) =>/);
  assert.match(
    game,
    /resolveAffinityFusion\(\s*swarmRef\.current,\s*fusionEnergyRef\.current,?\s*\)/,
  );
  assert.match(
    game,
    /applyAffinityFusion\([\s\S]*swarmRef\.current[\s\S]*resolution[\s\S]*playerPosRef\.current/,
  );
});

test("H12 removes the legacy body-count/default fusion authority", () => {
  assert.doesNotMatch(game, /const triggerFusion =/);
  assert.doesNotMatch(game, /triggerFusion\("SOLAR"\)/);
  assert.doesNotMatch(game, /triggerFusion\("HYDRO"\)/);
  assert.doesNotMatch(game, /const solarCount =/);
  assert.doesNotMatch(game, /const hydroCount =/);
  assert.doesNotMatch(game, /m\.color === "#f59e0b"|m\.color === "#0ea5e9"/);
});

test("fusion energy remains bounded activation state and is consumed only after successful application", () => {
  assert.match(game, /const fusionEnergyRef = useRef\(0\)/);
  assert.match(
    game,
    /fusionEnergyRef\.current = Math\.min\(100, fusionEnergyRef\.current \+ boost\)/,
  );

  const helperStart = game.indexOf("const tryTriggerAffinityFusion =");
  const helperEnd = game.indexOf("// --- WAVE TRANSITIONS DIRECTOR ---", helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart);
  const helper = game.slice(helperStart, helperEnd);

  const applyIndex = helper.indexOf("applyAffinityFusion(");
  const consumeIndex = helper.indexOf("consumeAffinityFusionEnergy(");
  assert.ok(applyIndex >= 0);
  assert.ok(consumeIndex > applyIndex);
  assert.match(helper, /if \(!applied\) return false/);
  assert.doesNotMatch(helper, /fusionEnergyRef\.current = 0/);
});

test("a ready meter is re-evaluated after both energy pickup and compatible recruitment", () => {
  const collectStart = game.indexOf("const triggerResourceCollect =");
  const collectEnd = game.indexOf("// --- SHOOT TRIGGER FROM SWARM FOLLOWER ---", collectStart);
  const collect = game.slice(collectStart, collectEnd);
  assert.match(
    collect,
    /res\.type === "ENERGY"[\s\S]*fusionEnergyRef\.current = Math\.min\(100[\s\S]*tryTriggerAffinityFusion\(\)/,
  );

  const recruitStart = game.indexOf("const addSwarmMember =");
  const recruitEnd = game.indexOf("// --- SYSTEM SHOP UPGRADES ---", recruitStart);
  const recruit = game.slice(recruitStart, recruitEnd);
  assert.match(recruit, /swarmRef\.current\.push\(member\)/);
  assert.match(recruit, /tryTriggerAffinityFusion\(\)/);
});

test("fusion creation cannot mint a new founder or level-5 doctrine credit", () => {
  const helperStart = game.indexOf("const tryTriggerAffinityFusion =");
  const helperEnd = game.indexOf("// --- WAVE TRANSITIONS DIRECTOR ---", helperStart);
  const helper = game.slice(helperStart, helperEnd);

  assert.doesNotMatch(helper, /registerSwarmDoctrineMember/);
  assert.doesNotMatch(helper, /registerSwarmDoctrineLevel/);
  assert.match(
    helper,
    /applied\.members\.length >[\s\S]*getSwarmDoctrineCapacity\(swarmDoctrineRef\.current\)/,
  );
  assert.match(doctrine, /Promotion credits are monotonic for the current run/);
  assert.match(doctrine, /SWARM_ABSOLUTE_CAP = 30/);
});

test("H12 source authority is canonical metadata, never visual color", () => {
  assert.match(director, /member\.combatRole === recipe\.sourceCombatRole/);
  assert.match(director, /COLLECTIBLE_FUSION_SOURCE_IDS/);
  assert.doesNotMatch(director, /member\.color|#f59e0b|#0ea5e9/);
});

test("GAIA synthesis remains an independent acquisition-driven path", () => {
  assert.match(game, /const trackGaiaEnergyAcquisition =/);
  assert.match(game, /registerGaiaEnergy\(/);
  assert.match(game, /GAIA SYNTHESIS COMPLETE/);
  assert.match(director, /member\.energyId !== "GAIA"/);
});

test("H12 adds no second entity array or projectile budget bypass", () => {
  assert.doesNotMatch(director, /useRef|setInterval|requestAnimationFrame|projectilesRef|enemiesRef/);
  assert.doesNotMatch(director, /MAX_PROJECTILES|MAX_ENEMIES/);
  assert.match(game, /const swarmRef = useRef<OrbiMember\[]>\(\[\]\)/);
});
