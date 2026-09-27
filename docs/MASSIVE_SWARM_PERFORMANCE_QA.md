# MASSIVE SWARM PERFORMANCE QA
**Target Version: v0.2.4a-massive-swarm-preservation**

## 1. SISTEMA DE RENDIMIENTO MODULAR (LOD RENDERING)
Para garantizar una tasa estable de 60 FPS incluso con un enjambre completo de 60 seguidores concurrentes, se introdujo un algoritmo de **Level of Detail (LOD) Rendering** basado en índices del enjambre:

- **Near Orbis (Primeros 16 miembros)**: Renderizado completo y de alta fidelidad, incluyendo múltiples capas de sombras, trazado de halos dobles y partículas de estela personalizadas.
- **Mid Orbis (Miembros 17 a 36)**: Renderizado simplificado de un solo halo, con sombras atenuadas y estelas optimizadas.
- **Far Orbis (Miembros 37 a 60)**: Renderizado minimalista de núcleo elemental y color base plano, desactivando filtros de sombra Gaussianos y estelas de partículas para reducir drásticamente el coste en el ciclo de dibujado 2D.

---

## 2. SEPARACIÓN Y COHESIÓN EFICIENTES (SPATIAL HASH GRID)
En lugar de un algoritmo $O(N^2)$ de doble bucle recursivo para prevenir colisiones de Orbis, se implementó un **Spatial Hash Grid** de complejidad $O(N)$:

- La arena de juego se subdivide dinámicamente en buckets de tamaño similar al radio de separación (16px).
- Los Orbis se registran en sus celdas correspondientes.
- Cada Orbi evalúa colisiones exclusivamente contra sus 8 celdas vecinas.
- **Resultado**: Cero jitter visual, distancias de separación uniformes y cohesión estable de formaciones sin caídas de frame rate en dispositivos de gama de entrada.
