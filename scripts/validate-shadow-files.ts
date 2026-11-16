#!/usr/bin/env node
/**
 * validate-shadow-files.ts — PRE-BUILD ratchet on files that shadow src/.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * Found 16 November 2026 (Sprint 253). The repository carries 46 files OUTSIDE
 * src/ that shadow a real file inside it — whole duplicate `pages/`,
 * `components/`, `layouts/` and `lib/` trees, plus bare copies sitting at the
 * repo root. They are the fossil record of a build output directory, or a sprint zip,
 * being extracted at the repository root instead of inside it.
 *
 * Astro only reads src/ and public/, so none of them are served and the build
 * is green. That is exactly what makes them dangerous:
 *
 *   Editing the wrong copy is a SILENT NO-OP. The file changes, the build
 *   passes, every validator passes, and the live site is unaffected. There is
 *   no feedback at all — which is the worst failure mode available.
 *
 * `pages/[...slug].astro` is 1,235 lines against the live 1,481. It looks far
 * more like the real template than a stub would, so it is the likeliest one to
 * fool somebody.
 *
 * ── Why a ceiling rather than a hard failure ───────────────────────────────
 * These 46 files pre-date this check and several hold lines the live versions
 * do not — old refactors, most likely dead, but not proven dead. Deleting them
 * is a considered cleanup, not something a validator should force. So this
 * follows the house ratchet: the count is recorded, the build stays green, and
 * the number may only ever go DOWN. A NEW shadow fails immediately, which is
 * the point — the trap cannot grow.
 *
 * When files are deleted, lower CEILING to the new count in the same commit.
 */
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename, extname } from 'node:path';

const ROOT = process.cwd();
const CEILING = 46;   // measured 16 Nov 2026 by this script itself. Only ever lower it.

// Not our code, generated output, or trees with their own src (courses).
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'public', '.astro', 'src', '.github',
  'coverage', '.vercel', '.wrangler',
]);
const CODE = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.css']);

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIRS.has(e)) continue;
    const p = join(dir, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out);
    else out.push(relative(ROOT, p));
  }
  return out;
}

/** Every file under src/, and an index of their basenames. */
const srcFiles = existsSync(join(ROOT, 'src'))
  ? walkSrc(join(ROOT, 'src'))
  : [];
function walkSrc(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walkSrc(p, out);
    else out.push(relative(ROOT, p));
  }
  return out;
}
const srcSet = new Set(srcFiles);
const srcByBase = new Map<string, string>();
for (const f of srcFiles) if (!srcByBase.has(basename(f))) srcByBase.set(basename(f), f);

const pathShadows: [string, string][] = [];
const rootShadows: [string, string][] = [];

for (const f of walk(ROOT)) {
  // Rule 1 — a file at P where src/P also exists. Unambiguous: same relative
  // path under src/, so it is a copy of that exact file.
  const under = 'src/' + f.split('\\').join('/');
  if (srcSet.has(under)) { pathShadows.push([f, under]); continue; }

  // Rule 2 — a bare code file at the repository root whose basename exists
  // somewhere under src/. Weaker than rule 1 (basename, not path) but a loose
  // .astro at the root is never legitimate in this project.
  if (!f.includes('/') && !f.includes('\\') && CODE.has(extname(f))) {
    const hit = srcByBase.get(basename(f));
    if (hit) rootShadows.push([f, hit]);
  }
}

const total = pathShadows.length + rootShadows.length;

if (total > CEILING) {
  console.error(
    `\n❌ ${total} file(s) outside src/ shadow a real file inside it (ceiling ${CEILING}).\n` +
    `A shadow file is never served, so editing it is a silent no-op: the build\n` +
    `passes and the site does not change. Put the edit in the src/ copy.\n`);
  for (const [a, b] of [...pathShadows, ...rootShadows].sort()) {
    console.error(`   ${a}\n      shadows ${b}`);
  }
  console.error(`\nIf you deliberately deleted shadows, lower CEILING to ${total} in this file.\n`);
  process.exit(1);
}

console.log(
  `✅ Shadow files: ${total} file(s) outside src/ shadow one inside it ` +
  `(ceiling ${CEILING}) — ${pathShadows.length} duplicate path(s), ${rootShadows.length} stray root file(s).`);
if (total < CEILING) {
  console.log(`   ${CEILING - total} below the ceiling — lower CEILING to ${total}.`);
}
