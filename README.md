# BCARRION — Andromeda (Astro)

Sitio del álbum "Andromeda" de bcarrion, construido con [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com).

## Stack

- [Astro](https://astro.build) 4.16 (`output` estático)
- [Tailwind CSS](https://tailwindcss.com) 3 vía `@astrojs/tailwind` — utilidades para todo el markup, variables de tema (oklch) expuestas como colores Tailwind (`bg`, `fg`, `muted`, `accent`, etc.)
- Content Collections de Astro para el blog (`src/content/blog/*.md`)
- `@astrojs/sitemap` (sitemap.xml) y `@astrojs/rss` (rss.xml)
- Astro View Transitions (`ViewTransitions`) para navegación sin recarga completa
- TypeScript en modo `strict`
- JS vanilla (sin framework de componentes tipo React/Vue)

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
├── astro.config.mjs       # site: 'https://bcarrion.com' + integrations: [tailwind, sitemap]
├── tailwind.config.mjs     # theme.extend: colores ligados a variables CSS, keyframes/animations custom
├── tsconfig.json           # strict: true
├── package.json
├── public/
│   ├── favicon.svg         # ícono SVG (monograma circular)
│   └── og-image.svg        # imagen genérica para Open Graph/Twitter card
└── src/
    ├── env.d.ts
    ├── content/
    │   ├── config.ts        # schema de la colección "blog" (es/en + pubDate)
    │   └── blog/*.md         # 5 posts, uno por archivo
    ├── layouts/
    │   └── BaseLayout.astro  # <html>, meta SEO (description/canonical/OG/Twitter), favicon, RSS link,
    │                         # ViewTransitions, nav (con indicador animado + aria-current) y footer
    ├── pages/                # cada archivo = una ruta
    │   ├── index.astro       # hero + countdown + preorder + redes sociales
    │   ├── tracklist.astro   # listado de 8 tracks (hardcodeado en el frontmatter)
    │   ├── album.astro       # bio del artista, video destacado, galería (6 placeholders)
    │   ├── blog.astro        # lista posts vía getCollection('blog')
    │   ├── 404.astro         # página de error personalizada
    │   └── rss.xml.js        # feed RSS generado desde la colección blog
    ├── scripts/
    │   └── site.js           # runParticleField (canvas), initTheme/initLang, wireGlobalControls, startCountdown
    └── styles/
        └── global.css        # @tailwind base/components/utilities + variables oklch de tema + clases custom
                               # (.cta-solid, .cta-outline, .placeholder-tile, .ripple) no expresables solo con utilities
```

No hay `src/components/` — el markup vive en las páginas y el layout, ahora con clases Tailwind en vez de `style` inline.

## Notas

- **Idioma**: toggle ES/EN vía `data-lang` en `<html>` + CSS (`.lang-es`/`.lang-en`), persistido en `localStorage` (`bca_lang`). Botones con `aria-label` y `aria-pressed` sincronizado por JS.
- **Tema**: toggle claro/oscuro vía `data-theme` en `<html>` + variables CSS, persistido en `localStorage` (`bca_theme`); default `dark`.
- **View Transitions**: el canvas de fondo usa `transition:persist` para no reiniciar la animación entre páginas; `initTheme`/`initLang`/`wireGlobalControls` y el countdown se re-enganchan en cada navegación vía el evento `astro:page-load` (los scripts de Astro son módulos y no se re-ejecutan solos tras un swap).
- **Blog**: migrado a Content Collections (`src/content/blog`) — cada post es un `.md` con frontmatter bilingüe (`es`/`en`) y `pubDate`. Todavía no hay páginas de detalle por post (`blog.astro` solo lista); el body de cada `.md` es un placeholder de texto.
- **SEO**: `BaseLayout` acepta `description` por página, genera `<link rel="canonical">`, Open Graph y Twitter card usando `Astro.site`. `astro.config.mjs` tiene `site: 'https://bcarrion.com'` — **confirmar que sea el dominio real** antes de producción (afecta sitemap, RSS, canonical y OG).
- **OG image / favicon**: son SVG genéricos generados con motivos del propio diseño (no fotos reales). Los SVG como `og:image` no son soportados por todos los crawlers (Facebook/algunos bots prefieren PNG/JPG) — considerar exportar una versión raster una vez haya portada real.
- **Imágenes**: portada, foto del artista, galería y video siguen siendo placeholders con patrón diagonal — reemplazar por `<img>`/`<video>` reales en `src/pages/*.astro` cuando haya assets.
- **Preorder y redes sociales**: los links en `index.astro` (Spotify/Apple/YouTube Music, Instagram/TikTok/YouTube/SoundCloud) siguen apuntando a `#` — falta cablear las URLs reales.
- **Countdown**: apunta al 15 de agosto de 2026 (`src/scripts/site.js` → `startCountdown`, invocado desde `index.astro`).
- **Accesibilidad**: nav con `aria-current="page"` en el link activo + subrayado animado; toggle de tema/idioma con `aria-label`/`aria-pressed`. Pendiente: `alt` en imágenes reales cuando reemplacen los placeholders.
- **Sitemap**: se usa `@astrojs/sitemap@3.4.1` (no la última) porque las versiones ≥3.7 dependen del hook `astro:routes:resolved`, que no existe en Astro 4.16 y rompe el build.
