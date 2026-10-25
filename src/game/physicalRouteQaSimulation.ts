import {
  advancePhysicalRouteFrame,
  createPhysicalRouteFrame,
  planRouteOriginShift,
  type PhysicalRouteFrame,
  type RouteLocalPoint,
} from "./physicalRouteSpace";
import {
  ROUTE_PHYSICAL_CAMERA_ANCHOR_X,
  stepRoutePhysicalCamera,
  type RoutePhysicalCamera,
  type RoutePhysicalViewport,
} from "./routePhysicalCamera";
import { createRouteCursor } from "./worldRouteCore";
import {
  advanceRouteConvergenceQa,
  beginRouteConvergenceQa,
  createRouteConvergenceQaState,
  makeRouteConvergenceCalibrationTarget,
  registerRouteConvergenceHits,
  routeConvergenceWaveKey,
  type RouteConvergenceQaState,
} from "./routeConvergenceQa";
import { isConvergenceChanneling } from "./orbiConvergence";
import {
  createRouteWave1QaState,
  stepRouteWave1Qa,
  type RouteWave1QaState,
} from "./routeWave1Qa";
import { rebaseRouteCoordinateOwners } from "./routeCoordinateOwners";
import {
  beginRouteOverdriveQa,createRouteOverdriveQaState,
  endRouteOverdriveQa,type RouteOverdriveQaState,
} from "./routeOverdriveQa";
import { createRouteQaEncounter, stepRouteQaEncounter, type RouteQaEncounter } from "./routePhysicalQaEncounter";
import { createRouteDynamicQaState, stepRouteDynamicQaEncounter, type RouteDynamicQaState } from "./routeDynamicEncounter";
import {
  attachCanonicalQaWeapons,
  createRouteOrbiWeaponsQaState,
  stepRouteOrbiWeaponsQa,
  type RouteOrbiWeaponsQaState,
} from "./routeOrbiWeaponsQa";
import {
  activatePropulsionDash,
  stepRoutePropulsionDash,
} from "./propulsionDash";
import {
  createRouteCombatBridgeState,
  resolveRouteDashDirection,
  stepRouteCombatBridge,
  type RouteCombatBridgeState,
} from "./routeCombatBridge";
import {
  canAdvanceRoute,
  ROUTE_QA_SPEED_UNITS_PER_SECOND,
  stepRouteClock,
  type RouteRunGates,
} from "./worldRouteClock";

/**
 * UX15-C3A-2 — one genuine local player and one physical following camera.
 * This is an ISOLATED world traversal QA scene, not an EnergySwarmGame run.
 *
 * Only two spatial owners exist here: leader + camera. Atomic rebasing of
 * enemies / projectiles / ORBI / boss belongs to UX15-C3A-3 and C3B.
 */
export const ROUTE_PHYSICAL_QA_MANUAL_SPEED = 165;
export const ROUTE_PHYSICAL_QA_VERTICAL_MARGIN = 42;
export const ROUTE_PHYSICAL_QA_SEED = "asteria-physical-qa";

export interface PhysicalRouteQaState {
  readonly frame: PhysicalRouteFrame;
  readonly player: RouteLocalPoint;
  readonly camera: RoutePhysicalCamera;
  readonly encounter: RouteQaEncounter;
  readonly dynamic: RouteDynamicQaState | null;
  readonly bridge: RouteCombatBridgeState | null;
  readonly weapons: RouteOrbiWeaponsQaState | null;
  readonly impactFxEnabled:boolean;
  readonly overdriveQa:RouteOverdriveQaState|null;
  readonly convergenceQa:RouteConvergenceQaState|null;
  readonly wave1Qa:RouteWave1QaState|null;
  readonly rebases: number;
  readonly physicsTicks: number;
}

export interface PhysicalRouteQaInput {
  readonly x: number;
  readonly y: number;
}

export function createPhysicalRouteQaState(
  viewport: RoutePhysicalViewport,
  seed = ROUTE_PHYSICAL_QA_SEED,
  enableDynamicQa = false,
  enableCombatBridgeQa = false,
  enableOrbiWeaponsQa = false,
  enableImpactFxQa = false,
  enableOverdriveQa = false,
  enableConvergenceQa = false,
  enableWave1Qa = false,
): PhysicalRouteQaState {
  if(enableWave1Qa&&!enableConvergenceQa)
    throw new Error("Certified wave-1 QA requires C3B-6 Convergence lab");
  if(enableConvergenceQa&&!enableOverdriveQa)
    throw new Error("Physical Convergence QA requires C3B-5 Overdrive bridge");
  if(enableOverdriveQa&&!enableImpactFxQa)
    throw new Error("Physical Overdrive QA requires C3B-4 impact effects");
  if(enableImpactFxQa&&!enableOrbiWeaponsQa)
    throw new Error("Canonical impact FX requires C3B-3 weapons QA");
  if(enableOrbiWeaponsQa && !enableCombatBridgeQa){
    throw new Error("Canonical ORBI QA requires C3B-2 combat bridge");
  }
  if(enableCombatBridgeQa && !enableDynamicQa){
    throw new Error("Combat-bridge QA requires C3B-1 encounter flag");
  }
  const player = { x: 800, y: 480 };
  const camera = {
    localX: player.x - viewport.width * ROUTE_PHYSICAL_CAMERA_ANCHOR_X / viewport.zoom,
    localY: Math.max(0, player.y - viewport.height / (2 * viewport.zoom)),
  };
  // Validate viewport using the certified projection routine. Invalid zoom
  // or impossible sizes must not leak a half-constructed QA simulation.
  stepRoutePhysicalCamera(camera, player, viewport, 0);
  const encounter=createRouteQaEncounter(player);
  // C3B-1 is a separate opt-in. The C3A-3 lab keeps its fixed actors and
  // previous snapshots/tests unchanged unless this flag is explicitly true.
  if(enableDynamicQa){
    encounter.enemies=[];
    encounter.projectiles=[];
    encounter.resources=[];
  }
  if(enableCombatBridgeQa){
    // These placeholder C3A3 spatial owners are not certified hazards.
    // Remove them from combat-bridge QA; the boss/hazard gate stays strict.
    encounter.hazardZones=[];
    encounter.shieldNodes=[];
  }
  if(enableOrbiWeaponsQa){
    encounter.swarm=attachCanonicalQaWeapons(encounter.swarm);
  }
  if(enableConvergenceQa){
    encounter.enemies.push(makeRouteConvergenceCalibrationTarget(player));
  }
  return {
    frame: createPhysicalRouteFrame(createRouteCursor(seed)),
    player,
    camera,
    encounter,
    dynamic:enableDynamicQa?createRouteDynamicQaState():null,
    bridge:enableCombatBridgeQa?createRouteCombatBridgeState():null,
    weapons:enableOrbiWeaponsQa?createRouteOrbiWeaponsQaState():null,
    impactFxEnabled:enableImpactFxQa,
    overdriveQa:enableOverdriveQa?createRouteOverdriveQaState():null,
    convergenceQa:enableConvergenceQa?createRouteConvergenceQaState():null,
    wave1Qa:enableWave1Qa?createRouteWave1QaState():null,
    rebases: 0,
    physicsTicks: 0,
  };
}

export function stepPhysicalRouteQa(
  state: PhysicalRouteQaState,
  deltaMs: number,
  manualInput: PhysicalRouteQaInput,
  viewport: RoutePhysicalViewport,
  gates: RouteRunGates,
  dashRequested=false,
  overdriveRequested=false,
  chargeQaRequested=false,
  convergenceRequested=false,
): PhysicalRouteQaState {
  if (!Number.isFinite(deltaMs) || deltaMs < 0 ||
      !Number.isFinite(manualInput.x) || !Number.isFinite(manualInput.y)) {
    throw new RangeError("Invalid physical QA delta or direction");
  }
  if (!canAdvanceRoute(gates) || deltaMs === 0) return state;

  const dt = Math.min(50,deltaMs);
  const nextCursor = stepRouteClock(
    state.frame.cursor,
    dt,
    ROUTE_QA_SPEED_UNITS_PER_SECOND,
    gates,
  );
  const advancement = advancePhysicalRouteFrame(state.frame,nextCursor);
  let convergenceQa=state.convergenceQa;
  let activatedOverdrive=state.overdriveQa;
  if(convergenceQa&&activatedOverdrive&&convergenceRequested){
    const admitted=beginRouteConvergenceQa(
      convergenceQa,activatedOverdrive,state.encounter,state.player,
      state.frame.cursor.simulatedMs,
      state.wave1Qa?.waveKey??routeConvergenceWaveKey(state.frame.cursor.segmentOrdinal),
      true,state.bridge?.shield??0,
    );
    convergenceQa=admitted.convergenceQa;
    activatedOverdrive=admitted.overdriveQa;
  }
  const channeling=convergenceQa!==null &&
    isConvergenceChanneling(convergenceQa.convergence);
  // Manual input is a real addition to physical position; the scenery does
  // NOT impersonate it. Diagonal normalization prevents speed exploits.
  const length = Math.hypot(manualInput.x,manualInput.y);
  const norm = length > 1 ? 1 / length : 1;
  // Production Convergence channels at 70% normal manual speed.
  const movementFactor=channeling?.70:1;
  const manualDx = manualInput.x * norm * ROUTE_PHYSICAL_QA_MANUAL_SPEED * movementFactor * dt / 1000;
  const manualDy = manualInput.y * norm * ROUTE_PHYSICAL_QA_MANUAL_SPEED * movementFactor * dt / 1000;
  let bridge=state.bridge;
  let dashDisplacement:{x:number;y:number}|null=null;
  if(bridge){
    const direction=resolveRouteDashDirection(manualInput,bridge.lastDashDirection);
    const stateDash=dashRequested&&!channeling
      ? activatePropulsionDash(bridge.dash,state.frame.cursor.simulatedMs,direction).state
      : bridge.dash;
    const dashStep=stepRoutePropulsionDash(
      stateDash,nextCursor.simulatedMs,dt,state.player,
      {height:960,radius:ROUTE_PHYSICAL_QA_VERTICAL_MARGIN},
    );
    if(dashStep.activeDuringFrame&&!channeling){
      dashDisplacement={
        x:dashStep.position.x-state.player.x,
        y:dashStep.position.y-state.player.y,
      };
    }
    bridge={...bridge,dash:stateDash,lastDashDirection:direction};
  }
  let player = {
    x:state.player.x+advancement.movedX+
      (dashDisplacement?.x??manualDx),
    y:Math.max(ROUTE_PHYSICAL_QA_VERTICAL_MARGIN,
      Math.min(960-ROUTE_PHYSICAL_QA_VERTICAL_MARGIN,
        state.player.y+(dashDisplacement?.y??manualDy))),
  };
  let camera = stepRoutePhysicalCamera(
    state.camera,player,viewport,dt,
  ).camera;
  let frame = advancement.frame;
  let encounter = stepRouteQaEncounter(state.encounter, player);
  let dynamic=state.dynamic;
  let weapons=state.weapons;
  let overdriveQa=activatedOverdrive
    ?beginRouteOverdriveQa(activatedOverdrive,
      frame.cursor.simulatedMs,overdriveRequested&&!channeling,
      chargeQaRequested)
    :null;
  if(convergenceQa&&overdriveQa){
    const resolved=advanceRouteConvergenceQa(
      convergenceQa,encounter,player,frame.cursor.simulatedMs,
      state.wave1Qa?.waveKey??routeConvergenceWaveKey(frame.cursor.segmentOrdinal),
      bridge?.shield??0,
    );
    convergenceQa=resolved.convergenceQa;
    encounter=resolved.encounter;
  }
  if(dynamic){
    const next=stepRouteDynamicQaEncounter(
      encounter,dynamic,player,camera,viewport,dt,frame.cursor.simulatedMs,
      bridge!==null,weapons!==null,state.impactFxEnabled,
      convergenceQa!==null,state.wave1Qa!==null,
    );
    encounter=next.encounter;
    dynamic=next.dynamic;
    if(convergenceQa){
      convergenceQa=registerRouteConvergenceHits(
        convergenceQa,next.convergenceHits,next.convergenceKills,
      );
    }
    if(overdriveQa){
      // Only confirmed kills, not speculative enemy proximity or drops,
      // can fill real resonance via the canonical resonance authority.
      overdriveQa=endRouteOverdriveQa(overdriveQa,
        frame.cursor.simulatedMs,next.defeats,0);
    }
  }
  let wave1Qa=state.wave1Qa;
  if(wave1Qa){
    const paced=stepRouteWave1Qa(wave1Qa,encounter,player,camera,viewport,
      frame.cursor.simulatedMs);
    wave1Qa=paced.wave;
    encounter=paced.encounter;
  }
  if(weapons){
    const volley=stepRouteOrbiWeaponsQa(
      encounter,weapons,dt,undefined,overdriveQa?.overdrive.active??false,
    );
    encounter=volley.encounter;
    weapons=volley.weapons;
    if(bridge){
      bridge={...bridge,shield:Math.min(100,
        bridge.shield+volley.restoredShield)};
    }
  }
  if(bridge){
    const beforeHits=bridge.contactHits;
    bridge=stepRouteCombatBridge(
      encounter,bridge,player,frame.cursor.simulatedMs,
    );
    if(overdriveQa && bridge.contactHits>beforeHits){
      overdriveQa=endRouteOverdriveQa(overdriveQa,
        frame.cursor.simulatedMs,[],bridge.contactHits-beforeHits);
    }
  }
  let rebases = state.rebases;
  const deltaX = planRouteOriginShift(frame,player.x);
  if (deltaX !== null) {
    // C3A-3: one atomic rebase for all controlled encounter owners.
    // Clone first: previous simulation snapshots remain immutable to tests/UI.
    encounter = structuredClone(encounter);
    // The physical beam trail is an EXTRA X-coordinate owner. Register a
    // clone as part of the very SAME atomic transaction rather than shifting
    // visual effects later with a second independent coordinate calculation.
    const beamTrail=convergenceQa?.convergence.trail
      ?{...convergenceQa.convergence.trail}:null;
    const transaction = rebaseRouteCoordinateOwners({
      ...encounter, frame, player, camera,
      extraWorldAnchors:beamTrail
        ?[...encounter.extraWorldAnchors,beamTrail]
        :encounter.extraWorldAnchors,
    },deltaX,{
      phase:"TICK_BOUNDARY",unresolvedBossPhase:false,unregisteredWorldOwners:false,
    });
    frame = transaction.frame;
    if(beamTrail&&convergenceQa){
      convergenceQa={...convergenceQa,
        convergence:{...convergenceQa.convergence,trail:beamTrail}};
    }
    rebases++;
  }
  return {
    frame,
    player,
    camera,
    encounter,
    dynamic,
    bridge,
    weapons,
    impactFxEnabled:state.impactFxEnabled,
    overdriveQa,
    convergenceQa,
    wave1Qa,
    rebases,
    physicsTicks: state.physicsTicks + 1,
  };
}
