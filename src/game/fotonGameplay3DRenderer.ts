import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { QualityPreset } from "./types";

export interface FotonGameplay3DRuntimeConfig {
  renderSize: number;
  targetFps: number;
  maxPixelRatio: number;
  antialias: boolean;
}

export interface FotonGameplay3DFrameRequest {
  nowMs: number;
  qualityPreset: QualityPreset;
  paused: boolean;
  threatDirectionX?: number | null;
  threatDirectionY?: number | null;
}

type RuntimeStatus =
  | "LOADING"
  | "READY"
  | "FAILED";

interface GameplayRuntime {
  preset: QualityPreset;
  config: FotonGameplay3DRuntimeConfig;
  status: RuntimeStatus;
  disposed: boolean;
  renderer: any;
  scene: any;
  camera: any;
  root: any;
  model: any;
  lastFrameAt: number;
  lastMotionAt: number;
  threatDirectionX: number;
  threatDirectionY: number;
}

export const FOTON_GAMEPLAY_DRAW_SIZE = 37.5;

export const getFotonGameplay3DRuntimeConfig = (
  preset: QualityPreset,
): FotonGameplay3DRuntimeConfig => {
  switch (preset) {
    case QualityPreset.LOW:
      return {
        renderSize: 80,
        targetFps: 18,
        maxPixelRatio: 1,
        antialias: false,
      };
    case QualityPreset.MEDIUM:
      return {
        renderSize: 96,
        targetFps: 24,
        maxPixelRatio: 1,
        antialias: false,
      };
    case QualityPreset.HIGH:
      return {
        renderSize: 104,
        targetFps: 30,
        maxPixelRatio: 1,
        antialias: true,
      };
    case QualityPreset.ULTRA:
    default:
      return {
        renderSize: 112,
        targetFps: 36,
        maxPixelRatio: 1.25,
        antialias: true,
      };
  }
};

const disposeObject3D = (root: any) => {
  root.traverse((object: any) => {
    const mesh = object;
    mesh.geometry?.dispose?.();

    const materialValue = mesh.material;
    const materials = Array.isArray(materialValue)
      ? materialValue
      : materialValue
        ? [materialValue]
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

let runtime: GameplayRuntime | null = null;

const createRuntime = (
  preset: QualityPreset,
): GameplayRuntime | null => {
  if (
    typeof document === "undefined" ||
    typeof window === "undefined"
  ) {
    return null;
  }

  const config =
    getFotonGameplay3DRuntimeConfig(preset);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    31,
    1,
    0.1,
    100,
  );
  camera.position.set(0, 0.04, 3.05);
  camera.lookAt(0, 0.02, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: config.antialias,
    powerPreference: "high-performance",
    // The 2D battlefield reuses the latest GLB frame between bounded 3D ticks.
    // The buffer is tiny (80–112 px), so preserving it is cheap and avoids
    // re-rendering Three.js at the 60 Hz battlefield cadence.
    preserveDrawingBuffer: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping =
    THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

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
  renderer.setSize(
    config.renderSize,
    config.renderSize,
    false,
  );

  const hemisphere = new THREE.HemisphereLight(
    0xa5f3fc,
    0x050712,
    1.9,
  );
  scene.add(hemisphere);

  const key = new THREE.DirectionalLight(
    0xfbbf24,
    3.5,
  );
  key.position.set(2.2, 2.6, 3.2);
  scene.add(key);

  const rim = new THREE.DirectionalLight(
    0x67e8f9,
    4.2,
  );
  rim.position.set(-2.7, 1.2, -2.4);
  scene.add(rim);

  const violet = new THREE.PointLight(
    0x8b5cf6,
    8,
    5,
    1.8,
  );
  violet.position.set(0.2, -1, 1.3);
  scene.add(violet);

  const root = new THREE.Group();
  scene.add(root);

  const next: GameplayRuntime = {
    preset,
    config,
    status: "LOADING",
    disposed: false,
    renderer,
    scene,
    camera,
    root,
    model: null,
    lastFrameAt: 0,
    lastMotionAt: 0,
    threatDirectionX: 0,
    threatDirectionY: 0,
  };

  const loader = new GLTFLoader();
  loader.load(
    `${import.meta.env.BASE_URL}assets/orbi-foton.glb`,
    (gltf: any) => {
      if (next.disposed) {
        disposeObject3D(gltf.scene);
        return;
      }

      const model = gltf.scene;
      const bounds =
        new THREE.Box3().setFromObject(model);
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
      model.scale.setScalar(
        1.72 / maxDimension,
      );

      model.traverse((object: any) => {
        const mesh = object;
        if (!mesh.isMesh) return;

        mesh.frustumCulled = true;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        const materialValue = mesh.material;
        const materials = Array.isArray(materialValue)
          ? materialValue
          : materialValue
            ? [materialValue]
            : [];

        for (const material of materials) {
          if (
            "envMapIntensity" in material
          ) {
            (material as any).envMapIntensity = 0.82;
          }
          material.needsUpdate = true;
        }
      });

      next.model = model;
      next.root.add(model);
      next.root.rotation.set(
        -0.08,
        0.42,
        0.04,
      );
      next.status = "READY";
      next.lastMotionAt = 0;
      next.renderer.render(
        next.scene,
        next.camera,
      );
    },
    undefined,
    () => {
      if (!next.disposed) {
        next.status = "FAILED";
      }
    },
  );

  return next;
};

const destroyRuntime = (
  active: GameplayRuntime | null,
) => {
  if (!active) return;

  active.disposed = true;

  if (active.model) {
    active.root.remove(active.model);
    disposeObject3D(active.model);
  }

  active.renderer.dispose();
  active.renderer.forceContextLoss?.();
};

const ensureRuntime = (
  preset: QualityPreset,
) => {
  if (
    runtime &&
    !runtime.disposed &&
    runtime.preset === preset
  ) {
    return runtime;
  }

  destroyRuntime(runtime);
  runtime = createRuntime(preset);
  return runtime;
};

const stepRuntimeMotion = (
  active: GameplayRuntime,
  nowMs: number,
) => {
  const elapsedSeconds =
    active.lastMotionAt > 0
      ? Math.min(
          0.1,
          Math.max(
            0,
            nowMs - active.lastMotionAt,
          ) / 1000,
        )
      : 0;
  active.lastMotionAt = nowMs;

  const timeSeconds = nowMs / 1000;

  active.root.position.y =
    Math.sin(timeSeconds * 0.81) * 0.025;

  const smoothing =
    1 - Math.exp(-elapsedSeconds * 6.5);
  const dx = Number.isFinite(active.threatDirectionX)
    ? Math.max(-1, Math.min(1, active.threatDirectionX))
    : 0;
  const dy = Number.isFinite(active.threatDirectionY)
    ? Math.max(-1, Math.min(1, active.threatDirectionY))
    : 0;

  const neutralYaw = 0.42;
  const neutralPitch = -0.08;
  const neutralRoll = 0.04;
  const targetYaw = neutralYaw + dx * 0.72;
  const targetPitch = neutralPitch - dy * 0.34;
  const targetRoll = neutralRoll - dx * dy * 0.08;

  active.root.rotation.y +=
    (targetYaw - active.root.rotation.y) * smoothing;
  active.root.rotation.x +=
    (targetPitch - active.root.rotation.x) * smoothing;
  active.root.rotation.z +=
    (targetRoll - active.root.rotation.z) * smoothing;

  active.camera.position.x =
    dx * 0.035;
  active.camera.position.y =
    0.04 - dy * 0.02;
  active.camera.lookAt(0, 0.02, 0);
};

export const prewarmFotonGameplay3D = (
  preset: QualityPreset,
) => {
  ensureRuntime(preset);
};

export const getFotonGameplay3DFrame = (
  request: FotonGameplay3DFrameRequest,
): HTMLCanvasElement | null => {
  const active = ensureRuntime(
    request.qualityPreset,
  );
  if (
    !active ||
    active.status !== "READY"
  ) {
    return null;
  }

  active.threatDirectionX =
    request.threatDirectionX ?? 0;
  active.threatDirectionY =
    request.threatDirectionY ?? 0;

  if (
    !request.paused &&
    !document.hidden
  ) {
    const frameInterval =
      1000 / active.config.targetFps;

    if (
      request.nowMs -
        active.lastFrameAt >=
      frameInterval
    ) {
      stepRuntimeMotion(
        active,
        request.nowMs,
      );
      active.lastFrameAt =
        request.nowMs;
      active.renderer.render(
        active.scene,
        active.camera,
      );
    }
  }

  return active.renderer.domElement;
};

export const getFotonGameplay3DStatus = () =>
  runtime?.status ?? "LOADING";

export const disposeFotonGameplay3D = () => {
  destroyRuntime(runtime);
  runtime = null;
};
