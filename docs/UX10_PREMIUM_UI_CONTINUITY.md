# UX10 — Premium Gameplay UI Continuity

> **UX10-C / 2026-10-24 — Bienvenida y Command Center ES/EN nativos:** [PR #724](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/724) fusionado con squash de código `1d3e0c1235ef43e9f661ea927b286b05b91308e0`, padre `4f07db6301566e0464d4f336e22bf126a0e518e5`, árbol `87a3014a8c8c51d7fa3c5d2bbf4f2ad3ff496eec` igual al PR. Se eliminó la condición `language==="es"` del menú cinematográfico landscape; ES/EN ahora usan misma composición React `PremiumNativeNavigation` con texto, idioma, créditos, siete tarjetas reales, modos y seis formaciones. Fondo adaptativo limpio `orbi-command-world.svg` sin texto, región escénica izquierda del arte UX09 aprobada con logo/botones horneados recortados fuera de la región visible. Portrait usa imagen sin textos horneados. Android físico **no certificado** (#248), pulido artístico final puede continuar (#694/#720). **Seis post-main SUCCESS**: CI `40064608349`, Android `40064608356`, UX09 Chrome `40064608414`, Chromium `40064608359`, UX01B `40064608324`, Web Beta `40064677080`. APK debug artifact `12549210851`, 9.426.738 bytes SHA-256 `954b2d74ec87a2624b8a7f075bcffcd69ea5a2cc58d218d7e6af4b5502ae95b1`; ZIP digest `713da8ba75415b40a34b6e1ce1a5a53a31da8594b8357bab0b5d07cb304aba13`. No afirmar producción Vercel nueva sin verificar deployment.


**Corte:** 2026-10-24, autoridad GitHub live `main`. Este documento es una certificación documental separada de código.

## Tramo UX10-A integrado
- Código squash [PR #721](https://github.com/ingeniusvictor/orbi-energy.swarm/pull/721): `ebd0f22005a20f8362f9e65afb1633faaf33a3f8`.
- Árbol `52d46339fcedc52b52b7aee339ea364ba2497119`, igual al PR aprobado; padre `9987004656e15db714b9e07f1860f7f0b949b858`.
- Componentes modificados: `GameHud.tsx`, `UpgradeSelector.tsx`, `EnergySwarmGame.tsx`; CSS adicional `ux10PremiumOverlays.css` importado al final del stack; test UX10 y evidencia Chromium actualizada.
- Apertura Estado/Táctica/Equipo llama la **autoridad existente** de pausa, detiene BGM/input y suspende frames; tab switching no reanuda; cierre revierte solo una pausa inducida por el panel. Pausa manual previa permanece.
- Cabeceras/tabs y paneles de tres secciones tienen límites externos idénticos. Estado contiene únicamente telemetría real conocida (escudo, sector, objetivo, enjambre, score, créditos, resonancia, cadena, Overdrive, audio), sin inventar HP/temperatura.
- Selector de intermisión 3 columnas landscape, sin carrusel horizontal y sin modificar efectos, elecciones ni reroll. Portrait conserva legibilidad.
- Capturas Chrome [artifact 12547366924](https://github.com/ingeniusvictor/orbi-energy.swarm/actions/runs/40061163302) cubren 1440×900, 1920×1080, 1366×768 y Android emulado 844×390; no califican como Android físico.

## Verificaciones post-main (SHA exacto)
- CI `40061416005` — SUCCESS
- Android `40061415964` — SUCCESS
- Chromium `40061415873` — SUCCESS
- UX01B `40061415817` — SUCCESS
- UX07 `40061415836` — SUCCESS
- Canvas EVO8 `40061415941` — SUCCESS
- GitHub Pages `40061470913` — SUCCESS
- APK debug Actions artefacto `12548065168`, 9.419.134 bytes, SHA256 `d8ce507641af8fbaeff5925b9fc874d373f58406722e0d01d6180f18013eb014`. ZIP digest `2ab67b83a8a52ae38fccd01f993f37d143c31eccdc01d9f20d8e370c96a74dd2`. No es un Play Store release ni prueba Android física.

## Pendientes UX10 / UX09
1. **#720:** refinamiento *interno* Táctica/Equipo al nivel de los diseños aprobados, sin inventar herramientas nuevas. Revisar pequeño landscape y accesibilidad real.
2. **#694:** eliminar la dependencia del screenshot con texto y widgets incrustados. La ruta premium solo se activa para español en `MobileLaunchNavigation.tsx`; la versión EN usa la ruta visual anterior. Exigir una base artística *limpia y sin UI horneada*, misma composición en ambos idiomas, con botones/títulos/tarjetas nativos traducibles y responsivos. Mantener arte aprobado y no degradar a degradados genéricos.
3. **#248:** pruebas manuales Android físico, incluido overlay y tarjetas de mejoras; no cerrar por CI.
4. **#711/#712/#713:** Evo8 arte, legibilidad de 30 E8 en combate, validación longitudinal fusiones siguen independientes.

No repetir #710/#715/#718 ni borrar la nueva UI. GitHub live prevalece sobre esta nota.
