import { fail, json, readJson, requireAdmin, text, price } from '../http.js';
export async function productRoutes({ db, request, response, pathname, user }) {
  if (pathname === '/api/products' && request.method === 'GET')
    return json(
      response,
      200,
      db.prepare('SELECT * FROM products WHERE active=1 ORDER BY id DESC').all(),
    );
  if (pathname === '/api/products' && request.method === 'POST') {
    requireAdmin(user);
    const body = await readJson(request);
    if (
      !text(body.name, 160) ||
      !text(body.sku, 40) ||
      !text(body.category, 80) ||
      !price(body.price)
    )
      fail('Thông tin sản phẩm không hợp lệ');
    const result = db
      .prepare('INSERT INTO products(sku,name,category,price) VALUES(?,?,?,?)')
      .run(body.sku.trim(), body.name.trim(), body.category.trim(), body.price);
    return json(response, 201, { id: Number(result.lastInsertRowid) });
  }
  if (/^\/api\/products\/\d+$/.test(pathname) && request.method === 'PATCH') {
    requireAdmin(user);
    const body = await readJson(request),
      id = Number(pathname.split('/').pop());
    if (!text(body.name, 160) || !text(body.category, 80) || !price(body.price))
      fail('Thông tin không hợp lệ');
    const result = db
      .prepare('UPDATE products SET name=?,category=?,price=? WHERE id=? AND active=1')
      .run(body.name.trim(), body.category.trim(), body.price, id);
    if (!result.changes) fail('Không tìm thấy', 404);
    return json(response, 200, { ok: true });
  }
  if (/^\/api\/products\/\d+$/.test(pathname) && request.method === 'DELETE') {
    requireAdmin(user);
    const result = db
      .prepare('UPDATE products SET active=0 WHERE id=? AND stock=0')
      .run(Number(pathname.split('/').pop()));
    if (!result.changes) fail('Chỉ lưu trữ sản phẩm có tồn kho bằng 0');
    return json(response, 200, { ok: true });
  }
  return false;
}
