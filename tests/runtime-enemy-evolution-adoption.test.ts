import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const game = read("src/game/EnergySwarmGame.tsx");
const canvas = read("src/game/EnergySwarmCanvas.tsx");
const types = read("src/game/types.ts");

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

test("live runtime imports the certified evolved-enemy resolver", () => {
  assert.match(
    game,
    /resolveEvolvedEnemySpawn/,
  );
  assert.match(
    game,
    /runtimeEnemyEvolution/,
  );
});

test("spawn resolves evolution from descriptor type wave ordinal and living evolved count", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /const activeEvolvedEnemies =[\s\S]*countActiveEvolvedEnemies\([\s\S]*enemiesRef\.current/,
  );
  assert.match(
    spawn,
    /resolveEvolvedEnemySpawn\(\{[\s\S]*descriptor,[\s\S]*enemyType: type,[\s\S]*spawnOrdinal:[\s\S]*waveBudgetSpawnedRef\.current,[\s\S]*activeEvolvedEnemies/,
  );
});

test("milestone minibosses fail closed before evolved selection", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /const evolvedProfile =[\s\S]*spawningMiniboss[\s\S]*\? null[\s\S]*resolveEvolvedEnemySpawn/,
  );
  assert.match(
    spawn,
    /milestoneKind:[\s\S]*spawningMiniboss \? "MINIBOSS" : undefined/,
  );
});

test("existing pressure and mutator scaling are established before evolved stat multipliers", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  const pressureIndex = spawn.indexOf(
    "combatPressure.enemyHealthMultiplier",
  );
  const mutatorIndex = spawn.indexOf(
    "mutatorEffects.enemySpeedMultiplier",
  );
  const evolvedHealthIndex = spawn.indexOf(
    "health *= evolvedProfile.healthMultiplier",
  );
  const evolvedSpeedIndex = spawn.indexOf(
    "speed *= evolvedProfile.movementSpeedMultiplier",
  );

  assert.ok(pressureIndex >= 0);
  assert.ok(mutatorIndex > pressureIndex);
  assert.ok(evolvedHealthIndex > mutatorIndex);
  assert.ok(evolvedSpeedIndex >= evolvedHealthIndex);
});

test("evolved enemies cannot stack the random elite multiplier", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /const isElite =[\s\S]*!spawningMiniboss &&[\s\S]*!evolvedProfile &&[\s\S]*Math\.random\(\) < effectiveEliteChance/,
  );
});

test("evolved instance metadata carries only bounded profile outputs", () => {
  assert.match(
    types,
    /evolvedVariantId\?: EvolvedEnemyVariantId/,
  );
  assert.match(
    types,
    /evolvedSignature\?: EvolvedEnemySignature/,
  );
  assert.match(
    types,
    /evolvedContactDamageMultiplier\?: number/,
  );
  assert.match(
    types,
    /evolvedAttackRateMultiplier\?: number/,
  );
  assert.match(
    types,
    /evolvedProjectileSpeedMultiplier\?: number/,
  );
  assert.match(
    types,
    /evolvedRewardMultiplier\?: number/,
  );
  assert.match(
    types,
    /evolvedSpecialIntensity\?: number/,
  );

  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );
  for (const profileField of [
    "id",
    "signature",
    "contactDamageMultiplier",
    "attackRateMultiplier",
    "projectileSpeedMultiplier",
    "rewardMultiplier",
    "specialIntensity",
  ]) {
    assert.match(
      spawn,
      new RegExp(
        `evolvedProfile\\?\\.${profileField}`,
      ),
    );
  }
});

test("per-enemy evolved attack rate multiplies the existing runtime pressure timer", () => {
  const physics = section(
    game,
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /simulationCombatPressure\.enemyAttackRateMultiplier \*[\s\S]*enemy\.evolvedAttackRateMultiplier \?\? 1/,
  );
});

test("enemy projectile speed adopts per-instance evolution without changing boss defaults", () => {
  const shoot = section(
    game,
    "const shootFromEnemy =",
    "const getEnemyScoreReward",
  );

  assert.match(
    shoot,
    /const projectileSpeed =[\s\S]*2\.2 \*[\s\S]*enemy\.evolvedProjectileSpeedMultiplier \?\?[\s\S]*1/,
  );
  assert.match(
    shoot,
    /const baseAngle = Math\.atan2\(dy, dx\)/,
  );
  assert.match(
    shoot,
    /const vx =[\s\S]*Math\.cos\(shotAngle\) \* projectileSpeed/,
  );
  assert.match(
    shoot,
    /const vy =[\s\S]*Math\.sin\(shotAngle\) \* projectileSpeed/,
  );
  assert.match(
    shoot,
    /enemy\.type === EnemyType\.DRONE \|\| enemy\.type === EnemyType\.BOSS_DEVOURER/,
  );
});

test("contact damage combines pressure mutator milestone and evolved instance multipliers", () => {
  const collisions = section(
    game,
    "const detectAndResolveCollisions =",
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
  );

  assert.match(
    collisions,
    /combatPressure\.contactDamageMultiplier \*[\s\S]*mutatorEffects\.incomingDamageMultiplier \*[\s\S]*enemy\.milestoneContactDamageMultiplier[\s\S]*enemy\.evolvedContactDamageMultiplier/,
  );
  assert.match(
    collisions,
    /damagePlayerFromBoss\(baseDamage, attackType\)/,
  );
});

test("score reward composes milestone and evolved multipliers in one helper", () => {
  const reward = section(
    game,
    "const getEnemyScoreReward",
    "// --- DETECT SINGLE-IMPACT COLLISION SWEEPS ---",
  );

  assert.match(
    reward,
    /enemy\.milestoneRewardMultiplier \?\? 1/,
  );
  assert.match(
    reward,
    /enemy\.evolvedRewardMultiplier \?\? 1/,
  );

  const collisions = section(
    game,
    "const detectAndResolveCollisions =",
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
  );
  const uses =
    collisions.match(/getEnemyScoreReward\(/g) ?? [];
  assert.equal(
    uses.length,
    2,
    "direct and splash kills must share evolved-aware rewards",
  );
});

test("split minions remain ordinary and never resolve evolved variants", () => {
  const split = section(
    game,
    "const spawnMinionSplit =",
    "// --- DAMAGE PLAYER FROM BOSS SPECIFIC TELEMETRY ---",
  );

  assert.doesNotMatch(
    split,
    /resolveEvolvedEnemySpawn/,
  );
  assert.doesNotMatch(
    split,
    /evolvedVariantId/,
  );
  assert.match(
    split,
    /type: EnemyType\.CRAWLER/,
  );
});

test("campaign and Devourer spawn paths contain no direct evolved override", () => {
  const boss = section(
    game,
    "const spawnBoss =",
    "const skipBossIntro =",
  );

  assert.doesNotMatch(
    boss,
    /resolveEvolvedEnemySpawn/,
  );
  assert.doesNotMatch(
    boss,
    /evolvedVariantId/,
  );

  // Campaign neutrality is provided by the ES-08A policy; the live
  // spawn path consumes that policy rather than branching on campaign.
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );
  assert.doesNotMatch(
    spawn,
    /currentWaveRef\.current\s*[><=]+\s*26/,
  );
});

test("Canvas renders a bounded identity marker only for evolved instances", () => {
  const drawing = section(
    canvas,
    "export function drawEnemiesList",
    "// DRAW WEAPONS CHARGING TELEGRAPHS",
  );

  assert.match(
    drawing,
    /if \(enemy\.evolvedVariantId\)/,
  );
  assert.match(drawing, /#22d3ee/);
  assert.match(
    drawing,
    /enemy\.evolvedVariantId\.replace\(\/_\/g, " "\)/,
  );
  assert.match(
    drawing,
    /enemy\.size \* 1\.45 \+ evolvedPulse/,
  );
});

test("live signature adoption remains contract-driven without duplicated signature IDs", () => {
  const physics = section(
    game,
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /enemySignatureBehaviorCacheRef\.current\.get\(enemy\)/,
  );
  assert.doesNotMatch(
    physics,
    /ARMORED_MOMENTUM|PHASE_LUNGE|LANCE_VOLLEY|BROOD_RELEASE|NULL_PULSE/,
  );
});
