import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) =>
  readFileSync(
    new URL(`../${path}`, import.meta.url),
    "utf8",
  );

const css = read("src/styles/index.css");
const start = read("src/components/StartScreen.tsx");
const result = read("src/components/ResultScreen.tsx");
const game = read("src/game/EnergySwarmGame.tsx");

const es10aStart = css.indexOf(
  "/* ES-10A — Reduced-motion presentation completion.",
);
assert.ok(es10aStart >= 0);
const es10a = css.slice(es10aStart);

test("existing premium and boss reduced-motion foundations remain present", () => {
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.orbi-premium-aurora,[\s\S]*\.orbi-premium-starfield,[\s\S]*\.orbi-premium-orbit,[\s\S]*\.orbi-premium-cta::after[\s\S]*animation: none !important/,
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.orbi-boss-kicker,[\s\S]*\.orbi-boss-alert-pulse,[\s\S]*\.orbi-boss-alert--critical[\s\S]*animation: none !important/,
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion: no-preference\)[\s\S]*\.orbi-orientation-device[\s\S]*animation: orbi-orientation-nudge/,
  );
});

test("shell utility animations become static under reduced motion", () => {
  assert.match(
    es10a,
    /@media \(prefers-reduced-motion: reduce\)/,
  );
  assert.match(
    es10a,
    /\.orbi-premium-entry \[class\*="animate-"\]/,
  );
  assert.match(
    es10a,
    /\.orbi-game-root \[class\*="animate-"\]/,
  );
  assert.match(
    es10a,
    /animation: none !important/,
  );
});

test("the covered UI actually uses Tailwind animation utilities", () => {
  const combined = [start, result, game].join("\n");
  for (const animationClass of [
    "animate-fadeIn",
    "animate-pulse",
    "animate-bounce",
    "animate-ping",
  ]) {
    assert.match(
      combined,
      new RegExp(animationClass),
    );
  }
});

test("utility and custom UI transitions become effectively immediate", () => {
  assert.match(
    es10a,
    /\.orbi-premium-entry \.transition/,
  );
  assert.match(
    es10a,
    /\.orbi-premium-entry \[class\*="transition-"\]/,
  );
  assert.match(
    es10a,
    /\.orbi-game-root \.transition/,
  );
  assert.match(
    es10a,
    /\.orbi-game-root \[class\*="transition-"\]/,
  );
  assert.match(es10a, /\.orbi-touch-button/);
  assert.match(
    es10a,
    /\.orbi-touch-formation-button/,
  );
  assert.match(
    es10a,
    /\.orbi-boss-health-fill/,
  );
  assert.match(
    es10a,
    /transition-duration: 0\.01ms !important/,
  );
  assert.match(
    es10a,
    /transition-delay: 0ms !important/,
  );
});

test("reduced-motion contract keeps state visibility rather than hiding controls", () => {
  assert.doesNotMatch(
    es10a,
    /display:\s*none|visibility:\s*hidden|opacity:\s*0\s*!important/,
  );
});

test("ES-10A does not target Canvas or alter game-world simulation", () => {
  assert.doesNotMatch(
    es10a,
    /canvas|EnergySwarmCanvas|requestAnimationFrame|updateEnginePhysics/,
  );
});

test("reduced motion also disables smooth scrolling for focus navigation", () => {
  assert.match(
    es10a,
    /html:focus-within[\s\S]*scroll-behavior: auto/,
  );
});
