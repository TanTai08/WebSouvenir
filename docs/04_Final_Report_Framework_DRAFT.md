# Khung báo cáo tổng kết và checklist bằng chứng

**DỰ THẢO — CHƯA PHÊ DUYỆT / CHƯA ĐỦ ĐIỀU KIỆN NỘP CUỐI KỲ**

## Trạng thái và hướng dẫn sử dụng

Đây là khung báo cáo và bản ghi phát triển ban đầu, CHƯA phải Final Report 15–25 trang. Không kéo dài bằng nội dung giả. Khi hoàn thành cần viết 7 chương theo quá khứ, dẫn Issue/PR/commit/CI/test/biên bản thật. Chưa có dữ liệu học kỳ hay nghiệm thu.

## Chương 1. Tổng quan và Business Case

Đã xác nhận tên miền bài toán: quản lý cửa hàng đồ lưu niệm; repo đích TanTai08/WebSouvenir; PM @TanTai08. Chưa khảo sát cửa hàng hoặc xác nhận môn kế thừa. Bổ sung bối cảnh có nguồn, vấn đề định lượng nếu có, mục tiêu SMART được duyệt và kết quả đạt/chưa đạt.

## Chương 2. Phương pháp và tổ chức

Nhóm đã chọn định hướng Agile/Scrum. Chưa có bằng chứng họp Planning/Daily/Review/Retro. Bổ sung lịch thực tế, PO, vai trò 5 người, họ tên/MSSV/GitHub, phần đóng góp và lý do phù hợp. Không khẳng định đã thực hành Scrum chỉ vì chọn tên phương pháp.

## Chương 3. Scope và WBS

Bản khởi tạo đã mô tả phạm vi quản lý nội bộ; chưa có phê duyệt scope baseline. Bổ sung WBS được duyệt, từ điển gói việc, RTM chức năng → Issue → test → UAT, lý do loại các chức năng ngoài phạm vi.

## Chương 4. Ước lượng, lịch trình và vận tốc

Backlog.csv có ước lượng sơ bộ do trợ lý đề xuất, không phải kết quả Planning Poker. Nhóm cần ước lượng lại; lưu CPM và lịch thực, tổng điểm cam kết và hoàn tất theo từng Sprint. Velocity = điểm các việc đạt DoD trong Sprint; không dùng số commit thay Velocity. Burndown sử dụng snapshot hàng ngày; dữ liệu chưa có để vẽ kết quả thật.

## Chương 5. Thực thi và chất lượng

Bản mã ban đầu đã có API Node/SQLite, giao diện HTML/CSS/JS, cookie session, phân quyền và transaction khi bán/hủy đơn. Kiểm thử tự động tại phiên phát triển đã qua luồng xác thực, kiểm quyền, mã trùng, nhập số lượng âm, bán vượt tồn, hai yêu cầu đồng thời, hủy lặp, hoàn kho, CSRF và logout. Đây là kết quả chạy cục bộ, chưa phải GitHub CI hay UAT. Browser QA chưa thực hiện. Bổ sung commit SHA, link PR/review, CI run, ma trận test, ảnh chạy thật và lỗi còn mở.

## Chương 6. Rủi ro và kiểm soát thay đổi

Đã ghi nhận quyền GitHub phiên hiện tại chỉ READ và chưa có khả năng publish trong môi trường. Workbook giữ Risk initial, Week06 và Week11 riêng; hai mốc cập nhật chưa diễn ra. Chưa có CR nghiệp vụ được stakeholder phê duyệt. Quyết định chọn Node/SQLite là phương án kỹ thuật của bản khởi tạo, không thay thế CR thực tế theo yêu cầu môn.

## Chương 7. Nghiệm thu, đóng dự án và bài học

Chưa có deployment HTTPS, nghiệm thu, Final Retro hay release 1.0.0. Bổ sung UAT pass/fail theo từng AC, email/biên bản xác nhận, lỗi được chấp nhận, hướng dẫn vận hành, backup, bài học từ sự kiện đã xảy ra. Chỉ ghi đóng dự án sau khi các bên đồng ý.

## Evidence checklist và quy tắc biên tập

[ ] Charter được ký; [ ] WBS được duyệt; [ ] Risk tuần 6 và 11; [ ] lịch sử Sprint 1/2; [ ] Retro; [ ] CR được duyệt; [ ] UAT sign-off; [ ] repo/PR/review/CI; [ ] HTTPS; [ ] release 1.0.0; [ ] Final Report 15–25 trang; [ ] slide 8–10; [ ] rubric; [ ] link Drive xem được.
Mỗi bằng chứng ghi: loại, ngày thật, người thực hiện, link/tên tệp, tiêu chí liên quan. Không ký thay, không hồi tố, không biến mục tiêu kế hoạch thành kết quả đã đạt.

