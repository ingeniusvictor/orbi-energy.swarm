# UX15-C3B-12A — Hotfix: RCS originales de ENERGY en el LAB

**Corrección de la divergencia visual de C3B-12 (PR #766).** El usuario corroboró que al pulsar «Volver al juego» la propulsión original funcionaba correctamente, mientras que el laboratorio mostraba una representación decorativa y prácticamente estática. La solución no requiere otro diseño visual: **reutiliza el renderizador oficial** del videojuego.

## Solución aplicada

La implementación decorativa `src/game/fotonPropulsionQa.ts` fue eliminada. El laboratorio importa directamente de `src/game/energyThrusters.ts`:

- `createEnergyThrusterPose` / `projectEnergyThrusterPose`: motor de inercia **idéntico al juego normal** basado en el desplazamiento real ENERGY, incluyendo avance automático, joystick/teclas, Dash y retorno manual.
- `drawEnergyThrusterJets`: dos RCS originales, orientación opuesta al movimiento, salida cian y destello dorado durante Dash, con parpadeo original ligado al reloj de simulación.
- `projectEnergyThrusterJetReach`: fórmula original extraída sin alteraciones, compartida por dibujo y telemetría de prueba.
- `drawEnergyDashStreaks`: código de **las mismas tres estelas UX11-E del juego normal**, extraído y usado por ambos clientes. `EnergySwarmGame.tsx` ahora llama a esta función compartida en el mismo punto de composición, sin cambiar colores, longitudes, duración, posición, mezcla o reglas.
- El LAB dibuja RCS **antes** del GLB original de FOTON y estelas **después**, tal cual en producción. El banco de inclinación `bankRadians` original también llega a `drawFoton`.

**Origen flotante:** el estado `energyThrusterPose` opt-in se calcula con `playerNuevo-playerAnterior` dentro del tick físico, *antes* del rebase atómico. No tiene anclas propias, no requiere rebase y nunca confunde desplazamiento de cámara con aceleración del motor.

**Seguridad:** solo se activa con la cadena de flags histórica hasta `ux15-c3b12=1`. No se habilita Wave3, no se crean partículas permanentes, no se cambian enemigos, reglas físicas, vida, cooldown, recursos, resultados, cámaras ni tiempos. El juego normal conserva su presentación mediante una refactorización exacta del código de estelas, sin introducir la antigua llama QA.

## Certificación

Pruebas de las dos llamadas compartidas entre juego y LAB, fórmula canónica y seis trazos por par de motores, tres estelas en Dash, reversión direccional voluntaria, movimiento/pausa, retroceso/resolución correcta del origen flotante, gates opt-in, y navegador Chromium escritorio + táctil de la matriz acumulada de 35 casos. TypeScript, todas las suites y Android debug APK son requisitos para merge.

La propulsión visual original conserva sus ajustes de accesibilidad propios, sin simulaciones adicionales inventadas por el LAB.
