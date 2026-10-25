import { FORMATIONS } from "./formations";
import { getGaiaCombatScale } from "./gaiaEvolution";
import { ORBI_ENERGY_CANON } from "./orbiEnergyCanon";
import {
  getFallbackAttackSignatureForAffinity,
  getOrbiAttackProfile,
} from "./orbiAttackProfiles";
import {
  ENEMY_SPATIAL_CELL_SIZE,
  buildSpatialIndex,
  findNearestSpatialItem,
} from "./spatialIndex";
import { FormationType, type OrbiMember, type Projectile } from "./types";
import type { RouteQaEncounter } from "./routePhysicalQaEncounter";
import { ROUTE_QA_PROJECTILE_CAP } from "./routeDynamicEncounter";

/**
 * C3B-3: isolated route QA adapter built from exactly the same immutable
 * attack profiles, six formations, spatial index and canonical energy
 * definitions as EnergySwarmGame. This is NOT a new weapon balance table.
 */
export const ROUTE_ORBI_BASE_SPEED_PER_FRAME=4.5;
export const ROUTE_ORBI_FRAME_MS=16.6;
export const ROUTE_ORBI_BASE_DAMAGE=4;
export const ROUTE_ORBI_BASE_RANGE=300;

export interface RouteOrbiWeaponsQaState {
  readonly projectilesFired:number;
  readonly volleys:number;
  readonly targetsAcquired:number;
  readonly criticalShots:number;
  readonly echoShots:number;
  readonly supportRestored:number;
  readonly nextShotOrdinal:number;
}

export function createRouteOrbiWeaponsQaState():RouteOrbiWeaponsQaState {
  return {
    projectilesFired:0,volleys:0,targetsAcquired:0,
    criticalShots:0,echoShots:0,supportRestored:0,nextShotOrdinal:0,
  };
}

/** 30 authentic ORBI member objects representing the 10 canonical energy
 * identities three times, instead of a fictitious all-FOTON test roster.
 * Does not recruit anything in a normal game session. */
export function attachCanonicalQaWeapons(
  swarm:readonly OrbiMember[],
):OrbiMember[] {
  return swarm.map((member,i)=>{
    const definition=ORBI_ENERGY_CANON[i%ORBI_ENERGY_CANON.length];
    return {
      ...member,
      name:definition.displayName,
      energyId:definition.id,
      affinity:definition.affinity,
      combatRole:definition.combatRole,
      attackSignature:definition.attackSignature,
      color:definition.color,
      shootCooldown:0,
    };
  });
}

export interface RouteOrbiWeaponsQaStep {
  encounter:RouteQaEncounter;
  weapons:RouteOrbiWeaponsQaState;
  restoredShield:number;
}

/**
 * Select the nearest live enemy per shooter using the real spatialIndex.
 * Build index once for all ORBI; never reuse across origin epochs.
 * Preserve per-member cooldown and the original profile velocity/damage
 * formulas (frame velocity converted to physical units/second because this
 * QA engine advances projectiles in seconds, unlike legacy per-frame).
 *
 * Criticals are deterministic QA hash rolls, NOT production RNG.
 * All 10 canonical projectile metadata profiles are carried unchanged.
 * Only direct-hit damage is enabled (legacy advanced splash, pull, slow,
 * push, fusion and player reward authority are deliberately NOT claimed).
 */
export function stepRouteOrbiWeaponsQa(
  encounter:RouteQaEncounter,
  previous:RouteOrbiWeaponsQaState,
  deltaMs:number,
  formation:FormationType=FormationType.LINE,
):RouteOrbiWeaponsQaStep {
  if(!Number.isFinite(deltaMs)||deltaMs<0||deltaMs>50+1e-7)
    throw new RangeError("Invalid ORBI route weapons tick");
  if(deltaMs===0)return {encounter,weapons:previous,restoredShield:0};
  if(encounter.boss!==null||encounter.architectQaBoss!==null||
     encounter.hazardZones.length>0||
     encounter.enemies.some(e=>e.isBoss)){
    throw new Error("ORBI route weapons denied for uncertified boss/hazard");
  }
  const index=buildSpatialIndex(encounter.enemies,{
    cellSize:ENEMY_SPATIAL_CELL_SIZE,
    getX:e=>e.x,getY:e=>e.y,getRadius:e=>e.size,
    include:e=>!e.isDead&&e.health>0,
  });
  let {projectilesFired,volleys,targetsAcquired,criticalShots,
    echoShots,supportRestored,nextShotOrdinal}=previous;
  let restoredShield=0;
  const projectiles=[...encounter.projectiles];
  const swarm=encounter.swarm.map(member=>{
    const next={...member,shootCooldown:Math.max(0,
      member.shootCooldown-deltaMs/ROUTE_ORBI_FRAME_MS)};
    if(next.shootCooldown>0 || projectiles.length>=ROUTE_QA_PROJECTILE_CAP)
      return next;
    const maxRange=ROUTE_ORBI_BASE_RANGE+
      (formation===FormationType.SHIELD?100:0);
    const nearest=findNearestSpatialItem(index,next.x,next.y,maxRange);
    if(!nearest.item)return next;
    const target=nearest.item;
    const dx=target.x-next.x,dy=target.y-next.y;
    const distance=Math.max(.001,Math.sqrt(nearest.distanceSquared));
    const signature=next.attackSignature??
      getFallbackAttackSignatureForAffinity(next.affinity);
    const profile=getOrbiAttackProfile(signature);
    const gaia=next.energyId==="GAIA"?getGaiaCombatScale(next.level):null;
    const speed=ROUTE_ORBI_BASE_SPEED_PER_FRAME/
      (ROUTE_ORBI_FRAME_MS/1000)*
      (1+FORMATIONS[formation].projSpeedMod)*profile.speedMultiplier;
    const baseDamage=(ROUTE_ORBI_BASE_DAMAGE+
      (formation===FormationType.CIRCLE?1.5:0))*
      profile.damageMultiplier*(gaia?.damageMultiplier??1);
    const criticalRoll=((nextShotOrdinal*67+encounter.swarm.indexOf(member)*131+
      17)%997)/997;
    const critical=criticalRoll<profile.criticalChance;
    const angle=Math.atan2(dy,dx);
    const makeShot=(a:number,damageScale:number,speedScale:number,
      sizeScale:number,isEcho:boolean):Projectile=>({
      id:`route-orbi-${nextShotOrdinal++}`,
      x:next.x,y:next.y,
      vx:Math.cos(a)*speed*speedScale,
      vy:Math.sin(a)*speed*speedScale,
      damage:baseDamage*damageScale*
        (critical&&!isEcho?profile.criticalDamageMultiplier:1),
      color:next.color,size:profile.projectileSize*sizeScale,
      fromPlayer:true,life:profile.lifetimeMs,maxLife:profile.lifetimeMs,
      affinity:next.affinity,energyId:next.energyId??profile.energyId,
      attackSignature:signature,attackShape:profile.shape,
      rotation:a,pushMultiplier:profile.pushMultiplier,
      slowDurationMs:profile.slowDurationMs,
      splashRadius:profile.splashRadius,
      splashDamageMultiplier:profile.splashDamageMultiplier,
      magneticPullRadius:profile.magneticPullRadius,
      magneticPullStrength:profile.magneticPullStrength,
      supportShieldRestore:profile.supportShieldRestore*
        (gaia?.shieldSupportMultiplier??1),
      isCriticalShot:critical&&!isEcho,
    });
    projectiles.push(makeShot(angle,1,1,1,false));
    projectilesFired++;volleys++;targetsAcquired++;
    if(critical)criticalShots++;
    if(profile.echoAngleRadians>0){
      for(const side of [-1,1]){
        if(projectiles.length>=ROUTE_QA_PROJECTILE_CAP)break;
        projectiles.push(makeShot(angle+profile.echoAngleRadians*side,
          profile.echoDamageMultiplier,.96,.82,true));
        projectilesFired++;echoShots++;
      }
    }
    const support=profile.supportShieldRestore*
      (gaia?.shieldSupportMultiplier??1);
    restoredShield+=support;
    supportRestored+=support;
    next.shootCooldown=profile.cooldownFrames*
      (gaia?.cooldownMultiplier??1)*
      (formation===FormationType.CIRCLE?.78:1);
    next.recoilX=-dx/distance*Math.min(2.3,1+profile.speedMultiplier*.35);
    next.recoilY=-dy/distance*Math.min(2.3,1+profile.speedMultiplier*.35);
    next.flashTicks=3;
    return next;
  });
  return {
    encounter:{...encounter,swarm,projectiles},
    weapons:{projectilesFired,volleys,targetsAcquired,criticalShots,
      echoShots,supportRestored,nextShotOrdinal},
    restoredShield,
  };
}
