"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CarCard, { Car } from "@/components/CarCard";
import { api } from "@/lib/api";

const DEMO_FEATURED_CARS: Car[] = [
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
    carType: { name: "Sedan 5 chỗ", seats: 5 }
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
  }
];

const FAQS = [
  {
    q: "Thủ tục và giấy tờ cần thiết để thuê xe tự lái gồm những gì?",
    a: "Bạn chỉ cần chuẩn bị: (1) Căn cước công dân gắn chip hoặc tài khoản VNeID định danh mức 2, (2) Giấy phép lái xe ô tô hạng B1/B2 còn hiệu lực, (3) Tài sản thế chấp: Xe máy kèm cà vẹt gốc (giá trị > 15 triệu) hoặc tiền mặt/chuyển khoản từ 10 - 20 triệu đồng (sẽ hoàn lại ngay khi trả xe)."
  },
  {
    q: "Chính sách bảo hiểm tại DriveNow như thế nào?",
    a: "100% xe tại DriveNow đều được mua gói bảo hiểm vật chất thân vỏ 2 chiều chính hãng. Trong trường hợp xảy ra va quẹt ngoài ý muốn, bạn chỉ cần chịu mức phí miễn thường tiêu chuẩn từ 500.000đ - 1.000.000đ/vụ theo quy định bảo hiểm."
  },
  {
    q: "Có giới hạn số km di chuyển trong ngày không?",
    a: "Mỗi ngày thuê xe bạn được miễn phí định mức 350km - 400km (rất thoải mái cho hành trình du lịch hoặc công tác). Nếu vượt quá định mức, phí phụ trội chỉ từ 3.000đ - 5.000đ/km tùy dòng xe."
  },
  {
    q: "DriveNow có hỗ trợ giao xe và nhận xe tận nơi không?",
    a: "Có! Chúng tôi hỗ trợ giao và nhận xe tận nơi tại các sân bay lớn (Nội Bài, Tân Sơn Nhất, Đà Nẵng), khách sạn hoặc địa chỉ nhà riêng theo yêu cầu. Miễn phí giao nhận trong bán kính 5km từ các trạm xe của DriveNow."
  },
  {
    q: "Nếu muốn hủy hoặc đổi ngày nhận xe thì làm thế nào?",
    a: "Bạn có thể hủy chuyến miễn phí nếu thông báo trước giờ nhận xe ít nhất 24 giờ. Tiền đặt cọc sẽ được hoàn trả 100% về tài khoản của bạn trong vòng 1-3 ngày làm việc."
  }
];

export default function Home() {
  const router = useRouter();
  const [featuredCars, setFeaturedCars] = useState<Car[]>(DEMO_FEATURED_CARS);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Quick Search state
  const [searchLocation, setSearchLocation] = useState("");
  const [searchPickupDate, setSearchPickupDate] = useState("");
  const [searchReturnDate, setSearchReturnDate] = useState("");
  const [searchSeats, setSearchSeats] = useState("");

  useEffect(() => {
    api<{ content: Car[] }>("/api/cars?status=AVAILABLE&size=6")
      .then((res) => {
        if (res?.content && res.content.length > 0) {
          setFeaturedCars(res.content);
        }
      })
      .catch(() => {
        // Giữ demo cars fallback nếu API chưa chạy
      });
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.append("location", searchLocation);
    if (searchSeats) params.append("seats", searchSeats);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-copy">
            <div className="eyebrow">KHỞI ĐẦU HÀNH TRÌNH KHÔNG GIỚI HẠN</div>
            <h1>
              Chiếc xe phù hợp.<br />
              <em>Chuyến đi đáng nhớ.</em>
            </h1>
            <p>
              Hơn 100+ mẫu xe tự lái đời mới từ 4 đến 7 chỗ. Giá cả minh bạch, giao xe tận nơi chỉ trong 30 phút và hỗ trợ sự cố 24/7 toàn quốc.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/cars">
                Khám phá bộ sưu tập xe
              </Link>
              <a className="text-link" href="#process">
                Quy trình thuê xe →
              </a>
            </div>

            <div className="trust">
              <span>
                <b>100+</b> Xe đời mới 2022-2024
              </span>
              <span>
                <b>4.9/5</b> Đánh giá hài lòng
              </span>
              <span>
                <b>100%</b> Bảo hiểm 2 chiều
              </span>
              <span>
                <b>24/7</b> Cứu hộ khẩn cấp
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-banner-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="Xe ô tô tự lái DriveNow"
                className="hero-banner-img"
              />
              <div className="hero-badge-float">
                <div style={{ color: "#34d399", fontSize: "24px" }}>★</div>
                <div>
                  <strong>Kiểm định 160 điểm kỹ thuật</strong>
                  <small>Vệ sinh sạch sẽ, khử mùi trước mỗi chuyến giao</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SEARCH BAR (TÍCH HỢP TÌM XE NHANH) */}
      <div className="quick-search-wrapper">
        <form className="quick-search-box" onSubmit={handleQuickSearch}>
          <div className="search-field">
            <label>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Địa điểm nhận xe
            </label>
            <select
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            >
              <option value="">Tất cả khu vực</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
          </div>

          <div className="search-field">
            <label>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Ngày nhận xe
            </label>
            <input
              type="date"
              value={searchPickupDate}
              onChange={(e) => setSearchPickupDate(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Ngày trả xe
            </label>
            <input
              type="date"
              value={searchReturnDate}
              onChange={(e) => setSearchReturnDate(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7z" />
              </svg>
              Số chỗ ngồi
            </label>
            <select
              value={searchSeats}
              onChange={(e) => setSearchSeats(e.target.value)}
            >
              <option value="">Tất cả loại xe</option>
              <option value="4">Xe 4 - 5 chỗ (Sedan/Hatchback)</option>
              <option value="7">Xe 7 chỗ (SUV/MPV gia đình)</option>
            </select>
          </div>

          <div className="search-field-button">
            <button type="submit" className="button" style={{ height: "48px", width: "100%" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Tìm xe ngay
            </button>
          </div>
        </form>
      </div>

      {/* SECTION: XE NỔI BẬT */}
      <section className="section">
        <div className="section-head">
          <div className="section-title">
            <div className="eyebrow">DÀNH RIÊNG CHO BẠN</div>
            <h2>Đội xe nổi bật & Sẵn sàng bàn giao</h2>
            <p>Toàn bộ phương tiện đều được bảo dưỡng định kỳ, nội thất thơm tho, sạch sẽ.</p>
          </div>
          <Link href="/cars" className="button outline">
            Xem tất cả xe ({featuredCars.length}+) →
          </Link>
        </div>

        <div className="car-grid">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* SECTION: TẠI SAO CHỌN CHÚNG TÔI */}
      <section className="section" id="why-us" style={{ background: "#ffffff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="section-title" style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <div className="eyebrow">LỢI THẾ CẠNH TRANH</div>
          <h2>Tại sao hơn 20,000 khách hàng tin chọn DriveNow?</h2>
          <p>Chúng tôi mang đến trải nghiệm thuê xe tự lái chuẩn mực nhất với sự an tâm tuyệt đối.</p>
        </div>

        <div className="why-us-grid">
          <div className="why-card">
            <div className="why-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Bảo hiểm 2 chiều 100%</h3>
            <p>Mọi hành trình đều được bảo vệ toàn diện với gói bảo hiểm vật chất chính hãng, hạn chế tối đa rủi ro.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Thủ tục nhanh 5 phút</h3>
            <p>Đăng ký trực tuyến bằng CCCD hoặc VNeID, xác thực tự động nhanh gọn, không cần thế chấp rườm rà.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
            </div>
            <h3>Giao xe tận nơi miễn phí</h3>
            <p>Giao nhận xe linh hoạt tại nhà riêng, khách sạn hoặc sảnh sân bay đúng giờ hẹn, sẵn sàng lăn bánh.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3>Cứu hộ khẩn cấp 24/7</h3>
            <p>Đội ngũ kỹ thuật viên sẵn sàng trợ giúp xuyên suốt hành trình, hỗ trợ thay lốp dự phòng, ắc quy hoặc kéo xe.</p>
          </div>
        </div>
      </section>

      {/* SECTION: QUY TRÌNH 3 BƯỚC */}
      <section className="section" id="process">
        <div className="section-title" style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <div className="eyebrow">ĐƠN GIẢN & MINH BẠCH</div>
          <h2>Ba bước để bắt đầu hành trình của bạn</h2>
          <p>Chỉ cần vài thao tác đơn giản trên website là bạn đã sở hữu chiếc xe ưng ý.</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Chọn chiếc xe ưng ý</h3>
            <p>Tìm kiếm theo hãng xe, địa điểm nhận xe, mức giá phù hợp và nhu cầu di chuyển của gia đình bạn.</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Đặt lịch & Đặt cọc</h3>
            <p>Chọn ngày nhận xe, ngày trả xe và xem bảng kê tổng chi phí minh bạch không phát sinh chi phí ẩn.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Nhận xe & Khởi hành</h3>
            <p>Nhận xe tại địa điểm đã hẹn, kiểm tra bàn giao xe nhanh chóng trong 5 phút và bắt đầu chuyến đi an toàn.</p>
          </div>
        </div>
      </section>

      {/* SECTION: ĐÁNH GIÁ KHÁCH HÀNG */}
      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="section-title" style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <div className="eyebrow">KHÁCH HÀNG HÀI LÒNG</div>
          <h2>Cảm nhận từ những người đồng hành</h2>
          <p>Hơn 98% khách hàng đánh giá 5 sao cho chất lượng dịch vụ của chúng tôi.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              “Xe Mazda 3 đời mới chạy rất êm, nội thất sạch bóng không có mùi thuốc lá hay mùi khó chịu. Giao xe ngay tại sân bay Nội Bài đúng giờ, thủ tục chỉ mất 3 phút.”
            </p>
            <div className="testimonial-author">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Avatar Khách hàng"
                className="author-avatar"
              />
              <div className="author-info">
                <b>Trần Hoàng Yến</b>
                <span>Du lịch gia đình tại Hà Nội</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              “Thuê chiếc Fortuner đi công tác miền Tây 4 ngày, xe vận hành rất đầm chắc, tiết kiệm dầu. Hỗ trợ CSKH cực kỳ nhiệt tình khi tôi cần gia hạn thêm 1 buổi.”
            </p>
            <div className="testimonial-author">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Avatar Khách hàng"
                className="author-avatar"
              />
              <div className="author-info">
                <b>Nguyễn Minh Đức</b>
                <span>Kỹ sư xây dựng · TP.HCM</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">
              “Lần đầu tiên trải nghiệm xe điện VinFast VF8 của DriveNow, tăng tốc mượt mà và thông minh. Trạm sạc phủ sóng khắp nơi nên chuyến đi Đà Nẵng rất trọn vẹn.”
            </p>
            <div className="testimonial-author">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Avatar Khách hàng"
                className="author-avatar"
              />
              <div className="author-info">
                <b>Lê Quang Hải</b>
                <span>Nhiếp ảnh gia · Đà Nẵng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CÂU HỎI THƯỜNG GẶP (FAQ) */}
      <section className="section" id="faq">
        <div className="section-title" style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <div className="eyebrow">GIẢI ĐÁP THẮC MẮC</div>
          <h2>Câu hỏi thường gặp</h2>
          <p>Mọi thông tin bạn cần biết về quy trình, chi phí và quyền lợi khi thuê xe.</p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className={`faq-item ${isOpen ? "active" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon">+</span>
                </button>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}


