# EVO8 v0.2 — ENERGY / FOTON / GAIA: estado real de implementación

**Corte:** 2026-10-23 (transferencia; verificar GitHub live antes de cualquier continuación).  
**Último gameplay/main revisado:** `f938212804ef21cdb703760b22b017ffce9c865a`.  
**Autoridad:** código y verificaciones GitHub; esta página no reemplaza el árbol o los checks reales.

## Canon definitivo aprobado por el usuario

- **ENERGY** es el protagonista central neutral, permanente; no corresponde a ninguna afinidad energética coleccionable.
- **FOTON** es el **ORBI fotovoltaico verde coleccionable**, emblema de panel solar; conservar su nombre para no alterar el canon.
- Los **nueve coleccionables** son FOTON, HYDRO, AERO, TERMO, MAGNE, ATON, KINETRIX, H2NOVA y QUANTUM.
- **GAIA** representa la síntesis de las nueve energías anteriores; no se obtiene de la bolsa habitual. Se conserva una sola GAIA principal.
- El nombre técnico `OrbiType.FOTON` y otros símbolos históricos del renderizado del protagonista pueden permanecer internamente hasta una migración explícita; no deben usarse para justificar que ENERGY sea energía solar.

## EVO8 v0.2 — reglas de evolución

- **Máximo E8 absoluto:** ningún ORBI ni GAIA puede pasar a E9. Los niveles actuales de runtime todavía NO están sujetos a esta norma.
- Una primera adquisición del mismo tipo funda E1. E2 requiere 1 núcleo adicional; E3 requiere otros 2; E4 otros 3; E5 otros 4; E6 otros 5; E7 otros 6; E8 otros 7: **29 adquisiciones totales, incluida la primera**.
- Los núcleos de una afinidad jamás aumentan la evolución de otra.
- **Cuatro siluetas completas** solamente en **E1/E3/E5/E8**; E2/E4 mantienen su silueta anterior; E6 y E7 añaden respectivamente **2 y 4 alas** a la tercera silueta; E8 tiene **6 alas** y recurso artístico definitivo.
- Se necesitan **nueve recursos E8 premium** (uno por afinidad coleccionable); GAIA E8 puede construirse proceduralmente si la calidad visual es suficiente; ENERGY conserva su protagonista metálico neutro.
- Ninguna silueta sólida de seguidor, incluyendo GAIA y fusiones, podrá superar **75% del diámetro visible de ENERGY**. **Todavía NO certificado** contra sprites reales en Android.
- Las fusiones (HYDRO LEVIATHAN, SOLAR GUARDIAN) conservan su clase/rol independiente del nivel evolutivo.

## Cambios ya fusionados (NO volver a implementarlos)

| Fase | PR | Commit squash | Integrado a gameplay |
| --- | --- | --- | --- |
| EV-F01 — Formación 2 abierta, 5 X separada, 6 Delta Concéntrica; IDs serializados y stats preservados | [#696](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/696) | `f93472de745695b23562ba023192763b646874cb` | **Sí** (geometrías / i18n, no sprites EVO8) |
| EV-F02 — Núcleo puro EVO8 de 8 niveles, 29 adquisiciones y cuatro siluetas | [#698](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/698) | `a1f93a8ed91a4a767dd52c7071d04c0326c96f5d` | **No**, API preparada |
| EV-F03 — ENERGY neutral, FOTON fotovoltaico y GAIA de 9 afinidades | [#700](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/700) | `b2c258d973cd768b003bdb5673cc81717b1edacb` | **Sí**, canon, reclutamiento, GAIA y etiquetas |
| EV-F04 — Doctrina pura 10/20/30 con promociones fundadoras E5/E8 | [#702](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/702) | `2759fca1232d32df4f363fab31b27fd33aed03eb` | **No**, API preparada |
| EV-F05 — Panel fotovoltaico verde en FOTON durante detalle cercano Canvas2D | [#704](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/704) | `f938212804ef21cdb703760b22b017ffce9c865a` | **Sí**, insignia provisional |

## QA en último main

GitHub Actions para `f938212804ef21cdb703760b22b017ffce9c865a`:
- CI `40051335413`: SUCCESS.
- Android `40051335422`: SUCCESS.
- Chromium UX01 `40051335476`: SUCCESS.
- Web UX01B `40051335425`: SUCCESS.
- Web Beta/Pages `40051396212`: SUCCESS.

Los checks son automáticos. **La validación física Android no se realizó en esta intervención y permanece pendiente en #248**. Un build compilado no constituye prueba de tamaño/legibilidad de los sprites E8.

## Fronteras técnicas pendientes

1. **Migración atómica del runtime EVO8:** conectar `orbiEvolution.ts` a cada adquisición por afinidad; reemplazar XP ilimitado; serialización y reglas de consolidación. Proteger el motor de disparos, el joystick 360°, Campaign/Infinite/Score Attack, RNG y persistencia.
2. **Migración atómica de capacidad:** sustituir la doctrina histórica que aún exige E10 por el contrato E5/E8 de `evo8SwarmDoctrine.ts`; sin hacerlo, se bloquean las plazas 21–30. Manejar fundador/GAIA/fusiones y compatibilidad de guardados.
3. **GAIA EVO8:** GAIA ya exige las nueve fuentes, pero su `gaiaLevel` crece por ciclos sin la nueva progresión triangular/tope E8; requiere adaptación explícita y tests.
4. **Recursos visuales finales:** los nueve assets premium E8 todavía no existen como sprites transparentes individuales listos para el renderer. El arte del póster **no** equivale automáticamente a sprites. Implementar alas E6=2, E7=4, E8=6, límites relativos a ENERGY, lod y QA visual comparativo.
5. **Imagen de portada:** algunos fondos premium poseen texto **FOTON** incrustado en píxeles. Las etiquetas DOM pueden decir ENERGY, pero el arte no se reescribe por ello. Corregir assets de forma independiente, cuidando el estilo premium aprobado.
6. **Geométrica Android:** las posiciones matemáticas pasan pruebas; faltan tests visuales de silueta y separaciones reales con 30 ORBI/alas, límites del mapa y orientación.
7. **Doctrina triangular GAIA:** decidir el cómputo exacto de esencias/ciclos tras nueve fuentes sin que evoluciones E8 se salten requisitos ni se acabe bloqueando progreso.

## Política de cambios siguientes

- Nunca escribir directamente a `main`. Usar Issue → rama → PR draft → CI/Android/Chromium/visual → revisión de diff → squash protegido → verificación post-main.
- No cerrar #248 por pruebas simuladas; mantener también independientes #652, #581, #4, #5, #202.
- No deshacer UX05 joystick, UX06/UX09 menús, UX07 overlays, ni alterar balance/combate inadvertidamente.
- El PR documental asociado a [#705](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/705) es exclusivamente documentación.
