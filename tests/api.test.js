import { test, after, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const dir = mkdtempSync(path.join(tmpdir(), 'giftshop-test-'));
let child, admin, staff, id;
const port = 43000 + Math.floor(Math.random() * 10000),
  base = `http://127.0.0.1:${port}`;
async function call(p, method = 'GET', body, cookie = admin) {
  const r = await fetch(base + '/api/' + p, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(p === 'orders' && method === 'POST' ? { 'Idempotency-Key': randomUUID() } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return {
    status: r.status,
    body: await r.json(),
    cookie: r.headers.get('set-cookie')?.split(';')[0],
  };
}
before(async () => {
  child = spawn(process.execPath, ['server.js'], {
    env: {
      ...process.env,
      PORT: String(port),
      DB_PATH: path.join(dir, 'test.db'),
      ADMIN_PASSWORD: 'LocalTestPassword2026!',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(Error('Server timeout')), 10000);
    child.stdout.on('data', () => {
      clearTimeout(t);
      resolve();
    });
    child.once('exit', (code) => {
      clearTimeout(t);
      reject(Error('Server exited ' + code));
    });
  });
});
after(async () => {
  child?.kill();
  if (child?.exitCode === null) await new Promise((r) => child.once('exit', r));
  rmSync(dir, { recursive: true, force: true });
});
test('Authentication, authorization, inventory transactions and cancellation', async () => {
  assert.equal((await call('products', 'GET', null, '')).status, 401);
  assert.equal(
    (await call('login', 'POST', { username: 'admin', password: 'wrong' }, '')).status,
    401,
  );
  const login = await call(
    'login',
    'POST',
    { username: 'admin', password: 'LocalTestPassword2026!' },
    '',
  );
  assert.equal(login.status, 200);
  admin = login.cookie;
  assert.match(admin, /^session=/);
  assert.equal(
    (
      await call('users', 'POST', {
        username: 'staff',
        password: 'StaffPassword2026!',
        role: 'staff',
      })
    ).status,
    201,
  );
  staff = (await call('login', 'POST', { username: 'staff', password: 'StaffPassword2026!' }, ''))
    .cookie;
  assert.equal(
    (
      await call(
        'products',
        'POST',
        { sku: 'G1', name: 'Móc khóa', category: 'Quà tặng', price: 25000 },
        staff,
      )
    ).status,
    403,
  );
  id = (
    await call('products', 'POST', {
      sku: 'G1',
      name: 'Móc khóa',
      category: 'Quà tặng',
      price: 25000,
    })
  ).body.id;
  assert.ok(id);
  assert.equal(
    (await call('products', 'POST', { sku: 'G1', name: 'Trùng', category: 'Quà', price: 100 }))
      .status,
    409,
  );
  assert.equal(
    (
      await call('stock', 'POST', {
        product_id: id,
        expected_price: 25000,
        qty: -1,
        note: 'Invalid',
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await call('stock', 'POST', {
        product_id: id,
        expected_price: 25000,
        qty: 5,
        note: 'Nhập kiểm thử',
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await call(
        'orders',
        'POST',
        { items: [{ product_id: id, expected_price: 25000, qty: 6 }] },
        staff,
      )
    ).status,
    400,
  );
  assert.equal((await call('products')).body[0].stock, 5);
  assert.equal(
    (
      await call('orders', 'POST', {
        items: [
          { product_id: id, expected_price: 25000, qty: 1 },
          { product_id: id, expected_price: 25000, qty: 1 },
        ],
      })
    ).status,
    400,
  );
  const results = await Promise.all([
    call('orders', 'POST', { items: [{ product_id: id, expected_price: 25000, qty: 4 }] }, staff),
    call('orders', 'POST', { items: [{ product_id: id, expected_price: 25000, qty: 4 }] }, staff),
  ]);
  assert.deepEqual(results.map((r) => r.status).sort(), [201, 400]);
  const order = results.find((r) => r.status === 201).body.id;
  assert.equal((await call('products')).body[0].stock, 1);
  assert.equal((await call('stats')).body.revenue, 100000);
  assert.equal((await call('stats', 'GET', null, staff)).status, 403);
  assert.equal((await call(`orders/${order}/cancel`, 'POST', {}, staff)).status, 403);
  assert.equal((await call(`orders/${order}/cancel`, 'POST', {})).status, 200);
  assert.equal((await call(`orders/${order}/cancel`, 'POST', {})).status, 400);
  assert.equal((await call('products')).body[0].stock, 5);
  assert.equal((await call('stats')).body.revenue, 0);
  const csrf = await fetch(base + '/api/orders', {
    method: 'POST',
    headers: {
      Cookie: admin,
      Origin: 'https://untrusted.example',
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  assert.equal(csrf.status, 403);

  const invalid = await call('products', 'POST', {
    sku: 'bad',
    name: 42,
    category: 'Gift',
    price: 1,
  });
  assert.equal(invalid.status, 400);
  const k = randomUUID(),
    request = { items: [{ product_id: id, expected_price: 25000, qty: 1 }] };
  const send = (payload = request) =>
    fetch(base + '/api/orders', {
      method: 'POST',
      headers: { Cookie: admin, 'Content-Type': 'application/json', 'Idempotency-Key': k },
      body: JSON.stringify(payload),
    });
  const first = await (await send()).json(),
    retry = await (await send()).json();
  assert.equal(first.id, retry.id);
  assert.equal((await call('products')).body[0].stock, 4);
  assert.equal(
    (await send({ items: [{ product_id: id, expected_price: 25000, qty: 2 }] })).status,
    409,
  );
  const detail = await call('orders/' + first.id);
  assert.equal(detail.body.items[0].qty, 1);
  assert.equal((await call('users', 'GET', null, staff)).status, 403);
  assert.equal((await call('users')).body.length, 2);
  assert.equal(
    (
      await call(
        'password',
        'POST',
        { current_password: 'incorrect', new_password: 'NewPassword2026!' },
        staff,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await call(
        'password',
        'POST',
        { current_password: 'StaffPassword2026!', new_password: 'NewPassword2026!' },
        staff,
      )
    ).status,
    200,
  );
  assert.equal((await call('products', 'GET', null, staff)).status, 401);
  assert.equal(
    (await call('login', 'POST', { username: 'staff', password: 'StaffPassword2026!' }, '')).status,
    401,
  );
  assert.equal(
    (await call('login', 'POST', { username: 'staff', password: 'NewPassword2026!' }, '')).status,
    200,
  );

  const backupPath = path.join(dir, 'snapshot.db');
  execFileSync(process.execPath, ['scripts/backup.mjs', path.join(dir, 'test.db'), backupPath]);
  assert.throws(() =>
    execFileSync(process.execPath, ['scripts/backup.mjs', path.join(dir, 'test.db'), backupPath], {
      stdio: 'pipe',
    }),
  );
  const restored = new DatabaseSync(backupPath, { readOnly: true });
  assert.equal(restored.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
  assert.equal(restored.prepare('SELECT stock FROM products WHERE id=?').get(id).stock, 4);
  assert.equal(restored.prepare('SELECT COUNT(*) AS n FROM checkout_requests').get().n, 2);
  restored.close();
  const malformed = await fetch(base + '/api/products', {
    method: 'POST',
    headers: { Cookie: admin, 'Content-Type': 'application/json' },
    body: 'null',
  });
  assert.equal(malformed.status, 400);

  const soldOut = (
    await call('products', 'POST', {
      sku: 'ARCHIVE',
      name: 'Sold out',
      category: 'Gift',
      price: 10000,
    })
  ).body.id;
  await call('stock', 'POST', {
    product_id: soldOut,
    expected_price: 10000,
    qty: 1,
    note: 'Archive lifecycle test',
  });
  const soldOrder = (
    await call('orders', 'POST', {
      items: [{ product_id: soldOut, expected_price: 10000, qty: 1 }],
    })
  ).body.id;
  assert.equal((await call('products/' + soldOut, 'DELETE')).status, 200);
  assert.equal((await call('orders/' + soldOrder + '/cancel', 'POST', {})).status, 200);
  assert.equal((await call('products')).body.find((p) => p.id === soldOut).stock, 1);
  assert.equal((await call('logout', 'POST', {})).status, 200);
  assert.equal((await call('products')).status, 401);
});
