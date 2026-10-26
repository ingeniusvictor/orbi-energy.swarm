# WBE-01E — Guardián del Puente / Span Warden (ASTERIA)

**Implementación:** el primer enemigo élite ORIGINAL de ASTERIA vive dentro del motor de **Mundo Nuevo**, sin LAB ni copia de combate. Añade el tipo `EnemyType.SPAN_WARDEN`, estado `spanWardenAttack` y un módulo puro `asteriaSpanWarden.ts`.

## Experiencia

- **Aparición:** a partir de oleada 5, ordinales ordinarios múltiplos de 10, **máximo uno vivo**; mismo presupuesto y límite de enemigos. Nunca en Campaña clásica, Infinite, Score Attack, spawns forzados, miniboss o jefe; con posicionamiento seguro >=210 unidades de ENERGY. Si no hay lugar seguro, aparece el enemigo común previsto.
- **Identidad:** silueta mecánica orbital de cuatro brazos y articulaciones, placas azul acero, escudo frontal asimétrico dorado, reactor central cian que pasa a oro brillante al abrirse. Dibujado por el mismo Canvas2D sin activos nuevos.
- **Patrón táctico:** aproxima hasta 245 unidades -> GUARD 1050ms -> WINDUP con **950ms** de doble aviso dorado -> STRIKE 470ms, descarga **de dos proyectiles reales** en ángulos laterales fijados (±0.56 rad) y pequeño desplazamiento lateral, sin seguimiento -> EXPOSED 1550ms -> repite alternando lado.
- **Escudo:** frente en GUARD/WINDUP reduce 82% el daño, flanco/espalda permiten daños mayores. La exposición multiplica el daño por 1.85; el daño de convergencia sigue el resolver ORBI existente, no salta barreras de jefes ni instala invulnerabilidad perpetua.
- **Balística:** balas desde `shootFromEnemy` (2 por descarga, 9 de daño, velocidad 2.35), sujetos al presupuesto real `MAX_PROJECTILES` y a `hostileProjectileBudgetState`. Sin campos nocivos inevitables.
- **Integraciones:** ralentización HYDRO, cámara y física legacy actual, contacto con ENERGY, proyectiles ORBI, resonancia élite, muertes, recursos, efectos, HUD y puntuación (recompensa base 360) permanecen en el motor existente. No `isBoss`, por tanto no altera cinemáticas ni Blackout Devourer.
- **Telemetría:** `data-wbe01-span-warden-count` / `data-wbe01-span-warden-phase` solo en la escena de Mundo Nuevo real, eliminados al volver a otros modos.
- **Rendimiento:** una entidad única, cuatro brazos Canvas2D sin mallas pesadas, dos balas como máximo por ciclo y sin scans extra por proyectil. El motor aplica sus límites globales 30 ORBI, 80 enemigos y 120 proyectiles.

## QA y aceptación

El test `tests/gameplay/asteria-span-warden-live.test.ts` cubre selector de modo/oleada, spawn seguro, transiciones, anuncio antes del disparo, bloqueo de aim, flanqueo, núcleo, pureza del tick y cableado real. GitHub Actions CI, Chromium, Android, EVO8 y UX07 deben estar verdes antes de fusionar; revisar también su legibilidad en móvil y aparición de la oleada 5 del sitio real.

**WBE-01F / Arconte del Umbral:** requiere una PR diferente y auditoría del director de jefes. No queda activado por esta fase.
