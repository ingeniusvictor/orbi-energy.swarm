import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Locale = "es" | "en";
type PreviewStatus = "LOADING" | "READY" | "FALLBACK";

/**
 * UX14-C: show the authentic 3D gameplay protagonist inside Estado.
 * The historical filename "orbi-foton.glb" predates the ENERGY/FOTON identity
 * split. It has been the full gameplay leader since ES-12F4 (#183), and is
 * NOT the separate green photovoltaic follower in the current ORBI canon.
 *
 * Reuse that same binary (no copy, rename, new textures or gameplay mutation).
 * No Dyson ring: only the leader body, as in the approved Estado presentation.
 */
const ENERGY_PROTAGONIST_GLB = `${import.meta.env.BASE_URL}assets/orbi-foton.glb`;
const STATUS_PREVIEW_FPS = 24;
const MAX_STATUS_PIXEL_RATIO = 1.25;

/** Release mesh geometry, imported materials and GLB textures exactly once. */
const disposeImportedModel = (root: any) => {
  const geometries = new Set<any>();
  const materials = new Set<any>();
  const textures = new Set<any>();

  root.traverse((part: any) => {
    const mesh = part as any;
    if (mesh.geometry && mesh.geometry.isBufferGeometry) geometries.add(mesh.geometry);
    if (!mesh.material) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of list) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value && typeof value === "object" && "isTexture" in value &&
            (value as any).isTexture) textures.add(value as any);
      }
    }
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
};

export const EnergyStatus3D: React.FC<{ language: Locale }> = ({ language }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<PreviewStatus>("LOADING");
  const [fallbackReason, setFallbackReason] = useState("none");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: any = null;
    let model: any = null;
    let frame = 0;
    let disposed = false;
    let contextLost = false;
    let lastFrame = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let resizeObserver: ResizeObserver | null = null;
    let visible = !document.hidden;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStatus("LOADING");
    setFallbackReason("none");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, .04, 3.3);
    camera.lookAt(0, 0, 0);
    const energy = new THREE.Group();
    scene.add(energy);

    // Match the approved warm gold / cool cyan hero lighting in gameplay.
    const hemisphere = new THREE.HemisphereLight(0xa5f3fc, 0x050712, 1.9);
    const keyLight = new THREE.DirectionalLight(0xfbbf24, 3.5);
    keyLight.position.set(2.2, 2.6, 3.2);
    const rimLight = new THREE.DirectionalLight(0x67e8f9, 4.2);
    rimLight.position.set(-2.7, 1.2, -2.4);
    scene.add(hemisphere, keyLight, rimLight);

    const onLost = (event: Event) => {
      event.preventDefault();
      if (disposed || contextLost) return;
      contextLost = true;
      visible = false;
      cancelAnimationFrame(frame);
      setFallbackReason("webglcontextlost");
      setStatus("FALLBACK");
    };

    const render = () => {
      if (disposed || contextLost || !renderer || !model || !visible) return;
      const bounds = mount.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;
      const width = Math.round(bounds.width), height = Math.round(bounds.height);
      if (width !== lastWidth || height !== lastHeight) {
        lastWidth = width;
        lastHeight = height;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Fit the complete rotating GLB even in narrow Android Estado cards.
        const halfFov = (camera.fov * Math.PI / 180) / 2;
        camera.position.z = Math.max(3.2,
          (1.72 / Math.min(1, camera.aspect)) * 1.22 / (2 * Math.tan(halfFov)));
        camera.updateProjectionMatrix();
      }
      try {
        renderer.render(scene, camera);
      } catch {
        onLost(new Event("webglcontextlost", { cancelable: true }));
      }
    };

    const tick = (now: number) => {
      if (disposed || contextLost || !visible) return;
      frame = requestAnimationFrame(tick);
      if (now - lastFrame < 1000 / STATUS_PREVIEW_FPS) return;
      lastFrame = now;
      energy.rotation.set(
        -.08 + Math.sin(now * .00034) * .045,
        .42 + Math.sin(now * .00048) * .20,
        .04,
      );
      energy.position.y = Math.sin(now * .0009) * .035;
      render();
    };

    const onVisibility = () => {
      visible = !document.hidden && !contextLost;
      cancelAnimationFrame(frame);
      if (visible && model && !disposed) {
        lastFrame = 0;
        render();
        if (!reducedMotion) frame = requestAnimationFrame(tick);
      }
    };

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true, antialias: true, powerPreference: "low-power",
        preserveDrawingBuffer: false,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.setPixelRatio(Math.min(MAX_STATUS_PIXEL_RATIO,
        Math.max(1, window.devicePixelRatio || 1)));
      renderer.domElement.className = "orbi-ux11d-webgl-canvas";
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.addEventListener("webglcontextlost", onLost);
      mount.appendChild(renderer.domElement);
      document.addEventListener("visibilitychange", onVisibility);
      resizeObserver = new ResizeObserver(render);
      resizeObserver.observe(mount);
    } catch {
      renderer?.dispose();
      setFallbackReason("webgl-unavailable");
      setStatus("FALLBACK");
      return;
    }

    // GLTFLoader uses the very same URL as the battlefield's certified leader.
    // Late asynchronous callbacks must never attach a model to a closed drawer.
    const loader = new GLTFLoader();
    loader.load(
      ENERGY_PROTAGONIST_GLB,
      (gltf: any) => {
        if (disposed || contextLost) {
          disposeImportedModel(gltf.scene);
          return;
        }
        try {
          const imported = gltf.scene;
          const bounds = new THREE.Box3().setFromObject(imported);
          const size = bounds.getSize(new THREE.Vector3());
          const maxDimension = Math.max(size.x, size.y, size.z);
          if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
            disposeImportedModel(imported);
            setFallbackReason("invalid-glb-bounds");
            setStatus("FALLBACK");
            return;
          }
          const center = bounds.getCenter(new THREE.Vector3());
          // Wrapper applies uniform scale without altering imported GLB transforms.
          const centered = new THREE.Group();
          imported.position.sub(center);
          centered.scale.setScalar(1.72 / maxDimension);
          centered.add(imported);
          imported.traverse((part: any) => {
            const mesh = part as any;
            if (!mesh.isMesh) return;
            mesh.frustumCulled = true;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const material of materials) {
              if (material && "envMapIntensity" in material) {
                (material as any).envMapIntensity = .82;
              }
            }
          });
          energy.add(centered);
          model = imported;
          render();
          if (contextLost) return;
          setStatus("READY");
          if (visible && !reducedMotion) frame = requestAnimationFrame(tick);
        } catch {
          // Failed GLB setup must degrade to the verified CSS hero.
          if (!model) disposeImportedModel(gltf.scene);
          setFallbackReason("glb-setup-error");
          setStatus("FALLBACK");
        }
      },
      undefined,
      () => {
        if (!disposed && !contextLost) {
          setFallbackReason("glb-download-error");
          setStatus("FALLBACK");
        }
      },
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer?.domElement.removeEventListener("webglcontextlost", onLost);
      resizeObserver?.disconnect();
      if (model) disposeImportedModel(model);
      renderer?.dispose();
      renderer?.forceContextLoss();
      if (renderer?.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="orbi-ux11d-energy-preview" data-testid="orbi-ux11d-energy-preview"
      data-3d-status={status} data-model-source={status === "READY" ? "canonical-glb" : "fallback"}
      data-fallback-reason={fallbackReason}
      role="img"
      aria-label={language === "es" ? "ENERGY, protagonista dorado neutral en 3D" : "ENERGY, golden neutral protagonist in 3D"}>
      <div className="orbi-ux11d-fallback" aria-hidden="true">
        <div className="orbi-premium-status-energy"><i/><i/><span/></div>
      </div>
      <div ref={mountRef} className="orbi-ux11d-viewport" aria-hidden="true"/>
      <span className="orbi-ux11d-preview-marker" aria-hidden="true">
        {status === "READY" ? "ENERGY · GLB" : status === "LOADING"
          ? (language === "es" ? "CARGANDO GLB" : "LOADING GLB")
          : (language === "es" ? "VISTA ALTERNATIVA" : "FALLBACK VIEW")}
      </span>
    </div>
  );
};
