import { createApi } from './lib/api.js';
import { $, money, esc, table, field, toast, createModal } from './lib/ui.js';
import { renderDashboard } from './views/dashboard.js';
import { renderProducts } from './views/products.js';
import { renderSale } from './views/sale.js';
import { renderOrders } from './views/orders.js';
import { renderStock } from './views/stock.js';
import { renderTeam } from './views/team.js';

let user,
  page = 'dashboard',
  products = [],
  cart = [],
  checkoutKey = null,
  checkoutPending = false;
let renderController,
  sessionVersion = 0;
const api = createApi(resetSession);
const modal = createModal(async () => {
  if (user) await render();
});
const titles = {
  dashboard: 'Tổng quan',
  products: 'Sản phẩm',
  sale: 'Bán hàng',
  orders: 'Đơn hàng',
  stock: 'Nhập kho',
  team: 'Tài khoản',
};
const views = {
  dashboard: renderDashboard,
  products: renderProducts,
  sale: renderSale,
  orders: renderOrders,
  stock: renderStock,
  team: renderTeam,
};

function resetSession() {
  sessionVersion++;
  renderController?.abort();
  user = null;
  cart = [];
  products = [];
  checkoutKey = null;
  checkoutPending = false;
  if ($('#modal').open) $('#modal').close();
  $('#app').hidden = true;
  $('#login').hidden = false;
}
async function render() {
  renderController?.abort();
  const controller = new AbortController();
  renderController = controller;
  const requestedPage = page;
  try {
    $('#breadcrumb').textContent = titles[requestedPage];
    document
      .querySelectorAll('nav button')
      .forEach((button) =>
        button.classList.toggle('active', button.dataset.page === requestedPage),
      );
    const viewApi = (endpoint, method = 'GET', data) =>
      api(endpoint, method, data, { signal: controller.signal });
    products = await viewApi('products');
    await views[requestedPage]({ user, products, api: viewApi, modal, drawCart }, $('#content'));
  } catch (error) {
    if (error.name !== 'AbortError') toast(error.message);
  }
}
function drawCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  $('#cart').innerHTML =
    cart
      .map(
        (item) =>
          `<div class="cartline"><div><b>${esc(item.name)}</b><p>${item.qty} × ${money(item.price)}</p></div><button class="ghost" data-remove="${item.id}">Bỏ</button></div>`,
      )
      .join('') || '<div class="empty">Giỏ hàng đang trống.</div>';
  $('#cart').innerHTML +=
    `<div class="total">${money(total)}</div><p>Thanh toán tại quầy</p><button id="checkout" ${cart.length && !checkoutPending ? '' : 'disabled'}>Xác nhận bán hàng →</button>`;
  $('#checkout').onclick = checkout;
}
async function checkout(event) {
  if (checkoutPending) return;
  const version = sessionVersion;
  checkoutPending = true;
  checkoutKey ??= crypto.randomUUID();
  event.target.disabled = true;
  try {
    const result = await api(
      'orders',
      'POST',
      {
        items: cart.map((item) => ({
          product_id: item.id,
          qty: item.qty,
          expected_price: item.price,
        })),
      },
      { idempotencyKey: checkoutKey },
    );
    if (version !== sessionVersion) return;
    cart = [];
    checkoutKey = null;
    toast('Đã tạo đơn #' + result.id);
    await render();
  } catch (error) {
    if (version !== sessionVersion) return;
    if (error.code === 'PRICE_CHANGED') {
      try {
        products = await api('products');
      } catch (refreshError) {
        toast(refreshError.message);
        return;
      }
      if (version !== sessionVersion) return;
      cart = cart.map((item) => ({
        ...item,
        price: products.find((product) => product.id === item.id)?.price ?? item.price,
      }));
      checkoutKey = null;
      toast('Giá đã thay đổi. Kiểm tra giá mới trong giỏ và bấm xác nhận lại.');
    } else {
      toast(error.message);
    }
  } finally {
    if (version === sessionVersion) {
      checkoutPending = false;
      if (page === 'sale' && $('#cart')) drawCart();
    }
  }
}
document.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  try {
    if (button.dataset.page) {
      page = button.dataset.page;
      await render();
    }
    if (button.dataset.edit) {
      const product = products.find((item) => item.id === Number(button.dataset.edit));
      modal(
        'Sửa sản phẩm',
        field('Tên sản phẩm', 'name', 'text', product.name) +
          field('Danh mục', 'category', 'text', product.category) +
          field('Giá bán', 'price', 'number', product.price, 'min="0" step="1"'),
        (values) =>
          api('products/' + product.id, 'PATCH', { ...values, price: Number(values.price) }),
      );
    }
    if (button.dataset.archive && confirm('Lưu trữ sản phẩm này?')) {
      await api('products/' + button.dataset.archive, 'DELETE');
      await render();
    }
    if (button.dataset.add) {
      if (checkoutPending) return;
      checkoutKey = null;
      const product = products.find((item) => item.id === Number(button.dataset.add));
      const item = cart.find((item) => item.id === product.id);
      if ((item?.qty || 0) >= product.stock) throw new Error('Không đủ tồn kho');
      if (item) item.qty++;
      else cart.push({ ...product, qty: 1 });
      drawCart();
    }
    if (button.dataset.remove) {
      if (checkoutPending) return;
      checkoutKey = null;
      cart = cart.filter((item) => item.id !== Number(button.dataset.remove));
      drawCart();
    }
    if (button.dataset.detail) {
      const order = await api('orders/' + button.dataset.detail);
      $('#modalContent').innerHTML = `<h2>Đơn #${order.id}</h2>${table(
        ['SẢN PHẨM', 'SL', 'ĐƠN GIÁ'],
        order.items.map(
          (item) =>
            `<tr><td>${esc(item.name)}</td><td>${item.qty}</td><td>${money(item.price)}</td></tr>`,
        ),
      )}<p>Tổng tiền: <b>${money(order.total)}</b></p>`;
      $('#modalForm').onsubmit = (event) => {
        event.preventDefault();
        $('#modal').close();
      };
      $('#modal').showModal();
    }
    if (button.dataset.cancel && confirm('Hủy đơn và hoàn lại toàn bộ tồn kho?')) {
      await api('orders/' + button.dataset.cancel + '/cancel', 'POST', {});
      toast('Đã hủy và hoàn kho');
      await render();
    }
  } catch (error) {
    if (error.name !== 'AbortError') toast(error.message);
  }
});
function enter() {
  const admin = user.role === 'admin';
  $('#login').hidden = true;
  $('#app').hidden = false;
  $('#who').textContent = user.username + ' · ' + (admin ? 'Quản trị viên' : 'Nhân viên');
  document
    .querySelectorAll('[data-page="dashboard"],[data-page="team"]')
    .forEach((button) => (button.hidden = !admin));
  page = admin ? 'dashboard' : 'sale';
  render();
}
$('#loginForm').onsubmit = async (event) => {
  event.preventDefault();
  try {
    user = await api('login', 'POST', Object.fromEntries(new FormData(event.target)));
    sessionVersion++;
    event.target.reset();
    $('#loginError').textContent = '';
    enter();
  } catch (error) {
    $('#loginError').textContent = error.message;
  }
};
$('#logout').onclick = async () => {
  try {
    await api('logout', 'POST', {});
    resetSession();
  } catch (error) {
    toast(error.message);
  }
};
$('#changePassword').onclick = () =>
  modal(
    'Đổi mật khẩu',
    field(
      'Mật khẩu hiện tại',
      'current_password',
      'password',
      '',
      'autocomplete="current-password"',
    ) +
      field(
        'Mật khẩu mới',
        'new_password',
        'password',
        '',
        'minlength="12" maxlength="256" autocomplete="new-password"',
      ),
    async (values) => {
      await api('password', 'POST', values);
      resetSession();
    },
    'Đã đổi mật khẩu. Hãy đăng nhập lại.',
  );
api('me')
  .then((value) => {
    user = value;
    enter();
  })
  .catch(() => {});
