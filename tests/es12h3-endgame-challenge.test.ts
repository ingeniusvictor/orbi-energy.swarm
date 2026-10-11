import assert from "node:assert/strict";
import test from "node:test";
import { FOTON_DYSON_HALO_RINGS, getUnlockedDysonHaloRingCount } from "../src/game/fotonDysonHalo.ts";
import { calculateSwarmOffset, FORMATIONS } from "../src/game/formations.ts";
import { FormationType, EnemyType } from "../src/game/types.ts";
import { buildCertifiedInfiniteSectorPlan, NEUTRAL_INFINITE_RUN_CONTEXT } from "../src/game/infinitePlanBuilder.ts";
import { createInfiniteRuntimeWaveDescriptor } from "../src/game/runtimeWaveDescriptor.ts";
import { getRuntimeEnemyEvolutionPolicy, EVOLVED_ENEMY_VARIANTS } from "../src/game/runtimeEnemyEvolution.ts";
import type { InfiniteSessionState } from "../src/game/infiniteSession.ts";
import { generateInfiniteSectorRecipe } from "../src/game/infiniteSectorDirector.ts";

const dot=(a:readonly number[],b:readonly number[])=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const len=(a:readonly number[])=>Math.hypot(a[0],a[1],a[2]);

test("Dyson normals form a real symmetric three-plane triad",()=>{
  assert.equal(FOTON_DYSON_HALO_RINGS.length,3);
  for(const ring of FOTON_DYSON_HALO_RINGS) assert.ok(Math.abs(len(ring.planeNormal)-1)<1e-6);
  for(let i=0;i<3;i++) for(let j=i+1;j<3;j++) assert.ok(Math.abs(dot(FOTON_DYSON_HALO_RINGS[i].planeNormal,FOTON_DYSON_HALO_RINGS[j].planeNormal)+0.125)<1e-5);
  assert.deepEqual([0,9,10,19,20,50].map(getUnlockedDysonHaloRingCount),[1,1,2,2,3,3]);
});

test("Star Matrix and X-Guard remain bounded for large swarms",()=>{
  assert.equal(FORMATIONS[FormationType.CIRCLE].name,"Star Matrix");
  assert.equal(FORMATIONS[FormationType.V_SHAPE].name,"X-Guard");
  for(const total of [30,48,64]) for(const formation of [FormationType.CIRCLE,FormationType.V_SHAPE]) {
    let max=0; for(let i=0;i<total;i++){const o=calculateSwarmOffset(formation,i,total,12345,0.7); max=Math.max(max,Math.hypot(o.x,o.y));}
    assert.ok(max<=140, "formation="+formation+" total="+total+" radius="+max);
  }
});

const descriptorFor=(sector:number)=>{const plan=buildCertifiedInfiniteSectorPlan(sector,"h3",NEUTRAL_INFINITE_RUN_CONTEXT); const session:InfiniteSessionState={kind:"INFINITE_SESSION",sessionId:"h3:"+sector,seed:"h3",status:"ACTIVE",currentSector:sector,currentWaveNumber:1,sectorsCompleted:sector-11,wavesCompleted:0,context:{...plan.effectiveRecipe.context},currentPlan:plan}; return createInfiniteRuntimeWaveDescriptor(session);};

test("Infinite challenge begins evolving enemies from Sector 11",()=>{
  const p=getRuntimeEnemyEvolutionPolicy(descriptorFor(11));
  assert.equal(p.enabled,true); assert.equal(p.evolutionChance,0.08); assert.equal(p.maxConcurrentEvolvedEnemies,1);
  assert.ok(p.eligibleEnemyTypes.includes(EnemyType.BLACKOUT_ELITE));
  assert.equal(EVOLVED_ENEMY_VARIANTS[EnemyType.BLACKOUT_ELITE]?.id,"OVERDRIVE_ELITE");
});

test("Sector 11 pressure is higher but remains bounded",()=>{
  const r=generateInfiniteSectorRecipe(11,"h3-pressure");
  assert.ok(r.maxConcurrentEnemies>=18);
  assert.ok(r.spawnIntervalFrames<=92);
  assert.ok(r.aggressionMultiplier>=1.08);
  assert.ok(r.projectileDensityMultiplier>=1.08);
  assert.ok(r.fairness.projectileBudget>=90);
});
