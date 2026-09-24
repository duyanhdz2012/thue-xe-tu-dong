"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { api, money, getSession } from "@/lib/api";
import { BANK_TRANSFER, transferContent, vietQrUrl } from "@/lib/payment";
import { Car } from "@/components/CarCard";

const FALLBACK_DETAIL_IMAGES = [
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
];

type BookingResult={id:number;totalAmount:number;paidAmount:number;car:{name:string}};
type Profile={name:string;email:string;phone:string;address:string};
type PaymentResult={transactionCode:string;status:"PENDING"|"SUCCESS";amount:number};
type BusyRange={pickupDate:string;returnDate:string};

const localToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().split("T")[0];
};

const displayDate = (value:string) => new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
}).format(new Date(`${value}T00:00:00`));

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pickup, setPickup] = useState("");
  const [returned, setReturned] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [createdBooking,setCreatedBooking]=useState<BookingResult|null>(null);
  const [paymentBusy,setPaymentBusy]=useState(false);
  const [paymentSuccess,setPaymentSuccess]=useState("");
  const [pendingPayment,setPendingPayment]=useState<PaymentResult|null>(null);
  const [busyRanges,setBusyRanges]=useState<BusyRange[]>([]);
  const [availabilityLoading,setAvailabilityLoading]=useState(true);
  const [availabilityError,setAvailabilityError]=useState("");
  const [paymentForm,setPaymentForm]=useState({amount:"",payerName:"",payerEmail:"",payerPhone:""});

  async function refreshBusyDates() {
    try {
      setAvailabilityLoading(true);
      setAvailabilityError("");
      setBusyRanges(await api<BusyRange[]>(`/api/bookings/cars/${id}/busy-dates`));
    } catch {
      setAvailabilityError("Chưa tải được lịch đã đặt. Hệ thống vẫn sẽ kiểm tra lại khi xác nhận.");
    } finally {
      setAvailabilityLoading(false);
    }
  }

  useEffect(() => {
    refreshBusyDates();
    api<Car>(`/api/cars/${id}`)
      .then((data) => {
        setCar(data);
        const fallbackImg = FALLBACK_DETAIL_IMAGES[Math.abs(Number(id)) % FALLBACK_DETAIL_IMAGES.length];
        setImgSrc(data.imageUrl && data.imageUrl.startsWith("http") ? data.imageUrl : fallbackImg);
      })
      .catch(() => {
        // Fallback demo car nếu API chưa chạy
        const fallbackImg = FALLBACK_DETAIL_IMAGES[Math.abs(Number(id)) % FALLBACK_DETAIL_IMAGES.length];
        setCar({
          id: Number(id),
          name: "Mazda 3 Premium 2023",
          licensePlate: "30G-888.99",
          dailyPrice: 900000,
          description: "Sedan thể thao sang trọng bậc nhất, nội thất bọc da cao cấp, trang bị hệ thống an toàn i-Activesense, cửa sổ trời, dàn âm thanh Bose 12 loa.",
          imageUrl: fallbackImg,
          location: "Hà Nội",
          modelYear: 2023,
          status: "AVAILABLE",
          brand: { name: "Mazda" },
          carType: { name: "Sedan C", seats: 5 }
        });
        setImgSrc(fallbackImg);
      });
  }, [id]);

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!pickup || !returned) return 1;
    const start = new Date(pickup).getTime();
    const end = new Date(returned).getTime();
    if (isNaN(start) || isNaN(end) || end < start) return 1;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const days = calculateDays();
  const totalPrice = car ? car.dailyPrice * days : 0;
  const selectedConflict = Boolean(pickup && returned && busyRanges.some(
    (range) => pickup <= range.returnDate && returned >= range.pickupDate
  ));

  async function book() {
    setErrorMsg("");
    setMsg("");

    if (!getSession()) {
      window.location.href = "/login";
      return;
    }

    if (!pickup || !returned) {
      setErrorMsg("Vui lòng chọn ngày nhận xe và ngày trả xe.");
      return;
    }

    if (new Date(returned).getTime() < new Date(pickup).getTime()) {
      setErrorMsg("Ngày trả xe không thể trước ngày nhận xe.");
      return;
    }

    if (selectedConflict) {
      setErrorMsg("Khoảng ngày này có ngày xe đã được đặt. Vui lòng chọn thời gian khác.");
      return;
    }

    setSubmitting(true);
    try {
      const booking=await api<BookingResult>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          carId: Number(id),
          pickupDate: pickup,
          returnDate: returned,
          pickupLocation: car?.location,
          returnLocation: car?.location
        })
      });
      setPendingPayment(null);
      setPaymentSuccess("");
      setCreatedBooking(booking);
      setPaymentForm(f=>({...f,amount:String(booking.totalAmount-booking.paidAmount)}));
      try {
        const profile=await api<Profile>("/api/users/me");
        setPaymentForm(f=>({...f,payerName:profile.name,payerEmail:profile.email,payerPhone:profile.phone||""}));
      } catch {
        // Đơn vẫn đã được tạo: giữ biểu mẫu thanh toán mở để khách tự bổ sung thông tin.
      }
      setMsg("Đặt xe thành công. Vui lòng hoàn tất thanh toán để xác nhận hành trình.");
      await refreshBusyDates();
    } catch (e) {
      setErrorMsg((e as Error).message || "Không thể hoàn tất đặt xe. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  async function pay(e:React.FormEvent){
    e.preventDefault();if(!createdBooking)return;
    try{setPaymentBusy(true);setErrorMsg("");const result=await api<PaymentResult>("/api/payments",{method:"POST",body:JSON.stringify({...paymentForm,bookingId:createdBooking.id,amount:Number(paymentForm.amount),method:"BANK_TRANSFER",provider:BANK_TRANSFER.bank})});setPendingPayment(result);if(result.status==="PENDING"){setPaymentSuccess(`Đang chờ chuyển khoản. Nội dung bắt buộc: ${transferContent(result.transactionCode)}`);setMsg("Đơn đã được tạo và đang chờ SePay xác nhận chuyển khoản.")}else{setPaymentSuccess(`Thanh toán thành công. Mã giao dịch: ${result.transactionCode}`);setMsg("🎉 Đặt xe và thanh toán thành công! Bạn có thể theo dõi hành trình trong Đơn của tôi.")}}
    catch(e){setErrorMsg((e as Error).message||"Không thể hoàn tất thanh toán.")}
    finally{setPaymentBusy(false)}
  }

  useEffect(() => {
    if (!createdBooking || !pendingPayment || pendingPayment.status !== "PENDING") return;
    let cancelled = false;
    const checkPayment = async () => {
      try {
        const payments = await api<PaymentResult[]>(`/api/payments/${createdBooking.id}`);
        const confirmed = payments.find((payment) =>
          payment.transactionCode === pendingPayment.transactionCode && payment.status === "SUCCESS"
        );
        if (!cancelled && confirmed) {
          setPendingPayment(confirmed);
          setPaymentSuccess(`Thanh toán thành công. Mã giao dịch: ${confirmed.transactionCode}`);
          setMsg("🎉 Đặt xe và thanh toán thành công! Đang chuyển tới Đơn của tôi...");
        }
      } catch {
        // Tiếp tục kiểm tra ở lượt sau nếu mạng tạm thời gián đoạn.
      }
    };
    void checkPayment();
    const timer = window.setInterval(checkPayment, 2000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [createdBooking, pendingPayment]);

  useEffect(() => {
    if (pendingPayment?.status !== "SUCCESS") return;
    const timer = window.setTimeout(() => {
      window.location.href = "/bookings";
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [pendingPayment?.status]);

  if (!car) return <div className="loading">Đang tải thông tin xe...</div>;

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "calc(100vh - 80px)", padding: "20px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "10px 5vw" }}>
        <Link href="/cars" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--muted)", fontWeight: 600, marginBottom: "20px" }}>
          ← Quay lại danh sách xe
        </Link>
      </div>

      <section className="detail-layout">
        {/* CỘT TRÁI: HÌNH ẢNH & THÔNG TIN KỸ THUẬT */}
        <div className="detail-main">
          <div className="detail-image-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={car.name}
              onError={() => setImgSrc(FALLBACK_DETAIL_IMAGES[0])}
            />
          </div>

          <div className="detail-header">
            <div className="eyebrow">
              {car.brand?.name} · {car.carType?.name}
            </div>
            <h1>{car.name}</h1>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className="pill">Biển số: {car.licensePlate || "30G-XXXX"}</span>
              <span className="pill" style={{ background: "#f1f5f9", color: "var(--ink-secondary)" }}>
                Khu vực: {car.location || "Toàn quốc"}
              </span>
            </div>
          </div>

          <div className="detail-description">
            <p>{car.description || "Xe đời mới, trang bị đầy đủ tính năng an toàn, vận hành êm ái, tiết kiệm nhiên liệu."}</p>
          </div>

          {/* LƯỚI THÔNG SỐ XE */}
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 16px" }}>Thông số kỹ thuật</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span>Số chỗ ngồi</span>
                <b>{car.carType?.seats || 5} Ghế</b>
              </div>
              <div className="spec-item">
                <span>Năm sản xuất</span>
                <b>{car.modelYear || 2023}</b>
              </div>
              <div className="spec-item">
                <span>Hộp số</span>
                <b>Tự động (AT)</b>
              </div>
              <div className="spec-item">
                <span>Nhiên liệu</span>
                <b>Xăng / Điện</b>
              </div>
            </div>
          </div>

          {/* CHÍNH SÁCH VÀ ĐIỀU KHOẢN NHẬN XE */}
          <div className="rental-policy-box">
            <h3>Giấy tờ & Điều kiện nhận xe</h3>
            <ul>
              <li><b>Giấy tờ:</b> CCCD gắn chip (hoặc định danh VNeID mức 2) & Giấy phép lái xe ô tô hạng B1/B2 trở lên còn hiệu lực.</li>
              <li><b>Tài sản bảo đảm:</b> Xe máy chính chủ kèm cà vẹt (hoặc thế chấp cọc tiền mặt 15.000.000đ khi nhận xe).</li>
              <li><b>Bảo hiểm:</b> 100% xe được bảo hiểm thân vỏ 2 chiều chính hãng của Bảo Việt/PVI.</li>
              <li><b>Định mức km:</b> 350km/ngày (Phụ trội: 3.500đ/km).</li>
            </ul>
          </div>
        </div>

        {/* CỘT PHẢI: STICKY BOOKING CARD */}
        <div className="booking-card-wrapper">
          <div className="booking-card">
            <div className="booking-price-header">
              <div>
                <strong>{money(car.dailyPrice)}</strong>
                <span style={{ color: "var(--muted)", fontSize: "14px", marginLeft: "4px" }}>/ ngày</span>
              </div>
              <span className="pill">{selectedConflict ? "Đã có lịch" : "Sẵn sàng"}</span>
            </div>

            <div className="booking-form">
              <div className="date-pickers-row">
                <label>
                  Ngày nhận xe
                  <input
                    type="date"
                    value={pickup}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPickup(value);
                      if (returned && returned < value) setReturned("");
                      setErrorMsg("");
                    }}
                    min={localToday()}
                  />
                </label>
                <label>
                  Ngày trả xe
                  <input
                    type="date"
                    value={returned}
                    onChange={(e) => { setReturned(e.target.value); setErrorMsg(""); }}
                    min={pickup || localToday()}
                  />
                </label>
              </div>

              <div className="busy-calendar" aria-live="polite">
                <div className="busy-calendar-title">
                  <span>Lịch xe đã được đặt</span>
                  <span className="busy-dot">Ngày không thể chọn</span>
                </div>
                {availabilityLoading ? (
                  <p>Đang tải lịch xe...</p>
                ) : busyRanges.length > 0 ? (
                  <div className="busy-range-list">
                    {busyRanges.map((range) => (
                      <span className="busy-range" key={`${range.pickupDate}-${range.returnDate}`}>
                        {displayDate(range.pickupDate)} – {displayDate(range.returnDate)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>Xe chưa có lịch đặt sắp tới.</p>
                )}
                {availabilityError && <p className="availability-warning">{availabilityError}</p>}
              </div>

              {selectedConflict && (
                <div className="date-conflict" role="alert">
                  Khoảng thời gian đã chọn trùng với lịch đặt phía trên. Hãy chọn ngày khác.
                </div>
              )}

              {/* TẠM TÍNH GIÁ TIỀN TỰ ĐỘNG */}
              <div className="price-summary">
                <div className="price-row">
                  <span>Thời gian thuê:</span>
                  <b>{days} ngày</b>
                </div>
                <div className="price-row">
                  <span>Đơn giá theo ngày:</span>
                  <span>{money(car.dailyPrice)}</span>
                </div>
                <div className="price-row">
                  <span>Bảo hiểm vật chất 2 chiều:</span>
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>Miễn phí</span>
                </div>
                <div className="price-row total">
                  <span>TỔNG CHI PHÍ TẠM TÍNH:</span>
                  <span style={{ color: "var(--primary)" }}>{money(totalPrice)}</span>
                </div>
              </div>

              <button
                type="button"
                className="button"
                onClick={book}
                disabled={submitting || availabilityLoading || selectedConflict}
              >
                {submitting ? "Đang xử lý..." : selectedConflict ? "Khoảng ngày đã được đặt" : "Xác nhận đặt xe ngay"}
              </button>

              {msg && <div className="notice">{msg}</div>}
              {errorMsg && <div className="error-notice">{errorMsg}</div>}

              <div style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                🔒 Không mất phí hủy trước 24 giờ · Thanh toán an toàn
              </div>
            </div>
          </div>
        </div>
      </section>
      {createdBooking && <div className="modal-backdrop"><div className="payment-modal auto-payment-modal">
        <button className="modal-close" onClick={()=>setCreatedBooking(null)}>×</button>
        <div className="eyebrow">ĐƠN THUÊ #{createdBooking.id}</div>
        <h2>Thanh toán chuyển khoản</h2>
        <p className="muted">Thông tin ngân hàng và số tiền được điền tự động theo đơn thuê.</p>
        <div className="payment-order"><span>{createdBooking.car?.name||car.name}<small>Tổng tiền đơn thuê</small></span><b>{money(createdBooking.totalAmount)}</b></div>
        <form onSubmit={pay}>
          <div className="form-grid">
            <label>Họ tên người thanh toán<input required value={paymentForm.payerName} onChange={e=>setPaymentForm({...paymentForm,payerName:e.target.value})}/></label>
            <label>Số điện thoại<input required pattern="[0-9+ ]{9,15}" value={paymentForm.payerPhone} onChange={e=>setPaymentForm({...paymentForm,payerPhone:e.target.value})} placeholder="0988 123 456"/></label>
            <label>Email nhận biên lai<input required type="email" value={paymentForm.payerEmail} onChange={e=>setPaymentForm({...paymentForm,payerEmail:e.target.value})}/></label>
            <label>Số tiền<input className="locked-payment-input" readOnly value={paymentForm.amount}/></label>
          </div>
          <div className="bank-auto-info">
            <div><span>Ngân hàng</span><b>{BANK_TRANSFER.bank}</b></div>
            <div><span>Số tài khoản</span><b>{BANK_TRANSFER.accountNumber}</b></div>
            <div><span>Chủ tài khoản</span><b>{BANK_TRANSFER.accountHolder}</b></div>
          </div>
          {pendingPayment?.status === "PENDING" && <div className="vietqr-payment">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vietQrUrl(pendingPayment.amount,pendingPayment.transactionCode)} alt="Mã QR chuyển khoản VietinBank"/>
            <div className="transfer-details">
              <h3>Quét QR để chuyển khoản</h3>
              <p><span>Số tiền</span><b>{money(pendingPayment.amount)}</b></p>
              <p><span>Nội dung</span><strong>{transferContent(pendingPayment.transactionCode)}</strong></p>
              <small>Vui lòng giữ nguyên số tiền và nội dung để SePay xác nhận tự động.</small>
            </div>
          </div>}
          {errorMsg&&<div className="error-notice">{errorMsg}</div>}
          {paymentSuccess&&<div className="notice">{paymentSuccess}</div>}
          <div className="auto-payment-actions"><button type="button" className="ghost" onClick={()=>location.href="/bookings"}>Thanh toán sau</button><button disabled={paymentBusy||!!paymentSuccess} className="button">{paymentBusy?"Đang tạo mã QR...":pendingPayment?.status==="SUCCESS"?"Đã thanh toán":paymentSuccess?"Đang chờ SePay":"Tạo mã QR thanh toán"}</button></div>
        </form>
      </div></div>}
    </div>
  );
}
