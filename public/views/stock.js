import { $, esc, table, head, field } from '../lib/ui.js';
export async function renderStock({ user, products, api, modal }, out) {
  const rows = await api('movements');
  out.innerHTML =
    head(
      'Quản lý kho',
      'Mọi thay đổi tồn kho đều có lịch sử đối chiếu.',
      user.role === 'admin' ? '<button id="importStock">↗ Nhập hàng</button>' : '',
    ) +
    `<section class="card">${table(
      ['THỜI GIAN', 'SẢN PHẨM', 'THAY ĐỔI', 'LÝ DO'],
      rows.map(
        (r) =>
          `<tr><td>${esc(new Date(r.created).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }))}</td><td>${esc(r.name)}</td><td><span class="tag ${r.qty < 0 ? 'warn' : ''}">${r.qty > 0 ? '+' : ''}${r.qty}</span></td><td>${esc(r.note)}</td></tr>`,
      ),
    )}</section>`;
  $('#importStock')?.addEventListener('click', () =>
    modal(
      'Nhập hàng',
      `<label>Sản phẩm<select name="product_id" required>${products.map((p) => `<option value="${p.id}">${esc(p.name)} · ${esc(p.sku)}</option>`).join('')}</select></label>` +
        field('Số lượng', 'qty', 'number', '', 'min="1" step="1"') +
        field('Lý do / nhà cung cấp', 'note'),
      (b) => api('stock', 'POST', { ...b, qty: Number(b.qty), product_id: Number(b.product_id) }),
    ),
  );
}
