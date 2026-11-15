import { json, requireAdmin } from '../http.js';
export async function reportRoutes({ db, request, response, pathname, user }) {
  if (pathname !== '/api/stats' || request.method !== 'GET') return false;
  requireAdmin(user);
  return json(response, 200, {
    revenue: db
      .prepare("SELECT COALESCE(SUM(total),0) AS value FROM orders WHERE status='paid'")
      .get().value,
    orders: db.prepare("SELECT COUNT(*) AS value FROM orders WHERE status='paid'").get().value,
    products: db.prepare('SELECT COUNT(*) AS value FROM products WHERE active=1').get().value,
    low: db.prepare('SELECT * FROM products WHERE stock<5 AND active=1').all(),
    daily: db
      .prepare(
        "SELECT date(created,'+7 hours') AS day,SUM(total) AS total FROM orders WHERE status='paid' GROUP BY day ORDER BY day DESC LIMIT 30",
      )
      .all(),
    top: db
      .prepare(
        "SELECT i.name,SUM(i.qty) AS qty FROM items i JOIN orders o ON o.id=i.order_id WHERE o.status='paid' GROUP BY i.product_id ORDER BY qty DESC LIMIT 5",
      )
      .all(),
  });
}
