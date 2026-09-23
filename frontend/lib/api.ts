export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export type Session = {token:string;id:number;name:string;email:string;role:"ADMIN"|"CUSTOMER"};
export function getSession():Session|null{if(typeof window==="undefined")return null;try{return JSON.parse(localStorage.getItem("carRentalSession")||"null")}catch{return null}}
export function setSession(value:Session|null){if(value)localStorage.setItem("carRentalSession",JSON.stringify(value));else localStorage.removeItem("carRentalSession")}
export async function api<T>(path:string,options:RequestInit={}):Promise<T>{const session=getSession();const headers=new Headers(options.headers);if(options.body&&!headers.has("Content-Type"))headers.set("Content-Type","application/json");if(session)headers.set("Authorization",`Bearer ${session.token}`);const res=await fetch(`${API_URL}${path}`,{...options,headers});if(!res.ok){let message=`Yêu cầu thất bại (${res.status})`;try{const data=await res.json();message=data.message||message}catch{}throw new Error(message)}if(res.status===204)return undefined as T;return res.json()}
export const money=(n:number)=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n);

