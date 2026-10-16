from pathlib import Path
import re

GAME = Path("src/game/EnergySwarmGame.tsx")


def sub_once(text: str, pattern: str, replacement: str, label: str, flags=0) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one semantic match, got {count}")
    return updated


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one marker, got {count}")
    return text.replace(old, new, 1)


def replace_count(text: str, old: str, new: str, expected: int, label: str) -> str:
    count = text.count(old)
    if count != expected:
        raise SystemExit(f"{label}: expected {expected} markers, got {count}")
    return text.replace(old, new)


text = GAME.read_text()

text = sub_once(
    text,
    r'(\} from "\.\/runtimeProjectionBundleCache";\n)',
    r'''\1import {
  resolveScoreAttackLiveEngineActivation,
  resolveScoreAttackLiveRuntimeProjection,
  resolveScoreAttackLiveTerminalApplication,
  type ScoreAttackLiveEngineActivation,
  type ScoreAttackLiveEngineStartMode,
} from "./scoreAttackLiveEngineLifecycle";
''',
    "J8O import seam",
)

text = sub_once(
    text,
    r'(  const runtimeProgressionRef = useRef<RuntimeProgressionState>\(\s*createCampaignRuntimeState\(1\),\s*\);\n)',
    r'''\1  const scoreAttackActivationRef =
    useRef<ScoreAttackLiveEngineActivation | null>(null);
''',
    "J8O activation ref",
    re.S,
)

text = sub_once(
    text,
    r'''  const getCurrentRuntimeProjection = \(\) =>\s*getCachedRuntimeProjectionBundle\(\s*runtimeProjectionBundleCacheRef\.current,\s*runtimeProgressionRef\.current,\s*swarmRef\.current\.length,\s*\);''',
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
    re.S,
)

start_marker = "  const startGame = () => {"
reboot_marker = "  // --- REBOOT GAME ON LOSS ---"
start_index = text.find(start_marker)
reboot_index = text.find(reboot_marker, start_index)
if start_index < 0 or reboot_index < 0:
    raise SystemExit("J8O startGame segment markers missing")
segment = text[start_index:reboot_index]
segment = sub_once(
    segment,
    r'''  const startGame = \(\) => \{\s*initAudio\(\);''',
    '''  const startGame = () => {
    const requestedScoreAttackActivation =
      scoreAttackActivationRef.current;
    initAudio();''',
    "J8O start activation capture",
    re.S,
)
segment = sub_once(
    segment,
    r'''    currentWaveRef\.current = 1;\s*runtimeProgressionRef\.current = createCampaignRuntimeState\(1\);\s*waveActiveRef\.current = false;''',
    '''    if (requestedScoreAttackActivation) {
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
    re.S,
)
close_index = segment.rfind("  };\n\n")
if close_index < 0:
    raise SystemExit("J8O startGame closing marker missing")
segment = (
    segment[:close_index + len("  };\n\n")]
    + '''  const startGameWithMode = (mode: ScoreAttackLiveEngineStartMode) => {
    const activation = resolveScoreAttackLiveEngineActivation(mode);
    if (mode === "SCORE_ATTACK" && !activation) return false;
    scoreAttackActivationRef.current = activation;
    startGame();
    return true;
  };

  const startCampaignGame = () => {
    void startGameWithMode("CAMPAIGN");
  };

'''
    + segment[close_index + len("  };\n\n"):]
)
text = text[:start_index] + segment + text[reboot_index:]

text = replace_once(
    text,
    '''        if (e.key === "Enter") {
          startGame();
        }''',
    '''        if (e.key === "Enter") {
          startCampaignGame();
        }''',
    "J8O keyboard campaign start",
)
text = replace_once(
    text,
    '''  const rebootGame = () => {
    playClickSound();
    startGame();
  };''',
    '''  const rebootGame = () => {
    playClickSound();
    startCampaignGame();
  };''',
    "J8O reboot campaign start",
)
text = replace_once(
    text,
    "onStartGame={startGame}",
    "onStartGame={startCampaignGame}",
    "J8O StartScreen campaign binding",
)
text = replace_count(
    text,
    "onRestart={startGame}",
    "onRestart={startCampaignGame}",
    2,
    "J8O restart campaign bindings",
)

text = sub_once(
    text,
    r'''      const baseWaveComplete = isRuntimeWaveComplete\(\s*completionDescriptor,\s*\{\s*remainingTimeMs: waveTimeRemainingRef\.current,\s*spawnedEnemyCount: waveBudgetSpawnedRef\.current,\s*livingEnemyCount,\s*bossDefeated: false,\s*\},\s*\);''',
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
    re.S,
)

text = sub_once(
    text,
    r'''      if \(waveComplete\) \{\s*// Wave complete! Transition into intermission''',
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
            updateStatsAndSave({ ...terminalApplication.stats });
          }
          triggerGameOver(true);
          return;
        }

        // Wave complete! Transition into intermission''',
    "J8O terminal interception",
    re.S,
)

text = sub_once(
    text,
    r'''  const triggerGameOver = \(won: boolean\) => \{\s*loopActiveRef\.current = false;''',
    '''  const triggerGameOver = (won: boolean) => {
    const scoreAttackAttemptActive =
      scoreAttackActivationRef.current !== null;
    loopActiveRef.current = false;''',
    "J8O game-over activation capture",
    re.S,
)

text = replace_once(
    text,
    '''    // Persist scores
    commitStats(won, scoreRef.current);''',
    '''    if (scoreAttackAttemptActive) {
      scoreAttackActivationRef.current = null;
      return;
    }

    // Persist scores
    commitStats(won, scoreRef.current);''',
    "J8O generic persistence bypass",
)

GAME.write_text(text)
