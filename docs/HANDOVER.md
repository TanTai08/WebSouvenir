# Bàn giao cho nhóm 5 người
Thông tin tập trung: config/team.json. PM @TanTai08, bốn slot còn lại đã chuẩn bị, chưa gán tên giả. Khi nhận GitHub, dùng scripts/assign_member.py để cập nhật và gán Issue. Chạy --help để xem cú pháp; không cần sửa code ứng dụng khi đổi thành viên.
Họ tên, MSSV, tỷ lệ đóng góp vẫn cần bổ sung cho form học phần. Tài khoản ứng dụng admin/staff độc lập với thành viên GitHub.

## Mỗi vai trò cần review gì
- PM: docs/01_Project_Charter_DRAFT.md, WBS, backlog, lịch và scope; xác nhận môn Pathway 1, stakeholder; điều phối họp; cập nhật Project; phê duyệt thay đổi cùng PO/Tech Lead.
- Tech Lead: server.js, schema và giao dịch; workflow CI; Docker/hosting; script backup; kiểm tra restore và quyền main. Có trách nhiệm giải thích kiến trúc trước hội đồng.
- Backend: đọc từng API, chạy test, kiểm tra idempotency và rollback; bổ sung nghiệp vụ đã thống nhất; tự tạo PR cho phần chỉnh sửa thực tế.
- Frontend: review public/, chạy với backend; kiểm tra desktop/mobile, keyboard, lỗi mạng, double-click, giỏ hàng; chụp bằng chứng UI thực.
- QA: tests/, TEST_MATRIX.csv; chạy lại và ghi kết quả/bug; tổ chức UAT; kiểm tra DoD và evidence. Test tự động không thay UAT.

## Công việc sẵn sàng review
Có mã nguồn, test API, CI, tài liệu kỹ thuật và mẫu biểu. Không đóng Issue chỉ vì có mã sinh sẵn. Từng người kiểm tra, sửa nếu cần, ghi kết quả thật rồi nhờ người khác review.

## Chạy bản demo
Node 24; ADMIN_PASSWORD ít nhất 12 ký tự; npm start. Dùng DB_PATH riêng cho demo. DEMO_CONFIRM=YES ADMIN_PASSWORD=... node scripts/demo.mjs tạo sản phẩm có nhãn DEMO. Không dùng demo như số liệu người dùng thật.

## Backup và restore
node scripts/backup.mjs data/giftshop.db /duong-dan-an-toan/backup.db
Script dùng SQLite online backup, an toàn với WAL. Không commit file dữ liệu. Khôi phục: dừng server; backup hiện trạng; thay database bằng bản đã kiểm integrity; loại WAL/SHM cũ của database đích khi server đã dừng; khởi động với DB_PATH đúng; đối chiếu đơn/tồn kho; ghi biên bản. Chạy thử trên bản sao trước.

## Triển khai
Có Dockerfile và render.yaml. Cần dịch vụ Node 24, HTTPS, volume lưu bền, secrets ADMIN_PASSWORD và COOKIE_SECURE=1. Render có disk trả phí; chưa phát sinh đăng ký/chi phí. Không dùng ổ tạm miễn phí để lưu dữ liệu bàn giao. URL production và nhà cung cấp chưa được xác nhận. Không thể hoàn tất deployment nếu chưa có nơi chạy máy chủ phù hợp.

## Kiểm tra trước nộp
Đủ thông tin 5 người, môn kế thừa và stakeholder; Charter được ký; WBS được duyệt; Risk tuần6/11; Retro/CR thật; PR review và CI; lịch sử board và Burndown; UAT; HTTPS; release v1.0.0; hồ sơ 5 nhóm; quyền Drive view. Nếu thiếu hoạt động học kỳ, báo giảng viên để xử lý đúng, không tạo lịch sử lùi ngày.
