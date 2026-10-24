# UX10-C — Native Cinematic Launch, Bilingual Command Center

**Estado 2026-10-24**: código UX10-C fusionado. Fuente canónica GitHub `main`, commit `1d3e0c1235ef43e9f661ea927b286b05b91308e0`.

## Hallazgo raíz corregido
Antes de UX10-C, `src/components/MobileLaunchNavigation.tsx` activaba la ruta `PremiumArtNavigation` solo con `landscape && language==="es"`; en EN el producto retrocedía a otra composición. Esa ruta mostraba `public/ux09/premium/welcome.webp` o `command.webp` con título, navegación y botones ya dibujados en los píxeles, situando controles invisibles encima. No era diseño nativo y por ello una traducción real era imposible sin reilustrar el arte.

## Implementación UX10-C, PR #724
- `src/components/PremiumNativeNavigation.tsx`: misma jerarquía HTML/CSS ES/EN en landscape; **títulos y botones reales**, idioma en portada y hub, siete destinos con iconos y textos nativos, recursos reales, y regreso a portada. Las rutas y `data-testid` anteriores se preservan; no hay hitmaps transparentes en UI activa.
- `src/styles/ux10CinematicLaunch.css`: fondo `cover` full-bleed usando escena existente `public/ux09/orbi-command-world.svg` sin texto, y exclusivamente el sector izquierdo ilustrado aprobado de `welcome.webp`, atenuado antes de que aparezca la antigua tipografía horneada. Cards nativas con siete recortes diferentes de la escena sin texto; layout 4/3, variantes para landscape 740×360, 844×390, 915×412, 768×346 y escritorio 1440×900. `prefers-reduced-motion` respetado.
- Modo portrait mantiene interfaz HTML UX09 adaptable, pero usa mundo sin etiquetas españolas horneadas también al activar EN.
- Campaña, Score Attack, Infinite bloqueado, seis formaciones canónicas y manual táctico continúan operables sin modificar lógica de juego.
- `scripts/android-ux09-premium-browser.mjs` valida en producción Vite: 6 casos, ES/EN misma geometría de bienvenida y hub, 7 tarjetas dentro del viewport, 3 modos, 6 formaciones, transición al manual, botones reales que arrancan Canvas (Campaign/Score) y ausencia de imagen con UI horneada montada.
- `tests/ux10c-native-localization.test.mjs` y workflow UX09 cubren nuevos archivos y ambas lenguas; arte WebP original preservado en la historia y en `public/ux09/premium` para no perder material.

## Evidencia certificada
- PR #724 merge squash `1d3e0c1235ef43e9f661ea927b286b05b91308e0` desde `8b51a31f87d5eb5addb36de5e47ad88111931a1f`, padre `4f07db6301566e0464d4f336e22bf126a0e518e5`, árboles iguales `87a3014a8c8c51d7fa3c5d2bbf4f2ad3ff496eec`.
- Pre-merge **4/4 SUCCESS**: CI `40064374749`, Android `40064374696`, Android UX09 Chrome `40064374826`, Chromium `40064374791`.
- Post-main **6/6 SUCCESS**: CI `40064608349`, Android `40064608356`, Android UX09 Chrome `40064608414`, Chromium `40064608359`, UX01B `40064608324`, Web Beta `40064677080`.
- Proof de escritorio y móvil Chromium UX09 premerge artifact `12548751251`, fuente JS `evidence.json` (6 casos, 0 fallos); validación de escena Chrome, **NO** Android físico.
- APK debug Actions `12549210851`, `app-debug.apk` 9.426.738 bytes, SHA-256 `954b2d74ec87a2624b8a7f075bcffcd69ea5a2cc58d218d7e6af4b5502ae95b1`, ZIP digest `713da8ba75415b40a34b6e1ce1a5a53a31da8594b8357bab0b5d07cb304aba13`. No es Play Store release.

## No afirmar todavía
- **#248:** QA físico Android (rendimiento de WebView, toque accesible, colores HDR, variantes de proporción reales) sigue pendiente.
- **#694/#720:** el salto a *ilustración totalmente nueva sin textos incrustados* y arte 3D final todavía puede requerir reemplazar fondo vectorial por nueva capa artística limpia de alta fidelidad; UX10-C sí corrige rutas antiguas e integración de controles, pero no equivale a certificación artística final.
- El despliegue **production Vercel** del commit no está confirmado; éxito Web Beta/GitHub Pages no lo certifica.
- EVO8 sprites premium #711, solapamiento en combate #712 y QA fusiones #713 no se modificaron con UX10-C.

## Continuidad
Inspeccionar GitHub live primero; no tocar `main` directamente. Trabajar en ramas/PR con checks y squash. No fusionar PR draft #687. Si se añade nuevo fondo pictórico, que sea **scene-only / no text, no buttons, no labels**, más controles DOM reales; no volver a colocar hotspots sobre una captura.
