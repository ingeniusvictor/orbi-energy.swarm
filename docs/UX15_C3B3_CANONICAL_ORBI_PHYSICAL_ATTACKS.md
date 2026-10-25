# UX15-C3B-3 — ORBI canónicos en travesía física, objetivo + perfil de ataque

Continuación de #755 / UX15-C3B-2, issues #749 y #742. **No habilita nuevas reglas del motor publicado**; código exclusivo del laboratorio ASTERIA.

## Entrada y aislamiento
Abrir `/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1`. Son cuatro autorizaciones explícitas. Los tres laboratorios anteriores y los cuatro modos de juego conservan su comportamiento. `EnergySwarmGame.tsx` no se toca.

## Implementado y reutilizado
- `routeOrbiWeaponsQa.ts`: construye un elenco controlado de **30 ORBI**: tres series de los **diez IDs/afinidades/roles/firma** del canon `ORBI_ENERGY_CANON`; no representa desbloqueos de jugadores.
- Obtención del enemigo vivo más cercano usando `buildSpatialIndex` y `findNearestSpatialItem` compartidos con el motor real, construido una sola vez por tick; distancia de 300 unidades, o 400 en formación `SHIELD`.
- Armamento desde `getOrbiAttackProfile` original, sin inventar potencias: forma, afinidad, lifetime, velocidad (4.5 unidades/frame heredadas, convertidas a unidades/segundo físico), daño base, atributos splash/push/slow/pull/support, cadencia/cooldown de perfil y modificadores de las seis formaciones; `getGaiaCombatScale` para GAIA y sus niveles.
- Tres disparos de `QUANTUM_PHASE` con los ángulos y multiplicadores originales si hay presupuesto de balas. Críticos QA reproducibles calculados sobre ordinal, sin `Math.random`, diferente al RNG de producción; el código del RNG normal no se modifica.
- `H2NOVA_CELL` y `GAIA_SYNTHESIS` restauran *únicamente el escudo QA*, hasta 100. El proyectil lleva el `supportShieldRestore` oficial. El disparo provoca retroceso/flash en el objeto ORBI, no en los datos de partidas.
- `routeDynamicEncounter` desactiva su pistola ficticia solo bajo C3B-3: proyectiles ORBI viajan, caducan y golpean mediante la simulación C3B-1, con límites de 24 balas y drops simulados sin recompensas. Los 30 ORBI, sus `targetX`, balas y enemigos comparten el origen flotante atómico.
- Telemetría de disparos, blancos, ecos y soporte, estados de pausa/reset, y 17 pruebas Chromium totales (incluidos dos casos nuevos con teclado y táctil).

## No atribuir capacidades inexistentes
Se conserva la **metadata auténtica de armas** pero esta entrega solo certifica aplicación de daño directo, proyectiles, ecos y soporte QA. Quedan **sin aplicación física completa** los efectos de splash, ralentización, repulsión, magnetismo, evolución, fusiones, Convergencia, Overdrive, jefes, score y progresión. Estos deben entrar en un PR posterior con validación específica y sin cambios inesperados al motor.
Los disparos experimentales no son una reproducción autorizada de todos los casos de armas del juego: QA limita a 24 proyectiles y utiliza hash determinista solo para críticos.

## Gates
Pruebas de perfiles para las diez energías, selección espacial, QUANTUM, GAIA/H2NOVA, seis formaciones, límites de enemigos/balas, pausa y replay con rebases. GitHub CI, typecheck, producción web, Android APK, Chromium desktop y móvil horizontal. Android real #248 continúa pendiente.
