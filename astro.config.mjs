import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

// Keystatic inyecta rutas server-rendered (/keystatic, /api/keystatic) que rompen
// un build estático. Se activa solo en `astro dev` para que el panel de contenido
// funcione en local sin convertir el sitio publicado en un sitio con backend.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://bcarrion.com',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap(), ...(isDev ? [keystatic()] : [])]
});
