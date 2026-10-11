from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path: str, old: str, new: str) -> None:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected exactly one marker, found {count}: {old[:100]!r}")
    target.write_text(text.replace(old, new, 1), encoding="utf-8")


def append_once(path: str, marker: str, addition: str) -> None:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    if marker in text:
        raise RuntimeError(f"{path}: marker already present: {marker}")
    target.write_text(text.rstrip() + "\n\n" + addition.strip() + "\n", encoding="utf-8")


game = "src/game/EnergySwarmGame.tsx"

replace_once(
    game,
    'import { BossHudOverlay } from "../components/BossHudOverlay";\n',
    'import { BossHudOverlay } from "../components/BossHudOverlay";\nimport { PhotoModeOverlay } from "../components/PhotoModeOverlay";\n',
)

replace_once(
    game,
    'import { projectBossPursuit } from "./bossPursuit";\n',
    'import { projectBossPursuit } from "./bossPursuit";\nimport {\n  DEFAULT_PHOTO_FILTER_ID,\n  cyclePhotoFilter,\n  type PhotoFilterId,\n} from "./photoMode";\n',
)

replace_once(
    game,
    '  const [isPhotoMode, setIsPhotoMode] = useState(false);\n  const [photoHintVisible, setPhotoHintVisible] = useState(false);\n',
    '  const [isPhotoMode, setIsPhotoMode] = useState(false);\n  const [photoHintVisible, setPhotoHintVisible] = useState(false);\n  const [photoFilterId, setPhotoFilterId] = useState<PhotoFilterId>(\n    DEFAULT_PHOTO_FILTER_ID,\n  );\n',
)

old_photo_key_block = '''      if (isPhotoMode) {
        if (key === "F10" || e.key === "Escape") {
          e.preventDefault();
          exitPhotoMode();
        }
        return;
      }
'''
new_photo_key_block = '''      if (isPhotoMode) {
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
'''
replace_once(game, old_photo_key_block, new_photo_key_block)

old_photo_helpers = '''  const enterPhotoMode = () => {
    if (!isPlaying || isGameOver || isUpgradeSelectionOpenRef.current) return;

    if (!isPausedRef.current) {
      playPauseSound();
      setPausedState(true);
      stopBgm();
    }

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
    if (!isPhotoMode) {
      setPhotoHintVisible(false);
      return;
    }

    setPhotoHintVisible(true);
    const timeout = window.setTimeout(() => {
      setPhotoHintVisible(false);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [isPhotoMode]);
'''
new_photo_helpers = '''  const cyclePhotoModeFilter = (direction: -1 | 1) => {
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
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [isPhotoMode, photoHintVisible]);

  useEffect(() => {
    if (!isPhotoMode) return;

    const revealPhotoControls = () => setPhotoHintVisible(true);
    window.addEventListener("pointerdown", revealPhotoControls, { passive: true });
    return () => window.removeEventListener("pointerdown", revealPhotoControls);
  }, [isPhotoMode]);
'''
replace_once(game, old_photo_helpers, new_photo_helpers)

replace_once(
    game,
    '      data-photo-mode={isPhotoMode ? "true" : "false"}\n',
    '      data-photo-mode={isPhotoMode ? "true" : "false"}\n      data-photo-filter={photoFilterId}\n',
)

replace_once(
    game,
    '                  isPaused={isPaused}\n',
    '                  isPaused={isPaused && !isPhotoMode}\n',
)

path = ROOT / game
text = path.read_text(encoding="utf-8")
pattern = re.compile(
    r'''      \{isPhotoMode && photoHintVisible && \(\n        <div\n          className="orbi-photo-mode-hint[\s\S]*?        </div>\n      \)\}'''
)
replacement = '''      {isPhotoMode && (
        <PhotoModeOverlay
          activeFilterId={photoFilterId}
          visible={photoHintVisible}
          onPrevious={() => cyclePhotoModeFilter(-1)}
          onNext={() => cyclePhotoModeFilter(1)}
          onReset={resetPhotoModeFilter}
          onExit={exitPhotoMode}
        />
      )}'''
text, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise RuntimeError(f"{game}: expected one legacy photo hint block, found {count}")
path.write_text(text, encoding="utf-8")

css_addition = r'''
/* ES-12H11 — Cinematic Photo Mode filters.
   Presentation-only: the existing game stage is filtered while simulation stays paused. */
.orbi-game-root[data-photo-mode="true"] .orbi-game-stage {
  transition: filter 160ms ease;
}

.orbi-game-root[data-photo-mode="true"][data-photo-filter="ORIGINAL"] .orbi-game-stage {
  filter: none;
}

.orbi-game-root[data-photo-mode="true"][data-photo-filter="NEON_NOIR"] .orbi-game-stage {
  filter: brightness(0.86) contrast(1.2) saturate(1.28) hue-rotate(-8deg);
}

.orbi-game-root[data-photo-mode="true"][data-photo-filter="SOLAR_FILM"] .orbi-game-stage {
  filter: brightness(1.03) contrast(1.08) saturate(1.2) sepia(0.2) hue-rotate(-7deg);
}

.orbi-game-root[data-photo-mode="true"][data-photo-filter="CYANOTYPE"] .orbi-game-stage {
  filter: brightness(0.94) contrast(1.12) saturate(1.34) sepia(0.12) hue-rotate(132deg);
}

.orbi-game-root[data-photo-mode="true"][data-photo-filter="MONOCHROME"] .orbi-game-stage {
  filter: grayscale(1) brightness(0.96) contrast(1.18);
}

@media (prefers-reduced-motion: reduce) {
  .orbi-game-root[data-photo-mode="true"] .orbi-game-stage,
  .orbi-photo-mode-controls {
    transition: none !important;
  }
}
'''
append_once(
    "src/styles/index.css",
    "ES-12H11 — Cinematic Photo Mode filters",
    css_addition,
)

test_addition = r'''
const photoModeModule = read("src/game/photoMode.ts");
const photoModeOverlay = read("src/components/PhotoModeOverlay.tsx");

test("H11 exposes deterministic cinematic filter state only to presentation", () => {
  assert.match(game, /const \[photoFilterId, setPhotoFilterId\] = useState<PhotoFilterId>/);
  assert.match(game, /data-photo-filter=\{photoFilterId\}/);
  assert.match(game, /cyclePhotoFilter\(current, direction\)/);
  assert.match(game, /setPhotoFilterId\(DEFAULT_PHOTO_FILTER_ID\)/);
  assert.doesNotMatch(
    photoModeModule,
    /enemiesRef|projectilesRef|swarmRef|scoreRef|shieldRef|runtimeProgressionRef|saveGameStats/,
  );
});

test("H11 keyboard controls cycle or reset filters without resuming gameplay", () => {
  assert.match(
    game,
    /if \(isPhotoMode\)[\s\S]*ARROWLEFT[\s\S]*cyclePhotoModeFilter\(-1\)[\s\S]*ARROWRIGHT[\s\S]*cyclePhotoModeFilter\(1\)[\s\S]*key === "0"[\s\S]*resetPhotoModeFilter\(\)/,
  );
  assert.match(
    game,
    /const exitPhotoMode = \(\) =>[\s\S]*setPausedState\(true\)/,
  );
});

test("H11 removes only the paused presentation veil while Photo Mode remains paused", () => {
  assert.match(game, /isPaused=\{isPaused && !isPhotoMode\}/);
  assert.match(
    game,
    /const enterPhotoMode = \(\) =>[\s\S]*setPausedState\(true\)[\s\S]*setIsPhotoMode\(true\)/,
  );
});

test("H11 filter CSS targets only the existing game stage", () => {
  for (const id of ["ORIGINAL", "NEON_NOIR", "SOLAR_FILM", "CYANOTYPE", "MONOCHROME"]) {
    assert.ok(
      css.includes(`data-photo-filter=\\"${id}\\"] .orbi-game-stage`),
      `missing Photo Mode stage selector for ${id}`,
    );
  }
  assert.doesNotMatch(css, /data-photo-filter=.*(?:enemy|projectile|swarm)/i);
});

test("H11 photo controls are touch and keyboard accessible and can self-hide", () => {
  assert.match(photoModeOverlay, /role="toolbar"/);
  assert.match(photoModeOverlay, /photo-filter-prev/);
  assert.match(photoModeOverlay, /photo-filter-next/);
  assert.match(photoModeOverlay, /photo-filter-reset/);
  assert.match(photoModeOverlay, /photo-mode-exit/);
  assert.match(game, /window\.addEventListener\("pointerdown", revealPhotoControls/);
  assert.match(game, /window\.setTimeout\([\s\S]*setPhotoHintVisible\(false\)[\s\S]*3200/);
});
'''
append_once(
    "tests/photo-mode.test.ts",
    "H11 exposes deterministic cinematic filter state only to presentation",
    test_addition,
)

print("ES-12H11 patch applied successfully")
