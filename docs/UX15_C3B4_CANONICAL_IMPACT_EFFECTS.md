# UX15-C3B-4 — Impactos físicos de armas ORBI en ASTERIA (QA aislado)

Continuidad: C3B-3 PR #756, issues #749 / #742. Solo se permite usar con los **cinco** flags de laboratorio: `/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1`. El motor `EnergySwarmGame.tsx` y los cuatro modos publicados **no** se modifican.

## Núcleo adaptado
- `routeOrbiImpactFxQa.ts` procesa metadatos reales del tipo `Projectile` generados desde los diez perfiles `getOrbiAttackProfile`, solo **después de un impacto confirmado por barrido**. Sigue los procedimientos del motor existente (`EnergySwarmGame.tsx` bloque de impactos 6992–7075).
- Empuje directo: para CRAWLER usa factor canónico **5,5 × pushMultiplier**, proyectado en dirección de la bala. Para otros tipos se falla cerrado: el motor real tiene multiplicadores derivados de comportamiento y no deben ser inventados.
- Ralentización HYDRO/GAIA: `slowTimer = max(actual, perfil.slowDurationMs)`, decaimiento con `deltaMs` simulado y persecución al **45 %** de velocidad durante el efecto (igual a la lógica legacy).
- Magnetismo MAGNE/GAIA: consulta `findAllCollidingSpatialItems` del índice espacial oficial y desplaza otros objetivos vivos hacia el impacto por `magneticPullStrength`; actualiza las entradas espaciales con `relocateSpatialIndexEntry`. No mueve el objetivo directo dos veces.
- Explosiones TERMO/ATON/GAIA: recorrido espacial a `splashRadius`, excluye explícitamente al blanco directo y aplica `dañoDirecto × splashDamageMultiplier` a los demás enemigos vivos. Las bajas por área se contabilizan una sola vez y pueden producir un recurso **solo QA**, sin créditos reales.
- El resultado es determinista y sin RNG; la simulación mantiene límites de 12 enemigos, 24 proyectiles, 16 recursos y un rebase atómico. Los cuatro contadores de efectos y bajas por área quedan visibles, además del anillo cian que indica enemigos ralentizados.
- No se crean efectos con proyectiles fallidos, expirados o fuera de pantalla, ni durante pausas/hidden/hitstop/upgrade.

## Límites y seguridad
- Solo se certifican enemigos `CRAWLER` de las escenas controladas. Si aparecen bosses, Architect, enemigos no admitidos, hazards o Convergence, **se rechaza la operación**. No se declara equivalencia con los enemigos evolucionados ni su resistencia específica.
- Sin integración real de puntuación, run archive, economía, audio completo de impactos, partículas avanzadas, Overdrive, Convergencia, fusiones, jefes, daño de barreras, recompensas de campaña o telemetría persistente. Las armas mantienen sus perfiles reales, pero el balance en un mundo físico aún requiere certificación por oleadas.
- C3A, C3B-1, C3B-2, C3B-3 conservan por omisión sus reglas anteriores. Solo el parámetro nuevo habilita esos cuatro efectos.

## Pruebas obligatorias
- Unitarias para perfiles, daño de área, sin daño duplicado al blanco, ralentización 45 %, límites temporales, empuje, magnetismo y relocalización espacial, bajas múltiples, fail-closed, preservación de C3B-3, determinismo y origen flotante, pausa/reset.
- CI `test:repo`, `test:gameplay`, `test:platform`, `typecheck`, build y Android APK. Chromium 19 escenarios totales, incluidos escritorio y móvil horizontal táctil con impactos registrados, pausa y reset.
- Android real #248 pendiente; nunca sustituir con la compilación APK.
