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
    // Cache-busting: inject build time into asset filenames so Cloudflare
    // always detects changed assets and uploads fresh files.
    assets: '_astro',
  },
  vite: {
    build: {
      assetsInlineLimit: 4096,
      // Rollup options to force unique asset hashes on every build
      rollupOptions: {
        output: {
          // Include build timestamp in chunk filenames to bust Wrangler asset cache
          entryFileNames: `_astro/[name].[hash].js`,
          chunkFileNames: `_astro/[name].[hash].js`,
          assetFileNames: `_astro/[name].[hash][extname]`,
        },
      },
    },
    define: {
      // Inject build timestamp — changing this forces Cloudflare to see new assets
      '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
    },
  },
});
