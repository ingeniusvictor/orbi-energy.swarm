# UX15-C3B-9 — Random elite Wave 2 y preflight de Drone Lock

Continuación de C3B-8 (#761) dentro de #749/#742. SOLO el laboratorio opt-in. Flag adicional `ux15-c3b9=1` requiere TODA la cadena previa `ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1&ux15-c3b7=1&ux15-c3b8=1`.

## Autoridad y límites

- Se conserva `createCampaignRuntimeWaveDescriptor(2)`: *Parasite Drift*, 18 enemigos/40s, 12 concurrentes, 5% de probabilidad de élite y `PARASITE_SPEED_SURGE` x1.4.
- La mecánica de **élite aleatorio** del juego real (no confundir con `EnemyType.BLACKOUT_ELITE` ni variantes evolucionadas) aplica únicamente multiplicadores exactos **HP x1.8, tamaño x1.4, tinte #f43f5e**; conserva especie, speed, armas y el resto del contrato. La producción genera la tirada con `Math.random()`; aquí la tirada es **determinista por ordinal QA**, reproducible (un PARASITE élite en ordinal 6 de la primera decena), no reproduce ni altera RNG real. Usar una tirada artificial en 18 muestras no implica que las partidas reales garanticen un élite.
- Los 30 ORBI, Dash, Overdrive, Convergencia y efectos de proyectiles continúan con su QA físico previo. La autorización de impactos, efecto HYDRO, lunge y rayos se amplía EXCLUSIVAMENTE a actores etiquetados y validados `route-wave2-elite-...`, cuando el noveno flag está activo. En los laboratorios anteriores siguen prohibidos; bosses, hazards, evolved, formations y la especie `BLACKOUT_ELITE` continúan denegados.
- La física PARASITE conserva fase de oscilación `xLocal + originOffsetX` para evitar cambios tras rebase 512, incluso al escalar HP/radio de un élite. Caps y presupuesto no cambian: 12 concurrentes, 18 generados.
- La preparación de **Wave 3, Drone Lock** es **SOLO lectura del `createCampaignRuntimeWaveDescriptor(3)`**: nombre, composición DRONE/CRAWLER, presupuesto, concurrencia y probabilidad élite. A los 75s sigue `GATED_WAVE3`: no se instancian DRONE, disparos hostiles, trayectorias de vuelo, densidad de tiro, radar o recompensas no certificados.
- El botón del laboratorio *Simular élites Wave 2 (QA)* ejecuta la misma física desde t=0 hasta ~t=53s, en pasos máximos 50ms. La versión C3B-8 original mantiene su botón t=37s; otras rutas, Campaña y Android producción no incorporan estos cambios.
- Ningún cambio a `EnergySwarmGame.tsx`, economía, score, progreso, balance RNG real, juego normal ni backend. Android hardware #248 pendiente.

## Certificación

- Pruebas de descriptor Wave2, aleatoriedad QA explícita, escala de élites CRAWLER/PARASITE, knockback y crítico, HYDRO, rebase físico, Convergencia target-pinned, fail closed sin flag, 1600-tick replay, pausa/reset, topes, Wave3 read-only y DRONE ausentes.
- Matriz de navegador aumentada a **29 escenarios** (C3B9 desktop 1440×900 y móvil horizontal táctil 844×390), además de CI TypeScript/web/release y APK Android.
