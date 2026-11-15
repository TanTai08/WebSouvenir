import { randomBytes } from 'node:crypto';
import { fail, json, readJson, transaction } from '../http.js';
import { hashPassword, verifyPassword } from '../security.js';
export async function loginRoute(ctx) {
  const { db, request, response, pathname, limiter, secure } = ctx;
  if (pathname !== '/api/login' || request.method !== 'POST') return false;
  const body = await readJson(request);
  if (
    typeof body.username !== 'string' ||
    !/^[a-zA-Z0-9_-]{3,30}$/.test(body.username) ||
    typeof body.password !== 'string' ||
    body.password.length > 256
  )
    fail('Sai tài khoản hoặc mật khẩu', 401);
  const key = body.username.toLowerCase();
  limiter.check(key);
  const record = db.prepare('SELECT * FROM users WHERE username=?').get(body.username);
  const valid = await verifyPassword(body.password, record);
  // Recheck after the asynchronous password calculation for concurrent attempts.
  limiter.check(key);
  const current = record && db.prepare('SELECT hash FROM users WHERE id=?').get(record.id);
  if (!valid || current?.hash !== record?.hash) {
    limiter.failure(key);
    fail('Sai tài khoản hoặc mật khẩu', 401);
  }
  limiter.success(key);
  const token = randomBytes(32).toString('hex');
  db.prepare('DELETE FROM sessions WHERE expires<=?').run(Date.now());
  db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(token, record.id, Date.now() + 28_800_000);
  response.setHeader(
    'Set-Cookie',
    `session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure ? '; Secure' : ''}`,
  );
  return json(response, 200, { username: record.username, role: record.role });
}
export async function accountRoutes(ctx) {
  const { db, request, response, pathname, user, token } = ctx;
  if (pathname === '/api/me' && request.method === 'GET') return json(response, 200, user);
  if (pathname === '/api/logout' && request.method === 'POST') {
    db.prepare('DELETE FROM sessions WHERE token=?').run(token);
    response.setHeader('Set-Cookie', 'session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
    return json(response, 200, { ok: true });
  }
  if (pathname === '/api/password' && request.method === 'POST') {
    const body = await readJson(request);
    if (
      typeof body.current_password !== 'string' ||
      body.current_password.length > 256 ||
      typeof body.new_password !== 'string' ||
      body.new_password.length < 12 ||
      body.new_password.length > 256
    )
      fail('Mật khẩu mới phải dài 12–256 ký tự');
    const record = db.prepare('SELECT * FROM users WHERE id=?').get(user.id);
    if (!(await verifyPassword(body.current_password, record)))
      fail('Mật khẩu hiện tại không đúng', 403);
    const { salt, hash } = await hashPassword(body.new_password);
    transaction(db, () => {
      const current = db.prepare('SELECT hash FROM users WHERE id=?').get(user.id);
      if (current?.hash !== record.hash)
        fail('Mật khẩu đã thay đổi trong yêu cầu khác. Hãy đăng nhập lại.', 409);
      db.prepare('UPDATE users SET salt=?,hash=? WHERE id=?').run(salt, hash, user.id);
      db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
    });
    response.setHeader('Set-Cookie', 'session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
    return json(response, 200, { ok: true });
  }
  return false;
}
