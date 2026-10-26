# WBE-01A — CORTADOR DE RIEL / RAILCUTTER en MUNDO NUEVO

**Estado:** implementación del primer enemigo original de ASTERIA directamente en la modalidad pública **MUNDO NUEVO** (campaña con `worldRouteRunActiveRef.current`). No se crea ni utiliza otro laboratorio.

## Implementación real

- Enum `EnemyType.RAILCUTTER`, con estado de ataque propio `railcutterAttack`.
- Composición en la misma **simulación real** `EnergySwarmGame.tsx`: se sustituye un spawn ordinario elegible por un Cortador de Riel, sin sumar enemigos al presupuesto. Solo `sourceMode=CAMPAIGN`, bandera de Mundo Nuevo verdadera, Wave >= 2, ordinal módulo cinco = tres; nunca en los cuatro primeros enemigos forzados de Wave 1, boss/miniboss, Infinite, Score Attack o Campaña clásica.
- Máximo **un** Railcutter activo en esta primera fase, presupuesto compartido del WaveDirector. Si no hay posición suficientemente separada del jugador, conservar el enemigo clásico en vez de crear una aparición injusta.
- Patrón de combate propio, determinista, en `asteriaRailcutter.ts`: APPROACH (acercamiento), AIM (850ms de señal luminosa + línea de mira bloqueada), CHARGE (420ms en un vector fijo, rápido y **sin girar hacia ENERGY** una vez iniciado), RECOVER (900ms inmóvil y vulnerable), retorno a APPROACH.
- Física: tick del juego original, movimiento sujeto a slowTimer existente, pausa global y límites del mundo actual. No se finge origen flotante de combate donde aún no está integrado; Mundo Nuevo sigue utilizando por ahora la física legacy 1600×960, aunque el escenario sea panorámico.
- Diseño **original Canvas2D**: fuselaje oscuro de flecha orbital, dos cuchillas cian, reactor luminoso, telegraph a 230 unidades y estela durante CHARGE. No es una recoloración de CRAWLER.
- **El mismo motor original** resuelve salud, impactos de proyectiles ORBI y ENERGY, resonancia, explosión, XP, recursos, puntuación, empuje, ralentización, colisión de contacto y culling. Sin sistema de daño/combat alternativo; sin recompensas extraordinarias.
- `data-wbe01-railcutter-scope`, `...count`, `...phase` son métricas de diagnóstico solo en el canvas del Mundo Nuevo real. No añaden un modo ni activan enemigos.
- La IA nueva no está inscrita en formaciones enemigas prediseñadas, porque esas trayectorias podrían cancelar su embestida. Todos los demás tipos conservan su director original.

## Validación

- Tests WBE-01A: ingreso solo en Mundo Nuevo, seguridad espacial en cámara y límites del mundo, sin duplicar budget, fases y timers, aviso congelado con dirección capturada, charge no-homing, estado vulnerable, pureza/DT, y cableado del motor real.
- Suite de navegador Chromium existente prueba en desktop/móvil que la modalidad de ASTERIA es genuina, World Route y combate real, que expone la identidad WBE-01A, y que durante Wave 1 aún no nació un Railcutter. La activación de Wave 2 y rendimiento Android deberán también revisarse en juego.
- GitHub CI, TypeScript/build, Android y tests Chromium siguen bloqueando el merge.
- Próximo paso WBE-01B: introducir el Espectro de Altura tras recibir aprobación visual de este enemigo en la experiencia jugable real.

## Alcance de seguridad

Ninguna modificación al laboratorio `PhysicalRouteQa`, a producción fuera de Mundo Nuevo, a estructura de oleadas de Campaña/Infinite, al jefe Blackout Devourer o a los límites 30 ORBI / 80 enemigos / 120 proyectiles. No se inventan mundos, jefes o recompensas sin contrato previo.

Origen creativo: [biblia de enemigos](./UX15_WORLD_EXCLUSIVE_BESTIARY_AND_BOSSES_V1.md).
