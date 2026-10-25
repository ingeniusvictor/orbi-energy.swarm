# UX15-C3B-5 — Resonancia y Overdrive canónicos en ASTERIA (QA aislado)

Continuación de C3B-4 PR #757, issues #749 / #742. Cinco flags anteriores + `ux15-c3b5=1`. Enlace de prueba: `/?ux15-physical-qa=1&ux15-c3b=1&ux15-c3b2=1&ux15-c3b3=1&ux15-c3b4=1&ux15-c3b5=1`.

## Contrato y límites
- Reutilización directa de `combatResonance.ts`, `combatOverdrive.ts`, `combatOverdriveEffects.ts` y `combatOverdrivePresentation.ts`; **ninguna tabla de balance alternativa**. Overdrive activo 8 s, reentrada bloqueada 4 s, daño ORBI multiplicado **1,2×**; control O / botón táctil. Debe estar listo al 100 % de resonancia y no se puede activar si no cumple las condiciones originales.
- Nuevas bajas **efectivamente causadas por proyectiles ORBI** producen eventos de `CombatResonanceDefeatEvent` con afinidad del proyectil y `baseScore:0`. Tanto bajas directas como por splash se registran una vez, con cadena/diversidad del algoritmo original. Los contactos registrados por el índice espacial rompen la cadena y reducen resonancia usando el contrato original; sin usar daño estimado.
- La activación consume el 100 % de resonancia como en `EnergySwarmGame`. Overdrive no bloquea Dash ni introduce invulnerabilidad. Los temporizadores avanzan **solo con reloj simulado** y se congelan con pausa/hidden/modal/upgrade/hitstop.
- **Carga de resonancia (QA)** es un botón explícitamente de depuración: carga el medidor de prueba a 100 y permite revisar la presentación sin esperar muertes; **no simula derrotas, no incrementa cadena, no acredita puntos ni progreso**. Los combates naturales sí cargan el medidor legítimamente dentro del QA.
- Los ORBI conservan 30 unidades, 10 firmas canónicas, proyectiles/drops y origen flotante compartido. `projectCombatOverdriveEffects` solo modifica nuevas balas mientras está activo; las ya disparadas no son recalculadas retroactivamente.
- `projectCombatOverdrivePresentation` dibuja aros alrededor de ENERGY, en sus coordenadas físicas; el mismo rebase asegura que el aura continúe sobre el personaje.

## Política fail-closed
No se modifica `EnergySwarmGame.tsx`, ni los cuatro modos públicos, ni la mecánica original de Resonancia, Overdrive, Convergencia, Dash o estadísticas. No usar en boss/architect/hazards ni en evolución/oleadas no certificadas. Los eventos de QA tienen recompensa de puntuación **cero**; el cálculo de score de la campaña ni se invoca.
Los laboratorios C3A-3/C3B-1/2/3/4 conservan comportamiento salvo activación expresa C3B-5. Para integrarse al juego normal se requieren sistemas de oleadas/bosses, persistencia y balance adicionales.

## Gates
- Tests: no activación con medidor vacío; debug charge no simula kills; activación explícita, consumo y reentrada, 8s/4s, 1.2× daño, diversidad y cadena por afinidades, penalización por contacto, derrota física real, 20+ rebases, determinismo/replay, pausa/reset/fail-closed.
- CI smoke+gameplay+platform, typecheck/build, Android APK y **21 casos Chromium**, incluyendo dos nuevos casos escritorio 1440x900 y móvil táctil 844x390.
- Android hardware #248 sigue sin certificación física.
