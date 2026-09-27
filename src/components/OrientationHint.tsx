import React, { useState } from "react";
import { useGameTranslation } from "../i18n";

export const OrientationHint: React.FC = () => {
  const { language } = useGameTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const title = language === "es" ? "Mejor en horizontal" : "Best in landscape";
  const body =
    language === "es"
      ? "Gira tu teléfono para ampliar el campo táctico."
      : "Rotate your phone for a wider tactical field.";
  const dismiss = language === "es" ? "Entendido" : "Got it";

  return (
    <aside className="orbi-orientation-hint" aria-label={title}>
      <div className="orbi-orientation-device" aria-hidden="true">
        <span />
      </div>
      <div className="orbi-orientation-copy">
        <strong>{title}</strong>
        <span>{body}</span>
      </div>
      <button type="button" onClick={() => setDismissed(true)}>
        {dismiss}
      </button>
    </aside>
  );
};

export default OrientationHint;
