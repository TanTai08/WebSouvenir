# Thực hiện các bước bàn giao

Phần kỹ thuật/tài liệu được Codex hỗ trợ chuẩn bị; phần xác nhận vẫn do người chịu trách nhiệm thực hiện. Chưa tự đóng Issue hoặc tạo release v1.0.0.

## Thứ tự thực hiện

1. Đọc gói review docs/reviews/297b500/REVIEW.md và các thay đổi sau đó. Kiểm thử: `npm.cmd run qa:verify`; kết quả/log thật nằm tại data/qa-runs. Không commit database hay secrets.
2. Một thành viên khác tác giả PR (Txtien-225, LQT23072005, ngonhat21 hoặc Hoangtrong-S1) mở https://github.com/TanTai08/WebSouvenir/pull/1, kiểm tra Files changed, CI và chạy phần phụ trách. Nếu đồng ý chọn Review changes → Approve. Nếu phát hiện lỗi chọn Request changes và mô tả. Tài khoản TanTai08 là tác giả nên không tự approve được.
3. Chủ repo đã có GitHub CLI đăng nhập chạy `npm.cmd run delivery:check`. Lệnh chỉ đọc GitHub, ghi bản kiểm tra vào data/delivery-readiness.json; exit 2 nghĩa còn điều kiện chặn. Không cần đăng nhập lại khi gh auth status đã hợp lệ.
4. Khi đồng ý đưa bản đã duyệt vào main, chạy `npm.cmd run delivery:merge`. Công cụ chỉ merge nếu có approval của thành viên khác trên đúng commit hiện tại, 3 CI checks verify/browser/container SUCCESS, PR mở, không draft và không xung đột. Dùng merge commit giữ lịch sử, có match-head-commit, không dùng --admin và không vượt branch rules. Đây là công cụ cục bộ bổ sung; cần đặt required review/checks trên GitHub để ngăn việc merge tay bỏ qua.
5. Xác nhận các Issue được PR liên kết đã thật sự đạt AC; GitHub có thể tự đóng các closing references khi merge vào main. Chỉ chuyển Done tương ứng với công việc đạt DoD. Đừng chạy project:apply để giả lập lịch sử đã hoàn thành.
6. Khởi chạy HTTPS theo FREE_HTTPS_DEMO.md. Sau khi có môi trường thật, kiểm persist/backup/restore rồi ghi URL, kết quả và bằng chứng. Chưa ghi là production hoạt động trước khi thử.
7. Thực hiện UAT_PLAN.csv cùng người dùng thật; ký UAT_SIGNOFF_DRAFT.md sau khi kiểm. Cập nhật báo cáo 4 với kết quả, URL và hạn chế thực tế.
8. Chốt hồ sơ theo SUBMISSION_CHECKLIST.md, diễn tập bảo vệ. Chỉ tạo v1.0.0 từ commit được chấp nhận trên main sau UAT và kiểm tra cuối.

## Trạng thái đang chờ

Chưa có independent approval, URL HTTPS đã chạy, UAT thật, chữ ký, dữ liệu cá nhân, môn kế thừa và hạn nộp. Lịch sử Sprint/Retro/CR cần phản ánh hoạt động thật. Theo yêu cầu PM các ô chưa có thông tin được để trống.

Công cụ delivery không thể bảo đảm người reviewer đã đọc code; đó vẫn là trách nhiệm của reviewer. Các test của công cụ dùng fixture giả lập, không tạo review lên GitHub và không được tính làm peer review.
