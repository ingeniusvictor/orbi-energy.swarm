import React from "react";

export const PremiumBackdrop: React.FC = () => (
  <div className="orbi-premium-backdrop" aria-hidden="true">
    <div className="orbi-premium-aurora orbi-premium-aurora--cyan" />
    <div className="orbi-premium-aurora orbi-premium-aurora--violet" />
    <div className="orbi-premium-aurora orbi-premium-aurora--amber" />
    <div className="orbi-premium-starfield orbi-premium-starfield--far" />
    <div className="orbi-premium-starfield orbi-premium-starfield--near" />
    <div className="orbi-premium-orbit orbi-premium-orbit--one" />
    <div className="orbi-premium-orbit orbi-premium-orbit--two" />
    <div className="orbi-premium-grid" />
    <div className="orbi-premium-vignette" />
  </div>
);

export default PremiumBackdrop;
