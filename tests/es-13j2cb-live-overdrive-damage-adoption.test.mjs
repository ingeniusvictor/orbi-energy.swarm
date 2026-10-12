import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const gameSource = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");

const shootStart = gameSource.indexOf("const shootFromSwarm =");
assert.notEqual(shootStart, -1, "Missing shootFromSwarm");

const cooldownMarker = gameSource.indexOf(
  "member.shootCooldown =\n      profile.cooldownFrames",
  shootStart,
);
assert.notEqual(cooldownMarker, -1, "Missing shootFromSwarm cooldown marker");

const shootSource = gameSource.slice(shootStart, cooldownMarker + 500);

test("J2C-B adopts the certified combat-expression helper at the player projectile damage seam", () => {
  assert.match(
    gameSource,
    /import \{ projectCombatOverdriveEffects \} from "\.\/combatOverdriveEffects";/,
  );

  const primaryDamageIndex = shootSource.indexOf("const primaryDamage =");
  const effectsIndex = shootSource.indexOf(
    "const overdriveEffects = projectCombatOverdriveEffects(",
  );
  const adjustedDamageIndex = shootSource.indexOf(
    "const overdriveAdjustedDamage =",
  );
  const projectileFactoryIndex = shootSource.indexOf("const makeProjectile =");

  assert.ok(primaryDamageIndex >= 0);
  assert.ok(effectsIndex > primaryDamageIndex);
  assert.ok(adjustedDamageIndex > effectsIndex);
  assert.ok(projectileFactoryIndex > adjustedDamageIndex);

  assert.match(
    shootSource,
    /projectCombatOverdriveEffects\(\{\s*active:\s*combatOverdriveRef\.current\.active,?\s*\}\)/,
  );
  assert.match(
    shootSource,
    /const overdriveAdjustedDamage\s*=\s*primaryDamage\s*\*\s*overdriveEffects\.playerDamageMultiplier;/,
  );
  assert.match(
    shootSource,
    /damage:\s*overdriveAdjustedDamage\s*\*\s*damageMultiplier,/,
  );
});

test("J2C-B applies one authoritative projection without duplicating timing or tuning", () => {
  assert.equal(
    (shootSource.match(/projectCombatOverdriveEffects\(/g) ?? []).length,
    1,
  );
  assert.doesNotMatch(shootSource, /advanceCombatOverdrive\(/);
  assert.doesNotMatch(shootSource, /projectCombatOverdrive\(/);
  assert.doesNotMatch(shootSource, /combatOverdriveView\.active/);
  assert.doesNotMatch(shootSource, /\b1\.2(?:0)?\b|\b1\.25\b/);
  assert.doesNotMatch(
    gameSource,
    /import[\s\S]{0,160}\b(?:OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER|MAX_OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER)\b[\s\S]{0,160}from "\.\/combatOverdriveEffects"/,
  );
});

test("J2C-B preserves projectile budget and existing resolved damage ordering", () => {
  const budgetGuardIndex = shootSource.indexOf(
    "if (projectilesRef.current.length >= MAX_PROJECTILES) return;",
  );
  const baseDamageIndex = shootSource.indexOf("const baseDamage =");
  const profileDamageIndex = shootSource.indexOf("profile.damageMultiplier");
  const gaiaDamageIndex = shootSource.indexOf(
    "gaiaScale?.damageMultiplier ?? 1",
  );
  const criticalDamageIndex = shootSource.indexOf(
    "critical ? profile.criticalDamageMultiplier : 1",
  );
  const adjustedDamageIndex = shootSource.indexOf(
    "const overdriveAdjustedDamage =",
  );

  assert.ok(budgetGuardIndex >= 0);
  assert.ok(baseDamageIndex > budgetGuardIndex);
  assert.ok(profileDamageIndex > baseDamageIndex);
  assert.ok(gaiaDamageIndex > profileDamageIndex);
  assert.ok(criticalDamageIndex > gaiaDamageIndex);
  assert.ok(adjustedDamageIndex > criticalDamageIndex);

  assert.match(
    shootSource,
    /member\.shootCooldown\s*=\s*profile\.cooldownFrames\s*\*/,
  );
});
