# Hướng dẫn vận hành WebSouvenir

Dành cho người quản lý cửa hàng và người bán tại quầy. Luồng sử dụng: tạo hàng → nhập kho → bán → theo dõi → xử lý hủy. Phần mềm chỉ bán tại quầy; chưa tích hợp thanh toán online, giá vốn hoặc lợi nhuận.

## Chuẩn bị

Local: Node 24, mở thư mục có package.json, chạy `npm.cmd run demo`, mở http://127.0.0.1:3000. Database mới dùng admin / GiftShop-Demo-2026!; nếu đã đổi mật khẩu hãy dùng mật khẩu mới. Chỉ dùng dữ liệu mẫu, không chia sẻ cổng local với mật khẩu công khai. HTTPS dùng hướng dẫn FREE_HTTPS_DEMO.md và mật khẩu riêng.

## Quản trị viên

1. Đăng nhập, vào **Sản phẩm**, thêm SKU duy nhất, tên, danh mục và giá nguyên VND. Tạo mới chưa làm tăng tồn kho.
2. Vào **Nhập hàng**, chọn sản phẩm, nhập số lượng nguyên dương và ghi chú. Kiểm lại tồn trên danh sách và biến động kho.
3. Vào **Tài khoản cửa hàng**, tạo tài khoản nhân viên với vai trò staff và mật khẩu riêng ít nhất 12 ký tự. Tài khoản ứng dụng không phải tài khoản GitHub.
4. Sau bán hàng, mở **Dashboard** để xem doanh thu đơn đã thanh toán và thống kê ngày theo UTC+7. Doanh thu không phải lợi nhuận.
5. Nếu cần hủy toàn bộ đơn, mở **Đơn hàng**, kiểm đúng mã và xác nhận hủy. Tồn được hoàn và đơn bị loại khỏi doanh thu. Hủy lại không hoàn kho lần hai.

Chỉ lưu trữ sản phẩm khi tồn bằng 0; lịch sử đơn giữ tên và giá lúc bán. Không xóa database để làm mới giao diện hoặc để sửa mật khẩu.

## Nhân viên bán hàng

1. Đăng nhập bằng tài khoản staff. Mở màn hình bán hàng, tìm sản phẩm và thêm vào giỏ.
2. Chỉnh số lượng, đối chiếu giá/tổng tiền với khách rồi xác nhận. Khi thành công ghi lại mã đơn và kiểm tồn.
3. Nếu giá đã thay đổi, ứng dụng báo lỗi và tải giá mới. Đọc lại giỏ với khách rồi xác nhận lần nữa; không xem thông báo đổi giá là bán thành công.
4. Nếu thiếu tồn, điều chỉnh giỏ. Không nhấn liên tục khi có lỗi mạng; tải lịch sử đơn để kiểm tra trước khi thao tác lại.
5. Đăng xuất khi bàn giao ca. Nhân viên không được quản lý sản phẩm/kho/tài khoản, xem dashboard quản trị hoặc hủy đơn.

## Khi gặp sự cố

- Không đăng nhập được: kiểm username/mật khẩu; sau nhiều lần sai một tài khoản bị giới hạn 15 phút. Không dùng thay đổi ADMIN_PASSWORD để reset DB cũ.
- Phiên hết hạn: đăng nhập lại, giỏ đã được xóa để tránh dùng nhầm ca bán.
- Không mở được localhost: kiểm terminal đang chạy và có ở đúng thư mục dự án; cổng 3000 có thể đang bị app khác giữ.
- Demo HTTPS không mở: Codespace có thể đã stop hoặc cổng đang Private. Dùng link thực tế trong tab Ports.
- Dữ liệu quan trọng: dừng chỉnh sửa, báo người phụ trách và dùng bản sao để phục hồi thử; không xóa file data/.

Bằng chứng lỗi nên ghi thời điểm, phiên bản, thao tác, kết quả mong đợi/thực tế và ảnh đã che thông tin riêng. Không đưa mật khẩu, session cookie hoặc database lên Issue công khai.
