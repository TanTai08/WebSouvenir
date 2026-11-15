# GiftShop / WebSouvenir — 0.4.0

Website quản lý nội bộ cửa hàng đồ lưu niệm cho đồ án QLDA VKU.

- Repo: https://github.com/TanTai08/WebSouvenir
- Bản triển khai: nhánh `feat/giftshop-initial`, PR #1; chờ thành viên review trước merge main.
- Project: https://github.com/users/TanTai08/projects/1
- PM: @TanTai08; Tech Lead: @Txtien-225; Backend: @LQT23072005; Frontend: @ngonhat21. QA: @Hoangtrong-S1.

## Chạy ngay trên Windows / VS Code

Yêu cầu **Node.js24 trở lên**. Mở đúng thư mục có package.json, chạy:

```powershell
npm.cmd run demo
```

Hoặc bấm `start-demo.bat`. macOS/Linux dùng `npm run demo` hay `sh start-demo.sh`.

Mở **http://127.0.0.1:3000**. Database mới có tài khoản `admin`, mật khẩu demo ban đầu `GiftShop-Demo-2026!` và3 sản phẩm có nhãn DEMO. Nếu đã đổi mật khẩu, dùng mật khẩu mới; restart giữ nguyên dữ liệu/mật khẩu và không seed lại. Giới hạn demo ở loopback, không dùng tài khoản mẫu cho production. Có thể đặt DEMO_DB_PATH để chọn file demo riêng.

Ứng dụng chạy bằng thư viện có sẵn trong Node; không cần npm install để chạy demo. GitHub CLI chỉ cần cho công cụ quản lý Project, không cần để chạy website.

## Cập nhật từ bản0.3

1. Dừng server cũ bằng Ctrl+C.
2. Sao lưu database trước khi cập nhật, giữ nguyên thư mục `data/`.
3. Cập nhật source từ nhánh triển khai hoặc giải nén gói mới vào thư mục code. Không thay database bằng database demo khác.
4. Chạy `npm.cmd run demo`, mở lại trang bằng Ctrl+F5 để tải các module giao diện mới.

Schema cũ tương thích; không cần xóa database. API tạo đơn0.4 bắt buộc `expected_price` ở mỗi dòng hàng; client cũ thiếu trường sẽ bị từ chối. Giao diện0.4 đã gửi trường này.

## Các sửa lỗi0.4

- Giá trong giỏ thay đổi: server trả409 PRICE_CHANGED, không tạo đơn/không trừ kho. Giao diện hiển thị giá mới và chờ người bán xác nhận lại.
- Demo mở database đã có mà không đăng nhập bằng mật khẩu mẫu để seed, nên restart sau đổi mật khẩu vẫn chạy.
- Giới hạn đăng nhập theo tài khoản:15 lần sai/15 phút; một tài khoản bị khóa không khóa các tài khoản khác cùng IP. Dữ liệu limiter có giới hạn bộ nhớ, dành cho một instance; chưa là rate limiter phân tán.
- Phiên đăng nhập mất hiệu lực sẽ xóa giỏ; yêu cầu render cũ bị hủy khi chuyển trang.
- Backend và frontend tách module; có ESLint, Prettier, test hồi quy và CI build/smoke Docker với volume.

## Cấu trúc để chia việc

```text
server.js                 # Entry point
src/database.js           # Schema và khởi tạo SQLite
src/security.js           # Hash mật khẩu, session, login limiter
src/http.js               # Validation, JSON, transaction
src/routes/               # Auth, users, products, inventory, orders, reports
public/app.js             # Điều phối giao diện, giỏ hàng, phiên đăng nhập
public/lib/               # API client và UI helper
public/views/             # Mỗi màn hình một module
scripts/                  # Demo, backup, quản lý/snapshot Project
config/team.json          # Thành viên và vai trò
config/project-plan.json  # Kế hoạch đề xuất20 Issue
reports/                  # Hồ sơ hiện trạng/dự thảo, chưa nghiệm thu
```

## Kiểm tra kỹ thuật

Để phát triển và chạy toàn bộ kiểm tra, cài dev dependencies:

```powershell
npm.cmd ci --ignore-scripts
npm.cmd run check
npm.cmd run lint
npm.cmd run format:check
npm.cmd test
```

Browser QA: `npx.cmd playwright install chromium`, rồi `npm.cmd run test:browser`. CI tự chạy trên Ubuntu24.04. Không dùng kết quả tự động thay chữ ký UAT hay review của sinh viên.

Muốn định dạng code: `npm.cmd run format`. Công cụ lint/format không cần có trên production.

## Chạy production

```powershell
$env:ADMIN_PASSWORD='Mat-khau-rieng-tu-12-ky-tu'
$env:DB_PATH='data/production.db'
npm.cmd start
```

ADMIN_PASSWORD chỉ dùng khởi tạo khi chưa có user; không reset mật khẩu cũ. Khi triển khai HTTPS đặt COOKIE_SECURE=1; giữ ADMIN_PASSWORD trong secrets của nhà cung cấp, không commit. DB_PATH phải nằm trên persistent volume. GET /health dùng để kiểm tra readiness.

Có Dockerfile và render.yaml. Render cấu hình dùng persistent disk và có thể phát sinh phí; chưa đăng ký dịch vụ trả phí hoặc triển khai production. Node/SQLite cần máy chủ với ổ lưu bền, không đưa thẳng source này lên static Pages. Database phù hợp một instance; không chạy nhiều instance với các file SQLite tách biệt.

## Backup / restore

```powershell
node scripts/backup.mjs data/demo.db data/backup-moi.db
```

Script dùng online backup hỗ trợ WAL và không ghi đè đích có sẵn. Giữ backup ngoài repo. Restore: dừng server, sao lưu hiện trạng, kiểm integrity của bản backup, thay file đích và xử lý WAL/SHM cũ khi server đã dừng, khởi động rồi đối chiếu dữ liệu. CI kiểm tra dữ liệu còn khi thay container với cùng volume; restore production vẫn cần diễn tập trên hạ tầng được chọn.

## Quản lý Project

Chủ repo đã tạo Board/Table public,20 Issue,5 Milestone,5 Status, Sprint và Story Points. Điểm hiện là đề xuất, nhóm cần xác nhận. Công cụ riêng cần GitHub CLI đăng nhập TanTai08 với scope project:

```powershell
npm.cmd run project:plan
npm.cmd run project:apply
npm.cmd run project:snapshot
```

Xem docs/PROJECT_PLAN.md. Kết nối chat chỉ đọc Projects, chưa sửa được trực tiếp. scripts/assign_member.py giúp điều chỉnh phân công khi nhóm thay đổi thành viên. Role/GitHub không tự tạo lịch sử đóng góp.

## Việc còn lại để nộp môn

Peer review/merge PR; xác nhận các required checks trên main; Họ tên/MSSV/tỷ lệ đóng góp; môn kế thừa, deadline, stakeholder; HTTPS production; Sprint/Retro/Risk/CR thật; UAT/sign-off; báo cáo cuối và release v1.0.0. Hồ sơ15 trang hiện là báo cáo kỹ thuật theo trạng thái đã xác minh, chưa phải xác nhận hoàn thành học kỳ.

Xuất lại báo cáo (tùy chọn cho người chỉnh tài liệu): cài Python3, `pip install reportlab python-docx`, chạy `python scripts/build_report.py`. PDF dùng font Unicode có sẵn trên Windows/Linux/macOS hoặc đường dẫn REPORT_FONT. Bản DOCX trong reports có thể chỉnh trực tiếp bằng Word.

## Kiểm chứng kỹ thuật có bản ghi
Chạy `npm.cmd run qa:verify` để kiểm tra syntax/lint/format/test và lưu manifest, log tại data/qa-runs. Manifest ghi source commit và thời điểm thực; không thay peer approval/UAT. Sau khi đọc gói review trong docs/reviews, chủ Project có thể chạy `npm.cmd run qa:progress -- --apply` để ghi trạng thái #4 In Review, #10 In Progress, #17 In Review. Công cụ không đóng Issue hay gán đóng góp cho sinh viên.

## Bàn giao, kiểm tra merge và demo HTTPS miễn phí

Đọc [trình tự bàn giao](docs/DELIVERY_READINESS.md), [hướng dẫn người dùng](docs/USER_GUIDE.md) và [đối chiếu 5 nhóm hồ sơ](docs/SUBMISSION_CHECKLIST.md). Bộ [15 kịch bản UAT](docs/UAT_PLAN.csv) cùng [biên bản nghiệm thu](docs/UAT_SIGNOFF_DRAFT.md) đã được chuẩn bị, kết quả thực tế còn để trống.

`npm.cmd run delivery:check` kiểm tra PR chỉ đọc; `npm.cmd run delivery:merge` chỉ merge khi có approval độc lập đúng commit, đủ CI và không xung đột. Không tự tạo review hoặc dùng quyền admin vượt rules.

[GitHub Codespaces](docs/FREE_HTTPS_DEMO.md) là phương án demo HTTPS trong hạn mức miễn phí: cấu hình Node24 đã có, chạy `npm run codespace`, dùng mật khẩu riêng từ Codespaces secret. Cần chủ tài khoản tạo Codespace và kiểm link thật; website dừng khi Codespace dừng. SQLite được giữ trong workspace, cần tải backup trước khi xóa. Chưa có URL triển khai được xác nhận.

Khi dùng reverse proxy đổi Host, đặt APP_ORIGIN là origin HTTPS thực tế (không có dấu / cuối); ứng dụng chỉ chấp nhận Origin đã cấu hình và không tin header forwarding do client gửi.

## Công việc PM và evidence

[Bàn giao PM TanTai08](docs/roles/PM.md) đã liên kết đầu ra và điều kiện còn thiếu của6 nhiệm vụ. [Bộ PM](docs/pm/README.md) có scope/AC, phiếu khảo sát, Review/Retro chuẩn bị, Sprint2 đề xuất, WBS Dictionary20 gói, risk/decision log và runbook bảo vệ. PDF/DOCX07 nằm trong reports; slide10 trang đã được cập nhật cùng speaker notes. Chỉ số snapshot có thời điểm thực tế; biểu mẫu chưa thay chữ ký hoặc hoạt động chưa diễn ra.
