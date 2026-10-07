import { spawn } from 'child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const nextCli = resolve(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');

if (!existsSync(nextCli)) {
  console.error('Next.js is not installed in this project. Run `bun install` and then `bun run dev`.');
  process.exit(1);
}

const rawArgs = process.argv.slice(2);
const nextArgs = ['dev'];

let hasPort = false;
let hasHost = false;

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host' || arg === '-H') {
    hasHost = true;
    nextArgs.push('-H', rawArgs[++i] || '0.0.0.0');
  } else if (arg.startsWith('--host=')) {
    hasHost = true;
    nextArgs.push('-H', arg.split('=')[1]);
  } else if (arg === '--port' || arg === '-p') {
    hasPort = true;
    nextArgs.push('-p', rawArgs[++i] || '3000');
  } else if (arg.startsWith('--port=')) {
    hasPort = true;
    nextArgs.push('-p', arg.split('=')[1]);
  } else {
    nextArgs.push(arg);
  }
}

if (!hasPort) {
  nextArgs.push('-p', process.env.PORT || '3000');
}
if (!hasHost) {
  nextArgs.push('-H', '0.0.0.0');
}

const child = spawn(process.execPath, [nextCli, ...nextArgs], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
