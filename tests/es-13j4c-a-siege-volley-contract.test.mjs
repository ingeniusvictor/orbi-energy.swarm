import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (relativePath) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

const contractSource = read("src/game/siegeVolleyTelegraph.ts");
const tacticalFamiliesSource = read("src/game/tacticalEnemyFamilies.ts");
const bossFamilySource = read("src/game/infiniteBossFamily.ts");
const gameSource = read("src/game/EnergySwarmGame.tsx");
const canvasSource = read("src/game/EnergySwarmCanvas.tsx");

test("J4C-A Siege Volley contract stays pure and simulation-time only", () => {
  const forbidden = [
    /^\s*import\s/m,
    /Date\.now/,
    /performance\.now/,
    /Math\.random/,
    /setTimeout/,
    /setInterval/,
    /requestAnimationFrame/,
    /enemiesRef/,
    /projectilesRef/,
    /React/,
    /EnergySwarmGame/,
  ];

  for (const pattern of forbidden) {
    assert.doesNotMatch(contractSource, pattern);
  }
});

test("J4C-A exposes the certified artillery telegraph vocabulary and bounded 700 ms contract", () => {
  assert.match(contractSource, /SIEGE_VOLLEY_TELEGRAPH_MS\s*=\s*700/);
  assert.match(contractSource, /"SIEGE_VOLLEY"/);
  assert.match(contractSource, /"BREAK_ARTILLERY_ENVELOPE"/);
  assert.match(contractSource, /"IDLE"/);
  assert.match(contractSource, /"TELEGRAPH"/);
  assert.match(contractSource, /"COMMIT"/);
  assert.match(contractSource, /commitTriggered/);
  assert.match(contractSource, /acknowledgeSiegeVolleyCommit/);
  assert.match(contractSource, /Number\.isFinite/);
});

test("J4C-A remains aligned with the existing J4A ARTILLERY_CARRIER family contract", () => {
  assert.match(tacticalFamiliesSource, /ARTILLERY_CARRIER/);
  assert.match(tacticalFamiliesSource, /EnemyType\.SIEGE_PRISM/);
  assert.match(tacticalFamiliesSource, /SIEGE_VOLLEY/);
  assert.match(tacticalFamiliesSource, /BREAK_ARTILLERY_ENVELOPE/);
});

test("existing Siege Cathedral boss support context remains explicit for later live adoption", () => {
  assert.match(bossFamilySource, /SIEGE_CATHEDRAL/);
  assert.match(
    bossFamilySource,
    /supportEnemyType:\s*EnemyType\.SIEGE_PRISM/,
  );
  assert.match(bossFamilySource, /supportMaxCount:\s*2/);
});

test("J4C-A does not silently adopt the pure contract into live runtime or renderer", () => {
  assert.doesNotMatch(
    gameSource,
    /from\s+["']\.\/siegeVolleyTelegraph["']/,
  );
  assert.doesNotMatch(
    canvasSource,
    /from\s+["']\.\/siegeVolleyTelegraph["']/,
  );

  assert.match(gameSource, /EnemyType\.SIEGE_PRISM/);
  assert.match(canvasSource, /DRAW WEAPONS CHARGING TELEGRAPHS/);
});

test("pure contract explicitly denies live authority ownership", () => {
  for (const property of [
    "ownsSpawnAuthority: false",
    "ownsEntityCollection: false",
    "ownsProjectileCollection: false",
    "ownsFullArrayScan: false",
    "mayMutateGlobalCaps: false",
    "mayCreateSupportEntities: false",
    "ownsCooldownRandomness: false",
  ]) {
    assert.ok(
      contractSource.includes(property),
      `missing pure authority guard: ${property}`,
    );
  }
});
