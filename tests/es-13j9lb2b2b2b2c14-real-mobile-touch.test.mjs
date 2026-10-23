import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const game=readFileSync(new URL("../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
const browser=readFileSync(new URL("../scripts/architect-c13-projectile-browser.mjs",import.meta.url),"utf8");
const orientation=readFileSync(new URL("../src/components/OrientationHint.tsx",import.meta.url),"utf8");

test("C14 uses real existing visible orientation button rather than disabling tutorial",()=>{
  assert.match(orientation,/const \[dismissed, setDismissed\] = useState\(false\)/);
  assert.match(orientation,/onClick=\{\(\) => setDismissed\(true\)\}/);
  assert.match(browser,/page\.locator\("\.orbi-orientation-hint"\)/);
  assert.match(browser,/getByRole\("button",\{name:\/Entendido\|Got it\/i\}\)/);
  assert.match(browser,/await dismiss\.tap\(\)/);
  assert.match(browser,/await orientation\.count\(\)===0/);
});

test("C14 full 390px QA encounter only uses native touchscreen.tap input",()=>{
  assert.match(browser,/ORBI_C14_REAL_TOUCH === "1"/);
  assert.match(browser,/await page\.touchscreen\.tap\(x,y\)/);
  assert.match(browser,/await run\(browser,"mobile-touch-full", \[390,844,true,true\],true\)/);
  assert.match(browser,/await run\(browser,"mobile-compact-touch", \[320,700,true,true\],false\)/);
  assert.match(browser,/await run\(browser,"mobile-wide-touch", \[428,926,true,true\],false\)/);
  assert.match(browser,/await nativeShot\(page,x,y\)/);
  assert.match(browser,/await nativeShot\(page,rect\.x/);
  assert.match(browser,/for\(let n=0;n<96;n\+\+\)/);
  assert.match(browser,/const order=\["SOUTH","EAST","NORTH","WEST"\]/);
});

test("C14 authentic pointer kind is recorded ONLY in DEV QA and is not an input gate",()=>{
  assert.match(game,/architectQaLastPointerTypeRef = useRef<"touch" \| "mouse" \| "pen" \| null>\(null\)/);
  assert.match(game,/lastQaPointerType: architectQaLastPointerTypeRef\.current/);
  assert.match(game,/architectQaLastPointerTypeRef\.current =\s*e\.pointerType === "touch"/);
  assert.match(game,/architectQaLastPointerTypeRef\.current = null/);
  assert.match(browser,/after\?\.lastQaPointerType==="touch"/);
  const shot=game.slice(game.indexOf("const handlePointerDown"),game.indexOf("const handlePointerMove"));
  assert.match(shot,/architectEngineIdentityOwnerRef\.current\?\.isCurrent/);
  assert.match(shot,/projectilesRef\.current\.push\(shot\)/);
  assert.doesNotMatch(shot,/lastQaPointerTypeRef\.current === "touch"/);
  assert.doesNotMatch(browser,/window\.__ORBI|__reactFiber|page\.evaluate\(|dispatchEvent\(|mockShot\(|forceHit\(/);
});
