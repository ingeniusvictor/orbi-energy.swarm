import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contractSource = readFileSync("src/game/commandLinkBinding.ts", "utf8");
const prioritySource = readFileSync("src/game/priorityTargetContract.ts", "utf8");
const formationSource = readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");

test("J5B references J5A identity type-only and does not create another profile authority", () => {
  assert.match(
    contractSource,
    /import type \{ PriorityTargetProfileId \} from "\.\/priorityTargetContract"/,
  );
  assert.match(contractSource, /profileId:\s*"COMMAND_CORE"/);
  assert.match(contractSource, /ownsPriorityTargetProfileAuthority:\s*false/);
  assert.doesNotMatch(contractSource, /PRIORITY_TARGET_PROFILE_COUNT\s*=/);
  assert.doesNotMatch(contractSource, /getPriorityTargetProfile/);

  assert.match(prioritySource, /PRIORITY_TARGET_PROFILE_COUNT\s*=\s*1/);
  assert.match(prioritySource, /effectMode:\s*"SIGNAL_ONLY"/);
  assert.doesNotMatch(prioritySource, /commandLinkBinding/);
});

test("J5B derives its core index from the existing deterministic J3 member order", () => {
  assert.match(formationSource, /LIVE_ENEMY_FORMATION_GROUP_SIZE\s*=\s*2/);
  assert.match(formationSource, /LIVE_ENEMY_FORMATION_ADVANCED_GROUP_SIZE\s*=\s*3/);
  assert.match(formationSource, /nextMemberIndex:\s*1/);
  assert.match(formationSource, /memberIndex:\s*0/);

  assert.match(contractSource, /COMMAND_LINK_CORE_MEMBER_INDEX\s*=\s*0/);
  assert.match(contractSource, /Object\.freeze\(\[2, 3\] as const\)/);
  assert.doesNotMatch(formationSource, /commandLinkBinding/);
});

test("J5B has no live runtime adoption or entity-schema field", () => {
  assert.doesNotMatch(gameSource, /commandLinkBinding/);
  assert.doesNotMatch(gameSource, /resolveCommandLinkBinding/);
  assert.doesNotMatch(typesSource, /commandLinkBinding/);
  assert.doesNotMatch(typesSource, /commandLink/);
  assert.doesNotMatch(contractSource, /EnergySwarmGame/);
  assert.doesNotMatch(contractSource, /liveEnemyFormationDirector/);
  assert.doesNotMatch(contractSource, /EnemyType/);
});

test("J5B contract owns no clock RNG scan collection cap or live mutation authority", () => {
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
    /Array\.from/,
    /new Map/,
    /new Set/,
    /isDead\s*=/,
    /health\s*[-+]=/,
    /shootCooldown\s*=/,
  ]) {
    assert.doesNotMatch(contractSource, forbidden);
  }

  for (const guard of [
    "ownsFormationAuthority: false",
    "ownsPriorityTargetProfileAuthority: false",
    "ownsSpawnAuthority: false",
    "ownsEntityCollection: false",
    "ownsProjectileCollection: false",
    "ownsDamageAuthority: false",
    "ownsDefeatAuthority: false",
    "ownsScoreAuthority: false",
    "ownsRewardAuthority: false",
    "ownsClock: false",
    "ownsRandomness: false",
    "ownsFullArrayScan: false",
    "mayMutateGlobalCaps: false",
    "mayCreateEntities: false",
    "mayRemoveEntities: false",
  ]) {
    assert.ok(contractSource.includes(guard), `missing authority guard ${guard}`);
  }
});

test("J5B output is bounded binding metadata rather than chain-reaction behavior", () => {
  assert.match(contractSource, /"BINDING_ONLY"/);
  assert.match(contractSource, /SIZE_TWO_LINKED_MEMBER_INDICES[^;]*Object\.freeze\(\[1\]\)/s);
  assert.match(contractSource, /SIZE_THREE_LINKED_MEMBER_INDICES[^;]*Object\.freeze\(\[1, 2\]\)/s);
  assert.doesNotMatch(contractSource, /COMMAND_LINK_BROKEN/);
  assert.doesNotMatch(contractSource, /resolvePriorityTargetDefeatSignal/);
  assert.doesNotMatch(contractSource, /splashRadius/);
  assert.doesNotMatch(contractSource, /baseScore/);
  assert.doesNotMatch(contractSource, /nanoCredits/);
});
