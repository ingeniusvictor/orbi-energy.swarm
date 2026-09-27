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
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  root: THREE.Group;
  model: THREE.Object3D | null;
  lastFrameAt: number;
  lastMotionAt: number;
}

export const FOTON_GAMEPLAY_DRAW_SIZE = 50;

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

const disposeObject3D = (root: THREE.Object3D) => {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
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
          (value as THREE.Texture).isTexture
        ) {
          (value as THREE.Texture).dispose();
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
    preserveDrawingBuffer: false,
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
  };

  const loader = new GLTFLoader();
  loader.load(
    `${import.meta.env.BASE_URL}assets/orbi-foton.glb`,
    (gltf) => {
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

      model.traverse((object) => {
        const mesh = object as THREE.Mesh;
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
            (
              material as THREE.MeshStandardMaterial
            ).envMapIntensity = 0.82;
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

  // Continuous full 360-degree rotation around Y keeps the complete GLB
  // visible over time; X/Z oscillation varies the viewing attitude.
  active.root.rotation.y +=
    elapsedSeconds * 0.58;
  active.root.rotation.x =
    Math.sin(timeSeconds * 0.67) * 0.17;
  active.root.rotation.z =
    Math.cos(timeSeconds * 0.43) * 0.1;
  active.root.position.y =
    Math.sin(timeSeconds * 0.81) * 0.035;

  active.camera.position.x =
    Math.sin(timeSeconds * 0.29) * 0.045;
  active.camera.position.y =
    0.04 +
    Math.cos(timeSeconds * 0.37) * 0.025;
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
