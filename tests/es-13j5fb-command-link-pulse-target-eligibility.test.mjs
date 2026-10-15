import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

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
const formationSource = readFileSync(
  "src/game/liveEnemyFormationDirector.ts",
  "utf8",
);
const prioritySource = readFileSync(
  "src/game/priorityTargetContract.ts",
  "utf8",
);
const presentationSource = readFileSync(
  "src/game/liveCommandCorePresentation.ts",
  "utf8",
);
const breakSource = readFileSync(
  "src/game/commandLinkBreakResolution.ts",
  "utf8",
);
const liveBreakSource = readFileSync(
  "src/game/liveCommandLinkBreakApplication.ts",
  "utf8",
);

test("J5F-B composes frozen J5F-A projection with current J5B binding", () => {
  assert.match(
    eligibilitySource,
    /import type[\s\S]*CommandLinkCombatEffectProjection[\s\S]*from "\.\/commandLinkCombatEffectContract"/,
  );
  assert.match(
    eligibilitySource,
    /resolveCommandLinkBinding[\s\S]*from "\.\/commandLinkBinding"/,
  );
  assert.match(eligibilitySource, /binding\.memberRole !== "LINKED_MEMBER"/);
  assert.match(eligibilitySource, /binding\.groupId !== projection\.groupId/);
  assert.match(eligibilitySource, /isLiving !== true/);
});

test("J5F-B requires exact J5F-A proposal semantics and zero-effect facts", () => {
  for (const required of [
    /projection\.profileId === "COMMAND_CORE"/,
    /projection\.signal === "COMMAND_LINK_BROKEN"/,
    /projection\.sourceIntent === "DETACH_LINKED_MEMBERS"/,
    /projection\.effectId === "COMMAND_LINK_DISRUPTION_PULSE"/,
    /projection\.intent === "PULSE_LINKED_MEMBERS"/,
    /projection\.effectMode === "PROPOSAL_ONLY"/,
    /projection\.targetRole === "LINKED_MEMBER"/,
    /projection\.requiresCurrentFormationMatch === true/,
    /projection\.requiresLivingTarget === true/,
    /projection\.appliesDamage === false/,
    /projection\.killsTargets === false/,
    /projection\.awardsScore === false/,
    /projection\.awardsRewards === false/,
    /projection\.spawnsProjectiles === false/,
    /projection\.mutatesFormation === false/,
  ]) {
    assert.match(eligibilitySource, required);
  }
});

test("J5F-B accepts only exact bounded target shapes for current supported groups", () => {
  assert.match(eligibilitySource, /memberCount === 2/);
  assert.match(eligibilitySource, /targetMemberIndices\.length === 1/);
  assert.match(eligibilitySource, /targetMemberIndices\[0\] === 1/);
  assert.match(eligibilitySource, /memberIndex === 1/);
  assert.match(eligibilitySource, /targetMemberIndices\.length === 2/);
  assert.match(eligibilitySource, /targetMemberIndices\[1\] === 2/);
  assert.match(eligibilitySource, /memberIndex === 1 \|\| memberIndex === 2/);
  assert.match(eligibilitySource, /eligibilityMode:\s*"ELIGIBLE_ONLY"/);
});

test("J5F-B owns no live lookup scan health combat economy timing or cap authority", () => {
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
    /health\s*[-+]?=/,
    /isDead\s*=/,
    /registerCombatDefeat/,
    /registerCombatResonanceDefeat/,
    /nanoCredits/,
  ]) {
    assert.doesNotMatch(eligibilitySource, forbidden);
  }

  for (const requiredFalse of [
    "ownsCombatEffectProposalAuthority",
    "ownsCommandLinkBindingAuthority",
    "ownsLivingStateAuthority",
    "ownsFormationAuthority",
    "ownsSpawnAuthority",
    "ownsEntityCollection",
    "ownsProjectileCollection",
    "ownsDamageAuthority",
    "ownsDefeatAuthority",
    "ownsScoreAuthority",
    "ownsRewardAuthority",
    "ownsClock",
    "ownsRandomness",
    "ownsFullArrayScan",
    "mayLookupEntities",
    "mayMutateEntities",
    "mayMutateGlobalCaps",
    "mayCreateEntities",
    "mayRemoveEntities",
  ]) {
    assert.match(eligibilitySource, new RegExp(`${requiredFalse}: false`));
  }
});

test("J5F-B does not acquire live runtime or frozen prerequisite adoption", () => {
  assert.doesNotMatch(eligibilitySource, /EnergySwarmGame/);

  for (const frozenOrLiveSource of [
    gameSource,
    typesSource,
    formationSource,
    prioritySource,
    bindingSource,
    presentationSource,
    breakSource,
    liveBreakSource,
    effectSource,
  ]) {
    assert.doesNotMatch(frozenOrLiveSource, /commandLinkPulseTargetEligibility/);
  }
});

test("frozen J5F-A and J5B semantics remain exact", () => {
  assert.match(effectSource, /effectId:\s*"COMMAND_LINK_DISRUPTION_PULSE"/);
  assert.match(effectSource, /intent:\s*"PULSE_LINKED_MEMBERS"/);
  assert.match(effectSource, /effectMode:\s*"PROPOSAL_ONLY"/);
  assert.match(effectSource, /targetRole:\s*"LINKED_MEMBER"/);
  assert.match(bindingSource, /COMMAND_LINK_CORE_MEMBER_INDEX\s*=\s*0/);
  assert.match(
    bindingSource,
    /COMMAND_LINK_SUPPORTED_MEMBER_COUNTS\s*=\s*Object\.freeze\(\[2, 3\]/,
  );
  assert.match(bindingSource, /input\.memberIndex === COMMAND_LINK_CORE_MEMBER_INDEX/);
  assert.match(bindingSource, /:\s*"LINKED_MEMBER"/);
});
