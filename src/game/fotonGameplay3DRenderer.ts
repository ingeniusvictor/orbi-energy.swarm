import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import {
  FOTON_DYSON_HALO_RINGS,
  getUnlockedDysonHaloRingCount,
  type FotonDysonHaloRingDescriptor,
} from "./fotonDysonHalo";
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
  // Legacy field name kept at the Canvas boundary. The current caller supplies
  // the monotonic per-run count of acquired Orbis, not the live follower count.
  orbiCount?: number | null;
  shieldRatio?: number | null;
  goldenCoreActive?: boolean | null;
}

type RuntimeStatus =
  | "LOADING"
  | "READY"
  | "FAILED";

interface DysonHaloRuntimeRing {
  descriptor: FotonDysonHaloRingDescriptor;
  planeRoot: any;
  spinRoot: any;
  core: any;
  glow: any;
  coreMaterial: any;
  glowMaterial: any;
  segmentMesh: any;
  segmentMaterial: any;
  segmentCount: number;
  accentMesh: any;
  accentMaterial: any;
  buildProgress: number;
  indexCount: number;
}

interface GameplayRuntime {
  preset: QualityPreset;
  config: FotonGameplay3DRuntimeConfig;
  status: RuntimeStatus;
  disposed: boolean;
  renderer: any;
  scene: any;
  camera: any;
  root: any;
  haloRoot: any;
  haloRings: DysonHaloRuntimeRing[];
  model: any;
  lastFrameAt: number;
  lastMotionAt: number;
  threatDirectionX: number;
  threatDirectionY: number;
  orbiCount: number;
  shieldRatio: number;
  goldenCoreActive: boolean;
}

export const FOTON_GAMEPLAY_DRAW_SIZE = 37.5;
export const FOTON_GAMEPLAY_COMPOSITE_SIZE = 49.2;

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

const clamp01 = (value: number) =>
  Math.max(0, Math.min(1, value));

const getDysonHaloGeometryDetail = (
  preset: QualityPreset,
) => {
  switch (preset) {
    case QualityPreset.LOW:
      return {
        radialSegments: 5,
        tubularSegments: 48,
        segmentCount: 12,
      };
    case QualityPreset.MEDIUM:
      return {
        radialSegments: 6,
        tubularSegments: 64,
        segmentCount: 16,
      };
    case QualityPreset.HIGH:
      return {
        radialSegments: 7,
        tubularSegments: 80,
        segmentCount: 20,
      };
    case QualityPreset.ULTRA:
    default:
      return {
        radialSegments: 8,
        tubularSegments: 96,
        segmentCount: 24,
      };
  }
};

const setRingInstanceTransform = (
  target: any,
  index: number,
  count: number,
  radius: number,
  z = 0,
) => {
  const angle =
    (index / count) * Math.PI * 2;
  target.position.set(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius,
    z,
  );
  target.rotation.set(0, 0, angle + Math.PI / 2);
  target.scale.set(1, 1, 1);
  target.updateMatrix();
};

const createDysonHaloRing = (
  descriptor: FotonDysonHaloRingDescriptor,
  preset: QualityPreset,
): DysonHaloRuntimeRing => {
  const detail = getDysonHaloGeometryDetail(preset);
  const planeRoot = new THREE.Group();
  planeRoot.rotation.set(
    descriptor.tilt[0],
    descriptor.tilt[1],
    descriptor.tilt[2],
  );

  const spinRoot = new THREE.Group();
  planeRoot.add(spinRoot);

  // Continuous dark structural rail. Golden Core never adds a second orbit:
  // its warm metallic state is folded into this first cyan rail at runtime.
  const geometry = new THREE.TorusGeometry(
    descriptor.radius,
    descriptor.railTubeRadius,
    detail.radialSegments,
    detail.tubularSegments,
  );
  const indexCount =
    geometry.index?.count ??
    geometry.attributes.position.count;
  geometry.setDrawRange(0, 0);

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    emissive: 0x000000,
    emissiveIntensity: 0,
    metalness: 0.92,
    roughness: 0.24,
    transparent: true,
    opacity: 0,
    depthTest: true,
    depthWrite: false,
  });
  const core = new THREE.Mesh(
    geometry,
    coreMaterial,
  );
  spinRoot.add(core);

  // A single narrow energy conduit hugs the structural rail. Keeping it almost
  // exactly on the rail avoids the old double-torus appearance.
  const glowGeometry = new THREE.TorusGeometry(
    descriptor.radius,
    descriptor.energyTubeRadius,
    Math.max(4, detail.radialSegments - 2),
    detail.tubularSegments,
  );
  glowGeometry.setDrawRange(0, 0);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: descriptor.color,
    transparent: true,
    opacity: 0,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const glow = new THREE.Mesh(
    glowGeometry,
    glowMaterial,
  );
  spinRoot.add(glow);

  // Premium segmented light bars: one instanced draw call per ring, arranged
  // tangentially around the rail. The dark rail stays visible between bars,
  // creating the mechanical orbital language from the approved concept.
  const circumference =
    Math.PI * 2 * descriptor.radius;
  const segmentLength =
    (circumference / detail.segmentCount) *
    descriptor.segmentArcFraction;
  const segmentGeometry = new THREE.BoxGeometry(
    segmentLength,
    descriptor.railTubeRadius * 0.58,
    descriptor.railTubeRadius * 0.72,
  );
  const segmentMaterial = new THREE.MeshBasicMaterial({
    color: descriptor.color,
    transparent: true,
    opacity: 0,
    depthTest: true,
    depthWrite: false,
    toneMapped: false,
  });
  const segmentMesh = new THREE.InstancedMesh(
    segmentGeometry,
    segmentMaterial,
    detail.segmentCount,
  );
  segmentMesh.count = 0;
  segmentMesh.frustumCulled = false;
  const segmentTransform = new THREE.Object3D();
  for (
    let index = 0;
    index < detail.segmentCount;
    index += 1
  ) {
    setRingInstanceTransform(
      segmentTransform,
      index,
      detail.segmentCount,
      descriptor.radius,
      descriptor.railTubeRadius * 0.42,
    );
    segmentMesh.setMatrixAt(
      index,
      segmentTransform.matrix,
    );
  }
  segmentMesh.instanceMatrix.needsUpdate = true;
  spinRoot.add(segmentMesh);

  // Small red tactical nodes are intentionally sparse. They read as subsystem
  // junctions rather than a fourth color band.
  const accentGeometry = new THREE.SphereGeometry(
    descriptor.railTubeRadius * 1.35,
    preset === QualityPreset.LOW ? 6 : 8,
    preset === QualityPreset.LOW ? 4 : 6,
  );
  const accentMaterial = new THREE.MeshBasicMaterial({
    color: descriptor.accentColor,
    transparent: true,
    opacity: 0,
    depthTest: true,
    depthWrite: false,
    toneMapped: false,
  });
  const accentMesh = new THREE.InstancedMesh(
    accentGeometry,
    accentMaterial,
    descriptor.accentNodeCount,
  );
  accentMesh.count = 0;
  accentMesh.frustumCulled = false;
  const accentTransform = new THREE.Object3D();
  for (
    let index = 0;
    index < descriptor.accentNodeCount;
    index += 1
  ) {
    const angle =
      descriptor.phase +
      (index / descriptor.accentNodeCount) *
        Math.PI *
        2;
    accentTransform.position.set(
      Math.cos(angle) * descriptor.radius,
      Math.sin(angle) * descriptor.radius,
      descriptor.railTubeRadius * 0.55,
    );
    accentTransform.rotation.set(0, 0, angle);
    accentTransform.updateMatrix();
    accentMesh.setMatrixAt(
      index,
      accentTransform.matrix,
    );
  }
  accentMesh.instanceMatrix.needsUpdate = true;
  spinRoot.add(accentMesh);

  return {
    descriptor,
    planeRoot,
    spinRoot,
    core,
    glow,
    coreMaterial,
    glowMaterial,
    segmentMesh,
    segmentMaterial,
    segmentCount: detail.segmentCount,
    accentMesh,
    accentMaterial,
    buildProgress: 0,
    indexCount,
  };
};

const createDysonHaloRuntime = (
  preset: QualityPreset,
) => {
  const haloRoot = new THREE.Group();
  const haloRings = FOTON_DYSON_HALO_RINGS.map(
    (descriptor) =>
      createDysonHaloRing(descriptor, preset),
  );

  for (const ring of haloRings) {
    haloRoot.add(ring.planeRoot);
  }

  return { haloRoot, haloRings };
};

const stepDysonHalo = (
  active: GameplayRuntime,
  nowMs: number,
  elapsedSeconds: number,
) => {
  const unlockedRingCount =
    getUnlockedDysonHaloRingCount(
      active.orbiCount,
    );
  const shieldRatio = clamp01(active.shieldRatio);
  const timeSeconds = nowMs / 1000;

  active.haloRoot.position.y =
    active.root.position.y;

  active.haloRings.forEach((ring, index) => {
    const target = index < unlockedRingCount ? 1 : 0;
    const step =
      (elapsedSeconds * 1000) /
      ring.descriptor.buildDurationMs;

    if (target > ring.buildProgress) {
      ring.buildProgress = Math.min(
        target,
        ring.buildProgress + step,
      );
    } else if (target < ring.buildProgress) {
      ring.buildProgress = Math.max(
        target,
        ring.buildProgress - step,
      );
    }

    const progress = ring.buildProgress;
    ring.planeRoot.visible = progress > 0.002;

    const revealCount =
      progress <= 0
        ? 0
        : Math.max(
            3,
            Math.floor(
              ring.indexCount * progress,
            ),
          );
    ring.core.geometry.setDrawRange(
      0,
      revealCount,
    );
    ring.glow.geometry.setDrawRange(
      0,
      Math.min(
        ring.glow.geometry.index?.count ?? revealCount,
        revealCount,
      ),
    );

    ring.segmentMesh.count =
      progress <= 0
        ? 0
        : Math.max(
            1,
            Math.min(
              ring.segmentCount,
              Math.ceil(
                ring.segmentCount * progress,
              ),
            ),
          );
    ring.accentMesh.count =
      progress < 0.45
        ? 0
        : Math.min(
            ring.descriptor.accentNodeCount,
            Math.ceil(
              ((progress - 0.45) / 0.55) *
                ring.descriptor.accentNodeCount,
            ),
          );

    const shieldIntensity =
      0.48 + shieldRatio * 0.52;
    ring.coreMaterial.opacity =
      progress * 0.95;

    if (index === 0) {
      const goldenPulse =
        0.16 +
        (Math.sin(timeSeconds * 1.35) + 1) * 0.03;
      ring.coreMaterial.color.setHex(
        active.goldenCoreActive
          ? 0x3d2b0a
          : 0x111827,
      );
      ring.coreMaterial.emissive.setHex(
        active.goldenCoreActive
          ? 0x5b3a05
          : 0x000000,
      );
      ring.coreMaterial.emissiveIntensity =
        active.goldenCoreActive ? goldenPulse : 0;
      ring.coreMaterial.metalness =
        active.goldenCoreActive ? 1 : 0.92;
      ring.coreMaterial.roughness =
        active.goldenCoreActive ? 0.18 : 0.24;
    }

    ring.segmentMaterial.opacity =
      progress *
      (0.58 + shieldIntensity * 0.32);
    ring.glowMaterial.opacity =
      progress *
      (0.08 +
        shieldIntensity * 0.1 +
        (Math.sin(
          timeSeconds * 1.15 +
            ring.descriptor.phase,
        ) +
          1) *
          0.012);
    ring.accentMaterial.opacity =
      progress *
      (0.42 + shieldIntensity * 0.28);

    const constructionScale =
      0.91 + progress * 0.09;
    ring.spinRoot.scale.setScalar(
      constructionScale,
    );
    ring.spinRoot.rotation.z =
      ring.descriptor.phase +
      timeSeconds *
        ring.descriptor.angularVelocity;

    // Small precession gives each orbit a living 3D relationship while the
    // independent spin remains deliberately slow and non-propeller-like.
    ring.planeRoot.rotation.x =
      ring.descriptor.tilt[0] +
      Math.sin(
        timeSeconds * 0.12 +
          ring.descriptor.phase,
      ) *
        0.018;
    ring.planeRoot.rotation.y =
      ring.descriptor.tilt[1] +
      Math.cos(
        timeSeconds * 0.1 +
          ring.descriptor.phase,
      ) *
        0.016;
    ring.planeRoot.rotation.z =
      ring.descriptor.tilt[2];
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
  // Keep the 37.5px body target while leaving transparent room for the
  // detached atomic/Dyson orbital structure.
  camera.position.set(0, 0.04, 4);
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

  // The Dyson halo is a sibling scene layer, never part of the GLB/root.
  const { haloRoot, haloRings } =
    createDysonHaloRuntime(preset);
  scene.add(haloRoot);

  const next: GameplayRuntime = {
    preset,
    config,
    status: "LOADING",
    disposed: false,
    renderer,
    scene,
    camera,
    root,
    haloRoot,
    haloRings,
    model: null,
    lastFrameAt: 0,
    lastMotionAt: 0,
    threatDirectionX: 0,
    threatDirectionY: 0,
    orbiCount: 0,
    shieldRatio: 1,
    goldenCoreActive: false,
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

  active.scene.remove(active.haloRoot);
  disposeObject3D(active.haloRoot);

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
  stepDysonHalo(
    active,
    nowMs,
    elapsedSeconds,
  );

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
  active.orbiCount =
    request.orbiCount ?? 0;
  active.shieldRatio =
    request.shieldRatio ?? 1;
  active.goldenCoreActive =
    request.goldenCoreActive ?? false;

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