# UX15-C3B-1 — Ventana física de encuentros ASTERIA (QA aislado)

**Issue padre:** #749, #742. **Baseline:** UX15-C3A-3 (#753). **Estado:** incremento experimental; no certifica batalla física general.

## Acceso y aislamiento
- Ruta nueva: `/?ux15-physical-qa=1&ux15-c3b=1`. Deben estar presentes ambos parámetros; nunca se activa desde el menú de modos.
- Ruta antigua `/?ux15-physical-qa=1` mantiene los actores estáticos y telemetría C3A-3, sin regresión.
- El motor `EnergySwarmGame.tsx` sigue sin modificar. Los cuatro modos (Campaña, Score Attack, Travesía de Mundos, Infinite), Dash, Overdrive, Convergencia, evoluciones y bosses siguen usando arena legacy.

## Implementación
- `routeDynamicEncounter.ts`: ventana física derivada únicamente de cámara local + viewport + zoom; borde de spawn a 100 unidades fuera de campo para los cuatro lados. Sin clamp X=0..1600. Rechazo de spawn si vulnera radio mínimo de seguridad (175 unidades).
- Adopción exclusivamente QA de aparición determinista cada 700ms simulados, hasta 12 enemigos (bajo límite global 80). Los enemigos se dirigen a la posición física de ENERGY; ningún teletransporte, RNG no certificado ni dependencia del reloj real.
- Proyectil QA generado cada 400ms hacia enemigo cercano, hasta 24 unidades (bajo límite global 120). Colisiones de segmento barrido contra radio del enemigo para evitar atravesar blancos en ticks largos. Se contabilizan impactos, derrotas simuladas y drops de prueba sin recompensar jugador ni modificar su puntuación, vida o progreso.
- Eliminación por límites dinámicos relativos a cámara, con márgenes independientes: enemigos 360, proyectiles 160 y recursos 500 unidades. Drops recién aparecidos retienen tiempo de gracia simulado de 9 segundos; colección cercana es solo observación.
- Actores y sus proyectiles son físicos en el mismo frame local y entran en la transacción de rebasing de C3A-3; se conservan las velocidades y condiciones de pausa/reinicio.
- `PhysicalRouteQa` publica contadores de apariciones, eliminaciones por distancia, enemigos activos, disparos activos, impactos, derrotas QA y pickups. El compositor auténtico de ENERGY, 30 ORBI y ASTERIA Premium no se reemplaza.

## Certificación
- Tests unitarios para spawn fuera de cámara incluso en X=100.000, distancia segura, culling de los cuatro lados y grace de drops; estabilidad y reproducción determinista, colisiones, límites de población, rebases, pausas y reset.
- Chromium 13 vistas: 11 anteriores + C3B-1 escritorio 1440x900 y táctil horizontal 844x390. Criterios: spawn físico, al menos un impacto, movimiento arriba con teclado/táctil, congelación de contadores durante pausa y reinicio.
- Gates: test:repo, test:gameplay, test:platform, typecheck, build y Android APK. Dispositivo Android físico #248 sigue pendiente.

## Excluido y próxima fase
Este incremento no migra todavía el motor de oleadas, IA completa de combate, colisiones de jugador/enemigo, drops reales, índice espacial real, telegraphs de boss, límites Dash/radar y adaptación de UX14. No declarar mundo infinito completamente jugable. Próximo C3B-2: puente seguro de spawns y culling a motor de gameplay detrás de QA, con bounds Dash, índices, boss gates y regresiones, antes de cualquier activación del cuarto modo normal.
