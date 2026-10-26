# WBE-01E — Guardián del Puente / Span Warden (élite ASTERIA)

**Lugar real:** Mundo Nuevo → ASTERIA, campaña pública. Este incremento **no** crea otro LAB ni modifica el Blackout Devourer.

## Aparición y silueta

- Nuevo `EnemyType.SPAN_WARDEN` de la Guardia del Corredor, creado en la misma fábrica `spawnEnemy` del juego.
- Se admite únicamente si `worldRouteRunActiveRef.current` está activa y `sourceMode === "CAMPAIGN"`, desde **oleada 5**, en presupuesto de spawn ordinario `ordinal % 5 === 0` con `ordinal > 0`, sin forcedType ni miniboss y máximo una unidad viva.
- Selección de coordenadas existentes `selectAsteriaRailcutterSpawn` con separación segura respecto al jugador; si no hay posición válida, vuelve a salir el enemigo ordinario.
- Silueta original: guardián orbital grande, cuatro brazos y placas turquesas, arco protector frontal y núcleo cian que se vuelve dorado al exponerse. No es `BLACKOUT_ELITE` recoloreado ni recibe su multiplicador de élite aleatorio.

## Combate canónico

1. **ADVANCE:** se aproxima a ENERGY orientando su cara hacia el jugador.
2. **GUARD, 620 ms:** guardia frontal visible. Impactos directos de proyectiles **en un cono de 120° frontal** se reducen al 28 % del daño habitual; los laterales y traseros conservan daño normal.
3. **WINDUP, 820 ms:** línea cian de advertencia que indica una embestida fijada; el jugador dispone de tiempo para salir de la trayectoria. Mantiene defensa frontal.
4. **SWEEP, 520 ms:** ataque rectilíneo sin perseguir al jugador una vez fijada la dirección. El frente ya no está bloqueado; la colisión usa el sistema original.
5. **EXPOSE, 1300 ms:** núcleo dorado vulnerable; impactos directos hacen **1,65 veces el daño estándar**. Después vuelve a avanzar.

La interacción con proyectiles ORBI usa `projectSpanWardenImpact` justo en el **mismo** punto de colisión canónico del juego (junto a `BLACKOUT_ELITE`), que sigue manejando `enemy.health`, `flashTicks`, `BLOCK`, críticos, daño, resonancia, muerte, puntos y drops. La colisión por salpicadura conserva su contrato global original y no recibe la regla del escudo direccional. No existe una resolución de combate paralela.

**Seguridad:** máximo 80 enemigos, 120 proyectiles, límite existente de 30 ORBI, preservación de formaciones, WaveDirector, y jefe del sector 10. El élite no lanza proyectiles extra ni añade recompensas independientes.

## QA

- Tests `asteria-span-warden-elite-live.test.ts`: gates de modo/oleada, máquina de estados y duraciones, dirección fijada, bloqueo frontal frente a daños laterales y traseros, vulnerabilidad de núcleo, pureza de la simulación, rechazo de números inválidos e integración del motor real.
- Contratos históricos de `BLACKOUT_ELITE`, FOTON, EVO8, UX07 y físicas se mantienen.
- Chromium acumulado y APK Android se ejecutan antes de fusionar. QA físico Android y confirmación visual en Wave 5 quedan por hacer con un dispositivo real.

**Continuidad posterior:** WBE-01F (Arconte del Umbral) requiere un contrato de jefe exclusivo del Mundo Nuevo; no se creará como reemplazo ni alias del Blackout Devourer existente.
