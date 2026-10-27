import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {resolveSolfernaxEncounter,SOLFERNAX_ENCOUNTER_ID}
  from "../../src/game/pyraSolfernax";
import {getBossChassisProfile} from "../../src/game/bossChassis";
import {createCampaignRuntimeState,resolveRuntimeWaveDescriptor}
  from "../../src/game/runtimeProgressionRouter";

test("PYRA-07A: native Campaign wave ten resolves unique Solfernax 2200 HP",()=>{
  const runtime=createCampaignRuntimeState(10);
  assert.equal(runtime.mode,"CAMPAIGN");
  const desc=resolveRuntimeWaveDescriptor(runtime);
  assert.equal(desc.completionPolicy.type,"BOSS_DEFEAT");
  assert.equal(resolveSolfernaxEncounter(true,desc),SOLFERNAX_ENCOUNTER_ID);
  assert.equal(getBossChassisProfile("PYRA_SOLFERNAX").baseHealth,2200);
});
test("PYRA-07A: independent E2E build must gate wave ten, no new spawner",()=>{
  const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",
    import.meta.url),"utf8");
  assert.match(game,/import\.meta\.env\.MODE === "pyra-e2e"/);
  assert.match(game,/get\("pyra-e2e-boss"\) === "1"/);
  assert.match(game,/currentWaveRef\.current = pyraCiBossEntry \? BOSS_WAVE_NUMBER : 1/);
  assert.match(game,/runtimeProgressionRef\.current =\s*createCampaignRuntimeState\(currentWaveRef\.current\)/);
  assert.match(game,/canvas\.dataset\.pyraE2eBossId = liveBoss\?\.id/);
  assert.doesNotMatch(game,/window\.pyraE2e|window\.spawnSolfernax/);
});
