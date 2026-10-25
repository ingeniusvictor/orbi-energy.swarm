# ORBI ENERGY SWARM — UX15: WORLD ROUTE SYSTEM
## Biblia de diseño y arquitectura v1.0 — 25 octubre 2026

**Estado:** especificación formal / diseño únicamente. La dirección horizontal 2.5D procede de la visión del creador; los parámetros numéricos y la dirección artística fina siguen siendo hipótesis de ajuste para la primera prueba jugable. **Esta fase NO implementa motor ni activa mapas en producción.**

**Referencia visual:** imagen horizontal 2.5D aportada por el creador, inspirada en la sensación de viaje de Star Fox 64. Tomar el lenguaje de travesía, profundidad y cambio de mundos; prohibido reproducir imágenes, personajes, nombres, música, HUD o recursos protegidos de esa franquicia.

**Repositorio:** ingeniusvictor/orbi-energy.swarm. **Baseline inspeccionada:** main 32b4fecece46b513b8815f49f5c5cfab7ea7fdd3, después de UX14-C.

## 1. Visión y propuesta de valor

ORBI ENERGY SWARM pasa de una arena espacial visualmente genérica a una **aventura de supervivencia y combate con ruta horizontal 2.5D**, mundos temáticos, transiciones y extensión potencialmente infinita. ENERGY flota y viaja de izquierda a derecha con su enjambre; el universo espacial es el marco narrativo, no el único fondo.

**Definición de género:** Horizontal Route Swarm Survivor (travesía lateral guiada + arena de combate abierta). NO rail shooter puro, plataformas, juego de carriles rígidos ni cambio a cámara tridimensional libre.

**Experiencia que debe notar el jugador:** progreso espacial visible, paisaje que se descubre, sectores identificables, enemigos entrando de manera creíble en la ruta, pequeñas pausas escénicas, encuentros más intensos y salida al siguiente lugar. Jugabilidad intacta de ENERGY + 30 ORBI.

## 2. Invariantes no negociables

1. **ENERGY** es protagonista neutral/dorado permanente. **FOTON** es ORBI acompañante fotovoltaico verde distinto; no sustituir ni fusionar identidades. El GLB de gameplay del protagonista conserva por compatibilidad el nombre histórico orbi-foton.glb.
2. Mantener movimiento libre bidireccional por teclado, ratón y joystick, Dash (E), Overdrive, Convergencia (Q), escudo, puntuación, drops, afinidades, mejoras, seis formaciones, telegraphs y física/cooldowns ya aprobados. No forzar avance constante del cuerpo de ENERGY ni castigar al jugador por no pulsar derecha.
3. Conservar el modo **ARENA_LEGACY** actual como respaldo y referencia A/B. La nueva presentación **ROUTE_TRAVERSAL** solo será activada mediante señal explícita, después de una vertical slice validada. No reemplazar la campaña en main por el nuevo escenario desde la fase técnica inicial.
4. Respetar límites actuales MAX_SWARM_MEMBERS=30, MAX_ENEMIES=80, MAX_PROJECTILES=120 y reglas de recursos, espacialización y render condicionado por preset. No hacer un WebGL por enemigo ni una escena WebGL distinta por segmento.
5. Preservar contratos de campaña (10 sectores, jefe Blackout Devourer en sector 10) e Infinite (sectores 11+, recetas/seed/fairness). Mundo, tramo de ruta, sector, oleada y bioma tienen funciones **distintas** y no se deben confundir.
6. El juego sigue siendo 2D físico con **profundidad representada** en capas/parallax 2.5D. Los planos visuales alejados no son colisionables ni objetivos de disparo. Sin reescribir AI o combates para dar la impresión de 3D.
7. Todo texto y rótulo son nativos ES/EN (accesibles), no horneados en las ilustraciones. Conservar accesibilidad de destellos, sacudida, movimiento reducido y lectura del HUD.
8. Los elementos decorativos nunca ocultan por completo ENERGY, enemigos, balas, telegraphs, objetos recolectables ni el estado del jefe. La identidad de las energías se conserva sobre todos los fondos.
9. Pausa, modal Estado/Táctica/Equipo, suspensión de pestaña, hitstop y selección de mejora deben congelar el **reloj simulado de la ruta**; no usar Date.now ni wall-clock para progresión del paisaje.
10. Ningún PASS Android físico se inferirá de CI, Chromium, APK, emuladores o métricas sintéticas: sigue bajo Issue #248.

## 3. Auditoría del sistema existente (hechos, no capacidades futuras)

| Fuente en main | Estado hoy | Implicación UX15 |
| --- | --- | --- |
| src/game/constants.ts | mundo de 1600×960, pantalla lógica base 800×480 | no existe desplazamiento físico longitudinal ilimitado |
| src/game/EnergySwarmGame.tsx | cameraX/Y sigue al líder con deadzone/look-ahead, zoom interpolado y clamp a WORLD_WIDTH/HEIGHT; jugador/Dash/proyectiles también se limitan al mundo | una imagen en movimiento NO desbloquea recorrido infinito; requerirá un adaptador de coordenadas y cámaras |
| src/game/panoramicCanvasViewport.ts | viewport inmersivo extiende ancho visible sin deformar una unidad del mundo | la ruta y sus márgenes deben calcularse en unidades de mundo, no en CSS px |
| src/game/backgroundRenderer.ts | estrellas, planetas, nebulosas y retícula responden a biome/cámara | punto de extensión para nueva escena, pero no sobreescribir legacy |
| src/game/biomes.ts y types.ts | 6 BiomeType con modificadores reales de gameplay | WorldTheme debe mapearse sin romper los modificadores ni cambiar el enum por decoración |
| src/game/runtimeWaveDescriptor.ts | campaña + Infinite tienen descriptors, presupuestos y políticas de fin | sincronizar ritmo de viaje sin cambiar cuándo una oleada se completa |
| src/game/infiniteSectorDirector.ts | recetas reproducibles por seed, sector, amenaza y fairness | generar segmentos visuales de forma reproducible con seed separada |
| src/game/formations.ts | figuras en X/Y con alcance de seguidores de hasta ~155 unidades en Delta Concéntrica | el primer corredor NO puede ser una garganta sólida estrecha |
| src/game/EnergySwarmGame.tsx spawnEnemy | spawn en cuatro bordes de cámara, distancia segura y clamp al 1600×960 | futura ruta necesita SpawnRouteAdapter, no desplazar spawns arbitrariamente |
| src/game/EnergySwarmCanvas.tsx | draw del protagonista GLB con fallback 2D; ORBI y enemigos sobre Canvas2D | conservar orden y escala de sprites/GLB y evitar ocultación |

**Oportunidad:** hay biomas y un director infinito, pero todavía NO existe un mapa horizontal físico infinito, segmentos geográficos persistentes, encuentros espaciales asociados a segmentos ni un mecanismo de recenter/rebase de coordenadas.

## 4. Ontología canónica (cinco conceptos diferentes)

- **Universe:** conjunto de mundos y rutas ORBI; espacio como conexión narrativa.
- **WorldTheme:** identidad estética/narrativa, paleta, skybox 2D, capas y materiales (p.ej. ASTERIA_ORBITAL).
- **BiomeType:** modificador existente de gameplay; no equivale a un mundo. Varios WorldTheme pueden compartir biome y viceversa, conforme una tabla de mapeo explícita.
- **RouteSegment:** tramo modular de trayecto (geometría visible, ancho seguro, marcas de evento, spawns permitidos, transiciones) con ID y coordenadas de ruta.
- **RuntimeSector/Wave:** contrato existente para enemigos, temporizadores, recompensas, jefes y dificultad. Un mundo puede abarcar varias oleadas/sectores; un tramo no dispara victorias automáticamente.

## 5. La cámara y la travesía horizontal

La perspectiva principal seguirá siendo **2D jugable vista lateral/oblicua con profundidad 2.5D**. ENERGY viaja nominalmente hacia +X; el jugador conserva desplazamiento manual X/Y dentro de una región confortable. Es posible quedarse atrás/adelantar dentro del rango de cámara, esquivar o reposicionarse; el entorno ofrece flujo permanente sin obligar a sostener derecha.

**Tres coordenadas conceptuales:**

- **routeDistance:** distancia absoluta no negativa recorrida por el mundo, calculada por tiempo simulado durante TRAVERSAL.
- **localPlayPosition:** posición X/Y relativa de entidades respecto a un origen local acotado para la física.
- **screenPosition:** proyección con cámara, zoom, panorámica y DPR ya existentes.

**Prohibición técnica:** no incrementar routeDistance y limitar la cámara al mundo fijo 1600×960 pretendiendo que eso sea progreso físico infinito. En UX15-A/UX15-B deberán definirse y probarse el adaptador cámara/posición, las apariciones fuera de pantalla y una estrategia de **origen flotante** / coordenadas locales para sectores 11+. Un fondo desplazado solo es un experimento visual, nunca una implementación completa del World Route System.

**Auto-scroll seguro:** la distancia avanza en el reloj simulado de ruta bajo gameplay activo. La cámara conserva espacio para maniobra y prioriza el área frontal; anchura física de juego determinada por viewport real; se debe evitar que ENERGY salga de escena por un cambio de orientación/zoom. Al entrar en arena de jefe, transiciones o menús, el avance puede ralentizarse o bloquearse por un evento autorizado; no usar este bloqueo para alterar el temporizador de combate o activar premios.

**Parallax 2.5D sugerido (no contrato de física):** cielo remoto lento, montañas/planetas lejanos lento, arquitectura de media distancia intermedia, ruta frontal a velocidad de cámara, primer plano con sobrepaso controlado. Todas las velocidades vienen de routeDistance, no de timers independientes; evitar movimiento vestibular excesivo. Atender orientación e impacto de foreground.

## 6. Sistema de segmentos reutilizables

Familias iniciales: **ARRIVAL**, **OPEN_ROUTE**, **CURVE**, **ARCHITECTURE**, **THREAT_APPROACH**, **COMBAT_CLEARING**, **TRANSITION** y **BOSS_ARENA** (solo si existe evento de jefe real en descriptor). Un segmento contiene conceptualmente:

| Campo | Semántica |
| --- | --- |
| id / version / worldId / seed / segmentOrdinal | identidad reproducible y migrable |
| length, entry/exit, curve/centerline | geometría de avance en coordenadas locales/ruta |
| playableEnvelope | región transitable 2D, distancia de seguridad para enjambre y Dash |
| layerAssets / parallax / palette / LOD | escena dibujada por capas con calidad adaptable |
| allowedSpawnRegions, telegraphGates | entradas verificables y área de peligro visible |
| optionalEncounterMarkers | señales de escena, no órdenes de generar jefe ni recompensas |
| audioCue, narrativeCue, transition | atmósfera sin sobreescribir el estado de misión |
| props / foregroundOcclusionRule | arte y prioridad de lectura |
| biomeCompatibility, fairnessFlags | compatibilidad con modificadores existentes |
| versionedMetadata | depuración, save/load futuro y auditoría |

**Contratos:** no huecos/solapes visuales en conexiones; tangentes coherentes; todos los segmentos permiten trayectoria segura al personaje; no spawns invisibles en suelo decorativo; no props del fondo actuando de muro sin colisión real; ningún segmento introduce un softlock del modo infinito. Los tramos antiguos pueden regenerarse desde su ID/seed, sin mantener todos en memoria.

**Ancho de ruta:** conservar la capacidad de las formaciones de 30 ORBI (perímetros cercanos a 155 unidades del líder, más cuerpo y margen). El corredor visual puede ser estrecho de forma aparente, pero el **espacio transitable efectivo debe ser amplio**; anchuras de prueba alrededor de 390–440 unidades de mundo, según cámara/zoom, sin walls sólidos durante la primera vertical slice. Estos valores son objetivos provisionales a medir, no límites finales del motor. Dash y formaciones amplias deben tener ruta de escape real, jamás depender de atravesar el decorado.

## 7. Director de ruta: determinismo y mundo infinito

Entrada: **mode + sectorDescriptor + biomeIntent + worldThemeId + globalSeed + routeVersion + segmentOrdinal + viewportProfile** (viewport altera calidad/cámara, no la secuencia del mundo).

Salida: **RouteSegmentDescriptor** validado y serializable. El director no toca RNG de enemigos, loot, drops, GAIA ni recompensas. Su RNG deriva de una semilla estable que incluye sector, índice de segmento y versión de ruta. Misma semilla y reglas → misma secuencia; el jugador puede guardar/depurar worldId + routeDistance + ordinal.

**Ventana de streaming:** cargar solo tramo anterior (si es visible), activo y uno/dos siguientes según velocidad/cámara; retirar geometría/texturas sin referencias y sin provocar gaps. Para sectores >1000, usar índices/distan­cias lógicos y desplazamiento de origen local, evitando pérdida de precisión de floating point y arreglos acumulativos infinitos.

**Futuro de mundos infinitos:** después de campaña, el InfiniteDirector conserva el control de presión, bioma, sector y enemigos; RouteDirector transforma recetas certificadas en un viaje visual/espacial compatible. Generar entornos ilimitados por **composición de módulos originales y mutaciones estéticas**, no por multiplicar indiscriminadamente HP de enemigos o reproducir solo el mismo pasillo.

## 8. Integración del combate (separación de responsabilidades)

- **WaveDirector/RuntimeWaveDescriptor**: única autoridad para duración, presupuesto, velocidad de spawns, boss/milestone, sector complete y recompensas.
- **WorldRouteDirector**: único dueño de segmentos, progreso de viaje y señales escénicas; NO crea enemigos ni otorga XP/recompensas.
- **SpawnRouteAdapter**: traduce zonas autorizadas del segmento en puntos válidos fuera de cámara y fuera de radio de seguridad, valida telegraph, reglas de máximo y amenazas. Si falla, usa spawn legacy seguro: nunca spawnear en rostro del jugador o fuera del mundo por un clamp incorrecto.
- **CameraRouteAdapter**: compone progress/cámara/zoom/resolución con el motor; no duplica física ni hitboxes.
- **WorldRouteRenderer**: Canvas2D/atlas por capas con caché/LOD, incluidas sombras y falsa profundidad; no escala/transforma balas de forma diferente al líder.
- **Boss arena**: solo bloquea/desacelera desplazamiento escénico cuando el descriptor autoriza un jefe. Respetar fases de Blackout Devourer, nodos de escudo, inmunidades y topes de Convergencia.

**Fairness:** margen de aparición detrás/arriba/abajo/frente verificable en dimensiones reales de cámara; conservar minimum telegraph y máximo control duro del descriptor. Evitar spawns en foreground opaco o enemigos tapados por colinas. Crystals/drops deben persistir el tiempo suficiente y estar al alcance; no perder recompensas automáticamente porque la pantalla avanzó.

## 9. Mundo vs sector y progresión

**Campaña 1–10:** no redefinir los 10 sectores como 10 mundos automáticos ni inventar nuevos bosses. Los entornos cambian por hitos narrativos/sectores sin alterar wave timers. La primera vertical slice puede vestir el inicio de campaña (sectores 1–2) con el mundo ASTERIA; el resto conserva sus fondos actuales hasta contar con otros mundos validados. Sector 10 conserva al Blackout Devourer.

**Infinite 11+:** cada receta ya especifica biome/seed/mutadores; WorldTheme y segmento derivan de esa receta mediante mapeo versionado. No añadir contenido de poder exclusivo a un mundo visual sin balance y especificación aparte. Un portal/conector espacial puede intercambiar mundos entre sectores sin romper el handoff ni reseteos.

**Modos existentes:** mantener aislamiento explícito de Campaign/Infinite/Score Attack y pruebas de mode gating. No habilitar rutas en Score Attack o rutas DEV de jefe sin contrato y QA específicos.

## 10. Lenguaje visual y UX

- 2.5D ilustrado cinematográfico de alta legibilidad, trazos sci-fi propios, capas con profundidad, niebla atmosférica controlada, sombras ambientales, highlights dorados/cian.
- ENERGY siempre más grande y visible que seguidores; FOTON verde de panel; ataques/estados legibles incluso sobre superficies claras. No crear “plataformas” físicas engañosas si ENERGY flota.
- Barra de viaje discreta: mundo / hito / ruta / % o distancia real. **No sustituye** indicador de oleada/sector, ni anuncia progreso de misión ganado por solo esperar un scroll.
- HUD fuera de ruta cuando sea posible, localización ES/EN; interfaz sin textos impresos en arte.
- Cine: entradas de mundo cortas y saltables, combate limpio, microeventos de panorama sin imponer cámara que bloquee controles.
- Al pausar o activar movimiento reducido, parallax y partículas frenan/se congelan; transiciones sin flashes agresivos.

## 11. Rendimiento y reversibilidad

- Base: **una escena de combate Canvas2D** y la tubería GLB del protagonista existente. Capas precargadas, texturas WebP optimizadas y variantes por preset; sin render WebGL por tramo ni transformaciones CPU costosas repetidas por objeto.
- Conservar límites 80 enemigos, 120 proyectiles, 30 ORBI. Medir frame time p50/p95, uso memoria/texturas, tamaño de arte, scroll stutter, thermal en hardware real y carga de assets desde red lenta.
- Presupuesto numérico final de frame / memoria **se fija tras tomar baseline medido**, no se inventa un valor universal. Criterio de aceptación: route no debe producir regresión sostenida frente a legacy en el mismo dispositivo/escena/quality preset; controlar degradación progresiva por tier.
- Cache/desmontaje obligatorios para segmentos; no mantener todo el infinito en memoria. Fallback compatible con arena clásica, flags reversibles y migración versionada. Sin cambios de save existentes en los primeros tramos.

## 12. Plan faseado (UX15)

| Fase | Entregable | Activación |
| --- | --- | --- |
| **A — Documento maestro (actual)** | canon, auditoría, arquitectura, riesgos, Mundo 1 y aceptación | diseño solamente: **ningún cambio jugable** |
| **B — Núcleo técnico** | contratos puros de route/segment/seed, adaptador de tiempo y coordenadas/cámara, render de capas en sandbox, pruebas de geometría, flag OFF | opt-in DEV/QA; Arena legacy predeterminada |
| **C — Mundo 1 ASTERIA vertical slice** | arte original 2.5D, 4–6 tramos unidos, parallax real, viaje horizontal visible, ambientación y HUD ES/EN, pruebas de combate/drops/Dash/formaciones | piloto, sin activar toda la campaña |
| **D — Encuentros y navegación real** | SpawnRouteAdapter validado, bifurcaciones suaves, vista de radar/mapa, transición de sector, boss arena cuando proceda, QA fairness | habilitación gradual por modo/sector |
| **E — Infinite World Streaming** | catálogo multi-bioma, generación seeded, origen flotante, origin rebasing y caché/culling infinito | Infinite tras certificación |
| **F — Producción / Android** | polish por mundo, audio, accesibilidad, landscape/portrait, calibración 30 ORBI y QA física #248 | rollout opt-in → default cuando aprobado |

Esta nomenclatura reemplaza el UX15 anterior propuesto como paquete de enemigos premium; ese trabajo se posterga sin eliminarse.

## 13. Gates de certificación y pruebas mínimas

1. Diseño (este documento) aprobado; sin suposiciones de que bosque/corredor bloquea físicamente el paso.
2. Tests de segmentación determinista: mismos seeds e IDs mismos tramos; conexiones válidas, no gaps, longitud finita positiva, transiciones/culling/buffer, nunca acceso a texturas descargadas después de dispose.
3. Cinemática cámara: zoom 0.70–1.08, panorama real, pausa/reanudar, cambio orientación, DPR1/DPR2, shake/reduced motion, segundo plano independiente del HUD. Ajustar estos números solo si el juego actual cambia legítimamente.
4. Compatibilidad 30 ORBI E8, seis formaciones y Dash/Convergencia (incluido jefe, 8 ORBI y resonancia); no recortar seguidores ni atravesar paredes nuevas.
5. Fairness por ruta/spawn: sin apariciones sobre ENERGY, sin oclusiones letales, sin amenazas imposibles, telegraph completo, entradas legibles.
6. Regressions Campaign sector 1/2/10, Infinite 11 y >1000, Score Attack sin cambios, recursos/loot, jefes y métricas F3.
7. Evidencias Chromium con gameplay REAL en 740×360, 768×346 DPR2, 844×390, 915×412, 390×844, 1366×768 y 1440×900; no confundir screenshots ilustrativos con pruebas físicas.
8. CI repository tests, typecheck, production build, Android APK, UX07 y Chromium GREEN con PR limpio; revisión visual comparativa A/B del mismo encounter; **merge squash únicamente con gates verdes**.
9. Manual Android físico y sesiones sostenidas documentadas después del merge, sin cerrar #248 automáticamente.

## 14. Decisiones bloqueadas para el primer piloto y preguntas de playtest

**Fijado desde la visión:** lateral horizontal + 2.5D, sensación de avance, libertad 2D del líder, espacio como hub narrativo, muchos mundos a futuro, compatibilidad con combate/enjambre y primer mundo original.

**Sujeto a prueba antes de bloquear en código:** velocidad exacta de scroll, posición horizontal ideal de ENERGY, profundidad del foreground, ruta 390–440 unidades, duración de escenas, ratio entre áreas abiertas y pasillos, modo de detener scroll en encuentros, perfil de audio/OST. No convertir estimaciones en balance definitivo sin gameplay real.

**Diferencia esencial:** una escena bonita moviéndose no es el sistema de rutas. UX15-C no se declara terminado sin una **travesía de verdad**, con segmentos visibles, coordenadas consistentes, apariciones seguras y progresión de escena verificable.

## 15. Identidad, atribución y desarrollo

Dirección creativa y visión: **Víctor Marcel León Pacheco / ORBI Ecosystem**. Codiseño y arquitectura de especificación: ChatGPT / OpenAI. Implementación asistida: repositorio GitHub y herramientas del proyecto. Referencia cultural externa usada solo para estudiar ritmo/perspectiva; todo el arte, nombres de mundos, siluetas y HUD ORBI debe ser propio.

**Documento complementario:** docs/UX15_WORLD01_ASTERIA_ORBITAL.md. **Issues relacionados:** #5 (Infinite), #711 (E8), #712 (formaciones), #248 (Android).
