import React, { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionManagement from "../../components/common/SectionManagement";
import DataToolbar from "../../components/common/DataToolbar";
import DataTable from "../../components/table/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/pagination/Pagination";
import Modal from "../../components/common/Modal";
import AddUser from "../../components/form/AddUser";
import { registerUser, uploadAvatar } from "../../services/authService";

export default function ManagementUsers() {
  // Local UI state (mocked list). Replace with API calls later.
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("asc"); // asc | desc by created_at
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);

  const toggleSort = () => setSort((s) => (s === "asc" ? "desc" : "asc"));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = USERS_DATA.filter((u) => {
      const matchesQ = !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q);
      const matchesStatus = status === "all" || u.status === status;
      return matchesQ && matchesStatus;
    });
    rows.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sort === "asc" ? da - db : db - da;
    });
    return rows;
  }, [search, status, sort]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      key: "user",
      header: "Nama User",
      width: "40%",
      render: (row) => (
        <div className="usercell">
          <img className="usercell__avatar" src={row.avatar} alt={row.name} />
          <div>
            <div className="usercell__name">{row.name}</div>
            <div className="usercell__email">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "No Telp", width: 160 },
    { key: "created_at", header: "Tanggal Dibuat", width: 200 },
    {
      key: "status",
      header: "Status",
      width: 140,
      render: (row) => <StatusBadge status={row.status === "inactive" ? "inactive" : "active"} />,
    },
    {
      key: "action",
      header: "",
      width: 160,
      render: () => (
        <button className="link--detail" onClick={() => alert("Detail user")}>Lihat Detail</button>
      ),
    },
  ];

  return (
    <section>
      <PageHeader />
      <SectionManagement
        title="Management User"
        subtitle="Lihat semua produk yang tersedia di inventaris."
        right={<></>}
      />

      <DataToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        sort={sort}
        onToggleSort={toggleSort}
        addLabel="Tambah User"
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
        title="Tambah User"
        subtitle="Masukkan detail user untuk menambahkannya ke management user"
        width={920}
      >
        <AddUser
          onCancel={() => setOpenAdd(false)}
          onSubmit={async ({ register, imageFile }) => {
            try {
              const res = await registerUser(register);
              const newUser = res?.data || res; // backend may wrap in { status, data }
              const userId = newUser?.user_id;

              if (userId && imageFile) {
                try {
                  await uploadAvatar(userId, imageFile);
                } catch (e) {
                  console.error('Upload avatar failed:', e);
                  // non-fatal, proceed
                }
              }

              setOpenAdd(false);
              alert('User baru berhasil didaftarkan');
              // TODO: refresh list from API when backend listing is ready
            } catch (e) {
              console.error(e);
              const msg = e?.data?.detail || e?.message || 'Gagal menambahkan user';
              alert(msg);
            }
          }}
        />
      </Modal>
    </section>
  );
}

// Mock data (replace with API response)
const USERS_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+61488827086",
    created_at: "2024-12-25",
    status: "active",
    avatar: "https://i.pravatar.cc/72?img=1",
  },
  {
    id: 2,
    name: "Teguh Prakoso",
    email: "john.doe@gmail.com",
    phone: "+61488856837",
    created_at: "2024-12-25",
    status: "inactive",
    avatar: "https://i.pravatar.cc/72?img=2",
  },
  {
    id: 3,
    name: "Nurul Azizah",
    email: "john.doe@gmail.com",
    phone: "+61488856756",
    created_at: "2024-12-25",
    status: "active",
    avatar: "https://i.pravatar.cc/72?img=3",
  },
  {
    id: 4,
    name: "Lutfi Hidayat",
    email: "john.doe@gmail.com",
    phone: "+61480026217",
    created_at: "2024-12-25",
    status: "active",
    avatar: "https://i.pravatar.cc/72?img=4",
  },
  {
    id: 5,
    name: "Rina Amalia",
    email: "john.doe@gmail.com",
    phone: "+61488827095",
    created_at: "2024-12-25",
    status: "active",
    avatar: "https://i.pravatar.cc/72?img=5",
  },
  {
    id: 6,
    name: "Vera Oktaviani",
    email: "john.doe@gmail.com",
    phone: "+61480025873",
    created_at: "2024-12-25",
    status: "active",
    avatar: "https://i.pravatar.cc/72?img=6",
  },
  {
    id: 7,
    name: "Budi Santoso",
    email: "john.doe@gmail.com",
    phone: "+61480025873",
    created_at: "2024-12-25",
    status: "inactive",
    avatar: "https://i.pravatar.cc/72?img=7",
  },
  {
    id: 8,
    name: "Alya Rahmi",
    email: "john.doe@gmail.com",
    phone: "+61480026121",
    created_at: "2024-12-25",
    status: "active",
    avatar: "https://i.pravatar.cc/72?img=8",
  },
  {
    id: 9,
    name: "Dewi Lestari",
    email: "john.doe@gmail.com",
    phone: "+61488827080",
    created_at: "2024-12-25",
    status: "active",
    avatar: "https://i.pravatar.cc/72?img=9",
  },
  {
    id: 10,
    name: "Cindy Oktavia",
    email: "john.doe@gmail.com",
    phone: "+61488859548",
    created_at: "2024-12-25",
    status: "active",
    avatar: "https://i.pravatar.cc/72?img=10",
  },
];
