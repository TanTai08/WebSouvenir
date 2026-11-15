# GiftShop0.4.0

## Đã sửa
- Chặn tạo đơn khi giá giỏ cũ không khớp database; người bán xác nhận lại giá mới trước khi ghi đơn.
- Giữ idempotency cho retry đơn đã ghi, kể cả khi giá tiếp tục đổi sau đó.
- Demo không seed lại database cũ bằng mật khẩu mẫu; giữ mật khẩu đã đổi và dữ liệu khi restart.
- Startup phải chờ đúng process của mình; lỗi startup có exit code khác0, không nhận nhầm server chiếm port.
- Limiter theo account,15 lỗi/15 phút; account khác cùng IP vẫn đăng nhập được.
- Xóa giỏ khi session mất hiệu lực; không giữ giỏ cho phiên sau.
- Hash mật khẩu bất đồng bộ; kiểm lại hash trước cập nhật/phát hành session trong yêu cầu đồng thời.

## Chất lượng
- Backend: database, security, HTTP helper và6 nhóm route riêng.
- Frontend: API/UI helper và6 màn hình riêng.
- ESLint, Prettier,7 kiểm thử tích hợp/hồi quy; E2E kiểm tra xác nhận giá và session cùng các luồng cũ.
- CI build Docker và smoke thay container với cùng persistent volume.

## Chưa tuyên bố hoàn tất
Peer review, UAT/người dùng thật, release1.0.0, HTTPS production, lịch sử cả học kỳ và bộ hồ sơ có chữ ký.

## Bổ sung bàn giao ngày 15/11/2026
- Công cụ delivery:check/delivery:merge kiểm review độc lập đúng commit, 3 CI checks và trạng thái PR; không dùng admin bypass.
- Cấu hình GitHub Codespaces Node24 cho HTTPS demo theo hạn mức tài khoản, chưa tạo deployment thật.
- APP_ORIGIN cố định cho reverse proxy; giữ kiểm tra CSRF Origin và Secure cookie.
- 15 case UAT, user guide, sign-off và checklist 5 nhóm hồ sơ; kết quả/chữ ký còn trống.
- Kiểm thử hiện tại: 13 bài ứng dụng Node + 6 bài merge gate; bộ Chromium CI gồm8 case.
