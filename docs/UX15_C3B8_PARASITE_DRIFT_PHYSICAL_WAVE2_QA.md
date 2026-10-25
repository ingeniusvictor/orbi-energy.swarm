# UX15-C3B-8 — Parasite Drift, oleada 2 física certificada parcialmente

Continuidad C3B-7 PR #760, issues #749/#742. **Laboratorio QA exclusivamente**, activo con ocho flags (C3B-1…8) además del flag de ruta `ux15-physical-qa=1`. `EnergySwarmGame.tsx` y sus modos Campaña, Score Attack, Infinito y Travesía de Mundos permanecen intactos.

## Director y transición

- Wave 1 `scout_signal` sigue en el mismo recorrido físico desde t=0 hasta t=35.000ms. Después se activa `createCampaignRuntimeWaveDescriptor(2)` sin reiniciar las coordenadas, sin resetear los 30 ORBI, el origen flotante o el escudo QA. La clave de Convergencia pasa de `CAMPAIGN_QA:scout_signal` a `CAMPAIGN_QA:parasite_drift`, impidiendo que una canalización incompleta atraviese oleadas.
- `parasite_drift`: 40 segundos (35.000–75.000ms del reloj QA), 18 enemigos de presupuesto, 12 simultáneos, 110 frames × 16,6ms de intervalo, composición original PARASITE/CRAWLER, modificador `PARASITE_SPEED_SURGE` (×1,4) y 5 % de posibilidad de élite.
- Muestra determinista QA **alternada** PARASITE/CRAWLER. No cambia ni suplanta el RNG de producción: el verdadero motor utiliza selección aleatoria en esa composición. El 5 % de élites **se deja sin implementar** y se expone como *tiradas de élite sin certificar*, no se simulan enemigos élite con estadísticas de CRAWLER. No existe XP, score, drops de campaña, rarezas, balance de altas presiones, intermisión gráfica ni persistencia.
- PARASITE normal: HP = 8 ×1,15, tamaño 8, velocidad base =1,8 unidades/16,6ms ×1,4 por la oleada; CRAWLER normal HP =15 ×1,15, tamaño10, velocidad original (.8+.6×muestra QA)/16,6ms; biome multiplier baseline =1 en este laboratorio, pendiente de certificar rotación de biomas. El movimiento PARASITE usa la oscilación original `sin(t×.015+worldX)×1.5`, pero `worldX = xLocal + originOffsetX`, imprescindible para no alterar la fase con rebases de 512 unidades.
- Se aplican efectos de proyectiles reales a PARASITE normal mediante **gate C3B-8**: base push 1,8; crítico 4,0; CRAWLER permanece en 5,5. Splash/slow/magnet usan el índice espacial certificado. Convergencia acepta PARASITE ordinario solo con este gate, no evolved PARASITE o bosses.
- Los 12 enemigos simultáneos se contabilizan **globalmente** incluyendo supervivientes Wave1; no se admiten extras por coexistencia. La diana de calibración C3B-6 no se crea en C3B-8 para no consumir un cupo artificial.
- Cierre a t=75.000ms con `GATED_WAVE3`; **no** aparece DRONE ni se intenta certificar Wave3 sin su propia política. Se conserva el recorrido horizontal y las balas existentes.
- Botón opcional de laboratorio **«Simular hasta Wave 2 (QA)»**: ejecuta hasta 37s del **mismo tick físico** en pasos de 50ms, sin forzar estado ni otorgar recompensas. Permite observar el PARASITE en navegador real de manera reproducible.

## Límites de certificación

- No claims de equivalencia total de Campaña. Transición Wave1→Wave2 sin la intermisión oficial; selección de enemigos y élites deterministas/suprimidas; no hay inmunidad ni efectos de evoluciones, minijefes, formaciones hostiles, IA de drones ni biomas.
- Todas las demás mecánicas (Overdrive, Dash, Convergencia, ORBI, origen flotante y cámara) permanecen con sus implementaciones QA existentes. Las mecánicas de Campaña permanecen intocadas.
- Gates: 10 pruebas gameplay para descriptor, transición 35s, presupuesto/caps 12/18, lunge y origen global, splash/push/crit, Convergencia normal, rechazo de evolucionados/boss/hazards, replay 1800 ticks y pausa, más matriz de **27 escenarios Chromium** desktop/táctil Android APK y verificación general CI. Hardware Android #248 aún pendiente.
