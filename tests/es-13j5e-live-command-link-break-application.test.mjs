import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const helperSource = readFileSync("src/game/liveCommandLinkBreakApplication.ts", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");
const formationSource = readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const prioritySource = readFileSync("src/game/priorityTargetContract.ts", "utf8");
const bindingSource = readFileSync("src/game/commandLinkBinding.ts", "utf8");
const presentationSource = readFileSync("src/game/liveCommandCorePresentation.ts", "utf8");
const breakSource = readFileSync("src/game/commandLinkBreakResolution.ts", "utf8");

test("J5E adapter reuses J5B binding and J5D resolution metadata only", () => {
  assert.match(helperSource, /resolveCommandLinkBinding[\s\S]*from "\.\/commandLinkBinding"/);
  assert.match(helperSource, /resolveCommandLinkBreakResolution[\s\S]*from "\.\/commandLinkBreakResolution"/);
  assert.match(helperSource, /export const resolveLiveCommandLinkBreakIntent/);
  assert.match(helperSource, /binding\.memberRole !== "LINKED_MEMBER"/);
  assert.match(helperSource, /binding\.groupId !== resolution\.groupId/);
  assert.match(helperSource, /resolution\.intent !== "DETACH_LINKED_MEMBERS"/);
  assert.match(helperSource, /resolution\.effectMode !== "INTENT_ONLY"/);

  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /setTimeout/,
    /setInterval/,
    /requestAnimationFrame/,
    /EnemyType/,
    /enemiesRef/,
    /\.filter\(/,
    /\.find\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /new Map/,
    /new Set/,
    /health\s*[-+]?=/,
    /isDead\s*=/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
  ]) {
    assert.doesNotMatch(helperSource, forbidden);
  }
});

test("J5E live adapter uses one scalar pending ref and existing defeat authority", () => {
  assert.match(
    gameSource,
    /pendingCommandLinkBreakRef\s*=\s*useRef<LiveCommandLinkBreakIntent \| null>\(null\)/,
  );
  assert.doesNotMatch(gameSource, /pendingCommandLinkBreak(?:s|Queue|Map|Set)/);
  assert.doesNotMatch(gameSource, /commandLinkBreakResolution/);
  assert.match(
    gameSource,
    /const registerCombatDefeat = \(enemy: Enemy, affinity\?: OrbiAffinity\) => \{[\s\S]{0,700}resolveLiveCommandLinkBreakIntent\(enemy\.enemyFormation\)/,
  );
  assert.match(
    gameSource,
    /pendingCommandLinkBreakRef\.current\s*=\s*commandLinkBreakIntent/,
  );
});

test("J5E consumes detach only inside the one existing enemy logic iteration", () => {
  const loopMatches = gameSource.match(/enemiesRef\.current\.forEach\(\(enemy\) => \{/g) ?? [];
  assert.equal(loopMatches.length, 1);

  const loopStart = gameSource.indexOf("enemiesRef.current.forEach((enemy) => {");
  const loopEnd = gameSource.indexOf("// 7. Projectiles coordinates", loopStart);
  assert.ok(loopStart >= 0 && loopEnd > loopStart);

  const beforeLoop = gameSource.slice(0, loopStart);
  const loopBody = gameSource.slice(loopStart, loopEnd);
  assert.match(beforeLoop, /const pendingCommandLinkBreak = pendingCommandLinkBreakRef\.current;/);
  assert.match(beforeLoop, /let detachedPendingCommandLink = false;/);
  assert.match(
    loopBody,
    /shouldDetachCommandLinkMember\([\s\S]{0,180}enemy\.enemyFormation[\s\S]{0,180}enemy\.enemyFormation = undefined;\s*detachedPendingCommandLink = true;/,
  );
  assert.match(
    loopBody,
    /detachedPendingCommandLink &&\s*pendingCommandLinkBreak &&\s*pendingCommandLinkBreakRef\.current === pendingCommandLinkBreak/,
  );
  assert.match(loopBody, /pendingCommandLinkBreakRef\.current = null;/);

  const detachAssignments = gameSource.match(/enemy\.enemyFormation = undefined;/g) ?? [];
  assert.ok(detachAssignments.length >= 3);
});

test("J5E pending intent resets at every J3 director reset boundary", () => {
  const directorResetCount = (
    gameSource.match(/enemyFormationDirectorRef\.current =\s*\n\s*createLiveEnemyFormationDirectorState\(\);/g) ?? []
  ).length;
  const pairedResetCount = (
    gameSource.match(/enemyFormationDirectorRef\.current =\s*\n\s*createLiveEnemyFormationDirectorState\(\);\s*\n\s*pendingCommandLinkBreakRef\.current = null;/g) ?? []
  ).length;

  assert.equal(directorResetCount, 3);
  assert.equal(pairedResetCount, directorResetCount);
});

test("J5E does not capture schema/director/frozen-contract authority", () => {
  assert.doesNotMatch(typesSource, /CommandLinkBreak/);
  assert.doesNotMatch(formationSource, /liveCommandLinkBreakApplication/);
  assert.doesNotMatch(prioritySource, /liveCommandLinkBreakApplication/);
  assert.doesNotMatch(bindingSource, /liveCommandLinkBreakApplication/);
  assert.doesNotMatch(presentationSource, /liveCommandLinkBreakApplication/);
  assert.doesNotMatch(breakSource, /liveCommandLinkBreakApplication/);

  assert.match(prioritySource, /effectMode:\s*"SIGNAL_ONLY"/);
  assert.match(bindingSource, /bindingMode:\s*"BINDING_ONLY"/);
  assert.match(breakSource, /effectMode:\s*"INTENT_ONLY"/);
});
