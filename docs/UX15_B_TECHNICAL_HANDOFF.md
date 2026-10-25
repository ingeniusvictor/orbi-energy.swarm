# UX15-B — Núcleo técnico World Route y laboratorio aislado

## Estado / alcance

**Implementación UX15-B. No es todavía el Mundo 01 jugable.** Ver [UX15 World Route Master](UX15_WORLD_ROUTE_MASTER.md) y [ASTERIA Mundo 01](UX15_WORLD01_ASTERIA_ORBITAL.md).

El juego normal abre **ARENA_LEGACY** sin cambiar el motor, los 1600×960, el compositor, el HUD, enemigos, drops, jefes, formaciones, tres habilidades, camera y sistema de progresión. Un query explícito abre el experimento aislado:

`?ux15-route-qa=1`

- Vercel: `https://orbi-energy-swarm-three.vercel.app/?ux15-route-qa=1`
- Desarrollo local: `http://localhost:3000/?ux15-route-qa=1`
- Para salir: botón **Volver al juego** (usa `import.meta.env.BASE_URL`, compatible con Vite bajo subdirectorio).
- Es un laboratorio **Canvas2D** con paisaje original provisional, no render de enemigos, hitboxes o recompensas. No es un nuevo modo de juego ni se puede progresar aquí.
- El laboratorio tiene avance 2.5D de ASTERIA, seis diseños de segmento canónicos; teclas WASD/flechas o deslizar dedo mueven únicamente un marcador dorado ilustrativo; botón pausa/reanudar, reiniciar, ES/EN y métricas QA.
- **Panorama real en QA:** la altura lógica permanece en 480 y la anchura lógica aumenta según la relación útil de la pantalla; una unidad de mundo tiene idéntico tamaño en X/Y. Se verifica en Chromium móvil (no estirar un canvas 800×480).
- El avance base de **52 unidades/segundo** es un parámetro **provisional exclusivo QA** y no altera temporizadores de waves, velocidad de ENERGY o dificultad.
- Si el sistema prefiere `prefers-reduced-motion`, el avance automático queda detenido para evitar movimiento no deseado.

## Nuevos módulos y responsabilidades

| Archivo | Responsabilidad |
| --- | --- |
| `worldRouteCore.ts` | contratos `RouteCursor/RouteSegmentDescriptor`, 6 familias ASTERIA, seed, hash determinista, zona segura y ventana de segmentos contiguos |
| `worldRouteClock.ts` | paso de tiempo simulado máx. 50 ms, gate para pause/hidden/modal/upgrade/hitstop, 0 referencia a wall clock |
| `worldRouteCamera.ts` | proyección puramente 2D con proporción física invariante en X/Y y movimiento manual acotado del marcador |
| `worldRoutePreviewRenderer.ts` | capas parallax Canvas2D, clipping lógico por viewport, sin contenido WebGL o imágenes externas |
| `WorldRouteQaPreview.tsx` | laboratorio opt-in, input accesible, ciclo de vida/cancelación, mediciones, controles, sin importar `EnergySwarmGame` |
| `App.tsx` | carga dinámica solo si query explícito; en cualquier otra URL muestra el juego original |
| `tests/gameplay/world-route-core.test.ts` | geometría, seams, seed, clock, freeze, largo recorrido, cámara y clamping |
| `tests/ux15b-world-route-adoption.test.mjs` | aislamiento de game root y QA, regresión estructural |
| `scripts/web-ux01-browser-evidence.mjs` | vista real de producción en Chromium desktop + Android landscape emulado, avance, pausa, movimiento y captura |

## Aclaración técnica: infinito

El director usa coordenadas **segmentOrdinal** y **offset local**, sin almacenar posiciones físicas absolutas en X. La ventana retiene como máximo el segmento anterior, el actual y dos siguientes (4), con orden geométrico continuo. Es un fundamento para el origen flotante, **no** la implementación completa de terreno físico infinito.

La función `projectRouteDistance()` sirve solo a parallax/telemetría ilustrativa; nunca se debe alimentar con ella la física real al escalar a millones de segmentos.

**NO está implementado todavía:** mundo físico navegable infinito, origen flotante de entidades reales, coordenadas de enemigos/loot/proyectiles, cámara del combate, spawn en tramos, boss en ruta, arte premium final, streaming de atlas, colisiones de obstáculos, ni integración campaign 1–2. Son objetivos de UX15-C/D/E. No cerrar #742 en UX15-B.

## Gates

Las suites automatizadas deben verificar:
- `npm run test:repo`, `npm run test:gameplay`, `npm run test:platform`;
- `npm run typecheck`, producción `npm run build`, release contract;
- Chromium en gameplay **normal** sigue certificado y el nuevo QA `?ux15-route-qa=1` representa un canvas real sin montaje de motor, con progresión observada y pause/reset;
- Android APK compila; Android físico permanece pendiente en #248;
- fallback: si hay algún problema, abrir URL sin el query para recuperar ARENA_LEGACY, que no se ha modificado.

**Siguiente fase**: UX15-C, primer piloto ASTERIA visible en una partida real, con adaptador de cámara/coords/spawns demostrado y reversible (no convertir el QA marker en falso gameplay).
