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

## Chạy dự án với MySQL (không mất dữ liệu)

Dự án dùng MySQL trong Docker, cổng `3307`, database `car_rental`. Dữ liệu được lưu trong Docker volume `car_rental_mysql`, vì vậy tắt backend, frontend, Docker Desktop hoặc chạy `docker compose down` sẽ không làm mất dữ liệu.

Yêu cầu: Java 21, Docker Desktop và Node.js đã được cài đặt.

### Terminal 1 - Khởi động MySQL

Mở PowerShell tại thư mục gốc của dự án:

```powershell
docker compose up -d mysql
docker compose ps
```

Chờ đến khi container `mysql` có trạng thái `healthy`.

### Terminal 2 - Khởi động backend bằng profile MySQL

Nếu backend cũ đang chạy, hãy nhấn `Ctrl + C` ở terminal cũ trước khi build. Nếu không, Windows có thể khóa file JAR và Maven báo `Failed to delete ... car-rental-1.0.0.jar`.

```powershell
cd backend
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.1\plugins\maven\lib\maven3\bin\mvn.cmd" clean package -DskipTests
java -jar target\car-rental-1.0.0.jar --spring.profiles.active=mysql
```

Nếu máy đã cài Maven và lệnh `mvn` hoạt động, có thể thay dòng Maven của IntelliJ bằng `mvn clean package -DskipTests`.

Phải có tham số `--spring.profiles.active=mysql`. Nếu chạy JAR không có tham số này, ứng dụng có thể dùng H2 và bạn sẽ không thấy dữ liệu MySQL.

- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

### Terminal 3 - Khởi động frontend

```powershell
cd frontend
npm install
npm run dev
```

Mở http://localhost:3000.

Nếu đã cài `pnpm`, có thể thay hai lệnh trên bằng `pnpm install` và `pnpm dev`.

## Tắt và chạy lại mà không mất database

Tắt backend/frontend bằng `Ctrl + C`, sau đó có thể dừng container:

```powershell
docker compose stop mysql
```

Lần sau chạy lại:

```powershell
docker compose start mysql
```

Hoặc luôn dùng `docker compose up -d mysql`; Docker sẽ tái sử dụng volume dữ liệu cũ.

> **Cảnh báo:** Không chạy `docker compose down -v` hoặc xóa volume `car_rental_mysql`. Tham số `-v` sẽ xóa toàn bộ dữ liệu MySQL của dự án.

## Tài khoản mẫu

- Admin: `admin@carrental.vn` / `Admin@123`
- Customer: `customer@carrental.vn` / `Customer@123`

## Cấu hình tùy chỉnh

Có thể ghi đè cấu hình bằng các biến môi trường `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` và `NEXT_PUBLIC_API_URL`.
