import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export async function fixture() {
  const dir = mkdtempSync(path.join(tmpdir(), 'giftshop-regression-'));
  const child = spawn(process.execPath, ['server.js'], {
    env: {
      ...process.env,
      PORT: '0',
      HOST: '127.0.0.1',
      COOKIE_SECURE: '0',
      DB_PATH: path.join(dir, 'app.db'),
      ADMIN_PASSWORD: 'Regression-Admin-2026!',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let diagnostics = '';
  child.stderr.on('data', (chunk) => (diagnostics += chunk));
  const port = await new Promise((resolve, reject) => {
    let text = '';
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error('Fixture startup timeout: ' + diagnostics));
    }, 10_000);
    child.stdout.on('data', (chunk) => {
      text += chunk;
      const match = text.match(/GiftShop listening on port (\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
    child.once('exit', () => {
      clearTimeout(timeout);
      reject(new Error(diagnostics));
    });
  });
  const base = `http://127.0.0.1:${port}`;
  let cookie = '';
  async function request(
    endpoint,
    { method = 'GET', body, key = randomUUID(), session = cookie } = {},
  ) {
    const response = await fetch(base + '/api/' + endpoint, {
      method,
      headers: { Cookie: session, 'Content-Type': 'application/json', 'Idempotency-Key': key },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (response.headers.get('set-cookie'))
      cookie = response.headers.get('set-cookie').split(';')[0];
    return { status: response.status, body: await response.json() };
  }
  async function login(username = 'admin', password = 'Regression-Admin-2026!') {
    return request('login', { method: 'POST', body: { username, password } });
  }
  async function close() {
    if (child.exitCode === null) {
      child.kill();
      await new Promise((resolve) => child.once('exit', resolve));
    }
    rmSync(dir, { recursive: true, force: true });
  }
  return { request, login, close, databasePath: path.join(dir, 'app.db'), url: base };
}
