import assert from "node:assert/strict";
import test from "node:test";
import {
 ORBI_MAX_EVOLUTION_LEVEL, ORBI_FINAL_FORM_TOTAL_ACQUISITIONS,
 EVO8_COLLECTIBLE_ENERGIES, acquisitionsForLevel, coresUntilNextLevel,
 getEvo8VisualStage, getEvo8WingCount, createOrbiEvolutionProgress,
 applyMatchingEnergyCore, normalizeOrbiEvolutionProgress,
} from "../src/game/orbiEvolution.ts";

test("ENERGY stays outside collectibles; FOTON is a collectible solar identity",()=>{
 assert.equal(EVO8_COLLECTIBLE_ENERGIES.length,9);
 assert.ok(EVO8_COLLECTIBLE_ENERGIES.includes("FOTON"));
 assert.ok(!EVO8_COLLECTIBLE_ENERGIES.includes("GAIA"));
 assert.ok(!EVO8_COLLECTIBLE_ENERGIES.includes("ENERGY" as never));
});

test("EVO8 requires 29 acquisitions including first; no E9 exists",()=>{
 assert.equal(ORBI_MAX_EVOLUTION_LEVEL,8);
 assert.equal(ORBI_FINAL_FORM_TOTAL_ACQUISITIONS,29);
 assert.deepEqual(Array.from({length:8},(_,i)=>acquisitionsForLevel(i+1)),[1,2,4,7,11,16,22,29]);
 let state=createOrbiEvolutionProgress("HYDRO");
 for(let i=2;i<=29;i++){
   const update=applyMatchingEnergyCore(state,"HYDRO");
   state=update.progress;
   assert.ok(state.level>=1&&state.level<=8);
 }
 assert.equal(state.level,8);
 assert.equal(coresUntilNextLevel(state),0);
 for(let i=0;i<200;i++)state=applyMatchingEnergyCore(state,"HYDRO").progress;
 assert.equal(state.level,8);
 assert.equal(state.matchingCoresAtLevel,0);
});

test("wrong affinity cannot evolve any energy even when swarm is full",()=>{
 const before=createOrbiEvolutionProgress("FOTON");
 const wrong=applyMatchingEnergyCore(before,"MAGNE");
 assert.deepEqual(wrong.progress,before);
 assert.equal(wrong.matched,false);
 assert.equal(wrong.levelUp,false);
});

test("four premium body stages change at E1/E3/E5/E8, with E6/E7/E8 wings",()=>{
 const art=Array.from({length:8},(_,i)=>getEvo8VisualStage(i+1));
 const wings=Array.from({length:8},(_,i)=>getEvo8WingCount(i+1));
 assert.deepEqual(art,[1,1,2,2,3,3,3,4]);
 assert.deepEqual(wings,[0,0,0,0,0,2,4,6]);
});

test("every collectible obeys triangular requirements, strictly independently",()=>{
 for(const energy of EVO8_COLLECTIBLE_ENERGIES){
  let s=createOrbiEvolutionProgress(energy);
  for(let level=1;level<8;level++){
    for(let pickup=1;pickup<=level;pickup++){
      const before=s.level;
      const update=applyMatchingEnergyCore(s,energy);
      s=update.progress;
      assert.equal(s.level, pickup===level ? before+1 : before);
      if(pickup===level)assert.equal(s.matchingCoresAtLevel,0);
    }
  }
  assert.equal(s.level,8,`maximum for ${energy}`);
 }
});

test("legacy invalid levels/partials normalize safely without mutating caller data",()=>{
 const raw={energyId:"TERMO" as const,level:999 as 8,matchingCoresAtLevel:999};
 const n=normalizeOrbiEvolutionProgress(raw);
 assert.equal(n.level,8);
 assert.equal(n.matchingCoresAtLevel,0);
 assert.equal(raw.matchingCoresAtLevel,999);
});
