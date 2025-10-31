import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../common/Modal';
import DetailView from '../common/DetailView';
import StatusBadge from '../common/StatusBadge';
import { withBaseUrl } from '../../utils/helper';
import AddProduct from '../form/AddProduct';
import '../../styles/components/product/ProductDetail.css';

/**
 * ProductDetail
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - product: {
 *     id?: string|number,
 *     name?: string,
 *     category?: string,
 *     description?: string,
 *     price?: number,
 *     stock?: number,
 *     unit?: string,
 *     inactive?: boolean,
 *     status?: 'active' | 'inactive',
 *     image?: string
 *   }
 * - onEdit?: (product) => void
 * - onUpdateStock?: (product) => void
 */
export default function ProductDetail({ open, onClose, product = {}, onEdit, onUpdateStock, startInEdit = false, onSave }) {
  const [isEdit, setIsEdit] = useState(startInEdit);
  useEffect(() => {
    if (open) {
      setIsEdit(startInEdit);
    } else {
      // ketika modal ditutup (X/backdrop), reset mode edit
      setIsEdit(false);
    }
  }, [open, startInEdit]);
  const imgUrl = product?.image ? withBaseUrl(product.image) : undefined;
  const statusValue = typeof product?.inactive === 'boolean'
    ? (product.inactive ? 'inactive' : 'active')
    : (product?.status || 'inactive');

  const priceText = useMemo(() => {
    const val = Number(product?.price || 0);
    if (!val) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  }, [product?.price]);

  const fields = [
    { label: 'Nama Produk', value: product?.name },
    { label: 'Kategori Produk', value: product?.category },
    { label: 'Deskripsi Produk', value: product?.description },
    { label: 'Harga Satuan', value: priceText },
  ];

  const aside = (
    <div className="product-detail__aside">
      <div className="product-detail__aside-title">Stok Saat Ini</div>
      <div className="product-detail__aside-stock">
        {Number(product?.stock ?? 0)} {product?.unit || 'Unit'}
      </div>
      {onUpdateStock && (
        <button className="btn btn--ghost" onClick={() => onUpdateStock?.(product)}>Perbarui</button>
      )}
    </div>
  );

  const footer = !isEdit ? (
    <div className="product-detail__footer">
      <button className="btn" onClick={onClose}>Tutup</button>
      <button className="btn btn--primary" onClick={() => setIsEdit(true)}>Edit Produk</button>
    </div>
  ) : null;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Produk' : 'Detail Produk'} subtitle={isEdit ? 'Ubah data produk dan simpan perubahannya.' : 'Berikut adalah detail dari produk yang dipilih.'} footer={footer} width={920}>
      {!isEdit ? (
        <DetailView
          media={imgUrl}
          fields={fields}
          status={<StatusBadge status={product?.status} />}
          aside={aside}
        />
      ) : (
        <AddProduct
          defaultValues={{
            name: product?.name,
            price: product?.price,
            category: product?.category,
            stock: product?.stock,
            unit: product?.unit,
            status: product?.status,
            image: product?.image,
            description: product?.description,
            low_stock: product?.low_stock,
          }}
          submitLabel="Simpan"
          onCancel={() => setIsEdit(false)}
          onSubmit={(data) => { onSave?.(data); setIsEdit(false); }}
        />
      )}
    </Modal>
  );
}
