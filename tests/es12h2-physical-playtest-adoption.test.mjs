import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const game = read("src/game/EnergySwarmGame.tsx");
const halo = read("src/game/fotonDysonHalo.ts");
const pursuit = read("src/game/bossPursuit.ts");
const companion = read("src/components/CompanionPanel.tsx");
const styles = read("src/styles/index.css");
const constants = read("src/game/constants.ts");

test("runtime formation source of truth cannot go stale behind React UI state", () => {
  assert.match(game, /const activeFormationRef = useRef<FormationType>\(FormationType\.LINE\)/);
  assert.match(game, /activeFormationRef\.current = nextForm;[\s\S]{0,80}setActiveFormation\(nextForm\)/);
  assert.match(game, /activeFormationRef\.current = FormationType\.LINE;[\s\S]{0,80}setActiveFormation\(FormationType\.LINE\)/);
  assert.match(game, /const runtimeFormation = activeFormationRef\.current/);
  assert.match(game, /calculateSwarmOffset\(\s*activeFormationRef\.current,/);
  assert.doesNotMatch(game, /FORMATIONS\[activeFormation\]/);
  assert.doesNotMatch(game, /calculateSwarmOffset\(\s*activeFormation,/);
});

test("Dyson progression uses monotonic run acquisition instead of live follower attrition", () => {
  assert.match(game, /const runOrbiAcquiredRef = useRef<number>\(0\)/);
  assert.match(game, /runOrbiAcquiredRef\.current = 0/);
  assert.equal((game.match(/runOrbiAcquiredRef\.current \+= 1/g) ?? []).length, 3);
  assert.match(
    game,
    /const tryTriggerAffinityFusion = \(\) =>[\s\S]*runOrbiAcquiredRef\.current \+= 1/,
  );
  assert.match(game, /fotonThreatDirectionRef\.current,\s*runOrbiAcquiredRef\.current,\s*energyThrusterPoseRef\.current\.bankRadians,\s*\);/);
  assert.doesNotMatch(halo, /normalizeCount\(swarmMemberCount\) - 1/);
});

test("Devourer pursuit remains O(1) while applying materially stronger phase pressure", () => {
  assert.doesNotMatch(pursuit, /for\s*\(|\.map\(|\.filter\(|\.forEach\(/);
  assert.match(pursuit, /speedPerFrame: 1\.8/);
  assert.match(pursuit, /speedPerFrame: 3\.3/);
  assert.match(pursuit, /standoffDistance: 75/);
  assert.match(pursuit, /catchupMultiplier: 1\.35/);
});

test("desktop cockpit allocates more height to roster and more width to battlefield", () => {
  assert.match(companion, /lg:h-\[min\(82dvh,820px\)\]/);
  assert.match(styles, /@media \(min-width: 1600px\)[\s\S]*minmax\(190px, 210px\)[\s\S]*minmax\(245px, 270px\)[\s\S]*gap: 0\.5rem/);
});

test("physical-playtest correction preserves logical 800x480 canvas and performance budgets", () => {
  assert.match(constants, /CANVAS_WIDTH\s*=\s*800/);
  assert.match(constants, /CANVAS_HEIGHT\s*=\s*480/);
  assert.match(styles, /\.orbi-game-stage\s*\{[\s\S]*aspect-ratio:\s*5\s*\/\s*3/);
  assert.match(constants, /MAX_ENEMIES/);
  assert.match(constants, /MAX_PROJECTILES/);
});