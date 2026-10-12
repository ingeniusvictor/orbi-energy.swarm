import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const routeSource = readFileSync("src/game/enemyFormationRoutes.ts", "utf8");
const directorSource = readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const typeSource = readFileSync("src/game/types.ts", "utf8");
const playerFormationSource = readFileSync("src/game/formations.ts", "utf8");
const playerCycleSource = readFileSync("src/game/formationCycle.ts", "utf8");

const sliceBetween = (source, start, end) => {
  const a = source.indexOf(start);
  assert.notEqual(a, -1, `missing start marker: ${start}`);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(b, -1, `missing end marker: ${end}`);
  return source.slice(a, b);
};

test("J3D certifies all six pure routes expose explicit tactical telegraph vocabulary", () => {
  for (const token of [
    "PINCER",
    "X_CROSS",
    "SERPENTINE",
    "WEDGE",
    "ORBIT",
    "SPIRAL",
    "FLANK_CONVERGENCE",
    "DIAGONAL_CROSS",
    "WAVE_CORRIDOR",
    "WEDGE_ADVANCE",
    "ROTATING_RING",
    "SPIRAL_COMPRESSION",
    "ESCAPE_FLANK_BEFORE_CLOSURE",
    "TIME_CENTER_GAP",
    "TRACK_MOVING_GAP",
    "CHOOSE_WEDGE_FLANK",
    "CHOOSE_RING_SIDE",
    "TIME_SPIRAL_GAP",
  ]) {
    assert.match(routeSource, new RegExp(`"${token}"`));
  }
  assert.match(routeSource, /required:\s*true/);
  assert.match(routeSource, /severity:/);
  assert.match(routeSource, /laneCount:/);
  assert.match(routeSource, /safeIntent:/);
});

test("J3D certifies pure route authority still has no runtime, clock, RNG or side-effect ownership", () => {
  assert.doesNotMatch(routeSource, /^\s*import\s/m);
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /localStorage/,
    /sessionStorage/,
    /fetch\s*\(/,
    /enemiesRef/,
    /projectilesRef/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /EnergySwarmGame/,
  ]) {
    assert.doesNotMatch(routeSource, forbidden);
  }
});

test("J3D certifies live director has one bounded deterministic route-planning authority", () => {
  assert.match(directorSource, /LEGACY_ROUTE_CYCLE/);
  assert.match(directorSource, /ADVANCED_ROUTE_CYCLE/);
  assert.match(directorSource, /FULL_ROUTE_CYCLE/);
  assert.match(directorSource, /LIVE_ENEMY_FORMATION_GROUP_SIZE = 2/);
  assert.match(directorSource, /LIVE_ENEMY_FORMATION_ADVANCED_GROUP_SIZE = 3/);
  assert.match(directorSource, /pending:\s*PendingFormationMember \| null/);
  assert.match(directorSource, /activeUntilMs/);
  assert.match(directorSource, /request\.remainingCapacity >= routePlan\.memberCount/);
  assert.match(directorSource, /request\.remainingCapacity < remainingMembers/);
  assert.doesNotMatch(directorSource, /new Map|new Set|Enemy\[\]|enemiesRef|projectilesRef/);
  assert.doesNotMatch(
    directorSource,
    /Math\.random|Date\.now|performance\.now|requestAnimationFrame|setTimeout|setInterval/,
  );
});

test("J3D certifies the existing spawn seam supplies capacity and simulation time without a formation-only scan", () => {
  const spawn = sliceBetween(
    gameSource,
    "const formationResolution =",
    "if (\n      !spawningMiniboss &&\n      type === EnemyType.BLACKOUT_ELITE",
  );
  assert.match(spawn, /requestLiveEnemyFormationSpawn/);
  assert.match(spawn, /remainingCapacity:/);
  assert.match(spawn, /MAX_ENEMIES/);
  assert.match(spawn, /descriptor\.spawn\.maxConcurrentEnemies/);
  assert.match(spawn, /enemiesRef\.current\.length/);
  assert.match(spawn, /nowMs:\s*timeElapsedRef\.current/);
  assert.doesNotMatch(spawn, /enemiesRef\.current\.(?:forEach|filter|map|reduce)\(/);
  assert.doesNotMatch(spawn, /projectilesRef\.current/);
});

test("J3D certifies formation movement replaces rather than stacks on the legacy movement branch", () => {
  assert.match(gameSource, /projectLiveEnemyFormationMotion/);
  assert.match(gameSource, /if \(enemy\.enemyFormation\)/);
  assert.match(gameSource, /enemy\.x = formationMotion\.x/);
  assert.match(gameSource, /enemy\.y = formationMotion\.y/);
  assert.match(gameSource, /enemy\.enemyFormation = undefined/);
});

test("J3D certifies director reset seams remain present for run, wave and boss lifecycle", () => {
  const resetMatches = gameSource.match(
    /enemyFormationDirectorRef\.current\s*=\s*createLiveEnemyFormationDirectorState\(\)/g,
  );
  assert.ok((resetMatches?.length ?? 0) >= 3);
});

test("J3D certifies enemy assignment stays optional metadata instead of a parallel collection", () => {
  assert.match(typeSource, /enemyFormation\?/);
  assert.match(gameSource, /enemyFormation:\s*enemyFormation \?\? undefined/);
  assert.doesNotMatch(gameSource, /enemyFormation(?:Map|Array|List)Ref/);
  assert.doesNotMatch(directorSource, /enemyFormation(?:Map|Array|List)/);
});

test("J3D certifies Campaign and Infinite base/advanced eligibility are explicit and independent", () => {
  for (const token of [
    "campaignEnabled",
    "infiniteEnabled",
    "campaignAdvancedRoutesEnabled",
    "infiniteAdvancedRoutesEnabled",
    "campaignMinWave",
    "campaignMaxWave",
  ]) {
    assert.match(directorSource, new RegExp(token));
  }
  assert.match(directorSource, /request\.milestoneActive/);
  assert.match(directorSource, /request\.eligibleEnemy/);
  assert.match(directorSource, /isLiveEnemyFormationType/);
});

test("J3D certifies player FOTON formation ownership remains isolated", () => {
  assert.doesNotMatch(
    playerFormationSource,
    /enemyFormation|EnemyFormation|PINCER|X_CROSS|SERPENTINE|WEDGE|ORBIT|SPIRAL/,
  );
  assert.doesNotMatch(
    playerCycleSource,
    /enemyFormation|EnemyFormation|PINCER|X_CROSS|SERPENTINE|WEDGE|ORBIT|SPIRAL/,
  );
  assert.doesNotMatch(
    directorSource,
    /from ["']\.\/(?:formations|formationCycle)["']|calculateSwarmOffset|FORMATIONS/,
  );
});

test("J3D static certification does not substitute for deferred manual/physical evidence", () => {
  const continuity = readFileSync("docs/PROJECT_CONTINUITY.md", "utf8");
  for (const issue of ["#4", "#5", "#202", "#248"]) {
    assert.match(continuity, new RegExp(issue.replace("#", "#")));
  }
  assert.match(continuity, /CI is never a substitute for required human\/device evidence/);
});
