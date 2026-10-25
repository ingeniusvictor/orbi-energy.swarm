# UX15-C1 — ASTERIA dentro del combate auténtico (piloto opt-in)

## Estado / límites de lo entregado
**UX15-C1** es la primera integración del **World Route Renderer en la partida REAL**, con enemigos, proyectiles, ENERGY GLB, 30 ORBI potenciales, formaciones, puntuación, recursos y jefe legacy intactos. **Todavía NO es UX15-C completo ni un mundo físico infinito**.

**URL de ensayo**: `/?ux15-world=asteria` — pulsa Campaña.

**URL normal**: `/` — ARENA_LEGACY, sin variación de código de física, cámara, spawns, recompensas ni fondo.

### Qué cambia realmente
- Durante los sectores **1 y 2 de Campaña** solamente, una escena ASTERIA Canvas2D 2.5D aparece como paisaje real detrás del combate, con seis tramos visuales reproducibles.
- El mismo cursor de segmentos UX15-B avanza según el DELTA de simulación del motor y solo durante oleadas activas: respeta pausa, Estado/Táctica/Equipo, selección de mejoras, hitstop y pestaña oculta.
- Se dibujan **los actores reales** que posee `EnergySwarmGame`, no el marcador dorado del laboratorio: ENERGY usa su pipeline GLB, ORBI con sus identidades, enemigos y recursos del engine. Los indicadores de QA del paisaje se ocultan.
- Se expone telemetría de solo lectura en el Canvas: `data-ux15-world`, `data-ux15-route-distance`, `data-ux15-segment`, `data-ux15-live-combat`, exclusiva del query. El contrato de misión no lee estos valores.
- Score Attack, Infinite, sectores >2 y cualquier URL sin opt-in conservan su fondo habitual.

### Qué NO cambia
- Las coordenadas del campo 1600×960, cámara real, zoom, Dash, posiciones enemigas ni forma de disparar; por ende todavía no hay **movimiento físico longitudinal infinito**. Actualmente el paisaje avanza por detrás de la arena, produciendo sensación de travesía real en una partida, pero la física está en su espacio clásico.
- Segmentos **no** definen hard walls, hazards, bosses, spawn gates ni nuevas recompensas. ASTERIA no autoriza un boss ficticio en sectores 1–2.
- El arte de ASTERIA es **provisional** (arquitectura Canvas2D modular). La representación definitiva premium original y el adaptador de cámara/entidades quedan para UX15-C2/C3 y D.
- Ninguna escena muestra capturas del material gráfico de Star Fox; solo se reproduce la dinámica de viaje horizontal inspiradora.

### Pruebas
- Nuevos tests de route mode opt-in, energía real única, reloj/pausa, escenas six-segment y compatibilidad de combate.
- Chromium real desktop 1440×900 y Android landscape emulado 844×390, con estado de combate auténtico, desplazamiento observado y pausa vía Estado; suite anterior mantiene 7 vistas.
- CI, typecheck, build y Android debug APK deben estar verdes antes de squash merge.
- QA Android hardware real se mantiene #248 y no se presenta como PASS por automatización.

### Siguiente C2
Adaptar la cámara real a una región horizontal libre con lookahead adelantado y coordenadas locales de ruta; adaptar el spawn seguro y rebasing de actores sin modificar los contratos de combate y sin usar distance visible como coordenada de colisión. Pruebas Android sobre 30 ORBI, Dash y jefes para habilitar ruta por defecto.
