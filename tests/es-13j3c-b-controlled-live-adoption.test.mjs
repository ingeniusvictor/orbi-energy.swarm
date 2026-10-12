import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const directorSource = fs.readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const gameSource = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const playerFormationsSource = fs.readFileSync("src/game/formations.ts", "utf8");

const sliceBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
};

test("J3C-B extends the existing J3B director with the certified advanced vocabulary", () => {
  for (const route of ["PINCER", "X_CROSS", "SERPENTINE", "WEDGE", "ORBIT", "SPIRAL"]) {
    assert.match(directorSource, new RegExp(`"${route}"`));
  }
  assert.match(directorSource, /LEGACY_ROUTE_CYCLE/);
  assert.match(directorSource, /ADVANCED_ROUTE_CYCLE/);
  assert.match(directorSource, /FULL_ROUTE_CYCLE/);
  assert.match(directorSource, /resolveLiveEnemyFormationRoutePlan/);
  assert.doesNotMatch(gameSource, /"WEDGE"|"ORBIT"|"SPIRAL"/);
});

test("J3C-B keeps legacy pairs while only WEDGE and ORBIT require three live members", () => {
  assert.match(directorSource, /LIVE_ENEMY_FORMATION_GROUP_SIZE = 2/);
  assert.match(directorSource, /LIVE_ENEMY_FORMATION_ADVANCED_GROUP_SIZE = 3/);
  assert.match(
    directorSource,
    /route === "WEDGE" \|\| route === "ORBIT"[\s\S]*?LIVE_ENEMY_FORMATION_ADVANCED_GROUP_SIZE[\s\S]*?: LIVE_ENEMY_FORMATION_GROUP_SIZE/,
  );
  assert.match(directorSource, /request\.remainingCapacity >= routePlan\.memberCount/);
  assert.match(directorSource, /request\.remainingCapacity < remainingMembers/);
});

test("J3C-B advanced route adoption is explicitly configurable per runtime mode", () => {
  assert.match(directorSource, /campaignAdvancedRoutesEnabled:\s*boolean/);
  assert.match(directorSource, /infiniteAdvancedRoutesEnabled:\s*boolean/);
  assert.match(directorSource, /campaignAdvancedRoutesEnabled:\s*true/);
  assert.match(directorSource, /infiniteAdvancedRoutesEnabled:\s*true/);
  assert.match(
    directorSource,
    /sourceMode === "INFINITE"[\s\S]*?infiniteAdvancedRoutesEnabled[\s\S]*?campaignAdvancedRoutesEnabled/,
  );
});

test("J3C-B continues to consume the existing spawn seam and existing capacity only", () => {
  const spawn = sliceBetween(
    gameSource,
    "const formationResolution =",
    "if (\n      !spawningMiniboss &&\n      type === EnemyType.BLACKOUT_ELITE",
  );
  assert.match(spawn, /requestLiveEnemyFormationSpawn/);
  assert.match(spawn, /spawnOrdinal:\s*waveBudgetSpawnedRef\.current/);
  assert.match(spawn, /Math\.min\([\s\S]*?MAX_ENEMIES[\s\S]*?descriptor\.spawn\.maxConcurrentEnemies/);
  assert.match(spawn, /- enemiesRef\.current\.length/);
  assert.doesNotMatch(spawn, /enemiesRef\.current\.(?:push|forEach|filter|map|reduce)\(/);
  assert.doesNotMatch(spawn, /projectilesRef\.current/);
  assert.doesNotMatch(directorSource, /MAX_ENEMIES|MAX_PROJECTILES/);
});

test("J3C-B keeps one active or assembling group and caller-owned enemy metadata", () => {
  assert.match(directorSource, /pending:\s*PendingFormationMember \| null/);
  assert.match(directorSource, /activeUntilMs/);
  assert.match(directorSource, /nextMemberIndex/);
  assert.match(directorSource, /nextMemberIndex < current\.pending\.common\.memberCount/);
  assert.doesNotMatch(directorSource, /enemyFormation(?:Map|Array|List)|new Map|new Set/);
  assert.doesNotMatch(directorSource, /enemiesRef|Enemy\[\]/);
  assert.match(gameSource, /enemyFormation:\s*enemyFormation \?\? undefined/);
});

test("J3C-B preserves simulation-time movement ownership, pause safety and reset seams", () => {
  assert.doesNotMatch(
    directorSource,
    /Math\.random|Date\.now|performance\.now|requestAnimationFrame|setInterval|setTimeout/,
  );
  assert.match(gameSource, /nowMs:\s*timeElapsedRef\.current/);
  assert.match(
    gameSource,
    /enemyFormationDirectorRef\.current\s*=\s*createLiveEnemyFormationDirectorState\(\)/,
  );
  assert.match(gameSource, /enemy\.enemyFormation = undefined/);
});

test("J3C-B leaves player FOTON formations and unrelated combat ownership separate", () => {
  assert.doesNotMatch(
    playerFormationsSource,
    /enemyFormation|EnemyFormation|PINCER|X_CROSS|SERPENTINE|WEDGE|ORBIT|SPIRAL/,
  );
  assert.doesNotMatch(
    directorSource,
    /from ["']\.\/(?:formations|formationCycle)["']|\bFormationType\b|calculateSwarmOffset|FORMATIONS/,
  );
  assert.doesNotMatch(
    directorSource,
    /score|damage|health|projectile|nano|reward|combatResonance|combatOverdrive|GAIA/i,
  );
});
