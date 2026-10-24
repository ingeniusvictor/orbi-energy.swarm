import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const halo=read("src/game/fotonDysonHalo.ts");
const runtime=read("src/game/fotonGameplay3DRenderer.ts");
const game=read("src/game/EnergySwarmGame.tsx");
const hud=read("src/components/GameHud.tsx");
const effect=read("src/game/combatOverdriveEffects.ts");
const overdrive=read("src/game/combatOverdrive.ts");
const view=read("src/game/combatOverdrivePresentationRenderer.ts");

test("UX11-A Dyson presentation remains switchable and OFF, without deleting ring unlock rules",()=>{
 assert.match(halo,/export const FOTON_DYSON_HALO_DISPLAY_ENABLED = false/);
 assert.match(runtime,/haloRoot\.visible = FOTON_DYSON_HALO_DISPLAY_ENABLED/);
 assert.match(runtime,/scene\.add\(haloRoot\)/);
 assert.match(runtime,/createDysonHaloRuntime\(preset\)/);
 assert.match(runtime,/stepDysonHalo\(/);
 assert.match(halo,/getUnlockedDysonHaloRingCount/);
 assert.match(halo,/unlockCollectedOrbi: 10/);
 assert.match(halo,/unlockCollectedOrbi: 20/);
});
test("UX11-A lightning button correctly names and describes existing Overdrive",()=>{
 assert.match(hud,/data-testid="orbi-overdrive-action"/);
 assert.match(hud,/onClick=\{onActivateOverdrive\}/);
 assert.match(hud,/ORBI Overdrive:/);
 assert.match(hud,/\+20% player damage|Boosts damage by 20%/);
 assert.match(hud,/4-second reentry lock/);
 assert.match(game,/const handleOverdriveActivation =/);
 assert.match(overdrive,/OVERDRIVE_DURATION_MS = 8_000/);
 assert.match(overdrive,/OVERDRIVE_REENTRY_LOCK_MS = 4_000/);
 assert.match(effect,/OVERDRIVE_PLAYER_DAMAGE_MULTIPLIER = 1\.2/);
});
test("UX11-A independent Overdrive field and rings stay present as combat feedback",()=>{
 assert.match(view,/drawCombatOverdriveSwarmHalo/);
 assert.match(view,/projection\.ringCount/);
 assert.match(view,/drawCombatOverdriveFieldOverlay/);
 assert.doesNotMatch(view,/FOTON_DYSON_HALO_DISPLAY_ENABLED/);
 assert.doesNotMatch(overdrive,/FOTON_DYSON_HALO_DISPLAY_ENABLED/);
});
