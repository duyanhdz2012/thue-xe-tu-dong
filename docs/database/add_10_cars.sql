USE car_rental;

START TRANSACTION;

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 1350000, 'SUV 5 chỗ linh hoạt, tiết kiệm nhiên liệu và phù hợp cho gia đình.', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', '30H-456.78', 'Hà Nội', 2025, 'Toyota Corolla Cross', 'AVAILABLE', 1, 2
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '30H-456.78');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 900000, 'Sedan nhỏ gọn, vận hành bền bỉ và tiết kiệm cho hành trình đô thị.', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80', '30G-234.56', 'Hà Nội', 2024, 'Toyota Vios', 'AVAILABLE', 1, 1
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '30G-234.56');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 1800000, 'SUV 7 chỗ mạnh mẽ, khoảng sáng gầm cao, thích hợp cho chuyến đi dài.', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80', '29H-678.90', 'Nội Bài', 2025, 'Toyota Fortuner', 'AVAILABLE', 1, 2
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '29H-678.90');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 850000, 'Xe điện đô thị nhỏ gọn, dễ lái và có chi phí vận hành thấp.', 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80', '30E-555.05', 'Hà Nội', 2025, 'VinFast VF 5', 'AVAILABLE', 2, 3
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '30E-555.05');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 1150000, 'Crossover điện hiện đại với nhiều công nghệ hỗ trợ lái an toàn.', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80', '30E-666.06', 'Hà Nội', 2026, 'VinFast VF 6', 'AVAILABLE', 2, 3
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '30E-666.06');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 2400000, 'SUV điện cao cấp, không gian rộng và phù hợp cho hành trình gia đình.', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80', '30E-999.09', 'Nội Bài', 2025, 'VinFast VF 9', 'AVAILABLE', 2, 3
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '30E-999.09');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 950000, 'Sedan trẻ trung, nội thất tiện nghi và vận hành ổn định.', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80', '30K-333.03', 'Hà Nội', 2024, 'Kia K3', 'AVAILABLE', 3, 1
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '30K-333.03');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 1200000, 'SUV đô thị thiết kế năng động, phù hợp cho cả công việc và du lịch.', 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80', '29K-246.80', 'Hà Nội', 2025, 'Kia Seltos', 'AVAILABLE', 3, 2
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '29K-246.80');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 1700000, 'SUV 7 chỗ rộng rãi, nhiều tiện nghi và hệ thống an toàn hiện đại.', 'https://images.unsplash.com/photo-1539799139339-50c5fe1e2b1b?auto=format&fit=crop&w=1200&q=80', '30K-789.12', 'Nội Bài', 2025, 'Kia Sorento', 'AVAILABLE', 3, 2
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '30K-789.12');

INSERT INTO cars (created_at, daily_price, description, image_url, license_plate, location, model_year, name, status, brand_id, car_type_id)
SELECT CURRENT_TIMESTAMP, 1000000, 'SUV cỡ nhỏ dễ điều khiển, khoang xe tiện dụng cho nhu cầu hàng ngày.', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', '30K-135.79', 'Hà Nội', 2024, 'Kia Sonet', 'AVAILABLE', 3, 2
WHERE NOT EXISTS (SELECT 1 FROM cars WHERE license_plate = '30K-135.79');

COMMIT;
