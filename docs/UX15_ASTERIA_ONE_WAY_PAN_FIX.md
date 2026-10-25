# UX15 — Corrección de retroceso panorámico de ASTERIA

## Evidencia y causa raíz

En `src/game/asteriaPremiumRenderer.ts`, el antiguo `paintPanorama` implementaba `(travel*.12) % (2*maxPan)` y escogía una rama descendente después de `maxPan`. En cada límite la textura invertía el desplazamiento, aunque el reloj de ruta y el avance automático de ENERGY continuaban aumentando.

Esto contradecía la expectativa de travesía física lateral hacia la derecha, especialmente visible en fondos de 1440px y ventanas de 800px (maxPan≈640px).

## Solución

La composición premium utiliza ahora un **scroll unidireccional** `distance*.12` en franjas consecutivas del mismo WebP. Cada copia entra por el extremo derecho y sale por el izquierdo; el límite de una copia utiliza 96px como máximo de solape fundido con la copia siguiente, para disimular bordes no diseñados originalmente para repetición infinita.

Una copia anterior se dibuja parcialmente detrás de la primera, incluso cuando `phase=0`, para evitar un salto en el borde izquierdo exactamente al envolver. No hay canvas adicional, imágenes nuevas, WebGL nuevo ni RNG. Se conserva la transición del arte entre sectores de la campaña, el reloj congelable, los presupuestos y todo el combate.

Las coordenadas mundiales, la cámara física y la política de origen flotante no fueron modificadas. La dirección automática del cursor sigue siendo +X. En el laboratorio físico, la tecla **A** o flecha izquierda puede desplazar ENERGY voluntariamente hacia atrás; eso es un control manual distinto de la anomalía del panorama corregida aquí.

## Verificación

- Proyección pura de franjas con distancias largas y distintos tamaños de pantalla, incluidos móviles y monitores anchos.
- Continuidad de la posición de la misma franja al cruzar repetidamente los límites de textura.
- Verificación de llamadas Canvas2D, solape en ambos lados del ciclo, cota de draw calls y preservación de alpha.
- Verificación estructural de que se mantiene la física original y no reaparece la fórmula triangular.
- CI completo, matriz Chromium y compilación Android antes de fusionar.
