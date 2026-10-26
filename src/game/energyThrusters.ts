/** UX12 — inertial micro-thruster attitude. Visual-only and deterministic.
 * The player keeps targeting with its lens; its chassis banks toward actual
 * movement while two RCS nozzles fire opposite the travel vector.
 */
export interface EnergyThrusterPose {
  directionX:number;
  directionY:number;
  throttle:number;
  bankRadians:number;
}
export const createEnergyThrusterPose=():EnergyThrusterPose=>({
  directionX:0,directionY:0,throttle:0,bankRadians:0,
});
export const projectEnergyThrusterPose=(
  prior:EnergyThrusterPose,
  displacementX:number,
  displacementY:number,
  elapsedMs:number,
  dashActive:boolean,
):EnergyThrusterPose=>{
  if(!Number.isFinite(elapsedMs)||elapsedMs<=0)return prior;
  const dx=Number.isFinite(displacementX)?displacementX:0;
  const dy=Number.isFinite(displacementY)?displacementY:0;
  const distance=Math.hypot(dx,dy);
  const directionX=distance>.025?dx/distance:0;
  const directionY=distance>.025?dy/distance:0;
  const desiredThrottle=Math.min(1,distance/Math.max(1,elapsedMs)*4.4);
  const ease=1-Math.exp(-elapsedMs/(dashActive?65:115));
  const throttle=prior.throttle+(desiredThrottle-prior.throttle)*ease;
  // Bank around the vision/target axis; capped at ~9°, avoids spinning body.
  const desiredBank=directionX*.13+directionY*.035;
  return {
    directionX:prior.directionX+(directionX-prior.directionX)*ease,
    directionY:prior.directionY+(directionY-prior.directionY)*ease,
    throttle:throttle<.018?0:throttle,
    bankRadians:Math.max(-.16,Math.min(.16,
      prior.bankRadians+(desiredBank-prior.bankRadians)*ease)),
  };
};
/** Draw exclusively INSIDE the world-transform pass before ENERGY's body.
 * Never allocates particle entities; animation pauses with simulation time. */
export const drawEnergyThrusterJets=(
  ctx:CanvasRenderingContext2D,
  position:{x:number;y:number},
  pose:EnergyThrusterPose,
  nowMs:number,
  dashActive:boolean,
):void=>{
  if(pose.throttle<.035)return;
  const dx=pose.directionX,dy=pose.directionY;
  const length=Math.hypot(dx,dy);
  if(length<.035)return;
  const ux=dx/length,uy=dy/length;
  const tangentX=-uy,tangentY=ux;
  const power=pose.throttle;
  ctx.save();
  ctx.lineCap="round";
  for(const side of [-1,1]){
    const nozzleX=position.x-ux*10+tangentX*(side*8);
    const nozzleY=position.y-uy*10+tangentY*(side*8);
    const reach=projectEnergyThrusterJetReach(pose,nowMs,dashActive);
    // Nozzle mounts and golden-ion exhaust stay behind leader silhouette.
    ctx.strokeStyle="#d6eef7";ctx.lineWidth=2.9;ctx.shadowBlur=0;
    ctx.beginPath();ctx.moveTo(nozzleX+ux*3,nozzleY+uy*3);
    ctx.lineTo(nozzleX-ux*3,nozzleY-uy*3);ctx.stroke();
    ctx.strokeStyle=dashActive?"#ffda82":"#79eaff";
    ctx.lineWidth=2.1+power*.8;
    ctx.shadowColor=dashActive?"#ffc469":"#48d8fd";ctx.shadowBlur=7;
    ctx.globalAlpha=.35+.55*power;
    ctx.beginPath();ctx.moveTo(nozzleX,nozzleY);
    ctx.lineTo(nozzleX-ux*reach,nozzleY-uy*reach);ctx.stroke();
    ctx.strokeStyle="#fff2bf";ctx.lineWidth=1.1;
    ctx.beginPath();ctx.moveTo(nozzleX,nozzleY);
    ctx.lineTo(nozzleX-ux*reach*.6,nozzleY-uy*reach*.6);ctx.stroke();
  }
  ctx.restore();
};

/**
 * Canonical UX12 jet length: shared between both render clients and their
 * evidence. This is the original (8+15*power)*surge*flicker formula.
 */
export const projectEnergyThrusterJetReach=(
  pose:EnergyThrusterPose,nowMs:number,dashActive:boolean,
):number=>{
  if(pose.throttle<.035 || Math.hypot(pose.directionX,pose.directionY)<.035)
    return 0;
  const surge=dashActive?1.45:1;
  const flicker=.88+.12*Math.sin(nowMs*.036);
  return (8+15*pose.throttle)*surge*flicker;
};

/** Exact UX11-E canonical three-streak Dash visual, now shared with ASTERIA.
 * Render AFTER the FOTON body, inside the same world/camera transform.
 */
export const drawEnergyDashStreaks=(
  ctx:CanvasRenderingContext2D,
  pos:{x:number;y:number},
  direction:{x:number;y:number},
  dashActive:boolean,
):void=>{
  if(!dashActive)return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.shadowColor = "#67e8f9";
  ctx.shadowBlur = 12;
  for (const lateral of [-11, 0, 11]) {
    const sideX = -direction.y * lateral;
    const sideY = direction.x * lateral;
    ctx.beginPath();
    ctx.moveTo(pos.x - direction.x * 16 + sideX, pos.y - direction.y * 16 + sideY);
    ctx.lineTo(pos.x - direction.x * (lateral === 0 ? 86 : 60) + sideX,
      pos.y - direction.y * (lateral === 0 ? 86 : 60) + sideY);
    ctx.strokeStyle = lateral === 0 ? "#fde68a" : "#67e8f9";
    ctx.globalAlpha = lateral === 0 ? 0.85 : 0.55;
    ctx.lineWidth = lateral === 0 ? 4 : 2;
    ctx.stroke();
  }
  ctx.restore();
};
