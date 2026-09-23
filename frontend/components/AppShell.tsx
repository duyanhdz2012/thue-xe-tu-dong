"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname().startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main>{children}</main>
      {!isAdmin && (
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-col">
              <Link href="/" className="brand" style={{ color: "#ffffff", marginBottom: "16px" }}>
                <div className="brand-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <span>DRIVE</span>NOW
              </Link>
              <p>
                Nền tảng thuê xe ô tô tự lái công nghệ hàng đầu. Đội xe đời mới đa dạng, giá cả minh bạch, thủ tục online nhanh chóng và an toàn tuyệt đối trên mọi cung đường.
              </p>
              <div className="hotline-highlight">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  <small>Tổng đài đặt xe & CSKH 24/7</small>
                  <strong>1900 2026</strong>
                </div>
              </div>
            </div>

            <div className="footer-col">
              <h4>Dịch vụ & Dòng xe</h4>
              <ul>
                <li><Link href="/cars">Tất cả xe tự lái</Link></li>
                <li><Link href="/cars?seats=4">Xe 4-5 chỗ đô thị (Sedan/Hatchback)</Link></li>
                <li><Link href="/cars?seats=7">Xe 7 chỗ gia đình (SUV/MPV)</Link></li>
                <li><Link href="/cars">Thuê xe tự lái theo ngày</Link></li>
                <li><Link href="/cars">Thuê xe công tác & Du lịch</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Chính sách & Hướng dẫn</h4>
              <ul>
                <li><Link href="/#process">Quy trình 3 bước nhận xe</Link></li>
                <li><Link href="/#faq">Giấy tờ & Điều kiện thuê xe</Link></li>
                <li><Link href="/#faq">Quy định đặt cọc & Hoàn tiền</Link></li>
                <li><Link href="/#why-us">Gói bảo hiểm vật chất 2 chiều</Link></li>
                <li><Link href="/#faq">Hỗ trợ sự cố trên đường</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Hệ thống trạm nhận xe</h4>
              <p>📍 <b>Hà Nội:</b> Tòa Handico, Phạm Hùng, Nam Từ Liêm</p>
              <p>📍 <b>Đà Nẵng:</b> 120 Nguyễn Văn Linh, Q. Hải Châu</p>
              <p>📍 <b>TP. Hồ Chí Minh:</b> 45 Lê Duẩn, Bến Nghé, Quận 1</p>
              <p>✉️ <b>Email:</b> support@drivenow.vn</p>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © 2026 DRIVE NOW Việt Nam. Giấy phép kinh doanh vận tải số 0109988776.
            </div>
            <div>
              Hệ thống công nghệ Modular Monolith Next.js 15 & Spring Boot
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

