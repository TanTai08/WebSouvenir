import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fail, json } from './http.js';
import { LoginLimiter, sessionUser } from './security.js';
import { loginRoute, accountRoutes } from './routes/auth.js';
import { productRoutes } from './routes/products.js';
import { inventoryRoutes } from './routes/inventory.js';
import { orderRoutes } from './routes/orders.js';
import { reportRoutes } from './routes/reports.js';
import { userRoutes } from './routes/users.js';
const routes = [
  accountRoutes,
  productRoutes,
  inventoryRoutes,
  orderRoutes,
  reportRoutes,
  userRoutes,
];
const files = new Map([
  ['/', 'index.html'],
  ['/app.js', 'app.js'],
  ['/style.css', 'style.css'],
  ...[
    'lib/api',
    'lib/ui',
    'views/dashboard',
    'views/products',
    'views/sale',
    'views/orders',
    'views/stock',
    'views/team',
  ].map((file) => [`/${file}.js`, `${file}.js`]),
]);
export function createApp({ db, root, secure, origin }) {
  const limiter = new LoginLimiter();
  return async function app(request, response) {
    try {
      const url = new URL(request.url, 'http://localhost'),
        pathname = url.pathname;
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'",
      );
      if (pathname === '/health' && request.method === 'GET')
        return json(response, 200, { status: 'ok' });
      if (!pathname.startsWith('/api/')) {
        if (!['GET', 'HEAD'].includes(request.method))
          return json(response, 405, { error: 'Phương thức không hỗ trợ' });
        if (pathname === '/favicon.ico') {
          response.writeHead(204);
          response.end();
          return;
        }
        const file = files.get(pathname);
        if (!file) return json(response, 404, { error: 'Không tìm thấy' });
        response.setHeader(
          'Content-Type',
          file.endsWith('.js')
            ? 'text/javascript; charset=utf-8'
            : file.endsWith('.css')
              ? 'text/css; charset=utf-8'
              : 'text/html; charset=utf-8',
        );
        response.setHeader('Cache-Control', 'no-cache');
        response.end(
          request.method === 'HEAD' ? undefined : readFileSync(path.join(root, 'public', file)),
        );
        return;
      }
      if (
        !['GET', 'HEAD'].includes(request.method) &&
        request.headers.origin &&
        request.headers.origin !==
          (origin || `${secure ? 'https' : 'http'}://${request.headers.host}`)
      )
        fail('Nguồn yêu cầu không hợp lệ', 403);
      const ctx = { db, root, request, response, url, pathname, limiter, secure };
      if (await loginRoute(ctx)) return;
      Object.assign(ctx, sessionUser(db, request));
      for (const route of routes) if (await route(ctx)) return;
      json(response, 404, { error: 'Không tìm thấy' });
    } catch (error) {
      if (response.destroyed || response.writableEnded) return;
      if (error.code?.startsWith('ERR_SQLITE') && error.message.includes('UNIQUE'))
        return json(response, 409, { error: 'Mã hoặc tài khoản đã tồn tại' });
      if (!error.status) console.error(error);
      json(response, error.status || 500, {
        error: error.status ? error.message : 'Lỗi hệ thống',
        ...(error.status && error.code ? { code: error.code } : {}),
      });
    }
  };
}
