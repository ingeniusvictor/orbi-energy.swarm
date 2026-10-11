import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const renderer=read("src/game/fotonGameplay3DRenderer.ts"); const game=read("src/game/EnergySwarmGame.tsx"); const wave=read("src/game/waveDirector.ts"); const styles=read("src/styles/index.css"); const constants=read("src/game/constants.ts");
test("Dyson renderer orients true planes with quaternions without per-frame vector allocation",()=>{assert.match(renderer,/setFromUnitVectors/); assert.match(renderer,/planeNormal/); assert.match(renderer,/baseQuaternion/); assert.match(renderer,/precessionQuaternion/); assert.doesNotMatch(renderer,/planeRoot\.rotation\.set\([\s\S]*descriptor\.tilt/);});
test("Devourer Hunter Wave is telegraphed and bounded by existing enemy cap",()=>{assert.match(game,/bossHunterWaveTelegraphRef/); assert.match(game,/HUNTER WAVE INCOMING/); assert.match(game,/enemiesRef\.current\.length >= MAX_ENEMIES - 1/); assert.match(wave,/phase: 1, enemyType: EnemyType\.CRAWLER/); assert.match(wave,/phase: 1, enemyType: EnemyType\.DRONE/);});
test("H3 keeps global entity budgets unchanged while widening balanced desktop stage",()=>{assert.match(constants,/MAX_ENEMIES/); assert.match(constants,/MAX_PROJECTILES/); assert.match(styles,/minmax\(190px, 210px\)[\s\S]*minmax\(245px, 270px\)[\s\S]*gap: 0\.5rem/);});
test("H3 adds no scheduler or network path",()=>{for(const source of [renderer,wave]) assert.doesNotMatch(source,/setInterval\(|setTimeout\(|fetch\(|XMLHttpRequest|WebSocket/);});
