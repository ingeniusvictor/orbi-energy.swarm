import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { QualityPreset } from "../game/types";

export type Energy3DStatus = "LOADING" | "READY" | "FALLBACK";

export interface Energy3DPolicy {
  enabled: boolean;
  fps: number;
  pixelRatioCap: number;
  detail: number;
}

/** GPU budget is lower than the cinematic launcher: Estado is a paused overlay. */
export const getEnergy3DPolicy = (quality: QualityPreset): Energy3DPolicy => {
  switch (quality) {
    case QualityPreset.LOW: return {enabled:false,fps:0,pixelRatioCap:1,detail:12};
    case QualityPreset.MEDIUM: return {enabled:true,fps:20,pixelRatioCap:1,detail:20};
    case QualityPreset.HIGH: return {enabled:true,fps:24,pixelRatioCap:1.25,detail:28};
    case QualityPreset.ULTRA: return {enabled:true,fps:30,pixelRatioCap:1.5,detail:32};
  }
};

/** Independent neutral golden protagonist geometry. NEVER load orbi-foton.glb
 * without first certifying its visual identity; that historical GLB belongs
 * to a different launcher preview. This model intentionally has no Dyson rings. */
export const makeEnergy3DGroup = (detail=24): any => {
  const group=new THREE.Group();
  const safe=Math.max(12,Math.min(40,Math.floor(detail)));
  const gold=new THREE.MeshStandardMaterial({color:0xd49a40,metalness:.82,roughness:.22});
  const rim=new THREE.MeshStandardMaterial({color:0xffe1a0,metalness:.77,roughness:.2});
  const black=new THREE.MeshStandardMaterial({color:0x080f20,metalness:.33,roughness:.25});
  const cyan=new THREE.MeshStandardMaterial({color:0x5fe4f4,metalness:.5,roughness:.14,emissive:0x0b4c6c,emissiveIntensity:.8});
  const face=new THREE.Mesh(new THREE.SphereGeometry(.80,safe,safe),gold);
  group.add(face);
  const mask=new THREE.Mesh(new THREE.SphereGeometry(.675,safe,safe),black);
  mask.scale.set(1,.80,.32);
  mask.position.set(0,.08,.62);
  group.add(mask);
  const addEye=(x:number)=>{
    const socket=new THREE.Mesh(new THREE.SphereGeometry(.19,20,16),rim);
    socket.scale.set(1,1,.35);
    socket.position.set(x,.18,.82);
    group.add(socket);
    const lens=new THREE.Mesh(new THREE.SphereGeometry(.126,20,16),cyan);
    lens.scale.set(1,1,.43);
    lens.position.set(x,.18,.895);
    group.add(lens);
    const pupil=new THREE.Mesh(new THREE.SphereGeometry(.042,12,10),black);
    pupil.position.set(x,.18,.955);
    group.add(pupil);
  };
  addEye(-.27);addEye(.27);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.29,.033,9,28,Math.PI),rim);
  smile.rotation.z=Math.PI;
  smile.scale.set(1,.54,1);
  smile.position.set(0,-.22,.853);
  group.add(smile);
  const forehead=new THREE.Mesh(new THREE.BoxGeometry(.38,.07,.08),rim);
  forehead.position.set(0,.56,.58);
  group.add(forehead);
  for(const side of [-1,1]){
    const fin=new THREE.Mesh(new THREE.OctahedronGeometry(.25,0),rim);
    fin.position.set(side*.78,-.03,.01);
    fin.scale.set(.65,1.2,.85);
    group.add(fin);
  }
  return group;
};

const disposeEnergyGroup=(root:any)=>{
  root.traverse((object:any)=>{
    if(!(object instanceof THREE.Mesh))return;
    object.geometry.dispose();
    const materials=Array.isArray(object.material)?object.material:[object.material];
    materials.forEach((mat:any)=>mat.dispose());
  });
};

export const EnergyStatus3D: React.FC<{
  qualityPreset:QualityPreset;
  language:"es"|"en";
}> = ({qualityPreset,language}) => {
  const ref=useRef<HTMLDivElement>(null);
  const [status,setStatus]=useState<Energy3DStatus>("LOADING");
  useEffect(()=>{
    const mount=ref.current;
    const policy=getEnergy3DPolicy(qualityPreset);
    if(!mount||!policy.enabled) {setStatus("FALLBACK");return;}
    let renderer:any;
    try {
      renderer=new THREE.WebGLRenderer({alpha:true,antialias:qualityPreset!==QualityPreset.MEDIUM,powerPreference:"low-power"});
    }catch{setStatus("FALLBACK");return;}
    let disposed=false,frame=0,lastFrame=0,visible=!document.hidden;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(34,1,.1,20);
    camera.position.set(0,.1,4.3);
    camera.lookAt(0,0,0);
    const ambient=new THREE.HemisphereLight(0xb5ecff,0x102037,2.1);
    const key=new THREE.DirectionalLight(0xffd98e,3.2);
    key.position.set(2,2,4);
    const rim=new THREE.DirectionalLight(0x4cdef3,2.3);
    rim.position.set(-2.5,-.1,-1.8);
    scene.add(ambient,key,rim);
    const hero=makeEnergy3DGroup(policy.detail);
    scene.add(hero);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,policy.pixelRatioCap));
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.2;
    renderer.domElement.className="orbi-ux11d-energy-canvas";
    renderer.domElement.setAttribute("aria-hidden","true");
    mount.appendChild(renderer.domElement);
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const render=()=>{
      if(disposed||!visible)return;
      renderer.render(scene,camera);
    };
    const resize=()=>{
      if(disposed)return;
      const rect=mount.getBoundingClientRect();
      if(rect.width<1||rect.height<1)return;
      renderer.setSize(rect.width,rect.height,false);
      camera.aspect=rect.width/rect.height;
      camera.updateProjectionMatrix();
      render();
    };
    const observer=new ResizeObserver(resize);
    observer.observe(mount);
    const onVisibility=()=>{visible=!document.hidden;if(visible)render();};
    const onContextLost=(event:Event)=>{event.preventDefault();visible=false;setStatus("FALLBACK");};
    renderer.domElement.addEventListener("webglcontextlost",onContextLost);
    document.addEventListener("visibilitychange",onVisibility);
    const tick=(now:number)=>{
      if(disposed)return;
      frame=requestAnimationFrame(tick);
      if(!visible||reduced.matches||now-lastFrame<1000/policy.fps)return;
      lastFrame=now;
      hero.rotation.y=Math.sin(now*.0003)*.27;
      hero.rotation.x=Math.sin(now*.00042)*.045;
      hero.position.y=Math.sin(now*.00052)*.035;
      renderer.render(scene,camera);
    };
    hero.rotation.y=-.12;
    resize();
    frame=requestAnimationFrame(tick);
    setStatus("READY");
    return ()=>{
      disposed=true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange",onVisibility);
      renderer.domElement.removeEventListener("webglcontextlost",onContextLost);
      observer.disconnect();
      scene.remove(hero);
      disposeEnergyGroup(hero);
      renderer.dispose();
      renderer.forceContextLoss();
      if(renderer.domElement.parentElement===mount)mount.removeChild(renderer.domElement);
    };
  },[qualityPreset]);
  return (
    <div className="orbi-ux11d-energy-stage" data-testid="orbi-ux11d-energy-3d"
      data-energy-3d-status={status} data-energy-id="ENERGY"
      aria-label={language==="es"?"Representación tridimensional del protagonista ENERGY":"Three-dimensional representation of protagonist ENERGY"}>
      <div className="orbi-ux11d-energy-mount" ref={ref} aria-hidden="true"/>
      <div className="orbi-premium-status-energy orbi-ux11d-energy-fallback" aria-hidden="true"><i/><i/><span/></div>
      {status==="FALLBACK"&&<small className="orbi-ux11d-energy-fallback-label">{language==="es"?"VISTA COMPATIBLE":"COMPATIBILITY VIEW"}</small>}
    </div>
  );
};
