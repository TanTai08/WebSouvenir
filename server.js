import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { openDatabase } from './src/database.js';
import { createApp } from './src/app.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const db = await openDatabase(
  process.env.DB_PATH || path.join(root, 'data/giftshop.db'),
  process.env.ADMIN_PASSWORD,
);
const server = http.createServer(
  createApp({ db, root, secure: process.env.COOKIE_SECURE === '1' }),
);
server.listen(Number(process.env.PORT || 3000), process.env.HOST || '0.0.0.0', () => {
  console.log(`GiftShop listening on port ${server.address().port}`);
});
