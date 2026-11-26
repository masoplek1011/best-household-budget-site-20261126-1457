// Dompet Keluarga — entry program (Node 22, stdlib saja).
// Menyalin app/ dan screenshots/ dari samping file ini ke MAKEFUN_OUTPUT_DIR
// (bawaan /output) lalu menulis /output/dossier.json lewat library make.fun
// yang di-vendor di vendor/makefun-frontend.ts.
//
// Jalankan lokal:  MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const DOSSIER_OPTS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function copyDir(src, dest) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else if (entry.isFile()) cpSync(from, to);
  }
}

mkdirSync(outDir, { recursive: true });
copyDir(join(here, 'app'), join(outDir, 'app'));
copyDir(join(here, 'screenshots'), join(outDir, 'screenshots'));

const dossier = buildDossier(outDir, DOSSIER_OPTS);
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log('dossier written to ' + join(outDir, 'dossier.json'));
