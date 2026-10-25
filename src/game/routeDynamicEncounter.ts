import { MAX_ENEMIES, MAX_PROJECTILES, MAX_RESOURCES } from "./constants";
import { EnemyType, type Enemy, type Projectile, type Resource } from "./types";
import type { RouteLocalPoint } from "./physicalRouteSpace";
import type { RoutePhysicalCamera, RoutePhysicalViewport } from "./routePhysicalCamera";
import type { RouteQaEncounter } from "./routePhysicalQaEncounter";
import { applyRouteCanonicalImpactEffects } from "./routeOrbiImpactFxQa";
import type { CombatResonanceDefeatEvent } from "./combatResonance";
import { isRouteWave2OrdinaryEnemy,projectRouteParasiteMotion,
  ROUTE_WAVE2_START_MS } from "./routeWave2Qa";

/**
 * UX15-C3B-1: deterministic encounter window for the isolated ASTERIA lab.
 * Coordinates are physical route-local X/Y; NONE reference WORLD_WIDTH.
 * Production spawn/wave/collision authority in EnergySwarmGame is untouched.
 */
export const ROUTE_SPAWN_MARGIN = 100;
export const ROUTE_SPAWN_SAFE_RADIUS = 175;
export const ROUTE_ENEMY_CULL_MARGIN = 360;
export const ROUTE_PROJECTILE_CULL_MARGIN = 160;
export const ROUTE_RESOURCE_CULL_MARGIN = 500;
export const ROUTE_RESOURCE_MIN_LIFETIME_MS = 9_000;
export const ROUTE_QA_SPAWN_PERIOD_MS = 700;
export const ROUTE_QA_FIRE_PERIOD_MS = 400;
export const ROUTE_QA_ENEMY_CAP = 12;
export const ROUTE_QA_PROJECTILE_CAP = 24;
export const ROUTE_QA_RESOURCE_CAP = 16;

export interface RouteWorldRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface RouteDynamicQaState {
  readonly spawned: number;
  readonly culled: number;
  readonly hits: number;
  readonly destroyed: number;
  readonly pickups: number;
  readonly splashHits:number;
  readonly slowedHits:number;
  readonly pushes:number;
  readonly magneticPulls:number;
  readonly areaKills:number;
  readonly nextSpawnMs: number;
  readonly nextFireMs: number;
  readonly nextProjectileOrdinal: number;
  readonly nextResourceOrdinal: number;
}

export function createRouteDynamicQaState(): RouteDynamicQaState {
  return {
    spawned:0,culled:0,hits:0,destroyed:0,pickups:0,
    splashHits:0,slowedHits:0,pushes:0,magneticPulls:0,areaKills:0,
    nextSpawnMs:700,nextFireMs:900,
    nextProjectileOrdinal:0,nextResourceOrdinal:0,
  };
}

export function getRouteWorldRect(
  camera: RoutePhysicalCamera, viewport: RoutePhysicalViewport,
): RouteWorldRect {
  if (![camera.localX,camera.localY,viewport.width,viewport.height,viewport.zoom]
    .every(Number.isFinite) || viewport.width<=0 || viewport.height<=0 ||
    viewport.zoom<=0) throw new RangeError("Invalid physical route viewport");
  return {
    left:camera.localX,right:camera.localX+viewport.width/viewport.zoom,
    top:camera.localY,bottom:camera.localY+viewport.height/viewport.zoom,
  };
}

const insideRect=(point:RouteLocalPoint,rect:RouteWorldRect,margin:number):boolean=>
  point.x>=rect.left-margin && point.x<=rect.right+margin &&
  point.y>=rect.top-margin && point.y<=rect.bottom+margin;

/** The chosen spawn is 100 physical units OUTSIDE the current camera,
 * not artificially pinned to legacy X=1600. Reject unsafe proximity
 * instead of teleporting enemies into the playable area. */
export function projectRouteViewportSpawn(
  camera:RoutePhysicalCamera,
  viewport:RoutePhysicalViewport,
  player:RouteLocalPoint,
  side:"LEFT"|"RIGHT"|"TOP"|"BOTTOM",
  fraction:number,
  safetyRadius=ROUTE_SPAWN_SAFE_RADIUS,
):RouteLocalPoint|null {
  if (!Number.isFinite(fraction) || fraction<0 || fraction>1 ||
      !Number.isFinite(safetyRadius) || safetyRadius<0 ||
      !Number.isFinite(player.x) || !Number.isFinite(player.y))
    throw new RangeError("Invalid route spawn geometry");
  const rect=getRouteWorldRect(camera,viewport);
  const point=side==="LEFT"?{x:rect.left-ROUTE_SPAWN_MARGIN,y:rect.top+(rect.bottom-rect.top)*fraction}:
    side==="RIGHT"?{x:rect.right+ROUTE_SPAWN_MARGIN,y:rect.top+(rect.bottom-rect.top)*fraction}:
    side==="TOP"?{x:rect.left+(rect.right-rect.left)*fraction,y:rect.top-ROUTE_SPAWN_MARGIN}:
    {x:rect.left+(rect.right-rect.left)*fraction,y:rect.bottom+ROUTE_SPAWN_MARGIN};
  const dx=point.x-player.x,dy=point.y-player.y;
  if(dx*dx+dy*dy<safetyRadius*safetyRadius) return null;
  return point;
}

export function shouldKeepRouteEnemy(
  enemy:Enemy,rect:RouteWorldRect,margin=ROUTE_ENEMY_CULL_MARGIN,
):boolean {
  if (!Number.isFinite(margin)||margin<0) throw new RangeError("Invalid enemy cull margin");
  return !enemy.isDead && insideRect(enemy,rect,margin);
}
export function shouldKeepRouteProjectile(
  projectile:Projectile,rect:RouteWorldRect,
):boolean {
  return projectile.life>0 && insideRect(projectile,rect,ROUTE_PROJECTILE_CULL_MARGIN);
}
export function shouldKeepRouteResource(
  resource:Resource,rect:RouteWorldRect,nowMs:number,
):boolean {
  if (!Number.isFinite(nowMs)||nowMs<0) throw new RangeError("Invalid resource clock");
  return !resource.consumed && (
    nowMs-(resource.spawnTime??0)<ROUTE_RESOURCE_MIN_LIFETIME_MS ||
    insideRect(resource,rect,ROUTE_RESOURCE_CULL_MARGIN)
  );
}

const makeCrawler=(id:number,x:number,y:number):Enemy=>({
  id:`route-qa-enemy-${id}`,type:EnemyType.CRAWLER,x,y,vx:0,vy:0,
  health:18,maxHealth:18,speed:65,size:19,color:"#fb7185",
  shootCooldown:0,pulseCooldown:0,contactDamageCooldown:0,
  isDead:false,isBoss:false,flashTicks:0,
});

/**
 * Fixed 50ms-max simulation, no randomness, Date.now or RAF clock.
 * This is deliberately a limited encounter with QA shots, NOT actual
 * player damage, WaveDirector, boss AI, xp or production weapon logic.
 */
export function stepRouteDynamicQaEncounter(
  encounter:RouteQaEncounter,
  prior:RouteDynamicQaState,
  player:RouteLocalPoint,
  camera:RoutePhysicalCamera,
  viewport:RoutePhysicalViewport,
  deltaMs:number,
  simulatedMs:number,
  combatBridgeEnabled=false,
  orbiWeaponsEnabled=false,
  impactFxEnabled=false,
  convergenceEnabled=false,
  wave1Enabled=false,
  wave2Enabled=false,
  worldOriginOffsetX=0,
):{encounter:RouteQaEncounter; dynamic:RouteDynamicQaState;
   defeats:CombatResonanceDefeatEvent[]; convergenceHits:number; convergenceKills:number} {
  if(impactFxEnabled && (!combatBridgeEnabled || !orbiWeaponsEnabled))
    throw new Error("Canonical impact FX requires C3B-2 and C3B-3 QA gates");
  if(impactFxEnabled&&(encounter.boss!==null||encounter.architectQaBoss!==null||
    encounter.hazardZones.length>0||encounter.enemies.some(e=>
      wave2Enabled&&simulatedMs>=ROUTE_WAVE2_START_MS
        ?!isRouteWave2OrdinaryEnemy(e)
        :e.type!==EnemyType.CRAWLER||e.isBoss)))
    throw new Error("Uncertified enemy/boss/hazard impact FX gate");
  if (![deltaMs,simulatedMs,player.x,player.y].every(Number.isFinite) ||
      deltaMs<0 || deltaMs>50+1e-7 || simulatedMs<0)
    throw new RangeError("Invalid physical QA encounter clock");
  if(deltaMs===0) return {encounter,dynamic:prior,defeats:[],convergenceHits:0,convergenceKills:0};
  const rect=getRouteWorldRect(camera,viewport);
  const dt=deltaMs/1000;
  const enemies=encounter.enemies.map(e=>({...e}));
  const projectiles=encounter.projectiles.map(p=>({...p}));
  const resources=encounter.resources.map(r=>({...r}));
  const defeats:CombatResonanceDefeatEvent[]=[];
  let convergenceHits=0,convergenceKills=0;
  let {spawned,culled,hits,destroyed,pickups,
    splashHits,slowedHits,pushes,magneticPulls,areaKills,
    nextSpawnMs,nextFireMs,nextProjectileOrdinal,nextResourceOrdinal}=prior;

  if(!wave1Enabled && !wave2Enabled && simulatedMs>=nextSpawnMs){
    nextSpawnMs+=ROUTE_QA_SPAWN_PERIOD_MS;
    if(enemies.length<Math.min(MAX_ENEMIES,ROUTE_QA_ENEMY_CAP)){
      // Four viewport-relative edges, not a fixed legacy arena. Introduce
      // the first enemy above ENERGY's camera anchor: a short, observable
      // approach even with a very wide mobile landscape viewport.
      const sides=["TOP","RIGHT","BOTTOM","LEFT"] as const;
      const side=sides[spawned%4];
      const lane=side==="TOP"||side==="BOTTOM"
        ? 0.42+(spawned%3-1)*0.10
        : 0.20+((spawned*7)%13)/13*0.60;
      const point=projectRouteViewportSpawn(camera,viewport,player,side,lane);
      if(point){
        enemies.push(makeCrawler(spawned,point.x,point.y));
        spawned++;
      }
    }
  }

  for(const enemy of enemies){
    if(impactFxEnabled&&enemy.slowTimer!==undefined&&enemy.slowTimer>0)
      enemy.slowTimer=Math.max(0,enemy.slowTimer-deltaMs);
    const dx=player.x-enemy.x,dy=player.y-enemy.y;
    const length=Math.hypot(dx,dy);
    if(wave2Enabled&&simulatedMs>=ROUTE_WAVE2_START_MS&&
       enemy.type===EnemyType.PARASITE){
      const slow=impactFxEnabled&&(enemy.slowTimer??0)>0?.45:1;
      const physical=projectRouteParasiteMotion(
        enemy,player,deltaMs,simulatedMs,worldOriginOffsetX,slow,
      );
      enemy.x=physical.x;enemy.y=physical.y;
      continue;
    }
    if(length>0.01){
      // C3B-1 visual QA held enemies at 55 units, never touching ENERGY.
      // Opt-in C3B-2 allows actual physical contact with the QA shield.
      const stopDistance=combatBridgeEnabled?24:55;
      // Legacy HYDRO slows enemy movement to 45% while slowTimer is active.
      const slowFactor=impactFxEnabled&&(enemy.slowTimer??0)>0?.45:1;
      const advance=Math.min(enemy.speed*slowFactor*dt,
        Math.max(0,length-stopDistance));
      enemy.x+=advance*dx/length;enemy.y+=advance*dy/length;
    }
  }

  if(simulatedMs>=nextFireMs){
    nextFireMs+=ROUTE_QA_FIRE_PERIOD_MS;
    // C3B-3 never combines the fake ENERGY test gun with real ORBI shots.
    if(!orbiWeaponsEnabled&&
       projectiles.length<Math.min(MAX_PROJECTILES,ROUTE_QA_PROJECTILE_CAP)){
      const candidate=enemies.filter(e=>!e.isDead).sort((a,b)=>
        Math.hypot(a.x-player.x,a.y-player.y)-
        Math.hypot(b.x-player.x,b.y-player.y))[0];
      if(candidate && Math.hypot(candidate.x-player.x,candidate.y-player.y)<1500){
        const dx=candidate.x-player.x,dy=candidate.y-player.y;
        const distance=Math.hypot(dx,dy)||1;
        projectiles.push({
          id:`route-qa-shot-${nextProjectileOrdinal++}`,
          x:player.x,y:player.y,vx:dx/distance*540,vy:dy/distance*540,
          damage:9,color:"#38bdf8",size:7,
          fromPlayer:true,life:3000,maxLife:3000,
          attackShape:"LANCE",
        });
      }
    }
  }
  for(const shot of projectiles){
    // The UX14-B live engine creates 1ms target-pinned, one-frame bolts.
    // Resolve by explicit target ID BEFORE life decay/swept collision, so
    // beam slots cannot accidentally strike another nearby actor or trigger
    // splash/magnetism. This branch is impossible without the C3B-6 gate.
    if(shot.convergenceTargetId){
      if(!convergenceEnabled)
        throw new Error("Uncertified target-pinned Convergence projectile");
      shot.life=0;
      const target=enemies.find(e=>e.id===shot.convergenceTargetId &&
        !e.isDead&&e.health>0);
      if(!target)continue;
      target.health=Math.max(0,target.health-shot.damage);
      target.flashTicks=4;
      hits++;convergenceHits++;
      if(target.health===0){
        target.isDead=true;destroyed++;convergenceKills++;
        defeats.push({occurredAtMs:simulatedMs,baseScore:0});
        if(resources.length<Math.min(MAX_RESOURCES,ROUTE_QA_RESOURCE_CAP)){
          resources.push({
            id:`route-qa-drop-${nextResourceOrdinal++}`,type:"ENERGY",
            x:target.x,y:target.y,size:9,color:"#67e8f9",amount:1,
            spawnTime:simulatedMs,
          });
        }
      }
      continue;
    }
    const oldX=shot.x,oldY=shot.y;
    const nextX=oldX+shot.vx*dt,nextY=oldY+shot.vy*dt;
    shot.x=nextX;shot.y=nextY;shot.life-=deltaMs;
    // Swept segment-circle hit, so 50ms/540u/s can't tunnel through.
    if(!shot.fromPlayer||shot.life<=0) continue;
    const segDx=nextX-oldX,segDy=nextY-oldY;
    const denom=segDx*segDx+segDy*segDy;
    let victim:Enemy|null=null;
    let firstT=Number.POSITIVE_INFINITY;
    for(const enemy of enemies){
      if(enemy.isDead) continue;
      const t=denom>0?Math.max(0,Math.min(1,
        ((enemy.x-oldX)*segDx+(enemy.y-oldY)*segDy)/denom)):0;
      const px=oldX+t*segDx,py=oldY+t*segDy;
      const radius=enemy.size+shot.size;
      if((enemy.x-px)**2+(enemy.y-py)**2<=radius*radius && t<firstT){
        victim=enemy;firstT=t;
      }
    }
    if(victim){
      shot.life=0;hits++;
      victim.health=Math.max(0,victim.health-shot.damage);
      // C3B-4 applies metadata only AFTER real swept contact, never per
      // frame or on missed/expired shots. Legacy C3B1-3 retain old behavior.
      const fx=impactFxEnabled
        ? applyRouteCanonicalImpactEffects(shot,victim,enemies,
            wave2Enabled&&simulatedMs>=ROUTE_WAVE2_START_MS)
        : null;
      splashHits+=fx?.splashHits??0;
      slowedHits+=fx?.slows??0;
      pushes+=fx?.pushes??0;
      magneticPulls+=fx?.pulls??0;
      areaKills+=fx?.splashKills.length??0;
      const casualties=[
        ...(victim.health===0?[victim]:[]),...(fx?.splashKills??[]),
      ];
      for(const killed of casualties){
        killed.isDead=true;
        destroyed++;
        // Zero baseScore guarantees no score/reward authority leaks.
        // Both direct and splash victims carry the firing ORBI's affinity.
        defeats.push({occurredAtMs:simulatedMs,baseScore:0,
          affinity:shot.affinity,isElite:false,isBoss:false});
        if(resources.length<Math.min(MAX_RESOURCES,ROUTE_QA_RESOURCE_CAP)){
          resources.push({
            id:`route-qa-drop-${nextResourceOrdinal++}`,type:"ENERGY",
            x:killed.x,y:killed.y,size:9,color:"#67e8f9",amount:1,
            spawnTime:simulatedMs,
          });
        }
      }
    }
  }
  // A pickup is an observation, never a reward to campaign/stats.
  for(const drop of resources){
    if((drop.x-player.x)**2+(drop.y-player.y)**2<35**2){
      drop.consumed=true;pickups++;
    }
  }
  const remainingEnemies=enemies.filter(e=>shouldKeepRouteEnemy(e,rect));
  culled+=enemies.length-remainingEnemies.length-
    enemies.filter(e=>e.isDead).length;
  const remainingShots=projectiles.filter(p=>shouldKeepRouteProjectile(p,rect));
  const remainingDrops=resources.filter(r=>shouldKeepRouteResource(r,rect,simulatedMs));
  return {
    encounter:{...encounter,enemies:remainingEnemies,
      projectiles:remainingShots,resources:remainingDrops},
    defeats,convergenceHits,convergenceKills,
    dynamic:{spawned,culled:Math.max(0,culled),hits,destroyed,pickups,
      splashHits,slowedHits,pushes,magneticPulls,areaKills,nextSpawnMs,
      nextFireMs,nextProjectileOrdinal,nextResourceOrdinal},
  };
}
