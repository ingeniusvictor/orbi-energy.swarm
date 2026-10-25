# UX15-C3B-10 — Drone Lock: proyecciones físicas preflight sin adopción

Continuidad de #762 (C3B-9), #749 y #742. Nuevo flag opt-in: `ux15-c3b10=1`, subordinado a toda la cadena hasta `ux15-c3b9=1`.

## Propósito

**Esta etapa no activa Wave 3 ni DRONE en ningún motor.** Certifica por tests matemáticos separados las reglas existentes de un DRONE *ordinario* y permite inspeccionar el escenario de forma visual en el laboratorio, manteniendo el runtime Wave 2 y todos los modos públicos sin cambios.

### Autoridades extraídas de `EnergySwarmGame.tsx` y `waveDirector.ts`

- Wave 3: `drone_lock`, 45.000ms, presupuesto 22, cap 14, intervalo 95 frames, composición `[DRONE, CRAWLER]`, probabilidad élite 10 %, modificador `DRONE_TARGETING_DENSITY`.
- DRONE normal: HP `20 * difficultyMultiplier`, velocidad `0.7 * biomeSpeed * combatPressure` por frame legado, tamaño 11, tinte `#a855f7`; `DRONE_TARGETING_DENSITY` multiplica el cooldown inicial `(80 + RNG * 80) * .6`.
- Persecución: se acerca si distancia **> 180**, se aleja si **< 120**, entre bandas permanece y realiza deriva lateral `cos(timeElapsed*.003)*.8` por tick. El legado **no escala la deriva lateral con delta**; no inventamos una corrección temporal silenciosa.
- Armamento neutro: distancia estricta `0 < distancia² < 320²`, velocidad 2.2 u/frame, un proyectil rose de daño 12, radio 3.5, vida 2500ms; recarga tras disparo `100+RNG*70` frames. DRONE evolucionado `LANCE_DRONE` y su ráfaga doble quedan excluidos.
- Impacto original de proyectil enemigo: prueba discreta contra radio `16 + tamañoProyectil`; no se modelan daños, escudos ni efectos de juego.
- Culling de trayectoria **solo propuesto para mundo físico**: cámara más margen físico QA, no límites `WORLD_WIDTH` legados. No se adopta aún en `stepRouteDynamicQaEncounter`.

## Garantías y límites

- Los actores `route-wave3-drone-preflight` y `route-wave3-preflight-shot-*` **solo existen como objetos en memoria dentro de proyecciones y pruebas**. Jamás son agregados a `encounter.enemies` o `encounter.projectiles` de la ruta física.
- La simulación previa permanece `GATED_WAVE3` al terminar Parasite Drift a t=75s.
- Las pruebas someten muestras de DRONE/plasma a **la misma transacción atómica** `rebaseRouteCoordinateOwners`, y comprueban invariancia tras traslación de coordenadas. No implica autorización de nuevos propietarios en runtime.
- El laboratorio exhibe la proyección offline, `data-c3b10-*`, y cero DRONE físicos. El nombre y el estado visual describen claramente que NO hay drones en combate.
- C3B-10 no toca `EnergySwarmGame.tsx`, economía, Score Attack, campaña, Infinito, Travesía, recompensas, Android nativo ni selección RNG real.
- Pendiente C3B-11: certificar índice espacial con IA hostil, pipeline de proyectiles *vivos*, resolución de colisiones, daño/escudos, prioridades de culling, evasión, telegraph y multiplicadores, rendimiento móvil; **solo entonces** evaluar apertura de Wave 3 física.

## Validación

- 8 nuevas pruebas gameplay de descriptor, 120/180, fase de deriva, disparos 320, velocidad/daño/vida, colisión/culling read-only, origen flotante (transacción compartida), replay 300 ticks y no adopción real de DRONE.
- La matriz Chromium aumenta de 29 a **31** pruebas reales de navegador, incluyendo escritorio 1440×900 y móvil horizontal táctil 844×390.
- Exigir CI (repositorio/gameplay/platform + TypeScript + release + build), Chromium 31/31 y APK Android antes de fusionar. La comprobación física sobre teléfono Android es independiente y sigue pendiente.
