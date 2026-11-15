#1 — WebSouvenir / GiftShop
Website nội bộ quản lý cửa hàng đồ lưu niệm
Pathway1, Agile/Scrum;  môn kế thừa còn chờ xác nhận
Nhóm5 người;  PM TanTai08
Bản hiện trạng, chưa nghiệm thu cuối kỳ
Ghi chú: PM giới thiệu30 giây. Nêu rõ bản demo và các điều kiện chưa đủ;  không trình bày như dự án đã được chấp nhận.

#2 — Người dùng và vấn đề cần xác nhận
Người dùng dự kiến: quản trị viên và thu ngân
Giả thuyết: khó đối chiếu hàng nhập, tồn và doanh thu
Đã có phiếu 10 câu hỏi và scope/AC đề xuất
Stakeholder và kết quả phỏng vấn: chưa xác nhận
Ghi chú: PM nói25 giây. Phân biệt giả thuyết nghiệp vụ với dữ liệu khảo sát thật;  thông tin chưa có để trống.

#3 — Phạm vi và tiêu chí chấp nhận
Login/quyền, sản phẩm, nhập kho, bán và hủy đơn
Dashboard theo ngày UTC+7, backup và bàn giao
Ngoài scope: thanh toán online, vận chuyển, đa chi nhánh
Không âm kho, không tạo trùng đơn, hoàn kho một lần
Ghi chú: PM nói25 giây. Ví dụ tồn5 bán2 còn3;  retry cùngkey tạo cùngorder. Không mở rộng nghiệp vụ nếu chưa xử lý CR.

#4 — Kiến trúc và WBS
Trình duyệt → Node 24 API → SQLite
Backend/UI đã tách module theo chức năng
Transaction, kiểm quyền server, giá xác nhận và idempotency
WBS 20 gói;  thời lượng7–14 ngày là đề xuất
Ghi chú: Tech Lead nói45 giây. Giải thích một instance SQLite, DB/volume, bảngorders/items/movements và rollback khi giao dịch thất bại.

#5 — Nhóm5 người và lựa chọn Scrum
PM TanTai08;  Tech Lead Txtien-225
Backend LQT23072005;  Frontend ngonhat21;  QA Hoangtrong-S1
Sprint 2 tuần;  dùng Board, Issues, PR và CI
Planning/Review/Retro thật: còn cần thực hiện, ghi nhận
Ghi chú: PM nói35 giây. Scrum phù hợp nhóm nhỏ và phản hồi theo increment;  lịch và biểu mẫu không thay hoạt động thực tế. Không nhận đóng góp chỉ từ phân công.

#6 — Board và số liệu quan sát
Snapshot 15/11: 20 Issue, đủ 5 assignee
13 In Progress; 2 In Review; 2 Ready; 3 Backlog; 0 Done
Sprint 1:38;  Sprint 2:31;  Sprint 3:16 điểm đề xuất
Chưa có velocity hoặc lịch sử burndown đủ nhiều ngày
Ghi chú: PM nói35 giây. Nguồn pm/EVIDENCE_SNAPSHOT.json.85 điểm chưa được Planning Poker xác nhận;  không suy ra phần trăm thực thi từ số commit.

#7 — Kiểm thử và chất lượng
19 Node tests:13 app/cấu hình và6 merge gate
8 Chromium cases;  Docker build và persistent-volume smoke
CI source được quan sát: verify/browser/container SUCCESS
Peer approval và UAT thật: vẫn chờ xác nhận
Ghi chú: QA nói50 giây. Trình bày kiểm âm kho/retry/UTC+7/HTML;  phạm vi keyboard, mạng và môi trường thật chưa kiểm toàn diện. Test không thay sign-off.

#8 — Rủi ro và thay đổi có nguồn
Giá giỏ cũ, restart password và limiter đã có regression
CR-001: PM ưu tiên hosting miễn phí → đề xuất Codespaces
Quota/stop/xóa workspace ảnh hưởng URL và SQLite
CR còn chờ duyệt giới hạn;  Risk Week 06/Week 11 chưa chốt
Ghi chú: PM nói45 giây. Nêu diễn biến thật, phương án và trách nhiệm đề xuất;  không coi file CR là quyết định CCB. Rủi ro lịch sử evidence cần xử lý minh bạch.

#9 — Nghiệm thu và demo
Đã chuẩn bị15 case UAT và hướng dẫn sử dụng
Demo: nhập hàng → bán → đối chiếu tồn/doanh thu → hủy
Cần URL thật, restart/restore và người dùng xác nhận
Codespaces là demo theo giờ, chưa phải production24/7
Ghi chú: Backend nói35 giây. Dùng dữ liệu TEST, mã đơn cụ thể. Để trống URL nếu chưa triển khai;  giới thiệu local đúng trạng thái.

#10 — Bàn giao và việc cần chốt
Có 5 nhóm báo cáo, report 7 chương/15 trang và bộ PM
Tiếp theo: review → merge đúng DoD → HTTPS/UAT
Chốt thông tin thật, chữ ký, Retro/Risk/CR và diễn tập
Release v1.0.0 sau khi đủ điều kiện chấp nhận
Ghi chú: PM nói35 giây. Kết luận đúng hiện trạng;  runbook 6+5+5 phút và bản local/backup đã được chuẩn bị, chưa nhận đã diễn tập.
