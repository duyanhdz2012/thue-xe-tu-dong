import type {Metadata} from "next";import "./globals.css";import "./dashboard.css";import AppShell from "@/components/AppShell";
export const metadata:Metadata={title:"DriveNow - Thuê xe tự lái",description:"Đặt xe tự lái nhanh, minh bạch và an toàn"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body><AppShell>{children}</AppShell></body></html>}
