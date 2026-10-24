import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read=(file)=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const canvas=read("src/game/EnergySwarmCanvas.tsx");
const gaia=read("src/game/gaiaEvolution.ts");
const doctrine=read("src/game/evo8SwarmDoctrine.ts");

test("EV-F06 uses EVO8 matching core before recruiting duplicate followers",()=>{
 const start=game.indexOf("const addSwarmMember =");
 const end=game.indexOf("const baseName = energyDefinition.displayName",start);
 assert.ok(start>0&&end>start);
 const section=game.slice(start,end);
 assert.match(section,/matchingFollowers\s*=\s*swarmRef\.current/);
 assert.match(section,/member\.energyId === energyDefinition\.id/);
 assert.match(section,/applyMatchingEnergyCore\(/);
 assert.match(section,/targetOrbi\.matchingCoresAtLevel\s*=/);
 assert.ok(section.indexOf("applyMatchingEnergyCore(")<section.indexOf("regularSwarmCount >= capacityLimit"));
 assert.doesNotMatch(section,/xpGain\s*=\s*8/);
 assert.doesNotMatch(section,/Math\.floor\(newXp\s*\/\s*4\)/);
 assert.doesNotMatch(section,/Fallback if no member has this affinity/);
 assert.match(section,/SIN SLOT/);
});

test("EV-F06 live capacity is delegated to E5/E8, not the historical level-10 module",()=>{
 assert.match(game,/createEvo8SwarmDoctrine as createSwarmDoctrineState/);
 assert.match(game,/getEvo8SwarmCapacity as getSwarmDoctrineCapacity/);
 assert.match(game,/promoteEvo8Founder as registerSwarmDoctrineLevel/);
 assert.match(game,/registerEvo8Founder as registerSwarmDoctrineMember/);
 assert.match(doctrine,/id===ORBI_PROTAGONIST_ID/);
 assert.match(game,/gaiaMemberRef\.current \? 0 : 1/);
});

test("EV-F06 GAIA requires nine distinct energies and triangular cycle ranking",()=>{
 assert.match(gaia,/getGaiaLevelForCompletedCycles\(current\.completedCycles \+ 1\)/);
 assert.match(gaia,/ORBI_MAX_EVOLUTION_LEVEL/);
 assert.match(game,/previousGaiaLevel = gaiaEvolutionRef\.current\.gaiaLevel/);
 assert.match(game,/GAIA ESSENCE/);
 assert.doesNotMatch(gaia,/gaiaLevel:\s*current\.gaiaLevel \+ 1/);
});

test("EVO8 full body 1,3,5,8 and wings 6,7,8 fit ENERGY 75 percent",()=>{
 assert.match(canvas,/getEvo8WingCount\(member\.level\)/);
 assert.match(canvas,/const tipRadius = 14/);
 assert.match(canvas,/const r = Math\.min\(12\.5, member\.size \+ localPulse\)/);
 assert.match(canvas,/Math\.min\(12\.5, member\.size\)/);
 assert.match(game,/targetOrbi\.evolutionStage = getEvo8VisualStage\(targetOrbi\.level\)/);
 assert.match(game,/targetOrbi\.size = Math\.min\(10\.5,/);
});

test("all modes retain their shared acquisition and Gaia hooks",()=>{
 assert.match(game,/trackGaiaEnergyAcquisition\(energyDefinition\.id\)/);
 assert.match(game,/res\.type === "ORBI"/);
 assert.match(game,/addSwarmMember\(\s*res\.orbiAffinity/);
 assert.match(game,/scoreAttackActivationRef\.current/);
});
