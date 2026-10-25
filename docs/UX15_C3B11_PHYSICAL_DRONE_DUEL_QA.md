# UX15-C3B-11 — DRONE físico en recinto QA aislado

Continuación de C3B-10 (PR #763), #749 y #742. Nuevo flag obligatorio `ux15-c3b11=1`, encadenado a todos los anteriores hasta `ux15-c3b10=1`.

## Certificado en esta etapa

Un botón explícito **Iniciar duelo DRONE (QA)** usa el mismo tick físico para avanzar Scout Signal y Parasite Drift hasta el límite temporal 75s, comprueba `wave2.status==="GATED_WAVE3"` y recién entonces arma **un solo DRONE normal**, fuera del arreglo de enemigos de Campaña/Wave2. El DRONE se mueve en coordenadas del mundo físico ASTERIA y se dibuja con los renderizadores del videojuego. Se conservan los umbrales originales de distancia 120/180, deriva lateral `0.8*cos(nowMs*.003)`, cooldown neutro inicial `(80 + 0.5*80)*0.6` y recarga fija QA `100+0.5*70` frames.

Los disparos hostiles se crean con la proyección certificada C3B-10, se almacenan entre ticks (`projectiles`, hasta **6** activos) y se actualizan con la velocidad original 2.2 u/frame y 2500ms de vida. Collision con centro ENERGY: `dist² < (16+3.5)²`. Cada colisión resta **12 unidades** exclusivamente al escudo del recinto QA (100 inicial). Los proyectiles caducan o se eliminan fuera de cámara + margen 160, nunca por un límite X=1600 heredado. Sin daño a partidas reales.

El actor DRONE y sus proyectiles son propietarios **separados** de `RouteQaEncounter`, pero están registrados como `extraWorldAnchors` en la **misma** transacción `rebaseRouteCoordinateOwners` que ENERGY, cámara, 30 ORBI, enemigos, proyectiles, recompensas y efectos. Se clonan antes del rebase; no hay traslaciones diferidas ni índices espaciales retenidos de otra época.

## Límites intencionales

- **La tercera oleada `drone_lock` NO está habilitada.** Su director, presupuesto 22, cap 14, oleadas de DRONE+CRAWLER y élites del 10% no se ejecutan.
- El DRONE QA es un actor físico experimental independiente, no un enemigo Wave3 que pueda ser alcanzado por los ORBI ni recibir Resonancia, Convergencia, puntaje o drops. No confundir con integración total de combate.
- Shield de este duelo no se integra a `RouteCombatBridge`; la colisión de proyectil contra ENERGY es real **solo dentro de la simulación QA**.
- No existe telegraph visual de disparo, evasión táctica, DRONE evolucionado `LANCE_DRONE`, sinergias con formaciones, multiplayer ni certificados de hardware Android. Corresponden a futuras etapas.
- No se modifica `EnergySwarmGame.tsx`, sistemas públicos de Campaña, Score Attack, Infinito ni Travesía.
- Sin cambios al comportamiento C3B-1...C3B-10 cuando el flag C3B-11 esté desactivado. Estado inicial `DISARMED`; pausa/visibilidad y reset protegen al recinto.

## Gates de entrega

Tests separados de admisión, disparos persistentes, daño QA, culling y TTL, tick cero, invalidaciones, origen flotante y continuidad temporal. Chromium **33** casos con dos nuevos desktop/touch. TypeScript, build web, repositorio/gameplay/platform y APK Android en GitHub Actions. Squash solamente tras los tres pipelines en verde. Validación física en teléfono Android sigue pendiente.
