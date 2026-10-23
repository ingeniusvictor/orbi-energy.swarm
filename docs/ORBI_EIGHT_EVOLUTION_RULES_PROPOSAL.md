# ORBI ENERGY SWARM — Reglamento de evolución EVO8 (PROPUESTA, pendiente de aprobación)

> Estado: **BORRADOR DE DISEÑO. NO IMPLEMENTADO NI CANONIZADO EN ESTE REPOSITORIO.**
> Issue: [#686](https://github.com/ingeniusvictor/orbi-energy.swarm/issues/686)
> Código auditado en GitHub main: `496348dd84158cbe6edb0fc83f18b3950fc25b1d` (2026-10-23).
> Alcance: 10 energías, 8 formas por energía, progreso por esencia, tamaño visual y compatibilidad del enjambre. No modifica combate en esta fase.

## A. Diagnóstico verificado del código actual

1. `src/game/orbiEnergyCanon.ts` registra exactamente 10 energías: **FOTON** (protagonista permanente), **HYDRO, AERO, TERMO, MAGNE, ATON, KINETRIX, H2NOVA, QUANTUM** (8 coleccionables) y **GAIA** (síntesis única de FOTON y las ocho). Son 10 identidades, **no 10 posibles pickups**.
2. `src/game/EnergySwarmGame.tsx` implementa consolidación de +8 XP por pickup cuando el enjambre alcanza capacidad, pero fija `level=Math.floor(xp/4)+1`, por lo cual cada consolidación sube **dos niveles**; **no existe tope de nivel**. `evolutionStage` solo toma 1–4, usando umbrales de 8, 24 y 60 XP (SPARK, FOTON, GUARDIAN, PRIME). Al no encontrar candidato de la misma afinidad, el sistema aplica XP a otro ORBI: contradice el criterio propuesto de identidad exclusiva. Antes de saturar capacidad, un pickup repetido generalmente recluta otra unidad en vez de sumar progreso a una unidad de referencia.
3. El tamaño sigue `size = 5 + (stage-1)*1.5 + (level-1)*0.15`. Como no hay tope de `level`, el radio crece sin límite. `drawSwarmRoster` emplea `member.size` para cuerpo, halos y distintivos; también aparece en separación física de unidades. **La escala visual no está completamente separada de lógica espacial.** Los seguidores comparten principalmente silueta circular, ojos, anillos y marca de etapa; color/ataque varían por energía. Los pickups silvestres sí incluyen algunas geometrías elementales especiales, pero no ocho formas jugables por energía.
4. `src/game/affinityFusionDirector.ts`: `HYDRO_LEVIATHAN` nace con `size=16` frente a `SOLAR_GUARDIAN` con `size=7`; ambos comienzan `level=5`, `evolutionStage=3`, `xp=0`. Las unidades fusionadas no reciben `energyId` en la salida actual. La unidad azul N5 especialmente grande observada por el usuario es **compatible con** este perfil Hydro, sin que una sola captura certifique la identidad concreta.
5. `src/game/gaiaEvolution.ts` aumenta `gaiaLevel` por cada ciclo completo de ocho energías sin tope, aunque limita sus estadísticas y tamaño y solo usa un máximo de cuatro etapas visuales.
6. `src/game/swarmDoctrine.ts` desbloquea capacidad escalonada **10 → 20 → 30** mediante miembros fundadores a nivel >=5 y promociones >=10; introducir N8 sin rediseñar esta relación bloquearía parte del sistema. También hay un contrato de fusión 3→1 y pruebas que deben preservarse.
7. `src/game/EnergySwarmCanvas.tsx` indica que el cuerpo GLB de **FOTON** ocupa unos **37,5 px lógicos** de diámetro, distinto del lienzo transparente y la corona Dyson. Es referencia visual preliminar; usar medición del cuerpo renderizado y misma escala al aplicar el límite.

## B. Identidad funcional de las diez energías (ya implementada)

| Energía | Fuente | Rol y firma actual | Régimen |
| --- | --- | --- | --- |
| FOTON | Fotovoltaica / solar | Rayo purificador `FOTON_LANCE`, núcleo central | Protagonista permanente, no pickup normal |
| HYDRO | Hidroeléctrica | Pulso de agua `HYDRO_PULSE`, ralentización | Coleccionable |
| AERO | Eólica | Media luna de viento `AERO_CRESCENT`, empuje | Coleccionable |
| TERMO | Térmica | Plasma `TERMO_BURST`, área | Coleccionable |
| MAGNE | Electromagnética | Arco `MAGNE_ARC`, atracción | Coleccionable |
| ATON | Atómica | Partículas `ATON_PARTICLE`, impacto pesado | Coleccionable |
| KINETRIX | Cinética | Lanza `KINETRIX_LANCE`, rapidez y críticos | Coleccionable |
| H2NOVA | Hidrógeno verde | Celda `H2NOVA_CELL`, soporte/escudo | Coleccionable |
| QUANTUM | Cuántica | Fase `QUANTUM_PHASE`, ecos/críticos | Coleccionable |
| GAIA | Síntesis de nueve fuentes | `GAIA_SYNTHESIS`, ataque y soporte | Síntesis única; no pickup normal |

## C. Ley central: ocho evoluciones

- **EVO1 a EVO8 exclusivamente**. No debe existir un EVO9, N9, N10 ni incremento ilimitado de nivel de **una misma unidad ORBI**. Nivel de personaje, rango de doctrina, oleada y mejora táctica son contadores diferentes.
- Seguir el vocabulario del canon de ORBI Life 2.0 como línea visual compartida: **E1 Spark Core (Núcleo Chispa), E2 Energy Orb (Orbe Energético), E3 Proto Orbi, E4 Baby Orbi, E5 Young Orbi, E6 Guardian Orbi, E7 Elite Orbi, E8 Orbi Final**. Estos nombres son **etapas universales**, no cambio de especie/elemento (evita llamar FOTON a un HYDRO de segunda etapa).
- E6: **2 alas elementales**; E7: **4 alas**; E8: **6 alas**. Pueden ser aletas/satélites mínimos en pantalla reducida, respetando siempre contorno y silueta.
- Una evolución debe cambiar un rasgo **de forma**, nunca solo número, halo o aumento de tamaño. Conservar ojos expresivos, núcleo y color de la especie cuando el LOD lo permita. Las ocho etapas de cada especie deben ser distinguibles.
- Los efectos ofensivos y roles siguen siendo los ya certificados; cambios cosméticos no autorizan alterar daño, dificultad o RNG de combate sin PR separado.

### Evolución por esencia de la MISMA energía

1. Primer pickup del tipo registra un ejemplar principal **E1**; si el tipo ya existe, el nuevo núcleo de esa misma energía se transforma en **1 esencia** para ese tipo.
2. El nivel actual `L` exige exactamente **L nuevas esencias de esa misma energía** para pasar a `L+1`. El contador empieza en 0 tras cada ascenso. No hay transferencia entre afinidades. Un pickup HYDRO nunca asciende AERO, ni siquiera con la capacidad llena.
3. A EVO8 el contador se bloquea y más esencias del mismo tipo se convierten en un recurso **separado y acotado** o se descartan con feedback. **Jamás** EVO9 ni crecimiento/bonos ilimitados.
4. El límite de seguidores **no** debe decidir si se recluta un tipo nuevo o si avanza su representante. Debe resolverse una regla de refuerzos/replicas aparte para no anular el diseño de hasta 30 miembros.
5. Estado lógico mínimo por especie o entidad de referencia: `energyId`, `evolutionLevel: 1..8`, `sameEnergyProgress: 0..(level-1)`; para E8 el progreso es 0. `visualStage = evolutionLevel`. No derivar evolución de XP general ni de `shootCooldown`.

| Evolución alcanzada | Esencias adicionales para el salto | Esencias acumuladas desde E1 | Pickups totales de ese tipo, contando el inicial |
| --- | ---: | ---: | ---: |
| E1 | — | 0 | 1 |
| E2 | 1 (E1 → E2) | 1 | 2 |
| E3 | 2 (E2 → E3) | 3 | 4 |
| E4 | 3 (E3 → E4) | 6 | 7 |
| E5 | 4 (E4 → E5) | 10 | 11 |
| E6 | 5 (E5 → E6) | 15 | 16 |
| E7 | 6 (E6 → E7) | 21 | 22 |
| E8 | 7 (E7 → E8) | 28 | 29 |

**Ejemplo obligatorio:** HYDRO E1 + 1 núcleo Hydro → E2 (0/2); dos núcleos Hydro más → E3 (0/3); tres más → E4. Los núcleos AERO no contribuyen. **Costo máximo por tipo: 29 pickups incluidas la primera adquisición.**

## D. Identidad visual específica: 10 energías × 8 fases (dirección de arte propuesta)

Se aplica el patrón geométrico universal E1 chispa, E2 orbe, E3 proto, E4 bebé, E5 joven, E6 dos alas, E7 cuatro, E8 seis. La siguiente tabla define el *motivo elemental diferenciador* que progresa con cada transformación; son instrucciones de diseño, **no assets actualmente existentes**.

| Energía | E1 Spark | E2 Orb | E3 Proto | E4 Baby | E5 Young | E6 Guardian · 2 alas | E7 Elite · 4 alas | E8 Final · 6 alas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **FOTON** | Semilla ámbar | Aro solar | Núcleo fotónico | Rayos cortos | Corona de luz | 2 alas de fotones | 4 alas solares | 6 alas supersolares + corona |
| **HYDRO** | Gota azul | Burbuja líquida | Gota con ojo | Dos ondas | Espiral de agua | 2 aletas de ola | 4 aletas de marea | 6 alas líquidas + tridente de agua |
| **AERO** | Brisa verde agua | Halo de aire | Molinete 3 aspas | Estela espiral | Microciclón | 2 alas de viento | 4 hojas eólicas | 6 alas de tormenta + vórtice |
| **TERMO** | Brasa naranja | Núcleo incandescente | Llama proto | Doble llama | Corona plasmática | 2 alas de fuego | 4 alas de plasma | 6 alas ígneas + sol térmico |
| **MAGNE** | Polo cian | Dipolo | Imán estilizado | 2 líneas de campo | Doble arco magnético | 2 alas polarizadas | 4 alas magnéticas | 6 alas de flujo + anillo bipolar |
| **ATON** | Partícula violeta | Núcleo atómico | Órbita electrónica | 2 órbitas | 3 órbitas cruzadas | 2 alas de partículas | 4 alas nucleares | 6 alas atómicas + núcleo estelar |
| **KINETRIX** | Impulso naranja | Orbe vectorial | Flecha cinética | Doble estela | Rotor de impulso | 2 alas de velocidad | 4 alas vectoriales | 6 alas de momento + trazas |
| **H2NOVA** | Microcelda hielo | Burbuja H₂ | Hexágono celular | 2 celdas enlazadas | Retícula de energía | 2 alas de celda | 4 alas de hidrógeno | 6 alas cristalinas + H₂ |
| **QUANTUM** | Punto rosado | Orbe dual | Cuadro de fase | 2 siluetas desfasadas | Doble anillo cuántico | 2 alas de fase | 4 alas fractales | 6 alas de superposición + eco |
| **GAIA** | Semilla verde | Aura de síntesis | 3 arcos enlazados | 5 motas de energía | Órbita multienergía | 2 alas de síntesis | 4 alas multicolor | 6 alas de nueve energías + corona GAIA |

Criterios de ejecución: las alas pueden dibujarse mediante Canvas2D/procedural sin introducir 80 GLB distintos; FOTON conserva su modelo 3D. Identidad legible por **silueta + símbolo + color**, incluso en escala de grises. No renderizar texto minúsculo permanente sobre el campo: etiqueta `E1...E8` solo en HUD/Codex o contexto visual accesible. Conservar opciones de calidad y LOD.

## E. Regla de tamaño: FOTON siempre mayor

- El **cuerpo visible** de FOTON es referencia, nunca el tamaño transparente del GLB ni los anillos Dyson. Medirlo en píxeles lógicos de canvas después del escalado.
- **Propuesta conservadora:** diámetro máximo de la **silueta visible** de cualquier seguidor, GAIA o fusión (cuerpo + alas + anillos sólidos) `<= 0.75 * diameter(FOTON)`; y techo preliminar de **28 px lógicos** con FOTON de 37,5 px. Glow suave difuso no cuenta como masa, pero nunca debe parecer una esfera rival mayor. Este presupuesto necesita prueba visual real en Android horizontal, escritorio y retrato.
- Objetivos propuestos de diámetro de silueta por E1–E8: **12 / 13 / 15 / 17 / 19 / 22 / 24 / 27 px**. Es **silueta completa**, no radio de cuerpo; usar igual presupuesto por especie para que HYDRO no supere a ATON o GAIA de igual etapa por un valor heredado.
- `HYDRO_LEVIATHAN` actual `size=16` es **radio**, por lo que su cuerpo ocupa ~32px de diámetro, y su anillo llega aún más lejos: violación práctica de la jerarquía deseada. Su diseño necesita reescalarse al presupuesto con independencia del rango de fusión.
- **No reutilizar indiscriminadamente `member.size`** para escala visual: ya participa en separación física. Separar claramente `visualBodyRadius`, `visualSilhouetteRadius` y la magnitud física histórica/hitbox. Ajustar solo lo visual en PR de arte, con prueba de física/seguimiento que garantice no alterar colisiones o movilidad.

## F. Excepciones que conservan identidad y sistema

**FOTON:** No puede reclutarse como acompañante ni ocupa slot. Debe recibir esencias fotónicas **específicas** (un pickup `FOTON_CORE` o recompensa de mando explícita por diseñar) para aplicar la escalera E1–E8; los otros ocho núcleos no lo evolucionan. No contar Solar Overcharge, Overdrive, escudos o mejoras generales como esencia FOTON sin diseño posterior. Mantener GLB de mando y jugabilidad.

**GAIA:** Un único GAIA se despierta al completar la primera colección de los ocho tipos distintos, contando FOTON como fuente permanente; es E1 inicialmente. Cada **nuevo ciclo completo de ocho energías distintas** entrega 1 esencia de síntesis GAIA. E1→E2 exige un ciclo adicional; E2→E3 exige dos ciclos adicionales, y así hasta E8; nunca GAIA N9. Si existe GAIA en espera por capacidad, conservar la síntesis pendiente sin perderla. No permitir reclutar GAIA salvaje ni ocho GAIA separados. Si los ocho pickups surgen cada uno una vez por ciclo, al ciclo 29 las ocho especies y GAIA convergen naturalmente en E8 (techo de 232 pickups coleccionables de ocho tipos). Esta coincidencia es propiedad del esquema triangular y debe validarse según cadencia real de drops.

**Fusiones SOLAR_GUARDIAN / HYDRO_LEVIATHAN:** Son clases de fusión, **no nuevos tipos dentro de las diez energías**. Mantener receta/consumo 3→1 y sin fabricar E5 por un nivel fijo que contradiga el material de entrada. Definir `fusionRank` independiente, derivación acotada desde fuentes y asociación explícita de `energyId` si aplica. Ninguna fusión recibe esencia ajena; ninguna supera el tamaño de FOTON. La receta Solar histórica debe continuar disponible aun si no existe un pickup FOTON estándar; resolver su fuente en el diseño de compatibilidad.

**Doctrina H4 10→20→30:** No se puede conservar el requisito de alcanzar `level >= 10` si todos los ORBI están topados en E8. Migrar el disparador de veterano a E5 y el de élite a E8, pero **revisar también** el número de fundadores y fuentes de nuevos cuerpos, pues ocho tipos coleccionables + una GAIA no generan por sí solos las 10/19 unidades requeridas. Mantener el tope histórico de 30 y sus contratos hasta resolver un mecanismo de refuerzos/clones distinto de esencia evolutiva. No publicar un cambio parcial que deje fases inaccesibles.

**Mejoras tácticas (tres tarjetas), puntos de personaje y oleadas:** no son niveles EVO ni cuentan como pickups iguales, excepto futuros ítems explícitos de esencia. Las opciones de mejora/reroll, escalado de enemigo, RNG, hitbox, firmas de ataque y guardado no se alteran en este PR documental.

## G. Requisitos de implementación y aceptación

1. Crear función pura de progreso `applySameEnergyEssence` y resolver unidad destino determinísticamente. Afirmar `1<=level<=8`; E8 no acepta niveles ni atributos crecientes. Ausencia de tipo compatible jamás transfiere XP a otro elemento.
2. Separar clase/cantidad de cuerpos de afinidad/evolución por especie; arreglar el fallback de consolidación y el caso de fusión sin `energyId`.
3. Introducir `evolutionStage` (8) y `visualStyle(energyId, stage)` con los diez motivos y las alas E6/E7/E8. Preservar ataques actuales, especialmente HYDRO ralentización, MAGNE atracción, H2NOVA escudo y GAIA síntesis.
4. Desacoplar dimensiones de dibujo y dimensión espacial, incluir en test máximo de silueta 0,75× FOTON, casos especiales HYDRO_LEVIATHAN/SOLAR_GUARDIAN/GAIA y pulsos/hit flash.
5. Migrar doctrina N10 y capacidad sin cambiar los topes de 10/20/30; probar con titulares, réplicas, fusiones y bajas. Mantener contador de fusiones/maestría separado de EVO8.
6. Validar GAIA tras 1, 2, 4, 7, 11, 16, 22, 29 ciclos completos y que cada especie tras 1, 2, 4, 7, 11, 16, 22, 29 pickups propios quede E1..E8 respectivamente. Duplicados en un ciclo no falsifican una síntesis; desbordes no suman niveles.
7. Tests de unidad y Playwright: todas las 10×8 siluetas, cambios entre etapas, no regresión del joystick/menú, sin recortes en Android **740×360, 844×390, 915×412, 768×346 DPR2**, desktop **1440×900** y portrait. Imágenes para comparación humana y pruebas físicas Android separadas.
8. Revisar oportunidades de balance: 29 pickups por tipo y 29 ciclos para GAIA E8 pueden ser objetivos de campaña larga/Infinite, **no** garantizarse dentro de una sesión corta; medir cadencia real antes de modificar drops.
9. Preservar formatos de guardado existentes y migrarlos con criterio explícito sin perder progreso de usuario; pruebas de restauración, reset, reanudación y compatibilidad.
10. Implementar más adelante con PRs separados: (i) núcleo puro de progreso + tests, (ii) integración y migración H4/GAIA/fusiones, (iii) visuales y cap de tamaño + pruebas Android. Nada se fusionará de este diseño hasta revisar las decisiones abiertas.

## H. Decisiones a validar antes de pasar de borrador a reglamento obligatorio

- Cómo se obtiene esencia FOTON sin crear un décimo pickup reclutable.
- Fuente de las réplicas/refuerzos que hacen posible 10–30 cuerpos cuando el duplicado de energía pasa a ser esencia.
- Presupuesto visual definitivo del cuerpo 3D de FOTON y formas de fusión (0,75× aquí es propuesta).
- Si se desea progreso evolutivo de una partida o persistencia entre sesiones; especialmente en Campaign vs Infinite.
- Valores de balance no cosméticos por EVO y políticas de excedentes en E8 (no se deben imponer sin pruebas).

**Bloqueo explícito:** el propósito de este borrador es consensuar las reglas **antes** de modificar `src/game/**`, los ataques, el HUD o el APK.
