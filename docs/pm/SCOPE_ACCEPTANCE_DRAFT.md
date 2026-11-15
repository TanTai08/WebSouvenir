# Phạm vi và tiêu chí chấp nhận — dự thảo để xác nhận

Nguồn: Charter hiện tại, code/API và TEST_MATRIX; chưa phải kết quả khảo sát. Người dùng dự kiến: quản trị viên cửa hàng và nhân viên bán tại quầy. Chủ sản phẩm/người nghiệm thu: __________.

## Trong phạm vi

- FR01 — Login/logout, đổi mật khẩu, admin/staff. Staff xem hàng, bán và xem lịch sử; quản trị sản phẩm/kho/tài khoản, hủy đơn và dashboard được kiểm quyền server.
- FR02 — Sản phẩm có SKU duy nhất, tên, danh mục, giá nguyên VND; tạo/sửa/tìm kiếm; chỉ lưu trữ khi tồn0; giữ lịch sử đơn đã bán.
- FR03 — Nhập hàng nguyên dương, lưu biến động kho, người thao tác và ghi chú.
- FR04 — Giỏ hàng nhiều sản phẩm, kiểm tồn, tính tổng trên server, giao dịch nguyên tử; chống trùng đơn với idempotency key; đổi giá phải xác nhận lại.
- FR05 — Admin hủy toàn đơn một lần; hoàn kho, giữ lịch sử và loại đơn hủy khỏi doanh thu.
- FR06 — Dashboard doanh thu của đơn paid, theo ngày UTC+7, sản phẩm bán chạy và tồn; không đồng nghĩa lợi nhuận.
- FR07 — Hướng dẫn dùng, backup/restore, test, HTTPS demo và tài liệu bàn giao; URL thực tế chưa được xác nhận.

## Ngoài phạm vi

Khách tự mua online, cổng thanh toán, vận chuyển, đa chi nhánh, đổi trả từng phần, hóa đơn điện tử, giá vốn/lợi nhuận/thuế/chiết khấu, mobile app và SSO. Yêu cầu mới cần CR có phân tích/duyệt; không mặc định cộng vào baseline.

## Tiêu chí có thể đo

| ID | Kiểm tra | Kết quả mong đợi | Evidence cần lưu |
|---|---|---|---|
| AC01 | Sai mật khẩu; staff gọi API quản trị |401 và403 tương ứng, không ghi dữ liệu trái quyền | API/CI + UAT theo vai trò |
| AC02 | Tạo trùng SKU hoặc giá âm | Bị chặn, dữ liệu hợp lệ cũ giữ nguyên | TEST_MATRIX + ảnh UI |
| AC03 | Tồn5, bán2 hàng giá25000 | Đơn50000, tồn3, sổ kho khớp | Mã đơn + số liệu trước/sau |
| AC04 | Hai yêu cầu cùng bán4 khi chỉ còn5 | Chỉ một bán thành công, không âm kho | Test concurrency + CI |
| AC05 | Gửi lại cùng key và giỏ | Một order_id và một lần trừ kho | Test idempotency |
| AC06 | Giá trong giỏ cũ25000, DB đổi30000 |409 PRICE_CHANGED, chưa bán; xác nhận mới mới tạo đơn | Regression + UAT |
| AC07 | Hủy đơn một lần, thử hủy lại | Hoàn kho đúng một lần; loại doanh thu; lần hai bị chặn | Mã đơn/biến động + test |
| AC08 | Đơn ở16:59:59Z và17:00:00Z | Được nhóm sang hai ngày UTC+7 tương ứng | Test fixture; UAT nếu đã thử |
| AC09 | Stop/start cùng DB; backup/restore bản sao | Password/đơn/tồn còn và integrity_check=ok | Log trên môi trường đã chọn |
| AC10 | Người dùng chạy15 case UAT | Ghi PASS/FAIL/BLOCKED và quyết định chấp nhận thật | UAT_PLAN + sign-off |

Các số lượng/giá trên là dữ liệu kiểm thử, không phải giao dịch cửa hàng thật. Chưa có cam kết SLA hoặc tải đồng thời; cần stakeholder xác nhận trước khi bổ sung.

## Baseline và chấp thuận

Ngày thống nhất thực tế: __________. Phiên bản/commit được duyệt: __________.
Người xác nhận nhu cầu/phạm vi: __________. Link/chữ ký gốc: __________.
CR-001 chỉ đề xuất Codespaces demo miễn phí; chưa thay tiêu chí production/persistence của Charter nếu chưa được chấp thuận.
