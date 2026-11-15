import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { fixture } from './helpers/server.mjs';

test('A changed quote rejects the entire sale, then explicit reconfirmation succeeds once', async () => {
  const app = await fixture();
  try {
    assert.equal((await app.login()).status, 200);
    const post = (endpoint, body, key) => app.request(endpoint, { method: 'POST', body, key });
    const id = (
      await post('products', { sku: 'QUOTE', name: 'Gift', category: 'Gift', price: 25000 })
    ).body.id;
    await post('stock', { product_id: id, qty: 5, note: 'Quote test' });
    await app.request('products/' + id, {
      method: 'PATCH',
      body: { name: 'Gift', category: 'Gift', price: 99000 },
    });
    const key = randomUUID();
    const stale = await post(
      'orders',
      { items: [{ product_id: id, qty: 1, expected_price: 25000 }] },
      key,
    );
    assert.equal(stale.status, 409);
    assert.equal(stale.body.code, 'PRICE_CHANGED');
    assert.equal((await app.request('orders')).body.length, 0);
    assert.equal((await app.request('products')).body[0].stock, 5);
    assert.equal((await post('orders', { items: [{ product_id: id, qty: 1 }] })).status, 400);
    const confirmed = { items: [{ product_id: id, qty: 1, expected_price: 99000 }] };
    const sale = await post('orders', confirmed, key);
    assert.equal(sale.status, 201);
    assert.equal((await app.request('orders/' + sale.body.id)).body.total, 99000);
    await app.request('products/' + id, {
      method: 'PATCH',
      body: { name: 'Gift', category: 'Gift', price: 110000 },
    });
    const retry = await post('orders', confirmed, key);
    assert.equal(retry.body.id, sale.body.id);
    assert.equal((await app.request('products')).body[0].stock, 4);
    assert.equal((await app.request('orders')).body.length, 1);
  } finally {
    await app.close();
  }
});

test('A stale price on the second line leaves every stock and order unchanged', async () => {
  const app = await fixture();
  try {
    await app.login();
    const ids = [];
    for (const sku of ['ONE', 'TWO']) {
      const id = (
        await app.request('products', {
          method: 'POST',
          body: { sku, name: sku, category: 'Gift', price: 10000 },
        })
      ).body.id;
      ids.push(id);
      await app.request('stock', {
        method: 'POST',
        body: { product_id: id, qty: 3, note: 'Atomic test' },
      });
    }
    await app.request('products/' + ids[1], {
      method: 'PATCH',
      body: { name: 'TWO', category: 'Gift', price: 20000 },
    });
    const result = await app.request('orders', {
      method: 'POST',
      body: { items: ids.map((id) => ({ product_id: id, qty: 2, expected_price: 10000 })) },
    });
    assert.equal(result.status, 409);
    assert.ok((await app.request('products')).body.every((product) => product.stock === 3));
    assert.equal((await app.request('orders')).body.length, 0);
    assert.equal((await app.request('movements')).body.length, 2);
  } finally {
    await app.close();
  }
});

test('Locking one account does not lock another account behind the same IP', async () => {
  const app = await fixture();
  try {
    await app.login();
    await app.request('users', {
      method: 'POST',
      body: { username: 'locked', password: 'Staff-Account-2026!', role: 'staff' },
    });
    for (let count = 0; count < 15; count++)
      assert.equal((await app.login('locked', 'wrong')).status, 401);
    assert.equal((await app.login('locked', 'Staff-Account-2026!')).status, 429);
    assert.equal((await app.login()).status, 200);
    assert.equal((await app.login('locked', 'Staff-Account-2026!')).status, 429);
  } finally {
    await app.close();
  }
});

test('Concurrent password changes cannot overwrite each other after verifying an old password', async () => {
  const app = await fixture();
  try {
    await app.login();
    const passwords = ['Changed-Password-One-2026!', 'Changed-Password-Two-2026!'];
    const results = await Promise.all(
      passwords.map((new_password) =>
        app.request('password', {
          method: 'POST',
          body: { current_password: 'Regression-Admin-2026!', new_password },
        }),
      ),
    );
    const winner = results.findIndex((result) => result.status === 200);
    assert.notEqual(winner, -1);
    assert.equal(results.filter((result) => result.status === 200).length, 1);
    assert.ok([401, 403, 409].includes(results[1 - winner].status));
    assert.equal((await app.login('admin', passwords[winner])).status, 200);
    assert.equal((await app.login('admin', passwords[1 - winner])).status, 401);
  } finally {
    await app.close();
  }
});
