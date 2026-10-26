# FERRUM-01 — Segundo mundo jugable · Ciudad Mecánica

**Estado de producto:** beta jugable FERRUM en el mismo `Mundo Nuevo` (World Route), sin LAB y sin reemplazar ASTERIA. ASTERIA es el inicio de travesía por defecto; FERRUM tiene un segundo botón explícito en el menú web y en las dos composiciones Android.

**Identidad:** `FERRUM_MECHANICA`. Paisaje industrial Canvas2D con horizonte de fábricas, grúas, engranajes y carriles cobre. Mismo reloj de ruta y física 1600x960, mismo ENERGY/30 ORBI, cámaras, pausa, mejoras y combate — no declara todavía un nuevo motor físico longitudinal. Escena decorativa no colisionable.

## Enemigos nuevos originales

- **Engranaje Sombra / Shade Gear:** dientes mecánicos ámbar/cobre, desplazamiento curvo, 840 ms de chispas visibles, primera embestida de dirección bloqueada, frenado de 650 ms y segunda embestida de trayectoria fijada, recuperación. Salud 29, radio 14.
- **Soldador M-9 / M-9 Welder:** obrero mecánico de casco/visor con brazo de soldadura. Busca distancia táctica, fija su objetivo y anuncia línea naranja durante 1100 ms, dispara una descarga naranja **como proyectil real del motor original**, recupera. Salud 34, radio 15, bala daño 9, velocidad 3.2.

Se sustituyen apariciones ordinarias dentro del presupuesto de oleadas; Shade Gear desde oleada 1, Welder desde oleada 2; máximo una unidad viva de cada nuevo tipo, con spawn seguro y sin alterar hit points/recompensas legacy, elites, boss y arreglos ORBI. ASTERIA y su Arconte solo aparecen si se selecciona ASTERIA.

## Exclusiones

La Factoría Omega, Capataz Ferrita, Garra de Fundición y Modulador Óxido siguen pendientes. FERRUM usa temporalmente el encuentro de jefe compartido al concluir la campaña; no se presenta como su propio jefe todavía. El objetivo del PR no es afirmar que FERRUM esté completo.

## QA

Pruebas `tests/gameplay/ferrum-live-world.test.ts`: selección, aislamiento, oleadas, fases y daños, dobles señales, pausas de seguridad, callback escritorio/Android, integración engine. Ejecutar CI, Android, UX07, Chromium y EVO8; publicar únicamente con cinco verificaciones en verde y SHA de Vercel exacto.
