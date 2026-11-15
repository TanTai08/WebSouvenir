# GS10 — Sprint 1 Review và Retrospective chuẩn bị

Lịch Sprint 1 trên Project:08–21/11/2026. Chưa ghi nhận cuộc Review/Retro thực tế; chưa ghi Sprint 1 đã kết thúc hay hoàn thành. Nhãn Sprint và ngày bắt đầu là kế hoạch PM đã nhập, không chứng minh có hoạt động từ08/11.

## Agenda dự kiến30 phút

- 5 phút: PM đối chiếu mục tiêu, phạm vi và snapshot hiện tại; không tính In Review như Done.
- 10 phút: nhóm demo đăng nhập → sản phẩm → nhập kho; trình bày test/lỗi, lấy phản hồi thật.
- 10 phút: từng người nêu điều tốt/chưa tốt/bài học; tìm nguyên nhân và chọn hành động.
- 5 phút: chốt owner, deadline, cách kiểm lại và việc chuyển sang kế hoạch Sprint 2.

Ngày giờ thực tế: __________. Người chủ trì: __________. Người tham dự thật: __________.
Stakeholder có tham gia Review: __________. Link biên bản/ghi âm được phép dùng: __________.

## Quan sát đã có nguồn để thảo luận

- Source/CI đã có, nhưng snapshot ngày 15/11 chưa có Issue Done và chưa có peer approval; cần kiểm AC trước khi nhận hoàn thành.
- Regression đã xử lý giá giỏ cũ, restart sau đổi mật khẩu, khóa đăng nhập theo tài khoản; đây là tình huống fixture, không phải lỗi do khách hàng báo.
- Chat có quyền đọc Project nhưng sửa bị FORBIDDEN; CLI của PM đã chuyển4 Issue sang In Progress. Cần giữ một quy trình cập nhật phù hợp quyền thật.
- Chưa có stakeholder/URL HTTPS/UAT; đây là phụ thuộc còn mở.

Nguồn: EVIDENCE_SNAPSHOT.json, Risk Sprint1_Actual, docs/reviews/297b500, CI của commit được quan sát. Không điền các nhận xét này như lời phát biểu của thành viên.

## Bảng Retro để điền khi họp

| Chủ đề | Quan sát của người tham gia | Nguyên nhân | Hành động được thống nhất |
|---|---|---|---|
| Điều làm tốt | | | |
| Điều gây chậm/lỗi | | | |
| Điều cần thử Sprint 2 | | | |

## Hành động đề xuất, chưa phải quyết định cuộc họp

| ID | Hành động để nhóm xem xét | Owner đề xuất | Deadline thực tế | Tiêu chí kiểm lại |
|---|---|---|---|---|
| A01 | Review phần phụ trách và ghi kết quả trên PR |4 thành viên ngoài PM | | Review đúng commit, lỗi xử lý |
| A02 | Chốt người nghiệm thu và giới hạn demo miễn phí | PM | | Có xác nhận stakeholder |
| A03 | Kiểm HTTPS, stop/start và restore bản sao | Tech Lead + QA | | URL/log/backup khớp |
| A04 | Xác nhận capacity và ước lượng Sprint 2 | PM + cả nhóm | | Kế hoạch có người cam kết |

Kết quả được chấp nhận của Sprint 1: __________. Việc chưa đạt/carry-over và lý do: __________.
Hành động được chọn / người xác nhận / thời điểm: __________.
