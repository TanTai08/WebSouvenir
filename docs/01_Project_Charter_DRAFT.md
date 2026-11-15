# Điều lệ dự án GiftShop

**DỰ THẢO — CHƯA PHÊ DUYỆT / CHƯA ĐỦ ĐIỀU KIỆN NỘP CUỐI KỲ**

## 1. Thông tin chung

Tên đề xuất: GiftShop — Website quản lý cửa hàng đồ lưu niệm. Mã đề xuất: VKU-GIFT (nhóm xác nhận). Repo đích: https://github.com/TanTai08/WebSouvenir. PM: @TanTai08. Tên nhóm, lớp, họ tên/MSSV, lịch và link Project: CHƯA CUNG CẤP. Phiên bản tài liệu 0.1 — Draft.

## 2. Nguồn gốc đề tài

Pathway 1 — kế thừa/song hành đồ án chuyên ngành, theo lựa chọn của nhóm. CHƯA xác nhận môn chuyên ngành và giảng viên hướng dẫn; cần bổ sung trước phê duyệt. Chưa có stakeholder hoặc đơn vị sử dụng được xác nhận.

## 3. Bối cảnh và giá trị nghiệp vụ

Giả thuyết cần khảo sát: cửa hàng ghi hàng và đơn thủ công có thể khó đối chiếu tồn kho và doanh thu. Giải pháp đề xuất: website nội bộ quản lý danh mục, nhập hàng, bán hàng và lịch sử. Đây là giả thuyết, không phải kết luận khảo sát hay số liệu thực tế. PM cần phỏng vấn người dùng, lưu ngày, người tham gia và xác nhận nhu cầu.

## 4. Mục tiêu SMART dự kiến

M1: trước cuối Sprint 1 theo lịch được duyệt, hoàn thành đăng nhập, phân quyền, sản phẩm và nhập kho, được kiểm tra theo AC.
M2: trước cuối Sprint 2, hoàn thành bán hàng, hủy đơn, thống kê; kiểm tra không âm kho khi hai yêu cầu cùng bán lượng hàng cuối.
M3: mọi thay đổi code sau thiết lập quy trình phải qua PR, có ít nhất 1 review và CI thành công.
M4: trước buổi nghiệm thu được thống nhất, có HTTPS, persistent database, chạy đủ kịch bản UAT và xác nhận từ người nghiệm thu. Chưa có ngày, số người dùng hoặc cam kết hiệu năng chính thức.

## 5. Phạm vi và giới hạn

Trong phạm vi: đăng nhập; 2 vai trò admin/staff; CRUD sản phẩm với lưu trữ khi tồn bằng 0; nhập kho; bán hàng nhiều sản phẩm; kiểm tra tồn; hủy toàn bộ đơn và hoàn kho; thống kê doanh thu, hàng bán chạy; quản trị dự án, kiểm thử, triển khai và hồ sơ.
Ngoài phạm vi: shop thương mại điện tử cho khách tự mua, thanh toán trực tuyến, vận chuyển, đa chi nhánh, đổi trả từng phần, IoT, ứng dụng di động, hóa đơn điện tử pháp lý. Tiền VND nguyên; doanh thu là tổng đơn đã thanh toán, không gồm đơn hủy, chưa tính lợi nhuận/thuế/chiết khấu.

## 6. Stakeholder và cách phối hợp

PM @TanTai08: điều phối, quyền quan tâm cao. Bốn thành viên: chưa xác định. Giảng viên môn QLDA: TS. Nguyễn Thanh Tuấn, kiểm tra mốc học phần. Người nghiệm thu chuyên ngành/nhóm dùng thử: cần xác nhận; chưa có tên hay chữ ký. Dự kiến demo cuối Sprint; lịch do các bên thống nhất. Không dùng tên mẫu như người nghiệm thu thật.

## 7. Công cụ quản trị

GitHub Repository, Issues, Pull Requests, Projects và Actions. Status: Backlog → Ready → In Progress → In Review → Done. Issue có WBS ID, AC, assignee, estimate, Sprint, Milestone. Branch protection, review và CI cần được thiết lập/kiểm chứng trên repo; hiện chưa hoàn thành. Commit Conventional Commits, không chỉnh ngày để làm giả tiến trình.

## 8. Mốc thời gian

Tuần 2: Charter; tuần 3: WBS; tuần 6: Risk update 1; tuần 7: Retro Sprint 1 + kế hoạch Sprint 2; tuần 11: Risk update 2 + CR thật; tuần 13: UAT + Final Retro; tuần 14: kiểm tra evidence; tuần 15: bảo vệ. Đây là mốc học phần, không phải lịch đã diễn ra. Cần quy đổi sang ngày thực tế theo hạn nộp; nếu đã trễ phải trao đổi giảng viên, không hồi tố.

## 9. Phương pháp phát triển

Agile/Scrum, dự kiến Sprint 2 tuần. PM kiêm Scrum Master; cần chỉ định Product Owner chịu trách nhiệm ưu tiên backlog. Cả nhóm có trách nhiệm tạo increment; vai trò chuyên môn không tách thành nhóm làm việc biệt lập. Mỗi Sprint có Planning, Daily Scrum trong ngày làm việc, Review với người dùng và Retrospective. Lưu biên bản và action item có người chịu trách nhiệm. Không tự nhận đã thực hiện trước khi có bằng chứng.

## 10. Thành viên và trách nhiệm

1. @TanTai08 — PM/Scrum Master; họ tên/MSSV chờ bổ sung; tỷ lệ chưa xác định.
2. Tech Lead — chờ họ tên, MSSV, GitHub; kiến trúc, DB, CI, triển khai, review.
3. Backend — chờ thông tin; API và nghiệp vụ.
4. Frontend — chờ thông tin; giao diện và tích hợp.
5. QA — chờ thông tin; test, UAT, evidence.
Tỷ lệ dự kiến cần cả nhóm thỏa thuận; cuối kỳ điều chỉnh theo đóng góp thật, tổng 100%.

## 11. Ràng buộc, giả định và rủi ro

Hạn nộp, ngân sách và yêu cầu công nghệ môn chuyên ngành CHƯA XÁC NHẬN. Bản khởi tạo dùng Node.js 24, SQLite và HTML/CSS/JS thuần; cần nhóm duyệt vì trước đó mới đề xuất React/Supabase. SQLite yêu cầu ổ lưu bền; Render có volume thường cần gói trả phí. Chưa đăng ký dịch vụ trả phí. Rủi ro: quyền GitHub chưa đủ; mất dữ liệu trên disk tạm; bán trùng do retry; thiếu người nghiệm thu; yêu cầu mở rộng ngoài phạm vi. Xem workbook Risk Register.

## 12. Thành công và Definition of Done

Sản phẩm chạy HTTPS, AC đúng, không lỗi nghiêm trọng trong UAT, có sign-off thật và đủ evidence. Mỗi Issue Done khi code/test/tài liệu hoàn tất, PR có ít nhất 1 người khác duyệt, CI xanh, QA xác nhận AC và liên kết bằng chứng. Chưa được đánh dấu Done chỉ vì Codex đã sinh mã.

## 13. Phê duyệt

PM: __________________ Họ tên / ngày / chữ ký.
PO/người nghiệm thu: __________________ Họ tên / vai trò / ngày / chữ ký.
Giảng viên: __________________ Ngày / chữ ký.
Không có chữ ký hoặc phê duyệt nào được tạo thay trong bản dự thảo.

