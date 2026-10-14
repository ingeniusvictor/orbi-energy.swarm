import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contractSource = readFileSync("src/game/priorityTargetContract.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");
const formationSource = readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const resonanceSource = readFileSync("src/game/combatResonance.ts", "utf8");

test("J5A defines one semantic Command Core without adding an EnemyType", () => {
  assert.match(contractSource, /PRIORITY_TARGET_PROFILE_COUNT\s*=\s*1/);
  assert.match(contractSource, /"COMMAND_CORE"/);
  assert.match(contractSource, /"BREAK_COMMAND_LINK"/);
  assert.match(contractSource, /"COMMAND_LINK_BROKEN"/);
  assert.match(contractSource, /"SIGNAL_ONLY"/);
  assert.doesNotMatch(contractSource, /EnemyType/);
  assert.doesNotMatch(typesSource, /COMMAND_CORE/);
});

test("J5A owns no live clock, RNG, collection, scan, cap or runtime authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /new Date/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /enemiesRef/,
    /projectilesRef/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /\.filter\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /new Map/,
    /new Set/,
  ]) {
    assert.doesNotMatch(contractSource, forbidden);
  }

  for (const guard of [
    "ownsSpawnAuthority: false",
    "ownsEntityCollection: false",
    "ownsProjectileCollection: false",
    "ownsDamageAuthority: false",
    "ownsDefeatAuthority: false",
    "ownsScoreAuthority: false",
    "ownsRewardAuthority: false",
    "ownsFormationAuthority: false",
    "ownsClock: false",
    "ownsRandomness: false",
    "ownsFullArrayScan: false",
    "mayMutateGlobalCaps: false",
    "mayCreateEntities: false",
  ]) {
    assert.ok(contractSource.includes(guard), `missing authority guard ${guard}`);
  }
});

test("J5A is not an HP, damage, score or reward tuning layer", () => {
  for (const forbidden of [
    /healthMultiplier/,
    /maxHealthMultiplier/,
    /damageMultiplier/,
    /scoreMultiplier/,
    /rewardMultiplier/,
    /baseScore/,
    /nanoCredits/,
    /enemy\.health/,
    /isDead\s*=/,
  ]) {
    assert.doesNotMatch(contractSource, forbidden);
  }

  assert.match(contractSource, /appliesDamage:\s*false/);
  assert.match(contractSource, /killsLinkedTargets:\s*false/);
  assert.match(contractSource, /awardsScore:\s*false/);
  assert.match(contractSource, /awardsRewards:\s*false/);
  assert.match(contractSource, /mutatesFormation:\s*false/);
});

test("J5A has no live adoption in the game loop or entity schema", () => {
  assert.doesNotMatch(gameSource, /priorityTargetContract/);
  assert.doesNotMatch(gameSource, /COMMAND_LINK_BROKEN/);
  assert.doesNotMatch(typesSource, /priorityTarget/);
  assert.doesNotMatch(typesSource, /PriorityTarget/);
});

test("J5A does not capture J3 formation or combat-resonance defeat authority", () => {
  assert.doesNotMatch(formationSource, /priorityTargetContract/);
  assert.doesNotMatch(formationSource, /COMMAND_CORE/);
  assert.doesNotMatch(resonanceSource, /priorityTargetContract/);
  assert.doesNotMatch(resonanceSource, /COMMAND_CORE/);
  assert.doesNotMatch(contractSource, /liveEnemyFormationDirector/);
  assert.doesNotMatch(contractSource, /combatResonance/);
});

test("Command Core tactical semantics explicitly require a priority decision", () => {
  assert.match(contractSource, /FOCUS_CORE_TO_BREAK_LINK/);
  assert.match(contractSource, /priorityIntent:\s*"HIGH"/);
  assert.match(contractSource, /focus the command core now/i);
  assert.match(contractSource, /contain its linked formation first/i);
});
