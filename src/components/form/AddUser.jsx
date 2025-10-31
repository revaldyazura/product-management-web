import React, { useMemo, useState } from 'react';
import InputField from './InputField';
import RolesMultiSelect from './RolesMultiSelect';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../../styles/components/form/AddProduct.css';

/**
 * AddUser form according to design
 * Props:
 * - onSubmit: (data) => void
 * - onCancel: () => void
 */
export default function AddUser({ onSubmit, onCancel, defaultValues, hidePassword = false, submitLabel = 'Tambah' }) {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    name: defaultValues?.name || '',
    phone: defaultValues?.phone || '',
    email: defaultValues?.email || '',
    password: '',
    status: defaultValues?.status ? defaultValues.status === 'active' : false,
    imageFile: null,
    imageUrl: defaultValues?.avatar || defaultValues?.imageUrl || '',
    roles: defaultValues?.roles?.length ? defaultValues.roles : ['user'],
  });

  const isValid = useMemo(() => {
    const base = form.name.trim() && /.+@.+\..+/.test(form.email.trim());
    if (hidePassword) return base; // edit mode tidak wajib password
    return base && form.password.trim();
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
    const register = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      status: form.status ? 'active' : 'inactive',
      roles: form.roles && form.roles.length ? form.roles : undefined,
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
              <InputField id="phone" label="No Telephone" fullWidth value={form.phone} onChange={handle('phone')} />
            </div>
          </div>
          <div className="usergrid__row">
            <div className="adminform__item adminform__item--full">
              <InputField id="email" label="Email*" fullWidth value={form.email} onChange={handle('email')} />
            </div>
          </div>

          {!hidePassword && (
            <div className="usergrid__row">
              <div className="adminform__item">
                <InputField id="password" label="Password*" type={showPw ? 'text' : 'password'} fullWidth value={form.password} onChange={handle('password')} InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPw((s) => !s)}
                        edge="end"
                      >
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}/>
              </div>
              <div className="adminform__item">
                <RolesMultiSelect
                  id="roles"
                  label="Roles"
                  value={form.roles}
                  options={["user", "admin"]}
                  onChange={(roles) => setForm((f) => ({ ...f, roles }))}
                />
              </div>
            </div>
          )}
          {hidePassword && (
            <div className="usergrid__row">
              <div className="adminform__item">
              <RolesMultiSelect
                id="roles"
                label="Roles"
                value={form.roles}
                options={["user", "admin"]}
                onChange={(roles) => setForm((f) => ({ ...f, roles }))}
              />
            </div>
            </div>
          )}

          <div className="statuspanel">
            <div>
              <div className="statuspanel__title">Status User</div>
              <div className="statuspanel__desc">Jika user telah lama tidak aktif anda bisa menonaktifkan status user secara manual</div>
            </div>
            <div className="statuspanel__control">
              {form?.status ? (
                <span className="statuspanel__label">Aktif</span>
              ) : (
                <span className="statuspanel__label">Nonaktif</span>
              )}
              <Switch checked={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="adminform__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Batal</button>
        <button type="submit" className="btn btn--primary" disabled={!isValid}>{submitLabel}</button>
      </div>
    </form>
  );
}
