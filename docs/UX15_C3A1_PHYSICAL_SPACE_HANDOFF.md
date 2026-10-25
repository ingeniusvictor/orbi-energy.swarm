# UX15-C3A-1 — Núcleo físico matemático (no conectado a gameplay)

**Estado:** implementación pura e inerte asociada a #749 y plan oficial `UX15_C3A_PHYSICAL_ROUTE_IMPLEMENTATION_PLAN.md`.

## Entregados

1. `src/game/physicalRouteSpace.ts`: frame local tipado, cursor fuente por segmento/offset, velocidad física por delta simulado, referencia de origen con epoch, plan de floating-origin shift en cuantización 512u, transformaciones PURAS de puntos y funciones de invariancia de colisión.
2. `src/game/routePhysicalCamera.ts`: seguimiento horizontal sin clamp `WORLD_WIDTH`, anchor X 42%, desplazamiento suavizado por reloj simulado, Y segura con 960u, transformaciones bidireccionales screen↔local, zoom 0.70–1.08 y desplazamiento de cámara durante rebase.
3. `tests/gameplay/physical-route-space.test.ts`: segmento inicial, cruce, 100000+ ordinals, 1000000000+, gates pausa/modales/hidden/upgrade/hitstop, invariancia puntos/cámara/colisión/recursos, 30 ORBI, 20 rebases y validación fail-closed.
4. `tests/gameplay/route-physical-camera.test.ts`: coordenadas X grandes/negativas, pantallas panorámicas/retrato, igualdad de escala X/Y, cámara quieta con Δt=0, Y recortada, targeting de puntero consistente tras rebasing.
5. `tests/ux15-c3a1-physical-foundation-adoption.test.mjs`: verifica que `EnergySwarmGame` sigue sin importar módulo físico nuevo y conserva `WORLD_WIDTH=1600`, `WORLD_HEIGHT=960`, ASTERIA Premium y los modos anteriores.

## Restricciones de diseño

- El identificador de progreso global no se convierte en `actor.x`. `RouteCursor` mantiene segmento/offset/seed; avance físico computa **diferencial de un único tick** sin restar distancias astronómicas acumuladas.
- Los datos `originOffsetX` son *telemetría*, nunca autoridad para colisiones. Cada actor/cámara debe existir en un mismo epoch local. La transacción multientidad es C3A-3; estos helpers **no** mutan arrays de juego.
- La cámara matemática mantiene la proporción de píxeles físicos y tiene comportamiento determinista para pausa; el motor no llama aún estas funciones.
- **Sin nuevos flags/controles/GLB/WebP** en este PR; en la versión normal Travesía de Mundos sigue usando el fondo premium animado dentro del mismo campo 1600×960.

## Próximo PR

**C3A-2:** extraer una vista física QA de ENERGY+cámara con flag explícito, sin afectar World Route en producción. Después C3A-3: migrar todos los propietarios de coordenadas y autorizar rebasing atómico bajo tests de colisiones y formaciones. C3B: spawn/culling/jefes/telegraphs/radar antes de habilitar movimiento físico normal. #248 sigue pendiente de QA Android físico.

**Requisitos de merge:** todas las pruebas de repositorio y CI, typecheck/build, Chromium y APK Android sin regresión. Squash únicamente tras checks verdes.
