# UX15-C2A — Travesía de Mundos como cuarto modo visible

**Continuidad #742.** Resuelve observaciones del usuario posteriores al piloto UX15-C1: (1) ASTERIA regresaba a fondo espacio abierto al avanzar tras tarjetas de evolución, y (2) no existía opción visible en `Modos de juego` para elegir la travesía.

## Identidad de modo

| Entrada | Qué presenta | Estado |
| --- | --- | --- |
| CAMPAÑA | campaña clásica, espacio abierto | sin alteración |
| SCORE ATTACK | desafío de 60s con su presupuesto | sin alteración |
| TRAVESÍA DE MUNDOS / WORLD TRAVERSAL | ASTERIA horizontal 2.5D, combate real, ruta visual persistente | **Beta** explícita |
| INFINITE | acceso/continuidad de Campaña según reglas anteriores | sin alteración |

**Importante:** TRAVESÍA ya es una opción independiente del menú y tiene identidad estable `WORLD_ROUTE` **dentro de cada run**, pero **durante esta beta comparte** enemigos, oleadas, recompensas y reglas de progresión de Campaña. No se anuncia una progresión física infinita propia ni diferentes estadísticas/loot por modo antes de crear su director definitivo.

## Persistencia

- El launcher inicia `startGameWithMode("CAMPAIGN", true)` para Travesía; `startGameWithMode("CAMPAIGN", false)` para Campaña normal sin QA query; Score Attack siempre desactiva Travesía.
- `worldRouteRunActiveRef.current` es la autoridad de identidad de escena durante la partida, desacoplada del render y del número de oleada; React expone `data-selected-game-mode="WORLD_ROUTE"` únicamente como pista QA.
- No se desactiva el escenario al terminar sectores 1/2, al elegir una carta de evolución, abrir Estado, pausar, pasar a boss o a Infinite handoff. Durante pausa/selección el reloj de fondo se detiene como la física; al reanudar continúa desde el mismo cursor.
- Reiniciar conserva el mismo modo elegido y reinicia la distancia de ruta; salir al menú cierra la run y limpia la identidad, sin cambiar la preferencia de perfiles.
- Compatibilidad temporal con `/?ux15-world=asteria` conserva antigua URL para revisiones, sin exigirla al usuario. Es una entrada QA heredada y no la experiencia prevista de selección normal.

## Interfaz y validación

- Tres superficies de lanzamiento: panel de escritorio, menú móvil horizontal cinematográfico y menú retrato.
- Cuarta tarjeta con texto localizado ES/EN, botón genuino, arte SVG original propio, sin duplicar estilo ni identidad de ENERGY/FOTON.
- Certificar 4 modos en Android landscape; prueba real Chromium entra sin URL especial y valida `data-selected-game-mode`, scroll sobre gameplay real y congelación al abrir Estado.
- CI + APK Android + test visual Canvas EVO8 + UX07 + Chromium, antes de squash. Hardware físico Android sigue Issue #248.
- ASTERIA sigue usando **arte modular provisional** y física 1600×960. Paso siguiente UX15-C2B = arte premium del mundo; UX15-C3 = cámara/territorio real; no cerrar #742.

**Límite comercial:** no presentar el piloto como un cuarto juego con progresión totalmente independiente. La separación en UX es completa; el director propio de aventura por mundos es un objetivo siguiente.