import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/commandLinkPulseTriggerDamageSource.ts",
  "utf8",
);
const safetySource = readFileSync(
  "src/game/commandLinkPulseDamageSafety.ts",
  "utf8",
);
const eligibilitySource = readFileSync(
  "src/game/commandLinkPulseTargetEligibility.ts",
  "utf8",
);
const effectSource = readFileSync(
  "src/game/commandLinkCombatEffectContract.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");

test("J5F-D is a pure standalone source projection with no live adoption", () => {
  assert.doesNotMatch(source, /^import\s/m);
  assert.doesNotMatch(source, /EnergySwarmGame/);

  for (const frozenOrLiveSource of [
    safetySource,
    eligibilitySource,
    effectSource,
    gameSource,
  ]) {
    assert.doesNotMatch(
      frozenOrLiveSource,
      /commandLinkPulseTriggerDamageSource/,
    );
  }
});

test("J5F-D supports only direct and splash resolved source kinds", () => {
  assert.match(source, /\| "DIRECT_HIT"/);
  assert.match(source, /\| "SPLASH_HIT"/);
  assert.match(
    source,
    /sourceKind === "DIRECT_HIT" \|\| sourceKind === "SPLASH_HIT"/,
  );
  assert.doesNotMatch(source, /CHAIN_REACTION/);
});

test("J5F-D bounds trigger magnitude by pre-hit source health without tuning", () => {
  assert.match(source, /!Number\.isFinite\(resolvedSourceDamage\)/);
  assert.match(source, /!Number\.isFinite\(sourceHealthBeforeHit\)/);
  assert.match(source, /resolvedSourceDamage <= 0/);
  assert.match(source, /sourceHealthBeforeHit <= 0/);
  assert.match(
    source,
    /effectiveTriggerDamage = Math\.min\(\s*resolvedSourceDamage,\s*sourceHealthBeforeHit,?\s*\)/s,
  );
  assert.match(source, /proposedPulseDamage:\s*effectiveTriggerDamage/);
  assert.match(source, /sourceMode:\s*"EFFECTIVE_TRIGGER_DAMAGE_ONLY"/);
  assert.match(source, /transfersOverkill:\s*false/);

  for (const forbiddenTuning of [
    /\*\s*0\./,
    /\*\s*[2-9]/,
    /\/\s*100/,
    /percentage/i,
    /multiplier/i,
    /radius/i,
    /cadence/i,
  ]) {
    assert.doesNotMatch(source, forbiddenTuning);
  }
});

test("J5F-D owns no live mutation defeat economy lookup scan timing RNG or cap authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /enemiesRef/,
    /EnemyType/,
    /enemyId/i,
    /linkedEnemy/i,
    /\.filter\(/,
    /\.find\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /registerCombatDefeat/,
    /registerCombatResonanceDefeat/,
    /nanoCredits/,
    /dropChance/,
    /isDead\s*=/,
    /\.health\s*[-+*/]?=/,
  ]) {
    assert.doesNotMatch(source, forbidden);
  }

  for (const requiredFalse of [
    "ownsSourceCaptureAuthority",
    "ownsDamageMagnitudeTuning",
    "ownsTargetEligibilityAuthority",
    "ownsHealthMutationAuthority",
    "ownsDefeatAuthority",
    "ownsScoreAuthority",
    "ownsRewardAuthority",
    "ownsDropAuthority",
    "ownsFormationAuthority",
    "ownsSpawnAuthority",
    "ownsEntityCollection",
    "ownsProjectileCollection",
    "ownsClock",
    "ownsRandomness",
    "ownsFullArrayScan",
    "mayLookupEntities",
    "mayMutateEntities",
    "mayMutateGlobalCaps",
    "mayCreateEntities",
    "mayRemoveEntities",
  ]) {
    assert.match(source, new RegExp(`${requiredFalse}: false`));
  }
});

test("frozen J5F-A J5F-B and J5F-C boundaries remain intact", () => {
  assert.match(effectSource, /effectMode:\s*"PROPOSAL_ONLY"/);
  assert.match(effectSource, /appliesDamage:\s*false/);
  assert.match(eligibilitySource, /eligibilityMode:\s*"ELIGIBLE_ONLY"/);
  assert.match(eligibilitySource, /registersDefeat:\s*false/);
  assert.match(safetySource, /damageSafetyMode:\s*"NON_LETHAL_PROJECTION_ONLY"/);
  assert.match(safetySource, /healthFloor:\s*1/);
  assert.match(safetySource, /canKill:\s*false/);
});
