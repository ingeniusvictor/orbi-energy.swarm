from pathlib import Path

GAME = Path("src/game/EnergySwarmGame.tsx")
BASE = "7ed00b7f28f8c3dd6578932f8e77845e8618d853"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one marker, got {count}")
    return text.replace(old, new, 1)


text = GAME.read_text()

text = replace_once(
    text,
    '''import {
  createRuntimeProjectionBundleCache,
  getCachedRuntimeProjectionBundle,
  type RuntimeProjectionBundleCache,
} from "./runtimeProjectionBundleCache";
import { resolveEvolvedEnemySpawn } from "./runtimeEnemyEvolution";''',
    '''import {
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
import { resolveEvolvedEnemySpawn } from "./runtimeEnemyEvolution";''',
    "J8O import seam",
)

text = replace_once(
    text,
    '''  const runtimeProgressionRef = useRef<RuntimeProgressionState>(
    createCampaignRuntimeState(1),
  );
  const waveActiveRef = useRef(false);''',
    '''  const runtimeProgressionRef = useRef<RuntimeProgressionState>(
    createCampaignRuntimeState(1),
  );
  const scoreAttackActivationRef =
    useRef<ScoreAttackLiveEngineActivation | null>(null);
  const waveActiveRef = useRef(false);''',
    "J8O activation ref",
)

text = replace_once(
    text,
    '''  const getCurrentRuntimeProjection = () =>
    getCachedRuntimeProjectionBundle(
      runtimeProjectionBundleCacheRef.current,
      runtimeProgressionRef.current,
      swarmRef.current.length,
    );''',
    '''  const getCurrentRuntimeProjection = () =>
    resolveScoreAttackLiveRuntimeProjection(
      scoreAttackActivationRef.current,
      runtimeProgressionRef.current,
    ) ??
    getCachedRuntimeProjectionBundle(
      runtimeProjectionBundleCacheRef.current,
      runtimeProgressionRef.current,
      swarmRef.current.length,
    );''',
    "J8O runtime projection seam",
)

start_marker = "  const startGame = () => {"
reboot_marker = "  // --- REBOOT GAME ON LOSS ---"
start_index = text.find(start_marker)
reboot_index = text.find(reboot_marker, start_index)
if start_index < 0 or reboot_index < 0:
    raise SystemExit("J8O startGame segment markers missing")
segment = text[start_index:reboot_index]
segment = replace_once(
    segment,
    '''  const startGame = () => {
    initAudio();''',
    '''  const startGameWithMode = (mode: ScoreAttackLiveEngineStartMode) => {
    const requestedScoreAttackActivation =
      resolveScoreAttackLiveEngineActivation(mode);
    if (mode === "SCORE_ATTACK" && !requestedScoreAttackActivation) {
      return false;
    }

    scoreAttackActivationRef.current = null;
    initAudio();''',
    "J8O internal start mode",
)
segment = replace_once(
    segment,
    '''    currentWaveRef.current = 1;
    runtimeProgressionRef.current = createCampaignRuntimeState(1);
    waveActiveRef.current = false;''',
    '''    if (requestedScoreAttackActivation) {
      scoreAttackActivationRef.current = requestedScoreAttackActivation;
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
    waveActiveRef.current = false;''',
    "J8O start runtime installation",
)
close_index = segment.rfind("  };\n\n")
if close_index < 0:
    raise SystemExit("J8O startGame closing marker missing")
segment = (
    segment[:close_index]
    + '''    return true;
  };

  const startGame = () => {
    void startGameWithMode("CAMPAIGN");
  };

'''
    + segment[close_index + len("  };\n\n"):]
)
text = text[:start_index] + segment + text[reboot_index:]

text = replace_once(
    text,
    '''      const baseWaveComplete = isRuntimeWaveComplete(
        completionDescriptor,
        {
        remainingTimeMs: waveTimeRemainingRef.current,
        spawnedEnemyCount: waveBudgetSpawnedRef.current,
        livingEnemyCount,
          bossDefeated: false,
        },
      );''',
    '''      const completionSnapshot = {
        remainingTimeMs: waveTimeRemainingRef.current,
        spawnedEnemyCount: waveBudgetSpawnedRef.current,
        livingEnemyCount,
        bossDefeated: false,
      };
      const baseWaveComplete = isRuntimeWaveComplete(
        completionDescriptor,
        completionSnapshot,
      );''',
    "J8O completion snapshot seam",
)

text = replace_once(
    text,
    '''      if (waveComplete) {
        // Wave complete! Transition into intermission''',
    '''      if (waveComplete) {
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
            updateStatsAndSave(terminalApplication.stats);
          }
          triggerGameOver(true);
          return;
        }

        // Wave complete! Transition into intermission''',
    "J8O terminal interception",
)

trigger_marker = "  const triggerGameOver = (won: boolean) => {"
handle_marker = "  const handleOverdriveActivation = () => {"
trigger_index = text.find(trigger_marker)
handle_index = text.find(handle_marker, trigger_index)
if trigger_index < 0 or handle_index < 0:
    raise SystemExit("J8O triggerGameOver segment markers missing")
trigger_segment = text[trigger_index:handle_index]
trigger_segment = replace_once(
    trigger_segment,
    '''  const triggerGameOver = (won: boolean) => {
    loopActiveRef.current = false;''',
    '''  const triggerGameOver = (won: boolean) => {
    const scoreAttackAttemptActive =
      scoreAttackActivationRef.current !== null;
    loopActiveRef.current = false;''',
    "J8O generic persistence guard capture",
)
trigger_segment = replace_once(
    trigger_segment,
    '''    if (won) {
      playVictorySound();
      postDialogue("COMPANION", "¡RESONANCIA PURIFICADA! El Devorador de la red ha sido desmantelado.");
    } else {
      playGameOverSound();
      postDialogue("SYSTEM", "ENIGM-CORE CRASHED. Sincronización del enjambre perdida.");
    }
''',
    '''    if (won) {
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
''',
    "J8O generic run persistence bypass",
)
text = text[:trigger_index] + trigger_segment + text[handle_index:]

GAME.write_text(text)
