# DriveNow - Car Rental Microservices

Dự án thuê xe tự lái đã được tách từ modular monolith thành các ứng dụng độc lập, theo mẫu `api-gateway / auth-service / domain-service / frontend / docs`.

## Cấu trúc

```text
.
├── api-gateway/          Spring Cloud Gateway, cổng 8080
├── auth-service/         đăng ký, đăng nhập, JWT, người dùng, cổng 8081
├── car-service/          xe, hãng xe, loại xe, tin tức, cổng 8082
├── booking-service/      đặt xe, thanh toán, dashboard, cổng 8083
├── car-rental-frontend/  Next.js, cổng 3000
├── docs/                 kiến trúc và SQL tham khảo
├── docker-compose.yml    MySQL cổng 3307
└── pom.xml               Maven reactor build cho toàn bộ backend
```

Website được mở tại `http://localhost:3000`. Frontend gửi API tới Gateway tại `http://localhost:8080`, sau đó Gateway tự chuyển request sang đúng service.

> Không mở `http://localhost:8080` để sử dụng website. Cổng `8080` chỉ dành cho API và có thể trả về `403` hoặc `404` tại đường dẫn gốc.

## Yêu cầu

- Java 21
- Maven 3.9+
- Node.js 22+
- Docker Desktop

## Build toàn bộ backend

```powershell
mvn clean package -DskipTests
```

Nếu máy chưa có Maven trong `PATH`, dùng Maven đi kèm IntelliJ:

```powershell
& "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.1\plugins\maven\lib\maven3\bin\mvn.cmd" clean package -DskipTests
```

## Chạy đầy đủ với MySQL không mất dữ liệu

Mỗi khối bên dưới phải chạy trong một cửa sổ PowerShell riêng. Thư mục gốc dự án là:

```powershell
cd "J:\WEBSITE THUÊ XE Ô TÔ TỰ LÁI"
```

### Terminal 1 - MySQL

```powershell
cd "J:\WEBSITE THUÊ XE Ô TÔ TỰ LÁI"
docker compose up -d mysql
docker compose ps
```

Chờ container `websitethuxettli-mysql-1` có trạng thái `healthy`. MySQL chạy tại `localhost:3307` và dữ liệu được lưu trong Docker volume.

### Terminal 2 - Auth Service

```powershell
cd "J:\WEBSITE THUÊ XE Ô TÔ TỰ LÁI"
java -jar auth-service\target\auth-service-1.0.0.jar --spring.profiles.active=mysql
```

Kết quả mong đợi: Auth Service chạy ở cổng `8081` và log có kết nối MySQL `8.4`.

### Terminal 3 - Car Service

```powershell
cd "J:\WEBSITE THUÊ XE Ô TÔ TỰ LÁI"
java -jar car-service\target\car-service-1.0.0.jar --spring.profiles.active=mysql
```

Kết quả mong đợi: Car Service chạy ở cổng `8082`.

### Terminal 4 - Booking Service

```powershell
cd "J:\WEBSITE THUÊ XE Ô TÔ TỰ LÁI"
java -jar booking-service\target\booking-service-1.0.0.jar --spring.profiles.active=mysql
```

Kết quả mong đợi: Booking Service chạy ở cổng `8083`.

### Terminal 5 - API Gateway

```powershell
cd "J:\WEBSITE THUÊ XE Ô TÔ TỰ LÁI"
java -jar api-gateway\target\api-gateway-1.0.0.jar
```

Kiểm tra Gateway trong một PowerShell khác:

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health
```

Kết quả phải có `status` bằng `UP`.

### Terminal 6 - Frontend

```powershell
cd "J:\WEBSITE THUÊ XE Ô TÔ TỰ LÁI\car-rental-frontend"
npm install
npm run dev
```

Chỉ cần chạy `npm install` lần đầu hoặc khi `package.json` thay đổi. Sau đó mở website:

```text
http://localhost:3000
```

## Terminal 7 - Ngrok cho webhook SePay (tùy chọn)

Ngrok phải chuyển tiếp vào API Gateway ở cổng `8080`, không phải cổng `80`:

```powershell
C:\ngrok.exe http 8080
```

Webhook cấu hình trên SePay:

```text
https://walton-noninterpretational-unspeakably.ngrok-free.dev/api/payments/sepay/webhook
```

Nếu ngrok báo `ERR_NGROK_334`, domain này đã được một tiến trình ngrok khác sử dụng. Không mở tunnel thứ hai; có thể kiểm tra tunnel hiện tại tại `http://127.0.0.1:4040`.

## Dừng và chạy lại

Dừng backend, Gateway, frontend hoặc ngrok bằng `Ctrl + C` trong đúng Terminal của ứng dụng đó.

Dừng MySQL mà không xóa dữ liệu:

```powershell
docker compose stop mysql
```

Chạy lại MySQL và tái sử dụng dữ liệu cũ:

```powershell
docker compose up -d mysql
```

> Không chạy `docker compose down -v`. Tham số `-v` sẽ xóa Docker volume và toàn bộ dữ liệu MySQL của dự án.

## Xử lý lỗi 403

- Đảm bảo đang mở website tại `http://localhost:3000`, không phải `http://localhost:8080`.
- Đảm bảo cả ba service và Gateway đều đang chạy.
- Nếu vừa chuyển từ H2 sang MySQL, hãy đăng xuất rồi đăng nhập lại để thay JWT cũ.
- Kiểm tra Gateway bằng `Invoke-RestMethod http://localhost:8080/actuator/health`.

## Tài khoản mẫu

- Admin: `admin@carrental.vn` / `Admin@123`
- Customer: `customer@carrental.vn` / `Customer@123`

## Cấu hình

Các service dùng chung `JWT_SECRET`; khi đổi secret phải đặt cùng một giá trị cho `auth-service`, `car-service` và `booking-service`.

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: kết nối MySQL
- `JWT_SECRET`: khóa ký/xác minh JWT dùng chung
- `AUTH_SERVICE_URL`, `CAR_SERVICE_URL`, `BOOKING_SERVICE_URL`: địa chỉ nội bộ giữa các service
- `SEPAY_WEBHOOK_API_KEY`: khóa bảo vệ webhook SePay
- `NEXT_PUBLIC_API_URL`: URL gateway phía frontend

Dữ liệu MySQL cũ không bị xóa. Booking và payment mới dùng bảng `rental_bookings` và `rental_payments`, tránh thay đổi quan hệ khóa ngoại của bảng monolith cũ.
