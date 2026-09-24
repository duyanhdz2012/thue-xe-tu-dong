"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CarCard, { Car } from "@/components/CarCard";
import { api } from "@/lib/api";

type Brand = { id: number; name: string };
type CarType = { id: number; name: string; seats: number };

const DEMO_FALLBACK_CARS: Car[] = [
  {
    id: 1,
    name: "Mazda 3 Premium 2023",
    licensePlate: "30G-888.99",
    dailyPrice: 900000,
    description: "Sedan thể thao sang trọng, cách âm tốt, cửa sổ trời, dàn âm thanh Bose 12 loa cao cấp.",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    location: "Hà Nội",
    modelYear: 2023,
    status: "AVAILABLE",
    brand: { name: "Mazda" },
    carType: { name: "Sedan", seats: 5 }
  },
  {
    id: 2,
    name: "Toyota Fortuner Legender 4x2",
    licensePlate: "51K-668.86",
    dailyPrice: 1400000,
    description: "SUV 7 chỗ gầm cao mạnh mẽ, tiện nghi gia đình vượt trội, thích hợp đi đèo dốc và dã ngoại.",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    location: "TP. Hồ Chí Minh",
    modelYear: 2023,
    status: "AVAILABLE",
    brand: { name: "Toyota" },
    carType: { name: "SUV 7 chỗ", seats: 7 }
  },
  {
    id: 3,
    name: "VinFast VF8 Plus",
    licensePlate: "43A-555.22",
    dailyPrice: 1200000,
    description: "Xe điện công nghệ cao, tăng tốc phấn khích 0-100km/h chỉ 5.5s, tích hợp hỗ trợ lái thông minh ADAS.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    location: "Đà Nẵng",
    modelYear: 2024,
    status: "AVAILABLE",
    brand: { name: "VinFast" },
    carType: { name: "Electric SUV", seats: 5 }
  },
  {
    id: 4,
    name: "Honda City RS 2023",
    licensePlate: "29A-991.12",
    dailyPrice: 750000,
    description: "Tiết kiệm nhiên liệu chỉ 5.5L/100km, cốp rộng rãi bậc nhất phân khúc, lái đầm chắc.",
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
    location: "Hà Nội",
    modelYear: 2023,
    status: "AVAILABLE",
    brand: { name: "Honda" },
    carType: { name: "Sedan B", seats: 5 }
  },
  {
    id: 5,
    name: "Kia Carnival Signature 7 chỗ",
    licensePlate: "51H-778.89",
    dailyPrice: 1800000,
    description: "Chuyên cơ mặt đất, ghế thương gia ngả lưng chỉnh điện, màn hình trần giải trí đỉnh cao.",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    location: "TP. Hồ Chí Minh",
    modelYear: 2023,
    status: "AVAILABLE",
    brand: { name: "Kia" },
    carType: { name: "MPV VIP", seats: 7 }
  },
  {
    id: 6,
    name: "Hyundai SantaFe Premium AWD",
    licensePlate: "43C-667.12",
    dailyPrice: 1350000,
    description: "Dẫn động 4 bánh HTRAC, cửa sổ trời toàn cảnh panorama, camera 360 sắc nét.",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    location: "Đà Nẵng",
    modelYear: 2022,
    status: "AVAILABLE",
    brand: { name: "Hyundai" },
    carType: { name: "SUV 7 chỗ", seats: 7 }
  }
];

function CarsContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get("location") || "";
  const initialSeats = searchParams.get("seats") || "";

  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation);
  const [selectedSeats, setSelectedSeats] = useState<string>(initialSeats);
  const [sort, setSort] = useState("dailyPrice,asc");

  // Load brands and types
  useEffect(() => {
    api<Brand[]>("/api/brands")
      .then(setBrands)
      .catch(() => {});
    api<CarType[]>("/api/car-types")
      .then(setTypes)
      .catch(() => {});
  }, []);

  // Fetch cars
  useEffect(() => {
    setLoading(true);
    let url = `/api/cars?status=AVAILABLE&size=100&sort=${sort}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    if (selectedBrand) url += `&brandId=${selectedBrand}`;

    const timer = setTimeout(() => {
      api<{ content: Car[] }>(url)
        .then((res) => {
          let list = res?.content || [];
          if (list.length === 0 && !query && !selectedBrand) {
            list = DEMO_FALLBACK_CARS;
          }
          setCars(list);
          setLoading(false);
        })
        .catch(() => {
          // Fallback demo data
          setCars(DEMO_FALLBACK_CARS);
          setLoading(false);
        });
    }, 200);

    return () => clearTimeout(timer);
  }, [query, selectedBrand, sort]);

  // Client-side filtering for Location & Seats (if not completely handled in backend params)
  const filteredCars = cars.filter((car) => {
    if (selectedLocation && car.location && !car.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }
    if (selectedSeats) {
      const seatsNum = Number(selectedSeats);
      if (seatsNum === 4 && (car.carType?.seats > 5)) return false;
      if (seatsNum === 7 && (car.carType?.seats < 7)) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setQuery("");
    setSelectedBrand("");
    setSelectedLocation("");
    setSelectedSeats("");
    setSort("dailyPrice,asc");
  };

  return (
    <section className="section">
      <div className="section-head">
        <div className="section-title">
          <div className="eyebrow">BỘ SƯU TẬP XE TỰ LÁI</div>
          <h2>Chọn chiếc xe phù hợp cho chuyến đi</h2>
          <p>Giá thuê theo ngày, minh bạch 100%, bảo hiểm vật chất 2 chiều đầy đủ.</p>
        </div>

        <div style={{ color: "var(--muted)", fontSize: "14px", fontWeight: 600 }}>
          Tìm thấy <b>{filteredCars.length}</b> xe sẵn sàng
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="cars-filter-bar">
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Tìm theo tên xe (Mazda, Fortuner, VF8...)"
        />

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Tất cả hãng xe</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id.toString()}>
              {b.name}
            </option>
          ))}
          {brands.length === 0 && (
            <>
              <option value="toyota">Toyota</option>
              <option value="mazda">Mazda</option>
              <option value="vinfast">VinFast</option>
              <option value="hyundai">Hyundai</option>
              <option value="kia">Kia</option>
              <option value="honda">Honda</option>
            </>
          )}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">Tất cả địa điểm</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
        </select>

        <select
          value={selectedSeats}
          onChange={(e) => setSelectedSeats(e.target.value)}
        >
          <option value="">Tất cả số ghế</option>
          <option value="4">4 - 5 chỗ</option>
          <option value="7">7 chỗ</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="dailyPrice,asc">Giá thấp đến cao</option>
          <option value="dailyPrice,desc">Giá cao đến thấp</option>
          <option value="name,asc">Tên A-Z</option>
        </select>

        {(query || selectedBrand || selectedLocation || selectedSeats) && (
          <button
            onClick={resetFilters}
            className="ghost"
            style={{ height: "44px" }}
          >
            ✕ Xóa bộ lọc
          </button>
        )}
      </div>

      {/* CAR GRID OR EMPTY STATE */}
      {loading ? (
        <div className="loading">Đang tải danh sách xe...</div>
      ) : filteredCars.length > 0 ? (
        <div className="car-grid">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "#ffffff",
            padding: "60px 20px",
            textAlign: "center",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--line)"
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🚗🔍</div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px" }}>
            Không tìm thấy xe phù hợp
          </h3>
          <p style={{ color: "var(--muted)", maxWidth: "420px", margin: "0 auto 20px" }}>
            Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc vị trí / số ghế.
          </p>
          <button className="button small" onClick={resetFilters}>
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </section>
  );
}

export default function Cars() {
  return (
    <Suspense fallback={<div className="loading">Đang tải dữ liệu...</div>}>
      <CarsContent />
    </Suspense>
  );
}


