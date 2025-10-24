import React, { useMemo, useState } from 'react';
import InputField from './InputField';
import CheckboxForm from './CheckboxForm';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import Switch from '@mui/material/Switch';
import '../../styles/components/form/AddProduct.css';

/**
 * AddUser form according to design
 * Props:
 * - onSubmit: (data) => void
 * - onCancel: () => void
 */
export default function AddUser({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    inactive: false, // false = aktif, true = nonaktif per label desain
    imageFile: null,
    imageUrl: '',
    roles: { user: true, admin: false },
  });

  const isValid = useMemo(() => {
    return (
      form.name.trim() &&
      form.phone.trim() &&
      /.+@.+\..+/.test(form.email.trim()) &&
      form.password.trim()
    );
  }, [form]);

  const handle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((f) => ({ ...f, imageFile: file, imageUrl: url }));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const selectedRoles = Object.entries(form.roles)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const register = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      status: form.inactive ? 'inactive' : 'active',
      roles: selectedRoles.length ? selectedRoles : undefined,
    };
    onSubmit?.({ register, imageFile: form.imageFile });
  };

  return (
    <form className="adminform adminform--user" onSubmit={submit}>
      <div className="usergrid">
        {/* Left: Image placeholder + upload */}
        <div className="usergrid__left">
          <div className="uploader__box">
            {form.imageUrl ? (
              <img className="uploader__preview" src={form.imageUrl} alt="preview" />
            ) : (
              <div className="uploader__placeholder">
                <ImageOutlinedIcon fontSize="large" />
              </div>
            )}
          </div>
          <label className="uploader__btn">
            <CloudUploadIcon />
            <span>Unggah Gambar</span>
            <input type="file" accept="image/*" onChange={handleUpload} hidden />
          </label>
        </div>

        {/* Right: Fields */}
        <div className="usergrid__right">
          <div className="usergrid__row">
            <div className="adminform__item">
              <InputField id="name" label="Nama User*" fullWidth value={form.name} onChange={handle('name')} />
            </div>
            <div className="adminform__item">
              <InputField id="phone" label="No Telephone*" fullWidth value={form.phone} onChange={handle('phone')} />
            </div>
          </div>
          <div className="usergrid__row">
            <div className="adminform__item adminform__item--full">
              <InputField id="email" label="Email*" fullWidth value={form.email} onChange={handle('email')} />
            </div>
          </div>

          <div className="usergrid__row">
            <div className="adminform__item">
              <InputField id="password" label="Password*" type="password" fullWidth value={form.password} onChange={handle('password')} />
            </div>
            <div className="adminform__item" style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Roles</div>
                <div>
                  <CheckboxForm
                    label="User"
                    checked={form.roles.user}
                    onChange={(e) => setForm((f) => ({ ...f, roles: { ...f.roles, user: e.target.checked } }))}
                  />
                  <CheckboxForm
                    label="Admin"
                    checked={form.roles.admin}
                    onChange={(e) => setForm((f) => ({ ...f, roles: { ...f.roles, admin: e.target.checked } }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="statuspanel">
            <div>
              <div className="statuspanel__title">Status User</div>
              <div className="statuspanel__desc">Jika user telah lama tidak aktif anda bisa menonaktifkan status user secara manual</div>
            </div>
            <div className="statuspanel__control">
              <span className="statuspanel__label">Nonaktif</span>
              <Switch checked={form.inactive} onChange={(e) => setForm((f) => ({ ...f, inactive: e.target.checked }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="adminform__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Batal</button>
        <button type="submit" className="btn btn--primary" disabled={!isValid}>Tambah</button>
      </div>
    </form>
  );
}
