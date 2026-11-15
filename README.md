# GiftShop / WebSouvenir
Website quản lý cửa hàng đồ lưu niệm cho đồ án QLDA VKU.
Repo đích: https://github.com/TanTai08/WebSouvenir — PM: @TanTai08.

## Trạng thái
Bản phát triển 0.1.0. Có backend thật, SQLite lưu bền trên ổ đĩa, đăng nhập và phân quyền server. Chưa triển khai cloud, chưa có stakeholder/UAT, chưa chạy CI trên GitHub, chưa tạo release v1.0.0. Đây không phải hồ sơ cuối kỳ đã hoàn tất.

## Chạy tại máy
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
Đặt ADMIN_PASSWORD bí mật >=12 ký tự, COOKIE_SECURE=1 khi dùng HTTPS, DB_PATH=/app/data/giftshop.db. Lưu mật khẩu trong secrets của nhà cung cấp, không commit. Mount volume vào /app/data. Sao lưu SQLite bằng công cụ backup hỗ trợ WAL; không chỉ copy file .db lúc đang ghi. Chưa có chức năng reset mật khẩu; cần bổ sung trước khi vận hành lâu dài.

## Quy trình nhóm
Nhánh `feat/<issue>-<ten>` → PR → kiểm thử → ít nhất 1 người khác review → CI xanh → merge. `main` cần bật branch protection trong GitHub. Không gán tác giả thay người khác. Thư mục docs gồm tài liệu DỰ THẢO và mẫu ghi nhận bằng chứng, không thay cho hoạt động thực tế.

## Điểm còn thiếu trước khi nộp
Bốn tài khoản còn lại, họ tên/MSSV của 5 người; môn chuyên ngành cho Pathway 1; hạn nộp; stakeholder và chính sách thực tế; repo write access; GitHub Projects và lịch sử Sprint; deploy HTTPS; kiểm thử giao diện/UAT; chữ ký; CR/Retro thực; báo cáo cuối 15–25 trang và release 1.0.0.
