import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = p => readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const hud=read("src/components/GameHud.tsx");
const ui=read("src/components/UpgradeSelector.tsx");
const css=read("src/styles/ux10PremiumOverlays.css");
const entry=read("src/main.tsx");

test("UX10 panel entry freezes simulation and panel exit preserves prior pause",()=>{
 const part=game.slice(game.indexOf("const changeImmersivePanel ="),game.indexOf("const cyclePhotoModeFilter ="));
 assert.match(part,/mobilePanelWasPausedRef.current = isPausedRef.current/);
 assert.match(part,/if \(!isPausedRef\.current\) togglePause\(\)/);
 assert.match(part,/if \(!mobilePanelWasPausedRef\.current && isPausedRef\.current\) togglePause\(\)/);
 assert.match(game,/onMobilePanelChange=\{changeImmersivePanel\}/);
 assert.match(game,/isPlaying && isPaused && !isPhotoMode && mobilePanel === "closed"/);
 assert.match(game,/onTogglePause=\{mobilePanel !== "closed"/);
 assert.match(game,/changeImmersivePanel\("closed"\)/);
});
test("UX10 Status/Tactics/Team use same tab and fixed panel geometry",()=>{
 for (const s of ["orbi-premium-panel-paused","orbi-premium-pause-emblem","orbi-premium-status","aria-pressed={mobilePanel === panel}"]) assert.ok(hud.includes(s),s);
 for (const s of ['[data-mobile-panel="estado"]','[data-mobile-panel="tactica"]','[data-mobile-panel="equipo"]',"--ux10-frame-width","--ux10-panel-top","--ux10-panel-bottom"]) assert.ok(css.includes(s),s);
});
test("UX10 premium Status reads actual gameplay data",()=>{
 for (const s of ["shieldPercent","currentWave","swarmSize","formatNumber(score)","formatNumber(nanoCredits)","combatResonance","combatChain","audioMuted"]) assert.ok(hud.includes(s),s);
 assert.match(css,/orbi-premium-status-indicators/);
 assert.doesNotMatch(hud,/TEMPERATURA|TEMPERATURE|32%/);
});
test("UX10 upgrade options show three native selectable cards without horizontal carousel",()=>{
 assert.match(entry,/ux10PremiumOverlays.css/);
 assert.match(ui,/data-orbi-category=\{upgrade.category\}/);
 assert.match(ui,/onClick=\{\(\) => onSelect\(upgrade\)\}/);
 assert.match(ui,/onClick=\{onReroll\}/);
 assert.ok(css.includes("grid-template-columns:repeat(3,minmax(0,1fr))!important"));
 assert.ok(css.includes("overflow:hidden!important;scroll-snap-type:none!important"));
});
