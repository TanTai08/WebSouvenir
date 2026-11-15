import { fail, json, readJson, requireAdmin, text, positive, transaction } from '../http.js';
export async function inventoryRoutes({ db, request, response, pathname, user }) {
  if (pathname === '/api/stock' && request.method === 'POST') {
    requireAdmin(user);
    const body = await readJson(request);
    if (!positive(body.product_id) || !positive(body.qty) || !text(body.note, 500))
      fail('Nhập số lượng nguyên dương và lý do');
    transaction(db, () => {
      const product = db
        .prepare('SELECT * FROM products WHERE id=? AND active=1')
        .get(body.product_id);
      if (!product || product.stock + body.qty > 1_000_000_000)
        fail('Sản phẩm hoặc số lượng không hợp lệ');
      db.prepare('UPDATE products SET stock=stock+? WHERE id=?').run(body.qty, body.product_id);
      db.prepare('INSERT INTO movements(product_id,qty,note,user_id) VALUES(?,?,?,?)').run(
        body.product_id,
        body.qty,
        body.note.trim(),
        user.id,
      );
    });
    return json(response, 200, { ok: true });
  }
  if (pathname === '/api/movements' && request.method === 'GET')
    return json(
      response,
      200,
      db
        .prepare(
          'SELECT m.*,p.name FROM movements m JOIN products p ON p.id=m.product_id ORDER BY m.id DESC LIMIT 200',
        )
        .all(),
    );
  return false;
}
