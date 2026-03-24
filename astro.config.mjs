// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.cubicalgolfer.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/drafts/'),
    }),
  ],
  build: {
    // Generate clean URLs: /slug/ → /slug/index.html
    format: 'directory',
  },
  vite: {
    build: {
      // Inline small assets for better performance
      assetsInlineLimit: 4096,
    },
  },
});
