# WBE-01F — ARCONTE DEL UMBRAL / THRESHOLD ARCHON

**Estado de implementación:** jefe exclusivo de Mundo Nuevo / ASTERIA, en el encuentro de la oleada 10. No altera la Campaña clásica, las versiones Infinite, Score Attack, el jefe Blackout Devourer ni los raids de Titan y Worm.

## Director y propiedad del encuentro

La configuración compartida `WAVES`, `BOSS_WAVE_NUMBER=10` y `createCampaignRuntimeWaveDescriptor()` **permanece exactamente igual**. El identificador `world:asteria:threshold_archon:v1` se selecciona solo en `spawnBoss()` cuando `worldRouteRunActiveRef.current` es verdadero, el descriptor de campaña está en oleada 10, su hito es el jefe original y la política es `BOSS_DEFEAT`; jamás para rematches.

La instancia se construye mediante `spawnBoss`, con `bossRef`, `isBoss`, `EnemyType.BOSS_ARCHON`, nuevo chasis `ASTERIA_ARCHON`, 1800 HP y escena original Canvas2D. El motor conserva las llamadas `updateBossAI`, colisión espacial, daño de ORBI, HYDRO, sobrecarga y convergencia, invulnerabilidad temporal de ENERGY, recompensas por derrotar jefes, estadísticas y cinemática de victoria. Después del triunfo, se conserva la transición existente a Infinito.

## Identidad de tres fases

1. **FASE I — Barrido telescópico:** riel de energía estrecho, 1450 ms de aviso con límites visuales de barrido antes de 1650 ms de barrido, vector bloqueado, sin persecución tardía.
2. **FASE II — Tres balizas:** tres líneas paralelas a offsets -145/0/+145 con margen físico de 21 unidades. Hay dos corredores cian de al menos 103 unidades de paso libre. No aparece daño antes de los 1450 ms de advertencia.
3. **FASE III — Sobrecarga de anillos:** onda circular avanza del radio 70 al 400 durante 1650 ms; la franja dañina tiene 23 unidades de semiancho y existe espacio seguro dentro/fuera del anillo. Se presenta antes de disparar.

Todas las fases concluyen con **2800 ms de exposición del núcleo** que aumenta daño ORBI (fase III ×2.35; anteriores ×1.8), recarga de 1150 ms, sin inmunidad perpetua. La transición utiliza los umbrales reales del jefe 70% y 35%, HUD y sonido de transición estándar. El daño al jugador usa **damagePlayerFromBoss**, respetando frames invulnerables y defensa de formación; no se generan proyectiles ni enemigos adicionales.

## QA de liberación

`tests/gameplay/asteria-threshold-archon-live.test.ts`: aislamiento del encuentro, umbrales, retención del ángulo, telegráfico, geometría de corredores, pulso, vulnerabilidad, daño y continuidad de la infraestructura real. Exigir CI, Android, Chromium, EVO8 y UX07 en verde, además de inspección visual en Mundo Nuevo, antes de fusionar. Sin LAB paralelo.
