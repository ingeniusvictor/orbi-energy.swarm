import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const pwa = readFileSync(new URL("../src/pwa.ts", import.meta.url), "utf8");
const main = readFileSync(new URL("../src/main.tsx", import.meta.url), "utf8");
const worker = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");

test("I1 runtime registers the worker after load and fails open", () => {
  assert.match(main, /registerOrbiServiceWorker/);
  assert.match(main, /window\.addEventListener\([\s\S]*['"]load['"]/);
  assert.match(pwa, /import\.meta\.env\.BASE_URL/);
  assert.match(pwa, /__ORBI_BUILD_SHA__/);
  assert.match(pwa, /navigator\.serviceWorker\.register/);
  assert.match(pwa, /updateViaCache:\s*["']none["']/);
  assert.match(pwa, /catch \(error\)[\s\S]*return null/);
});

test("I1 service-worker cache is build-versioned and self-cleans", () => {
  assert.match(worker, /searchParams\.get\(["']build["']\)/);
  assert.match(worker, /ORBI_CACHE_PREFIX/);
  assert.match(worker, /key\.startsWith\(ORBI_CACHE_PREFIX\)/);
  assert.match(worker, /key !== cacheName/);
  assert.match(worker, /caches\.delete\(key\)/);
});

test("I1 navigation is network-first with bounded static fallback", () => {
  const navigation = worker.indexOf('request.mode === "navigate"');
  const fetchIndex = worker.indexOf("await fetch(request)", navigation);
  const fallbackIndex = worker.indexOf("await caches.match(rootUrl)", navigation);
  assert.ok(navigation >= 0);
  assert.ok(fetchIndex > navigation);
  assert.ok(fallbackIndex > fetchIndex);
  assert.match(worker, /url\.origin !== self\.location\.origin/);
  assert.match(worker, /request\.method !== ["']GET["']/);
  assert.doesNotMatch(worker, /setInterval|requestAnimationFrame/);
});

test("I1 does not introduce gameplay or entity authority into PWA delivery", () => {
  assert.doesNotMatch(pwa, /MAX_ENEMIES|MAX_PROJECTILES|swarmRef|enemiesRef|projectilesRef/);
  assert.doesNotMatch(worker, /MAX_ENEMIES|MAX_PROJECTILES|swarmRef|enemiesRef|projectilesRef/);
});
