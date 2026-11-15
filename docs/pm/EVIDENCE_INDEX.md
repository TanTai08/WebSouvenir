# GS19 — Chỉ mục báo cáo và bằng chứng

Tất cả tệp nằm trên nhánh feat/giftshop-initial. Đây là hồ sơ làm việc; chưa phải chứng nhận dự án đã nghiệm thu. Các số liệu snapshot có timestamp, không dùng thay lịch sử cả học kỳ.

| Nhóm | Tài liệu trong repo | Nguồn/điều kiện còn chờ |
|---|---|---|
|1 — Charter | reports/01_Project_Charter_DRAFT.pdf, .docx; docs/01_Project_Charter_DRAFT.md | Thông tin người thật, stakeholder đồng ý, chữ ký/ngày |
|2 — WBS/Dictionary | reports/02_WBS_Dictionary_DRAFT.pdf, .docx; docs/pm/WBS_DICTIONARY.csv |20 gói,100% phạm vi đề xuất; thời lượng1–2 tuần/owner/dependency/AC; chờ review baseline |
|3 — Risk | reports/03_Risk_Register_DRAFT.xlsx; docs/changes/CR-001-Free-HTTPS-Demo.md | Actual kỹ thuật có nguồn; Week 06/Week 11 và quyết định CR chờ đúng mốc |
|4 — Final Report/Evidence | reports/04_Technical_Report_CURRENT.pdf, .docx; Technical_QA_Verification.pdf;06_UAT_Delivery_Pack_DRAFT.pdf |7 chương/15 trang hiện trạng; còn thiếu kết quả học kỳ/UAT/production và phê duyệt |
|5 — Slide/Rubric | reports/05_Presentation_DRAFT.pptx, .pdf;05_Rubric_Self_Assessment_DRAFT.pdf, .docx |10 slide, notes/runbook; chưa có diễn tập thật |

## Nguồn được dùng

- Repo: https://github.com/TanTai08/WebSouvenir
- PR và review gốc: https://github.com/TanTai08/WebSouvenir/pull/1
- Board/Table: https://github.com/users/TanTai08/projects/1
- CI của source được chụp: xem URL từng check trong EVIDENCE_SNAPSHOT.json; gồm19 Node test,8 browser case và Docker smoke.
- Source/test: src/, public/, tests/, e2e/, .github/workflows/ci.yml; TEST_MATRIX mô tả phạm vi và giới hạn.
- Snapshot: docs/project_snapshots/ và EVIDENCE_SNAPSHOT.json; ghi trạng thái quan sát được, không ghi lùi.
- Biểu mẫu course: Risk Register Template, Week 14 Evidence Checklist và Milestone Rubric do PM cung cấp trong trao đổi. Đây là bản đối chiếu nội bộ, không giả lập chữ ký giảng viên.
- Drive đích: https://drive.google.com/drive/folders/1bHP3iTwPVYbwJHNBsuAt07j1Ph4teOUZ (bản GitHub có thể mới hơn bản Drive).

##7 chương của báo cáo hiện trạng

1. Tổng quan dự án, phạm vi và giá trị giả thuyết.
2. Nhóm5 người, phương pháp Scrum và DoD.
3. WBS và truy vết yêu cầu.
4. Ước lượng, lịch Sprint và chỉ số quan sát.
5. Kiến trúc, bảo mật, giao dịch và kiểm thử.
6. Risk và Change Request thực tế.
7. Bàn giao, UAT, kết luận và bài học có nguồn.

Không ghi báo cáo đã đạt Final Report chỉ vì đủ 15 trang. Thay nội dung pending bằng kết quả thật, bổ sung acceptance, Retro và reflection của nhóm trước nộp.

## Checklist kiểm toán cuối

[ ] Charter/WBS được phê duyệt; [ ] thông tin5 người và đóng góp tổng100%; [ ] lịch sử2 Sprint; [ ] burndown có nguồn; [ ] Risk cả2 cập nhật; [ ] CR có quyết định; [ ] peer review/CI; [ ] HTTPS/persistence/restore; [ ] UAT/acceptance; [ ] final retro; [ ] diễn tập; [ ] release từ commit được chấp nhận.

## Xuất lại hồ sơ sau khi cập nhật nguồn

Python cần reportlab, python-docx và python-pptx cho scripts/build_pm_documents.py; scripts/build_report.py tạo báo cáo15 trang; scripts/build_delivery_pack.py tạo phụ lục06. Biểu đồ dùng matplotlib qua scripts/build_burndown.py. Đây là công cụ tạo báo cáo, không phải dependencies chạy website. Giữ kết quả thực tế chưa có ở trạng thái pending.

## Tải trực tiếp

- Charter: [PDF](../../reports/01_Project_Charter_DRAFT.pdf), [Word](../../reports/01_Project_Charter_DRAFT.docx).
- WBS/Dictionary: [PDF](../../reports/02_WBS_Dictionary_DRAFT.pdf), [Word](../../reports/02_WBS_Dictionary_DRAFT.docx), [CSV20 gói](WBS_DICTIONARY.csv).
- Risk: [Excel](../../reports/03_Risk_Register_DRAFT.xlsx).
- Báo cáo7 chương/15 trang: [PDF](../../reports/04_Technical_Report_CURRENT.pdf), [Word](../../reports/04_Technical_Report_CURRENT.docx).
- Slide10 trang: [PowerPoint có notes](../../reports/05_Presentation_DRAFT.pptx), [PDF](../../reports/05_Presentation_DRAFT.pdf), [Rubric](../../reports/05_Rubric_Self_Assessment_DRAFT.pdf).
- Bộ PM: [PDF07](../../reports/07_PM_Management_Pack_DRAFT.pdf), [Word07](../../reports/07_PM_Management_Pack_DRAFT.docx).
