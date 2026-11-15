import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const name = process.env.CODESPACE_NAME;
const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
if (
  process.env.CODESPACES !== 'true' ||
  !/^[a-z0-9-]+$/i.test(name || '') ||
  !/^[a-z0-9.-]+$/i.test(domain || '')
) {
  console.error('Lệnh này dành cho GitHub Codespaces. Chạy local: npm.cmd run demo.');
  process.exit(1);
}
const origin = `https://${name}-3000.${domain}`;
console.log(`Website: ${origin}`);
console.log('Port 3000 ban đầu là Private. Chỉ chuyển Public khi cần người dùng thử truy cập.');
console.log(
  'Database: data/codespaces.db. Dừng Codespace sẽ dừng website; xóa Codespace sẽ mất DB.',
);
const child = spawn(process.execPath, ['server.js'], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3000',
    HOST: '127.0.0.1',
    COOKIE_SECURE: '1',
    APP_ORIGIN: origin,
    DB_PATH: path.join(root, 'data/codespaces.db'),
  },
});
child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});
