import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/product/ProductCard.css';

export default function ProductCard({ product }) {
  if (!product) return null;
  return (
    <Link to={`/product/${product.id}`} className="card card--link product-card">
      <img src={product.image} alt={product.title || product.name} className="card__img" />
      <div className="card__body">
        <h3 className="card__title">{product.title || product.name}</h3>
        <div className="card__price-row">
          <div className="card__price">Rp {(product.price || 0).toLocaleString('id-ID')}</div>
          {product.discount ? <span className="card__badge">-{product.discount}%</span> : <span className="card__badge">0%</span>}
        </div>
        <div className="card__meta">
          <span>⭐ {product.rating ?? '0'}</span>
          <span>{product.sold ? `${product.sold} Terjual` : '0 Terjual'}</span>
        </div>
      </div>
    </Link>
  );
}
