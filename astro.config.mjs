// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.cubicalgolfer.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [],

  // Built-in prefetch — preloads internal links on hover (Astro 4.x native)
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  build: {
    format: 'directory',
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          entryFileNames: `_astro/[name].[hash].js`,
          chunkFileNames: `_astro/[name].[hash].js`,
          assetFileNames: `_astro/[name].[hash][extname]`,
        },
      },
    },
  },
});
