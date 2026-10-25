import {
  ENEMY_SPATIAL_CELL_SIZE,
  buildSpatialIndex,
  findAllCollidingSpatialItems,
  relocateSpatialIndexEntry,
} from "./spatialIndex";
import { EnemyType, type Enemy, type Projectile } from "./types";
import { isRouteWave2EliteQaEnemy } from "./routeWave2EliteQa";

/** One bounded QA impact: same canonical Projectile metadata and spatial
 * queries as the live engine, never game score, bosses, Convergence or RNG.
 * Call only on cloned enemy objects, after resolving the direct hit. */
export interface RouteImpactFxResult {
  readonly splashHits:number;
  readonly slows:number;
  readonly pushes:number;
  readonly pulls:number;
  readonly splashKills:readonly Enemy[];
}
export const emptyRouteImpactFxResult=():RouteImpactFxResult=>({
  splashHits:0,slows:0,pushes:0,pulls:0,splashKills:[],
});

/**
 * Matches EnergySwarmGame lines ~6992-7075 for ordinary CRAWLER targets:
 * base push = 5.5; slow timer max duration; magnet pull towards impact at
 * projectile metadata radius and strength; splash deals directDamage *
 * splashDamageMultiplier to all other living targets in spatial radius.
 *
 * The full engine also has enemy signature behavior multipliers and
 * boss/Convergence checks; this QA only allows plain CRAWLER targets,
 * so we fail CLOSED rather than claiming parity for other enemy types.
 */
export function applyRouteCanonicalImpactEffects(
  shot:Projectile,
  victim:Enemy,
  enemies:Enemy[],
  allowOrdinaryParasites=false,
  allowQaElites=false,
):RouteImpactFxResult {
  if(!enemies.includes(victim)||enemies.some(e=>
      e.isBoss||e.evolvedVariantId||e.enemyFormation||
      (!allowQaElites&&isRouteWave2EliteQaEnemy(e))||
      (e.type!==EnemyType.CRAWLER&&
       !(allowOrdinaryParasites&&e.type===EnemyType.PARASITE)))||
     shot.convergenceTargetId||shot.fromPlayer!==true)
    throw new Error("Uncertified route impact target or Convergence");
  const metadata=[
    shot.x,shot.y,shot.vx,shot.vy,shot.damage,
    shot.pushMultiplier??1,shot.slowDurationMs??0,
    shot.magneticPullRadius??0,shot.magneticPullStrength??0,
    shot.splashRadius??0,shot.splashDamageMultiplier??0,
  ];
  if(metadata.some(v=>!Number.isFinite(v)) ||
    shot.damage<0 || (shot.pushMultiplier??1)<0 ||
    (shot.slowDurationMs??0)<0 ||(shot.magneticPullRadius??0)<0||
    (shot.magneticPullStrength??0)<0||(shot.splashRadius??0)<0||
    (shot.splashDamageMultiplier??0)<0)
    throw new RangeError("Invalid canonical projectile effect metadata");
  const index=buildSpatialIndex(enemies,{
    cellSize:ENEMY_SPATIAL_CELL_SIZE,getX:e=>e.x,getY:e=>e.y,
    getRadius:e=>e.size,include:e=>!e.isDead&&e.health>0,
  });
  let pushes=0,slows=0,pulls=0,splashHits=0;
  const splashKills:Enemy[]=[];
  // Direct-hit knockback, including CRAWLER's canonical 5.5 base strength.
  const angle=Math.atan2(shot.vy,shot.vx);
  const basePush=victim.type===EnemyType.CRAWLER?5.5:
    shot.isCriticalShot?4:1.8;
  const strength=basePush*(shot.pushMultiplier??1);
  if(strength>0){
    victim.x+=Math.cos(angle)*strength;
    victim.y+=Math.sin(angle)*strength;
    pushes++;
    const order=enemies.indexOf(victim);
    relocateSpatialIndexEntry(index,order,victim.x,victim.y,victim.size);
  }
  if((shot.slowDurationMs??0)>0){
    victim.slowTimer=Math.max(victim.slowTimer??0,shot.slowDurationMs??0);
    slows++;
  }
  if((shot.magneticPullRadius??0)>0&&(shot.magneticPullStrength??0)>0){
    const affected=findAllCollidingSpatialItems(
      index,shot.x,shot.y,shot.magneticPullRadius??0,
      e=>e!==victim&&!e.isDead,
    );
    for(const {item,order} of affected.entries){
      const dx=shot.x-item.x,dy=shot.y-item.y;
      const length=Math.hypot(dx,dy)||1;
      const distance=shot.magneticPullStrength??0;
      item.x+=dx/length*distance;
      item.y+=dy/length*distance;
      relocateSpatialIndexEntry(index,order,item.x,item.y,item.size);
      pulls++;
    }
  }
  if((shot.splashRadius??0)>0&&(shot.splashDamageMultiplier??0)>0){
    const hits=findAllCollidingSpatialItems(index,
      shot.x,shot.y,shot.splashRadius??0,
      e=>e!==victim&&!e.isDead,
    );
    for(const {item} of hits.entries){
      const damage=shot.damage*(shot.splashDamageMultiplier??0);
      item.health=Math.max(0,item.health-damage);
      item.flashTicks=4;
      splashHits++;
      if(item.health===0){
        item.isDead=true;
        splashKills.push(item);
      }
    }
  }
  return {splashHits,slows,pushes,pulls,splashKills};
}
