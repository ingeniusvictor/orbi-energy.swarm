# ORBI ENERGY SWARM — UX15-C3A
## Plan oficial de implementación: Base física de Travesía de Mundos
**Versión:** 1.0 · 25 de octubre de 2026  
**Estado:** plan de ingeniería aprobado como siguiente etapa; **NO implica física implementada**.  
**Baseline auditada:** `main` @ `a917e176c47a8a1b202781bd2c6c11681b26339c` (UX15-C2B, PR #748).  
**Padre:** [UX15 #742](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/742); documentos [master](UX15_WORLD_ROUTE_MASTER.md), [Mundo ASTERIA](UX15_WORLD01_ASTERIA_ORBITAL.md), [arte premium](UX15_C2B_ASTERIA_PREMIUM_ART.md).

## 1. Decisión ejecutiva

La **TRAVESÍA DE MUNDOS** ya es el cuarto modo visible, con ilustraciones ASTERIA premium, persistencia tras evoluciones, seis segmentos decorativos y combate de Campaña reutilizado. Sin embargo, actualmente el paisaje se desplaza **sobre una arena física de 1600×960**. UX15-C3A debe establecer una arquitectura **física horizontal de coordenadas locales + cámara acoplada al viaje + origen flotante** que posteriormente admita un mundo longitudinal sin límites artificiales.

**No es un rail shooter:** ENERGY mantiene controles X/Y libres, joystick, mouse, Dash (E), Overdrive, Convergencia (Q), formaciones y hasta 30 ORBI, sin caminar sobre plataformas ni colisionar con la decoración del cañón. El avance de ruta debe ser automático durante la simulación activa, pero la maniobra manual conserva significado físico y el jugador puede adelantarse, retroceder y esquivar dentro de una ventana amplia y segura.

**Principio de aislamiento:** el sistema físico nuevo es exclusivo de `WORLD_ROUTE` y su validación DEV/QA; Campaña tradicional, Score Attack, modos de QA de jefes y demás superficies mantienen **ARENA_LEGACY**. No reemplazar directamente `WORLD_WIDTH` o `WORLD_HEIGHT` de `constants.ts` con números enormes.

## 2. Alcance y declaración honesta

**UX15-C3A SÍ entregará, por incrementos auditables:**
- Contrato tipado de marco espacial de ruta, métricas del mundo y transformaciones físicas puras: avance, cámara, origen flotante y conversiones de input.
- Prototipo real del **ENERGY físico viajando** con cámara horizontal (sin simular el avance moviendo solo el fondo), protegido por feature flag independiente de la selección `WORLD_ROUTE`.
- Algoritmo de rebasing atómico y un inventario exacto de propietarios de coordenadas; tests de invariancia de distancias, impactos, colisiones, recursos, puntería y continuidades entre segmentos.
- Rutas de degradación y rollback; evidencia real Chromium en escritorio y móvil con telemetría del propio gameplay y comparación legacy.

**UX15-C3A NO significa aún “modo infinito certificado”:**
- No habilita libremente el nuevo espacio para todos los enemigos/jefes hasta migrar spawns, culling, formaciones y áreas de daño; estos cambios, de alto riesgo, tendrán gates propios en **UX15-C3B / UX15-D**.
- No entrega nuevos bosses, biomas, poderes, recompensas ni rutas con colisión sólida.
- No convierte las imágenes panorámicas en mallas físicas 3D: las cuatro panorámicas ASTERIA siguen siendo escenarios visuales Canvas2D.
- No cierra #742 ni QA física Android #248.

**Regla para la comunicación:** si el test solo demuestra cámara en movimiento o un marcador, llamarlo **prototipo físico limitado**, nunca “infinito verdadero”. Solo anunciar travesía física completa cuando player, ORBI, enemigos, proyectiles, drops, camera, miniboss y boss se mantengan consistentes tras varios rebases y spawns/culling adaptados.

## 3. Auditoría source-grounded (main actual)

| Punto de integración | Implementación actual comprobada | Consecuencia y trabajo |
| --- | --- | --- |
| `src/game/constants.ts` | `WORLD_WIDTH=1600`, `WORLD_HEIGHT=960`, `WORLD_BOUNDS` (8...1592) | Los límites deben ser **por modo**; no eliminar clamps legacy globalmente. |
| `EnergySwarmGame.tsx` (refs ~497–549) | `asteriaLiveCursorRef` guarda progreso de paisaje, `worldRouteRunActiveRef` conserva cuarto modo, `playerPosRef`/pointer/ORBI/enemies/projectiles/resources/particles son propietarios de posición | Crear autoridad única de frame de coordenadas del modo, no una segunda posición incompatible con el render. |
| `EnergySwarmGame.tsx` (~5154–5258) | cámara, deadzone/lookahead/zoom y clamps a `WORLD_WIDTH/HEIGHT`; panorámica varía viewport real | Crear proyección exclusiva para ruta, anchor lateral ≈40% orientativo, X sin límites legacy, Y segura; no distorsionar por DPR. |
| `EnergySwarmGame.tsx` (~5324–5379) | Dash recibe bounds fijos 1600×960; movimiento normal se recorta también | Dash y clamp horizontal deben migrar juntos, manteniendo bordes verticales y velocidades existentes. |
| `EnergySwarmGame.tsx` (~3242–3288) | enemigos nacen alrededor de cámara y se limitan a 1600×960; se usa spawnSafetyRadius | `SpawnRouteAdapter` debe separar “posición válida frente a cámara” de “arena física legacy”. No desplegar C3A general antes de migrarlo. |
| `liveEnemyFormationDirector.ts` | planes de formación guardan `anchorX/anchorY`, y sus proyecciones reciben `worldWidth/worldHeight` | Los anchors guardados deben cambiar de origen; no bastará trasladar `enemy.x`. |
| `EnergySwarmGame.tsx` (~6156–6219) | enemigos/proyectiles se eliminan si salen de límites 1600×960 | Migrar culling a ventana dinámica ±margen alrededor de cámara/leader. No perder tiros/hits arbitrariamente por rebase. |
| `EnergySwarmGame.tsx` (~6231–6295) | recursos atraídos hacia ENERGY, Infinite drift usa `WORLD_BOUNDS` | Rebase conjunto antes de física de magnetismo; preservar distancias y colecciones durante avance. |
| `EnergySwarmGame.tsx` (~3803–3839) | intro/fases del boss fijan `boss.x = WORLD_WIDTH/2` y animan cámara; hay nodos, gravedad, objetivos | **No** habilitar nuevos rebases durante jefe legacy sin migrar todas sus posiciones/telegraphs. C3A QA debe excluir/frenar autoritativamente esos casos. |
| `EnergySwarmGame.tsx` (~7580–7689) | radar FULL usa escala 1600×960; MINI es radial | Definir radar de ruta independiente en coordenadas relativas. Nunca mostrar “mapa completo 1600×960” como infinito. |
| `EnergySwarmGame.tsx` (~8382–8453) | pointer/drag convierte clic de pantalla a mundo usando cámara | Trasladar targets persistidos en rebase; conservar reversibilidad de screen↔world al girar móvil. |
| `worldRouteCore.ts` / `worldRouteClock.ts` | cursor seed/ordinal/offset, ventana contigua ≤4, `projectRouteDistance` únicamente visual; reloj con gates de pausa y max-step 50ms | Reutilizar cursor y gates. **No usar `projectRouteDistance` directamente como X físico** ni como RNG de enemigos. |
| `worldRouteCamera.ts` | proyección de laboratorio QA independiente | Usar como referencia visual, no sustituir el control/dinámica del motor con el marcador QA. |
| `asteriaPremiumRenderer.ts` | cuatro WebP Canvas2D, mapeo 6 tramos, fundido, fallback geométrico | Conservar la dirección artística y alinear desplazamiento con el **marco de ruta** sin que las imágenes participen en colisiones. |
| `src/game/EnergySwarmCanvas.tsx` | dibuja recursos/enemigos/proyectiles y ORBI bajo la transformación `ctx.scale/translate` del motor | Mantener un solo sistema coordenado físico común para draw, IA y colisión. |

**Riesgos identificados que deben revisarse a fondo en PR de implementación:** nodos del jefe, telegraphs y pozos gravitatorios; hazards de sector; `bossAttackTargetPosRef`; `clickToMoveTargetRef` y `pointerRef`; `swarm.targetX/targetY`; partículas/textos flotantes; assignments en curso del director de formaciones; índices espaciales/cache de colisión; efectos Infinite y eventos ambientales; mini-bosses y saltos/cambios de sector. No extrapolar que todos están migrados por trasladar cinco arrays.

## 4. Espacios de coordenadas — contrato canónico

Tres espacios diferentes, con conversiones explícitas y pruebas:

1. **Ruta absoluta lógica (`RouteCursor`)**: `seed + segmentOrdinal + offset`, representando progreso de viaje. No guardamos millones de coordenadas X globales para todos los actores; el cursor puede continuar en segmento 100 000+.
2. **Física local (`routeLocalX, localY`)**: ENERGY, enemigos, ORBI, disparos, recursos, objetivos, cámara y colisiones residen en un origen flotante acotado. Todas las posiciones de un mismo frame deben utilizar **el mismo epoch/origen**.
3. **Viewport (`screenX/Y`)**: función `(actor.localX - camera.localX)*zoom`, semejante para Y. CSS, DPR y panorámica únicamente cambian visibilidad, no tamaño distinto en X/Y.

Propuesta de API pura para implementación:
```ts
interface PhysicalRouteFrame {
  enabled: boolean;            // route physics opt-in, separate from mode choice
  cursor: RouteCursor;          // seed / ordinal / offset
  originEpoch: number;          // incrementa solo en rebase confirmado
  originOffsetX: number;        // desplazamiento acumulado, solo para observación
  localTravelAnchorX: number;   // dentro de ventana numérica segura
  routeCameraX: number;         // desplazamiento de cámara en espacio local
  visualProgressMs: number;     // reloj simulado congelable
}
```

**Fórmula de invariancia de rebase** para cada punto de mundo, su target y cámara:

`xLocalNuevo = xLocalViejo - Δ`; `cameraLocalNuevo = cameraLocalVieja - Δ`; `originOffsetNuevo = originOffsetViejo + Δ`.

De esto se deriva: `(xLocalNuevo - cameraLocalNuevo) = (xLocalViejo - cameraLocalVieja)` y distancias relativas actor–actor **idénticas** antes/después de rebase. No trasladar `vx/vy`, direcciones normalizadas, `lookAhead` relativo, tiempos/cooldowns, o coordenadas **screen-space**; sí traducir todo target/punto anclado en **world-space**.

**Distancia de viaje ≠ desplazamiento manual:** el cursor de ruta no reemplaza `ENERGY.x`. Con avance simulado, la cámara y el jugador se desplazan físicamente en el frame global coherentemente; el input manual añade delta relativo, conservando sensación de movimiento X/Y. La navegación no debe producir “movimiento gratis” que regenere dash, recombine upgrades ni cambie combate.

**Precisión:** evitar aumentar indefinidamente `player.x`; efectuar rebase cuando el centro local sale de un rango seguro calibrado (p.ej. umbral **provisional** 512–1024 unidades, sujeto a QA). No rebase dentro de una fase de colisión ni de un callback asíncrono. Si un propietario world-space no puede migrarse con certeza, **fail closed**: no habilitar ruta física en ese escenario, conservar el render de ASTERIA y el combate original.

## 5. Física y cámara horizontal: diseño operativo

- **Viaje:** cada tick válido de simulación usa el `stepRouteClock` existente (actualmente velocidad QA 52 unidades/s) y obtiene avance de cuadro **una sola vez**. No derivar progreso de `Date.now` ni mover fondo/cámara en RAF separado.
- **ENERGY:** autoavance positivo +X a velocidad de travesía y añade input X/Y normal; sin pulsar derecha recorre físicamente el mundo, pero el HUD y colisiones reconocen movimiento. No hay gravedad y no debe pegarse a paredes ni morir por salirse de una pista ilustrada.
- **Cámara:** mirada adelantada hacia +X, siguiendo una ventana jugable elástica; respetar zoom 0.70–1.08 y anchura panorámica calculada en `panoramicCanvasViewport.ts`. La posición final del jugador en pantalla es calibrable (objetivo inicial ≈35–45% del ancho), **no hardcode rígido**.
- **Margen y retroceso:** permitir que ENERGY retroceda respecto al ancla de viaje sin que quede fuera de pantalla; ninguna barrera instantánea sin telegraph. Si el escenario lo supera, desacelerar el autoavance y hacer follow seguro, sin forzar teletransporte.
- **Y:** conservar control completo del plano y alto seguro (margen para 30 ORBI), con cámara Y/restricciones existentes hasta migrar su contrato.
- **Dash:** mantener exactamente duración/cooldown/velocidad/invulnerabilidad actual (ninguna) y sustituir únicamente su **clamp X** en modo ruta. La ruta sigue permitiendo Dash a ambos lados. Convergencia Q y Overdrive no alteran el recorrido salvo gates de pausa definidos.
- **Spawn y drops:** los actores del tramo deben aparecer en **coordenadas físicas locales** y mantener posiciones respecto al viaje. No se avanza de sector por alcanzar un X; eso sigue bajo el WaveDirector.

## 6. Rebasing atómico: inventario inicial obligatorio

**Trasladar una sola vez con la misma Δ** (revisar alias para no duplicar desplazamiento):

- `playerPosRef`, `pointerRef`, `clickToMoveTargetRef` cuando exista.
- `swarmRef[]`: `x`, `targetX`; `y` y `targetY` solo si un día se mueve origen Y.
- `enemiesRef[]`: `x`, incluidas formaciones con `enemyFormation.anchorX`; `bossRef` **suele apuntar al mismo enemigo**, no volver a trasladarlo. También `architectQaBossRef` debe permanecer fuera del modo ruta hasta certificarlo.
- `projectilesRef[]`, `resourcesRef[]`, `particlesRef[]`, `floatingTextsRef[]`.
- `cameraStateRef.cameraX/targetX` y anclas world-space conservadas. `cameraOffsetRef` por shake es screen-space: **no trasladar**.
- `shieldNodesRef[]`, `hazardZonesRef[]`, `bossAttackTargetPosRef`, posiciones de telegraph/storm, pozos gravitatorios y marcadores de eventos **cuando estén activos**. Primera etapa bloquea estas escenas, siguiente las certifica.
- `enemyFormationDirectorRef.pending.common.anchorX` (cuando exista) y toda caché que guarde posiciones; invalidar/reconstruir índices espaciales de colisión tras rebase.

**Orden de operación:** aplicar input/autoavance → decidir rebase en un único punto del tick → transformar referencias de mundo/targets/cámara de forma atómica → invalidar caché espacial → ejecutar colisiones y render coherentes. No insertar traducciones arbitrarias en dibujantes, spawners o React effects.

**Test de identidad:** objetos alias (boss=entrada de enemies, refs de enemigo compartidas) se procesan una sola vez por referencia; daños, salud, IDs, timers, score, loot, seed y RNG deben permanecer intactos. Con particiones o hitboxes que se calculan desde el boss, se recomienda bloquear rebase mientras se ejecuta la transición hasta que el contrato del boss haya sido migrado.

## 7. Archivos y APIs previstas (no cambios todavía)

| Prioridad | Ruta | Acción |
| --- | --- | --- |
| Nuevo | `src/game/physicalRouteSpace.ts` | Estado tipado, rebase, conversiones world/local/screen, matemáticas puras, sin React ni enemigo RNG |
| Nuevo | `src/game/routePhysicalCamera.ts` | Seguimiento horizontal, anchor, límites de maniobra, zoom/panorámica, pruebas pureza |
| Nuevo | `src/game/routeCoordinateOwners.ts` | Inventario/adaptador de coordenadas y guardias sobre alias y targets, con reglas explícitas de traducción |
| Modificar después de tests puros | `src/game/worldRouteCore.ts` | Añadir adaptadores sin modificar seeds, tramos ni `projectRouteDistance` visual |
| Modificar de forma acotada | `src/game/EnergySwarmGame.tsx` | Opt-in físico adicional, nueva cámara en branch route, único punto de avance/rebase y telemetría DEV |
| Revisar y parchear gates | `src/game/propulsionDash.ts` | Preservar cálculos del Dash y canalizar bounds de ruta mediante wrapper en vez de romper `DashBounds` histórico |
| Revisar | `src/game/liveEnemyFormationDirector.ts` | Anclas de grupos migrables, medidas del área dinámica con pruebas |
| Revisar en C3B | `src/game/enemyFormationRoutes.ts` y secciones de spawns/culling `EnergySwarmGame.tsx` | Eliminación correcta fuera de viewport en vez de mundo fijo |
| Revisar y probar | `src/game/EnergySwarmCanvas.tsx` + radar de `EnergySwarmGame.tsx` | Coherencia draw, cámara e indicador de progreso sin falsear mapa infinito |
| Conservar | `src/game/asteriaPremiumRenderer.ts` | 4 WebP ASTERIA y crossfades; adaptar solo si cambian coordenadas del render de fondo |
| Tests nuevos | `tests/gameplay/physical-route-space.test.ts` + `tests/gameplay/route-physical-camera.test.ts` | 1, 10, 1000, 100000 segmentos, rebases, distancias, precisión y pausa |
| QA integrado | `scripts/web-ux01-browser-evidence.mjs` | Enrutamiento C3A por flag, lectura de posición real/cámara/epoch desde juego, desktop/touch y reversión |

**Requisito de mantenimiento:** identificar el archivo exacto de cada posición antes de modificarlo. No usar `as any` para saltarse nuevos contratos ni mutar posiciones en componentes del HUD.

## 8. Secuencia de implementación PR por PR

### C3A-1 — Foundation matemática, sin mutación de gameplay
- `physicalRouteSpace.ts`: tipos, conversión local/world, rebase como función pura de estado probado; `routePhysicalCamera.ts`: proyección y límites sin defaults nuevos de Campaña.
- Tests de propiedades/invariancia de coordenadas y precisión en 100000+ segmentos; pruebas explícitas de zoom/portrait/landscape.
- **Gate:** CI/typecheck verde. No URL de gameplay nuevo. Merge pequeño opcional si el código permanece inerte.

### C3A-2 — Prototipo físico experimental de ENERGY + cámara
- Activación adicional DEV/QA, **por defecto OFF**, incluso cuando se elige Travesía normal; así protegemos ASTERIA premium actual.
- Movimiento longitudinal real de ENERGY y cámara que acompaña, input X/Y conservado, menú/upgrade/pausa congelan delta. Probar Dash dentro del área dinámica **sin** habilitar daños nuevos.
- Primera telemetría: `mode`, `routeOrdinal`, `routeOffset`, `playerLocalX`, `cameraLocalX`, `originEpoch`, `rebaseCount`. Valores observados son de la **física**, no solo del fondo.
- **Gate:** un encuentro acotado de QA, sin boss/índices pendientes, no puede cambiar el modo legacy. Si la cámara se queda al borde físico o movimiento salta, no seguir.

### C3A-3 — Traslado atómico de entidades y cachés con prueba controlada
- Rebase de ENERGY, ORBI, enemigo(s) controlados, bala(s), recursos, formaciones y sus referencias; garantizar igualdad de distancias relativas y misma colisión/loot antes/después.
- 20+ rebases forzados en un solo encuentro de prueba (umbral reducido **solo QA**); distancia lógica de 100000+ segmentos en tests sin actores acumulados en memoria.
- Pruebas de click-to-move, joystick móvil, 30 ORBI en seis formaciones, cooldown Dash/Convergencia/Overdrive.
- **Gate:** no activar para sesiones normales mientras falten migración de spawns/culling, boss o amenazas. Pasar al C3B/D y certificar el sistema completo.

### C3B — Integración de enemigos y mapa libre continuo (siguiente bloque, NO C3A)
- Adaptar spawn seguro a ventana física de ruta, motor de formaciones y límites dinámicos.
- Culling offscreen de enemigos/balas/resources; evitar que drops desaparezcan sin tiempo de recolección.
- Boss/hazard/telegraph en marco local con fase autorizada, asegurar que sector 10 y rematches Infinite conservan reglas.
- Radar de ruta y tests automatizados de colisiones y varios sectores; **solo aquí puede considerarse habilitar la física de Travesía para una partida normal**.

### C3C/D — Worlds + trayectorias/fairness y expansión
- Transiciones, segmentos que afectan encuentros y eventos, futuros worlds; recorridos seeded indefinidos y streaming progresivo.
- QA Android físico con batería, frame times, memoria, pérdida WebGL y FPS bajo cargas de 30 ORBI.

## 9. Pruebas obligatorias y criterios de aceptación cuantificables

**Matemática (unit):**
1. Tras un rebase Δ, distancia `enemy↔player` y `bullet↔enemy` difiere como máximo una tolerancia numérica definida (p.ej. `1e-6` unidades) para valores seguros; health/score/IDs/timers exactos.
2. `screen(actor)` antes/después del rebase idéntico dentro de tolerancia pixel (`<0.5` píxel) sobre todos los zooms 0.70–1.08.
3. `ordinal+offset` monotónico durante viaje automático habilitado; estabilidad en el primer segmento, cambio de segmento, índice 1000 y 100000; sin `NaN/Infinity`.
4. 20 rebases QA sin deriva acumulada mayor a tolerancia medida; no doble desplazamiento de alias boss/enemy.
5. Pérdida y recuperación de foco/upgrade/pause no avanza cursor físico y deja el mismo punto de partida en reanudación.

**Gameplay/regresión:**
6. Spawn 100px fuera de cámara y radio seguro como regla heredada, sin clamp a X=1600 en ruta (C3B), mientras legacy continúa igual.
7. BALAS, drops y formaciones mantienen posiciones correctas; Convergencia Q afecta seis objetivos y boss conserva fases/limitación cuando haya migración de boss.
8. Dash conserva 180ms, cooldown 18s, tamaño/velocidad y ausencia de invulnerabilidad; joystick/teclas/mouse y screens ES/EN funcionales.
9. No se acumulan enemigos/partículas/texturas permanentemente fuera de ventana; límites de población 80/120/30 preservados.

**Browser/Android:**
10. Capturas y pruebas REALES Chromium desktop 1440×900, ultrapanorámico 1920×1080, landscape 844×390 y retrato 390×844, tanto ruta QA como baseline legacy.
11. Evidencia de desplazamiento **físico** a través de `playerLocalX/cameraLocalX/originEpoch` en modo QA, no afirmación basada solo en `ux15RouteDistance` del fondo.
12. `npm run typecheck`, build, tests repo/gameplay, UX07, EVO8, navegador y Android APK todos verdes; batería FPS/performance sin regresión sostenida frente a baseline en **mismo dispositivo**.
13. Android físico #248 **no** se marca aprobado con APK compilada o Chrome emulado.

## 10. Riesgos y estrategias de rollback

| Riesgo | Estrategia obligatoria |
| --- | --- |
| Camera+player desincronizados | conversión/seguimiento puro y QA real; solo un único sistema físico por frame |
| Boss/anclas no trasladadas | bloquear nueva ruta física en boss hasta migración y QA, conservar combate premium visual |
| Spawns/proyectiles desaparecen | C3B adaptador de distancia respecto al viewport con fairness; nunca quitar clamp global a todos |
| Precisión en trayectos largos | segmentOrdinal + offset, rebasing atómico, no actor con X absoluta creciente |
| Movimiento reducido / pausa | progreso basado únicamente en delta simulado existente |
| Renders disparan costos móviles | Canvas2D premium+cache existente, no contextos WebGL adicionales |
| Regresión score/campaña | guardia explícita `WORLD_ROUTE` + feature flag QA, tests históricos congelados |
| Rollback | deshabilitar flag físico → se usa **ASTERIA premium visual** con física legacy; no perder cuenta/registro ni copiar entidades entre modos |

**Gates de habilitación pública:** UX15-C3A por sí sola no cambia el default de Travesía; la física real solo se habilitará tras C3B y pruebas de jefes/oleadas/recursos/Android. Guardar este documento en `main` es autorización para iniciar ingeniería, no para liberar una versión no certificada.

## 11. Definición precisa de “hecho”

- **C3A DONE:** contrato físico consistente, cámara en QA, primer movimiento real de ENERGY, rebasing probado sobre entidades representativas, escenas premium/legacy protegidas, PR con CI verde, telemetría que distingue mundo físico de fondo visual.
- **C3A NO DONE:** solo scroll del fondo, cámara animada sin mover entidades, rebase de protagonista sin enemigos/balas/resources/targets, spawns en paredes fijas, desaparición de loot o cambio de fondo tras elegir evolución.
- **Mundo físicamente infinito DONE (objetivo C3B/D):** progreso longitudinal sin borde 1600, ventana de juego real, spawns/despawn correctos, colisiones estables, boss/hazards migrados, streaming de segmentos, 30 ORBI y hardware Android verificados.

## 12. Orden de acción inmediato

1. Abrir sub-issue de implementación asociado a #742 y nuevo PR **C3A-1 (solo matemática + tests)** basado en el `main` auditado.
2. Implementar el módulo puro `physicalRouteSpace.ts` y `routePhysicalCamera.ts`, sin cambiar gameplay.
3. Incorporar C3A-2 detrás de un flag **QA** y comprobar cámara/ENERGY reales.
4. C3A-3: trasladar targets/entidades/caches de modo completo, con test de colisión y frame de cámara.
5. Autorizar C3B solo cuando C3A no introduzca regresiones ni contradiga una regla de boss.
6. Mantener edición de arte premium ASTERIA independiente de la ingeniería espacial.

**Continuidad:** Issue maestro #742; Android real #248; pruebas de combate/ORBI y canalizaciones UX14 quedan congeladas. Responsable creativo: ORBI Ecosystem; implementación verificable por PR y pruebas.
