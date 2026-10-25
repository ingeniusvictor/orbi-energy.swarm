# UX15-C3B-2 — Puente del Dash canónico y colisiones espaciales (QA aislado)

**Ramas / continuidad:** Parte de C3B-1 PR #754 bajo issues #749 y #742. No declarar combate infinito terminado.

## Activación

Abrir `/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1`. Los tres parámetros son necesarios. Los laboratorios previos conservan su comportamiento original; **`EnergySwarmGame.tsx` no se modifica**.

## Componentes certificados

- `src/game/propulsionDash.ts`: comparte cálculo de duración activa por tick entre `stepPropulsionDash` (sin cambios en límites arena existentes) y nuevo `stepRoutePropulsionDash` (sin clamp X, pero con el mismo límite vertical). Ambos usan `DASH_DURATION_MS=180`, `DASH_COOLDOWN_MS=18000`, `DASH_SPEED_UNITS_PER_MS=0.72`, `activatePropulsionDash`, el reloj simulado y la misma política **sin invulnerabilidad**.
- `physicalRouteQaSimulation.ts`: solo con flag C3B-2, usa la dirección normalizada real del input, conserva última dirección, y sustituye el desplazamiento manual por Dash durante la ventana activa, sumando el avance automático lógico exactamente una vez. El rebase tras movimientos sigue atómico con C3A-3.
- `src/game/routeCombatBridge.ts`: índice espacial **real del motor** (`buildSpatialIndex`, `findNearestSpatialItem`, `findFirstCollidingSpatialItem`) recreado por tick y descartado antes de cambiar el epoch físico; detección de contacto local entre enemigo y ENERGY con cooldown de 1000ms y escudo **exclusivo QA** inicial de 100, daño QA de 8. Dash no suspende detección de contacto ni la vuelve inmune.
- Fail-closed: rechaza jefes, Architect, hazard zones y demás propietarios sin migrar. El laboratorio de prueba elimina los antiguos marcadores ficticios de zona antes de activar este puente.
- UI: teclado espacio y botón Dash táctil; telemetría de activación, cooldown, escudo, contactos, enemigos en índice y cercanía; ninguna recompensa, partida, estadísticas o progreso persistente se modifica.

## Verificación

- Equivalencia numérica con Dash de arena cuando ambos están dentro de límites; X física a >1600 y <0, Y limitada, dirección, activación única, duración 180ms y cooldown 18s.
- Índice espacial y daño por contacto con cooldown usando los tipos oficiales de Enemy; denegación para boss/hazards; 30 ORBI, rebase 20+ veces, pausa/hidden/upgrade/hitstop/modal, reset y aislamiento de snapshots.
- Chromium real amplía matriz anterior de 13 a **15 vistas** con teclado escritorio 1440x900 y táctil nativo móvil 844x390. Revisa activación y enfriamiento Dash, continuidad física Y, presencia de enemigos indexados, pausa sin ticks, y reinicio de Dash/escudo.
- CI web (repo, gameplay, plataforma), TypeScript, build y Android APK. Android físico y rendimiento WebGL real siguen bajo #248.

## Aún pendiente para ruta normal

No se ha migrado el motor entero de oleadas, selección y daño de armas reales, Overdrive, Convergencia, evoluciones, jefes/hazards, radar, scoring ni streaming de mundos al combate físico. El escudo/contacto son un contrato **QA sin conectarlo al estado oficial del jugador**. Requiere futuros incrementos C3B-3+ con pruebas de identidad y replay antes de habilitar física en Travesía de Mundos.
