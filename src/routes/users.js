import { fail, json, readJson, requireAdmin } from '../http.js';
import { hashPassword } from '../security.js';
export async function userRoutes({ db, request, response, pathname, user }) {
  if (pathname !== '/api/users') return false;
  requireAdmin(user);
  if (request.method === 'GET')
    return json(response, 200, db.prepare('SELECT id,username,role FROM users ORDER BY id').all());
  if (request.method === 'POST') {
    const body = await readJson(request);
    if (
      typeof body.username !== 'string' ||
      !/^[a-zA-Z0-9_-]{3,30}$/.test(body.username) ||
      typeof body.password !== 'string' ||
      body.password.length < 12 ||
      body.password.length > 256 ||
      !['admin', 'staff'].includes(body.role)
    )
      fail('Tài khoản 3–30 ký tự, mật khẩu dài 12–256 ký tự, vai trò admin/staff');
    const { salt, hash } = await hashPassword(body.password);
    db.prepare('INSERT INTO users(username,salt,hash,role) VALUES(?,?,?,?)').run(
      body.username,
      salt,
      hash,
      body.role,
    );
    return json(response, 201, { ok: true });
  }
  return false;
}
