import { EnemyType, type Enemy } from "./types";
import type {
  BlackoutArchitectEngineIdentityGuard,
  BlackoutArchitectEngineIdentityLifecycleOwner,
} from "./blackoutArchitectEngineIdentityLifecycle";
import type { BlackoutArchitectDevQaCardinalGeometry } from "./blackoutArchitectDevQaCardinalGeometry";

export type ArchitectQaDirectorPattern = "GRID_LOCK" | "VECTOR_TIDE" | "SECTOR_WALL";
export type ArchitectQaDirectorPhase = 1 | 2 | 3;
export type ArchitectQaDirectorAttackPhase = "TELEGRAPH" | "ACTIVE" | "RECOVERY";

export interface BlackoutArchitectDevQaPatternDirectorState {
  readonly mode: "DEV_QA_ARCHITECT_REAL_PATTERN_DIRECTOR";
  readonly boss: Enemy;
  readonly guard: Readonly<BlackoutArchitectEngineIdentityGuard>;
  readonly geometry: Readonly<BlackoutArchitectDevQaCardinalGeometry>;
  pattern: ArchitectQaDirectorPattern;
  phase: ArchitectQaDirectorPhase;
  sourceCycle: number;
  qaHullHealth: number;
  seenCoreHp: number;
}

export interface ArchitectQaDirectorAttackObservation {
  readonly phase: ArchitectQaDirectorAttackPhase;
  readonly cycle: number;
  readonly qaHullHealth: number;
  readonly qaHullDepleted: boolean;
}
export interface ArchitectQaDirectorStepResult {
  readonly phase: ArchitectQaDirectorPhase;
  readonly pattern: ArchitectQaDirectorPattern;
  readonly nextPattern: ArchitectQaDirectorPattern | null;
  readonly qaHullHealth: number;
  readonly sourceCycle: number;
}

export const BLACKOUT_ARCHITECT_DEV_QA_DIRECTOR_AUTHORITY = Object.freeze({
  ownsAuthenticatedDevQaPhaseAndPatternSelection: true,
  ownsPersistentIndependentQaHullAcrossPatternTransitions: true,
  ownsDeterministicSafeRecoveryHandoff: true,
  ownsGlobalProjectilesOrNormalEnemyAI: false,
  ownsNormalPlayerHealthOrShield: false,
  ownsRewardsScoresOrPersistence: false,
  ownsProductionCampaignInfiniteOrScoreAttack: false,
  ownsGlobalTimersOrRng: false,
} as const);
export const BLACKOUT_ARCHITECT_DEV_QA_DIRECTOR_CONFIG = Object.freeze({
  thresholdPhase2: 0.68,
  thresholdPhase3: 0.32,
  maxQaHull: 100,
} as const);

const validNumber = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n) && !Object.is(n,-0);
const validCycle = (n: unknown): n is number =>
  Number.isSafeInteger(n) && (n as number) > 0 &&
  (n as number) < Number.MAX_SAFE_INTEGER;

const patterns = Object.freeze({
  1: Object.freeze(["GRID_LOCK"] as const),
  2: Object.freeze(["GRID_LOCK", "VECTOR_TIDE"] as const),
  3: Object.freeze(["GRID_LOCK", "VECTOR_TIDE", "SECTOR_WALL"] as const),
});

const isPattern=(value:unknown):value is ArchitectQaDirectorPattern=>
  value==="GRID_LOCK"||value==="VECTOR_TIDE"||value==="SECTOR_WALL";

const attested=(
  owner:BlackoutArchitectEngineIdentityLifecycleOwner|null,
  guard:Readonly<BlackoutArchitectEngineIdentityGuard>|null,
  geometry:Readonly<BlackoutArchitectDevQaCardinalGeometry>|null,
  boss:Enemy|null,installed:Enemy|null,enemies:readonly Enemy[],
):boss is Enemy=>{
  if(!owner||!guard||!geometry||!boss||boss!==installed||
      boss.type!==EnemyType.BOSS_ARCHITECT||
      boss.architectBossIdentity!=="BLACKOUT_ARCHITECT"||
      boss.bossChassis!==undefined||boss.infiniteBossIdentity!==undefined||
      geometry.boss!==boss||geometry.guard!==guard||
      geometry.mode!=="DEV_QA_PHYSICAL_GEOMETRY_NO_HITS"||
      !owner.isCurrent(guard,boss,installed,enemies)||
      !validNumber(boss.health)||!validNumber(boss.maxHealth)||
      boss.health<=0||boss.health>boss.maxHealth||boss.maxHealth<=0||
      !Array.isArray(geometry.anchors)||geometry.anchors.length!==4) return false;
  const ids=new Set<string>();
  for(const anchor of geometry.anchors){
    if(!anchor||!["NORTH","EAST","SOUTH","WEST"].includes(anchor.id)||
       ids.has(anchor.id)||!validNumber(anchor.health)||
       !validNumber(anchor.maxHealth)||anchor.maxHealth<=0||
       anchor.health<0||anchor.health>anchor.maxHealth||
       !validNumber(anchor.x)||!validNumber(anchor.y)||
       !validNumber(anchor.radius)||anchor.radius<=0) return false;
    ids.add(anchor.id);
  }
  return ids.size===4;
};
const phaseOf=(boss:Enemy,geometry:Readonly<BlackoutArchitectDevQaCardinalGeometry>):ArchitectQaDirectorPhase=>{
  // Core is eligible for real damage only after four actual anchors are gone.
  if(geometry.anchors.some(a=>a.health>0))return 1;
  const fraction=boss.health/boss.maxHealth;
  return fraction<=BLACKOUT_ARCHITECT_DEV_QA_DIRECTOR_CONFIG.thresholdPhase3?3:
    fraction<=BLACKOUT_ARCHITECT_DEV_QA_DIRECTOR_CONFIG.thresholdPhase2?2:1;
};

export const createBlackoutArchitectDevQaPatternDirector=(
  owner:BlackoutArchitectEngineIdentityLifecycleOwner|null,
  guard:Readonly<BlackoutArchitectEngineIdentityGuard>|null,
  geometry:Readonly<BlackoutArchitectDevQaCardinalGeometry>|null,
  boss:Enemy|null,installed:Enemy|null,enemies:readonly Enemy[],
  pattern:ArchitectQaDirectorPattern,
  sourceCycle:number,
  currentHull:number,
  explicitDevQa:boolean,
):BlackoutArchitectDevQaPatternDirectorState|null=>{
  try{
    if(explicitDevQa!==true||
       !attested(owner,guard,geometry,boss,installed,enemies)||
       !isPattern(pattern)||!validCycle(sourceCycle)||
       !validNumber(currentHull)||currentHull<=0||currentHull>100)return null;
    const phase=phaseOf(boss,geometry!);
    if(!(patterns[phase] as readonly string[]).includes(pattern))return null;
    return Object.seal({
      mode:"DEV_QA_ARCHITECT_REAL_PATTERN_DIRECTOR" as const,
      boss,guard:guard!,geometry:geometry!,
      pattern,phase,sourceCycle,
      qaHullHealth:currentHull,seenCoreHp:boss.health,
    });
  }catch{return null;}
};

/** Consume ONLY an actual authenticated physical attack's completed step event.
 * Handoff is allowed solely after RECOVERY finishes into a new TELEGRAPH cycle.
 * The cumulative DEV QA hull can never increase or be reset by new states.
 */
export const stepBlackoutArchitectDevQaPatternDirector=(
  owner:BlackoutArchitectEngineIdentityLifecycleOwner|null,
  guard:Readonly<BlackoutArchitectEngineIdentityGuard>|null,
  geometry:Readonly<BlackoutArchitectDevQaCardinalGeometry>|null,
  state:BlackoutArchitectDevQaPatternDirectorState|null,
  currentState:BlackoutArchitectDevQaPatternDirectorState|null,
  boss:Enemy|null,installed:Enemy|null,enemies:readonly Enemy[],
  selectedPattern:ArchitectQaDirectorPattern,
  observed:Readonly<ArchitectQaDirectorAttackObservation>|null,
):Readonly<ArchitectQaDirectorStepResult>|null=>{
  try{
    if(!state||state!==currentState||!observed||
       !attested(owner,guard,geometry,boss,installed,enemies)||
       state.mode!=="DEV_QA_ARCHITECT_REAL_PATTERN_DIRECTOR"||
       state.boss!==boss||state.guard!==guard||state.geometry!==geometry||
       !isPattern(state.pattern)||state.pattern!==selectedPattern||
       ![1,2,3].includes(state.phase)||!validCycle(state.sourceCycle)||
       !validNumber(state.qaHullHealth)||state.qaHullHealth<=0||state.qaHullHealth>100||
       !validNumber(state.seenCoreHp)||state.seenCoreHp<boss.health||
       observed.qaHullDepleted!==(observed.qaHullHealth===0)||
       !validNumber(observed.qaHullHealth)||observed.qaHullHealth<=0||
       observed.qaHullHealth>state.qaHullHealth||
       !validCycle(observed.cycle)||
       (observed.phase!=="TELEGRAPH"&&observed.phase!=="ACTIVE"&&
        observed.phase!=="RECOVERY"))return null;
    const nextPhase=phaseOf(boss,geometry!);
    if(nextPhase<state.phase||
       !(patterns[nextPhase] as readonly string[]).includes(state.pattern))return null;
    let nextPattern:ArchitectQaDirectorPattern|null=null;
    if(observed.cycle===state.sourceCycle){
      // Same active physical cycle: no pattern handoff.
    }else if(observed.cycle===state.sourceCycle+1&&observed.phase==="TELEGRAPH"){
      const options=patterns[nextPhase] as readonly ArchitectQaDirectorPattern[];
      const at=options.indexOf(state.pattern);
      if(at<0)return null;
      const upcoming=options[(at+1)%options.length];
      if(upcoming!==state.pattern)nextPattern=upcoming;
      state.pattern=upcoming;
      // A new physical attack starts at cycle 1; retained source cycles
      // progress normally if the single eligible pattern did not change.
      state.sourceCycle=nextPattern?1:observed.cycle;
    }else return null;
    state.phase=nextPhase;
    state.qaHullHealth=observed.qaHullHealth;
    state.seenCoreHp=boss.health;
    return Object.freeze({
      phase:state.phase,pattern:state.pattern,nextPattern,
      qaHullHealth:state.qaHullHealth,sourceCycle:state.sourceCycle,
    });
  }catch{return null;}
};