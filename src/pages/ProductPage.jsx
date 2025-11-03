import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { getProduct } from '../services/productService';
import '../styles/pages/ProductPage.css';
import defaultImage from "../assets/No_Image_Available.jpg";
import { withBaseUrl } from '../utils/helper';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    // try fetch product; if API not available, show a simple fallback
    getProduct(id)
      .then((res) => {
        if (!mounted) return;
        // apiClient in this project returns { data } or direct object depending on backend wrapper
        const data = res && res.data ? res.data : res;
        data.image_url = data.image_url ? withBaseUrl(data.image_url) : defaultImage;
        setProduct(data || null);
      })
      .catch((err) => {
        console.warn('Failed to fetch product', err);
        if (!mounted) return;
        setError('Produk tidak ditemukan.');
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  // When product changes, reset selected image and qty
  useEffect(() => {
    const img = product?.image || product?.image_url || defaultImage;
    setSelectedImage(img);
    setQty(1);
  }, [product]);

  const priceText = useMemo(() => {
    const val = Number(product?.unit_price || 0);
    if (!val) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  }, [product?.unit_price]);

  const rating = product?.rating ?? 4.5; // dummy when absent
  const soldCount = product?.sold ?? 30; // dummy when absent
  const discountLabel = '-12%'; // dummy
  const guaranteeWindow = 'Garansi Tiba: 4 - 6 September'; // dummy as per mock

  const maxQty = Math.max(0, Number(product?.stock ?? 0));
  const available = maxQty > 0;
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(Math.max(1, maxQty), q + 1));

  if (loading) return (
    <div className="page page--loading">
      <PageHeader />
      <main style={{ padding: 24 }}>Memuat...</main>
    </div>
  );

  if (error || !product) return (
    <div className="page">
      <PageHeader />
      <main style={{ padding: 24 }}>
        <div>{error || 'Produk tidak tersedia.'}</div>
        <Link to="/home" className="btn btn--link">Kembali ke Home</Link>
      </main>
    </div>
  );

  const imageUrl = selectedImage || product?.image || product?.image_url;

  return (
    <div className="page product-page">
      <PageHeader />

      <main className="product-page__main">
        <div className="product-page__container">
          {/* Top row: gallery + product info as flex siblings */}
          <div className="product-detail__grid">
            <section className="product-gallery">
              {imageUrl && (
                <img className="product-gallery__main" src={imageUrl} alt={product?.name || 'Produk'} />
              )}

              {/* Thumbnails — using available image duplicated if no gallery */}
              <div className="product-gallery__thumbs">
                {[product?.image_url || product?.image || defaultImage,
                  product?.image_url || product?.image || defaultImage,
                  product?.image_url || product?.image || defaultImage,
                  product?.image_url || product?.image || defaultImage,
                  product?.image_url || product?.image || defaultImage,
                ].map((img, idx) => (
                  <div
                    key={idx}
                    className={`product-gallery__thumb ${imageUrl === img ? 'product-gallery__thumb--active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                    role="button"
                    aria-label={`Thumbnail ${idx + 1}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </section>

            <div className="product-info">
              <div className="product-info__title">{product?.name || product?.title || 'Nama Produk'}</div>
              <div className="product-info__meta">
                <span className="star">★ {rating}</span>
                <span className="dot">•</span>
                <span>{soldCount} Terjual</span>
              </div>

              <div className="product-info__price">
                {priceText}
                <span className="badge-discount">{discountLabel}</span>
              </div>

              <div className="product-info__subtext" style={{ marginBottom: 6 }}>Pengiriman</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{guaranteeWindow}</div>
              <div className="product-info__subtext" style={{ marginBottom: 12 }}>Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat.</div>

              <div className="qty">
                <div style={{ fontSize: 14, color: '#6b7280' }}>Kuantitas</div>
                <div className="qty__control" aria-label="Kuantitas">
                  <button className="qty__btn" onClick={dec} disabled={!available}>−</button>
                  <div className="qty__value">{qty}</div>
                  <button className="qty__btn" onClick={inc} disabled={!available}>＋</button>
                </div>
                {available ? <span className="pill">Tersedia</span> : <span className="pill" style={{ background:'#fef2f2', color:'#ef4444', borderColor:'#fecaca' }}>Habis</span>}
              </div>

              <button className="btn-primary" disabled={!available}>Beli Produk</button>

              <div className="product-info__subtext" style={{ marginTop: 12 }}>
                Stok: {maxQty} {product?.unit || 'Unit'}
              </div>
            </div>
          </div>

          {/* Bottom: description spans full width */}
          <section className="product-desc">
            <div className="product-desc__header">Deskripsi Produk</div>
            <div className="product-desc__content">
              <p style={{ marginTop: 0 }}>{product?.description || 'Hadirkkan nuansa mewah dan elegan di ruang Anda dengan produk pilihan kami. Finishing halus memberikan sentuhan elegan sekaligus mudah dibersihkan.'}</p>
              <p style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                Kategori: <strong>{product?.category || 'Furnitur'}</strong>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
