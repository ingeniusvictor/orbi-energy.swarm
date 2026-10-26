# UX15 — Mundo 01: ASTERIA / Corredor Orbital

> **Actualización creativa — bestiario exclusivo por mundo:** consulta [UX15 — Mundos, enemigos y jefes originales](./UX15_WORLD_EXCLUSIVE_BESTIARY_AND_BOSSES_V1.md). Esta decisión añade **diseños conceptuales** de jefes por mundo para futuras fases. **No** cambia los jefes/oleadas actuales, las restricciones del piloto ni el Blackout Devourer de la campaña.
## Primera vertical slice de travesía horizontal 2.5D — diseño v1.0

**Estado:** arte, narrativa y recorrido propuestos; pendiente de revisión en juego. NO implementado ni prometido como escenario ya jugable.

**Documento padre:** UX15_WORLD_ROUTE_MASTER.md.
**Referencia de atmósfera:** captura lateral 2.5D compartida por el creador: nave/protagonista avanzando horizontalmente sobre un cañón sci-fi, horizonte abierto, mundo lejano, arquitectura futurista y sensación de misión. La identidad final **debe ser ORBI original**, no copiar elementos de Star Fox 64.

## 1. Nombre y papel en el universo

- **Nombre técnico:** ASTERIA_ORBITAL.
- **Título ES:** ASTERIA · CORREDOR ORBITAL.
- **Título EN:** ASTERIA · ORBITAL CORRIDOR.
- **Identidad:** una ruta de transporte orbital que atraviesa el límite entre la exosfera de un planeta rocoso y un inmenso cañón de estructuras industriales suspendidas, con nubes estelares y satélites distantes.
- **Rol narrativo:** primera travesía de ENERGY; el núcleo detecta una señal hostil, entra en el corredor y se familiariza con la amenaza SWARM.
- **Rango piloto:** prueba inicial sobre el comienzo de campaña (sectores 1–2). **No modifica los 10 sectores ni inventa un jefe obligatorio**. Si la versión futura necesita un boss en ASTERIA, se especificará aparte con adaptación real del WaveDirector.
- **Modo inicial:** sandbox/feature flag, sin reemplazar el espacio clásico por defecto hasta validar.

## 2. Experiencia a representar

Imaginemos ENERGY dorado en la parte izquierda-central del campo, desplazándose libremente de arriba abajo y en X mientras el universo se despliega **hacia su derecha**. El jugador ve la trayectoria como un espacio fluido y amplio: al fondo atmósfera azul, rocas monumentales, estrellas y una estación orbital; delante, edificios flotantes y arcadas; en el plano de combate, las unidades Blackout entrando desde los flancos y de frente. Al final de la secuencia se revela una nueva región / portal, sin bloquear la oleada.

**No** convertirlo en juego de aviones, de salto ni de una sola dirección de disparo: los ORBI siguen orbitar, atacando de modo radial y con formaciones tácticas.

## 3. Dirección artística

| Capa | Descripción | Regla de render |
| --- | --- | --- |
| 0 · cielo lejano | estrellas, nube espacial, gran planeta y franja atmosférica | desplazamiento lento, sin hitboxes |
| 1 · horizonte | montañas, cañones rocosos, antenas y estación orbital | perspectiva aparente; saturación/contraste menores |
| 2 · arquitectura | torres, paneles, raíles elevados, puentes y maquinaria | parallax medio, módulos reutilizables |
| 3 · corredor de juego | señalética de piso de energía, marcas de dirección y canales de flujo | ancla de profundidad; no implica suelo/plataformeo |
| 4 · primer plano | piezas de roca flotante, cables y pasarelas cercanas | opacidad/oclusiones restringidas, se atenúa si tapa jugador |
| 5 · VFX clima | polvo orbital tenue, reflejos, ráfagas y luces | presets por calidad, accesibilidad y bajo coste |

**Paleta original:** cian espacial / azul índigo / turquesa de estructura, piedra desaturada y acentos ámbar-dorado. Los enemigos amenazantes conservan sus siluetas y los ORBI mantienen paletas canónicas sin mezclarse con el fondo. El líder ENERGY continúa dorado y reconocible incluso en exteriores diurnos.

**Estilo:** ilustración 2.5D premium con profundidad por capas, no maqueta 3D costosa; usar sprites/atlas y props originales WebP/PNG, degradados, vectores para geometrías y buffers cuando convenga. Ningún elemento de HUD se dibuja dentro del arte de fondo.

## 4. Recorrido piloto (6 tramos)

| Tramo | Identidad | Elemento de reconocimiento | Propósito |
| --- | --- | --- | --- |
| 01 — ARRIVAL_GATE | Puerta a ASTERIA | portal de entrada y planeta al fondo | presentar mundo, entrada cinematográfica breve y saltable |
| 02 — ORBITAL_RAILS | Raíles orbitales | estructuras paralelas azules, satélites rotos | enseñar movimiento libre y recolección, con ruta visual legible |
| 03 — CANYON_SKY | Cañón celeste | grandes paredes rocosas lejanas, cascada de nubes | dar sensación de velocidad, amplios flancos para esquivar |
| 04 — RELAY_SPAN | Puente de relés | antenas, postes y plataformas suspendidas | intensificar enemigos existentes sin deformar spawn/fairness |
| 05 — SIGNAL_BREACH | Brecha Blackout | luminarias averiadas, interferencias y crestas rojas | elevar tensión y anticipar hito, sin prometer jefe nuevo |
| 06 — TRANSIT_VISTA | Mirador de tránsito | perspectiva amplia y anillo/puerta al siguiente sector | transición visual; respetar conclusión oficial de ola/sector |

**Distribución inicial orientativa:** 8% / 17% / 20% / 22% / 20% / 13% de distancia; segmentos reutilizables y extensibles. No se fijan segundos ni scroll speed antes de probar la duración real de las waves 1 y 2.

**Bifurcaciones:** solo *visuales* en el primer piloto (por ejemplo, un carril alto y uno bajo abiertos), sin elegir recompensas diferentes ni abandonar el combate radial. Las rutas divergentes que cambien navegación real pertenecen a UX15-D.

**Jefe:** la arquitectura admite un segmento BOSS_ARENA sin scroll para un encuentro con jefe ya autorizado. ASTERIA piloto termina con una transición/no jefe: el boss actual sigue en sector 10. No presentar ninguna escena como boss fight si no existe en el descriptor.

## 5. Diseño de desplazamiento y legibilidad

- Plano de combate físico X/Y; profundidad simulada por dibujo y parallax. ENERGY flotante sin gravedad ni suelo físico.
- Autoavance ambiental horizontal. ENERGY puede desplazarse en 360 grados con teclado/joystick en una ventana generosa y cambiar de posición a voluntad. Permitir posicionarse hacia frente, atrás, arriba y abajo sin bloqueo duro automático.
- **Posición propuesta a calibrar:** ENERGY visible alrededor de 35–45% del ancho desde el borde izquierdo, con visión extra hacia amenazas frontales; cámara suavizada y zoom existente. Este anclaje NO se aplica rígidamente si pone en riesgo combate, zoom o controles.
- Los combates siguen teniendo amenazas omnidireccionales; no dirigir todos los enemigos a +X porque ello desactiva el sentido de las formaciones y los ataques existentes.
- Las paredes laterales aparentes de cañón son **ambientación no colisionable** durante el primer piloto. La banda física de maniobra debe acomodar círculos/formaciones de alcance ~155 alrededor de ENERGY y el radio sólido de ORBI, además de Dash, sin impedir escape.
- La ruta no puede mostrar un precipicio mortal si salir de ella no tiene consecuencia; usar luz, niebla y profundidad para sugerir zona de combate sin engañar al jugador sobre límites.
- **Cuidado en viewport:** 480 unidades verticales de referencia; las franjas decorativas ocupan bordes sin comprimir peligro/cuerpo efectivo. El encuadre panorámico crece horizontalmente en móvil landscape, no estirar fondo ni collider en X.

## 6. Encuentros e integración de oleadas

| Contexto | Autoridad | Efecto ASTERIA |
| --- | --- | --- |
| Sector 1 — Scout Signal | campaña / descriptor existente | cambios de paisaje, sin alteración de budget, spawn o recompensas |
| Sector 2 — Parasite Drift | campaña / descriptor existente | tensión visual/sonora, no nueva velocidad de enemigos gratuita |
| Enemigos | motor actual | solo *apariciones legales*, fuera de cámara y lejos de ENERGY; futuro adaptador de entrada desde señales del corredor |
| Recursos y ORBI | motor actual | nunca dejar objetos sin recolección por autoavance sin compensación/reglas explícitas |
| FORMATIONS / 30 E8 | sistema existente | no estrechar artificialmente ruta para obligar a cambiar formación |
| Dash / Convergencia | sistema existente | trayectorias lineales y daño mantienen cálculos físicos y restricciones |
| Final de sector | wave completion policy | pausa o portal visual, sin crear una condición extra de victoria |

**Ritmo visual sugerido:** llegar → descubrir → ascender tensión → combate → respirar → salida, pero siempre adaptado a eventos realmente observados del WaveDirector. Una ola más larga no debe forzar un portal anticipado; puede repetirse tramo abierto de modo determinista hasta que la ola termine.

## 7. Paquete mínimo de arte original (antes de codificar Mundo 1)

**Sources maestros en alta calidad:**
- Cielo exosfera/cosmología sin texto, apto parallax/repetición.
- Montañas / cañón remoto con transparencia o planos separados.
- Arquitectura orbital (torres, raíles, módulo relé y señalética).
- 8–12 props combinables y al menos 4 siluetas de roca/estructura reutilizables.
- 3 decoraciones foreground con máscara adaptativa.
- Entrada ASTERIA / portal salida original.
- Tratamiento luminoso/niebla, VFX de baja complejidad y paletas nocturna/suave si conviene.

**Ejecución móvil:** atlas de arte por niveles, compresión, precarga antes de entrar y descarte al salir; LOD por preset; evitar archivos gigantes a pantalla completa y rasterización repetida. Dimensiones y presupuesto exacto definidos tras medir arte real y hardware, no previamente inventados.

**No construir UI como JPG/PNG único con botones simulados.** Rótulos, subtítulos y HUD deben ser React/Canvas nativos localizables, con QA táctil accesible.

## 8. Señales de éxito o fracaso en la vertical slice

**PASS de UX15-C requiere simultáneamente:**
1. El jugador reconoce que pasa por **al menos cuatro escenarios distintos y conectados** en una única travesía; ruta cambia por continuidad, no por reemplazo brusco de wallpaper.
2. La cámara/scroll mantiene movimiento natural sobre el mundo mientras ENERGY conserva libertad X/Y; sin saltos al borde de los 1600×960 del legacy ni teletransportaciones de recursos/enemigos.
3. Las seis formaciones, 30 ORBI, Dash/Convergencia, ataque radial, drops, puntuación y oleadas funcionan sin cambio de reglas.
4. Entradas de enemigos realmente justas, telegraphs visibles, ninguna unidad oculta bajo foreground, no boss ficticio.
5. Cero gaps/tiles expuestos, sin memoria acumulativa al viajar, pausas/rotaciones correctas y parallax cómodo.
6. Capturas y video real de gameplay de tres tramos diferentes (llegada, cañón, puente), más DEV/QAs de panorama, boss legacy en sector 10 y Infinite sin la ruta activa.
7. CI, typecheck, tests deterministas, Chromium y Android APK verdes. Android físico pendiente hasta sesión humana documentada.

**FAIL si:** solo se desplaza un fondo sin segmentos físicos/cámara válida, se reduce el enjambre artificialmente, se cambian oleadas por distancia, se queda ENERGY clavado sin maniobra, los ORBI pisan bordes falsos, un recurso desaparece antes de poder recogerlo o el rendimiento móvil empeora de manera sostenida.

## 9. Más mundos (roadmap creativo, NO aprobados como producción)

ASTЕRIA sirve como **plantilla técnica**, no obliga a construir diez mundos inmediatamente. Un catálogo posterior podría incluir CIUDAD MECÁNICA, NÚCLEO MAGMÁTICO, JARDINES HYDRO, PLANICIE FOTÓNICA, RUINAS GAIA, SANTUARIO CUÁNTICO y RUPTURA BLACKOUT, todos como mundos ORBI originales; otros futuros combinarían rutas y temas en Infinite desde sector 11.

La inclusión/orden/nombre de esos mundos se validará uno por uno: no sustituye hoy los seis biomeType del motor ni impone un nuevo boss a cada mundo.

## 10. Orden exacto de la siguiente fase (cuando se autorice implementación)

1. Contratos puros RouteTheme, RouteSegment, RouteClock y RouteState; datos de ASTERIA mínimos, seed, validación de conexiones, test sector1/2 e Infinite.
2. Prototipo de cámara y desplazamiento con **prueba auténtica de movimiento** y rollback a ARENA_LEGACY; comprobar el límite físico de 1600×960 antes de anunciar “infinito”.
3. Render de 2–3 capas propias y un segmento recto de ASTERIA en DEV.
4. Conectar seis segmentos, caché, segment unload y tests de transición.
5. Integrar spawns y recompensas solo con fairness certificada, documentar screenshots reales y riesgo móvil.
6. PR revisado con CI verde y prueba visual. Después de aprobar sensación de viaje, ampliar a otros mundos.

**Atribución:** visión/dirección creativa Víctor Marcel León Pacheco / ORBI Ecosystem; arquitectura y codiseño ChatGPT/OpenAI.
