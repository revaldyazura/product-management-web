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
 * - status: string | 'all'
 * - onStatusChange: (value) => void
 * - sort: 'asc' | 'desc'
 * - onToggleSort: () => void
 * - addLabel?: string
 * - onAdd?: () => void
 */
export default function DataToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort = 'asc',
  onToggleSort,
  addLabel,
  onAdd,
}) {
  return (
    <div className="admintb toolbar">
      <div className="admintb__left">
        <div className="admintb__search">
          <SearchIcon className="admintb__search-icon" />
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <div className="admintb__select">
          <FilterListIcon />
          <select value={status} onChange={(e) => onStatusChange?.(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      <div className="admintb__right">
        <button className="admintb__btn" onClick={onToggleSort} aria-label="sort">
          <SortIcon />
          <span>{sort === 'asc' ? 'Asc' : 'Desc'}</span>
        </button>
        {onAdd && (
          <button className="admintb__btn admintb__btn--primary" onClick={onAdd}>
            <AddIcon />
            <span>{addLabel || 'Tambah'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
