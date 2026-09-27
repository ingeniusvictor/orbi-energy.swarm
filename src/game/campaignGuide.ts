export type CampaignGuideLanguage = "es" | "en";

export interface CampaignGuideStage {
  id: string;
  sectors: readonly number[];
  rangeLabel: string;
  title: Record<CampaignGuideLanguage, string>;
  description: Record<CampaignGuideLanguage, string>;
  objective: Record<CampaignGuideLanguage, string>;
  boss?: boolean;
}

export const CAMPAIGN_GUIDE_STAGES: readonly CampaignGuideStage[] = [
  {
    id: "synchronization",
    sectors: [1, 2],
    rangeLabel: "01–02",
    title: { es: "SINCRONIZACIÓN", en: "SYNCHRONIZATION" },
    description: {
      es: "Movimiento, recolección y lectura del campo.",
      en: "Movement, harvesting and battlefield reading.",
    },
    objective: {
      es: "Muévete, recluta Orbis y mantén el núcleo fuera del peligro.",
      en: "Move, recruit Orbis and keep the core out of danger.",
    },
  },
  {
    id: "formations",
    sectors: [3, 4],
    rangeLabel: "03–04",
    title: { es: "FORMACIONES", en: "FORMATIONS" },
    description: {
      es: "Aprende cuándo cambiar la geometría del enjambre.",
      en: "Learn when to reshape the swarm.",
    },
    objective: {
      es: "Cambia de formación según el tipo y dirección de la amenaza.",
      en: "Change formation to match threat type and direction.",
    },
  },
  {
    id: "adaptation",
    sectors: [5, 6],
    rangeLabel: "05–06",
    title: { es: "ADAPTACIÓN", en: "ADAPTATION" },
    description: {
      es: "Combina afinidades, upgrades y control de amenazas.",
      en: "Combine affinities, upgrades and threat control.",
    },
    objective: {
      es: "Construye sinergias y prioriza los enemigos que rompen tu ritmo.",
      en: "Build synergies and prioritize enemies that disrupt your rhythm.",
    },
  },
  {
    id: "pressure",
    sectors: [7, 8],
    rangeLabel: "07–08",
    title: { es: "PRESIÓN", en: "PRESSURE" },
    description: {
      es: "Disrupción, élites y decisiones bajo mayor densidad.",
      en: "Disruption, elites and higher-density decisions.",
    },
    objective: {
      es: "Conserva espacio de maniobra mientras respondes a élites y pulsos.",
      en: "Preserve maneuvering room while responding to elites and pulses.",
    },
  },
  {
    id: "final-siege",
    sectors: [9],
    rangeLabel: "09",
    title: { es: "ASEDIO FINAL", en: "FINAL SIEGE" },
    description: {
      es: "Consolida tu build antes del último sector.",
      en: "Consolidate your build before the last sector.",
    },
    objective: {
      es: "Protege recursos y estabiliza tu build para el enfrentamiento final.",
      en: "Protect resources and stabilize your build for the final encounter.",
    },
  },
  {
    id: "blackout-devourer",
    sectors: [10],
    rangeLabel: "10",
    title: { es: "BLACKOUT DEVOURER", en: "BLACKOUT DEVOURER" },
    description: {
      es: "Prueba final de lectura, movilidad y control del enjambre.",
      en: "Final test of reading, mobility and swarm control.",
    },
    objective: {
      es: "Lee los telegraphs, destruye nodos y castiga el núcleo cuando quede expuesto.",
      en: "Read telegraphs, destroy shield nodes and punish the exposed core.",
    },
    boss: true,
  },
] as const;

export const getCampaignGuideStage = (sector: number) =>
  CAMPAIGN_GUIDE_STAGES.find((stage) => stage.sectors.includes(sector));

export const getCampaignObjective = (
  sector: number,
  language: CampaignGuideLanguage,
) => getCampaignGuideStage(sector)?.objective[language] ?? null;
