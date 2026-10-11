export enum BiomeType {
  SOLAR_PLAINS = "SOLAR_PLAINS",
  DEEP_WATER = "DEEP_WATER",
  CYBER_VOID = "CYBER_VOID",
  ACID_SWAMP = "ACID_SWAMP",
  MAGMA_CHAMBER = "MAGMA_CHAMBER",
  QUANTUM_NEXUS = "QUANTUM_NEXUS"
}

export interface BiomeConfig {
  type: BiomeType;
  name: string;
  description: string;
  bgColor: string;
  gridColor: string;
  particleColor: string;
  enemySpawnRate: number;
  enemySpeedMultiplier: number;
  crystalValueMultiplier: number;
  nebulaColors: string[];
}

export enum FormationType {
  LINE = "LINE",
  CIRCLE = "CIRCLE",
  DELTA = "DELTA",
  SHIELD = "SHIELD",
  V_SHAPE = "V_SHAPE",
  SCATTERED = "SCATTERED"
}

export interface FormationConfig {
  type: FormationType;
  name: string;
  description: string;
  spacing: number;
  shieldMod: number;
  damageMod: number;
  projSpeedMod: number;
  critChanceMod: number;
  speedMod: number;
}

export enum OrbiType {
  FOTON = "FOTON",
  AURA = "AURA",
  PULSE = "PULSE",
  SHIELD = "SHIELD",
  BEAM = "BEAM",
  ECHO = "ECHO",
  SOLAR_GUARDIAN = "SOLAR_GUARDIAN",
  HYDRO_LEVIATHAN = "HYDRO_LEVIATHAN"
}

export type OrbiEnergyId =
  | "FOTON"
  | "HYDRO"
  | "AERO"
  | "TERMO"
  | "MAGNE"
  | "ATON"
  | "KINETRIX"
  | "H2NOVA"
  | "QUANTUM"
  | "GAIA";

export type OrbiAffinity =
  | "solar"
  | "hydro"
  | "wind"
  | "thermal"
  | "magnetic"
  | "nuclear"
  | "kinetic"
  | "hydrogen"
  | "quantum"
  | "gaia";

export type OrbiCombatRole =
  | "beam"
  | "rapid"
  | "pulse"
  | "arc"
  | "shield"
  | "support";

export type OrbiAttackSignature =
  | "FOTON_LANCE"
  | "HYDRO_PULSE"
  | "AERO_CRESCENT"
  | "TERMO_BURST"
  | "MAGNE_ARC"
  | "ATON_PARTICLE"
  | "KINETRIX_LANCE"
  | "H2NOVA_CELL"
  | "QUANTUM_PHASE"
  | "GAIA_SYNTHESIS";

export type OrbiAttackShape =
  | "LANCE"
  | "RIPPLE"
  | "CRESCENT"
  | "PLASMA"
  | "ARC"
  | "PARTICLE"
  | "KINETIC"
  | "CELL"
  | "PHASE"
  | "SYNTHESIS";

export interface OrbiMember {
  id: string;
  type: OrbiType;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  shootCooldown: number;
  affinity: OrbiAffinity;
  combatRole: OrbiCombatRole;
  energyId?: OrbiEnergyId;
  attackSignature?: OrbiAttackSignature;
  personality: string;
  evolutionStage: number;
  level: number;
  xp: number;
  recoilX?: number;
  recoilY?: number;
  flashTicks?: number;
  distToLeader?: number;
}

export enum EnemyType {
  CRAWLER = "CRAWLER",
  PARASITE = "PARASITE",
  DRONE = "DRONE",
  SPLITTER = "SPLITTER",
  DISRUPTOR = "DISRUPTOR",
  BLACKOUT_ELITE = "BLACKOUT_ELITE",
  RIFT_HUNTER = "RIFT_HUNTER",
  SIEGE_PRISM = "SIEGE_PRISM",
  SWARM_REAVER = "SWARM_REAVER",
  VOID_ANCHOR = "VOID_ANCHOR",
  MINE_WEAVER = "MINE_WEAVER",
  MIRROR_WARDEN = "MIRROR_WARDEN",
  BOSS_DEVOURER = "BOSS_DEVOURER",
  BOSS_TITAN = "BOSS_TITAN",
  BOSS_WORM = "BOSS_WORM"
}

export type EvolvedEnemyVariantId =
  | "BULWARK_CRAWLER"
  | "PHASE_PARASITE"
  | "LANCE_DRONE"
  | "BROOD_SPLITTER"
  | "NULL_DISRUPTOR"
  | "OVERDRIVE_ELITE";

export type EvolvedEnemySignature =
  | "ARMORED_MOMENTUM"
  | "PHASE_LUNGE"
  | "LANCE_VOLLEY"
  | "BROOD_RELEASE"
  | "NULL_PULSE"
  | "OVERDRIVE_CHARGE";

export type InfiniteBossIdentity =
  | "DEVOURER_ASCENDANT"
  | "NULL_ARCHITECT"
  | "RIFT_MATRIARCH"
  | "SIEGE_CATHEDRAL";

export type BossChassisId = "DEVOURER" | "TITAN_CORE" | "WORM_SEGMENTS";
export type BossEncounterStage = "PRIMARY" | "RAID_ESCALATION";

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  speed: number;
  size: number;
  color: string;
  shootCooldown: number;
  pulseCooldown: number;
  contactDamageCooldown: number;
  isDead: boolean;
  isBoss: boolean;
  bossPhase?: number;
  flashTicks: number;
  slowTimer?: number;
  isMinion?: boolean;
  chargeTimer?: number;
  milestoneKind?: "MINIBOSS" | "BOSS_REMATCH";
  milestoneId?: string;
  infiniteBossIdentity?: InfiniteBossIdentity;
  bossChassis?: BossChassisId;
  bossEncounterStage?: BossEncounterStage;
  milestoneSector?: number;
  milestoneMovementSpeedMultiplier?: number;
  milestoneContactDamageMultiplier?: number;
  milestoneDamageMultiplier?: number;
  milestoneAttackRateMultiplier?: number;
  milestoneRewardMultiplier?: number;
  evolvedVariantId?: EvolvedEnemyVariantId;
  evolvedSignature?: EvolvedEnemySignature;
  evolvedContactDamageMultiplier?: number;
  evolvedAttackRateMultiplier?: number;
  evolvedProjectileSpeedMultiplier?: number;
  evolvedRewardMultiplier?: number;
  evolvedSpecialIntensity?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  color: string;
  size: number;
  fromPlayer: boolean;
  life: number;
  maxLife: number;
  affinity?: OrbiAffinity;
  energyId?: OrbiEnergyId;
  attackSignature?: OrbiAttackSignature;
  attackShape?: OrbiAttackShape;
  rotation?: number;
  pushMultiplier?: number;
  slowDurationMs?: number;
  splashRadius?: number;
  splashDamageMultiplier?: number;
  magneticPullRadius?: number;
  magneticPullStrength?: number;
  supportShieldRestore?: number;
  isCriticalShot?: boolean;
}

export interface Resource {
  id: string;
  type: "NANO" | "ENERGY" | "ORBI" | "FUSION_STAR";
  x: number;
  y: number;
  size: number;
  color: string;
  amount: number;
  orbiType?: OrbiType;
  orbiAffinity?: OrbiAffinity;
  orbiCombatRole?: OrbiCombatRole;
  orbiEnergyId?: OrbiEnergyId;
  orbiAttackSignature?: OrbiAttackSignature;
  consumed?: boolean;
  spawnTime?: number;
}

export enum ParticleType {
  RESOURCE_PICKUP,
  ENEMY_HIT,
  ENEMY_DESTROYED,
  PLAYER_DAMAGE,
  SWARM_RECRUIT,
  FORMATION_CHANGE,
  FUSION,
  BIOME_PORTAL,
  BOSS_ENTRY,
  BOSS_DEFEATED
}

export interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation?: number;
  rotSpeed?: number;
  drag?: number;
  gravity?: number;
  glow?: boolean;
}

export type WaveModifier =
  | "MULTI_DIRECTIONAL_SPAWN"
  | "PARASITE_SPEED_SURGE"
  | "DRONE_TARGETING_DENSITY"
  | "BLACKOUT_HAZARD_ZONES"
  | "DISRUPTION_INTENSITY"
  | "ELITE_SUPPORT"
  | "CORE_DROP_BOOST"
  | "FINAL_SIEGE";

export interface WaveConfig {
  waveNumber: number;
  id: string;
  name: string;
  displayName: string;
  subtitle: string;
  description: string;
  tacticalAdvice: string;
  duration: number;
  enemyBudget: number;
  spawnInterval: number;
  maxConcurrentEnemies: number;
  enemyComposition: EnemyType[];
  eliteChance: number;
  environmentalModifier?: WaveModifier;
  recommendedFormation?: FormationType;
  introColor: string;
  warningLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  resourceMultiplier: number;
  difficultyMultiplier: number;
}

export enum QualityPreset {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  ULTRA = "ULTRA"
}

export type RunArchiveOutcome =
  | "DEFEAT"
  | "CAMPAIGN_CLEARED";

export type RunArchiveAffinity =
  | OrbiAffinity
  | "none";

export type RunArchiveFormation =
  | FormationType
  | "none";

export interface RunArchiveEntry {
  runId: string;
  completedAt: string;
  outcome: RunArchiveOutcome;
  score: number;
  campaignWaveReached: number;
  infiniteSectorReached?: number;
  infiniteWaveReached?: number;
  durationMs: number;
  enemiesDestroyed: number;
  maxSwarmSize: number;
  strongestAffinity: RunArchiveAffinity;
  mostUsedFormation: RunArchiveFormation;
  temporaryBuild: Record<string, number>;
}

export interface GameStats {
  highScore: number;
  bestWave: number;
  bestSwarmSize: number;
  totalRuns: number;
  totalVictories: number;
  totalEnemiesDestroyed: number;
  totalResourcesCollected: number;
  totalNanoCredits: number;
  totalPurifiedEnergy: number;
  bossDefeated: boolean;
  gameMemories: string[];
  audioMuted: boolean;
  qualityPreset: QualityPreset;
  tutorialCompleted: boolean;
  screenShakeMode: "FULL" | "REDUCED" | "OFF";
  flashIntensity: "FULL" | "REDUCED";
  coreLabelsMode: "FULL" | "PROXIMITY" | "MINIMAL";
  inputMode: "HYBRID" | "KEYBOARD" | "MOUSE_DRAG" | "CLICK TO MOVE";
  minimapMode: "FULL" | "COMPACT" | "OFF";
  discoveredThreats?: string[];
  bossAttempts?: number;
  bossVictories?: number;
  firstBossVictoryAt?: string;
  fastestBossVictory?: number;
  bestBossRemainingIntegrity?: number;
  preferredBossFormation?: string;
  bossLabelsMode?: "FULL" | "IMPORTANT" | "OFF";
  bossCodexSeenAttacks?: string[];
  bossCodexSeenPhases?: number[];
  bestInfiniteSector: number;
  bestInfiniteWave: number;
  infiniteMinibossesDefeated: number;
  infiniteBossRematchesDefeated: number;
  recentRunArchive: RunArchiveEntry[];
}

export interface DialogueMessage {
  id: string;
  sender: "FOTON" | "COMPANION" | "SYSTEM";
  text: string;
  timestamp: string;
}

export interface BossAttackDefinition {
  id: string;
  displayName: string;
  description: string;
  counterAdvice: string;
  telegraphDuration: number;
  cooldown: number;
  minimumPhase: number;
  weight: number;
  warningColor: string;
  audioCue: string;
}

export interface BossSummonRule {
  phase: number;
  enemyType: EnemyType;
  maxCount: number;
  cooldown: number;
}

export interface BossDefeatDefinition {
  visualDuration: number;
  explosionCount: number;
}

export interface BossDefinition {
  id: string;
  displayName: string;
  subtitle: string;
  maxHealth: number;
  phaseThresholds: number[];
  introDuration: number;
  arenaMode: string;
  attacks: BossAttackDefinition[];
  summonRules: BossSummonRule[];
  defeatSequence: BossDefeatDefinition;
}