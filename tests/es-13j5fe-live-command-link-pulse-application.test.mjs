import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const adapterSource = readFileSync("src/game/liveCommandLinkPulseApplication.ts", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");
const j5faSource = readFileSync("src/game/commandLinkCombatEffectContract.ts", "utf8");
const j5fbSource = readFileSync("src/game/commandLinkPulseTargetEligibility.ts", "utf8");
const j5fcSource = readFileSync("src/game/commandLinkPulseDamageSafety.ts", "utf8");
const j5fdSource = readFileSync("src/game/commandLinkPulseTriggerDamageSource.ts", "utf8");

const countMatches = (source, expression) => source.match(expression)?.length ?? 0;

test("J5F-E live adapter composes frozen J5 contracts and stays fail-closed", () => {
  assert.match(adapterSource, /resolveCommandLinkBreakResolution/);
  assert.match(adapterSource, /projectCommandLinkCombatEffect/);
  assert.match(adapterSource, /resolveCommandLinkPulseTargetEligibility/);
  assert.match(adapterSource, /projectCommandLinkPulseDamageSafety/);
  assert.match(adapterSource, /projectCommandLinkPulseTriggerDamageSource/);
  assert.match(adapterSource, /mode:\s*"LIVE_NON_LETHAL_PENDING"/);
  assert.match(adapterSource, /mode:\s*"LIVE_NON_LETHAL_HEALTH_APPLICATION"/);
  assert.match(adapterSource, /canKill:\s*false/);
  assert.match(adapterSource, /setIsDead:\s*false/);
  assert.match(adapterSource, /registersDefeat:\s*false/);
  assert.match(adapterSource, /awardsScore:\s*false/);
  assert.match(adapterSource, /awardsRewards:\s*false/);
  assert.match(adapterSource, /awardsDrops:\s*false/);

  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /setTimeout/,
    /setInterval/,
    /requestAnimationFrame/,
    /enemiesRef/,
    /\.filter\(/,
    /\.find\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /new Map/,
    /new Set/,
    /isDead\s*=/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
  ]) {
    assert.doesNotMatch(adapterSource, forbidden);
  }
});

test("J5F-E keeps frozen two-argument defeat signature and direct/splash calls exact", () => {
  assert.match(
    gameSource,
    /const registerCombatDefeat = \(enemy: Enemy, affinity\?: OrbiAffinity\) => \{/,
  );
  assert.match(gameSource, /registerCombatDefeat\(enemy, proj\.affinity\);/);
  assert.match(gameSource, /registerCombatDefeat\(otherEnemy, proj\.affinity\);/);
  assert.equal(
    countMatches(gameSource, /registerCombatDefeat\(enemy, proj\.affinity\);/g),
    1,
  );
  assert.equal(
    countMatches(gameSource, /registerCombatDefeat\(otherEnemy, proj\.affinity\);/g),
    1,
  );
});

test("J5F-E owns one scalar pending pulse and imports only the live adapter into runtime", () => {
  assert.match(
    gameSource,
    /pendingCommandLinkPulseRef\s*=\s*useRef<LiveCommandLinkPulseIntent \| null>\(null\)/,
  );
  assert.doesNotMatch(gameSource, /pendingCommandLinkPulse(?:s|Queue|Map|Set)/);
  assert.match(gameSource, /from "\.\/liveCommandLinkPulseApplication"/);
  assert.doesNotMatch(gameSource, /from "\.\/commandLinkCombatEffectContract"/);
  assert.doesNotMatch(gameSource, /from "\.\/commandLinkPulseTargetEligibility"/);
  assert.doesNotMatch(gameSource, /from "\.\/commandLinkPulseDamageSafety"/);
  assert.doesNotMatch(gameSource, /from "\.\/commandLinkPulseTriggerDamageSource"/);
});

test("J5F-E captures exact direct and splash source health immediately before existing damage", () => {
  assert.match(
    gameSource,
    /const commandLinkPulseSourceHealthBeforeDirectHit = enemy\.health;\s*\n\s*enemy\.health -= damageToApply;/,
  );
  assert.match(
    gameSource,
    /const commandLinkPulseSourceHealthBeforeSplashHit = otherEnemy\.health;\s*\n\s*otherEnemy\.health -= splashDamage;/,
  );

  const directDefeatCall = gameSource.indexOf("registerCombatDefeat(enemy, proj.affinity);");
  const directPulse = gameSource.indexOf('"DIRECT_HIT"', directDefeatCall);
  assert.ok(directDefeatCall >= 0 && directPulse > directDefeatCall);
  assert.ok(directPulse - directDefeatCall < 700);

  const splashDefeatCall = gameSource.indexOf("registerCombatDefeat(otherEnemy, proj.affinity);");
  const splashPulse = gameSource.indexOf('"SPLASH_HIT"', splashDefeatCall);
  assert.ok(splashDefeatCall >= 0 && splashPulse > splashDefeatCall);
  assert.ok(splashPulse - splashDefeatCall < 700);
});

test("J5F-E applies non-lethal health before J5E detach inside the one existing enemy pass", () => {
  const loopMatches = gameSource.match(/enemiesRef\.current\.forEach\(\(enemy\) => \{/g) ?? [];
  assert.equal(loopMatches.length, 1);

  const loopStart = gameSource.indexOf("enemiesRef.current.forEach((enemy) => {");
  const loopEnd = gameSource.indexOf("// 7. Projectiles coordinates", loopStart);
  assert.ok(loopStart >= 0 && loopEnd > loopStart);

  const beforeLoop = gameSource.slice(0, loopStart);
  const loopBody = gameSource.slice(loopStart, loopEnd);
  assert.match(beforeLoop, /const pendingCommandLinkPulse = pendingCommandLinkPulseRef\.current;/);

  const pulseProjectionAt = loopBody.indexOf("projectLiveCommandLinkPulseTarget(");
  const pulseHealthAt = loopBody.indexOf(
    "enemy.health = commandLinkPulseProjection.resultingHealth;",
    pulseProjectionAt,
  );
  const detachAt = loopBody.indexOf("shouldDetachCommandLinkMember(");
  assert.ok(pulseProjectionAt >= 0);
  assert.ok(pulseHealthAt > pulseProjectionAt);
  assert.ok(detachAt > pulseHealthAt);

  const pulseMutationWindow = loopBody.slice(pulseProjectionAt, detachAt);
  assert.doesNotMatch(pulseMutationWindow, /enemy\.isDead\s*=/);
  assert.doesNotMatch(pulseMutationWindow, /registerCombatDefeat/);
  assert.doesNotMatch(pulseMutationWindow, /scoreRef/);
  assert.doesNotMatch(pulseMutationWindow, /spawnResource/);

  assert.match(
    loopBody,
    /pendingCommandLinkPulse &&\s*pendingCommandLinkPulseRef\.current === pendingCommandLinkPulse[\s\S]{0,120}pendingCommandLinkPulseRef\.current = null;/,
  );
});

test("J5F-E pending pulse resets at all three J3/J5E lifecycle reset boundaries", () => {
  const directorResetCount = countMatches(
    gameSource,
    /enemyFormationDirectorRef\.current =\s*\n\s*createLiveEnemyFormationDirectorState\(\);/g,
  );
  const pulseResetCount = countMatches(
    gameSource,
    /enemyFormationDirectorRef\.current =\s*\n\s*createLiveEnemyFormationDirectorState\(\);\s*\n\s*pendingCommandLinkBreakRef\.current = null;\s*\n\s*pendingCommandLinkPulseRef\.current = null;/g,
  );

  assert.equal(directorResetCount, 3);
  assert.equal(pulseResetCount, directorResetCount);
});

test("J5F-E does not capture entity schema or mutate frozen J5F contracts", () => {
  assert.doesNotMatch(typesSource, /CommandLinkPulse/);
  assert.doesNotMatch(j5faSource, /liveCommandLinkPulseApplication/);
  assert.doesNotMatch(j5fbSource, /liveCommandLinkPulseApplication/);
  assert.doesNotMatch(j5fcSource, /liveCommandLinkPulseApplication/);
  assert.doesNotMatch(j5fdSource, /liveCommandLinkPulseApplication/);

  assert.match(j5faSource, /effectMode:\s*"PROPOSAL_ONLY"/);
  assert.match(j5fbSource, /effectMode:\s*"ELIGIBLE_ONLY"/);
  assert.match(j5fcSource, /effectMode:\s*"NON_LETHAL_PROJECTION_ONLY"/);
  assert.match(j5fdSource, /effectiveTriggerDamage/);
});
