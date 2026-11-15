import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { hashPassword } from './security.js';

export async function openDatabase(filename, initialPassword) {
  mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`
    PRAGMA foreign_keys=ON;
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL,
      salt TEXT NOT NULL, hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','staff'))
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, user_id INTEGER REFERENCES users(id), expires INTEGER
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY, sku TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
      category TEXT NOT NULL, price INTEGER NOT NULL CHECK(price>=0),
      stock INTEGER NOT NULL DEFAULT 0 CHECK(stock>=0), active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      created TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      user_id INTEGER REFERENCES users(id), total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'paid'
    );
    CREATE TABLE IF NOT EXISTS items (
      order_id INTEGER REFERENCES orders(id), product_id INTEGER REFERENCES products(id),
      name TEXT NOT NULL, qty INTEGER NOT NULL, price INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY, product_id INTEGER REFERENCES products(id),
      qty INTEGER NOT NULL, note TEXT NOT NULL, user_id INTEGER REFERENCES users(id),
      created TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
    CREATE TABLE IF NOT EXISTS checkout_requests (
      user_id INTEGER REFERENCES users(id), request_key TEXT NOT NULL, payload TEXT NOT NULL,
      order_id INTEGER REFERENCES orders(id), PRIMARY KEY(user_id,request_key)
    );
  `);
  if (!db.prepare('SELECT id FROM users LIMIT 1').get()) {
    if (
      typeof initialPassword !== 'string' ||
      initialPassword.length < 12 ||
      initialPassword.length > 256
    ) {
      db.close();
      throw new Error('Set ADMIN_PASSWORD to 12–256 characters on first start.');
    }
    const { salt, hash } = await hashPassword(initialPassword);
    db.prepare('INSERT INTO users(username,salt,hash,role) VALUES(?,?,?,?)').run(
      'admin',
      salt,
      hash,
      'admin',
    );
  }
  return db;
}
