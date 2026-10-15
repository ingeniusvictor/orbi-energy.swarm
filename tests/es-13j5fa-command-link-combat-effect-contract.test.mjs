import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const effectSource = readFileSync(
  "src/game/commandLinkCombatEffectContract.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");
const formationSource = readFileSync(
  "src/game/liveEnemyFormationDirector.ts",
  "utf8",
);
const prioritySource = readFileSync(
  "src/game/priorityTargetContract.ts",
  "utf8",
);
const bindingSource = readFileSync("src/game/commandLinkBinding.ts", "utf8");
const presentationSource = readFileSync(
  "src/game/liveCommandCorePresentation.ts",
  "utf8",
);
const breakSource = readFileSync(
  "src/game/commandLinkBreakResolution.ts",
  "utf8",
);
const liveBreakSource = readFileSync(
  "src/game/liveCommandLinkBreakApplication.ts",
  "utf8",
);
const resonanceSource = readFileSync("src/game/combatResonance.ts", "utf8");

test("J5F-A consumes frozen J5D semantic output as a type-only prerequisite", () => {
  assert.match(
    effectSource,
    /import type[\s\S]*CommandLinkBreakResolution[\s\S]*from "\.\/commandLinkBreakResolution"/,
  );
  assert.doesNotMatch(effectSource, /resolveCommandLinkBreakResolution\s*\(/);
  assert.match(effectSource, /resolution\.profileId !== "COMMAND_CORE"/);
  assert.match(effectSource, /resolution\.signal !== "COMMAND_LINK_BROKEN"/);
  assert.match(effectSource, /resolution\.intent !== "DETACH_LINKED_MEMBERS"/);
  assert.match(effectSource, /resolution\.effectMode !== "INTENT_ONLY"/);
  assert.match(effectSource, /sourceFreshness !== "CURRENT"/);
});

test("J5F-A vocabulary is proposal-only and carries explicit zero-effect facts", () => {
  assert.match(effectSource, /"COMMAND_LINK_DISRUPTION_PULSE"/);
  assert.match(effectSource, /"PULSE_LINKED_MEMBERS"/);
  assert.match(effectSource, /"PROPOSAL_ONLY"/);
  assert.match(effectSource, /targetRole:\s*"LINKED_MEMBER"/);
  assert.match(effectSource, /requiresCurrentFormationMatch:\s*true/);
  assert.match(effectSource, /requiresLivingTarget:\s*true/);

  for (const zeroEffect of [
    "appliesDamage",
    "killsTargets",
    "awardsScore",
    "awardsRewards",
    "spawnsProjectiles",
    "mutatesFormation",
  ]) {
    assert.match(effectSource, new RegExp(`${zeroEffect}: false`));
  }
});

test("J5F-A supports only exact bounded J5 linked-member index shapes", () => {
  assert.match(
    effectSource,
    /SIZE_TWO_TARGET_MEMBER_INDICES[^\n]*Object\.freeze\(\[1\]\)/,
  );
  assert.match(
    effectSource,
    /SIZE_THREE_TARGET_MEMBER_INDICES[^\n]*Object\.freeze\(\[1, 2\]\)/,
  );
  assert.match(effectSource, /linkedMemberIndices\.length === 1/);
  assert.match(effectSource, /linkedMemberIndices\.length === 2/);
  assert.match(effectSource, /resolution\.coreMemberIndex !== 0/);
});

test("J5F-A owns no live lookup scan mutation combat economy timing or cap authority", () => {
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
    /registerCombatDefeat/,
    /registerCombatResonanceDefeat/,
    /nanoCredits/,
  ]) {
    assert.doesNotMatch(effectSource, forbidden);
  }

  for (const requiredFalse of [
    "ownsPriorityTargetProfileAuthority",
    "ownsCommandLinkBreakAuthority",
    "ownsFreshnessAuthority",
    "ownsFormationAuthority",
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
    assert.match(effectSource, new RegExp(`${requiredFalse}: false`));
  }
});

test("J5F-A has no live runtime entity-schema or frozen-prerequisite adoption", () => {
  for (const frozenOrLiveSource of [
    gameSource,
    typesSource,
    formationSource,
    prioritySource,
    bindingSource,
    presentationSource,
    breakSource,
    liveBreakSource,
  ]) {
    assert.doesNotMatch(frozenOrLiveSource, /commandLinkCombatEffectContract/);
  }
});

test("J5F-A does not collide with existing combat-resonance chain semantics", () => {
  assert.match(resonanceSource, /COMBAT_CHAIN_WINDOW_MS/);
  assert.match(resonanceSource, /chainMultiplier/);
  assert.doesNotMatch(effectSource, /COMBAT_CHAIN/);
  assert.doesNotMatch(effectSource, /chainMultiplier/);
  assert.doesNotMatch(effectSource, /awardedScore/);
});

test("frozen J5 prerequisite semantics remain exact", () => {
  assert.match(prioritySource, /defeatSignal:\s*"COMMAND_LINK_BROKEN"/);
  assert.match(prioritySource, /effectMode:\s*"SIGNAL_ONLY"/);
  assert.match(bindingSource, /COMMAND_LINK_CORE_MEMBER_INDEX\s*=\s*0/);
  assert.match(
    bindingSource,
    /COMMAND_LINK_SUPPORTED_MEMBER_COUNTS\s*=\s*Object\.freeze\(\[2, 3\]/,
  );
  assert.match(breakSource, /intent:\s*"DETACH_LINKED_MEMBERS"/);
  assert.match(breakSource, /effectMode:\s*"INTENT_ONLY"/);
  assert.match(liveBreakSource, /binding\.memberRole !== "LINKED_MEMBER"/);
});
