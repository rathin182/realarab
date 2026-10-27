import { readFile, writeFile } from 'node:fs/promises';
const file = new URL('../node_modules/zod/v4/locales/ps.js', import.meta.url);
const source = await readFile(file, 'utf8');
const start = source.indexOf('const error =');
const end = source.lastIndexOf('\n};');
if (start < 0 || end < 0) throw new Error('Could not locate Zod Pashto locale implementation.');
const body = source.slice(start, end + 3).replace(/util\./g, 'zodUtil.');
await writeFile(file, `import * as zodUtil from "../core/util.js";\n${body}\nexport default function ps() { return { localeError: error() }; }\n`);
