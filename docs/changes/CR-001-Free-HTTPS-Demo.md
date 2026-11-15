# CR-001 — Ưu tiên demo HTTPS miễn phí

Trạng thái: **đã phân tích và chuẩn bị phương án, chờ nhóm/stakeholder duyệt giới hạn**. Không phải biên bản Week 11 đã hoàn tất.

- Ngày ghi nhận: 15/11/2026, thời điểm thực tế của yêu cầu trong phiên làm việc.
- Nguồn yêu cầu: người dùng/PM trả lời “Chưa có hosting, ưu tiên miễn phí”. Không ghi thêm người tham dự hoặc chữ ký.
- Baseline cũ: cấu hình render.yaml dùng Node24, HTTPS và persistent disk trên gói có phí; chưa provision/deploy dịch vụ.
- Yêu cầu thay đổi: tìm phương án không phải mua hosting cho giai đoạn demo/nghiệm thu.
- Phương án đã chuẩn bị: GitHub Codespaces với Node24, forwarding HTTPS, mật khẩu riêng, SQLite trong workspace; dừng Codespace sẽ dừng website. Có devcontainer, launcher và runbook.
- Phạm vi không đổi: nghiệp vụ sản phẩm/kho/bán/hủy/thống kê và API. Không chuyển sang PostgreSQL hoặc thêm thanh toán online.
- Tác động tới chất lượng nghiệm thu: demo có thể thực hiện khi máy chạy; chưa đáp ứng URL production hoạt động liên tục. Cần hỏi stakeholder/giảng viên có chấp nhận demo này trong bài nộp hay không.
- Chi phí: dự kiến trong hạn mức Codespaces miễn phí của tài khoản; chủ tài khoản phải kiểm quota trước tạo. Không đặt mua dịch vụ và không khẳng định miễn phí vô hạn.
- Tiến độ: phụ thuộc việc chủ tài khoản tạo Codespace, mở cổng và chạy UAT. Không tự ghi giờ công, story point hoặc ngày hoàn thành thực tế thay nhóm.
- Rủi ro mới R12: stop/quota làm URL không sẵn sàng; xóa workspace mất SQLite. Mitigate bằng kiểm quota, mở máy trước bảo vệ, backup tải về và bản local dự phòng.
- Kiểm chứng đã có: test Node cho APP_ORIGIN khi proxy đổi Host, cookie Secure và từ chối Origin khác; launcher từ chối chạy ngoài Codespaces. Chưa kiểm provisioning/forwarding/persistence trên Codespace thật.
- Điều kiện chấp nhận: URL HTTPS thực tế dùng được, khởi động lại còn dữ liệu, phục hồi bản sao đúng và stakeholder chấp thuận giới hạn lịch hoạt động.
- Tệp liên quan: .devcontainer/devcontainer.json, scripts/start-codespace.mjs, src/origin.js, tests/origin.test.js, docs/FREE_HTTPS_DEMO.md; theo dõi tại Issue #18, tham chiếu quản lý thay đổi ở #16.

## Quyết định thực tế

PM đã yêu cầu ưu tiên miễn phí; chưa có quyết định của CCB/stakeholder về việc thay tiêu chí production bằng demo.

[ ] Chấp nhận phương án demo  [ ] Yêu cầu hosting khác  [ ] Hoãn

Người duyệt / vai trò / ngày thực tế: ______________________________
Lý do và điều kiện: ______________________________
Link deployment / UAT / nghiệm thu sau khi thực hiện: ______________________________

Không dùng tài liệu này để ghi lùi mốc Sprint/Week 11. Chỉ cập nhật baseline nghiệm thu sau khi quyết định thực sự được xác nhận.
