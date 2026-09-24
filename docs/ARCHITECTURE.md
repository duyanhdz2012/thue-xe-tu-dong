# Kiến trúc microservice

## Luồng request

```text
Browser :3000
    |
    v
API Gateway :8080
    |-- /api/auth, /api/users ----------------> Auth Service :8081
    |-- /api/cars, /api/brands,
    |   /api/car-types, /api/news ------------> Car Service :8082
    `-- /api/bookings, /api/payments,
        /api/dashboard -----------------------> Booking Service :8083
```

## Trách nhiệm

### API Gateway

- Một điểm truy cập duy nhất cho frontend.
- Định tuyến theo nhóm URL.
- Cấu hình CORS tập trung.
- Không chứa nghiệp vụ và không truy cập database.

### Auth Service

- Sở hữu tài khoản, hồ sơ người dùng và vai trò.
- Phát hành JWT có `subject=email` và claim `role`.
- Các service phía sau xác minh JWT bằng cùng `JWT_SECRET` mà không truy vấn bảng users.

### Car Service

- Sở hữu catalog xe, hãng xe, loại xe và tin tức.
- Cho phép đọc catalog công khai; thao tác quản trị yêu cầu role `ADMIN`.

### Booking Service

- Sở hữu vòng đời booking, payment, SePay webhook và thống kê giao dịch.
- Gọi Car Service qua HTTP khi tạo booking để kiểm tra xe và chụp snapshot tên/giá xe.
- Dashboard gọi Auth Service và Car Service để tổng hợp số user và số xe.
- Không ánh xạ JPA trực tiếp sang entity của service khác.

## Dữ liệu

Trong giai đoạn chuyển đổi, ba service cùng kết nối database `car_rental` nhưng mỗi service chỉ scan và quản lý entity thuộc phạm vi của mình. Booking mới dùng `rental_bookings` và `rental_payments`; các bảng monolith cũ vẫn được giữ nguyên để không phá dữ liệu hiện có.

Khi triển khai production, có thể tách schema/database vật lý cho từng service mà không cần thay đổi API công khai. Trước khi tách database booking, cần viết migration cho các bản ghi cũ nếu muốn mang theo lịch sử.

## Nguyên tắc phụ thuộc

- Frontend chỉ phụ thuộc gateway.
- Gateway chỉ định tuyến, không gọi repository.
- Auth Service và Car Service không phụ thuộc Booking Service.
- Booking Service chỉ phụ thuộc API công khai của Auth/Car, không import class domain của chúng.
- Secret và URL được truyền qua biến môi trường, không hard-code cho production.
