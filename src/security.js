import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { fail } from './http.js';
const derive = promisify(scrypt);
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await derive(password, salt, 64)).toString('hex');
  return { salt, hash };
}
export async function verifyPassword(password, record) {
  const hash = await derive(password, record?.salt || 'giftshop-unknown-user', 64);
  return record ? timingSafeEqual(Buffer.from(record.hash, 'hex'), hash) : false;
}
/** Per-account failures: accounts sharing a reverse-proxy IP do not block each other.
 * Kept in memory for this single-instance application; not a distributed rate limiter. */
export class LoginLimiter {
  constructor({ limit = 15, windowMs = 900_000, capacity = 1000 } = {}) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.capacity = capacity;
    this.records = new Map();
  }
  check(key) {
    const now = Date.now();
    for (const [name, record] of this.records) if (record.until <= now) this.records.delete(name);
    if ((this.records.get(key)?.failures || 0) >= this.limit)
      fail('Tài khoản tạm khóa đăng nhập. Thử lại sau 15 phút', 429, 'LOGIN_LIMIT');
  }
  failure(key) {
    if (!this.records.has(key)) {
      if (this.records.size >= this.capacity) this.records.delete(this.records.keys().next().value);
      this.records.set(key, { failures: 0, until: Date.now() + this.windowMs });
    }
    this.records.get(key).failures++;
  }
  success(key) {
    this.records.delete(key);
  }
}
export function sessionUser(db, request) {
  const token = (request.headers.cookie || '').match(
    /(?:^|;\s*)session=([a-f0-9]{64})(?:;|$)/,
  )?.[1];
  const user =
    token &&
    db
      .prepare(
        'SELECT u.id,u.username,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE token=? AND expires>?',
      )
      .get(token, Date.now());
  if (!user) fail('Vui lòng đăng nhập', 401);
  return { user, token };
}
