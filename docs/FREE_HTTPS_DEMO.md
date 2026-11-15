# Demo HTTPS bằng GitHub Codespaces

Phương án ưu tiên miễn phí trong hạn mức Codespaces của tài khoản GitHub cá nhân. Đây là môi trường demo/UAT, không phải dịch vụ chạy 24/7. Chưa tạo Codespace hoặc URL đang hoạt động thay người dùng. Kiểm tra mục Billing & licensing / Usage và hạn mức Codespaces trước khi tạo; không thêm phương thức thanh toán hay mua gói chỉ để chạy hướng dẫn này.

## Tạo và chạy

1. Đăng nhập GitHub bằng TanTai08. Vào https://github.com/settings/codespaces, tạo Codespaces secret tên `ADMIN_PASSWORD`, giá trị là mật khẩu riêng 12–256 ký tự, và cho phép repo `TanTai08/WebSouvenir`. Không dùng mật khẩu demo công khai.
2. Mở https://codespaces.new/TanTai08/WebSouvenir?ref=feat%2Fgiftshop-initial. Xác nhận nhánh `feat/giftshop-initial`, chọn cấu hình nhỏ nhất phù hợp và Create codespace. Cấu hình `.devcontainer/devcontainer.json` cài Node 24. Nếu đã tạo trước khi thêm secret, dừng rồi mở lại Codespace để nhận secret.
3. Trong terminal của Codespace chạy `node -v` rồi `npm run codespace`. Không cần cài npm dependencies để vận hành ứng dụng.
4. Tab **Ports**, tìm cổng **3000**, chọn **Open in Browser**. Đăng nhập `admin` bằng mật khẩu riêng đã tạo. Database mới chưa có sản phẩm; dùng dữ liệu kiểm thử trong UAT_PLAN.csv.
5. Để stakeholder truy cập, bấm phải cổng 3000 → **Port Visibility → Public** nếu chính sách tài khoản cho phép. Sao chép **Forwarded Address** thực tế và ghi vào biên bản UAT. URL HTTPS có dạng `https://<tên-codespace>-3000.<domain-forwarding>`. Không ghi URL mẫu này như link đã triển khai.
6. Sau UAT đưa cổng về **Private**, dừng ứng dụng và Stop Codespace để tiết kiệm hạn mức.

Launcher đặt COOKIE_SECURE=1 và APP_ORIGIN theo đúng địa chỉ forwarding do Codespaces cung cấp. APP_ORIGIN giúp kiểm tra Origin khi reverse proxy đổi Host; ứng dụng không tin X-Forwarded-Host do client gửi. Nếu Codespaces không cấp domain/name, launcher dừng và báo lỗi thay vì tạo link giả.

## Dữ liệu và sao lưu

Database nằm ở `data/codespaces.db` trong workspace, được giữ khi stop/start cùng Codespace nhưng sẽ mất khi xóa Codespace hoặc workspace bị xóa theo chính sách lưu trữ. Không commit DB hoặc tải lên Drive chung chứa báo cáo.

Trước khi dừng hoặc xóa, chạy trong Codespace:

```bash
node scripts/backup.mjs data/codespaces.db data/codespaces-backup-$(date +%Y%m%d-%H%M%S).db
```

Tải file backup xuống máy qua Explorer, giữ riêng. Bản backup không thay thế mã nguồn trên GitHub. Giữ lại mật khẩu đã đổi; ADMIN_PASSWORD chỉ khởi tạo khi database chưa có user. Chạy lại bằng `npm run codespace`; không chạy `npm run demo` trên cổng Public vì lệnh demo dùng mật khẩu công khai và cookie local.

## Kiểm chứng trước ghi là đã triển khai

- URL thực tế mở được bằng cửa sổ không đăng nhập GitHub khi cổng Public.
- HTTPS hợp lệ; đăng nhập được và cookie có Secure/HttpOnly.
- Tạo sản phẩm → nhập kho → bán → kiểm tồn/doanh thu → hủy đơn hoạt động.
- Stop/start cùng Codespace, dữ liệu và mật khẩu vẫn còn.
- Backup được tải về và phục hồi trên bản sao; lưu bằng chứng đã che dữ liệu riêng.

Chưa đánh dấu các bước trên đã đạt. Quota, tạo máy, forwarding và UAT cần được xác minh trên tài khoản thật. Nếu môn yêu cầu URL luôn trực tuyến, cần hạ tầng ổ lưu bền hoặc backend/database khác; không dùng ổ tạm Render Free cho SQLite lưu dài hạn. `render.yaml` hiện có persistent disk trả phí và không phải phương án miễn phí này.
