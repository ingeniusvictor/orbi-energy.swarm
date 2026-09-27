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

const assertOrdered = (
  source: string,
  parts: string[],
) => {
  let cursor = -1;
  for (const part of parts) {
    const next = source.indexOf(part, cursor + 1);
    assert.ok(next > cursor, `Missing or out-of-order fragment: ${part}`);
    cursor = next;
  }
};

const snippetFrom = (
  source: string,
  marker: string,
  length = 1200,
) => {
  const start = source.indexOf(marker);
  assert.ok(start >= 0, `Missing marker: ${marker}`);
  return source.slice(start, start + length);
};

test("HUD exposes shield integrity as progress without turning the whole HUD into a live region", () => {
  const shield = snippetFrom(
    hud,
    'className="w-20 bg-slate-900 rounded h-1.5',
  );

  assert.ok(shield.includes('role="progressbar"'));
  assert.ok(
    shield.includes(
      'aria-label={language === "es" ? "Integridad del escudo" : "Shield integrity"}',
    ),
  );
  assert.ok(shield.includes("aria-valuemin={0}"));
  assert.ok(shield.includes("aria-valuemax={100}"));
  assert.ok(shield.includes("aria-valuenow={"));

  const hudRoot = snippetFrom(hud, "orbi-game-hud", 500);
  assert.ok(!hudRoot.includes("aria-live"));
  assert.ok(!hudRoot.includes('role="status"'));
});

test("HUD pause and mute controls expose action labels plus pressed state", () => {
  assertOrdered(hud, [
    "aria-label={isPaused",
    '"Reanudar simulación"',
    '"Resume simulation"',
    '"Pausar simulación"',
    '"Pause simulation"',
    "aria-pressed={isPaused}",
  ]);

  assertOrdered(hud, [
    "aria-label={audioMuted",
    '"Activar audio"',
    '"Unmute audio"',
    '"Silenciar audio"',
    '"Mute audio"',
    "aria-pressed={audioMuted}",
  ]);
});

test("boss HUD uses a named region and a dedicated integrity progressbar", () => {
  assert.ok(boss.includes('role="region"'));
  assert.ok(
    boss.includes('aria-labelledby="orbi-boss-title"'),
  );
  assert.ok(boss.includes('id="orbi-boss-title"'));

  const health = snippetFrom(
    boss,
    'className="orbi-boss-health"',
  );
  assert.ok(health.includes('role="progressbar"'));
  assert.ok(health.includes("aria-valuenow={healthPercent}"));
});

test("boss tactical announcements are isolated from continuously changing HP", () => {
  const liveCount =
    boss.split("aria-live=").length - 1;
  assert.equal(
    liveCount,
    1,
    "boss overlay must keep exactly one intentional live region",
  );

  const live = snippetFrom(
    boss,
    'className="sr-only"',
    1800,
  );
  assert.ok(live.includes('role="status"'));
  assert.ok(live.includes('aria-live="assertive"'));
  assert.ok(live.includes('aria-atomic="true"'));
  assertOrdered(live, [
    "bossTransitionName",
    "bossAttackName",
    "counterHint",
    "isCoreExposed",
  ]);

  const health = snippetFrom(
    boss,
    'className="orbi-boss-health"',
    900,
  );
  assert.ok(!health.includes("aria-live"));
});

test("LUX-8 communication history is a polite append-oriented log", () => {
  const log = snippetFrom(
    companion,
    "ref={logContainerRef}",
    900,
  );
  assert.ok(log.includes('role="log"'));
  assert.ok(log.includes('aria-live="polite"'));
  assert.ok(
    log.includes('aria-relevant="additions text"'),
  );
  assert.ok(
    log.includes("Registro de comunicaciones LUX-8"),
  );
  assert.ok(
    log.includes("LUX-8 communications log"),
  );
});

test("pause overlay is a labelled modal dialog with deterministic focus targets", () => {
  const dialog = snippetFrom(
    pause,
    'id="pause-menu-backdrop"',
    2200,
  );
  assert.ok(dialog.includes('role="dialog"'));
  assert.ok(dialog.includes('aria-modal="true"'));
  assert.ok(
    dialog.includes('aria-labelledby="pause-menu-title"'),
  );
  assert.ok(
    dialog.includes('aria-describedby="pause-menu-state"'),
  );

  for (const id of [
    "resume-btn",
    "confirm-restart-no",
    "back-from-settings",
    "back-from-controls",
  ]) {
    const control = snippetFrom(
      pause,
      `id="${id}"`,
      240,
    );
    assert.ok(
      control.includes("autoFocus"),
      `${id} must receive initial focus when its view opens`,
    );
  }
});

test("intermission selector is a labelled modal dialog with fail-safe focus initialization", () => {
  assert.ok(upgrade.includes('role="dialog"'));
  assert.ok(upgrade.includes('aria-modal="true"'));
  assert.ok(
    upgrade.includes(
      'aria-labelledby="upgrade-selector-title"',
    ),
  );
  assert.ok(
    upgrade.includes(
      'aria-describedby="upgrade-selector-description"',
    ),
  );
  assert.ok(upgrade.includes("tabIndex={-1}"));
  assert.ok(
    upgrade.includes(
      "querySelector<HTMLButtonElement>",
    ),
  );
  assert.ok(
    upgrade.includes('"button:not(:disabled)"'),
  );
  assert.ok(
    upgrade.includes(
      "(firstEnabledControl ?? dialogRef.current)?.focus();",
    ),
  );
});

test("result overlay is a labelled modal dialog and starts keyboard focus on play-again", () => {
  assert.ok(result.includes('role="dialog"'));
  assert.ok(result.includes('aria-modal="true"'));
  assert.ok(
    result.includes(
      'aria-labelledby="run-result-title"',
    ),
  );

  const titleCount =
    result.split('id="run-result-title"').length - 1;
  assert.equal(
    titleCount,
    2,
    "victory and defeat branches share one semantic title id",
  );

  const buttons = result.slice(
    result.indexOf("BUTTON PATHWAYS"),
  );
  assertOrdered(buttons, [
    "<button",
    "autoFocus",
    "onRestart",
  ]);
});

test("Threat Intel is a labelled modal dialog with description and resume focus", () => {
  const threat = game.slice(
    game.indexOf(
      "THREAT INTEL SYSTEM DIAGNOSTIC OVERLAY",
    ),
  );

  assert.ok(
    threat.startsWith(
      "THREAT INTEL SYSTEM DIAGNOSTIC OVERLAY",
    ) || threat.includes("THREAT INTEL SYSTEM DIAGNOSTIC OVERLAY"),
  );
  assert.ok(threat.includes('role="dialog"'));
  assert.ok(threat.includes('aria-modal="true"'));
  assert.ok(
    threat.includes(
      'aria-labelledby="threat-intel-title"',
    ),
  );
  assert.ok(
    threat.includes(
      'aria-describedby="threat-intel-description"',
    ),
  );
  assert.ok(threat.includes('id="threat-intel-title"'));
  assert.ok(
    threat.includes('id="threat-intel-description"'),
  );

  const resume = snippetFrom(
    threat,
    "<button",
    650,
  );
  assert.ok(resume.includes("autoFocus"));
  assert.ok(
    resume.includes("setActiveThreatIntel(null)"),
  );
});

test("semantic accessibility slice does not add gameplay-loop hooks to presentation components", () => {
  for (const source of [
    hud,
    boss,
    companion,
    pause,
    upgrade,
    result,
  ]) {
    assert.ok(!source.includes("requestAnimationFrame"));
    assert.ok(!source.includes("updateEnginePhysics"));
    assert.ok(!source.includes("resolveRuntimeWaveDescriptor"));
  }

  const threatMarker =
    game.indexOf(
      "THREAT INTEL SYSTEM DIAGNOSTIC OVERLAY",
    );
  assert.ok(threatMarker >= 0);
  const threat = game.slice(threatMarker);
  assert.ok(!threat.includes("requestAnimationFrame"));
  assert.ok(!threat.includes("updateEnginePhysics"));
});
