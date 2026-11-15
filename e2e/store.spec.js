import { test, expect } from '@playwright/test';
const password = 'GiftShop-Demo-2026!';
async function login(page, username = 'admin', pass = password) {
  await page.goto('/');
  await page.locator('#loginForm [name=username]').fill(username);
  await page.locator('#loginForm [name=password]').fill(pass);
  await page.locator('#loginForm button').click();
  await expect(page.locator('#app')).toBeVisible();
}
async function save(page) {
  await page.locator('#modalForm .actions button').last().click();
  await expect(page.locator('#modal')).not.toBeVisible();
}
async function section(page, name) {
  await page.locator(`nav [data-page="${name}"]`).click();
}

test('Đăng nhập sai hiện lỗi và không vào ứng dụng', async ({ page }) => {
  await page.goto('/');
  await page.locator('[name=username]').fill('admin');
  await page.locator('[name=password]').fill('wrong');
  await page.locator('#loginForm button').click();
  await expect(page.locator('#loginError')).toContainText('Sai tài khoản');
  await expect(page.locator('#app')).not.toBeVisible();
});

test('Luồng admin: thêm hàng, nhập kho, bán, xem chi tiết, hủy và đối chiếu', async ({ page }) => {
  const sku = 'E2E-' + Date.now(),
    name = 'Móc khóa kiểm thử ' + sku;
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  await section(page, 'products');
  await page.locator('#newProduct').click();
  await page.locator('#modal').getByLabel('Mã sản phẩm').fill(sku);
  await page.locator('#modal').getByLabel('Tên sản phẩm').fill(name);
  await page.locator('#modal').getByLabel('Danh mục').fill('Kiểm thử');
  await page.locator('#modal').getByLabel('Giá bán (VND)').fill('25000');
  await save(page);
  await page.locator('#search').fill(sku);
  await expect(page.locator('#productTable tbody tr')).toHaveCount(1);
  await expect(page.locator('#productTable')).toContainText(name);
  await section(page, 'stock');
  await page.locator('#importStock').click();
  await page.locator('[name=product_id]').selectOption({ label: `${name} · ${sku}` });
  await page.locator('#modal').getByLabel('Số lượng').fill('3');
  await page
    .locator('#modal')
    .getByLabel('Lý do / nhà cung cấp')
    .fill('E2E fixture, không phải giao dịch thật');
  await save(page);
  await section(page, 'sale');
  await page.getByRole('row').filter({ hasText: name }).getByRole('button').click();
  await expect(page.locator('#cart')).toContainText(name);
  await page.locator('#checkout').click();
  await expect(page.locator('#toast')).toContainText('Đã tạo đơn #');
  const order = (await page.locator('#toast').textContent()).match(/#(\d+)/)[1];
  await section(page, 'products');
  await page.locator('#search').fill(sku);
  await expect(page.locator('#productTable .tag')).toHaveText('2');
  await section(page, 'orders');
  const row = page.getByRole('row').filter({ has: page.locator(`[data-detail="${order}"]`) });
  await row.locator('[data-detail]').click();
  await expect(page.locator('#modal')).toContainText(name);
  await page.locator('#closeModal').click();
  page.once('dialog', (d) => d.accept());
  await row.locator('[data-cancel]').click();
  await expect(page.locator('#toast')).toContainText('Đã hủy và hoàn kho');
  await section(page, 'products');
  await page.locator('#search').fill(sku);
  await expect(page.locator('#productTable .tag')).toHaveText('3');
  await section(page, 'dashboard');
  await expect(page.getByRole('heading', { name: 'Một ngày bán hàng thật tốt.' })).toBeVisible();
  await page.screenshot({ path: 'test-results/dashboard-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('Nhân viên chỉ thấy quyền vận hành; đăng xuất khóa phiên', async ({ page }) => {
  await login(page);
  await section(page, 'team');
  await page.locator('#newUser').click();
  const username = 'staff' + Date.now();
  await page.locator('#modal').getByLabel('Tên đăng nhập', { exact: true }).fill(username);
  await page.locator('#modal').getByLabel('Mật khẩu (ít nhất 12 ký tự)').fill('StaffDemo-2026!');
  await save(page);
  await expect(page.locator('#content')).toContainText(username);
  await page.locator('#logout').click();
  await login(page, username, 'StaffDemo-2026!');
  await expect(page.locator('nav [data-page=dashboard]')).not.toBeVisible();
  await expect(page.locator('nav [data-page=team]')).not.toBeVisible();
  await section(page, 'products');
  await expect(page.locator('#newProduct')).toHaveCount(0);
  await section(page, 'stock');
  await expect(page.locator('#importStock')).toHaveCount(0);
  await page.locator('#logout').click();
  await page.reload();
  await expect(page.locator('#login')).toBeVisible();
});

test('Màn hình điện thoại và điều hướng không gây tràn ngang', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await section(page, 'products');
  await page.locator('#search').fill('DEMO-KEY');
  await expect(page.locator('#productTable')).toContainText('[DEMO]');
  const width = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(width.page).toBeLessThanOrEqual(width.viewport);
  await page.screenshot({ path: 'test-results/products-mobile.png', fullPage: true });
});

test('Đổi mật khẩu qua UI đăng xuất và đăng nhập lại được', async ({ page }) => {
  await login(page);
  await section(page, 'team');
  await page.locator('#newUser').click();
  const username = 'pwd' + Date.now();
  await page.locator('#modal').getByLabel('Tên đăng nhập', { exact: true }).fill(username);
  await page
    .locator('#modal')
    .getByLabel('Mật khẩu (ít nhất 12 ký tự)')
    .fill('BeforePassword2026!');
  await save(page);
  await page.locator('#logout').click();
  await login(page, username, 'BeforePassword2026!');
  await page.locator('#changePassword').click();
  await page.locator('#modal').getByLabel('Mật khẩu hiện tại').fill('BeforePassword2026!');
  await page.locator('#modal').getByLabel('Mật khẩu mới').fill('AfterPassword2026!');
  await save(page);
  await expect(page.locator('#login')).toBeVisible();
  await login(page, username, 'AfterPassword2026!');
  await expect(page.locator('#who')).toContainText(username);
});

test('Giá thay đổi phải hiển thị lại và chờ xác nhận, không tự tạo đơn', async ({ page }) => {
  await login(page);
  const name = 'Price check ' + Date.now();
  const created = await page.request.post('/api/products', {
    data: { sku: 'PRICE-' + Date.now(), name, category: 'Test', price: 25000 },
  });
  expect(created.status()).toBe(201);
  const { id } = await created.json();
  expect(
    (
      await page.request.post('/api/stock', {
        data: { product_id: id, qty: 3, note: 'Price fixture' },
      })
    ).status(),
  ).toBe(200);
  await section(page, 'sale');
  await page.getByRole('row').filter({ hasText: name }).getByRole('button').click();
  const count = (await (await page.request.get('/api/orders')).json()).length;
  expect(
    (
      await page.request.patch('/api/products/' + id, {
        data: { name, category: 'Test', price: 99000 },
      })
    ).status(),
  ).toBe(200);
  await page.locator('#checkout').click();
  await expect(page.locator('#toast')).toContainText('Giá đã thay đổi');
  await expect(page.locator('#cart .total')).toContainText('99.000');
  expect((await (await page.request.get('/api/orders')).json()).length).toBe(count);
  await expect(page.locator('#checkout')).toBeEnabled();
  await page.locator('#checkout').click();
  await expect(page.locator('#toast')).toContainText('Đã tạo đơn #');
  const orders = await (await page.request.get('/api/orders')).json();
  expect(orders.length).toBe(count + 1);
  expect(orders[0].total).toBe(99000);
});

test('Phiên hết hiệu lực phải xóa giỏ trước khi đăng nhập lại trong cùng trang', async ({
  page,
}) => {
  await login(page);
  await section(page, 'sale');
  const row = page.getByRole('row').filter({ hasText: 'Móc khóa Đà Nẵng [DEMO]' });
  await row.getByRole('button').click();
  await expect(page.locator('#cart .cartline')).toHaveCount(1);
  await page.request.post('/api/logout', { data: {} });
  await section(page, 'products');
  await expect(page.locator('#login')).toBeVisible();
  await page.locator('#loginForm [name=username]').fill('admin');
  await page.locator('#loginForm [name=password]').fill(password);
  await page.locator('#loginForm button').click();
  await expect(page.locator('#app')).toBeVisible();
  await section(page, 'sale');
  await expect(page.locator('#cart')).toContainText('Giỏ hàng đang trống');
});
