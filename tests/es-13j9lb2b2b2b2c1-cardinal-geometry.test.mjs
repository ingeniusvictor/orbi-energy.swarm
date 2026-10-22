import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const game = read("src/game/EnergySwarmGame.tsx");
const geometry = read("src/game/blackoutArchitectDevQaCardinalGeometry.ts");
const oldFactory = read("src/game/blackoutArchitectDevQaBossFactory.ts");
const typeSchema = read("src/game/types.ts");

test("C1 owns actual four cardinal circles only in the authenticated DEV QA installation", () => {
  assert.match(geometry, /ownsEngineOwnedCardinalCirclePlacement: true/);
  assert.match(geometry, /ownsIndependentInitialAnchorDurability: true/);
  assert.match(geometry, /DESIGN\.anchors\.length !== 4/);
  assert.match(geometry, /owner\.isCurrent\(guard, boss, installedBoss, enemies\)/);
  assert.match(geometry, /Object\.seal\(\{ id, x, y, radius, maxHealth: hp, health: hp \}\)/);
  assert.match(geometry, /Object\.freeze\(anchors\)/);
  assert.match(game, /architectQaCardinalsRef = useRef/);
  assert.match(game, /const cardinalGeometry = createBlackoutArchitectDevQaCardinalGeometry\(/);
  const install = game.slice(game.indexOf("const toggleArchitectQaDiagnostic = () => {"),
    game.indexOf("// --- KEY LISTENER LISTENERS ---"));
  const admit = install.indexOf(".admitInstalledBoss(");
  const guarded = install.indexOf("if (!valid) {", admit);
  const make = install.indexOf("const cardinalGeometry = createBlackoutArchitectDevQaCardinalGeometry(", guarded);
  const commit = install.indexOf("architectQaCardinalsRef.current = cardinalGeometry;", make);
  assert.ok(admit >= 0 && guarded > admit && make > guarded && commit > make);
  assert.match(install, /if \(cardinalGeometry === null\) \{\s*clearArchitectQaDiagnostic\(\);\s*return;/);
  assert.match(game, /architectQaCardinalsRef\.current = null;\s*const qaBoss = architectQaBossRef\.current/);
  assert.equal((game.match(/architectEncounterSlotRef\.current = revokeBlackoutArchitectDormantEncounter\(\);/g) ?? []).length,7);
});

test("C1 renderer shows actual independent circles and HP, while the diagnostic still freezes physics", () => {
  const render = game.slice(game.indexOf("const renderCanvasScene = () => {"));
  assert.match(render, /const qaCardinals = architectQaCardinalsRef\.current/);
  assert.match(render, /import\.meta\.env\.DEV && qaCardinals !== null/);
  assert.match(render, /qaCardinals\.boss === bossRef\.current/);
  assert.match(render, /for \(const anchor of qaCardinals\.anchors\)/);
  assert.match(render, /ctx\.arc\(anchor\.x, anchor\.y, anchor\.radius/);
  assert.match(render, /Math\.round\(anchor\.health\)/);
  assert.ok(render.indexOf("const qaCardinals =") > render.indexOf("ctx.scale(cameraStateRef.current.zoom"));
  const loop = game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
  assert.ok(loop.indexOf("if (architectQaBossRef.current !== null) {") <
    loop.indexOf("timeElapsedRef.current += delta;"));
  assert.ok(game.includes("DEV QA — ARCHITECT ANCHOR HITS · WAVES/AI FROZEN · CLICK TO FIRE"));
});

test("C1 has no collision, damage, attack, mode, shield-node or cap authority", () => {
  for(const name of [
    "ownsCollisionOrDamageAuthority", "ownsProjectileConsumptionAuthority",
    "ownsAnchorHealthMutationAuthority", "ownsBossCoreHealthAuthority",
    "ownsAttacksOrPhasesAuthority", "ownsLegacyShieldNodeAuthority",
    "ownsEntityOrProjectileCollectionAuthority", "ownsAutomaticSpawnOrProductionRoutingAuthority",
    "ownsRewardsOrPersistenceAuthority", "ownsClockOrRandomnessAuthority",
    "ownsFotonOrFormationAuthority", "ownsCapOrBudgetAuthority",
  ]) assert.match(geometry,new RegExp(name+": false"),name);
  for(const token of ["Math.random(","Date.now(","setInterval(","setTimeout(","projectilesRef.current",
     "shieldNodesRef.current","bossActiveRef.current = true","proj.life =","registerCombatDefeat("]) {
    assert.ok(!geometry.includes(token),token);
  }
  assert.match(typeSchema,/BOSS_ARCHITECT = "BOSS_ARCHITECT"/);
  assert.match(typeSchema,/"NULL_ARCHITECT"/);
  assert.match(oldFactory,/ownsPhysicalCardinalGeometryAuthority: false/);
  assert.match(game,/runtimeProgressionRef\.current\.mode !== "CAMPAIGN"/);
  assert.equal((game.match(/\.admitInstalledBoss\(/g) ?? []).length,1);
});
