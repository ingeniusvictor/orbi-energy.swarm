import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const readPngSize = async (path) => {
  const bytes = await readFile(path);
  const signature = bytes.subarray(0, 8).toString("hex");
  assert.equal(signature, "89504e470d0a1a0a", `${path} must be a PNG`);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
};

test("I1 manifest is installable and base-path relative", async () => {
  const manifest = await readJson("public/manifest.webmanifest");
  assert.equal(manifest.name, "ORBI Energy Swarm");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.orientation, "landscape");
  assert.equal(manifest.prefer_related_applications, false);

  const sizes = new Set(manifest.icons.map((icon) => icon.sizes));
  assert.ok(sizes.has("192x192"));
  assert.ok(sizes.has("512x512"));
});

test("I1 install icons are exact non-placeholder PNG dimensions", async () => {
  assert.deepEqual(await readPngSize("public/icons/orbi-192.png"), {
    width: 192,
    height: 192,
  });
  assert.deepEqual(await readPngSize("public/icons/orbi-512.png"), {
    width: 512,
    height: 512,
  });
});

test("I1/UX09B index advertises manifest and premium install icons with relative URLs", async () => {
  const index = await readFile("index.html", "utf8");
  assert.match(index, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(index, /href="\.\/ux09\/premium\/launcher-192\.png"/);
});

test("UX09B upgraded icons preserve exact PWA pixel sizes", async () => {
  assert.deepEqual(await readPngSize("public/ux09/premium/launcher-192.png"), {width:192,height:192});
  assert.deepEqual(await readPngSize("public/ux09/premium/launcher-512.png"), {width:512,height:512});
  const manifest = await readJson("public/manifest.webmanifest");
  assert.ok(manifest.icons.some(icon => icon.src === "ux09/premium/launcher-192.png"));
  assert.ok(manifest.icons.some(icon => icon.src === "ux09/premium/launcher-512.png"));
});

test("I1/I2 distribution remains locked while I3 completes readiness engineering", async () => {
  const release = await readJson("release/release.json");
  assert.equal(release.version, "0.2.0-beta.1");
  assert.equal(release.channel, "beta");
  assert.equal(release.releaseCandidateEligible, false);
  assert.equal(release.webDistribution.deploymentTarget, "github-pages");
  assert.equal(release.webDistribution.installability, "pwa");
  assert.equal(release.webDistribution.basePath, "/orbi-energy.swarm/");
  assert.equal(release.androidDistribution.strategy, "capacitor-8");
  assert.equal(
    release.androidDistribution.nativePackaging,
    "capacitor-local-bundle",
  );
  assert.equal(release.androidDistribution.targetSdk, 36);
  assert.equal(
    release.androidDistribution.signing,
    "external-secrets-required-for-release",
  );
  assert.deepEqual(release.pendingReleaseEngineering, []);
  assert.equal(release.rcReadiness.expectedDecision, "BLOCKED");
  assert.ok(release.manualBlockers.some((blocker) => blocker.issue === 4));
  assert.ok(release.manualBlockers.some((blocker) => blocker.issue === 5));
  assert.ok(
    release.manualBlockers.some(
      (blocker) => blocker.category === "android-hardware",
    ),
  );
});

test("Pages retains the canonical base-path and release gate", async () => {
  const pages = await readFile(".github/workflows/pages.yml", "utf8");
  assert.match(pages, /ORBI_PUBLIC_BASE: \/orbi-energy\.swarm\//);
  assert.match(pages, /ORBI_BUILD_SHA:/);
  assert.match(pages, /npm run release:verify/);
});
