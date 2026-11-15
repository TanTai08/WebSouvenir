# Kiến trúc GiftShop 0.4.0
```mermaid
flowchart LR
  B[Trình duyệt HTML/CSS/JS] -->|HTTPS production / HTTP local| S[Node.js 24 API]
  S --> A[Session và role checks]
  A --> V[Validation và nghiệp vụ]
  V -->|BEGIN IMMEDIATE| D[(SQLite WAL trên persistent volume)]
  D --> K[Online backup riêng]
```
```mermaid
erDiagram
  users ||--o{ sessions : owns
  users ||--o{ orders : creates
  orders ||--|{ items : contains
  products ||--o{ items : sold_as
  products ||--o{ movements : tracks
  users ||--o{ movements : records
  users ||--o{ checkout_requests : retries
  orders ||--o{ checkout_requests : resolves
```
Schema thực: src/database.js. products.sku UNIQUE, price và stock không âm. items giữ snapshot tên/giá tại lúc bán. checkout_requests có PK(user_id, request_key). Không đổi runtime Node thành static Pages; SQLite cần volume, không tự chạy nhiều instance dùng file khác nhau.

## Hợp đồng API chính
- POST /api/login: username/password → cookie và username/role.
- GET /api/me; POST /api/logout.
- POST /api/password: current_password/new_password → hủy mọi phiên cũ.
- GET/POST /api/products; PATCH/DELETE /api/products/:id (ghi chỉ admin).
- POST /api/stock: product_id, qty, note (admin); GET /api/movements (200 bản ghi gần nhất).
- GET/POST /api/orders (danh sách 200 gần nhất). POST cần header Idempotency-Key 16–100 ký tự và items[{product_id,qty,expected_price}].
- GET /api/orders/:id trả chi tiết snapshot.
- POST /api/orders/:id/cancel (admin): hoàn hàng và tái kích hoạt sản phẩm nếu đã archive.
- GET /api/stats (admin): doanh thu hợp lệ, đơn, sản phẩm, cảnh báo, 30 ngày giao dịch gần nhất, top5.
- GET/POST /api/users (admin): danh sách chỉ trả id/username/role; tạo user mới với password 12–256 ký tự.

HTTP: 400 đầu vào sai/nghiệp vụ không hợp lệ; 401 chưa đăng nhập; 403 sai quyền/Origin; 404 không thấy; 409 mã trùng/idempotency conflict; 413 body quá lớn; 429 giới hạn đăng nhập; 500 lỗi hệ thống. Error response là {error:string}.

## Giới hạn bản nhỏ
Không phân trang lịch sử quá 200 bản ghi trên UI; không lợi nhuận/giá vốn; chưa có quên mật khẩu; rate-limit theo tài khoản trong RAM; chưa thử tải production; browser QA tự động đã có, UAT người dùng còn chờ. Các giới hạn này phải được người nghiệm thu chấp nhận hoặc đưa vào backlog thay đổi.

## Xác nhận giá và phân tách module0.4
Server kiểm expected_price trong cùng transaction trước khi ghi đơn. Giá không khớp trả409 PRICE_CHANGED, không ghi dữ liệu. UI làm mới giá và chờ xác nhận lại, không tự retry với giá mới. Các retry của đơn đã ghi vẫn trả đơn cũ theo key/payload.
Login limiter đếm lỗi theo account, không dùng IP proxy để khóa chung. Hash dùng scrypt bất đồng bộ, kiểm tra lại hash hiện tại trước phát hành session hoặc đổi password để tránh ghi dựa trên credential cũ trong yêu cầu đồng thời.
Server entry ở server.js; route trong src/routes; API/UI helper ở public/lib; mỗi màn hình trong public/views. Static module được phục vụ theo allowlist. /health chỉ trả trạng thái readiness sau khi DB khởi tạo.
