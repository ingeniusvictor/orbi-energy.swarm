import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const presentationSource = readFileSync("src/game/liveCommandCorePresentation.ts", "utf8");
const canvasSource = readFileSync("src/game/EnergySwarmCanvas.tsx", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");
const formationSource = readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const prioritySource = readFileSync("src/game/priorityTargetContract.ts", "utf8");
const bindingSource = readFileSync("src/game/commandLinkBinding.ts", "utf8");

test("J5C projection reuses J5B binding and remains static presentation-only", () => {
  assert.match(
    presentationSource,
    /resolveCommandLinkBinding[\s\S]*from "\.\/commandLinkBinding"/,
  );
  assert.match(presentationSource, /binding\.memberRole !== "COMMAND_CORE"/);
  assert.match(presentationSource, /markerKind:\s*"COMMAND_CORE_PRIORITY"/);

  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /COMMAND_LINK_BROKEN/,
    /resolvePriorityTargetDefeatSignal/,
    /enemy\.health/,
    /isDead\s*=/,
    /baseScore/,
    /nanoCredits/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /\.filter\(/,
    /\.reduce\(/,
    /\.forEach\(/,
  ]) {
    assert.doesNotMatch(presentationSource, forbidden);
  }
});

test("Canvas adopts J5C only inside the existing enemy render pass", () => {
  assert.match(
    canvasSource,
    /import \{ projectLiveCommandCorePresentation \} from "\.\/liveCommandCorePresentation"/,
  );

  const drawStart = canvasSource.indexOf("export function drawEnemiesList");
  const enemyLoop = canvasSource.indexOf("enemies.forEach((enemy)", drawStart);
  const projectionCall = canvasSource.indexOf("projectLiveCommandCorePresentation(", enemyLoop);
  const healthBar = canvasSource.indexOf("// HEALTH BAR OVERLAY", projectionCall);

  assert.ok(drawStart >= 0);
  assert.ok(enemyLoop > drawStart);
  assert.ok(projectionCall > enemyLoop);
  assert.ok(healthBar > projectionCall);

  const beforeLoop = canvasSource.slice(drawStart, enemyLoop);
  assert.doesNotMatch(beforeLoop, /projectLiveCommandCorePresentation\(/);
  assert.doesNotMatch(canvasSource, /enemies\.filter\([^)]*COMMAND_CORE/);
  assert.doesNotMatch(canvasSource, /enemies\.find\([^)]*COMMAND_CORE/);
});

test("Canvas marker is bounded ring and chevron without labels or linked lines", () => {
  assert.match(canvasSource, /commandCorePresentation\.ringRadius/);
  assert.match(canvasSource, /commandCorePresentation\.chevronOffsetY/);
  assert.match(canvasSource, /ctx\.arc\(0, 0, commandCorePresentation\.ringRadius/);
  assert.doesNotMatch(canvasSource, /fillText\([^\n]*COMMAND CORE/);
  assert.doesNotMatch(canvasSource, /fillText\([^\n]*CORE/);
  assert.doesNotMatch(canvasSource, /linkedMemberIndices[\s\S]{0,200}enemies/);
});

test("J5C captures no runtime or entity-schema authority", () => {
  assert.doesNotMatch(gameSource, /liveCommandCorePresentation/);
  assert.doesNotMatch(gameSource, /projectLiveCommandCorePresentation/);
  assert.doesNotMatch(typesSource, /commandCorePresentation/);
  assert.doesNotMatch(typesSource, /CommandCorePresentation/);
  assert.doesNotMatch(formationSource, /liveCommandCorePresentation/);
  assert.doesNotMatch(prioritySource, /liveCommandCorePresentation/);
  assert.doesNotMatch(bindingSource, /liveCommandCorePresentation/);
});

test("J5C leaves J3 lifecycle and J5A/J5B semantics authoritative", () => {
  assert.match(formationSource, /LIVE_ENEMY_FORMATION_GROUP_SIZE\s*=\s*2/);
  assert.match(formationSource, /LIVE_ENEMY_FORMATION_ADVANCED_GROUP_SIZE\s*=\s*3/);
  assert.match(prioritySource, /effectMode:\s*"SIGNAL_ONLY"/);
  assert.match(bindingSource, /bindingMode:\s*"BINDING_ONLY"/);
  assert.match(bindingSource, /COMMAND_LINK_CORE_MEMBER_INDEX\s*=\s*0/);
});
