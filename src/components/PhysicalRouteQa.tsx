import React, { useEffect, useRef, useState } from "react";
import {
  createPhysicalRouteQaState,
  stepPhysicalRouteQa,
  type PhysicalRouteQaState,
} from "../game/physicalRouteQaSimulation";
import {
  routeLocalToScreen,
  type RoutePhysicalViewport,
} from "../game/routePhysicalCamera";
import {
  drawAsteriaPremiumWorld,
  preloadAsteriaPremiumWorld,
} from "../game/asteriaPremiumRenderer";
import { drawWorldRouteQaScene } from "../game/worldRoutePreviewRenderer";
import { drawFoton } from "../game/EnergySwarmCanvas";
import { drawSwarmRoster, drawEnemiesList, drawProjectilesList, drawResources } from "../game/EnergySwarmCanvas";
import {
  disposeFotonGameplay3D,
  getFotonGameplay3DStatus,
  prewarmFotonGameplay3D,
} from "../game/fotonGameplay3DRenderer";
import { QualityPreset } from "../game/types";
import { projectRouteDistance } from "../game/worldRouteCore";
import { projectPropulsionDash } from "../game/propulsionDash";
import { projectRouteOverdriveQa } from "../game/routeOverdriveQa";
import { drawOrbiConvergence } from "../game/orbiConvergenceRenderer";
import { projectRouteConvergenceQa,routeConvergenceWaveKey } from "../game/routeConvergenceQa";
import { projectCombatOverdrivePresentation } from "../game/combatOverdrivePresentation";
import "../styles/ux15RouteQa.css";

type QaTelemetry = {
  distance: number; ordinal: number; playerX: number; playerY: number;
  cameraX: number; originEpoch: number; originOffsetX: number; rebases: number;
  physicsTicks: number; glb: string;
  orbiX: number; enemyX: number; shotX: number; resourceX: number;
  spawned: number; culled: number; activeEnemies: number;
  hits: number; destroyed: number; pickups: number; activeShots: number;
  shield: number; contactHits: number; indexedEnemies:number;
  dashActivatedAtMs:number; dashCooldownMs:number; nearestEnemyDistance:number;
  orbiShots:number; orbiEchoes:number; orbiTargets:number; orbiSupport:number;
  splashHits:number; slows:number; pushes:number; pulls:number; areaKills:number;
  resonance:number; chain:number; overdriveActive:boolean;
  overdriveRemainingMs:number; overdriveMultiplier:number;
  overdriveReady:boolean; overdriveLockMs:number;
  overdriveActivations:number; qaCharges:number;creditedDefeats:number;damageBreaks:number;
  convergenceReady:boolean;convergenceChanneling:boolean;
  convergenceChannelMs:number;convergenceCooldownMs:number;
  convergenceUsedWave:boolean;convergenceActivations:number;
  convergenceBeams:number;convergenceHits:number;convergenceKills:number;
  convergenceCancels:number;
};
const initialTelemetry = (): QaTelemetry => ({
  distance: 0, ordinal: 0, playerX: 800, playerY: 480,
  cameraX: 464, originEpoch: 0, originOffsetX: 0, rebases: 0, physicsTicks: 0, glb: "LOADING",
  orbiX: 0, enemyX: 0, shotX: 0, resourceX: 0,
  spawned:0,culled:0,activeEnemies:0,hits:0,destroyed:0,pickups:0,activeShots:0,
  shield:100,contactHits:0,indexedEnemies:0,dashActivatedAtMs:-1,
  dashCooldownMs:0,nearestEnemyDistance:-1,
  orbiShots:0,orbiEchoes:0,orbiTargets:0,orbiSupport:0,
  splashHits:0,slows:0,pushes:0,pulls:0,areaKills:0,
  resonance:0,chain:0,overdriveActive:false,overdriveRemainingMs:0,
  overdriveMultiplier:1,overdriveReady:false,overdriveLockMs:0,
  overdriveActivations:0,qaCharges:0,creditedDefeats:0,damageBreaks:0,
  convergenceReady:false,convergenceChanneling:false,
  convergenceChannelMs:0,convergenceCooldownMs:0,
  convergenceUsedWave:false,convergenceActivations:0,
  convergenceBeams:0,convergenceHits:0,convergenceKills:0,
  convergenceCancels:0,
});
const routeParams=typeof window !== "undefined"
  ? new URLSearchParams(window.location.search):new URLSearchParams();
const c3bPreviewEnabled=routeParams.get("ux15-c3b")==="1";
const c3b2Enabled=c3bPreviewEnabled && routeParams.get("ux15-c3b2")==="1";
const c3b3Enabled=c3b2Enabled && routeParams.get("ux15-c3b3")==="1";
const c3b4Enabled=c3b3Enabled && routeParams.get("ux15-c3b4")==="1";
const c3b5Enabled=c3b4Enabled && routeParams.get("ux15-c3b5")==="1";
const c3b6Enabled=c3b5Enabled && routeParams.get("ux15-c3b6")==="1";
const arrowKeys = new Set(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"]);

/**
 * Explicit, isolated QA harness: a REAL local physics-coordinate ENERGY and
 * following camera draw with the same in-game GLB Canvas compositor.
 *
 * Not a live game run. Never imports EnergySwarmGame or drives enemies,
 * projectiles, resources, bosses, stats, score, rewards or campaign state.
 */
export default function PhysicalRouteQa() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<RoutePhysicalViewport>({ width: 800, height: 480, zoom: 1 });
  const stateRef = useRef<PhysicalRouteQaState>(createPhysicalRouteQaState(viewportRef.current,undefined,c3bPreviewEnabled,c3b2Enabled,c3b3Enabled,c3b4Enabled,c3b5Enabled,c3b6Enabled));
  const controlsRef = useRef(new Set<string>());
  const dashRequestedRef=useRef(false);
  const overdriveRequestedRef=useRef(false);
  const chargeQaRequestedRef=useRef(false);
  const convergenceRequestedRef=useRef(false);
  const pointerRef = useRef<{ id:number; startX:number; startY:number; x:number; y:number } | null>(null);
  const runningRef = useRef(true);
  const drawRef = useRef<() => void>(() => {});
  const [running, setRunning] = useState(true);
  const [locale,setLocale] = useState<"es" | "en">("es");
  const [reduced,setReduced] = useState(false);
  const [telemetry,setTelemetry] = useState<QaTelemetry>(initialTelemetry);

  const publishTelemetry = () => {
    const s=stateRef.current;
    const projection=s.overdriveQa?projectRouteOverdriveQa(
      s.overdriveQa,s.frame.cursor.simulatedMs):null;
    const conv=s.convergenceQa&&s.overdriveQa
      ?projectRouteConvergenceQa(
        s.convergenceQa,s.overdriveQa,s.encounter,s.player,
        s.frame.cursor.simulatedMs,
        routeConvergenceWaveKey(s.frame.cursor.segmentOrdinal),
        s.bridge?.shield??0,
      ):null;
    setTelemetry({
      convergenceReady:conv?.canActivate??false,
      convergenceChanneling:conv?.channeling??false,
      convergenceChannelMs:conv?.channelRemainingMs??0,
      convergenceCooldownMs:conv?.cooldownRemainingMs??0,
      convergenceUsedWave:conv?.usedThisWave??false,
      convergenceActivations:s.convergenceQa?.activations??0,
      convergenceBeams:s.convergenceQa?.beams??0,
      convergenceHits:s.convergenceQa?.registeredHits??0,
      convergenceKills:s.convergenceQa?.registeredKills??0,
      convergenceCancels:s.convergenceQa?.cancellations??0,
      resonance:projection?.resonance??0,
      chain:projection?.chain??0,
      overdriveActive:projection?.active??false,
      overdriveRemainingMs:projection?.remainingMs??0,
      overdriveMultiplier:projection?.damageMultiplier??1,
      overdriveReady:projection?.canActivate??false,
      overdriveLockMs:projection?.reentryRemainingMs??0,
      overdriveActivations:s.overdriveQa?.activations??0,
      qaCharges:s.overdriveQa?.debugCharges??0,
      creditedDefeats:s.overdriveQa?.creditedDefeats??0,
      damageBreaks:s.overdriveQa?.damageBreaks??0,
      distance:projectRouteDistance(s.frame.cursor),
      ordinal:s.frame.cursor.segmentOrdinal,
      playerX:s.player.x, playerY:s.player.y,
      cameraX:s.camera.localX, originEpoch:s.frame.originEpoch,
      originOffsetX:s.frame.originOffsetX,
      rebases:s.rebases,physicsTicks:s.physicsTicks,
      glb:getFotonGameplay3DStatus(),
      orbiX:s.encounter.swarm[0].x,
      enemyX:s.encounter.enemies[0]?.x??0,
      shotX:s.encounter.projectiles[0]?.x??0,
      resourceX:s.encounter.resources[0]?.x??0,
      spawned:s.dynamic?.spawned??0,
      culled:s.dynamic?.culled??0,
      activeEnemies:s.encounter.enemies.length,
      hits:s.dynamic?.hits??0,
      destroyed:s.dynamic?.destroyed??0,
      pickups:s.dynamic?.pickups??0,
      activeShots:s.encounter.projectiles.length,
      shield:s.bridge?.shield??100,
      contactHits:s.bridge?.contactHits??0,
      indexedEnemies:s.bridge?.spatialEnemyCount??0,
      dashActivatedAtMs:s.bridge?.dash.activatedAtMs??-1,
      dashCooldownMs:s.bridge
        ?projectPropulsionDash(s.bridge.dash,s.frame.cursor.simulatedMs).cooldownRemainingMs
        :0,
      nearestEnemyDistance:s.bridge?.nearestDistance??-1,
      orbiShots:s.weapons?.projectilesFired??0,
      orbiEchoes:s.weapons?.echoShots??0,
      orbiTargets:s.weapons?.targetsAcquired??0,
      orbiSupport:s.weapons?.supportRestored??0,
      splashHits:s.dynamic?.splashHits??0,
      slows:s.dynamic?.slowedHits??0,
      pushes:s.dynamic?.pushes??0,
      pulls:s.dynamic?.magneticPulls??0,
      areaKills:s.dynamic?.areaKills??0,
    });
  };

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d",{alpha:false});
    if(!ctx)return;
    let disposed=false;
    let frame=0,last=0,lastPaint=0,paintCounter=0;
    const dpr=Math.min(2,Math.max(1,window.devicePixelRatio||1));
    const prefersReduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduce);
    preloadAsteriaPremiumWorld();
    prewarmFotonGameplay3D(QualityPreset.MEDIUM);

    const draw=()=>{
      const s=stateRef.current;
      const view=viewportRef.current;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.fillStyle="#04101c";
      ctx.fillRect(0,0,view.width,480);
      if(!drawAsteriaPremiumWorld(ctx,s.frame.cursor,view.width)){
        drawWorldRouteQaScene(ctx,s.frame.cursor,{manualX:0,y:240},view.width,false);
      }

      // World-anchored technical fiducials: their screen position changes
      // only when the PHYSICAL camera follows the PHYSICAL player, never as
      // an invented CSS/parallax-only motion.
      ctx.save();
      const absoluteLeft=s.frame.originOffsetX+s.camera.localX;
      const first=Math.floor(absoluteLeft/280)-1;
      const marks=Math.ceil(view.width/(280*view.zoom))+4;
      ctx.strokeStyle="rgba(117,241,245,.52)";
      ctx.fillStyle="rgba(16,44,59,.62)";
      ctx.lineWidth=1.5;
      for(let j=0;j<marks;j++){
        const id=first+j;
        const localX=id*280-s.frame.originOffsetX;
        const point=routeLocalToScreen({x:localX,y:570},s.camera,view);
        ctx.beginPath();
        ctx.ellipse(point.x,point.y,10,4,0,0,Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(point.x,point.y-16);
        ctx.lineTo(point.x,point.y+16);
        ctx.stroke();
      }
      ctx.restore();

      // Draw actual game actors in one physical coordinate frame. Their
      // positions remain world-anchored through floating-origin rebases.
      // This is the actual gameplay ENERGY compositor, NOT a gold QA marker.
      ctx.save();
      ctx.scale(view.zoom,view.zoom);
      ctx.translate(-s.camera.localX,-s.camera.localY);
      drawResources(ctx,s.encounter.resources,s.frame.cursor.simulatedMs,s.player,"MINIMAL");
      drawEnemiesList(ctx,s.encounter.enemies,s.frame.cursor.simulatedMs,s.player);
      if(c3b4Enabled){
        // Cyan control halo around physically slowed targets. This follows
        // enemy-local coordinates, including atomic floating-origin rebases.
        for(const enemy of s.encounter.enemies){
          if((enemy.slowTimer??0)<=0)continue;
          ctx.save();
          ctx.strokeStyle="rgba(56,216,237,.75)";
          ctx.lineWidth=2;
          ctx.beginPath();
          ctx.arc(enemy.x,enemy.y,enemy.size+8,0,Math.PI*2);
          ctx.stroke();
          ctx.restore();
        }
      }
      drawProjectilesList(ctx,s.encounter.projectiles);
      drawSwarmRoster(ctx,s.encounter.swarm,s.frame.cursor.simulatedMs);
      if(c3b6Enabled&&s.convergenceQa){
        // Reuse exact UX14-B Canvas2D renderer and its bounded six-hit
        // beam/24-link channel presentation in physical camera coordinates.
        drawOrbiConvergence(
          ctx,s.convergenceQa.convergence,
          s.frame.cursor.simulatedMs,s.player,s.encounter.swarm,false,
        );
      }
      if(c3b5Enabled && s.overdriveQa){
        const status=projectRouteOverdriveQa(s.overdriveQa,s.frame.cursor.simulatedMs);
        const fx=projectCombatOverdrivePresentation({
          active:status.active,
          remainingRatio:status.remainingMs/8000,
          qualityPreset:QualityPreset.MEDIUM,
        });
        if(fx.active){
          ctx.save();
          ctx.strokeStyle=`rgba(110,228,255,${fx.swarmHaloAlpha})`;
          ctx.lineWidth=2.5;
          for(let i=0;i<fx.ringCount;i++){
            ctx.beginPath();
            ctx.arc(s.player.x,s.player.y,44+i*13,0,Math.PI*2);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      drawFoton(ctx,s.player,0,s.frame.cursor.simulatedMs,
        {x:s.player.x+120,y:s.player.y},
        false,undefined,(s.bridge?.shield??100)/100,QualityPreset.MEDIUM,false,
        {x:-1,y:0},0,0);
      ctx.restore();

      ctx.save();
      ctx.font="700 12px system-ui, sans-serif";
      ctx.fillStyle="rgba(3,16,30,.78)";
      ctx.fillRect(12,11,330,32);
      ctx.fillStyle="#8ff5ec";
      ctx.fillText(c3b6Enabled
        ? "C3B-6 · CANONICAL ORBI CONVERGENCE QA"
        :c3b5Enabled
        ? "C3B-5 · COMBAT RESONANCE + OVERDRIVE QA"
        :c3b4Enabled
        ? "C3B-4 · AREA / SLOW / PUSH / MAGNET QA"
        :c3b3Enabled
        ? "C3B-3 · 10 CANONICAL ORBI ATTACK PROFILES"
        :c3b2Enabled
        ? "C3B-2 · DASH + CONTACT · QA SHIELD"
        :c3bPreviewEnabled
        ? "C3B-1 · ROUTE ENCOUNTER QA · NO LIVE REWARDS"
        : "PHYSICAL QA · CONTROLLED ACTORS · NO DAMAGE",22,32);
      ctx.restore();
    };
    drawRef.current=draw;
    const resize=()=>{
      const compact=window.matchMedia("(orientation: landscape) and (max-height: 440px)").matches;
      const availableWidth=Math.min(1020,Math.max(320,window.innerWidth-(compact?12:24)));
      const maxHeight=compact?window.innerHeight*.56:Math.min(window.innerHeight*.64,640);
      const stageHeight=Math.min(maxHeight,availableWidth*480/800);
      const logicalWidth=Math.min(2400,Math.max(800,
        Math.round(480*availableWidth/Math.max(1,stageHeight))));
      viewportRef.current={width:logicalWidth,height:480,zoom:1};
      if(stateRef.current.physicsTicks===0) {
        stateRef.current=createPhysicalRouteQaState(viewportRef.current,undefined,c3bPreviewEnabled,c3b2Enabled,c3b3Enabled,c3b4Enabled,c3b5Enabled,c3b6Enabled);
      }
      canvas.dataset.logicalWidth=String(logicalWidth);
      canvas.dataset.logicalHeight="480";
      canvas.width=Math.round(logicalWidth*dpr);
      canvas.height=Math.round(480*dpr);
      draw();
      publishTelemetry();
    };
    const keyDown=(e:KeyboardEvent)=>{
      const k=e.key.toLowerCase();
      if(c3b2Enabled && (e.code==="Space" || k===" ")){
        e.preventDefault();
        if(!e.repeat)dashRequestedRef.current=true;
      }
      if(c3b6Enabled&&k==="c"){
        e.preventDefault();
        if(!e.repeat)convergenceRequestedRef.current=true;
      }
      if(c3b5Enabled&&k==="o"){
        e.preventDefault();
        if(!e.repeat)overdriveRequestedRef.current=true;
      }
      if(arrowKeys.has(k)){e.preventDefault();controlsRef.current.add(k);}
    };
    const keyUp=(e:KeyboardEvent)=>controlsRef.current.delete(e.key.toLowerCase());
    const clearInput=()=>{
      controlsRef.current.clear();pointerRef.current=null;
      dashRequestedRef.current=false;overdriveRequestedRef.current=false;
      chargeQaRequestedRef.current=false;
      convergenceRequestedRef.current=false;
    };
    const onVisibility=()=>{last=0;if(document.hidden)clearInput();};
    const tick=(now:number)=>{
      if(disposed)return;
      frame=requestAnimationFrame(tick);
      const dt=last?Math.min(50,Math.max(0,now-last)):0;
      last=now;
      let x=0,y=0;
      if(controlsRef.current.has("a")||controlsRef.current.has("arrowleft"))x--;
      if(controlsRef.current.has("d")||controlsRef.current.has("arrowright"))x++;
      if(controlsRef.current.has("w")||controlsRef.current.has("arrowup"))y--;
      if(controlsRef.current.has("s")||controlsRef.current.has("arrowdown"))y++;
      if(pointerRef.current){x+=pointerRef.current.x;y+=pointerRef.current.y;}
      const gates={
        playing:!prefersReduce,
        paused:!runningRef.current,
        hidden:document.hidden,
        modalOpen:false,upgradeOpen:false,hitstop:false,
      };
      stateRef.current=stepPhysicalRouteQa(
        stateRef.current,dt,{x,y},viewportRef.current,
        gates,c3b2Enabled && dashRequestedRef.current,
        c3b5Enabled && overdriveRequestedRef.current,
        c3b5Enabled && chargeQaRequestedRef.current,
        c3b6Enabled && convergenceRequestedRef.current,
      );
      if(dt>0 && gates.playing && !gates.paused && !gates.hidden){
        dashRequestedRef.current=false;
        overdriveRequestedRef.current=false;
        chargeQaRequestedRef.current=false;
        convergenceRequestedRef.current=false;
      }
      if(now-lastPaint>=1000/30){
        lastPaint=now;
        draw();
        if(++paintCounter%8===0)publishTelemetry();
      }
    };

    window.addEventListener("resize",resize);
    window.addEventListener("keydown",keyDown);
    window.addEventListener("keyup",keyUp);
    window.addEventListener("blur",clearInput);
    document.addEventListener("visibilitychange",onVisibility);
    resize();
    frame=requestAnimationFrame(tick);
    return()=>{
      disposed=true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize",resize);
      window.removeEventListener("keydown",keyDown);
      window.removeEventListener("keyup",keyUp);
      window.removeEventListener("blur",clearInput);
      document.removeEventListener("visibilitychange",onVisibility);
      clearInput();
      drawRef.current=()=>{};
      disposeFotonGameplay3D();
    };
  },[]);

  const reset=()=>{
    stateRef.current=createPhysicalRouteQaState(viewportRef.current,undefined,c3bPreviewEnabled,c3b2Enabled,c3b3Enabled,c3b4Enabled,c3b5Enabled,c3b6Enabled);
    controlsRef.current.clear();
    pointerRef.current=null;
    dashRequestedRef.current=false;
    overdriveRequestedRef.current=false;
    chargeQaRequestedRef.current=false;
    convergenceRequestedRef.current=false;
    drawRef.current();
    publishTelemetry();
  };
  const onPointerDown=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerRef.current={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:0,y:0};
  };
  const onPointerMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    const p=pointerRef.current;
    if(!p||p.id!==e.pointerId)return;
    p.x=Math.max(-1,Math.min(1,(e.clientX-p.startX)/55));
    p.y=Math.max(-1,Math.min(1,(e.clientY-p.startY)/55));
  };
  const onPointerUp=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    if(pointerRef.current?.id===e.pointerId)pointerRef.current=null;
    if(e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  return (
    <main className="ux15-route-qa ux15-physical-qa" data-testid="ux15-physical-qa"
      data-qa-mode={c3b6Enabled?"PHYSICAL_ROUTE_C3B6_QA":c3b5Enabled?"PHYSICAL_ROUTE_C3B5_QA":c3b4Enabled?"PHYSICAL_ROUTE_C3B4_QA":c3b3Enabled?"PHYSICAL_ROUTE_C3B3_QA":c3b2Enabled?"PHYSICAL_ROUTE_C3B2_QA":c3bPreviewEnabled?"PHYSICAL_ROUTE_C3B1_QA":"PHYSICAL_ROUTE_ISOLATED"}
      data-c3b6-ready={String(telemetry.convergenceReady)}
      data-c3b6-channeling={String(telemetry.convergenceChanneling)}
      data-c3b6-channel-ms={Math.round(telemetry.convergenceChannelMs)}
      data-c3b6-cooldown-ms={Math.round(telemetry.convergenceCooldownMs)}
      data-c3b6-used-wave={String(telemetry.convergenceUsedWave)}
      data-c3b6-activations={telemetry.convergenceActivations}
      data-c3b6-beams={telemetry.convergenceBeams}
      data-c3b6-hits={telemetry.convergenceHits}
      data-c3b6-kills={telemetry.convergenceKills}
      data-c3b6-cancelled={telemetry.convergenceCancels}
      data-c3b5-resonance={telemetry.resonance}
      data-c3b5-chain={telemetry.chain}
      data-c3b5-overdrive-active={String(telemetry.overdriveActive)}
      data-c3b5-overdrive-remaining-ms={Math.round(telemetry.overdriveRemainingMs)}
      data-c3b5-damage-multiplier={telemetry.overdriveMultiplier}
      data-c3b5-ready={String(telemetry.overdriveReady)}
      data-c3b5-reentry-lock-ms={Math.round(telemetry.overdriveLockMs)}
      data-c3b5-activations={telemetry.overdriveActivations}
      data-c3b5-debug-charges={telemetry.qaCharges}
      data-c3b5-credited-defeats={telemetry.creditedDefeats}
      data-c3b5-damage-breaks={telemetry.damageBreaks}
      data-c3b4-splash-hits={telemetry.splashHits}
      data-c3b4-slows={telemetry.slows}
      data-c3b4-pushes={telemetry.pushes}
      data-c3b4-magnetic-pulls={telemetry.pulls}
      data-c3b4-area-kills={telemetry.areaKills}
      data-c3b3-orbi-shots={telemetry.orbiShots}
      data-c3b3-orbi-echoes={telemetry.orbiEchoes}
      data-c3b3-orbi-targets={telemetry.orbiTargets}
      data-c3b3-orbi-support={telemetry.orbiSupport.toFixed(2)}
      data-c3b2-shield={telemetry.shield}
      data-c3b2-contact-hits={telemetry.contactHits}
      data-c3b2-spatial-enemies={telemetry.indexedEnemies}
      data-c3b2-dash-activated-at={telemetry.dashActivatedAtMs}
      data-c3b2-dash-cooldown-ms={Math.round(telemetry.dashCooldownMs)}
      data-c3b2-nearest-enemy={telemetry.nearestEnemyDistance.toFixed(2)}
      data-c3b-spawned={telemetry.spawned}
      data-c3b-culled={telemetry.culled}
      data-c3b-active-enemies={telemetry.activeEnemies}
      data-c3b-active-shots={telemetry.activeShots}
      data-c3b-hits={telemetry.hits}
      data-c3b-destroyed={telemetry.destroyed}
      data-c3b-pickups={telemetry.pickups}
      data-route-distance={telemetry.distance.toFixed(2)}
      data-player-local-x={telemetry.playerX.toFixed(2)}
      data-player-local-y={telemetry.playerY.toFixed(2)}
      data-camera-local-x={telemetry.cameraX.toFixed(2)}
      data-origin-epoch={telemetry.originEpoch}
      data-origin-offset-x={telemetry.originOffsetX.toFixed(2)}
      data-rebase-count={telemetry.rebases}
      data-orbi-local-x={telemetry.orbiX.toFixed(2)}
      data-enemy-local-x={telemetry.enemyX.toFixed(2)}
      data-shot-local-x={telemetry.shotX.toFixed(2)}
      data-resource-local-x={telemetry.resourceX.toFixed(2)}
      data-physics-ticks={telemetry.physicsTicks}
      data-glb-status={telemetry.glb}>
      <header className="ux15-route-qa__header">
        <div>
          <span className="ux15-route-qa__eyebrow">ORBI ENERGY SWARM · {c3b6Enabled?"UX15-C3B-6":c3b5Enabled?"UX15-C3B-5":c3b4Enabled?"UX15-C3B-4":c3b3Enabled?"UX15-C3B-3":c3b2Enabled?"UX15-C3B-2":c3bPreviewEnabled?"UX15-C3B-1":"UX15-C3A-3"}</span>
          <h1>{locale==="es"?"LABORATORIO DE TRAVESÍA FÍSICA":"PHYSICAL TRAVERSAL LAB"}</h1>
          <p>{locale==="es"
            ?(c3b6Enabled
              ?"Convergencia ORBI canónica: carga resonancia QA, apunta con C y canaliza un rayo de 800 ms. Exclusiva del laboratorio."
              :c3b5Enabled
              ?"Resonancia y Overdrive reales en QA: derrota enemigos para cargar, activa con O. Carga QA opcional sin puntuación ni progreso."
              :c3b4Enabled
              ?"Impactos ORBI físicos: explosiones, ralentización, empuje y magnetismo. Prototipo aislado, sin premios de campaña."
              :c3b3Enabled
              ?"ORBI canónicos con diez perfiles de ataque y selección espacial real de objetivos. Disparos experimentales y sin recompensas de partida."
              :c3b2Enabled
              ?"Puente físico QA: Dash auténtico sin paredes horizontales y detección de contacto con índice espacial real. Sin pérdida de estadísticas ni recompensas."
              :c3bPreviewEnabled
              ?"Encuentro físico QA: enemigos aparecen fuera de cámara, persiguen a ENERGY y reciben impactos. Sin recompensas ni combate de campaña."
              :"ENERGY, cámara y 30 ORBI recorren ASTERIA junto a enemigos, balas y recursos controlados. Sin daño ni recompensas.")
            :(c3b6Enabled
              ?"Canonical ORBI Convergence: charge QA resonance, press C to channel an 800ms beam. Isolated lab only."
              :c3b5Enabled
              ?"Real resonance and Overdrive QA: defeat enemies to charge, press O to activate. Optional QA charge without score or progress."
              :c3b4Enabled
              ?"Physical ORBI impact QA: splash damage, slowing, pushback and magnetism. Isolated prototype; no campaign rewards."
              :c3b3Enabled
              ?"Canonical ORBI with ten real attack profiles and spatial enemy targeting. Experimental shots; no live rewards."
              :c3b2Enabled
              ?"Physical QA bridge: canonical Dash with no horizontal wall and shared spatial contact detection. No game stats or rewards."
              :c3bPreviewEnabled
              ?"Physical encounter QA: enemies spawn outside camera, pursue ENERGY and receive test hits. No campaign rewards or combat."
              :"ENERGY, camera and 30 ORBI travel with controlled enemies, shots and resources. No damage or rewards.")}</p>
        </div>
        <div className="ux15-route-qa__actions">
          <button type="button" onClick={()=>setLocale(v=>v==="es"?"en":"es")}>
            {locale==="es"?"EN":"ES"}
          </button>
          <a href={import.meta.env.BASE_URL}>{locale==="es"?"Volver al juego":"Return to game"}</a>
        </div>
      </header>
      <div className="ux15-route-qa__viewport">
        <canvas ref={canvasRef} width={800} height={480}
          data-testid="ux15-physical-canvas" role="img"
          aria-label={locale==="es"?"Travesía física QA de ENERGY sin combate":"Physical ENERGY route QA without combat"}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={onPointerUp}/>
        <div className="ux15-route-qa__flag">{c3b2Enabled?"C3B2 · TEST COMBAT · NO LIVE REWARDS":"PHYSICAL QA · NO COMBAT"}</div>
      </div>
      <section className="ux15-route-qa__telemetry ux15-physical-qa__telemetry" aria-label="Physical route telemetry">
        <div><span>{locale==="es"?"Distancia de ruta":"Route distance"}</span><strong>{Math.floor(telemetry.distance).toLocaleString(locale)} u</strong></div>
        <div><span>ENERGY · X</span><strong>{Math.round(telemetry.playerX)} u</strong></div>
        <div><span>{locale==="es"?"Cámara · X":"Camera · X"}</span><strong>{Math.round(telemetry.cameraX)} u</strong></div>
        <div><span>{locale==="es"?"Segmento":"Segment"}</span><strong>{telemetry.ordinal+1}</strong></div>
        <div><span>Origin epoch</span><strong>{telemetry.originEpoch}</strong></div>
        {c3b6Enabled && <>
          <div><span>Convergencia QA</span><strong>{telemetry.convergenceChanneling?"CANALIZANDO":telemetry.convergenceReady?"LISTA":telemetry.convergenceUsedWave?"USADA":"NO DISPONIBLE"}</strong></div>
          <div><span>Canal / cooldown</span><strong>{(telemetry.convergenceChannelMs/1000).toFixed(2)} / {(telemetry.convergenceCooldownMs/1000).toFixed(0)} s</strong></div>
          <div><span>Rayos / objetivos</span><strong>{telemetry.convergenceBeams} / {telemetry.convergenceHits}</strong></div>
          <div><span>Bajas / canceladas</span><strong>{telemetry.convergenceKills} / {telemetry.convergenceCancels}</strong></div>
        </>}
        {c3b5Enabled && <>
          <div><span>Resonancia / cadena</span><strong>{telemetry.resonance} / {telemetry.chain}</strong></div>
          <div><span>Overdrive QA</span><strong>{telemetry.overdriveActive?"ACTIVO":telemetry.overdriveReady?"LISTO":"CARGANDO"}</strong></div>
          <div><span>Tiempo restante</span><strong>{(telemetry.overdriveRemainingMs/1000).toFixed(1)} s</strong></div>
          <div><span>Daño / activaciones</span><strong>×{telemetry.overdriveMultiplier.toFixed(1)} / {telemetry.overdriveActivations}</strong></div>
          <div><span>Derrotas / penalizaciones</span><strong>{telemetry.creditedDefeats} / {telemetry.damageBreaks}</strong></div>
          <div><span>Cargas manuales QA</span><strong>{telemetry.qaCharges}</strong></div>
        </>}
        {c3b4Enabled && <>
          <div><span>Daño de área</span><strong>{telemetry.splashHits} impactos</strong></div>
          <div><span>Ralentizaciones</span><strong>{telemetry.slows}</strong></div>
          <div><span>Empujes / atracciones</span><strong>{telemetry.pushes} / {telemetry.pulls}</strong></div>
          <div><span>Bajas por área</span><strong>{telemetry.areaKills}</strong></div>
        </>}
        {c3b3Enabled && <>
          <div><span>ORBI disparos</span><strong>{telemetry.orbiShots}</strong></div>
          <div><span>Objetivos adquiridos</span><strong>{telemetry.orbiTargets}</strong></div>
          <div><span>Ecos Quantum</span><strong>{telemetry.orbiEchoes}</strong></div>
          <div><span>Soporte H₂ / GAIA</span><strong>{telemetry.orbiSupport.toFixed(1)}</strong></div>
        </>}
        {c3b2Enabled && <>
          <div><span>Escudo QA</span><strong>{telemetry.shield} / 100</strong></div>
          <div><span>Contactos / indexados</span><strong>{telemetry.contactHits} / {telemetry.indexedEnemies}</strong></div>
          <div><span>Dash cooldown</span><strong>{(telemetry.dashCooldownMs/1000).toFixed(1)} s</strong></div>
        </>}
        {c3bPreviewEnabled && <>
          <div><span>Spawn / Cull</span><strong>{telemetry.spawned} / {telemetry.culled}</strong></div>
          <div><span>Enemigos activos</span><strong>{telemetry.activeEnemies}</strong></div>
          <div><span>Impactos / bajas QA</span><strong>{telemetry.hits} / {telemetry.destroyed}</strong></div>
          <div><span>Disparos / pickups</span><strong>{telemetry.activeShots} / {telemetry.pickups}</strong></div>
        </>}
        <div><span>ORBI 1 · X</span><strong>{Math.round(telemetry.orbiX)} u</strong></div>
        <div><span>Enemigo · X</span><strong>{Math.round(telemetry.enemyX)} u</strong></div>
        <div><span>{locale==="es"?"Estado":"Status"}</span><strong>{reduced?"REDUCED MOTION":running?"PHYSICAL RUN":"PAUSED"}</strong></div>
      </section>
      <div className="ux15-route-qa__footer">
        <p>{locale==="es"
          ?"WASD, flechas o arrastra sobre el escenario. Avance físico automático + dirección libre X/Y; el reinicio vuelve al origen."
          :"WASD, arrows or drag on the stage. Physical auto-advance + free X/Y steering; reset returns to origin."}</p>
        <div className="ux15-route-qa__actions">
          <button type="button" data-testid="ux15-physical-pause" onClick={()=>{
            runningRef.current=!runningRef.current;
            setRunning(runningRef.current);
            publishTelemetry();
          }}>{running?(locale==="es"?"Pausar":"Pause"):(locale==="es"?"Reanudar":"Resume")}</button>
          {c3b6Enabled && <button type="button"
            data-testid="ux15-c3b6-convergence"
            onClick={()=>{if(runningRef.current)convergenceRequestedRef.current=true;}}>
            {locale==="es"?"Convergencia (C)":"Convergence (C)"}
          </button>}
          {c3b5Enabled && <>
            <button type="button" data-testid="ux15-c3b5-charge"
              onClick={()=>{if(runningRef.current)chargeQaRequestedRef.current=true;}}>
              {locale==="es"?"Cargar resonancia (QA)":"Charge resonance (QA)"}
            </button>
            <button type="button" data-testid="ux15-c3b5-overdrive"
              onClick={()=>{if(runningRef.current)overdriveRequestedRef.current=true;}}>
              {locale==="es"?"Overdrive (O)":"Overdrive (O)"}
            </button>
          </>}
          {c3b2Enabled && <button type="button"
            data-testid="ux15-c3b2-dash"
            onClick={()=>{if(runningRef.current)dashRequestedRef.current=true;}}>
            {locale==="es"?"Dash (espacio)":"Dash (Space)"}
          </button>}
          <button type="button" data-testid="ux15-physical-reset" onClick={reset}>
            {locale==="es"?"Reiniciar":"Reset"}
          </button>
        </div>
      </div>
    </main>
  );
}
