> **Actualización UX15-C3B-12A:** este diseño visual QA duplicado fue sustituido por la propulsión canónica de `energyThrusters.ts`. Consulta [hotfix C3B-12A](./UX15_C3B12A_CANONICAL_THRUSTERS_HOTFIX.md). El contenido siguiente se conserva como registro histórico de C3B-12 y ya no describe el renderizador actual.

# UX15-C3B-12 — Propulsión visible de FOTON en ASTERIA QA

Continuidad de PR #765 (panoramas sin retroceso) y PR #764 (Drone Duel C3B-11), sin reabrir mecánicas públicas.

## Alcance

- Nuevo flag `ux15-c3b12=1`, subordinado al laboratorio `ux15-physical-qa=1` y a toda la cadena UX15-C3B-1…11. Cualquier omisión deja la característica desconectada.
- Módulo exclusivamente de dibujo: `src/game/fotonPropulsionQa.ts`.
- Dos chorros azul/cian de la parte posterior de ENERGY, orientados hacia `-X` en coordenadas del actor; siguen el mismo `ctx.scale/translate` físico y se dibujan **antes del GLB de FOTON**, sin superponer una llama sobre la carrocería.
- Crucero continuo con longitud nominal 31 u, con pulso suave determinista según `frame.cursor.simulatedMs`. Durante el Dash real certificado (180 ms), el chorro aumenta a 69 u y se muestran hasta tres estelas breves.
- La propulsión se basa en `projectPropulsionDash(s.bridge.dash, simulatedMs).active` del núcleo original. No hay temporizador gráfico externo, partículas persistentes ni falso impulso.
- Pausa / pestaña oculta congelan el reloj de física, por tanto también el pulso. `prefers-reduced-motion` presenta una forma luminosa fija y evita estelas.
- `canvas.dataset.c3b12Thrust`, `c3b12ThrustLength`, `c3b12ThrustAnimated` exponen solo telemetría QA, sin afectar puntajes, daño o atributos de juego.
- No se toca `EnergySwarmGame.tsx`, WebGL, colisiones, rutas, origin rebases, armas ORBI, Wave3 ni sistemas de recursos. El efecto no se introduce todavía en Campaña, Score Attack, Infinito o Travesía pública.

## Verificaciones

- Contrato de crucero continuo, escala visual Dash/normal, determinismo con tiempo simulado, modo de movimiento reducido y rechazos de entradas no finitas.
- Mock Canvas2D: dos motores, cuatro capas, tres estelas solo en Dash, parejas `save/restore`, sin modificar coordenadas fuente.
- Integración física: Dash canónico, cooldown, avance +X, pausa; comprobación estructural de que no se modifica motor público ni física.
- Chromium: 35 escenarios (33 originales más desktop 1440×900 y móvil táctil 844×390). En ambos: detectar chorro `CRUISE`, avance físico, activar Dash real, observar `DASH`, comprobar retorno, pausa, reset y Wave3 bloqueada.
- Fusionar por squash solo con GitHub CI, Chromium y Android verificados. El test físico con teléfono Android sigue siendo independiente.
