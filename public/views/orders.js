import { money, esc, table, head } from '../lib/ui.js';
export async function renderOrders({ user, api }, out) {
  const orders = await api('orders');
  out.innerHTML =
    head('Lịch sử đơn hàng', 'Đơn hủy được hoàn kho tự động và loại khỏi doanh thu.') +
    `<section class="card">${table(
      ['MÃ ĐƠN', 'THỜI GIAN', 'TỔNG TIỀN', 'TRẠNG THÁI', ''],
      orders.map(
        (o) =>
          `<tr><td><button class="ghost" data-detail="${o.id}">#${o.id} · Xem</button></td><td>${esc(new Date(o.created).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }))}</td><td>${money(o.total)}</td><td><span class="tag ${o.status === 'cancelled' ? 'danger' : ''}">${o.status === 'paid' ? 'Đã thanh toán' : 'Đã hủy'}</span></td><td>${o.status === 'paid' && user.role === 'admin' ? `<button class="ghost" data-cancel="${o.id}">Hủy đơn</button>` : ''}</td></tr>`,
      ),
    )}</section>`;
}
