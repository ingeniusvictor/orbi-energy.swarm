# EVO8 v0.2 — ENERGY / FOTON / GAIA: estado real de implementación

**Corte de activación:** 2026-10-23 (verificar GitHub live antes de continuar).  
**Último gameplay/main revisado:** `8c2fbb4820c2ec4088ef0e9dc0a334a554eaa1d2`.  
**Autoridad:** código y verificaciones GitHub; esta página no reemplaza el árbol o los checks reales.

## Canon definitivo aprobado por el usuario

- **ENERGY** es el protagonista central neutral, permanente; no corresponde a ninguna afinidad energética coleccionable.
- **FOTON** es el **ORBI fotovoltaico verde coleccionable**, emblema de panel solar; conservar su nombre para no alterar el canon.
- Los **nueve coleccionables** son FOTON, HYDRO, AERO, TERMO, MAGNE, ATON, KINETRIX, H2NOVA y QUANTUM.
- **GAIA** representa la síntesis de las nueve energías anteriores; no se obtiene de la bolsa habitual. Se conserva una sola GAIA principal.
- El nombre técnico `OrbiType.FOTON` y otros símbolos históricos del renderizado del protagonista pueden permanecer internamente hasta una migración explícita; no deben usarse para justificar que ENERGY sea energía solar.

## EVO8 v0.2 — reglas de evolución

- **Máximo E8 absoluto:** ningún ORBI ni GAIA puede pasar a E9. La ruta de adquisición del runtime SÍ aplica este máximo desde #710.
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
| EV-F02 — Núcleo puro EVO8 de 8 niveles, 29 adquisiciones y cuatro siluetas | [#698](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/698) | `a1f93a8ed91a4a767dd52c7071d04c0326c96f5d` | **API activada en runtime por #710** |
| EV-F03 — ENERGY neutral, FOTON fotovoltaico y GAIA de 9 afinidades | [#700](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/700) | `b2c258d973cd768b003bdb5673cc81717b1edacb` | **Sí**, canon, reclutamiento, GAIA y etiquetas |
| EV-F04 — Doctrina pura 10/20/30 con promociones fundadoras E5/E8 | [#702](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/702) | `2759fca1232d32df4f363fab31b27fd33aed03eb` | **No**, API preparada |
| EV-F05 — Panel fotovoltaico verde en FOTON durante detalle cercano Canvas2D | [#704](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/704) | `f938212804ef21cdb703760b22b017ffce9c865a` | **Sí**, insignia provisional |
| EV-F06 — EVO8 runtime: capturas afines, GAIA gradual, 10/20/30, alas 2/4/6 y fundadores protegidos de fusión | [#710](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/710) | `8c2fbb4820c2ec4088ef0e9dc0a334a554eaa1d2` | **Sí**, lógica; arte E8 premium pendiente |

## QA de activación EV-F06

CI del PR #710 sobre `c0e7b41d3a9e343add3583843adc2aee0e95a463`:

- CI `40053695035`: **SUCCESS**.
- Android `40053695007`: **SUCCESS**.
- Chromium UX01 `40053695025`: **SUCCESS**.
- UX07 Overlays `40053695030`: **SUCCESS**.
- Prueba visual Canvas2D `40053695064`: **SUCCESS**, siete capturas sintéticas, incluidas 768×346 DPR2 y orientación vertical.

`main` tras squash #710: `8c2fbb4820c2ec4088ef0e9dc0a334a554eaa1d2`. Verificar CI y Android post-main de este SHA antes de llamar estable a la APK. **Las capturas corresponden a geometrías sintéticas con el renderizador real, NO a encuentros o al dispositivo Android físico**. La prueba humana Android sigue abierta en #248.

## Cambios activos de la migración

1. `EnergySwarmGame.tsx` usa `applyMatchingEnergyCore` para evolucionar al seguidor de afinidad coincidente antes de reclutar duplicados; al agotar plazas no concede XP a una afinidad diferente y al llegar a E8 no aumenta nivel. Se mantiene el primer núcleo como E1 y la progresión triangular de 29 capturas.
2. El runtime usa `evo8SwarmDoctrine`: créditos E5/E8 de fundadores, plazas 10/20/30; ENERGY no cuenta como seguidor, GAIA sí. Los fundadores no pueden ser consumidos por fusiones H12.
3. Cada GAIA nace del primer ciclo de nueve coleccionables; los ciclos adicionales son esencias graduales E2..E8. Nivel E8 absoluto, aunque el contador de ciclos siga aumentando.
4. En Canvas2D se reutilizan las etapas E1/E3/E5/E8 existentes, con alas 2/4/6 E6/E7/E8 y radio visual sólido limitado a ENERGY; colisiones de fusiones no se reescribieron.
5. Campaign, Infinite y Score Attack comparten la misma ruta de adquisición; guardados de estadísticas y archivos de partida históricos quedan sin modificación de esquema. El progreso individual del seguidor continúa siendo **estado de la sesión**, no una nueva promesa de guardado/resume de sesiones interrumpidas.

## Pendientes explícitos, sin declarar finalización artística

- [#711](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/711): crear los **nueve** sprites transparentes E8 premium; la insignia y las alas procedurales actuales son provisionales. El póster compuesto aprobado no sustituye las sprites originales. No confundir la prueba sintética con aceptación de arte AAA.
- [#712](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/712): comprobar separación de alas y cuerpos E8 en Delta Concéntrica con 30 seguidores; la distancia nominal mínima puede ser ~21 unidades frente al diámetro sólido teórico ~28.
- [#713](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/713): alinear recetas Solar Guardian/Hydro Leviathan, identidad canónica de energía y rango de fusión independiente del nivel E1-E8. La protección de fundadores ya está activa pero no representa migración de recetas.
- [#248](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/248): pruebas físicas Android de tamaños, HUD, control 360°, E8 alas y rendimiento.
- [#694](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/694): pulido retrato/inglés y texto FOTON incrustado en fondos premium; protagonista mostrado como ENERGY sin mezclarlo con la afinidad solar.
- [#709](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/709): mantener abierto hasta consolidar evidencia final de jugabilidad y asegurar que no hay defectos de síntesis/fusiones/guardados en dispositivo.

## Política de cambios siguientes

- Nunca escribir directamente a `main`. Usar Issue → rama → PR draft → CI/Android/Chromium/visual → revisión de diff → squash protegido → verificación post-main.
- No cerrar #248 por pruebas simuladas; mantener también independientes #652, #581, #4, #5, #202.
- No deshacer UX05 joystick, UX06/UX09 menús, UX07 overlays, ni alterar balance/combate inadvertidamente.
- El PR documental asociado a [#705](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/705) es exclusivamente documentación.
