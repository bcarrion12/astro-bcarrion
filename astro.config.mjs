import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bcarrion.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['.ngrok-free.app'] },
    preview: { allowedHosts: ['.ngrok-free.app'] }
  },
  legacy: { collectionsBackwardsCompat: true }
});
