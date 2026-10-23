import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const src=readFileSync(new URL("../scripts/architect-c11-browser-evidence.mjs",import.meta.url),"utf8");
const workflow=readFileSync(new URL("../.github/workflows/es13-architect-c11-precert.yml",import.meta.url),"utf8");

test("C11 browser proof must drive real Vite app in actual Chromium",()=>{
  assert.match(src,/import \{ chromium \} from "playwright"/);
  assert.match(src,/await chromium\.launch\(/);
  assert.match(src,/await page\.goto\(rootDev/);
  assert.match(src,/await page\.locator\('\[data-primary-start-cta="true"\]'\)\.click\(\)/);
  assert.match(src,/await enter\(page\)\.click\(\)/);
  assert.match(src,/await auto\(page\)\.click\(\)/);
  assert.match(src,/await next\(page\)\.click\(\)/);
  assert.match(src,/await manual\(page\)\.click\(\)/);
  assert.match(src,/page\.screenshot\(/);
  assert.match(src,/await runProduction\(browser\)/);
});
test("C11 controlled browser clock never injects owner, boss or session state",()=>{
  assert.match(src,/await page\.clock\.pauseAt/);
  assert.match(src,/await page\.clock\.runFor\(80\)/);
  assert.doesNotMatch(src,/window\.__ORBI|window\.architect|__reactFiber|React\.DevTools|\.evaluate\(.*bossRef/);
  assert.doesNotMatch(src,/localStorage\.setItem|Math\.random\s*=|mockGuard|installBoss|admitInstalledBoss/);
});
test("C11 CI requires physical screenshot evidence, full green checks and keeps workflow temporary",()=>{
  assert.match(workflow,/name: ES-13 Architect C11 temporary full pre-cert/);
  assert.match(workflow,/playwright@1\.56\.1/);
  assert.match(workflow,/playwright install --with-deps chromium/);
  assert.match(workflow,/npm test/);
  assert.match(workflow,/npm run typecheck/);
  assert.match(workflow,/npm run release:verify/);
  assert.match(workflow,/npm run android:debug/);
  assert.match(workflow,/node scripts\/architect-c11-browser-evidence\.mjs/);
  assert.match(workflow,/if: always\(\)/);
});
