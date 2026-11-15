# Đối chiếu 5 nhóm hồ sơ cuối kỳ

Thư mục Drive đích đã được PM chấp thuận: https://drive.google.com/drive/folders/1bHP3iTwPVYbwJHNBsuAt07j1Ph4teOUZ
Các tệp DRAFT/CURRENT là bản làm việc; chỉ đổi trạng thái sau khi có căn cứ thật. Báo cáo hiện trạng kỹ thuật không thay kết luận dự án đã nghiệm thu.

| Nhóm hồ sơ | Tệp đã có trong reports/ | Cần chốt trước nộp |
|---|---|---|
| 1. Project Charter | 01_Project_Charter_DRAFT.pdf và .docx | Họ tên/MSSV, môn kế thừa, hạn nộp, stakeholder, mục tiêu được duyệt và chữ ký thật |
| 2. WBS & Dictionary | 02_WBS_Dictionary_DRAFT.pdf và .docx | Xác nhận scope 100%, gói việc 1–2 tuần, owner, ước lượng và tiêu chí hoàn thành |
| 3. Dynamic Risk Register | 03_Risk_Register_DRAFT.xlsx | Có quan sát kỹ thuật Sprint1_Actual; Week 6 và Week 11 còn cần cập nhật đúng mốc, trạng thái/owner/evidence và CR thật |
| 4. Final Report & Evidence | 04_Technical_Report_CURRENT.pdf/.docx, khung Final_Report, Technical_QA_Verification.pdf | Tổng hợp kết quả học kỳ, lịch sử Sprint/commit, review, burndown thật, CR, UAT và link deployment thực tế |
| 5. Slide & Rubric | 05_Presentation_DRAFT.pptx/.pdf, 05_Rubric_Self_Assessment_DRAFT.pdf/.docx | Thay số liệu đề xuất bằng số liệu thật, gắn evidence, phân công thuyết trình và ghi diễn tập |

## Phụ lục bàn giao mới

- 06_UAT_Delivery_Pack_DRAFT.pdf/.docx: hướng dẫn dùng, checklist merge, hosting demo miễn phí và biểu mẫu nghiệm thu.
- docs/UAT_PLAN.csv: kịch bản UAT chi tiết, kết quả để trống.
- config/team.json: đủ GitHub của 5 vai trò; thông tin cá nhân và tỷ lệ đóng góp để trống.
- docs/reviews/297b500: bằng chứng kỹ thuật của commit cũ, giữ nguyên để đối chiếu. Kiểm tra mới lưu qua qa:verify; CI mới gắn với commit mới.

## Evidence cần gom

- Repo và PR: https://github.com/TanTai08/WebSouvenir/pull/1; giữ review gốc và check thành công.
- Board: https://github.com/users/TanTai08/projects/1. Chạy `npm.cmd run project:snapshot` tại các lần cập nhật để giữ lịch sử thực tế, không ghi lùi ngày.
- Burndown: dùng điểm nhóm đã xác nhận và số điểm còn lại theo ngày của Sprint; nếu GitHub không cung cấp biểu đồ phù hợp, xuất snapshot thật để lập biểu đồ. Không suy ngược đường giảm đều từ trạng thái cuối.
- Change record: docs/changes/CR-001-Free-HTTPS-Demo.md ghi yêu cầu ưu tiên hosting miễn phí thực tế ngày15/11; đã phân tích, còn chờ phê duyệt giới hạn, không tự thay milestone Week11.
- Risk: giữ cả Week 6 và Week 11; liên kết Issue/CR xử lý thật. Risk kỹ thuật ngày15/11 không tự thay hai lần cập nhật theo mốc học phần.
- Retro1, kế hoạch Sprint2, scope change được quyết định, final retro: dùng Evidence_Forms_DRAFT và lưu xác nhận cuộc họp thật.
- Acceptance: UAT_PLAN, lỗi và biên bản người dùng chấp nhận; deployment/restore được kiểm trên môi trường thật.

## Thông tin để PM điền sau

Môn chuyên ngành kế thừa: __________  Hạn nộp: __________  Stakeholder: __________

| Vai trò | GitHub | Họ tên | MSSV | Đóng góp thực tế (%) |
|---|---|---|---|---|
| PM | TanTai08 | | | |
| Tech Lead | Txtien-225 | | | |
| Backend | LQT23072005 | | | |
| Frontend | ngonhat21 | | | |
| QA | Hoangtrong-S1 | | | |

Tổng đóng góp cần bằng 100%, được cả nhóm xác nhận từ công việc đã làm. Không tự phân đều chỉ để điền đủ biểu mẫu.

## Bộ PM bổ sung

Xem docs/pm/README.md và reports/07_PM_Management_Pack_DRAFT.pdf/.docx: snapshot thực tế, phiếu khảo sát, scope/AC, Review/Retro chuẩn bị, Sprint2 đề xuất, risk/decision log, WBS Dictionary20 gói và runbook bảo vệ. docs/pm/BURNDOWN_OBSERVED.csv chỉ chứa ngày đã đo; điểm vẫn đề xuất. Sprint2 chưa bắt đầu nên scope snapshot chưa phải lịch sử thực thi Sprint2.
