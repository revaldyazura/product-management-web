import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../common/Modal';
import DetailView from '../common/DetailView';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime, withBaseUrl } from '../../utils/helper';
import AddUser from '../form/AddUser';
import '../../styles/components/user/UserDetail.css';

/**
 * UserDetail
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - user: {
 *    id?: string|number,
 *    name?: string,
 *    username?: string,
 *    email?: string,
 *    roles?: string[],
 *    status?: 'active'|'inactive' | string,
 *    avatar?: string,
 *    createdAt?: string
 * }
 * - onEdit?: (user) => void
 */
export default function UserDetail({ open, onClose, user = {}, onEdit, startInEdit = false, onSave }) {
  const [isEdit, setIsEdit] = useState(startInEdit);
  useEffect(() => {
    if (open) {
      setIsEdit(startInEdit);
    } else {
      // ketika modal ditutup (X/backdrop), reset mode edit
      setIsEdit(false);
    }
  }, [open, startInEdit]);
  const imgUrl = user?.avatar ;
  const roles = (user?.roles || []).join(', ') || '-';
  const createdText = user?.createdAt
    ? (isNaN(new Date(user.createdAt).getTime()) ? user.createdAt : formatDateTime(user.createdAt))
    : '-';

  const fields = [
    { label: 'Nama User', value: user?.name },
    { label: 'No Telp', value: user?.phone },
    { label: 'Email', value: user?.email },
    { label: 'Roles', value: roles },
    { label: 'Dibuat Pada', value: createdText },
  ];

  const footer = !isEdit ? (
    <div className='footer' >
      <button className="btn" onClick={onClose}>Tutup</button>
      <button className="btn btn--primary" onClick={() => setIsEdit(true)}>Edit User</button>
    </div>
  ) : null;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit User' : 'Detail User'} subtitle={isEdit ? 'Ubah data user dan simpan perubahannya.' : 'Berikut adalah detail dari user yang dipilih.'} footer={footer} width={780}>
      {!isEdit ? (
        <DetailView
          media={imgUrl}
          fields={fields}
          status={<StatusBadge status={user?.status} />}
        />
      ) : (
        <AddUser
          defaultValues={{
            name: user?.name,
            phone: user?.phone,
            email: user?.email,
            status: user?.status,
            roles: user?.roles || [],
            avatar: user?.avatar,
          }}
          hidePassword
          submitLabel="Simpan"
          onCancel={() => setIsEdit(false)}
          onSubmit={(payload) => {
            onSave?.(payload);
            // setelah simpan, kembali ke tampilan detail (atau tutup modal sesuai kebutuhan)
            setIsEdit(false);
          }}
        />
      )}
    </Modal>
  );
}
