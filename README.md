# GiftShop / WebSouvenir
Website quản lý cửa hàng đồ lưu niệm cho đồ án QLDA VKU.
Repo đích: https://github.com/TanTai08/WebSouvenir — PM: @TanTai08.

## Trạng thái
Bản phát triển 0.3.0. Có backend thật, SQLite lưu bền trên ổ đĩa, đăng nhập và phân quyền server. Chưa triển khai cloud, chưa có stakeholder/UAT, CI GitHub đã chạy thành công trên PR #1, chưa tạo release v1.0.0. Đây không phải hồ sơ cuối kỳ đã hoàn tất.

## Chạy ngay bản demo
Cài Node.js 24 rồi chạy:
```sh
npm run demo
```
Mở http://127.0.0.1:3000 — tài khoản `admin`, mật khẩu **DEMO** `GiftShop-Demo-2026!`. Lệnh tự tạo database demo riêng và chuẩn bị 3 sản phẩm có nhãn DEMO. Không cần GitHub của các thành viên và không cần npm install để chạy app. Đây là chế độ local loopback, không dùng mật khẩu demo trên production.

Windows có thể bấm `start-demo.bat`, macOS/Linux chạy `sh start-demo.sh`.

## Chạy tại máy với dữ liệu riêng
Yêu cầu Node.js 24 trở lên. Không cần npm install vì dùng thư viện có sẵn của Node.

Linux/macOS:
```sh
ADMIN_PASSWORD='Thay-bang-mat-khau-rieng-12-ky-tu' npm start
```
PowerShell:
```powershell
$env:ADMIN_PASSWORD='Thay-bang-mat-khau-rieng-12-ky-tu'
npm start
```
Mở http://localhost:3000; đăng nhập `admin` và mật khẩu vừa thiết lập. Mật khẩu chỉ khởi tạo lần đầu, thay biến môi trường không đổi mật khẩu tài khoản đã lưu. Không dùng chuỗi ví dụ khi triển khai thật.
Quản trị viên tạo nhân viên trong màn hình Tài khoản. Vai trò ứng dụng khác vai trò PM/QA trên GitHub. Cơ sở dữ liệu mới không có hàng hóa giả; thêm sản phẩm và nhập hàng trước khi bán.

## Kiểm tra
```sh
npm run check
npm test
```
Test dùng database tạm riêng: đăng nhập, phân quyền, mã trùng, số lượng âm, bán vượt kho, hai yêu cầu bán đồng thời, hủy đơn và hoàn kho, CSRF, đăng xuất. Browser QA chưa thực hiện trong môi trường này.

## Công nghệ
Node.js 24 + SQLite + HTML/CSS/JavaScript thuần. Lựa chọn này thay cho đề xuất React/Supabase ban đầu để có bản đầy đủ backend chạy ngay, không phụ thuộc tài khoản cloud hay dịch vụ ngoài. Nhóm cần xác nhận công nghệ này phù hợp môn chuyên ngành trước khi chốt Charter.

## Deploy
Đây là ứng dụng Node có máy chủ, không phải static site: không đưa thẳng lên Cloudflare Pages/Vercel static.
Có Dockerfile và render.yaml; cấu hình Render đề xuất dùng gói có persistent disk, có phí. Chưa đăng ký/triển khai dịch vụ hay phát sinh chi phí. Không dùng ổ tạm miễn phí để lưu SQLite khi bàn giao thật. Phương án khác: VPS có volume và reverse proxy HTTPS. Nếu bắt buộc hạ tầng miễn phí cần chuyển database sang dịch vụ được quản lý trước khi công bố nghiệm thu.
Đặt ADMIN_PASSWORD bí mật >=12 ký tự, COOKIE_SECURE=1 khi dùng HTTPS, DB_PATH=/app/data/giftshop.db. Lưu mật khẩu trong secrets của nhà cung cấp, không commit. Mount volume vào /app/data. Sao lưu SQLite bằng công cụ backup hỗ trợ WAL; không chỉ copy file .db lúc đang ghi. Có chức năng đổi mật khẩu khi biết mật khẩu cũ; chưa có khôi phục khi quên.

## Quy trình nhóm
Nhánh `feat/<issue>-<ten>` → PR → kiểm thử → ít nhất 1 người khác review → CI xanh → merge. `main` cần bật branch protection trong GitHub. Không gán tác giả thay người khác. Thư mục docs gồm tài liệu DỰ THẢO và mẫu ghi nhận bằng chứng, không thay cho hoạt động thực tế.

## Điểm còn thiếu trước khi nộp
Bốn tài khoản còn lại, họ tên/MSSV của 5 người; môn chuyên ngành cho Pathway 1; hạn nộp; stakeholder và chính sách thực tế; GitHub Projects và lịch sử Sprint; deploy HTTPS; kiểm thử giao diện/UAT; chữ ký; CR/Retro thực; báo cáo cuối 15–25 trang và release 1.0.0.

## Tiến độ GitHub được xác minh
- PR triển khai: https://github.com/TanTai08/WebSouvenir/pull/1 (chưa merge, chờ peer review).
- CI đã pass: https://github.com/TanTai08/WebSouvenir/actions/runs/43693752840
- Hồ sơ tải/xem tại thư mục reports trên nhánh feat/giftshop-initial.
- Phiên GitHub đã được cấp quyền ADMIN trên repo sau lần kiểm tra READ ban đầu.
- Tạo Projects qua API thất bại vì quyền integration; chủ repo tạo Project trên giao diện và liên kết repo.
- Hồ sơ draft ghi trạng thái lúc khởi tạo; xem tiến độ mới trong README trước khi dùng.

- Đã tạo 20 Issue và 5 Milestone; không đóng Issue khi chưa được nhóm review.
- API branch protection trả 403: chủ repo cần bật PR + 1 approval + check verify trên main trong Settings.

## Bổ sung phiên bản 0.2.0
- Chống tạo đơn lặp qua Idempotency-Key; UI giữ mã khi retry cùng giỏ hàng.
- Đổi mật khẩu và hủy mọi phiên cũ; xem chi tiết đơn; liệt kê tài khoản.
- config/team.json đã có 5 vị trí. scripts/assign_member.py nhận GitHub và gán Issue theo vai trò khi có quyền.
- scripts/backup.mjs backup SQLite online; scripts/demo.mjs chuẩn bị dữ liệu có nhãn DEMO.
- Xem docs/HANDOVER.md để bàn giao theo 5 vai trò.

## Kiểm thử trình duyệt
Có bộ Playwright E2E trên GitHub Actions, gồm đăng nhập sai, luồng admin đầy đủ, staff, viewport mobile và đổi mật khẩu. Trên máy hỗ trợ browser: `npm ci`, `npx playwright install chromium`, `npm run test:browser`. Kết quả và ảnh chụp nằm trong artifact browser-qa của run. Đây là QA tự động, không phải UAT hoặc peer review của sinh viên.
