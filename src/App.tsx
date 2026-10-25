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
// UX15-C3A-2: separate physical-player/camera QA harness. Never mounts the
// production EnergySwarmGame or changes World Traversal's active physics.
const PhysicalRouteQa = lazy(() => import("./components/PhysicalRouteQa"));

export default function App() {
  const isWorldRouteQa = typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("ux15-route-qa") === "1";
  const isPhysicalRouteQa = typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("ux15-physical-qa") === "1";
  if (isPhysicalRouteQa) {
    return <Suspense fallback={<div role="status">ASTERIA · loading physical lab…</div>}>
      <PhysicalRouteQa />
    </Suspense>;
  }
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
