import { readFile, writeFile } from 'node:fs/promises';

const clientPath = new URL('../src/generated/prisma/internal/class.ts', import.meta.url);
const source = await readFile(clientPath, 'utf8');
const fixed = source
  .replaceAll('query_compiler_fast_bg.postgresql.mjs', 'query_compiler_fast_bg.postgresql.js')
  .replaceAll('query_compiler_fast_bg.postgresql.wasm-base64.mjs', 'query_compiler_fast_bg.postgresql.wasm-base64.js');

if (fixed !== source) await writeFile(clientPath, fixed);