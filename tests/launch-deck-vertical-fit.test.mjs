import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const start = read("src/components/StartScreen.tsx");
const css = read("src/styles/index.css");

test("launch deck no longer relies on a fixed 74vh utility", () => {
  assert.doesNotMatch(
    start,
    /orbi-start-deck[^"]*max-h-\[74vh\]/,
  );
  assert.match(
    css,
    /\.orbi-start-deck\s*\{[\s\S]*max-height:\s*min\(78dvh, calc\(100dvh - 11\.5rem\)\)/,
  );
});

test("short desktop viewport receives a dedicated compact composition", () => {
  assert.match(
    css,
    /@media \(min-width: 1280px\) and \(max-height: 950px\)/,
  );
  assert.match(
    css,
    /\.orbi-start-hero-stage[\s\S]*min-height:\s*300px !important/,
  );
  assert.match(
    css,
    /\.orbi-start-deck[\s\S]*max-height:\s*calc\(100dvh - 8\.65rem\)/,
  );
});

test("very short desktop viewports prioritize deck access over branding height", () => {
  assert.match(
    css,
    /@media \(min-width: 1280px\) and \(max-height: 780px\)/,
  );
  assert.match(
    css,
    /\.orbi-start-header\s*\{[\s\S]*display:\s*none/,
  );
  assert.match(
    css,
    /\.orbi-start-deck[\s\S]*max-height:\s*calc\(100dvh - 4\.25rem\)/,
  );
});

test("launch control keeps its sticky wide-screen role", () => {
  assert.match(
    start,
    /orbi-start-launch[^"]*xl:sticky[^"]*xl:top-14/,
  );
  assert.match(
    start,
    /data-primary-start-cta="true"/,
  );
});

test("campaign section is explicitly marked as the lower scroll target", () => {
  assert.match(
    start,
    /orbi-start-campaign/,
  );
  assert.match(
    css,
    /\.orbi-start-campaign[\s\S]*scroll-margin-bottom:\s*1\.5rem/,
  );
});

test("deck preserves premium internal scroll fallback", () => {
  assert.match(
    start,
    /orbi-start-deck[^"]*overflow-y-auto/,
  );
  assert.match(
    css,
    /overscroll-behavior:\s*contain/,
  );
  assert.match(
    css,
    /scrollbar-width:\s*thin/,
  );
});
