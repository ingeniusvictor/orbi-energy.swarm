import type { Enemy } from "./types";
import { EnemyType } from "./types";
import { createCampaignRuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

/** UX15-C3B-9: the live random-elite contract is HP ×1.8, size ×1.4,
 * rose tint. It does NOT become BLACKOUT_ELITE or PHASE_PARASITE.
 * A deterministic QA roll only substitutes for Math.random(), and never
 * claims to reproduce production outcomes or mutate production seed.
 */
export const ROUTE_WAVE2_ELITE_QA_PREFIX="route-wave2-elite-";
export const ROUTE_ELITE_HP_MULTIPLIER=1.8;
export const ROUTE_ELITE_SIZE_MULTIPLIER=1.4;
export const ROUTE_ELITE_TINT="#f43f5e";
export function routeWave2EliteQaRoll(ordinal:number):number {
 if(!Number.isSafeInteger(ordinal)||ordinal<0)
   throw new RangeError("Invalid QA elite roll ordinal");
 // Exact one elite sample at ordinal six of the 18 budgeted Wave2 spawns.
 // The descriptor's probability is the threshold, NOT the count of elites.
 return ((ordinal*7+18)%20)/20;
}
export function isRouteWave2EliteQaEnemy(e:Enemy):boolean {
 const parasite=e.type===EnemyType.PARASITE;
 const crawler=e.type===EnemyType.CRAWLER;
 return /^route-wave2-elite-(?:0|[1-9][0-9]*)$/.test(e.id)&&
   (parasite||crawler)&&!e.isBoss&&!e.evolvedVariantId&&
   !e.enemyFormation&&!e.milestoneKind&&
   e.size===(parasite?8:10)*ROUTE_ELITE_SIZE_MULTIPLIER&&
   e.color===ROUTE_ELITE_TINT&&
   Number.isFinite(e.maxHealth)&&e.maxHealth>0;
}
export function adoptWave2EliteQa(
 base:Enemy,ordinal:number,eliteChance:number,
):{enemy:Enemy;roll:number;elite:boolean}{
 if(!Number.isFinite(eliteChance)||eliteChance<0||eliteChance>.75)
   throw new RangeError("Invalid descriptor elite chance");
 if(base.isBoss||base.evolvedVariantId||base.enemyFormation||
    base.milestoneKind||!["CRAWLER","PARASITE"].includes(base.type)||
    base.id!==`route-wave2-${ordinal}`)
   throw new Error("Uncertified random elite source");
 const roll=routeWave2EliteQaRoll(ordinal);
 if(roll>=eliteChance)return {enemy:base,roll,elite:false};
 const enemy:Enemy={...base,id:`${ROUTE_WAVE2_ELITE_QA_PREFIX}${ordinal}`,
   health:base.health*ROUTE_ELITE_HP_MULTIPLIER,
   maxHealth:base.maxHealth*ROUTE_ELITE_HP_MULTIPLIER,
   size:base.size*ROUTE_ELITE_SIZE_MULTIPLIER,color:ROUTE_ELITE_TINT};
 if(!isRouteWave2EliteQaEnemy(enemy))
   throw new Error("Uncertified QA elite output");
 return {enemy,roll,elite:true};
}
export interface RouteWave3Preflight {
 readonly name:string;
 readonly composition:readonly EnemyType[];
 readonly budget:number;
 readonly concurrentCap:number;
 readonly eliteChance:number;
 readonly certifiedForSpawn:false;
}
export function inspectRouteWave3PreflightQa():RouteWave3Preflight {
 const d=createCampaignRuntimeWaveDescriptor(3);
 if(d.sourceMode!=="CAMPAIGN"||d.waveNumber!==3||
    d.source.campaignWaveId!=="drone_lock"||
    d.spawn.enemyComposition.length!==2||
    d.spawn.enemyComposition[0]!==EnemyType.DRONE||
    d.spawn.enemyComposition[1]!==EnemyType.CRAWLER||
    d.milestone!==null)
   throw new Error("Wave3 Drone Lock contract differs from reviewed preflight");
 return {
   name:d.display.displayName,composition:[...d.spawn.enemyComposition],
   budget:d.spawn.enemyBudget,concurrentCap:d.spawn.maxConcurrentEnemies,
   eliteChance:d.spawn.eliteChance,certifiedForSpawn:false,
 };
}
