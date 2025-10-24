import React, { useMemo, useState } from 'react';
import InputField from './InputField';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import '../../styles/components/form/AddProduct.css';

/**
 * AddProduct form
 * Props:
 * - onSubmit: (data) => void
 * - onCancel: () => void
 * - defaultValues?: partial
 */
export default function AddProduct({ onSubmit, onCancel, defaultValues }) {
  const [form, setForm] = useState({
    name: defaultValues?.name || '',
    price: defaultValues?.price || '',
    category: defaultValues?.category || '',
    stock: defaultValues?.stock || 0,
    unit: defaultValues?.unit || 'Unit',
    inactive: defaultValues?.inactive ?? false,
    imageFile: null,
    imageUrl: defaultValues?.image || '',
    description: defaultValues?.description || '',
  });

  const isValid = useMemo(() => {
    return form.name.trim() && form.category && Number(form.price) > 0;
  }, [form]);

  const handle = (key) => (e) => {
    const value = e?.target?.type === 'number' ? Number(e.target.value) : e?.target?.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
    };
    onSubmit?.(data);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((f) => ({ ...f, imageFile: file, imageUrl: url }));
    }
  };

  return (
    <form className="productform adminform--product" onSubmit={submit}>
      <div className="prodgrid">
        {/* Left: image uploader */}
        <div className="prodgrid__left">
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

        {/* Right: fields */}
        <div className="prodgrid__right">
          <div className="prodgrid__row">
            <div className="product__item">
              <InputField id="name" label="Nama Produk*" fullWidth value={form.name} onChange={handle('name')} />
            </div>
            <div className="product__item">
              <label className="product__label" htmlFor="category">Kategori Produk*</label>
              <select id="category" className="product__select" value={form.category} onChange={handle('category')}>
                <option value="">Pilih kategori</option>
                <option>Furniture</option>
                <option>Dekorasi</option>
                <option>Elektronik</option>
              </select>
            </div>
          </div>

          <div className="prodgrid__row">
            <div className="product__item product__item--full">
              <label className="product__label" htmlFor="desc">Deskripsi Produk</label>
              <textarea id="desc" className="product__textarea" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>

          <div className="prodgrid__row">
            <div className="product__item">
              <InputField
                id="price"
                label="Harga Satuan*"
                type="number"
                fullWidth
                value={form.price}
                onChange={handle('price')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                }}
              />
            </div>
            <div className="product__item">
              <div className="stockrow">
                <InputField id="stock" label="Stok Awal" type="number" fullWidth value={form.stock} onChange={handle('stock')} />
                <select className="stockrow__unit" value={form.unit} onChange={handle('unit')}>
                  <option>Unit</option>
                  <option>Pcs</option>
                  <option>Kg</option>
                </select>
              </div>
            </div>
          </div>

          <div className="statuspanel">
            <div>
              <div className="statuspanel__title">Status Produk</div>
              <div className="statuspanel__desc">Sistem akan menandai produk sebagai “Menipis” secara otomatis jika stoknya mendekati habis.</div>
            </div>
            <div className="statuspanel__control">
              <span className="statuspanel__label">Nonaktif</span>
              <Switch checked={form.inactive} onChange={(e) => setForm((f) => ({ ...f, inactive: e.target.checked }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="product__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Batal</button>
        <button type="submit" className="btn btn--primary" disabled={!isValid}>Tambah</button>
      </div>
    </form>
  );
}
