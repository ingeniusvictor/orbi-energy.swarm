import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL(
    "../src/game/EnergySwarmGame.tsx",
    import.meta.url,
  ),
  "utf8",
);

const section = (
  startMarker: string,
  endMarker: string,
) => {
  const start = game.indexOf(startMarker);
  const end = game.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(
    start >= 0,
    `Missing start marker: ${startMarker}`,
  );
  assert.ok(
    end > start,
    `Missing end marker: ${endMarker}`,
  );
  return game.slice(start, end);
};

test("live runtime consumes the certified signature behavior cache", () => {
  assert.match(
    game,
    /createEnemySignatureBehaviorCache/,
  );
  assert.match(
    game,
    /enemySignatureBehaviorCache/,
  );
  assert.doesNotMatch(
    game,
    /ARMORED_MOMENTUM|PHASE_LUNGE|LANCE_VOLLEY|BROOD_RELEASE|NULL_PULSE/,
    "live runtime should consume projected axes instead of duplicating signature IDs",
  );
});

test("enemy simulation resolves cached signature behavior from enemy identity", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /const signatureBehavior =[\s\S]*enemySignatureBehaviorCacheRef\.current\.get\(enemy\)/,
  );
  assert.doesNotMatch(
    physics,
    /projectEvolvedSignatureBehavior\(/,
  );
});

test("PHASE_LUNGE scales only the existing parasite oscillation axes", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  const parasiteStart = physics.indexOf(
    "enemy.type === EnemyType.PARASITE",
  );
  assert.ok(parasiteStart >= 0);
  const parasite = physics.slice(
    parasiteStart,
    physics.indexOf(
      "} else {",
      parasiteStart + 20,
    ),
  );

  assert.match(
    parasite,
    /signatureBehavior\.parasiteLungeFrequencyMultiplier/,
  );
  assert.match(
    parasite,
    /signatureBehavior\.parasiteLungeAmplitudeMultiplier/,
  );
  assert.match(parasite, /Math\.sin\(lungePhase\)/);
});

test("NULL_PULSE extends only the existing disruption duration", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /disruptTimerRef\.current =[\s\S]*2000 \*[\s\S]*signatureBehavior\.disruptDurationMultiplier/,
  );
  assert.doesNotMatch(
    physics,
    /signatureBehavior\.[A-Za-z]*Damage/,
  );
});

test("LANCE_VOLLEY is constrained by both global and hostile projectile budgets", () => {
  const shoot = section(
    "const shootFromEnemy =",
    "const getEnemyScoreReward",
  );

  assert.match(
    shoot,
    /MAX_PROJECTILES - projectilesRef\.current\.length/,
  );
  assert.match(
    shoot,
    /hostileProjectileBudget - hostileProjectileCount/,
  );
  assert.match(
    shoot,
    /const availableProjectileSlots = Math\.max\([\s\S]*Math\.min\(/,
  );
  assert.match(
    shoot,
    /if \(availableProjectileSlots <= 0\) return/,
  );
  assert.match(
    shoot,
    /Math\.min\([\s\S]*signatureBehavior\.droneVolleyProjectileCount,[\s\S]*availableProjectileSlots/,
  );
});

test("LANCE_VOLLEY uses bounded spread without increasing per-projectile damage", () => {
  const shoot = section(
    "const shootFromEnemy =",
    "const getEnemyScoreReward",
  );

  assert.match(
    shoot,
    /signatureBehavior\.droneVolleySpreadRadians/,
  );
  assert.match(
    shoot,
    /spreadOffset =[\s\S]*-spread \/ 2[\s\S]*spread \/ 2/,
  );

  const damageValues =
    shoot.match(/damage:\s*12/g) ?? [];
  assert.equal(
    damageValues.length,
    1,
    "enemy projectile template must retain the historical damage: 12 value",
  );
  assert.doesNotMatch(
    shoot,
    /damage:\s*12\s*\*/,
  );
});

test("Devourer still shares the shooter helper but receives neutral signature behavior", () => {
  const shoot = section(
    "const shootFromEnemy =",
    "const getEnemyScoreReward",
  );
  const boss = section(
    "const spawnBoss =",
    "const skipBossIntro =",
  );

  assert.match(
    shoot,
    /EnemyType\.DRONE \|\| enemy\.type === EnemyType\.BOSS_DEVOURER/,
  );
  assert.doesNotMatch(
    boss,
    /evolvedSignature|evolvedSpecialIntensity/,
  );
});

test("ARMORED_MOMENTUM only scales projectile pushback after damage is applied", () => {
  const collisions = section(
    "const detectAndResolveCollisions =",
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
  );

  const damageIndex = collisions.indexOf(
    "enemy.health -= damageToApply",
  );
  const pushbackProjectionIndex = collisions.indexOf(
    "signatureBehavior.projectilePushbackMultiplier",
  );

  assert.ok(damageIndex >= 0);
  assert.ok(
    pushbackProjectionIndex > damageIndex,
    "signature pushback must not alter direct damage calculation",
  );
  assert.match(
    collisions,
    /const basePushFactor =[\s\S]*const pushFactor =[\s\S]*basePushFactor \*[\s\S]*signatureBehavior\.projectilePushbackMultiplier/,
  );
});

test("both direct and thermal-splash Splitter deaths use one signature-aware spawn helper", () => {
  const collisions = section(
    "const detectAndResolveCollisions =",
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
  );

  const calls =
    collisions.match(
      /spawnSplitterMinions\(/g,
    ) ?? [];
  assert.equal(calls.length, 2);
  assert.doesNotMatch(
    collisions,
    /spawnMinionSplit\([^)]*x - 10/,
  );
});

test("BROOD_RELEASE extra minion is gated by descriptor and global enemy concurrency", () => {
  const split = section(
    "const spawnMinionSplit =",
    "// --- DAMAGE PLAYER FROM BOSS SPECIFIC TELEMETRY ---",
  );

  assert.match(
    split,
    /const spawnSplitterMinions =/,
  );
  assert.match(
    split,
    /signatureBehavior\.splitterExtraMinions < 1/,
  );
  assert.match(
    split,
    /const livingEnemyCount =[\s\S]*countLivingEnemies\([\s\S]*enemiesRef\.current/,
  );
  assert.match(
    split,
    /const effectiveEnemyCap = Math\.min\([\s\S]*MAX_ENEMIES,[\s\S]*descriptor\.spawn\.maxConcurrentEnemies/,
  );
  assert.match(
    split,
    /if \(livingEnemyCount < effectiveEnemyCap\)[\s\S]*spawnMinionSplit\([\s\S]*enemy\.x,[\s\S]*enemy\.y \+ 10/,
  );
});

test("split minions remain ordinary crawlers without inherited evolved metadata", () => {
  const split = section(
    "const spawnMinionSplit =",
    "const spawnSplitterMinions =",
  );

  assert.match(split, /type: EnemyType\.CRAWLER/);
  assert.doesNotMatch(
    split,
    /evolvedVariantId|evolvedSignature|evolvedSpecialIntensity/,
  );
});

test("live signatures add no new persistent state or campaign branch", () => {
  assert.doesNotMatch(
    game,
    /useState<[^>]*Evolved|useRef<[^>]*Evolved/,
  );

  const spawn = section(
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );
  assert.doesNotMatch(
    spawn,
    /PHASE_LUNGE|LANCE_VOLLEY|BROOD_RELEASE|NULL_PULSE|ARMORED_MOMENTUM/,
  );
});
