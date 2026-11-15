import { test } from 'node:test';
import assert from 'node:assert/strict';
import { configuredOrigin } from '../src/origin.js';
import { fixture } from './helpers/server.mjs';

test('HTTPS proxy login accepts only the configured origin and issues a secure cookie', async () => {
  const app = await fixture({ origin: 'https://shop.example.test', secure: true });
  try {
    const login = (origin, extra = {}) =>
      fetch(app.url + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: origin, ...extra },
        body: JSON.stringify({ username: 'admin', password: 'Regression-Admin-2026!' }),
      });
    const good = await login('https://shop.example.test');
    assert.equal(good.status, 200);
    assert.match(good.headers.get('set-cookie'), /; Secure/);
    assert.match(good.headers.get('set-cookie'), /HttpOnly/);
    const foreign = await login('https://other.example.test', {
      'X-Forwarded-Host': 'other.example.test',
      'X-Forwarded-Proto': 'https',
    });
    assert.equal(foreign.status, 403);
    assert.equal(foreign.headers.get('set-cookie'), null);
  } finally {
    await app.close();
  }
});

test('Local requests still use their own origin when APP_ORIGIN is absent', async () => {
  const app = await fixture();
  try {
    for (const [origin, status] of [
      [app.url, 200],
      ['https://foreign.example.test', 403],
    ]) {
      const result = await fetch(app.url + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: origin },
        body: JSON.stringify({ username: 'admin', password: 'Regression-Admin-2026!' }),
      });
      assert.equal(result.status, status);
    }
  } finally {
    await app.close();
  }
});

test('Deployment origin configuration rejects paths, credentials, wildcards and insecure HTTPS config', () => {
  assert.equal(configuredOrigin(undefined, false), undefined);
  assert.equal(configuredOrigin('https://shop.example.test', true), 'https://shop.example.test');
  for (const value of [
    'https://shop.example.test/',
    'https://shop.example.test/path',
    'https://user:pass@shop.example.test',
    '*',
    'http://shop.example.test',
    'file:///etc/passwd',
  ])
    assert.throws(() => configuredOrigin(value, true));
});
