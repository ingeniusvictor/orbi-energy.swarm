import assert from "node:assert/strict";
import test from "node:test";
import {
 createEvo8SwarmDoctrine, registerEvo8Founder, promoteEvo8Founder,
 getEvo8SwarmCapacity,projectEvo8Doctrine,
 EVO8_ABSOLUTE_SWARM_CAP, EVO8_VETERAN_LEVEL, EVO8_ELITE_LEVEL,
} from "../src/game/evo8SwarmDoctrine.ts";
test("ten founders start at 10 capacity, grow to 20 at E5 and 30 at E8",()=>{
 let state=createEvo8SwarmDoctrine();
 const founders=["FOTON","HYDRO","AERO","TERMO","MAGNE","ATON","KINETRIX","H2NOVA","QUANTUM","GAIA"];
 assert.equal(getEvo8SwarmCapacity(state),10);
 for(const id of founders)state=registerEvo8Founder(state,id,1);
 assert.equal(state.founderIds.length,10);
 assert.equal(getEvo8SwarmCapacity(state),10);
 for(const id of founders)state=promoteEvo8Founder(state,id,5);
 assert.equal(getEvo8SwarmCapacity(state),20);
 for(const id of founders)state=promoteEvo8Founder(state,id,8);
 assert.equal(getEvo8SwarmCapacity(state),30);
 assert.equal(projectEvo8Doctrine(state).nextMilestone,null);
 assert.equal(EVO8_ABSOLUTE_SWARM_CAP,30);
 assert.equal(EVO8_VETERAN_LEVEL,5);
 assert.equal(EVO8_ELITE_LEVEL,8);
});
test("no E9/E10 gate, credit only verified founder identities; credits stay monotonic",()=>{
 let state=createEvo8SwarmDoctrine();
 state=registerEvo8Founder(state,"HYDRO",8);
 assert.equal(getEvo8SwarmCapacity(state),12);
 state=promoteEvo8Founder(state,"AERO",8);
 assert.equal(getEvo8SwarmCapacity(state),12);
 state=promoteEvo8Founder(state,"HYDRO",1);
 assert.equal(getEvo8SwarmCapacity(state),12);
 state=registerEvo8Founder(state,"HYDRO",8);
 assert.equal(state.founderIds.length,1);
 state=promoteEvo8Founder(state,"HYDRO",500);
 assert.equal(getEvo8SwarmCapacity(state),12);
});
test("ENERGY protagonist is not a founder; GAIA consumes one founded slot",()=>{
 let state=createEvo8SwarmDoctrine();
 for(const id of ["FOTON","HYDRO","AERO","TERMO","MAGNE","ATON","KINETRIX","H2NOVA","QUANTUM","GAIA"]){
   state=registerEvo8Founder(state,id,1);
 }
 const noExtra=registerEvo8Founder(state,"ENERGY",8);
 assert.deepEqual(noExtra,state);
 assert.equal(state.founderIds.includes("GAIA"),true);
 assert.equal(state.founderIds.includes("ENERGY"),false);
});

test("neutral ENERGY cannot claim founder slot or E5/E8 credit even before slots fill",()=>{
 let state=createEvo8SwarmDoctrine();
 const untouched=registerEvo8Founder(state,"ENERGY",8);
 assert.deepEqual(untouched,state);
 assert.equal(getEvo8SwarmCapacity(untouched),10);
 state=registerEvo8Founder(state,"HYDRO",1);
 assert.deepEqual(registerEvo8Founder(state,"ENERGY",5),state);
 assert.deepEqual(promoteEvo8Founder(state,"ENERGY",8),state);
 assert.equal(state.founderIds.length,1);
 assert.equal(state.veteranFounderIds.length,0);
 assert.equal(state.eliteFounderIds.length,0);
 // Legacy accidentally containing ENERGY must not be able to earn a credit.
 const legacy={...state,founderIds:["ENERGY","HYDRO"]};
 assert.deepEqual(promoteEvo8Founder(legacy,"ENERGY",8),legacy);
});
