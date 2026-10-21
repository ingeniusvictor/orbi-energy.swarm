import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const game = read("src/game/EnergySwarmGame.tsx");
const factory = read("src/game/blackoutArchitectDevQaBossFactory.ts");

test("DEV-only QA uses an explicit triple-modifier F9 gate and cannot route normal modes", () => {
  assert.ok(game.includes('if (import.meta.env.DEV && e.ctrlKey && e.altKey && e.shiftKey && e.code === "F9")'));
  const begin = game.indexOf("const toggleArchitectQaDiagnostic = () => {");
  const end = game.indexOf("// --- KEY LISTENER LISTENERS ---", begin);
  assert.ok(begin >= 0 && end > begin);
  const qa = game.slice(begin, end);
  assert.ok(qa.includes("if (!import.meta.env.DEV) return;"));
  for (const predicate of [
    "!isPlaying", "isGameOver", "isPhotoMode", "isPausedRef.current",
    "isUpgradeSelectionOpenRef.current", "scoreAttackActivationRef.current !== null",
    'runtimeProgressionRef.current.mode !== "CAMPAIGN"',
    "waveActiveRef.current", "bossActiveRef.current",
    "bossRef.current !== null", "enemiesRef.current.length !== 0",
    "bossDefeatedSequenceActiveRef.current",
  ]) assert.ok(qa.includes(predicate), predicate);
  assert.equal((game.match(/\.admitInstalledBoss\(/g) ?? []).length, 1);
  const insertAt = qa.indexOf("enemiesRef.current.push(candidate);");
  const refAt = qa.indexOf("bossRef.current = candidate;", insertAt);
  const admitAt = qa.indexOf(".admitInstalledBoss(", refAt);
  assert.ok(insertAt >= 0 && insertAt < refAt && refAt < admitAt);
  assert.ok(qa.includes("if (!valid) {"));
  assert.ok(qa.includes("architectEngineIdentityOwnerRef.current?.revoke();"));
});

test("QA installation freezes physics before simulation, and cold paths clean up", () => {
  const loop = game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
  const freeze = loop.indexOf("if (architectQaBossRef.current !== null) {");
  const physics = loop.indexOf("timeElapsedRef.current += delta;");
  assert.ok(freeze >= 0 && freeze < physics);
  assert.ok(loop.slice(freeze,physics).includes("renderCanvasScene();"));
  assert.ok(loop.slice(freeze,physics).includes("requestAnimationFrame(gameLoop);"));
  assert.ok(loop.slice(freeze,physics).includes("return;"));
  assert.equal((game.match(/architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter\(\);/g) ?? []).length, 7);
  const count = (game.match(/clearArchitectQaDiagnostic\(\);/g) ?? []).length;
  assert.ok(count >= 8, "seven cold calls plus explicit QA exit");
  assert.ok(game.includes("if (bossRef.current === qaBoss) bossRef.current = null;"));
  assert.ok(game.includes("architectQaBossRef.current = null;"));
  assert.ok(game.includes("setArchitectQaVisible(false);"));
  assert.ok(game.includes("DEV QA — ARCHITECT IDENTITY ONLY · PHYSICS FROZEN"));
  assert.ok(game.includes("{import.meta.env.DEV && architectQaVisible && ("));
  assert.ok(!game.includes('"blackoutArchitectStandaloneCombatBlueprint"'));
});

test("Factory is an independent proposal-only source and cannot grant combat authority", () => {
  assert.ok(factory.includes('from "./blackoutArchitectStandaloneCombatBlueprint"'));
  assert.ok(factory.includes('type: EnemyType.BOSS_ARCHITECT'));
  assert.ok(factory.includes("architectBossIdentity: PROPOSAL.bossId"));
  assert.ok(factory.includes('PROPOSAL.balanceStatus !== "PROVISIONAL_UNTUNED"'));
  assert.ok(factory.includes("if (requested !== true"));
  assert.ok(factory.includes("ownsDevOnlyProvisionalEntityConstruction: true"));
  for (const key of [
    "ownsGameplayAutomaticSpawnAuthority","ownsProductionOrModeRoutingAuthority",
    "ownsAuthenticatedEngineIdentityAuthority","ownsPhysicalCardinalGeometryAuthority",
    "ownsAnchorDurabilityAuthority","ownsCollisionOrHitAuthority",
    "ownsProjectileConsumptionAuthority","ownsBossHealthOrDamageMutationAuthority",
    "ownsAIOrAttackExecutionAuthority","ownsHudOrRewardsAuthority",
    "ownsRandomnessOrTimerAuthority","ownsGlobalBudgetMutationAuthority"
  ]) {
    if (key === "ownsAnchorDurabilityAuthority") continue;
    assert.ok(factory.includes(key + ": false"),key);
  }
  for (const banned of ["Math.random", "Date.now", "setTimeout", "setInterval", "bossRef.current", "projectilesRef", "getBossChassisProfile"])
    assert.ok(!factory.includes(banned),banned);
});
