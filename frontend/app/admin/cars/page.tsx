"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { api, getSession, money } from "@/lib/api";
import { Car } from "@/components/CarCard";
type Taxon = {
    id: number;
    name: string;
    seats?: number;
};
const empty = { name: "", licensePlate: "", dailyPrice: "", description: "", imageUrl: "", location: "", modelYear: String(new Date().getFullYear()), status: "AVAILABLE", brandId: "", carTypeId: "" };
const statuses: Record<string, string> = { AVAILABLE: "Sẵn sàng", RENTED: "Đang thuê", MAINTENANCE: "Bảo dưỡng", INACTIVE: "Ngừng hoạt động" };
export default function CatalogAdmin() {
    const [allowed, setAllowed] = useState(false), [cars, setCars] = useState<Car[]>([]), [brands, setBrands] = useState<Taxon[]>([]), [types, setTypes] = useState<Taxon[]>([]);
    const [form, setForm] = useState(empty), [editing, setEditing] = useState<number | null>(null), [showForm, setShowForm] = useState(false);
    const [q, setQ] = useState(""), [page, setPage] = useState(0), [pages, setPages] = useState(0), [revision, setRevision] = useState(0);
    const [error, setError] = useState(""), [notice, setNotice] = useState(""), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true);
    const [taxKind, setTaxKind] = useState("brands"), [taxId, setTaxId] = useState<number | null>(null), [taxName, setTaxName] = useState(""), [seats, setSeats] = useState("5");
    useEffect(() => { if (getSession()?.role !== "ADMIN")
        window.location.replace("/login");
    else
        setAllowed(true); }, []);
    useEffect(() => {
        if (!allowed)
            return;
        let active = true;
        setLoading(true);
        Promise.all([api<{
                content: Car[];
                totalPages: number;
            }>(`/api/cars?q=${encodeURIComponent(q)}&page=${page}&size=10&sort=id,desc`), api<Taxon[]>("/api/brands"), api<Taxon[]>("/api/car-types")]).then(([c, b, t]) => { if (active) {
            setCars(c.content);
            setPages(c.totalPages);
            setBrands(b);
            setTypes(t);
            if (page > 0 && !c.content.length)
                setPage(page - 1);
        } }).catch(e => { if (active)
            setError(e.message); }).finally(() => { if (active)
            setLoading(false); });
        return () => { active = false; };
    }, [allowed, q, page, revision]);
    const field = (key: keyof typeof empty, value: string) => setForm(f => ({ ...f, [key]: value }));
    async function mutate(action: () => Promise<unknown>, message: string, done?: () => void) { setBusy(true); setError(""); setNotice(""); try {
        await action();
        done?.();
        setNotice(message);
        setRevision(x => x + 1);
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    function editCar(c: Car) { setEditing(c.id); setForm({ name: c.name, licensePlate: c.licensePlate, dailyPrice: String(c.dailyPrice), description: c.description || "", imageUrl: c.imageUrl || "", location: c.location || "", modelYear: String(c.modelYear), status: c.status, brandId: String(c.brand.id), carTypeId: String(c.carType.id) }); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
    function saveCar(e: FormEvent) { e.preventDefault(); void mutate(() => api(`/api/cars${editing ? `/${editing}` : ""}`, { method: editing ? "PUT" : "POST", body: JSON.stringify({ ...form, name: form.name.trim(), licensePlate: form.licensePlate.trim().toUpperCase(), dailyPrice: Number(form.dailyPrice), modelYear: Number(form.modelYear), brandId: Number(form.brandId), carTypeId: Number(form.carTypeId) }) }), "Đã lưu thông tin xe.", () => { setShowForm(false); setForm(empty); setEditing(null); }); }
    function saveTax(e: FormEvent) { e.preventDefault(); void mutate(() => api(`/api/${taxKind}${taxId ? `/${taxId}` : ""}`, { method: taxId ? "PUT" : "POST", body: JSON.stringify({ name: taxName.trim(), ...(taxKind === "car-types" ? { seats: Number(seats) } : {}) }) }), "Đã lưu danh mục.", () => { setTaxId(null); setTaxName(""); }); }
    function remove(path: string, name: string) { if (window.confirm(`Xóa “${name}”? Thao tác này không thể hoàn tác.`))
        void mutate(() => api(path, { method: "DELETE" }), "Đã xóa thành công."); }
    if (!allowed)
        return <p className="loading">Đang kiểm tra quyền quản trị…</p>;
    return <section className="admin"><Link href="/admin">← Tổng quan quản trị</Link><div className="admin-title"><div><div className="eyebrow">QUẢN LÝ DANH MỤC</div><h1>Đội xe của bạn</h1></div><button className="button" onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }}>+ Thêm xe</button></div>
 {error && <p className="error" role="alert">{error}</p>}{notice && <p className="notice" role="status">{notice}</p>}
 {showForm && <form className="catalog-panel" onSubmit={saveCar}><h2>{editing ? "Chỉnh sửa xe" : "Thêm xe mới"}</h2><fieldset disabled={busy} className="catalog-fields">
 <label>Tên xe<input required maxLength={255} value={form.name} onChange={e => field("name", e.target.value)}/></label>
 <label>Biển số<input required maxLength={20} value={form.licensePlate} onChange={e => field("licensePlate", e.target.value)}/></label>
 <label>Hãng xe<select required value={form.brandId} onChange={e => field("brandId", e.target.value)}><option value="">Chọn hãng</option>{brands.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
 <label>Loại xe<select required value={form.carTypeId} onChange={e => field("carTypeId", e.target.value)}><option value="">Chọn loại</option>{types.map(x => <option key={x.id} value={x.id}>{x.name} · {x.seats} chỗ</option>)}</select></label>
 <label>Giá thuê / ngày (VNĐ)<input type="number" required min="1" max="9999999999" step="0.01" value={form.dailyPrice} onChange={e => field("dailyPrice", e.target.value)}/></label>
 <label>Năm sản xuất<input type="number" required min="1900" max="2100" value={form.modelYear} onChange={e => field("modelYear", e.target.value)}/></label>
 <label>Địa điểm nhận xe<input required maxLength={255} value={form.location} onChange={e => field("location", e.target.value)}/></label>
 <label>Trạng thái<select value={form.status} onChange={e => field("status", e.target.value)}>{Object.entries(statuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
 <label className="wide">Đường dẫn hình ảnh (HTTP/HTTPS)<input type="url" pattern="https?://.*" maxLength={255} value={form.imageUrl} onChange={e => field("imageUrl", e.target.value)} placeholder="https://…"/></label>
 {form.imageUrl && <img className="car-preview" src={form.imageUrl} alt="Xem trước ảnh xe"/>}
 <label className="wide">Mô tả<textarea rows={4} maxLength={1000} value={form.description} onChange={e => field("description", e.target.value)}/></label>
 <div className="actions wide"><button className="button" type="submit">{busy ? "Đang lưu…" : "Lưu xe"}</button><button className="ghost" type="button" onClick={() => setShowForm(false)}>Hủy</button></div></fieldset></form>}
 <label className="catalog-search">Tìm xe<input value={q} onChange={e => { setQ(e.target.value); setPage(0); }} placeholder="Nhập tên xe…"/></label>
 {loading ? <p role="status">Đang tải danh sách…</p> : <><div className="table-wrap"><table><thead><tr><th>Xe</th><th>Hãng / loại</th><th>Giá / ngày</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{cars.map(c => <tr key={c.id}><td><Link href={`/cars/${c.id}`}><strong>{c.name}</strong></Link><br />{c.licensePlate}</td><td>{c.brand.name} / {c.carType.name}</td><td>{money(c.dailyPrice)}</td><td>{statuses[c.status]}</td><td><div className="actions"><button disabled={busy} className="ghost" onClick={() => editCar(c)}>Sửa</button><button disabled={busy} className="ghost danger" onClick={() => remove(`/api/cars/${c.id}`, c.name)}>Xóa</button></div></td></tr>)}{!cars.length && <tr><td colSpan={5}>Không tìm thấy xe.</td></tr>}</tbody></table></div><div className="pagination"><button className="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>← Trước</button><span>Trang {pages ? page + 1 : 0} / {pages}</span><button className="ghost" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Sau →</button></div></>}
 <div className="catalog-panel"><h2>Hãng xe và loại xe</h2><p className="muted">Danh mục đang được xe sử dụng không thể xóa.</p><form onSubmit={saveTax}><fieldset disabled={busy} className="catalog-fields"><label>Danh mục<select value={taxKind} onChange={e => { setTaxKind(e.target.value); setTaxId(null); setTaxName(""); }}><option value="brands">Hãng xe</option><option value="car-types">Loại xe</option></select></label><label>Tên<input required maxLength={255} value={taxName} onChange={e => setTaxName(e.target.value)}/></label>{taxKind === "car-types" && <label>Số chỗ<input type="number" required min="2" max="50" value={seats} onChange={e => setSeats(e.target.value)}/></label>}<div className="actions"><button className="button">{taxId ? "Lưu thay đổi" : "Thêm danh mục"}</button>{taxId && <button className="ghost" type="button" onClick={() => { setTaxId(null); setTaxName(""); }}>Hủy sửa</button>}</div></fieldset></form><div className="taxonomy-list">{(taxKind === "brands" ? brands : types).map(t => <div key={t.id}><span>{t.name}{t.seats ? ` · ${t.seats} chỗ` : ""}</span><div className="actions"><button className="ghost" disabled={busy} onClick={() => { setTaxId(t.id); setTaxName(t.name); setSeats(String(t.seats || 5)); }}>Sửa</button><button className="ghost danger" disabled={busy} onClick={() => remove(`/api/${taxKind}/${t.id}`, t.name)}>Xóa</button></div></div>)}</div></div>
 </section>;
}
