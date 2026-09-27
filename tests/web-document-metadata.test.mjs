import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);

test("web document carries ORBI beta branding", () => {
  assert.match(
    html,
    /<title>ORBI Energy Swarm — Beta<\/title>/,
  );
  assert.doesNotMatch(html, /My Google AI Studio App/);
});

test("web document exposes product description and dark theme hint", () => {
  assert.match(html, /name="description"/);
  assert.match(html, /ORBI Energy Swarm/);
  assert.match(
    html,
    /name="theme-color" content="#020617"/,
  );
});
