import React from "react";

export type CampaignGuideLanguage = "es" | "en";

interface CampaignArcProps {
  language: CampaignGuideLanguage;
}

const COPY = {
  es: {
    title: "ARCO DE CAMPAÑA",
    subtitle: "10 sectores para dominar el enjambre antes del modo infinito.",
    stages: [
      { range: "01–02", title: "SINCRONIZACIÓN", desc: "Movimiento, recolección y lectura del campo." },
      { range: "03–04", title: "FORMACIONES", desc: "Aprende cuándo cambiar la geometría del enjambre." },
      { range: "05–06", title: "ADAPTACIÓN", desc: "Combina afinidades, upgrades y control de amenazas." },
      { range: "07–08", title: "PRESIÓN", desc: "Disrupción, élites y decisiones bajo mayor densidad." },
      { range: "09", title: "ASEDIO FINAL", desc: "Consolida tu build antes del último sector." },
      { range: "10", title: "BLACKOUT DEVOURER", desc: "Prueba final de lectura, movilidad y control del enjambre." },
    ],
  },
  en: {
    title: "CAMPAIGN ARC",
    subtitle: "10 sectors to master the swarm before endless mode.",
    stages: [
      { range: "01–02", title: "SYNCHRONIZATION", desc: "Movement, harvesting and battlefield reading." },
      { range: "03–04", title: "FORMATIONS", desc: "Learn when to reshape the swarm." },
      { range: "05–06", title: "ADAPTATION", desc: "Combine affinities, upgrades and threat control." },
      { range: "07–08", title: "PRESSURE", desc: "Disruption, elites and higher-density decisions." },
      { range: "09", title: "FINAL SIEGE", desc: "Consolidate your build before the last sector." },
      { range: "10", title: "BLACKOUT DEVOURER", desc: "Final test of reading, mobility and swarm control." },
    ],
  },
} as const;

export const CampaignArc: React.FC<CampaignArcProps> = ({ language }) => {
  const copy = COPY[language];

  return (
    <section className="orbi-campaign-arc" aria-label={copy.title}>
      <div className="orbi-campaign-arc__header">
        <span className="orbi-campaign-arc__eyebrow">{copy.title}</span>
        <p>{copy.subtitle}</p>
      </div>
      <div className="orbi-campaign-arc__grid">
        {copy.stages.map((stage, index) => (
          <article
            key={stage.range}
            className={`orbi-campaign-stage ${index === copy.stages.length - 1 ? "orbi-campaign-stage--boss" : ""}`}
          >
            <span className="orbi-campaign-stage__range">SECTOR {stage.range}</span>
            <strong>{stage.title}</strong>
            <p>{stage.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CampaignArc;
