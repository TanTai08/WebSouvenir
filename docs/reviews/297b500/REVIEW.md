# Technical review và QA — source297b500

Thời điểm lập hồ sơ (Asia/Bangkok): 2026-11-15T20:32:35+07:00

Người thực hiện: Codex hỗ trợ kỹ thuật theo yêu cầu PM. Đây không phải peer approval của Tiến/Hoàng, không phải UAT hoặc biên bản nhóm đã họp.

Source chính xác: 297b50014155cd080ca237a775beda53e4ff299b
CI đã đọc trạng thái: https://github.com/TanTai08/WebSouvenir/actions/runs/43719093338 — verify/browser/container đều SUCCESS.
Manifest: docs/reviews/297b500/manifest.json. Working tree sạch tại thời điểm chạy.

## 1. Kiến trúc đã đối chiếu — Issue#4

- [x] Đối chiếu ERD với schema thực users/sessions/products/orders/items/movements/checkout_requests.
- [x] Kiểm tra tiền nguyên VND, SKU duy nhất, tồn không âm, transaction bán/hủy, snapshot tên/giá và idempotency.
- [x] Kiểm tra phân quyền server, session cookie và hash mật khẩu; test không trả salt/hash qua users/me.
- [x] Đối chiếu thống kê UTC+7 và loại đơn cancelled bằng fixture xác định.
- [ ] Tiến và nhóm xác nhận đã đọc/hiểu kiến trúc theo tiêu chí Issue#4.

Entry server.js; DB src/database.js; auth src/security.js và src/routes/auth.js; nghiệp vụ src/routes; UI public/lib và public/views. Không tìm thấy lỗi chặn các luồng đã kiểm tra. Các giới hạn bên dưới vẫn cần được chấp nhận hoặc xử lý.

## 2. Kiểm thử đã chạy — Issue#10 và#17

- [x] Syntax check, ESLint, Prettier: đều exit0.
- [x]10 Node tests: API tổng thể; restart giữ mật khẩu/data; xung đột port; xác nhận giá; rollback đa dòng; limiter riêng account; đổi password đồng thời; đối chiếu ledger; ngày UTC+7; response không lộ hash/body quá lớn.
- [x]8 Chromium cases: login sai; admin nhập/bán/hủy; staff; mobile390x844; đổi password; xác nhận giá đổi; reset giỏ sau session mất hiệu lực; escape HTML/script trong sản phẩm.
- [x] Docker build và thay container cùng volume: login, sản phẩm, tồn và đơn còn đúng.
- [x] Ma trận kết quả: docs/TEST_MATRIX.csv; log Node thực: docs/reviews/297b500/node-test.log.
- [ ] Thành viên review kết quả, approve PR và merge theo DoD.

Dữ liệu test được tạo riêng trong thư mục tạm/volume CI. Các mốc thời gian đặt trong fixture chỉ để kiểm tra ranh giới UTC+7, không phải lịch sử giao dịch hoặc tiến độ học kỳ thật.

## 3. Rủi ro cập nhật thực tế — Issue#10

Workbook reports/03_Risk_Register_DRAFT.xlsx có sheet Sprint1_Actual, ghi cập nhật kỹ thuật ngày15/11 từ các sự kiện tái hiện trong quá trình phát triển. Không đổi sheet Week06/Week11 thành hồ sơ đã duyệt.

- Giá thay đổi khi đã có giỏ: đã sửa bằng expected_price và409; có regression và browser test.
- Đổi password làm demo restart lỗi: đã sửa bỏ seed DB cũ; có regression restart.
- Limiter theo IP chung: đã sửa theo account; có test2 account cùngIP.
- Giới hạn quyền Projects của app: vẫn còn, chủ repo có thể cập nhật bằng CLI cá nhân.
- HTTPS production và stakeholder: chưa có bằng chứng hoàn tất.

## 4. Tiêu chí chấp nhận và nguồn bằng chứng

|Issue|Bằng chứng kỹ thuật|
|---|---|
|#6 login/role|tests/api.test.js, tests/regressions.test.js, E2E staff/login|
|#7 products|API duplicate/validation, E2E tạo sản phẩm|
|#8 product UI|E2E tìm/sửa và escape HTML|
|#9 nhập kho|API và ledger reconciliation|
|#12 bán hàng|Concurrency, stale quote, rollback, idempotency|
|#13 giỏ hàng|E2E bán, xác nhận giá, reset session|
|#14 hủy|Chặn staff, chống hủy lặp, hoàn kho/doanh thu|
|#15 thống kê|Ledger totals và midnight UTC+7/cancel exclusion|
|#17 QA|Matrix,10 Node/8 browser, Docker smoke|

## 5. Phần còn cần thực hiện

- Người khác tác giả PR phải review; app đang kết nối là TanTai08, cũng là tác giả PR#1 nên không tự tạo peer approval.
- Issue#4 chưa có bằng chứng cả nhóm hiểu; Issue#10 còn cập nhật xuyên Sprint, không chốt hết Sprint khi chưa kết thúc.
- HTTPS production, UAT/sign-off, Retro, scope CR và dữ liệu Burndown nhiều ngày chưa được hồ sơ này xác nhận.
- Chưa kiểm mọi độ phân giải, mạng lỗi/bàn phím hoặc tải production; SQLite/limiter dành cho một instance.

## 6. Thao tác cuối trên GitHub

Tiến mở PR#1 → Files changed, kiểm tra các file trọng yếu và bằng chứng ở đây → Review changes. Nếu đồng ý mới chọn Approve; nếu phát hiện vấn đề chọn Request changes.
PM chỉ merge khi các điều kiện DoD đạt. PR sẽ liên kết đóng9 Issue chức năng/QA khi merge vào main; không tự đóng các Issue khảo sát, quản trị, UAT hoặc triển khai chưa đạt.

Để ghi tiến độ kỹ thuật lên bảng bằng CLI đã đăng nhập trên máy chủ repo:
`git pull --ff-only` rồi `npm.cmd run qa:progress -- --apply`.
Lệnh đặt#4 In Review,#10 In Progress,#17 In Review, giữ nguyên Done nếu người dùng đã xác nhận từ trước. Không đóng Issue hay giả lập review của thành viên.
