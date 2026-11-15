import { fail, json, readJson, requireAdmin, positive, price, transaction } from '../http.js';
export async function orderRoutes({ db, request, response, pathname, user }) {
  if (pathname === '/api/orders' && request.method === 'GET')
    return json(response, 200, db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 200').all());
  if (pathname === '/api/orders' && request.method === 'POST') {
    const body = await readJson(request);
    if (!Array.isArray(body.items) || !body.items.length || body.items.length > 100)
      fail('Giỏ hàng không hợp lệ');
    const key = request.headers['idempotency-key'];
    if (typeof key !== 'string' || !/^[A-Za-z0-9_-]{16,100}$/.test(key))
      fail('Thiếu mã xác nhận đơn hợp lệ');
    const payload = JSON.stringify(body.items);
    const id = transaction(db, () => {
      const prior = db
        .prepare('SELECT * FROM checkout_requests WHERE user_id=? AND request_key=?')
        .get(user.id, key);
      if (prior) {
        if (prior.payload !== payload) fail('Mã xác nhận đã dùng cho giỏ hàng khác', 409);
        return prior.order_id;
      }
      let total = 0;
      const seen = new Set();
      const rows = body.items.map((item) => {
        if (
          !item ||
          !positive(item.qty) ||
          !positive(item.product_id) ||
          !price(item.expected_price) ||
          seen.has(item.product_id)
        )
          fail('Số lượng, giá xác nhận hoặc dòng hàng không hợp lệ');
        seen.add(item.product_id);
        const product = db
          .prepare('SELECT * FROM products WHERE id=? AND active=1')
          .get(item.product_id);
        if (!product || product.stock < item.qty) fail('Không đủ tồn kho');
        // Reject stale quotes before writing any order, stock movement or idempotency record.
        if (product.price !== item.expected_price)
          fail('Giá sản phẩm đã thay đổi. Kiểm tra giá mới và xác nhận lại.', 409, 'PRICE_CHANGED');
        total += product.price * item.qty;
        if (!Number.isSafeInteger(total)) fail('Giá trị đơn quá lớn');
        return { ...item, product };
      });
      const orderId = Number(
        db.prepare('INSERT INTO orders(user_id,total) VALUES(?,?)').run(user.id, total)
          .lastInsertRowid,
      );
      for (const item of rows) {
        db.prepare('INSERT INTO items VALUES(?,?,?,?,?)').run(
          orderId,
          item.product_id,
          item.product.name,
          item.qty,
          item.product.price,
        );
        db.prepare('UPDATE products SET stock=stock-? WHERE id=?').run(item.qty, item.product_id);
        db.prepare('INSERT INTO movements(product_id,qty,note,user_id) VALUES(?,?,?,?)').run(
          item.product_id,
          -item.qty,
          `Bán đơn #${orderId}`,
          user.id,
        );
      }
      db.prepare('INSERT INTO checkout_requests VALUES(?,?,?,?)').run(
        user.id,
        key,
        payload,
        orderId,
      );
      return orderId;
    });
    return json(response, 201, { id });
  }
  if (/^\/api\/orders\/\d+\/cancel$/.test(pathname) && request.method === 'POST') {
    requireAdmin(user);
    const id = Number(pathname.split('/')[3]);
    transaction(db, () => {
      const order = db.prepare('SELECT * FROM orders WHERE id=?').get(id);
      if (!order || order.status !== 'paid') fail('Đơn không tồn tại hoặc đã hủy');
      for (const item of db.prepare('SELECT * FROM items WHERE order_id=?').all(id)) {
        const current = db.prepare('SELECT stock FROM products WHERE id=?').get(item.product_id);
        if (current.stock + item.qty > 1_000_000_000) fail('Tồn kho sau hoàn hàng vượt giới hạn');
        db.prepare('UPDATE products SET stock=stock+?,active=1 WHERE id=?').run(
          item.qty,
          item.product_id,
        );
        db.prepare('INSERT INTO movements(product_id,qty,note,user_id) VALUES(?,?,?,?)').run(
          item.product_id,
          item.qty,
          `Hủy đơn #${id}`,
          user.id,
        );
      }
      db.prepare("UPDATE orders SET status='cancelled' WHERE id=?").run(id);
    });
    return json(response, 200, { ok: true });
  }
  if (/^\/api\/orders\/\d+$/.test(pathname) && request.method === 'GET') {
    const id = Number(pathname.split('/').pop()),
      order = db.prepare('SELECT * FROM orders WHERE id=?').get(id);
    if (!order) fail('Không tìm thấy đơn', 404);
    return json(response, 200, {
      ...order,
      items: db.prepare('SELECT * FROM items WHERE order_id=?').all(id),
    });
  }
  return false;
}
