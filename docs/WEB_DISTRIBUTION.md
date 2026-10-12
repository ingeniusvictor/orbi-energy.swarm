# ORBI Energy Swarm — Web Distribution

## Canonical web target

GitHub Pages / ORBI Energy Swarm Web Beta is the canonical web distribution target. Pages builds only from a successful `main` CI workflow and checks out the exact canonical revision supplied by that workflow.

The production Pages base path remains `/orbi-energy.swarm/`. Local development continues to use `/` through Vite's existing `ORBI_PUBLIC_BASE` contract.

## Installability decision

ES-12I1 adopts a **PWA-first** distribution strategy. The web build gains a Web App Manifest, install icons and a fail-safe service worker. Native Android packaging is intentionally deferred until the existing real-device thermal, battery, browser-chrome, ergonomics and OEM GPU/driver validation gates are completed.

This decision does not remove Android as a target surface: the PWA remains installable from supported Android browsers while native wrapper/package certification is handled separately.

## Service-worker safety contract

- Registration uses `import.meta.env.BASE_URL`, so `/` development and `/orbi-energy.swarm/` Pages deployments share one implementation.
- The service-worker script URL includes the canonical build SHA as a query parameter.
- Cache namespaces include that build ID, and activation removes older ORBI cache namespaces.
- Navigation remains network-first and falls back only when the network is unavailable.
- Unsupported browsers and registration/precache failures fail open to the normal network runtime.
- Game state, progression, simulation and persistence remain authoritative in the existing runtime; the service worker only assists delivery of static web assets.

## Explicit non-goals for I1

- No changes to Campaign or Infinite gameplay.
- No changes to H4–H12 systems, FOTON GLB or rendering budgets.
- No new native Android wrapper, TWA or Capacitor dependency.
- No RC or stable promotion.
