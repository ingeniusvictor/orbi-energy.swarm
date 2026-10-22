import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = p => readFileSync(new URL("../"+p, import.meta.url),"utf8");
const game=read("src/game/EnergySwarmGame.tsx");
const core=read("src/game/blackoutArchitectDevQaCoreImpact.ts");
const c2=read("src/game/blackoutArchitectDevQaCardinalImpact.ts");

test("C3 core hit is driven by actual QA shot only after cardinal impact arbitration",()=>{
  const loop=game.slice(game.indexOf("const gameLoop = (timestamp: number) => {"));
  const start=loop.indexOf("if (architectQaBossRef.current !== null) {");
  const normal=loop.indexOf("let delta = timestamp - lastTimeRef.current;",start);
  assert.ok(start>=0&&normal>start);
  const qa=loop.slice(start,normal);
  const a=qa.indexOf("const qaHit = resolveBlackoutArchitectDevQaCardinalImpact(");
  const b=qa.indexOf("const qaCoreHit = !qaHit && qaShot.life > 0",a);
  const c=qa.indexOf("resolveBlackoutArchitectDevQaCoreImpact(",b);
  const d=qa.indexOf("if (qaCoreHit?.coreDisabled) {",c);
  assert.ok(a>=0&&a<b&&b<c&&c<d);
  assert.match(qa,/clearArchitectQaDiagnostic\(\);\s*setArchitectQaDefeatVisible\(true\);/);
  assert.match(qa,/if \(!qaHit && !qaCoreHit && qaShot\.life > 0\)/);
  assert.ok(qa.includes("return;"));
  assert.doesNotMatch(qa,/updateEnginePhysics\(|triggerGameOver\(|bossDefeatedSequenceActiveRef\.current = true/);
});

test("C3 core only unlocks after four actual zero-HP cardinal entities, single transaction",()=>{
  assert.match(core,/geometry\.boss !== boss/);
  assert.match(core,/projectile !== activeQaProjectile/);
  assert.match(core,/owner\.isCurrent\(guard,boss,boss,enemies\)/);
  assert.match(core,/geometry\.anchors\.length !== 4/);
  assert.match(core,/anchor\.health !== 0/);
  assert.match(core,/ids\.size !== 4/);
  assert.match(core,/boss\.maxHealth !== DESIGN\.core\.proposedMaxHealth/);
  assert.match(core,/boss\.size !== DESIGN\.core\.proposedVisualSize/);
  assert.match(core,/projectile\.life = 0;\s*boss\.health = Math\.max\(0,boss\.health-damage\)/);
  assert.match(core,/coreDisabled: boss\.health === 0/);
  assert.match(c2,/projectile\.life = 0;\s*touched\.health = Math\.max\(0, touched\.health - damage\)/);
  for(const forbidden of ["Math.random(","Date.now(","setTimeout(","localStorage",
    "shieldNodesRef","registerCombatDefeat","bossDefeatedSequenceActiveRef",
    "saveGameStats","scoreRef","nanoCredits","runtimeProgressionRef","FOTON"]){
    assert.ok(!core.includes(forbidden),forbidden);
  }
});

test("C3 QA-only status and terminal identity teardown do not reclassify release or old bosses",()=>{
  assert.match(game,/if \(import\.meta\.env\.DEV && liveQaCore !== null && liveQaGeometry !== null/);
  assert.match(game,/Math\.ceil\(liveQaCore\.health\)/);
  assert.match(game,/CARDINAL ANCHORS LEFT:/);
  assert.match(game,/ALL ANCHORS DOWN — CORE VULNERABLE/);
  assert.match(game,/architectQaDefeatVisible && !architectQaVisible/);
  assert.match(game,/DEV QA COMPLETE — ARCHITECT CORE 0 HP · NO REWARDS/);
  assert.equal((game.match(/architectEncounterSlotRef\.current = revokeBlackoutArchitectDormantEncounter\(\);/g)??[]).length,7);
  assert.equal((game.match(/\.admitInstalledBoss\(/g)??[]).length,1);
  assert.match(game,/runtimeProgressionRef\.current\.mode !== "CAMPAIGN"/);
  const handler=game.slice(game.indexOf("const handleOverdriveActivation ="),
    game.indexOf("// --- KEY LISTENER LISTENERS ---"));
  assert.doesNotMatch(handler,/projectilesRef|damageMultiplier|fireRate|scoreRef\.current\s*[+*]=/i);
});
