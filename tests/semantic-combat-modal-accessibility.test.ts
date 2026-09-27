import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const hud = read("src/components/GameHud.tsx");
const boss = read("src/components/BossHudOverlay.tsx");
const companion = read("src/components/CompanionPanel.tsx");
const pause = read("src/components/PauseMenu.tsx");
const upgrade = read("src/components/UpgradeSelector.tsx");
const result = read("src/components/ResultScreen.tsx");
const game = read("src/game/EnergySwarmGame.tsx");

test("HUD exposes shield integrity as progress without turning the whole HUD into a live region", () => {
  assert.match(hud, /role="progressbar"/);
  assert.match(
    hud,
    /aria-label={language === "es" ? "Integridad del escudo" : "Shield integrity"}/,
  );
  assert.match(hud, /aria-valuemin={0}/);
  assert.match(hud, /aria-valuemax={100}/);
  assert.match(hud, /aria-valuenow={/);
  assert.doesNotMatch(
    hud,
    /orbi-game-hud[^>]*aria-live|orbi-game-hud[^>]*role="status"/,
  );
});

test("HUD pause and mute controls expose action labels plus pressed state", () => {
  assert.match(
    hud,
    /aria-label={isPaused[sS]*"Reanudar simulación"[sS]*"Resume simulation"[sS]*"Pausar simulación"[sS]*"Pause simulation"/,
  );
  assert.match(hud, /aria-pressed={isPaused}/);
  assert.match(
    hud,
    /aria-label={audioMuted[sS]*"Activar audio"[sS]*"Unmute audio"[sS]*"Silenciar audio"[sS]*"Mute audio"/,
  );
  assert.match(hud, /aria-pressed={audioMuted}/);
});

test("boss HUD uses a named region and a dedicated integrity progressbar", () => {
  assert.match(boss, /role="region"/);
  assert.match(boss, /aria-labelledby="orbi-boss-title"/);
  assert.match(boss, /id="orbi-boss-title"/);
  assert.match(
    boss,
    /className="orbi-boss-health"[sS]*role="progressbar"[sS]*aria-valuenow={healthPercent}/,
  );
});

test("boss tactical announcements are isolated from continuously changing HP", () => {
  const liveMatches =
    boss.match(/aria-live=/g) ?? [];
  assert.equal(
    liveMatches.length,
    1,
    "boss overlay must keep exactly one intentional live region",
  );
  assert.match(
    boss,
    /className="sr-only"[sS]*role="status"[sS]*aria-live="assertive"[sS]*aria-atomic="true"/,
  );
  assert.match(
    boss,
    /bossTransitionName[sS]*bossAttackName[sS]*counterHint[sS]*isCoreExposed/,
  );
  assert.doesNotMatch(
    boss,
    /orbi-boss-health[^>]*aria-live/,
  );
});

test("LUX-8 communication history is a polite append-oriented log", () => {
  assert.match(companion, /role="log"/);
  assert.match(companion, /aria-live="polite"/);
  assert.match(
    companion,
    /aria-relevant="additions text"/,
  );
  assert.match(
    companion,
    /Registro de comunicaciones LUX-8/,
  );
  assert.match(companion, /LUX-8 communications log/);
});

test("pause overlay is a labelled modal dialog with deterministic focus targets", () => {
  assert.match(pause, /role="dialog"/);
  assert.match(pause, /aria-modal="true"/);
  assert.match(
    pause,
    /aria-labelledby="pause-menu-title"/,
  );
  assert.match(
    pause,
    /aria-describedby="pause-menu-state"/,
  );
  assert.match(
    pause,
    /id="resume-btn"[sS]*autoFocus/,
  );
  assert.match(
    pause,
    /id="confirm-restart-no"[sS]*autoFocus/,
  );
  assert.match(
    pause,
    /id="back-from-settings"[sS]*autoFocus/,
  );
  assert.match(
    pause,
    /id="back-from-controls"[sS]*autoFocus/,
  );
});

test("intermission selector is a labelled modal dialog with fail-safe focus initialization", () => {
  assert.match(upgrade, /role="dialog"/);
  assert.match(upgrade, /aria-modal="true"/);
  assert.match(
    upgrade,
    /aria-labelledby="upgrade-selector-title"/,
  );
  assert.match(
    upgrade,
    /aria-describedby="upgrade-selector-description"/,
  );
  assert.match(upgrade, /tabIndex={-1}/);
  assert.match(
    upgrade,
    /querySelector<HTMLButtonElement>([sS]*"button:not(:disabled)"/,
  );
  assert.match(
    upgrade,
    /(firstEnabledControl ?? dialogRef.current)?.focus()/,
  );
});

test("result overlay is a labelled modal dialog and starts keyboard focus on play-again", () => {
  assert.match(result, /role="dialog"/);
  assert.match(result, /aria-modal="true"/);
  assert.match(
    result,
    /aria-labelledby="run-result-title"/,
  );
  const titleIds =
    result.match(/id="run-result-title"/g) ?? [];
  assert.equal(
    titleIds.length,
    2,
    "victory and defeat branches share one semantic title id",
  );
  assert.match(
    result,
    /<button[sS]{0,120}autoFocus[sS]{0,260}onRestart/,
  );
});

test("Threat Intel is a labelled modal dialog with description and resume focus", () => {
  const marker =
    game.indexOf(
      "THREAT INTEL SYSTEM DIAGNOSTIC OVERLAY",
    );
  assert.ok(marker >= 0);
  const threat = game.slice(marker);

  assert.match(threat, /role="dialog"/);
  assert.match(threat, /aria-modal="true"/);
  assert.match(
    threat,
    /aria-labelledby="threat-intel-title"/,
  );
  assert.match(
    threat,
    /aria-describedby="threat-intel-description"/,
  );
  assert.match(
    threat,
    /id="threat-intel-title"/,
  );
  assert.match(
    threat,
    /id="threat-intel-description"/,
  );
  assert.match(
    threat,
    /<button[sS]{0,120}autoFocus[sS]{0,500}setActiveThreatIntel(null)/,
  );
});

test("semantic accessibility slice does not alter Canvas or gameplay routing", () => {
  for (const source of [
    hud,
    boss,
    companion,
    pause,
    upgrade,
    result,
  ]) {
    assert.doesNotMatch(
      source,
      /requestAnimationFrame|updateEnginePhysics|resolveRuntimeWaveDescriptor/,
    );
  }

  const threatMarker =
    game.indexOf(
      "THREAT INTEL SYSTEM DIAGNOSTIC OVERLAY",
    );
  const threat = game.slice(threatMarker);
  assert.doesNotMatch(
    threat,
    /EnergySwarmCanvas[sS]*role="dialog"/,
  );
});
