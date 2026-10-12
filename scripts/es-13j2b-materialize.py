from pathlib import Path

GAME_PATH = Path("src/game/EnergySwarmGame.tsx")
HUD_PATH = Path("src/components/GameHud.tsx")
TEST_PATH = Path("tests/es-13j2b-live-overdrive-adoption.test.mjs")


def require_once(text: str, marker: str, label: str) -> int:
    count = text.count(marker)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.index(marker)


def insert_after(text: str, marker: str, addition: str, label: str) -> str:
    index = require_once(text, marker, label) + len(marker)
    return text[:index] + addition + text[index:]


def insert_before(text: str, marker: str, addition: str, label: str) -> str:
    index = require_once(text, marker, label)
    return text[:index] + addition + text[index:]


def replace_once(text: str, old: str, new: str, label: str) -> str:
    require_once(text, old, label)
    return text.replace(old, new, 1)


game = GAME_PATH.read_text()
hud = HUD_PATH.read_text()

# Runtime imports.
game = insert_after(
    game,
    '} from "./combatResonance";\n',
    '''import {
  activateCombatOverdrive,
  advanceCombatOverdrive,
  createCombatOverdriveState,
  projectCombatOverdrive,
} from "./combatOverdrive";
''',
    "combatOverdrive import",
)

# Low-frequency React projection only.
game = insert_before(
    game,
    "\n\n  // Stats persisting",
    '''
  const [combatOverdriveView, setCombatOverdriveView] = useState(() =>
    projectCombatOverdrive(createCombatOverdriveState(), 0, false),
  );''',
    "combatOverdrive view state",
)

# High-frequency engine state lives in a ref.
game = insert_after(
    game,
    "  const combatResonanceRef = useRef(createCombatResonanceState());\n",
    "  const combatOverdriveRef = useRef(createCombatOverdriveState());\n",
    "combatOverdrive ref",
)

# Fresh-run reset before transient player state reset.
game = insert_before(
    game,
    "    playerFlashRef.current = 0;\n",
    '''    const resetOverdriveState = createCombatOverdriveState();
    combatOverdriveRef.current = resetOverdriveState;
    setCombatOverdriveView(
      projectCombatOverdrive(resetOverdriveState, 0, false),
    );
''',
    "startGame Overdrive reset",
)

# Explicit activation authority. It rechecks live readiness/state and consumes
# only earned resonance after a successful J2A activation.
game = insert_before(
    game,
    "  // --- KEY LISTENER LISTENERS ---\n",
    '''  const handleOverdriveActivation = () => {
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

''',
    "Overdrive activation handler",
)

# Dedicated keyboard action, after modal input capture.
game = insert_before(
    game,
    "      keysPressedRef.current[key] = true;\n",
    '''      if (key === "O") {
        e.preventDefault();
        handleOverdriveActivation();
        return;
      }

''',
    "O hotkey adoption",
)

game = replace_once(
    game,
    "  }, [isPlaying, isPaused, isPhotoMode, upgradesLevel]);",
    "  }, [isPlaying, isPaused, isPhotoMode, isGameOver, upgradesLevel]);",
    "key listener dependencies",
)

# Advance/project Overdrive only on the existing low-frequency HUD cadence.
live_resonance_marker = '''      const liveResonanceProjection = projectCombatResonance(
        combatResonanceRef.current,
      );
'''
game = insert_after(
    game,
    live_resonance_marker,
    '''      combatOverdriveRef.current = advanceCombatOverdrive(
        combatOverdriveRef.current,
        timeElapsedRef.current,
      );
      const liveOverdriveProjection = projectCombatOverdrive(
        combatOverdriveRef.current,
        timeElapsedRef.current,
        liveResonanceProjection.overdriveReady,
      );
''',
    "HUD cadence Overdrive advance",
)

game = insert_after(
    game,
    '''      setCombatResonanceView({
        chain: combatResonanceRef.current.chain,
        resonance: combatResonanceRef.current.resonance,
        ...liveResonanceProjection,
      });
''',
    "      setCombatOverdriveView(liveOverdriveProjection);\n",
    "HUD cadence Overdrive view",
)

# Project guarded action state into the existing HUD.
game = insert_after(
    game,
    "                combatScoreMultiplier={combatResonanceView.scoreMultiplier}\n",
    '''                combatOverdriveActive={combatOverdriveView.active}
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
''',
    "GameHud Overdrive props",
)

# HUD interface/presentation.
hud = replace_once(
    hud,
    'import { Shield, Award, Users, Volume2, VolumeX, Pause, Play } from "lucide-react";',
    'import { Shield, Award, Users, Volume2, VolumeX, Pause, Play, Zap } from "lucide-react";',
    "GameHud Zap import",
)

hud = insert_after(
    hud,
    "  combatScoreMultiplier: number;\n",
    '''  combatOverdriveActive: boolean;
  combatOverdriveCanActivate: boolean;
  combatOverdriveActionEnabled: boolean;
  combatOverdriveRemainingMs: number;
  combatOverdriveReentryLocked: boolean;
  combatOverdriveReentryRemainingMs: number;
  onActivateOverdrive: () => void;
''',
    "GameHud props interface",
)

hud = insert_after(
    hud,
    "  combatScoreMultiplier,\n",
    '''  combatOverdriveActive,
  combatOverdriveCanActivate,
  combatOverdriveActionEnabled,
  combatOverdriveRemainingMs,
  combatOverdriveReentryLocked,
  combatOverdriveReentryRemainingMs,
  onActivateOverdrive,
''',
    "GameHud props destructure",
)

hud = insert_before(
    hud,
    "  // Localized wave details lookup helper\n",
    '''  const overdriveSeconds = Math.max(
    0,
    Math.ceil(
      (combatOverdriveActive
        ? combatOverdriveRemainingMs
        : combatOverdriveReentryRemainingMs) / 1000,
    ),
  );
  const overdriveStatus = combatOverdriveActive
    ? `ACTIVE ${overdriveSeconds}s`
    : combatOverdriveReentryLocked
      ? `RECHARGING ${overdriveSeconds}s`
      : combatOverdriveCanActivate
        ? "READY"
        : "CHARGE";
  const overdriveAriaLabel = language === "es"
    ? `Sobrecarga ORBI: ${overdriveStatus}. Atajo O.`
    : `ORBI Overdrive: ${overdriveStatus}. Shortcut O.`;

''',
    "GameHud Overdrive status",
)

hud = insert_after(
    hud,
    '''      {/* 5. QUICK CONTROLLER BUTTONS */}
      <div className="orbi-hud-actions flex items-center gap-1">
''',
    '''        <button
          onClick={onActivateOverdrive}
          disabled={!combatOverdriveActionEnabled}
          className={`flex items-center gap-1 rounded border px-1.5 py-1 text-[8px] font-black uppercase transition ${
            combatOverdriveActive
              ? "border-amber-400/60 bg-amber-950/40 text-amber-300"
              : combatOverdriveReentryLocked
                ? "border-slate-800 bg-slate-950/60 text-slate-600"
                : combatOverdriveCanActivate
                  ? "border-amber-400/70 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 cursor-pointer"
                  : "border-slate-850 bg-slate-950/40 text-slate-600"
          } disabled:cursor-not-allowed`}
          title={overdriveAriaLabel}
          aria-label={overdriveAriaLabel}
          aria-disabled={!combatOverdriveActionEnabled}
        >
          <Zap size={10} />
          <span>{overdriveStatus}</span>
        </button>

''',
    "GameHud Overdrive action",
)

TEST_PATH.write_text(r'''import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const gameSource = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const hudSource = fs.readFileSync("src/components/GameHud.tsx", "utf8");

const sliceBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
};

test("J2B adopts the certified J2A state helpers without duplicating timing", () => {
  for (const symbol of [
    "activateCombatOverdrive",
    "advanceCombatOverdrive",
    "createCombatOverdriveState",
    "projectCombatOverdrive",
  ]) {
    assert.match(gameSource, new RegExp(`\\b${symbol}\\b`));
  }
  assert.match(
    gameSource,
    /combatOverdriveRef\s*=\s*useRef\(createCombatOverdriveState\(\)\)/,
  );

  const activation = sliceBetween(
    gameSource,
    "const handleOverdriveActivation =",
    "// --- KEY LISTENER LISTENERS ---",
  );
  const cadence = sliceBetween(
    gameSource,
    "if (hudCadence.shouldFlush) {",
    "if (diagnosticsActive) {",
  );
  const liveAdoption = `${activation}\n${cadence}\n${hudSource}`;
  assert.doesNotMatch(
    liveAdoption,
    /OVERDRIVE_DURATION_MS|OVERDRIVE_REENTRY_LOCK_MS|\b8_?000\b|\b4_?000\b/,
  );
});

test("J2B activation is explicit, guarded, simulation-time based and consumes resonance once", () => {
  const activation = sliceBetween(
    gameSource,
    "const handleOverdriveActivation =",
    "// --- KEY LISTENER LISTENERS ---",
  );
  for (const guard of [
    /!isPlaying/,
    /isGameOver/,
    /isPausedRef\.current/,
    /isPhotoMode/,
    /isUpgradeSelectionOpenRef\.current/,
  ]) {
    assert.match(activation, guard);
  }
  assert.match(activation, /const nowMs = timeElapsedRef\.current/);
  assert.match(activation, /resonanceProjection\.overdriveReady/);
  assert.match(activation, /preActivationProjection\.canActivate/);
  assert.match(activation, /activateCombatOverdrive\(/);
  assert.match(activation, /resolution\.consumeResonance/);
  assert.match(
    activation,
    /\.\.\.combatResonanceRef\.current,\s*resonance:\s*0/s,
  );
  assert.doesNotMatch(
    activation,
    /chain:\s*0|bestChain:\s*0|affinityTrail:\s*\[\]/,
  );
  assert.doesNotMatch(
    activation,
    /startBgm|playEnemy|play.*Sound|projectilesRef|damageMultiplier|fireRate|scoreRef\.current\s*[+*]=/i,
  );
});

test("J2B exposes only explicit O/HUD activation and low-frequency simulation-time projection", () => {
  assert.match(
    gameSource,
    /if \(key === "O"\) \{[\s\S]*?handleOverdriveActivation\(\);[\s\S]*?return;/,
  );
  assert.match(gameSource, /onActivateOverdrive=\{handleOverdriveActivation\}/);

  const cadence = sliceBetween(
    gameSource,
    "if (hudCadence.shouldFlush) {",
    "if (diagnosticsActive) {",
  );
  assert.match(
    cadence,
    /advanceCombatOverdrive\([\s\S]*?timeElapsedRef\.current/,
  );
  assert.match(
    cadence,
    /projectCombatOverdrive\([\s\S]*?timeElapsedRef\.current/,
  );
  assert.match(cadence, /setCombatOverdriveView\(liveOverdriveProjection\)/);
});

test("J2B resets Overdrive with a fresh run", () => {
  const startGame = sliceBetween(
    gameSource,
    "const startGame = () => {",
    "const rebootGame =",
  );
  assert.match(
    startGame,
    /const resetOverdriveState = createCombatOverdriveState\(\)/,
  );
  assert.match(startGame, /combatOverdriveRef\.current = resetOverdriveState/);
  assert.match(startGame, /setCombatOverdriveView\(/);
});

test("J2B HUD exposes READY, ACTIVE and RECHARGING with a disabled guarded action", () => {
  for (const prop of [
    "combatOverdriveActive",
    "combatOverdriveCanActivate",
    "combatOverdriveActionEnabled",
    "combatOverdriveRemainingMs",
    "combatOverdriveReentryLocked",
    "combatOverdriveReentryRemainingMs",
    "onActivateOverdrive",
  ]) {
    assert.match(hudSource, new RegExp(`\\b${prop}\\b`));
  }
  assert.match(hudSource, /ACTIVE/);
  assert.match(hudSource, /RECHARGING/);
  assert.match(hudSource, /READY/);
  assert.match(hudSource, /disabled=\{!combatOverdriveActionEnabled\}/);
  assert.match(hudSource, /aria-label=\{overdriveAriaLabel\}/);
});
''')

GAME_PATH.write_text(game)
HUD_PATH.write_text(hud)
