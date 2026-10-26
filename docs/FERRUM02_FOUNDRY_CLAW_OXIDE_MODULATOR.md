# FERRUM-02 — Garra de Fundición y Modulador Óxido

Rama independiente posterior a FERRUM-01; ambos enemigos aparecen solo en **FERRUM real** desde Mundo Nuevo y sustituyen spawns ordinarios; no se crea un LAB ni otro motor.

**Garra de Fundición / Foundry Claw.** Pinza flotante doble rosa-cobre con cable energético: primero persigue hasta una distancia táctica, muestra un anclaje de 1050 ms, activa el cable durante 850 ms y luego retrae. La fuerza se proyecta sobre las coordenadas ya existentes de ENERGY con un máximo de **0,88 unidades/frame**, alcance máximo 310 y distancia de liberación interior 62; mover ENERGY o activar Dash sigue disponible y permite escapar. Eliminar la Garra corta el tirón inmediatamente. Aparece desde oleada 3, ordinal % 5 === 4, máximo una activa. 47 de HP base.

**Modulador Óxido / Oxide Modulator.** Caja hexagonal industrial verde con seis antenas. Permanece a 180–290 unidades de ENERGY y enlaza una armadura temporal a otros enemigos no jefes dentro de 195 unidades. La armadura reduce el daño ORBI solo al **64%** mientras el enlace temporal está activo; pulsa cada 220 ms y cada concesión dura 360 ms. La destrucción del Modulador elimina los enlaces al instante, incluso si muere por splash de ORBI. No protege jefes, hitboxes ni a sí mismo; máximo uno activo. Aparece desde oleada 4, ordinal % 5 === 0. 56 HP base.

Se reutilizan `EnemyType`, `spawnEnemy`, `registerCombatDefeat`, `detectAndResolveCollisions`, `projectilesRef`, `playerPosRef`, límites del arena original, telegraph Canvas2D y drops/resonancia. Los 4 enemigos de ASTERIA y el Arconte permanecen exclusivos de ASTERIA. FERRUM no tiene todavía Capataz Ferrita ni Factoría Omega. PR debe pasar CI, Android, UX07, UX03, UX09, EVO8 y Chromium antes de integrar `main`.
