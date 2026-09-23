"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, setSession, Session } from "@/lib/api";

export default function Header() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
  }, []);

  const handleLogout = () => {
    setSession(null);
    window.location.href = "/";
  };

  return (
    <>
      <header className="header">
        <Link href="/" className="brand">
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

        {/* Desktop Navigation */}
        <nav>
          <Link href="/">Trang chủ</Link>
          <Link href="/cars">Bộ sưu tập xe</Link>
          <Link href="/#process">Quy trình</Link>
          <Link href="/#why-us">Ưu điểm</Link>
          <Link href="/#faq">Hỏi đáp</Link>
          {session?.role === "CUSTOMER" && (
            <>
              <Link href="/bookings">Đơn của tôi</Link>
              <Link href="/account">Tài khoản</Link>
            </>
          )}
          {session?.role === "ADMIN" && (
            <Link href="/admin" style={{ color: "var(--primary)", fontWeight: 700 }}>
              ★ Quản trị
            </Link>
          )}
        </nav>

        {/* Desktop User Actions */}
        <div className="header-user">
          {session ? (
            <>
              <span>
                Xin chào, <b>{session.name}</b>
              </span>
              <button className="ghost" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link className="ghost" href="/login">
                Đăng nhập
              </Link>
              <Link className="button small" href="/cars">
                Thuê xe ngay
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="hamburger-btn"
          aria-label="Mở menu"
          onClick={() => setMobileOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <Link href="/" className="brand" onClick={() => setMobileOpen(false)}>
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span>DRIVE</span>NOW
          </Link>
          <button
            className="ghost"
            style={{ padding: "6px 10px" }}
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            Trang chủ
          </Link>
          <Link href="/cars" onClick={() => setMobileOpen(false)}>
            Bộ sưu tập xe
          </Link>
          <Link href="/#process" onClick={() => setMobileOpen(false)}>
            Quy trình thuê xe
          </Link>
          <Link href="/#why-us" onClick={() => setMobileOpen(false)}>
            Ưu điểm vượt trội
          </Link>
          <Link href="/#faq" onClick={() => setMobileOpen(false)}>
            Hỏi đáp & Hỗ trợ
          </Link>
          {session?.role === "CUSTOMER" && (
            <>
              <Link href="/bookings" onClick={() => setMobileOpen(false)}>
                Đơn thuê của tôi
              </Link>
              <Link href="/account" onClick={() => setMobileOpen(false)}>
                Thông tin tài khoản
              </Link>
            </>
          )}
          {session?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              style={{ color: "var(--primary)", fontWeight: 700 }}
            >
              ★ Trang Quản trị
            </Link>
          )}
        </nav>

        <div className="mobile-drawer-footer">
          {session ? (
            <>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>
                Đang đăng nhập: <b style={{ color: "var(--ink)" }}>{session.name}</b>
              </div>
              <button
                className="button outline"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                className="button outline"
                href="/login"
                onClick={() => setMobileOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                className="button"
                href="/cars"
                onClick={() => setMobileOpen(false)}
              >
                Xem xe ngay
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

