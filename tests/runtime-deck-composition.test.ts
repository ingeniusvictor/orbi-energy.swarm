import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(
  new URL("../src/styles/index.css", import.meta.url),
  "utf8",
);
const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("game root exposes auxiliary deck mode from the certified runtime profile", () => {
  assert.match(
    game,
    /data-auxiliary-decks=\{viewportProfile\.auxiliaryDeckMode\}/,
  );
});

test("STACKED profile keeps battlefield primary and decks full-width below it", () => {
  assert.match(
    css,
    /data-auxiliary-decks="STACKED"[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)[\s\S]*"battlefield"[\s\S]*"tactical"[\s\S]*"logistics"/,
  );
  assert.match(
    css,
    /data-auxiliary-decks="STACKED"[\s\S]*\.orbi-tactical-rail,[\s\S]*data-auxiliary-decks="STACKED"[\s\S]*\.orbi-logistics-deck[\s\S]*width:\s*100%\s*!important/,
  );
});

test("SPLIT profile reserves a full-width battlefield row with two secondary decks", () => {
  assert.match(
    css,
    /data-auxiliary-decks="SPLIT"[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)\s+minmax\(0, 1fr\)[\s\S]*"battlefield battlefield"[\s\S]*"tactical logistics"/,
  );
});

test("RAILS profile preserves left-battlefield-right desktop composition and collapsed rails", () => {
  assert.match(
    css,
    /data-auxiliary-decks="RAILS"[\s\S]*grid-template-columns:[\s\S]*minmax\(220px, 260px\)[\s\S]*minmax\(0, 1fr\)[\s\S]*minmax\(280px, 330px\)[\s\S]*"tactical battlefield logistics"/,
  );
  assert.match(
    css,
    /data-auxiliary-decks="RAILS"[\s\S]*orbi-side-deck--collapsed[\s\S]*width:\s*2\.75rem\s*!important/,
  );
});

test("short-landscape profile bounds auxiliary content independently of deck mode", () => {
  assert.match(
    css,
    /data-short-landscape="true"[\s\S]*\.orbi-side-deck-content[\s\S]*max-height:\s*min\(24dvh, 12rem\)[\s\S]*overflow-y:\s*auto/,
  );
});

test("media-query fallbacks remain present for no-JS progressive enhancement", () => {
  assert.match(
    css,
    /@media \(min-width:\s*720px\) and \(max-width:\s*1279px\)[\s\S]*"battlefield battlefield"[\s\S]*"tactical logistics"/,
  );
  assert.match(
    css,
    /@media \(min-width:\s*1280px\)[\s\S]*"tactical battlefield logistics"/,
  );
});
