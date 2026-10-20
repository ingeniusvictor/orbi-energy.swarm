import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const game = read("src/game/EnergySwarmGame.tsx");
const source = read("src/game/blackoutArchitectDormantEncounterRevocation.ts");
const revoker = "architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter();";
const between = (a, b) => {
  const x = game.indexOf(a), y = game.indexOf(b, x);
  assert.ok(x >= 0 && y > x, a);
  return game.slice(x, y);
};

test("B2B2A owns null-only dormant revocation and grants no other authority", () => {
  assert.match(source, /export type BlackoutArchitectDormantEncounterSlot = null/);
  assert.match(source, /ownsDormantEncounterRevocationOnly: true/);
  for (const key of [
    "ownsEngineEncounterIssuanceAuthority", "ownsAuthenticatedEncounterIdentityAuthority",
    "ownsLifecycleFreshnessOrReplayAuthority", "ownsPhysicalCardinalGeometryAuthority",
    "ownsAnchorDurabilityAuthority", "ownsCollisionProvenanceAuthority",
    "ownsProjectileConsumptionAuthority", "ownsBossHealthOrDamageAuthority",
    "ownsBossSpawnOrAttackAuthority", "ownsBossPhaseOrExposureAuthority",
    "ownsRuntimeOrModeRoutingAuthority", "ownsRewardsOrPersistenceAuthority",
    "ownsTimerOrRandomnessAuthority", "ownsProjectileOrEntityCollectionAuthority",
    "ownsFotonOrFormationAuthority", "ownsCapOrBudgetAuthority",
  ]) assert.match(source, new RegExp(key + ": false"), key);
  assert.match(source, /revokeBlackoutArchitectDormantEncounter\s*=\s*\(\): BlackoutArchitectDormantEncounterSlot => null/);
  for (const x of [/Math\.random/, /Date\.now/, /setTimeout/, /setInterval/,
    /requestAnimationFrame/, /new (Map|Set|WeakSet)/,
    /projectilesRef/, /shieldNodesRef/, /proj\.life\s*=/,
    /enemy\.health/, /coreExposedTimerRef/]) assert.doesNotMatch(source, x);
});

test("B2B2A installs a null slot with exactly 7 engine cold-path revocations", () => {
  assert.match(game, /const architectEncounterSlotRef = useRef<BlackoutArchitectDormantEncounterSlot>\(null\)/);
  const assignments = game.split("\n").filter(line => line.includes("architectEncounterSlotRef.current ="));
  assert.equal(assignments.length, 7);
  assert.ok(assignments.every(line => line.includes(revoker)));
  for (const [start, stop] of [
    ["const startGame = () => {", "const startCampaignGame = () => {"],
    ["const triggerGameOver = (won: boolean) => {", "const enterInfiniteAfterCampaignVictory = () => {"],
    ["const enterInfiniteAfterCampaignVictory = () => {", "// --- PROCEDURAL REWARDS"],
    ["const spawnBoss = (", "const skipBossIntro = () => {"],
  ]) assert.ok(between(start,stop).includes(revoker),start);
  const defeat = between("const updateBossDefeatSequence = (delta: number) => {", "const updateEnginePhysics = (delta: number) => {");
  assert.match(defeat,/if \(bossDefeatedSequenceTimerRef.current <= 0\) \{\s*architectEncounterSlotRef.current = revokeBlackoutArchitectDormantEncounter\(\);/);
  const collision = between("const detectAndResolveCollisions = () => {", "// 2. ENEMIES CONTACT DAMAGE vs PLAYER CORE");
  assert.equal((collision.match(/bossDefeatedSequenceActiveRef.current = true;/g)||[]).length,2);
  assert.equal(collision.split(revoker).length-1,2);
  assert.equal((collision.match(/proj.life = 0;/g)||[]).length,3);
});

test("B2B2A keeps physics hot paths, frozen collision observer and other contracts unchanged", () => {
  for (const [start, stop] of [
    ["const gameLoop = (timestamp: number) => {", "const updateBossDefeatSequence = (delta: number) => {"],
    ["const updateEnginePhysics = (delta: number) => {", "const triggerResourceCollect = (res: Resource) => {"],
    ["const makeProjectile = (", "projectilesRef.current.push(makeProjectile(baseAngle))"],
  ]) assert.doesNotMatch(between(start,stop),/architectEncounterSlotRef|revokeBlackoutArchitectDormantEncounter/,start);
  const collision = between("const detectAndResolveCollisions = () => {", "// 2. ENEMIES CONTACT DAMAGE vs PLAYER CORE");
  assert.doesNotMatch(collision,/collisionTraceRunEpochRef|collisionTracePlayerShotRef|collisionTracePhysicsFrameRef/);
  for (const path of [
    "src/game/blackoutArchitectEncounterShotReservation.ts",
    "src/game/blackoutArchitectEncounterClaimPreflight.ts",
    "src/game/blackoutArchitectStructuralDirectHitProposal.ts",
    "src/game/bossChassis.ts", "src/game/types.ts"
  ]) assert.doesNotMatch(read(path),/blackoutArchitectDormantEncounterRevocation/,path);
});
