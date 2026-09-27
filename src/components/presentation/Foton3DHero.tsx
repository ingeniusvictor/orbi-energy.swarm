import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { QualityPreset } from "../../game/types";

type HeroStatus = "LOADING" | "READY" | "FAILED";

interface Foton3DHeroProps {
  qualityPreset: QualityPreset;
}

interface HeroRuntimeConfig {
  maxPixelRatio: number;
  targetFps: number;
  antialias: boolean;
}

export const getFotonHeroRuntimeConfig = (
  preset: QualityPreset,
): HeroRuntimeConfig | null => {
  switch (preset) {
    case QualityPreset.LOW:
      return null;
    case QualityPreset.MEDIUM:
      return {
        maxPixelRatio: 1,
        targetFps: 24,
        antialias: false,
      };
    case QualityPreset.HIGH:
      return {
        maxPixelRatio: 1.25,
        targetFps: 30,
        antialias: true,
      };
    case QualityPreset.ULTRA:
    default:
      return {
        maxPixelRatio: 1.5,
        targetFps: 36,
        antialias: true,
      };
  }
};

const disposeObject3D = (root: any) => {
  root.traverse((object: any) => {
    object.geometry?.dispose?.();

    const materials = Array.isArray(object.material)
      ? object.material
      : object.material
        ? [object.material]
        : [];

    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (
          value &&
          typeof value === "object" &&
          "isTexture" in value &&
          (value as any).isTexture
        ) {
          (value as any).dispose?.();
        }
      }
      material.dispose?.();
    }
  });
};

export const Foton3DHero: React.FC<Foton3DHeroProps> = ({
  qualityPreset,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] =
    useState<HeroStatus>("LOADING");

  const config = useMemo(
    () => getFotonHeroRuntimeConfig(qualityPreset),
    [qualityPreset],
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !config) {
      setStatus(config ? "LOADING" : "FAILED");
      return;
    }

    let disposed = false;
    let animationFrame = 0;
    let lastFrameAt = 0;
    let lastMotionAt = performance.now();
    let sceneRoot: any = null;
    let model: any = null;
    let visible = !document.hidden;
    let reducedMotion = false;

    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    setStatus("LOADING");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      32,
      1,
      0.1,
      100,
    );
    camera.position.set(0, 0.08, 3.1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: config.antialias,
      powerPreference: "high-performance",
    });

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const deviceDpr = Math.max(
      1,
      window.devicePixelRatio || 1,
    );
    renderer.setPixelRatio(
      Math.min(
        deviceDpr,
        config.maxPixelRatio,
      ),
    );
    renderer.domElement.className =
      "orbi-foton-3d-canvas";
    renderer.domElement.setAttribute(
      "aria-hidden",
      "true",
    );
    mount.appendChild(renderer.domElement);

    const hemisphere = new THREE.HemisphereLight(
      0x9fe8ff,
      0x060913,
      1.8,
    );
    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(
      0xfbbf24,
      3.3,
    );
    keyLight.position.set(2.4, 2.8, 3.4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
      0x67e8f9,
      4.1,
    );
    rimLight.position.set(-3.1, 1.4, -2.2);
    scene.add(rimLight);

    const violetLight = new THREE.PointLight(
      0x8b5cf6,
      9,
      6,
      1.8,
    );
    violetLight.position.set(0, -1.1, 1.4);
    scene.add(violetLight);

    sceneRoot = new THREE.Group();
    scene.add(sceneRoot);

    const resize = () => {
      if (disposed) return;
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (
        reducedMotion &&
        model &&
        visible
      ) {
        renderer.render(scene, camera);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    const applyMotionPreference = () => {
      reducedMotion = reducedMotionQuery.matches;

      if (
        reducedMotion &&
        model &&
        visible
      ) {
        sceneRoot.rotation.set(
          -0.05,
          0.45,
          0.03,
        );
        sceneRoot.position.y = 0;
        renderer.render(scene, camera);
      }
    };

    const onPointerMove = (
      event: PointerEvent,
    ) => {
      const rect = mount.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      pointer.targetX =
        ((event.clientX - rect.left) /
          rect.width -
          0.5) *
        2;
      pointer.targetY =
        ((event.clientY - rect.top) /
          rect.height -
          0.5) *
        2;
    };

    const onPointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const renderFrame = (now: number) => {
      if (disposed) return;

      animationFrame =
        requestAnimationFrame(renderFrame);

      if (
        !visible ||
        !model ||
        reducedMotion
      ) {
        return;
      }

      const frameInterval =
        1000 / config.targetFps;
      if (now - lastFrameAt < frameInterval) {
        return;
      }

      const elapsedSeconds =
        Math.max(
          0,
          now - lastMotionAt,
        ) / 1000;
      lastMotionAt = now;
      lastFrameAt = now;

      pointer.x +=
        (pointer.targetX - pointer.x) *
        0.055;
      pointer.y +=
        (pointer.targetY - pointer.y) *
        0.055;

      const timeSeconds = now / 1000;

      sceneRoot.rotation.y +=
        elapsedSeconds * 0.19;
      sceneRoot.rotation.x =
        Math.sin(timeSeconds * 0.53) *
          0.055 +
        pointer.y * 0.075;
      sceneRoot.rotation.z =
        Math.cos(timeSeconds * 0.37) *
          0.035 -
        pointer.x * 0.045;
      sceneRoot.position.y =
        Math.sin(timeSeconds * 0.72) *
        0.045;
      sceneRoot.position.x =
        pointer.x * 0.035;

      camera.position.x =
        pointer.x * 0.09;
      camera.position.y =
        0.08 - pointer.y * 0.055;
      camera.lookAt(0, 0.05, 0);

      renderer.render(scene, camera);
    };

    const onVisibilityChange = () => {
      visible = !document.hidden;
      lastFrameAt = 0;
      lastMotionAt = performance.now();

      if (
        visible &&
        reducedMotion &&
        model
      ) {
        renderer.render(scene, camera);
      }
    };

    reducedMotionQuery.addEventListener(
      "change",
      applyMotionPreference,
    );
    document.addEventListener(
      "visibilitychange",
      onVisibilityChange,
    );
    mount.addEventListener(
      "pointermove",
      onPointerMove,
      { passive: true },
    );
    mount.addEventListener(
      "pointerleave",
      onPointerLeave,
      { passive: true },
    );

    applyMotionPreference();
    resize();

    const loader = new GLTFLoader();
    loader.load(
      `${import.meta.env.BASE_URL}assets/orbi-foton.glb`,
      (gltf: any) => {
        if (disposed) {
          disposeObject3D(gltf.scene);
          return;
        }

        model = gltf.scene;

        const bounds = new THREE.Box3().setFromObject(
          model,
        );
        const center = bounds.getCenter(
          new THREE.Vector3(),
        );
        const size = bounds.getSize(
          new THREE.Vector3(),
        );
        const maxDimension = Math.max(
          size.x,
          size.y,
          size.z,
          0.001,
        );

        model.position.sub(center);
        const scale = 1.62 / maxDimension;
        model.scale.setScalar(scale);

        model.traverse((object: any) => {
          if (!object.isMesh) return;

          object.frustumCulled = true;
          object.castShadow = false;
          object.receiveShadow = false;

          const materials = Array.isArray(
            object.material,
          )
            ? object.material
            : [object.material];

          for (const material of materials) {
            if (!material) continue;
            material.envMapIntensity = 0.8;
            material.needsUpdate = true;
          }
        });

        sceneRoot.add(model);
        sceneRoot.rotation.y = 0.45;
        sceneRoot.rotation.x = -0.05;
        setStatus("READY");

        renderer.render(scene, camera);
      },
      undefined,
      () => {
        if (disposed) return;
        setStatus("FAILED");
      },
    );

    animationFrame =
      requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);

      reducedMotionQuery.removeEventListener(
        "change",
        applyMotionPreference,
      );
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
      );
      mount.removeEventListener(
        "pointermove",
        onPointerMove,
      );
      mount.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      resizeObserver.disconnect();

      if (model) {
        sceneRoot.remove(model);
        disposeObject3D(model);
      }

      renderer.dispose();
      renderer.forceContextLoss?.();

      if (
        renderer.domElement.parentElement ===
        mount
      ) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [config]);

  if (!config) {
    return null;
  }

  return (
    <div
      className="orbi-foton-3d absolute inset-0"
      data-foton-3d-status={status}
      aria-label="Foton 3D command hero"
    >
      <div
        ref={mountRef}
        className="absolute inset-0"
      />

      {status === "LOADING" && (
        <div className="orbi-foton-3d-status">
          FOTON // SYNCHRONIZING 3D CORE
        </div>
      )}

      {status === "FAILED" && (
        <div className="orbi-foton-3d-status orbi-foton-3d-status--warning">
          FOTON // CSS CORE FALLBACK
        </div>
      )}
    </div>
  );
};

export default Foton3DHero;
