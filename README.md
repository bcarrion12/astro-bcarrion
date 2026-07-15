# BCARRION — Andromeda (Astro)

Sitio del álbum "Andromeda" de bcarrion, construido con [Astro](https://astro.build).

## Uso

```bash
npm install
npm run dev       # http://localhost:4321
npm run build      # genera /dist
npm run preview
```

## Estructura

- `src/layouts/BaseLayout.astro` — nav, footer, canvas de fondo, theming.
- `src/pages/` — index (hero + preorder), tracklist, album (bio/video/galería), blog.
- `src/scripts/site.js` — motor de partículas (canvas), theme/lang toggle, countdown, ripple.
- `src/styles/global.css` — variables de color (claro/oscuro) y estilos compartidos.

## Notas

- Idioma: toggle ES/EN vía `data-lang` en `<html>` + CSS (`.lang-es` / `.lang-en`), persistido en localStorage.
- Tema: toggle claro/oscuro vía `data-theme` en `<html>` + variables CSS, persistido en localStorage.
- Las imágenes (portada, foto del artista, galería, video) son placeholders — reemplazá los bloques marcados por `<img>` reales en `src/pages/*.astro`.
- Countdown apunta al 15 de agosto de 2026 (`src/scripts/site.js` → `startCountdown`).
