import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SectionManagement from "../../components/common/SectionManagement";
import DataToolbar from "../../components/common/DataToolbar";
import DataTable from "../../components/table/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/pagination/Pagination";
import Modal from "../../components/common/Modal";
import ResultModal from "../../components/common/ResultModal";
import AddUser from "../../components/form/AddUser";
import UserDetail from "../../components/user/UserDetail";
import ActionsMenu from "../../components/common/ActionsMenu";
import StatusModal from "../../components/common/StatusModal";
import ConfirmModal from '../../components/common/ConfirmModal';
import { deleteUser, getUsers, updateUser } from '../../services/userService';
import { registerUser, uploadAvatar } from "../../services/authService";
import defaultAvatar from "../../assets/default-avatar.svg";
import { useToast } from "../../context/ToastContext";
import { formatDateTime, withBaseUrl } from "../../utils/helper";

export default function ManagementUsers() {
  // Local UI state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("asc"); // asc | desc
  const [sortField, setSortField] = useState('created_at');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailEdit, setDetailEdit] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({ open: false, type: 'success', title: '', message: '' });

  const toggleSort = () => setSort((s) => (s === "asc" ? "desc" : "asc"));

  const [refreshKey, setRefreshKey] = useState(0);
  const { success: toastSuccess, error: toastError } = useToast();
  // Fetch users whenever filters/page changes
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getUsers({ page, size: pageSize, search, status });
        const data = res?.data || [];
        const info = res?.pagination_info || {};
        const mapped = data.map((u) => ({
          id: u.user_id,
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          created_at: u.created_at ? formatDateTime(u.created_at) : '',
          createdAtRaw: u.created_at || '',
          status: u.status,
          avatar: u.avatar_url ? withBaseUrl(u.avatar_url) : defaultAvatar,
          roles: u.roles || [],
        }));
        if (active) {
          setRows(mapped);
          const totalEl = Number(info.totalElements || mapped.length) || mapped.length;
          const totalPages = Number(info.totalPages || Math.ceil(totalEl / pageSize));
          setTotal(totalEl);
          // adjust page if needed
          if (page > totalPages && totalPages > 0) setPage(totalPages);
        }
      } catch (e) {
        if (active) {
          setError(e)
          toastError(e?.data?.detail || e?.message || 'Gagal memuat data pengguna');
        };
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [page, pageSize, search, status, refreshKey]);

  // pagination from server: use provided total; page slicing already server-side
  const pageCount = Math.max(1, Math.ceil((total || 0) / pageSize));
  const currentPage = Math.min(page, pageCount);
  // Sort rows by created_at (client-side) according to toolbar sort button
  const paged = useMemo(() => {
    const cloned = [...rows];
    const getComparable = (r) => {
      switch (sortField) {
        case 'created_at': {
          const t = r.createdAtRaw ? Date.parse(r.createdAtRaw) : NaN;
          return Number.isNaN(t) ? 0 : t;
        }
        case 'name':
          return String(r.name || '').toLowerCase();
        case 'email':
          return String(r.email || '').toLowerCase();
        case 'status':
          return String(r.status || '').toLowerCase();
        default:
          return '';
      }
    };
    cloned.sort((a, b) => {
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
    return cloned;
  }, [rows, sort, sortField]);

  const columns = [
    {
      key: "user",
      header: "Nama User",
      width: "40%",
      render: (row) => (
        <div className="usercell">
          <img className="usercell__avatar" src={row.avatar} alt={row.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultAvatar; }} />
          <div>
            <div className="usercell__name">{row.name}</div>
            <div className="usercell__email">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "No Telp", width: 160 },
    { key: "created_at", header: "Tanggal & Waktu Dibuat", width: 200 },
    {
      key: "status",
      header: "Status",
      width: 140,
      render: (row) => <StatusBadge status={row.status === "inactive" ? "inactive" : "active"} />,
    },
    {
      key: "action",
      header: "",
      width: 180,
      render: (row) => (
        <div className="actioncell">
          <button
            className="link--detail"
            onClick={() => {
              setDetailUser({
                name: row.name,
                email: row.email,
                phone: row.phone,
                roles: row.roles,
                status: row.status,
                avatar: row.avatar,
                createdAt: row.createdAtRaw || row.created_at,
              });
              setOpenDetail(true);
            }}
          >
            Lihat Detail
          </button>
          <ActionsMenu
            onEdit={() => {
              // buka modal detail dalam mode edit
              setDetailUser({
                id: row.id,
                name: row.name,
                email: row.email,
                roles: row.roles,
                status: row.status,
                avatar: row.avatar,
                createdAt: row.createdAtRaw || row.created_at,
              });
              setDetailEdit(true);
              setOpenDetail(true);
            }}
            onChangeStatus={() => {
              // buka status modal kecil
              setStatusTarget(row);
              setStatusModalOpen(true);
            }}
            onDelete={() => {
              // buka modal konfirmasi
              setConfirmTarget({ id: row.id });
              setConfirmOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  function refetch() { setRefreshKey((k) => k + 1); }

  return (
    <section>
      <PageHeader />
      <SectionManagement
        title="Management User"
        subtitle="Lihat semua produk yang tersedia di inventaris."
        addLabel="Tambah User"
        onAdd={() => setOpenAdd(true)}
      />

      <DataToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        sort={sort}
        onToggleSort={toggleSort}
        variant="user"
        sortLabel="Tanggal dibuat"
        searchPlaceholder="Cari user"
        sortField={sortField}
        onSortFieldChange={(v) => setSortField(v)}
        sortFieldOptions={[
          { value: 'created_at', label: 'Tanggal dibuat' },
          { value: 'name', label: 'Nama' },
          { value: 'email', label: 'Email' },
          { value: 'status', label: 'Status' },
        ]}
      />

      {/* {error && <div style={{ color: 'red', margin: '12px 0' }}>Gagal memuat data pengguna: {(error?.data?.detail || error?.message)}</div>} */}
      <DataTable columns={columns} data={paged} />

      <StatusModal
        open={statusModalOpen}
        onClose={() => { setStatusModalOpen(false); setStatusTarget(null); }}
        value={statusTarget?.status}
        onSave={async (newStatus) => {
          if (!statusTarget?.id) return;
          try {
            await updateUser(statusTarget.id, { status: newStatus });
            // update local rows state for the target user
            setRows((prev) => prev.map((r) => (r.id === statusTarget.id ? { ...r, status: newStatus } : r)));
            setResult({ open: true, type: 'success', title: 'Status Diubah', message: 'Status user berhasil diperbarui.' });
            toastSuccess('Status user berhasil diperbarui');
          } catch (e) {
            const st = e?.status;
            if (st === 404) {
              toastError('User tidak ditemukan.');
            } else if (st === 400) {
              toastError(e?.data?.detail || 'Tidak ada field yang diubah.');
            } else if (st === 500) {
              toastError('Terjadi kesalahan server. Silakan coba lagi.');
            } else {
              toastError(e?.message || 'Gagal memperbarui status user.');
            }
          }
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmTarget(null); }}
        title="Hapus User"
        message="Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dikembalikan."
        confirmLabel="Hapus"
        onConfirm={async () => {
          try {
            await deleteUser(confirmTarget?.id);
            // hapus dari list
            setRows((prev) => prev.filter((r) => r.id !== confirmTarget?.id));
            toastSuccess('User berhasil dihapus');
            setResult({ open: true, type: 'success', title: 'Berhasil', message: 'User berhasil dihapus.' });
          } catch (e) {
            const status = e?.status;
            if (status === 404) {
              toastError('User tidak ditemukan.');
            } else if (status === 400) {
              toastError('Permintaan tidak valid.');
            } else if (status === 500) {
              toastError('Terjadi kesalahan server. Silakan coba lagi.');
            } else {
              toastError(e?.message || 'Gagal menghapus user.');
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
        total={total}
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
              setResult({
                open: true,
                type: 'success',
                title: 'Berhasil Ditambah!',
                message: 'User baru berhasil disimpan dan sekarang muncul di daftar pengguna.',
              });
              toastSuccess('User baru berhasil didaftarkan');
              // refresh current filters
              setPage(1);
              refetch();
            } catch (e) {
              console.error(e);
              const msg = e?.data?.detail || e?.message || 'Gagal menambahkan user';
              setResult({
                open: true,
                type: 'error',
                title: 'Gagal Menambahkan',
                message: msg,
              });
              toastError(msg);
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

      {/* Detail user modal */}
      <UserDetail
        open={openDetail}
        onClose={() => { setOpenDetail(false); setDetailEdit(false); }}
        user={detailUser || {}}
        startInEdit={detailEdit}
        onSave={async ({ register, imageFile }) => {
          if (!detailUser?.id) return;
          try {
            // sanitize payload (avoid sending empty strings)
            const { name, email, phone, status, roles, password } = register || {};
            const updatePayload = {};
            if (name && name.trim()) updatePayload.name = name.trim();
            if (email && email.trim()) updatePayload.email = email.trim();
            if (typeof phone === 'string' && phone.trim()) updatePayload.phone = phone.trim();
            if (status) updatePayload.status = status;
            if (Array.isArray(roles) && roles.length) updatePayload.roles = roles;
            if (typeof password === 'string' && password.trim()) updatePayload.password = password.trim();

            await updateUser(detailUser.id, updatePayload);

            // optional avatar upload
            if (imageFile) {
              try {
                await uploadAvatar(detailUser.id, imageFile);
                // Paksa refresh gambar avatar di tabel (cache-busting param)
                const ts = Date.now();
                setRows((prev) => prev.map((r) => (
                  r.id === detailUser.id
                    ? { ...r, avatar: `${r.avatar}${String(r.avatar).includes('?') ? '&' : '?'}t=${ts}` }
                    : r
                )));
              } catch (e) {
                console.error('Upload avatar gagal', e);
              }
            }

            // update local state
            setRows((prev) => prev.map((r) => (
              r.id === detailUser.id
                ? {
                    ...r,
                    name: updatePayload.name ?? r.name,
                    email: updatePayload.email ?? r.email,
                    phone: updatePayload.phone ?? r.phone,
                    status: updatePayload.status ?? r.status,
                    roles: updatePayload.roles ?? r.roles,
                  }
                : r
            )));

            // refresh list to be safe
            refetch();

            toastSuccess('User berhasil diperbarui');
            setResult({ open: true, type: 'success', title: 'Perubahan Disimpan', message: 'Data user berhasil diperbarui.' });
            setDetailEdit(false);
            setOpenDetail(false); // tutup modal setelah berhasil simpan
          } catch (e) {
            const st = e?.status;
            if (st === 404) {
              toastError('User tidak ditemukan.');
            } else if (st === 400) {
              toastError(e?.data?.detail || 'Permintaan tidak valid.');
            } else if (st === 500) {
              toastError('Terjadi kesalahan server. Silakan coba lagi.');
            } else {
              toastError(e?.message || 'Gagal memperbarui user.');
            }
          }
        }}
      />
    </section>
  );
}
