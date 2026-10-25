# UX15-C2B — ASTERIA Premium: four approved panoramas in live World Traversal

**Scope:** premium image/art presentation, not new physics, not enemies, not wave tuning. The approved concept images generated in the ASTERIA design phase are integrated into GitHub `public/assets/worlds/asteria/` as optimized WebP and loaded by the SAME Canvas2D used for actual combat.

| Section | Approved image shown | Binary |
|---|---|---|
| 01 Arrival Gate | Puerta celestial de ASTERIA (portals and waterfalls) | `asteria-arrival.webp` |
| 02 Orbital Rails | Cañón orbital de islas flotantes | `asteria-orbital.webp` |
| 03 Canyon Sky | Cañón orbital, panned differently | `asteria-orbital.webp` |
| 04 Relay Span | Metrópolis orbital sobre cañones celestes | `asteria-relay.webp` |
| 05 Signal Breach | Mundo celeste fracturado por tormentas | `asteria-breach.webp` |
| 06 Transit Vista | Vista de retorno al portal | `asteria-arrival.webp` |

## Asset pipeline

- Four original 2172×724 PNG concept masters were resized to **1440×480 WebP quality 57** in a standalone build step; no third-party copyrighted image is used.
- Files: 148,320 + 105,324 + 154,916 + 135,460 bytes = **544,020 bytes** combined (≈531 KiB). The four original PNGs exceed 12 MB combined. Master PNGs remain available in the authoring conversation / UX15 source artifacts, but are not deployed.
- Browser decodes artwork only for World Traversal or explicit route QA, via `new Image()` with onload/onerror; four-key bounded cache, first/current/next preload, CSS-independent BASE_URL path, no extra WebGL context. Fallback: existing UX15-B geometry until the current scene decodes or if loading fails.
- Segment transitions fade to the next scene from the last 27% of distance, using the existing simulated route clock. No timers or Math.random; scenery pans with route distance, lower strip gains small depth differential. A low-opacity contrast veil protects projectiles/HUD legibility.
- Images preserve X/Y proportions and cover the actual expanded panoramic viewport; no squashing or fixed 800×480 stretch on Android horizontal.
- `data-ux15-art="premium" | "fallback"` is only diagnostic. It never changes physics or player powers.

## User control and gameplay separation

- Launch via **Modos de juego → Travesía de Mundos**. No query needed, legacy Campaign, Score Attack and Infinite remain unchanged. Artwork persists over upgrades, Estado and wave transitions through the run-owned World Route identity introduced in UX15-C2A.
- The route preview (`?ux15-route-qa=1`) now has **Siguiente paisaje** to tour six sections immediately, with genuine WebP diagnostics. This remains a laboratory; the real battle uses the exact same art painter, behind the actual ENERGY GLB, ORBIs, enemies and loot.
- Illustration bridges/cliffs are strictly **non-collidable decorative layers**; existing 1600×960 physical arena constraints remain until UX15-C3 physical traversal and spawn migration.

## Acceptance gates

- Test all four RIFF/WEBP payloads present, valid and combined <600 KB, 6-section map, cache, contrast mask, geometry fallback.
- Real Chromium must **show** `data-ux15-art="premium"` in actual Campaign-based World Traversal on desktop 1440×900 and mobile 844×390; six QA scenes each must decode premium artwork, screenshots from arrival/orbital/relay/breach.
- No game console/page errors, no regression in old desktop/mobile menu paths, upgrade/Estado, CI Node tests/typecheck/build, Android APK, UX07, EVO8 and native UX09 launch.
- Android **physical** visual legibility, battery, heat and memory still pending issue #248. `#742` stays open for world physics and future worlds.

**Not yet delivered:** mechanically constrained path, infinite world-coordinate rebasing, route-specific boss/spawns, multi-layer independent PSD art masks, ambient music per world. These belong to UX15-C3/D/E, not to an art-only PR.
