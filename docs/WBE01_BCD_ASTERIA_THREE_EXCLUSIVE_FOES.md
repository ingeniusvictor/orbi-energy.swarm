# WBE-01B/C/D — ASTERIA: tres enemigos originales en MUNDO NUEVO

Estado: implementación en el **juego real**, no en ASTERIA LAB. Continúa WBE-01A Railcutter (#769) y biblia creativa (#768). Los tres enemigos son nuevas identidades de combate que comparten **salud, ataque ORBI, daño, colisiones, recursos, puntajes, presupuestos de enemigos/proyectiles y eliminación** del motor original `EnergySwarmGame.tsx`.

## Enemigos nuevos

| Enemigo original | Entrada y disponibilidad | Mecánica / señal | Respuesta del jugador |
| --- | --- | --- | --- |
| **Espectro de Altura / Sky Specter** (`SKY_SPECTER`) | Mundo Nuevo oleada ≥2; ordinal %5=1; máximo uno vivo | Planeador de tres alas violeta-cian. Se posiciona en una banda superior/inferior; muestra **780ms** de línea de picado, luego trayectoria fija **480ms**, sin perseguir en vuelo. Queda expuesto **1050ms** | Moverse fuera de la línea antes del picado; atacar en recuperación |
| **Prisma de Baliza / Beacon Prism** (`BEACON_PRISM`) | Mundo Nuevo oleada ≥3; ordinal %5=2; máximo uno vivo | Baliza triangular de tres emisores dorados. Mantiene distancia, fija el punto del objetivo y proyecta tres rayos de advertencia **900ms**, dispara ráfaga de **tres proyectiles** en abanico, 8 de daño cada uno; recarga 1800ms | Desplazarse entre los rayos, no quedarse donde apuntó originalmente |
| **Velero de Iones / Ion Sail** (`ION_SAIL`) | Mundo Nuevo oleada ≥4; ordinal %5=4; máximo uno vivo | Planeador de velas turquesa. Advierte **720ms**, cruza en una dirección fijada **1200ms**; suelta restos de plasma estáticos temporalmente, cada 320ms, 5 de daño, vida **850ms** | Cambiar de altura antes de que cruce y no entrar en la estela hasta que se desvanezca |

**Cortador de Riel WBE-01A** permanece en %5=3 a partir de oleada2. El resto de slots de la misma composición no se reemplaza.

## Reglas innegociables

- `worldRouteRunActiveRef.current` verdadera, `sourceMode=CAMPAIGN`, sin `forcedType` ni miniboss, un solo vivo por tipo, selectores de aparición fuera de radio seguro. **Campaña clásica, Infinite y Score Attack quedan intactos**.
- La elegibilidad especial reemplaza un spawn de presupuesto existente; no abre presupuesto adicional, no forma escuadrones que cancelen las trayectorias.
- Los proyectiles de la baliza usan `shootFromEnemy` y el contador hostil original. El rastro ionizado es un proyectil hostil real de velocidad cero, con `life` y daño establecidos, y chequea presupuesto y distancia mínima antes de aparecer. No existen trampas permanentes ni un segundo resolver de colisiones.
- Escala de dificultad, multiplicadores de movimiento, ralentización HYDRO, invulnerabilidades existentes, ORBI, muerte, recompensa, pausa, HUD y culling siguen en la simulación pública. No se tocan los cuatro modos públicos salvo la ampliación intencionada de Mundo Nuevo.
- Todo telegraph antecede a un ataque peligroso; las trayectorias se fijan en el momento señalado. No se generan enemigos dentro del radio de aparición segura.
- **No se activa jefe nuevo ni el élite Guardián del Puente**. Se programarán en WBE-01E/F tras aprobar los tres normales.

## QA

- Nuevos tests del selector exclusivo y modo/oleada, una copia viva por tipo, spawn seguro dentro del mundo legacy 1600×960, determinismo y máquina de estados, bloqueo de mira ante retarget, señales antes de daño, duración de restos eléctricos, presupuesto y validación de integración con `EnemyType` y el motor real.
- Chromium completa matriz histórica en escritorio/móvil y verifica el ámbito real de Mundo Nuevo; usar telemetría del canvas `data-wbe01-asteria-exclusive-counts` para detección de aparición en una sesión posterior. La matriz actual no certifica todavía visualmente **cada** aparición de las oleadas 2–4.
- CI completo, Android APK, EVO8 y UX07 deben quedar verdes antes del squash.
- Pendientes: observación física en teléfono Android, calibración de aparición real y equilibrio de la estela en oleada4.

## Próxima etapa

**WBE-01E — Guardián del Puente**: élite original con armadura frontal y exposición periódica del reactor, también en **Mundo Nuevo real**; **WBE-01F Arconte del Umbral** debe esperar un contrato independiente de jefe, sin reemplazar el Blackout Devourer existente.
