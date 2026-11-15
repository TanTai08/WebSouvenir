# Bàn giao vị trí PM — TanTai08

GitHub: @TanTai08. Bản cập nhật ngày 15/11/2026, được Codex hỗ trợ chuẩn bị. [Bộ công việc PM](../pm/README.md) và [snapshot nguồn](../pm/EVIDENCE_SNAPSHOT.json). Theo snapshot: GS01/GS15/GS19/GS20 đang In Progress; GS02/GS10 còn Backlog. Không dùng trạng thái dự thảo làm chữ ký phê duyệt.

## GS01 — Xác nhận đề tài, môn kế thừa và người nghiệm thu

Tiêu chí: Charter có thông tin thật; stakeholder đồng ý tham gia. Issue [#2](https://github.com/TanTai08/WebSouvenir/issues/2).

Trạng thái: **In Progress** — đã có Charter,5 vai trò, phạm vi và tiêu chí đề xuất; chờ môn kế thừa, deadline, họ tên/MSSV và stakeholder theo yêu cầu PM để trống.

Bằng chứng đã có: [Charter](../01_Project_Charter_DRAFT.md), [PDF](../../reports/01_Project_Charter_DRAFT.pdf), [scope/AC](../pm/SCOPE_ACCEPTANCE_DRAFT.md), [team](../../config/team.json).

Bằng chứng để đóng việc: stakeholder đồng ý, thông tin thật và chữ ký hoặc nguồn xác nhận gốc; ngày/xác nhận: __________.

## GS02 — Phỏng vấn và chốt phạm vi

Tiêu chí: có biên bản, in/out scope, tiêu chí nghiệm thu được xác nhận. Issue [#3](https://github.com/TanTai08/WebSouvenir/issues/3).

Trạng thái: **Backlog** trên Board — đã chuẩn bị bộ câu hỏi và scope/AC; chưa có phỏng vấn người dùng thật.

Bằng chứng đã có: [phiếu 10 câu hỏi và biên bản trống](../pm/STAKEHOLDER_INTERVIEW_DRAFT.md), [in/out scope và10 AC](../pm/SCOPE_ACCEPTANCE_DRAFT.md).

Bằng chứng để đóng việc: câu trả lời thật, người/ngày tham gia và xác nhận phạm vi; link biên bản sau thực hiện: __________.

## GS10 — Review, Retro Sprint 1 và lập Sprint 2

Tiêu chí: người tham dự thật, hành động cải tiến có owner, kế hoạch Sprint 2 được thống nhất. Issue [#11](https://github.com/TanTai08/WebSouvenir/issues/11).

Trạng thái: **Backlog** trên Board — có agenda và đề xuất kế hoạch; chưa ghi nhận họp/Retro thực tế.

Bằng chứng đã có: [Review/Retro chuẩn bị](../pm/SPRINT1_REVIEW_RETRO_DRAFT.md), [Sprint 2 đề xuất](../pm/SPRINT2_PLAN_PROPOSED.md), [snapshot Board](../pm/EVIDENCE_SNAPSHOT.json).

Bằng chứng để đóng việc: biên bản, người tham dự, action/deadline/capacity và scope được nhóm xác nhận: __________.

## GS15 — Risk update2 và xử lý CR thực tế

Tiêu chí: diễn biến risk, đánh giá ảnh hưởng, phê duyệt và CR có nguồn. Issue [#16](https://github.com/TanTai08/WebSouvenir/issues/16).

Trạng thái: **In Progress** — đã có risk kỹ thuật thực tế và CR-001 hosting miễn phí được phân tích; chờ stakeholder/CCB duyệt giới hạn, chưa hoàn tất milestone Week 11.

Bằng chứng đã có: [Risk workbook](../../reports/03_Risk_Register_DRAFT.xlsx), [CR-001](../changes/CR-001-Free-HTTPS-Demo.md), [risk/change/decision log](../pm/RISK_CHANGE_CONTROL.md).

Bằng chứng để đóng việc: risk Week 06/Week 11 có evolution và nguồn; quyết định CR ghi người/ngày, triển khai và xác nhận: __________.

## GS19 — Hoàn thiện báo cáo và evidence

Tiêu chí:5 nhóm báo cáo,7 chương,15–25 trang có nguồn. Issue [#20](https://github.com/TanTai08/WebSouvenir/issues/20).

Trạng thái: **In Progress** — đã chuẩn bị đủ 5 nhóm tệp và báo cáo kỹ thuật7 chương/15 trang; chưa đủ kết quả học kỳ để gọi Final Report đã nghiệm thu.

Bằng chứng đã có: [chỉ mục báo cáo](../pm/EVIDENCE_INDEX.md), [báo cáo PDF](../../reports/04_Technical_Report_CURRENT.pdf), [WBS Dictionary 20 gói](../pm/WBS_DICTIONARY.csv), [checklist nộp](../SUBMISSION_CHECKLIST.md), [gói PM](../../reports/07_PM_Management_Pack_DRAFT.pdf).

Bằng chứng để đóng việc: peer review, lịch sử Sprint/Burndown, risk/CR đã duyệt, UAT/acceptance và rà soát cuối: __________.

## GS20 — Slide, rubric và diễn tập

Tiêu chí:8–10 slide, diễn tập6+5+5 phút và có backup. Issue [#21](https://github.com/TanTai08/WebSouvenir/issues/21).

Trạng thái: **In Progress** — slide 10 trang đã cập nhật, có speaker notes, kịch bản và checklist dự phòng; chưa có buổi diễn tập thực tế.

Bằng chứng đã có: [PPTX](../../reports/05_Presentation_DRAFT.pptx), [PDF](../../reports/05_Presentation_DRAFT.pdf), [runbook 6+5+5](../pm/DEFENSE_RUNBOOK.md), [rubric](../05_Rubric_Self_Assessment_DRAFT.md).

Bằng chứng để đóng việc: người tham dự, thời lượng thật, ảnh/video được phép dùng và action khắc phục: __________.

## Quy tắc hoàn tất

PM không tự approve PR #1 do là tác giả. Thành viên kiểm tra và review thật, CI phải đạt trên commit hiện tại; chỉ đóng Issue khi đủ AC. Giữ nguồn trợ giúp Codex; không dùng commit rỗng/ngày ghi lùi hoặc gán tác giả để thay đóng góp thực tế. Các thông tin cá nhân/stakeholder/hạn nộp chưa cung cấp vẫn để trống.
