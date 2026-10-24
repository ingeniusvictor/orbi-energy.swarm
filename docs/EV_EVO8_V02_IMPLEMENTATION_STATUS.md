# EVO8 v0.2 — ENERGY / FOTON / GAIA: estado real de implementación

**Corte de activación:** 2026-10-23 (verificar GitHub live antes de continuar).  
**Último gameplay/main revisado:** `26475b13b5808c7481b9372dbdf2fdfc0928a181` (#718, última modificación de código).  
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
| EV-F04 — Doctrina pura 10/20/30 con promociones fundadoras E5/E8 | [#702](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/702) | `2759fca1232d32df4f363fab31b27fd33aed03eb` | **Sí, activada por #710** y protegida contra ENERGY por #708 |
| EV-F05 — Panel fotovoltaico verde en FOTON durante detalle cercano Canvas2D | [#704](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/704) | `f938212804ef21cdb703760b22b017ffce9c865a` | **Sí**, insignia provisional |
| EV-F06 — EVO8 runtime: capturas afines, GAIA gradual, 10/20/30, alas 2/4/6 y fundadores protegidos de fusión | [#710](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/710) | `8c2fbb4820c2ec4088ef0e9dc0a334a554eaa1d2` | **Sí**, lógica; arte E8 premium pendiente |

| EV-F09 — Fusiones FOTON/HYDRO canónicas, fundadores excluidos y metadato `fusionRank` | [#718](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/718) | `26475b13b5808c7481b9372dbdf2fdfc0928a181` | **Sí**, 3×FOTON → SOLAR GUARDIAN; 3×HYDRO → HYDRO LEVIATHAN; `energyId` y `fusionRank` separados de combate `level:5` heredado. #713 abierto para seguimiento físico |

## Certificación post-main EV-F09 — 2026-10-23 Chile

- **Código squash:** `26475b13b5808c7481b9372dbdf2fdfc0928a181`; padre `c2c102e2d63ff2b73d37ae062748d7f2936b1caa`; árbol del PR y del commit fusionado coinciden: `f0852fc6feb6a72ac26a8b259ab487c78ebaf7d1`.
- **CI/Android/Chromium/UX01B/UX07/Canvas/Pages post-main:** respectivamente `40056378241`, `40056378251`, `40056378226`, `40056378341`, `40056378389`, `40056378270`, `40056436298`, todos **SUCCESS**.
- **APK debug del commit exacto:** artefacto `12545347009`, 9.414.306 bytes, SHA-256 `3c860ced8380c0a00496790b2b66640573dc16be1621e5c6e03d27162dbc692d`; ZIP de artefacto SHA-256 `e01675354186ed6c8cd75201212966bbd89fddb3ab3abfcbf0bddb07a9c88fc4`.
- **Vercel production READY:** `dpl_BDdznA4XcD65tmRSAHi1j3t7QTMd`, commit `26475b13b5808c7481b9372dbdf2fdfc0928a181`.
- **Límites de evidencia:** QA Canvas es sintético; sin combate sostenido con 30 ORBI E8, sin Android físico, sin certificación manual #248. Mantener #711 y #712 abiertos; #713 sigue abierto para validación longitudinal.
- **No regenerar EVO8 ni modificar PR histórico borrador #687.**

## QA de activación EV-F06

CI del PR #710 sobre `c0e7b41d3a9e343add3583843adc2aee0e95a463`:

- CI `40053695035`: **SUCCESS**.
- Android `40053695007`: **SUCCESS**.
- Chromium UX01 `40053695025`: **SUCCESS**.
- UX07 Overlays `40053695030`: **SUCCESS**.
- Prueba visual Canvas2D `40053695064`: **SUCCESS**, siete capturas sintéticas, incluidas 768×346 DPR2 y orientación vertical.

`main` tras squash #710: `8c2fbb4820c2ec4088ef0e9dc0a334a554eaa1d2`. **Las siete verificaciones post-main SUCCESS:** CI `40053872949`, Android `40053872950`, Chromium `40053872944`, Web UX01B `40053872937`, Android UX07 `40053872923`, EVO8 Canvas sintético `40053872977` y Web Beta `40053945153`. El artefacto Android `12544781278` y el visual `12544273460` están asociados a este SHA exacto. APK debug 9.41 MB, SHA-256 `3c1ce26682640d66ed586cc111bfe1e47ddc97de0bd329123d7562f4c2050334`, ZIP/APK verificable sin corrupción. **Las capturas corresponden a geometrías sintéticas con el renderizador real, NO a encuentros o al dispositivo Android físico**. La prueba humana Android sigue abierta en #248.

## Cambios activos de la migración

1. `EnergySwarmGame.tsx` usa `applyMatchingEnergyCore` para evolucionar al seguidor de afinidad coincidente antes de reclutar duplicados; al agotar plazas no concede XP a una afinidad diferente y al llegar a E8 no aumenta nivel. Se mantiene el primer núcleo como E1 y la progresión triangular de 29 capturas.
2. El runtime usa `evo8SwarmDoctrine`: créditos E5/E8 de fundadores, plazas 10/20/30; ENERGY no cuenta como seguidor, GAIA sí. Los fundadores no pueden ser consumidos por fusiones H12.
3. Cada GAIA nace del primer ciclo de nueve coleccionables; los ciclos adicionales son esencias graduales E2..E8. Nivel E8 absoluto, aunque el contador de ciclos siga aumentando.
4. En Canvas2D se reutilizan las etapas E1/E3/E5/E8 existentes, con alas 2/4/6 E6/E7/E8 y radio visual sólido limitado a ENERGY; colisiones de fusiones no se reescribieron.
5. Campaign, Infinite y Score Attack comparten la misma ruta de adquisición; guardados de estadísticas y archivos de partida históricos quedan sin modificación de esquema. El progreso individual del seguidor continúa siendo **estado de la sesión**, no una nueva promesa de guardado/resume de sesiones interrumpidas.

## EV-F08 — Delta Concéntrica E8 ya fusionada en main

- PR [#715](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/715), squash `1a664839a76449f5186d450e7eb9cffed3bae232`, único padre `ee526090696b62cb0856a5f8f2ef219d43547098`, `tree` `4df45da69990d1ef86954a84e4b591547e715057`.
- Nueva geometría `SCATTERED` conserva su enum, bonificaciones y ciclo de formaciones; posición permanente 3/9/18 en tres perímetros triangulares de radios 35/95/155. Los 30 ORBI E8 tienen distancia nominal mínima de **31.9228758103** unidades entre centros; el máximo radio visual sólido del ala es 14, conservando margen mínimo ≥2. No modifica joystick, RNG, colisiones físicas ni límites de cámara.
- Canvas2D dibuja alas E6/E7/E8 (2/4/6) también para compañeros en LOD medio 13–30, sin añadir un renderizador adicional.
- **CI premerge** #715 SUCCESS: CI `40054905526`, Android `40054905521`, Chromium `40054905516`, prueba Canvas `40054905542`. Artefacto `12544722143`: 12 capturas sintéticas, 5 de Delta-30 en 740×360, 844×390, 915×412, 768×346 DPR2 y vertical 390×844; cero errores del informe JSON. Estas capturas **no son encuentros reales**.
- **Post-main exacto** `1a664839a76449f5186d450e7eb9cffed3bae232`: CI `40055109100` SUCCESS, Android `40055109044` SUCCESS, Chromium `40055109085` SUCCESS, UX01B `40055109123` SUCCESS, Canvas `40055109099` SUCCESS, Web Beta `40055194250` SUCCESS.
- Artefacto Android debug post-main `12544788528`, ZIP íntegro, APK 9.414.210 bytes con manifiesto y DEX, SHA-256 `297f97f1aba36f62b194380313953462a46908d2d5c99c380775c4cab8b87337`. **No es Play release ni certificación física.**
- El Issue [#712](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/712) sigue **abierto** por superposición de *halos*, movimiento real de seguidores junto a límites y evidencia de dispositivo #248. No declarar separación visual perfecta a partir de geometrías nominales.

## Pendientes explícitos, sin declarar finalización artística

- [#711](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/711): crear los **nueve** sprites transparentes E8 premium; la insignia y las alas procedurales actuales son provisionales. El póster compuesto aprobado no sustituye las sprites originales. No confundir la prueba sintética con aceptación de arte AAA.
- [#712](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/712): geometría estática ya corregida en #715 (mínimo 31,92); comprobar halos, dinámicas de formación y bordes en partida y Android real antes de cerrar.
- [#713](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/713): alinear recetas Solar Guardian/Hydro Leviathan, identidad canónica de energía y rango de fusión independiente del nivel E1-E8. La protección de fundadores ya está activa pero no representa migración de recetas.
- [#248](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/248): pruebas físicas Android de tamaños, HUD, control 360°, E8 alas y rendimiento.
- [#694](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/694): pulido retrato/inglés y texto FOTON incrustado en fondos premium; protagonista mostrado como ENERGY sin mezclarlo con la afinidad solar.
- [#709](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/709): **cerrado** tras implementar EVO8 en #710; la QA física se conserva separadamente en #248 y las deudas de fusiones/arte tienen sus Issues #713/#711.

## Política de cambios siguientes

- Nunca escribir directamente a `main`. Usar Issue → rama → PR draft → CI/Android/Chromium/visual → revisión de diff → squash protegido → verificación post-main.
- No cerrar #248 por pruebas simuladas; mantener también independientes #652, #581, #4, #5, #202.
- No deshacer UX05 joystick, UX06/UX09 menús, UX07 overlays, ni alterar balance/combate inadvertidamente.
- El PR documental asociado a [#705](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/705) es exclusivamente documentación.
