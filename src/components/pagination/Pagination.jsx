import React from 'react';
import '../../styles/components/pagination/Pagination.css';

/**
 * Pagination - simple numbered pagination
 * Props:
 * - page: number (1-based)
 * - pageCount: number
 * - onPageChange: (page) => void
 * - pageSize: number
 * - onPageSizeChange: (size) => void
 * - total?: number
 */
export default function Pagination({
  page = 1,
  pageCount = 1,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  total,
}) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const prev = () => onPageChange?.(Math.max(1, page - 1));
  const next = () => onPageChange?.(Math.min(pageCount, page + 1));

  return (
    <div className="adminpg wrapper">
      <div className="adminpg__left">
        <span>
          Menampilkan
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        >
          {[10, 20, 50].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {typeof total === 'number' && (
          <span >Dari {total} Data</span>
        )}
      </div>

      <div className="adminpg__right">
        <button className="adminpg__nav" onClick={prev} disabled={page === 1}>
          ‹
        </button>
        {pages.slice(Math.max(0, page - 2), Math.max(0, page - 2) + 5).map((p) => (
          <button
            key={p}
            className={`adminpg__page ${p === page ? 'is-active' : ''}`}
            onClick={() => onPageChange?.(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="adminpg__nav"
          onClick={next}
          disabled={page === pageCount}
        >
          ›
        </button>
      </div>
    </div>
  );
}
