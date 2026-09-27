import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const vite = read("vite.config.ts");
const pages = read(".github/workflows/pages.yml");
const docs = read("docs/WEB_BETA_DEPLOYMENT.md");

test("Vite keeps root hosting as the default", () => {
  assert.match(
    vite,
    /base:\s*process\.env\.ORBI_PUBLIC_BASE\s*\|\|\s*['"]\/['"]/,
  );
});

test("Pages build uses the repository subpath without changing runtime code", () => {
  assert.match(
    pages,
    /ORBI_PUBLIC_BASE:\s*\/orbi-energy\.swarm\//,
  );
  assert.match(pages, /run:\s*npm run build/);
});

test("beta deployment only follows successful canonical CI or explicit manual dispatch", () => {
  assert.match(
    pages,
    /workflow_run:[\s\S]*workflows:\s*\["ORBI Energy Swarm CI"\][\s\S]*branches:\s*\[main\]/,
  );
  assert.match(
    pages,
    /github\.event\.workflow_run\.conclusion == 'success'/,
  );
  assert.match(
    pages,
    /github\.event_name == 'workflow_dispatch'/,
  );
});

test("deployment checks out the exact CI-tested revision", () => {
  assert.match(
    pages,
    /ref:\s*\$\{\{ github\.event\.workflow_run\.head_sha \|\| github\.sha \}\}/,
  );
});

test("Pages artifact is gated by release verification before build", () => {
  const releaseGate = pages.indexOf("name: Release contract");
  const buildGate = pages.indexOf("name: Build GitHub Pages beta");
  const uploadGate = pages.indexOf("name: Upload Pages artifact");

  assert.ok(releaseGate >= 0);
  assert.ok(buildGate > releaseGate);
  assert.ok(uploadGate > buildGate);
  assert.match(pages, /run:\s*npm run release:verify/);
});

test("Pages workflow uses least-purpose deployment permissions", () => {
  assert.match(pages, /contents:\s*read/);
  assert.match(pages, /pages:\s*write/);
  assert.match(pages, /id-token:\s*write/);
});

test("published artifact is dist only", () => {
  assert.match(
    pages,
    /actions\/upload-pages-artifact@v3[\s\S]*path:\s*dist/,
  );
  assert.match(pages, /actions\/deploy-pages@v4/);
});

test("documentation exposes the expected public beta URL and BETA boundary", () => {
  assert.match(
    docs,
    /https:\/\/ingeniusvictor\.github\.io\/orbi-energy\.swarm\//,
  );
  assert.match(docs, /BETA preview/);
  assert.match(docs, /Source → GitHub Actions/);
});
