# ORBI ENERGY SWARM — Biblia de mundos, enemigos y jefes originales (v1.0)

**Estado:** DIRECCIÓN CREATIVA CANÓNICA — conceptos para producción futura; **no son enemigos, jefes ni mecánicas implementados**.

**Decisión de producto del creador:** cada mundo nuevo tendrá una identidad enemiga propia: **predominarán diseños y tipos originales**, con reutilización selectiva de enemigos existentes únicamente como apoyo narrativo o mezcla táctica. **La prioridad de desarrollo es el modo público MUNDO NUEVO y no ampliar el laboratorio ASTERIA.**

## Principios que gobiernan la línea de contenido

1. **Identidad original:** de cada paquete de seis arquetipos propuestos por mundo — cuatro enemigos normales, un élite y un jefe — **los seis son conceptos nuevos**. Si posteriormente se incluyen CRAWLER, PARASITE, DRONE, SPLITTER, DISRUPTOR u otros enemigos históricos, estos serán apariciones secundarias, no sustitutos de los diseños del mundo. El porcentaje exacto de spawn se calibra posteriormente; no es automáticamente el porcentaje de tipos.
2. **Gameplay primero:** cada enemigo debe comportarse de forma distinta, no ser un cambio de color o estadísticas. Silueta, escala, color, trayectoria, señal de ataque, audio y vulnerabilidad deben ser reconocibles.
3. **Táctica justa:** toda habilidad peligrosa tendrá una señal visible y una respuesta posible usando movimiento X/Y libre, Dash, armas/formaciones ORBI o prioridades de objetivo. Los tiempos y daños se calibran con pruebas reales; los ejemplos aquí no son números de producción.
4. **Ritmo y diversidad:** combinar perseguidor, flanqueador, francotirador, controlador de espacio, apoyo y élite. Evitar que una mezcla de habilidades cierre todos los caminos de fuga. Proyectiles y obstáculos respetan culling, origen flotante, cámara, pausa y reducción de movimiento.
5. **Jefe propio por mundo:** cada mundo propone un jefe de tres fases con dos ataques exclusivos y vulnerabilidad/contramedida reconocible. El **Blackout Devourer del sector 10 sigue intacto** en la campaña existente. Los jefes nuevos solo serán jugables cuando un descriptor y director de encuentros oficialmente integrados lo autoricen; ningún paisaje o tramo puede invocarlos por decoración.
6. **Compatibilidad:** no romper límites de 30 ORBI / 80 enemigos / 120 proyectiles, economía, niveles, recompensas, accesibilidad o modos anteriores. Los nuevos tipos requieren arte original, contratos, colisiones, balance, señalización, rendimiento en móvil, registros ES/EN y QA de campaña/MUNDO NUEVO.
7. **MUNDO NUEVO es la superficie de aceptación:** usar pruebas automáticas para regresiones; usar LAB únicamente para incidentes específicos o experimentos de riesgo acotados. Nada de duplicar efectos que ya funcionan en el juego normal.
8. **Cosmología:** los mundos no equivalen a los seis `BiomeType` existentes ni a los diez sectores de campaña. Un mismo mundo puede tener múltiples oleadas o segmentos; los mundos futuros se agregan de forma versionada y reversible.

## MUNDO 01 — ASTERIA · CORREDOR ORBITAL

**Identidad:** ruinas de transporte en altura, torres orbitales, rieles sobre cañones, cian glacial y oro. **Facción:** Guardia del Corredor. **Juego distintivo:** control de líneas de avance, ataques anunciados desde alturas y plataformas suspendidas. Mapa ya existente de seis segmentos: ARRIVAL_GATE, ORBITAL_RAILS, CANYON_SKY, RELAY_SPAN, SIGNAL_BREACH y TRANSIT_VISTA.

| Arquetipo / nombre ES · EN | Diseño visual | Habilidad distintiva y contrajuego | Presentación aconsejada |
| --- | --- | --- | --- |
| NORMAL · **Cortador de Riel / Railcutter** | Cuerpo de flecha, dos cuchillas laterales cian, esquirlas de riel | Se alinea sobre una banda horizontal marcada y efectúa una embestida muy rápida. ENERGY puede salir de la banda por arriba o abajo | ORBITAL_RAILS, entrada visible desde el borde |
| NORMAL · **Espectro de Altura / Skydive Specter** | Ala semitransparente, núcleo ámbar, estela de vapor | Se sitúa a distinta altura, proyecta una sombra/retícula y desciende en diagonal. Vulnerable después del picado fallido | CANYON_SKY |
| NORMAL · **Prisma de Baliza / Beacon Prism** | Triángulo levitante con tres ojos de guía, blanco/índigo | Marca tres corredores de disparo y libera una ráfaga cruzada secuencial. Hay espacio anunciado entre líneas | RELAY_SPAN |
| NORMAL · **Velero de Iones / Ion Sail** | Dos velas eléctricas azules, fuselaje ultraligero | Cruza el escenario y deja una estela eléctrica **temporal**, sin daño instantáneo al aparecer. La estela desaparece antes de poder bloquear la salida | CANYON_SKY, SIGNAL_BREACH |
| ÉLITE · **Guardián del Puente / Span Warden** | Armadura orbital de cuatro brazos y escudo asimétrico | Alterna guardia frontal y golpes laterales. Núcleo expuesto tras cada ciclo; las formaciones ORBI pueden rodearlo | RELAY_SPAN / SIGNAl_BREACH |
| JEFE · **Arconte del Umbral / Threshold Archon** | Coloso suspendido dentro de dos anillos orbitales, núcleo oro/cian | Fase 1: barridos telescópicos; fase 2: tres balizas que delimitan corredores seguros; fase 3: núcleo expuesto tras sobrecarga de anillos. Ventanas de daño claras | Arena exclusiva de ASTERIA **futura**, si hay descriptor de jefe autorizado |

**Combinaciones emblemáticas:** Cortador + Espectro exige jugar en dos ejes; Prisma + Velero genera rutas de escape que cambian pero nunca las elimina. El élite no aparece al mismo tiempo que un bloqueo de tres líneas sin un corredor libre.

**Nota de continuidad:** se pueden conservar enemigos actuales en la fase inicial de ASTERIA mientras se incorporan los nuevos tipos. No reinterpretar las oleadas 1/2 ya existentes como si hubieran sido reemplazadas.

## MUNDO 02 — FERRUM · CIUDAD MECÁNICA

**Identidad:** metrópolis de engranajes, grúas y fábricas móviles; cobre y acero incandescente. **Facción:** Consorcio Ferrita. **Juego distintivo:** maquinaria que se coordina y cambia de formación.

| Tipo / nombre | Diseño visual | Habilidad y respuesta |
| --- | --- | --- |
| NORMAL · **Engranaje Sombra / Shade Gear** | Rueda segmentada con dientes plegables | Rueda por trayectorias curvas y frena antes de una segunda embestida; se anticipa por chispas en su eje |
| NORMAL · **Soldador M-9 / M-9 Welder** | Obrero autómata delgado, brazo de arco naranja | Proyecta una línea de soldadura que se enciende tras aviso, no inmediatamente; flanquear rompe su alineación |
| NORMAL · **Garra de Fundición / Foundry Claw** | Pinza flotante doble, cadenas telescópicas | Señala un anclaje e intenta tirar de ENERGY; nunca desactiva controles, la línea se puede cortar o esquivar |
| NORMAL · **Modulador Óxido / Oxide Modulator** | Caja industrial hexagonal con antenas | Concede armadura temporal a aliados visibles conectados por cables; derrotar al modulador rompe el enlace |
| ÉLITE · **Capataz Ferrita / Ferrite Foreman** | Exoesqueleto imponente con martillo neumático | Coordina dos tipos de maquinaria y lanza golpes de choque por sectores; breve exposición del reactor al finalizar |
| JEFE · **Factoría Omega / Omega Foundry** | Fábrica caminante con chimeneas y múltiples líneas de ensamblaje | Fase 1: brazos extensibles; fase 2: producción de pequeños engranajes con límite estricto; fase 3: reactor superior vulnerable entre barridos de cinta |

## MUNDO 03 — PYRA · NÚCLEO MAGMÁTICO

**Identidad:** cavidades volcánicas de gravedad variable, obsidiana y magma luminoso. **Facción:** Legión de Escoria. **Juego distintivo:** suelo atmosférico caliente, zonas de presión temporal y sobrecalentamiento evitable.

| Tipo / nombre | Diseño visual | Habilidad y respuesta |
| --- | --- | --- |
| NORMAL · **Brasero Móvil / Ember Skater** | Disco de piedra fundida y núcleo rojo | Deja parches cálidos anunciados que se disipan rápidamente; desplazarse evita el sobrecalentamiento |
| NORMAL · **Lanzaescoria / Slag Spear** | Aguja de obsidiana con lanzador térmico | Dispara una lanza lenta que se fragmenta tras recorrer cierta distancia; disparar a la lanza o cambiar de altura |
| NORMAL · **Draga de Lava / Lava Dredger** | Vehículo blindado con mandíbula de roca | Carga lentamente y arrastra una cortina térmica detrás; gran ventana de daño en el costado |
| NORMAL · **Cinerita / Cinderling** | Escarabajo mineral brillante, caparazón poroso | Se divide una sola vez en esquirlas pequeñas con tope de enemigos; señal de fractura visible |
| ÉLITE · **Serafín de Caldera / Caldera Seraph** | Manta mecánica de magma con seis alas | Hace circular tres meteoros siguiendo trayectorias marcadas; su núcleo se enfría tras una descarga |
| JEFE · **Solfernax / Solfernax** | Reactor vivo dentro de un anillo de magma | Fase 1: respiraderos direccionales; fase 2: compuertas térmicas alternadas; fase 3: colapso controlado con núcleo expuesto, sin pantalla completamente bloqueada |

## MUNDO 04 — NEREA · JARDINES HYDRO

**Identidad:** biotecnología acuática suspendida, coral sintético y jardines submarinos en gravedad reducida. **Facción:** Marea Sintiente. **Juego distintivo:** corrientes lentas, conductividad y enemigos de apoyo; sin inmovilizaciones inevitables.

| Tipo / nombre | Diseño visual | Habilidad y respuesta |
| --- | --- | --- |
| NORMAL · **Medusa Conductora / Volt Jelly** | Campana translúcida y tentáculos cian | Electrocuta en arco a un aliado cercano avisado por un filamento de luz; separar objetivos corta el arco |
| NORMAL · **Liquen Emboscador / Lichen Stalker** | Flor mecánica, hojas transparentes | Camuflaje imperfecto: florece y se ilumina antes de atacar; no puede ser completamente invisible al jugador |
| NORMAL · **Aguja Osmótica / Osmotic Needle** | Pez aguja de cristal azul | Proyectil que reduce brevemente velocidad si impacta; el efecto no se acumula infinitamente ni inutiliza Dash |
| NORMAL · **Coral Prisma / Prism Coral** | Colonia poligonal flotante, ramas tornasoladas | Protege de manera direccional a otro enemigo mediante una membrana; el enlace se rompe al golpear el nodo |
| ÉLITE · **Madre Estuario / Estuary Matron** | Pulpo botánico blindado con antenas de coral | Invoca corrientes de desplazamiento **visualmente predecibles**, con zonas de baja presión para refugiarse |
| JEFE · **Leviatán Pelágico / Pelagic Leviathan** | Serpiente biomecánica gigantesca con aletas fotovoltaicas | Fase 1: ondas circulares con brechas; fase 2: múltiples núcleos visibles; fase 3: descarga bioluminiscente con puntos débiles en aletas |

## MUNDO 05 — HELION · PLANICIE FOTÓNICA

**Identidad:** desierto de espejos y torres solares, blanco cálido, oro y lila. **Facción:** Orden de la Corona. **Juego distintivo:** luz refractada, reflejos legibles y cambio de prioridades.

| Tipo / nombre | Diseño visual | Habilidad y respuesta |
| --- | --- | --- |
| NORMAL · **Refractor Solar / Solar Refractor** | Pirámide de vidrio rotatoria | Rebota un disparo a un ángulo visible antes del lanzamiento; sin ricochets ilimitados |
| NORMAL · **Disco Meridiano / Meridian Disc** | Disco orbital rodeado de marcadores horarios | Despliega una espiral lenta con intervalo fijo; los huecos permanecen abiertos |
| NORMAL · **Mosca Halo / Halo Wisp** | Mini-dron con alas anulares luminosas | Cambia bruscamente de plano en un destello de preparación; muy frágil, no se teletransporta encima de ENERGY |
| NORMAL · **Espejo Nómada / Nomad Mirror** | Prisma con cuatro facetas asimétricas | Crea un duplicado visual que no hace daño ni cuenta como enemigo, revelado al recibir un impacto |
| ÉLITE · **Custodio Corona / Corona Keeper** | Caballero fotónico con lanza circular | Alterna lanza axial y escudo espejado; el ángulo de rebote se dibuja antes de activarse |
| JEFE · **Helioforja / Helioforge** | Sol artificial encajado en una estructura astronómica | Fase 1: haces rotatorios; fase 2: espejos móviles destruibles; fase 3: anillo incompleto de luz y ventanas seguras |

## MUNDO 06 — GAIA · RUINAS VIVIENTES

**Identidad:** naturaleza ancestral fusionada con circuitos, raíces minerales y templos flotantes. **Facción:** Custodios del Sustrato. **Juego distintivo:** crecimiento orgánico y defensas naturales que el jugador puede desmontar.

| Tipo / nombre | Diseño visual | Habilidad y respuesta |
| --- | --- | --- |
| NORMAL · **Guardián Tectónico / Tectonic Keeper** | Golem de roca y filamentos verdes | Prepara un golpe y emite una onda rectilínea que se evita cruzando perpendicularmente |
| NORMAL · **Espora Ferrita / Ferrite Spore** | Semilla magnética con pétalos metálicos | Libera pequeños satélites temporales con presupuesto global; la cápsula nodriza es frágil |
| NORMAL · **Custodio Raíz / Root Binder** | Raíces mecánicas articuladas | Crea una barrera local de corta duración, siempre con rutas abiertas arriba o abajo |
| NORMAL · **Fósil Vivo / Living Fossil** | Insecto mineral articulado, capas de sedimento | Abandona una cubierta blindada al recibir daño; su segundo estado es más rápido pero más vulnerable |
| ÉLITE · **Patriarca Lítico / Lithic Patriarch** | Árbol de piedra ambulante con múltiples ojos | Abre corredores de raíces y genera pulsos concéntricos marcados; núcleo detrás de placas rompibles |
| JEFE · **Coloso Raíz / Root Colossus** | Titán de bosque petrificado y circuitos antiguos | Fase 1: brazos que brotan de laterales; fase 2: nódulos rompibles; fase 3: corazón vegetal vulnerable y ondas espaciadas |

## MUNDO 07 — QUANTA · SANTUARIO CUÁNTICO

**Identidad:** geometría imposible, plataformas holográficas, azules profundos y púrpura. **Facción:** Custodia de las Probabilidades. **Juego distintivo:** desfases cortos y ecos claramente diferenciados; no se ralentiza el reloj global.

| Tipo / nombre | Diseño visual | Habilidad y respuesta |
| --- | --- | --- |
| NORMAL · **Eco Fractal / Fractal Echo** | Prisma múltiple con contorno doble | Repite una acción anterior como eco proyectado; el eco indica que es inofensivo antes de activarse |
| NORMAL · **Desfase Lambda / Lambda Phaser** | Silueta de dos estados, azul/púrpura | Cruza una zona intangible durante un instante anunciado; no dispara mientras es invulnerable |
| NORMAL · **Ancla Temporal / Temporal Anchor** | Reloj angular suspendido | Campo local que reduce la velocidad de proyectiles y enemigos, sin alterar física ni controles globales de ENERGY |
| NORMAL · **Deslizador Möbius / Mobius Glider** | Banda infinita luminosa | Intercambia posición con una señal fantasma colocada antes; el punto de salida nunca coincide con ENERGY |
| ÉLITE · **Curador Probabilístico / Probability Curator** | Figura geométrica con capas de hologramas | Alterna dos patrones previstos mediante indicadores color/cantidad, no decisiones aleatorias sin señal |
| JEFE · **Oráculo de Umbral / Threshold Oracle** | Núcleo suspendido entre geometrías cuadridimensionales estilizadas | Fase 1: trazas de futuros posibles; fase 2: dos posiciones anticipadas, una real; fase 3: ruptura de simetría y exposición del centro |

## MUNDO 08 — UMBRA · RUPTURA BLACKOUT

**Identidad:** borde del vacío, fragmentos de mundos anteriores, grietas negras con relámpagos coral. **Facción:** Corte del Eclipse. **Juego distintivo:** ataques que mezclan elementos aprendidos de otros mundos, con señales claras y dificultad avanzada.

| Tipo / nombre | Diseño visual | Habilidad y respuesta |
| --- | --- | --- |
| NORMAL · **Heraldo Umbra / Umbra Herald** | Capa fragmentada alrededor de núcleo rojo | Dash oblicuo tras un destello, después queda vulnerable; no puede saltar sin aviso |
| NORMAL · **Filamento Vacío / Void Filament** | Araña de haces entre satélites negros | Traza un segmento entre dos nodos; destruir uno o atravesar la abertura evita la descarga |
| NORMAL · **Inversor de Pulso / Pulse Inverter** | Anillo negro invertido, líneas magenta | Envía una onda que debilita temporalmente escudos, sin vaciar el recurso de golpe ni suprimir armas |
| NORMAL · **Centinela Eclipsado / Eclipsed Sentinel** | Prisma oscuro con corona luminosa | Proyecta sombra geométrica en un carril, pero contornos del jugador y balas permanecen visibles |
| ÉLITE · **Ejecutor Nulo / Null Executor** | Armadura tallada en obsidiana, espada de luz partida | Combina ataque circular advertido y dos marcas de corte; tras ejecutar su secuencia se abre una ventana de contraataque |
| JEFE · **Corazón de la Ruptura / Rift Heart** | Núcleo gigantesco rodeado por restos de portales destruidos | Fase 1: fisuras direccionales; fase 2: invocación limitada de variantes de mundos previos; fase 3: anillo fracturado que deja puntos débiles alternos. **No reemplaza Blackout Devourer**, su lugar narrativo y runtime deberán decidirse por separado |

## Política de reutilización y diversidad

- **Permitido:** unidades clásicas como refuerzo o cameo, miniboss histórico en una modalidad apropiada, cambios de dificultad, afinidades ORBI y mecanismos globales (dash, shields, ORBI control, telegraphs).
- **No permitido:** reciclar un jefe con otro nombre y colores; usar el mismo ataque principal para todos; presentar un enemigo antiguo como diseño exclusivo sin habilidades nuevas.
- **Meta editorial:** por identidad visual, cada mundo tiene **5 arquetipos de campo exclusivos** (4 normales + 1 élite), más 1 jefe conceptual. Ocho mundos = **40 arquetipos de campo y 8 jefes**, todos nuevos. No equivale a 48 clases implementadas ni 48 modelos terminados.
- Las mezclas de spawn podrán reutilizar tipos anteriores cuando tengan sentido, pero las oleadas distintivas priorizarán la facción propia. El **ratio objetivo** debe validarse según juego real y rendimiento, no fijarse como requisito arbitrario antes de prototipar.

## Entrega de contenido: sustituir duplicación LAB por implementación en MUNDO NUEVO

| Etapa | Lugar de integración real | Entregable de producto | Bloqueo |
| --- | --- | --- | --- |
| WBE-01 | MUNDO NUEVO / ASTERIA, recorrido ya jugable | Primer enemigo original Cortador de Riel + su telegraph, IA, colisión, impacto, recompensas reales y comportamiento correcto con los ORBI | Sin cambiar lógica general de otra modalidad |
| WBE-02 | MUNDO NUEVO / ASTERIA | Espectro de Altura + mezcla equilibrada con CRAWLER/PARASITE/DRONE clásicos | La mezcla deja ruta de evasión y tiene presupuesto |
| WBE-03 | MUNDO NUEVO / ASTERIA | Prisma de Baliza, Velero de Iones y élite Guardián del Puente; animaciones y señales únicas | 30 ORBI / 80 enemigos / 120 proyectiles, móvil fluido |
| WBE-04 | Solo cuando el contrato de jefe esté autorizado | Arconte del Umbral con arena y tres fases reales, sin pisar Blackout Devourer ni sector 10 | Director de encuentros, save, premios, fairness, escalado y pruebas de jefe |
| WBE-05 | Mundo futuro seleccionado, uno por vez | Dirección de arte → dos enemigos distintivos → facción → élite → jefe | No iniciar ocho mundos a la vez |

Cada PR debe incluir: nombre ES/EN, silueta/animación originales, `EnemyType` (o tipo versionado) con validaciones de serialización, comportamiento en tick real, proyección de ataque, impacto, salud, drops, interacción con ORBI/Resonancia, culling y rebase; tests de escritorio/móvil, rendimiento y revisión de gameplay **en Mundo Nuevo**, no solo en el LAB.

**Siguiente acción prioritaria:** iniciar **WBE-01** con el **Cortador de Riel** directamente en la experiencia de Mundo Nuevo publicada, después de inspeccionar qué parte del director de combate está realmente conectado allí. No crear un nuevo laboratorio paralelo para justificar su incorporación.

## Notas de compatibilidad documental

Este documento **amplía prospectivamente** la biblia UX15 original, que antes evitaba jefes nuevos durante el piloto. La restricción del piloto inicial permanece válida como regla de protección de producción; la **nueva decisión de contenido** autoriza diseñar jefes únicos para mundos futuros pero **no autoriza spawnearlos ni reemplazar al jefe de campaña sin una implementación/decisión de runtime separada**.

**Fuente técnica del universo actual:** `src/game/types.ts`, `src/game/worldRouteCore.ts`, `docs/UX15_WORLD_ROUTE_MASTER.md`, `docs/UX15_WORLD01_ASTERIA_ORBITAL.md`. Esta biblia es autoría nueva y no importa personajes ni activos protegidos de otras franquicias.
