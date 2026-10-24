import React, { useEffect, useRef, useState, useCallback } from "react";

import { 
  BiomeType, OrbiType, EnemyType, FormationType, ParticleType, 
  OrbiMember, Enemy, Projectile, Resource, Particle, GameStats, 
  DialogueMessage, QualityPreset, WaveConfig, type RunArchiveEntry,
  type OrbiAffinity, type OrbiCombatRole, type OrbiEnergyId, type BossEncounterStage
} from "./types";

import { projectPanoramicCanvasViewport } from "./panoramicCanvasViewport";
import { projectImmersiveBattlefieldMode } from "./immersiveBattlefieldPolicy";
import { nonNegativeAnimationFrameDelta } from "./animationFrameDelta";
import { 
  CANVAS_HEIGHT, WORLD_WIDTH, WORLD_HEIGHT, MAX_ENEMIES, 
  MAX_PROJECTILES, MAX_RESOURCES, PLAYER_BASE_SPEED, 
  PLAYER_HIT_COOLDOWN, SHIELD_MAX, WORLD_BOUNDS, UPGRADE_REWARD_WAVES
} from "./constants";

import { 
  loadGameStats, saveGameStats, resetGameStats, DEFAULT_STATS 
} from "./storage";

import { FORMATIONS, calculateSwarmOffset } from "./formations";
import { getBiomeConfig, BIOME_ROTATION } from "./biomes";
import { getQualityConfig } from "./quality";
import { compactArrayInPlace } from "./arrayCompaction";
import { nextBlackoutArchitectCollisionTraceOrdinal } from "./blackoutArchitectCollisionTraceOrdinal";
import { observeBlackoutArchitectLegacyPlayerHit } from "./blackoutArchitectLegacyHitObservation";
import {
  revokeBlackoutArchitectDormantEncounter,
  type BlackoutArchitectDormantEncounterSlot,
} from "./blackoutArchitectDormantEncounterRevocation";
import {
  createBlackoutArchitectEngineIdentityLifecycleOwner,
  type BlackoutArchitectEngineIdentityGuard,
} from "./blackoutArchitectEngineIdentityLifecycle";
import { createBlackoutArchitectDevQaBoss } from "./blackoutArchitectDevQaBossFactory";
import {
  createBlackoutArchitectDevQaCardinalGeometry,
  type BlackoutArchitectDevQaCardinalGeometry,
} from "./blackoutArchitectDevQaCardinalGeometry";
import { resolveBlackoutArchitectDevQaCardinalImpact } from "./blackoutArchitectDevQaCardinalImpact";
import { resolveBlackoutArchitectDevQaCoreImpact } from "./blackoutArchitectDevQaCoreImpact";
import { stepBlackoutArchitectDevQaFotonMovement } from "./blackoutArchitectDevQaFotonMovement";
import {
  createBlackoutArchitectDevQaGridLockState,
  stepBlackoutArchitectDevQaGridLock,
  BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG,
  type BlackoutArchitectDevQaGridLockState,
} from "./blackoutArchitectDevQaGridLockAttack";
import {
  createBlackoutArchitectDevQaVectorTideState,
  stepBlackoutArchitectDevQaVectorTide,
  BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG,
  type BlackoutArchitectDevQaVectorTideState,
} from "./blackoutArchitectDevQaVectorTideAttack";
import {
  createBlackoutArchitectDevQaSectorWallState,
  stepBlackoutArchitectDevQaSectorWall,
  BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG,
  type BlackoutArchitectDevQaSectorWallState,
} from "./blackoutArchitectDevQaSectorWallAttack";
import {
  createBlackoutArchitectDevQaPatternDirector,
  stepBlackoutArchitectDevQaPatternDirector,
  type ArchitectQaDirectorPattern,
  type ArchitectQaDirectorAttackObservation,
  type BlackoutArchitectDevQaPatternDirectorState,
} from "./blackoutArchitectDevQaPatternDirector";
import { projectBlackoutArchitectDevQaBattleHud } from "./blackoutArchitectDevQaBattleHud";
import { projectBlackoutArchitectDevQaTouchAccess } from "./blackoutArchitectDevQaTouchAccess";
import {
  countActiveEvolvedEnemies,
  countLivingEnemies,
  countLivingStandardEnemies,
  countMinionsOfType,
} from "./enemyCounts";
import {
  ENEMY_SPATIAL_CELL_SIZE,
  buildSpatialIndex,
  findAllCollidingSpatialItems,
  findFirstCollidingSpatialItem,
  findNearestSpatialItem,
  insertSpatialIndexEntry,
  relocateSpatialIndexEntry,
  type SpatialIndex,
} from "./spatialIndex";
import {
  triggerExplosion,
  updateParticle,
  drawParticle,
  pushParticleWithinBudget,
} from "./particleSystem";
import { backgroundRenderer } from "./backgroundRenderer";
import { getWaveConfig, INTER_WAVE_DURATION, BOSS_WAVE_NUMBER, BLACKOUT_DEVOURER_CANON } from "./waveDirector";
import {
  advanceInfiniteRuntimeState,
  createCampaignRuntimeState,
  createInfiniteRuntimeState,
  getRuntimeSector,
  getRuntimeWaveNumber,
  type RuntimeProgressionState,
} from "./runtimeProgressionRouter";
import {
  isRuntimeWaveComplete,
  shouldTickRuntimeTimer,
} from "./runtimeCompletionPolicy";
import {
  createRuntimeProjectionBundleCache,
  getCachedRuntimeProjectionBundle,
  type RuntimeProjectionBundleCache,
} from "./runtimeProjectionBundleCache";
import {
  resolveScoreAttackLiveEngineActivation,
  resolveScoreAttackLiveRuntimeProjection,
  resolveScoreAttackLiveTerminalApplication,
  type ScoreAttackLiveEngineActivation,
  type ScoreAttackLiveEngineStartMode,
} from "./scoreAttackLiveEngineLifecycle";
import { resolveEvolvedEnemySpawn } from "./runtimeEnemyEvolution";
import { resolveRuntimeTacticalEnemySpawn } from "./runtimeTacticalEnemyAdoption";
import { createEnemySignatureBehaviorCache } from "./enemySignatureBehaviorCache";
import {
  getReducedVisibilityOverlayProfile,
  getResourceFieldProfile,
} from "./runtimeEnvironmentalFields";
import {
  getEclipseEnemyMovementMultiplier,
  getEclipseSolarCooldownRecoveryMultiplier,
} from "./runtimeEclipse";
import {
  createElectricalStormRuntimeState,
  getElectricalStormConfig,
  stepElectricalStormRuntime,
} from "./runtimeElectricalStorm";
import type { InfiniteMilestoneEncounterProfile } from "./runtimeMilestoneEncounter";
import {
  getInfiniteBossAttackWeight,
  getInfiniteBossFamilyProfile,
} from "./infiniteBossFamily";
import {
  getBossChassisAttackWeight,
  getBossChassisProfile,
} from "./bossChassis";
import {
  createWormSegmentChain,
  stepWormSegmentChainInPlace,
} from "./wormSegmentPhysics";
import { resolveBossRematchDefeatAction } from "./infiniteRaidEscalation";
import {
  createRuntimeMinibossGateState,
  markRuntimeMinibossSpawned,
  requestRuntimeMinibossSpawn,
  stepRuntimeMinibossGate,
  syncRuntimeMinibossGate,
} from "./runtimeMinibossGate";
import {
  createRuntimeBossRematchGateState,
  isRuntimeBossRematchResolved,
  markRuntimeBossRematchDefeated,
  markRuntimeBossRematchSpawned,
  requestRuntimeBossRematch,
  stepRuntimeBossRematchGate,
  syncRuntimeBossRematchGate,
} from "./runtimeBossRematchGate";
import {
  createFrameHealthState,
  resetFrameHealthState,
  stepFrameHealthMonitor,
  type FrameHealthState,
} from "./frameHealthMonitor";
import {
  applyCampaignVictoryCheckpoint,
  applyFinalRunCommit,
  applyInfiniteMilestoneRecord,
  applyInfiniteProgressRecord,
  createRunCommitLedger,
  type CampaignVictoryCheckpointInput,
  type RunCommitLedger,
} from "./runPersistence";
import { beginInfiniteAfterCampaignVictory } from "./campaignInfiniteHandoff";
import { MID_RUN_UPGRADES, UpgradeDefinition, generateUpgradeChoices } from "./upgrades";

import { 
  playShootSound, playEnemyShootSound, playDamageSound, playEnemyExplodeSound, 
  playRecruitSound, playCrystalSound, playBiomeChangeSound, playClickSound, 
  playPauseSound, playUnpauseSound, playGameOverSound, playVictorySound, 
  setMuteState, initAudio, startBgm, stopBgm,
  playDroneChargeSound, playDisruptorChargeSound, playEliteChargeSound,
  playDisruptorPulseSound, playHeavyImpactSound, playShieldDeflectSound,
  playCriticalHitSound,
  playBossArrivalSound, playBossPhaseTransitionSound, playBossChargeSound,
  playBossShardsSound, playBossPulseSound, playOverdriveActivationSound
} from "./audio";

import { 
  EnergySwarmCanvas, drawFoton, drawSwarmRoster, drawResources, 
  drawEnemiesList, drawProjectilesList, drawWormSegmentChain
} from "./EnergySwarmCanvas";
import { projectFlashAccessibility } from "./flashAccessibility";
import { projectBossPursuit } from "./bossPursuit";
import {
  DEFAULT_PHOTO_FILTER_ID,
  cyclePhotoFilter,
  type PhotoFilterId,
} from "./photoMode";
import {
  decayFrameTicks,
  projectFrameDamping,
  projectFrameProbability,
  stepCadenceAccumulator,
} from "./runtimeCadence";

import { StartScreen } from "../components/StartScreen";
import { GameHud } from "../components/GameHud";
import { PauseMenu } from "../components/PauseMenu";
import { ResultScreen } from "../components/ResultScreen";
import { CompanionPanel } from "../components/CompanionPanel";
import { UpgradeSelector } from "../components/UpgradeSelector";
import { MobileTouchOverlay } from "../components/MobileTouchOverlay";
import { WebPhotoReturn } from "../components/WebPhotoReturn";
import { MobileFormationCarousel } from "../components/MobileFormationCarousel";
import { OrientationHint } from "../components/OrientationHint";
import { useViewportComposition } from "../components/useViewportComposition";
import { BossHudOverlay } from "../components/BossHudOverlay";
import { PhotoModeOverlay } from "../components/PhotoModeOverlay";
import { shouldPauseForLifecycle, shouldResetFrameClock, type LifecycleSignal } from "./lifecyclePolicy";
import {
  createPerformanceDiagnosticsState,
  stepPerformanceDiagnostics,
  type PerformanceDiagnosticsSnapshot,
  type PerformanceDiagnosticsState,
} from "./performanceDiagnostics";
import PerformanceDiagnosticsOverlay from "../components/PerformanceDiagnosticsOverlay";
import { createTouchDirectionState, getTouchMovementVector } from "./touchControls";
import { projectAnalogMotion, type AnalogVector } from "./analogJoystick";
import {
  FOTON_THREAT_REFRESH_MS,
  projectFotonThreatDirection,
  selectFotonThreat,
} from "./fotonThreatTracking";
import {
  createShuffledCollectibleEnergyCycle,
  getCollectibleEnergyDefinition,
  getOrbiEnergyByAffinity,
  getOrbiEnergyDefinition,
} from "./orbiEnergyCanon";
import {
  getFallbackAttackSignatureForAffinity,
  getOrbiAttackProfile,
} from "./orbiAttackProfiles";
import {
  applyAffinityFusion,
  consumeAffinityFusionEnergy,
  resolveAffinityFusion,
} from "./affinityFusionDirector";
import {
  GAIA_REQUIRED_ENERGY_COUNT,
  createGaiaEvolutionState,
  getGaiaCombatScale,
  getGaiaProgressCount,
  registerGaiaEnergy,
} from "./gaiaEvolution";
// EVO8 activation: keep local call-site names for the existing gameplay path
// while replacing the unreachable legacy level-10 capacity threshold.
import {
  createEvo8SwarmDoctrine as createSwarmDoctrineState,
  getEvo8SwarmCapacity as getSwarmDoctrineCapacity,
  promoteEvo8Founder as registerSwarmDoctrineLevel,
  registerEvo8Founder as registerSwarmDoctrineMember,
} from "./evo8SwarmDoctrine";
import {
  applyMatchingEnergyCore,
  getEvo8VisualStage,
  acquisitionsForLevel,
  type OrbiEvolutionLevel,
} from "./orbiEvolution";
import {
  applyCombatResonanceDamageBreak,
  createCombatResonanceState,
  expireCombatChain,
  projectCombatResonance,
  registerCombatResonanceDefeat,
} from "./combatResonance";
import {
  activateCombatOverdrive,
  advanceCombatOverdrive,
  createCombatOverdriveState,
  projectCombatOverdrive,
} from "./combatOverdrive";
import { projectCombatOverdriveEffects } from "./combatOverdriveEffects";
import { projectCombatOverdrivePresentation } from "./combatOverdrivePresentation";
import {
  createLiveEnemyFormationDirectorState,
  projectLiveEnemyFormationMotion,
  requestLiveEnemyFormationSpawn,
} from "./liveEnemyFormationDirector";
import {
  resolveLiveCommandLinkBreakIntent,
  shouldDetachCommandLinkMember,
  type LiveCommandLinkBreakIntent,
} from "./liveCommandLinkBreakApplication";
import {
  projectLiveCommandLinkPulseTarget,
  resolveLiveCommandLinkPulseIntent,
  type LiveCommandLinkPulseIntent,
} from "./liveCommandLinkPulseApplication";
import {
  LIVE_SIEGE_VOLLEY_FIRE_RANGE,
  acknowledgeLiveSiegeVolleyShot,
  stepLiveSiegeVolley,
} from "./liveSiegeVolleyIntegration";
import {
  drawCombatOverdriveFieldOverlay,
  drawCombatOverdriveSwarmHalo,
} from "./combatOverdrivePresentationRenderer";
import {
  PERFORMANCE_EVIDENCE_TARGET_SAMPLES,
  appendPerformanceEvidenceSample,
  buildPerformanceEvidenceCapture,
  createPerformanceEvidenceRecorderState,
  downloadPerformanceEvidence,
  getBrowserPerformanceEvidenceMetadata,
  startPerformanceEvidenceRecording,
  type PerformanceEvidenceRecorderStatus,
} from "./performanceEvidenceRecorder";

type InfiniteBossRematchProfile = Extract<
  InfiniteMilestoneEncounterProfile,
  { kind: "BOSS_REMATCH" }
>;

export const EnergySwarmGame: React.FC = () => {
  const viewportProfile = useViewportComposition();
  const {
    webLandscape: immersiveWebLandscape,
    immersive: immersiveLandscapeMode,
  } = projectImmersiveBattlefieldMode(viewportProfile);
  const [browserFullscreen, setBrowserFullscreen] = useState(false);
  const [browserFullscreenAvailable, setBrowserFullscreenAvailable] = useState(false);
  useEffect(() => {
    const sync = () => {
      setBrowserFullscreen(Boolean(document.fullscreenElement));
      setBrowserFullscreenAvailable(Boolean(document.fullscreenEnabled));
    };
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const toggleBrowserFullscreen = useCallback(() => {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);
  // Shared visual viewport + reserved compact HUD: camera, Canvas and
  // pointer projection must always use the same geometry.
  const panoramicViewport = projectPanoramicCanvasViewport({
    width: viewportProfile.width,
    height: viewportProfile.height,
    immersive: immersiveLandscapeMode,
  });

  // --- REACT VIEWPORT GAME STATES (Low-frequency updates) ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [photoHintVisible, setPhotoHintVisible] = useState(false);
  const [photoFilterId, setPhotoFilterId] = useState<PhotoFilterId>(
    DEFAULT_PHOTO_FILTER_ID,
  );
  const [performanceDiagnosticsEnabled, setPerformanceDiagnosticsEnabled] =
    useState(false);
  const [
    performanceDiagnosticsSnapshot,
    setPerformanceDiagnosticsSnapshot,
  ] = useState<PerformanceDiagnosticsSnapshot | null>(null);
  const [performanceEvidenceStatus, setPerformanceEvidenceStatus] =
    useState<PerformanceEvidenceRecorderStatus>("IDLE");
  const [performanceEvidenceSamples, setPerformanceEvidenceSamples] =
    useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  // Diagnostic visibility exists only in development; not a public boss mode.
  const [architectQaVisible, setArchitectQaVisible] = useState(false);
  const [, refreshArchitectQaTouchControls] = useState(0);
  const [architectQaDefeatVisible, setArchitectQaDefeatVisible] = useState(false);
  const [architectQaLossVisible, setArchitectQaLossVisible] = useState(false);
  const [victory, setVictory] = useState(false);
  const [presentationMode, setPresentationMode] =
    useState<ScoreAttackLiveEngineStartMode>("CAMPAIGN");

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [nanoCredits, setNanoCredits] = useState(0);
  const [swarmSize, setSwarmSize] = useState(1);
  const [currentWave, setCurrentWave] = useState(1);
  const [waveName, setWaveName] = useState("PREPARATION SIGNAL");
  const [isWaveBreak, setIsWaveBreak] = useState(true);
  const [waveBreakTimeLeft, setWaveBreakTimeLeft] = useState(8);
  const [activeBiome, setActiveBiome] = useState<BiomeType>(BiomeType.SOLAR_PLAINS);
  const [activeFormation, setActiveFormation] = useState<FormationType>(FormationType.LINE);
  const [audioMuted, setAudioMuted] = useState(false);
  const [combatResonanceView, setCombatResonanceView] = useState(() => {
    const initialState = createCombatResonanceState();
    return {
      chain: initialState.chain,
      resonance: initialState.resonance,
      ...projectCombatResonance(initialState),
    };
  });
  const [combatOverdriveView, setCombatOverdriveView] = useState(() =>
    projectCombatOverdrive(createCombatOverdriveState(), 0, false),
  );

  // Stats persisting
  const [stats, setStats] = useState<GameStats>({ ...DEFAULT_STATS });
  const [upgradesLevel, setUpgradesLevel] = useState<Record<string, number>>({
    hydrogen_deflector: 0,
    quantum_core: 0,
    fusion_resonator: 0,
    nano_catalyst: 0,
    mitosis_relic: 0
  });

  // LUX-8 Dialogue Feed
  const [dialogueLog, setDialogueLog] = useState<DialogueMessage[]>([]);

  // Laptop Cockpit & Threat Intel states
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"closed" | "estado" | "tactica" | "equipo">("closed");
  const [activeThreatIntel, setActiveThreatIntel] = useState<EnemyType | null>(null);

  // Mid-run upgrades states
  const [activeRunUpgrades, setActiveRunUpgrades] = useState<Record<string, number>>({});
  const [isUpgradeSelectionOpen, setIsUpgradeSelectionOpen] = useState(false);
  const [upgradeChoices, setUpgradeChoices] = useState<UpgradeDefinition[]>([]);
  const [rerollsRemaining, setRerollsRemaining] = useState(1);
  const [wasRerollUsed, setWasRerollUsed] = useState(false);
  const [waveIntroConfig, setWaveIntroConfig] = useState<WaveConfig | null>(null);

  // Boss HUD React states
  const [bossHp, setBossHp] = useState(1500);
  const [bossMaxHp, setBossMaxHp] = useState(1500);
  const [bossPhase, setBossPhase] = useState(1);
  const [bossAttackName, setBossAttackName] = useState<string | null>(null);
  const [bossShieldNodes, setBossShieldNodes] = useState<number>(0);
  const [isCoreExposed, setIsCoreExposed] = useState(false);
  const [bossIntroTime, setBossIntroTime] = useState<number | null>(null);
  const [bossTransitionName, setBossTransitionName] = useState<string | null>(null);


  // --- HIGH-FREQUENCY GAME ENGINE REF BUFFERS (Avoid re-renders) ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loopActiveRef = useRef(false);
  const suspendedFrameRenderedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const timeElapsedRef = useRef(0);
  const performanceDiagnosticsEnabledRef = useRef(false);
  const performanceDiagnosticsStateRef =
    useRef<PerformanceDiagnosticsState>(
      createPerformanceDiagnosticsState(),
    );
  const performanceEvidenceRecorderRef = useRef(
    createPerformanceEvidenceRecorderState(),
  );
  const isPausedRef = useRef(false);
  const touchDirectionsRef = useRef(createTouchDirectionState());
  const analogJoystickRef = useRef<AnalogVector>({ x: 0, y: 0 });

  const setPausedState = useCallback((nextPaused: boolean) => {
    isPausedRef.current = nextPaused;
    if (nextPaused) {
      touchDirectionsRef.current = createTouchDirectionState();
      analogJoystickRef.current = { x: 0, y: 0 };
    }
    setIsPaused(nextPaused);
  }, []);

  const playerPosRef = useRef({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 });
  const pointerRef = useRef({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 });
  const playerFlashRef = useRef(0);
  const invincibilityTimerRef = useRef(0);
  const shieldRef = useRef(100);
  const scoreRef = useRef(0);
  const nanoCreditsRef = useRef(0);
  const fusionEnergyRef = useRef(0);
  const combatResonanceRef = useRef(createCombatResonanceState());
  const combatOverdriveRef = useRef(createCombatOverdriveState());

  const keysPressedRef = useRef<Record<string, boolean>>({});
  const activeFormationRef = useRef<FormationType>(FormationType.LINE);

  // Entity Lists
  const swarmRef = useRef<OrbiMember[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  // Run/frame/shot metadata only; not authenticated collision evidence.
  const collisionTraceRunEpochRef = useRef<number | null>(0);
  const collisionTracePhysicsFrameRef = useRef<number | null>(0);
  const collisionTracePlayerShotRef = useRef<number | null>(0);
  const resourcesRef = useRef<Resource[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Wave Manager states inside refs
  const currentWaveRef = useRef(1);
  const runtimeProgressionRef = useRef<RuntimeProgressionState>(
    createCampaignRuntimeState(1),
  );
  const scoreAttackActivationRef =
    useRef<ScoreAttackLiveEngineActivation | null>(null);
  const waveActiveRef = useRef(false);
  const waveBudgetSpawnedRef = useRef(0);
  const waveTimeRemainingRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const waveBreakTimerRef = useRef(0);
  const enemyFormationDirectorRef = useRef(
    createLiveEnemyFormationDirectorState(),
  );
  const pendingCommandLinkBreakRef =
    useRef<LiveCommandLinkBreakIntent | null>(null);
  const pendingCommandLinkPulseRef =
    useRef<LiveCommandLinkPulseIntent | null>(null);

  // Boss Refs
  const bossActiveRef = useRef(false);
  const bossRef = useRef<Enemy | null>(null);
  // Inert, null-only Architect slot: never minted or hit-tested in B2B2A.
  const architectEncounterSlotRef = useRef<BlackoutArchitectDormantEncounterSlot>(null);
  // B2B2B2B2A: engine-private run epoch and ref guard, cold-only.
  // No genuine Architect admission is invoked until a future QA-only spawn.
  const architectEngineIdentityOwnerRef =
    useRef<ReturnType<typeof createBlackoutArchitectEngineIdentityLifecycleOwner> | null>(null);
  if (architectEngineIdentityOwnerRef.current === null) {
    architectEngineIdentityOwnerRef.current = createBlackoutArchitectEngineIdentityLifecycleOwner();
  }
  const architectQaBossRef = useRef<Enemy | null>(null);
  const architectQaGuardRef = useRef<Readonly<BlackoutArchitectEngineIdentityGuard> | null>(null);
  // Independent four-cardinal QA objects: never aliases of shieldNodesRef.
  const architectQaCardinalsRef = useRef<Readonly<BlackoutArchitectDevQaCardinalGeometry> | null>(null);
  // Exactly one developer QA projectile, held in the existing projectilesRef array.
  const architectQaShotRef = useRef<Projectile | null>(null);
  // C14: authentic DEV-only pointer kind observation, never used for damage.
  const architectQaLastPointerTypeRef = useRef<"touch" | "mouse" | "pen" | null>(null);
  // Only DEV QA owns this snapshot; restore camera upon every QA teardown.
  const architectQaCameraRestoreRef = useRef<{cameraX:number;cameraY:number} | null>(null);
  const architectQaGridLockRef = useRef<BlackoutArchitectDevQaGridLockState | null>(null);
  const architectQaVectorTideRef = useRef<BlackoutArchitectDevQaVectorTideState | null>(null);
  const architectQaSectorWallRef = useRef<BlackoutArchitectDevQaSectorWallState | null>(null);
  const architectQaDirectorRef = useRef<BlackoutArchitectDevQaPatternDirectorState | null>(null);
  const activeBossRematchProfileRef = useRef<InfiniteBossRematchProfile | null>(null);

  // High-frequency boss states
  const bossIntroTimeRef = useRef<number | null>(null); // introduction remaining time
  const bossAttackTimerRef = useRef<number>(200); // initial delay before first attack
  const bossCurrentAttackRef = useRef<string | null>(null); // active/charging attack ID
  const bossAttackTelegraphRef = useRef<number>(0); // charging ticker
  const bossAttackDurationRef = useRef<number>(0); // active action ticker
  const bossAttackAngleRef = useRef<number>(0); // sweep/rotation angle
  const bossAttackTargetPosRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 }); // coordinates for wells/beams
  const bossLastAttacksRef = useRef<string[]>([]); // prevent consecutive repeating of attacks
  const shieldNodesRef = useRef<{ id: string; x: number; y: number; vx: number; vy: number; health: number; maxHealth: number; angle: number; flashTicks: number; motion: "ORBITAL" | "ANCHORED" | "SERPENTINE"; radiusX: number; radiusY: number; angularVelocityPerFrame: number; collisionRadius: number }[]>([]);
  const coreExposedTimerRef = useRef<number>(0); // exposed window countdown
  const phaseTransitionTimerRef = useRef<number>(0); // transition immunity freeze timer
  const bossSummonTimersRef = useRef<Record<string, number>>({}); // cooldowns of summons
  const bossHunterWaveCooldownRef = useRef<number>(8000);
  const bossHunterWaveTelegraphRef = useRef<number>(0);
  const gravityWellPulseTimerRef = useRef<number>(0); // timing for gravity well pull
  const shownThreatIntelsRef = useRef<string[]>([]); // prevents repeating full screen threat intel popups for boss attacks

  // Boss Defeat sequence
  const bossDefeatedSequenceActiveRef = useRef(false);
  const bossDefeatedSequenceTimerRef = useRef(0);

  // Boss encounter telemetry additions
  const bossDamageDealtRef = useRef<number>(0);
  const bossShieldNodesDestroyedRef = useRef<number>(0);
  const bossDamageTakenRef = useRef<number>(0);
  const bossMaxPhaseReachedRef = useRef<number>(1);
  const bossSessionStartTimeRef = useRef<number>(0);
  const bossSessionEndTimeRef = useRef<number>(0);

  // Track attacks hit by type
  const bossAttacksHitByTypeRef = useRef<Record<string, number>>({
    devourer_beam: 0,
    gravity_well: 0,
    orbital_shards: 0,
    blackout_sweep: 0,
    singularity_pulse: 0,
    rotating_eclipse_lanes: 0,
    devourer_charge: 0,
    contact_damage: 0
  });

  const runStartTimeRef = useRef<number>(0);
  const runEndTimeRef = useRef<number>(0);
  const runEnemiesDestroyedRef = useRef<number>(0);
  const runResourcesCollectedRef = useRef<number>(0);
  const runNanoCreditsEarnedRef = useRef<number>(0);
  const runMaxSwarmSizeRef = useRef<number>(1);
  const runOrbiAcquiredRef = useRef<number>(0);
  const runCommitLedgerRef = useRef<RunCommitLedger>(createRunCommitLedger());
  const frameHealthRef = useRef<FrameHealthState>(createFrameHealthState());
  const frameHealthRecommendationShownRef = useRef<QualityPreset | null>(null);
  const collisionEnemyIndexRef =
    useRef<SpatialIndex<Enemy> | null>(null);
  const fotonThreatAccumulatorMsRef = useRef(0);
  const fotonThreatTargetRef = useRef<Enemy | null>(null);
  const fotonThreatDirectionRef = useRef({ x: 0, y: 0 });
  const enemySignatureBehaviorCacheRef = useRef(
    createEnemySignatureBehaviorCache(),
  );
  const bossAttacksSeenThisRunRef = useRef<string[]>([]);

  const updateRunMaxSwarmSize = () => {
    runMaxSwarmSizeRef.current = Math.max(
      runMaxSwarmSizeRef.current,
      swarmRef.current.length + 1,
    );
  };


  // Cosmetic / screen effects
  const screenShakeRef = useRef(0);
  const cameraOffsetRef = useRef({ x: 0, y: 0 });

  // Expanded 1600x960 Battlefield Camera State
  const cameraStateRef = useRef({
    cameraX: WORLD_WIDTH / 2 - 400,
    cameraY: WORLD_HEIGHT / 2 - 240,
    targetX: WORLD_WIDTH / 2 - 400,
    targetY: WORLD_HEIGHT / 2 - 240,
    zoom: 1.0,
    targetZoom: 1.0,
    viewportWidth: 800,
    viewportHeight: 480,
    shakeX: 0,
    shakeY: 0,
    lookAheadX: 0,
    lookAheadY: 0
  });

  // Stats Ref to access stats synchronously in high-frequency engine
  const statsRef = useRef<GameStats | null>(null);

  const pushVfxParticle = (particle: Particle) =>
    pushParticleWithinBudget(
      particlesRef.current,
      getQualityConfig(
        statsRef.current?.qualityPreset ??
          stats.qualityPreset,
      ).maxParticles,
      particle,
    );

  // Input Arbitration Refs
  const isMouseDownRef = useRef(false);
  const mouseDownPosRef = useRef({ x: 0, y: 0, time: 0 });
  const lastInputTypeRef = useRef<"KEYBOARD" | "TOUCH_PAD" | "MOUSE_DRAG" | "CLICK_TO_MOVE" | "NONE">("NONE");
  const clickToMoveTargetRef = useRef<{ x: number; y: number } | null>(null);

  // Patch 0B.4 - Combat Readability Refs
  const hitStopTimerRef = useRef(0);
  const hitStopCooldownTimerRef = useRef(0);
  const disruptTimerRef = useRef(0);
  const disruptRecoveryRef = useRef(1.0);
  const floatingTextsRef = useRef<Array<{ id: string; text: string; x: number; y: number; color: string; life: number; maxLife: number; vy: number }>>([]);

  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      text,
      x,
      y,
      color,
      life: 800, // 800 ms of display
      maxLife: 800,
      vy: -0.65 // Float upwards slightly
    });
  };

  // Historical 10-frame @ 60 Hz HUD cadence, now time-based for 60/90/120 Hz parity.
  const reactUpdateAccumulatorMsRef = useRef(0);

  // Mid-run upgrades refs
  const activeRunUpgradesRef = useRef<Record<string, number>>({});
  const isUpgradeSelectionOpenRef = useRef(false);
  const formationUseCountsRef = useRef<Record<string, number>>({});
  const hazardZonesRef = useRef<Array<{ x: number, y: number, r: number }>>([]);
  const formationCooldownRef = useRef(0);
  const electricalStormStateRef = useRef(
    createElectricalStormRuntimeState(),
  );
  const minibossGateRef = useRef(
    createRuntimeMinibossGateState(),
  );
  const bossRematchGateRef = useRef(
    createRuntimeBossRematchGateState(),
  );

  const runtimeProjectionBundleCacheRef =
    useRef<RuntimeProjectionBundleCache>(
      createRuntimeProjectionBundleCache(),
    );

  const getCurrentRuntimeProjection = () =>
    resolveScoreAttackLiveRuntimeProjection(
      scoreAttackActivationRef.current,
      runtimeProgressionRef.current,
    ) ??
    getCachedRuntimeProjectionBundle(
      runtimeProjectionBundleCacheRef.current,
      runtimeProgressionRef.current,
      swarmRef.current.length,
    );

  const getCurrentRuntimeDescriptor = () =>
    getCurrentRuntimeProjection().descriptor;

  const getCurrentCombatPressure = () =>
    getCurrentRuntimeProjection().combatPressure;

  const getCurrentMutatorEffects = () =>
    getCurrentRuntimeProjection().mutatorEffects;

  const isActiveBossRematch = () =>
    bossRef.current?.milestoneKind === "BOSS_REMATCH";

  const setUpgradeSelectionOpen = (open: boolean) => {
    setIsUpgradeSelectionOpen(open);
    isUpgradeSelectionOpenRef.current = open;
  };

  const updateActiveRunUpgrades = (nextValue: Record<string, number>) => {
    setActiveRunUpgrades(nextValue);
    activeRunUpgradesRef.current = nextValue;
  };

  const selectUpgrade = (card: UpgradeDefinition) => {
    const currentStacks = activeRunUpgradesRef.current[card.id] || 0;
    if (currentStacks >= card.maxStacks) return;

    const nextUpgrades = { ...activeRunUpgradesRef.current, [card.id]: currentStacks + 1 };
    updateActiveRunUpgrades(nextUpgrades);

    playClickSound();
    playBiomeChangeSound();

    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.FORMATION_CHANGE,
      playerPosRef.current.x,
      playerPosRef.current.y,
      "#fbbf24", // gold glow
      35
    );

    addFloatingText(`ACQUIRED: ${card.name.toUpperCase()}`, playerPosRef.current.x, playerPosRef.current.y - 40, "#38bdf8");

    if (card.id === "foton_integrity") {
      const currentShieldMax = SHIELD_MAX + (upgradesLevel.hydrogen_deflector || 0) * 15 + (currentStacks + 1) * 30;
      shieldRef.current = Math.min(currentShieldMax, shieldRef.current + 50);
      setShield(shieldRef.current);
    }

    postDialogue("COMPANION", "La Red ha adoptado una nueva configuración.");
    setUpgradeSelectionOpen(false);
  };

  const selectUpgradeByIndex = (index: number) => {
    if (upgradeChoices[index]) {
      selectUpgrade(upgradeChoices[index]);
    }
  };

  const handleReroll = () => {
    if (rerollsRemaining <= 0) return;
    setRerollsRemaining((prev) => prev - 1);
    setWasRerollUsed(true);
    playClickSound();

    let hasSolar = false;
    let hasHydro = false;
    let hasWind = false;
    let hasThermal = false;

    swarmRef.current.forEach((m) => {
      if (m.affinity === "solar") hasSolar = true;
      else if (m.affinity === "hydro") hasHydro = true;
      else if (m.affinity === "wind") hasWind = true;
      else if (m.affinity === "thermal") hasThermal = true;
    });

    const choices = generateUpgradeChoices(
      activeRunUpgradesRef.current,
      hasSolar,
      hasHydro,
      hasWind,
      hasThermal
    );
    setUpgradeChoices(choices);
  };

  const triggerUpgradeSelection = () => {
    let hasSolar = false;
    let hasHydro = false;
    let hasWind = false;
    let hasThermal = false;

    swarmRef.current.forEach((m) => {
      if (m.affinity === "solar") hasSolar = true;
      else if (m.affinity === "hydro") hasHydro = true;
      else if (m.affinity === "wind") hasWind = true;
      else if (m.affinity === "thermal") hasThermal = true;
    });

    const choices = generateUpgradeChoices(
      activeRunUpgradesRef.current,
      hasSolar,
      hasHydro,
      hasWind,
      hasThermal
    );

    if (choices.length === 0) {
      postDialogue(
        "SYSTEM",
        "No quedan mejoras de intermisión disponibles para esta partida."
      );
      setUpgradeChoices([]);
      setUpgradeSelectionOpen(false);
      return;
    }

    setUpgradeChoices(choices);
    setUpgradeSelectionOpen(true);
  };

  const getStrongestAffinity = (): RunArchiveEntry["strongestAffinity"] => {
    const counts: Record<OrbiAffinity, number> = {
      solar: 0,
      hydro: 0,
      wind: 0,
      thermal: 0,
      magnetic: 0,
      nuclear: 0,
      kinetic: 0,
      hydrogen: 0,
      quantum: 0,
      gaia: 0,
    };

    swarmRef.current.forEach((member) => {
      counts[member.affinity] += 1;
    });

    const upgrades = activeRunUpgradesRef.current;
    if (upgrades.solar_overcharge) {
      counts.solar += upgrades.solar_overcharge * 5;
    }
    if (upgrades.hydro_regenesis) {
      counts.hydro += upgrades.hydro_regenesis * 5;
    }
    if (upgrades.wind_acceleration) {
      counts.wind += upgrades.wind_acceleration * 5;
    }
    if (upgrades.thermal_expansion) {
      counts.thermal += upgrades.thermal_expansion * 5;
    }
    let best: RunArchiveEntry["strongestAffinity"] = "none";
    let max = 0;
    for (const [affinity, value] of Object.entries(counts)) {
      if (value > max) {
        max = value;
        best =
          affinity as RunArchiveEntry["strongestAffinity"];
      }
    }
    return best;
  };

  // --- COMPANION LUX-8 DIALOGUES WRITING ---
  const postDialogue = useCallback((sender: "FOTON" | "COMPANION" | "SYSTEM", text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const msg: DialogueMessage = {
      id: Math.random().toString(),
      sender,
      text,
      timestamp
    };
    setDialogueLog((prev) => {
      const next = [...prev, msg];
      if (next.length > 50) next.shift(); // Limit logs buffer size
      return next;
    });
  }, []);

  // --- BOOTING / STORAGE LIFE ACTIONS ---
  useEffect(() => {
    const loaded = loadGameStats();
    setStats(loaded);
    setHighScore(loaded.highScore);
    setAudioMuted(loaded.audioMuted);
    // Restore persisted mute state without starting BGM before a user gesture.
    if (loaded.audioMuted) {
      setMuteState(true);
    }

    // Load level states
    const levels: Record<string, number> = {};
    loaded.gameMemories.forEach((mem) => {
      const spl = mem.split(":");
      if (spl.length === 2) {
        levels[spl[0]] = parseInt(spl[1], 10) || 0;
      }
    });
    setUpgradesLevel({
      hydrogen_deflector: levels.hydrogen_deflector || 0,
      quantum_core: levels.quantum_core || 0,
      fusion_resonator: levels.fusion_resonator || 0,
      nano_catalyst: levels.nano_catalyst || 0,
      mitosis_relic: levels.mitosis_relic || 0
    });

    // Companion greets player
    postDialogue("COMPANION", "Estación LUX-8 sincronizada. ENERGY listo para cosechar.");
  }, [postDialogue]);

  // --- SYNC STATS STATE TO REF AND PERSISTENCE HELPER ---
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    const quality = getQualityConfig(stats.qualityPreset);
    backgroundRenderer.resizeStars(quality.maxStars);
  }, [stats.qualityPreset]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const updateStatsAndSave = (nextStats: GameStats) => {
    setStats(nextStats);
    statsRef.current = nextStats;
    saveGameStats(nextStats);
  };

  const persistInfiniteReach = (
    sector: number,
    waveNumber: number,
  ) => {
    const fresh = loadGameStats();
    const nextStats = applyInfiniteProgressRecord(
      fresh,
      { sector, waveNumber },
    );
    updateStatsAndSave(nextStats);
  };

  const persistInfiniteMilestoneDefeat = (
    enemy: Enemy,
  ) => {
    if (
      !enemy.milestoneKind ||
      !enemy.milestoneId
    ) {
      return;
    }

    const fresh = loadGameStats();
    const transition = applyInfiniteMilestoneRecord(
      fresh,
      {
        eventId: enemy.milestoneId,
        kind: enemy.milestoneKind,
      },
      runCommitLedgerRef.current,
    );

    runCommitLedgerRef.current = transition.ledger;
    updateStatsAndSave(transition.stats);
  };

  // --- SAVE CURRENT PROGRESSION HELPER ---
  const getCampaignVictoryCheckpointInput = (
    currentScore: number,
  ): CampaignVictoryCheckpointInput => {
    updateRunMaxSwarmSize();
    const bestSwarmSize = runMaxSwarmSizeRef.current;
    const bestWaveReached = currentWaveRef.current;
    const memories = Object.entries(upgradesLevel).map(
      ([k, v]) => `${k}:${v}`,
    );
    const isBossFightAttempted =
      bossSessionStartTimeRef.current > 0;
    const bossFightDurationMs =
      isBossFightAttempted &&
      bossSessionEndTimeRef.current >
        bossSessionStartTimeRef.current
        ? bossSessionEndTimeRef.current -
          bossSessionStartTimeRef.current
        : 0;
    const playerMaxShield =
      SHIELD_MAX +
      (upgradesLevel.hydrogen_deflector || 0) * 15;
    const remainingIntegrityPercent = Math.round(
      (shieldRef.current / playerMaxShield) * 100,
    );

    return {
      currentScore,
      bestWaveReached,
      bestSwarmSize,
      nanoCreditsBalance: nanoCreditsRef.current,
      gameMemories: memories,
      bossFightDurationMs,
      remainingIntegrityPercent,
      preferredBossFormation: getFormationMostUsed(),
      bossCodexSeenPhases: Array.from(
        { length: bossMaxPhaseReachedRef.current },
        (_, i) => i + 1,
      ),
      bossCodexSeenAttacks: bossAttacksSeenThisRunRef.current,
      firstVictoryAt: new Date().toISOString(),
    };
  };

  const commitStats = (
    isVictory: boolean,
    currentScore: number,
  ) => {
    const fresh = loadGameStats();
    updateRunMaxSwarmSize();
    const bestSwarmSize = runMaxSwarmSizeRef.current;
    const bestWaveReached = currentWaveRef.current;
    const memories = Object.entries(upgradesLevel).map(
      ([k, v]) => `${k}:${v}`,
    );

    let workingStats = fresh;
    let workingLedger = runCommitLedgerRef.current;

    if (isVictory) {
      const checkpoint = applyCampaignVictoryCheckpoint(
        workingStats,
        getCampaignVictoryCheckpointInput(currentScore),
        workingLedger,
      );

      workingStats = checkpoint.stats;
      workingLedger = checkpoint.ledger;
    }

    const infiniteSectorReached =
      runtimeProgressionRef.current.mode === "INFINITE"
        ? getRuntimeSector(runtimeProgressionRef.current)
        : undefined;
    const infiniteWaveReached =
      runtimeProgressionRef.current.mode === "INFINITE"
        ? getRuntimeWaveNumber(runtimeProgressionRef.current)
        : undefined;
    const completedAtMs =
      runEndTimeRef.current > 0
        ? runEndTimeRef.current
        : Date.now();
    const runArchiveEntry: RunArchiveEntry = {
      runId: `orbi-run-${runStartTimeRef.current}`,
      completedAt: new Date(completedAtMs).toISOString(),
      outcome: workingLedger.campaignVictoryCommitted
        ? "CAMPAIGN_CLEARED"
        : "DEFEAT",
      score: currentScore,
      campaignWaveReached: Math.min(
        bestWaveReached,
        BOSS_WAVE_NUMBER,
      ),
      durationMs: Math.max(
        0,
        completedAtMs - runStartTimeRef.current,
      ),
      enemiesDestroyed: runEnemiesDestroyedRef.current,
      maxSwarmSize: bestSwarmSize,
      strongestAffinity: getStrongestAffinity(),
      mostUsedFormation: getFormationMostUsed(),
      temporaryBuild: {
        ...activeRunUpgradesRef.current,
      },
      ...(infiniteSectorReached !== undefined &&
      infiniteWaveReached !== undefined
        ? {
            infiniteSectorReached,
            infiniteWaveReached,
          }
        : {}),
    };

    const finalCommit = applyFinalRunCommit(
      workingStats,
      {
        currentScore,
        bestWaveReached,
        bestSwarmSize,
        nanoCreditsBalance: nanoCreditsRef.current,
        gameMemories: memories,
        enemiesDestroyed: runEnemiesDestroyedRef.current,
        resourcesCollected: runResourcesCollectedRef.current,
        infiniteSectorReached,
        infiniteWaveReached,
        runArchiveEntry,
      },
      workingLedger,
    );

    runCommitLedgerRef.current = finalCommit.ledger;
    updateStatsAndSave(finalCommit.stats);
    setHighScore(finalCommit.stats.highScore);
  };

  // C2 cold-path QA-only cleanup, kept OUTSIDE the certified J2 activation seam.
  const clearArchitectQaShot = () => {
    const qaShot = architectQaShotRef.current;
    architectQaShotRef.current = null;
    if (qaShot !== null) {
      const qaShotIndex = projectilesRef.current.indexOf(qaShot);
      if (qaShotIndex >= 0) projectilesRef.current.splice(qaShotIndex, 1);
    }
  };

  const handleOverdriveActivation = () => {
    if (
      !isPlaying ||
      isGameOver ||
      isPausedRef.current ||
      isPhotoMode ||
      isUpgradeSelectionOpenRef.current
    ) {
      return false;
    }

    const nowMs = timeElapsedRef.current;
    combatOverdriveRef.current = advanceCombatOverdrive(
      combatOverdriveRef.current,
      nowMs,
    );
    const resonanceProjection = projectCombatResonance(
      combatResonanceRef.current,
    );
    const preActivationProjection = projectCombatOverdrive(
      combatOverdriveRef.current,
      nowMs,
      resonanceProjection.overdriveReady,
    );

    if (!preActivationProjection.canActivate) {
      setCombatOverdriveView(preActivationProjection);
      return false;
    }

    const resolution = activateCombatOverdrive(
      combatOverdriveRef.current,
      {
        occurredAtMs: nowMs,
        overdriveReady: resonanceProjection.overdriveReady,
      },
    );
    combatOverdriveRef.current = resolution.state;
    setCombatOverdriveView(resolution.projection);

    if (!resolution.activated || !resolution.consumeResonance) {
      return false;
    }

    // Successful explicit activation is already a user gesture (keyboard/HUD).
    playOverdriveActivationSound();

    combatResonanceRef.current = {
      ...combatResonanceRef.current,
      resonance: 0,
    };
    const consumedResonanceProjection = projectCombatResonance(
      combatResonanceRef.current,
    );
    setCombatResonanceView({
      chain: combatResonanceRef.current.chain,
      resonance: combatResonanceRef.current.resonance,
      ...consumedResonanceProjection,
    });
    return true;
  };

  /**
   * DEV-only controlled QA: a real game-owned entity/ref and identity guard,
   * but the entire simulation is frozen and no combat is authorized.
   */
  const clearArchitectQaDiagnostic = () => {
    setArchitectQaDefeatVisible(false);
    setArchitectQaLossVisible(false);
    architectQaGridLockRef.current = null;
    architectQaVectorTideRef.current = null;
    architectQaSectorWallRef.current = null;
    architectQaDirectorRef.current = null;
    const cameraRestore = architectQaCameraRestoreRef.current;
    architectQaCameraRestoreRef.current = null;
    if (cameraRestore !== null) {
      cameraStateRef.current.cameraX = cameraRestore.cameraX;
      cameraStateRef.current.cameraY = cameraRestore.cameraY;
    }
    // Keep J2 Overdrive handler contract isolated from projectile collection work.
    clearArchitectQaShot();
    architectQaLastPointerTypeRef.current = null;
    // Release cardinal geometry even after any partial QA installation.
    architectQaCardinalsRef.current = null;
    const qaBoss = architectQaBossRef.current;
    if (qaBoss === null) return;
    architectEngineIdentityOwnerRef.current?.revoke();
    if (bossRef.current === qaBoss) bossRef.current = null;
    if (enemiesRef.current[enemiesRef.current.length - 1] === qaBoss) {
      enemiesRef.current.pop();
    }
    architectQaBossRef.current = null;
    architectQaGuardRef.current = null;
    setArchitectQaVisible(false);
  };

  const toggleArchitectQaDiagnostic = () => {
    if (!import.meta.env.DEV) return;
    if (architectQaBossRef.current !== null) {
      clearArchitectQaDiagnostic();
      return;
    }
    // Positive manual consent and isolated break-only engine ownership.
    if (!isPlaying || isGameOver || isPhotoMode || isPausedRef.current ||
        isUpgradeSelectionOpenRef.current || scoreAttackActivationRef.current !== null ||
        runtimeProgressionRef.current.mode !== "CAMPAIGN" ||
        waveActiveRef.current || bossActiveRef.current ||
        bossRef.current !== null || enemiesRef.current.length !== 0 ||
        bossDefeatedSequenceActiveRef.current) return;

    const candidate = createBlackoutArchitectDevQaBoss(true);
    if (candidate === null || enemiesRef.current.length >= MAX_ENEMIES) return;
    // Genuine refs are installed BEFORE attempting owner admission.
    enemiesRef.current.push(candidate);
    bossRef.current = candidate;
    const guard = architectEngineIdentityOwnerRef.current?.admitInstalledBoss(
      candidate, bossRef.current, enemiesRef.current,
    ) ?? null;
    const valid = guard !== null &&
      architectEngineIdentityOwnerRef.current?.isCurrent(
        guard, candidate, bossRef.current, enemiesRef.current,
      ) === true;
    if (!valid) {
      architectEngineIdentityOwnerRef.current?.revoke();
      if (bossRef.current === candidate) bossRef.current = null;
      if (enemiesRef.current[enemiesRef.current.length - 1] === candidate) {
        enemiesRef.current.pop();
      }
      return;
    }
    architectQaBossRef.current = candidate;
    architectQaGuardRef.current = guard;
    // Only the actual boss reference and current private guard can own circles.
    // Any invalid/out-of-bounds placement rolls back the entire QA installation.
    const cardinalGeometry = createBlackoutArchitectDevQaCardinalGeometry(
      architectEngineIdentityOwnerRef.current,
      guard,
      candidate,
      bossRef.current,
      enemiesRef.current,
      true,
    );
    if (cardinalGeometry === null) {
      clearArchitectQaDiagnostic();
      return;
    }
    architectQaCardinalsRef.current = cardinalGeometry;
    // C5 owns a genuine DEV-only attack against real FOTON, not global shield.
    const initialGridLock = createBlackoutArchitectDevQaGridLockState(
      architectEngineIdentityOwnerRef.current,
      guard,
      candidate,
      bossRef.current,
      enemiesRef.current,
      true,
    );
    if (initialGridLock === null) {
      clearArchitectQaDiagnostic();
      return;
    }
    architectQaGridLockRef.current = initialGridLock;
    architectQaDirectorRef.current = null;
    architectQaCameraRestoreRef.current = {
      cameraX: cameraStateRef.current.cameraX,
      cameraY: cameraStateRef.current.cameraY,
    };
    setArchitectQaVisible(true);
  };

  // C6: explicit DEV-only mutually exclusive QA attack selection.
  // F8 never affects normal game modes and creates no global projectiles.
  const toggleArchitectQaAttackSelection = () => {
    if (architectQaDirectorRef.current !== null) return; // C8 forbids F8 hull reset while auto-directing.
    if (!import.meta.env.DEV || architectQaBossRef.current === null ||
        architectQaGuardRef.current === null || architectQaCardinalsRef.current === null) return;
    const boss = architectQaBossRef.current;
    const guard = architectQaGuardRef.current;
    const owner = architectEngineIdentityOwnerRef.current;
    if (owner?.isCurrent(guard,boss,bossRef.current,enemiesRef.current) !== true) {
      clearArchitectQaDiagnostic();
      return;
    }
    if (architectQaGridLockRef.current !== null) {
      const tide = createBlackoutArchitectDevQaVectorTideState(
        owner,guard,boss,bossRef.current,enemiesRef.current,true,
      );
      if (tide === null) return;
      architectQaGridLockRef.current = null;
      architectQaVectorTideRef.current = tide;
    } else if (architectQaVectorTideRef.current !== null) {
      const wall = createBlackoutArchitectDevQaSectorWallState(
        owner,guard,boss,bossRef.current,enemiesRef.current,true,
      );
      if (wall === null) return;
      architectQaVectorTideRef.current = null;
      architectQaSectorWallRef.current = wall;
    } else if (architectQaSectorWallRef.current !== null) {
      const grid = createBlackoutArchitectDevQaGridLockState(
        owner,guard,boss,bossRef.current,enemiesRef.current,true,
      );
      if (grid === null) return;
      architectQaSectorWallRef.current = null;
      architectQaGridLockRef.current = grid;
    }
    // C11: render the newly selected real DEV QA pattern without changing physics.
    refreshArchitectQaTouchControls(v => v + 1);
  };


  // C8: independent real physical attack director; F7 is a DEV-only opt-in.
  // Turning it on inherits the genuine current attack hull; F8 cannot reset it.
  const toggleArchitectQaPatternDirector = () => {
    if (!import.meta.env.DEV || !architectQaBossRef.current ||
        !architectQaGuardRef.current || !architectQaCardinalsRef.current) return;
    if (architectQaDirectorRef.current !== null) {
      architectQaDirectorRef.current = null;
      refreshArchitectQaTouchControls(v => v + 1);
      return;
    }
    const grid = architectQaGridLockRef.current;
    const tide = architectQaVectorTideRef.current;
    const wall = architectQaSectorWallRef.current;
    if (Number(grid !== null)+Number(tide !== null)+Number(wall !== null)!==1) {
      clearArchitectQaDiagnostic();return;
    }
    const selected:ArchitectQaDirectorPattern=grid?"GRID_LOCK":tide?"VECTOR_TIDE":"SECTOR_WALL";
    const current=grid??tide??wall;
    if (!current) return;
    const director=createBlackoutArchitectDevQaPatternDirector(
      architectEngineIdentityOwnerRef.current,
      architectQaGuardRef.current,architectQaCardinalsRef.current,
      architectQaBossRef.current,bossRef.current,enemiesRef.current,
      selected,current.cycle,current.qaHullHealth,true,
    );
    if (director===null) return;
    architectQaDirectorRef.current=director;
    refreshArchitectQaTouchControls(v => v + 1);
  };

  // --- KEY LISTENER LISTENERS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) {
        if (e.key === "Enter") {
          startCampaignGame();
        }
        return;
      }

      // UX01: Escape closes the mobile Estado drawer; it must not also pause
      // an active game. The ordinary Escape-to-pause behavior is preserved.
      if (e.key === "Escape" && immersiveLandscapeMode && mobilePanel !== "closed" && !isPhotoMode) {
        e.preventDefault();
        setMobilePanel("closed");
        return;
      }

      // Manual triple-modifier diagnostic ONLY in the unbundled Vite dev app.
      if (import.meta.env.DEV && e.ctrlKey && e.altKey && e.shiftKey && e.code === "F9") {
        e.preventDefault();
        toggleArchitectQaDiagnostic();
        return;
      }

      // Space to skip boss intro
      if (e.key === " " && bossIntroTimeRef.current !== null) {
        e.preventDefault();
        skipBossIntro();
        return;
      }

      // Prevent scroll on gaming keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "1", "2", "3", "4", "5", "6"].includes(e.key)) {
        e.preventDefault();
      }

      const key = e.key.toUpperCase();

      if (import.meta.env.DEV && e.ctrlKey && e.altKey && e.shiftKey &&
          e.code === "F7") {
        e.preventDefault();
        toggleArchitectQaPatternDirector();
        return;
      }

      if (import.meta.env.DEV && e.ctrlKey && e.altKey && e.shiftKey &&
          e.code === "F8") {
        e.preventDefault();
        toggleArchitectQaAttackSelection();
        return;
      }

      if (key === "F3") {
        e.preventDefault();
        togglePerformanceDiagnostics();
        return;
      }

      if (key === "F4") {
        e.preventDefault();
        handlePerformanceEvidenceHotkey();
        return;
      }

      if (isPhotoMode) {
        if (key === "F10" || e.key === "Escape") {
          e.preventDefault();
          exitPhotoMode();
          return;
        }
        if (key === "ARROWLEFT") {
          e.preventDefault();
          cyclePhotoModeFilter(-1);
          return;
        }
        if (key === "ARROWRIGHT") {
          e.preventDefault();
          cyclePhotoModeFilter(1);
          return;
        }
        if (key === "0") {
          e.preventDefault();
          resetPhotoModeFilter();
          return;
        }
        return;
      }

      if (key === "F10") {
        e.preventDefault();
        enterPhotoMode();
        return;
      }

      if (isUpgradeSelectionOpenRef.current) {
        e.preventDefault();
        if (key === "1") {
          selectUpgradeByIndex(0);
        } else if (key === "2") {
          selectUpgradeByIndex(1);
        } else if (key === "3") {
          selectUpgradeByIndex(2);
        } else if (key === "R") {
          handleReroll();
        }
        return; // BLOCK ALL OTHER INPUTS
      }

      if (key === "O") {
        e.preventDefault();
        handleOverdriveActivation();
        return;
      }

      keysPressedRef.current[key] = true;

      const movementKeys = ["W", "A", "S", "D", "ARROWUP", "ARROWDOWN", "ARROWLEFT", "ARROWRIGHT"];
      if (movementKeys.includes(key)) {
        lastInputTypeRef.current = "KEYBOARD";
        clickToMoveTargetRef.current = null;
      }

      // Handle Hotkeys
      if (key === "P" || e.key === "Escape") {
        togglePause();
      } else if (key === "M") {
        toggleMute();
      } else if (key === "R") {
        rebootGame();
      } else if (["1", "2", "3", "4", "5", "6"].includes(key)) {
        const idx = parseInt(key, 10);
        const forms = [
          FormationType.LINE,
          FormationType.CIRCLE,
          FormationType.DELTA,
          FormationType.SHIELD,
          FormationType.V_SHAPE,
          FormationType.SCATTERED
        ];
        const nextForm = forms[idx - 1];
        if (nextForm) {
          triggerFormationChange(nextForm);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      keysPressedRef.current[key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlaying, isPaused, isPhotoMode, isGameOver, upgradesLevel, presentationMode, immersiveLandscapeMode, mobilePanel]);

  // --- ANDROID / WEB APP LIFECYCLE SAFETY ---
  useEffect(() => {
    const resetTransientInput = () => {
      keysPressedRef.current = {};
      touchDirectionsRef.current = createTouchDirectionState();
      isMouseDownRef.current = false;
      mouseDownPosRef.current = { x: 0, y: 0, time: 0 };
      lastInputTypeRef.current = "NONE";
      clickToMoveTargetRef.current = null;
      pointerRef.current = {
        x: playerPosRef.current.x,
        y: playerPosRef.current.y,
      };
    };

    const applyLifecycleSignal = (signal: LifecycleSignal) => {
      resetTransientInput();

      if (shouldResetFrameClock(signal)) {
        lastTimeRef.current = performance.now();
        frameHealthRef.current = resetFrameHealthState(
          frameHealthRef.current,
        );
      }

      const shouldPause = shouldPauseForLifecycle(
        {
          isPlaying,
          isPaused: isPausedRef.current,
          isGameOver,
          isModalSuspended: isUpgradeSelectionOpenRef.current,
        },
        signal,
      );

      if (shouldPause) {
        setPausedState(true);
        stopBgm();
      }
    };

    const handleWindowBlur = () => applyLifecycleSignal("WINDOW_BLUR");
    const handleWindowFocus = () => applyLifecycleSignal("WINDOW_FOCUS");
    const handleVisibilityChange = () => {
      applyLifecycleSignal(
        document.visibilityState === "hidden"
          ? "DOCUMENT_HIDDEN"
          : "DOCUMENT_VISIBLE",
      );
    };
    const handleOrientationChange = () =>
      applyLifecycleSignal("ORIENTATION_CHANGE");

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.screen.orientation?.addEventListener("change", handleOrientationChange);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.screen.orientation?.removeEventListener("change", handleOrientationChange);
    };
  }, [isPlaying, isGameOver, setPausedState]);

  const changeMinimapMode = (mode: "FULL" | "COMPACT" | "OFF") => {
    const next = { ...stats, minimapMode: mode };
    setStats(next);
    saveGameStats(next);
    playClickSound();
  };

  const changeQualityPreset = (preset: QualityPreset) => {
    const next = { ...stats, qualityPreset: preset };
    setStats(next);
    saveGameStats(next);
    playClickSound();
  };

  // --- TRIGGER FORMATION MODIFIER SCRIPT ---
  const triggerFormationChange = (nextForm: FormationType) => {
    if (formationCooldownRef.current > 0) {
      addFloatingText("COOLDOWN ACTIVE", playerPosRef.current.x, playerPosRef.current.y - 25, "#f43f5e");
      return;
    }

    activeFormationRef.current = nextForm;
    setActiveFormation(nextForm);
    playClickSound();
    
    const baseCooldown = 1500; // 1.5s
    const syncStacks = activeRunUpgradesRef.current.formation_synchronizer || 0;
    const finalCooldown = Math.max(500, baseCooldown * (1 - 0.40 * syncStacks));
    formationCooldownRef.current = finalCooldown;

    // Spawn gorgeous visual rings
    const cfg = FORMATIONS[nextForm];
    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.FORMATION_CHANGE,
      playerPosRef.current.x,
      playerPosRef.current.y,
      "#06b6d4",
      15
    );

    // Floating text feedback (Section 5)
    addFloatingText(`FORMATION: ${cfg.name.toUpperCase()}`, playerPosRef.current.x, playerPosRef.current.y - 25, "#c084fc");

    postDialogue("SYSTEM", `Vectores alienados: ${cfg.name}`);
  };

  // --- GAME START TRIGGER ---
  const togglePerformanceDiagnostics = () => {
    const next = !performanceDiagnosticsEnabledRef.current;
    if (
      !next &&
      performanceEvidenceRecorderRef.current.status === "RECORDING"
    ) {
      postDialogue(
        "SYSTEM",
        "EVIDENCE REC activa: F4 detiene/exporta antes de cerrar F3.",
      );
      return;
    }
    performanceDiagnosticsEnabledRef.current = next;
    performanceDiagnosticsStateRef.current =
      createPerformanceDiagnosticsState();
    setPerformanceDiagnosticsSnapshot(null);
    setPerformanceDiagnosticsEnabled(next);
  };

  const resetPerformanceEvidenceRecorder = () => {
    performanceEvidenceRecorderRef.current =
      createPerformanceEvidenceRecorderState();
    setPerformanceEvidenceStatus("IDLE");
    setPerformanceEvidenceSamples(0);
  };

  const handlePerformanceEvidenceHotkey = () => {
    const recorder = performanceEvidenceRecorderRef.current;

    if (recorder.status === "IDLE") {
      if (!performanceDiagnosticsEnabledRef.current) {
        performanceDiagnosticsEnabledRef.current = true;
        performanceDiagnosticsStateRef.current =
          createPerformanceDiagnosticsState();
        setPerformanceDiagnosticsSnapshot(null);
        setPerformanceDiagnosticsEnabled(true);
      }

      performanceEvidenceRecorderRef.current =
        startPerformanceEvidenceRecording(Date.now());
      setPerformanceEvidenceStatus("RECORDING");
      setPerformanceEvidenceSamples(0);
      postDialogue(
        "SYSTEM",
        `EVIDENCE REC iniciada · ${PERFORMANCE_EVIDENCE_TARGET_SAMPLES} snapshots / 15 s.`,
      );
      return;
    }

    const capture = buildPerformanceEvidenceCapture(
      recorder,
      Date.now(),
      getBrowserPerformanceEvidenceMetadata(),
    );

    if (capture) {
      const downloaded = downloadPerformanceEvidence(capture);
      postDialogue(
        "SYSTEM",
        downloaded
          ? capture.complete
            ? "EVIDENCE COMPLETE exportada."
            : "EVIDENCE PARTIAL exportada."
          : "EVIDENCE preparada, pero el navegador bloqueó la descarga.",
      );
    } else {
      postDialogue("SYSTEM", "EVIDENCE REC cancelada sin muestras.");
    }

    resetPerformanceEvidenceRecorder();
  };

  const startGame = () => {
    const requestedScoreAttackActivation =
      scoreAttackActivationRef.current;
    initAudio();
    setIsPlaying(true);
    setIsPhotoMode(false);
    setPhotoHintVisible(false);
    setPausedState(false);
    setIsGameOver(false);
    setVictory(false);

    // Initial run start and telemetry setups
    runStartTimeRef.current = Date.now();
    runEndTimeRef.current = 0;
    runCommitLedgerRef.current = createRunCommitLedger();
    architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter();
    clearArchitectQaDiagnostic();
    architectEngineIdentityOwnerRef.current?.beginRun();
    collisionTraceRunEpochRef.current = nextBlackoutArchitectCollisionTraceOrdinal(
      collisionTraceRunEpochRef.current,
    );
    collisionTracePhysicsFrameRef.current = 0;
    collisionTracePlayerShotRef.current = 0;
    frameHealthRef.current = createFrameHealthState();
    suspendedFrameRenderedRef.current = false;
    frameHealthRecommendationShownRef.current = null;
    fotonThreatAccumulatorMsRef.current = 0;
    fotonThreatTargetRef.current = null;
    fotonThreatDirectionRef.current = { x: 0, y: 0 };
    performanceDiagnosticsStateRef.current =
      createPerformanceDiagnosticsState();
    setPerformanceDiagnosticsSnapshot(null);
    performanceEvidenceRecorderRef.current =
      createPerformanceEvidenceRecorderState();
    setPerformanceEvidenceStatus("IDLE");
    setPerformanceEvidenceSamples(0);
    runtimeProjectionBundleCacheRef.current =
      createRuntimeProjectionBundleCache();
    runMaxSwarmSizeRef.current = 1;
    runOrbiAcquiredRef.current = 0;
    reactUpdateAccumulatorMsRef.current = 0;
    bossDamageDealtRef.current = 0;
    bossShieldNodesDestroyedRef.current = 0;
    bossDamageTakenRef.current = 0;
    bossMaxPhaseReachedRef.current = 1;
    bossSessionStartTimeRef.current = 0;
    bossSessionEndTimeRef.current = 0;
    bossDefeatedSequenceActiveRef.current = false;
    bossDefeatedSequenceTimerRef.current = 0;
    bossAttacksSeenThisRunRef.current = [];
    bossAttacksHitByTypeRef.current = {
      devourer_beam: 0,
      gravity_well: 0,
      orbital_shards: 0,
      blackout_sweep: 0,
      singularity_pulse: 0,
      rotating_eclipse_lanes: 0,
      devourer_charge: 0,
      contact_damage: 0
    };

    // Initial cleanups
    playerPosRef.current = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 };
    pointerRef.current = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 };
    touchDirectionsRef.current = createTouchDirectionState();
    shieldRef.current = SHIELD_MAX + (upgradesLevel.hydrogen_deflector || 0) * 15;
    scoreRef.current = 0;
    fusionEnergyRef.current = 0;
    const resetResonanceState = createCombatResonanceState();
    combatResonanceRef.current = resetResonanceState;
    setCombatResonanceView({
      chain: resetResonanceState.chain,
      resonance: resetResonanceState.resonance,
      ...projectCombatResonance(resetResonanceState),
    });
    const resetOverdriveState = createCombatOverdriveState();
    combatOverdriveRef.current = resetOverdriveState;
    setCombatOverdriveView(
      projectCombatOverdrive(resetOverdriveState, 0, false),
    );
    playerFlashRef.current = 0;
    invincibilityTimerRef.current = 0;

    swarmRef.current = [];
    enemiesRef.current = [];
    projectilesRef.current = [];
    resourcesRef.current = [];
    particlesRef.current = [];
    recruitBagRef.current = [];
    gaiaEvolutionRef.current = createGaiaEvolutionState();
    gaiaMemberRef.current = null;
    swarmDoctrineRef.current = createSwarmDoctrineState();

    if (requestedScoreAttackActivation) {
      runtimeProgressionRef.current =
        requestedScoreAttackActivation.runtimeProgression;
      currentWaveRef.current = getRuntimeSector(
        requestedScoreAttackActivation.runtimeProgression,
      );
      setCurrentWave(currentWaveRef.current);
    } else {
      currentWaveRef.current = 1;
      runtimeProgressionRef.current = createCampaignRuntimeState(1);
    }
    waveActiveRef.current = false;
    enemyFormationDirectorRef.current =
      createLiveEnemyFormationDirectorState();
    pendingCommandLinkBreakRef.current = null;
    pendingCommandLinkPulseRef.current = null;
    waveBreakTimerRef.current = 2500; // 2.5 seconds visual preparation break

    // Reset mid-run upgrades
    updateActiveRunUpgrades({});
    setUpgradeSelectionOpen(false);
    setRerollsRemaining(1);
    setWasRerollUsed(false);
    setWaveIntroConfig(null);
    formationUseCountsRef.current = {};
    hazardZonesRef.current = [];
    formationCooldownRef.current = 0;
    electricalStormStateRef.current =
      createElectricalStormRuntimeState();
    minibossGateRef.current =
      createRuntimeMinibossGateState();
    bossRematchGateRef.current =
      createRuntimeBossRematchGateState();
    activeBossRematchProfileRef.current = null;
    bossActiveRef.current = false;
    bossRef.current = null;

    // Reset boss states and refs
    setBossHp(BLACKOUT_DEVOURER_CANON.maxHealth);
    setBossMaxHp(BLACKOUT_DEVOURER_CANON.maxHealth);
    setBossPhase(1);
    setBossAttackName(null);
    setBossShieldNodes(0);
    setIsCoreExposed(false);
    setBossIntroTime(null);
    setBossTransitionName(null);

    bossIntroTimeRef.current = null;
    bossAttackTimerRef.current = 200;
    bossCurrentAttackRef.current = null;
    bossAttackTelegraphRef.current = 0;
    bossAttackDurationRef.current = 0;
    bossAttackAngleRef.current = 0;
    bossAttackTargetPosRef.current = { x: 0, y: 0 };
    bossLastAttacksRef.current = [];
    shieldNodesRef.current = [];
    coreExposedTimerRef.current = 0;
    phaseTransitionTimerRef.current = 0;
    bossSummonTimersRef.current = {};
    bossHunterWaveCooldownRef.current = 8000;
    bossHunterWaveTelegraphRef.current = 0;
    gravityWellPulseTimerRef.current = 0;
    shownThreatIntelsRef.current = [];

    // Load persistent Nano credit balance
    const freshStats = loadGameStats();
    setNanoCredits(freshStats.totalNanoCredits);
    nanoCreditsRef.current = freshStats.totalNanoCredits;

    // Recruits initial Orbi member
    addSwarmMember();

    // Reset run-local telemetry without mutating persistent React profile state.
    runEnemiesDestroyedRef.current = 0;
    runResourcesCollectedRef.current = 0;
    runNanoCreditsEarnedRef.current = 0;

    setIsWaveBreak(true);
    setWaveBreakTimeLeft(Math.ceil(2500 / 1000));
    setWaveName("PREPARATION PROTOCOL");

    setActiveBiome(BiomeType.SOLAR_PLAINS);
    activeFormationRef.current = FormationType.LINE;
    setActiveFormation(FormationType.LINE);

    postDialogue("COMPANION", "Sincronización activada. Núcleo ENERGY operando a resonancia base.");

    startBgm("EXPLORATION");

    loopActiveRef.current = true;
    lastTimeRef.current = performance.now();
    requestAnimationFrame(gameLoop);
  };

  const startGameWithMode = (mode: ScoreAttackLiveEngineStartMode) => {
    const activation = resolveScoreAttackLiveEngineActivation(mode);
    if (mode === "SCORE_ATTACK" && !activation) return false;
    scoreAttackActivationRef.current = activation;
    setPresentationMode(mode);
    startGame();
    return true;
  };

  const startCampaignGame = () => {
    void startGameWithMode("CAMPAIGN");
  };

  // --- REBOOT GAME ON LOSS ---
  const rebootGame = () => {
    playClickSound();
    void startGameWithMode(presentationMode);
  };

  // --- TOGGLE PAUSE ---
  const togglePause = () => {
    if (!isPlaying || isGameOver) return;
    
    if (isPausedRef.current) {
      playUnpauseSound();
      setPausedState(false);
      lastTimeRef.current = performance.now();
      // Resume background music based on current combat tension
      if (bossActiveRef.current) {
        startBgm("BOSS");
      } else if (currentWaveRef.current >= 5) {
        startBgm("HIGH_INTENSITY");
      } else {
        startBgm("EXPLORATION");
      }
    } else {
      playPauseSound();
      setPausedState(true);
      stopBgm();
    }
  };

  const cyclePhotoModeFilter = (direction: -1 | 1) => {
    setPhotoFilterId((current) => cyclePhotoFilter(current, direction));
    setPhotoHintVisible(true);
  };

  const resetPhotoModeFilter = () => {
    setPhotoFilterId(DEFAULT_PHOTO_FILTER_ID);
    setPhotoHintVisible(true);
  };

  const enterPhotoMode = () => {
    if (!isPlaying || isGameOver || isUpgradeSelectionOpenRef.current) return;

    if (!isPausedRef.current) {
      playPauseSound();
      setPausedState(true);
      stopBgm();
    }

    setPhotoFilterId(DEFAULT_PHOTO_FILTER_ID);
    setIsPhotoMode(true);
    setPhotoHintVisible(true);
  };

  const exitPhotoMode = () => {
    setIsPhotoMode(false);
    setPhotoHintVisible(false);
    setPausedState(true);
    lastTimeRef.current = performance.now();
  };

  useEffect(() => {
    if (!isPhotoMode || !photoHintVisible) return;

    const timeout = window.setTimeout(() => {
      setPhotoHintVisible(false);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [isPhotoMode, photoHintVisible]);

  useEffect(() => {
    if (!isPhotoMode) return;

    const revealPhotoControls = () => setPhotoHintVisible(true);
    window.addEventListener("pointerdown", revealPhotoControls, { passive: true });
    return () => window.removeEventListener("pointerdown", revealPhotoControls);
  }, [isPhotoMode]);

  // --- TOGGLE MUTE ---
  const toggleMute = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    setMuteState(next);
    playClickSound();
  };

  // --- CANONICAL ORBI ENERGY RECRUITMENT CYCLE ---
  // ENERGY is the neutral player core. Every shuffled cycle now contains
  // nine collectible energies including photovoltaic FOTON; GAIA is synthesis-only.
  const recruitBagRef = useRef<OrbiEnergyId[]>([]);
  const gaiaEvolutionRef = useRef(createGaiaEvolutionState());
  const gaiaMemberRef = useRef<OrbiMember | null>(null);
  const swarmDoctrineRef = useRef(createSwarmDoctrineState());
  const personalities = ["Curious", "Bold", "Cynical", "Joyful", "Silent", "Anxious", "Enthusiastic", "Calm", "Fiery", "Stoic"];

  const getNextEnergyIdFromBag = (): OrbiEnergyId => {
    if (recruitBagRef.current.length === 0) {
      recruitBagRef.current = createShuffledCollectibleEnergyCycle();
    }
    return recruitBagRef.current.pop()!;
  };

  // --- GAIA NINE-ENERGY SYNTHESIS PROGRESSION ---
  const trackGaiaEnergyAcquisition = (energyId: OrbiEnergyId) => {
    const previousGaiaLevel = gaiaEvolutionRef.current.gaiaLevel;
    const update = registerGaiaEnergy(
      gaiaEvolutionRef.current,
      energyId,
    );
    gaiaEvolutionRef.current = update.state;

    if (!update.accepted || update.duplicate) return;

    if (!update.cycleCompleted) {
      addFloatingText(
        `GAIA SYNC ${update.progressCount}/${update.requiredCount}`,
        playerPosRef.current.x,
        playerPosRef.current.y - 42,
        "#bef264",
      );
      return;
    }

    const gaiaDefinition = getOrbiEnergyDefinition("GAIA");
    const gaiaScale = getGaiaCombatScale(update.state.gaiaLevel);
    const existingGaia = gaiaMemberRef.current;
    let gaiaMember: OrbiMember;
    let isNewGaia = false;

    if (
      !existingGaia ||
      !swarmRef.current.includes(existingGaia)
    ) {
      if (
        swarmRef.current.length >=
        getSwarmDoctrineCapacity(swarmDoctrineRef.current)
      ) {
        postDialogue(
          "SYSTEM",
          "GAIA LISTA, PERO SIN SLOT: eleva un Orbi veterano para completar la síntesis física.",
        );
        return;
      }
      isNewGaia = true;
      gaiaMember = {
        id: "gaia_synthesis_" + Math.random().toString(),
        type: OrbiType.SHIELD,
        name: "GAIA",
        x: playerPosRef.current.x,
        y: playerPosRef.current.y - 24,
        targetX: playerPosRef.current.x,
        targetY: playerPosRef.current.y,
        color: gaiaDefinition.color,
        size: gaiaScale.size,
        shootCooldown: 54 * gaiaScale.cooldownMultiplier,
        affinity: gaiaDefinition.affinity,
        combatRole: gaiaDefinition.combatRole,
        energyId: gaiaDefinition.id,
        attackSignature: gaiaDefinition.attackSignature,
        personality: "SYNTHESIS",
        evolutionStage: gaiaScale.evolutionStage,
        level: update.state.gaiaLevel,
        xp: update.state.completedCycles * update.requiredCount,
      };
      gaiaMemberRef.current = gaiaMember;
      swarmRef.current.push(gaiaMember);
      swarmDoctrineRef.current = registerSwarmDoctrineMember(
        swarmDoctrineRef.current,
        gaiaMember.id,
        gaiaMember.level,
      );
      runOrbiAcquiredRef.current += 1;
      updateRunMaxSwarmSize();
    } else {
      gaiaMember = existingGaia;
      gaiaMember.level = update.state.gaiaLevel;
      swarmDoctrineRef.current = registerSwarmDoctrineLevel(
        swarmDoctrineRef.current,
        gaiaMember.id,
        gaiaMember.level,
      );
      gaiaMember.evolutionStage = gaiaScale.evolutionStage;
      gaiaMember.size = gaiaScale.size;
      gaiaMember.shootCooldown = Math.min(
        gaiaMember.shootCooldown,
        54 * gaiaScale.cooldownMultiplier,
      );
      gaiaMember.xp =
        update.state.completedCycles * update.requiredCount;
    }

    playRecruitSound();
    screenShakeRef.current = isNewGaia ? 18 : 12;
    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.FUSION,
      gaiaMember.x,
      gaiaMember.y,
      gaiaDefinition.color,
      isNewGaia ? 32 : 22,
      isNewGaia ? 4.2 : 3.2,
    );
    addFloatingText(
      isNewGaia
        ? "GAIA SYNTHESIS COMPLETE"
        : update.state.gaiaLevel > previousGaiaLevel
          ? `GAIA ASCENSION · E${update.state.gaiaLevel}`
          : `GAIA ESSENCE · ${update.state.completedCycles}/29`,
      playerPosRef.current.x,
      playerPosRef.current.y - 52,
      gaiaDefinition.color,
    );
    postDialogue(
      "SYSTEM",
      isNewGaia
        ? "GAIA DESPERTADA: las nueve energías coleccionables han entrado en síntesis. Unidad atacante/defensora enlazada."
        : update.state.gaiaLevel > previousGaiaLevel
          ? `GAIA EVOLUCIONA A E${update.state.gaiaLevel}: síntesis de nueve energías.`
          : `GAIA guarda una esencia adicional: ciclo ${update.state.completedCycles}. Nivel actual E${update.state.gaiaLevel} (máximo E8).`,
    );
  };

  // --- ADD ORBI FOLLOWER TO ACTIVE SWARM ---
  const addSwarmMember = (
    predefinedAffinity?: OrbiAffinity,
    predefinedCombatRole?: OrbiCombatRole,
    predefinedEnergyId?: OrbiEnergyId,
  ) => {
    const energyDefinition = predefinedEnergyId
      ? getCollectibleEnergyDefinition(predefinedEnergyId)
      : predefinedAffinity
        ? getOrbiEnergyByAffinity(predefinedAffinity)
        : getCollectibleEnergyDefinition(getNextEnergyIdFromBag());
    const affinity = energyDefinition.affinity;
    const combatRole = predefinedCombatRole || energyDefinition.combatRole;

    // Acquisition drives GAIA progress even when normal capacity later
    // consolidates the newly acquired energy into an existing follower.
    trackGaiaEnergyAcquisition(energyDefinition.id);

    // H4 doctrine: every autonomous follower consumes a slot. Until GAIA
    // awakens, one slot remains reserved so synthesis can never create an
    // eleventh follower behind the capacity gate.
    const doctrineCapacity = getSwarmDoctrineCapacity(swarmDoctrineRef.current);
    const capacityLimit = Math.max(
      0,
      doctrineCapacity - (gaiaMemberRef.current ? 0 : 1),
    );
    const regularSwarmCount = swarmRef.current.length;

    // EVO8: an acquisition always strengthens a matching energy first. In
    // particular, a full roster cannot lend HYDRO XP to an AERO member.
    // Prefer the most advanced living instance to preserve founder promotion
    // credits and finish its 29-acquisition path before recruiting duplicates.
    const matchingFollowers = swarmRef.current
      .filter((member) =>
        member.energyId === energyDefinition.id &&
        member.level < 8 &&
        member.type !== OrbiType.HYDRO_LEVIATHAN &&
        member.type !== OrbiType.SOLAR_GUARDIAN
      )
      .sort((a, b) =>
        b.level - a.level ||
        (b.matchingCoresAtLevel ?? 0) - (a.matchingCoresAtLevel ?? 0)
      );
    const targetOrbi = matchingFollowers[0];
    if (targetOrbi) {
      const oldLevel = targetOrbi.level;
      const oldStage = getEvo8VisualStage(oldLevel);
      const update = applyMatchingEnergyCore({
        energyId: energyDefinition.id,
        level: Math.max(1, Math.min(8, oldLevel)) as OrbiEvolutionLevel,
        matchingCoresAtLevel: targetOrbi.matchingCoresAtLevel ?? 0,
      }, energyDefinition.id);

      targetOrbi.level = update.progress.level;
      targetOrbi.matchingCoresAtLevel = update.progress.matchingCoresAtLevel;
      targetOrbi.xp = acquisitionsForLevel(targetOrbi.level) - 1 +
        targetOrbi.matchingCoresAtLevel;
      targetOrbi.evolutionStage = getEvo8VisualStage(targetOrbi.level);
      // Physical hitboxes remain as before; visual radius is independently
      // capped to ENERGY in the Canvas renderer, even for E8 and fusions.
      targetOrbi.size = Math.min(10.5, 5 + (targetOrbi.evolutionStage - 1) * 1.5 +
        (targetOrbi.level - 1) * 0.15);
      targetOrbi.shootCooldown = Math.max(20,
        80 - (targetOrbi.evolutionStage - 1) * 12 -
        (targetOrbi.level - 1) * 1.5);

      const capacityBefore = getSwarmDoctrineCapacity(swarmDoctrineRef.current);
      if (update.levelUp) {
        swarmDoctrineRef.current = registerSwarmDoctrineLevel(
          swarmDoctrineRef.current, targetOrbi.id, targetOrbi.level,
        );
      }
      const capacityAfter = getSwarmDoctrineCapacity(swarmDoctrineRef.current);
      if (capacityAfter > capacityBefore) {
        postDialogue(
          "SYSTEM",
          `DOCTRINA EVO8: ${targetOrbi.name} E${targetOrbi.level} habilita slot ${capacityAfter}/30.`,
        );
      }

      addFloatingText(
        `${energyDefinition.displayName} CORE · ${targetOrbi.matchingCoresAtLevel}/${targetOrbi.level === 8 ? 0 : targetOrbi.level}`,
        playerPosRef.current.x, playerPosRef.current.y - 24,
        targetOrbi.color,
      );
      if (update.levelUp) {
        const evolved = getEvo8VisualStage(targetOrbi.level) > oldStage;
        addFloatingText(
          `${targetOrbi.name} E${targetOrbi.level}${evolved ? " · EVOLUCIÓN" : ""}`,
          playerPosRef.current.x, playerPosRef.current.y - 38,
          targetOrbi.color,
        );
        postDialogue(
          "SYSTEM",
          `${targetOrbi.name} asciende E${oldLevel} → E${targetOrbi.level}${evolved ? " · nueva forma" : ""}.`,
        );
      }
      playRecruitSound();
      screenShakeRef.current = update.levelUp ? 14 : 5;
      triggerExplosion(
        particlesRef.current,
        getQualityConfig(stats.qualityPreset).maxParticles,
        ParticleType.FUSION,
        targetOrbi.x, targetOrbi.y, targetOrbi.color,
        update.levelUp ? 18 : 9,
      );
      return;
    }

    if (regularSwarmCount >= capacityLimit) {
      // No candidate of this same energy is eligible. E8 extras never yield
      // E9 or XP to another affinity; GAIA's synthesis cycle was already
      // registered above. Keep the resource score, but no follower mutation.
      addFloatingText(
        `CORE ${energyDefinition.displayName} · SIN SLOT / E8`,
        playerPosRef.current.x, playerPosRef.current.y - 25,
        energyDefinition.color,
      );
      return;
    }

    const baseName = energyDefinition.displayName + "-" + (swarmRef.current.length + 1);
    const color = energyDefinition.color;

    const personality = personalities[Math.floor(Math.random() * personalities.length)];

    const member: OrbiMember = {
      id: Math.random().toString(),
      type: OrbiType.BEAM, // preserved as fallback
      name: baseName,
      x: playerPosRef.current.x + (Math.random() * 40 - 20),
      y: playerPosRef.current.y + (Math.random() * 40 - 20),
      targetX: playerPosRef.current.x,
      targetY: playerPosRef.current.y,
      color,
      size: 5 + Math.random() * 2,
      shootCooldown: 60 + Math.random() * 40,
      affinity,
      combatRole,
      energyId: energyDefinition.id,
      attackSignature: energyDefinition.attackSignature,
      personality,
      evolutionStage: 1,
      level: 1,
      xp: 0,
      matchingCoresAtLevel: 0,
    };

    swarmRef.current.push(member);
    swarmDoctrineRef.current = registerSwarmDoctrineMember(
      swarmDoctrineRef.current,
      member.id,
      member.level,
    );
    runOrbiAcquiredRef.current += 1;
    updateRunMaxSwarmSize();
    playRecruitSound();

    // Floating notification for recruitment
    addFloatingText("RECRUITED: " + member.name + " · " + energyDefinition.energyLabel.toUpperCase(), playerPosRef.current.x, playerPosRef.current.y - 25, member.color);

    // Heavy screen shake and massive physical feedback
    screenShakeRef.current = 15;

    // Sparkles of the exact affinity color
    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.SWARM_RECRUIT,
      playerPosRef.current.x,
      playerPosRef.current.y,
      color,
      25,
      3.5
    );

    const displayRole = combatRole.toUpperCase();
    postDialogue(
      "SYSTEM",
      "+1 ORBI " + energyDefinition.displayName + " // " + energyDefinition.energyLabel.toUpperCase() + " [" + displayRole + "]",
    );

    // A full meter may have been waiting for this exact third compatible source.
    tryTriggerAffinityFusion();
  };

  // --- SYSTEM SHOP UPGRADES ---
  const handleBuyUpgrade = (upgradeId: string) => {
    const costTable: Record<string, number> = {
      hydrogen_deflector: 15,
      quantum_core: 25,
      fusion_resonator: 40,
      nano_catalyst: 20,
      mitosis_relic: 60
    };

    const currentLevel = upgradesLevel[upgradeId] || 0;
    const baseCost = costTable[upgradeId] || 15;
    const actualCost = Math.round(baseCost * (1 + currentLevel * 0.5));

    if (nanoCreditsRef.current >= actualCost) {
      nanoCreditsRef.current -= actualCost;
      setNanoCredits(nanoCreditsRef.current);

      const nextLevels = {
        ...upgradesLevel,
        [upgradeId]: currentLevel + 1
      };
      setUpgradesLevel(nextLevels);

      // Save to disk
      const fresh = loadGameStats();
      const memories = Object.entries(nextLevels).map(([k, v]) => `${k}:${v}`);
      const updated: GameStats = {
        ...fresh,
        totalNanoCredits: nanoCreditsRef.current,
        gameMemories: memories
      };
      saveGameStats(updated);
      setStats(updated);

      // Apply immediate buffs
      if (upgradeId === "hydrogen_deflector") {
        shieldRef.current = Math.min(
          SHIELD_MAX + nextLevels.hydrogen_deflector * 15,
          shieldRef.current + 15
        );
      }

      triggerExplosion(
        particlesRef.current,
        getQualityConfig(stats.qualityPreset).maxParticles,
        ParticleType.FORMATION_CHANGE,
        playerPosRef.current.x,
        playerPosRef.current.y,
        "#fbbf24",
        15
      );

      postDialogue("COMPANION", `Tecnología instalada con éxito: ${upgradeId.replace("_", " ")}.`);
    }
  };

  // --- CORE GAME OVER TRIGGER ---
  const triggerGameOver = (won: boolean) => {
    architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter();
    clearArchitectQaDiagnostic();
    architectEngineIdentityOwnerRef.current?.invalidateRun();
    const scoreAttackAttemptActive =
      scoreAttackActivationRef.current !== null;
    loopActiveRef.current = false;
    setIsPhotoMode(false);
    setPhotoHintVisible(false);
    setIsGameOver(true);
    setVictory(won);
    stopBgm();

    runEndTimeRef.current = Date.now();
    if (bossActiveRef.current && bossSessionEndTimeRef.current === 0) {
      bossSessionEndTimeRef.current = Date.now();
    }

    if (won) {
      playVictorySound();
      postDialogue("COMPANION", "¡RESONANCIA PURIFICADA! El Devorador de la red ha sido desmantelado.");
    } else {
      playGameOverSound();
      postDialogue("SYSTEM", "ENIGM-CORE CRASHED. Sincronización del enjambre perdida.");
    }

    if (scoreAttackAttemptActive) {
      scoreAttackActivationRef.current = null;
      return;
    }

    // Persist scores
    commitStats(won, scoreRef.current);
  };

  const enterInfiniteAfterCampaignVictory = () => {
    architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter();
    clearArchitectQaDiagnostic();
    architectEngineIdentityOwnerRef.current?.revoke();
    const fresh = loadGameStats();
    const handoff = beginInfiniteAfterCampaignVictory(
      fresh,
      getCampaignVictoryCheckpointInput(scoreRef.current),
      runCommitLedgerRef.current,
      `orbi-run-${runStartTimeRef.current}`,
    );

    runCommitLedgerRef.current = handoff.checkpoint.ledger;
    updateStatsAndSave(handoff.checkpoint.stats);
    setHighScore(handoff.checkpoint.stats.highScore);

    const infiniteRuntime =
      createInfiniteRuntimeState(handoff.session);
    runtimeProgressionRef.current = infiniteRuntime;

    const infiniteSector = getRuntimeSector(infiniteRuntime);
    const infiniteWave = getRuntimeWaveNumber(infiniteRuntime);

    currentWaveRef.current = infiniteSector;
    setCurrentWave(infiniteSector);
    persistInfiniteReach(
      infiniteSector,
      infiniteWave,
    );

    waveActiveRef.current = false;
    waveBudgetSpawnedRef.current = 0;
    waveTimeRemainingRef.current = 0;
    spawnTimerRef.current = 0;
    waveBreakTimerRef.current = INTER_WAVE_DURATION;
    setIsWaveBreak(true);
    setWaveBreakTimeLeft(
      Math.ceil(INTER_WAVE_DURATION / 1000),
    );

    bossActiveRef.current = false;
    bossRef.current = null;
    bossRematchGateRef.current =
      createRuntimeBossRematchGateState();
    activeBossRematchProfileRef.current = null;
    enemiesRef.current = [];
    projectilesRef.current = [];
    hazardZonesRef.current = [];
    shieldNodesRef.current = [];
    bossCurrentAttackRef.current = null;
    bossIntroTimeRef.current = null;
    setBossAttackName(null);
    setBossIntroTime(null);
    setBossTransitionName(null);
    setBossShieldNodes(0);
    setIsCoreExposed(false);

    if (handoff.descriptor.biomeIntent) {
      setActiveBiome(handoff.descriptor.biomeIntent);
      playBiomeChangeSound();
    }

    setWaveName(
      `INFINITE SWARM // SECTOR ${infiniteSector} · WAVE ${infiniteWave}/${handoff.descriptor.waveCount}`,
    );

    playVictorySound();
    postDialogue(
      "COMPANION",
      "¡RESONANCIA PURIFICADA! El Devorador ha caído, pero la red continúa expandiéndose.",
    );
    postDialogue(
      "SYSTEM",
      `CAMPAÑA COMPLETADA. ENLACE INFINITO ABIERTO: SECTOR ${infiniteSector} · OLEADA ${infiniteWave}/${handoff.descriptor.waveCount}.`,
    );
    startBgm("HIGH_INTENSITY");
  };

  // --- PROCEDURAL REWARDS & ENEMY SPAWN MULTIPLIERS ---
  const spawnResource = (x: number, y: number, forceType?: "NANO" | "ENERGY" | "ORBI") => {
    if (resourcesRef.current.length >= MAX_RESOURCES) return;

    const roll = Math.random();
    let type: "NANO" | "ENERGY" | "ORBI" = "NANO";
    let color = "#fbbf24"; // Amber nano
    let size = 6;
    let amount = 1;

    if (forceType) {
      type = forceType;
    } else {
      if (roll < 0.12) {
        type = "ORBI"; // Recruits new member
        color = "#ec4899"; // pink fallback
        size = 8;
      } else if (roll < 0.35) {
        type = "ENERGY"; // Cyan purifier crystal
        color = "#06b6d4";
        size = 7;
      }
    }

    let orbiAffinity: OrbiAffinity | undefined = undefined;
    let orbiCombatRole: OrbiCombatRole | undefined = undefined;
    let orbiEnergyId: OrbiEnergyId | undefined = undefined;
    let orbiAttackSignature: OrbiMember["attackSignature"] = undefined;

    if (type === "ENERGY") {
      color = "#06b6d4";
      size = 7;
    } else if (type === "ORBI") {
      orbiEnergyId = getNextEnergyIdFromBag();
      const energyDefinition = getCollectibleEnergyDefinition(orbiEnergyId);
      orbiAffinity = energyDefinition.affinity;
      orbiCombatRole = energyDefinition.combatRole;
      orbiAttackSignature = energyDefinition.attackSignature;
      color = energyDefinition.color;
      size = 9; // slightly larger for Wild Orbi

      playCrystalSound();
      triggerExplosion(
        particlesRef.current,
        getQualityConfig(stats.qualityPreset).maxParticles,
        ParticleType.SWARM_RECRUIT,
        x,
        y,
        color,
        25,
        3.5
      );
      postDialogue(
        "COMPANION",
        "¡Núcleo silvestre " + energyDefinition.displayName + " liberado! " + energyDefinition.energyLabel + " [" + orbiCombatRole.toUpperCase() + "].",
      );
    }

    resourcesRef.current.push({
      id: Math.random().toString(),
      type,
      x,
      y,
      size,
      color,
      amount,
      orbiAffinity,
      orbiCombatRole,
      orbiEnergyId,
      orbiAttackSignature,
      consumed: false,
      spawnTime: Date.now()
    });
  };

  // --- AFFINITY FUSION DIRECTOR ---
  const tryTriggerAffinityFusion = () => {
    const resolution = resolveAffinityFusion(
      swarmRef.current,
      fusionEnergyRef.current,
    );
    if (!resolution) return false;

    const fusedMemberId =
      `affinity_fusion_${resolution.recipe.id.toLowerCase()}_${runOrbiAcquiredRef.current + 1}`;
    const applied = applyAffinityFusion(
      swarmRef.current,
      resolution,
      fusedMemberId,
      playerPosRef.current,
    );
    if (!applied) return false;

    // Fusion is contraction-only (3 -> 1), but keep the doctrine boundary
    // fail-closed in case a stale/corrupt runtime roster reaches this helper.
    if (
      applied.members.length >
      getSwarmDoctrineCapacity(swarmDoctrineRef.current)
    ) {
      return false;
    }

    swarmRef.current = applied.members;
    fusionEnergyRef.current = consumeAffinityFusionEnergy(
      fusionEnergyRef.current,
    );

    // Intentionally do NOT register the level-5 fusion body with Swarm Doctrine.
    // Historical source credits stay monotonic; later real promotions remain
    // exclusively owned by the normal doctrine progression path.
    runOrbiAcquiredRef.current += 1;
    updateRunMaxSwarmSize();
    playRecruitSound();
    screenShakeRef.current = 15;

    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.FUSION,
      applied.fusedMember.x,
      applied.fusedMember.y,
      applied.fusedMember.color,
      32,
      4.2,
    );
    addFloatingText(
      `FUSION: ${applied.fusedMember.name}`,
      playerPosRef.current.x,
      playerPosRef.current.y - 42,
      applied.fusedMember.color,
    );
    postDialogue(
      "COMPANION",
      `${applied.fusedMember.name} ONLINE // 3→1 AFFINITY FUSION`,
    );
    return true;
  };

  // --- WAVE TRANSITIONS DIRECTOR ---
  const handleWaveTransitions = (delta: number) => {
    if (bossActiveRef.current) return;

    if (waveActiveRef.current) {
      const runtimeProjection =
        getCurrentRuntimeProjection();
      const descriptor = runtimeProjection.descriptor;
      const effectiveEnemyBudget =
        runtimeProjection.enemyBudget;
      const completionDescriptor =
        effectiveEnemyBudget === descriptor.spawn.enemyBudget
          ? descriptor
          : {
              ...descriptor,
              spawn: {
                ...descriptor.spawn,
                enemyBudget: effectiveEnemyBudget,
              },
            };

      if (shouldTickRuntimeTimer(descriptor)) {
        waveTimeRemainingRef.current -= delta;
      }

      const livingEnemyCount =
        countLivingStandardEnemies(
          enemiesRef.current,
        );

      const milestoneEncounter =
        runtimeProjection.milestoneEncounter;
      const bossRematchProfile =
        milestoneEncounter?.kind === "BOSS_REMATCH"
          ? milestoneEncounter
          : null;

      bossRematchGateRef.current =
        syncRuntimeBossRematchGate(
          bossRematchGateRef.current,
          descriptor.descriptorId,
          milestoneEncounter,
        );
      bossRematchGateRef.current =
        stepRuntimeBossRematchGate(
          bossRematchGateRef.current,
          delta,
        );

      if (bossRematchProfile) {
        const rematchRequest =
          requestRuntimeBossRematch(
            bossRematchGateRef.current,
            bossRematchProfile,
            {
              spawnedEnemyCount:
                waveBudgetSpawnedRef.current,
              effectiveEnemyBudget,
              livingRegularEnemyCount:
                livingEnemyCount,
            },
          );
        bossRematchGateRef.current =
          rematchRequest.state;

        if (rematchRequest.telegraphStarted) {
          const familyProfile = getInfiniteBossFamilyProfile(
            bossRematchProfile.bossIdentity,
          );
          setWaveName(
            `BOSS MILESTONE INBOUND // ${familyProfile.displayName.toUpperCase()}`,
          );
          playBossChargeSound();
          postDialogue(
            "SYSTEM",
            `MILESTONE BOSS LOCKED: ${bossRematchProfile.milestoneId}. ${familyProfile.displayName} inbound.`,
          );
          addFloatingText(
            `⚠ ${familyProfile.displayName.toUpperCase()} INBOUND`,
            playerPosRef.current.x,
            playerPosRef.current.y - 60,
            familyProfile.color,
          );
        }

        if (rematchRequest.readyToSpawn) {
          spawnBoss(bossRematchProfile);
          return;
        }
      }

      const completionSnapshot = {
        remainingTimeMs: waveTimeRemainingRef.current,
        spawnedEnemyCount: waveBudgetSpawnedRef.current,
        livingEnemyCount,
        bossDefeated: false,
      };
      const baseWaveComplete = isRuntimeWaveComplete(
        completionDescriptor,
        completionSnapshot,
      );
      const waveComplete =
        baseWaveComplete &&
        isRuntimeBossRematchResolved(
          bossRematchGateRef.current,
          milestoneEncounter,
        );

      if (waveComplete) {
        const activeScoreAttack = scoreAttackActivationRef.current;
        if (activeScoreAttack) {
          const terminalApplication =
            resolveScoreAttackLiveTerminalApplication(
              activeScoreAttack,
              runtimeProgressionRef.current,
              completionSnapshot,
              statsRef.current,
              scoreRef.current,
            );
          if (!terminalApplication) {
            triggerGameOver(false);
            return;
          }
          if (
            terminalApplication.statsCommitApplication
              .changedDedicatedRecord
          ) {
            updateStatsAndSave({ ...terminalApplication.stats });
          }
          triggerGameOver(true);
          return;
        }

        // Wave complete! Transition into intermission
        waveActiveRef.current = false;
        waveBreakTimerRef.current = INTER_WAVE_DURATION;
        setIsWaveBreak(true);
        setWaveBreakTimeLeft(Math.ceil(INTER_WAVE_DURATION / 1000));
        
        // Recover some shield as a reward
        const regenBonus = 20 + (upgradesLevel.hydrogen_deflector || 0) * 5;
        const currentShieldMax = SHIELD_MAX + (upgradesLevel.hydrogen_deflector || 0) * 15 + (activeRunUpgradesRef.current.foton_integrity || 0) * 30;
        shieldRef.current = Math.min(
          currentShieldMax,
          shieldRef.current + regenBonus
        );

        // Clear active hazards
        hazardZonesRef.current = [];

        const completedRuntime =
          runtimeProgressionRef.current;

        if (completedRuntime.mode === "INFINITE") {
          const completedSector =
            getRuntimeSector(completedRuntime);
          const completedWave =
            getRuntimeWaveNumber(completedRuntime);
          const nextRuntime =
            advanceInfiniteRuntimeState(completedRuntime);
          const nextDescriptor =
            getCachedRuntimeProjectionBundle(
              runtimeProjectionBundleCacheRef.current,
              nextRuntime,
              swarmRef.current.length,
            ).descriptor;
          const nextSector = getRuntimeSector(nextRuntime);
          const nextWave = getRuntimeWaveNumber(nextRuntime);

          runtimeProgressionRef.current = nextRuntime;
          currentWaveRef.current = nextSector;
          setCurrentWave(nextSector);
          persistInfiniteReach(
            nextSector,
            nextWave,
          );

          setWaveName(
            `INFINITE LINK // SECTOR ${nextSector} · WAVE ${nextWave}/${nextDescriptor.waveCount}`,
          );
          postDialogue(
            "COMPANION",
            `Sector ${completedSector} · oleada ${completedWave} purificada. Preparando Sector ${nextSector} · oleada ${nextWave}/${nextDescriptor.waveCount}.`,
          );

          if (
            nextSector !== completedSector &&
            nextDescriptor.biomeIntent
          ) {
            setActiveBiome(nextDescriptor.biomeIntent);
            playBiomeChangeSound();
            triggerExplosion(
              particlesRef.current,
              getQualityConfig(stats.qualityPreset).maxParticles,
              ParticleType.BIOME_PORTAL,
              playerPosRef.current.x,
              playerPosRef.current.y,
              "#a78bfa",
              20,
            );
          }

          startBgm("HIGH_INTENSITY");
        } else {
          const completedWave = currentWaveRef.current;

          // Advance handcrafted campaign sector.
          currentWaveRef.current += 1;
          runtimeProgressionRef.current =
            createCampaignRuntimeState(
              currentWaveRef.current,
            );
          setCurrentWave(currentWaveRef.current);

          // Open mid-run upgrades selector on intermission for specific reward waves!
          if (UPGRADE_REWARD_WAVES.includes(completedWave)) {
            triggerUpgradeSelection();
          }

          if (currentWaveRef.current === BOSS_WAVE_NUMBER) {
            // Warning before boss entry!
            setWaveName("BOSS WARNING: DEVOURER APPROACHING");
            postDialogue(
              "COMPANION",
              "¡ALERTA MÁXIMA! Firma del Blackout Devourer detectada en el sector.",
            );
            startBgm("BOSS");
          } else {
            setWaveName("PREPARATION BREAK");
            postDialogue(
              "COMPANION",
              `Oleada completada. Prepárate para el Sector ${currentWaveRef.current}.`,
            );
            
            // Rotate Biome procedurally on new campaign wave.
            const bIdx =
              (currentWaveRef.current - 1) %
              BIOME_ROTATION.length;
            const nextBiome = BIOME_ROTATION[bIdx];
            setActiveBiome(nextBiome);
            playBiomeChangeSound();

            triggerExplosion(
              particlesRef.current,
              getQualityConfig(stats.qualityPreset).maxParticles,
              ParticleType.BIOME_PORTAL,
              playerPosRef.current.x,
              playerPosRef.current.y,
              "#a78bfa",
              20,
            );
          }
        }
      }
    } else {
      // In intermission break
      waveBreakTimerRef.current -= delta;
      setWaveBreakTimeLeft(Math.ceil(waveBreakTimerRef.current / 1000));

      if (waveBreakTimerRef.current <= 0) {
        // Start the wave!
        waveActiveRef.current = true;
        const descriptor = getCurrentRuntimeDescriptor();
        const cfg =
          descriptor.sourceMode === "CAMPAIGN"
            ? getWaveConfig(currentWaveRef.current)
            : null; // presentation-only WaveIntro contract
        waveTimeRemainingRef.current =
          descriptor.completionPolicy.type === "TIMEBOX"
            ? descriptor.completionPolicy.durationMs
            : (cfg?.duration ?? 0);
        waveBudgetSpawnedRef.current = 0;
        enemyFormationDirectorRef.current =
          createLiveEnemyFormationDirectorState();
        pendingCommandLinkBreakRef.current = null;
        pendingCommandLinkPulseRef.current = null;
        setIsWaveBreak(false);
        setWaveName(descriptor.display.name);

        postDialogue("SYSTEM", `OLEADA ${currentWaveRef.current} ACTIVA: ${descriptor.display.name}`);

        // Set up hazards if applicable
        if (descriptor.modifiers.includes("BLACKOUT_HAZARD_ZONES")) {
          hazardZonesRef.current = [
            { x: WORLD_WIDTH * 0.25 + Math.random() * 100, y: WORLD_HEIGHT * 0.25 + Math.random() * 100, r: 80 },
            { x: WORLD_WIDTH * 0.75 + Math.random() * 100, y: WORLD_HEIGHT * 0.25 + Math.random() * 100, r: 80 },
            { x: WORLD_WIDTH * 0.25 + Math.random() * 100, y: WORLD_HEIGHT * 0.75 + Math.random() * 100, r: 80 },
            { x: WORLD_WIDTH * 0.75 + Math.random() * 100, y: WORLD_HEIGHT * 0.75 + Math.random() * 100, r: 80 },
          ];
        } else {
          hazardZonesRef.current = [];
        }

        // Trigger visual cinematic Wave Intro overlay for handcrafted campaign waves.
        setWaveIntroConfig(cfg);
        setTimeout(() => {
          setWaveIntroConfig(null);
        }, 2500);

        if (descriptor.completionPolicy.type === "BOSS_DEFEAT") {
          spawnBoss();
        } else {
          // Increase background tracks
          if (currentWaveRef.current >= 5) {
            startBgm("HIGH_INTENSITY");
          } else {
            startBgm("EXPLORATION");
          }
        }
      }
    }
  };

  // --- SPAWN REGULAR ENEMY ---
  const spawnEnemy = (forcedType?: EnemyType) => {
    const runtimeProjection =
      getCurrentRuntimeProjection();
    const descriptor = runtimeProjection.descriptor;
    if (
      enemiesRef.current.length >=
      Math.min(MAX_ENEMIES, descriptor.spawn.maxConcurrentEnemies)
    ) return;

    const biomeCfg = getBiomeConfig(activeBiome);
    const combatPressure =
      runtimeProjection.combatPressure;
    const mutatorEffects =
      runtimeProjection.mutatorEffects;
    const milestoneEncounter =
      runtimeProjection.milestoneEncounter;
    const minibossProfile =
      milestoneEncounter?.kind === "MINIBOSS"
        ? milestoneEncounter
        : null;
    const effectiveEnemyBudget =
      runtimeProjection.enemyBudget;

    minibossGateRef.current =
      syncRuntimeMinibossGate(
        minibossGateRef.current,
        descriptor.descriptorId,
        milestoneEncounter,
      );

    const finalBudgetSlot =
      Boolean(minibossProfile) &&
      waveBudgetSpawnedRef.current ===
        effectiveEnemyBudget - 1;
    let spawningMiniboss = false;

    if (finalBudgetSlot && minibossProfile) {
      const request = requestRuntimeMinibossSpawn(
        minibossGateRef.current,
        minibossProfile,
      );
      minibossGateRef.current = request.state;

      if (request.telegraphStarted) {
        playEliteChargeSound();
        setWaveName(
          "MINIBOSS INBOUND // BLACKOUT WARDEN",
        );
        postDialogue(
          "SYSTEM",
          `MILESTONE THREAT LOCKED: ${minibossProfile.milestoneId}. Blackout Warden inbound.`,
        );
        addFloatingText(
          "⚠ BLACKOUT WARDEN INBOUND",
          playerPosRef.current.x,
          playerPosRef.current.y - 55,
          "#fbbf24",
        );
        return;
      }

      if (!request.readyToSpawn) {
        return;
      }

      spawningMiniboss = true;
    }

    // Pick a random enemy type or use the forced type.
    // The milestone champion owns the final budget slot.
    const comp = descriptor.spawn.enemyComposition;
    const tacticalType =
      !spawningMiniboss && !forcedType
        ? resolveRuntimeTacticalEnemySpawn({
            descriptor,
            spawnOrdinal: waveBudgetSpawnedRef.current,
          })
        : null;
    const type =
      spawningMiniboss && minibossProfile
        ? minibossProfile.enemyType
        : forcedType ||
          tacticalType ||
          (comp[Math.floor(Math.random() * comp.length)] ||
            EnemyType.CRAWLER);
    const activeEvolvedEnemies =
      countActiveEvolvedEnemies(
        enemiesRef.current,
      );
    const evolvedProfile =
      spawningMiniboss
        ? null
        : resolveEvolvedEnemySpawn({
            descriptor,
            enemyType: type,
            spawnOrdinal:
              waveBudgetSpawnedRef.current,
            activeEvolvedEnemies,
          });

    const healthMultiplier =
      combatPressure.enemyHealthMultiplier;
    const movementSpeedMultiplier =
      combatPressure.enemyMovementSpeedMultiplier *
      mutatorEffects.enemySpeedMultiplier;

    // Pick spawn boundaries (coherently outside the camera viewport but within 1600x960 world)
    const cam = cameraStateRef.current;
    const margin = 100; // spawn 100px outside the camera viewport

    let ex = 0;
    let ey = 0;
    
    // Pick one of four sides of the viewport
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { // TOP
      ex = cam.cameraX + Math.random() * (cam.viewportWidth / cam.zoom);
      ey = cam.cameraY - margin;
    } else if (side === 1) { // RIGHT
      ex = cam.cameraX + (cam.viewportWidth / cam.zoom) + margin;
      ey = cam.cameraY + Math.random() * (cam.viewportHeight / cam.zoom);
    } else if (side === 2) { // BOTTOM
      ex = cam.cameraX + Math.random() * (cam.viewportWidth / cam.zoom);
      ey = cam.cameraY + (cam.viewportHeight / cam.zoom) + margin;
    } else { // LEFT
      ex = cam.cameraX - margin;
      ey = cam.cameraY + Math.random() * (cam.viewportHeight / cam.zoom);
    }

    // Clamp coordinates to stay within the 1600x960 world bounds
    ex = Math.max(16, Math.min(WORLD_WIDTH - 16, ex));
    ey = Math.max(16, Math.min(WORLD_HEIGHT - 16, ey));

    // Ensure we are not spawning right on top of the player!
    const spawnDx = ex - playerPosRef.current.x;
    const spawnDy = ey - playerPosRef.current.y;
    const spawnDistanceSquared =
      spawnDx * spawnDx + spawnDy * spawnDy;
    const spawnSafetyRadius = Math.max(
      150,
      combatPressure.spawnSafetyRadius,
    );
    if (
      spawnDistanceSquared <
      spawnSafetyRadius * spawnSafetyRadius
    ) {
      const angle = Math.random() * Math.PI * 2;
      const relocationRadius = Math.max(
        300,
        spawnSafetyRadius * 2,
      );
      ex = Math.max(16, Math.min(WORLD_WIDTH - 16, playerPosRef.current.x + Math.cos(angle) * relocationRadius));
      ey = Math.max(16, Math.min(WORLD_HEIGHT - 16, playerPosRef.current.y + Math.sin(angle) * relocationRadius));
    }

    // Class Attributes
    let health = 15 * healthMultiplier;
    let speed = (0.8 + Math.random() * 0.6) * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
    let size = 10;
    let color = "#ef4444"; // standard Red crawler

    if (type === EnemyType.PARASITE) {
      health = 8 * healthMultiplier;
      let baseSpeed = 1.8 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      if (descriptor.modifiers.includes("PARASITE_SPEED_SURGE")) {
        baseSpeed *= 1.4;
      }
      speed = baseSpeed;
      size = 8;
      color = "#f43f5e"; // rose pink parasite
    } else if (type === EnemyType.DRONE) {
      health = 20 * healthMultiplier;
      speed = 0.7 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 11;
      color = "#a855f7"; // purple drone
    } else if (type === EnemyType.RIFT_HUNTER) {
      health = 34 * healthMultiplier;
      speed = 1.55 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 10;
      color = "#fb923c";
    } else if (type === EnemyType.SIEGE_PRISM) {
      health = 52 * healthMultiplier;
      speed = 0.42 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 14;
      color = "#f472b6";
    } else if (type === EnemyType.SWARM_REAVER) {
      health = 38 * healthMultiplier;
      speed = 1.45 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 11;
      color = "#f97316";
    } else if (type === EnemyType.VOID_ANCHOR) {
      health = 65 * healthMultiplier;
      speed = 0.35 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 16;
      color = "#22d3ee";
    } else if (type === EnemyType.MINE_WEAVER) {
      health = 42 * healthMultiplier;
      speed = 0.65 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 12;
      color = "#eab308";
    } else if (type === EnemyType.MIRROR_WARDEN) {
      health = 58 * healthMultiplier;
      speed = 0.75 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 15;
      color = "#e0f2fe";
    } else if (type === EnemyType.SPLITTER) {
      health = 18 * healthMultiplier;
      speed = 0.9 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 12;
      color = "#22c55e"; // Green splitter
    } else if (type === EnemyType.DISRUPTOR) {
      health = 25 * healthMultiplier;
      speed = 0.9 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 11;
      color = "#eab308"; // Amber disruptor
    } else if (type === EnemyType.BLACKOUT_ELITE) {
      health = 45 * healthMultiplier;
      speed = 0.5 * biomeCfg.enemySpeedMultiplier * movementSpeedMultiplier;
      size = 15;
      color = "#3b82f6"; // Blue elite armored
    }

    if (evolvedProfile) {
      health *= evolvedProfile.healthMultiplier;
      speed *= evolvedProfile.movementSpeedMultiplier;
    }

    if (spawningMiniboss && minibossProfile) {
      health *= minibossProfile.healthMultiplier;
      speed *=
        minibossProfile.movementSpeedMultiplier;
      size *= minibossProfile.sizeMultiplier;
      color = "#fbbf24";
    }

    // Elite size scaling roll. Milestone champions never stack a second
    // random elite multiplier on top of their certified encounter profile.
    const effectiveEliteChance = Math.min(
      0.75,
      descriptor.spawn.eliteChance +
        mutatorEffects.eliteChanceBonus,
    );
    const isElite =
      !spawningMiniboss &&
      !evolvedProfile &&
      !tacticalType &&
      Math.random() < effectiveEliteChance;
    if (isElite) {
      health *= 1.8;
      size *= 1.4;
      color = "#f43f5e";
    }

    const formationResolution =
      requestLiveEnemyFormationSpawn(
        enemyFormationDirectorRef.current,
        {
          sourceMode: descriptor.sourceMode,
          waveNumber: descriptor.waveNumber,
          descriptorId: descriptor.descriptorId,
          milestoneActive: descriptor.milestone !== null,
          spawnOrdinal: waveBudgetSpawnedRef.current,
          enemyType: type,
          eligibleEnemy:
            !spawningMiniboss &&
            !evolvedProfile &&
            !isElite,
          remainingCapacity:
            Math.min(
              MAX_ENEMIES,
              descriptor.spawn.maxConcurrentEnemies,
            ) - enemiesRef.current.length,
          nowMs: timeElapsedRef.current,
          anchorX: playerPosRef.current.x,
          anchorY: playerPosRef.current.y,
          worldWidth: WORLD_WIDTH,
          worldHeight: WORLD_HEIGHT,
        },
      );
    enemyFormationDirectorRef.current =
      formationResolution.state;
    const enemyFormation =
      formationResolution.assignment;

    if (enemyFormation) {
      const initialFormationMotion =
        projectLiveEnemyFormationMotion({
          assignment: enemyFormation,
          nowMs: timeElapsedRef.current,
          worldWidth: WORLD_WIDTH,
          worldHeight: WORLD_HEIGHT,
        });
      ex = initialFormationMotion.x;
      ey = initialFormationMotion.y;
    }

    if (
      !spawningMiniboss &&
      type === EnemyType.BLACKOUT_ELITE &&
      descriptor.modifiers.includes("ELITE_SUPPORT")
    ) {
      setTimeout(() => {
        spawnEnemy(EnemyType.DRONE);
      }, 150);
    }

    enemiesRef.current.push({
      id: Math.random().toString(),
      type,
      x: ex,
      y: ey,
      vx: 0,
      vy: 0,
      health,
      maxHealth: health,
      speed,
      size,
      color,
      shootCooldown: (type === EnemyType.DRONE && descriptor.modifiers.includes("DRONE_TARGETING_DENSITY")) 
        ? (80 + Math.random() * 80) * 0.6 
        : 80 + Math.random() * 80,
      pulseCooldown: 120,
      contactDamageCooldown: 0,
      isDead: false,
      isBoss: false,
      enemyFormation: enemyFormation ?? undefined,
      flashTicks: 0,
      evolvedVariantId: evolvedProfile?.id,
      evolvedSignature: evolvedProfile?.signature,
      evolvedContactDamageMultiplier:
        evolvedProfile?.contactDamageMultiplier,
      evolvedAttackRateMultiplier:
        evolvedProfile?.attackRateMultiplier,
      evolvedProjectileSpeedMultiplier:
        evolvedProfile?.projectileSpeedMultiplier,
      evolvedRewardMultiplier:
        evolvedProfile?.rewardMultiplier,
      evolvedSpecialIntensity:
        evolvedProfile?.specialIntensity,
      milestoneKind:
        spawningMiniboss ? "MINIBOSS" : undefined,
      milestoneId:
        spawningMiniboss && minibossProfile
          ? minibossProfile.milestoneId
          : undefined,
      milestoneMovementSpeedMultiplier:
        spawningMiniboss && minibossProfile
          ? minibossProfile.movementSpeedMultiplier
          : undefined,
      milestoneContactDamageMultiplier:
        spawningMiniboss && minibossProfile
          ? minibossProfile.contactDamageMultiplier
          : undefined,
      milestoneRewardMultiplier:
        spawningMiniboss && minibossProfile
          ? minibossProfile.rewardMultiplier
          : undefined,
    });

    if (spawningMiniboss) {
      minibossGateRef.current =
        markRuntimeMinibossSpawned(
          minibossGateRef.current,
        );
      playHeavyImpactSound();
      triggerExplosion(
        particlesRef.current,
        getQualityConfig(stats.qualityPreset)
          .maxParticles,
        ParticleType.BOSS_ENTRY,
        ex,
        ey,
        "#fbbf24",
        30,
        2.2,
      );
      postDialogue(
        "COMPANION",
        "¡BLACKOUT WARDEN EN CAMPO! Rompe su carga frontal y castiga los flancos.",
      );
    }

    waveBudgetSpawnedRef.current += 1;

    // Check for Threat Intel Popup triggering on spawn
    const knownThreats = statsRef.current?.discoveredThreats || stats.discoveredThreats || [];
    const targetThreats = [EnemyType.DRONE, EnemyType.DISRUPTOR, EnemyType.BLACKOUT_ELITE, EnemyType.BOSS_DEVOURER];
    if (targetThreats.includes(type) && !knownThreats.includes(type)) {
      setPausedState(true);
      setActiveThreatIntel(type);
      
      const nextThreats = [...knownThreats, type];
      const nextStats = {
        ...(statsRef.current || stats),
        discoveredThreats: nextThreats
      };
      updateStatsAndSave(nextStats);
    }
  };

  // --- SPAWN GIANT DEVOURER BOSS ---
  // Legacy section boundary retained; H7 routes this boundary through the shared chassis engine.
  // --- SPAWN SHARED BOSS CHASSIS ---
  const spawnBoss = (
    rematchProfile: InfiniteBossRematchProfile | null = null,
    stage: BossEncounterStage = "PRIMARY",
  ) => {
    // Legacy boss entry/replacement revokes; never issues an Architect ticket.
    architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter();
    clearArchitectQaDiagnostic();
    architectEngineIdentityOwnerRef.current?.revoke();
    enemiesRef.current = [];
    enemyFormationDirectorRef.current =
      createLiveEnemyFormationDirectorState();
    pendingCommandLinkBreakRef.current = null;
    pendingCommandLinkPulseRef.current = null;
    hazardZonesRef.current = [];

    const isRematch = rematchProfile !== null;
    const raidProfile =
      stage === "RAID_ESCALATION"
        ? (rematchProfile?.raidEscalation ?? null)
        : null;
    if (stage === "RAID_ESCALATION" && !raidProfile) return;

    const chassisId = raidProfile?.chassis ?? "DEVOURER";
    const chassisProfile = getBossChassisProfile(chassisId);
    const familyProfile =
      rematchProfile && stage === "PRIMARY"
        ? getInfiniteBossFamilyProfile(rematchProfile.bossIdentity)
        : null;
    bossActiveRef.current = true;

    if (isRematch && stage === "PRIMARY") {
      activeBossRematchProfileRef.current = rematchProfile;
    }

    if (!isRematch) {
      bossSessionStartTimeRef.current = Date.now();
      const currentStats = statsRef.current || stats;
      const nextStats = {
        ...currentStats,
        bossAttempts: (currentStats.bossAttempts || 0) + 1,
      };
      updateStatsAndSave(nextStats);
    }

    const healthMultiplier =
      raidProfile?.healthMultiplier ??
      rematchProfile?.healthMultiplier ??
      1;
    const health = chassisProfile.baseHealth * healthMultiplier;
    const damageMultiplier =
      raidProfile?.damageMultiplier ?? rematchProfile?.damageMultiplier;
    const attackRateMultiplier =
      raidProfile?.attackRateMultiplier ?? rematchProfile?.attackRateMultiplier;
    const rewardMultiplier =
      raidProfile?.rewardMultiplier ?? rematchProfile?.rewardMultiplier;

    const boss: Enemy = {
      id:
        stage === "RAID_ESCALATION"
          ? `${chassisId.toLowerCase()}_${rematchProfile?.sector ?? "infinite"}`
          : isRematch
            ? `${rematchProfile?.bossIdentity.toLowerCase() ?? "infinite_boss"}_${rematchProfile?.sector ?? "infinite"}`
            : "blackout_devourer_boss",
      type: chassisProfile.enemyType,
      x: WORLD_WIDTH / 2,
      y: -80,
      vx: 0,
      vy: 0,
      health,
      maxHealth: health,
      speed: 0,
      size: chassisProfile.size,
      color: familyProfile?.color ?? chassisProfile.color,
      shootCooldown: 100,
      pulseCooldown: 180,
      contactDamageCooldown: 0,
      isDead: false,
      isBoss: true,
      bossPhase: 1,
      flashTicks: 0,
      milestoneKind: isRematch ? "BOSS_REMATCH" : undefined,
      milestoneId: rematchProfile?.milestoneId,
      milestoneSector: rematchProfile?.sector,
      infiniteBossIdentity:
        stage === "PRIMARY" ? rematchProfile?.bossIdentity : undefined,
      bossChassis: chassisId,
      bossEncounterStage: stage,
      milestoneContactDamageMultiplier: damageMultiplier,
      milestoneDamageMultiplier: damageMultiplier,
      milestoneAttackRateMultiplier: attackRateMultiplier,
      milestoneRewardMultiplier: rewardMultiplier,
    };

    enemiesRef.current.push(boss);
    bossRef.current = boss;

    bossIntroTimeRef.current = chassisProfile.introDurationMs;
    setBossIntroTime(chassisProfile.introDurationMs);
    setBossHp(health);
    setBossMaxHp(health);
    setBossPhase(1);
    setBossAttackName(null);
    setBossShieldNodes(0);
    setIsCoreExposed(false);
    setBossTransitionName(null);

    bossAttackTimerRef.current = 1000;
    bossCurrentAttackRef.current = null;
    bossAttackTelegraphRef.current = 0;
    bossAttackDurationRef.current = 0;
    bossAttackAngleRef.current = 0;
    bossAttackTargetPosRef.current = {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
    };
    shieldNodesRef.current = [];
    coreExposedTimerRef.current = 0;
    phaseTransitionTimerRef.current = 0;
    bossSummonTimersRef.current = {};
    bossHunterWaveCooldownRef.current = 8000;
    bossHunterWaveTelegraphRef.current = 0;
    gravityWellPulseTimerRef.current = 0;
    shownThreatIntelsRef.current = [];

    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.BOSS_ENTRY,
      WORLD_WIDTH / 2,
      WORLD_HEIGHT / 2,
      chassisProfile.color,
      40,
    );

    if (isRematch && stage === "PRIMARY") {
      bossRematchGateRef.current = markRuntimeBossRematchSpawned(
        bossRematchGateRef.current,
      );
    }

    if (isRematch) {
      setWaveName(
        stage === "RAID_ESCALATION"
          ? `${chassisProfile.displayName.toUpperCase()} // RAID SECTOR ${rematchProfile?.sector ?? currentWaveRef.current}`
          : `${familyProfile?.displayName.toUpperCase() ?? "INFINITE BOSS"} // SECTOR ${rematchProfile?.sector ?? currentWaveRef.current}`,
      );
    }

    startBgm("HIGH_INTENSITY");
    playBossArrivalSound();
    postDialogue(
      "COMPANION",
      stage === "RAID_ESCALATION"
        ? `¡RAID ESCALATION! ${chassisProfile.displayName} ha entrado. Destruye ${chassisProfile.weakpoints.count} ${chassisProfile.weakpoints.hudLabel.toLowerCase()} y abre el núcleo.`
        : isRematch
          ? (familyProfile?.introDialogue ?? "¡RESONANCIA HOSTIL RECURRENTE!")
          : "¡ALERTA! Concentración de energía Blackout masiva en el sector central. ¡El Devorador está entrando!",
    );

    if (stage === "RAID_ESCALATION") {
      spawnBossShieldNodes(boss);
    }
  };

  const skipBossIntro = () => {
    if (bossIntroTimeRef.current === null) return;
    bossIntroTimeRef.current = null;
    setBossIntroTime(null);
    if (bossRef.current) {
      bossRef.current.y = 150;
    }
    playHeavyImpactSound();
    const activeChassis = getBossChassisProfile(
      bossRef.current?.bossChassis ?? "DEVOURER",
    );
    postDialogue(
      "COMPANION",
      `¡ANOMALÍA ESTABILIZADA! Entrando en combate activo contra ${activeChassis.displayName}.`,
    );
  };

  const spawnBossShieldNodes = (boss: Enemy) => {
    const chassis = getBossChassisProfile(boss.bossChassis ?? "DEVOURER");
    const weakpoints = chassis.weakpoints;
    const wormChain =
      weakpoints.motion === "SERPENTINE"
        ? createWormSegmentChain(
            weakpoints.count,
            { x: boss.x, y: boss.y },
            weakpoints.chainPhysics,
          )
        : [];

    shieldNodesRef.current = [];
    for (let i = 0; i < weakpoints.count; i++) {
      const angle = (i * Math.PI * 2) / weakpoints.count;
      const wormSegment = wormChain[i];
      shieldNodesRef.current.push({
        id: wormSegment?.id ?? Math.random().toString(),
        x: wormSegment?.x ?? boss.x + Math.cos(angle) * weakpoints.radiusX,
        y: wormSegment?.y ?? boss.y + Math.sin(angle) * weakpoints.radiusY,
        vx: wormSegment?.vx ?? 0,
        vy: wormSegment?.vy ?? 0,
        health: weakpoints.health,
        maxHealth: weakpoints.health,
        angle,
        flashTicks: 0,
        motion: weakpoints.motion,
        radiusX: weakpoints.radiusX,
        radiusY: weakpoints.radiusY,
        angularVelocityPerFrame: weakpoints.angularVelocityPerFrame,
        collisionRadius: weakpoints.collisionRadius,
      });
    }
    setBossShieldNodes(weakpoints.count);
    playEliteChargeSound();
    postDialogue(
      "COMPANION",
      chassis.id === "WORM_SEGMENTS"
        ? "¡SEIS SEGMENTOS DEL RIFT WORM ACTIVOS! Rompe la cadena de cabeza a cola."
        : chassis.id === "TITAN_CORE"
          ? "¡CUATRO SEGMENTOS DEL TITAN ACTIVOS! Destrúyelos para abrir el núcleo cuántico."
          : "¡EL DEVORADOR HA ACTIVADO ESCUDOS SEGMENTADOS! Destruye los tres nodos satélite.",
    );
  };

  const spawnBossMinion = (type: EnemyType, x: number, y: number) => {
    if (enemiesRef.current.length >= MAX_ENEMIES) return;
    
    let hp = 15;
    let speed = 1.0;
    let size = 10;
    let color = "#ef4444";

    if (type === EnemyType.CRAWLER) { hp = 15; speed = 1.1; size = 10; color = "#ef4444"; }
    else if (type === EnemyType.DRONE) { hp = 25; speed = 0.8; size = 12; color = "#f97316"; }
    else if (type === EnemyType.PARASITE) { hp = 10; speed = 1.5; size = 8; color = "#fb7185"; }
    else if (type === EnemyType.DISRUPTOR) { hp = 40; speed = 0.7; size = 14; color = "#06b6d4"; }
    else if (type === EnemyType.RIFT_HUNTER) { hp = 34; speed = 1.55; size = 10; color = "#fb923c"; }
    else if (type === EnemyType.VOID_ANCHOR) { hp = 65; speed = 0.35; size = 16; color = "#22d3ee"; }
    else if (type === EnemyType.SIEGE_PRISM) { hp = 52; speed = 0.42; size = 14; color = "#f472b6"; }

    enemiesRef.current.push({
      id: Math.random().toString(),
      type,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      health: hp,
      maxHealth: hp,
      speed,
      size,
      color,
      shootCooldown: 80 + Math.random() * 80,
      pulseCooldown: 120,
      contactDamageCooldown: 0,
      isDead: false,
      isBoss: false,
      isMinion: true,
      flashTicks: 0
    });
  };

  const updateBossAI = (boss: Enemy, delta: number) => {
    const chassisProfile = getBossChassisProfile(boss.bossChassis ?? "DEVOURER");

    // 1. INTRO CINEMATIC TICK
    if (bossIntroTimeRef.current !== null) {
      bossIntroTimeRef.current -= delta;
      setBossIntroTime(Math.max(0, bossIntroTimeRef.current));

      // Slow vertical hover entry
      boss.y = -80 + (1 - Math.max(0, bossIntroTimeRef.current) / chassisProfile.introDurationMs) * 230;
      boss.x = WORLD_WIDTH / 2;

      // Center camera gradually between Foton and Boss
      const cam = cameraStateRef.current;
      const targetMidX = (playerPosRef.current.x + boss.x) / 2 - cam.viewportWidth / 2;
      const targetMidY = (playerPosRef.current.y + boss.y) / 2 - cam.viewportHeight / 2;
      cam.cameraX += (targetMidX - cam.cameraX) * 0.05 * (delta / 16.6);
      cam.cameraY += (targetMidY - cam.cameraY) * 0.05 * (delta / 16.6);

      if (bossIntroTimeRef.current <= 0) {
        bossIntroTimeRef.current = null;
        setBossIntroTime(null);
        playHeavyImpactSound();
        postDialogue("COMPANION", `¡ANOMALÍA ESTABILIZADA! Firma de ${chassisProfile.displayName} confirmada.`);
      }
      return;
    }

    // 2. PHASE TRANSITION TICK
    if (phaseTransitionTimerRef.current > 0) {
      phaseTransitionTimerRef.current -= delta;
      
      // Center camera on boss during transitions
      const cam = cameraStateRef.current;
      const targetX = boss.x - cam.viewportWidth / 2;
      const targetY = boss.y - cam.viewportHeight / 2;
      cam.cameraX += (targetX - cam.cameraX) * 0.05 * (delta / 16.6);
      cam.cameraY += (targetY - cam.cameraY) * 0.05 * (delta / 16.6);

      if (
        Math.random() <
        projectFrameProbability(0.15, delta)
      ) {
        triggerExplosion(
          particlesRef.current,
          getQualityConfig(stats.qualityPreset).maxParticles,
          ParticleType.BIOME_PORTAL,
          boss.x,
          boss.y,
          boss.bossPhase === 2 ? "#a855f7" : "#ec4899",
          4
        );
      }

      if (phaseTransitionTimerRef.current <= 0) {
        setBossTransitionName(null);
        bossAttackTimerRef.current = 1000;
      }
      return;
    }

    // 3. VULNERABILITY WINDOW TICK
    if (coreExposedTimerRef.current > 0) {
      coreExposedTimerRef.current -= delta;
      setIsCoreExposed(true);
      if (coreExposedTimerRef.current <= 0) {
        setIsCoreExposed(false);
        const phase = boss.bossPhase || 1;
        if (
          chassisProfile.id !== "WORM_SEGMENTS" &&
          (
            phase === 2 ||
            (chassisProfile.id === "TITAN_CORE" && phase <= 2)
          )
        ) {
          spawnBossShieldNodes(boss);
        }
      }
    }

    // 4. FIXED-COUNT BOSS WEAKPOINT POSITION UPDATES
    if (shieldNodesRef.current.length > 0) {
      if (chassisProfile.id === "WORM_SEGMENTS") {
        stepWormSegmentChainInPlace(
          shieldNodesRef.current,
          { x: boss.x, y: boss.y },
          delta,
          chassisProfile.weakpoints.chainPhysics,
        );
      } else {
        shieldNodesRef.current.forEach((node) => {
          if (node.motion === "ORBITAL") {
            node.angle += node.angularVelocityPerFrame * (delta / 16.6);
          }
          node.x = boss.x + Math.cos(node.angle) * node.radiusX;
          node.y = boss.y + Math.sin(node.angle) * node.radiusY;
        });
      }

      shieldNodesRef.current.forEach((node) => {
        node.flashTicks = decayFrameTicks(node.flashTicks, delta);

        if (Math.random() < projectFrameProbability(0.1, delta)) {
          const px = node.x + (Math.random() - 0.5) * 8;
          const py = node.y + (Math.random() - 0.5) * 8;
          pushVfxParticle({
            id: Math.random().toString(),
            type: ParticleType.FUSION,
            x: px,
            y: py,
            vx: (boss.x - px) * 0.08,
            vy: (boss.y - py) * 0.08,
            color: chassisProfile.color,
            size: 1.5,
            alpha: 1.0,
            life: 15,
            maxLife: 15,
          });
        }
      });
    }

    // Check Phase Transitions
    const hpPercentage = boss.health / boss.maxHealth;
    if ((boss.bossPhase || 1) === 1 && hpPercentage <= 0.70) {
      boss.bossPhase = 2;
      setBossPhase(2);
      if (!isActiveBossRematch()) {
        bossMaxPhaseReachedRef.current = Math.max(
          bossMaxPhaseReachedRef.current,
          2,
        );
      }
      playBossPhaseTransitionSound();
      phaseTransitionTimerRef.current = 2000;
      setBossTransitionName(
        chassisProfile.id === "WORM_SEGMENTS"
          ? "PHASE 2: RIFT COIL"
          : chassisProfile.id === "TITAN_CORE"
            ? "PHASE 2: SEGMENT FORTRESS"
            : "PHASE 2: COLLAPSE ENGINE",
      );
      hazardZonesRef.current = [];
      bossCurrentAttackRef.current = null;
      setBossAttackName(null);
      if (chassisProfile.id !== "WORM_SEGMENTS") {
        spawnBossShieldNodes(boss);
      }
      return;
    }
    if ((boss.bossPhase || 1) === 2 && hpPercentage <= 0.35) {
      boss.bossPhase = 3;
      setBossPhase(3);
      if (!isActiveBossRematch()) {
        bossMaxPhaseReachedRef.current = Math.max(
          bossMaxPhaseReachedRef.current,
          3,
        );
      }
      playBossPhaseTransitionSound();
      phaseTransitionTimerRef.current = 2000;
      setBossTransitionName(
        chassisProfile.id === "WORM_SEGMENTS"
          ? "PHASE 3: RIFT HEART"
          : chassisProfile.id === "TITAN_CORE"
            ? "PHASE 3: QUANTUM CORE"
            : "PHASE 3: SINGULARITY CROWN",
      );
      hazardZonesRef.current = [];
      bossCurrentAttackRef.current = null;
      setBossAttackName(null);
      if (chassisProfile.id !== "WORM_SEGMENTS") {
        shieldNodesRef.current = [];
        setBossShieldNodes(0);
        setIsCoreExposed(false);
        coreExposedTimerRef.current = 0;
      }
      return;
    }

    // 5. BOSS MOVEMENT AI
    if (bossCurrentAttackRef.current === "devourer_charge" && bossAttackTelegraphRef.current <= 0 && bossAttackDurationRef.current > 0) {
      boss.x += boss.vx * (delta / 16.6);
      boss.y += boss.vy * (delta / 16.6);

      let hitWall = false;
      if (boss.x < WORLD_BOUNDS.minX + 40) { boss.x = WORLD_BOUNDS.minX + 40; boss.vx *= -0.5; hitWall = true; }
      if (boss.x > WORLD_BOUNDS.maxX - 40) { boss.x = WORLD_BOUNDS.maxX - 40; boss.vx *= -0.5; hitWall = true; }
      if (boss.y < WORLD_BOUNDS.minY + 40) { boss.y = WORLD_BOUNDS.minY + 40; boss.vy *= -0.5; hitWall = true; }
      if (boss.y > WORLD_BOUNDS.maxY - 40) { boss.y = WORLD_BOUNDS.maxY - 40; boss.vy *= -0.5; hitWall = true; }

      if (hitWall) {
        screenShakeRef.current = 15;
        playHeavyImpactSound();
        triggerExplosion(
          particlesRef.current,
          getQualityConfig(stats.qualityPreset).maxParticles,
          ParticleType.ENEMY_DESTROYED,
          boss.x,
          boss.y,
          "#e11d48",
          12,
          1.8
        );
      }
    } else {
      const pursuit = projectBossPursuit({
        bossX: boss.x,
        bossY: boss.y,
        playerX: playerPosRef.current.x,
        playerY: playerPosRef.current.y,
        phase: boss.bossPhase || 1,
        deltaMs: delta,
        bounds: WORLD_BOUNDS,
        margin: 40,
      });
      boss.x = pursuit.x;
      boss.y = pursuit.y;
    }

    if (chassisProfile.id === "DEVOURER") {
    // 6. SUMMON ADDS
    BLACKOUT_DEVOURER_CANON.summonRules.forEach((rule) => {
      if ((boss.bossPhase || 1) >= rule.phase) {
        const timerKey = rule.enemyType;
        if (bossSummonTimersRef.current[timerKey] === undefined) {
          bossSummonTimersRef.current[timerKey] = rule.cooldown;
        } else {
          bossSummonTimersRef.current[timerKey] -= delta;
          if (bossSummonTimersRef.current[timerKey] <= 0) {
            bossSummonTimersRef.current[timerKey] = rule.cooldown + Math.random() * 3000;

            const currentCount = countMinionsOfType(
              enemiesRef.current,
              rule.enemyType,
            );
            if (currentCount < rule.maxCount) {
              const spawnCount = Math.min(2, rule.maxCount - currentCount);
              for (let i = 0; i < spawnCount; i++) {
                const sx = boss.x + (i === 0 ? -60 : 60) + (Math.random() - 0.5) * 20;
                const sy = boss.y + 40 + Math.random() * 20;
                spawnBossMinion(rule.enemyType, sx, sy);
              }
            }
          }
        }
      }
    });

    if (chassisProfile.id === "DEVOURER") {
    // H3 HUNTER WAVE: bounded support ability. It pauses regular attack
    // selection during a readable 1.2s warning, then deploys a small fixed
    // package. No enemy scan or scheduler is added to the hot path.
    if (bossHunterWaveTelegraphRef.current > 0) {
      bossHunterWaveTelegraphRef.current -= delta;
      if (bossHunterWaveTelegraphRef.current <= 0) {
        const phase = boss.bossPhase || 1;
        const packageTypes = phase >= 3
          ? [EnemyType.PARASITE, EnemyType.PARASITE, EnemyType.DISRUPTOR, EnemyType.SPLITTER]
          : phase >= 2
            ? [EnemyType.CRAWLER, EnemyType.DRONE, EnemyType.SPLITTER]
            : [EnemyType.CRAWLER, EnemyType.CRAWLER, EnemyType.DRONE];
        for (let i = 0; i < packageTypes.length; i += 1) {
          if (enemiesRef.current.length >= MAX_ENEMIES - 1) break;
          const angle = (i / packageTypes.length) * Math.PI * 2;
          spawnBossMinion(
            packageTypes[i],
            boss.x + Math.cos(angle) * 72,
            boss.y + Math.sin(angle) * 56,
          );
        }
        bossHunterWaveCooldownRef.current = phase >= 3 ? 6000 : phase >= 2 ? 7200 : 8500;
        addFloatingText("HUNTER WAVE", boss.x, boss.y - 58, "#f97316");
      }
    } else {
      bossHunterWaveCooldownRef.current -= delta;
      if (
        bossHunterWaveCooldownRef.current <= 0 &&
        bossCurrentAttackRef.current === null &&
        phaseTransitionTimerRef.current <= 0
      ) {
        bossHunterWaveTelegraphRef.current = 1200;
        addFloatingText("HUNTER WAVE INCOMING", boss.x, boss.y - 58, "#fbbf24");
        if (!shownThreatIntelsRef.current.includes("hunter_wave")) {
          shownThreatIntelsRef.current.push("hunter_wave");
          postDialogue("COMPANION", "¡OLEADA CAZADORA! El Devorador despliega refuerzos. Divide el fuego antes de volver al núcleo.");
        }
      }
    }

    }

    // H5 boss-family specialist support reuses the existing summon timer map and hard enemy cap.
    if (boss.infiniteBossIdentity) {
      const family = getInfiniteBossFamilyProfile(boss.infiniteBossIdentity);
      const timerKey = `H5_${family.identity}`;
      const currentTimer = bossSummonTimersRef.current[timerKey];
      if (currentTimer === undefined) {
        bossSummonTimersRef.current[timerKey] = family.supportCooldownMs;
      } else {
        bossSummonTimersRef.current[timerKey] -= delta;
        if (bossSummonTimersRef.current[timerKey] <= 0) {
          bossSummonTimersRef.current[timerKey] = family.supportCooldownMs;
          const activeSupport = countMinionsOfType(
            enemiesRef.current,
            family.supportEnemyType,
          );
          if (
            activeSupport < family.supportMaxCount &&
            enemiesRef.current.length < MAX_ENEMIES
          ) {
            const angle = Math.random() * Math.PI * 2;
            spawnBossMinion(
              family.supportEnemyType,
              boss.x + Math.cos(angle) * 120,
              boss.y + Math.sin(angle) * 120,
            );
            addFloatingText(
              `${family.displayName.toUpperCase()} // SUPPORT VECTOR`,
              boss.x,
              boss.y - 58,
              family.color,
            );
          }
        }
      }
    }

    }

    // 7. ACTIVE ATTACK COOLDOWNS / SELECTION
    if (bossCurrentAttackRef.current === null && bossHunterWaveTelegraphRef.current <= 0) {
      const bossAttackRateMultiplier =
        boss.milestoneAttackRateMultiplier ?? 1;
      bossAttackTimerRef.current -=
        delta * bossAttackRateMultiplier;
      if (bossAttackTimerRef.current <= 0) {
        const possibleAttacks = BLACKOUT_DEVOURER_CANON.attacks.filter(
          (a) => a.minimumPhase <= (boss.bossPhase || 1) && !bossLastAttacksRef.current.includes(a.id)
        );
        if (possibleAttacks.length > 0) {
          const totalWeight = possibleAttacks.reduce(
            (sum, a) =>
              sum +
              getBossChassisAttackWeight(
                boss.bossChassis,
                a.id,
                getInfiniteBossAttackWeight(
                  boss.infiniteBossIdentity,
                  a.id,
                  a.weight,
                ),
              ),
            0,
          );
          let roll = Math.random() * totalWeight;
          let chosen = possibleAttacks[0];
          for (let i = 0; i < possibleAttacks.length; i++) {
            roll -= getBossChassisAttackWeight(
              boss.bossChassis,
              possibleAttacks[i].id,
              getInfiniteBossAttackWeight(
                boss.infiniteBossIdentity,
                possibleAttacks[i].id,
                possibleAttacks[i].weight,
              ),
            );
            if (roll <= 0) {
              chosen = possibleAttacks[i];
              break;
            }
          }

          bossCurrentAttackRef.current = chosen.id;
          setBossAttackName(chosen.displayName);
          bossAttackTelegraphRef.current = chosen.telegraphDuration;
          bossAttackDurationRef.current = chosen.id === "blackout_sweep" ? 5000 : (chosen.id === "rotating_eclipse_lanes" ? 6000 : 3000);
          bossAttackAngleRef.current = Math.atan2(playerPosRef.current.y - boss.y, playerPosRef.current.x - boss.x);
          bossAttackTargetPosRef.current = { x: playerPosRef.current.x, y: playerPosRef.current.y };

          if (
            !isActiveBossRematch() &&
            !bossAttacksSeenThisRunRef.current.includes(chosen.id)
          ) {
            bossAttacksSeenThisRunRef.current.push(chosen.id);
          }

          if (chosen.id === "devourer_beam") playBossChargeSound();
          else if (chosen.id === "gravity_well") playDisruptorChargeSound(true);
          else if (chosen.id === "orbital_shards") playBossShardsSound();
          else if (chosen.id === "blackout_sweep") playDisruptorPulseSound(true);
          else if (chosen.id === "singularity_pulse") playBossPulseSound();
          else if (chosen.id === "rotating_eclipse_lanes") playDisruptorPulseSound(true);
          else if (chosen.id === "devourer_charge") playBossChargeSound();

          if (!shownThreatIntelsRef.current.includes(chosen.id)) {
            shownThreatIntelsRef.current.push(chosen.id);
            const activeBossName = boss.infiniteBossIdentity
              ? getInfiniteBossFamilyProfile(boss.infiniteBossIdentity).displayName
              : getBossChassisProfile(boss.bossChassis ?? "DEVOURER").displayName;
            postDialogue("COMPANION", `¡CUIDADO! ${activeBossName} iniciando ${chosen.displayName.toUpperCase()}. ${chosen.description} Moverse de inmediato.`);
            addFloatingText(`WARNING: ${chosen.displayName.toUpperCase()}`, boss.x, boss.y - 45, chosen.warningColor || "#f43f5e");
          } else {
            addFloatingText(`PREPARING ${chosen.displayName.toUpperCase()}`, boss.x, boss.y - 45, chosen.warningColor || "#f43f5e");
          }
        }
      }
    } else {
      // 8. TELEGRAPH OR COMBAT ACTION PHASE TICK
      if (bossAttackTelegraphRef.current > 0) {
        bossAttackTelegraphRef.current -= delta;
        
        if (bossAttackTelegraphRef.current > 300) {
          if (bossCurrentAttackRef.current === "devourer_beam" || bossCurrentAttackRef.current === "devourer_charge") {
            bossAttackAngleRef.current = Math.atan2(playerPosRef.current.y - boss.y, playerPosRef.current.x - boss.x);
            bossAttackTargetPosRef.current = { x: playerPosRef.current.x, y: playerPosRef.current.y };
          }
        }

        if (bossAttackTelegraphRef.current <= 0) {
          if (bossCurrentAttackRef.current === "devourer_charge") {
            const angle = bossAttackAngleRef.current;
            boss.vx = Math.cos(angle) * 11.0;
            boss.vy = Math.sin(angle) * 11.0;
          }
        }
      } else if (bossAttackDurationRef.current > 0) {
        bossAttackDurationRef.current -= delta;

        executeBossAttackTicks(boss, delta);

        if (bossAttackDurationRef.current <= 0) {
          const finishedId = bossCurrentAttackRef.current;
          bossCurrentAttackRef.current = null;
          setBossAttackName(null);
          
          if (finishedId) bossLastAttacksRef.current.push(finishedId);
          if (bossLastAttacksRef.current.length > 2) bossLastAttacksRef.current.shift();

          bossAttackTimerRef.current = 2200 + Math.random() * 1800;
        }
      }
    }
  };

  const executeBossAttackTicks = (boss: Enemy, delta: number) => {
    const attackId = bossCurrentAttackRef.current;
    if (!attackId) return;

    switch (attackId) {
      case "devourer_beam": {
        bossAttackAngleRef.current += 0.006 * (delta / 16.6);

        const beamLength = 1200;
        const px = playerPosRef.current.x;
        const py = playerPosRef.current.y;
        
        const bx = boss.x;
        const by = boss.y;
        const angle = bossAttackAngleRef.current;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        const t = Math.max(0, Math.min(beamLength, (px - bx) * dx + (py - by) * dy));
        const projX = bx + t * dx;
        const projY = by + t * dy;

        const beamDx = px - projX;
        const beamDy = py - projY;
        const distToBeamSquared =
          beamDx * beamDx + beamDy * beamDy;
        if (distToBeamSquared < 25 * 25) {
          damagePlayerFromBoss(1.6 * (delta / 16.6), "devourer_beam");
        }
        
        if (
          Math.random() <
          projectFrameProbability(0.4, delta)
        ) {
          const randDist = Math.random() * beamLength;
          pushVfxParticle({
            id: Math.random().toString(),
            type: ParticleType.FUSION,
            x: bx + randDist * dx + (Math.random() - 0.5) * 15,
            y: by + randDist * dy + (Math.random() - 0.5) * 15,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            color: "#f43f5e",
            size: 2.0,
            alpha: 1.0,
            life: 25,
            maxLife: 25
          });
        }
        break;
      }

      case "gravity_well": {
        const gx = bossAttackTargetPosRef.current.x;
        const gy = bossAttackTargetPosRef.current.y;
        const pullRadius = 240;

        const fdx = gx - playerPosRef.current.x;
        const fdy = gy - playerPosRef.current.y;
        const fdist = Math.sqrt(fdx * fdx + fdy * fdy) || 1;
        if (fdist < pullRadius) {
          const pullForce = (1 - fdist / pullRadius) * 2.8;
          playerPosRef.current.x += (fdx / fdist) * pullForce * (delta / 16.6);
          playerPosRef.current.y += (fdy / fdist) * pullForce * (delta / 16.6);
          
          if (fdist < 30) {
            damagePlayerFromBoss(0.8 * (delta / 16.6), "gravity_well");
          }
        }

        swarmRef.current.forEach((m) => {
          const mdx = gx - m.x;
          const mdy = gy - m.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
          if (mdist < pullRadius) {
            const pullForce = (1 - mdist / pullRadius) * 3.5;
            m.x += (mdx / mdist) * pullForce * (delta / 16.6);
            m.y += (mdy / mdist) * pullForce * (delta / 16.6);
          }
        });

        if (
          Math.random() <
          projectFrameProbability(0.3, delta)
        ) {
          const pAngle = Math.random() * Math.PI * 2;
          const pDist = 30 + Math.random() * (pullRadius - 30);
          pushVfxParticle({
            id: Math.random().toString(),
            type: ParticleType.FUSION,
            x: gx + Math.cos(pAngle) * pDist,
            y: gy + Math.sin(pAngle) * pDist,
            vx: -Math.cos(pAngle) * 3.0,
            vy: -Math.sin(pAngle) * 3.0,
            color: "#a855f7",
            size: 1.5,
            alpha: 1.0,
            life: 30,
            maxLife: 30
          });
        }
        break;
      }

      case "orbital_shards": {
        bossAttackAngleRef.current += delta;
        if (bossAttackAngleRef.current >= 350) {
          bossAttackAngleRef.current = 0;
          playEnemyShootSound();

          const startAngle = Math.atan2(playerPosRef.current.y - boss.y, playerPosRef.current.x - boss.x);
          const spreads = [-0.25, 0, 0.25];
          spreads.forEach((spread) => {
            const finalAngle = startAngle + spread;
            projectilesRef.current.push({
              id: Math.random().toString(),
              fromPlayer: false,
              x: boss.x + Math.cos(finalAngle) * 45,
              y: boss.y + Math.sin(finalAngle) * 45,
              vx: Math.cos(finalAngle) * 4.8,
              vy: Math.sin(finalAngle) * 4.8,
              damage: 12,
              size: 4,
              color: "#3b82f6",
              life: 220,
              maxLife: 220,
              affinity: "solar"
            });
          });
        }
        break;
      }

      case "blackout_sweep": {
        bossAttackAngleRef.current += 0.004 * (delta / 16.6);

        const bx = boss.x;
        const by = boss.y;
        const px = playerPosRef.current.x;
        const py = playerPosRef.current.y;
        
        const angleToPlayer = Math.atan2(py - by, px - bx);
        
        let diff = Math.abs(angleToPlayer - bossAttackAngleRef.current);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;

        if (diff > 0.35) {
          damagePlayerFromBoss(1.0 * (delta / 16.6), "blackout_sweep");
        }

        if (
          Math.random() <
          projectFrameProbability(0.4, delta)
        ) {
          const pAngle = bossAttackAngleRef.current + 0.5 + Math.random() * (Math.PI * 2 - 1.0);
          const pDist = 50 + Math.random() * 300;
          pushVfxParticle({
            id: Math.random().toString(),
            type: ParticleType.FUSION,
            x: bx + Math.cos(pAngle) * pDist,
            y: by + Math.sin(pAngle) * pDist,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            color: "#fb923c",
            size: 2.2,
            alpha: 1.0,
            life: 20,
            maxLife: 20
          });
        }
        break;
      }

      case "singularity_pulse": {
        bossAttackAngleRef.current += 4.5 * (delta / 16.6);
        const pulseRadius = bossAttackAngleRef.current;

        const bx = boss.x;
        const by = boss.y;
        const px = playerPosRef.current.x;
        const py = playerPosRef.current.y;
        const dist = Math.sqrt((px - bx) * (px - bx) + (py - by) * (py - by));

        if (Math.abs(dist - pulseRadius) < 18) {
          const pAngle = Math.atan2(py - by, px - bx);
          playerPosRef.current.x += Math.cos(pAngle) * 20;
          playerPosRef.current.y += Math.sin(pAngle) * 20;
          damagePlayerFromBoss(15, "singularity_pulse");
          playHeavyImpactSound();
        }

        swarmRef.current.forEach((m) => {
          const mdist = Math.sqrt((m.x - bx) * (m.x - bx) + (m.y - by) * (m.y - by));
          if (Math.abs(mdist - pulseRadius) < 18) {
            const mAngle = Math.atan2(m.y - by, m.x - bx);
            m.x += Math.cos(mAngle) * 25;
            m.y += Math.sin(mAngle) * 25;
          }
        });
        break;
      }

      case "rotating_eclipse_lanes": {
        bossAttackAngleRef.current += 0.012 * (delta / 16.6);

        const bx = boss.x;
        const by = boss.y;
        const px = playerPosRef.current.x;
        const py = playerPosRef.current.y;
        const dist = Math.sqrt((px - bx) * (px - bx) + (py - by) * (py - by));

        const angleToPlayer = Math.atan2(py - by, px - bx);

        let hitLane = false;
        for (let i = 0; i < 3; i++) {
          const laneAngle = bossAttackAngleRef.current + (i * Math.PI * 2) / 3;
          let diff = Math.abs(angleToPlayer - laneAngle);
          while (diff > Math.PI) diff = Math.PI * 2 - diff;
          if (diff < 0.12 && dist < 500) {
            hitLane = true;
          }
        }

        if (hitLane) {
          damagePlayerFromBoss(1.2 * (delta / 16.6), "rotating_eclipse_lanes");
        }
        break;
      }

      case "devourer_charge": {
        if (
          Math.random() <
          projectFrameProbability(0.4, delta)
        ) {
          pushVfxParticle({
            id: Math.random().toString(),
            type: ParticleType.FUSION,
            x: boss.x + (Math.random() - 0.5) * 30,
            y: boss.y + (Math.random() - 0.5) * 30,
            vx: -boss.vx * 0.2,
            vy: -boss.vy * 0.2,
            color: "#e11d48",
            size: 2.0,
            alpha: 1.0,
            life: 15,
            maxLife: 15
          });
        }
        break;
      }
    }
  };

  // --- PRIMARY ENGINE GAME LOOP LOGIC ---
  const gameLoop = (timestamp: number) => {
    if (!loopActiveRef.current) return;

    if (isPausedRef.current || isUpgradeSelectionOpenRef.current) {
      lastTimeRef.current = timestamp;
      frameHealthRef.current = resetFrameHealthState(
        frameHealthRef.current,
      );
      // Lifecycle suspension may win the race before the first active frame.
      // Draw one frozen frame once the canvas exists; never advance simulation.
      if (!suspendedFrameRenderedRef.current && canvasRef.current) {
        renderCanvasScene();
        suspendedFrameRenderedRef.current = true;
      }
      requestAnimationFrame(gameLoop);
      return;
    }

    suspendedFrameRenderedRef.current = false;
    // C2: only ONE genuine DEV-only projectile moves against four actual
    // Architect QA circles. Entire normal wave/enemy/FOTON/world engine remains
    // frozen. Never invoke legacy collision, boss AI, scoring or rewards.
    if (architectQaBossRef.current !== null) {
      const qaDelta = Math.max(0, Math.min(33.2, timestamp - lastTimeRef.current));
      lastTimeRef.current = timestamp;
      const qaBoss = architectQaBossRef.current;
      const qaGuard = architectQaGuardRef.current;
      const qaGeometry = architectQaCardinalsRef.current;
      if (import.meta.env.DEV && qaGuard && qaGeometry &&
          architectEngineIdentityOwnerRef.current?.isCurrent(
            qaGuard, qaBoss, bossRef.current, enemiesRef.current,
          ) === true) {
        // C4: move the existing real FOTON, NEVER the normal engine, swarm or AI.
        const qaFotonStep = stepBlackoutArchitectDevQaFotonMovement(
          playerPosRef.current,
          keysPressedRef.current,
          touchDirectionsRef.current,
          qaDelta,
          FORMATIONS[activeFormationRef.current].speedMod,
        );
        if (qaFotonStep !== null) {
          playerPosRef.current.x = qaFotonStep.x;
          playerPosRef.current.y = qaFotonStep.y;
          // QA-only camera follow, bounded by the same world viewport geometry.
          // Original camera coordinates are restored on every QA exit.
          const qaCamera = cameraStateRef.current;
          if (Number.isFinite(qaCamera.zoom) && qaCamera.zoom > 0 &&
              Number.isFinite(qaCamera.viewportWidth) &&
              Number.isFinite(qaCamera.viewportHeight)) {
            const maxQaCamX = Math.max(0, WORLD_WIDTH - qaCamera.viewportWidth / qaCamera.zoom);
            const maxQaCamY = Math.max(0, WORLD_HEIGHT - qaCamera.viewportHeight / qaCamera.zoom);
            const targetQaCamX = Math.max(0, Math.min(maxQaCamX,
              qaFotonStep.x - qaCamera.viewportWidth / (2 * qaCamera.zoom)));
            const targetQaCamY = Math.max(0, Math.min(maxQaCamY,
              qaFotonStep.y - qaCamera.viewportHeight / (2 * qaCamera.zoom)));
            qaCamera.cameraX = Math.max(0, Math.min(maxQaCamX,
              qaCamera.cameraX + (targetQaCamX - qaCamera.cameraX) * 0.18));
            qaCamera.cameraY = Math.max(0, Math.min(maxQaCamY,
              qaCamera.cameraY + (targetQaCamY - qaCamera.cameraY) * 0.18));
          }
        }
        // C5: real physical GRID_LOCK telegraph/hazard applied only to separate
        // QA hull; never mutate global FOTON shield, scores or legacy entities.
        let qaAttackObservation:ArchitectQaDirectorAttackObservation|null=null;
        let qaAttackPattern:ArchitectQaDirectorPattern="GRID_LOCK";
        const qaGrid = architectQaGridLockRef.current;
        if (qaGrid !== null) {
          const qaGridEvent = stepBlackoutArchitectDevQaGridLock(
            architectEngineIdentityOwnerRef.current,
            qaGuard,
            qaGrid,
            architectQaGridLockRef.current,
            qaBoss,
            bossRef.current,
            enemiesRef.current,
            playerPosRef.current,
            qaDelta,
          );
          if (qaGridEvent === null || qaGridEvent.qaHullDepleted) {
            clearArchitectQaDiagnostic();
            if (qaGridEvent?.qaHullDepleted) setArchitectQaLossVisible(true);
            renderCanvasScene();
            requestAnimationFrame(gameLoop);
            return;
          }
          qaAttackObservation=qaGridEvent;
          qaAttackPattern="GRID_LOCK";
        } else if (architectQaVectorTideRef.current !== null) {
          const qaTide = architectQaVectorTideRef.current;
          const qaTideEvent = stepBlackoutArchitectDevQaVectorTide(
            architectEngineIdentityOwnerRef.current,
            qaGuard,qaTide,architectQaVectorTideRef.current,qaBoss,
            bossRef.current,enemiesRef.current,playerPosRef.current,qaDelta,
          );
          if (qaTideEvent === null || qaTideEvent.qaHullDepleted) {
            clearArchitectQaDiagnostic();
            if (qaTideEvent?.qaHullDepleted) setArchitectQaLossVisible(true);
            renderCanvasScene();
            requestAnimationFrame(gameLoop);
            return;
          }
          qaAttackObservation=qaTideEvent;
          qaAttackPattern="VECTOR_TIDE";
        } else {
          const qaWall = architectQaSectorWallRef.current;
          const qaWallEvent = stepBlackoutArchitectDevQaSectorWall(
            architectEngineIdentityOwnerRef.current,
            qaGuard,qaWall,architectQaSectorWallRef.current,qaBoss,
            bossRef.current,enemiesRef.current,playerPosRef.current,qaDelta,
          );
          if (qaWallEvent === null || qaWallEvent.qaHullDepleted) {
            clearArchitectQaDiagnostic();
            if (qaWallEvent?.qaHullDepleted) setArchitectQaLossVisible(true);
            renderCanvasScene();
            requestAnimationFrame(gameLoop);
            return;
          }
          qaAttackObservation=qaWallEvent;
          qaAttackPattern="SECTOR_WALL";
        }
        // C8 consumes real physical attack step results, and hands off only
        // after the full RECOVERY boundary. Never changes normal combat.
        const qaDirector=architectQaDirectorRef.current;
        if (qaDirector!==null) {
          const plan=stepBlackoutArchitectDevQaPatternDirector(
            architectEngineIdentityOwnerRef.current,qaGuard,qaGeometry,
            qaDirector,architectQaDirectorRef.current,qaBoss,
            bossRef.current,enemiesRef.current,qaAttackPattern,qaAttackObservation,
          );
          if (plan===null) {
            clearArchitectQaDiagnostic();
            renderCanvasScene();
            requestAnimationFrame(gameLoop);
            return;
          }
          if (plan.nextPattern!==null) {
            const next=plan.nextPattern==="GRID_LOCK"
              ? createBlackoutArchitectDevQaGridLockState(
                  architectEngineIdentityOwnerRef.current,qaGuard,qaBoss,
                  bossRef.current,enemiesRef.current,true)
              : plan.nextPattern==="VECTOR_TIDE"
              ? createBlackoutArchitectDevQaVectorTideState(
                  architectEngineIdentityOwnerRef.current,qaGuard,qaBoss,
                  bossRef.current,enemiesRef.current,true)
              : createBlackoutArchitectDevQaSectorWallState(
                  architectEngineIdentityOwnerRef.current,qaGuard,qaBoss,
                  bossRef.current,enemiesRef.current,true);
            if(next===null) {
              clearArchitectQaDiagnostic();
              renderCanvasScene();
              requestAnimationFrame(gameLoop);
              return;
            }
            next.qaHullHealth=plan.qaHullHealth;
            architectQaGridLockRef.current=null;
            architectQaVectorTideRef.current=null;
            architectQaSectorWallRef.current=null;
            if(plan.nextPattern==="GRID_LOCK")
              architectQaGridLockRef.current=next as BlackoutArchitectDevQaGridLockState;
            else if(plan.nextPattern==="VECTOR_TIDE")
              architectQaVectorTideRef.current=next as BlackoutArchitectDevQaVectorTideState;
            else architectQaSectorWallRef.current=next as BlackoutArchitectDevQaSectorWallState;
          }
        }
        const qaShot = architectQaShotRef.current;
        if (qaShot !== null) {
          qaShot.x += qaShot.vx * (qaDelta / 16.6);
          qaShot.y += qaShot.vy * (qaDelta / 16.6);
          const qaHit = resolveBlackoutArchitectDevQaCardinalImpact(
            architectEngineIdentityOwnerRef.current,
            qaGuard,
            qaGeometry,
            bossRef.current,
            enemiesRef.current,
            qaShot,
            architectQaShotRef.current,
          );
          // C3: first priority remains C2 physical cardinal collisions.
          // Core can be hurt only after all four anchors reached zero HP.
          // C13: observed real physical impact only; refresh presentation,
          // never synthesize a collision or mutate HP from the browser.
          if (import.meta.env.DEV && qaHit !== null) {
            refreshArchitectQaTouchControls(v => v + 1);
          }
          const qaCoreHit = !qaHit && qaShot.life > 0
            ? resolveBlackoutArchitectDevQaCoreImpact(
                architectEngineIdentityOwnerRef.current,
                qaGuard,
                qaGeometry,
                bossRef.current,
                enemiesRef.current,
                qaShot,
                architectQaShotRef.current,
              )
            : null;
          if (import.meta.env.DEV && qaCoreHit !== null && !qaCoreHit.coreDisabled) {
            refreshArchitectQaTouchControls(v => v + 1);
          }
          if (qaCoreHit?.coreDisabled) {
            // Owner requires health>0. Revoke immediately on zero, no legacy
            // boss cinematic, score, rewards or Campaign/Infinite transition.
            clearArchitectQaDiagnostic();
            setArchitectQaDefeatVisible(true);
          }
          if (!qaHit && !qaCoreHit && qaShot.life > 0) {
            qaShot.life = Math.max(0, qaShot.life - qaDelta);
          }
          const shotExpired = qaShot.life <= 0 ||
            !Number.isFinite(qaShot.x) || !Number.isFinite(qaShot.y) ||
            qaShot.x < 0 || qaShot.x > WORLD_WIDTH ||
            qaShot.y < 0 || qaShot.y > WORLD_HEIGHT;
          if (shotExpired) {
            const index = projectilesRef.current.indexOf(qaShot);
            if (index >= 0) projectilesRef.current.splice(index, 1);
            if (architectQaShotRef.current === qaShot) architectQaShotRef.current = null;
          }
        }
      } else {
        clearArchitectQaDiagnostic();
      }
      renderCanvasScene();
      requestAnimationFrame(gameLoop);
      return;
    }
    // rAF's frame-start timestamp may precede performance.now() captured
    // when Start/Resume queued this frame. Negative elapsed time used to
    // throw inside Combat Overdrive, aborting rendering after background.
    let delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    delta = nonNegativeAnimationFrameDelta(delta);

    // Clamp huge deltas when switching tabs to avoid teleportation crashes
    if (delta > 100) delta = 16.6;

    const diagnosticsActive =
      performanceDiagnosticsEnabledRef.current;
    const loopCpuStartedAt = diagnosticsActive
      ? performance.now()
      : 0;

    const frameHealth = stepFrameHealthMonitor(
      frameHealthRef.current,
      delta,
      statsRef.current?.qualityPreset ?? stats.qualityPreset,
    );
    frameHealthRef.current = frameHealth.state;

    if (
      frameHealth.completedWindow?.recommendedPreset &&
      frameHealthRecommendationShownRef.current !==
        frameHealth.completedWindow.recommendedPreset
    ) {
      frameHealthRecommendationShownRef.current =
        frameHealth.completedWindow.recommendedPreset;
      postDialogue(
        "SYSTEM",
        `PERFORMANCE PRESSURE: prueba el preset ${frameHealth.completedWindow.recommendedPreset} para una sesión más estable.`,
      );
    }

    // Decay and apply Hit-Stop physical freezing
    if (hitStopTimerRef.current > 0) {
      hitStopTimerRef.current -= delta;
      renderCanvasScene(); // Keep rendering for visual feedback, skip physics updates
      requestAnimationFrame(gameLoop);
      return;
    }

    timeElapsedRef.current += delta;

    // Decay disruption timer & hitstop cooldown
    if (disruptTimerRef.current > 0) {
      disruptTimerRef.current -= delta;
      disruptRecoveryRef.current = 0.35; // Lock recovery back to 0.35 during active disruption
    } else if (disruptRecoveryRef.current < 1.0) {
      // Smoothly recover from sluggish state back to 1.0 over 1 second (1000ms)
      disruptRecoveryRef.current = Math.min(1.0, disruptRecoveryRef.current + delta / 1000);
    }

    if (hitStopCooldownTimerRef.current > 0) {
      hitStopCooldownTimerRef.current -= delta;
    }

    // Update floating texts
    floatingTextsRef.current.forEach((t) => {
      t.y += t.vy * (delta / 16.6);
      t.life -= delta;
    });
    compactArrayInPlace(
      floatingTextsRef.current,
      (t) => t.life > 0,
    );

    const physicsStartedAt = diagnosticsActive
      ? performance.now()
      : 0;
    updateEnginePhysics(delta);
    const physicsFinishedAt = diagnosticsActive
      ? performance.now()
      : 0;

    const renderStartedAt = diagnosticsActive
      ? performance.now()
      : 0;
    renderCanvasScene();
    const renderFinishedAt = diagnosticsActive
      ? performance.now()
      : 0;

    // Preserve the historical 10-frame @ 60 Hz HUD sync cadence by elapsed time.
    const hudCadence = stepCadenceAccumulator(
      reactUpdateAccumulatorMsRef.current,
      delta,
    );
    reactUpdateAccumulatorMsRef.current =
      hudCadence.nextAccumulatorMs;
    if (hudCadence.shouldFlush) {
      combatResonanceRef.current = expireCombatChain(
        combatResonanceRef.current,
        timeElapsedRef.current,
      );
      const liveResonanceProjection = projectCombatResonance(
        combatResonanceRef.current,
      );
      combatOverdriveRef.current = advanceCombatOverdrive(
        combatOverdriveRef.current,
        timeElapsedRef.current,
      );
      const liveOverdriveProjection = projectCombatOverdrive(
        combatOverdriveRef.current,
        timeElapsedRef.current,
        liveResonanceProjection.overdriveReady,
      );
      setCombatResonanceView({
        chain: combatResonanceRef.current.chain,
        resonance: combatResonanceRef.current.resonance,
        ...liveResonanceProjection,
      });
      setCombatOverdriveView(liveOverdriveProjection);
      setScore(scoreRef.current);
      setShield(shieldRef.current);
      setSwarmSize(swarmRef.current.length + 1);
    }

    if (diagnosticsActive) {
      const loopCpuFinishedAt = performance.now();
      const diagnostics = stepPerformanceDiagnostics(
        performanceDiagnosticsStateRef.current,
        {
          frameMs: delta,
          loopCpuMs:
            loopCpuFinishedAt - loopCpuStartedAt,
          physicsMs:
            physicsFinishedAt - physicsStartedAt,
          renderMs:
            renderFinishedAt - renderStartedAt,
          enemies: enemiesRef.current.length,
          projectiles: projectilesRef.current.length,
          particles: particlesRef.current.length,
          swarm: swarmRef.current.length + 1,
          gaiaActive: gaiaMemberRef.current !== null,
          gaiaLevel: gaiaEvolutionRef.current.gaiaLevel,
          gaiaCompletedCycles:
            gaiaEvolutionRef.current.completedCycles,
          gaiaProgress: getGaiaProgressCount(
            gaiaEvolutionRef.current,
          ),
          gaiaRequired: GAIA_REQUIRED_ENERGY_COUNT,
          qualityPreset:
            statsRef.current?.qualityPreset ??
            stats.qualityPreset,
          frameHealthStatus:
            frameHealthRef.current.lastWindow?.status,
        },
      );
      performanceDiagnosticsStateRef.current =
        diagnostics.state;
      if (diagnostics.snapshot) {
        setPerformanceDiagnosticsSnapshot(
          diagnostics.snapshot,
        );

        const evidenceRecorder =
          performanceEvidenceRecorderRef.current;
        if (evidenceRecorder.status === "RECORDING") {
          const nextEvidenceRecorder =
            appendPerformanceEvidenceSample(
              evidenceRecorder,
              diagnostics.snapshot,
            );
          performanceEvidenceRecorderRef.current =
            nextEvidenceRecorder;
          setPerformanceEvidenceStatus(
            nextEvidenceRecorder.status,
          );
          setPerformanceEvidenceSamples(
            nextEvidenceRecorder.samples.length,
          );

          if (nextEvidenceRecorder.status === "READY") {
            postDialogue(
              "SYSTEM",
              "EVIDENCE READY · 15 s completos. F4 para exportar JSON.",
            );
          }
        }
      }
    }

    requestAnimationFrame(gameLoop);
  };

  // --- BOSS DEFEAT CINEMATIC SEQUENCE ENGINE (PART 2/2) ---
  const updateBossDefeatSequence = (delta: number) => {
    if (!bossDefeatedSequenceActiveRef.current) return;

    bossDefeatedSequenceTimerRef.current -= delta;

    // Clear active projectiles, hazard zones, and standard enemies
    projectilesRef.current = [];
    hazardZonesRef.current = [];
    compactArrayInPlace(
      enemiesRef.current,
      (enemy) => enemy.isBoss,
    );

    const boss = bossRef.current;
    if (boss) {
      boss.vx = 0;
      boss.vy = 0;

      // Slowly collapse size and fade color to dark violet
      boss.size = Math.max(5, boss.size - 0.1 * (delta / 16.6));
      boss.color = `rgba(147, 51, 234, ${Math.max(0.1, bossDefeatedSequenceTimerRef.current / 5000)})`;

      // 1. Staged Explosions: Generate spectacular random particle bursts
      if (
        Math.random() <
        projectFrameProbability(0.25, delta)
      ) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * boss.size;
        const ex = boss.x + Math.cos(angle) * radius;
        const ey = boss.y + Math.sin(angle) * radius;

        // Play random explosions
        playEnemyExplodeSound(true);
        triggerExplosion(
          particlesRef.current,
          getQualityConfig(stats.qualityPreset).maxParticles,
          ParticleType.ENEMY_DESTROYED,
          ex,
          ey,
          Math.random() < 0.5 ? "#ec4899" : "#3b82f6",
          25,
          2.5
        );
      }

      // 2. HEROIC MOMENT FEEDBACK: Make Orbi Foton leader extremely bright & ring active
      if (
        Math.random() <
        projectFrameProbability(0.20, delta)
      ) {
        playCriticalHitSound();
        const startX = playerPosRef.current.x;
        const startY = playerPosRef.current.y;
        
        // Spawn purifiers pointing towards the collapsing boss
        pushVfxParticle({
          id: Math.random().toString(),
          type: ParticleType.FUSION,
          x: startX,
          y: startY,
          vx: (boss.x - startX) * 0.05,
          vy: (boss.y - startY) * 0.05,
          color: "#fbbf24",
          size: 3.5,
          alpha: 1.0,
          life: 30,
          maxLife: 30
        });

        // Add a giant screen-shake
        screenShakeRef.current = Math.max(screenShakeRef.current, 15);
      }
    }

    // After 5 seconds, either resolve an isolated infinite rematch or
    // checkpoint the original campaign victory.
    if (bossDefeatedSequenceTimerRef.current <= 0) {
      architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter();
    clearArchitectQaDiagnostic();
      architectEngineIdentityOwnerRef.current?.revoke();
      bossDefeatedSequenceActiveRef.current = false;

      if (boss?.milestoneKind === "BOSS_REMATCH") {
        const rematchProfile = activeBossRematchProfileRef.current;
        const defeatAction = resolveBossRematchDefeatAction(
          boss.bossEncounterStage,
          rematchProfile?.raidEscalation,
        );

        if (
          defeatAction === "SPAWN_RAID_ESCALATION" &&
          rematchProfile?.raidEscalation
        ) {
          bossActiveRef.current = false;
          bossRef.current = null;
          enemiesRef.current = [];
          projectilesRef.current = [];
          hazardZonesRef.current = [];
          shieldNodesRef.current = [];
          bossCurrentAttackRef.current = null;
          bossIntroTimeRef.current = null;
          setBossAttackName(null);
          setBossIntroTime(null);
          setBossTransitionName(null);
          setBossShieldNodes(0);
          setIsCoreExposed(false);
          const raidChassis = getBossChassisProfile(
            rematchProfile.raidEscalation.chassis,
          );
          postDialogue(
            "COMPANION",
            `¡PRIMERA FIRMA DERROTADA! La masa de raid sigue activa: ${raidChassis.displayName} entrando.`,
          );
          spawnBoss(rematchProfile, "RAID_ESCALATION");
          return;
        }

        bossRematchGateRef.current = markRuntimeBossRematchDefeated(
          bossRematchGateRef.current,
        );
        persistInfiniteMilestoneDefeat(boss);
        activeBossRematchProfileRef.current = null;
        bossActiveRef.current = false;
        bossRef.current = null;
        enemiesRef.current = [];
        projectilesRef.current = [];
        hazardZonesRef.current = [];
        shieldNodesRef.current = [];
        bossCurrentAttackRef.current = null;
        bossIntroTimeRef.current = null;
        setBossAttackName(null);
        setBossIntroTime(null);
        setBossTransitionName(null);
        setBossShieldNodes(0);
        setIsCoreExposed(false);

        const defeatedFamily = boss.infiniteBossIdentity
          ? getInfiniteBossFamilyProfile(boss.infiniteBossIdentity)
          : null;
        const defeatedChassis = getBossChassisProfile(
          boss.bossChassis ?? "DEVOURER",
        );
        addFloatingText(
          defeatedFamily?.defeatLabel ??
            `${defeatedChassis.displayName.toUpperCase()} CLEARED`,
          playerPosRef.current.x,
          playerPosRef.current.y - 54,
          defeatedFamily?.color ?? defeatedChassis.color,
        );
        postDialogue(
          "COMPANION",
          defeatedFamily?.defeatDialogue ??
            `¡${defeatedChassis.displayName.toUpperCase()} NEUTRALIZADO! Raid milestone estabilizado.`,
        );
        return;
      }

      enterInfiniteAfterCampaignVictory();
    }
  };

  // --- ENGINE UPDATES (Movement, projectile, spawn, single-impact collision sweeps) ---
  const updateEnginePhysics = (delta: number) => {
    // 0. BOSS DEFEAT CINEMATIC SEQUENCE HANDLING
    if (bossDefeatedSequenceActiveRef.current) {
      updateBossDefeatSequence(delta);

      // We still update screen shake and camera zoom for dramatic effect!
      if (screenShakeRef.current > 0) {
        screenShakeRef.current -= delta / 16.6;
      }
      
      // Update particles
      particlesRef.current.forEach((p) => {
        updateParticle(p, delta);
      });
      compactArrayInPlace(
        particlesRef.current,
        (particle) => particle.life > 0,
      );

      // Also update player leader flash ticks using refresh-rate-neutral cadence.
      playerFlashRef.current = decayFrameTicks(
        playerFlashRef.current,
        delta,
      );
      
      // Return early to freeze rest of physical ticks!
      return;
    }

    // Paused/modal/hit-stop and boss-cinematic frames must not advance physics trace.
    collisionTracePhysicsFrameRef.current = nextBlackoutArchitectCollisionTraceOrdinal(
      collisionTracePhysicsFrameRef.current,
    );

    const runtimeFormation = activeFormationRef.current;
    formationUseCountsRef.current[runtimeFormation] =
      (formationUseCountsRef.current[runtimeFormation] ?? 0) +
      delta;
    updateRunMaxSwarmSize();

    const frameRuntimeProjection =
      getCurrentRuntimeProjection();
    const frameMutatorEffects =
      frameRuntimeProjection.mutatorEffects;

    // 1. Invincibility timer ticks
    if (invincibilityTimerRef.current > 0) {
      invincibilityTimerRef.current -= delta;
      playerFlashRef.current = decayFrameTicks(
        playerFlashRef.current,
        delta,
      );
    }

    // 2. CAMERA AND SCREEN SHAKE UPDATES
    const cam = cameraStateRef.current;
    
    // UX02: landscape mobile expands visible WORLD width without zooming,
    // distorting hazards or changing original WORLD bounds and physics.
    cam.viewportWidth = panoramicViewport.width;
    cam.viewportHeight = panoramicViewport.height;

    // Dynamic Zoom Interpolation
    const swarmCount = swarmRef.current.length + 1; // Foton + followers
    let targetZoom = 1.0;
    if (swarmCount <= 12) {
      targetZoom = 1.08 - ((swarmCount - 1) / 11) * 0.08;
    } else if (swarmCount <= 24) {
      targetZoom = 1.00 - ((swarmCount - 12) / 12) * 0.08;
    } else if (swarmCount <= 36) {
      targetZoom = 0.92 - ((swarmCount - 24) / 12) * 0.08;
    } else if (swarmCount <= 48) {
      targetZoom = 0.84 - ((swarmCount - 36) / 12) * 0.08;
    } else {
      targetZoom = 0.78 - ((swarmCount - 48) / 12) * 0.08;
    }

    const MIN_CAMERA_ZOOM = 0.70;
    const MAX_CAMERA_ZOOM = 1.08;
    cam.targetZoom = Math.max(MIN_CAMERA_ZOOM, Math.min(MAX_CAMERA_ZOOM, targetZoom));
    cam.zoom += (cam.targetZoom - cam.zoom) * 0.02 * (delta / 16.6);

    // Calculate Foton center position in screen coordinates relative to camera
    const screenPx = (playerPosRef.current.x - cam.cameraX) * cam.zoom;
    const screenPy = (playerPosRef.current.y - cam.cameraY) * cam.zoom;

    const dxScreen = screenPx - cam.viewportWidth / 2;
    const dyScreen = screenPy - cam.viewportHeight / 2;

    // Dead zone: 15% of screen size
    const deadZoneW = cam.viewportWidth * 0.15;
    const deadZoneH = cam.viewportHeight * 0.15;

    let targetCamX = cam.cameraX;
    let targetCamY = cam.cameraY;

    if (Math.abs(dxScreen) > deadZoneW) {
      const excess = dxScreen > 0 ? dxScreen - deadZoneW : dxScreen + deadZoneW;
      targetCamX += excess / cam.zoom;
    }
    if (Math.abs(dyScreen) > deadZoneH) {
      const excess = dyScreen > 0 ? dyScreen - deadZoneH : dyScreen + deadZoneH;
      targetCamY += excess / cam.zoom;
    }

    // Camera Look Ahead: advance camera in moving direction (12% max offset)
    let dirX = 0;
    let dirY = 0;
    if (keysPressedRef.current["W"] || keysPressedRef.current["ARROWUP"]) dirY -= 1;
    if (keysPressedRef.current["S"] || keysPressedRef.current["ARROWDOWN"]) dirY += 1;
    if (keysPressedRef.current["A"] || keysPressedRef.current["ARROWLEFT"]) dirX -= 1;
    if (keysPressedRef.current["D"] || keysPressedRef.current["ARROWRIGHT"]) dirX += 1;

    const touchLookVector = projectAnalogMotion(analogJoystickRef.current);
    const directionalLookVector = getTouchMovementVector(touchDirectionsRef.current);
    if (touchLookVector.x === 0 && touchLookVector.y === 0) {
      touchLookVector.x = directionalLookVector.x;
      touchLookVector.y = directionalLookVector.y;
    }
    if (dirX === 0 && dirY === 0 && (touchLookVector.x !== 0 || touchLookVector.y !== 0)) {
      dirX = touchLookVector.x;
      dirY = touchLookVector.y;
    }

    // fallback to pointer direction if dragging or moving
    if (dirX === 0 && dirY === 0 && isMouseDownRef.current) {
      const dx = pointerRef.current.x - playerPosRef.current.x;
      const dy = pointerRef.current.y - playerPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 15) {
        dirX = dx / dist;
        dirY = dy / dist;
      }
    }

    const lookAheadMaxX = (cam.viewportWidth * 0.12) / cam.zoom;
    const lookAheadMaxY = (cam.viewportHeight * 0.12) / cam.zoom;
    const targetLookX = dirX * lookAheadMaxX;
    const targetLookY = dirY * lookAheadMaxY;

    cam.lookAheadX += (targetLookX - cam.lookAheadX) * 0.05 * (delta / 16.6);
    cam.lookAheadY += (targetLookY - cam.lookAheadY) * 0.05 * (delta / 16.6);

    // Apply lookAhead shift
    targetCamX += cam.lookAheadX;
    targetCamY += cam.lookAheadY;

    // Bounds checking: clamp camera to stay strictly within [0, WORLD_WIDTH] x [0, WORLD_HEIGHT]
    const maxCamX = Math.max(0, WORLD_WIDTH - cam.viewportWidth / cam.zoom);
    const maxCamY = Math.max(0, WORLD_HEIGHT - cam.viewportHeight / cam.zoom);

    targetCamX = Math.max(0, Math.min(maxCamX, targetCamX));
    targetCamY = Math.max(0, Math.min(maxCamY, targetCamY));

    // LERP Damping (smooth follow)
    cam.cameraX += (targetCamX - cam.cameraX) * 0.08 * (delta / 16.6);
    cam.cameraY += (targetCamY - cam.cameraY) * 0.08 * (delta / 16.6);

    cam.cameraX = Math.max(0, Math.min(maxCamX, cam.cameraX));
    cam.cameraY = Math.max(0, Math.min(maxCamY, cam.cameraY));

    // Apply Screen Shake context parameters
    if (screenShakeRef.current > 0) {
      screenShakeRef.current *=
        projectFrameDamping(0.9, delta);
      if (screenShakeRef.current < 0.1) {
        screenShakeRef.current = 0;
      }
      
      const shakeMode = statsRef.current?.screenShakeMode || stats.screenShakeMode || "FULL";
      const shakeMod = shakeMode === "FULL" ? 1.0 : (shakeMode === "REDUCED" ? 0.35 : 0);
      const shakeVal = screenShakeRef.current * shakeMod;

      cam.shakeX = (Math.random() - 0.5) * shakeVal;
      cam.shakeY = (Math.random() - 0.5) * shakeVal;
    } else {
      cam.shakeX = 0;
      cam.shakeY = 0;
    }

    // Keep cameraOffsetRef updated for backwards-compatible drawings
    cameraOffsetRef.current = { x: cam.shakeX, y: cam.shakeY };

    // 3. Foton movement physics (keyboard/touch share the same delta model)
    let moveX = 0;
    let moveY = 0;

    if (keysPressedRef.current["W"] || keysPressedRef.current["ARROWUP"]) moveY -= 1;
    if (keysPressedRef.current["S"] || keysPressedRef.current["ARROWDOWN"]) moveY += 1;
    if (keysPressedRef.current["A"] || keysPressedRef.current["ARROWLEFT"]) moveX -= 1;
    if (keysPressedRef.current["D"] || keysPressedRef.current["ARROWRIGHT"]) moveX += 1;

    const hasKeyboardMovement = moveX !== 0 || moveY !== 0;
    const analogMoveVector = projectAnalogMotion(analogJoystickRef.current);
    const legacyTouchMoveVector = getTouchMovementVector(touchDirectionsRef.current);
    const isAnalogEngaged = analogMoveVector.x !== 0 || analogMoveVector.y !== 0;
    const touchMoveVector = isAnalogEngaged ? analogMoveVector : legacyTouchMoveVector;
    const hasTouchMovement = touchMoveVector.x !== 0 || touchMoveVector.y !== 0;

    // Keyboard wins if both hardware and touch input are active. Otherwise held
    // touch directions feed the exact same speed/formation/disruption pipeline.
    if (!hasKeyboardMovement && hasTouchMovement) {
      moveX = touchMoveVector.x;
      moveY = touchMoveVector.y;
    }

    const pSpeedBase = PLAYER_BASE_SPEED * FORMATIONS[activeFormationRef.current].speedMod * (1.0 + (upgradesLevel.quantum_core || 0) * 0.1);
    const speedUpgradeMultiplier = 1.0 + (activeRunUpgradesRef.current.quantum_stabilization || 0) * 0.15;
    const pSpeed = pSpeedBase * speedUpgradeMultiplier * disruptRecoveryRef.current;

    if (hasKeyboardMovement) {
      lastInputTypeRef.current = "KEYBOARD";
      clickToMoveTargetRef.current = null;
    } else if (hasTouchMovement) {
      lastInputTypeRef.current = "TOUCH_PAD";
      clickToMoveTargetRef.current = null;
    }

    if (lastInputTypeRef.current === "KEYBOARD" || lastInputTypeRef.current === "TOUCH_PAD") {
      if (moveX !== 0 || moveY !== 0) {
        // Normalize diagonals so two held directions do not move faster.
        const len = Math.sqrt(moveX * moveX + moveY * moveY);
        // Analog magnitude controls speed; hardware keys/legacy input retain full speed.
        const intensity = !hasKeyboardMovement && isAnalogEngaged ? Math.min(1, len) : 1;
        playerPosRef.current.x += (moveX / len) * pSpeed * intensity * (delta / 16.6);
        playerPosRef.current.y += (moveY / len) * pSpeed * intensity * (delta / 16.6);
      } else {
        // No hardware/touch direction held: Foton stands still.
        lastInputTypeRef.current = "NONE";
      }
    } else if (lastInputTypeRef.current === "MOUSE_DRAG") {
      const dx = pointerRef.current.x - playerPosRef.current.x;
      const dy = pointerRef.current.y - playerPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 2) {
        const easeSpeed = pSpeed * 0.85;
        playerPosRef.current.x += (dx / dist) * Math.min(dist, easeSpeed) * (delta / 16.6);
        playerPosRef.current.y += (dy / dist) * Math.min(dist, easeSpeed) * (delta / 16.6);
      }
    } else if (lastInputTypeRef.current === "CLICK_TO_MOVE") {
      if (clickToMoveTargetRef.current !== null) {
        const dx = clickToMoveTargetRef.current.x - playerPosRef.current.x;
        const dy = clickToMoveTargetRef.current.y - playerPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 4) {
          const easeSpeed = pSpeed;
          playerPosRef.current.x += (dx / dist) * Math.min(dist, easeSpeed) * (delta / 16.6);
          playerPosRef.current.y += (dy / dist) * Math.min(dist, easeSpeed) * (delta / 16.6);
        } else {
          // Arrived!
          clickToMoveTargetRef.current = null;
          lastInputTypeRef.current = "NONE";
        }
      }
    } else {
      // InputType is "NONE": stop immediately! Foton stands perfectly still.
    }

    // Clamp inside world boundaries (1600x960 expanded battlefield)
    playerPosRef.current.x = Math.max(16, Math.min(WORLD_WIDTH - 16, playerPosRef.current.x));
    playerPosRef.current.y = Math.max(16, Math.min(WORLD_HEIGHT - 16, playerPosRef.current.y));

    // 4. Align and smooth swarm followers following Foton leader
    const mouseAngle = Math.atan2(
      pointerRef.current.y - playerPosRef.current.y,
      pointerRef.current.x - playerPosRef.current.x
    );

    formationCooldownRef.current = Math.max(
      0,
      formationCooldownRef.current - delta,
    );

    const recoilDamping =
      projectFrameDamping(0.82, delta);
    let targetingEnemyIndex: SpatialIndex<Enemy> | null =
      null;

    swarmRef.current.forEach((member, idx) => {
      // Decelerate shooting recoil and flash ticks with 60 Hz baseline parity.
      if (
        member.recoilX &&
        Math.abs(member.recoilX) > 0.05
      ) {
        member.recoilX *= recoilDamping;
      } else {
        member.recoilX = 0;
      }
      if (
        member.recoilY &&
        Math.abs(member.recoilY) > 0.05
      ) {
        member.recoilY *= recoilDamping;
      } else {
        member.recoilY = 0;
      }
      member.flashTicks = decayFrameTicks(
        member.flashTicks ?? 0,
        delta,
      );

      const offsets = calculateSwarmOffset(
        activeFormationRef.current,
        idx,
        swarmRef.current.length,
        timeElapsedRef.current,
        mouseAngle
      );

      // Apply disruption scatter/cohesion-loss (Section 3.2 - reduce brevemente la cohesion)
      let ox = offsets.x;
      let oy = offsets.y;
      if (disruptTimerRef.current > 0) {
        const scatterAmt = (disruptTimerRef.current / 2000) * 85; // Decaying noise amplitude
        ox += Math.sin(timeElapsedRef.current * 0.035 + idx * 1.5) * scatterAmt;
        oy += Math.cos(timeElapsedRef.current * 0.035 + idx * 1.5) * scatterAmt;
      }

      // --- FORMACIÓN CERCA DE BORDES (Squish offsets near world edges smoothly) ---
      const edgeDistX = Math.min(playerPosRef.current.x, WORLD_WIDTH - playerPosRef.current.x);
      const edgeDistY = Math.min(playerPosRef.current.y, WORLD_HEIGHT - playerPosRef.current.y);
      let edgeScaleX = 1.0;
      let edgeScaleY = 1.0;
      if (edgeDistX < 120) {
        edgeScaleX = 0.35 + 0.65 * (edgeDistX / 120);
      }
      if (edgeDistY < 120) {
        edgeScaleY = 0.35 + 0.65 * (edgeDistY / 120);
      }
      ox *= edgeScaleX;
      oy *= edgeScaleY;

      // --- SWARM LEASH / RECOVERY SYSTEM (Calculate distance to leader Foton) ---
      const dxToLeader = playerPosRef.current.x - member.x;
      const dyToLeader = playerPosRef.current.y - member.y;
      const distToLeader = Math.sqrt(dxToLeader * dxToLeader + dyToLeader * dyToLeader);
      member.distToLeader = distToLeader;

      const LEASH_DISTANCE_SOFT = 160;
      const LEASH_DISTANCE_HARD = 280;

      let followRate = (0.12 + (upgradesLevel.quantum_core || 0) * 0.02) * disruptRecoveryRef.current;
      if (waveActiveRef.current) {
        followRate *=
          frameMutatorEffects.formationCohesionMultiplier;
      }

      // Swarm Overscale temporary upgrade: +25% cohesion and follow recovery speed per stack
      const overscaleStacks = activeRunUpgradesRef.current.swarm_overscale || 0;
      if (overscaleStacks > 0) {
        followRate *= (1.0 + overscaleStacks * 0.25);
      }

      if (distToLeader > LEASH_DISTANCE_HARD) {
        // Hard leash recovery: rapid steering pull towards leader, minimize visual drift
        followRate *= 3.8;
        member.targetX = playerPosRef.current.x + ox * 0.15;
        member.targetY = playerPosRef.current.y + oy * 0.15;
      } else if (distToLeader > LEASH_DISTANCE_SOFT) {
        // Soft leash recovery: medium speed boost, reduced offsets to aid cohesion
        followRate *= 1.8;
        member.targetX = playerPosRef.current.x + ox * 0.55;
        member.targetY = playerPosRef.current.y + oy * 0.55;
      } else {
        member.targetX = playerPosRef.current.x + ox;
        member.targetY = playerPosRef.current.y + oy;
      }

      // Elastic interpolation
      const dx = member.targetX - member.x;
      const dy = member.targetY - member.y;

      member.x += dx * followRate * (delta / 16.6);
      member.y += dy * followRate * (delta / 16.6);

      // Clamping strictly inside unified WORLD bounds
      member.x = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, member.x));
      member.y = Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, member.y));

      // Shooting logic
      member.shootCooldown -=
        (delta / 16.6) *
        getEclipseSolarCooldownRecoveryMultiplier(
          frameMutatorEffects,
          member.affinity,
        );
      if (member.shootCooldown <= 0) {
        member.shootCooldown =
          65 -
          (activeFormationRef.current === FormationType.CIRCLE
            ? 15
            : 0);

        targetingEnemyIndex ??= buildSpatialIndex(
          enemiesRef.current,
          {
            cellSize: ENEMY_SPATIAL_CELL_SIZE,
            getX: (enemy) => enemy.x,
            getY: (enemy) => enemy.y,
            getRadius: (enemy) => enemy.size,
            include: (enemy) => !enemy.isDead,
          },
        );
        shootFromSwarm(member, targetingEnemyIndex);
      }
    });

    // 4.1. Spatial Grid Separation Pass to avoid complete overlaps and jitter (O(N) Complexity)
    const separationCellSize = 16; // separation cell radius
    const grid: Record<string, OrbiMember[]> = {};
    swarmRef.current.forEach((m) => {
      const gx = Math.floor(m.x / separationCellSize);
      const gy = Math.floor(m.y / separationCellSize);
      const key = `${gx},${gy}`;
      if (!grid[key]) grid[key] = [];
      grid[key].push(m);
    });

    swarmRef.current.forEach((member) => {
      const gx = Math.floor(member.x / separationCellSize);
      const gy = Math.floor(member.y / separationCellSize);
      
      let pushX = 0;
      let pushY = 0;
      let count = 0;

      // Check 3x3 surrounding cells
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const key = `${gx + dx},${gy + dy}`;
          const neighbors = grid[key];
          if (neighbors) {
            neighbors.forEach((other) => {
              if (other.id !== member.id) {
                const diffX = member.x - other.x;
                const diffY = member.y - other.y;
                const distSq = diffX * diffX + diffY * diffY;
                const minDist = (member.size + other.size) * 0.95; // Allow minor overlap but separate
                const minDistSq = minDist * minDist;

                if (distSq < minDistSq && distSq > 0.01) {
                  const dist = Math.sqrt(distSq);
                  const overlap = minDist - dist;
                  // Reduce separation forces for leashed followers to prioritize cohesion
                  let pushFactor = 0.25;
                  const maxLeashDist = Math.max(member.distToLeader || 0, other.distToLeader || 0);
                  if (maxLeashDist > 280) { // Hard leash limit
                    pushFactor = 0.0;
                  } else if (maxLeashDist > 160) { // Soft leash limit
                    pushFactor = 0.05;
                  }
                  pushX += (diffX / dist) * overlap * pushFactor;
                  pushY += (diffY / dist) * overlap * pushFactor;
                  count++;
                }
              }
            });
          }
        }
      }

      if (count > 0) {
        // Limit acceleration push to prevent jitter
        const maxPush = 1.8;
        const pushDistSq = pushX * pushX + pushY * pushY;
        if (pushDistSq > maxPush * maxPush) {
          const pushDist = Math.sqrt(pushDistSq);
          pushX = (pushX / pushDist) * maxPush;
          pushY = (pushY / pushDist) * maxPush;
        }
        member.x += pushX * (delta / 16.6);
        member.y += pushY * (delta / 16.6);

        // Clamping inside arena
        member.x = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, member.x));
        member.y = Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, member.y));
      }
    });

    // 5. Spawning script & wave transition timers
    handleWaveTransitions(delta);

    const simulationRuntimeProjection =
      getCurrentRuntimeProjection();
    const simulationDescriptor =
      simulationRuntimeProjection.descriptor;
    const simulationCombatPressure =
      simulationRuntimeProjection.combatPressure;
    const simulationMutatorEffects =
      simulationRuntimeProjection.mutatorEffects;
    const simulationEnemyBudget =
      simulationRuntimeProjection.enemyBudget;
    const simulationMilestoneEncounter =
      simulationRuntimeProjection.milestoneEncounter;
    minibossGateRef.current =
      stepRuntimeMinibossGate(
        syncRuntimeMinibossGate(
          minibossGateRef.current,
          simulationDescriptor.descriptorId,
          simulationMilestoneEncounter,
        ),
        delta,
      );

    const electricalStormConfig =
      waveActiveRef.current &&
      !bossActiveRef.current &&
      simulationDescriptor.sourceMode === "INFINITE"
        ? getElectricalStormConfig(
            simulationMutatorEffects,
            simulationCombatPressure,
          )
        : null;
    const electricalStormStep =
      stepElectricalStormRuntime(
        electricalStormStateRef.current,
        delta,
        electricalStormConfig,
        playerPosRef.current,
      );
    electricalStormStateRef.current =
      electricalStormStep.state;

    if (
      electricalStormStep.telegraphStarted &&
      electricalStormStep.state.targetX !== null &&
      electricalStormStep.state.targetY !== null
    ) {
      playDroneChargeSound();
      addFloatingText(
        "⚡ GRID STRIKE LOCK",
        electricalStormStep.state.targetX,
        electricalStormStep.state.targetY - 18,
        "#67e8f9",
      );
    }

    if (
      electricalStormStep.strikeTriggered &&
      electricalStormStep.strikeTarget &&
      electricalStormConfig
    ) {
      const strikeTarget =
        electricalStormStep.strikeTarget;
      const dx =
        playerPosRef.current.x - strikeTarget.x;
      const dy =
        playerPosRef.current.y - strikeTarget.y;
      const distanceSquared = dx * dx + dy * dy;

      playDisruptorPulseSound();
      screenShakeRef.current = Math.max(
        screenShakeRef.current,
        8,
      );
      triggerExplosion(
        particlesRef.current,
        getQualityConfig(stats.qualityPreset)
          .maxParticles,
        ParticleType.BIOME_PORTAL,
        strikeTarget.x,
        strikeTarget.y,
        "#38bdf8",
        24,
        2.2,
      );

      if (
        distanceSquared <=
        electricalStormConfig.strikeRadius *
          electricalStormConfig.strikeRadius
      ) {
        damagePlayer(
          electricalStormConfig.baseDamage *
            simulationMutatorEffects
              .incomingDamageMultiplier,
        );
      } else {
        addFloatingText(
          "DODGED",
          playerPosRef.current.x,
          playerPosRef.current.y - 24,
          "#67e8f9",
        );
      }
    }

    if (waveActiveRef.current && !bossActiveRef.current) {
      if (currentWaveRef.current === 1) {
        const waveDuration =
          simulationDescriptor.completionPolicy.type === "TIMEBOX"
            ? simulationDescriptor.completionPolicy.durationMs
            : 0;
        const waveElapsed = waveDuration - waveTimeRemainingRef.current;

        // Custom start pacing sequence for Wave 1:
        // - Game start (0.0s) -> visual intermission of 2.5s
        // - 2.5s–4.0s (waveElapsed 0ms to 1500ms): Spawns 1st Scout (Crawler) at 500ms
        if (waveElapsed >= 500 && waveBudgetSpawnedRef.current === 0) {
          spawnEnemy(EnemyType.CRAWLER);
        }
        // - 4.0s–8.0s (waveElapsed 1500ms to 5500ms): Spawns 3 additional enemies staggered
        else if (waveElapsed >= 2000 && waveBudgetSpawnedRef.current === 1) {
          spawnEnemy(EnemyType.CRAWLER);
        }
        else if (waveElapsed >= 3500 && waveBudgetSpawnedRef.current === 2) {
          spawnEnemy(EnemyType.CRAWLER);
        }
        else if (waveElapsed >= 5000 && waveBudgetSpawnedRef.current === 3) {
          spawnEnemy(EnemyType.CRAWLER);
        }
        // - 8.0s+ (waveElapsed >= 5500ms): Standard interval-based spawning rhythm
        else if (waveElapsed >= 5500) {
          spawnTimerRef.current += delta / 16.6;
          if (spawnTimerRef.current >= simulationDescriptor.spawn.spawnIntervalFrames) {
            spawnTimerRef.current = 0;
            if (waveBudgetSpawnedRef.current < simulationEnemyBudget) {
              spawnEnemy();
            }
          }
        }
      } else {
        // Subsequent waves: use standard interval-based spawning rhythm immediately
        spawnTimerRef.current += delta / 16.6;
        if (spawnTimerRef.current >= simulationDescriptor.spawn.spawnIntervalFrames) {
          spawnTimerRef.current = 0;
          if (waveBudgetSpawnedRef.current < simulationEnemyBudget) {
            spawnEnemy();
          }
        }
      }
    }

    // 6. Enemies logic & Shoot mechanics
    const hostileProjectileBudgetState = {
      count: 0,
    };
    for (const projectile of projectilesRef.current) {
      if (!projectile.fromPlayer) {
        hostileProjectileBudgetState.count += 1;
      }
    }

    const pendingCommandLinkBreak = pendingCommandLinkBreakRef.current;

    const pendingCommandLinkPulse = pendingCommandLinkPulseRef.current;

    let detachedPendingCommandLink = false;

    enemiesRef.current.forEach((enemy) => {
      if (enemy.isDead) return;

      const commandLinkPulseProjection = projectLiveCommandLinkPulseTarget(
        pendingCommandLinkPulse,
        enemy.enemyFormation,
        enemy.health,
        enemy.maxHealth,
        !enemy.isDead,
      );
      if (commandLinkPulseProjection) {
        enemy.health = commandLinkPulseProjection.resultingHealth;
      }


      if (
        shouldDetachCommandLinkMember(
          pendingCommandLinkBreak,
          enemy.enemyFormation,
        )
      ) {
        enemy.enemyFormation = undefined;
          detachedPendingCommandLink = true;
      }

      const signatureBehavior =
        enemySignatureBehaviorCacheRef.current.get(enemy);

      if (
        !enemy.isBoss &&
        simulationMutatorEffects.enemyRegenFractionPerSecond > 0 &&
        enemy.health < enemy.maxHealth
      ) {
        enemy.health = Math.min(
          enemy.maxHealth,
          enemy.health +
            enemy.maxHealth *
              simulationMutatorEffects.enemyRegenFractionPerSecond *
              (delta / 1000),
        );
      }

      // Handle white hit flash ticks with refresh-rate-neutral decay.
      enemy.flashTicks = decayFrameTicks(
        enemy.flashTicks,
        delta,
      );

      // Decelerate slowTimer if active (Hydro element effect)
      if (enemy.slowTimer !== undefined && enemy.slowTimer > 0) {
        enemy.slowTimer -= delta;
      }

      const originalSpeed = enemy.speed;
      const isSlowed = enemy.slowTimer !== undefined && enemy.slowTimer > 0;
      if (isSlowed) {
        enemy.speed = originalSpeed * 0.45; // Reduce movement speed to 45%
      }

      // Direct tracking movement vectors
      let tx = playerPosRef.current.x;
      let ty = playerPosRef.current.y;

      if (
        enemy.type === EnemyType.BOSS_DEVOURER ||
        enemy.type === EnemyType.BOSS_TITAN ||
        enemy.type === EnemyType.BOSS_WORM
      ) {
        updateBossAI(enemy, delta);
        enemy.speed = originalSpeed;
        return;
      } else if (enemy.type === EnemyType.BLACKOUT_ELITE) {
        // Handle Elite charge sequence (Section 3.3)
        if (enemy.chargeTimer !== undefined && enemy.chargeTimer > 0) {
          enemy.chargeTimer -= delta / 16.6;
          if (enemy.chargeTimer > 24) {
            // Wind-up pause phase (speed is 0)
            enemy.speed = 0;
          } else {
            // Active rapid dash displacement
            enemy.x += enemy.vx * (delta / 16.6);
            enemy.y += enemy.vy * (delta / 16.6);
            enemy.speed = 0; // bypass standard chase
          }
        } else {
          // Normal Elite chase movement (very slow)
          const dx = playerPosRef.current.x - enemy.x;
          const dy = playerPosRef.current.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist > 5) {
            enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);
            enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);
          }

          // Tick down charge cooldown
          if (enemy.pulseCooldown !== undefined) {
            enemy.pulseCooldown -= delta / 16.6;
            if (enemy.pulseCooldown <= 0) {
              // Initiate Elite charge cycle (1.0s: 36 frames telegraph + 24 frames dash)
              enemy.chargeTimer = 60;
              enemy.pulseCooldown =
                (220 + Math.random() * 150) *
                signatureBehavior.eliteChargeCooldownMultiplier; // evolved elites charge more often, same telegraph

              // Direct charge vector towards Foton leader
              const tAngle = Math.atan2(playerPosRef.current.y - enemy.y, playerPosRef.current.x - enemy.x);
              const milestoneDashMultiplier =
                enemy.milestoneMovementSpeedMultiplier ??
                1;
              enemy.vx =
                Math.cos(tAngle) *
                7.5 *
                simulationMutatorEffects.enemySpeedMultiplier *
                milestoneDashMultiplier *
                signatureBehavior.eliteChargeSpeedMultiplier;
              enemy.vy =
                Math.sin(tAngle) *
                7.5 *
                simulationMutatorEffects.enemySpeedMultiplier *
                milestoneDashMultiplier *
                signatureBehavior.eliteChargeSpeedMultiplier;

              playEliteChargeSound();
            }
          }
        }
      } else {
        // Normal enemy following vectors
        const dx = tx - enemy.x;
        const dy = ty - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (enemy.type === EnemyType.RIFT_HUNTER) {
          enemy.pulseCooldown -= delta / 16.6;
          if ((enemy.chargeTimer ?? 0) > 0) {
            enemy.chargeTimer = Math.max(0, (enemy.chargeTimer ?? 0) - delta);
            enemy.x += enemy.vx * (delta / 16.6);
            enemy.y += enemy.vy * (delta / 16.6);
          } else if (enemy.pulseCooldown <= 0) {
            const dashScale = enemy.speed * 4.8;
            enemy.vx = (dx / dist) * dashScale;
            enemy.vy = (dy / dist) * dashScale;
            enemy.chargeTimer = 420;
            enemy.pulseCooldown = 150 + Math.random() * 70;
            addFloatingText("RIFT LOCK", enemy.x, enemy.y - 20, "#fb923c");
          } else {
            enemy.x += (dx / dist) * enemy.speed * 1.15 * (delta / 16.6);
            enemy.y += (dy / dist) * enemy.speed * 1.15 * (delta / 16.6);
          }
        } else if (enemy.type === EnemyType.SIEGE_PRISM) {
          if (dist > 330) {
            enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);
            enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);
          } else if (dist < 250) {
            enemy.x -= (dx / dist) * enemy.speed * (delta / 16.6);
            enemy.y -= (dy / dist) * enemy.speed * (delta / 16.6);
          }
          enemy.x += Math.cos(timeElapsedRef.current * 0.0018 + enemy.y) * 0.35;
        } else if (enemy.type === EnemyType.SWARM_REAVER) {
          enemy.x += (dx / dist) * enemy.speed * 1.65 * (delta / 16.6);
          enemy.y += (dy / dist) * enemy.speed * 1.65 * (delta / 16.6);
          if (dist < 105) {
            disruptTimerRef.current = Math.max(disruptTimerRef.current, 520);
          }
        } else if (enemy.type === EnemyType.VOID_ANCHOR) {
          if (dist > 190) {
            enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);
            enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);
          }
          if (dist < 175) {
            disruptTimerRef.current = Math.max(disruptTimerRef.current, 280);
          }
        } else if (enemy.type === EnemyType.MINE_WEAVER) {
          const tangentX = -dy / dist;
          const tangentY = dx / dist;
          const radial = dist > 220 ? 0.55 : dist < 160 ? -0.55 : 0;
          enemy.x += ((dx / dist) * radial + tangentX * 0.8) * enemy.speed * (delta / 16.6);
          enemy.y += ((dy / dist) * radial + tangentY * 0.8) * enemy.speed * (delta / 16.6);
        } else if (enemy.type === EnemyType.MIRROR_WARDEN) {
          const tangentX = -dy / dist;
          const tangentY = dx / dist;
          const radial = dist > 210 ? 0.7 : dist < 135 ? -0.7 : 0;
          enemy.x += ((dx / dist) * radial + tangentX * 0.65) * enemy.speed * (delta / 16.6);
          enemy.y += ((dy / dist) * radial + tangentY * 0.65) * enemy.speed * (delta / 16.6);
        } else if (enemy.type === EnemyType.DRONE) {
          // Maintain high distance, strafing left and right
          if (dist > 180) {
            enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);
            enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);
          } else if (dist < 120) {
            // Repel
            enemy.x -= (dx / dist) * enemy.speed * (delta / 16.6);
            enemy.y -= (dy / dist) * enemy.speed * (delta / 16.6);
          }
          // Lateral drift
          enemy.x += Math.cos(timeElapsedRef.current * 0.003) * 0.8;

          // Drone shot charge sound (play once when charge begins)
          if (enemy.shootCooldown !== undefined && enemy.shootCooldown <= 35 && enemy.shootCooldown > 33.2) {
            playDroneChargeSound();
          }
        } else if (enemy.type === EnemyType.DISRUPTOR) {
          // Slide towards Player Foton
          enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);
          enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);

          // Disruptor pulse charge sound (play once when charge begins)
          if (enemy.shootCooldown !== undefined && enemy.shootCooldown <= 60 && enemy.shootCooldown > 58.2) {
            playDisruptorChargeSound();
          }
        } else if (enemy.type === EnemyType.PARASITE) {
          const eclipseParasiteSpeedMultiplier =
            getEclipseEnemyMovementMultiplier(
              simulationMutatorEffects,
              enemy.type,
            );
          // Twitchy lunging behavior. Evolved signature scaling only adjusts
          // the existing oscillation through the certified behavior contract.
          const lungePhase =
            timeElapsedRef.current *
              0.015 *
              signatureBehavior.parasiteLungeFrequencyMultiplier +
            enemy.x;
          const lunge =
            Math.sin(lungePhase) *
            1.5 *
            signatureBehavior.parasiteLungeAmplitudeMultiplier;
          enemy.x +=
            ((dx / dist) *
              enemy.speed *
              eclipseParasiteSpeedMultiplier +
              lunge) *
            (delta / 16.6);
          enemy.y +=
            (dy / dist) *
            enemy.speed *
            eclipseParasiteSpeedMultiplier *
            (delta / 16.6);
        } else {
          // J3B: certified enemy formation routing replaces the existing
          // direct-slither movement only for opted-in Crawler/Splitter members.
          // Hydro slow cancels formation ownership so status control remains
          // effective instead of becoming an accidental formation immunity.
          if (isSlowed && enemy.enemyFormation) {
            enemy.enemyFormation = undefined;
          }
          const formationMotion = enemy.enemyFormation
            ? projectLiveEnemyFormationMotion({
                assignment: enemy.enemyFormation,
                nowMs: timeElapsedRef.current,
                worldWidth: WORLD_WIDTH,
                worldHeight: WORLD_HEIGHT,
              })
            : null;

          if (formationMotion && !formationMotion.complete) {
            enemy.x = formationMotion.x;
            enemy.y = formationMotion.y;
          } else {
            if (formationMotion?.complete) {
              enemy.enemyFormation = undefined;
            }
            // Legacy direct slither for non-formation Crawler/Splitter/minions.
            enemy.x += (dx / dist) * enemy.speed * (delta / 16.6);
            enemy.y += (dy / dist) * enemy.speed * (delta / 16.6);
          }
        }
      }

      // Restore original speed
      enemy.speed = originalSpeed;

      // Shoot & pulse attack timers
      if (
        enemy.type !== EnemyType.SIEGE_PRISM ||
        enemy.siegeVolleyTelegraph === undefined
      ) {
        enemy.shootCooldown -=
          (delta / 16.6) *
          simulationCombatPressure.enemyAttackRateMultiplier *
          (enemy.evolvedAttackRateMultiplier ?? 1);
      }

      if (enemy.type === EnemyType.SIEGE_PRISM) {
        const siegeTargetDx = playerPosRef.current.x - enemy.x;
        const siegeTargetDy = playerPosRef.current.y - enemy.y;
        const siegeTargetDistanceSquared =
          siegeTargetDx * siegeTargetDx +
          siegeTargetDy * siegeTargetDy;
        const siegeVolley = stepLiveSiegeVolley({
          state: enemy.siegeVolleyTelegraph,
          deltaMs: delta,
          cooldownReady: enemy.shootCooldown <= 0,
          targetX: playerPosRef.current.x,
          targetY: playerPosRef.current.y,
          targetInRange:
            siegeTargetDistanceSquared > 0 &&
            siegeTargetDistanceSquared <
              LIVE_SIEGE_VOLLEY_FIRE_RANGE *
                LIVE_SIEGE_VOLLEY_FIRE_RANGE,
        });
        enemy.siegeVolleyTelegraph = siegeVolley.state;

        if (siegeVolley.telegraphStarted) {
          playEliteChargeSound();
          addFloatingText(
            "SIEGE VOLLEY",
            enemy.x,
            enemy.y - enemy.size - 14,
            "#f472b6",
          );
        }

        const lockedTargetX = siegeVolley.state?.targetX;
        const lockedTargetY = siegeVolley.state?.targetY;
        if (
          siegeVolley.commitReady &&
          lockedTargetX !== null &&
          lockedTargetX !== undefined &&
          lockedTargetY !== null &&
          lockedTargetY !== undefined
        ) {
          const shotCommitted = shootFromEnemy(
            enemy,
            hostileProjectileBudgetState,
            { x: lockedTargetX, y: lockedTargetY },
          );
          const acknowledgement =
            acknowledgeLiveSiegeVolleyShot(
              siegeVolley.state,
              shotCommitted,
            );
          enemy.siegeVolleyTelegraph = acknowledgement.state;
          if (acknowledgement.acknowledged) {
            enemy.shootCooldown = 150 + Math.random() * 70;
          }
        }
      } else if (enemy.shootCooldown <= 0) {
        if (
          enemy.type === EnemyType.DRONE ||
          enemy.type === EnemyType.MINE_WEAVER ||
          enemy.type === EnemyType.MIRROR_WARDEN ||
          enemy.type === EnemyType.VOID_ANCHOR
        ) {
          enemy.shootCooldown =
            enemy.type === EnemyType.MINE_WEAVER ? 120 + Math.random() * 60 :
            enemy.type === EnemyType.VOID_ANCHOR ? 160 + Math.random() * 80 :
            100 + Math.random() * 70;
          shootFromEnemy(
            enemy,
            hostileProjectileBudgetState,
          );
        } else if (enemy.type === EnemyType.DISRUPTOR) {
          enemy.shootCooldown = 220 + Math.random() * 120; // reset pulse timer (3.5-5.5s)
          
          // Trigger Disruptor electromagnetic pulse (Section 3.2)
          playDisruptorPulseSound();
          disruptTimerRef.current =
            2000 *
            signatureBehavior.disruptDurationMultiplier;

          // Glowing cyan ring expansion particle effect
          triggerExplosion(
            particlesRef.current,
            getQualityConfig(stats.qualityPreset).maxParticles,
            ParticleType.BIOME_PORTAL,
            enemy.x,
            enemy.y,
            "#06b6d4",
            12
          );
          screenShakeRef.current = Math.max(screenShakeRef.current, 6.5);
          addFloatingText("DISRUPTION DETECTED", playerPosRef.current.x, playerPosRef.current.y - 20, "#22d3ee");
        } else {
          // Crawler, Splitter, and minion parts don't fire projectiles
          enemy.shootCooldown = 999999;
        }
      }
    });

    // Filter out off-screen or dead enemies
    compactArrayInPlace(
      enemiesRef.current,
      (enemy) => {
        if (enemy.isDead) return false;
        // If regular enemy wanders ridiculously far (offscreen bug), recycle
        if (
          !enemy.isBoss &&
          (
            enemy.x < -200 ||
            enemy.x > WORLD_WIDTH + 200 ||
            enemy.y < -200 ||
            enemy.y > WORLD_HEIGHT + 200
          )
        ) {
          return false;
        }
        return true;
      },
    );

    // Accumulate gaze cadence in O(1); target lookup reuses the
    // collision spatial index later in this same frame.
    fotonThreatAccumulatorMsRef.current += delta;

    if (

      pendingCommandLinkPulse &&

      pendingCommandLinkPulseRef.current === pendingCommandLinkPulse

    ) {

      pendingCommandLinkPulseRef.current = null;

    }


    if (

      detachedPendingCommandLink &&
        pendingCommandLinkBreak &&
        pendingCommandLinkBreakRef.current === pendingCommandLinkBreak
      ) {
        pendingCommandLinkBreakRef.current = null;
      }

    // 7. Projectiles coordinates
    projectilesRef.current.forEach((proj) => {
      proj.x += proj.vx * (delta / 16.6);
      proj.y += proj.vy * (delta / 16.6);
      proj.life -= delta;
    });

    // Filter dead or expired projectiles
    compactArrayInPlace(
      projectilesRef.current,
      (projectile) =>
        projectile.life > 0 &&
        projectile.x >= -50 &&
        projectile.x <= WORLD_WIDTH + 50 &&
        projectile.y >= -50 &&
        projectile.y <= WORLD_HEIGHT + 50,
    );

    // 8. Particles updates
    particlesRef.current.forEach((p) => {
      updateParticle(p, delta);
    });
    compactArrayInPlace(
      particlesRef.current,
      (particle) => particle.life > 0,
    );

    // 9. Resources Magnet and Collection checks
    resourcesRef.current.forEach((res) => {
      if (res.consumed || res.size <= 0) return;

      const fieldProfile = getResourceFieldProfile(
        simulationMutatorEffects,
        timeElapsedRef.current,
        res.id,
      );
      const environmentalFieldActive =
        waveActiveRef.current &&
        simulationDescriptor.sourceMode === "INFINITE";

      if (environmentalFieldActive) {
        res.x = Math.max(
          WORLD_BOUNDS.minX,
          Math.min(
            WORLD_BOUNDS.maxX,
            res.x +
              fieldProfile.driftXPerFrame *
                (delta / 16.6),
          ),
        );
        res.y = Math.max(
          WORLD_BOUNDS.minY,
          Math.min(
            WORLD_BOUNDS.maxY,
            res.y +
              fieldProfile.driftYPerFrame *
                (delta / 16.6),
          ),
        );
      }

      const dx = playerPosRef.current.x - res.x;
      const dy = playerPosRef.current.y - res.y;
      const distanceSquared = dx * dx + dy * dy;

      // Apply Nano Catalyst plus bounded unstable-field attraction.
      const basePullRadius =
        45 + (upgradesLevel.nano_catalyst || 0) * 18;
      const pullRadius =
        basePullRadius *
        (environmentalFieldActive
          ? fieldProfile.attractionRadiusMultiplier
          : 1);
      const pullSpeed =
        2.8 *
        (environmentalFieldActive
          ? fieldProfile.attractionSpeedMultiplier
          : 1);

      const pullRadiusSquared =
        pullRadius * pullRadius;
      if (
        distanceSquared > 0.001 * 0.001 &&
        distanceSquared < pullRadiusSquared
      ) {
        // Exact normalization is only needed once attraction is active.
        const distance = Math.sqrt(distanceSquared);
        res.x +=
          (dx / distance) *
          pullSpeed *
          (delta / 16.6);
        res.y +=
          (dy / distance) *
          pullSpeed *
          (delta / 16.6);
      }

      // Collision pickup trigger remains unchanged and always reachable.
      if (distanceSquared < 15 * 15) {
        triggerResourceCollect(res);
      }
    });

    compactArrayInPlace(
      resourcesRef.current,
      (resource) =>
        !resource.consumed && resource.size > 0,
    ); // size <= 0 or consumed represents collected

    // 10. SINGLE-IMPACT COLLISION SWEEPS
    detectAndResolveCollisions();
  };

  // --- COLLECT RESOURCES SCRIPT ---
  const triggerResourceCollect = (res: Resource) => {
    if (res.consumed || res.size <= 0) return;
    res.consumed = true;
    res.size = 0; // Mark collected

    runResourcesCollectedRef.current += 1;
    playCrystalSound(res.type === "ENERGY");

    // Spawn tiny sparkles
    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.RESOURCE_PICKUP,
      res.x,
      res.y,
      res.color,
      8
    );

    if (res.type === "NANO") {
      // Harvest permanent Nano credits multiplier by sector config
      const combatPressure = getCurrentCombatPressure();
      const val = Math.round(
        res.amount *
          getBiomeConfig(activeBiome).crystalValueMultiplier *
          combatPressure.resourceValueMultiplier,
      );
      nanoCreditsRef.current += val;
      runNanoCreditsEarnedRef.current += val;
      setNanoCredits(nanoCreditsRef.current);
      scoreRef.current += 10;
    } else if (res.type === "ENERGY") {
      // Purify and boost fusion meter
      const boost = 10 * (1 + (upgradesLevel.fusion_resonator || 0) * 0.4);
      fusionEnergyRef.current = Math.min(100, fusionEnergyRef.current + boost);
      scoreRef.current += 25;

      // H12: a full meter is only consumed when a canonical 3→1 recipe resolves.
      tryTriggerAffinityFusion();
    } else if (res.type === "ORBI") {
      // Recruit Supplementary swarm shooter!
      addSwarmMember(
        res.orbiAffinity,
        res.orbiCombatRole,
        res.orbiEnergyId,
      );
      scoreRef.current += 50;
    }
  };

  // --- SHOOT TRIGGER FROM SWARM FOLLOWER ---
  const shootFromSwarm = (
    member: OrbiMember,
    enemyIndex: SpatialIndex<Enemy>,
  ) => {
    if (projectilesRef.current.length >= MAX_PROJECTILES) return;

    const maxRange =
      300 +
      (activeFormationRef.current === FormationType.SHIELD ? 100 : 0);
    const nearest = findNearestSpatialItem(
      enemyIndex,
      member.x,
      member.y,
      maxRange,
      (enemy) => !enemy.isDead,
    );
    if (!nearest.item) return;

    const target = nearest.item;
    const dx = target.x - member.x;
    const dy = target.y - member.y;
    const dist = Math.max(0.001, Math.sqrt(nearest.distanceSquared));
    const affinity = member.affinity || "solar";
    const signature =
      member.attackSignature ??
      getFallbackAttackSignatureForAffinity(affinity);
    const profile = getOrbiAttackProfile(signature);
    const gaiaScale =
      member.energyId === "GAIA"
        ? getGaiaCombatScale(member.level)
        : null;
    const supportShieldRestore =
      profile.supportShieldRestore *
      (gaiaScale?.shieldSupportMultiplier ?? 1);
    const formationSpeed =
      1 + FORMATIONS[activeFormationRef.current].projSpeedMod;
    const baseSpeed =
      4.5 * formationSpeed * profile.speedMultiplier;
    const baseAngle = Math.atan2(dy, dx);
    const critical =
      profile.criticalChance > 0 &&
      Math.random() < profile.criticalChance;
    const baseDamage =
      4 +
      (activeFormationRef.current === FormationType.CIRCLE ? 1.5 : 0);
    const primaryDamage =
      baseDamage *
      profile.damageMultiplier *
      (gaiaScale?.damageMultiplier ?? 1) *
      (critical ? profile.criticalDamageMultiplier : 1);
    const overdriveEffects = projectCombatOverdriveEffects({
      active: combatOverdriveRef.current.active,
    });
    const overdriveAdjustedDamage =
      primaryDamage * overdriveEffects.playerDamageMultiplier;

    const makeProjectile = (
      angle: number,
      damageMultiplier = 1,
      speedMultiplier = 1,
      sizeMultiplier = 1,
      echo = false,
    ): Projectile => {
      const shotOrdinal = nextBlackoutArchitectCollisionTraceOrdinal(
        collisionTracePlayerShotRef.current,
      );
      collisionTracePlayerShotRef.current = shotOrdinal;
      const projectile: Projectile = {
      id: Math.random().toString(),
      x: member.x,
      y: member.y,
      vx: Math.cos(angle) * baseSpeed * speedMultiplier,
      vy: Math.sin(angle) * baseSpeed * speedMultiplier,
      damage: overdriveAdjustedDamage * damageMultiplier,
      color: member.color,
      size: profile.projectileSize * sizeMultiplier,
      fromPlayer: true,
      life: profile.lifetimeMs,
      maxLife: profile.lifetimeMs,
      affinity,
      energyId: member.energyId ?? profile.energyId,
      attackSignature: signature,
      attackShape: profile.shape,
      rotation: angle,
      pushMultiplier: profile.pushMultiplier,
      slowDurationMs: profile.slowDurationMs,
      splashRadius: profile.splashRadius,
      splashDamageMultiplier: profile.splashDamageMultiplier,
      magneticPullRadius: profile.magneticPullRadius,
      magneticPullStrength: profile.magneticPullStrength,
      supportShieldRestore,
      isCriticalShot: echo ? false : critical,
      };
      // Flat metadata on player shots only. Never suppress a shot on exhaustion.
      if (
        collisionTraceRunEpochRef.current !== null &&
        collisionTraceRunEpochRef.current > 0 &&
        collisionTracePhysicsFrameRef.current !== null &&
        shotOrdinal !== null
      ) {
        projectile.collisionTraceRunEpoch = collisionTraceRunEpochRef.current;
        projectile.collisionTracePhysicsFrame = collisionTracePhysicsFrameRef.current;
        projectile.collisionTraceProjectileOrdinal = shotOrdinal;
      }
      return projectile;
    };

    projectilesRef.current.push(makeProjectile(baseAngle));

    // QUANTUM phase echoes are bounded by the existing global projectile cap.
    if (profile.echoAngleRadians > 0) {
      for (const direction of [-1, 1]) {
        if (projectilesRef.current.length >= MAX_PROJECTILES) break;
        projectilesRef.current.push(
          makeProjectile(
            baseAngle + profile.echoAngleRadians * direction,
            profile.echoDamageMultiplier,
            0.96,
            0.82,
            true,
          ),
        );
      }
    }

    // H2NOVA turns a small portion of each firing cycle into shield support.
    if (supportShieldRestore > 0) {
      const shieldMax =
        SHIELD_MAX +
        (upgradesLevel.hydrogen_deflector || 0) * 15 +
        (activeRunUpgradesRef.current.foton_integrity || 0) * 30;
      shieldRef.current = Math.min(
        shieldMax,
        shieldRef.current + supportShieldRestore,
      );
    }

    member.shootCooldown =
      profile.cooldownFrames *
      (gaiaScale?.cooldownMultiplier ?? 1) *
      (activeFormationRef.current === FormationType.CIRCLE ? 0.78 : 1);
    playShootSound();

    const recoilForce =
      Math.min(2.3, 1 + profile.speedMultiplier * 0.35);
    member.recoilX = -(dx / dist) * recoilForce;
    member.recoilY = -(dy / dist) * recoilForce;
    member.flashTicks = 3;

    const mitosisChance =
      0.1 * (upgradesLevel.mitosis_relic || 0) +
      0.25 * (activeRunUpgradesRef.current.mitotic_mitosis || 0);
    if (
      projectilesRef.current.length < MAX_PROJECTILES &&
      mitosisChance > 0 &&
      Math.random() < mitosisChance
    ) {
      const duplicate = makeProjectile(
        baseAngle + 0.025,
        0.92,
        0.95,
        0.92,
        true,
      );
      duplicate.x += 4;
      duplicate.y += 4;
      projectilesRef.current.push(duplicate);
    }
  };

  // --- SHOOT AI TRIGGER FROM ENEMY DRONE ---
  const shootFromEnemy = (
    enemy: Enemy,
    hostileBudgetState: { count: number },
    targetOverride?: { readonly x: number; readonly y: number },
  ): boolean => {
    const combatPressure = getCurrentCombatPressure();
    const signatureBehavior =
      enemySignatureBehaviorCacheRef.current.get(enemy);
    const hostileProjectileCount =
      hostileBudgetState.count;
    const hostileProjectileBudget =
      combatPressure.projectileBudget ?? MAX_PROJECTILES;
    const availableProjectileSlots = Math.max(
      0,
      Math.min(
        MAX_PROJECTILES - projectilesRef.current.length,
        hostileProjectileBudget - hostileProjectileCount,
      ),
    );

    if (availableProjectileSlots <= 0) return false;

    if (
      enemy.type === EnemyType.DRONE ||
      enemy.type === EnemyType.BOSS_DEVOURER ||
      enemy.type === EnemyType.SIEGE_PRISM ||
      enemy.type === EnemyType.MINE_WEAVER ||
      enemy.type === EnemyType.MIRROR_WARDEN ||
      enemy.type === EnemyType.VOID_ANCHOR
    ) {
      const targetX = targetOverride?.x ?? playerPosRef.current.x;
      const targetY = targetOverride?.y ?? playerPosRef.current.y;
      const dx = targetX - enemy.x;
      const dy = targetY - enemy.y;
      const distanceSquared = dx * dx + dy * dy;

      if (
        targetOverride !== undefined ||
        (distanceSquared > 0 && distanceSquared < 320 * 320)
      ) {
        const projectileSpeed =
          (enemy.type === EnemyType.SIEGE_PRISM ? 4.0 :
            enemy.type === EnemyType.MINE_WEAVER ? 1.35 :
            enemy.type === EnemyType.VOID_ANCHOR ? 1.8 :
            enemy.type === EnemyType.MIRROR_WARDEN ? 2.7 : 2.2) *
          (enemy.evolvedProjectileSpeedMultiplier ?? 1);
        const requestedProjectileCount =
          enemy.type === EnemyType.SIEGE_PRISM ? 3 :
          enemy.type === EnemyType.MINE_WEAVER ? 2 :
          signatureBehavior.droneVolleyProjectileCount;
        const projectileCount = Math.min(
          requestedProjectileCount,
          availableProjectileSlots,
        );
        const baseAngle = Math.atan2(dy, dx);
        const spread =
          enemy.type === EnemyType.SIEGE_PRISM ? 0.12 :
          enemy.type === EnemyType.MINE_WEAVER ? 0.38 :
          enemy.type === EnemyType.MIRROR_WARDEN ? 0.18 :
          signatureBehavior.droneVolleySpreadRadians;

        for (
          let index = 0;
          index < projectileCount;
          index += 1
        ) {
          const spreadOffset =
            projectileCount === 1
              ? 0
              : -spread / 2 +
                (spread * index) /
                  (projectileCount - 1);
          const shotAngle = baseAngle + spreadOffset;
          const vx =
            Math.cos(shotAngle) * projectileSpeed;
          const vy =
            Math.sin(shotAngle) * projectileSpeed;

          projectilesRef.current.push({
            id: Math.random().toString(),
            x: enemy.x,
            y: enemy.y,
            vx,
            vy,
            damage: 12,
            color: "#f43f5e", // Bright rose plasma orb
            size: enemy.isBoss ? 5 : 3.5,
            fromPlayer: false,
            life: 2500,
            maxLife: 2500
          });
        }

        hostileBudgetState.count += projectileCount;
        playEnemyShootSound();
        return projectileCount > 0;
      }
    }

    return false;
  };

  const getEnemyScoreReward = (enemy: Enemy) => {
    const baseReward = enemy.isBoss
      ? 1500
      : enemy.type === EnemyType.BLACKOUT_ELITE
        ? 250
        : enemy.isMinion
          ? 15
          : 80;

    return Math.round(
      baseReward *
        (enemy.milestoneRewardMultiplier ?? 1) *
        (enemy.evolvedRewardMultiplier ?? 1),
    );
  };

  const isCombatResonanceElite = (enemy: Enemy) =>
    enemy.type === EnemyType.BLACKOUT_ELITE ||
    Boolean(enemy.evolvedVariantId) ||
    enemy.milestoneKind === "MINIBOSS";

  const registerCombatDefeat = (enemy: Enemy, affinity?: OrbiAffinity) => {
    const commandLinkBreakIntent = enemy.enemyFormation
      ? resolveLiveCommandLinkBreakIntent(enemy.enemyFormation)
      : null;
    if (commandLinkBreakIntent) {
      pendingCommandLinkBreakRef.current = commandLinkBreakIntent;
    }

    const resolution = registerCombatResonanceDefeat(
      combatResonanceRef.current,
      {
        occurredAtMs: timeElapsedRef.current,
        baseScore: getEnemyScoreReward(enemy),
        affinity,
        isElite: isCombatResonanceElite(enemy),
        isBoss: enemy.isBoss,
      },
    );
    combatResonanceRef.current = resolution.state;
    scoreRef.current += resolution.awardedScore;
  };

  // Read J9L-A refs outside the frozen collision resolver; never alter combat.
  const observeLegacyPlayerHit = (
    projectile: Projectile,
    kind: "LEGACY_SHIELD_NODE" | "LEGACY_ENEMY",
  ): void => {
    observeBlackoutArchitectLegacyPlayerHit(
      projectile,
      collisionTraceRunEpochRef.current,
      collisionTracePhysicsFrameRef.current,
      kind,
    );
  };

  // --- DETECT SINGLE-IMPACT COLLISION SWEEPS ---
  const detectAndResolveCollisions = () => {
    const quality = getQualityConfig(stats.qualityPreset);
    const combatPressure = getCurrentCombatPressure();
    const mutatorEffects = getCurrentMutatorEffects();
    const enemyCollisionIndex = buildSpatialIndex(
      enemiesRef.current,
      {
        cellSize: ENEMY_SPATIAL_CELL_SIZE,
        getX: (enemy) => enemy.x,
        getY: (enemy) => enemy.y,
        getRadius: (enemy) => enemy.size,
        include: (enemy) => !enemy.isDead,
      },
    );
    collisionEnemyIndexRef.current =
      enemyCollisionIndex;

    // Reuse the collision spatial index for low-cadence Foton gaze.
    // This avoids introducing any additional O(N) enemy scan.
    if (
      fotonThreatAccumulatorMsRef.current >=
      FOTON_THREAT_REFRESH_MS
    ) {
      fotonThreatAccumulatorMsRef.current = 0;
      const threat = selectFotonThreat(
        enemyCollisionIndex,
        bossRef.current,
        playerPosRef.current.x,
        playerPosRef.current.y,
        fotonThreatTargetRef.current,
      );
      fotonThreatTargetRef.current =
        threat?.enemy ?? null;
      fotonThreatDirectionRef.current =
        projectFotonThreatDirection(
          playerPosRef.current.x,
          playerPosRef.current.y,
          threat,
        ) ?? { x: 0, y: 0 };
    }

    // 1. PROJECTILES vs ENEMIES / PLAYER
    projectilesRef.current.forEach((proj) => {
      if (proj.life <= 0) return;

      if (proj.fromPlayer) {
        // First check if hitting any Boss Shield Nodes
        let hitShieldNode = false;
        for (let s = 0; s < shieldNodesRef.current.length; s++) {
          const node = shieldNodesRef.current[s];
          const ndx = proj.x - node.x;
          const ndy = proj.y - node.y;
          const shieldCollisionRadius = node.collisionRadius + proj.size;
          if (
            ndx * ndx + ndy * ndy <
            shieldCollisionRadius * shieldCollisionRadius
          ) {
            proj.life = 0;
            observeLegacyPlayerHit(proj, "LEGACY_SHIELD_NODE");
            hitShieldNode = true;
            node.health -= proj.damage;
            node.flashTicks = 10;
            playClickSound();
            
            addFloatingText(`${Math.round(proj.damage)}`, node.x, node.y - 12, "#3b82f6");

            if (node.health <= 0) {
              triggerExplosion(
                particlesRef.current,
                quality.maxParticles,
                ParticleType.ENEMY_DESTROYED,
                node.x,
                node.y,
                "#3b82f6",
                15,
                1.5
              );
              playHeavyImpactSound();
              const activeChassis = getBossChassisProfile(
                bossRef.current?.bossChassis ?? "DEVOURER",
              );
              const reward = activeChassis.weakpoints.destructionReward;
              if (reward) {
                scoreRef.current += reward.score;
                nanoCreditsRef.current += reward.nanoCredits;
                runNanoCreditsEarnedRef.current += reward.nanoCredits;
                setNanoCredits(nanoCreditsRef.current);
                addFloatingText(
                  `SEGMENT +${reward.score}`,
                  node.x,
                  node.y - 22,
                  activeChassis.color,
                );
              }
              shieldNodesRef.current.splice(s, 1);
              bossShieldNodesDestroyedRef.current += 1;
              setBossShieldNodes(shieldNodesRef.current.length);
              postDialogue(
                "COMPANION",
                activeChassis.id === "WORM_SEGMENTS"
                  ? "¡Segmento del Rift Worm destruido! La cadena pierde protección."
                  : activeChassis.id === "TITAN_CORE"
                    ? "¡Segmento del Titan destruido! Continúa abriendo el núcleo."
                    : "¡Nodo de escudo destruido! El núcleo del Devorador está más expuesto.",
              );
              
              // If all nodes are destroyed, trigger core exposed vulnerability window!
              if (shieldNodesRef.current.length === 0) {
                const activeChassis = getBossChassisProfile(bossRef.current?.bossChassis ?? "DEVOURER");
                coreExposedTimerRef.current = activeChassis.weakpoints.exposureDurationMs;
                setIsCoreExposed(true);
                playEliteChargeSound();
                postDialogue(
                  "COMPANION",
                  activeChassis.id === "WORM_SEGMENTS"
                    ? "¡CADENA DESTRUIDA! ¡EL CORAZÓN DEL RIFT WORM ESTÁ EXPUESTO!"
                    : activeChassis.id === "TITAN_CORE"
                      ? "¡TODOS LOS SEGMENTOS CAÍDOS! ¡NÚCLEO CUÁNTICO EXPUESTO!"
                      : "¡TODOS LOS NODOS CAÍDOS! ¡EL NÚCLEO ESTÁ EXPUESTO! ¡FUEGO TOTAL!",
                );
              }
            }
            break;
          }
        }
        if (hitShieldNode) return;

        // Player projectiles vs enemies — spatial first-hit lookup.
        const collision = findFirstCollidingSpatialItem(
          enemyCollisionIndex,
          proj.x,
          proj.y,
          proj.size + 2,
          (enemy) => !enemy.isDead,
        );
        const enemy = collision.item;

        if (enemy && collision.entry) {
          const collisionOrder = collision.entry.order;
            // SINGLE IMPACT DETECTED! Kill projectile instantly
            proj.life = 0;
            observeLegacyPlayerHit(proj, "LEGACY_ENEMY");

            // Compute damage modifiers and status flags
            let damageToApply = proj.damage;
            let isCrit = Boolean(proj.isCriticalShot);
            let isShieldBlock = false;

            if (
              enemy.type === EnemyType.BOSS_DEVOURER ||
              enemy.type === EnemyType.BOSS_TITAN ||
              enemy.type === EnemyType.BOSS_WORM
            ) {
              const chassis = getBossChassisProfile(
                enemy.bossChassis ?? "DEVOURER",
              );
              if (shieldNodesRef.current.length > 0) {
                isShieldBlock = true;
                damageToApply *= chassis.weakpoints.protectedDamageMultiplier;
              } else if (coreExposedTimerRef.current > 0) {
                isCrit = true;
                damageToApply *= chassis.weakpoints.exposedDamageMultiplier;
              }
            } else if (enemy.type === EnemyType.BLACKOUT_ELITE) {
              const faceX = enemy.vx || (playerPosRef.current.x - enemy.x);
              const faceY = enemy.vy || (playerPosRef.current.y - enemy.y);
              const faceAngle = Math.atan2(faceY, faceX);
              const hitAngle = Math.atan2(proj.y - enemy.y, proj.x - enemy.x);
              let angleDiff = Math.abs(hitAngle - faceAngle);
              if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

              if (angleDiff < Math.PI / 4) {
                // Front shield block: 85% reduction! (Section 2.6 - resistencia frontal elevada)
                isShieldBlock = true;
                damageToApply *= 0.15;
              } else {
                // Flank/Back hit: 1.4x extra critical damage! (vulnerabilidad trasera)
                isCrit = true;
                damageToApply *= 1.4;
              }
            }

            // Normal chance of critical visual overlay
            if (proj.affinity === "quantum" && !isShieldBlock) {
              // Quantum base projectiles have 22% crit, already factored in shootFromSwarm.
              // We'll mark as critical for feedback if damageFactor is higher.
              if (proj.damage > 5.0) isCrit = true;
            }

            // Apply direct damage
            const commandLinkPulseSourceHealthBeforeDirectHit = enemy.health;
            enemy.health -= damageToApply;
            enemy.flashTicks = 4; // Trigger flash

            if (enemy.isBoss) {
              setBossHp(Math.max(0, enemy.health));
              if (enemy.milestoneKind !== "BOSS_REMATCH") {
                bossDamageDealtRef.current += damageToApply;
              }
            }

            // Hit-Stop time-lag freezing (Section 6)
            const isHeavyAffinity = proj.affinity === "nuclear" || proj.affinity === "thermal";
            if ((isHeavyAffinity || isCrit) && hitStopCooldownTimerRef.current <= 0) {
              const isBoss = enemy.isBoss;
              hitStopTimerRef.current = isBoss ? 60 : 40; // 60ms for boss, 40ms for standard
              hitStopCooldownTimerRef.current = 150; // 150ms cooldown
              playHeavyImpactSound();
              screenShakeRef.current = Math.max(screenShakeRef.current, isBoss ? 15 : 7.5);
            }

            // Trigger visual and auditory combat feedback (Section 4)
            if (isShieldBlock) {
              playShieldDeflectSound();
              addFloatingText("BLOCK", enemy.x, enemy.y - 12, "#a7f3d0");
              triggerExplosion(
                particlesRef.current,
                quality.maxParticles,
                ParticleType.ENEMY_HIT,
                proj.x,
                proj.y,
                "#a7f3d0",
                4
              );
            } else if (isCrit) {
              playCriticalHitSound();
              addFloatingText("CRITICAL", enemy.x, enemy.y - 12, "#f43f5e");
              triggerExplosion(
                particlesRef.current,
                quality.maxParticles,
                ParticleType.ENEMY_HIT,
                proj.x,
                proj.y,
                "#ef4444",
                9
              );
            } else {
              playClickSound(); // short hit tick
              triggerExplosion(
                particlesRef.current,
                quality.maxParticles,
                ParticleType.ENEMY_HIT,
                proj.x,
                proj.y,
                proj.color,
                3
              );
            }

            // Apply physical pushback/displacement (Section 4.1 - pequeño desplazamiento)
            const projAngle = Math.atan2(proj.vy, proj.vx);
            const basePushFactor =
              enemy.type === EnemyType.CRAWLER
                ? 5.5
                : isCrit
                  ? 4.0
                  : 1.8;
            const signatureBehavior =
              enemySignatureBehaviorCacheRef.current.get(enemy);
            const pushFactor =
              basePushFactor *
              signatureBehavior.projectilePushbackMultiplier *
              (proj.pushMultiplier ?? 1);
            enemy.x += Math.cos(projAngle) * pushFactor;
            enemy.y += Math.sin(projAngle) * pushFactor;
            relocateSpatialIndexEntry(
              enemyCollisionIndex,
              collisionOrder,
              enemy.x,
              enemy.y,
              enemy.size,
            );

            // Signature-driven control effects. These reuse the collision
            // spatial index already built for this frame; no full enemy scan.
            if ((proj.slowDurationMs ?? 0) > 0) {
              enemy.slowTimer = Math.max(
                enemy.slowTimer ?? 0,
                proj.slowDurationMs ?? 0,
              );
            }

            if (
              (proj.magneticPullRadius ?? 0) > 0 &&
              (proj.magneticPullStrength ?? 0) > 0
            ) {
              const magneticEntries = findAllCollidingSpatialItems(
                enemyCollisionIndex,
                proj.x,
                proj.y,
                proj.magneticPullRadius ?? 0,
                (otherEnemy) => !otherEnemy.isDead,
              ).entries;
              magneticEntries.forEach(({ item: otherEnemy, order }) => {
                if (otherEnemy === enemy || otherEnemy.isBoss) return;
                const pullX = proj.x - otherEnemy.x;
                const pullY = proj.y - otherEnemy.y;
                const pullDistance =
                  Math.sqrt(pullX * pullX + pullY * pullY) || 1;
                const pullStrength = proj.magneticPullStrength ?? 0;
                otherEnemy.x += (pullX / pullDistance) * pullStrength;
                otherEnemy.y += (pullY / pullDistance) * pullStrength;
                relocateSpatialIndexEntry(
                  enemyCollisionIndex,
                  order,
                  otherEnemy.x,
                  otherEnemy.y,
                  otherEnemy.size,
                );
              });
            }

            // TERMO, ATON and future GAIA synthesis attacks share one bounded
            // spatial splash traversal but carry different profile radii/power.
            if ((proj.splashRadius ?? 0) > 0) {
              const splashRadius = proj.splashRadius ?? 0;
              const splashDamage =
                damageToApply * (proj.splashDamageMultiplier ?? 0);
              
              const splashCandidates =
                findAllCollidingSpatialItems(
                  enemyCollisionIndex,
                  proj.x,
                  proj.y,
                  splashRadius,
                  (otherEnemy) =>
                    otherEnemy !== enemy &&
                    !otherEnemy.isDead,
                ).entries;

              splashCandidates.forEach(({ item: otherEnemy }) => {
                  const commandLinkPulseSourceHealthBeforeSplashHit = otherEnemy.health;
                  otherEnemy.health -= splashDamage;
                  otherEnemy.flashTicks = 4;

                  if (otherEnemy.isBoss) {
                    setBossHp(Math.max(0, otherEnemy.health));
                    if (
                      otherEnemy.milestoneKind !== "BOSS_REMATCH"
                    ) {
                      bossDamageDealtRef.current += splashDamage;
                    }
                  }

                  // Small visual thermal splash explosion
                  triggerExplosion(
                    particlesRef.current,
                    quality.maxParticles,
                    ParticleType.ENEMY_HIT,
                    otherEnemy.x,
                    otherEnemy.y,
                    "#ef4444",
                    3
                  );

                  // Cascading destruction check for splash-damaged targets
                  if (otherEnemy.health <= 0) {
                    otherEnemy.isDead = true;
                    runEnemiesDestroyedRef.current += 1;
                    if (
                      otherEnemy.milestoneKind === "MINIBOSS"
                    ) {
                      persistInfiniteMilestoneDefeat(
                        otherEnemy,
                      );
                    }
                    registerCombatDefeat(otherEnemy, proj.affinity);
                    const commandLinkPulseIntent = otherEnemy.enemyFormation
                      ? resolveLiveCommandLinkPulseIntent(
                          otherEnemy.enemyFormation,
                          "SPLASH_HIT",
                          splashDamage,
                          commandLinkPulseSourceHealthBeforeSplashHit,
                        )
                      : null;
                    if (commandLinkPulseIntent) {
                      pendingCommandLinkPulseRef.current = commandLinkPulseIntent;
                    }
                    
                    playEnemyExplodeSound(otherEnemy.isBoss || otherEnemy.size > 14);

                    triggerExplosion(
                      particlesRef.current,
                      quality.maxParticles,
                      ParticleType.ENEMY_DESTROYED,
                      otherEnemy.x,
                      otherEnemy.y,
                      otherEnemy.color,
                      otherEnemy.isBoss ? 45 : 14,
                      otherEnemy.isBoss ? 3.5 : 2.0
                    );

                    if (otherEnemy.isBoss) {
                      const rematch =
                        otherEnemy.milestoneKind === "BOSS_REMATCH";
                      if (!rematch) {
                        bossSessionEndTimeRef.current = Date.now();
                      }
                      architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter();
    clearArchitectQaDiagnostic();
                      architectEngineIdentityOwnerRef.current?.revoke();
                      bossDefeatedSequenceActiveRef.current = true;
                      bossDefeatedSequenceTimerRef.current = 5000;
                      postDialogue(
                        "COMPANION",
                        rematch
                          ? "¡REMATCH DEL DEVORADOR COLAPSANDO! Mantén sincronía mientras sellamos esta recurrencia."
                          : "¡SISTEMAS DEL DEVORADOR CRÍTICAS! Reacción en cadena termodinámica detectada. ¡Sincronizando pulso de purga final!",
                      );
                    } else {
                      // Only spawn drops & splits if not a minion (Section 2.4 - sin recompensa duplicada)
                      if (!otherEnemy.isMinion) {
                        spawnResource(otherEnemy.x, otherEnemy.y);
                        const currentWaveDescriptor =
                          getCurrentRuntimeDescriptor();
                        if (currentWaveDescriptor.modifiers.includes("CORE_DROP_BOOST")) {
                          spawnResource(otherEnemy.x + Math.random() * 16 - 8, otherEnemy.y + Math.random() * 16 - 8);
                        }
                        if (otherEnemy.type === EnemyType.SPLITTER) {
                          spawnSplitterMinions(otherEnemy);
                        }
                      }
                    }
                  }
              });
            }

            // Check destruction of the directly-hit enemy
            if (enemy.health <= 0) {
              enemy.isDead = true;
              runEnemiesDestroyedRef.current += 1;
              if (
                enemy.milestoneKind === "MINIBOSS"
              ) {
                persistInfiniteMilestoneDefeat(enemy);
              }
              registerCombatDefeat(enemy, proj.affinity);
              const commandLinkPulseIntent = enemy.enemyFormation
                ? resolveLiveCommandLinkPulseIntent(
                    enemy.enemyFormation,
                    "DIRECT_HIT",
                    damageToApply,
                    commandLinkPulseSourceHealthBeforeDirectHit,
                  )
                : null;
              if (commandLinkPulseIntent) {
                pendingCommandLinkPulseRef.current = commandLinkPulseIntent;
              }

              playEnemyExplodeSound(enemy.isBoss || enemy.size > 14);

              triggerExplosion(
                particlesRef.current,
                quality.maxParticles,
                ParticleType.ENEMY_DESTROYED,
                enemy.x,
                enemy.y,
                enemy.color,
                enemy.isBoss ? 45 : 14,
                enemy.isBoss ? 3.5 : 2.0
              );

              // Spawn drops
              if (enemy.isBoss) {
                // Start cinematic boss defeat sequence.
                const rematch =
                  enemy.milestoneKind === "BOSS_REMATCH";
                if (!rematch) {
                  bossSessionEndTimeRef.current = Date.now();
                }
                architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter();
    clearArchitectQaDiagnostic();
                architectEngineIdentityOwnerRef.current?.revoke();
                bossDefeatedSequenceActiveRef.current = true;
                bossDefeatedSequenceTimerRef.current = 5000;
                postDialogue(
                  "COMPANION",
                  rematch
                    ? "¡REMATCH DEL DEVORADOR COLAPSANDO! Mantén sincronía mientras sellamos esta recurrencia."
                    : "¡SISTEMAS DEL DEVORADOR CRÍTICAS! Reacción en cadena termodinámica detectada. ¡Sincronizando pulso de purga final!",
                );
              } else {
                // Only spawn resource or splits if NOT a minion (Section 2.4)
                if (!enemy.isMinion) {
                  spawnResource(enemy.x, enemy.y);
                  const currentWaveDescriptor =
                    getCurrentRuntimeDescriptor();
                  if (currentWaveDescriptor.modifiers.includes("CORE_DROP_BOOST")) {
                    spawnResource(enemy.x + Math.random() * 16 - 8, enemy.y + Math.random() * 16 - 8);
                  }
                  // Splitter logic
                  if (enemy.type === EnemyType.SPLITTER) {
                    spawnSplitterMinions(enemy);
                  }
                }
              }
            }
        }
      } else {
        // Enemy projectiles vs Player core
        const dx = proj.x - playerPosRef.current.x;
        const dy = proj.y - playerPosRef.current.y;
        const playerProjectileCollisionRadius =
          16 + proj.size;

        if (
          dx * dx + dy * dy <
          playerProjectileCollisionRadius *
            playerProjectileCollisionRadius
        ) {
          proj.life = 0; // Destroy projectile
          if (proj.color === "#3b82f6") {
            damagePlayerFromBoss(proj.damage, "orbital_shards");
          } else {
            const regularIncomingDamageMultiplier =
              bossActiveRef.current
                ? 1
                : mutatorEffects.incomingDamageMultiplier;
            damagePlayer(
              proj.damage *
                regularIncomingDamageMultiplier,
            );
          }
        }
      }
    });

    // 2. ENEMIES CONTACT DAMAGE vs PLAYER CORE
    // Reuse the live collision index instead of scanning every enemy.
    // Sorting by original array order preserves simultaneous-contact semantics.
    const playerContactCandidates =
      findAllCollidingSpatialItems(
        enemyCollisionIndex,
        playerPosRef.current.x,
        playerPosRef.current.y,
        16,
        (enemy) => !enemy.isDead,
      ).entries;

    playerContactCandidates.forEach(({ item: enemy }) => {
      // Trigger contact damage
      const isBossChassis =
        enemy.type === EnemyType.BOSS_DEVOURER ||
        enemy.type === EnemyType.BOSS_TITAN ||
        enemy.type === EnemyType.BOSS_WORM;
      const baseDamage = isBossChassis ? 25 : 15;
      if (isBossChassis) {
        const attackType =
          bossCurrentAttackRef.current === "devourer_charge"
            ? "devourer_charge"
            : "contact_damage";
        damagePlayerFromBoss(baseDamage, attackType);
      } else {
        damagePlayer(
          baseDamage *
            combatPressure.contactDamageMultiplier *
            mutatorEffects.incomingDamageMultiplier *
            (enemy.milestoneContactDamageMultiplier ??
              1) *
            (enemy.evolvedContactDamageMultiplier ??
              1),
        );
      }
    });

    collisionEnemyIndexRef.current = null;
  };

  // --- SPAWN SPLITTED ENEMY PARTS ---
  const spawnMinionSplit = (x: number, y: number, size: number) => {
    if (enemiesRef.current.length >= MAX_ENEMIES) return;
    const combatPressure = getCurrentCombatPressure();
    const mutatorEffects = getCurrentMutatorEffects();
    const splitHealthMultiplier =
      combatPressure.sourceMode === "INFINITE"
        ? combatPressure.enemyHealthMultiplier
        : 1;
    const splitSpeedMultiplier =
      combatPressure.sourceMode === "INFINITE"
        ? combatPressure.enemyMovementSpeedMultiplier *
          mutatorEffects.enemySpeedMultiplier
        : 1;
    const minion: Enemy = {
      id: Math.random().toString(),
      type: EnemyType.CRAWLER,
      x,
      y,
      vx: 0,
      vy: 0,
      health: 12 * splitHealthMultiplier,
      maxHealth: 12 * splitHealthMultiplier,
      speed: 1.1 * splitSpeedMultiplier,
      size,
      color: "#22c55e",
      shootCooldown: 120,
      pulseCooldown: 0,
      contactDamageCooldown: 0,
      isDead: false,
      isBoss: false,
      flashTicks: 0
    };
    enemiesRef.current.push(minion);

    if (collisionEnemyIndexRef.current) {
      insertSpatialIndexEntry(
        collisionEnemyIndexRef.current,
        minion,
        enemiesRef.current.length - 1,
        minion.x,
        minion.y,
        minion.size,
      );
    }
  };

  const spawnSplitterMinions = (enemy: Enemy) => {
    const minionSize = enemy.size * 0.7;
    spawnMinionSplit(
      enemy.x - 10,
      enemy.y,
      minionSize,
    );
    spawnMinionSplit(
      enemy.x + 10,
      enemy.y,
      minionSize,
    );

    const signatureBehavior =
      enemySignatureBehaviorCacheRef.current.get(enemy);
    if (signatureBehavior.splitterExtraMinions < 1) {
      return;
    }

    const descriptor = getCurrentRuntimeDescriptor();
    const livingEnemyCount =
      countLivingEnemies(
        enemiesRef.current,
      );
    const effectiveEnemyCap = Math.min(
      MAX_ENEMIES,
      descriptor.spawn.maxConcurrentEnemies,
    );

    if (livingEnemyCount < effectiveEnemyCap) {
      spawnMinionSplit(
        enemy.x,
        enemy.y + 10,
        minionSize,
      );
    }
  };

  // --- DAMAGE PLAYER FROM BOSS SPECIFIC TELEMETRY ---
  const damagePlayerFromBoss = (dmg: number, attackType: string) => {
    if (invincibilityTimerRef.current > 0) return;

    const rematch = isActiveBossRematch();
    if (
      !rematch &&
      bossAttacksHitByTypeRef.current &&
      bossAttacksHitByTypeRef.current[attackType] !== undefined
    ) {
      bossAttacksHitByTypeRef.current[attackType]++;
    }

    const damageMultiplier =
      rematch
        ? (bossRef.current?.milestoneDamageMultiplier ?? 1)
        : 1;
    damagePlayer(dmg * damageMultiplier);
  };

  // --- DAMAGE PLAYER CORE ENGINE ---
  const damagePlayer = (dmg: number) => {
    if (invincibilityTimerRef.current > 0) return;

    // Apply shield reduction adjusted for active formation defense multipliers
    const defenseMod = FORMATIONS[activeFormationRef.current].shieldMod; // e.g. +0.25 (which means -25% damage taken)
    const multiplier = Math.max(0.4, 1.0 - defenseMod);
    const gaiaDefenseMultiplier = gaiaMemberRef.current
      ? getGaiaCombatScale(
          gaiaMemberRef.current.level,
        ).incomingDamageMultiplier
      : 1;
    const finalDamage =
      dmg * multiplier * gaiaDefenseMultiplier;

    combatResonanceRef.current = applyCombatResonanceDamageBreak(
      combatResonanceRef.current,
    );
    shieldRef.current = Math.max(0, shieldRef.current - finalDamage);
    setShield(shieldRef.current);

    if (
      bossActiveRef.current &&
      !isActiveBossRematch()
    ) {
      bossDamageTakenRef.current += finalDamage;
    }

    // Apply Screen shake
    screenShakeRef.current = 12;

    playDamageSound();

    // Spawn warning rings
    triggerExplosion(
      particlesRef.current,
      getQualityConfig(stats.qualityPreset).maxParticles,
      ParticleType.PLAYER_DAMAGE,
      playerPosRef.current.x,
      playerPosRef.current.y,
      "#ef4444",
      15
    );

    // Trigger invincibility cooldown frames
    invincibilityTimerRef.current = PLAYER_HIT_COOLDOWN;
    playerFlashRef.current = 60; // flash frames

    postDialogue("COMPANION", "¡CUIDADO! Impacto directo en el núcleo Foton. Integridad crítica.");

    // Check Core Collapse GameOver
    if (shieldRef.current <= 0) {
      triggerGameOver(false);
    }
  };

  // --- RENDER TACTICAL RADAR MINIMAP OVERLAY ---
  const drawTacticalMinimap = (ctx: CanvasRenderingContext2D, mode: "FULL" | "COMPACT" | "OFF") => {
    const cam = cameraStateRef.current;
    
    // Position minimap in the top right corner of the actual viewport
    const pad = 12;
    const size = mode === "FULL" ? 130 : 90;
    const rx = cam.viewportWidth - size - pad;
    const ry = pad;

    ctx.save();
    
    // Draw high-tech outer frame & backplate
    ctx.fillStyle = "rgba(10, 15, 30, 0.75)";
    ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
    ctx.lineWidth = 1.5;
    
    if (mode === "COMPACT") {
      // circular radar styling
      ctx.beginPath();
      ctx.arc(rx + size / 2, ry + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw grid circular rings
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(rx + size / 2, ry + size / 2, size / 3, 0, Math.PI * 2);
      ctx.arc(rx + size / 2, ry + size / 2, size / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Analog sweep line animation effect
      const sweepAngle = (timeElapsedRef.current * 0.002) % (Math.PI * 2);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      ctx.beginPath();
      ctx.moveTo(rx + size / 2, ry + size / 2);
      ctx.lineTo(
        rx + size / 2 + Math.cos(sweepAngle) * (size / 2),
        ry + size / 2 + Math.sin(sweepAngle) * (size / 2)
      );
      ctx.stroke();

      // Compact radar: local coordinates centered on the player (Foton)
      // Radius representing 320 world units
      const radiusWorld = 320;
      const radiusWorldSquared =
        radiusWorld * radiusWorld;
      const scale = (size / 2) / radiusWorld;
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;
      const cx = rx + size / 2;
      const cy = ry + size / 2;

      // Draw player center
      ctx.fillStyle = "#22d3ee"; // cian
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw allies Orbi followers
      ctx.fillStyle = "#10b981"; // green
      swarmRef.current.forEach((m) => {
        const dx = m.x - px;
        const dy = m.y - py;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < radiusWorldSquared) {
          ctx.beginPath();
          ctx.arc(cx + dx * scale, cy + dy * scale, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw enemies with distinctive types
      enemiesRef.current.forEach((e) => {
        const dx = e.x - px;
        const dy = e.y - py;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < radiusWorldSquared) {
          ctx.beginPath();
          if (e.isBoss) {
            // Big pulsating boss icon
            const pulse = 3.5 + Math.sin(timeElapsedRef.current * 0.08) * 1.5;
            ctx.fillStyle = "#ec4899"; // pink/magenta boss
            ctx.arc(cx + dx * scale, cy + dy * scale, pulse, 0, Math.PI * 2);
          } else if (e.type === EnemyType.DISRUPTOR) {
            ctx.fillStyle = "#06b6d4"; // cyan disruptor
            ctx.arc(cx + dx * scale, cy + dy * scale, 3, 0, Math.PI * 2);
          } else if (e.type === EnemyType.BLACKOUT_ELITE) {
            ctx.fillStyle = "#f43f5e"; // rose elite
            ctx.arc(cx + dx * scale, cy + dy * scale, 2.5, 0, Math.PI * 2);
          } else {
            ctx.fillStyle = "#ef4444"; // red default
            ctx.arc(cx + dx * scale, cy + dy * scale, 1.8, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      });

      // Draw cores / pickups
      resourcesRef.current.forEach((res) => {
        if (res.consumed || res.size <= 0) return;
        const dx = res.x - px;
        const dy = res.y - py;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < radiusWorldSquared) {
          ctx.beginPath();
          let color = "#eab308"; // yellow quantum
          if (res.orbiAffinity === "solar") color = "#f97316"; // orange solar
          else if (res.orbiAffinity === "hydro") color = "#3b82f6"; // blue hydro
          ctx.fillStyle = color;
          ctx.arc(cx + dx * scale, cy + dy * scale, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    } else {
      // FULL mode: square frame representing the complete 1600x960 battlefield
      ctx.beginPath();
      ctx.roundRect(rx, ry, size, size, 6);
      ctx.fill();
      ctx.stroke();

      // Scale factors for full map
      const scaleX = size / WORLD_WIDTH;
      const scaleY = size / WORLD_HEIGHT;

      // Draw faint boundary lines
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(rx + size / 2, ry);
      ctx.lineTo(rx + size / 2, ry + size);
      ctx.moveTo(rx, ry + size / 2);
      ctx.lineTo(rx + size, ry + size / 2);
      ctx.stroke();

      // Draw planets
      ctx.fillStyle = "rgba(100, 116, 139, 0.4)";
      const bgPlanets = (backgroundRenderer as any).planets || [];
      bgPlanets.forEach((p: any) => {
        ctx.beginPath();
        ctx.arc(rx + p.x * scaleX, ry + p.y * scaleY, p.size * 0.12, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw allies Orbi followers
      ctx.fillStyle = "#10b981"; // green
      swarmRef.current.forEach((m) => {
        ctx.beginPath();
        ctx.arc(rx + m.x * scaleX, ry + m.y * scaleY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw enemies
      enemiesRef.current.forEach((e) => {
        ctx.beginPath();
        if (e.isBoss) {
          const pulse = 4 + Math.sin(timeElapsedRef.current * 0.08) * 2;
          ctx.fillStyle = "#ec4899";
          ctx.arc(rx + e.x * scaleX, ry + e.y * scaleY, pulse, 0, Math.PI * 2);
        } else if (e.type === EnemyType.DISRUPTOR) {
          ctx.fillStyle = "#06b6d4";
          ctx.arc(rx + e.x * scaleX, ry + e.y * scaleY, 3, 0, Math.PI * 2);
        } else if (e.type === EnemyType.BLACKOUT_ELITE) {
          ctx.fillStyle = "#f43f5e";
          ctx.arc(rx + e.x * scaleX, ry + e.y * scaleY, 2.5, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = "#ef4444";
          ctx.arc(rx + e.x * scaleX, ry + e.y * scaleY, 1.8, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      // Draw cores / pickups
      resourcesRef.current.forEach((res) => {
        if (res.consumed || res.size <= 0) return;
        ctx.beginPath();
        let color = "#eab308";
        if (res.orbiAffinity === "solar") color = "#f97316";
        else if (res.orbiAffinity === "hydro") color = "#3b82f6";
        ctx.fillStyle = color;
        ctx.arc(rx + res.x * scaleX, ry + res.y * scaleY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw camera viewport boundaries
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(
        rx + cam.cameraX * scaleX,
        ry + cam.cameraY * scaleY,
        (cam.viewportWidth / cam.zoom) * scaleX,
        (cam.viewportHeight / cam.zoom) * scaleY
      );

      // Draw player (Foton)
      ctx.fillStyle = "#22d3ee"; // cian
      ctx.beginPath();
      ctx.arc(rx + playerPosRef.current.x * scaleX, ry + playerPosRef.current.y * scaleY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add high-tech text indicator
    ctx.fillStyle = "rgba(6, 182, 212, 0.65)";
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`RADAR:${mode}`, rx + 5, ry + size - 5);

    ctx.restore();
  };

  // --- RENDER CURRENT GAME SCENE DIRECTLY INTO CANVAS ---
  const renderCanvasScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // C13: genuine DEV-only READ-ONLY browser targeting evidence. Reading the
    // current authenticated owner, actual world geometry and camera never
    // admits a boss, sets HP, fires shots or modifies a simulation reference.
    const qaOwner = architectEngineIdentityOwnerRef.current;
    const qaGuard = architectQaGuardRef.current;
    const qaBoss = architectQaBossRef.current;
    const qaGeom = architectQaCardinalsRef.current;
    if (import.meta.env.DEV && qaOwner && qaGuard && qaBoss && qaGeom &&
        qaGeom.boss === qaBoss && qaGeom.guard === qaGuard &&
        qaOwner.isCurrent(qaGuard, qaBoss, bossRef.current, enemiesRef.current)) {
      const cam = cameraStateRef.current;
      canvas.dataset.architectQaReadout = JSON.stringify({
        boss: {x:qaBoss.x,y:qaBoss.y,health:qaBoss.health,maxHealth:qaBoss.maxHealth},
        anchors:qaGeom.anchors.map(a=>({id:a.id,x:a.x,y:a.y,
          radius:a.radius,health:a.health,maxHealth:a.maxHealth})),
        foton: {x:playerPosRef.current.x,y:playerPosRef.current.y},
        shotActive: architectQaShotRef.current !== null,
        lastQaPointerType: architectQaLastPointerTypeRef.current,
        camera: {x:cam.cameraX,y:cam.cameraY,zoom:cam.zoom,
          width:cam.viewportWidth,height:cam.viewportHeight},
      });
    } else {
      delete canvas.dataset.architectQaReadout;
    }

    // UX02: actual backing store and camera share one logical viewport.
    // Equal world-units-per-pixel on both axes prevents stretched geometry.
    const backingScaleX = canvas.width / panoramicViewport.width;
    const backingScaleY = canvas.height / panoramicViewport.height;
    ctx.setTransform(backingScaleX, 0, 0, backingScaleY, 0, 0);

    // 1. Draw Space Background and layered grids
    const quality = getQualityConfig(stats.qualityPreset);
    backgroundRenderer.render(
      ctx,
      timeElapsedRef.current,
      activeBiome,
      cameraStateRef.current.cameraX,
      cameraStateRef.current.cameraY,
      cameraStateRef.current.zoom,
      quality.drawNebula,
      quality.drawPlanets,
      quality.drawCosmicWhale &&
        runtimeProgressionRef.current.mode === "INFINITE",
      bossActiveRef.current,
      cameraStateRef.current.viewportWidth,
      cameraStateRef.current.viewportHeight
    );

    const liveOverdriveRenderProjection = projectCombatOverdrive(
      combatOverdriveRef.current,
      timeElapsedRef.current,
      projectCombatResonance(combatResonanceRef.current).overdriveReady,
    );
    const liveOverdrivePresentation = projectCombatOverdrivePresentation({
      active: liveOverdriveRenderProjection.active,
      remainingRatio: liveOverdriveRenderProjection.remainingRatio,
      qualityPreset: statsRef.current?.qualityPreset ?? stats.qualityPreset,
    });
    drawCombatOverdriveFieldOverlay(
      ctx,
      liveOverdrivePresentation,
      cameraStateRef.current.viewportWidth,
      cameraStateRef.current.viewportHeight,
    );

    // Apply camera transformation context and screen shake translation
    ctx.save();
    
    // 1. Apply Screen Shake first
    ctx.translate(cameraOffsetRef.current.x, cameraOffsetRef.current.y);

    // 2. Scale and pan according to camera zoom and coordinates
    ctx.scale(cameraStateRef.current.zoom, cameraStateRef.current.zoom);
    ctx.translate(-cameraStateRef.current.cameraX, -cameraStateRef.current.cameraY);

    // 2. Draw resources
    drawResources(ctx, resourcesRef.current, timeElapsedRef.current, playerPosRef.current, stats.coreLabelsMode);

    // 3. Draw active shooter projectiles
    drawProjectilesList(ctx, projectilesRef.current);

    const flashProfile =
      projectFlashAccessibility(
        statsRef.current?.flashIntensity ??
          stats.flashIntensity,
      );

    // 4. Draw enemies
    drawEnemiesList(
      ctx,
      enemiesRef.current,
      timeElapsedRef.current,
      playerPosRef.current,
      flashProfile,
    );
    // C1: DEV-only camera-space presentation of four engine-owned QA circles.
    // NO collision, HP mutation, global actor scan, attack or projectile consume.
    const qaCardinals = architectQaCardinalsRef.current;
    if (import.meta.env.DEV && qaCardinals !== null &&
        qaCardinals.boss === architectQaBossRef.current &&
        qaCardinals.boss === bossRef.current &&
        qaCardinals.guard === architectQaGuardRef.current &&
        !qaCardinals.boss.isDead) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 9px monospace";
      ctx.lineWidth = 2;
      for (const anchor of qaCardinals.anchors) {
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, anchor.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#082f49";
        ctx.strokeStyle = "#67e8f9";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#e0f2fe";
        ctx.fillText(anchor.id + " " + Math.round(anchor.health) + "/" + anchor.maxHealth,
          anchor.x, anchor.y + anchor.radius + 12);
      }
      ctx.restore();
    }
    // C5 GRID_LOCK: draw two physical world-space lanes in the same camera
    // context as FOTON and the C1 cardinal circles, only in authenticated QA.
    const liveQaGrid = architectQaGridLockRef.current;
    if (import.meta.env.DEV && liveQaGrid !== null &&
        liveQaGrid.boss === architectQaBossRef.current &&
        liveQaGrid.boss === bossRef.current &&
        liveQaGrid.guard === architectQaGuardRef.current &&
        (liveQaGrid.phase === "TELEGRAPH" || liveQaGrid.phase === "ACTIVE")) {
      const gridCfg = BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG;
      const gridBoss = liveQaGrid.boss;
      ctx.save();
      ctx.fillStyle = liveQaGrid.phase === "ACTIVE"
        ? "rgba(248, 113, 113, 0.28)" : "rgba(250, 204, 21, 0.14)";
      ctx.strokeStyle = liveQaGrid.phase === "ACTIVE" ? "#f87171" : "#facc15";
      ctx.lineWidth = 1.4;
      ctx.fillRect(gridBoss.x - gridCfg.halfWidth, gridBoss.y - gridCfg.extent,
        gridCfg.halfWidth * 2, gridCfg.extent * 2);
      ctx.strokeRect(gridBoss.x - gridCfg.halfWidth, gridBoss.y - gridCfg.extent,
        gridCfg.halfWidth * 2, gridCfg.extent * 2);
      ctx.fillRect(gridBoss.x - gridCfg.extent, gridBoss.y - gridCfg.halfWidth,
        gridCfg.extent * 2, gridCfg.halfWidth * 2);
      ctx.strokeRect(gridBoss.x - gridCfg.extent, gridBoss.y - gridCfg.halfWidth,
        gridCfg.extent * 2, gridCfg.halfWidth * 2);
      ctx.restore();
    }
    // C6: six real deterministic world-space hazards, exclusive of GRID_LOCK.
    const qaTideDraw = architectQaVectorTideRef.current;
    if (import.meta.env.DEV && qaTideDraw !== null &&
        qaTideDraw.boss === architectQaBossRef.current &&
        qaTideDraw.boss === bossRef.current &&
        qaTideDraw.guard === architectQaGuardRef.current) {
      const c = BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG;
      ctx.save();
      if (qaTideDraw.phase === "TELEGRAPH") {
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5,4]);
        for (const bolt of qaTideDraw.bolts) {
          ctx.beginPath();
          ctx.moveTo(qaTideDraw.boss.x,qaTideDraw.boss.y);
          ctx.lineTo(qaTideDraw.boss.x + bolt.vx * c.activeMs,
            qaTideDraw.boss.y + bolt.vy * c.activeMs);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      } else if (qaTideDraw.phase === "ACTIVE") {
        ctx.fillStyle = "#a78bfa";
        ctx.strokeStyle = "#e9d5ff";
        ctx.lineWidth = 2;
        for (const bolt of qaTideDraw.bolts) {
          if (bolt.spent) continue;
          ctx.beginPath();
          ctx.arc(bolt.x,bolt.y,c.projectileRadius,0,Math.PI*2);
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    // C7: eight moving tangent wall segments drawn in authenticated world-space.
    const qaWallDraw = architectQaSectorWallRef.current;
    if (import.meta.env.DEV && qaWallDraw !== null &&
        qaWallDraw.boss === architectQaBossRef.current &&
        qaWallDraw.boss === bossRef.current &&
        qaWallDraw.guard === architectQaGuardRef.current &&
        (qaWallDraw.phase === "TELEGRAPH" || qaWallDraw.phase === "ACTIVE")) {
      const w = BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG;
      ctx.save();
      ctx.lineWidth = w.segmentHalfWidth * 2;
      ctx.strokeStyle = qaWallDraw.phase === "ACTIVE" ? "#fb7185" : "#fbbf24";
      ctx.globalAlpha = qaWallDraw.phase === "ACTIVE" ? 0.78 : 0.38;
      if (qaWallDraw.phase === "TELEGRAPH") ctx.setLineDash([8,6]);
      for (const wall of qaWallDraw.segments) {
        const tangentX = -wall.directionY * w.segmentHalfLength;
        const tangentY = wall.directionX * w.segmentHalfLength;
        ctx.beginPath();
        ctx.moveTo(wall.x - tangentX,wall.y - tangentY);
        ctx.lineTo(wall.x + tangentX,wall.y + tangentY);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    }
    if (bossRef.current?.bossChassis === "WORM_SEGMENTS") {
      drawWormSegmentChain(
        ctx,
        bossRef.current,
        shieldNodesRef.current,
        timeElapsedRef.current,
      );
    }

    // 5. Draw active Particles
    particlesRef.current.forEach((p) => {
      drawParticle(ctx, p);
    });

    // J2D-B: bounded collective Overdrive field, drawn directly with no particles.
    drawCombatOverdriveSwarmHalo(
      ctx,
      liveOverdrivePresentation,
      playerPosRef.current,
    );

    // 6. Draw swarm shooters
    drawSwarmRoster(
      ctx,
      swarmRef.current,
      timeElapsedRef.current,
      flashProfile,
    );

    // 7. Draw reactive tactical Foton leader.
    const fotonShieldMax =
      SHIELD_MAX +
      (upgradesLevel.hydrogen_deflector || 0) * 15 +
      (activeRunUpgradesRef.current.foton_integrity || 0) *
        30;
    const fotonShieldRatio =
      shieldRef.current /
      Math.max(1, fotonShieldMax);

    drawFoton(
      ctx,
      playerPosRef.current,
      playerFlashRef.current,
      timeElapsedRef.current,
      pointerRef.current,
      (stats.bossVictories || 0) > 0,
      flashProfile,
      fotonShieldRatio,
      stats.qualityPreset,
      isPausedRef.current,
      fotonThreatDirectionRef.current,
      runOrbiAcquiredRef.current,
    );

    // 8. Draw active floating text feedback (such as CRITICAL or BLOCK)
    ctx.save();
    floatingTextsRef.current.forEach((t) => {
      const alpha = Math.max(0, Math.min(1, t.life / t.maxLife));
      ctx.fillStyle = t.color;
      ctx.globalAlpha = alpha;
      ctx.font = "bold 9px monospace";
      ctx.shadowBlur = 4;
      ctx.shadowColor = t.color;
      ctx.textAlign = "center";
      ctx.fillText(t.text, t.x, t.y);
    });
    ctx.restore();

    ctx.restore(); // Restore camera transformation matrix context

    // 9. Infinite reduced-visibility field: battlefield only.
    // HUD and tactical radar render after this overlay and stay readable.
    if (waveActiveRef.current) {
      const renderRuntimeProjection =
        getCurrentRuntimeProjection();
      const renderDescriptor =
        renderRuntimeProjection.descriptor;
      const renderMutatorEffects =
        renderRuntimeProjection.mutatorEffects;
      const visibilityProfile =
        getReducedVisibilityOverlayProfile(
          renderMutatorEffects,
          cameraStateRef.current.viewportWidth,
          cameraStateRef.current.viewportHeight,
        );

      if (
        renderDescriptor.sourceMode === "INFINITE" &&
        visibilityProfile
      ) {
        const playerScreenX =
          (playerPosRef.current.x -
            cameraStateRef.current.cameraX) *
            cameraStateRef.current.zoom +
          cameraOffsetRef.current.x;
        const playerScreenY =
          (playerPosRef.current.y -
            cameraStateRef.current.cameraY) *
            cameraStateRef.current.zoom +
          cameraOffsetRef.current.y;

        ctx.save();
        const fog = ctx.createRadialGradient(
          playerScreenX,
          playerScreenY,
          visibilityProfile.innerRadius,
          playerScreenX,
          playerScreenY,
          visibilityProfile.outerRadius,
        );
        fog.addColorStop(0, "rgba(2, 6, 23, 0)");
        fog.addColorStop(
          1,
          `rgba(2, 6, 23, ${visibilityProfile.outerAlpha})`,
        );
        ctx.fillStyle = fog;
        ctx.fillRect(
          0,
          0,
          cameraStateRef.current.viewportWidth,
          cameraStateRef.current.viewportHeight,
        );
        ctx.restore();
      }
    }

    // 10. Electrical-storm telegraph renders above visibility fog.
    const stormState =
      electricalStormStateRef.current;
    if (
      stormState.phase === "TELEGRAPH" &&
      stormState.targetX !== null &&
      stormState.targetY !== null
    ) {
      const stormRuntimeProjection =
        getCurrentRuntimeProjection();
      const stormDescriptor =
        stormRuntimeProjection.descriptor;
      const stormEffects =
        stormRuntimeProjection.mutatorEffects;
      const stormPressure =
        stormRuntimeProjection.combatPressure;
      const stormConfig =
        stormDescriptor.sourceMode === "INFINITE"
          ? getElectricalStormConfig(
              stormEffects,
              stormPressure,
            )
          : null;

      if (stormConfig) {
        const targetScreenX =
          (stormState.targetX -
            cameraStateRef.current.cameraX) *
            cameraStateRef.current.zoom +
          cameraOffsetRef.current.x;
        const targetScreenY =
          (stormState.targetY -
            cameraStateRef.current.cameraY) *
            cameraStateRef.current.zoom +
          cameraOffsetRef.current.y;
        const strikeRadiusPx =
          stormConfig.strikeRadius *
          cameraStateRef.current.zoom;
        const telegraphProgress = Math.max(
          0,
          Math.min(
            1,
            1 -
              stormState.remainingMs /
                stormConfig.telegraphMs,
          ),
        );
        const warningRadius =
          strikeRadiusPx *
          (1.35 - telegraphProgress * 0.35);

        ctx.save();
        ctx.fillStyle = "rgba(56, 189, 248, 0.10)";
        ctx.strokeStyle = "rgba(103, 232, 249, 0.95)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(
          targetScreenX,
          targetScreenY,
          strikeRadiusPx,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(
          targetScreenX,
          targetScreenY,
          warningRadius,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    // 11. Milestone miniboss telegraph stays visible above environmental fog.
    if (
      minibossGateRef.current.phase ===
      "TELEGRAPH"
    ) {
      const pulse =
        0.7 +
        Math.sin(timeElapsedRef.current * 0.012) *
          0.3;
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 11px monospace";
      ctx.fillStyle =
        `rgba(251, 191, 36, ${pulse})`;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 12;
      ctx.fillText(
        "⚠ BLACKOUT WARDEN INBOUND",
        cameraStateRef.current.viewportWidth / 2,
        54,
      );
      ctx.font = "bold 8px monospace";
      ctx.fillStyle =
        "rgba(253, 230, 138, 0.9)";
      ctx.fillText(
        "MILESTONE THREAT // PREPARE FLANK ATTACK",
        cameraStateRef.current.viewportWidth / 2,
        69,
      );
      ctx.restore();
    }

    // DEV C3: independent Architect core and four-anchor QA status, in canvas
    // screen coordinates, never the legacy BossHudOverlay or production HUD.
    const liveQaCore = architectQaBossRef.current;
    const liveQaGeometry = architectQaCardinalsRef.current;
    if (import.meta.env.DEV && liveQaCore !== null && liveQaGeometry !== null &&
        bossRef.current === liveQaCore &&
        liveQaGeometry.boss === liveQaCore) {
      const livingCardinals = liveQaGeometry.anchors.filter(a => a.health > 0).length;
      ctx.save();
      ctx.fillStyle = "rgba(2, 6, 23, 0.88)";
      ctx.fillRect(8, CANVAS_HEIGHT - 46, 278, 36);
      ctx.fillStyle = livingCardinals > 0 ? "#67e8f9" : "#fbbf24";
      ctx.textAlign = "left";
      ctx.font = "bold 10px monospace";
      ctx.fillText("ARCHITECT QA CORE  " +
        Math.ceil(liveQaCore.health) + "/" + liveQaCore.maxHealth,
        16, CANVAS_HEIGHT - 30);
      ctx.font = "bold 9px monospace";
      ctx.fillText(livingCardinals > 0
          ? "CARDINAL ANCHORS LEFT: " + livingCardinals + "/4"
          : "ALL ANCHORS DOWN — CORE VULNERABLE",
        16, CANVAS_HEIGHT - 17);
      ctx.restore();
    }

    // C5 GRID_LOCK QA presentation: isolated player hull and actual hazard stage.
    const qaGridStatus = architectQaGridLockRef.current;
    if (import.meta.env.DEV && qaGridStatus !== null &&
        qaGridStatus.boss === architectQaBossRef.current &&
        qaGridStatus.boss === bossRef.current) {
      ctx.save();
      ctx.fillStyle = "rgba(2, 6, 23, 0.90)";
      ctx.fillRect(8, CANVAS_HEIGHT - 85, 288, 34);
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = qaGridStatus.phase === "ACTIVE" ? "#fca5a5" : "#fde68a";
      ctx.fillText("GRID_LOCK " + qaGridStatus.phase + " — " +
        Math.ceil(qaGridStatus.remainingMs) + "ms", 16, CANVAS_HEIGHT - 71);
      ctx.fillStyle = "#a5f3fc";
      ctx.fillText("QA FOTON HULL: " + qaGridStatus.qaHullHealth + "/100", 16, CANVAS_HEIGHT - 57);
      ctx.restore();
    }

    // C6 separate DEV QA VECTOR_TIDE hull/status: grid and tide never run together.
    const tideStatus = architectQaVectorTideRef.current;
    if (import.meta.env.DEV && tideStatus !== null &&
        tideStatus.boss === architectQaBossRef.current &&
        tideStatus.boss === bossRef.current) {
      ctx.save();
      ctx.fillStyle = "rgba(2, 6, 23, 0.90)";
      ctx.fillRect(8,CANVAS_HEIGHT-85,288,34);
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = tideStatus.phase === "ACTIVE" ? "#c4b5fd" : "#67e8f9";
      ctx.fillText("VECTOR_TIDE " + tideStatus.phase + " — " +
        Math.ceil(tideStatus.remainingMs) + "ms",16,CANVAS_HEIGHT-71);
      ctx.fillText("QA FOTON HULL: " + tideStatus.qaHullHealth + "/100",
        16,CANVAS_HEIGHT-57);
      ctx.restore();
    }

    // C7 QA-only wall phase/hull status independent of other attack HUDs.
    const wallStatus = architectQaSectorWallRef.current;
    if (import.meta.env.DEV && wallStatus !== null &&
        wallStatus.boss === architectQaBossRef.current &&
        wallStatus.boss === bossRef.current) {
      ctx.save();
      ctx.fillStyle = "rgba(2, 6, 23, 0.90)";
      ctx.fillRect(8,CANVAS_HEIGHT-85,288,34);
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = wallStatus.phase === "ACTIVE" ? "#fda4af" : "#fcd34d";
      ctx.fillText("SECTOR_WALL " + wallStatus.phase + " — " +
        Math.ceil(wallStatus.remainingMs) + "ms",16,CANVAS_HEIGHT-71);
      ctx.fillText("QA FOTON HULL: " + wallStatus.qaHullHealth + "/100",
        16,CANVAS_HEIGHT-57);
      ctx.restore();
    }

    const qaDirectorDraw=architectQaDirectorRef.current;
    if(import.meta.env.DEV && qaDirectorDraw!==null &&
       qaDirectorDraw.boss===architectQaBossRef.current &&
       qaDirectorDraw.guard===architectQaGuardRef.current) {
      ctx.save();
      ctx.fillStyle="rgba(2, 6, 23, 0.91)";
      ctx.fillRect(8,CANVAS_HEIGHT-129,288,35);
      ctx.font="bold 10px monospace";
      ctx.textAlign="left";
      ctx.fillStyle="#67e8f9";
      ctx.fillText("QA DIRECTOR PHASE "+qaDirectorDraw.phase+
        " / "+qaDirectorDraw.pattern,16,CANVAS_HEIGHT-115);
      ctx.fillText("SHARED QA HULL: "+qaDirectorDraw.qaHullHealth+"/100",
        16,CANVAS_HEIGHT-100);
      ctx.restore();
    }

    // C9: real authenticated source-of-truth QA battle status only in Vite DEV.
    // Read-only projection; never call normal combat UI or touch global systems.
    const qaBattleHud=import.meta.env.DEV
      ? projectBlackoutArchitectDevQaBattleHud(
          architectEngineIdentityOwnerRef.current,architectQaGuardRef.current,
          architectQaCardinalsRef.current,architectQaBossRef.current,
          bossRef.current,enemiesRef.current,
          architectQaGridLockRef.current,architectQaVectorTideRef.current,
          architectQaSectorWallRef.current,
          architectQaGridLockRef.current??architectQaVectorTideRef.current??
            architectQaSectorWallRef.current,
          architectQaDirectorRef.current,true)
      : null;
    if (qaBattleHud!==null) {
      const n=qaBattleHud.anchors[0],e=qaBattleHud.anchors[1],
        south=qaBattleHud.anchors[2],w=qaBattleHud.anchors[3];
      const hp=(a:typeof n)=>Math.ceil(a.health)+"/"+a.maxHealth;
      const left=8,top=CANVAS_HEIGHT-253;
      ctx.save();
      ctx.fillStyle="rgba(2,6,23,0.94)";
      ctx.fillRect(left,top,288,115);
      ctx.strokeStyle=qaBattleHud.attackPhase==="ACTIVE"?"#fb7185":"#22d3ee";
      ctx.lineWidth=1;
      ctx.strokeRect(left+0.5,top+0.5,287,114);
      ctx.textAlign="left";
      ctx.font="bold 10px monospace";
      ctx.fillStyle="#f8fafc";
      ctx.fillText("ARCHITECT QA  P"+qaBattleHud.directorPhase+
        "  "+(qaBattleHud.directorEnabled?"AUTO":"MANUAL"),16,top+15);
      ctx.font="bold 9px monospace";
      ctx.fillStyle="#67e8f9";
      ctx.fillText("N "+hp(n)+"   E "+hp(e),16,top+29);
      ctx.fillText("S "+hp(south)+"   W "+hp(w),16,top+42);
      ctx.fillStyle=qaBattleHud.coreExposed?"#fbbf24":"#94a3b8";
      ctx.fillText((qaBattleHud.coreExposed?"CORE EXPOSED ":"CORE LOCKED  ")+
        Math.ceil(qaBattleHud.coreHealth)+"/"+qaBattleHud.coreMaxHealth,
        16,top+56);
      ctx.fillStyle=qaBattleHud.attackPhase==="ACTIVE"?"#fda4af":"#fde68a";
      ctx.fillText(qaBattleHud.attack+" "+qaBattleHud.attackPhase+
        " "+Math.ceil(qaBattleHud.remainingMs)+"ms",16,top+70);
      ctx.fillStyle="#a5f3fc";
      ctx.fillText(qaBattleHud.directorEnabled?
        "F7 MANUAL  F8 LOCKED  F9 EXIT":
        "F7 AUTO  F8 PATTERN  F9 EXIT",16,top+85);
      ctx.fillText("MOVE: WASD / ARROWS / TOUCH",16,top+100);
      ctx.restore();
    }

    // 12. Draw a tactical minimap (radar overlay) in the top-right corner if mode is not OFF
    const minimapMode = statsRef.current?.minimapMode || stats.minimapMode || "COMPACT";
    if (minimapMode !== "OFF") {
      drawTacticalMinimap(ctx, minimapMode);
    }
  };

  // --- TOUCH AND COORDINATE POINTER MAPS ---
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused || !isPlaying) return;
    initAudio();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cam = cameraStateRef.current;
    
    // Convert screen event coordinates to logical canvas pixels
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Scale from actual browser CSS pixels to logical canvas pixels
    const canvasScaleX = cam.viewportWidth / rect.width;
    const canvasScaleY = cam.viewportHeight / rect.height;
    
    const logicalX = clickX * canvasScaleX;
    const logicalY = clickY * canvasScaleY;

    // Convert from logical canvas pixels to real world coordinate pixels using camera transformation
    const worldX = cam.cameraX + logicalX / cam.zoom;
    const worldY = cam.cameraY + logicalY / cam.zoom;

    // C2: explicit developer-only QA single shot, real projectile motion and
    // cardinal hit resolution. The legacy pointer/movement behavior is bypassed.
    if (import.meta.env.DEV && architectQaBossRef.current !== null) {
      const qaBoss = architectQaBossRef.current;
      const qaGuard = architectQaGuardRef.current;
      const qaGeometry = architectQaCardinalsRef.current;
      const origin = playerPosRef.current;
      const dx = worldX - origin.x;
      const dy = worldY - origin.y;
      const distance = Math.hypot(dx, dy);
      if (!qaGuard || !qaGeometry || qaGeometry.boss !== qaBoss ||
          !Number.isFinite(distance) || distance <= 0 ||
          architectQaShotRef.current !== null ||
          projectilesRef.current.length >= MAX_PROJECTILES ||
          architectEngineIdentityOwnerRef.current?.isCurrent(
            qaGuard, qaBoss, bossRef.current, enemiesRef.current,
          ) !== true) return;
      const ordinal = nextBlackoutArchitectCollisionTraceOrdinal(
        collisionTracePlayerShotRef.current,
      );
      if (ordinal === null) return;
      collisionTracePlayerShotRef.current = ordinal;
      const speed = 6;
      const shot: Projectile = {
        id: "architect_qa_" + ordinal,
        x: origin.x,
        y: origin.y,
        vx: (dx / distance) * speed,
        vy: (dy / distance) * speed,
        size: 4,
        damage: 20,
        color: "#67e8f9",
        fromPlayer: true,
        life: 1600,
        maxLife: 1600,
      };
      projectilesRef.current.push(shot);
      architectQaShotRef.current = shot;
      architectQaLastPointerTypeRef.current =
        e.pointerType === "touch" ? "touch" : e.pointerType === "pen" ? "pen" : "mouse";
      return;
    }

    isMouseDownRef.current = true;
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };

    // Initially target this point
    pointerRef.current = { x: worldX, y: worldY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused || !isPlaying) return;

    const rect = canvas.getBoundingClientRect();
    const cam = cameraStateRef.current;

    const scaleX = cam.viewportWidth / rect.width;
    const scaleY = cam.viewportHeight / rect.height;

    const logicalX = (e.clientX - rect.left) * scaleX;
    const logicalY = (e.clientY - rect.top) * scaleY;

    const worldX = cam.cameraX + logicalX / cam.zoom;
    const worldY = cam.cameraY + logicalY / cam.zoom;

    pointerRef.current = { x: worldX, y: worldY };

    if (isMouseDownRef.current) {
      const dx = e.clientX - mouseDownPosRef.current.x;
      const dy = e.clientY - mouseDownPosRef.current.y;
      const distanceSquared = dx * dx + dy * dy;
      
      // If dragged more than 8 pixels, or mouse held down, trigger drag
      if (
        distanceSquared > 8 * 8 ||
        Date.now() - mouseDownPosRef.current.time > 150
      ) {
        lastInputTypeRef.current = "MOUSE_DRAG";
        clickToMoveTargetRef.current = null;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused) return;
    // C13: a genuine QA projectile pointer release must NEVER become a normal
    // click-to-move command. Normal mode input remains unchanged.
    if (import.meta.env.DEV && architectQaBossRef.current !== null) {
      isMouseDownRef.current = false;
      return;
    }
    isMouseDownRef.current = false;
    
    const duration = Date.now() - mouseDownPosRef.current.time;
    const dx = e.clientX - mouseDownPosRef.current.x;
    const dy = e.clientY - mouseDownPosRef.current.y;
    const distanceSquared = dx * dx + dy * dy;

    if (
      duration < 200 &&
      distanceSquared < 10 * 10
    ) {
      // It's a click-to-move tap!
      lastInputTypeRef.current = "CLICK_TO_MOVE";
      
      // Calculate destination coordinates
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const cam = cameraStateRef.current;
        const scaleX = cam.viewportWidth / rect.width;
        const scaleY = cam.viewportHeight / rect.height;
        const logicalX = (e.clientX - rect.left) * scaleX;
        const logicalY = (e.clientY - rect.top) * scaleY;
        const worldX = cam.cameraX + logicalX / cam.zoom;
        const worldY = cam.cameraY + logicalY / cam.zoom;

        clickToMoveTargetRef.current = { x: worldX, y: worldY };
        pointerRef.current = { x: worldX, y: worldY };
      }
    } else {
      // Released a drag: stop immediately!
      if (lastInputTypeRef.current === "MOUSE_DRAG") {
        lastInputTypeRef.current = "NONE";
        pointerRef.current = { x: playerPosRef.current.x, y: playerPosRef.current.y };
      }
    }
  };

  // --- MOBILE / ANDROID HELD-DIRECTION INPUT ---
  const setMobileAnalogVector = (vector: AnalogVector) => {
    if (!isPlaying || isPausedRef.current || isGameOver || isUpgradeSelectionOpenRef.current) {
      analogJoystickRef.current = { x: 0, y: 0 };
      return;
    }
    analogJoystickRef.current = projectAnalogMotion(vector);
  };

  const getFormationMostUsed = (): RunArchiveEntry["mostUsedFormation"] => {
    let best: RunArchiveEntry["mostUsedFormation"] = "none";
    let max = 0;
    for (const [f, count] of Object.entries(formationUseCountsRef.current)) {
      if (count > max) {
        max = count;
        best = f as RunArchiveEntry["mostUsedFormation"];
      }
    }
    return best;
  };

  const getBestOrbiType = () => {
    let bestStage = 1;
    swarmRef.current.forEach(m => {
      if (m.evolutionStage && m.evolutionStage > bestStage) {
        bestStage = m.evolutionStage;
      }
    });
    return `STAGE ${bestStage}`;
  };

  const getBossResult = () => {
    if (
      victory ||
      runCommitLedgerRef.current.campaignVictoryCommitted
    ) {
      return "DEFEATED";
    }
    if (currentWave === 10) return "SURVIVED PHASE 1";
    return "NOT ENCOUNTERED";
  };

  const currentThreatDescriptor =
    getCurrentRuntimeDescriptor();

  // C10 only PROJECTS touch eligibility; the same old guarded callbacks do all actions.
  const qaTouchBoss = architectQaBossRef.current;
  const qaTouchGuard = architectQaGuardRef.current;
  const qaTouchAccess = import.meta.env.DEV
    ? projectBlackoutArchitectDevQaTouchAccess({
        explicitDev: true,
        isPlaying,
        inCampaign: runtimeProgressionRef.current.mode === "CAMPAIGN",
        isWaveBreak,
        isPaused,
        isGameOver,
        isPhotoMode,
        isUpgradeSelectionOpen,
        normalEncounterBusy: waveActiveRef.current || bossActiveRef.current ||
          bossDefeatedSequenceActiveRef.current ||
          (!architectQaVisible &&
            (bossRef.current !== null || enemiesRef.current.length !== 0)),
        qaActive: architectQaVisible,
        guardCurrent: qaTouchBoss !== null && qaTouchGuard !== null &&
          architectEngineIdentityOwnerRef.current?.isCurrent(
            qaTouchGuard, qaTouchBoss, bossRef.current, enemiesRef.current,
          ) === true,
        directorActive: architectQaDirectorRef.current !== null,
      })
    : null;

  return (
    <div
      className="orbi-game-root w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-x-hidden relative select-none"
      data-viewport-class={viewportProfile.className}
      data-viewport-orientation={viewportProfile.orientation}
      data-shell-density={viewportProfile.shellDensity}
      data-auxiliary-decks={viewportProfile.auxiliaryDeckMode}
      data-touch-controls={
        viewportProfile.touchControlsRecommended
          ? "recommended"
          : "fallback"
      }
      data-short-landscape={
        viewportProfile.shortLandscape
          ? "true"
          : "false"
      }
      data-photo-mode={isPhotoMode ? "true" : "false"}
      data-immersive-landscape={isPlaying && immersiveLandscapeMode ? "true" : "false"}
      data-web-immersive={isPlaying && immersiveWebLandscape ? "true" : "false"}
      data-mobile-panel={isPlaying && immersiveLandscapeMode ? mobilePanel : "closed"}
      data-photo-filter={photoFilterId}
    >
      
      {/* INITIAL START SCREEN MENUS */}
      {!isPlaying && (
        <StartScreen
          stats={stats}
          onStartGame={startCampaignGame}
          onStartScoreAttack={() => {
            void startGameWithMode("SCORE_ATTACK");
          }}
          onResetStats={() => {
            const defaults = resetGameStats();
            setStats(defaults);
            setHighScore(0);
            setUpgradesLevel({
              hydrogen_deflector: 0,
              quantum_core: 0,
              fusion_resonator: 0,
              nano_catalyst: 0,
              mitosis_relic: 0
            });
            postDialogue("SYSTEM", "Archivos permanentes purgados y reiniciados.");
          }}
          onChangePreset={(preset) => {
            const next = { ...stats, qualityPreset: preset };
            saveGameStats(next);
            setStats(next);
          }}
          onToggleMute={toggleMute}
          onToggleBossLabelsMode={(mode) => {
            const next = { ...stats, bossLabelsMode: mode };
            saveGameStats(next);
            setStats(next);
          }}
        />
      )}

      {/* PAUSE MENU DRAWERS */}
      {isPlaying && isPaused && !isPhotoMode && (
        <PauseMenu
          onResume={togglePause}
          onRestart={() => {
            void startGameWithMode(presentationMode);
          }}
          onEnterPhotoMode={enterPhotoMode}
          onExitToMenu={() => {
            stopBgm();
            setIsPhotoMode(false);
            setPhotoHintVisible(false);
            setIsPlaying(false);
            setPresentationMode("CAMPAIGN");
            setPausedState(false);
          }}
          audioMuted={audioMuted}
          onToggleMute={toggleMute}
          screenShakeMode={stats.screenShakeMode || "FULL"}
          onSetScreenShakeMode={(mode) => {
            const next = { ...stats, screenShakeMode: mode };
            setStats(next);
            saveGameStats(next);
          }}
          flashIntensity={stats.flashIntensity || "FULL"}
          onSetFlashIntensity={(intensity) => {
            const next = { ...stats, flashIntensity: intensity };
            setStats(next);
            saveGameStats(next);
          }}
          coreLabelsMode={stats.coreLabelsMode || "PROXIMITY"}
          onSetCoreLabelsMode={(mode) => {
            const next = { ...stats, coreLabelsMode: mode };
            setStats(next);
            saveGameStats(next);
          }}
        />
      )}

      {isPhotoMode && photoHintVisible && (
        <PhotoModeOverlay
          activeFilterId={photoFilterId}
          visible={true}
          onPrevious={() => cyclePhotoModeFilter(-1)}
          onNext={() => cyclePhotoModeFilter(1)}
          onReset={resetPhotoModeFilter}
          onExit={exitPhotoMode}
        />
      )}
      {/* WEB UX01B: even after the temporary photo toolbar fades out,
          desktop players must never be trapped in a blank battlefield. */}
      {isPhotoMode && !photoHintVisible && immersiveWebLandscape && (
        <WebPhotoReturn onExit={exitPhotoMode} />
      )}

      {/* GAMEOVER / VICTORY SUMMARY BOARDS */}
      {isGameOver && (
        <ResultScreen
          presentationMode={presentationMode}
          victory={victory}
          score={score}
          highScore={highScore}
          scoreAttackBestScore={stats.scoreAttackBestScore}
          waveReached={currentWave}
          maxSwarmSize={runMaxSwarmSizeRef.current}
          enemiesDestroyed={runEnemiesDestroyedRef.current}
          nanoCreditsGained={runNanoCreditsEarnedRef.current}
          bestInfiniteSector={stats.bestInfiniteSector}
          bestInfiniteWave={stats.bestInfiniteWave}
          infiniteMinibossesDefeated={stats.infiniteMinibossesDefeated}
          infiniteBossRematchesDefeated={stats.infiniteBossRematchesDefeated}
          recentRunArchive={stats.recentRunArchive}
          onRestart={() => {
            void startGameWithMode(presentationMode);
          }}
          onExitToMenu={() => {
            setIsPlaying(false);
            setIsGameOver(false);
            setPresentationMode("CAMPAIGN");
          }}
          activeRunUpgrades={activeRunUpgrades}
          strongestAffinity={getStrongestAffinity()}
          formationMostUsed={getFormationMostUsed()}
          bestOrbiType={getBestOrbiType()}
          bossResult={getBossResult()}
          wasRerollUsed={wasRerollUsed}
          runDuration={runEndTimeRef.current > 0 ? runEndTimeRef.current - runStartTimeRef.current : Date.now() - runStartTimeRef.current}
          followersRemaining={swarmRef.current.length}
          bossDamageDealt={bossDamageDealtRef.current}
          shieldNodesDestroyed={bossShieldNodesDestroyedRef.current}
          damageTaken={bossDamageTakenRef.current}
          phaseReached={bossMaxPhaseReachedRef.current}
          firstVictoryUnlocked={victory && !(stats.bossVictories && stats.bossVictories > 0)}
        />
      )}

      {/* MID-RUN UPGRADE CARD SELECTION SELECTOR POPUP OVERLAY */}
      {isUpgradeSelectionOpen && (
        <UpgradeSelector
          choices={upgradeChoices}
          onSelect={selectUpgrade}
          onReroll={handleReroll}
          rerollsRemaining={rerollsRemaining}
          activeRunUpgrades={activeRunUpgrades}
        />
      )}

      {/* CINEMATIC WAVE INTRODUCTION BANNER OVERLAY */}
      {waveIntroConfig && !isPhotoMode && (
        <div className="orbi-wave-intro fixed inset-0 flex items-center justify-center z-40 pointer-events-none select-none" aria-live="polite">
          <div className="orbi-wave-intro-card bg-slate-950/85 border border-slate-900 rounded-xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)] max-w-lg w-full text-center space-y-4 animate-scaleUp backdrop-blur-md">
            <span 
              className="text-[10px] font-black tracking-[0.25em] block font-mono uppercase"
              style={{ color: waveIntroConfig.introColor }}
            >
              --- SECTOR {currentWave.toString().padStart(2, '0')} INCOMING ---
            </span>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase font-sans">
                {waveIntroConfig.displayName}
              </h2>
              <p className="text-xs text-slate-400 italic">
                "{waveIntroConfig.subtitle}"
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 py-1">
              <div className="flex flex-col items-center">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider font-mono">THREAT LEVEL</span>
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono mt-0.5"
                  style={{ 
                    color: waveIntroConfig.introColor, 
                    backgroundColor: `${waveIntroConfig.introColor}15`,
                    border: `1px solid ${waveIntroConfig.introColor}30`
                  }}
                >
                  {waveIntroConfig.warningLevel}
                </span>
              </div>

              {waveIntroConfig.environmentalModifier && (
                <div className="w-[1px] h-6 bg-slate-900" />
              )}

              {waveIntroConfig.environmentalModifier && (
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-rose-500 font-bold uppercase tracking-wider font-mono">⚠️ ACTIVE MODIFIER</span>
                  <span className="text-[10px] text-rose-300 font-bold uppercase font-mono mt-0.5">
                    {waveIntroConfig.environmentalModifier.replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>

            <div className="orbi-wave-intro-advice bg-slate-900/50 border border-slate-850 p-3 rounded-lg text-left space-y-1 font-mono text-[10px]">
              <span className="text-amber-400 font-black tracking-wider uppercase block">💡 TACTICAL RECOMMENDATION</span>
              <p className="text-slate-300 leading-relaxed">
                {waveIntroConfig.tacticalAdvice}
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-slate-500 text-[9px]">
                <span>RECOMMENDED FORMATION:</span>
                <span className="text-amber-500 font-bold uppercase">{waveIntroConfig.recommendedFormation}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORE ACTIVE HUD IN-GAME BAR */}
      {isPlaying && (
        <div className="orbi-game-shell w-full mx-auto space-y-2.5 animate-fadeIn flex flex-col flex-1 justify-center">
          
          {/* MAIN GAME WORKSPACE GRID (Section 3: layout-workspace) */}
          <div className="orbi-game-workspace w-full items-start">
            
            {/* COLUMN 1: TACTICAL RAIL (Left Column) */}
            <div className={`orbi-tactical-rail ${isLeftPanelCollapsed ? "orbi-side-deck--collapsed overflow-hidden" : "orbi-side-deck--expanded"} flex flex-col gap-3 transition-all duration-300 shrink-0 bg-slate-950/70 border border-slate-900 rounded-xl p-3 shadow-xl backdrop-blur-md text-white`}>
              
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                {!isLeftPanelCollapsed ? (
                  <span className="text-xs font-bold font-mono tracking-wider text-cyan-400">⚡ TACTICAL RAIL</span>
                ) : (
                  <span className="text-[10px] font-bold font-mono text-cyan-500">TAC</span>
                )}
                <button
                  onClick={() => { setIsLeftPanelCollapsed(!isLeftPanelCollapsed); playClickSound(); }}
                  className="p-1 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition font-mono"
                  title={isLeftPanelCollapsed ? "Expand tactical rail" : "Collapse tactical rail"}
                >
                  {isLeftPanelCollapsed ? "»" : "«"}
                </button>
              </div>

              {!isLeftPanelCollapsed && (
                <div className="orbi-side-deck-content space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">AUDIO SYSTEM</span>
                    <button
                      onClick={toggleMute}
                      className={`w-full flex items-center justify-between p-2 rounded border text-xs font-mono font-bold transition ${
                        audioMuted 
                          ? "bg-rose-950/20 border-rose-500/20 text-rose-400 hover:bg-rose-950/30" 
                          : "bg-cyan-950/15 border-cyan-500/10 text-cyan-400 hover:bg-cyan-950/25"
                      }`}
                    >
                      <span>VOLUME STATE:</span>
                      <span className="uppercase">{audioMuted ? "MUTED" : "UNMUTED"}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">TACTICAL RADAR</span>
                    <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-850 text-[10px] font-mono">
                      {(["FULL", "COMPACT", "OFF"] as const).map((m) => {
                        const isSel = stats.minimapMode === m;
                        return (
                          <button
                            key={m}
                            onClick={() => changeMinimapMode(m)}
                            className={`py-1 rounded text-center transition ${
                              isSel 
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold" 
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">VISUAL ENGINE</span>
                    <div className="grid grid-cols-2 gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-850 text-[10px] font-mono">
                      {([QualityPreset.LOW, QualityPreset.MEDIUM, QualityPreset.HIGH, QualityPreset.ULTRA]).map((q) => {
                        const isSel = stats.qualityPreset === q;
                        return (
                          <button
                            key={q}
                            onClick={() => changeQualityPreset(q)}
                            className={`py-1 rounded text-center transition ${
                              isSel 
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold" 
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {q}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">FORMACIONES · CLIC / TECLAS 1–6</span>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { type: FormationType.LINE, label: "Línea de Asalto" },
                        { type: FormationType.CIRCLE, label: "Círculo Colector" },
                        { type: FormationType.DELTA, label: "Delta Convergente" },
                        { type: FormationType.SHIELD, label: "Escudo Protector" },
                        { type: FormationType.V_SHAPE, label: "Vanguardia V" },
                        { type: FormationType.SCATTERED, label: "Dispersión Libre" }
                      ].map((f) => {
                        const isSel = activeFormation === f.type;
                        return (
                          <button
                            type="button"
                            aria-pressed={isSel}
                            key={f.type}
                            onClick={() => triggerFormationChange(f.type)}
                            className={`w-full flex items-center justify-between p-2 rounded border text-[11px] font-mono transition text-left ${
                              isSel
                                ? "bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold"
                                : "bg-slate-900/40 border-slate-850/60 text-slate-400 hover:text-white hover:bg-slate-900/60"
                            }`}
                          >
                            <span>{f.label}</span>
                            <span className="text-[8.5px] uppercase tracking-wider text-slate-500 shrink-0">{isSel ? "ACTIVA" : f.type}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* LIVE RUN BUILD STATUS LIST */}
                  <div className="space-y-1.5 border-t border-slate-900 pt-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">ACTIVE RUN BUILD</span>
                    {Object.keys(activeRunUpgrades).length === 0 ? (
                      <span className="text-[9px] text-slate-600 block italic">No mid-run upgrades active yet.</span>
                    ) : (
                      <div className="grid grid-cols-2 gap-1 font-mono text-[9px]">
                        {Object.entries(activeRunUpgrades).map(([id, stacks]) => {
                          const upg = MID_RUN_UPGRADES.find(u => u.id === id);
                          if (!upg) return null;
                          return (
                            <div key={id} className="bg-slate-900/60 border border-slate-850/50 p-1 rounded flex justify-between items-center">
                              <span className="text-slate-300 truncate max-w-[80px]" title={upg.name}>{upg.name}</span>
                              <span className="text-amber-400 font-bold bg-amber-500/10 px-1 rounded">x{stacks}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* LIVE WAVE INTEL PANEL */}
                  <div className="space-y-1.5 border-t border-slate-900 pt-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      THREAT INTEL (
                      {currentThreatDescriptor.sourceMode === "INFINITE"
                        ? `SECTOR ${currentThreatDescriptor.sector} · WAVE ${currentThreatDescriptor.waveNumber}/${currentThreatDescriptor.waveCount}`
                        : `WAVE ${currentWave}`}
                      )
                    </span>
                    <div className="bg-slate-900/40 border border-slate-850/60 p-2 rounded-lg space-y-1.5 text-[10px] font-mono">
                      <div className="flex justify-between items-center">
                        <span
                          className="text-slate-300 font-bold uppercase truncate max-w-[120px]"
                          title={currentThreatDescriptor.display.displayName}
                        >
                          {currentThreatDescriptor.display.displayName}
                        </span>
                        <span 
                          className="text-[8px] font-bold px-1.5 py-0.1 rounded uppercase shrink-0"
                          style={{ 
                            color: currentThreatDescriptor.display.accentColor, 
                            backgroundColor: `${currentThreatDescriptor.display.accentColor}15`,
                            border: `1px solid ${currentThreatDescriptor.display.accentColor}30`
                          }}
                        >
                          {currentThreatDescriptor.display.warningLevel}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-relaxed italic">
                        "{currentThreatDescriptor.display.subtitle}"
                      </p>
                      
                      {currentThreatDescriptor.modifiers.length > 0 && (
                        <div className="flex flex-col gap-0.5 border-t border-slate-900 pt-1.5">
                          <span className="text-[8px] text-rose-400 font-black tracking-widest uppercase flex items-center gap-1">
                            ⚠️ WAVE MODIFIER:
                          </span>
                          <span className="text-[9.5px] text-rose-300 font-bold uppercase">
                            {currentThreatDescriptor.modifiers
                              .map((modifier) => modifier.replace(/_/g, " "))
                              .join(" · ")}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col gap-0.5 border-t border-slate-900 pt-1.5">
                        <span className="text-[8px] text-amber-400 font-black tracking-widest uppercase block">
                          💡 RECOMMENDATION:
                        </span>
                        <p className="text-[9px] text-slate-400 leading-relaxed">
                          {currentThreatDescriptor.display.tacticalAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN 2: BATTLEFIELD CORE (Center Column) */}
            <div className="orbi-battlefield flex-1 flex flex-col gap-2">
              <GameHud
                presentationMode={presentationMode}
                score={score}
                shield={shield}
                shieldMax={SHIELD_MAX + (upgradesLevel.hydrogen_deflector || 0) * 15 + (activeRunUpgrades.foton_integrity || 0) * 30}
                swarmSize={swarmSize}
                currentWave={currentWave}
                waveName={waveName}
                isWaveBreak={isWaveBreak}
                waveBreakTimeLeft={waveBreakTimeLeft}
                audioMuted={audioMuted}
                isPaused={isPaused}
                nanoCredits={nanoCredits}
                combatChain={combatResonanceView.chain}
                combatResonance={combatResonanceView.resonance}
                combatResonanceTier={combatResonanceView.tier}
                combatScoreMultiplier={combatResonanceView.scoreMultiplier}
                combatOverdriveActive={combatOverdriveView.active}
                combatOverdriveCanActivate={combatOverdriveView.canActivate}
                combatOverdriveActionEnabled={
                  combatOverdriveView.canActivate &&
                  !isPaused &&
                  !isGameOver &&
                  !isPhotoMode &&
                  !isUpgradeSelectionOpen
                }
                combatOverdriveRemainingMs={combatOverdriveView.remainingMs}
                combatOverdriveReentryLocked={combatOverdriveView.reentryLocked}
                combatOverdriveReentryRemainingMs={combatOverdriveView.reentryRemainingMs}
                onActivateOverdrive={handleOverdriveActivation}
                onTogglePause={togglePause}
                onToggleMute={toggleMute}
                immersive={immersiveLandscapeMode}
                webImmersive={immersiveWebLandscape}
                webFullscreen={browserFullscreen}
                webFullscreenAvailable={browserFullscreenAvailable}
                onToggleWebFullscreen={immersiveWebLandscape ? toggleBrowserFullscreen : undefined}
                mobilePanel={mobilePanel}
                onMobilePanelChange={(panel) => {
                  setMobilePanel(panel);
                  if (panel === "tactica") setIsLeftPanelCollapsed(false);
                  if (panel === "equipo") setIsRightPanelCollapsed(false);
                }}
              />

              {/* C10: deliberate touch/keyboard buttons OUTSIDE the Canvas firing surface. */}
              {qaTouchAccess !== null && (
                <div
                  role="group"
                  aria-label="Blackout Architect developer QA touch controls"
                  data-testid="architect-qa-touch-dock"
                  data-qa-pattern={architectQaGridLockRef.current !== null ? "GRID_LOCK" :
                    architectQaVectorTideRef.current !== null ? "VECTOR_TIDE" :
                    architectQaSectorWallRef.current !== null ? "SECTOR_WALL" : "NONE"}
                  data-qa-director={architectQaDirectorRef.current !== null ? "AUTO" : "MANUAL"}
                  className="w-full flex flex-wrap items-center justify-center gap-2 rounded-md border border-cyan-500/30 bg-slate-950/95 px-2 py-1.5 text-[10px] font-mono text-cyan-100"
                >
                  <span className="font-bold text-cyan-300">DEV ARCHITECT QA</span>
                  <button
                    type="button"
                    aria-label={qaTouchAccess.qaToggleLabel + " Blackout Architect QA"}
                    aria-pressed={architectQaVisible}
                    disabled={!qaTouchAccess.qaToggleEnabled}
                    className="min-h-[40px] rounded border border-cyan-500/60 px-3 py-2 font-bold touch-manipulation disabled:opacity-35"
                    onPointerDown={e => e.stopPropagation()}
                    onPointerUp={e => e.stopPropagation()}
                    onClick={e => {
                      e.preventDefault(); e.stopPropagation();
                      toggleArchitectQaDiagnostic();
                    }}
                  >{qaTouchAccess.qaToggleLabel}</button>
                  <button
                    type="button"
                    aria-label={qaTouchAccess.directorToggleLabel + " QA pattern director"}
                    aria-pressed={qaTouchAccess.directorToggleLabel === "DISABLE AUTO"}
                    disabled={!qaTouchAccess.directorToggleEnabled}
                    className="min-h-[40px] rounded border border-cyan-500/60 px-3 py-2 font-bold touch-manipulation disabled:opacity-35"
                    onPointerDown={e => e.stopPropagation()}
                    onPointerUp={e => e.stopPropagation()}
                    onClick={e => {
                      e.preventDefault(); e.stopPropagation();
                      toggleArchitectQaPatternDirector();
                    }}
                  >{qaTouchAccess.directorToggleLabel}</button>
                  <button
                    type="button"
                    aria-label="Select next QA attack pattern"
                    disabled={!qaTouchAccess.patternNextEnabled}
                    className="min-h-[40px] rounded border border-cyan-500/60 px-3 py-2 font-bold touch-manipulation disabled:opacity-35"
                    onPointerDown={e => e.stopPropagation()}
                    onPointerUp={e => e.stopPropagation()}
                    onClick={e => {
                      e.preventDefault(); e.stopPropagation();
                      toggleArchitectQaAttackSelection();
                    }}
                  >{qaTouchAccess.patternNextLabel}</button>
                </div>
              )}

              {/* C12: actual DEV QA messages in normal flow, never covering the physical Canvas. */}
                {import.meta.env.DEV && architectQaLossVisible && !architectQaVisible && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="w-full min-w-0 max-w-full rounded-md border border-rose-500/60 bg-slate-950/90 px-2 py-1.5 text-[10px] leading-snug font-bold tracking-wide break-words text-rose-200"
                  >
                    DEV QA FAILED — ARCHITECT ATTACK HULL 0 HP · NO GLOBAL GAME OVER · Ctrl+Alt+Shift+F9 to retry
                  </div>
                )}

                {import.meta.env.DEV && architectQaDefeatVisible && !architectQaVisible && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="w-full min-w-0 max-w-full rounded-md border border-amber-500/60 bg-slate-950/90 px-2 py-1.5 text-[10px] leading-snug font-bold tracking-wide break-words text-amber-200"
                  >
                    DEV QA COMPLETE — ARCHITECT CORE 0 HP · NO REWARDS · Ctrl+Alt+Shift+F9 restarts QA
                  </div>
                )}

                {import.meta.env.DEV && architectQaVisible && (
                  <div
                    role="status"
                    aria-live="polite"
                    data-testid="architect-qa-status"
                    className="w-full min-w-0 max-w-full rounded-md border border-cyan-500/60 bg-slate-950/90 px-2 py-1.5 text-[10px] leading-snug font-bold tracking-wide break-words text-cyan-200"
                  >
                    DEV QA — ARCHITECT ANCHOR HITS · WAVES/AI FROZEN · CLICK TO FIRE · Ctrl+Alt+Shift+F9 exits
                    <div className="mt-1 text-cyan-100/80">WASD / ARROWS / TOUCH — MOVE FOTON · Single-shot QA targeting</div>
                  </div>
                )}

              {/* CANVAS INTERACTIVE PORT */}
              <div className="w-full flex flex-col items-center justify-center relative bg-slate-950 border border-slate-900 rounded-lg overflow-hidden p-1">
                <EnergySwarmCanvas
                  canvasRef={canvasRef}
                  logicalWidth={panoramicViewport.width}
                  logicalHeight={panoramicViewport.height}
                  isPaused={isPaused && !isPhotoMode}
                  activeBiome={activeBiome}
                  activeFormation={activeFormation}
                  playerPos={playerPosRef.current}
                  playerFlash={playerFlashRef.current}
                  flashIntensity={stats.flashIntensity || "FULL"}
                  cameraOffset={cameraOffsetRef.current}
                  drawNebula={getQualityConfig(stats.qualityPreset).drawNebula}
                  drawPlanets={getQualityConfig(stats.qualityPreset).drawPlanets}
                  maxDpr={getQualityConfig(stats.qualityPreset).maxDPR}
                  qualityPreset={stats.qualityPreset}
                  screenShake={screenShakeRef.current}
                  swarm={swarmRef.current}
                  enemies={enemiesRef.current}
                  projectiles={projectilesRef.current}
                  resources={resourcesRef.current}
                  particles={particlesRef.current}
                  bossActive={bossActiveRef.current}
                  onPointerMove={handlePointerMove}
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  time={timeElapsedRef.current}
                />

                {performanceDiagnosticsEnabled && (
                  <PerformanceDiagnosticsOverlay
                    snapshot={performanceDiagnosticsSnapshot}
                    evidenceStatus={performanceEvidenceStatus}
                    evidenceSamples={performanceEvidenceSamples}
                    evidenceTargetSamples={
                      PERFORMANCE_EVIDENCE_TARGET_SAMPLES
                    }
                  />
                )}

                {/* IMMERSIVE BOSS HUD OVERLAY */}
                {bossActiveRef.current && bossRef.current && !bossRef.current.isDead && (
                  <BossHudOverlay
                    bossPhase={bossPhase}
                    bossHp={bossHp}
                    bossMaxHp={bossMaxHp}
                    bossIntroTime={bossIntroTime}
                    bossTransitionName={bossTransitionName}
                    bossAttackName={bossAttackName}
                    bossShieldNodes={bossShieldNodes}
                    isCoreExposed={isCoreExposed}
                    bossLabelsMode={stats.bossLabelsMode || "FULL"}
                    bossChassis={bossRef.current?.bossChassis ?? "DEVOURER"}
                    infiniteBossIdentity={bossRef.current?.infiniteBossIdentity}
                    onSkipIntro={skipBossIntro}
                  />
                )}

                {/* MOBILE / ANDROID THUMB-ZONE CONTROLS */}
                <MobileTouchOverlay onVectorChange={setMobileAnalogVector} disabled={isPaused || isGameOver || isUpgradeSelectionOpen || isPhotoMode} />
                <MobileFormationCarousel
                  activeFormation={activeFormation}
                  onChangeFormation={triggerFormationChange}
                  disabled={isPaused || isGameOver || isUpgradeSelectionOpen}
                />
                <OrientationHint
                  enabled={
                    viewportProfile.landscapeAdvisoryRecommended
                  }
                />
              </div>
            </div>

            {/* COLUMN 3: LOGISTICS DECK (Right Column) */}
            <div className={`orbi-logistics-deck ${isRightPanelCollapsed ? "orbi-side-deck--collapsed overflow-hidden" : "orbi-side-deck--expanded"} flex flex-col gap-2 transition-all duration-300 shrink-0`}>
              
              <div className="flex justify-between items-center bg-slate-950/70 border border-slate-900 rounded-lg p-2 text-white">
                {!isRightPanelCollapsed ? (
                  <span className="text-xs font-bold font-mono tracking-wider text-cyan-400">📦 LOGISTICS DECK</span>
                ) : (
                  <span className="text-[10px] font-bold font-mono text-cyan-500">LOG</span>
                )}
                <button
                  onClick={() => { setIsRightPanelCollapsed(!isRightPanelCollapsed); playClickSound(); }}
                  className="p-1 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition font-mono"
                  title={isRightPanelCollapsed ? "Expand logistics deck" : "Collapse logistics deck"}
                >
                  {isRightPanelCollapsed ? "«" : "»"}
                </button>
              </div>

              {!isRightPanelCollapsed && (
                <div className="orbi-side-deck-content animate-fadeIn">
                  <CompanionPanel
                    stats={stats}
                    swarm={swarmRef.current}
                    dialogueLog={dialogueLog}
                    upgradesLevel={upgradesLevel}
                    nanoCredits={nanoCredits}
                    onBuyUpgrade={handleBuyUpgrade}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* THREAT INTEL SYSTEM DIAGNOSTIC OVERLAY */}
      {activeThreatIntel && (
        <div
          className="orbi-threat-intel-overlay fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="threat-intel-title"
          aria-describedby="threat-intel-description"
        >
          <div className="orbi-threat-intel-dialog bg-slate-900 border border-cyan-500/40 rounded-xl p-5 max-w-md w-full shadow-2xl relative space-y-4 font-mono text-white text-xs">
            <div className="orbi-threat-intel-heading flex items-center gap-2 border-b border-cyan-950/60 pb-3">
              <span className="w-3 h-3 bg-cyan-500 rounded-full animate-ping" />
              <div className="flex-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">THREAT DETECTED</span>
                <h3 id="threat-intel-title" className="text-base font-extrabold tracking-tight text-white uppercase mt-0.5">
                  {activeThreatIntel === EnemyType.DRONE ? "Drone de Asalto (V-Wing)" :
                   activeThreatIntel === EnemyType.DISRUPTOR ? "Emisor Disruptor EMP" :
                   activeThreatIntel === EnemyType.BLACKOUT_ELITE ? "Acorazado Blackout Elite" :
                   "Boss Devorador Coloidal"}
                </h3>
              </div>
            </div>

            <div className="orbi-threat-intel-details space-y-3.5 leading-relaxed text-[11px]">
              <div className="bg-slate-950/50 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold">DESCRIPCIÓN OPERATIVA</span>
                <p id="threat-intel-description" className="text-slate-300 mt-1">
                  {activeThreatIntel === EnemyType.DRONE ? "Enemigo ágil que dispara ráfagas de proyectiles de plasma dirigidas." :
                   activeThreatIntel === EnemyType.DISRUPTOR ? "Emisor de gran tamaño que emite pulsos radiales EMP anulando seguidos." :
                   activeThreatIntel === EnemyType.BLACKOUT_ELITE ? "Unidad pesada que realiza embestidas frontales de velocidad extrema." :
                   "La entidad suprema corrupta. Posee torbellinos de plasma y capacidad de devorar fotones."}
                </p>
              </div>

              <div className="bg-slate-950/50 p-2.5 rounded border border-rose-950/30">
                <span className="text-rose-400 text-[10px] uppercase font-bold">TELEGRIFO DE ATAQUE (TELEGRAPH)</span>
                <p className="text-rose-300 mt-1">
                  {activeThreatIntel === EnemyType.DRONE ? "Una línea de mira intermitente violeta que apunta hacia Foton antes de disparar." :
                   activeThreatIntel === EnemyType.DISRUPTOR ? "Un anillo cian concéntrico que se expande antes de la detonación EMP." :
                   activeThreatIntel === EnemyType.BLACKOUT_ELITE ? "Línea roja intensa y cono de viento antes de ejecutar la embestida." :
                   "Segmentos de alas oscilantes expandiéndose con destellos rosas intermitentes."}
                </p>
              </div>

              <div className="bg-slate-950/50 p-2.5 rounded border border-cyan-950/30">
                <span className="text-cyan-400 text-[10px] uppercase font-bold">RECOMENDACIÓN TÁCTICA</span>
                <p className="text-cyan-300 mt-1 font-semibold">
                  {activeThreatIntel === EnemyType.DRONE ? "Ataca rápido usando formación Delta o Círculo para sobrepasarlos." :
                   activeThreatIntel === EnemyType.DISRUPTOR ? "Mantén distancia y ataca desde lejos en formación de Línea." :
                   activeThreatIntel === EnemyType.BLACKOUT_ELITE ? "Esquiva en círculos. Ataca su motor trasero expuesto (punto ciego)." :
                   "Utiliza formación Shield para absorber impactos de plasma y golpear su ocular central."}
                </p>
              </div>
            </div>

            <button
              autoFocus
              onClick={() => {
                setActiveThreatIntel(null);
                setPausedState(false);
                playClickSound();
              }}
              className="orbi-threat-intel-continue w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2.5 rounded font-bold transition duration-200 active:scale-[0.98] shadow-lg shadow-cyan-500/20 text-center text-xs tracking-wider uppercase border border-cyan-300/30 cursor-pointer"
            >
              ENTENDIDO - REANUDAR CONEXIÓN
            </button>
          </div>
        </div>
      )}

      {/* BRANDING LABEL WATERMARK FOOTER */}
      <div className="orbi-brand-footer mt-3 lg:mt-1.5 text-[9px] md:text-[10px] font-mono text-slate-600 text-center flex flex-col gap-0.5">
        <div>ORBI ENERGY SWARM &bull; v0.2.0-beta.1</div>
        <div>Created by Víctor Marcel León Pacheco &bull; &copy; 2026 ORBI Ecosystem SpA</div>
      </div>

    </div>
  );
};
export default EnergySwarmGame;
