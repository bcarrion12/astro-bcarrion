# BCARRION — Andromeda (Astro)

Sitio del álbum "Andromeda" de bcarrion, construido con [Astro](https://astro.build). Sin frameworks de UI: componentes `.astro` + JS vanilla + CSS con variables.

## Stack

- [Astro](https://astro.build) 4.15 (`output` estático por defecto, sin integraciones adicionales)
- TypeScript en modo `strict` (solo para `.astro`/`env.d.ts`, no hay archivos `.ts` propios todavía)
- CSS plano con custom properties (sin Tailwind ni preprocesador)

## Uso

```bash
npm install
npm run dev       # http://localhost:4321
npm run build      # genera /dist
npm run preview
```

## Estructura

```
astro-bcarrion/
├── astro.config.mjs      # site: 'https://example.com' (placeholder, actualizar antes de deploy)
├── tsconfig.json          # strict: true
├── package.json
└── src/
    ├── env.d.ts
    ├── layouts/
    │   └── BaseLayout.astro   # <html>, nav, footer, canvas de fondo, theme/lang init (inline script anti-flash)
    ├── pages/                 # cada .astro = una ruta
    │   ├── index.astro        # hero + countdown + preorder (Spotify/Apple/YouTube) + redes sociales
    │   ├── tracklist.astro    # listado de 8 tracks (hardcodeado en el frontmatter)
    │   ├── album.astro        # bio del artista, video destacado, galería (6 placeholders)
    │   └── blog.astro         # 5 posts hardcodeados en el frontmatter (sin colecciones de contenido)
    ├── scripts/
    │   └── site.js            # runParticleField (canvas), initTheme/initLang, wireGlobalControls, startCountdown
    └── styles/
        └── global.css         # variables de color claro/oscuro (oklch), nav, botones, footer, animaciones
```

No hay carpeta `public/` ni `src/components/` — todo el markup vive directamente en las páginas y el layout.

## Notas

- Idioma: toggle ES/EN vía `data-lang` en `<html>` + CSS (`.lang-es` / `.lang-en`), persistido en `localStorage` (`bca_lang`).
- Tema: toggle claro/oscuro vía `data-theme` en `<html>` + variables CSS, persistido en `localStorage` (`bca_theme`); default `dark`.
- Las imágenes (portada, foto del artista, galería, video) son placeholders con patrón diagonal — reemplazá los bloques marcados por `<img>`/`<video>` reales en `src/pages/*.astro`.
- Los enlaces de preorder y redes sociales en `index.astro` apuntan a `#` — falta cablear las URLs reales.
- Countdown apunta al 15 de agosto de 2026 (`src/scripts/site.js` → `startCountdown`, invocado desde `index.astro`).
- `astro.config.mjs` tiene `site: 'https://example.com'` — actualizar al dominio real antes de generar el sitemap/build de producción.
