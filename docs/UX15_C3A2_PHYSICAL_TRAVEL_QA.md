# UX15-C3A-2 — ENERGY físico y cámara horizontal en QA aislado

**Alcance realizado:** movimiento físico local auténtico del protagonista **ENERGY**, con seguimiento de cámara y recentrado seguro de ambos propietarios en un laboratorio independiente de la campaña. Fundamentos basados en C3A-1 (#751). Pertenece a #749 / #742. **No es una partida ni el mundo infinito jugable.**

## Cómo probarlo

- Laboratorio: `https://orbi-energy-swarm-three.vercel.app/?ux15-physical-qa=1` (solo tras merge y Vercel READY).
- Campaña/Travesía jugable: `https://orbi-energy-swarm-three.vercel.app/` (NO utiliza nueva física).
- No mezclar el laboratorio antiguo `?ux15-route-qa=1` (marcador simulado) ni entrada QA histórica `?ux15-world=asteria`.

La nueva escena utiliza el **mismo `drawFoton` de `EnergySwarmCanvas.tsx`** que utiliza el motor auténtico, incluido el pipeline 3D de FOTON/ENERGY por GLB y su fallback certificado si WebGL no está disponible. Fondo ASTERIA Premium 4 WebP, sin enemigos ni puntuación. No hay dos protagonistas superpuestos.

## Contrato físico C3A-2

- `physicalRouteQaSimulation.ts` es puro; define un propietario de posición `player`, un propietario `camera` y el `PhysicalRouteFrame` con cursor y epoch.
- El mismo `stepRouteClock` que controla avance de ASTERIA mueve REALMENTE player.x. El input manual X/Y añade desplazamiento físico real con diagonal normalizada; cámara `stepRoutePhysicalCamera` sigue al protagonista con ancla 42% de viewport.
- Cámara X **sin clamp 1600**, Y con límites 960, zoom=1 en este laboratorio para identidad métrica y rendimiento. Escenario premium usa mapeo/fundido de tramos existente; balizas QA en coordenadas físicas desplazándose con la cámara, no solamente con parallax.
- El rebase se efectúa ATÓMICAMENTE en el único conjunto de propietarios QA (player/camera + frame). La transformación de otros actores está **explícitamente fuera de C3A-2**; ningún enemigo/ORBI/proyectil/drop entra a esta simulación.
- Pausa, `visibilitychange`, pérdida de foco, pestaña oculta, reduced-motion y reset detienen/restablecen físicamente las coordenadas y cursor. Reduced-motion no inicia autoavance.
- WASD/flechas en desktop; arrastrar/direccionar sobre canvas en touch (nativo Chromium `Input.dispatchTouchEvent`). No hay Dash/recompensas/bosses físicos en esta etapa.

## Aislamiento y seguridad

- `App.tsx` usa lazy import SOLO con query explícito `ux15-physical-qa=1`.
- `EnergySwarmGame.tsx`, spawns, bounds, jefes, modos Campaña/Score Attack/Infinite/Travesía y HUD **no se modificaron**.
- `prewarmFotonGameplay3D` y `disposeFotonGameplay3D` pertenecen al lifecycle único de QA; no hay dos contextos de protagonista en pantalla de la misma SPA.
- Telemetría DOM QA read-only: `data-player-local-x/y`, `data-camera-local-x`, `data-physics-ticks`, `data-route-distance`, `data-origin-epoch`, `data-rebase-count`. **La distancia visual no sustituye la comprobación de player/camera físicos**.

## Pruebas y criterios

- Test puro: autoavance mueve simultáneamente player y cámara; steering izquierda/derecha/arriba/abajo; normalización diagonal, límites Y; pausa/upgrade/modal/hidden/hitstop detienen TODO; 20+ rebases reales QA conservan monotonicidad lógica y viewport.
- Chromium REAL: 1440×900 escritorio y 844×390 móvil horizontal con touch CDP nativo; progresión de player+camera >0, pausa sin cambio de posiciones/ticks, reset vuelve al comienzo, desktop fuerza y confirma 1+ rebases, screenshot durante simulación.
- CI repo/gameplay/typecheck/build; Chromium legacy 9 vistas + 2 QA; Android APK. No certificar Android físico desde emulador (#248).
- Rollback: quitar query URL, volver a modos normales sin afectarlos.

## Próximo C3A-3 y C3B

C3A-3 adaptará TODAS las coordenadas world-space de gameplay (ENERGY, 30 ORBI, enemigos, proyectiles, recursos, nodos y targets), auditará alias/caches y conservará colisiones. C3B migrará spawn/culling/boss/radar antes de activar ruta física en **Travesía de Mundos pública**. No declarar “mundo infinito” a partir de C3A-2. El issue #749 sigue abierto.
