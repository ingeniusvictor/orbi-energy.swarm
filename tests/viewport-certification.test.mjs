import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("viewport certification covers required representative classes", () => {
  const matrix = read("docs/VIEWPORT_CERTIFICATION.md");

  for (const viewport of [
    "1920×1080",
    "1440×900",
    "1366×768",
    "2560×1080",
    "tablet landscape",
    "tablet portrait",
    "Android landscape",
    "Android portrait",
    "compact Android landscape",
  ]) {
    assert.match(matrix, new RegExp(viewport.replace(/[×]/g, "×"), "i"));
  }
});

test("laptop class receives deliberate compact desktop treatment", () => {
  const css = read("src/styles/index.css");
  assert.match(css, /min-width:\s*1280px[\s\S]*max-width:\s*1599px/);
  assert.match(css, /minmax\(205px, 225px\)/);
  assert.match(css, /max-height:\s*calc\(100dvh - 6\.75rem\)/);
});

test("standard large desktop class is explicit", () => {
  const css = read("src/styles/index.css");
  assert.match(css, /min-width:\s*1600px[\s\S]*max-aspect-ratio:\s*2\/1/);
  assert.match(css, /--orbi-shell-max:\s*1880px/);
});

test("ultrawide class expands shell without unbounded battlefield growth", () => {
  const css = read("src/styles/index.css");
  assert.match(css, /min-width:\s*2000px[\s\S]*min-aspect-ratio:\s*2\/1/);
  assert.match(css, /--orbi-shell-max:\s*2200px/);
  assert.match(css, /max-width:\s*1460px/);
  assert.match(css, /justify-self:\s*center/);
});

test("short laptops prioritize battlefield height over auxiliary deck expansion", () => {
  const css = read("src/styles/index.css");
  assert.match(css, /min-width:\s*1280px[\s\S]*max-height:\s*820px/);
  assert.match(css, /max-height:\s*calc\(100dvh - 6\.25rem\)/);
  assert.match(css, /overflow-y:\s*auto/);
});
