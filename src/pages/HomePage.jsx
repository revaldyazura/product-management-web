import PageHeader from '../components/common/PageHeader';
// import { useAuth } from '../context/AuthContext';
import '../styles/pages/HomePage.css';
import SearchIcon from '@mui/icons-material/Search';
import SearchAutocomplete from '../components/form/SearchAutocomplete';
import ProductCard from '../components/product/ProductCard';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from '../services/productService';
import { useToast } from '../context/ToastContext';
import defaultImage from "../assets/No_Image_Available.jpg";
import { withBaseUrl } from '../utils/helper';

export default function HomePage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("active");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [result, setResult] = useState({ open: false, type: 'success', title: '', message: '' });
    const { success: toastSuccess, error: toastError } = useToast();
    const [items, setItems] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ totalElements: 0, totalPages: 1, currentPage: 1, size: pageSize });

    const fetchProducts = useCallback(async ({ pageArg = page, sizeArg = pageSize, searchArg = search, statusArg = status } = {}) => {
        try {
            const res = await getProducts({ page: pageArg, size: sizeArg, search: searchArg, status: statusArg });
            const apiItems = Array.isArray(res?.data) ? res.data : [];
            const mapped = apiItems.map((p) => ({
                id: p.product_id,
                title: p.name,
                price: Number(p.unit_price || 0),
                created_at: (p.created_at || '').split('T')[0] || '',
                status: p.status,
                image: p.image_url ? withBaseUrl(p.image_url) : defaultImage,
                category: p.category || 'Lainnya',
                stock: Number(p.stock || 0),
                low_stock: Number(p.low_stock || 0),
                unit: 'Unit',
                description: p.description || '',
            }));
            setItems(mapped);
            const pg = res?.pagination_info || {};
            setPaginationInfo({
                totalElements: Number(pg.totalElements || mapped.length || 0),
                totalPages: Number(pg.totalPages || 1),
                currentPage: Number(pg.currentPage || pageArg || 1),
                size: Number(pg.size || sizeArg || 10),
            });
        } catch (e) {
            toastError(e?.message || 'Gagal memuat produk');
        }
    }, [page, pageSize, search, status, toastError]);
    useEffect(() => {
        setStatus("active");
        // Fetch recommendations once (not affected by search input)
        fetchProducts({ pageArg: page, sizeArg: pageSize, searchArg: '', statusArg: status });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, status]);

    return (
        <div className="home">
            <PageHeader transparent />

            <section className="home__hero">
                <div className="home__hero-content">
                    <h1>Cari Furnitur Impian</h1>
                    <p>Cari furniture mulai dari meja, lemari, hingga rak di sini</p>

                    <div className="home__search">
                        <SearchIcon className="home__search-icon" />
                        <SearchAutocomplete
                            id="search"
                            label="Cari produk"
                            value={search}
                            onSearch={(val) => setSearch(val)}
                            freeSolo
                            options={items.map((option) => ({ id: option.id, label: option.title }))}
                            onSelectOption={(opt) => {
                                // opt is the selected object provided by the Autocomplete options
                                // update search text and navigate to product detail if id exists
                                if (opt && opt.label) setSearch(opt.label);
                                if (opt && opt.id) {
                                    navigate(`/product/${opt.id}`);
                                }
                            }}
                        />
                    </div>
                </div>
            </section>

            <main className="home__main">
                <div className="home__section-title">
                    <div className="home__title">
                        <h2 style={{ margin: 0}}>Rekomendasi</h2>
                        <p>Produk - produk pilihan terbaik dari kami</p>
                    </div>
                    <button className="home__link" onClick={() => navigate('/products')}>Lihat Semua Produk</button>
                </div>

                <div className="home__grid">
                    {items.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </main>
        </div>
    );
}

// Bisa diganti dengan data dari API nanti
const dummyProducts = [
    { id: 1, title: 'Meja Makan Kayu Jati - Ukuran besar 100m²', price: 3400000, rating: 4.9, sold: 121, discount: 12, image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200' },
    { id: 2, title: 'Sofa Minimalis - 3 Dudukan', price: 5000000, rating: 4.7, sold: 75, discount: 5, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200' },
    { id: 3, title: 'Meja Kopi Kayu Palet - Vintage', price: 900000, rating: 4.6, sold: 50, discount: 10, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200' },
    { id: 4, title: 'Kursi Santai Rotan - Desain ergonomis', price: 1200000, rating: 4.8, sold: 89, image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1200' },
    { id: 5, title: 'Rak Dinding Modern - Minimalis', price: 750000, rating: 4.5, sold: 30, discount: 0, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200' },
    { id: 6, title: 'Lemari Pakaian Kayu - 2 Pintu', price: 4200000, rating: 4.9, sold: 64, discount: 15, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200' },
    { id: 7, title: 'Lampu Hias Gantung - Retro', price: 1500000, rating: 4.6, sold: 25, discount: 20, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200' },
    { id: 8, title: 'Kursi Makan Kayu - Set 4', price: 2600000, rating: 4.8, sold: 45, discount: 8, image: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200' },
];