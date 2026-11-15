import assert from 'node:assert/strict';
const base = process.env.CONTAINER_URL || 'http://127.0.0.1:3200';
const password = process.env.ADMIN_PASSWORD;
if (!password) throw new Error('Set ADMIN_PASSWORD for the isolated CI container.');
let ready = false;
for (let attempt = 0; attempt < 60; attempt++) {
  try {
    if ((await fetch(base + '/health')).ok) {
      ready = true;
      break;
    }
  } catch {
    /* Startup may still be in progress. */
  }
  await new Promise((resolve) => setTimeout(resolve, 250));
}
assert.ok(ready, 'Container did not become healthy');
const login = await fetch(base + '/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password }),
});
assert.equal(login.status, 200);
const cookie = login.headers.get('set-cookie').split(';')[0];
async function api(endpoint, method = 'GET', body) {
  const response = await fetch(base + '/api/' + endpoint, {
    method,
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/json',
      'Idempotency-Key': 'ci-container-order-0001',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  assert.ok(response.ok, `Container API ${endpoint}: ${response.status}`);
  return response.json();
}
if (process.argv.includes('--seed')) {
  const { id } = await api('products', 'POST', {
    sku: 'CI-CONTAINER',
    name: 'Container smoke fixture',
    category: 'CI',
    price: 7500,
  });
  await api('stock', 'POST', { product_id: id, qty: 4, note: 'CI container fixture' });
  await api('orders', 'POST', { items: [{ product_id: id, qty: 1, expected_price: 7500 }] });
}
const product = (await api('products')).find((item) => item.sku === 'CI-CONTAINER');
assert.ok(product, 'Expected persisted product after container replacement');
assert.equal(product.stock, 3);
const orders = await api('orders');
assert.equal(orders.length, 1);
assert.equal(orders[0].total, 7500);
console.log('Container smoke passed: login, persisted product, stock and order.');
