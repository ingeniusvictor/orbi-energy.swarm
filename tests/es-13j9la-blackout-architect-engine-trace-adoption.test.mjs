import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const helper = read("src/game/blackoutArchitectCollisionTraceOrdinal.ts");
const game = read("src/game/EnergySwarmGame.tsx");
const types = read("src/game/types.ts");

test("J9L-A owns bounded successor, never real collision or replay authority", () => {
  assert.match(helper, /ownsPureBoundedOrdinalSuccessorAuthority: true/);
  for (const s of [
    "ownsCollisionDetectionOrPhysicalGeometryAuthority","ownsCollisionEventIssuanceAuthority",
    "ownsProjectileConsumptionOrReplayPreventionAuthority","ownsBossHealthOrDamageAuthority",
    "ownsRunOrProjectileIdentityAuthenticationAuthority","ownsSpawnOrBossActivationAuthority",
    "ownsModeRoutingOrTuningAuthority","ownsCapOrBudgetAuthority","ownsRandomnessAuthority",
  ]) assert.match(helper, new RegExp(s+": false"));
  assert.match(helper,/Number\.isSafeInteger/);
  assert.doesNotMatch(helper,/Math\.random|setInterval|requestAnimationFrame|new Map|new Set/);
});

test("J9L-A preserves random projectile ID and stamps only player makeProjectile", () => {
  const from=game.indexOf("const makeProjectile = (");
  const to=game.indexOf("projectilesRef.current.push(makeProjectile(baseAngle))",from);
  assert.ok(from>0 && to>from);
  const shot=game.slice(from,to);
  assert.match(shot,/id: Math\.random\(\)\.toString\(\)/);
  assert.match(shot,/collisionTracePlayerShotRef\.current = shotOrdinal/);
  for(const field of ["collisionTraceRunEpoch","collisionTracePhysicsFrame","collisionTraceProjectileOrdinal"]){
    assert.ok(shot.includes("projectile."+field+" ="),field);
    assert.ok(types.includes(field+"?: number;"),field);
  }
  assert.match(shot,/return projectile/);
  const enemy=game.slice(game.indexOf("const shootFromEnemy = "),game.indexOf("const getEnemyScoreReward = "));
  assert.doesNotMatch(enemy,/collisionTrace/);
});

test("J9L-A increments only an active physics step after cinematic freeze and resets per run", () => {
  assert.match(game,/const collisionTraceRunEpochRef = useRef<number \| null>\(0\)/);
  assert.match(game,/const collisionTracePhysicsFrameRef = useRef<number \| null>\(0\)/);
  assert.match(game,/const collisionTracePlayerShotRef = useRef<number \| null>\(0\)/);
  const start=game.slice(game.indexOf("const startGame = () => {"),game.indexOf("const startGameWithMode = "));
  assert.match(start,/collisionTraceRunEpochRef\.current = nextBlackoutArchitectCollisionTraceOrdinal\(/);
  assert.match(start,/collisionTracePhysicsFrameRef\.current = 0/);
  assert.match(start,/collisionTracePlayerShotRef\.current = 0/);
  assert.doesNotMatch(start,/collisionTraceRunEpochRef\.current = 0/);
  const loop=game.slice(game.indexOf("const gameLoop = "),game.indexOf("const updateEnginePhysics = "));
  assert.doesNotMatch(loop,/collisionTracePhysicsFrameRef\.current = nextBlackoutArchitectCollisionTraceOrdinal/);
  const physics=game.slice(game.indexOf("const updateEnginePhysics = "),game.indexOf("const triggerResourceCollect = "));
  const cinematic=physics.indexOf("if (bossDefeatedSequenceActiveRef.current) {");
  const early=physics.indexOf("// Return early to freeze rest of physical ticks!");
  const next=physics.indexOf("collisionTracePhysicsFrameRef.current = nextBlackoutArchitectCollisionTraceOrdinal(");
  assert.ok(cinematic>=0 && early>cinematic && next>early);
  assert.ok(next<physics.indexOf("detectAndResolveCollisions();"));
  const resolve=game.slice(game.indexOf("const detectAndResolveCollisions = "),game.indexOf("// 2. ENEMIES CONTACT DAMAGE vs PLAYER CORE"));
  assert.doesNotMatch(resolve,/collisionTraceRunEpochRef|collisionTracePlayerShotRef|collisionTracePhysicsFrameRef|nextBlackoutArchitectCollisionTraceOrdinal/);
});
