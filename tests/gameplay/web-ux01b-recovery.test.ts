import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const read=(p:string)=>readFileSync(new URL("../../"+p,import.meta.url),"utf8");

test("WEB UX01B keeps an accessible exit when clean Photo Mode hides all HUD",()=>{
 const game=read("src/game/EnergySwarmGame.tsx");
 const back=read("src/components/WebPhotoReturn.tsx");
 const style=read("src/styles/webImmersive.css");
 assert.match(game,/isPhotoMode && !photoHintVisible && immersiveWebLandscape/);
 assert.match(game,/<WebPhotoReturn onExit=\{exitPhotoMode\}/);
 assert.match(back,/data-testid="orbi-web-photo-return"/);
 assert.match(back,/aria-keyshortcuts="Escape F10"/);
 assert.match(back,/onPointerDown=\{e => e\.stopPropagation\(\)\}/);
 assert.match(style,/data-web-immersive="true"\]\[data-photo-mode="true"/);
 assert.match(style,/min-height:\s*44px/);
 assert.match(style,/safe-area-inset-right/);
 assert.doesNotMatch(game,/setIsPhotoMode\(true\)[\s\S]{0,50}webImmersive/);
});

test("WEB UX01B catches GPU failures without corrupting combat or changing 3D success path",()=>{
 const renderer=read("src/game/fotonGameplay3DRenderer.ts");
 const canvas=read("src/game/EnergySwarmCanvas.tsx");
 assert.match(renderer,/const disableFoton3D =/);
 assert.match(renderer,/if \(webglUnavailable\) return null/);
 assert.match(renderer,/const ensureRuntime = \(/);
 assert.match(renderer,/runtime = createRuntime\(preset\)/);
 assert.match(renderer,/catch \(error\) \{[\s\S]*disableFoton3D\(error\)/);
 assert.match(renderer,/webglUnavailable \? "FAILED"/);
 assert.match(canvas,/reportFotonGameplay3DCompositionFailure/);
 assert.match(canvas,/drawFotonTacticalAvatar\(ctx/);
 assert.match(canvas,/ctx\.drawImage\(/);
 assert.doesNotMatch(renderer,/enemiesRef|projectilesRef|scoreRef|shieldRef|saveGameStats/);
});
