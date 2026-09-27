import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const panel = read(
  "src/components/RecentRunArchivePanel.tsx",
);
const start = read("src/components/StartScreen.tsx");
const result = read(
  "src/components/ResultScreen.tsx",
);
const game = read("src/game/EnergySwarmGame.tsx");

test("Flight Recorder consumes the persisted RunArchiveEntry contract read-only", () => {
  assert.match(
    panel,
    /type \{ RunArchiveEntry \}/,
  );
  assert.match(
    panel,
    /entries: readonly RunArchiveEntry\[\]/,
  );
  assert.doesNotMatch(
    panel,
    /saveGameStats|loadGameStats|resetGameStats|localStorage/,
  );
});

test("Flight Recorder renders only a bounded recent subset", () => {
  assert.match(
    panel,
    /limit = 3/,
  );
  assert.match(
    panel,
    /const safeLimit = Math\.max\(1, Math\.floor\(limit\)\)/,
  );
  assert.match(
    panel,
    /const visibleEntries = entries\.slice\(0, safeLimit\)/,
  );
  assert.match(
    panel,
    /visibleEntries\.map\(\(entry\) =>/,
  );
});

test("Flight Recorder exposes a non-blocking bilingual empty state", () => {
  assert.match(
    panel,
    /data-run-archive-empty="true"/,
  );
  assert.match(
    panel,
    /Completa una partida/,
  );
  assert.match(
    panel,
    /Complete a run/,
  );
});

test("Flight Recorder distinguishes campaign clear from defeat", () => {
  assert.match(
    panel,
    /entry\.outcome === "CAMPAIGN_CLEARED"/,
  );
  assert.match(panel, /CAMPAÑA SUPERADA/);
  assert.match(panel, /CAMPAIGN CLEARED/);
  assert.match(panel, /DERROTA/);
  assert.match(panel, /DEFEAT/);
});

test("Flight Recorder prefers Infinite reach when the archived run reached Infinite", () => {
  assert.match(
    panel,
    /entry\.infiniteSectorReached !== undefined/,
  );
  assert.match(
    panel,
    /entry\.infiniteWaveReached !== undefined/,
  );
  assert.match(
    panel,
    /∞ S\$\{entry\.infiniteSectorReached\} · W\$\{entry\.infiniteWaveReached\}/,
  );
  assert.match(
    panel,
    /entry\.campaignWaveReached/,
  );
});

test("Flight Recorder exposes score duration peak affinity formation and build", () => {
  assert.match(
    panel,
    /formatNumber\(entry\.score\)/,
  );
  assert.match(
    panel,
    /formatDuration\(entry\.durationMs\)/,
  );
  assert.match(
    panel,
    /entry\.maxSwarmSize/,
  );
  assert.match(
    panel,
    /entry\.strongestAffinity/,
  );
  assert.match(
    panel,
    /entry\.mostUsedFormation/,
  );
  assert.match(
    panel,
    /Object\.entries\([\s\S]*entry\.temporaryBuild/,
  );
});

test("temporary build preview is limited to three chips with overflow count", () => {
  assert.match(
    panel,
    /const visibleBuild = build\.slice\(0, 3\)/,
  );
  assert.match(
    panel,
    /const hiddenBuildCount = Math\.max\(/,
  );
  assert.match(
    panel,
    /\+\{hiddenBuildCount\}/,
  );
});

test("archive rows retain stable run identity in the DOM", () => {
  assert.match(
    panel,
    /key=\{entry\.runId\}/,
  );
  assert.match(
    panel,
    /data-run-id=\{entry\.runId\}/,
  );
});

test("StartScreen MAIN surfaces the three newest persisted runs", () => {
  assert.match(
    start,
    /RecentRunArchivePanel/,
  );
  assert.match(
    start,
    /entries=\{stats\.recentRunArchive\}/,
  );
  assert.match(
    start,
    /limit=\{3\}/,
  );

  const mainStart = start.indexOf(
    'activeTab === "MAIN"',
  );
  const panelIndex = start.indexOf(
    "<RecentRunArchivePanel",
  );
  assert.ok(mainStart >= 0);
  assert.ok(panelIndex > mainStart);
});

test("ResultScreen accepts the archive as an optional compatibility prop", () => {
  assert.match(
    result,
    /recentRunArchive\?: RunArchiveEntry\[\]/,
  );
  assert.match(
    result,
    /recentRunArchive = \[\]/,
  );
  assert.match(
    result,
    /<RecentRunArchivePanel[\s\S]*entries=\{recentRunArchive\}[\s\S]*limit=\{3\}[\s\S]*compact/,
  );
});

test("EnergySwarmGame passes the canonical persisted archive into ResultScreen", () => {
  assert.match(
    game,
    /recentRunArchive=\{stats\.recentRunArchive\}/,
  );
});

test("Flight Recorder is presentation-only and does not mutate gameplay or archive data", () => {
  assert.doesNotMatch(
    panel,
    /push\(|splice\(|sort\(|reverse\(|setStats|setIsPlaying|applyFinalRunCommit/,
  );
});
