# SWARM CAPACITY AND CONSOLIDATION
**Target Version: v0.2.4a-massive-swarm-preservation**

## 1. REGLAS DE CONSOLIDACIÓN AL ALCANZAR EL LÍMITE
Para preservar la jugabilidad y evitar que el enjambre de Orbis se convierta en un blob masivo sin sentido, se implementa una mecánica de consolidación de energía una vez alcanzado el límite de capacidad de Orbis activo (24, 36, 48 o 60 respectivamente):

1. **Recolección Normal**: El núcleo silvestre se recoge y consume normalmente en el mapa de juego.
2. **Sin Nuevos Seguidores**: No se crea un Orbi adicional en el enjambre.
3. **Búsqueda de Candidato Compatible**:
   - Se selecciona un Orbi compatible del enjambre para recibir la esencia del núcleo.
   - **Prioridad 1**: Misma afinidad elemental y mismo rol de combate.
   - **Prioridad 2**: Misma afinidad elemental.
   - **Prioridad 3**: Miembro con menor XP o nivel dentro de la afinidad coincidente.
4. **Conservación de Afinidad**: Se conserva estrictamente el elemento recolectado, distribuyendo la experiencia dentro de su propia categoría elemental.
5. **Entrega de Experiencia**: Se entrega XP directa al Orbi seleccionado.
6. **Feedback Visual**: Se genera un texto flotante en pantalla indicando `"CORE CONSOLIDATED"` en color dorado brillante sobre el Orbi beneficiado.

---

## 2. MECÁNICA DE EVOLUCIÓN (STAGE / XP THRESHOLDS)
Los Orbis ganan XP acumulativamente. Al cruzar los límites establecidos, evolucionan visual y estadísticamente:

- **SPARK → FOTON**: Requiere **8 XP** (Incrementa daño base un 20%).
- **FOTON → GUARDIAN**: Requiere **24 XP** (Añade un halo orbital intermitente y un incremento de velocidad de disparo).
- **GUARDIAN → PRIME**: Requiere **60 XP** (Consigue una insignia en estrella, doble halo brillante y un 50% de incremento en daño crítico).
