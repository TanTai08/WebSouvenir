import { money, esc, table, head } from '../lib/ui.js';
export async function renderDashboard({ api }, out) {
  const s = await api('stats');
  out.innerHTML =
    head(
      'Một ngày bán hàng thật tốt.',
      'Theo dõi cửa hàng, chăm chút từng món quà.',
      `<button data-page="sale">＋ Tạo đơn hàng</button>`,
    ) +
    `<div class="metrics">${[
      ['Doanh thu thuần', money(s.revenue), 'Đơn đã thanh toán, không gồm đơn hủy'],
      ['Đơn hàng', s.orders, 'Đơn đã thanh toán'],
      ['Sản phẩm', s.products, 'Sản phẩm đang kinh doanh'],
      ['Sắp hết hàng', s.low.length, 'Sản phẩm tồn dưới 5'],
    ]
      .map(
        (m) =>
          `<div class="card metric"><span>${m[0]}</span><b>${m[1]}</b><small>${m[2]}</small></div>`,
      )
      .join(
        '',
      )}</div><div class="grid"><section class="card"><h2>Doanh thu theo ngày</h2><p>Tối đa 30 ngày có giao dịch · giờ Việt Nam</p>${s.daily.map((d) => `<div class="bar-row"><span>${esc(d.day)}</span><div class="bar" style="width:${Math.max(1, Math.round((d.total / Math.max(1, ...s.daily.map((x) => x.total))) * 55))}%"></div><b>${money(d.total)}</b></div>`).join('') || '<div class="empty">Doanh thu xuất hiện sau đơn hàng đầu tiên.</div>'}</section><section class="card"><h2>Sản phẩm bán chạy</h2>${table(
      ['SẢN PHẨM', 'ĐÃ BÁN'],
      s.top.map((p) => `<tr><td>${esc(p.name)}</td><td>${p.qty}</td></tr>`),
    )}</section></div><section class="card" style="margin-top:22px"><h2>Cần bổ sung hàng</h2>${table(
      ['SẢN PHẨM', 'MÃ', 'TỒN KHO'],
      s.low.map(
        (p) =>
          `<tr><td>${esc(p.name)}</td><td>${esc(p.sku)}</td><td><span class="tag warn">${p.stock}</span></td></tr>`,
      ),
    )}</section>`;
}
