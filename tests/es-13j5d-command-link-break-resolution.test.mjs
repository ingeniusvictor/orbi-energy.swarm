import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const breakSource = readFileSync("src/game/commandLinkBreakResolution.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");
const formationSource = readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const prioritySource = readFileSync("src/game/priorityTargetContract.ts", "utf8");
const bindingSource = readFileSync("src/game/commandLinkBinding.ts", "utf8");
const presentationSource = readFileSync("src/game/liveCommandCorePresentation.ts", "utf8");

test("J5D composes frozen J5A and J5B semantics rather than duplicating them", () => {
  assert.match(
    breakSource,
    /resolveCommandLinkBinding[\s\S]*from "\.\/commandLinkBinding"/,
  );
  assert.match(
    breakSource,
    /resolvePriorityTargetDefeatSignal[\s\S]*from "\.\/priorityTargetContract"/,
  );
  assert.match(breakSource, /binding\.memberRole !== "COMMAND_CORE"/);
  assert.match(breakSource, /defeatResolution\.signal !== "COMMAND_LINK_BROKEN"/);
  assert.match(breakSource, /defeatResolution\.effectMode !== "SIGNAL_ONLY"/);
  assert.match(breakSource, /intent:\s*"DETACH_LINKED_MEMBERS"/);
  assert.match(breakSource, /effectMode:\s*"INTENT_ONLY"/);
});

test("J5D owns no lookup scan mutation combat economy or timing authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /enemiesRef/,
    /EnemyType/,
    /enemyId/i,
    /linkedEnemy/i,
    /\.filter\(/,
    /\.find\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /health\s*[-+]?=/,
    /isDead\s*=/,
    /baseScore/,
    /nanoCredits/,
  ]) {
    assert.doesNotMatch(breakSource, forbidden);
  }

  for (const requiredFalse of [
    "ownsFormationAuthority",
    "ownsBindingAuthority",
    "ownsSpawnAuthority",
    "ownsEntityCollection",
    "ownsProjectileCollection",
    "ownsDamageAuthority",
    "ownsDefeatAuthority",
    "ownsScoreAuthority",
    "ownsRewardAuthority",
    "ownsClock",
    "ownsRandomness",
    "ownsFullArrayScan",
    "mayLookupEntities",
    "mayMutateEntities",
    "mayMutateGlobalCaps",
    "mayCreateEntities",
    "mayRemoveEntities",
  ]) {
    assert.match(breakSource, new RegExp(`${requiredFalse}: false`));
  }
});

test("J5D has no live runtime or entity-schema adoption", () => {
  assert.doesNotMatch(gameSource, /commandLinkBreakResolution/);
  assert.doesNotMatch(typesSource, /CommandLinkBreak/);
  assert.doesNotMatch(formationSource, /commandLinkBreakResolution/);
  assert.doesNotMatch(prioritySource, /commandLinkBreakResolution/);
  assert.doesNotMatch(bindingSource, /commandLinkBreakResolution/);
  assert.doesNotMatch(presentationSource, /commandLinkBreakResolution/);
});

test("frozen prerequisite semantics remain exact", () => {
  assert.match(prioritySource, /defeatSignal:\s*"COMMAND_LINK_BROKEN"/);
  assert.match(prioritySource, /effectMode:\s*"SIGNAL_ONLY"/);
  assert.match(bindingSource, /COMMAND_LINK_CORE_MEMBER_INDEX\s*=\s*0/);
  assert.match(bindingSource, /COMMAND_LINK_SUPPORTED_MEMBER_COUNTS\s*=\s*Object\.freeze\(\[2, 3\]/);
  assert.match(bindingSource, /bindingMode:\s*"BINDING_ONLY"/);
  assert.match(bindingSource, /SIZE_TWO_LINKED_MEMBER_INDICES[\s\S]*Object\.freeze\(\[1\]\)/);
  assert.match(bindingSource, /SIZE_THREE_LINKED_MEMBER_INDICES[\s\S]*Object\.freeze\(\[1, 2\]\)/);
  assert.match(presentationSource, /markerKind:\s*"COMMAND_CORE_PRIORITY"/);
});
