// astro.config.mjs
// ─────────────────────────────────────────────────────────────────────────────
// DEPLOYMENT FIX (March 2026):
//   Cloudflare Worker Assets skips uploads when HTML content hashes are identical
//   between builds. The vite plugin below injects a unique BUILD_ID into every
//   HTML page, guaranteeing Cloudflare always detects changed files.
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig } from 'astro/config';

const BUILD_ID = Date.now().toString(36); // e.g. "lzq4k8m"

export default defineConfig({
  site: 'https://www.cubicalgolfer.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [],
  build: {
    format: 'directory',
    assets: '_astro',
  },
  vite: {
    build: {
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          // Unique hashes on every build so Cloudflare always uploads fresh assets
          entryFileNames: `_astro/[name].[hash].js`,
          chunkFileNames: `_astro/[name].[hash].js`,
          assetFileNames: `_astro/[name].[hash][extname]`,
        },
      },
    },
    define: {
      // Injected into every page — changing this forces Cloudflare to see new HTML
      '__BUILD_ID__': JSON.stringify(BUILD_ID),
    },
    plugins: [
      // Injects <meta name="build-id" content="..."> into every HTML page
      {
        name: 'inject-build-id',
        transformIndexHtml(html) {
          return html.replace(
            '</head>',
            `<meta name="build-id" content="${BUILD_ID}"></head>`
          );
        },
      },
    ],
  },
});
