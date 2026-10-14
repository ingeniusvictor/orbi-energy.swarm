import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (relativePath) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

const adapterSource = read("src/game/liveSiegeVolleyIntegration.ts");
const telegraphSource = read("src/game/siegeVolleyTelegraph.ts");
const typesSource = read("src/game/types.ts");
const gameSource = read("src/game/EnergySwarmGame.tsx");
const canvasSource = read("src/game/EnergySwarmCanvas.tsx");
const bossFamilySource = read("src/game/infiniteBossFamily.ts");
const tacticalAdoptionSource = read("src/game/runtimeTacticalEnemyAdoption.ts");

test("J4C-B stateless adapter owns no runtime collections, budget, caps or RNG", () => {
  for (const pattern of [
    /Date\.now/,
    /performance\.now/,
    /Math\.random/,
    /setTimeout/,
    /setInterval/,
    /requestAnimationFrame/,
    /enemiesRef/,
    /projectilesRef/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /React/,
  ]) {
    assert.doesNotMatch(adapterSource, pattern);
  }

  for (const guard of [
    "ownsEnemyCollection: false",
    "ownsProjectileCollection: false",
    "ownsSpawnAuthority: false",
    "ownsProjectileBudget: false",
    "ownsCooldownRandomness: false",
    "ownsFullArrayScan: false",
    "mayMutateGlobalCaps: false",
  ]) {
    assert.ok(adapterSource.includes(guard), `missing guard ${guard}`);
  }
});

test("J4C-B reuses the exact J4C-A 700 ms target-lock state machine", () => {
  assert.match(adapterSource, /beginSiegeVolleyTelegraph/);
  assert.match(adapterSource, /stepSiegeVolleyTelegraph/);
  assert.match(adapterSource, /acknowledgeSiegeVolleyCommit/);
  assert.match(adapterSource, /projectSiegeVolleyTelegraph/);
  assert.match(telegraphSource, /SIEGE_VOLLEY_TELEGRAPH_MS\s*=\s*700/);
  assert.match(telegraphSource, /"SIEGE_VOLLEY"/);
  assert.match(telegraphSource, /"BREAK_ARTILLERY_ENVELOPE"/);
});

test("Enemy owns only one optional bounded Siege Volley state", () => {
  assert.match(
    typesSource,
    /import\s+type\s*\{\s*SiegeVolleyTelegraphState\s*\}\s*from\s*["']\.\/siegeVolleyTelegraph["']/,
  );
  assert.match(
    typesSource,
    /siegeVolleyTelegraph\?:\s*SiegeVolleyTelegraphState/,
  );
  assert.doesNotMatch(typesSource, /siegeVolleyTelegraphs/);
  assert.doesNotMatch(typesSource, /siegeVolleyDirector/);
});

test("live SIEGE no longer fires immediately at cooldown expiry", () => {
  assert.match(gameSource, /stepLiveSiegeVolley/);
  assert.match(gameSource, /acknowledgeLiveSiegeVolleyShot/);
  assert.match(gameSource, /LIVE_SIEGE_VOLLEY_FIRE_RANGE/);
  assert.match(gameSource, /targetOverride/);
  assert.match(gameSource, /shotCommitted/);
  assert.match(gameSource, /enemy\.siegeVolleyTelegraph/);
  assert.match(gameSource, /150\s*\+\s*Math\.random\(\)\s*\*\s*70/);

  const immediateSiegePattern =
    /enemy\.type\s*===\s*EnemyType\.SIEGE_PRISM[\s\S]{0,220}?shootFromEnemy\(\s*enemy,\s*hostileProjectileBudgetState\s*\)/;
  assert.doesNotMatch(gameSource, immediateSiegePattern);
});

test("existing projectile authority is preserved and reports accepted fire", () => {
  assert.match(
    gameSource,
    /MAX_PROJECTILES\s*-\s*projectilesRef\.current\.length/,
  );
  assert.match(gameSource, /hostileProjectileBudget\s*-\s*hostileProjectileCount/);
  assert.match(gameSource, /requestedProjectileCount\s*=\s*[\s\S]*EnemyType\.SIEGE_PRISM\s*\?\s*3/);
  assert.match(gameSource, /EnemyType\.SIEGE_PRISM\s*\?\s*4\.0/);
  assert.match(gameSource, /EnemyType\.SIEGE_PRISM\s*\?\s*0\.12/);
  assert.match(gameSource, /return\s+projectileCount\s*>\s*0/);
});

test("renderer exposes a visible SIEGE body and locked-target artillery cue through the authorized live adapter", () => {
  assert.match(canvasSource, /projectLiveSiegeVolleyTelegraph/);
  assert.match(
    canvasSource,
    /from\s+["']\.\/liveSiegeVolleyIntegration["']/,
  );
  assert.doesNotMatch(
    canvasSource,
    /from\s+["']\.\/siegeVolleyTelegraph["']/,
  );
  assert.match(canvasSource, /case EnemyType\.SIEGE_PRISM/);
  assert.match(canvasSource, /SIEGE VOLLEY/);
  assert.match(canvasSource, /targetX/);
  assert.match(canvasSource, /targetY/);
  assert.match(canvasSource, /setLineDash/);
});

test("Siege Cathedral support policy remains unchanged and shares the same SIEGE type path", () => {
  assert.match(bossFamilySource, /SIEGE_CATHEDRAL/);
  assert.match(
    bossFamilySource,
    /supportEnemyType:\s*EnemyType\.SIEGE_PRISM/,
  );
  assert.match(bossFamilySource, /supportMaxCount:\s*2/);
  assert.match(bossFamilySource, /supportCooldownMs:\s*8000/);
  assert.match(gameSource, /isMinion:\s*true/);
});

test("J4C-B does not broaden normal tactical progression", () => {
  assert.doesNotMatch(
    tacticalAdoptionSource,
    /EnemyType\.SIEGE_PRISM/,
  );
  assert.match(tacticalAdoptionSource, /EnemyType\.RIFT_HUNTER/);
});
