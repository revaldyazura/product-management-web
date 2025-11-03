import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import ProductCard from '../components/product/ProductCard';
import '../styles/pages/AllProductsPage.css';
import { getProducts } from '../services/productService';
import { useToast } from '../context/ToastContext';
import defaultImage from "../assets/No_Image_Available.jpg";
import { withBaseUrl } from '../utils/helper';
import SearchIcon from '@mui/icons-material/Search';
import InputField from '../components/form/InputField';
import Pagination from "../components/pagination/Pagination";
import SortIcon from '@mui/icons-material/Sort';

export default function AllProductsPage() {
  const { error: toastError } = useToast();

  const [status, setStatus] = useState('active');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paginationInfo, setPaginationInfo] = useState({ totalElements: 0, totalPages: 1, currentPage: 1, size: pageSize });

  // UI controls (chips)
  const [sortField, setSortField] = useState('title'); // title | price
  const [asc, setAsc] = useState(true);

  const fetchProducts = useCallback(async ({ pageArg = page, sizeArg = pageSize, statusArg = status, searchArg = debouncedSearch } = {}) => {
    try {
      const res = await getProducts({ page: pageArg, size: sizeArg, status: statusArg, search: searchArg });
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
      toastError(e?.message || 'Gagal memuat daftar produk');
    }
  }, [page, pageSize, status, debouncedSearch, toastError]);

  useEffect(() => {
    setStatus('active');
    fetchProducts({ pageArg: page, sizeArg: pageSize, statusArg: status, searchArg: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, status, debouncedSearch]);

  // Debounce pencarian agar tidak memanggil API di setiap ketikan
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const sortedItems = useMemo(() => {
    // Fallback filter di client-side jika backend tidak memfilter berdasarkan 'search'
    const filtered = debouncedSearch
      ? items.filter((it) =>
        (it.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (it.category || '').toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      : items;

    const copy = [...filtered];
    copy.sort((a, b) => {
      let vA = sortField === 'price' ? a.price : (a.title || '').toLowerCase();
      let vB = sortField === 'price' ? b.price : (b.title || '').toLowerCase();
      if (vA < vB) return asc ? -1 : 1;
      if (vA > vB) return asc ? 1 : -1;
      return 0;
    });
    return copy;
  }, [items, sortField, asc, debouncedSearch]);

  const pageCount = Math.max(1, Number(paginationInfo.totalPages || 1));
  const currentPage = Math.min(page, pageCount);

  return (
    <div className="products-page">
      <PageHeader />

      <main className="products-main">
        <div className="products-container">
          {/* Toolbar chips */}
          <div className="products-toolbar">
            <div className="chip__search">
              <SearchIcon className="chip__search-icon" />
              <InputField
                id='search'
                type="text"
                placeholder='Cari produk'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                fullWidth
                variant="outlined"
                transparentOutline
                transparentHover
                transparentFocus
                bgColor="transparent"
              />
            </div>
            <button
              className={`chip ${sortField === 'title' ? 'chip--active' : ''}`}
              onClick={() => setSortField('title')}
            >
              Nama Produk
              <span className="chip__caret">▾</span>
            </button>

            <button className="chip">
              Filter <span className="chip__badge">2</span>
            </button>

            <button
              className={`chip ${asc ? 'chip--active' : ''}`}
              onClick={() => setAsc((v) => !v)}
              title="Urutkan"
            >
              <SortIcon />

              {asc ? 'Asc' : 'Desc'}
            </button>
          </div>

          <div className="products-grid">
            {sortedItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            total={Number(paginationInfo.totalElements || 0)}
          />
        </div>
      </main>
    </div>
  );
}
