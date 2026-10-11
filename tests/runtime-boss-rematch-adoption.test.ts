import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const types = readFileSync(
  new URL("../src/game/types.ts", import.meta.url),
  "utf8",
);

const section = (
  source: string,
  startMarker: string,
  endMarker: string,
) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start marker: ${startMarker}`);
  assert.ok(end > start, `Missing end marker: ${endMarker}`);
  return source.slice(start, end);
};

test("live runtime imports and owns the Devourer rematch gate", () => {
  assert.match(game, /createRuntimeBossRematchGateState/);
  assert.match(game, /requestRuntimeBossRematch/);
  assert.match(game, /markRuntimeBossRematchSpawned/);
  assert.match(game, /markRuntimeBossRematchDefeated/);
  assert.match(game, /isRuntimeBossRematchResolved/);
  assert.match(game, /bossRematchGateRef/);
});

test("new runs and campaign handoff reset rematch gate state", () => {
  const start = section(
    game,
    "const startGame =",
    "// --- REBOOT GAME ON LOSS ---",
  );
  assert.match(
    start,
    /bossRematchGateRef\.current =[\s\S]*createRuntimeBossRematchGateState\(\)/,
  );

  const handoff = section(
    game,
    "const enterInfiniteAfterCampaignVictory",
    "// --- PROCEDURAL REWARDS",
  );
  assert.match(
    handoff,
    /bossRematchGateRef\.current =[\s\S]*createRuntimeBossRematchGateState\(\)/,
  );
});

test("wave completion is blocked until a BOSS_REMATCH gate is resolved", () => {
  const transitions = section(
    game,
    "const handleWaveTransitions",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /runtimeProjection\.milestoneEncounter/,
  );
  assert.match(
    transitions,
    /milestoneEncounter\?\.kind === "BOSS_REMATCH"/,
  );
  assert.match(
    transitions,
    /requestRuntimeBossRematch\([\s\S]*spawnedEnemyCount:[\s\S]*effectiveEnemyBudget[\s\S]*livingRegularEnemyCount/,
  );
  assert.match(
    transitions,
    /baseWaveComplete &&[\s\S]*isRuntimeBossRematchResolved/,
  );
});

test("eligible Infinite boss gets an identity-driven warning then spawns through the existing boss engine", () => {
  const transitions = section(
    game,
    "const handleWaveTransitions",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /getInfiniteBossFamilyProfile/,
  );
  assert.match(
    transitions,
    /BOSS MILESTONE INBOUND/,
  );
  assert.match(
    transitions,
    /spawnBoss\(bossRematchProfile\)/,
  );
});

test("campaign boss activation still calls the unscaled spawn path", () => {
  const transitions = section(
    game,
    "const handleWaveTransitions",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /descriptor\.completionPolicy\.type === "BOSS_DEFEAT"[\s\S]*spawnBoss\(\)/,
  );
});

test("rematch boss owns isolated scaled metadata while campaign attempts stay behind !isRematch", () => {
  const spawn = section(
    game,
    "const spawnBoss =",
    "const skipBossIntro =",
  );

  assert.match(
    spawn,
    /const isRematch = rematchProfile !== null/,
  );
  assert.match(
    spawn,
    /if \(!isRematch\)[\s\S]*bossAttempts/,
  );
  assert.match(
    spawn,
    /chassisProfile\.baseHealth \* healthMultiplier/,
  );
  assert.match(
    spawn,
    /milestoneKind: isRematch \? "BOSS_REMATCH" : undefined/,
  );
  assert.match(
    spawn,
    /infiniteBossIdentity:[\s\S]*stage === "PRIMARY"[\s\S]*rematchProfile\?\.bossIdentity/,
  );
  assert.match(
    spawn,
    /const damageMultiplier =[\s\S]*rematchProfile\?\.damageMultiplier[\s\S]*milestoneDamageMultiplier: damageMultiplier/,
  );
  assert.match(
    spawn,
    /const attackRateMultiplier =[\s\S]*rematchProfile\?\.attackRateMultiplier[\s\S]*milestoneAttackRateMultiplier: attackRateMultiplier/,
  );
  assert.match(
    spawn,
    /const rewardMultiplier =[\s\S]*rematchProfile\?\.rewardMultiplier[\s\S]*milestoneRewardMultiplier: rewardMultiplier/,
  );
});

test("rematch attack-rate scaling changes cooldown frequency without shortening telegraphs", () => {
  const ai = section(
    game,
    "const updateBossAI =",
    "const executeBossAttackTicks =",
  );

  assert.match(
    ai,
    /boss\.milestoneAttackRateMultiplier \?\? 1/,
  );
  assert.match(
    ai,
    /bossAttackTimerRef\.current -=[\s\S]*delta \* bossAttackRateMultiplier/,
  );
  assert.match(
    ai,
    /bossAttackTelegraphRef\.current -= delta/,
  );
  assert.doesNotMatch(
    ai,
    /bossAttackTelegraphRef\.current -=[\s\S]*bossAttackRateMultiplier/,
  );
});

test("rematch boss damage scales through the shared boss-damage path but campaign hit telemetry is isolated", () => {
  const damage = section(
    game,
    "const damagePlayerFromBoss =",
    "// --- DAMAGE PLAYER CORE ENGINE ---",
  );

  assert.match(
    damage,
    /const rematch = isActiveBossRematch\(\)/,
  );
  assert.match(
    damage,
    /!rematch &&[\s\S]*bossAttacksHitByTypeRef/,
  );
  assert.match(
    damage,
    /milestoneDamageMultiplier \?\? 1/,
  );
  assert.match(
    damage,
    /damagePlayer\(dmg \* damageMultiplier\)/,
  );
});

test("campaign boss damage/phase telemetry ignores rematch instances", () => {
  assert.match(
    game,
    /bossActiveRef\.current &&[\s\S]*!isActiveBossRematch\(\)[\s\S]*bossDamageTakenRef\.current/,
  );
  assert.match(
    game,
    /enemy\.milestoneKind !== "BOSS_REMATCH"[\s\S]*bossDamageDealtRef\.current/,
  );
  assert.match(
    game,
    /!isActiveBossRematch\(\)[\s\S]*bossMaxPhaseReachedRef\.current/,
  );
  assert.match(
    game,
    /!isActiveBossRematch\(\)[\s\S]*bossAttacksSeenThisRunRef/,
  );
});

test("rematch defeat resolves the gate and resumes Infinite Swarm without campaign checkpoint handoff", () => {
  const defeat = section(
    game,
    "const updateBossDefeatSequence",
    "// --- ENGINE UPDATES",
  );

  const branchStart = defeat.indexOf(
    'if (boss?.milestoneKind === "BOSS_REMATCH")',
  );
  const campaignHandoff = defeat.indexOf(
    "enterInfiniteAfterCampaignVictory();",
  );
  assert.ok(branchStart >= 0);
  assert.ok(campaignHandoff > branchStart);

  const rematchBranch = defeat.slice(
    branchStart,
    campaignHandoff,
  );
  assert.match(
    rematchBranch,
    /resolveBossRematchDefeatAction/,
  );
  assert.match(rematchBranch, /SPAWN_RAID_ESCALATION/);
  assert.match(
    rematchBranch,
    /spawnBoss\(rematchProfile, "RAID_ESCALATION"\)/,
  );
  assert.match(
    rematchBranch,
    /markRuntimeBossRematchDefeated/,
  );
  assert.match(
    rematchBranch,
    /bossActiveRef\.current = false/,
  );
  assert.match(
    rematchBranch,
    /bossRef\.current = null/,
  );
  assert.match(
    rematchBranch,
    /defeatedFamily\?\.defeatLabel/,
  );
  assert.match(rematchBranch, /return;/);
  assert.doesNotMatch(
    rematchBranch,
    /enterInfiniteAfterCampaignVictory/,
  );
  assert.doesNotMatch(
    rematchBranch,
    /applyCampaignVictoryCheckpoint/,
  );
});

test("campaign boss defeat still owns the original campaign-to-infinite handoff", () => {
  const defeat = section(
    game,
    "const updateBossDefeatSequence",
    "// --- ENGINE UPDATES",
  );
  assert.match(
    defeat,
    /enterInfiniteAfterCampaignVictory\(\)/,
  );
});

test("rematch enemy metadata is explicitly represented in Enemy", () => {
  assert.match(
    types,
    /milestoneDamageMultiplier\?: number/,
  );
  assert.match(
    types,
    /milestoneAttackRateMultiplier\?: number/,
  );
  assert.match(
    types,
    /milestoneRewardMultiplier\?: number/,
  );
  assert.match(
    types,
    /infiniteBossIdentity\?: InfiniteBossIdentity/,
  );
  assert.match(types, /bossChassis\?: BossChassisId/);
  assert.match(types, /bossEncounterStage\?: BossEncounterStage/);
});
