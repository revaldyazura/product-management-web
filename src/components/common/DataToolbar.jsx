import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/components/common/DataToolbar.css';

/**
 * DataToolbar - generic toolbar for list pages
 * Props:
 * - search: string
 * - onSearchChange: (value) => void
 * - category: string | 'all'
 * - categories?: string[] (options)
 * - onCategoryChange: (value) => void
 * - status: string | 'all'
 * - onStatusChange: (value) => void
 * - sort: 'asc' | 'desc'
 * - onToggleSort: () => void
 * - sortLabel?: string (default: 'Nama Produk')
 * - addLabel?: string
 * - onAdd?: () => void
 * - variant?: 'product' | 'user' | 'generic' (affects default placeholders)
 * - searchPlaceholder?: string (override search input placeholder)
 * - statusOptions?: Array<{ value: string; label: string } | string>
 * - sortField?: string
 * - sortFieldOptions?: Array<{ value: string; label: string } | string>
 * - onSortFieldChange?: (value) => void
 */
export default function DataToolbar({
  search,
  onSearchChange,
  category = 'all',
  categories = [],
  onCategoryChange,
  status,
  onStatusChange,
  sort = 'asc',
  onToggleSort,
  sortLabel,
  addLabel,
  onAdd,
  variant = 'generic',
  searchPlaceholder,
  statusOptions,
  sortField,
  sortFieldOptions,
  onSortFieldChange,
}) {
  // Derive sensible defaults based on variant
  const derivedSearchPlaceholder = searchPlaceholder
    || (variant === 'user' ? 'Cari user' : variant === 'product' ? 'Cari produk' : 'Cari data');
  const derivedSortLabel = sortLabel
    || (variant === 'user' ? 'Tanggal dibuat' : variant === 'product' ? 'Nama Produk' : 'Nama');

  const normalizedStatusOptions = (() => {
    // Allow passing simple array of strings or objects with value/label
    const fallback = [
      { value: 'all', label: 'Semua Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Nonaktif' },
    ];
    if (!statusOptions || !Array.isArray(statusOptions) || statusOptions.length === 0) return fallback;
    const normalize = (opt) =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt;
    // Ensure includes 'all' on top if not provided
    const hasAll = statusOptions.some((o) => (typeof o === 'string' ? o : o?.value) === 'all');
    const list = statusOptions.map(normalize);
    return hasAll ? list : [{ value: 'all', label: 'Semua Status' }, ...list];
  })();

  const labelMap = {
    title: 'Nama Produk',
    name: 'Nama',
    category: 'Kategori',
    price: 'Harga',
    stock: 'Stok',
    created_at: 'Tanggal dibuat',
    email: 'Email',
    status: 'Status',
  };

  const defaultSortFields = variant === 'user'
    ? ['created_at', 'name', 'email', 'status']
    : variant === 'product'
      ? ['title', 'category', 'price', 'stock', 'created_at']
      : ['name', 'created_at'];

  const normalizedSortFieldOptions = (() => {
    const source = (Array.isArray(sortFieldOptions) && sortFieldOptions.length > 0)
      ? sortFieldOptions
      : defaultSortFields;
    const normalize = (opt) => (typeof opt === 'string' ? { value: opt, label: labelMap[opt] || opt } : opt);
    const list = source.map(normalize);
    // ensure current sortField exists in options
    if (sortField && !list.some((o) => o.value === sortField)) {
      list.unshift({ value: sortField, label: labelMap[sortField] || sortField });
    }
    return list;
  })();

  const effectiveSortField = sortField || normalizedSortFieldOptions[0]?.value;

  return (
    <div className="admintb toolbar data-toolbar">
      <div className="admintb__search">
        <SearchIcon className="admintb__search-icon" />
        <input
          type="text"
          placeholder={derivedSearchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="admintb__controls">
        {Array.isArray(categories) && categories.length > 0 && (
          <div className="admintb__select">
            <FilterListIcon />
            <select value={category} onChange={(e) => onCategoryChange?.(e.target.value)}>
              <option value="all">Semua Kategori</option>
              {categories.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
        <div className="admintb__select">
          <FilterListIcon />
          <select value={status} onChange={(e) => onStatusChange?.(e.target.value)}>
            {normalizedStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="admintb__select" style={{ marginLeft: 8 }}>
          <SortIcon />
          <select value={effectiveSortField} onChange={(e) => onSortFieldChange?.(e.target.value)}>
            {normalizedSortFieldOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button className="admintb__btn" onClick={onToggleSort} aria-label="sort">
          <SortIcon />
          <span>{sort === 'asc' ? 'Asc' : 'Desc'}</span>
        </button>
        {/* {onAdd && (
            <button className="admintb__btn admintb__btn--primary" onClick={onAdd}>
              <AddIcon />
              <span>{addLabel || 'Tambah'}</span>
            </button>
          )} */}
      </div>
    </div>
  );
}
