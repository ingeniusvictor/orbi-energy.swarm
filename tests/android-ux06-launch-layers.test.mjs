import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("UX06 three-layer startup keeps campaign/score and legacy desktop controls",()=>{
 const s=read("src/components/StartScreen.tsx"),hub=read("src/components/MobileLaunchNavigation.tsx"),css=read("src/styles/index.css");
 assert.match(s,/data-mobile-layer=\{mobileLayer\}/);
 assert.match(s,/onPlay=\{\(\) => \{ playClickSound\(\); onStartGame\(\); \}\}/);
 assert.match(s,/onScoreAttack=\{\(\) => \{ playClickSound\(\); onStartScoreAttack\(\); \}\}/);
 for(const marker of ["orbi-mobile-enter","orbi-mobile-campaign","orbi-mobile-score-attack","orbi-mobile-menu-back"])assert.ok(hub.includes(marker),marker);
 assert.match(hub,/hasInfiniteRecord/);
 assert.match(css,/@media \(orientation: landscape\) and \(max-height: 600px\) and \(pointer: coarse\)/);
 assert.match(css,/\.orbi-mobile-launch \{ display:none; \}/);
 assert.match(css,/data-mobile-layer="DETAIL"/);
 assert.match(s,/data-primary-start-cta="true"/);
});
