import { createLiveEnemyFormationDirectorState } from "./liveEnemyFormationDirector";
import type { RouteCoordinateOwners, RouteMutablePoint } from "./routeCoordinateOwners";
import { EnemyType, OrbiType, ParticleType, type Enemy, type OrbiMember, type Particle, type Projectile, type Resource } from "./types";

/** A bounded, fixed QA encounter: real game entity shapes, NO combat authority.
 * No spawn director, damage, loot claiming, boss phases or scoring are run here.
 * Rebase is tested on the same object fields the live engine owns. */
export type RouteQaEncounter = Omit<
  RouteCoordinateOwners,
  "frame" | "player" | "camera" | "swarm" | "enemies" | "projectiles" | "resources"
> & {
  swarm: OrbiMember[];
  enemies: Enemy[];
  projectiles: Projectile[];
  resources: Resource[];
};

export const qaOrbiOffset = (index: number): RouteMutablePoint => {
  const ring = Math.floor(index / 10);
  const theta = (index % 10) / 10 * Math.PI * 2;
  const radiusX = 82 + ring * 54;
  const radiusY = 65 + ring * 44;
  return { x: -38 + Math.cos(theta) * radiusX, y: Math.sin(theta) * radiusY };
};

export function createRouteQaEncounter(player: RouteMutablePoint): RouteQaEncounter {
  const swarm: OrbiMember[] = Array.from({length:30},(_,i)=>{
    const p=qaOrbiOffset(i);
    return {
      id:`qa-orbi-${i}`,type:OrbiType.FOTON,name:`QA ORBI ${i+1}`,
      x:player.x+p.x,y:player.y+p.y,
      targetX:player.x+p.x,targetY:player.y+p.y,
      color:i%2===0?"#22d3ee":"#67e8f9",size:8,shootCooldown:0,
      affinity:"solar",combatRole:"beam",energyId:"FOTON",
      personality:"QA formation",evolutionStage:1,level:1,xp:0,
    };
  });
  const makeEnemy=(id:string,x:number,y:number):Enemy=>({
    id,type:EnemyType.CRAWLER,x,y,vx:0,vy:0,health:100,maxHealth:100,
    speed:0,size:22,color:"#fb7185",shootCooldown:250,
    pulseCooldown:0,contactDamageCooldown:0,isDead:false,isBoss:false,flashTicks:0,
  });
  const enemies=[
    makeEnemy("qa-crawler-a",player.x+390,player.y-100),
    makeEnemy("qa-crawler-b",player.x+540,player.y+85),
    makeEnemy("qa-crawler-c",player.x-300,player.y-90),
  ];
  const projectiles:Projectile[]=[{
    id:"qa-projectile-player",x:player.x+230,y:player.y-100,
    vx:0.8,vy:0,damage:5,color:"#22d3ee",size:6,
    fromPlayer:true,life:6000,maxLife:6000,attackShape:"LANCE",
  },{
    id:"qa-projectile-enemy",x:player.x+315,y:player.y+70,
    vx:-0.2,vy:0,damage:4,color:"#fb7185",size:5,
    fromPlayer:false,life:6000,maxLife:6000,
  }];
  const resources:Resource[]=[
    {id:"qa-nano",type:"NANO",x:player.x+200,y:player.y+148,size:10,
      color:"#fbbf24",amount:25},
    {id:"qa-energy",type:"ENERGY",x:player.x-245,y:player.y+135,size:10,
      color:"#22d3ee",amount:10},
  ];
  const particles:Particle[]=[{
    id:"qa-particle",type:ParticleType.FORMATION_CHANGE,
    x:player.x+265,y:player.y-170,vx:0,vy:0,size:2,color:"#67e8f9",
    alpha:1,life:999999,maxLife:999999,
  }];
  return {
    pointer:{x:player.x+120,y:player.y},
    clickToMoveTarget:{x:player.x+160,y:player.y+90},
    swarm,enemies,projectiles,resources,particles,
    floatingTexts:[{x:player.x+260,y:player.y-190}],
    hazardZones:[{x:player.x+450,y:player.y+160}],
    shieldNodes:[{x:player.x+470,y:player.y-130}],
    bossAttackTarget:null,boss:null,architectQaBoss:null,
    formationDirector:createLiveEnemyFormationDirectorState(),
    legacyCamera:null,
    extraWorldAnchors:[{x:player.x+660,y:player.y}],
    invalidatedSpatialCaches:[{current:{builtAtEpoch:0}}],
  };
}

/** QA only: move the 30 authentic ORBI positions/targets with ENERGY.
 * World-anchored enemies/projectiles/resources stay fixed until a single
 * atomic rebase, demonstrating that physics isn't a moving background. */
export function stepRouteQaEncounter(
  encounter: RouteQaEncounter, player: RouteMutablePoint,
): RouteQaEncounter {
  return {
    ...encounter,
    swarm:encounter.swarm.map((member,i)=>{
      const delta=qaOrbiOffset(i);
      return {...member,
        x:player.x+delta.x,y:player.y+delta.y,
        targetX:player.x+delta.x,targetY:player.y+delta.y,
      };
    }),
  };
}
