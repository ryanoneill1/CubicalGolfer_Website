// astro.config.mjs
// NOTE: @astrojs/sitemap intentionally removed — it crashes on Cloudflare's
// build environment (absolute path bug in sitemap-simple.js:32).
// sitemap.xml is pre-generated and committed to public/sitemap.xml directly.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.cubicalgolfer.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [],
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      assetsInlineLimit: 4096,
    },
  },
});
