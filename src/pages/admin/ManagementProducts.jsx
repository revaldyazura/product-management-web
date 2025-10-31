import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionManagement from "../../components/common/SectionManagement";
import DataToolbar from "../../components/common/DataToolbar";
import DataTable from "../../components/table/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/pagination/Pagination";
import Modal from "../../components/common/Modal";
import ResultModal from "../../components/common/ResultModal";
import ActionsMenu from "../../components/common/ActionsMenu";
import StatusModal from "../../components/common/StatusModal";
import ConfirmModal from '../../components/common/ConfirmModal';
import { deleteProduct, getProducts, addProduct, uploadProductImage, updateProduct } from '../../services/productService';
import AddProduct from "../../components/form/AddProduct";
import { useToast } from '../../context/ToastContext';
import ProductDetail from "../../components/product/ProductDetail";

export default function ManagementProducts() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState("asc");
  const [sortField, setSortField] = useState('title');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailEdit, setDetailEdit] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
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
        // FE-only visualization: menipis when stock equals low_stock (do not change BE status)
        status: Number(p.stock ?? 0) === Number(p.low_stock ?? -1) && Number(p.low_stock ?? -1) >= 0
          ? 'menipis'
          : (p.status || 'inactive'),
        image: p.image_url || 'https://via.placeholder.com/64?text=P',
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
    // Reset ke halaman pertama bila search/status/category berubah
    setPage(1);
  }, [search, status, category]);

  useEffect(() => {
    fetchProducts({ pageArg: page, sizeArg: pageSize, searchArg: search, statusArg: status });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, status]);

  const toggleSort = () => setSort((s) => (s === "asc" ? "desc" : "asc"));

  const categories = useMemo(() => {
    const set = new Set((items || []).map((it) => it.category).filter(Boolean));
    return Array.from(set);
  }, [items]);

  const filteredByCategory = useMemo(() => {
    const rows = Array.isArray(items) ? [...items] : [];
    return category === 'all' ? rows : rows.filter((r) => (r.category || '') === category);
  }, [items, category]);

  const sorted = useMemo(() => {
    const rows = [...filteredByCategory];
    const getComparable = (r) => {
      switch (sortField) {
        case 'price':
          return Number(r.price || 0);
        case 'stock':
          return Number(r.stock || 0);
        case 'created_at': {
          const t = r.created_at ? Date.parse(r.created_at) : NaN;
          return Number.isNaN(t) ? 0 : t;
        }
        case 'category':
          return String(r.category || '').toLowerCase();
        case 'title':
        default:
          return String(r.title || '').toLowerCase();
      }
    };
    rows.sort((a, b) => {
      const av = getComparable(a);
      const bv = getComparable(b);
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else {
        const as = String(av);
        const bs = String(bv);
        cmp = as < bs ? -1 : as > bs ? 1 : 0;
      }
      return sort === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [filteredByCategory, sort, sortField]);

  const pageCount = Math.max(1, Number(paginationInfo.totalPages || 1));
  const currentPage = Math.min(page, pageCount);
  const paged = sorted; // server-side paging already applied

  const columns = [
    {
      key: "product",
      header: "Nama Produk",
      width: "40%",
      render: (row) => (
        <div className="usercell">
          <img className="usercell__avatar" src={row.image} alt={row.title} />
          <div>
            <div className="usercell__name">{row.title}</div>
            {/* <div className="usercell__email">SKU: {row.sku}</div> */}
          </div>
        </div>
      ),
    },
  { key: "category", header: "Kategori", width: 160 },
  { key: "stock", header: "Stok", width: 100 },
  { key: "price", header: "Harga (Rp)", width: 160, render: (r) => `Rp ${r.price.toLocaleString('id-ID')}` },
    { key: "status", header: "Status", width: 140, render: (r) => <StatusBadge status={r.status} /> },
    { key: "action", header: "", width: 220, render: (row) => (
      <div className="actioncell">
        <button
          className="link--detail"
          onClick={() => {
            setDetailProduct({
              id: row.id,
              name: row.title,
              category: row.category || 'Lainnya',
              description: row.description,
              price: row.price,
              stock: row.stock,
              unit: row.unit || 'Unit',
              status: row.status,
              image: row.image,
              low_stock: row.low_stock,
            });
            setOpenDetail(true);
          }}
        >
          Lihat Detail
        </button>
        <ActionsMenu
          onEdit={() => {
            // buka modal detail dalam mode edit
            setDetailProduct({
              id: row.id,
              name: row.title,
              category: row.category || 'Lainnya',
              description: row.description,
              price: row.price,
              stock: row.stock,
              unit: row.unit || 'Unit',
              status: row.status,
              image: row.image,
              low_stock: row.low_stock,
            });
            setDetailEdit(true);
            setOpenDetail(true);
          }}
          onChangeStatus={() => {
            setStatusTarget({ id: row.id, status: row.status });
            setStatusModalOpen(true);
          }}
          onDelete={() => {
            setConfirmTarget({ id: row.id });
            setConfirmOpen(true);
          }}
        />
      </div>
    ) },
  ];

  return (
    <section>
      <PageHeader />
      <SectionManagement
        title="Daftar Produk"
        subtitle="Lihat semua produk yang tersedia di inventaris."
        right={(
          <button className="admintb__btn" onClick={() => setResult({ open: true, type: 'success', title: 'Info', message: 'Fitur Perbarui Stok akan segera tersedia.' })}>
            Perbarui Stok Produk
          </button>
        )}
        addLabel="Tambah Produk"
        onAdd={() => setOpenAdd(true)}
      />

      <DataToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        categories={categories}
        onCategoryChange={(v) => { setCategory(v); setPage(1); }}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        sort={sort}
        onToggleSort={toggleSort}
        variant="product"
        searchPlaceholder="Cari produk"
        sortLabel="Nama Produk"
        sortField={sortField}
        onSortFieldChange={(v) => setSortField(v)}
        sortFieldOptions={[
          { value: 'title', label: 'Nama Produk' },
          { value: 'category', label: 'Kategori' },
          { value: 'price', label: 'Harga' },
          { value: 'stock', label: 'Stok' },
          { value: 'created_at', label: 'Tanggal dibuat' },
        ]}
      />

  <DataTable columns={columns} data={paged} />

      <StatusModal
        open={statusModalOpen}
        onClose={() => { setStatusModalOpen(false); setStatusTarget(null); }}
        value={statusTarget?.status}
        onSave={async (newStatus) => {
          try {
            await updateProduct(statusTarget?.id, { status: newStatus });
            // Update current detail product if it matches
            if (statusTarget?.id && detailProduct?.id === statusTarget.id) {
              setDetailProduct((p) => ({ ...p, status: newStatus }));
            }
            // Refresh list
            await fetchProducts({ pageArg: currentPage, sizeArg: pageSize, searchArg: search, statusArg: status });
            setResult({ open: true, type: 'success', title: 'Status Diubah', message: 'Status produk berhasil diperbarui.' });
            toastSuccess('Status produk berhasil diperbarui');
          } catch (e) {
            const s = e?.status;
            let msg = e?.message || 'Gagal mengubah status produk.';
            if (s === 404) msg = 'Produk tidak ditemukan.';
            else if (s === 400) msg = 'Data tidak valid.';
            else if (s === 500) msg = 'Terjadi kesalahan server. Silakan coba lagi.';
            toastError(msg);
            setResult({ open: true, type: 'error', title: 'Gagal Mengubah Status', message: msg });
          }
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmTarget(null); }}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dikembalikan."
        confirmLabel="Hapus"
        onConfirm={async () => {
          try {
            await deleteProduct(confirmTarget?.id);
            // Setelah hapus, refetch halaman saat ini
            await fetchProducts({ pageArg: currentPage, sizeArg: pageSize, searchArg: search, statusArg: status });
            setResult({ open: true, type: 'success', title: 'Berhasil', message: 'Produk berhasil dihapus.' });
            toastSuccess('Produk berhasil dihapus');
          } catch (e) {
            const status = e?.status;
            if (status === 404) {
              toastError('Produk tidak ditemukan.');
            } else if (status === 400) {
              toastError('Permintaan tidak valid.');
            } else if (status === 500) {
              toastError('Terjadi kesalahan server. Silakan coba lagi.');
            } else {
              toastError(e?.message || 'Gagal menghapus produk.');
            }
          }
        }}
      />

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        total={Number(paginationInfo.totalElements || 0)}
      />

      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Tambah Produk"
        subtitle="Masukkan detail produk untuk menambahkannya ke inventaris."
        width={980}
      >
        <AddProduct
          onCancel={() => setOpenAdd(false)}
          onSubmit={async (data) => {
            // map form data to API schema
            const payload = {
              name: String(data.name || '').trim(),
              category: data.category || '',
              description: data.description || '',
              stock: Number(data.stock) || 0,
              unit_price: Number(data.price) || 0,
              low_stock: Number(data.low_stock || 0),
              // if file will be uploaded separately, avoid sending blob URL
              image_url: data.imageFile ? '' : (data.imageUrl || ''),
              status: data.status ? 'active' : 'inactive',
            };
            try {
              const res = await addProduct(payload);
              const created = res?.data;
              const newId = Array.isArray(created) && created[0] && (created[0].product_id || created[0].id);
              // Upload image if file picked and we have product id
              if (data.imageFile && newId) {
                try {
                  await uploadProductImage(newId, data.imageFile);
                } catch (imgErr) {
                  const s2 = imgErr?.status;
                  let msg2 = imgErr?.message || 'Unggah gambar produk gagal.';
                  if (s2 === 400) msg2 = 'Format gambar tidak valid.';
                  else if (s2 === 413) msg2 = 'Ukuran gambar terlalu besar.';
                  else if (s2 === 500) msg2 = 'Terjadi kesalahan server saat mengunggah gambar.';
                  // still continue, but notify
                  toastError(msg2);
                  setResult({ open: true, type: 'error', title: 'Gagal Unggah Gambar', message: msg2 });
                }
              }
              setOpenAdd(false);
              await fetchProducts({ pageArg: currentPage, sizeArg: pageSize, searchArg: search, statusArg: status });
              setResult({
                open: true,
                type: 'success',
                title: 'Berhasil Ditambah!',
                message: 'Produk baru berhasil disimpan dan sekarang muncul di daftar produk.',
              });
              toastSuccess('Produk berhasil ditambahkan');
            } catch (e) {
              const s = e?.status;
              let msg = e?.message || 'Gagal menambahkan produk.';
              if (s === 409) msg = 'Data produk konflik/duplikat.';
              else if (s === 400) msg = 'Data tidak valid. Periksa kembali input Anda.';
              else if (s === 500) msg = 'Terjadi kesalahan server. Silakan coba lagi.';
              toastError(msg);
              setResult({ open: true, type: 'error', title: 'Gagal Menambah', message: msg });
            }
          }}
        />
      </Modal>

      {/* Result modal after submit */}
      <ResultModal
        open={result.open}
        type={result.type}
        title={result.title}
        message={result.message}
        onClose={() => setResult((r) => ({ ...r, open: false }))}
      />

      {/* Detail produk modal */}
      <ProductDetail
        open={openDetail}
        onClose={() => { setOpenDetail(false); setDetailEdit(false); }}
        product={detailProduct || {}}
        startInEdit={detailEdit}
        onSave={async (data) => {
          const productId = detailProduct?.id;
          const payload = {
            name: String(data.name || '').trim(),
            category: data.category || '',
            unit_price: Number(data.price) || 0,
            description: data.description || '',
            low_stock: Number(data.low_stock || 0),
            status: data.status ? 'active' : 'inactive',
          };
          try {
            await updateProduct(productId, payload);
            // Upload image if changed
            if (data.imageFile && productId) {
              try {
                await uploadProductImage(productId, data.imageFile);
              } catch (imgErr) {
                const s2 = imgErr?.status;
                let msg2 = imgErr?.message || 'Unggah gambar produk gagal.';
                if (s2 === 400) msg2 = 'Format gambar tidak valid.';
                else if (s2 === 413) msg2 = 'Ukuran gambar terlalu besar.';
                else if (s2 === 500) msg2 = 'Terjadi kesalahan server saat mengunggah gambar.';
                toastError(msg2);
                setResult({ open: true, type: 'error', title: 'Gagal Unggah Gambar', message: msg2 });
              }
            }
            // Refresh list and detail view
            await fetchProducts({ pageArg: currentPage, sizeArg: pageSize, searchArg: search, statusArg: status });
            setDetailProduct((p) => ({
              ...(p || {}),
              name: payload.name,
              category: payload.category,
              description: payload.description,
              price: payload.unit_price,
              low_stock: payload.low_stock,
              status: payload.status,
              image: data.imageFile ? (p?.image || '') : (p?.image || ''),
            }));
            setResult({ open: true, type: 'success', title: 'Perubahan Disimpan', message: 'Data produk berhasil diperbarui.' });
            toastSuccess('Produk berhasil diperbarui');
            setDetailEdit(false);
          } catch (e) {
            const s = e?.status;
            let msg = e?.message || 'Gagal menyimpan perubahan produk.';
            if (s === 404) msg = 'Produk tidak ditemukan.';
            else if (s === 400) msg = 'Data tidak valid. Periksa kembali input Anda.';
            else if (s === 500) msg = 'Terjadi kesalahan server. Silakan coba lagi.';
            toastError(msg);
            setResult({ open: true, type: 'error', title: 'Gagal Menyimpan', message: msg });
          }
        }}
      />
    </section>
  );
}

// Data dummy dihapus, kini data berasal dari API
