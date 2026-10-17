from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(
            f"{path}: expected exactly one marker, found {count}\nMARKER:\n{old[:500]}"
        )
    p.write_text(text.replace(old, new, 1))


# StartScreen: frozen Score Attack facts + explicit secondary CTA.
replace_once(
    "src/components/StartScreen.tsx",
    'import { playClickSound } from "../game/audio";\nimport { useGameTranslation, formatNumber } from "../i18n";',
    'import { playClickSound } from "../game/audio";\nimport { getAdditionalGameModeProfile } from "../game/scoreAttackModeContract";\nimport { SCORE_ATTACK_DURATION_MS } from "../game/scoreAttackTimeboxProjection";\nimport { useGameTranslation, formatNumber } from "../i18n";',
)
replace_once(
    "src/components/StartScreen.tsx",
    '  onStartGame: () => void;\n  onResetStats: () => void;',
    '  onStartGame: () => void;\n  onStartScoreAttack: () => void;\n  onResetStats: () => void;',
)
replace_once(
    "src/components/StartScreen.tsx",
    '  onStartGame,\n  onResetStats,',
    '  onStartGame,\n  onStartScoreAttack,\n  onResetStats,',
)
replace_once(
    "src/components/StartScreen.tsx",
    '  const hasInfiniteRecord = stats.bestInfiniteSector >= 11;\n',
    '  const hasInfiniteRecord = stats.bestInfiniteSector >= 11;\n  const scoreAttackProfile = getAdditionalGameModeProfile("SCORE_ATTACK");\n  const scoreAttackDurationSeconds = SCORE_ATTACK_DURATION_MS / 1000;\n',
)
replace_once(
    "src/components/StartScreen.tsx",
    '''              <button
                data-primary-start-cta="true"
                onClick={() => {
                  playClickSound();
                  onStartGame();
                }}
                className="orbi-premium-cta mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 px-4 py-4 text-sm font-black tracking-[0.14em] text-slate-950 shadow-[0_12px_45px_rgba(245,158,11,0.22)] transition duration-300 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-300 active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <Play size={17} fill="currentColor" />
                  {t("startScreen.activateSync")}
                </span>
              </button>

              <div className="mt-2 flex items-center justify-center gap-2 text-[8px] font-mono uppercase tracking-[0.12em] text-slate-600">''',
    '''              <button
                data-primary-start-cta="true"
                onClick={() => {
                  playClickSound();
                  onStartGame();
                }}
                className="orbi-premium-cta mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 px-4 py-4 text-sm font-black tracking-[0.14em] text-slate-950 shadow-[0_12px_45px_rgba(245,158,11,0.22)] transition duration-300 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-300 active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <Play size={17} fill="currentColor" />
                  {t("startScreen.activateSync")}
                </span>
              </button>

              <div
                data-score-attack-panel="true"
                className="mt-3 rounded-xl border border-cyan-400/25 bg-cyan-950/15 p-3"
              >
                <div className="flex items-center justify-between gap-2 font-mono">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
                      {scoreAttackProfile?.displayName ?? "Score Attack"}
                    </div>
                    <div className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-slate-500">
                      {language === "es" ? "MAXIMIZA LA PUNTUACIÓN" : "MAXIMIZE SCORE"}
                    </div>
                  </div>
                  <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 text-[8px] font-black text-cyan-200">
                    {scoreAttackDurationSeconds}S TIMEBOX
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-950/55 px-2.5 py-2 font-mono text-[9px]">
                  <span className="uppercase text-slate-500">
                    {language === "es" ? "MEJOR SCORE ATTACK" : "BEST SCORE ATTACK"}
                  </span>
                  <span className="font-black text-cyan-300">
                    {formatNumber(stats.scoreAttackBestScore)}
                  </span>
                </div>
                <button
                  data-score-attack-start-cta="true"
                  onClick={() => {
                    playClickSound();
                    onStartScoreAttack();
                  }}
                  className="mt-2.5 w-full rounded-lg border border-cyan-400/35 bg-cyan-500/10 px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-200 transition hover:bg-cyan-500/20 active:scale-[0.98]"
                >
                  {language === "es" ? "INICIAR SCORE ATTACK" : "START SCORE ATTACK"}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-center gap-2 text-[8px] font-mono uppercase tracking-[0.12em] text-slate-600">''',
)

# GameHud: presentation identity only; static frozen timebox fact, no new clock.
replace_once(
    "src/components/GameHud.tsx",
    'import type { ResonanceTier } from "../game/combatResonance";\n',
    'import type { ResonanceTier } from "../game/combatResonance";\nimport type { ScoreAttackLiveEngineStartMode } from "../game/scoreAttackLiveEngineLifecycle";\nimport { SCORE_ATTACK_DURATION_MS } from "../game/scoreAttackTimeboxProjection";\n',
)
replace_once(
    "src/components/GameHud.tsx",
    'interface GameHudProps {\n  score: number;',
    'interface GameHudProps {\n  presentationMode: ScoreAttackLiveEngineStartMode;\n  score: number;',
)
replace_once(
    "src/components/GameHud.tsx",
    'export const GameHud: React.FC<GameHudProps> = ({\n  score,',
    'export const GameHud: React.FC<GameHudProps> = ({\n  presentationMode,\n  score,',
)
replace_once(
    "src/components/GameHud.tsx",
    '  const { language, t } = useGameTranslation();\n  const campaignObjective = getCampaignObjective(currentWave, language);\n',
    '  const { language, t } = useGameTranslation();\n  const scoreAttackActive = presentationMode === "SCORE_ATTACK";\n  const scoreAttackDurationSeconds = SCORE_ATTACK_DURATION_MS / 1000;\n  const campaignObjective = scoreAttackActive\n    ? null\n    : getCampaignObjective(currentWave, language);\n  const activeObjective = scoreAttackActive\n    ? (language === "es" ? "MAXIMIZA LA PUNTUACIÓN" : "MAXIMIZE SCORE")\n    : campaignObjective;\n',
)
replace_once(
    "src/components/GameHud.tsx",
    '''      <div className="orbi-hud-wave flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded text-xs font-bold font-mono">
        {isWaveBreak ? (
          <span className="text-cyan-400 animate-pulse uppercase">
            {t("hud.preparation").substring(0, 4)}: {waveBreakTimeLeft}s
          </span>
        ) : (
          <span className="text-amber-500 uppercase">
            W{currentWave} : <span className="text-slate-300 font-medium">{getLocalizedWaveDetails()}</span>
          </span>
        )}
      </div>

      {campaignObjective && (
        <div className="orbi-hud-objective flex items-center gap-2 min-w-0">
          <span className="text-[8px] uppercase tracking-[0.15em] text-cyan-400/80 font-bold shrink-0">
            {language === "es" ? "OBJETIVO" : "OBJECTIVE"}
          </span>
          <span className="text-[9px] text-slate-400 truncate">
            {campaignObjective}
          </span>
        </div>
      )}''',
    '''      <div className="orbi-hud-wave flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded text-xs font-bold font-mono">
        {scoreAttackActive ? (
          <span className="text-cyan-300 uppercase">
            SCORE ATTACK · {scoreAttackDurationSeconds}S TIMEBOX
          </span>
        ) : isWaveBreak ? (
          <span className="text-cyan-400 animate-pulse uppercase">
            {t("hud.preparation").substring(0, 4)}: {waveBreakTimeLeft}s
          </span>
        ) : (
          <span className="text-amber-500 uppercase">
            W{currentWave} : <span className="text-slate-300 font-medium">{getLocalizedWaveDetails()}</span>
          </span>
        )}
      </div>

      {activeObjective && (
        <div className="orbi-hud-objective flex items-center gap-2 min-w-0">
          <span className="text-[8px] uppercase tracking-[0.15em] text-cyan-400/80 font-bold shrink-0">
            {language === "es" ? "OBJETIVO" : "OBJECTIVE"}
          </span>
          <span className="text-[9px] text-slate-400 truncate">
            {activeObjective}
          </span>
        </div>
      )}''',
)

# ResultScreen: dedicated Score Attack result branch before unchanged Campaign/Infinite branch.
replace_once(
    "src/components/ResultScreen.tsx",
    'import type { RunArchiveEntry } from "../game/types";\n',
    'import type { RunArchiveEntry } from "../game/types";\nimport type { ScoreAttackLiveEngineStartMode } from "../game/scoreAttackLiveEngineLifecycle";\nimport { SCORE_ATTACK_DURATION_MS } from "../game/scoreAttackTimeboxProjection";\n',
)
replace_once(
    "src/components/ResultScreen.tsx",
    'interface ResultScreenProps {\n  victory: boolean;\n  score: number;\n  highScore: number;',
    'interface ResultScreenProps {\n  presentationMode: ScoreAttackLiveEngineStartMode;\n  victory: boolean;\n  score: number;\n  highScore: number;\n  scoreAttackBestScore: number;',
)
replace_once(
    "src/components/ResultScreen.tsx",
    'export const ResultScreen: React.FC<ResultScreenProps> = ({\n  victory,\n  score,\n  highScore,',
    'export const ResultScreen: React.FC<ResultScreenProps> = ({\n  presentationMode,\n  victory,\n  score,\n  highScore,\n  scoreAttackBestScore,',
)
replace_once(
    "src/components/ResultScreen.tsx",
    '''    return id;
  };

  return (
''',
    '''    return id;
  };

  const isScoreAttack = presentationMode === "SCORE_ATTACK";
  const scoreAttackDurationSeconds = SCORE_ATTACK_DURATION_MS / 1000;
  const scoreAttackDisplayRecord = Math.max(scoreAttackBestScore, score);

  if (isScoreAttack) {
    return (
      <div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/95 text-white select-none backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="score-attack-result-title"
      >
        <div
          data-score-attack-result="true"
          className="w-full max-w-md bg-slate-900/80 border border-cyan-500/25 rounded-2xl p-6 shadow-2xl relative space-y-4 text-center backdrop-blur-xl my-8"
        >
          <div className="space-y-1.5">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,211,238,0.25)] text-cyan-300">
              <Award size={28} />
            </div>
            <h2 id="score-attack-result-title" className="text-xl md:text-2xl font-sans font-black tracking-tight text-cyan-300 uppercase">
              {language === "es" ? "SCORE ATTACK COMPLETADO" : "SCORE ATTACK COMPLETE"}
            </h2>
            <div className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-wide">
              {victory
                ? `${scoreAttackDurationSeconds}S TIMEBOX COMPLETE`
                : (language === "es" ? "INTENTO INTERRUMPIDO" : "ATTEMPT INTERRUPTED")}
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/60 divide-y divide-slate-900">
            <div className="pb-2 flex justify-between items-center font-mono">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 uppercase">
                <Award size={12} className="text-cyan-300" />
                {language === "es" ? "PUNTUACIÓN DEL INTENTO" : "ATTEMPT SCORE"}
              </span>
              <span className="text-base font-bold text-cyan-300">{formatNumber(score)}</span>
            </div>
            <div className="py-1.5 flex justify-between items-center font-mono text-[10px]">
              <span className="text-slate-500 uppercase">
                {language === "es" ? "RÉCORD SCORE ATTACK" : "SCORE ATTACK RECORD"}
              </span>
              <span className="font-semibold text-amber-300">{formatNumber(scoreAttackDisplayRecord)}</span>
            </div>
            <div className="py-1.5 flex justify-between items-center font-mono text-[10px]">
              <span className="text-slate-400 flex items-center gap-1.5 uppercase">
                <Users size={11} className="text-cyan-400" />
                {t("results.stats.maxPopulation")}
              </span>
              <span className="font-semibold text-cyan-400 uppercase">{maxSwarmSize} ORBIS</span>
            </div>
            <div className="pt-2 flex justify-between items-center font-mono text-[10px]">
              <span className="text-slate-400 flex items-center gap-1.5 uppercase">
                <Crosshair size={11} className="text-rose-400" />
                {language === "es" ? "AMENAZAS PURGADAS" : "THREATS PURGED"}
              </span>
              <span className="font-semibold text-rose-400">{formatNumber(enemiesDestroyed)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/15 bg-cyan-950/10 p-3 text-[10px] font-mono leading-relaxed text-slate-400">
            {language === "es"
              ? "Este resultado usa únicamente el récord dedicado de Score Attack. No altera el récord global, el archivo de runs ni las recompensas de Campaign."
              : "This result uses only the dedicated Score Attack record. It does not alter the global record, run archive, or Campaign rewards."}
          </div>

          <div className="space-y-2 pt-1">
            <button
              autoFocus
              onClick={() => {
                playClickSound();
                onRestart();
              }}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 font-semibold text-xs flex justify-center items-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(34,211,238,0.18)] active:scale-[0.98] uppercase"
            >
              <RotateCcw size={14} />
              {language === "es" ? "REINTENTAR SCORE ATTACK" : "RETRY SCORE ATTACK"}
            </button>
            <button
              onClick={() => {
                playClickSound();
                onExitToMenu();
              }}
              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 font-medium text-[11px] flex justify-center items-center gap-2 cursor-pointer transition text-slate-300 uppercase"
            >
              <Home size={12} />
              {t("results.returnToMenu")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
''',
)

# EnergySwarmGame: one low-frequency presentation identity; engine remains J8O authority.
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '  const [isGameOver, setIsGameOver] = useState(false);\n  const [victory, setVictory] = useState(false);\n\n  const [score, setScore] = useState(0);',
    '  const [isGameOver, setIsGameOver] = useState(false);\n  const [victory, setVictory] = useState(false);\n  const [presentationMode, setPresentationMode] =\n    useState<ScoreAttackLiveEngineStartMode>("CAMPAIGN");\n\n  const [score, setScore] = useState(0);',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '''  const startGameWithMode = (mode: ScoreAttackLiveEngineStartMode) => {
    const activation = resolveScoreAttackLiveEngineActivation(mode);
    if (mode === "SCORE_ATTACK" && !activation) return false;
    scoreAttackActivationRef.current = activation;
    startGame();
    return true;
  };''',
    '''  const startGameWithMode = (mode: ScoreAttackLiveEngineStartMode) => {
    const activation = resolveScoreAttackLiveEngineActivation(mode);
    if (mode === "SCORE_ATTACK" && !activation) return false;
    scoreAttackActivationRef.current = activation;
    setPresentationMode(mode);
    startGame();
    return true;
  };''',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '''  // --- REBOOT GAME ON LOSS ---
  const rebootGame = () => {
    playClickSound();
    startCampaignGame();
  };''',
    '''  // --- REBOOT GAME ON LOSS ---
  const rebootGame = () => {
    playClickSound();
    void startGameWithMode(presentationMode);
  };''',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '  }, [isPlaying, isPaused, isPhotoMode, isGameOver, upgradesLevel]);',
    '  }, [isPlaying, isPaused, isPhotoMode, isGameOver, upgradesLevel, presentationMode]);',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '          onStartGame={startCampaignGame}\n          onResetStats={() => {',
    '          onStartGame={startCampaignGame}\n          onStartScoreAttack={() => {\n            void startGameWithMode("SCORE_ATTACK");\n          }}\n          onResetStats={() => {',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '              <GameHud\n                score={score}',
    '              <GameHud\n                presentationMode={presentationMode}\n                score={score}',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '          onRestart={startCampaignGame}\n          onEnterPhotoMode={enterPhotoMode}',
    '          onRestart={() => {\n            void startGameWithMode(presentationMode);\n          }}\n          onEnterPhotoMode={enterPhotoMode}',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '''          onExitToMenu={() => {
            stopBgm();
            setIsPhotoMode(false);
            setPhotoHintVisible(false);
            setIsPlaying(false);''',
    '''          onExitToMenu={() => {
            stopBgm();
            setIsPhotoMode(false);
            setPhotoHintVisible(false);
            setIsPlaying(false);
            setPresentationMode("CAMPAIGN");''',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '        <ResultScreen\n          victory={victory}\n          score={score}\n          highScore={highScore}',
    '        <ResultScreen\n          presentationMode={presentationMode}\n          victory={victory}\n          score={score}\n          highScore={highScore}\n          scoreAttackBestScore={stats.scoreAttackBestScore}',
)
replace_once(
    "src/game/EnergySwarmGame.tsx",
    '''          onRestart={startCampaignGame}
          onExitToMenu={() => {
            setIsPlaying(false);
            setIsGameOver(false);
          }}''',
    '''          onRestart={() => {
            void startGameWithMode(presentationMode);
          }}
          onExitToMenu={() => {
            setIsPlaying(false);
            setIsGameOver(false);
            setPresentationMode("CAMPAIGN");
          }}''',
)

Path("tests/es-13j8p-public-score-attack-presentation.test.mjs").write_text(
    r'''import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const game = read("src/game/EnergySwarmGame.tsx");
const start = read("src/components/StartScreen.tsx");
const hud = read("src/components/GameHud.tsx");
const result = read("src/components/ResultScreen.tsx");
const runtimeRouter = read("src/game/runtimeProgressionRouter.ts");

test("J8P exposes Score Attack as a secondary public choice while Campaign stays primary", () => {
  assert.match(start, /data-primary-start-cta="true"[\s\S]*onStartGame\(\)/);
  assert.match(start, /data-score-attack-start-cta="true"[\s\S]*onStartScoreAttack\(\)/);
  assert.match(start, /stats\.scoreAttackBestScore/);
  assert.match(start, /SCORE_ATTACK_DURATION_MS/);
});

test("public Score Attack delegates into frozen J8O and presentation identity stays scalar", () => {
  assert.match(game, /useState<ScoreAttackLiveEngineStartMode>\("CAMPAIGN"\)/);
  assert.match(game, /setPresentationMode\(mode\);[\s\S]*startGame\(\);/);
  assert.match(game, /onStartScoreAttack=\{\(\) => \{[\s\S]*startGameWithMode\("SCORE_ATTACK"\)/);
  assert.doesNotMatch(runtimeRouter, /SCORE_ATTACK/);
});

test("Score Attack restarts reuse the same J8O start path and menu exit clears presentation identity", () => {
  const restartMatches = game.match(/startGameWithMode\(presentationMode\)/g) ?? [];
  assert.ok(restartMatches.length >= 3);
  const menuResets = game.match(/setPresentationMode\("CAMPAIGN"\)/g) ?? [];
  assert.ok(menuResets.length >= 2);
});

test("HUD replaces Campaign objective vocabulary with Score Attack attribution without a second timer", () => {
  assert.match(hud, /presentationMode === "SCORE_ATTACK"/);
  assert.match(hud, /SCORE_ATTACK_DURATION_MS/);
  assert.match(hud, /SCORE ATTACK · \{scoreAttackDurationSeconds\}S TIMEBOX/);
  assert.match(hud, /const campaignObjective = scoreAttackActive[\s\S]*\? null[\s\S]*getCampaignObjective/);
  assert.doesNotMatch(hud, /setInterval|setTimeout|Date\.now|performance\.now/);
});

test("Score Attack result surface uses only the dedicated record and omits generic reward/archive semantics", () => {
  const branchStart = result.indexOf("if (isScoreAttack)");
  const genericStart = result.indexOf("\n  return (\n", branchStart + 1);
  assert.ok(branchStart >= 0);
  assert.ok(genericStart > branchStart);
  const scoreAttackBranch = result.slice(branchStart, genericStart);
  assert.match(scoreAttackBranch, /scoreAttackDisplayRecord/);
  assert.match(scoreAttackBranch, /dedicated Score Attack record/);
  assert.doesNotMatch(scoreAttackBranch, /highScore/);
  assert.doesNotMatch(scoreAttackBranch, /nanoCreditsGained/);
  assert.doesNotMatch(scoreAttackBranch, /recentRunArchive/);
  assert.doesNotMatch(scoreAttackBranch, /bestInfiniteSector/);
});
'''
)

Path("tests/gameplay/score-attack-public-presentation.test.ts").write_text(
    r'''import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getAdditionalGameModeProfile } from "../../src/game/scoreAttackModeContract";
import { SCORE_ATTACK_DURATION_MS } from "../../src/game/scoreAttackTimeboxProjection";

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("J8P presents the frozen J8A identity and J8C duration without redefining them", () => {
  const profile = getAdditionalGameModeProfile("SCORE_ATTACK");
  assert.ok(profile);
  assert.equal(profile.displayName, "Score Attack");
  assert.equal(profile.objective, "MAXIMIZE_EXISTING_RUN_SCORE");
  assert.equal(SCORE_ATTACK_DURATION_MS, 60000);
});

test("J8P presentation surfaces do not introduce timer or clock APIs", () => {
  const presentation = [
    read("src/components/StartScreen.tsx"),
    read("src/components/GameHud.tsx"),
    read("src/components/ResultScreen.tsx"),
  ].join("\n");

  assert.doesNotMatch(
    presentation,
    /setInterval|setTimeout|requestAnimationFrame|Date\.now|performance\.now/,
  );
});

test("Score Attack remains outside RuntimeProgressionState and generic persistence authority", () => {
  const runtimeRouter = read("src/game/runtimeProgressionRouter.ts");
  const storage = read("src/game/storage.ts");
  assert.doesNotMatch(runtimeRouter, /SCORE_ATTACK/);
  assert.match(storage, /scoreAttackBestScore/);
  assert.match(storage, /highScore/);
});
'''
)
