import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("UX04 compact wave HUD preserves content and never intercepts touches",()=>{
 const g=read("src/game/EnergySwarmGame.tsx"),css=read("src/styles/androidImmersive.css");
 assert.match(g,/orbi-wave-intro fixed inset-0/);
 assert.match(g,/orbi-wave-intro-card/);
 assert.match(g,/orbi-wave-intro-advice/);
 assert.match(g,/pointer-events-none select-none/);
 assert.match(g,/waveIntroConfig\.tacticalAdvice/);
 assert.match(css,/\.orbi-wave-intro-card \{/);
 assert.match(css,/max-height:min\(36dvh,145px\)/);
 assert.match(css,/@media \(orientation: landscape\) and \(max-height: 600px\) and \(pointer: coarse\)/);
});
test("UX04 upgrades retain real choices and reroll handlers with swipeable compact cards",()=>{
 const component=read("src/components/UpgradeSelector.tsx"),css=read("src/styles/androidImmersive.css");
 assert.match(component,/choices\.map\(\(upgrade\)/);
 assert.match(component,/onClick=\{\(\) => onSelect\(upgrade\)\}/);
 assert.match(component,/onClick=\{onReroll\}/);
 for(const cls of ["orbi-upgrade-selector","orbi-upgrade-shell","orbi-upgrade-choices","orbi-upgrade-choice","orbi-upgrade-reroll"]) {
  assert.ok(component.includes(cls)&&css.includes(cls),cls);
 }
 assert.match(css,/scroll-snap-type:x mandatory/);
 assert.match(css,/max-height:calc\(100dvh - 12px\)/);
});
