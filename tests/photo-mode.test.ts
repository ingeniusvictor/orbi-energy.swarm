import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const game = read("src/game/EnergySwarmGame.tsx");
const pause = read("src/components/PauseMenu.tsx");
const css = read("src/styles/index.css");
const lifecycle = read("src/game/lifecyclePolicy.ts");

test("PauseMenu exposes an explicit Photo Mode action", () => {
  assert.match(pause, /onEnterPhotoMode: \(\) => void/);
  assert.match(pause, /id="photo-mode-btn"/);
  assert.match(pause, /onEnterPhotoMode\(\)/);
  assert.match(pause, /MODO FOTO|PHOTO MODE/);
});

test("Photo Mode is independent state layered on top of pause", () => {
  assert.match(game, /const \[isPhotoMode, setIsPhotoMode\] = useState\(false\)/);
  assert.match(game, /const enterPhotoMode = \(\) =>/);
  assert.match(
    game,
    /if \(!isPausedRef\.current\)[\s\S]*setPausedState\(true\)[\s\S]*setIsPhotoMode\(true\)/,
  );
  assert.match(
    game,
    /const exitPhotoMode = \(\) =>[\s\S]*setIsPhotoMode\(false\)[\s\S]*setPausedState\(true\)/,
  );
});

test("F10 enters Photo Mode and F10/Escape returns to pause without resuming", () => {
  assert.match(
    game,
    /if \(isPhotoMode\)[\s\S]*key === "F10"[\s\S]*e\.key === "Escape"[\s\S]*exitPhotoMode\(\)[\s\S]*return/,
  );
  assert.match(
    game,
    /if \(key === "F10"\)[\s\S]*enterPhotoMode\(\)[\s\S]*return/,
  );
});

test("normal pause menu is hidden while clean Photo Mode is active", () => {
  assert.match(
    game,
    /isPlaying && isPaused && !isPhotoMode/,
  );
  assert.match(
    game,
    /onEnterPhotoMode=\{enterPhotoMode\}/,
  );
});

test("Photo Mode hint self-hides and leaves the frame clean", () => {
  assert.match(
    game,
    /const \[photoHintVisible, setPhotoHintVisible\] = useState\(false\)/,
  );
  assert.match(
    game,
    /window\.setTimeout\([\s\S]*setPhotoHintVisible\(false\)[\s\S]*2400/,
  );
  assert.match(
    game,
    /isPhotoMode && photoHintVisible/,
  );
});

test("clean Photo Mode hides DOM chrome but not the battlefield canvas", () => {
  for (const selector of [
    ".orbi-game-hud",
    ".orbi-tactical-rail",
    ".orbi-logistics-deck",
    ".orbi-touch-overlay",
    ".orbi-touch-formation-carousel",
    ".orbi-orientation-hint",
    ".orbi-boss-hud",
    ".orbi-brand-footer",
  ]) {
    assert.ok(
      css.includes(
        '.orbi-game-root[data-photo-mode="true"] ' + selector,
      ),
      'Photo Mode must hide ' + selector,
    );
  }

  assert.match(
    css,
    /grid-template-areas: "battlefield" !important/,
  );
  assert.doesNotMatch(
    css,
    /data-photo-mode="true"[^}]*canvas[^}]*display:\s*none/i,
  );
});

test("root exposes photo mode state to presentation CSS", () => {
  assert.match(
    game,
    /data-photo-mode=\{isPhotoMode \? "true" : "false"\}/,
  );
});

test("new runs and game-over clear stale Photo Mode state", () => {
  const startIndex = game.indexOf("const startGame =");
  const gameOverIndex = game.indexOf("const triggerGameOver =");
  assert.ok(startIndex >= 0);
  assert.ok(gameOverIndex >= 0);

  assert.match(
    game.slice(startIndex, startIndex + 1800),
    /setIsPhotoMode\(false\)/,
  );
  assert.match(
    game.slice(gameOverIndex, gameOverIndex + 700),
    /setIsPhotoMode\(false\)/,
  );
});

test("lifecycle policy never resumes an already paused/photo state on focus changes", () => {
  assert.match(
    lifecycle,
    /if \(context\.isPaused \|\| context\.isModalSuspended\) return false/,
  );
  assert.doesNotMatch(
    lifecycle,
    /WINDOW_FOCUS[^\n]*resume|DOCUMENT_VISIBLE[^\n]*resume/i,
  );
});

test("clean Photo Mode does not change gameplay or persistence data", () => {
  const helperStart = game.indexOf("const enterPhotoMode =");
  const helperEnd = game.indexOf("// --- TOGGLE MUTE ---", helperStart);
  const helper = game.slice(helperStart, helperEnd);

  assert.doesNotMatch(
    helper,
    /saveGameStats|scoreRef|shieldRef|enemiesRef|projectilesRef|runtimeProgressionRef/,
  );
});
