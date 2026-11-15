# Đối chiếu100% Rule và WBS Dictionary

WBS_DICTIONARY.csv tách20 gói công việc duy nhất, ánh xạ1:1 tới20 Issue hiện có. Mỗi gói có đầu ra, owner đề xuất, Sprint,7 hoặc14 ngày lịch dự kiến, điểm đề xuất, dependency, AC và evidence. Thời lượng không phải giờ công hoặc thời gian thực tế đã làm; các gói có thể chạy song song theo nguồn lực.

- 1.0: khởi tạo/phạm vi (GS01–02), theo dõi/Review/Retro/kế hoạch (GS10), risk/change (GS15); các lần risk riêng Sprint 1 nằm GS09. Hoạt động xuyên kỳ được quản lý bằng đầu ra theo từng Sprint, không gộp thành gói kéo dài cả học kỳ.
- 2.0: kiến trúc/DB (GS03) và repo/CI/môi trường (GS04).
- 3.0: xác thực (GS05), API/UI sản phẩm (GS06–07), kho (GS08), bán/giỏ/hủy (GS11–13), dashboard (GS14).
- 4.0: kiểm thử/risk1 (GS09), tích hợp/UI (GS16), triển khai/backup (GS17), UAT/final retro (GS18).
- 5.0: báo cáo/evidence (GS19), slide/rubric/diễn tập/demo dự phòng (GS20).

Phân biệt đầu ra để tránh đếm trùng: phát triển chức năng khác kiểm thử độc lập; họp/ra quyết định khác việc tổng hợp vào báo cáo; UAT xác nhận sản phẩm khác hồ sơ minh chứng nghiệm thu. Yêu cầu ngoài scope không được giấu trong WBS; dùng CR để bổ sung và đánh giá tác động.

Đây là kiểm tra độ bao phủ của baseline đề xuất, chưa phải phê duyệt100% Rule của nhóm. PM/Tech Lead cần xác nhận scope, dependency và capacity trước khi chốt kế hoạch. Kế hoạch Sprint trên Project được ưu tiên hơn nhãn cũ trong Backlog.csv.
