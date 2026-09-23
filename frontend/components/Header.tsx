"use client";
import Link from "next/link";import {useEffect,useState} from "react";import {getSession,setSession,Session} from "@/lib/api";
export default function Header(){const[s,setS]=useState<Session|null>(null);useEffect(()=>setS(getSession()),[]);return <header className="header"><Link href="/" className="brand"><span>DRIVE</span>NOW</Link><nav><Link href="/cars">Thuê xe</Link><Link href="/#process">Quy trình</Link>{s&&<Link href="/bookings">Đơn của tôi</Link>}{s?.role==="ADMIN"&&<Link href="/admin">Quản trị</Link>}</nav><div>{s?<button className="ghost" onClick={()=>{setSession(null);location.href="/"}}>Đăng xuất</button>:<Link className="button small" href="/login">Đăng nhập</Link>}</div></header>}

