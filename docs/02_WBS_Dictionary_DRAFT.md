# WBS và Từ điển WBS — GiftShop

**DỰ THẢO — CHƯA PHÊ DUYỆT / CHƯA ĐỦ ĐIỀU KIỆN NỘP CUỐI KỲ**

## 1.0 Quản trị dự án

1.1 Khởi tạo: Charter, stakeholder, phạm vi. Owner PM; đầu ra: Charter được phê duyệt.
1.2 Theo dõi: backlog, kế hoạch, estimate, Sprint, board, risk, CR. Owner PM cùng nhóm.
1.3 Đóng dự án: UAT, Retro, bộ báo cáo và bảo vệ. Owner PM + QA. Các gói xuyên kỳ phải chia thành gói theo Sprint, mỗi gói 1–2 tuần.

## 2.0 Nền tảng kỹ thuật

2.1 Kiến trúc và mô hình dữ liệu — Tech Lead, 1 tuần. Users, sessions, products, orders, items, movements; tiền nguyên VND, giao dịch nguyên tử.
2.2 Repo, CI và môi trường — Tech Lead, 1 tuần. PR template, workflow check/test, bảo vệ main, runbook.

## 3.0 Sản phẩm phần mềm

3.1 Xác thực và phân quyền — Backend, 1 tuần. Login/logout, hash mật khẩu, cookie HttpOnly, kiểm quyền server.
3.2 Sản phẩm — Backend + Frontend, 1 tuần. Mã duy nhất; tên, danh mục, giá; sửa và lưu trữ khi tồn 0.
3.3 Nhập hàng — Backend + Frontend, 1 tuần. Số lượng nguyên dương; lịch sử có người và lý do.
3.4 Bán hàng và hủy — Backend + Frontend, 2 tuần. Không âm kho; giá lấy từ server; hủy 1 lần, hoàn kho nguyên tử.
3.5 Dashboard — Frontend + Backend, 1 tuần. Doanh thu hợp lệ, theo ngày giờ Việt Nam, sản phẩm bán chạy, cảnh báo tồn <5.

## 4.0 Đảm bảo chất lượng và bàn giao

4.1 Kiểm thử API và bảo mật — QA, 1 tuần. Ma trận test và kết quả thật.
4.2 Kiểm thử giao diện và UAT — QA + người dùng, 1 tuần. Desktop/mobile, lỗi, sign-off.
4.3 Triển khai và sao lưu — Tech Lead, 1 tuần. HTTPS, volume, secrets, restore test, runbook.

## 5.0 Hồ sơ và bảo vệ

5.1 Final Report và evidence — PM + cả nhóm, 1–2 tuần. 7 chương, 15–25 trang, dữ kiện có liên kết bằng chứng.
5.2 Slide, rubric, demo dự phòng — cả nhóm, 1 tuần. 8–10 slide, chạy thử 6+5+5 phút.

## Từ điển WBS và quy tắc 100%

Mỗi mã lá nêu đầu ra, owner dự kiến, thời lượng, phụ thuộc, AC và bằng chứng trong Backlog.csv. WBS này bao gồm cả quản trị, kỹ thuật, chất lượng, triển khai, hồ sơ. Không tính công việc ngoài phạm vi. Cần đội ngũ review 100% Rule trước phê duyệt. Ước lượng là kế hoạch, không phải số giờ đã làm. Các gói quản trị xuyên kỳ được tách theo Sprint để giữ giới hạn 1–2 tuần.

## Phụ thuộc và CPM dự kiến

Mạng ban đầu: A khảo sát (1 tuần) → B kiến trúc (1) → C sản phẩm/nhập kho (2) → D bán hàng/hủy (2) → E UAT/triển khai (1) → F bàn giao (1). Chuỗi A-B-C-D-E-F có tổng 8 tuần nếu nguồn lực, lịch và phụ thuộc giữ nguyên. Nhánh CI và giao diện làm song song, cần phân tích ES/EF/LS/LF và tải nguồn lực trước khi gọi đây là đường găng được duyệt. Không coi chuỗi minh họa này là số liệu thực tế.


## Dictionary chi tiết20 gói

[WBS_DICTIONARY.csv](pm/WBS_DICTIONARY.csv) ánh xạ duy nhất20 gói tới20 Issue; mỗi gói có owner, Sprint dự kiến,7 hoặc14 ngày lịch đề xuất, điểm, phụ thuộc và AC. [Bảng coverage](pm/WBS_COVERAGE.md) giải thích100% Rule và tránh đếm trùng. Chưa phê duyệt baseline hoặc cam kết nguồn lực.
