"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api, getSession, money } from "@/lib/api";

type Stats = {
  users: number;
  cars: number;
  bookings: number;
  pendingBookings: number;
  revenue: number;
};

type Booking = {
  id: number;
  customer: { name: string; email: string; phone?: string };
  car: { name: string };
  pickupDate: string;
  returnDate: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  createdAt: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  locked: boolean;
  createdAt: string;
};

type Payment = {
  id: number;
  booking: Booking;
  amount: number;
  method: string;
  status: string;
  transactionCode: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  provider?: string;
  createdAt: string;
};

type Car = {
  id: number;
  name: string;
  licensePlate: string;
  dailyPrice: number;
  description?: string;
  imageUrl?: string;
  location: string;
  modelYear: number;
  status: string;
  brand: { id: number; name: string };
  carType: { id: number; name: string; seats: number };
};

type Brand = { id: number; name: string };
type CarType = { id: number; name: string; seats: number };
type Tab = "overview" | "cars" | "bookings" | "customers" | "payments";

const statusName: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  ACTIVE: "Đang thuê",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
  REFUNDED: "Hoàn tiền",
};

const methodName: Record<string, string> = {
  CASH: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản NH",
  MOMO: "Ví MoMo",
  VNPAY: "Cổng VNPay",
};

export default function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [carModal, setCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const emptyCar = {
    name: "",
    licensePlate: "",
    dailyPrice: "",
    description: "",
    imageUrl: "",
    location: "Hà Nội",
    modelYear: String(new Date().getFullYear()),
    status: "AVAILABLE",
    brandId: "",
    carTypeId: "",
  };
  const [carForm, setCarForm] = useState(emptyCar);

  const load = async () => {
    try {
      setError("");
      setRefreshing(true);
      const [s, b, u, p, c, br, t] = await Promise.all([
        api<Stats>("/api/dashboard"),
        api<Booking[]>("/api/bookings"),
        api<User[]>("/api/users"),
        api<Payment[]>("/api/payments"),
        api<{ content: Car[] }>("/api/cars?size=100&sort=createdAt,desc"),
        api<Brand[]>("/api/brands"),
        api<CarType[]>("/api/car-types"),
      ]);
      setStats(s);
      setBookings(b);
      setUsers(u);
      setPayments(p);
      setCars(c.content);
      setBrands(br);
      setCarTypes(t);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (getSession()?.role !== "ADMIN") {
      location.href = "/login";
    } else {
      void load();
    }
  }, []);

  const visibleBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          (filter === "ALL" || b.status === filter) &&
          `${b.id} ${b.customer.name} ${b.customer.email} ${b.customer.phone || ""} ${b.car.name}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [bookings, query, filter]
  );

  const visibleUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.role === "CUSTOMER" &&
          `${u.name} ${u.email} ${u.phone || ""} ${u.address || ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [users, query]
  );

  const visibleCars = useMemo(
    () =>
      cars.filter(
        (c) =>
          (filter === "ALL" || c.status === filter) &&
          `${c.name} ${c.licensePlate} ${c.brand.name} ${c.location}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [cars, query, filter]
  );

  const visiblePayments = useMemo(
    () =>
      payments.filter((p) =>
        `${p.transactionCode} ${p.payerName} ${p.payerEmail} ${p.payerPhone || ""} ${p.booking?.car?.name || ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [payments, query]
  );

  async function changeStatus(id: number, value: string) {
    try {
      setBusy(id);
      await api(`/api/bookings/${id}/status?value=${value}`, { method: "PATCH" });
      setSuccess(`Đã cập nhật trạng thái đơn #${id} thành công.`);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function toggleLock(id: number) {
    try {
      setBusy(id);
      await api(`/api/users/${id}/lock`, { method: "PATCH" });
      setSuccess(`Đã thay đổi trạng thái tài khoản #${id}.`);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  function openCar(car?: Car) {
    setError("");
    setSuccess("");
    setEditingCar(car || null);
    setCarForm(
      car
        ? {
            name: car.name,
            licensePlate: car.licensePlate,
            dailyPrice: String(car.dailyPrice),
            description: car.description || "",
            imageUrl: car.imageUrl || "",
            location: car.location || "",
            modelYear: String(car.modelYear),
            status: car.status,
            brandId: String(car.brand.id),
            carTypeId: String(car.carType.id),
          }
        : {
            ...emptyCar,
            brandId: String(brands[0]?.id || ""),
            carTypeId: String(carTypes[0]?.id || ""),
          }
    );
    setCarModal(true);
  }

  async function saveCar(e: React.FormEvent) {
    e.preventDefault();
    try {
      setBusy(editingCar?.id || -1);
      setError("");
      const payload = {
        ...carForm,
        dailyPrice: Number(carForm.dailyPrice),
        modelYear: Number(carForm.modelYear),
        brandId: Number(carForm.brandId),
        carTypeId: Number(carForm.carTypeId),
      };
      await api(editingCar ? `/api/cars/${editingCar.id}` : "/api/cars", {
        method: editingCar ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setSuccess(
        editingCar
          ? `Đã cập nhật thông tin xe "${carForm.name}" thành công.`
          : `Đã thêm xe mới "${carForm.name}" vào hệ thống.`
      );
      await load();
      setTimeout(() => setCarModal(false), 500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const goto = (next: Tab) => {
    setTab(next);
    setQuery("");
    setFilter("ALL");
  };

  const navItems: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      key: "overview",
      label: "Tổng quan",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      key: "cars",
      label: "Quản lý xe",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
      count: stats?.cars,
    },
    {
      key: "bookings",
      label: "Đơn thuê xe",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      ),
      count: stats?.pendingBookings && stats.pendingBookings > 0 ? stats.pendingBookings : undefined,
    },
    {
      key: "customers",
      label: "Khách hàng",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      count: stats?.users,
    },
    {
      key: "payments",
      label: "Lịch sử thanh toán",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      ),
    },
  ];

  const pageHeadings: Record<Tab, { title: string; subtitle: string }> = {
    overview: {
      title: "Tổng quan kinh doanh",
      subtitle: "Báo cáo doanh thu, tiến độ bàn giao xe và hiệu suất vận hành toàn hệ thống",
    },
    cars: {
      title: "Quản lý đội xe tự lái",
      subtitle: "Danh mục các mẫu xe sẵn sàng phục vụ, lịch bảo dưỡng và định giá thuê theo ngày",
    },
    bookings: {
      title: "Danh sách đơn thuê xe",
      subtitle: "Theo dõi, xét duyệt lịch trình nhận - trả xe và xác nhận trạng thái đơn đặt",
    },
    customers: {
      title: "Quản lý khách hàng",
      subtitle: "Hồ sơ người dùng đăng ký thuê xe, xác thực danh tính và kiểm soát quyền truy cập",
    },
    payments: {
      title: "Lịch sử giao dịch & Thanh toán",
      subtitle: "Toàn bộ dòng tiền đặt cọc, thanh toán online và biên lai hoàn tất qua hệ thống",
    },
  };

  return (
    <section className="admin-shell">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div className="admin-brand-text">
            <div className="admin-brand-title">
              DRIVENOW <span className="admin-brand-badge">ADMIN</span>
            </div>
            <div className="admin-brand-subtitle">Trung tâm điều hành</div>
          </div>
        </div>

        <div className="admin-sidebar-nav-wrap">
          <div className="admin-nav-group-title">QUẢN LÝ HỆ THỐNG</div>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-btn ${tab === item.key ? "active" : ""}`}
              onClick={() => goto(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.count !== undefined && <span className="admin-nav-count">{item.count}</span>}
            </button>
          ))}
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-avatar-small">AD</div>
            <div className="admin-user-info">
              <span className="admin-user-name">Quản trị viên</span>
              <span className="admin-user-role">admin@carrental.vn</span>
            </div>
          </div>
          <Link href="/" className="admin-back-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Về trang chủ website</span>
          </Link>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="admin-content">
        {/* TOPBAR */}
        <div className="admin-topbar">
          <div className="admin-title-area">
            <div className="admin-breadcrumb">
              <span>DriveNow Admin</span> / <span>{navItems.find((n) => n.key === tab)?.label}</span>
            </div>
            <h1 className="admin-page-heading">{pageHeadings[tab].title}</h1>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--admin-text-muted)" }}>
              {pageHeadings[tab].subtitle}
            </p>
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-system-status">
              <span className="admin-status-dot"></span>
              <span>Hệ thống ổn định</span>
            </div>

            <button
              className="admin-btn-secondary"
              onClick={() => void load()}
              title="Tải lại dữ liệu"
              disabled={refreshing}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }}
              >
                <path d="M23 4v6h-6"></path>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>{refreshing ? "Đang tải..." : "Làm mới"}</span>
            </button>

            <button className="admin-btn-primary" onClick={() => openCar()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ Thêm xe mới</span>
            </button>
          </div>
        </div>

        {/* ALERTS */}
        {error && !carModal && (
          <div className="admin-alert error">
            <span>⚠️ {error}</span>
            <button
              style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", fontWeight: 700 }}
              onClick={() => setError("")}
            >
              ✕
            </button>
          </div>
        )}
        {success && !carModal && (
          <div className="admin-alert success">
            <span>✓ {success}</span>
            <button
              style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", fontWeight: 700 }}
              onClick={() => setSuccess("")}
            >
              ✕
            </button>
          </div>
        )}

        {/* ================= TAB 1: OVERVIEW ================= */}
        {tab === "overview" && (
          <>
            {stats && (
              <div className="admin-stats-grid">
                {/* Revenue Card */}
                <div className="admin-stat-card" onClick={() => goto("payments")}>
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">Doanh thu tích lũy</span>
                    <div className="admin-stat-icon emerald">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="admin-stat-value">{money(stats.revenue)}</div>
                  <div className="admin-stat-footer">
                    <span>Thanh toán thành công</span>
                    <span className="admin-stat-badge success">Ổn định</span>
                  </div>
                </div>

                {/* Pending Bookings Card */}
                <div className="admin-stat-card" onClick={() => goto("bookings")}>
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">Đơn chờ duyệt</span>
                    <div className="admin-stat-icon amber">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="admin-stat-value">{stats.pendingBookings}</div>
                  <div className="admin-stat-footer">
                    <span>Yêu cầu mới</span>
                    {stats.pendingBookings > 0 ? (
                      <span className="admin-stat-badge alert">Cần xử lý ngay</span>
                    ) : (
                      <span className="admin-stat-badge success">Đã xử lý hết</span>
                    )}
                  </div>
                </div>

                {/* Cars Card */}
                <div className="admin-stat-card" onClick={() => goto("cars")}>
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">Quy mô đội xe</span>
                    <div className="admin-stat-icon blue">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    </div>
                  </div>
                  <div className="admin-stat-value">{stats.cars}</div>
                  <div className="admin-stat-footer">
                    <span>Xe trong gara & lưu thông</span>
                    <span style={{ fontWeight: 600, color: "var(--admin-primary)" }}>Chi tiết →</span>
                  </div>
                </div>

                {/* Customers Card */}
                <div className="admin-stat-card" onClick={() => goto("customers")}>
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">Khách hàng thành viên</span>
                    <div className="admin-stat-icon purple">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="admin-stat-value">{stats.users}</div>
                  <div className="admin-stat-footer">
                    <span>Tài khoản đã đăng ký</span>
                    <span style={{ fontWeight: 600, color: "#7c3aed" }}>Quản lý →</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders Panel */}
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <h2 className="admin-panel-title">Đơn thuê xe mới cập nhật</h2>
                  <p className="admin-panel-desc">
                    Xử lý nhanh các yêu cầu đặt xe vừa được khách hàng khởi tạo trên hệ thống
                  </p>
                </div>
                <button
                  className="admin-btn-secondary"
                  onClick={() => goto("bookings")}
                  style={{ fontSize: "12px", padding: "6px 14px" }}
                >
                  Xem toàn bộ {bookings.length} đơn →
                </button>
              </div>

              <BookingTable
                rows={bookings.slice(0, 6)}
                busy={busy}
                changeStatus={changeStatus}
              />
            </div>
          </>
        )}

        {/* ================= TAB 2: CARS ================= */}
        {tab === "cars" && (
          <>
            <div className="admin-toolbar">
              <div className="admin-search-input-wrap">
                <div className="admin-search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  className="admin-search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tên xe, biển số, thương hiệu, địa điểm..."
                />
              </div>

              <select
                className="admin-select-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái xe</option>
                <option value="AVAILABLE">Sẵn sàng phục vụ</option>
                <option value="RENTED">Đang trong chuyến đi</option>
                <option value="MAINTENANCE">Đang bảo dưỡng</option>
              </select>

              <span className="admin-count-pill">
                Hiển thị {visibleCars.length} / {cars.length} xe
              </span>
            </div>

            <div className="admin-fleet-grid">
              {visibleCars.map((car) => {
                const statusClass =
                  car.status === "AVAILABLE"
                    ? "completed"
                    : car.status === "RENTED"
                    ? "active"
                    : "pending";
                const statusLabel =
                  car.status === "AVAILABLE"
                    ? "Sẵn sàng"
                    : car.status === "RENTED"
                    ? "Đang thuê"
                    : "Bảo dưỡng";

                return (
                  <article className="admin-fleet-card" key={car.id}>
                    <div
                      className="admin-fleet-img-wrap"
                      style={{
                        backgroundImage: `url(${
                          car.imageUrl ||
                          "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=70"
                        })`,
                      }}
                    >
                      <span className={`admin-badge ${statusClass} admin-fleet-badge`}>
                        {statusLabel}
                      </span>
                      <div className="admin-fleet-price-pill">
                        {money(car.dailyPrice)} <small>/ ngày</small>
                      </div>
                    </div>

                    <div className="admin-fleet-body">
                      <div className="admin-fleet-tagline">
                        {car.brand.name} · {car.carType.name}
                      </div>
                      <h3 className="admin-fleet-title">{car.name}</h3>

                      <div className="admin-fleet-specs">
                        <span className="admin-spec-pill">
                          🚗 Biển: {car.licensePlate}
                        </span>
                        <span className="admin-spec-pill">
                          👥 {car.carType.seats} chỗ
                        </span>
                        <span className="admin-spec-pill">
                          📅 Đời {car.modelYear}
                        </span>
                        <span className="admin-spec-pill">
                          📍 {car.location}
                        </span>
                      </div>

                      <div className="admin-fleet-footer">
                        <span style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                          Mã xe: #{car.id}
                        </span>
                        <button
                          className="admin-table-action-btn"
                          onClick={() => openCar(car)}
                        >
                          ✏️ Chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!visibleCars.length && (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">🚗</div>
                <strong style={{ fontSize: "16px" }}>Không tìm thấy xe phù hợp</strong>
                <p style={{ margin: 0, fontSize: "13px" }}>
                  Hãy thử đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để thêm xe mới.
                </p>
                <button
                  className="admin-btn-primary"
                  onClick={() => openCar()}
                  style={{ marginTop: "12px" }}
                >
                  + Thêm xe mới ngay
                </button>
              </div>
            )}
          </>
        )}

        {/* ================= TAB 3: BOOKINGS ================= */}
        {tab === "bookings" && (
          <>
            <div className="admin-toolbar">
              <div className="admin-search-input-wrap">
                <div className="admin-search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  className="admin-search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo mã đơn (#12), họ tên, email, xe thuê..."
                />
              </div>

              <select
                className="admin-select-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái đơn</option>
                {Object.entries(statusName)
                  .filter(([k]) => !["SUCCESS", "FAILED", "REFUNDED"].includes(k))
                  .map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
              </select>

              <span className="admin-count-pill">
                Hiển thị {visibleBookings.length} / {bookings.length} đơn
              </span>
            </div>

            <div className="admin-panel">
              <BookingTable
                rows={visibleBookings}
                busy={busy}
                changeStatus={changeStatus}
              />
            </div>
          </>
        )}

        {/* ================= TAB 4: CUSTOMERS ================= */}
        {tab === "customers" && (
          <>
            <div className="admin-toolbar">
              <div className="admin-search-input-wrap">
                <div className="admin-search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  className="admin-search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tên khách, email, số điện thoại, địa chỉ..."
                />
              </div>

              <span className="admin-count-pill">
                Tổng cộng {visibleUsers.length} khách hàng
              </span>
            </div>

            <div className="admin-panel">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Khách hàng</th>
                      <th>Thông tin liên hệ</th>
                      <th>Địa chỉ</th>
                      <th>Ngày tham gia</th>
                      <th>Trạng thái tài khoản</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                background: "#f1f5f9",
                                color: "#0f172a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "13px",
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="admin-cell-title">{u.name}</span>
                              <span className="admin-cell-sub">
                                KH-{String(u.id).padStart(4, "0")}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="admin-cell-title">{u.email}</span>
                          <span className="admin-cell-sub">
                            {u.phone || "Chưa cập nhật SĐT"}
                          </span>
                        </td>
                        <td>{u.address || "Chưa cập nhật"}</td>
                        <td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                        <td>
                          <span
                            className={`admin-badge ${u.locked ? "cancelled" : "completed"}`}
                          >
                            {u.locked ? "● Đã khóa" : "● Đang hoạt động"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            disabled={busy === u.id}
                            className={`admin-table-action-btn ${
                              u.locked ? "success" : "danger"
                            }`}
                            onClick={() => toggleLock(u.id)}
                          >
                            {busy === u.id
                              ? "Đang xử lý..."
                              : u.locked
                              ? "Mở khóa tài khoản"
                              : "Khóa tài khoản"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visibleUsers.length && <Empty />}
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 5: PAYMENTS ================= */}
        {tab === "payments" && (
          <>
            <div className="admin-toolbar">
              <div className="admin-search-input-wrap">
                <div className="admin-search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  className="admin-search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo mã giao dịch, người nộp, xe thuê..."
                />
              </div>

              <span className="admin-count-pill">
                Hiển thị {visiblePayments.length} giao dịch
              </span>
            </div>

            <div className="admin-panel">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã giao dịch</th>
                      <th>Đơn thuê liên kết</th>
                      <th>Người thanh toán</th>
                      <th>Phương thức</th>
                      <th>Số tiền</th>
                      <th>Thời gian giao dịch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visiblePayments.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className="admin-cell-title" style={{ fontFamily: "monospace", fontSize: "14px" }}>
                            {p.transactionCode}
                          </span>
                          <span className="admin-badge completed" style={{ marginTop: "4px" }}>
                            ✓ {statusName[p.status] || p.status}
                          </span>
                        </td>
                        <td>
                          <span className="admin-cell-title">
                            Đơn #{p.booking?.id || "N/A"}
                          </span>
                          <span className="admin-cell-sub">
                            {p.booking?.car?.name || "Xe tự lái"}
                          </span>
                        </td>
                        <td>
                          <span className="admin-cell-title">{p.payerName}</span>
                          <span className="admin-cell-sub">
                            {p.payerPhone ? `${p.payerPhone} · ` : ""}
                            {p.payerEmail}
                          </span>
                        </td>
                        <td>
                          <span className="admin-cell-title">
                            {methodName[p.method] || p.method}
                          </span>
                          {p.provider && (
                            <span className="admin-cell-sub">{p.provider}</span>
                          )}
                        </td>
                        <td>
                          <strong style={{ color: "var(--admin-primary)", fontSize: "14px" }}>
                            {money(p.amount)}
                          </strong>
                        </td>
                        <td>{new Date(p.createdAt).toLocaleString("vi-VN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visiblePayments.length && <Empty />}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================= MODAL: THÊM / SỬA XE ================= */}
      {carModal && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCarModal(false);
          }}
        >
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--admin-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  HỆ THỐNG ĐỘI XE
                </span>
                <h2>{editingCar ? "Chỉnh sửa thông tin xe" : "Thêm xe mới vào hệ thống"}</h2>
              </div>
              <button
                className="admin-modal-close-btn"
                onClick={() => setCarModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveCar}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-field">
                    <label>Tên xe & Phiên bản *</label>
                    <input
                      required
                      value={carForm.name}
                      onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                      placeholder="VD: Toyota Camry 2.5Q"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Biển số kiểm soát *</label>
                    <input
                      required
                      value={carForm.licensePlate}
                      onChange={(e) =>
                        setCarForm({ ...carForm, licensePlate: e.target.value.toUpperCase() })
                      }
                      placeholder="30A-999.88"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Hãng sản xuất *</label>
                    <select
                      required
                      value={carForm.brandId}
                      onChange={(e) => setCarForm({ ...carForm, brandId: e.target.value })}
                    >
                      <option value="">-- Chọn thương hiệu --</option>
                      {brands.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-field">
                    <label>Phân khúc & Số chỗ *</label>
                    <select
                      required
                      value={carForm.carTypeId}
                      onChange={(e) => setCarForm({ ...carForm, carTypeId: e.target.value })}
                    >
                      <option value="">-- Chọn phân khúc --</option>
                      {carTypes.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.name} · ({x.seats} chỗ)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-field">
                    <label>Giá thuê mỗi ngày (VNĐ) *</label>
                    <input
                      required
                      type="number"
                      min="100000"
                      step="50000"
                      value={carForm.dailyPrice}
                      onChange={(e) => setCarForm({ ...carForm, dailyPrice: e.target.value })}
                      placeholder="800000"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Năm sản xuất *</label>
                    <input
                      required
                      type="number"
                      min="2010"
                      max={new Date().getFullYear() + 1}
                      value={carForm.modelYear}
                      onChange={(e) => setCarForm({ ...carForm, modelYear: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Địa điểm bàn giao xe *</label>
                    <input
                      required
                      value={carForm.location}
                      onChange={(e) => setCarForm({ ...carForm, location: e.target.value })}
                      placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Trạng thái hiện tại *</label>
                    <select
                      value={carForm.status}
                      onChange={(e) => setCarForm({ ...carForm, status: e.target.value })}
                    >
                      <option value="AVAILABLE">Sẵn sàng phục vụ</option>
                      <option value="RENTED">Đang trong chuyến đi</option>
                      <option value="MAINTENANCE">Đang bảo dưỡng định kỳ</option>
                    </select>
                  </div>

                  <div className="admin-form-field admin-form-full">
                    <label>Đường dẫn ảnh đại diện (URL)</label>
                    <input
                      type="url"
                      value={carForm.imageUrl}
                      onChange={(e) => setCarForm({ ...carForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {carForm.imageUrl && (
                      <div
                        className="admin-img-preview-box"
                        style={{ backgroundImage: `url(${carForm.imageUrl})` }}
                      />
                    )}
                  </div>

                  <div className="admin-form-field admin-form-full">
                    <label>Mô tả chi tiết & Tiện nghi xe *</label>
                    <textarea
                      required
                      rows={3}
                      value={carForm.description}
                      onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                      placeholder="Mô tả ưu điểm xe: số tự động, cửa sổ trời, camera 360, tiết kiệm nhiên liệu..."
                    />
                  </div>
                </div>

                {error && <p className="admin-alert error" style={{ marginTop: "16px" }}>{error}</p>}
                {success && <p className="admin-alert success" style={{ marginTop: "16px" }}>{success}</p>}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setCarModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={busy !== null}
                  className="admin-btn-primary"
                >
                  {busy !== null
                    ? "Đang lưu..."
                    : editingCar
                    ? "Lưu thay đổi"
                    : "Thêm xe vào hệ thống"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

/* ================= SUB-COMPONENTS ================= */

function BookingTable({
  rows,
  busy,
  changeStatus,
}: {
  rows: Booking[];
  busy: number | null;
  changeStatus: (id: number, value: string) => void;
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Xe thuê</th>
            <th>Thời gian thuê</th>
            <th>Thanh toán</th>
            <th>Trạng thái đơn</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => {
            const pct = Math.min(100, Math.round((b.paidAmount / (b.totalAmount || 1)) * 100));

            return (
              <tr key={b.id}>
                <td>
                  <span className="admin-cell-title">#{b.id}</span>
                  <span className="admin-cell-sub">
                    {new Date(b.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </td>
                <td>
                  <span className="admin-cell-title">{b.customer.name}</span>
                  <span className="admin-cell-sub">{b.customer.email}</span>
                </td>
                <td>
                  <span className="admin-cell-title">{b.car.name}</span>
                </td>
                <td>
                  <span className="admin-cell-title">
                    {new Date(b.pickupDate).toLocaleDateString("vi-VN")} →{" "}
                    {new Date(b.returnDate).toLocaleDateString("vi-VN")}
                  </span>
                </td>
                <td>
                  <span className="admin-cell-title">
                    {money(b.paidAmount)}
                    <span style={{ fontWeight: 400, color: "var(--admin-text-sub)" }}>
                      {" "}
                      / {money(b.totalAmount)}
                    </span>
                  </span>
                  <div className="admin-payment-bar-wrap">
                    <div
                      className="admin-payment-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="admin-cell-sub">{pct}% đã nộp</span>
                </td>
                <td>
                  <select
                    disabled={
                      busy === b.id || ["COMPLETED", "CANCELLED"].includes(b.status)
                    }
                    className={`admin-status-select ${b.status.toLowerCase()}`}
                    value={b.status}
                    onChange={(e) => changeStatus(b.id, e.target.value)}
                  >
                    {Object.entries(statusName)
                      .filter(([k]) => !["SUCCESS", "FAILED", "REFUNDED"].includes(k))
                      .map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!rows.length && <Empty />}
    </div>
  );
}

function Empty() {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-icon">📁</div>
      <strong style={{ fontSize: "14px" }}>Không tìm thấy dữ liệu nào phù hợp</strong>
    </div>
  );
}
