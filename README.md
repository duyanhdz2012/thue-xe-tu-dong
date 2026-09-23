# Car Rental Modular Monolith

Full-stack self-drive car rental project based on the supplied report. The backend is one deployable Spring Boot application split into business modules; the frontend is a Next.js application.

## Modules

- `identity`: registration, login, JWT, users and roles
- `catalog`: brands, car types and cars
- `booking`: rental orders, availability and status workflow
- `payment`: deposits and payment records
- `content`: news
- `dashboard`: admin statistics
- `shared`: security, errors and cross-module configuration

## Run locally

### Backend with the built-in development database

```powershell
cd backend
mvn clean package
java -jar target/car-rental-1.0.0.jar
```

API documentation: http://localhost:8080/swagger-ui.html

Seed accounts:

- Admin: `admin@carrental.vn` / `Admin@123`
- Customer: `customer@carrental.vn` / `Customer@123`

### Frontend

```powershell
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000.

### MySQL profile

```powershell
docker compose up -d mysql
cd backend
mvn clean package
java -jar target/car-rental-1.0.0.jar --spring.profiles.active=mysql
```

Environment variables can override `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and `NEXT_PUBLIC_API_URL`.

## Quản lý danh mục xe

- `/cars`: tìm theo tên, lọc hãng/loại, sắp xếp giá hoặc tên và phân trang.
- `/cars/{id}`: thông tin xe, giá thuê, ảnh đại diện và đặt xe khi xe sẵn sàng.
- `/admin/cars`: đăng nhập bằng tài khoản ADMIN để thêm/sửa/xóa xe, hãng và loại xe.
- Giá thuê là VNĐ/ngày, phải lớn hơn 0. Biển số không được trùng.
- Mỗi xe có một ảnh đại diện: nhập URL HTTP/HTTPS để xem trước, đổi hoặc xóa URL để bỏ ảnh. Chưa hỗ trợ tải tệp ảnh trực tiếp.
- Hãng/loại đang được xe sử dụng và xe đã có đơn thuê không thể xóa; có thể đổi trạng thái xe thành Ngừng hoạt động.
- API ghi dữ liệu yêu cầu quyền ADMIN; dữ liệu không hợp lệ trả 400, không tìm thấy trả 404, trùng/lỗi liên kết trả 409.

Kiểm tra: `cd backend && mvn test`; `cd frontend && pnpm build`.
Dữ liệu H2 mặc định chỉ dành cho chạy thử và mất khi khởi động lại. Dùng profile MySQL để lưu lâu dài.
