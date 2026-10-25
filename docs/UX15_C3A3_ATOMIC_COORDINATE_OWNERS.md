# UX15-C3A-3 — Traslado atómico de propietarios físicos (QA aislado)

Estado de ingeniería: implementación en rama experimental, bajo #749 / #742. No habilita física real en los cuatro modos de juego.

## Contrato implementado
- `routeCoordinateOwners.ts` recibe el mismo estado `PhysicalRouteFrame` de C3A-1 y traslada un inventario tipado de coordenadas **en una sola transacción** al final del tick, antes de colisiones y dibujo.
- Preflight valida todos los valores y permisos ANTES de escribir; si falta autorización, hay una coordenada no finita, objeto congelado o boss/owner no certificado, falla cerrado sin mutar entidades ni frame.
- Un `WeakMap<object, Set<field>>` impide restar el desplazamiento dos veces si `bossRef` y `enemiesRef` apuntan al mismo objeto, o cuando se comparte una asignación de formación.
- Se mueven ENERGY, cámara, puntero, click-to-move, 30 ORBI (`x/targetX`), enemigos y alias de boss, balas, drops, partículas, textos flotantes, nodos, zonas, objetivo de boss, asignaciones y director de formación pendientes, telegraphs `SIEGE_VOLLEY` y cachés espaciales registradas. Los telegraphs congelados se reemplazan, no se mutan.
- Se conservan `y`, velocidad, cooldown, vidas, invulnerabilidad, score, seed, progreso lógico, IDs y offsets de cámara/shake en espacio pantalla.
- Los sistemas y estados no enumerados NO reciben certificación implícita. Las escenas con otros propietarios activos se bloquean mediante `unregisteredWorldOwners`. No hay merge de esta lógica en `EnergySwarmGame.tsx` hasta C3B.

## QA visual y numérico
- `PhysicalRouteQa` mantiene identidad auténtica de ENERGY, ASTERIA Premium y C3A-2; añade `drawSwarmRoster`, `drawEnemiesList`, `drawProjectilesList`, `drawResources` reales, usando **los tipos de entidades de gameplay** (30 ORBI, enemigos, balas y drops).
- Es un **encuentro controlado sin daño/combate, spawns, puntos o recompensas**. Las entidades ancladas al mundo no se desplazan con un falso parallax: se conserva X mundo mientras avanza ENERGY; solo un rebase las traslada junto con la cámara.
- QA calcula nuevas posiciones de 30 ORBI a partir de sus offsets de formación. Al alcanzar el umbral, clona el snapshot QA y efectúa una única transacción de rebase: preserva además la pureza observable de cada estado anterior.
- Telemetría `data-orbi-local-x`, `data-enemy-local-x`, `data-shot-local-x`, `data-resource-local-x`, `data-origin-offset-x`. Chromium comprueba el avance físico y las igualdades `actor.localX + originOffsetX` para enemigos, proyectiles y recursos tras rebase.
- Tests prueban alias, telegraph congelado, director pendiente, 30 ORBI en seis formaciones, invariancia de proyección/collision, fallo sin escrituras parciales, pausa y más de 20 rebases. Chromium prueba escritorio y móvil horizontal con entrada táctil nativa.

## Exclusiones explícitas
- Ninguna modificación a `EnergySwarmGame.tsx`, aparición/culling, HUD, Dash, Overdrive, Convergencia, evoluciones ni jefe activo. El motor de combate de cuatro modos sigue **ARENA_LEGACY**.
- Durante esta fase NO se ejecuta una partida real con combate en marco físico; el adaptador queda preparado y probado en un QA controlado. C3B debe integrar `SpawnRouteAdapter`, culling dinámico, bounds Dash, bosses, caches/hazards adicionales y radar, con gates de escenarios no soportados.
- Android APK de CI no sustituye pruebas de hardware Android #248.

## Verificaciones para fusionar
`npm run test:repo`, `npm run test:gameplay`, `npm run test:platform`, `npm run typecheck`, `npm run build`, Chromium real UX01 + C3A-2/C3A-3 y APK debug Android. Solo squash tras verde.
