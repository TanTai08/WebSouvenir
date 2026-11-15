export const $ = (selector) => document.querySelector(selector);
export const money = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
export const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );
export function toast(message) {
  $('#toast').textContent = message;
  $('#toast').style.display = 'block';
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ($('#toast').style.display = 'none'), 4500);
}
export function table(headers, rows) {
  return `<div class="tablewrap"><table><thead><tr>${headers.map((heading) => `<th>${heading}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${headers.length}" class="empty">Chưa có dữ liệu. Hãy bắt đầu bằng một thao tác mới.</td></tr>`}</tbody></table></div>`;
}
export function head(title, description, action = '') {
  return `<div class="pagehead"><div><div class="eyebrow">GIFTSHOP WORKSPACE</div><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
}
export const field = (label, name, type = 'text', value = '', attributes = '') =>
  `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${attributes} required></label>`;
export function createModal(onSaved) {
  $('#closeModal').onclick = () => $('#modal').close();
  return function modal(title, fields, submit, message = 'Đã lưu thành công') {
    $('#modalContent').innerHTML = `<h2>${title}</h2>${fields}`;
    $('#modalForm').onsubmit = async (event) => {
      event.preventDefault();
      const button = event.submitter;
      if (button) button.disabled = true;
      try {
        await submit(Object.fromEntries(new FormData(event.target)));
        $('#modal').close();
        toast(message);
        await onSaved();
      } catch (error) {
        toast(error.message);
      } finally {
        if (button) button.disabled = false;
      }
    };
    $('#modal').showModal();
  };
}
