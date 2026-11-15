# GS20 — Kịch bản bảo vệ6+5+5 phút

Đây là kịch bản chuẩn bị, chưa ghi nhận buổi diễn tập. Mỗi người chỉ trình bày phần mình hiểu/đã kiểm chứng; không nhận thay công việc chưa làm.

##6 phút thuyết trình /10 slide

| Slide | Thời gian dự kiến | Người nói đề xuất | Nội dung |
|---|---|---|---|
|1 |00:00–00:30 | PM | Đề tài, mục tiêu và trạng thái hiện tại |
|2 |00:30–00:55 | PM | Người dùng dự kiến, nhu cầu cần xác nhận |
|3 |00:55–01:20 | PM | In/out scope và tiêu chí chấp nhận |
|4 |01:20–02:05 | Tech Lead | Kiến trúc, dữ liệu, transaction |
|5 |02:05–02:40 | PM | Vai trò/Scrum và lý do lựa chọn |
|6 |02:40–03:15 | PM | Board, điểm đề xuất và thiếu lịch sử |
|7 |03:15–04:05 | QA |19 Node/8 Chromium/Docker và giới hạn |
|8 |04:05–04:50 | PM | Risk/CR hosting miễn phí, chờ duyệt |
|9 |04:50–05:25 | Backend | Điều kiện nghiệm thu và nghiệp vụ |
|10 |05:25–06:00 | PM | Kết quả có nguồn và việc còn lại |

##5 phút demo

- 00:00–01:00 Frontend đăng nhập DB demo riêng, tìm sản phẩm TEST giá25000, cho thấy tồn5 đã chuẩn bị.
- 01:00–02:00 Frontend thêm2 hàng vào giỏ, đối chiếu tổng50000 rồi xác nhận.
- 02:00–03:00 Frontend cho thấy tồn3 và thử vượt tồn bị chặn.
- 03:00–04:00 Backend/Admin hủy đơn, đối chiếu tồn5 và doanh thu loại đơn hủy; không hủy lần hai.
- 04:00–04:30 QA chỉ mã đơn/test/log minh chứng; nói rõ dữ liệu demo.
- 04:30–05:00 Tech Lead nêu nơi lưuDB/backup, khả dụng hosting và giới hạn chưa kiểm.

Dữ liệu demo không dùng như giao dịch thật. Chỉ mở URL HTTPS đã kiểm được; nếu Codespace chưa tạo thì giới thiệu bản local và ghi rõ điều kiện chưa đạt.

##5 phút Q&A — người phụ trách

PM: vì sao chọn Scrum,100% Rule, điểm đề xuất khác velocity, risk/CR và tiến độ thật.
Tech Lead: vì sao SQLite một instance, transaction và volume/backup.
Backend: idempotency, expected_price, kiểm quyền và hoàn kho một lần.
Frontend: escapeHTML, giỏ hàng, giá đổi, phiên hết hạn và responsive.
QA: test tự động khác UAT, lỗi còn mở và tiêu chí nghiệm thu.

Trả lời đúng giới hạn: chưa khảo sát thì nói chưa khảo sát; chưa có approval/sign-off thì không nhận đã có. Lịch sử commit sau đổi metadata/merge không chứng minh công việc đã làm tháng9 hoặc xuyên học kỳ.

## Checklist dự phòng

[ ] Pull đúng nhánh trước diễn tập; [ ] Node 24; [ ] password đúng; [ ] DB demo riêng và backup tải về; [ ] giữ terminal/server; [ ] test đường mạng/URL trước trình bày; [ ] PDF/PPTX offline; [ ] bản local chạy khi hosting dừng; [ ] quay video thật nếu nhóm lựa chọn và ghi phiên bản/ngày.

## Biên bản diễn tập để điền

Ngày/giờ thực tế: __________. Người tham dự thật: __________. Commit/demoDB: __________.
Thuyết trình: ___ phút; demo: ___ phút; Q&A: ___ phút.
Lỗi/vượt thời gian: __________. Hành động / owner / hạn sửa: __________.
Link ảnh/video/ghi nhận được phép sử dụng: __________. Người xác nhận: __________.
