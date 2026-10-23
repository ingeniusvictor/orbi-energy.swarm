import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const css=read("src/styles/androidImmersive.css");
const start=read("src/components/StartScreen.tsx");
test("UX03 scales native landscape launch deck, not battle Canvas or desktop",()=>{
 assert.match(css, /@media \(orientation: landscape\) and \(max-height: 600px\) and \(pointer: coarse\)/);
 assert.match(css,/\.orbi-premium-entry \.orbi-start-deck \{[\s\S]*?max-height: none !important/);
 assert.match(css,/\.orbi-premium-entry \.orbi-start-deck \{[\s\S]*?touch-action: pan-y/);
 assert.match(css,/\.orbi-premium-entry \.orbi-start-tabs \{[\s\S]*?flex-wrap: nowrap/);
 assert.match(css,/\.orbi-premium-entry \.orbi-start-tabs button \{[\s\S]*?min-height: 39px/);
 assert.match(css,/\.orbi-premium-entry \.orbi-start-launch > \.orbi-premium-cta \{[\s\S]*?min-height: 48px/);
 const ux03Only = css.slice(css.indexOf("/* UX03 —"), css.indexOf("/* UX04: compact Android tactical alerts"));
 assert.ok(ux03Only.length > 0, "UX03 CSS block must remain present");
 assert.doesNotMatch(ux03Only,/\.orbi-game-root\[data-immersive-landscape="true"\]/);
});
test("UX03 primary Play is still original campaign action; Score Attack and tabs remain",()=>{
 assert.match(start,/data-primary-start-cta="true"[\s\S]*?onStartGame\(\)/);
 assert.match(start,/data-score-attack-start-cta="true"[\s\S]*?onStartScoreAttack\(\)/);
 assert.match(start,/orbi-start-scroll-cue/);
 assert.match(start,/orbi-start-launch-summary/);
 assert.match(start,/orbi-start-hero order-3/);
});
