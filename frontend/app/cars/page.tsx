"use client";
import { useEffect, useState } from "react";
import CarCard, { Car } from "@/components/CarCard";
import { api } from "@/lib/api";
type Option = {
    id: number;
    name: string;
};
export default function Cars() {
    const [cars, setCars] = useState<Car[]>([]), [brands, setBrands] = useState<Option[]>([]), [types, setTypes] = useState<Option[]>([]);
    const [q, setQ] = useState(""), [brand, setBrand] = useState(""), [type, setType] = useState(""), [sort, setSort] = useState("dailyPrice,asc");
    const [page, setPage] = useState(0), [pages, setPages] = useState(0), [total, setTotal] = useState(0), [loading, setLoading] = useState(true), [error, setError] = useState("");
    useEffect(() => { Promise.all([api<Option[]>("/api/brands"), api<Option[]>("/api/car-types")]).then(([b, t]) => { setBrands(b); setTypes(t); }).catch(e => setError(e.message)); }, []);
    useEffect(() => {
        let active = true;
        setLoading(true);
        const timer = setTimeout(() => {
            const params = new URLSearchParams({ q, status: "AVAILABLE", sort, page: String(page), size: "9" });
            if (brand)
                params.set("brandId", brand);
            if (type)
                params.set("typeId", type);
            api<{
                content: Car[];
                totalPages: number;
                totalElements: number;
            }>(`/api/cars?${params}`).then(x => { if (active) {
                setCars(x.content);
                setPages(x.totalPages);
                setTotal(x.totalElements);
                setError("");
            } }).catch(e => { if (active)
                setError(e.message); }).finally(() => { if (active)
                setLoading(false); });
        }, 250);
        return () => { active = false; clearTimeout(timer); };
    }, [q, brand, type, sort, page]);
    return <section className="section cars-page"><div className="eyebrow">BỘ SƯU TẬP XE</div><h1>Chọn xe cho hành trình của bạn</h1><p className="muted">Giá thuê theo ngày, dễ dàng tìm xe phù hợp.</p>
 <div className="catalog-filters"><label>Tìm kiếm<input value={q} onChange={e => { setQ(e.target.value); setPage(0); }} placeholder="Nhập tên xe…"/></label><label>Hãng xe<select value={brand} onChange={e => { setBrand(e.target.value); setPage(0); }}><option value="">Tất cả hãng</option>{brands.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label><label>Loại xe<select value={type} onChange={e => { setType(e.target.value); setPage(0); }}><option value="">Tất cả loại</option>{types.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label><label>Sắp xếp<select value={sort} onChange={e => { setSort(e.target.value); setPage(0); }}><option value="dailyPrice,asc">Giá thấp đến cao</option><option value="dailyPrice,desc">Giá cao đến thấp</option><option value="name,asc">Tên A–Z</option></select></label><button className="ghost" onClick={() => { setQ(""); setBrand(""); setType(""); setPage(0); }}>Xóa bộ lọc</button></div>
 {error ? <p role="alert" className="error">{error}</p> : loading ? <p role="status">Đang tìm xe…</p> : <><p className="muted">{total} xe phù hợp</p>{cars.length ? <div className="car-grid">{cars.map(c => <CarCard key={c.id} car={c}/>)}</div> : <p className="notice">Không có xe phù hợp. Hãy thử thay đổi bộ lọc.</p>}<div className="pagination"><button className="ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>← Trước</button><span>Trang {pages ? page + 1 : 0} / {pages}</span><button className="ghost" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Sau →</button></div></>}
 </section>;
}
