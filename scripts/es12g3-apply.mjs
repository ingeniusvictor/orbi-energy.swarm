import { readFileSync, writeFileSync } from "node:fs";

const replaceExpected = (path, from, to, expected = 1) => {
  const source = readFileSync(path, "utf8");
  const count = source.split(from).length - 1;
  if (count !== expected) {
    throw new Error(`${path}: expected ${expected} matches, got ${count}:\n${from}`);
  }
  writeFileSync(path, source.split(from).join(to));
};

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `import {\n  GAIA_REQUIRED_ENERGY_COUNT,\n  createGaiaEvolutionState,\n  getGaiaCombatScale,\n  getGaiaProgressCount,\n  registerGaiaEnergy,\n} from "./gaiaEvolution";\n\ntype InfiniteBossRematchProfile`,
  `import {\n  GAIA_REQUIRED_ENERGY_COUNT,\n  createGaiaEvolutionState,\n  getGaiaCombatScale,\n  getGaiaProgressCount,\n  registerGaiaEnergy,\n} from "./gaiaEvolution";\nimport {\n  PERFORMANCE_EVIDENCE_TARGET_SAMPLES,\n  appendPerformanceEvidenceSample,\n  buildPerformanceEvidenceCapture,\n  createPerformanceEvidenceRecorderState,\n  downloadPerformanceEvidence,\n  getBrowserPerformanceEvidenceMetadata,\n  startPerformanceEvidenceRecording,\n  type PerformanceEvidenceRecorderStatus,\n} from "./performanceEvidenceRecorder";\n\ntype InfiniteBossRematchProfile`,
);

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `  const [\n    performanceDiagnosticsSnapshot,\n    setPerformanceDiagnosticsSnapshot,\n  ] = useState<PerformanceDiagnosticsSnapshot | null>(null);\n  const [isGameOver, setIsGameOver] = useState(false);`,
  `  const [\n    performanceDiagnosticsSnapshot,\n    setPerformanceDiagnosticsSnapshot,\n  ] = useState<PerformanceDiagnosticsSnapshot | null>(null);\n  const [performanceEvidenceStatus, setPerformanceEvidenceStatus] =\n    useState<PerformanceEvidenceRecorderStatus>("IDLE");\n  const [performanceEvidenceSamples, setPerformanceEvidenceSamples] =\n    useState(0);\n  const [isGameOver, setIsGameOver] = useState(false);`,
);

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `  const performanceDiagnosticsStateRef =\n    useRef<PerformanceDiagnosticsState>(\n      createPerformanceDiagnosticsState(),\n    );\n  const isPausedRef = useRef(false);`,
  `  const performanceDiagnosticsStateRef =\n    useRef<PerformanceDiagnosticsState>(\n      createPerformanceDiagnosticsState(),\n    );\n  const performanceEvidenceRecorderRef = useRef(\n    createPerformanceEvidenceRecorderState(),\n  );\n  const isPausedRef = useRef(false);`,
);

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `  const togglePerformanceDiagnostics = () => {\n    const next = !performanceDiagnosticsEnabledRef.current;\n    performanceDiagnosticsEnabledRef.current = next;\n    performanceDiagnosticsStateRef.current =\n      createPerformanceDiagnosticsState();\n    setPerformanceDiagnosticsSnapshot(null);\n    setPerformanceDiagnosticsEnabled(next);\n  };`,
  `  const togglePerformanceDiagnostics = () => {\n    const next = !performanceDiagnosticsEnabledRef.current;\n    if (\n      !next &&\n      performanceEvidenceRecorderRef.current.status === "RECORDING"\n    ) {\n      postDialogue(\n        "SYSTEM",\n        "EVIDENCE REC activa: F4 detiene/exporta antes de cerrar F3.",\n      );\n      return;\n    }\n    performanceDiagnosticsEnabledRef.current = next;\n    performanceDiagnosticsStateRef.current =\n      createPerformanceDiagnosticsState();\n    setPerformanceDiagnosticsSnapshot(null);\n    setPerformanceDiagnosticsEnabled(next);\n  };\n\n  const resetPerformanceEvidenceRecorder = () => {\n    performanceEvidenceRecorderRef.current =\n      createPerformanceEvidenceRecorderState();\n    setPerformanceEvidenceStatus("IDLE");\n    setPerformanceEvidenceSamples(0);\n  };\n\n  const handlePerformanceEvidenceHotkey = () => {\n    const recorder = performanceEvidenceRecorderRef.current;\n\n    if (recorder.status === "IDLE") {\n      if (!performanceDiagnosticsEnabledRef.current) {\n        performanceDiagnosticsEnabledRef.current = true;\n        performanceDiagnosticsStateRef.current =\n          createPerformanceDiagnosticsState();\n        setPerformanceDiagnosticsSnapshot(null);\n        setPerformanceDiagnosticsEnabled(true);\n      }\n\n      performanceEvidenceRecorderRef.current =\n        startPerformanceEvidenceRecording(Date.now());\n      setPerformanceEvidenceStatus("RECORDING");\n      setPerformanceEvidenceSamples(0);\n      postDialogue(\n        "SYSTEM",\n        `EVIDENCE REC iniciada · ${PERFORMANCE_EVIDENCE_TARGET_SAMPLES} snapshots / 15 s.`,\n      );\n      return;\n    }\n\n    const capture = buildPerformanceEvidenceCapture(\n      recorder,\n      Date.now(),\n      getBrowserPerformanceEvidenceMetadata(),\n    );\n\n    if (capture) {\n      const downloaded = downloadPerformanceEvidence(capture);\n      postDialogue(\n        "SYSTEM",\n        downloaded\n          ? capture.complete\n            ? "EVIDENCE COMPLETE exportada."\n            : "EVIDENCE PARTIAL exportada."\n          : "EVIDENCE preparada, pero el navegador bloqueó la descarga.",\n      );\n    } else {\n      postDialogue("SYSTEM", "EVIDENCE REC cancelada sin muestras.");\n    }\n\n    resetPerformanceEvidenceRecorder();\n  };`,
);

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `    performanceDiagnosticsStateRef.current =\n      createPerformanceDiagnosticsState();\n    setPerformanceDiagnosticsSnapshot(null);\n    runtimeProjectionBundleCacheRef.current =`,
  `    performanceDiagnosticsStateRef.current =\n      createPerformanceDiagnosticsState();\n    setPerformanceDiagnosticsSnapshot(null);\n    performanceEvidenceRecorderRef.current =\n      createPerformanceEvidenceRecorderState();\n    setPerformanceEvidenceStatus("IDLE");\n    setPerformanceEvidenceSamples(0);\n    runtimeProjectionBundleCacheRef.current =`,
);

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `      if (diagnostics.snapshot) {\n        setPerformanceDiagnosticsSnapshot(\n          diagnostics.snapshot,\n        );\n      }`,
  `      if (diagnostics.snapshot) {\n        setPerformanceDiagnosticsSnapshot(\n          diagnostics.snapshot,\n        );\n\n        const evidenceRecorder =\n          performanceEvidenceRecorderRef.current;\n        if (evidenceRecorder.status === "RECORDING") {\n          const nextEvidenceRecorder =\n            appendPerformanceEvidenceSample(\n              evidenceRecorder,\n              diagnostics.snapshot,\n            );\n          performanceEvidenceRecorderRef.current =\n            nextEvidenceRecorder;\n          setPerformanceEvidenceStatus(\n            nextEvidenceRecorder.status,\n          );\n          setPerformanceEvidenceSamples(\n            nextEvidenceRecorder.samples.length,\n          );\n\n          if (nextEvidenceRecorder.status === "READY") {\n            postDialogue(\n              "SYSTEM",\n              "EVIDENCE READY · 15 s completos. F4 para exportar JSON.",\n            );\n          }\n        }\n      }`,
);

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `      if (key === "F3") {\n        e.preventDefault();\n        togglePerformanceDiagnostics();\n        return;\n      }\n\n      if (isPhotoMode) {`,
  `      if (key === "F3") {\n        e.preventDefault();\n        togglePerformanceDiagnostics();\n        return;\n      }\n\n      if (key === "F4") {\n        e.preventDefault();\n        handlePerformanceEvidenceHotkey();\n        return;\n      }\n\n      if (isPhotoMode) {`,
);

replaceExpected(
  "src/game/EnergySwarmGame.tsx",
  `                  <PerformanceDiagnosticsOverlay\n                    snapshot={performanceDiagnosticsSnapshot}\n                  />`,
  `                  <PerformanceDiagnosticsOverlay\n                    snapshot={performanceDiagnosticsSnapshot}\n                    evidenceStatus={performanceEvidenceStatus}\n                    evidenceSamples={performanceEvidenceSamples}\n                    evidenceTargetSamples={\n                      PERFORMANCE_EVIDENCE_TARGET_SAMPLES\n                    }\n                  />`,
);

replaceExpected(
  "src/components/PerformanceDiagnosticsOverlay.tsx",
  `import type { PerformanceDiagnosticsSnapshot } from "../game/performanceDiagnostics";\n\ninterface PerformanceDiagnosticsOverlayProps {\n  snapshot: PerformanceDiagnosticsSnapshot | null;\n}`,
  `import type { PerformanceDiagnosticsSnapshot } from "../game/performanceDiagnostics";\nimport type { PerformanceEvidenceRecorderStatus } from "../game/performanceEvidenceRecorder";\n\ninterface PerformanceDiagnosticsOverlayProps {\n  snapshot: PerformanceDiagnosticsSnapshot | null;\n  evidenceStatus?: PerformanceEvidenceRecorderStatus;\n  evidenceSamples?: number;\n  evidenceTargetSamples?: number;\n}`,
);

replaceExpected(
  "src/components/PerformanceDiagnosticsOverlay.tsx",
  `> = ({ snapshot }) => {`,
  `> = ({\n  snapshot,\n  evidenceStatus = "IDLE",\n  evidenceSamples = 0,\n  evidenceTargetSamples = 30,\n}) => {`,
);

replaceExpected(
  "src/components/PerformanceDiagnosticsOverlay.tsx",
  `          </div>\n\n          <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-1.5 text-[7px] uppercase">`,
  `          </div>\n\n          <div\n            className="mt-1.5 flex items-center justify-between rounded border border-cyan-400/15 bg-cyan-400/5 px-1.5 py-1 text-[7px] uppercase"\n            data-performance-evidence="true"\n          >\n            <span className="text-slate-500">EVIDENCE</span>\n            <span\n              className={\n                evidenceStatus === "READY"\n                  ? "text-emerald-300"\n                  : evidenceStatus === "RECORDING"\n                    ? "text-amber-300"\n                    : "text-cyan-300"\n              }\n            >\n              {evidenceStatus === "READY"\n                ? `READY ${evidenceSamples}/${evidenceTargetSamples} · F4 EXPORT`\n                : evidenceStatus === "RECORDING"\n                  ? `REC ${evidenceSamples}/${evidenceTargetSamples} · F4 STOP`\n                  : "F4 START"}\n            </span>\n          </div>\n\n          <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-1.5 text-[7px] uppercase">`,
);

console.log("ES-12G3 evidence recorder integration applied");
