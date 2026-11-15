import { $, money, esc, table, head, field } from '../lib/ui.js';
export async function renderProducts({ user, products, api, modal }, out) {
  out.innerHTML =
    head(
      'Bộ sưu tập sản phẩm',
      'Quản lý những món quà đang có tại cửa hàng.',
      user.role === 'admin' ? '<button id="newProduct">＋ Thêm sản phẩm</button>' : '',
    ) +
    '<section class="card"><div class="toolbar"><input id="search" aria-label="Tìm sản phẩm" placeholder="Tìm theo tên hoặc mã sản phẩm…"></div><div id="productTable"></div></section>';
  const draw = () => {
    $('#productTable').innerHTML = table(
      ['SẢN PHẨM', 'DANH MỤC', 'GIÁ BÁN', 'TỒN KHO', 'THAO TÁC'],
      products
        .filter((p) =>
          (p.name + ' ' + p.sku).toLowerCase().includes($('#search').value.toLowerCase()),
        )
        .map(
          (p) =>
            `<tr><td><span class="product-icon">✳</span><b>${esc(p.name)}</b><br><small>${esc(p.sku)}</small></td><td>${esc(p.category)}</td><td>${money(p.price)}</td><td><span class="tag ${p.stock < 5 ? 'warn' : ''}">${p.stock}</span></td><td>${user.role === 'admin' ? `<button class="ghost" data-edit="${p.id}">Sửa</button><button class="ghost" data-archive="${p.id}" ${p.stock ? 'disabled' : ''}>Lưu trữ</button>` : '—'}</td></tr>`,
        ),
    );
  };
  draw();
  $('#search').oninput = draw;
  $('#newProduct')?.addEventListener('click', () =>
    modal(
      'Thêm sản phẩm',
      field('Mã sản phẩm', 'sku') +
        field('Tên sản phẩm', 'name') +
        field('Danh mục', 'category') +
        field('Giá bán (VND)', 'price', 'number', '', 'min="0" step="1"'),
      (b) => api('products', 'POST', { ...b, price: Number(b.price) }),
    ),
  );
}
