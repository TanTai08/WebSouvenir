# Kế hoạch Project để nhóm xác nhận
Project: https://github.com/users/TanTai08/projects/1
PM chọn Sprint1 bắt đầu08/11/2026; Sprint2 bắt đầu22/11; Sprint3 bắt đầu06/12, mỗi Sprint14 ngày.
Điểm trong config/project-plan.json là ƯỚC LƯỢNG ĐỀ XUẤT, không phải kết quả Planning Poker đã họp.

## Cách áp dụng khi kết nối ChatGPT thiếu quyền ghi Projects
Trên máy chủ repo đã cài Node24:
1. Cài GitHub CLI nếu chưa có: `winget install --id GitHub.cli -e`, sau đó mở lại VS Code.
2. `gh auth login --hostname github.com --web --scopes project` và đăng nhập TanTai08. Nếu đã login, dùng `gh auth refresh -h github.com -s project`.
3. Mở đúng thư mục source, chạy `npm.cmd run project:plan` để xem, rồi `npm.cmd run project:apply` để áp dụng. Hoặc bấm setup-project.bat sau khi đã login.
Không gửi token/mật khẩu vào chat; script dùng phiên gh trên máy và không nhận credential qua đối số.

## Nguyên tắc cập nhật
Giữ nguyên Story Points/Sprint đã nhập. Status chỉ cập nhật khi còn Backlog hoặc trống, không ghi đè trạng thái nhóm đã thay đổi. Tám Issue chức năng đã có mã/test ở PR#1 được đề xuất In Review; chưa Done vì chưa có peer approval. Kiến trúc/CI/deploy để Ready; các việc cần stakeholder, Retro, CR và nghiệm thu giữ Backlog. QA @Hoangtrong-S1 đã có assignee ở các Issue #10, #17, #19.
Gán Sprint là kế hoạch phạm vi, không xác nhận công việc đã xảy ra từ08/11. Script ghi thời điểm chạy hiện tại ở data/project-setup-result.json để tránh nhầm với lịch sử học kỳ.

## Burndown
Sau khi nhóm chốt ước lượng, lưu snapshot scope/remaining mỗi ngày làm việc từ ngày ghi thực tế. Có thể dùng workbook Risk sheet Burndown đã chuẩn bị; không tự sinh đường lịch sử trước thời điểm ghi nhận. Issue Done chỉ khi đạt DoD. Thay đổi scope phải dẫn CR. GitHub Insights có loại biểu đồ tùy gói; đối chiếu yêu cầu môn nếu dùng burnup thay burndown.

## Quyền thành viên
Repo write và Project write khác nhau. Chủ Project vào Settings → Manage access, cấp Write cho Txtien-225, LQT23072005, ngonhat21 và Hoangtrong-S1 nếu cần tự cập nhật board. QA @Hoangtrong-S1 đã được thêm vào repo.

## Ghi snapshot thật
Sau mỗi lần cập nhật trong ngày làm việc, chạy `npm.cmd run project:snapshot`. Script ghi thời điểm hiện tại và dữ liệu thực từ Project vào docs/project_snapshots. Chưa điền điểm/Sprint thì giá trị null được giữ nguyên, không giả làm0. Commit snapshot theo ngày thực để có nguồn lập Burndown.
