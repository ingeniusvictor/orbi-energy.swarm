# UX15-C3B-7 — Director físico *Scout Signal* (Wave 1, QA aislado)

Continuación de #759, issues #749/#742. **Solo primera oleada certificada**. Los modos Campaña, Score Attack, Infinito y Travesía normal no incorporan este código: `EnergySwarmGame.tsx` permanece intacto.

## Activación y alcance

Abrir `/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1&ux15-c3b6=1&ux15-c3b7=1`.

- `routeWave1Qa.ts` obtiene **directamente** `createCampaignRuntimeWaveDescriptor(1)` del `runtimeWaveDescriptor` original y `projectRuntimeCombatPressure`, en vez de replicar el presupuesto. `scout_signal`: 12 enemigos en total, máximo 8 simultáneos, 140 frames/intervalo, 35.000ms de duración, un único CRAWLER, sin élites, bosses ni modificadores de terreno.
- Pacing auténtico de `EnergySwarmGame.tsx` (líneas 5715–5755): primeros Scouts a los **500, 2.000, 3.500 y 5.000ms**; de 5.500ms en adelante acumulación de **140 × 16,6ms** por spawn, sin compactar oleadas. El reloj arranca en t=0 simulado del laboratorio, por lo que **no reproduce los 2,5 segundos de intermisión gráfica de Campaña**. El horario se mantiene bajo colas de concurrencia, sin premios por spawns retenidos.
- El actor CRAWLER usa la vida canónica **15 × dificultad de descriptor** y velocidad original del motor `(.8 + r × .6)` unidades/frame, convertida a unidades/segundo. En este QA, `r` es un muestreo determinista acotado por ordinal —**no modifica ni reproduce el RNG de partidas reales**—, para garantizar replay idéntico.
- Los cuatro puntos de aparición permanecen **100 unidades físicas fuera de la cámara**; `projectRouteViewportSpawn` aplica el radio mínimo de seguridad del descriptor (150), sin recurrir a coordenadas fijas de la antigua arena. Preserva el índice espacial, combate ORBI, Convergencia, Dash y Overdrive del laboratorio previo.
- La secuencia artificial de un CRAWLER cada **700ms** de C3B-1 queda inhabilitada **únicamente con `ux15-c3b7=1`**, para evitar mezclar dos directores. La vieja matriz C3B1–C3B6 conserva su ritmo anterior.
- El nuevo director no excede **12 enemigos totales, 8 simultáneos, 12 enemigos de laboratorio globales**. En espera de cap o seguridad incrementa contadores y **no consume presupuesto**.
- Al llegar a **35 segundos de tiempo simulado**, estado `GATED_NEXT_WAVE`, ya **no se crean enemigos**. No se inicia Wave 2 ni se falsifica el comportamiento de PARASITE, DRONE, SPLITTER, hazards o bosses; el recorrido físico y los actores supervivientes pueden seguir operando en QA. El usuario ve explícitamente la compuerta cerrada.
- Para C3B-7 Convergencia usa **waveKey de la primera oleada**, sin reiniciar por cada segmento de ASTERIA. En C3B-6 y anteriores conserva la antigua clave de segmento, evitando regresiones.

## Exclusiones y límites

La nueva oleada es una representación inicial **de la presión y ritmo reales**, no una migración completa de Campaña. No hay intermisión, progreso/cierre de runs, cambio de nivel, economía, score, XP, drops certificados, RNG real, ataques especializados de otros enemigos, hazards, señalización de jefes, oleadas infinitas ni integración en Android hardware. El actor de calibración C3B-6 continúa existiendo exclusivamente en el laboratorio y no forma parte del presupuesto Wave 1. La política de cierre de 35s es explícita; no se fuerza completar el presupuesto si la concurrencia impidió hacerlo a tiempo.

## Gates

- Tests: igualdad exacta del descriptor, ritmo escalonado/intervalo original, health/speed, seguridad geométrica, caps y reintentos, presupuesto 12, no-wave2, fail-closed para DRONE/boss/hazards, 20+ rebases, determinismo, pausa, reset y retrocompatibilidad de flags.
- CI repositorio+gameplay+plataforma, TypeScript, producción web, Android APK y matriz **25 escenarios Chromium**, incluidos desktop 1440×900 y móvil 844×390 con gesto táctil nativo, pacing, pausa y reset.
- El dispositivo físico Android #248 sigue pendiente.
