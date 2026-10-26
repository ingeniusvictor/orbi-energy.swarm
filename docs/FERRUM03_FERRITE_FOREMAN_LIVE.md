# FERRUM-03 — Capataz Ferrita / Ferrite Foreman (Mundo Nuevo)

**Primer élite exclusivo de Ciudad Mecánica** incorporado a la ruta y motor de combate existentes. El encuentro no añade enemigos al presupuesto: sustituye un spawn ordinario en oleadas 5–9, ordinal múltiplo de 12, máximo uno vivo, nunca en jefes, spawns forzados, Campaña clásica o ASTERIA.

## Identidad y patrones

- **Modelo Canvas2D**: exoesqueleto pesado Ferrita, pistones de locomoción, antena de coordinación, martillo neumático doble y reactor central ámbar que se vuelve verde al abrirse.
- **Salud**: 148 base (multiplicadores de dificultad originales); recompensa 420 de puntuación base más resonancia de élite bajo `registerCombatDefeat`.
- **Coordinación:** cuando se acerca a 265 unidades emite un círculo dorado de mando durante 950 ms. Fortalece temporalmente la velocidad de desplazamiento de **Engranaje Sombra y Soldador M-9** existentes dentro de un radio 205; factor 1.18 durante 1300 ms. No crea nuevas máquinas, ni potencia jefes ni tipos de otros mundos. Al derrotarlo, todos sus enlaces desaparecen inmediatamente.
- **Martillo sectorial:** 1150 ms de advertencia naranja con **tres trayectorias separadas** y apuntado que deja de seguir a ENERGY tras el aviso. Lanza tres proyectiles originales con abanico ±0,52 radianes (9 de daño, velocidad 2.1), sujetos al tope real de proyectiles hostiles. Recuperación de 480 ms antes de exponer el núcleo.
- **Reactor expuesto:** durante 1800 ms recibe ×1.85 de daño ORBI y permite golpes críticos; la protección previa reduce solo al 60% del daño (no otorga invulnerabilidad). Finaliza con pausa de 1000 ms y repite patrón.

## Compatibilidad y aceptación

Los modos clásicos, ASTERIA, Capataz del LAB (si existiese), Blackout Devourer y Arconte del Umbral permanecen intactos. `playerPosRef`, `shootFromEnemy`, `getEnemyScoreReward`, `registerCombatDefeat`, límites globales y física son los existentes. El actor aparece con el mismo `drawEnemiesList`, sin sprites remotos ni simulaciones alternativas. Telemetría `data-ferrum-ferrite-foreman-count` se presenta solo en Mundo Nuevo FERRUM.

Pruebas `tests/gameplay/ferrum-ferrite-foreman.test.ts` más CI/Android/Chromium/EVO8/UX07/UX03/UX09 obligatorias antes de la fusión. **FERRUM-04 / Factoría Omega** sigue pendiente y requiere descriptor de jefe exclusivo, como el Arconte de ASTERIA.
