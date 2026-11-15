import { spawn } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
if (Number(process.versions.node.split('.')[0]) < 24)
  throw new Error('GiftShop yêu cầu Node.js 24 trở lên.');
const env = {
  ...process.env,
  HOST: '127.0.0.1',
  PORT: process.env.PORT || '3000',
  DB_PATH: process.env.DEMO_DB_PATH || path.join(root, 'data/demo.db'),
  ADMIN_PASSWORD: process.env.DEMO_ADMIN_PASSWORD || 'GiftShop-Demo-2026!',
  COOKIE_SECURE: '0',
};
const url = `http://127.0.0.1:${env.PORT}`;
const existing = existsSync(env.DB_PATH) && statSync(env.DB_PATH).size > 0;
let failed = false,
  shuttingDown = false,
  seed;
console.log('CHẾ ĐỘ DEMO LOCAL — dữ liệu mẫu, không dùng cho production.');
const child = spawn(process.execPath, [path.join(root, 'server.js')], {
  env,
  stdio: ['inherit', 'pipe', 'inherit'],
});
child.stdout.pipe(process.stdout);
child.on('exit', (code) => {
  process.exitCode = failed ? 1 : (code ?? (shuttingDown ? 0 : 1));
});
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    shuttingDown = true;
    seed?.kill(signal);
    child.kill(signal);
  });
try {
  // Wait for our own child's listening event, not a different server on the same port.
  await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Server chưa sẵn sàng')), 10_000);
    child.stdout.on('data', (chunk) => {
      output += chunk;
      if (output.includes('GiftShop listening on port')) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once('exit', () => {
      clearTimeout(timer);
      reject(new Error('Server không khởi động; kiểm tra port và database.'));
    });
  });
  if (!existing) {
    await new Promise((resolve, reject) => {
      seed = spawn(process.execPath, [path.join(root, 'scripts/demo.mjs')], {
        env: { ...env, DEMO_CONFIRM: 'YES', DEMO_URL: url },
        stdio: 'inherit',
      });
      seed.once('error', reject);
      seed.once('exit', (code) =>
        code === 0
          ? resolve()
          : reject(new Error('Không chuẩn bị được dữ liệu demo. Database vẫn được giữ nguyên.')),
      );
    });
  } else {
    console.log(
      'Giữ nguyên database demo và mật khẩu đã lưu; không seed lại hoặc đặt lại mật khẩu.',
    );
  }
  console.log(
    `\nMỞ WEBSITE: ${url}\nTài khoản ban đầu: admin\n${existing ? 'Dùng mật khẩu đã đặt; nếu chưa đổi, dùng mật khẩu demo ban đầu.' : `Mật khẩu DEMO ban đầu: ${env.ADMIN_PASSWORD}`}\nDừng: Ctrl+C. Database: ${env.DB_PATH}\n`,
  );
} catch (error) {
  failed = true;
  console.error(error.message);
  seed?.kill();
  child.kill();
  process.exitCode = 1;
}
