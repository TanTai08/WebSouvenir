import { $, esc, table, head, field } from '../lib/ui.js';
export async function renderTeam({ api, modal }, out) {
  out.innerHTML =
    head('Tài khoản cửa hàng', 'Tài khoản vận hành cửa hàng độc lập với vai trò GitHub của nhóm.') +
    `<section class="card"><h2>Tạo tài khoản nhân viên</h2><p>Nhân viên được xem sản phẩm, bán hàng và xem lịch sử; quản trị viên quản lý kho và hủy đơn.</p><button id="newUser">＋ Tạo tài khoản</button></section>`;
  const users = await api('users');
  out.innerHTML += `<section class="card" style="margin-top:20px">${table(
    ['TÀI KHOẢN', 'VAI TRÒ'],
    users.map((u) => `<tr><td>${esc(u.username)}</td><td>${esc(u.role)}</td></tr>`),
  )}</section>`;
  $('#newUser').onclick = () =>
    modal(
      'Tạo tài khoản',
      field(
        'Tên đăng nhập',
        'username',
        'text',
        '',
        'minlength="3" maxlength="30" pattern="[a-zA-Z0-9_-]+"',
      ) +
        field(
          'Mật khẩu (ít nhất 12 ký tự)',
          'password',
          'password',
          '',
          'minlength="12" autocomplete="new-password"',
        ) +
        '<label>Vai trò<select name="role"><option value="staff">Nhân viên</option><option value="admin">Quản trị viên</option></select></label>',
      (b) => api('users', 'POST', b),
    );
}
