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
  shieldMod: number;       // e.g. +0.25 (resistencia)
  damageMod: number;       // e.g. -0.10
  projSpeedMod: number;    // e.g. +0.15
  critChanceMod: number;   // e.g. +0.20
  speedMod: number;        // e.g. -0.10 (player movement speed multiplier)
}

export enum OrbiType {
  FOTON = "FOTON",
  AURA = "AURA",
  PULSE = "PULSE",
  SHIELD = "SHIELD",
  BEAM = "BEAM",
  ECHO = "ECHO",
  SOLAR_GUARDIAN = "SOLAR_GUARDIAN", // Fusion Unit
  HYDRO_LEVIATHAN = "HYDRO_LEVIATHAN" // Fusion Unit
}

export interface OrbiMember {
  id: string;
  type: OrbiType; // preserved for compatibility
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  shootCooldown: number;
  affinity: "solar" | "hydro" | "wind" | "thermal" | "nuclear" | "quantum";
  combatRole: "beam" | "rapid" | "pulse" | "arc" | "shield" | "support";
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
  BOSS_DEVOURER = "BOSS_DEVOURER"
}

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
  pulseCooldown: number; // for disruptor or bosses
  contactDamageCooldown: number;
  isDead: boolean;
  isBoss: boolean;
  bossPhase?: number;
  flashTicks: number; // For white hit flashing animation
  slowTimer?: number; // Hydro slow effect timer
  isMinion?: boolean; // If split from Splitter or spawned as support
  chargeTimer?: number; // Universal attack/charge telegraph timer
  milestoneKind?: "MINIBOSS" | "BOSS_REMATCH";
  milestoneId?: string;
  milestoneMovementSpeedMultiplier?: number;
  milestoneContactDamageMultiplier?: number;
  milestoneDamageMultiplier?: number;
  milestoneAttackRateMultiplier?: number;
  milestoneRewardMultiplier?: number;
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
  affinity?: "solar" | "hydro" | "wind" | "thermal" | "nuclear" | "quantum";
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
  orbiAffinity?: "solar" | "hydro" | "wind" | "thermal" | "nuclear" | "quantum";
  orbiCombatRole?: "beam" | "rapid" | "pulse" | "arc" | "shield" | "support";
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
  name: string; // compatibility alias for displayName
  displayName: string;
  subtitle: string;
  description: string;
  tacticalAdvice: string;

  duration: number; // in milliseconds
  enemyBudget: number;
  spawnInterval: number; // in frames
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

