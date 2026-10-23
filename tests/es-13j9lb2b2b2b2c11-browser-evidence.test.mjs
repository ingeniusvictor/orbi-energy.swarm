import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const src=readFileSync(new URL("../scripts/architect-c11-browser-evidence.mjs",import.meta.url),"utf8");

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
test("C11 permanent evidence harness keeps actual browser assertions after temporary workflow removal",()=>{
  assert.match(src,/await after\(page,/);
  assert.match(src,/screenshots:\[before,running,directed,manualTide,exited\]/);
  assert.match(src,/const bytes=\(await stat\(file\)\)\.size/);
  assert.match(src,/assert\(bytes>10000/);
  assert.match(src,/const clicks=await page\.evaluate/);
  assert.match(src,/assert\(clicks===0/);
  assert.match(src,/await runDevCase\(browser,\{name:"desktop"/);
  assert.match(src,/await runDevCase\(browser,\{name:"mobile-touch"/);
  assert.match(src,/await runProduction\(browser\)/);
  assert.match(src,/await writeFile\(join\(out,"evidence\.json"\)/);
  assert.match(src,/evidence\.failures\.push/);
});
