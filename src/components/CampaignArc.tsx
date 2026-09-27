import React from "react";
import {
  CAMPAIGN_GUIDE_STAGES,
  type CampaignGuideLanguage,
} from "../game/campaignGuide";

interface CampaignArcProps {
  language: CampaignGuideLanguage;
}

const HEADER = {
  es: {
    title: "ARCO DE CAMPAÑA",
    subtitle: "10 sectores para dominar el enjambre y enfrentar al Blackout Devourer.",
  },
  en: {
    title: "CAMPAIGN ARC",
    subtitle: "10 sectors to master the swarm and face the Blackout Devourer.",
  },
} as const;

export const CampaignArc: React.FC<CampaignArcProps> = ({ language }) => {
  const header = HEADER[language];

  return (
    <section className="orbi-campaign-arc" aria-label={header.title}>
      <div className="orbi-campaign-arc__header">
        <span className="orbi-campaign-arc__eyebrow">{header.title}</span>
        <p>{header.subtitle}</p>
      </div>
      <div className="orbi-campaign-arc__grid">
        {CAMPAIGN_GUIDE_STAGES.map((stage) => (
          <article
            key={stage.id}
            className={`orbi-campaign-stage ${stage.boss ? "orbi-campaign-stage--boss" : ""}`}
          >
            <span className="orbi-campaign-stage__range">SECTOR {stage.rangeLabel}</span>
            <strong>{stage.title[language]}</strong>
            <p>{stage.description[language]}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CampaignArc;
