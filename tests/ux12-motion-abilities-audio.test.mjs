import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const hud=read("src/components/GameHud.tsx");
const touch=read("src/components/MobileTouchOverlay.tsx");
const audio=read("src/game/audio.ts");
const start=read("src/components/StartScreen.tsx");
const pause=read("src/components/PauseMenu.tsx");
const css=read("src/styles/ux12CombatCockpit.css");
const sprite=read("public/ux12/orbi-energy-swarm-hud.svg");
const browser=read("scripts/web-ux01-browser-evidence.mjs");
const physics=read("src/game/propulsionDash.ts");

test("UX12 movement jets respond only to physical gameplay displacement and preserve target gaze",()=>{
 assert.match(game,/projectEnergyThrusterPose\(/);
 assert.match(game,/drawEnergyThrusterJets\(ctx,playerPosRef\.current/);
 assert.match(game,/playerPosRef\.current\.x-preMotionX/);
 assert.match(game,/playerPosRef\.current\.y-preMotionY/);
 assert.match(game,/energyThrusterPoseRef\.current\.bankRadians/);
 assert.match(read("src/game/EnergySwarmCanvas.tsx"),/ctx\.rotate\(Math\.max\(-\.16,Math\.min\(\.16,movementBankRadians\)\)\)/);
 assert.match(read("src/game/fotonTacticalRenderer.ts"),/pose\.lensOffsetX/);
 assert.doesNotMatch(read("src/game/energyThrusters.ts"),/Math\.random|createParticle|enemy|damage|setTimeout/);
});

test("UX12 lower-right OD and DASH are accessible real two-finger touch actions; no top duplication",()=>{
 assert.match(touch,/data-testid="orbi-touch-overdrive"/);
 assert.match(touch,/data-testid="orbi-touch-dash"/);
 assert.match(touch,/onOverdrive\(\)/);
 assert.match(touch,/onDash\(\)/);
 assert.match(touch,/event\.pointerType !== "mouse"/);
 assert.match(touch,/event\.preventDefault\(\)/);
 assert.match(touch,/activePointer\.current = event\.pointerId/);
 assert.match(css,/pointer-events:none/);
 assert.match(css,/\.orbi-touch-abilities>/);
 assert.match(css,/\.orbi-immersive-actions \.orbi-dash-action/);
 assert.match(css,/\.orbi-immersive-actions \.orbi-overdrive-action/);
 assert.match(browser,/duplicate top Dash button still visible/);
 assert.match(browser,/right thumb Overdrive absent/);
 assert.match(game,/onOverdrive=\{handleOverdriveActivation\}/);
 assert.match(physics,/DASH_COOLDOWN_MS = 18_000/);
});

test("UX12 battle logo is game-only and creator label no longer obscures combat",()=>{
 assert.match(game,/data-testid="orbi-game-brand"/);
 assert.match(game,/alt="ORBI ENERGY SWARM"/);
 assert.match(sprite,/ENERGY/);
 assert.match(sprite,/SWARM/);
 assert.doesNotMatch(game,/Created by Víctor Marcel/);
 assert.match(read("src/main.tsx"),/ux12CombatCockpit\.css/);
 assert.doesNotMatch(css,/data-layer="WELCOME"/);
});

test("UX12 music and sound effects have independent persistable mixer lanes and UI",()=>{
 assert.match(audio,/let musicEnabled = true/);
 assert.match(audio,/let soundEffectsEnabled = true/);
 assert.match(audio,/setMusicEnabled/);
 assert.match(audio,/setSoundEffectsEnabled/);
 assert.match(audio,/if \(!ctx \|\| isMuted \|\| !musicEnabled\) return/);
 assert.match(audio,/if \(!ctx \|\| isMuted \|\| !soundEffectsEnabled\) return/);
 assert.match(game,/setMusicEnabled\(loaded\.musicEnabled !== false\)/);
 assert.match(game,/setSoundEffectsEnabled\(loaded\.soundEffectsEnabled !== false\)/);
 assert.match(game,/updateStatsAndSave\(\{ \.\.\.\(statsRef\.current \?\? stats\), musicEnabled: enabled \}\)/);
 assert.match(game,/updateStatsAndSave\(\{ \.\.\.\(statsRef\.current \?\? stats\), soundEffectsEnabled: enabled \}\)/);
 const native=read("src/components/PremiumNativeNavigation.tsx");
 const router=read("src/components/MobileLaunchNavigation.tsx");
 assert.match(native,/data-testid="orbi-native-audio-settings"/);
 assert.match(native,/data-testid="orbi-native-music"/);
 assert.match(native,/data-testid="orbi-native-effects"/);
 assert.match(native,/data-testid="orbi-native-master-audio"/);
 assert.match(router,/onMusicToggle=\{onMusicToggle\}/);
 assert.match(css,/data-mobile-tab="SETTINGS"/);
 assert.match(start,/data-testid="orbi-settings-music"/);
 assert.match(start,/data-testid="orbi-settings-effects"/);
 assert.match(pause,/data-testid="orbi-pause-music"/);
 assert.match(pause,/data-testid="orbi-pause-effects"/);
 assert.match(hud,/data-testid="orbi-immersive-music-toggle"/);
 assert.match(hud,/onClick=\{onToggleMusic\}/);
 assert.match(read("src/game/storage.ts"),/musicEnabled: true/);
});
