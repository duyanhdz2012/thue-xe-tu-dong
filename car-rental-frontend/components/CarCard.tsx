"use client";

import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/api";

export type Car = {
  id: number;
  name: string;
  licensePlate: string;
  dailyPrice: number;
  description: string;
  imageUrl?: string;
  location: string;
  modelYear: number;
  status: string;
  brand: { name: string };
  carType: { name: string; seats: number };
};

// Danh sách ảnh xe chất lượng cao làm fallback đẹp mắt khi backend chưa có ảnh hoặc ảnh lỗi
const FALLBACK_CAR_IMAGES = [
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80"
];

export default function CarCard({ car }: { car: Car }) {
  const fallbackIndex = Math.abs(car.id) % FALLBACK_CAR_IMAGES.length;
  const initialImg = car.imageUrl && car.imageUrl.startsWith("http")
    ? car.imageUrl
    : FALLBACK_CAR_IMAGES[fallbackIndex];

  const [imgSrc, setImgSrc] = useState(initialImg);

  const isAvailable = car.status === "AVAILABLE";

  return (
    <article className="car-card">
      <div className="car-image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={car.name}
          className="car-img"
          onError={() => setImgSrc(FALLBACK_CAR_IMAGES[fallbackIndex])}
          loading="lazy"
        />
        <div className="car-image-overlay">
          <div className="car-image-top">
            <span className={`pill ${isAvailable ? "" : "unavailable"}`}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: isAvailable ? "var(--primary)" : "#ef4444",
                  display: "inline-block"
                }}
              />
              {isAvailable ? "Sẵn sàng" : "Đã được đặt"}
            </span>
          </div>

          <div className="car-location-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {car.location || "Toàn quốc"}
          </div>
        </div>
      </div>

      <div className="car-body">
        <div className="car-meta-tag">
          {car.brand?.name || "Hãng xe"} · {car.carType?.name || "Sedan"}
        </div>

        <h3>{car.name}</h3>

        <p>{car.description || "Xe đời mới, trang bị đầy đủ tính năng an toàn, vận hành êm ái, tiết kiệm nhiên liệu."}</p>

        <div className="car-features-row">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7z" />
            </svg>
            {car.carType?.seats || 5} chỗ
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Đời {car.modelYear || 2023}
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Tự động
          </span>
        </div>

        <div className="car-footer">
          <div className="car-price">
            <strong>{money(car.dailyPrice)}</strong>
            <small>/ ngày</small>
          </div>
          <Link href={`/cars/${car.id}`} className="button small">
            Xem chi tiết →
          </Link>
        </div>
      </div>
    </article>
  );
}


