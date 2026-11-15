# Thiết lập GitHub (chưa thực hiện trên repo)
1. Chủ repo kiểm tra đúng tài khoản TanTai08. Mời 4 người còn lại sau khi xác nhận username. Phiên Codex hiện dùng ngonhat21, mới có quyền READ.
2. Đưa source lên qua nhánh và PR khi repo đã có main. Nếu repo hoàn toàn trống, chủ repo khởi tạo README làm commit đầu trước, sau đó mở PR cho phần triển khai. Không thêm commit lùi ngày.
3. Tạo Project dạng Board trong tài khoản TanTai08, liên kết WebSouvenir. Tạo Status: Backlog, Ready, In Progress, In Review, Done.
4. Tạo trường Iteration/Sprint, Estimate (Number), WBS (Text). Khởi tạo Sprint 1 và Sprint 2 theo lịch học thực tế.
5. Chạy scripts/create_issues.py từ thư mục repo khi quyền đã đủ; script bỏ qua tiêu đề đã có. Thêm các Issue vào Project. Ước lượng lại qua Planning Poker trước khi khóa phạm vi Sprint.
6. Tạo Milestones: Charter, WBS, Sprint 1, Sprint 2, UAT, Evidence, Defense; điền ngày thực tế.
7. Settings → Rules/Branches: yêu cầu PR, 1 approval, CI verify, chặn force-push/deletion trên main; tính khả dụng tùy gói GitHub. Kiểm tra bằng PR thật.
8. Cập nhật trạng thái mỗi ngày làm việc. Xuất/ghi lại dữ liệu board và ảnh ở đầu, giữa, cuối Sprint. Giữ Issue, PR và thời điểm đóng làm nguồn bằng chứng.
9. Burndown: GitHub Projects có biểu đồ khác nhau tùy gói; nếu thiếu Burndown chuẩn, dùng sheet Burndown trong workbook được cung cấp và ghi rõ đây là biểu đồ lập từ snapshot board. Không dùng số liệu mô phỏng. Phạm vi đổi phải có CR và đường tổng scope cập nhật.
10. Sau UAT mới tạo release v1.0.0 tại Releases → Draft a new release, chọn commit đã review và CI xanh. Hiện source là bản phát triển 0.1.0.
11. Trước nộp: repo/project đủ quyền xem, website HTTPS; thử bằng cửa sổ ẩn danh. Không công khai dữ liệu khách hàng, mật khẩu hay database.
