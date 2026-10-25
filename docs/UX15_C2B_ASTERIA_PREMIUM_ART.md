# UX15-C2B — ASTERIA premium: panoramas originales en Travesía de Mundos

Estado: integración visual de cuatro imágenes originales aprobadas por el creador; no cambia física ni reglas de combate.

## Escenarios y assets

| Segmento | Asset WebP |
|---|---|
| ARRIVAL_GATE | asteria-arrival.webp |
| ORBITAL_RAILS | asteria-orbital.webp |
| CANYON_SKY | asteria-orbital.webp |
| RELAY_SPAN | asteria-relay.webp |
| SIGNAL_BREACH | asteria-breach.webp |
| TRANSIT_VISTA | asteria-arrival.webp |

Los cuatro WebP originales optimizados son de 1440×480, ~544 KiB combinados. Se reutilizan en seis tramos: no se inventan dos imágenes adicionales.
Se encuentran en public/assets/worlds/asteria; los maestros PNG de alta calidad se conservaron fuera del bundle web.

## Comportamiento y límites

- AsteriaPremiumRenderer dibuja en Canvas2D las panorámicas detrás del ENERGY GLB real, ORBI, enemigos, proyectiles, recompensas y HUD existentes.
- El juego únicamente precarga imágenes cuando se elige TRAVESÍA DE MUNDOS; CAMPAÑA tradicional, SCORE ATTACK e INFINITE no las descargan.
- Escala uniforme y panorámica recortada en pantallas estrechas; no distorsionar objetos.
- Desplazamiento y transición por distancia de simulación; crossfade antes de pasar al siguiente segmento. En pausa y evoluciones no avanza.
- Si una imagen aún no carga o falla, permanece el fondo geométrico verificado de UX15-B. No depender de red para que el combate sea jugable.
- Máximo 4 imágenes en cache (unos 11 MiB de píxeles decodificados). No segundo WebGL.
- Datos QA solo lectura: ux15Visual es premium-webp o fallback-canvas, ux15Scene muestra la sección.

## No incluido

**No hay mundo físico longitudinal infinito todavía.** La arena 1600×960, cámara y reglas de aparición continúan intactas. El arte original no contiene personajes ni UI precocinados.
Falta la arquitectura de coordenadas rebased, spawns por región, y QA física Android (#248). Issue maestro #742 permanece abierto.

## Criterios de aceptación

Binary RIFF/WEBP válido, cuatro assets rastreados en GitHub, mapeo de los seis tramos, tests reproducibles, Chrome en escritorio y móvil mostrando premium-webp sobre combate real, CI y compilación APK Android verdes antes de fusionar.

Siguiente: revisión creativa del primer pase en juego y, después, adaptar cámara/espacio de recorrido verdaderamente infinito.