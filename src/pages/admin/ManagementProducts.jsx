import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionManagement from "../../components/common/SectionManagement";
import DataToolbar from "../../components/common/DataToolbar";
import DataTable from "../../components/table/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/pagination/Pagination";
import Modal from "../../components/common/Modal";
import AddProduct from "../../components/form/AddProduct";

export default function ManagementProducts() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);

  const toggleSort = () => setSort((s) => (s === "asc" ? "desc" : "asc"));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = PRODUCTS_DATA.filter((p) => {
      const matchesQ = !q || p.title.toLowerCase().includes(q);
      const matchesStatus = status === "all" || p.status === status;
      return matchesQ && matchesStatus;
    });
    rows.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
    return rows;
  }, [search, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <div className="usercell__email">SKU: {row.sku}</div>
          </div>
        </div>
      ),
    },
    { key: "price", header: "Harga", width: 140, render: (r) => `Rp ${r.price.toLocaleString('id-ID')}` },
    { key: "created_at", header: "Tanggal Dibuat", width: 200 },
    { key: "status", header: "Status", width: 140, render: (r) => <StatusBadge status={r.status} /> },
    { key: "action", header: "", width: 160, render: () => (<button className="link--detail" onClick={() => alert('Detail produk')}>Lihat Detail</button>) },
  ];

  return (
    <section>
      <PageHeader />
      <SectionManagement title="Management Product" subtitle="Kelola daftar produk Anda." right={<></>} />

      <DataToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        sort={sort}
        onToggleSort={toggleSort}
        addLabel="Tambah Produk"
        onAdd={() => setOpenAdd(true)}
      />

      <DataTable columns={columns} data={paged} />

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        total={filtered.length}
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
          onSubmit={(data) => {
            console.log('submit product', data);
            setOpenAdd(false);
            alert('Produk baru disimpan (demo UI)');
          }}
        />
      </Modal>
    </section>
  );
}

const PRODUCTS_DATA = [
  { id: 1, title: 'Kursi Rotan', sku: 'KR-001', price: 1500000, created_at: '2024-12-25', status: 'active', image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=200' },
  { id: 2, title: 'Meja Makan Jati', sku: 'MJ-002', price: 4200000, created_at: '2024-12-25', status: 'active', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=200' },
  { id: 3, title: 'Sofa 3 Dudukan', sku: 'SF-003', price: 5000000, created_at: '2024-12-25', status: 'inactive', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=200' },
  { id: 4, title: 'Rak Dinding', sku: 'RD-004', price: 750000, created_at: '2024-12-25', status: 'active', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=200' },
];
