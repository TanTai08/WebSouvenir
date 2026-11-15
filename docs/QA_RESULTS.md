# Kết quả kiểm chứng GiftShop 0.3.0

## Local / API
`npm run check` qua cú pháp. `npm test` gồm 2 test tích hợp: xác thực/quyền/tồn kho/idempotency/password/backup và demo khởi động + seed + restart giữ dữ liệu. Dữ liệu test nằm trong thư mục tạm riêng.

## Trình duyệt trên GitHub CI
Run được xác minh: https://github.com/TanTai08/WebSouvenir/actions/runs/43695889081
Chromium: **5/5 passed**, thời gian test 6.6 giây.

1. Đăng nhập sai hiển thị lỗi.
2. Admin tạo sản phẩm → nhập 3 → bán1 → xem đơn → hủy → kiểm lại tồn3.
3. Tạo staff; UI ẩn quyền admin; logout khóa phiên.
4. Viewport390x844, tìm sản phẩm và không tràn ngang toàn trang.
5. Đổi mật khẩu, đăng xuất và đăng nhập lại bằng mật khẩu mới.

Artifact `browser-qa` trên run chứa HTML report và ảnh desktop/mobile. Môi trường hiện tại không tải được artifact từ kho blob, nhưng log test và trạng thái job được đọc qua GitHub API. Không khẳng định đã kiểm tra ảnh bằng mắt ở phiên này.

## Phạm vi chưa xác nhận
UAT và chữ ký của người dùng thật; peer review của thành viên; tải production; URL HTTPS; luồng mất mạng và keyboard toàn diện. QA tự động không thay nghiệm thu học phần.
