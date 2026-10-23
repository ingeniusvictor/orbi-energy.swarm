import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const styles=read("src/styles/androidImmersive.css");
const scope='.orbi-game-root[data-immersive-landscape="true"][data-web-immersive="false"]';

test("UX07 mobile banner uses actual runtime immersive input gate, not 600px viewport guess",()=>{
 assert.ok(styles.includes(scope+" .orbi-wave-intro"),"native touch-mode selector");
 const ux07=styles.slice(styles.indexOf("/* ANDROID UX07 — ACTUAL"));
 assert.ok(ux07.length>0);
 assert.doesNotMatch(ux07,/@media\s*\(.*max-height:\s*600px/);
 assert.match(ux07,/max-height:\s*76px !important/);
 assert.match(ux07,/width:\s*min\(420px,\s*46vw/);
 assert.match(ux07,/pointer-events:\s*none !important/);
 assert.match(ux07,/background:\s*transparent !important/);
 assert.match(game,/waveIntroConfig\.displayName/);
 assert.match(game,/waveIntroConfig\.warningLevel/);
 assert.match(game,/waveIntroConfig\.recommendedFormation/);
});
test("UX07 enemy-intel remains pausing and acknowledgement-owned while card is bounded",()=>{
 for(const marker of ["orbi-threat-intel-overlay","orbi-threat-intel-dialog","orbi-threat-intel-details","orbi-threat-intel-continue"]) {
   assert.ok(game.includes(marker),marker+" in source");
   assert.ok(styles.includes(scope+" ."+marker),marker+" scoped CSS");
 }
 assert.match(styles,/max-height:\s*min\(58dvh,\s*310px\)/);
 assert.match(styles,/overflow-y:\s*auto/);
 assert.match(styles,/min-height:\s*44px !important/);
 assert.match(game,/setActiveThreatIntel\(null\);\s*setPausedState\(false\)/);
 assert.match(game,/aria-modal="true"/);
});
test("UX07 keeps upgrades selectable, scrollable, and Web fine-pointer untouched",()=>{
 assert.ok(styles.includes(scope+" .orbi-upgrade-choices"));
 assert.match(styles,/scroll-snap-type:\s*x mandatory/);
 const upgrade=read("src/components/UpgradeSelector.tsx");
 assert.match(upgrade,/onClick=\{\(\) => onSelect\(upgrade\)\}/);
 assert.match(upgrade,/onClick=\{onReroll\}/);
 assert.doesNotMatch(styles.slice(styles.indexOf("/* ANDROID UX07 — ACTUAL")),/\.orbi-game-root\[data-web-immersive="true"\]/);
});
