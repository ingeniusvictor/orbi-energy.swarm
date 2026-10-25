import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = file => readFileSync(new URL("../" + file, import.meta.url), "utf8");
const engine = read("src/game/EnergySwarmGame.tsx");
const start = read("src/components/StartScreen.tsx");
const mobile = read("src/components/MobileLaunchNavigation.tsx");
const cinematic = read("src/components/PremiumNativeNavigation.tsx");
const artwork = read("src/components/presentation/PremiumMissionArtwork.tsx");
const browser = read("scripts/web-ux01-browser-evidence.mjs");

test("UX15-C2A presents a genuine fourth World Traversal choice across all three launcher surfaces", () => {
  assert.match(start,/onStartWorldRoute: \(\) => void;/);
  assert.match(start,/onWorldRoute=\{\(\) => \{ playClickSound\(\); onStartWorldRoute\(\); \}\}/);
  assert.match(start,/data-world-route-start-cta="true"/);
  assert.match(mobile,/id: "WORLD_ROUTE" as const/);
  assert.match(mobile,/action: onWorldRoute/);
  assert.match(mobile,/onWorldRoute=\{onWorldRoute\}/);
  assert.match(mobile,/orbi-mobile-world-route/);
  assert.match(cinematic,/key: "route"/);
  assert.match(cinematic,/onClick=\{mode\.key === "campaign" \? onPlay : mode\.key === "route" \? onWorldRoute : onScoreAttack\}/);
  assert.match(cinematic,/orbi-mobile-world-route/);
  assert.match(artwork,/\| "route";/);
  assert.match(artwork,/scene==="route"/);
  assert.match(artwork,/orbi-ux15-world-route-art/);
  assert.match(start,/TRAVESÍA DE MUNDOS/);
  assert.match(mobile,/WORLD TRAVERSAL/);
});

test("UX15-C2A World Traversal is independent of plain Campaign & Score, but explicitly reuses campaign rules during beta", () => {
  assert.match(engine,/const startCampaignGame = \(\) => \{[\s\S]*startGameWithMode\("CAMPAIGN"\)/);
  assert.match(engine,/const startWorldRouteGame = \(\) => \{[\s\S]*startGameWithMode\("CAMPAIGN", true\)/);
  assert.match(engine,/worldRouteRunActiveRef\.current = mode === "CAMPAIGN" && worldRoute/);
  assert.match(engine,/scoreAttackActivationRef\.current = activation;/);
  assert.match(engine,/onStartWorldRoute=\{startWorldRouteGame\}/);
  assert.match(engine,/data-selected-game-mode=\{worldRouteSelected \? "WORLD_ROUTE" : presentationMode\}/);
  assert.match(engine,/const asteriaCombatVisualActive = worldRouteRunActiveRef\.current/);
});

test("UX15-C2A route persistence is run-owned and is NOT reset by upgrade cards, sector or Infinite handoff", () => {
  assert.match(engine,/const worldRouteRunActiveRef = useRef\(false\)/);
  assert.match(engine,/if \(worldRouteRunActiveRef\.current\) \{[\s\S]*stepRouteClock/);
  assert.doesNotMatch(engine,/currentWaveRef\.current <= 2/);
  assert.doesNotMatch(engine,/asteriaCombatVisualActive\s*=\s*asteriaLiveQaRequested/);
  assert.match(engine,/const asteriaCombatVisualActive = worldRouteRunActiveRef\.current/);
  assert.match(engine,/upgradeOpen: isUpgradeSelectionOpen/);
  assert.match(engine,/modalOpen: mobilePanel !== "closed"/);
  assert.match(engine,/startGameWithMode\(presentationMode\)/);
  assert.match(engine,/worldRouteRunActiveRef\.current = false;\s*setWorldRouteSelected\(false\)/);
});

test("UX15-C2A browser proof enters fourth mode through native UI with no URL query or fake QA marker", () => {
  assert.match(browser,/async function runAsteriaCombat/);
  assert.match(browser,/getByTestId\("orbi-mobile-world-route"\)\.click\(\)/);
  assert.match(browser,/data-world-route-start-cta="true"/);
  assert.match(browser,/data-selected-game-mode="WORLD_ROUTE"/);
  assert.match(browser,/ux15-route-distance/);
});
