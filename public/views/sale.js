import { money, esc, table, head } from '../lib/ui.js';
export async function renderSale({ products, drawCart }, out) {
  out.innerHTML =
    head('Bán hàng', 'Chọn sản phẩm và xác nhận đơn để cập nhật tồn kho.') +
    `<div class="grid"><section class="card"><h2>Chọn sản phẩm</h2>${table(
      ['SẢN PHẨM', 'GIÁ', 'CÒN', ''],
      products.map(
        (p) =>
          `<tr><td>${esc(p.name)}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><button data-add="${p.id}" ${p.stock ? '' : 'disabled'}>＋</button></td></tr>`,
      ),
    )}</section><section class="card"><h2>Đơn hàng mới</h2><div id="cart"></div></section></div>`;
  drawCart();
}
