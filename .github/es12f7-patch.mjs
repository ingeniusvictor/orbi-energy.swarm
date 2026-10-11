import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

const gamePath = "src/game/EnergySwarmGame.tsx";
let source = readFileSync(gamePath, "utf8");

const replaceOnce = (label, from, to) => {
  const index = source.indexOf(from);
  if (index < 0) throw new Error(`ES-12F7 patch anchor missing: ${label}`);
  if (source.indexOf(from, index + from.length) >= 0) {
    throw new Error(`ES-12F7 patch anchor duplicated: ${label}`);
  }
  source = source.slice(0, index) + to + source.slice(index + from.length);
};

replaceOnce(
  "types import",
  `  DialogueMessage, QualityPreset, WaveConfig, type RunArchiveEntry\n} from "./types";`,
  `  DialogueMessage, QualityPreset, WaveConfig, type RunArchiveEntry,\n  type OrbiAffinity, type OrbiCombatRole, type OrbiEnergyId\n} from "./types";`,
);

replaceOnce(
  "canon import",
  `import {\n  FOTON_THREAT_REFRESH_MS,\n  projectFotonThreatDirection,\n  selectFotonThreat,\n} from "./fotonThreatTracking";`,
  `import {\n  FOTON_THREAT_REFRESH_MS,\n  projectFotonThreatDirection,\n  selectFotonThreat,\n} from "./fotonThreatTracking";\nimport {\n  createShuffledCollectibleEnergyCycle,\n  getCollectibleEnergyDefinition,\n  getOrbiEnergyByAffinity,\n} from "./orbiEnergyCanon";`,
);

replaceOnce(
  "strongest affinity",
  `    const counts: Record<\n      Exclude<RunArchiveEntry["strongestAffinity"], "none">,\n      number\n    > = {\n      solar: 0,\n      hydro: 0,\n      wind: 0,\n      thermal: 0,\n      nuclear: 0,\n      quantum: 0,\n    };`,
  `    const counts: Record<OrbiAffinity, number> = {\n      solar: 0,\n      hydro: 0,\n      wind: 0,\n      thermal: 0,\n      magnetic: 0,\n      nuclear: 0,\n      kinetic: 0,\n      hydrogen: 0,\n      quantum: 0,\n      gaia: 0,\n    };`,
);

replaceOnce(
  "recruit bag",
  `  // --- SHUFFLE BAG FOR BALANCED ELEMENTAL RECRUITMENT ---\n  const recruitBagRef = useRef<Array<"solar" | "hydro" | "wind" | "thermal" | "nuclear" | "quantum">>([]);\n  const combatRoles: Array<"beam" | "rapid" | "pulse" | "arc" | "shield" | "support"> = [\n    "beam", "rapid", "pulse", "arc", "shield", "support"\n  ];\n  const personalities = ["Curious", "Bold", "Cynical", "Joyful", "Silent", "Anxious", "Enthusiastic", "Calm", "Fiery", "Stoic"];\n\n  const getNextAffinityFromBag = (): "solar" | "hydro" | "wind" | "thermal" | "nuclear" | "quantum" => {\n    if (recruitBagRef.current.length === 0) {\n      // Base suggested distribution percentages: solar: 17%, hydro: 17%, wind: 17%, thermal: 17%, nuclear: 16%, quantum: 16%\n      const temp: Array<"solar" | "hydro" | "wind" | "thermal" | "nuclear" | "quantum"> = [];\n      for (let i = 0; i < 17; i++) temp.push("solar");\n      for (let i = 0; i < 17; i++) temp.push("hydro");\n      for (let i = 0; i < 17; i++) temp.push("wind");\n      for (let i = 0; i < 17; i++) temp.push("thermal");\n      for (let i = 0; i < 16; i++) temp.push("nuclear");\n      for (let i = 0; i < 16; i++) temp.push("quantum");\n\n      // Fisher-Yates shuffle\n      for (let i = temp.length - 1; i > 0; i--) {\n        const j = Math.floor(Math.random() * (i + 1));\n        const hold = temp[i];\n        temp[i] = temp[j];\n        temp[j] = hold;\n      }\n      recruitBagRef.current = temp;\n    }\n    return recruitBagRef.current.pop()!;\n  };`,
  `  // --- CANONICAL ORBI ENERGY RECRUITMENT CYCLE ---\n  // FOTON is the player core and GAIA is fusion-only. Every shuffled cycle\n  // therefore contains each of the eight collectible base energies exactly once.\n  const recruitBagRef = useRef<OrbiEnergyId[]>([]);\n  const personalities = ["Curious", "Bold", "Cynical", "Joyful", "Silent", "Anxious", "Enthusiastic", "Calm", "Fiery", "Stoic"];\n\n  const getNextEnergyIdFromBag = (): OrbiEnergyId => {\n    if (recruitBagRef.current.length === 0) {\n      recruitBagRef.current = createShuffledCollectibleEnergyCycle();\n    }\n    return recruitBagRef.current.pop()!;\n  };`,
);

replaceOnce(
  "add member signature",
  `  const addSwarmMember = (\n    predefinedAffinity?: "solar" | "hydro" | "wind" | "thermal" | "nuclear" | "quantum",\n    predefinedCombatRole?: "beam" | "rapid" | "pulse" | "arc" | "shield" | "support"\n  ) => {\n    const affinity = predefinedAffinity || getNextAffinityFromBag();\n    const combatRole = predefinedCombatRole || combatRoles[Math.floor(Math.random() * combatRoles.length)];`,
  `  const addSwarmMember = (\n    predefinedAffinity?: OrbiAffinity,\n    predefinedCombatRole?: OrbiCombatRole,\n    predefinedEnergyId?: OrbiEnergyId,\n  ) => {\n    const energyDefinition = predefinedEnergyId\n      ? getCollectibleEnergyDefinition(predefinedEnergyId)\n      : predefinedAffinity\n        ? getOrbiEnergyByAffinity(predefinedAffinity)\n        : getCollectibleEnergyDefinition(getNextEnergyIdFromBag());\n    const affinity = energyDefinition.affinity;\n    const combatRole = predefinedCombatRole || energyDefinition.combatRole;`,
);

replaceOnce(
  "generic names and colors",
  `    const names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa"];\n    const baseName = names[Math.floor(Math.random() * names.length)] + "-" + (swarmRef.current.length + 1);\n\n    // Identity and Color based on affinity (Section 7)\n    let color = "#f59e0b";\n    if (affinity === "hydro") color = "#0ea5e9";\n    else if (affinity === "wind") color = "#10b981";\n    else if (affinity === "thermal") color = "#ef4444";\n    else if (affinity === "nuclear") color = "#8b5cf6";\n    else if (affinity === "quantum") color = "#ec4899";`,
  `    const baseName = \`${"${energyDefinition.displayName}