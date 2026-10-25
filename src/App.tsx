/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import EnergySwarmGame from "./game/EnergySwarmGame";
import { LanguageProvider } from "./i18n";

// UX15-B: explicit opt-in route laboratory. Separate lazy chunk: the normal
// campaign never mounts, loads or mutates world-route QA state.
const WorldRouteQaPreview = lazy(() => import("./components/WorldRouteQaPreview"));

export default function App() {
  const isWorldRouteQa = typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("ux15-route-qa") === "1";
  if (isWorldRouteQa) {
    return <Suspense fallback={<div role="status">ASTERIA · loading route laboratory…</div>}>
      <WorldRouteQaPreview />
    </Suspense>;
  }
  return (
    <LanguageProvider>
      <EnergySwarmGame />
    </LanguageProvider>
  );
}
