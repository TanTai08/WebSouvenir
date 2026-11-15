# QA kỹ thuật GiftShop0.4.0

Bản mã được xác minh: cdd60e3. CI: https://github.com/TanTai08/WebSouvenir/actions/runs/43707514900

## Các kiểm tra đã qua
- Cú pháp của31 file JavaScript.
- ESLint và Prettier check.
-7 kiểm thử Node tích hợp/hồi quy: luồng API ban đầu; restart giữ dữ liệu và mật khẩu admin mới; báo lỗi khi port bị chiếm; stale quote không tạo đơn và cần xác nhận; rollback khi dòng thứ2 đổi giá; khóa đăng nhập không ảnh hưởng account khác cùng IP; đổi mật khẩu đồng thời không ghi đè nhau.
-7/7 browser case trên Chromium: login sai; admin nhập/bán/hủy; staff; mobile390x844; đổi password; stale price cần xác nhận; session mất hiệu lực xóa giỏ trước khi login lại.
- Docker build thành công và smoke qua2 lần: tạo dữ liệu trên volume; xóa container; chạy container mới cùng volume; xác nhận login, sản phẩm, tồn3 và đơn7500đ còn đúng.

## Bằng chứng
Log GitHub Actions của3 job verify/browser/container là nguồn kiểm chứng. Artifact browser-qa có report và ảnh; không tuyên bố đã kiểm ảnh bằng mắt ở môi trường này. Test dùng database/volume riêng, không phải dữ liệu người dùng thật.

## Chưa phải nghiệm thu cuối kỳ
Cần peer approval, UAT của người dùng thật, chữ ký, HTTPS production, kiểm tra tải/hạ tầng được chọn và xác nhận chính sách nghiệp vụ. QA tự động không thay bằng chứng học kỳ.
