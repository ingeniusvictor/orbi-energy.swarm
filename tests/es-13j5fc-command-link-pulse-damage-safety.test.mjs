import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

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
const bindingSource = readFileSync("src/game/commandLinkBinding.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");
const liveBreakSource = readFileSync(
  "src/game/liveCommandLinkBreakApplication.ts",
  "utf8",
);

test("J5F-C consumes J5F-B eligibility type-only and owns no live adapter", () => {
  assert.match(
    safetySource,
    /import type \{ CommandLinkPulseTargetEligibility \} from "\.\/commandLinkPulseTargetEligibility"/,
  );
  assert.doesNotMatch(safetySource, /EnergySwarmGame/);
  assert.doesNotMatch(safetySource, /resolveCommandLinkPulseTargetEligibility/);

  for (const frozenOrLiveSource of [
    eligibilitySource,
    effectSource,
    bindingSource,
    gameSource,
    typesSource,
    liveBreakSource,
  ]) {
    assert.doesNotMatch(frozenOrLiveSource, /commandLinkPulseDamageSafety/);
  }
});

test("J5F-C requires exact frozen eligibility semantics and bounded linked indices", () => {
  for (const required of [
    /eligibility\.effectId !== "COMMAND_LINK_DISRUPTION_PULSE"/,
    /eligibility\.intent !== "PULSE_LINKED_MEMBERS"/,
    /eligibility\.sourceEffectMode !== "PROPOSAL_ONLY"/,
    /eligibility\.targetRole !== "LINKED_MEMBER"/,
    /eligibility\.eligibilityMode !== "ELIGIBLE_ONLY"/,
    /eligibility\.bindingMode !== "BINDING_ONLY"/,
    /eligibility\.appliesDamage !== false/,
    /eligibility\.killsTarget !== false/,
    /eligibility\.registersDefeat !== false/,
    /eligibility\.awardsScore !== false/,
    /eligibility\.awardsRewards !== false/,
    /eligibility\.spawnsProjectiles !== false/,
    /eligibility\.mutatesFormation !== false/,
    /eligibility\.memberCount === 2/,
    /eligibility\.memberIndex === 1/,
    /eligibility\.memberCount === 3/,
    /eligibility\.memberIndex === 2/,
  ]) {
    assert.match(safetySource, required);
  }
});

test("J5F-C proves a one-HP non-lethal floor without choosing source tuning", () => {
  assert.match(safetySource, /currentHealth < 1/);
  assert.match(safetySource, /maxHealth < 1/);
  assert.match(safetySource, /currentHealth > maxHealth/);
  assert.match(safetySource, /proposedDamage <= 0/);
  assert.match(
    safetySource,
    /maximumNonLethalDamage = Math\.max\(0, currentHealth - 1\)/,
  );
  assert.match(
    safetySource,
    /boundedDamage = Math\.min\(proposedDamage, maximumNonLethalDamage\)/,
  );
  assert.match(
    safetySource,
    /resultingHealth = Math\.max\(1, currentHealth - boundedDamage\)/,
  );
  assert.match(safetySource, /damageSafetyMode:\s*"NON_LETHAL_PROJECTION_ONLY"/);
  assert.match(safetySource, /healthFloor:\s*1/);
  assert.match(safetySource, /canKill:\s*false/);
  assert.match(safetySource, /mutatesHealth:\s*false/);
  assert.match(safetySource, /registersDefeat:\s*false/);
});

test("J5F-C owns no live health defeat reward drop scan timing or cap authority", () => {
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
    /\.health\s*[-+]?=/,
  ]) {
    assert.doesNotMatch(safetySource, forbidden);
  }

  for (const requiredFalse of [
    "ownsTargetEligibilityAuthority",
    "ownsDamageMagnitudeTuning",
    "ownsHealthMutationAuthority",
    "ownsDefeatAuthority",
    "ownsScoreAuthority",
    "ownsRewardAuthority",
    "ownsDropAuthority",
    "ownsMilestoneAuthority",
    "ownsBossDefeatAuthority",
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
    assert.match(safetySource, new RegExp(`${requiredFalse}: false`));
  }
});

test("frozen J5F-A and J5F-B semantic boundaries remain unchanged", () => {
  assert.match(effectSource, /effectMode:\s*"PROPOSAL_ONLY"/);
  assert.match(effectSource, /appliesDamage:\s*false/);
  assert.match(eligibilitySource, /eligibilityMode:\s*"ELIGIBLE_ONLY"/);
  assert.match(eligibilitySource, /appliesDamage:\s*false/);
  assert.match(eligibilitySource, /registersDefeat:\s*false/);
  assert.match(bindingSource, /COMMAND_LINK_CORE_MEMBER_INDEX\s*=\s*0/);
});
