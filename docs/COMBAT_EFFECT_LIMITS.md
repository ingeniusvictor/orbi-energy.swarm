# COMBAT EFFECT LIMITS
**Target Version: v0.2.4a-massive-swarm-preservation**

## 1. HIT-STOP LIMITADO
Para evitar congelamientos repetitivos provocados por ráfagas concurrentes de Orbis pesados (Nuclear o Thermal) que degradaban el ritmo del combate, se implementaron las siguientes restricciones de congelamiento de frames:

- **Heavy Hit-stop estándar**: Pausa física instantánea de **40 ms**.
- **Heavy Hit-stop para Boss**: Pausa física de **60 ms** para enfatizar impactos críticos sobre enemigos mayores.
- **Ventana de Cooldown**: Cooldown de **150 ms** entre activaciones de hit-stop. Se descartan congelamientos adicionales durante esta ventana, agrupando ráfagas simultáneas.

---

## 2. CONFIGURACIONES DE ACCESIBILIDAD Y RENDIMIENTO
Se integró una pestaña de **Configuración Gráfica y Efectos** en el menú de pausa que permite controlar el rendimiento y destellos visuales con guardado inmediato en `localStorage`:

- **Vibración de Cámara (Screen Shake)**:
  - **FULL (100%)**: Movimiento de cámara cinemático nativo.
  - **REDUCIDO (35%)**: Suavizado de vibraciones físicas para evitar fatiga ocular.
  - **APAGADO (0%)**: Desactivación completa del screen shake.
- **Destellos de Daño (Flash Intensity)**:
  - **FULL (100%)**: Destello de daño de pantalla roja de alta intensidad.
  - **REDUCIDO (20%)**: Opacidad baja y sutil para accesibilidad fotosensible.
- **Etiquetas de Núcleos (Core Labels)**:
  - **FULL**: Nombres elementales en núcleos silvestres siempre visibles.
  - **PROXIMIDAD**: Visibles solo durante la caída inicial (2s) y cuando el jugador está a menos de 120px de distancia con un desvanecimiento suave de opacidad.
  - **OCULTO**: Ocultación absoluta de las etiquetas en núcleos silvestres para un campo de batalla minimalista.
