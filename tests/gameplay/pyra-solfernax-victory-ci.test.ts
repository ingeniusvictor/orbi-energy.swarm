import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {ORBI_COLLECTIBLE_ENERGY_IDS} from "../../src/game/orbiEnergyCanon";
import {createCampaignRuntimeState,resolveRuntimeWaveDescriptor}
  from "../../src/game/runtimeProgressionRouter";
import {resolveSolfernaxEncounter,SOLFERNAX_ENCOUNTER_ID}
  from "../../src/game/pyraSolfernax";

test("PYRA-07A-2: E2E-only victory fixture replays original recruit API",()=>{
 const s=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const block=s.split("PYRA-07A-2: E2E-only late-campaign fixture.")[1]
  ?.split("// Reset run-local telemetry")[0]??"";
 assert.ok(block.includes('import.meta.env.MODE === "pyra-e2e"'));
 assert.ok(block.includes('get("pyra-e2e-boss") === "1"'));
 assert.ok(block.includes('get("pyra-e2e-victory") === "1"'));
 assert.ok(block.includes("addSwarmMember(undefined, undefined, energyId)"));
 for(const forbidden of ["bossRef.current.health =","boss.health=",
    "projectilesRef.current.push","bossDefeatedSequenceActiveRef.current =",
    "runCommitLedgerRef.current ="]){
  assert.equal(block.includes(forbidden),false,forbidden);
 }
 assert.equal(ORBI_COLLECTIBLE_ENERGY_IDS.length,9);
 const d=resolveRuntimeWaveDescriptor(createCampaignRuntimeState(10));
 assert.equal(resolveSolfernaxEncounter(true,d),SOLFERNAX_ENCOUNTER_ID);
});
test("PYRA-07A-2: checkpoint must use the existing idempotent ledger",()=>{
 const persistence=readFileSync(new URL("../../src/game/runPersistence.ts",import.meta.url),"utf8");
 assert.match(persistence,/!nextLedger.campaignVictoryCommitted/);
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 assert.match(game,/enterInfiniteAfterCampaignVictory\(\)/);
 assert.match(game,/String\(runCommitLedgerRef\.current\.campaignVictoryCommitted\)/);
 const d=resolveRuntimeWaveDescriptor(createCampaignRuntimeState(10));
 assert.equal(d.completionPolicy.type,"BOSS_DEFEAT");
});
