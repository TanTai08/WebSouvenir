import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { fixture } from './helpers/server.mjs';

async function product(app, sku, price) {
  const result = await app.request('products', {
    method: 'POST',
    body: { sku, name: sku, category: 'QA fixture', price },
  });
  assert.equal(result.status, 201);
  const id = result.body.id;
  assert.equal(
    (
      await app.request('stock', {
        method: 'POST',
        body: { product_id: id, qty: 5, note: 'Isolated QA fixture' },
      })
    ).status,
    200,
  );
  return id;
}

test('Stock ledger and dashboard reconcile after a multi-product sale and cancellation', async () => {
  const app = await fixture();
  try {
    await app.login();
    const first = await product(app, 'LEDGER-A', 7000),
      second = await product(app, 'LEDGER-B', 11000);
    const sale = await app.request('orders', {
      method: 'POST',
      body: {
        items: [
          { product_id: first, qty: 2, expected_price: 7000 },
          { product_id: second, qty: 3, expected_price: 11000 },
        ],
      },
    });
    assert.equal(sale.status, 201);
    let stats = (await app.request('stats')).body;
    assert.equal(stats.revenue, 47000);
    assert.equal(stats.orders, 1);
    const details = (await app.request('orders/' + sale.body.id)).body;
    assert.equal(
      details.items.reduce((sum, item) => sum + item.price * item.qty, 0),
      details.total,
    );
    const reconcile = async () => {
      const products = (await app.request('products')).body,
        movements = (await app.request('movements')).body;
      for (const p of products)
        assert.equal(
          p.stock,
          movements.filter((m) => m.product_id === p.id).reduce((sum, m) => sum + m.qty, 0),
        );
    };
    await reconcile();
    assert.equal(
      (await app.request('orders/' + sale.body.id + '/cancel', { method: 'POST', body: {} }))
        .status,
      200,
    );
    await reconcile();
    stats = (await app.request('stats')).body;
    assert.equal(stats.revenue, 0);
    assert.equal(stats.orders, 0);
    assert.deepEqual(stats.top, []);
    assert.deepEqual(stats.daily, []);
    assert.ok((await app.request('products')).body.every((p) => p.stock === 5));
  } finally {
    await app.close();
  }
});

test('Daily revenue uses the UTC+7 midnight boundary and excludes cancelled orders', async () => {
  const app = await fixture();
  try {
    await app.login();
    const id = await product(app, 'MIDNIGHT', 25000),
      orders = [];
    for (let i = 0; i < 2; i++)
      orders.push(
        (
          await app.request('orders', {
            method: 'POST',
            body: { items: [{ product_id: id, qty: 1, expected_price: 25000 }] },
          })
        ).body.id,
      );
    // Only this disposable fixture is edited; these are deterministic test dates, not project history.
    const db = new DatabaseSync(app.databasePath);
    db.prepare('UPDATE orders SET created=? WHERE id=?').run('2026-11-14T16:59:59Z', orders[0]);
    db.prepare('UPDATE orders SET created=? WHERE id=?').run('2026-11-14T17:00:00Z', orders[1]);
    db.close();
    let stats = (await app.request('stats')).body;
    assert.deepEqual(stats.daily, [
      { day: '2026-11-15', total: 25000 },
      { day: '2026-11-14', total: 25000 },
    ]);
    assert.equal(stats.revenue, 50000);
    assert.equal(stats.top[0].qty, 2);
    await app.request('orders/' + orders[0] + '/cancel', { method: 'POST', body: {} });
    stats = (await app.request('stats')).body;
    assert.deepEqual(stats.daily, [{ day: '2026-11-15', total: 25000 }]);
    assert.equal(stats.revenue, 25000);
    assert.equal(stats.top[0].qty, 1);
  } finally {
    await app.close();
  }
});

test('User APIs do not expose hashes and oversized requests cannot mutate products', async () => {
  const app = await fixture();
  try {
    await app.login();
    const users = (await app.request('users')).body;
    assert.deepEqual(Object.keys(users[0]).sort(), ['id', 'role', 'username']);
    const me = (await app.request('me')).body;
    assert.deepEqual(Object.keys(me).sort(), ['id', 'role', 'username']);
    const result = await app.request('products', {
      method: 'POST',
      body: { sku: 'OVERSIZED', name: 'x'.repeat(150000), category: 'Test', price: 1 },
    });
    assert.equal(result.status, 413);
    assert.equal((await app.request('products')).body.length, 0);
    assert.equal((await fetch(app.url + '/health')).status, 200);
    assert.equal((await fetch(app.url + '/src/database.js')).status, 404);
  } finally {
    await app.close();
  }
});
