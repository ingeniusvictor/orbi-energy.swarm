import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Locale = "es" | "en";
type PreviewStatus = "LOADING" | "READY" | "FALLBACK";

/**
 * UX11-D: unique neutral, golden ENERGY preview. It is deliberately NOT the
 * historical "orbi-foton.glb": that binary is not identity-certified as ENERGY.
 * The model is true WebGL geometry, not a flat image or a Dyson shield.
 */
export const EnergyStatus3D: React.FC<{ language: Locale }> = ({ language }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<PreviewStatus>("LOADING");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: any = null;
    let frame = 0;
    let disposed = false;
    let lastFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = !document.hidden;
    setStatus("LOADING");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.02, 3.35);
    camera.lookAt(0, 0, 0);

    // A compact golden character with a real illuminated face. Never make an
    // enclosing ring: Dyson halos are intentionally hidden in UX11-A.
    const energy = new THREE.Group();
    scene.add(energy);
    const gold = new THREE.MeshPhysicalMaterial({
      color: 0xe5ab3f, metalness: .82, roughness: .22, clearcoat: .85, clearcoatRoughness: .12,
    });
    const brightGold = new THREE.MeshStandardMaterial({
      color: 0xffd981, metalness: .65, roughness: .2, emissive: 0x5c3206, emissiveIntensity: .2,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x061927, metalness: .6, roughness: .31,
    });
    const cyan = new THREE.MeshStandardMaterial({
      color: 0x8bf6ff, metalness: .15, roughness: .2,
      emissive: 0x18beea, emissiveIntensity: .74,
    });
    const createMesh = (geometry: any, material: any, x=0, y=0, z=0) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x,y,z);
      energy.add(mesh);
      return mesh;
    };
    createMesh(new THREE.IcosahedronGeometry(.76, 5), gold);
    createMesh(new THREE.IcosahedronGeometry(.61, 3), brightGold, 0, 0, .12).scale.set(1,1,.32);
    // Inset dark eye panels and luminous turquoise optics.
    for (const side of [-1,1]) {
      createMesh(new THREE.SphereGeometry(.22, 24, 18), dark, side*.29, .13, .68)
        .scale.set(1,.80,.30);
      createMesh(new THREE.SphereGeometry(.135, 22, 18), cyan, side*.29, .13, .765)
        .scale.set(1,.78,.30);
      createMesh(new THREE.SphereGeometry(.045, 12, 10), brightGold, side*.255, .18, .818);
      createMesh(new THREE.IcosahedronGeometry(.15, 2), brightGold, side*.70,-.37,.25)
        .rotation.z=side*.35;
    }
    // Smiling lower-face geometry, attached to the model rather than a texture.
    const smile = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-.25,-.24,.685),
      new THREE.Vector3(-.13,-.33,.727),
      new THREE.Vector3(0,-.35,.738),
      new THREE.Vector3(.13,-.33,.727),
      new THREE.Vector3(.25,-.24,.685),
    ]);
    createMesh(new THREE.TubeGeometry(smile,18,.018,7,false), dark);
    const hemisphere = new THREE.HemisphereLight(0xe2faff,0x0a101e,2.1);
    const keyLight = new THREE.DirectionalLight(0xffe4a0,3.3);
    keyLight.position.set(2.5,3,4);
    const rimLight = new THREE.DirectionalLight(0x50e6ff,3.2);
    rimLight.position.set(-2.5,.8,-2);
    scene.add(hemisphere,keyLight,rimLight);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha:true, antialias:true, powerPreference:"low-power",
        preserveDrawingBuffer:false,
      });
      renderer.setClearColor(0x000000,0);
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.2;
      renderer.setPixelRatio(Math.min(1.35, Math.max(1,window.devicePixelRatio||1)));
      renderer.domElement.className="orbi-ux11d-webgl-canvas";
      renderer.domElement.setAttribute("aria-hidden","true");
      mount.appendChild(renderer.domElement);
    } catch {
      setStatus("FALLBACK");
      energy.traverse((part: any)=>part.geometry?.dispose?.());
      for(const material of [gold,brightGold,dark,cyan])material.dispose();
      return;
    }

    const render = () => {
      if(disposed || !renderer || !visible)return;
      const bounds=mount.getBoundingClientRect();
      if(bounds.width<=0 || bounds.height<=0)return;
      renderer.setSize(Math.round(bounds.width),Math.round(bounds.height),false);
      camera.aspect=bounds.width/bounds.height;
      camera.updateProjectionMatrix();
      renderer.render(scene,camera);
    };
    const onVisibility=()=>{
      visible=!document.hidden;
      if(visible && !disposed && !reducedMotion){lastFrame=0;frame=requestAnimationFrame(tick);}
      if(visible && reducedMotion)render();
    };
    const onLost=(event:Event)=>{
      event.preventDefault();
      cancelAnimationFrame(frame);
      visible=false;
      setStatus("FALLBACK");
    };
    const tick=(now:number)=>{
      if(disposed || !visible)return;
      frame=requestAnimationFrame(tick);
      if(now-lastFrame<1000/24)return;
      lastFrame=now;
      energy.rotation.y=Math.sin(now*.00048)*.20;
      energy.rotation.x=Math.sin(now*.00034)*.045;
      energy.position.y=Math.sin(now*.0009)*.035;
      render();
    };
    mount.addEventListener("webglcontextlost",onLost);
    renderer.domElement.addEventListener("webglcontextlost",onLost);
    document.addEventListener("visibilitychange",onVisibility);
    resizeObserver=new ResizeObserver(render);
    resizeObserver.observe(mount);
    render();
    setStatus("READY");
    if(!reducedMotion)frame=requestAnimationFrame(tick);

    return ()=>{
      disposed=true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange",onVisibility);
      mount.removeEventListener("webglcontextlost",onLost);
      renderer.domElement.removeEventListener("webglcontextlost",onLost);
      resizeObserver?.disconnect();
      energy.traverse((part:any)=>part.geometry?.dispose?.());
      for(const material of [gold,brightGold,dark,cyan])material.dispose();
      renderer.dispose();
      // WebGL context may already be lost.
      if(renderer.domElement.parentNode===mount)mount.removeChild(renderer.domElement);
    };
  },[]);

  return (
    <div className="orbi-ux11d-energy-preview" data-testid="orbi-ux11d-energy-preview"
      data-3d-status={status} role="img"
      aria-label={language==="es" ? "ENERGY, protagonista dorado neutral en 3D" : "ENERGY, golden neutral protagonist in 3D"}>
      <div className="orbi-ux11d-fallback" aria-hidden="true">
        <div className="orbi-premium-status-energy"><i/><i/><span/></div>
      </div>
      <div ref={mountRef} className="orbi-ux11d-viewport" aria-hidden="true"/>
      <span className="orbi-ux11d-preview-marker" aria-hidden="true">
        {status==="READY"?"3D · WEBGL":(language==="es"?"VISTA ALTERNATIVA":"FALLBACK VIEW")}
      </span>
    </div>
  );
};
