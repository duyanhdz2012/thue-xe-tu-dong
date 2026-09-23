import type {Metadata} from "next";import "./globals.css";import Header from "@/components/Header";
export const metadata:Metadata={title:"DriveNow - Thuê xe tự lái",description:"Đặt xe tự lái nhanh, minh bạch và an toàn"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body><Header/><main>{children}</main><footer><div><b>DRIVENOW</b><p>Hệ thống thuê xe tự lái được xây dựng theo kiến trúc Modular Monolith.</p></div><div><b>Liên hệ</b><p>1900 2026 · support@drivenow.vn</p></div></footer></body></html>}

