# GS15 — Theo dõi rủi ro, thay đổi và quyết định

Workbook nguồn: reports/03_Risk_Register_DRAFT.xlsx. Giữ các sheet Week 06/Week 11 để cập nhật tại thời điểm thật; bảng kỹ thuật Sprint1_Actual không thay thế hai mốc học phần.

## Diễn biến có bằng chứng

| Risk | Quan sát | Phản ứng/hiện trạng | Nguồn |
|---|---|---|---|
| R01 | Integration không ghi Project được; owner CLI ghi được | Duy trì cập nhật qua quyền của PM; còn giới hạn integration | Snapshot Project và log thao tác PM |
| R08 | Giá giỏ cũ khác giá server trong fixture |409, không tạo đơn; yêu cầu xác nhận lại; regression đạt | CI/test orders |
| R09 | Restart demo sau đổi password trong fixture | Không seed lại DB đã có; giữ dữ liệu/password | Demo regression |
| R10 | Khóa chung IP trong fixture | Giới hạn theo tài khoản; regression đạt | Auth regression |
| R11 | Chưa xác nhận HTTPS/UAT thật | Chọn môi trường, kiểm persistence và tổ chức nghiệm thu | Issue #18/#19 còn mở |
| R12 | PM ưu tiên miễn phí; Codespaces quota/stop/xóa workspace | CR-001 phân tích; backup tải về và bản local dự phòng | CR-001/Free HTTPS runbook |
| R13 | Lịch sử commit ghép hai nhánh và có ngày ghi lùi | Giữ minh bạch nguồn; không dùng ngày đó chứng minh tiến độ học kỳ; xác nhận với giảng viên cách bổ sung | Source/PR, EVIDENCE_SNAPSHOT.json |

R08–10 là quan sát kiểm thử trên dữ liệu tạm, không phải sự cố vận hành cửa hàng thật. R13 là rủi ro về chất lượng evidence; chưa có quyết định xử lý lịch sử thay PM.

## Change control

CR-001: từ phương án Render có persistent disk trả phí sang đề xuất Codespaces HTTPS demo trong hạn mức miễn phí. Nguồn yêu cầu thật: PM chọn ưu tiên miễn phí. Đã phân tích scope, khả dụng, quota, dữ liệu và UAT; chưa có quyết định thay tiêu chí production của stakeholder.

Luồng cần dùng: yêu cầu → ghi baseline → phân tích scope/lịch/chi phí/rủi ro → PM/Tech Lead/stakeholder ra quyết định thật → cập nhật baseline → triển khai/test → xác nhận. Ghi đầy đủ người/ngày và link Issue/PR. Không đánh dấu approve do có file phân tích.

## Decision log

| Quyết định/đề xuất | Nguồn đã có | Trạng thái |
|---|---|---|
| Web quản lý cửa hàng đồ lưu niệm, Pathway1, Agile/Scrum | Yêu cầu PM, Charter | Định hướng PM chọn; môn kế thừa/stakeholder chưa xác nhận |
| Lịch Sprint 1 bắt đầu08/11, Sprint 2 ngày 22/11 | PM nhập Project; config/project-plan.json | Kế hoạch, không chứng minh thời gian làm thực tế |
| Ưu tiên hosting miễn phí | Yêu cầu PM và CR-001 | Cấu hình chuẩn bị; giới hạn demo chờ stakeholder duyệt |
|4 thành viên review PR | Yêu cầu PM và requested_reviewers trên GitHub | Đã gửi; trạng thái review xem snapshot thời điểm thực tế |

## Week 11 cần hoàn thiện khi tới mốc

Xem lại từng risk Week 06: đã xảy ra/đóng/còn mở; ghi hiệu quả phản ứng. Liên kết CR thật cùng quyết định có người/ngày; thêm risk phát sinh; ghi nguồn và người cập nhật. Dữ liệu chưa có để trống.
