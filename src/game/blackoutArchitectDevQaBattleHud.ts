import { EnemyType, type Enemy } from "./types";
import type {
  BlackoutArchitectEngineIdentityGuard,
  BlackoutArchitectEngineIdentityLifecycleOwner,
} from "./blackoutArchitectEngineIdentityLifecycle";
import type {
  BlackoutArchitectDevQaCardinalGeometry,
} from "./blackoutArchitectDevQaCardinalGeometry";
import type {
  BlackoutArchitectDevQaGridLockState,
} from "./blackoutArchitectDevQaGridLockAttack";
import { BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG } from "./blackoutArchitectDevQaGridLockAttack";
import type {
  BlackoutArchitectDevQaVectorTideState,
} from "./blackoutArchitectDevQaVectorTideAttack";
import { BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG } from "./blackoutArchitectDevQaVectorTideAttack";
import type {
  BlackoutArchitectDevQaSectorWallState,
} from "./blackoutArchitectDevQaSectorWallAttack";
import { BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG } from "./blackoutArchitectDevQaSectorWallAttack";
import type {
  BlackoutArchitectDevQaPatternDirectorState,
  ArchitectQaDirectorPattern,
} from "./blackoutArchitectDevQaPatternDirector";

export type ArchitectQaHudAttack =
  | BlackoutArchitectDevQaGridLockState
  | BlackoutArchitectDevQaVectorTideState
  | BlackoutArchitectDevQaSectorWallState;
export type ArchitectQaHudPhase = "TELEGRAPH" | "ACTIVE" | "RECOVERY";
export interface ArchitectQaHudAnchor {
  readonly id: "NORTH" | "EAST" | "SOUTH" | "WEST";
  readonly health: number;
  readonly maxHealth: number;
  readonly down: boolean;
}
export interface ArchitectQaBattleHudSnapshot {
  readonly mode: "DEV_QA_AUTHENTIC_BATTLE_HUD";
  readonly attack: ArchitectQaDirectorPattern;
  readonly attackPhase: ArchitectQaHudPhase;
  readonly remainingMs: number;
  readonly attackCycle: number;
  readonly directorEnabled: boolean;
  readonly directorPhase: 1 | 2 | 3;
  readonly coreHealth: number;
  readonly coreMaxHealth: number;
  readonly coreExposed: boolean;
  readonly anchorsRemaining: number;
  readonly anchors: readonly ArchitectQaHudAnchor[];
  readonly qaHullHealth: number;
  readonly instructions: readonly ["F7 AUTO", "F8 PATTERN", "F9 EXIT", "WASD/ARROWS/TOUCH MOVE"];
}

export const BLACKOUT_ARCHITECT_DEV_QA_BATTLE_HUD_AUTHORITY = Object.freeze({
  ownsVerifiedRealQaReadOnlyBattleSnapshot: true,
  ownsVisibleCardinalCoreAndAttackStatus: true,
  ownsDevOnlyInstructionsAndPresentationProjection: true,
  ownsBossOrAnchorHealthMutation: false,
  ownsGlobalPlayerHealthOrShield: false,
  ownsAttackSchedulingOrDamage: false,
  ownsProductionModeHudOrRouting: false,
  ownsScoresRewardsPersistenceOrRng: false,
} as const);

const finite=(n:unknown):n is number=>
  typeof n==="number"&&Number.isFinite(n)&&!Object.is(n,-0);
const positiveSafe=(n:unknown):n is number=>
  Number.isSafeInteger(n)&&(n as number)>0;
const orderedIds=["NORTH","EAST","SOUTH","WEST"] as const;
const activePhase=(n:unknown):n is ArchitectQaHudPhase=>
  n==="TELEGRAPH"||n==="ACTIVE"||n==="RECOVERY";
const configFor=(pattern:ArchitectQaDirectorPattern)=>pattern==="GRID_LOCK"
  ?BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG
  :pattern==="VECTOR_TIDE"
  ?BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG
  :BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG;

export const projectBlackoutArchitectDevQaBattleHud=(
  owner:BlackoutArchitectEngineIdentityLifecycleOwner|null,
  guard:Readonly<BlackoutArchitectEngineIdentityGuard>|null,
  geometry:Readonly<BlackoutArchitectDevQaCardinalGeometry>|null,
  boss:Enemy|null,installedBoss:Enemy|null,enemies:readonly Enemy[],
  grid:BlackoutArchitectDevQaGridLockState|null,
  tide:BlackoutArchitectDevQaVectorTideState|null,
  wall:BlackoutArchitectDevQaSectorWallState|null,
  activeAttack:ArchitectQaHudAttack|null,
  director:BlackoutArchitectDevQaPatternDirectorState|null,
  explicitDevQa:boolean,
):Readonly<ArchitectQaBattleHudSnapshot>|null=>{
  try{
    if(explicitDevQa!==true||!owner||!guard||!geometry||!boss||
       boss!==installedBoss||boss.type!==EnemyType.BOSS_ARCHITECT||
       boss.architectBossIdentity!=="BLACKOUT_ARCHITECT"||
       boss.bossChassis!==undefined||boss.infiniteBossIdentity!==undefined||
       geometry.boss!==boss||geometry.guard!==guard||
       geometry.mode!=="DEV_QA_PHYSICAL_GEOMETRY_NO_HITS"||
       !owner.isCurrent(guard,boss,installedBoss,enemies)||
       !finite(boss.health)||!finite(boss.maxHealth)||
       boss.health<=0||boss.maxHealth<=0||boss.health>boss.maxHealth||
       !Array.isArray(geometry.anchors)||geometry.anchors.length!==4||
       Number(grid!==null)+Number(tide!==null)+Number(wall!==null)!==1)
      return null;
    const attack=grid??tide??wall;
    if(!attack||attack!==activeAttack||attack.boss!==boss||
       attack.guard!==guard||!activePhase(attack.phase)||
       !positiveSafe(attack.cycle)||!finite(attack.qaHullHealth)||
       attack.qaHullHealth<=0||attack.qaHullHealth>100||
       attack.qaHullMaxHealth!==100||!finite(attack.remainingMs)||
       attack.remainingMs<=0)return null;
    const pattern:ArchitectQaDirectorPattern=grid?"GRID_LOCK":
      tide?"VECTOR_TIDE":"SECTOR_WALL";
    if((grid&&grid.mode!=="DEV_QA_GRID_LOCK_PHYSICAL")||
       (tide&&tide.mode!=="DEV_QA_VECTOR_TIDE_PHYSICAL")||
       (wall&&wall.mode!=="DEV_QA_SECTOR_WALL_PHYSICAL"))return null;
    const c=configFor(pattern);
    const bound=attack.phase==="TELEGRAPH"?c.telegraphMs:
      attack.phase==="ACTIVE"?c.activeMs:c.recoveryMs;
    if(attack.remainingMs>bound)return null;
    if(tide&&(!Array.isArray(tide.bolts)||tide.bolts.length!==6))return null;
    if(wall&&(!Array.isArray(wall.segments)||wall.segments.length!==8))return null;

    const byId=new Map<string,ArchitectQaHudAnchor>();
    for(const a of geometry.anchors){
      if(!a||!orderedIds.includes(a.id)||byId.has(a.id)||
         !finite(a.health)||!finite(a.maxHealth)||a.health<0||
         a.maxHealth<=0||a.health>a.maxHealth||
         !finite(a.x)||!finite(a.y)||!finite(a.radius)||a.radius<=0)return null;
      byId.set(a.id,Object.freeze({
        id:a.id,health:a.health,maxHealth:a.maxHealth,down:a.health===0,
      }));
    }
    if(byId.size!==4)return null;
    const anchors=Object.freeze(orderedIds.map(id=>byId.get(id)!));
    const anchorsRemaining=anchors.filter(a=>!a.down).length;
    const coreExposed=anchorsRemaining===0;
    const fraction=boss.health/boss.maxHealth;
    const visiblePhase=(!coreExposed?1:fraction<=0.32?3:fraction<=0.68?2:1) as 1|2|3;
    if(director!==null&&(
       director.mode!=="DEV_QA_ARCHITECT_REAL_PATTERN_DIRECTOR"||
       director.boss!==boss||director.guard!==guard||director.geometry!==geometry||
       director.pattern!==pattern||!positiveSafe(director.sourceCycle)||
       ![1,2,3].includes(director.phase)||
       director.phase>visiblePhase||
       !finite(director.qaHullHealth)||
       director.qaHullHealth!==attack.qaHullHealth||
       !finite(director.seenCoreHp)||director.seenCoreHp<boss.health
    ))return null;
    const directorPhase=director?.phase??visiblePhase;
    return Object.freeze({
      mode:"DEV_QA_AUTHENTIC_BATTLE_HUD" as const,
      attack:pattern,attackPhase:attack.phase,
      remainingMs:attack.remainingMs,attackCycle:attack.cycle,
      directorEnabled:director!==null,directorPhase,
      coreHealth:boss.health,coreMaxHealth:boss.maxHealth,coreExposed,
      anchorsRemaining,anchors,
      qaHullHealth:attack.qaHullHealth,
      instructions:Object.freeze(["F7 AUTO","F8 PATTERN","F9 EXIT","WASD/ARROWS/TOUCH MOVE"] as const),
    });
  }catch{return null;}
};