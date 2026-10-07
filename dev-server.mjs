import { spawn } from 'child_process';

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

const child = spawn('npx', ['next', ...nextArgs], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
