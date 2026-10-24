# FORM-UX08 — Contrato aprobado de formaciones tácticas del enjambre

**Estado actualizado (2026-10-23):** **geometrías 2, 5 y 6 implementadas en el motor** mediante [PR #696](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/696), squash `f93472de745695b23562ba023192763b646874cb` (CIRCLE estrella más abierta y acotada, V_SHAPE guardia cruzada en dos carriles, SCATTERED Delta Concéntrica determinista). Se mantienen enum, ciclo y modificadores anteriores. CI `40050339022`, Android `40050338983` y Chromium `40050339016` SUCCESS. **Esto NO certifica separación entre siluetas E8 de tamaño real ni prueba física Android (#248).** El resto del documento recoge la propuesta histórica y sus cifras iniciales, algunas de las cuales se ajustaron para respetar el contrato de radio táctico `<=140` (ver código vivo). [Estado integral EVO8](EV_EVO8_V02_IMPLEMENTATION_STATUS.md).

- Tracking: [Issue #688](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/688).
- Base fuente auditada: `main@496348dd84158cbe6edb0fc83f18b3950fc25b1d`; `src/game/formations.ts`, `src/game/formationCycle.ts`, `src/game/EnergySwarmGame.tsx`, `src/components/MobileFormationCarousel.tsx`, `src/i18n/es.ts`, `src/i18n/en.ts`.
- [Referencia vectorial de las seis geometrías](assets/form-ux08-formations-reference.svg) — activo SVG reproducible alojado en GitHub; diagrama técnico, **no** la ilustración promocional idéntica.
- Ilustración conceptual **aprobada** por el usuario en el chat: `formaciones_tácticas_del_enjambre.png` (1672×941, SHA-256 `ea036a1a212e802844d6691bcfb2e19f896bc12f1a62f7245ff2288d1429a8c9`); esta ilustración es referencia artística aprobada **pero el archivo PNG no se adjuntó como binario al repositorio en este PR**. El SVG anterior sí se guarda en el repo. Los personajes coloridos en las imágenes son expresiones de las energías, no exigencia de ordenar afinidades según índice.

## Los seis patrones finales

| N.º / Identificador serializado | Nombre oficial en UI | Geometría | Objetivo de la revisión |
| --- | --- | --- | --- |
| 1 `LINE` | **Línea de Asalto** | Anillos orbitales concéntricos defensivos | Preservar la identidad, acercamiento protector y rotación |
| 2 `CIRCLE` | **Círculo Colector** | Estrella pentagonal con puntas internas y externas | **Abrir radios y separar capas**; cada ORBI legible |
| 3 `DELTA` | **Delta Convergente** | Espiral orbital dinámica | Conservar, comprobar legibilidad con EVO8 |
| 4 `SHIELD` | **Escudo Protector** | Halo único de gran alcance (puede convertirse en varios con gran población) | Conservar su alcance/intercepción |
| 5 `V_SHAPE` | **Guardia Cruzada** | Cuatro brazos diagonales formando **X**, con dos carriles alternos por brazo cuando el enjambre crece | **Separar cuerpos**; mantener cobertura cruzada |
| 6 `SCATTERED` | **Delta Concéntrica** | Triángulos `△` anidados, de menor a mayor, con FOTON en el centro | **Sustituir** dispersión orgánica por geometría triangular multinivel |

**Compatibilidad:** dejar `SCATTERED` como ID interno por ahora, conservando ciclo `LINE,CIRCLE,DELTA,SHIELD,V_SHAPE,SCATTERED`, teclas 1–6, telemetría y partidas guardadas. El cambio visible del nombre es independiente de una futura migración de IDs. Asimismo `V_SHAPE` puede seguir interno hasta migración explícita. La formación 6 **no es la espiral `DELTA`**; ambas deben continuar visualmente diferentes.

## Reglas de posición objetivo (hipótesis para implementar y medir)

Las cifras siguientes son **parámetros iniciales propuestos**, no valores ya ejecutados ni aprobados mediante test físico. Todas las distancias son unidades lógicas del mundo y deberán reevaluarse con la cámara real.

- **Regla de separación EVO8:** para ORBI de hasta **27 px de silueta total** (referencia EVO8 propuesta), espacio aparente mínimo de **6 px**, es decir `centerDistance >= (diameterA+diameterB)/2 + 6` para cada par de compañeros. Se mide en proyección con escalado real; no basta que dos puntos matemáticos sean distintos. Respetar distancia a la silueta central de FOTON; no sustituir radios de colisión por radios visuales.
- **2 / Star Matrix:** grupos de diez, puntos exteriores e interiores alternados con `angle = aimAngle - π/2 + point*π/5`. Para cada shell `s=floor(index/10)`, probar `outerRadius=90 + s*34`; `innerRadius=52 + s*34`; aplicar separador entre cuerpos y reajuste si FOTON, GAIA u ORBI EVO8 exceden presupuesto. Evitar el incremento actual de solo **10** entre shells que apila siluetas. Proteger límite de alcance/zoom.
- **5 / X-Guard:** **cuatro brazos** con **dos carriles** alternos por brazo para que 30 seguidores no formen ocho puntos superpuestos sobre una recta. `arm=i%4;` `lane=floor(i/4)%2;` `rank=floor(i/8)`; ángulo `aimAngle+π/4+arm*π/2`, distancia radial `52+rank*34` y desplazamiento perpendicular `lane ? +18 : -18`. La estructura sigue leyendo como X; el primer rango no invade FOTON. Ajustar con distancias reales.
- **6 / concentric triangular delta:** asignar diez seguidores por capa triangular; `shell=floor(index/10)`, radios circunscritos tentativos `75+shell*40`. Para cada `point=index%10`, muestrear de manera uniforme **el perímetro del triángulo equilátero** con vértices a `−90°, +30°, +150°` y orientación táctica estable. Repartir puntos por los tres lados, sin colapsarlos en las tres esquinas. Hasta 30 seguidores crean tres triángulos. Mantener radio compatible con leash y escenario.
- **1,3,4:** geometrías históricas sin rediseño aprobado, aunque el guardarraíl de superposición debe probarse en todos; no agrandar todos los patrones automáticamente. En el juego real hay dispersión por daño, interpolación elástica, separación espacial y compresión cerca de los límites del mundo.
- Si un diseño supera el ancho/alto útil de Android horizontal o el `LEASH_DISTANCE_SOFT=160` / `LEASH_DISTANCE_HARD=280`, **no recortar personajes ni reducirlos arbitrariamente**: corregir el empaquetamiento, carriles, radio por escala y zoom, y certificar antes de activar.

## Nombres y función táctica — preservar lo existente hasta PR de balance

| Patrón | Etiqueta táctica de referencia visual | Valores principales **actualmente conectados** |
| --- | --- | --- |
| Línea de Asalto | Defensa | reducción del daño recibido de **25%** |
| Círculo Colector | Ofensiva | formación `CIRCLE` con tiro base +1.5 (de 4 a 5.5), velocidad proyectil **+15%**, ritmo de disparo más rápido, daño recibido **+15%** |
| Delta Convergente | Control orbital | velocidad proyectil **−10%**; repulsión extra anunciada aún no probada en el motor |
| Escudo Protector | Intercepción | rango de objetivo de seguidores de 300→400, proyectiles **+20%**, daño recibido **+15%** |
| Guardia Cruzada | Cobertura cruzada | daño recibido **−30%**, movimiento **−10%**, proyectiles **−5%** |
| Delta Concéntrica | Equilibrio por capas | **Pendiente de balance**: conservar por defecto los modificadores heredados de `SCATTERED` mientras no se apruebe una nueva curva. Actualmente reducción del daño recibido **10%**, velocidad FOTON **+15%**, proyectiles **+10%**; bonos adicionales de evasión/crítico declarados pero no confirmados aplicados |

El cambio de forma/nombre de `SCATTERED` no autoriza cambiar automáticamente `damageMod`, `critChanceMod`, resistencia, velocidad, RNG ni beneficios de combate. Revisar por separado la discrepancia entre `FORMATIONS`/textos traducidos y modificadores efectivamente conectados.

## Criterios de aceptación obligatorios del futuro PR de motor

1. Pruebas de las seis identidades, orden 1–6 y cambios en el carrusel táctil Android; teclas 1–6 PC y modo retrato.
2. Simular enjambres **de 1, 8, 10, 20 y 30** acompañantes, con FOTON central y todos los ORBI de silueta EVO8 para peor caso; medir distancia mínima de siluetas, FOTON y clipping. Comprobar población de GAIA y fusiones con tamaños heredados; cap futuro siempre por debajo de FOTON.
3. Validar formaciones 2 y 5 con objetivo de separación `>=6px` entre perímetros, sin convertir estrella en círculo ni X en nube.
4. Verificar que formación 6 representa triángulos concéntricos bien definidos y estable aun cuando aumenta el enjambre. No mezclar con Delta Convergente espiral.
5. Capturas 740×360, 844×390, 915×412, 768×346 DPR2, 1440×900 y portrait, más revisión física de Android. Estresar rotación de cámara, bordes, telegraph, HUD y cambio de formación.
6. Certificar que el joystick analógico 360°, menús UX06, notificaciones UX07, disparos, RNG, recompensas, estadísticas, progresión, fusiones y ataques de energías se mantienen sin regresión.
7. Actualizar nombres `V_SHAPE` → Guardia Cruzada y `SCATTERED` → Delta Concéntrica **solo en presentación e i18n**, nunca reemplazando IDs/guardados sin migración. Guardar en PRs separados de documentación el resultado posterior de certificación.
8. **No afirmar que las geometrías están implementadas a partir de este documento**: el SVG ilustra el contrato, no un frame real de Android.

## Historial de decisión

2026-10-23: usuario indicó explícitamente que en formaciones **2 y 5** los ORBI están demasiado pegados y que la **6** debe reemplazarse por Delta Concéntrica. Se presentó y aprobó la lámina conceptual de las seis formaciones. Este archivo y el SVG reproducible registran ese acuerdo sin cambiar `src/game/**`.
